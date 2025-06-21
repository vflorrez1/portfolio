"use client";

import { useEffect, useState, useRef } from "react";

// Interface for navigator with deviceMemory property
interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number;
}

// Interaction flags and screen info
interface InteractionFlags {
  mouse: boolean;
  key: boolean;
  scroll: boolean;
}

interface ScreenInfo {
  width: number;
  height: number;
  pixelRatio: number;
}

// Extended context for detection
export interface AdvancedDetectionContext {
  userAgent: string;
  language: string;
  platform: string;
  hardwareConcurrency: number;
  deviceMemory: number | "unknown";
  screen: ScreenInfo;
  plugins: string[];
  webdriver: boolean;
  doNotTrack: string | null;
  timezoneOffset: number;
  touchSupport: boolean;
  interactions: InteractionFlags;
  outerWindowWidth: number;
  outerWindowHeight: number;
  notificationPermission:
    | "granted"
    | "denied"
    | "prompt"
    | "pending"
    | "query_error"
    | "api_not_supported"
    | null;
  evaluationReasons: string[];
}

export interface UseAdvancedBotDetectionResult {
  isLikelyBot: boolean | null;
  context: AdvancedDetectionContext | null;
}

export default function useIsBot(delay = 5000): UseAdvancedBotDetectionResult {
  const [isLikelyBot, setIsLikelyBot] = useState<boolean | null>(null);
  const [context, setContext] = useState<AdvancedDetectionContext | null>(null);
  const detectionDataRef = useRef<Partial<AdvancedDetectionContext>>({});

  useEffect(() => {
    // Check if running in a browser environment
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      setIsLikelyBot(null); // Or true, depending on how you want to handle SSR/non-browser
      setContext(null);
      return;
    }

    const initialDetectionData: Omit<
      AdvancedDetectionContext,
      "evaluationReasons" | "notificationPermission"
    > & {
      notificationPermission: AdvancedDetectionContext["notificationPermission"];
    } = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      deviceMemory:
        (navigator as NavigatorWithDeviceMemory).deviceMemory || "unknown",
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        pixelRatio: window.devicePixelRatio,
      },
      plugins: navigator.plugins
        ? Array.from(navigator.plugins).map((p) => p.name)
        : [],
      webdriver: navigator.webdriver || false,
      doNotTrack: navigator.doNotTrack,
      timezoneOffset: new Date().getTimezoneOffset(),
      touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      interactions: {
        mouse: false,
        key: false,
        scroll: false,
      },
      outerWindowWidth: window.outerWidth,
      outerWindowHeight: window.outerHeight,
      notificationPermission: "pending",
    };

    detectionDataRef.current = initialDetectionData;

    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "notifications" })
        .then((status) => {
          if (detectionDataRef.current) {
            detectionDataRef.current.notificationPermission = status.state;
          }
        })
        .catch(() => {
          if (detectionDataRef.current) {
            detectionDataRef.current.notificationPermission = "query_error";
          }
        });
    } else {
      if (detectionDataRef.current) {
        detectionDataRef.current.notificationPermission = "api_not_supported";
      }
    }

    const mouseHandler = () => {
      if (detectionDataRef.current?.interactions)
        detectionDataRef.current.interactions.mouse = true;
    };
    const keyHandler = () => {
      if (detectionDataRef.current?.interactions)
        detectionDataRef.current.interactions.key = true;
    };
    const scrollHandler = () => {
      if (detectionDataRef.current?.interactions)
        detectionDataRef.current.interactions.scroll = true;
    };

    window.addEventListener("mousemove", mouseHandler, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", keyHandler, {
      once: true,
      passive: true,
    });
    window.addEventListener("scroll", scrollHandler, {
      once: true,
      passive: true,
    });

    const timer = setTimeout(() => {
      const currentData = detectionDataRef.current as AdvancedDetectionContext;
      const reasons: string[] = [];
      let determinedAsBot = false;

      // --- Search Engine Crawler Detection (Googlebot, Bingbot, etc.) ---
      // List of common search engine bot user agent patterns
      const crawlerPatterns: { pattern: RegExp; name: string }[] = [
        { pattern: /Googlebot/i, name: "Googlebot" },
        { pattern: /Bingbot/i, name: "Bingbot" },
        { pattern: /Slurp/i, name: "Yahoo! Slurp" },
        { pattern: /DuckDuckBot/i, name: "DuckDuckBot" },
        { pattern: /Baiduspider/i, name: "Baiduspider" },
        { pattern: /YandexBot/i, name: "YandexBot" },
        { pattern: /Sogou/i, name: "Sogou" },
        { pattern: /Exabot/i, name: "Exabot" },
        { pattern: /facebot/i, name: "Facebook Bot" },
        { pattern: /ia_archiver/i, name: "Alexa Crawler" },
      ];
      for (const { pattern, name } of crawlerPatterns) {
        if (pattern.test(currentData.userAgent)) {
          determinedAsBot = true;
          reasons.push(
            `User agent matches known search engine crawler: ${name}`
          );
          break;
        }
      }

      // --- Strong Signals for Headless Browsers (like Playwright) & Automation ---
      if (currentData.webdriver) {
        determinedAsBot = true;
        reasons.push(
          "navigator.webdriver is true (strong indicator of browser automation, e.g., Playwright, Selenium)"
        );
      }

      // Check User-Agent for common headless patterns if not already flagged by webdriver
      // Playwright often uses the underlying browser's headless UA, e.g., "HeadlessChrome"
      // Added Electron as it can be used for botting and might not always set webdriver.
      // Added PhantomJS for older headless browser detection.
      if (
        !determinedAsBot &&
        /HeadlessChrome|Firefox Headless|PhantomJS|Electron/i.test(
          currentData.userAgent
        )
      ) {
        determinedAsBot = true;
        reasons.push(
          `User agent contains a known headless browser or framework pattern: "${
            currentData.userAgent.match(
              /HeadlessChrome|Firefox Headless|PhantomJS|Electron/i
            )?.[0]
          }"`
        );
      }

      // Hardware concurrency being explicitly 0 can be a strong signal for certain virtualized/bot environments
      if (
        !determinedAsBot &&
        currentData.hardwareConcurrency === 0 &&
        typeof navigator.hardwareConcurrency !== "undefined"
      ) {
        determinedAsBot = true;
        reasons.push(
          "Hardware concurrency is reported as 0 (strong signal, common in some bot environments)"
        );
      }

      // --- Behavioral Signals (No Interaction) combined with Environmental Factors ---
      const noInteraction =
        !currentData.interactions.mouse &&
        !currentData.interactions.key &&
        !currentData.interactions.scroll;
      if (noInteraction) {
        // This reason is always added if no interaction, but might not be the sole cause for bot determination
        reasons.push(
          "No user interaction (mouse, key, scroll) detected within the delay period"
        );
      }

      if (!determinedAsBot && noInteraction) {
        const corroboratingFactors: string[] = [];
        if (currentData.screen.width === 0 || currentData.screen.height === 0) {
          corroboratingFactors.push("screen dimensions are zero");
        }
        if (
          currentData.outerWindowWidth === 0 ||
          currentData.outerWindowHeight === 0
        ) {
          corroboratingFactors.push("outer window dimensions are zero");
        }
        // Low hardware concurrency (e.g., 1) can be suspicious in combination with no interaction
        if (
          currentData.hardwareConcurrency < 2 &&
          typeof navigator.hardwareConcurrency !== "undefined"
        ) {
          corroboratingFactors.push(
            `hardware concurrency is low (${currentData.hardwareConcurrency})`
          );
        }
        if (currentData.notificationPermission === "denied") {
          corroboratingFactors.push(
            "notification permission is 'denied' without interaction"
          );
        }

        if (corroboratingFactors.length > 0) {
          determinedAsBot = true;
          // The "No user interaction" reason is already added. Now add the corroboration.
          reasons.push(
            `Lack of interaction corroborated by: ${corroboratingFactors.join(
              ", "
            )}`
          );
        }
        // Optional: If you want "noInteraction" alone to be a strong enough signal:
        // else if (noInteraction) { determinedAsBot = true; }
      }

      // --- Strong Environmental Signals (even with some interaction if other flags missed) ---
      if (!determinedAsBot) {
        if (
          (currentData.screen.width === 0 || currentData.screen.height === 0) &&
          (currentData.outerWindowWidth === 0 ||
            currentData.outerWindowHeight === 0)
        ) {
          determinedAsBot = true;
          reasons.push(
            "Both screen and outer window dimensions are reported as zero (strong environmental signal)"
          );
        }
      }

      currentData.evaluationReasons = reasons;
      setIsLikelyBot(determinedAsBot);
      setContext(currentData);
    }, delay);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", mouseHandler);
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [delay]);

  return { isLikelyBot, context };
}
