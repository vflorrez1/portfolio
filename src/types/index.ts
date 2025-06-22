export interface FormData {
  name: string;
  email: string;
  message: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  demoLink: string;
  githubLink: string;
}

export interface SectionRefs {
  [key: string]: HTMLElement | null;
}