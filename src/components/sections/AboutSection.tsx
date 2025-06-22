import React from "react";
import { SectionRefs } from "../../types";
import { skills } from "../../data/skills";

interface AboutSectionProps {
  sectionsRef: React.MutableRefObject<SectionRefs>;
  visibleSections: Set<string>;
}

const AboutSection: React.FC<AboutSectionProps> = ({ sectionsRef, visibleSections }) => {
  return (
    <section
      id="about"
      ref={(el) => (sectionsRef.current.about = el)}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500/5 to-purple-500/5 relative z-10 px-6"
    >
      <div
        className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
          visibleSections.has("about")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-gray-400 text-lg mb-6 leading-relaxed">
            I'm a passionate full-stack developer with a love for creating
            beautiful, functional web applications. With expertise in modern
            technologies and a keen eye for design, I bring ideas to life
            through code.
          </p>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            When I'm not coding, you can find me exploring new technologies,
            contributing to open source projects, or sharing knowledge with
            the developer community.
          </p>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill: string) => (
              <span
                key={skill}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-sm font-semibold hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-2xl">
          <h3 className="text-2xl font-bold text-cyan-400 mb-6">
            Quick Facts
          </h3>
          <div className="space-y-4 text-gray-300">
            <p>
              <span className="font-semibold">Location:</span> Your City,
              Country
            </p>
            <p>
              <span className="font-semibold">Experience:</span> 3+ Years
            </p>
            <p>
              <span className="font-semibold">Focus:</span> Full Stack
              Development
            </p>
            <p>
              <span className="font-semibold">Passion:</span> Clean Code &
              User Experience
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;