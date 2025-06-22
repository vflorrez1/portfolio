import React from "react";
import { SectionRefs, Project } from "../../types";
import { projects } from "../../data/projects";

interface ProjectsSectionProps {
  sectionsRef: React.MutableRefObject<SectionRefs>;
  visibleSections: Set<string>;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ sectionsRef, visibleSections }) => {
  return (
    <section
      id="projects"
      ref={(el) => (sectionsRef.current.projects = el)}
      className="min-h-screen flex items-center justify-center relative z-10 px-6"
    >
      <div
        className={`max-w-6xl mx-auto transition-all duration-1000 ${
          visibleSections.has("projects")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Featured Projects
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: Project, index: number) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:scale-105 hover:-translate-y-4 transition-all duration-500 shadow-2xl group"
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-4 group-hover:text-cyan-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a
                  href={project.demoLink}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-semibold hover:scale-105 transition-all duration-300"
                >
                  Live Demo
                </a>
                <a
                  href={project.githubLink}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-full text-sm font-semibold hover:bg-gray-600/20 hover:scale-105 transition-all duration-300"
                >
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;