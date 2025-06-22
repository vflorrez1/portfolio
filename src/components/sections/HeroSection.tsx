import React from "react";

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToSection }) => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative z-10 px-6"
    >
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
          Your Name
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Full Stack Developer & Creative Problem Solver
        </p>
        <button
          onClick={() => scrollToSection("projects")}
          className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300"
        >
          View My Work
        </button>
      </div>
    </section>
  );
};

export default HeroSection;