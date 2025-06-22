import React from "react";
import { SectionRefs, FormData } from "../../types";

interface ContactSectionProps {
  sectionsRef: React.MutableRefObject<SectionRefs>;
  visibleSections: Set<string>;
  formData: FormData;
  isSubmitting: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: () => Promise<void>;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  sectionsRef,
  visibleSections,
  formData,
  isSubmitting,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <section
      id="contact"
      ref={(el) => (sectionsRef.current.contact = el)}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500/5 to-cyan-500/5 relative z-10 px-6"
    >
      <div
        className={`max-w-2xl mx-auto text-center transition-all duration-1000 ${
          visibleSections.has("contact")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Let's Work Together
        </h2>
        <p className="text-gray-400 text-lg mb-12 leading-relaxed">
          I'm always interested in new opportunities and exciting projects.
          Let's discuss how we can bring your ideas to life.
        </p>

        <div className="space-y-6">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all duration-300"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all duration-300"
            />
          </div>
          <div>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 transition-all duration-300 resize-none"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;