import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://127.0.0.1:5173/portfolio");

  // Expect a title "to contain" a substring.
  await expect(page.locator("body")).toContainText("Are you a bot?");
});

// test("get started link", async ({ page }) => {
//   await page.goto("https://playwright.dev/");

//   // Click the get started link.
//   await page.getByRole("link", { name: "Get started" }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(
//     page.getByRole("heading", { name: "Installation" })
//   ).toBeVisible();
// });

test("contains 'bot' string", async ({ page }) => {
  await page.goto("http://127.0.0.1:5173/portfolio");
  // Wait for any element containing 'bot' to appear
  const botElement = page.getByText("Vics new portfolio app 2", {
    exact: false,
  });
  await expect(botElement).toBeVisible();
});
