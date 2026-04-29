export interface Project {
  id: string;
  title: string;
  period: string;
  tools: string[];
  role: string;
  problem: string;
  analysis?: string;
  strategy: string;
  execution?: string;
  result: string;
  learnings: string;
  images: string[];
  overview?: string;
  detailedRole?: string;
  pdfUrl?: string;
  pdfLabel?: string;
  videoUrl?: string;
  reportUrl?: string;
  reportLabel?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  capabilities: string[];
}

export interface PortfolioData {
  profile: {
    name: string;
    mainTitle: string;
    subTitle: string;
    keywords: string[];
    aboutText: string;
    email: string;
    phone: string;
    profileImage?: string;
    footerHeadline?: string;
    footerSubtext?: string;
    links: {
      notion?: string;
      linkedin?: string;
      github?: string;
    };
    education: {
      school: string;
      major: string;
      status: string;
      period: string;
    }[];
    certifications: {
      name: string;
      date: string;
      grade: string;
    }[];
  };
  projects: Project[];
  skills: SkillCategory[];
  experiences: Experience[];
}
