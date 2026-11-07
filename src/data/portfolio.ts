import {
  Facebook,
  Github,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";

export const profile = {
  name: "Loren Dale Daluz",
  fullName: "Loren Dale Natabio Daluz",
  initials: "LD",
  role: "Aspiring Developer",
  location: "Cabanatuan City, Nueva Ecija",
  phone: "+63 9193994203",
  email: "lorendaledaluz@gmail.com",
  degree: "BS in Information Technology — Web Systems Technology, NEUST",
};

export const links = {
  email: "https://mail.google.com/mail/?view=cm&fs=1&to=lorendaledaluz@gmail.com",
  phone: "tel:+639193994203",
  github: "https://github.com/LorenDaleDaluz",
  facebook: "https://www.facebook.com/ldaluz19/",
};

export const summary =
  "Developing modern web experiences that are fast, accessible, and easy to scale. From polished interfaces to dependable systems, I focus on clarity, collaboration, and measurable outcomes for real users.";

export type Service = {
  title: string;
  description: string;
  points: string[];
};

export const services: Service[] = [
  {
    title: "Web Development",
    description: "Responsive sites and landing pages optimized for performance.",
    points: [
      "React + Vite front ends",
      "MySQL-backed web systems",
      "Maps, email and verification integrations",
    ],
  },
  {
    title: "App Development",
    description:
      "Mobile-first experiences and hybrid prototypes with consistent design systems.",
    points: [
      "Ionic + Angular hybrid apps",
      "Offline storage with SQLite",
      "Charts and dashboards with NgxCharts",
    ],
  },
  {
    title: "Web Design",
    description:
      "Wireframes, UI systems, and polished layouts aligned to brand goals.",
    points: [
      "Wireframes and user flows",
      "Tailwind CSS design systems",
      "Accessible, responsive layouts",
    ],
  },
];

export const features = [
  "Web Development",
  "App Development",
  "Web Design",
  "System Documentation",
  "Database Design",
  "Audio Editing & Production",
];

export const competencies = [
  "Software Development",
  "Project Management",
  "Software Documentation",
  "System Architecture",
  "Risk Assessment & QA",
  "Audio Editing & Production",
];

export const stackIconRows = [
  "https://skillicons.dev/icons?i=html,css,js,ts,php,python&perline=6",
  "https://skillicons.dev/icons?i=java,cpp,laravel,react,angular,tailwind&perline=6",
  "https://skillicons.dev/icons?i=bootstrap,mysql,nodejs,git,github,au&perline=6",
];

export const stackIconMap: Record<string, string[]> = {
  JavaScript: ["https://api.iconify.design/logos/javascript.svg"],
  "React + Vite": [
    "https://api.iconify.design/logos/react.svg",
    "https://api.iconify.design/logos/vitejs.svg",
  ],
  "Tailwind CSS": ["https://api.iconify.design/logos/tailwindcss-icon.svg"],
  MySQL: ["https://api.iconify.design/logos/mysql.svg"],
  Leaflet: ["https://api.iconify.design/logos/leaflet.svg"],
  "Google Maps API": ["https://api.iconify.design/logos/google-maps.svg"],
  "Face API": [
    "https://api.iconify.design/mdi/face-recognition.svg?color=%2360a5fa",
  ],
  reCAPTCHA: ["https://api.iconify.design/logos/recaptcha.svg"],
  Ionic: ["https://api.iconify.design/logos/ionic-icon.svg"],
  Angular: ["https://api.iconify.design/logos/angular-icon.svg"],
  SQLite: ["https://api.iconify.design/logos/sqlite.svg"],
  NgxCharts: ["https://api.iconify.design/logos/chartjs.svg"],
};

export type ProjectArtKind = "identify" | "finflow" | "spendz" | "baraha";

export type Project = {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  highlights: string[];
  stack: string[];
  link: string;
  linkLabel: string;
  download?: boolean;
  art: ProjectArtKind;
};

export const projects: Project[] = [
  {
    id: "identify",
    title: "IDentify",
    category: "Capstone · Web system",
    subtitle:
      "Web-based ID card issuance tracking and monitoring system with email notification",
    description:
      "Capstone system for NEUST that streamlines administrative workflows and delivers real-time status updates.",
    highlights: [
      "Automated email notifications",
      "Real-time status updates for 12,000+ users across two campuses",
    ],
    stack: [
      "JavaScript",
      "React + Vite",
      "Tailwind CSS",
      "MySQL",
      "Leaflet",
      "Google Maps API",
      "Face API",
      "reCAPTCHA",
    ],
    link: "https://neust-identify.app",
    linkLabel: "Visit project",
    art: "identify",
  },
  {
    id: "finflow",
    title: "FinFlow",
    category: "Mobile app",
    subtitle: "Mobile budgeting app",
    description:
      "A mobile budgeting application built with Ionic, Angular, SQLite, and NgxCharts.",
    highlights: [],
    stack: ["Ionic", "Angular", "SQLite", "NgxCharts"],
    link: "/app-debug.apk",
    linkLabel: "Download app",
    download: true,
    art: "finflow",
  },
  {
    id: "spendz",
    title: "Spendz",
    category: "Web app",
    subtitle: "Personal expense tracker",
    description:
      "A responsive web app for recording expenses, organizing spending, and keeping a clear view of your personal budget.",
    highlights: ["Track everyday expenses in one place"],
    stack: ["React + Vite", "Tailwind CSS"],
    link: "https://spendz-tracker.vercel.app",
    linkLabel: "Visit project",
    art: "spendz",
  },
  {
    id: "baraha",
    title: "Baraha",
    category: "Browser game",
    subtitle: "Browser card game",
    description:
      "A browser-based card game deployed on GitHub Pages for quick, play-anywhere access.",
    highlights: ["Playable online via GitHub Pages"],
    stack: ["JavaScript"],
    link: "https://lorendaledaluz.github.io/baraha/",
    linkLabel: "Play game",
    art: "baraha",
  },
];

export type Certification = {
  image: string;
  title: string;
  issuer: string;
  date: string;
};

export const certifications: Certification[] = [
  {
    image: "/Picture1.png",
    title: "4th International Training Summit & Research Conference on IT",
    issuer: "NEUST",
    date: "Nov 2025",
  },
  {
    image: "/Picture2.png",
    title: "Enterprise Cybersecurity Resilience",
    issuer: "ICpEP Qatar Chapter",
    date: "Sep 2025",
  },
  {
    image: "/Picture3.png",
    title: "Hour of Code Campaign",
    issuer: "AI Ready ASEAN",
    date: "Aug 2025",
  },
  {
    image: "/Picture4.png",
    title: "Fostering Educational Integrity in a Digital World",
    issuer: "Go Study",
    date: "Aug 2025",
  },
  {
    image: "/Picture5.png",
    title: "Introduction to IT Acquisition",
    issuer: "UP ITDC",
    date: "Sep 2025",
  },
  {
    image: "/Picture6.png",
    title: "AI for Good: Building a Sustainable Industrial Ecosystem",
    issuer: "UP ISC",
    date: "Sep 2025",
  },
  {
    image: "/Picture7.png",
    title: "Regional Assembly on IT Education (RAITE) 2025",
    issuer: "PSITE Central Luzon",
    date: "Oct 2025",
  },
  {
    image: "/Picture8.png",
    title: "Salient Points of the Cybersecurity Plan 2023–2028",
    issuer: "DICT",
    date: "Oct 2025",
  },
  {
    image: "/Picture9.png",
    title: "IT Specialist — HTML and CSS",
    issuer: "Certiport · Pearson",
    date: "Nov 2025",
  },
];

export type Education = {
  school: string;
  program: string;
  period: string;
  details: string[];
};

export const education: Education[] = [
  {
    school: "NEUST Sumacab Campus",
    program: "Bachelor of Science in Information Technology",
    period: "2022 — 2026",
    details: [
      "Specialized in Web Systems Technology",
      'Capstone: "IDentify" with automated email notifications.',
      "Graduated with Academic Distinction",
    ],
  },
  {
    school: "NEUST Laboratory High School",
    program: "Senior High School — ABM Strand",
    period: "2020 — 2022",
    details: ["Graduated with honors."],
  },
  {
    school: "NEUST Laboratory High School",
    program: "Junior High School",
    period: "2016 — 2020",
    details: ["Graduated with honors."],
  },
];

export const offKeyboard = [
  "Civil Service Exam - Professional (CSE) passer, 2026",
  "Audio production for PSITE Central Luzon 2025 and more",
  "IRCITE dance champion, 2023 and 2024",
  "Dance Supremacy International Philippines Qualifier, 2026 (1st-runner up)",
];

export type Social = { label: string; href: string; icon: LucideIcon };

export const socials: Social[] = [
  { label: "Facebook", href: links.facebook, icon: Facebook },
  { label: "GitHub", href: links.github, icon: Github },
  { label: "Email", href: links.email, icon: Mail },
];

export type ContactItem = {
  label: string;
  value: string;
  href?: string;
  icon: LucideIcon;
};

export const contactItems: ContactItem[] = [
  { label: "Email", value: profile.email, href: links.email, icon: Mail },
  { label: "Phone", value: profile.phone, href: links.phone, icon: Phone },
  { label: "Location", value: profile.location, icon: MapPin },
];
