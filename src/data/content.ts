/**
 * Single source of truth for all portfolio content.
 * To update the site, edit this file only — components render from it.
 *
 * Projects: set `link` to a real URL when available. While it is `null`,
 * the card shows a non-interactive "Link coming soon" label (no fake buttons).
 */

export const profile = {
  name: "Annash",
  surname: "Ragil Putra Supartono",
  fullName: "Annash Ragil Putra Supartono",
  tagline: "Turning mathematical thinking into meaningful digital solutions.",
  role: "Mathematics Undergraduate | Aspiring Data Scientist | Machine Learning Enthusiast",
  email: "annashragil@gmail.com",
  linkedin:
    "https://www.linkedin.com/in/annash-ragil-putra-supartono-353804282/",
  location: "Surabaya, East Java, Indonesia",
  cv: "/Annash-Ragil-Putra-Supartono-CV.pdf",
};

export const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Awards" },
  { id: "contact", label: "Contact" },
] as const;

export const about = {
  heading: ["BEYOND THE", "NUMBERS."],
  paragraphs: [
    "I am a Mathematics undergraduate student at Institut Teknologi Sepuluh Nopember (ITS), Indonesia. My academic background has shaped the way I approach problems: through analytical thinking, mathematical reasoning, and structured problem-solving.",
    "I am particularly interested in Data Science, Machine Learning, and programming. I enjoy exploring how mathematical concepts can be transformed into practical computational solutions, from predictive modeling to data-driven decision-making.",
    "Beyond academics, I have developed my experience through professional internships, teaching assistance, organizational activities, and collaborative projects.",
  ],
  facets: [
    {
      key: "academic",
      label: "Academic Background",
      body: "Bachelor of Mathematics at ITS (2023 – 2027, expected), with a strong footing in Calculus, Basic Statistics, and Programming Algorithms.",
    },
    {
      key: "research",
      label: "Research Interests",
      body: "Predictive modeling, statistical analysis, and how mathematical structure can make data-driven decisions more reliable.",
    },
    {
      key: "technical",
      label: "Technical Interests",
      body: "Data Science, Machine Learning, Predictive Analytics, Database Management, and Data Visualization — built primarily in Python.",
    },
    {
      key: "philosophy",
      label: "Working Philosophy",
      body: "Start from the structure of the problem, reason carefully, then turn the idea into something that runs and can be checked.",
    },
  ],
};

export interface ExperienceItem {
  id: string;
  org: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  extra: string;
  tags: string[];
}

export const experiences: ExperienceItem[] = [
  {
    id: "bank-jatim",
    org: "PT Bank Jatim Tbk.",
    role: "Practical Work · Credit Risk Analysis Division",
    period: "Dec 2025 – Feb 2026",
    location: "Surabaya, Indonesia",
    summary: "Credit risk analytics and a Random Forest default-prediction model.",
    highlights: [
      "Developed a dashboard to analyze credit trends across various economic sectors.",
      "Collected, managed, and analyzed corporate credit application data.",
      "Built a Random Forest credit risk prediction model using approximately 500,000 customer records.",
    ],
    extra:
      "The corporate credit application data covered loan values exceeding IDR 1 billion. The model was implemented in Python to identify potential defaults.",
    tags: ["Python", "Random Forest", "Dashboard", "Credit Risk"],
  },
  {
    id: "its-ta",
    org: "Institut Teknologi Sepuluh Nopember (ITS)",
    role: "Teaching Assistant · Calculus I & II",
    period: "Aug 2024 – Present",
    location: "Surabaya, Indonesia",
    summary: "Teaching and assessment support for Calculus I & II.",
    highlights: [
      "Assisted in teaching more than 500 students.",
      "Managed academic data using Excel and spreadsheets.",
      "Evaluated student performance and supported examination activities.",
    ],
    extra:
      "Students came from diverse academic backgrounds. Responsibilities included grading and proctoring examinations to uphold academic integrity.",
    tags: ["Calculus", "Teaching", "Spreadsheets"],
  },
  {
    id: "omits",
    org: "Olimpiade Matematika ITS 2024",
    role: "Staff Question Maker",
    period: "Jul 2024 – Nov 2024",
    location: "Surabaya, Indonesia",
    summary: "Competition problem design with LaTeX and participant data analysis.",
    highlights: [
      "Designed mathematics competition problems from preliminary rounds to the grand final.",
      "Prepared and formatted mathematical materials using LaTeX.",
      "Evaluated submissions and analyzed participant data from 121 students in the Kediri region.",
    ],
    extra:
      "Problems were written for the elementary level of the 17th OMITS. Response data was organized and analyzed in spreadsheets.",
    tags: ["LaTeX", "Problem Design", "Data Analysis"],
  },
  {
    id: "gerigi",
    org: "GERIGI ITS 2024",
    role: "Staff of Secretarial",
    period: "2024",
    location: "Surabaya, Indonesia",
    summary: "Student database and administration for new-student orientation.",
    highlights: [
      "Designed and maintained student databases.",
      "Managed administrative documentation.",
      "Mentored new ITS students.",
    ],
    extra:
      "The database of new ITS students for 2024 supported program coordination across the GERIGI ITS program.",
    tags: ["Databases", "Administration", "Mentoring"],
  },
  {
    id: "nirwasita",
    org: "Aksi Nirwasita 5.0 FSAD 2024",
    role: "Staff Data Center",
    period: "2024",
    location: "Surabaya, Indonesia",
    summary: "Data center operations for the faculty orientation program.",
    highlights: [
      "Maintained student databases.",
      "Supported administrative and data management activities.",
      "Assisted new students throughout the program.",
    ],
    extra:
      "Supported program coordination for the 2024 intake through structured data management and guidance for new students.",
    tags: ["Databases", "Data Management", "Mentoring"],
  },
];

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  /** Real URL when available, otherwise null (renders a "coming soon" label). */
  link: string | null;
  linkLabel: string;
  visual: "forest" | "scatter" | "latex" | "stats";
}

export const projects: ProjectItem[] = [
  {
    id: "credit-risk",
    index: "01",
    title: "Credit Risk Prediction – Random Forest",
    category: "Machine Learning · Finance",
    description:
      "A machine learning project developed during my practical work at Bank Jatim, analyzing approximately 500,000 customer records to identify potential credit defaults.",
    tags: ["Python", "Random Forest", "Predictive Modeling"],
    link: null,
    linkLabel: "Case study",
    visual: "forest",
  },
  {
    id: "ds-ml",
    index: "02",
    title: "Data Science & Machine Learning",
    category: "Experiments · Modeling",
    description:
      "Machine learning experiments, predictive modeling, classification, and analytical projects exploring how mathematical ideas become working models.",
    tags: ["Classification", "Predictive Analytics", "Python"],
    link: null,
    linkLabel: "Repository",
    visual: "scatter",
  },
  {
    id: "latex-docs",
    index: "03",
    title: "Mathematical Documentation with LaTeX",
    category: "Education · Documentation",
    description:
      "A collection of structured mathematical solutions and educational documentation for Calculus I and II, written to support student understanding at ITS.",
    tags: ["LaTeX", "Calculus I & II", "Education"],
    link: null,
    linkLabel: "Documents",
    visual: "latex",
  },
  {
    id: "prog-analysis",
    index: "04",
    title: "Programming & Data Analysis",
    category: "Software · Statistics",
    description:
      "Python, Java, statistical computing, and data processing projects built to turn raw data into clear, usable insight.",
    tags: ["Python", "Java", "Statistical Computing"],
    link: null,
    linkLabel: "Repository",
    visual: "stats",
  },
];

export const education = [
  {
    id: "its",
    school: "Institut Teknologi Sepuluh Nopember (ITS)",
    degree: "Bachelor of Mathematics",
    period: "July 2023 – August 2027 (Expected)",
    location: "Surabaya, Indonesia",
    note: "Calculus · Basic Statistics · Programming Algorithms",
  },
  {
    id: "sma22",
    school: "SMA Negeri 22 Surabaya",
    degree: "Mathematics and Natural Sciences (MIPA)",
    period: "June 2019 – May 2022",
    location: "Surabaya, Indonesia",
    note: "Senior High School",
  },
];

export const skillGroups = [
  {
    id: "programming",
    label: "Programming",
    caption: "Languages I build with",
    items: ["Python", "Java", "LaTeX"],
  },
  {
    id: "interests",
    label: "Technical Interests",
    caption: "Where I am heading",
    items: [
      "Data Science",
      "Machine Learning",
      "Predictive Analytics",
      "Statistical Analysis",
      "Database Management",
      "Data Visualization",
    ],
  },
  {
    id: "academic",
    label: "Academic Strengths",
    caption: "The foundation",
    items: [
      "Calculus",
      "Basic Statistics",
      "Programming Algorithms",
      "Mathematical Problem Solving",
    ],
  },
];

export const achievements = [
  {
    id: "pacmann",
    year: "2024",
    title: "Certified in Python for Data Science",
    issuer: "Pacmann Academy",
    type: "Certification",
  },
  {
    id: "prakerja",
    year: "2023",
    title: "Basic Python Certification",
    issuer: "Prakerja Program",
    type: "Certification",
  },
  {
    id: "pelangi",
    year: "2024",
    title: "Semifinalist · Pelangi Matematika XXX",
    issuer: "Universitas Negeri Jakarta",
    type: "Competition",
  },
  {
    id: "calculus-cup",
    year: "2024",
    title: "Semifinalist · Calculus Cup",
    issuer: "HIMATIKA ITS",
    type: "Competition",
  },
  {
    id: "pkm",
    year: "2024",
    title: "Participant · Liga PKM ITS 2024",
    issuer: "Institut Teknologi Sepuluh Nopember",
    type: "Competition",
  },
];

export const contact = {
  heading: ["LET'S BUILD", "SOMETHING", "MEANINGFUL."],
  text: "Interested in collaborating, discussing research, or exploring opportunities in data and technology? I'd love to hear from you.",
};
