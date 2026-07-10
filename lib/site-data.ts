export const site = {
  name: "Stephen Lajuwomi",
  title: "Software Developer",
  employer: "Directors Investment Group",
  employerUrl: "https://digfamily.co/",
  email: "stephenlajuwomi@gmail.com",
  repositoryUrl: "https://github.com/slajuwomi/slajuwomi.dev",
  social: {
    github: "https://github.com/slajuwomi",
    linkedin: "https://www.linkedin.com/in/stephenlajuwomi/",
    twitter: "https://x.com/stephenlearns",
  },
} as const;

export const education = {
  school: "Hardin-Simmons University",
  schoolUrl: "https://www.hsutx.edu/",
  degree: "BS in Computer Science",
  year: "2025",
  logo: "/assets/logos/hsu-logo.png",
} as const;

export const currentRole = {
  role: "Software Developer",
  company: "Directors Investment Group",
  companyUrl: "https://digfamily.co/",
  logo: "/assets/logos/dig-logo.png",
} as const;

export const previousRoles = [
  {
    role: "Software and Data Management Analyst",
    company: "GGV International LLC",
    dates: "Jun 2025 - Sep 2025",
  },
  {
    role: "Web Design Intern",
    company: "IKIDI Inc",
    dates: "Jul 2022 - Dec 2022",
  },
] as const;

export type Project = {
  slug: string;
  name: string;
  description: string;
  tags: readonly string[];
  demoUrl: string | null;
  githubUrl: string;
  image: string | null;
  imageAlt: string;
};

export const projects: readonly Project[] = [
  {
    slug: "cowboy-cards",
    name: "Cowboy Cards",
    description:
      "A flashcard platform for language teachers, built as a 15-person senior capstone project.",
    tags: ["Ionic React", "TypeScript", "Capstone"],
    demoUrl: "https://cowboy-cards.onrender.com",
    githubUrl: "https://github.com/HSU-Senior-Project-2025/Cowboy_Cards",
    image: "/assets/projects/cowboy-cards-screenshot.png",
    imageAlt: "Cowboy Cards project screenshot",
  },
  {
    slug: "books4sale",
    name: "Books4Sale",
    description: "A CRUD web app for browsing and listing used books.",
    tags: ["React", "JavaScript", "CRUD"],
    demoUrl: null,
    githubUrl: "https://github.com/slajuwomi/Books4Sale",
    image: "/assets/projects/books4sale-screenshot.png",
    imageAlt: "Books4Sale project screenshot",
  },
  {
    slug: "drake-lyrics-generator",
    name: "Drake Lyrics Generator",
    description: "A small GPT-2 model trained to generate lyrics.",
    tags: ["Python", "GPT-2", "NLP"],
    demoUrl: null,
    githubUrl: "https://github.com/slajuwomi/drake-lyrics-generator",
    image: "/assets/projects/drake-lyrics-generator-screenshot.png",
    imageAlt: "Drake Lyrics Generator project screenshot",
  },
] as const;
