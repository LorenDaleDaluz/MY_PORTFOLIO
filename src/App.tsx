import { useEffect, useState, type CSSProperties } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Code2,
  Database,
  Facebook,
  Github,
  Layout,
  Mail,
  Menu,
  MapPin,
  Moon,
  PenTool,
  Phone,
  Smartphone,
  Sun,
  X,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import StarsBackground from "./components/StarsBackground";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function App() {
  const [activeHref, setActiveHref] = useState("#top");
  const [activeCertImage, setActiveCertImage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const savedTheme = window.localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia?.("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  });
  const isDark = theme === "dark";

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const profile = {
    name: "Dale",
    role: "Web Developer",
    location: "Cabanatuan City, Nueva Ecija",
    phone: "+63 9193994203",
    email: "lorendaledaluz@gmail.com",
    degree:
      "BS in Information Technology (BSIT), Specialized in Web Systems Technology | NEUST",
  };

  const summary =
    "Developing modern web experiences that are fast, accessible, and easy to scale. From polished interfaces to dependable systems, I focus on clarity, collaboration, and measurable outcomes for real users.";

  const phoneLink = profile.phone.replace(/\s/g, "");
  const emailLink =
    "https://mail.google.com/mail/?view=cm&fs=1&to=lorendaledaluz@gmail.com";
  const container = "mx-auto w-[90vw] max-w-[1200px]";

  useEffect(() => {
    const sectionIds = navLinks
      .map((link) => link.href.replace("#", ""))
      .filter(Boolean);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          const nextId = visibleEntries[0].target.id;
          if (nextId) {
            setActiveHref(`#${nextId}`);
          }
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.2, 0.5, 0.8],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activeCertImage) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveCertImage(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeCertImage]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [isMobileMenuOpen]);

  const navItems = navLinks.map((link) => ({
    ...link,
    isActive: link.href === activeHref,
  }));

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const navActiveClass = isDark ? "text-white" : "text-slate-900";
  const navInactiveClass = isDark
    ? "text-slate-400 hover:text-white"
    : "text-slate-500 hover:text-slate-900";
  const navMobileActiveClass = isDark
    ? "border-white/15 bg-white/10 text-white"
    : "border-slate-300 bg-slate-100 text-slate-900";
  const navMobileInactiveClass = isDark
    ? "border-white/10 text-slate-300 hover:border-white/25 hover:bg-white/5 hover:text-white"
    : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900";
  const accentText = isDark ? "text-red-300" : "text-red-600";
  const accentLink = isDark
    ? "text-red-300 hover:text-red-200"
    : "text-red-600 hover:text-red-500";
  const panelSurface = isDark
    ? "border-white/10 bg-slate-900/70 shadow-lg"
    : "border-slate-200/80 bg-white/85 shadow-[0_20px_55px_rgba(148,163,184,0.16)]";
  const panelSurfaceStrong = isDark
    ? "border-white/10 bg-slate-900/80 shadow-lg"
    : "border-slate-200/80 bg-white shadow-[0_24px_60px_rgba(148,163,184,0.18)]";
  const panelSurfaceInteractive = isDark
    ? "border-white/10 bg-slate-900/70 shadow-lg hover:-translate-y-1 hover:border-white/25"
    : "border-slate-200/80 bg-white/85 shadow-[0_20px_55px_rgba(148,163,184,0.16)] hover:-translate-y-1 hover:border-slate-300";
  const nestedSurface = isDark
    ? "border-white/10 bg-slate-950/50"
    : "border-slate-200/70 bg-slate-50/95";
  const mediaSurface = isDark
    ? "border-white/10 bg-slate-950/60"
    : "border-slate-200/70 bg-slate-100/90";
  const iconSurface = isDark
    ? "bg-white/10 text-red-200"
    : "bg-red-50 text-red-600";
  const chipSurface = isDark
    ? "border-white/10 bg-white/5 text-slate-200"
    : "border-slate-200/80 bg-slate-100 text-slate-700";
  const insetSurface = isDark
    ? "border-white/10 bg-white/5"
    : "border-slate-200/80 bg-slate-50/95";
  const portraitSurface = isDark
    ? "border-white/15 bg-slate-900 shadow-[0_30px_80px_rgba(15,23,42,0.7)]"
    : "border-white/80 bg-white shadow-[0_30px_80px_rgba(148,163,184,0.28)]";
  const techBadgeSurface = isDark
    ? "border-red-400/30 bg-red-400/10 text-red-200"
    : "border-red-200 bg-red-50 text-red-700";
  const sectionBandFeature = isDark
    ? "bg-[radial-gradient(circle_at_18%_18%,rgba(30,41,59,0.36),transparent_28%),radial-gradient(circle_at_82%_78%,rgba(37,99,235,0.1),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.46),rgba(2,6,23,0.58))]"
    : "bg-[radial-gradient(circle_at_18%_18%,rgba(191,219,254,0.55),transparent_24%),radial-gradient(circle_at_82%_78%,rgba(254,215,170,0.4),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(241,245,249,0.98))]";
  const sectionBandPlain = isDark
    ? "bg-[linear-gradient(180deg,rgba(3,7,18,0.985),rgba(15,23,42,0.99))]"
    : "";
  const sectionDivider = isDark ? "bg-white/8" : "bg-slate-200/80";
  const lightPlainSectionStyle: CSSProperties | undefined = isDark
    ? undefined
    : {
        backgroundImage:
          "repeating-linear-gradient(to right, rgba(148,163,184,0.2) 0 1px, transparent 1px 96px), repeating-linear-gradient(to bottom, rgba(148,163,184,0.2) 0 1px, transparent 1px 96px), linear-gradient(180deg, rgba(255,255,255,0.998), rgba(250,252,255,1))",
      };
  const headerActionClass = `theme-keep-white inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
    isDark
      ? "border-white/10 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
      : "border-slate-200 bg-slate-900 text-white hover:border-slate-300 hover:bg-slate-800"
  }`;
  const headerIconButtonClass = `inline-flex h-10 w-10 items-center justify-center cursor-pointer rounded-full border transition ${
    isDark
      ? "border-white/10 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
  }`;
  const sectionAnchorOffset = "scroll-mt-20 md:scroll-mt-18";
  const stackIconMap: Record<string, { iconUrls: string[] }> = {
    JavaScript: {
      iconUrls: ["https://api.iconify.design/logos:javascript.svg"],
    },
    "React + Vite": {
      iconUrls: [
        "https://api.iconify.design/logos:react.svg",
        "https://api.iconify.design/logos:vitejs.svg",
      ],
    },
    "Tailwind CSS": {
      iconUrls: ["https://api.iconify.design/logos:tailwindcss-icon.svg"],
    },
    MySQL: {
      iconUrls: ["https://api.iconify.design/logos:mysql.svg"],
    },
    Leaflet: {
      iconUrls: ["https://api.iconify.design/logos:leaflet.svg"],
    },
    "Google Maps API": {
      iconUrls: ["https://api.iconify.design/logos:google-maps.svg"],
    },
    "Face API": {
      iconUrls: ["https://api.iconify.design/mdi/face-recognition.svg?color=%2360a5fa"],
    },
    reCAPTCHA: {
      iconUrls: ["https://api.iconify.design/logos:recaptcha.svg"],
    },
    Ionic: {
      iconUrls: ["https://api.iconify.design/logos:ionic-icon.svg"],
    },
    Angular: {
      iconUrls: ["https://api.iconify.design/logos:angular-icon.svg"],
    },
    SQLite: {
      iconUrls: ["https://api.iconify.design/logos:sqlite.svg"],
    },
    NgxCharts: {
      iconUrls: ["https://api.iconify.design/logos:chartjs.svg"],
    },
  };

  const services = [
    {
      title: "Web Application",
      description:
        "End-to-end web apps with clean UI, role-based access, and scalable architecture.",
      icon: Layout,
    },
    {
      title: "Web Development",
      description:
        "Responsive sites and landing pages optimized for performance and SEO.",
      icon: Code2,
    },
    {
      title: "App Development",
      description:
        "Mobile-first experiences and hybrid prototypes with consistent design systems.",
      icon: Smartphone,
    },
    {
      title: "Database Management",
      description:
        "Schema design, data integrity, and query performance for reliable systems.",
      icon: Database,
    },
    {
      title: "Data Analysis",
      description:
        "Dashboards and reporting that turn raw data into actionable insights.",
      icon: BarChart3,
    },
    {
      title: "Web Design",
      description:
        "Wireframes, UI systems, and polished layouts aligned to brand goals.",
      icon: PenTool,
    },
  ];

  const certifications = [
    { image: "/Picture1.png" },
    { image: "/Picture2.png" },
    { image: "/Picture3.png" },
    { image: "/Picture4.png" },
    { image: "/Picture5.png" },
    { image: "/Picture6.png" },
    { image: "/Picture7.png" },
    { image: "/Picture8.png" },
    { image: "/Picture9.png" },
  ];

  const projects = [
    {
      title: "IDentify",
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
    },
    {
      title: "FinFlow",
      subtitle: "Mobile budgeting app",
      description:
        "A mobile budgeting application built with Ionic, Angular, SQLite, and NgxCharts.",
      highlights: [],
      stack: ["Ionic", "Angular", "SQLite", "NgxCharts"],
      link: "/app-debug.apk",
      linkLabel: "Download app",
      linkDownload: true,
    },
  ];

  const education = [
    {
      school: "NEUST Sumacab Campus",
      program: "Bachelor of Science in Information Technology",
      period: "2022 - 2026",
      details: [
        "Specialized in Web Systems Technology",
        'Capstone: "IDentify" with automated email notifications.',
        "GWA (3rd Year): 1.27",
      ],
    },
    {
      school: "NEUST Laboratory High School",
      program: "Senior High School - ABM Strand",
      period: "2020 - 2022",
      details: ["Graduated with honors."],
    },
    {
      school: "NEUST Laboratory High School",
      program: "Junior High School",
      period: "2016 - 2020",
      details: ["Graduated with honors."],
    },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: "https://www.facebook.com/ldaluz19/",
      icon: Facebook,
    },
    {
      label: "GitHub",
      href: "https://github.com/LorenDaleDaluz",
      icon: Github,
    },
    {
      label: "Email",
      href: emailLink,
      icon: Mail,
    },
  ];

  const contactItems = [
    {
      label: "Email",
      value: profile.email,
      href: emailLink,
      icon: Mail,
    },
    {
      label: "Phone",
      value: profile.phone,
      href: `tel:${phoneLink}`,
      icon: Phone,
    },
    {
      label: "Location",
      value: profile.location,
      icon: MapPin,
    },
  ];

  const handleNavItemClick = (href: string) => {
    setActiveHref(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden font-body ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[radial-gradient(circle_at_20%_16%,rgba(255,255,255,0.07),transparent_26%),radial-gradient(circle_at_78%_18%,rgba(148,163,184,0.12),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(2,8,23,0.95))]"
              : "bg-[radial-gradient(circle_at_15%_18%,rgba(248,113,113,0.18),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(45,212,191,0.18),transparent_50%),radial-gradient(circle_at_20%_85%,rgba(59,130,246,0.14),transparent_55%)]"
          }`}
        />
        {isDark ? (
          <div className="absolute inset-0 opacity-95" aria-hidden="true">
            <StarsBackground />
          </div>
        ) : null}
      </div>

      <header
        className={`app-header border-b shadow-[0_14px_34px_rgba(15,23,42,0.12)] ${
          isDark
            ? "border-white/15 bg-slate-950"
            : "border-slate-200/90 bg-white"
        }`}
      >
        <div className={`${container} py-4`}>
          <div className="flex items-center justify-between gap-4 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8">
            <a
              className="inline-flex min-w-0 items-center gap-3"
              href="#top"
              onClick={() => handleNavItemClick("#top")}
              aria-label="Go back to the top of the page"
            >
              <span className="theme-keep-white grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-red-500 to-red-900 font-display text-lg font-semibold text-white shadow-lg">
                LD
              </span>
              <div className="min-w-0">
                <p className={`m-0 truncate font-semibold tracking-widest ${textPrimary}`}>
                  {profile.name}
                </p>
                <p className={`mt-1 truncate text-sm ${textMuted}`}>
                  {profile.role} | System Developer | App Developer
                </p>
              </div>
            </a>

            <nav
              className="hidden md:flex md:flex-wrap md:justify-center md:gap-4 md:text-sm md:font-medium md:text-slate-400"
              aria-label="Primary"
            >
              {navItems.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavItemClick(link.href)}
                  className={`transition ${
                    link.isActive ? navActiveClass : navInactiveClass
                  }`}
                  aria-current={link.isActive ? "page" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 md:flex">
                <a className={headerActionClass} href="#contact">
                  Let&#39;s talk
                </a>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={
                    isDark ? "Switch to light mode" : "Switch to dark mode"
                  }
                  className={headerIconButtonClass}
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-controls="mobile-navigation"
                aria-expanded={isMobileMenuOpen}
                className={`md:hidden ${headerIconButtonClass}`}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div
            id="mobile-navigation"
            aria-hidden={!isMobileMenuOpen}
            className={`overflow-hidden transition-all duration-300 md:hidden ${
              isMobileMenuOpen
                ? "visible mt-4 max-h-[28rem] opacity-100"
                : "invisible max-h-0 opacity-0"
            }`}
          >
            <div className={`rounded-3xl border p-4 ${panelSurfaceStrong}`}>
              <nav className="flex flex-col gap-3" aria-label="Mobile primary">
                {navItems.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavItemClick(link.href)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      link.isActive ? navMobileActiveClass : navMobileInactiveClass
                    }`}
                    aria-current={link.isActive ? "page" : undefined}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex items-center gap-3">
                <a className={`min-w-0 flex-1 ${headerActionClass}`} href="#contact" onClick={() => handleNavItemClick("#contact")}>
                  Let&#39;s talk
                </a>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={
                    isDark ? "Switch to light mode" : "Switch to dark mode"
                  }
                  className={headerIconButtonClass}
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        <main className="relative z-0 pt-32">
        <section className={`pb-20 pt-12 ${sectionAnchorOffset}`} id="top">
          <div
            className={`${container} grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]`}
          >
            <div className="space-y-6" data-aos="fade-right">
              <h1
                className={`text-4xl font-semibold sm:text-5xl ${textPrimary}`}
              >
                Loren Dale <br></br>
                <div className="pt-5">Daluz</div>
              </h1>
              <p className={`text-base sm:text-lg ${textSecondary}`}>
                {summary}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  className="theme-keep-white inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:from-red-400 hover:to-red-400"
                  href="#contact"
                >
                  Get in touch
                </a>
                <a
                  className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition ${
                    isDark
                      ? "border-white/15 text-white hover:border-white/40 hover:bg-white/5"
                      : "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-100"
                  }`}
                  href="#projects"
                >
                  View projects
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
                        isDark
                          ? "border-white/10 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                      aria-label={link.label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      className={`rounded-2xl border p-4 text-sm ${
                        isDark
                          ? "border-white/10 bg-white/5 text-slate-200"
                          : "border-slate-200 bg-white text-slate-700"
                      }`}
                      key={item.label}
                    >
                      <div
                        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${textMuted}`}
                      >
                        <Icon className={`h-4 w-4 ${accentText}`} />
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          className={`mt-2 block text-sm font-semibold ${textPrimary}`}
                          href={item.href}
                          target={
                            item.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            item.href.startsWith("http")
                              ? "noreferrer"
                              : undefined
                          }
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span
                          className={`mt-2 block text-sm font-semibold ${textPrimary}`}
                        >
                          {item.value}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="relative flex items-center justify-center"
              data-aos="fade-left"
            >
              <div className="absolute h-72 w-72 rounded-full bg-gradient-to-br from-red-500/40 via-red-500/30 to-cyan-400/20 blur-3xl" />
              <div
                className={`relative h-80 w-80 overflow-hidden rounded-full border ${portraitSurface}`}
              >
                <img
                  className="h-full w-full object-cover"
                  src="/myImage.png"
                  alt={`${profile.name} portrait`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          className={`relative isolate z-0 overflow-hidden py-24 ${sectionAnchorOffset}`}
          id="about"
        >
          <div
            className={`pointer-events-none absolute inset-0 z-0 ${sectionBandPlain}`}
            style={lightPlainSectionStyle}
            aria-hidden="true"
          />
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 z-[2] h-px ${sectionDivider}`}
            aria-hidden="true"
          />
          <div className={`${container} relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]`}>
            <div
              className={`rounded-3xl border p-8 ${panelSurface}`}
              data-aos="fade-up"
            >
              <span
                className={`text-xs font-semibold uppercase tracking-[0.28em] ${accentText}`}
              >
                About
              </span>
              <h2
                className={`mt-3 text-2xl font-semibold sm:text-3xl ${textPrimary}`}
              >
                What I build? Reliable, modern web experiences.
              </h2>
              <p className={`mt-4 text-sm sm:text-base ${textSecondary}`}>
                {summary}
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex justify-center">
                  <span
                    className={`inline-flex rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] ${techBadgeSurface}`}
                  >
                    Tech Stack
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <img
                    className="h-10 w-auto max-w-full sm:h-12"
                    src="https://skillicons.dev/icons?i=html,css,js,ts,php,python&perline=6"
                    alt="Tech stack icons row 1"
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    className="h-10 w-auto max-w-full sm:h-12"
                    src="https://skillicons.dev/icons?i=java,cpp,laravel,react,angular,tailwind&perline=6"
                    alt="Tech stack icons row 2"
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    className="h-10 w-auto max-w-full sm:h-12"
                    src="https://skillicons.dev/icons?i=bootstrap,mysql,nodejs,git,github,au&perline=6"
                    alt="Tech stack icons row 3"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
            <div
              className={`rounded-3xl border p-8 ${panelSurface}`}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <span
                className={`text-xs font-semibold uppercase tracking-[0.28em] ${accentText}`}
              >
                Education
              </span>
              <div className="mt-5 space-y-4">
                {education.map((item) => (
                  <div
                    className={`rounded-2xl border p-4 ${nestedSurface}`}
                    key={`${item.school}-${item.period}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className={`text-sm font-semibold ${textPrimary}`}>
                          {item.school}
                        </h3>
                        <p className={`text-xs ${textMuted}`}>{item.program}</p>
                      </div>
                      <span className={`text-xs font-semibold ${accentText}`}>
                        {item.period}
                      </span>
                    </div>
                    <ul
                      className={`mt-3 list-disc space-y-1 pl-5 text-xs ${textSecondary}`}
                    >
                      {item.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`py-24 ${sectionAnchorOffset}`} id="services">
          <div className={container}>
            <div className="mb-8 space-y-3" data-aos="fade-up">
              <span
                className={`text-xs font-semibold uppercase tracking-[0.28em] ${accentText}`}
              >
                Services
              </span>
              <h2 className={`text-2xl font-semibold sm:text-3xl ${textPrimary}`}>
                Reliable solutions for modern web needs.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <article
                    className={`rounded-3xl border p-6 transition ${panelSurfaceInteractive}`}
                    key={service.title}
                    data-aos="fade-up"
                    data-aos-delay={`${index * 80}`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconSurface}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className={`mt-4 text-lg font-semibold ${textPrimary}`}>
                      {service.title}
                    </h3>
                    <p className={`mt-3 text-sm ${textSecondary}`}>
                      {service.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className={`relative isolate z-0 overflow-hidden py-24 ${sectionAnchorOffset}`}
          id="certifications"
        >
          <div
            className={`pointer-events-none absolute inset-0 z-0 ${sectionBandPlain}`}
            style={lightPlainSectionStyle}
            aria-hidden="true"
          />
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 z-[2] h-px ${sectionDivider}`}
            aria-hidden="true"
          />
          <div className={`${container} relative z-10`}>
            <div className="mb-8 space-y-3" data-aos="fade-up">
              <span
                className={`text-xs font-semibold uppercase tracking-[0.28em] ${accentText}`}
              >
                Certifications
              </span>
              <h2 className={`text-2xl font-semibold sm:text-3xl ${textPrimary}`}>
                Credentials and completed training.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((certification, index) => (
                <article
                  className={`rounded-3xl border p-4 shadow-lg transition ${panelSurfaceInteractive}`}
                  data-aos="fade-up"
                  data-aos-delay={`${index * 80}`}
                  key={certification.image}
                >
                  <button
                    type="button"
                    className={`group aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl border ${mediaSurface}`}
                    onClick={() => setActiveCertImage(certification.image)}
                    aria-label={`View certification ${index + 1}`}
                  >
                    <img
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      src={certification.image}
                      alt={`Certification ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                  <p className="mt-3 text-sm font-semibold text-slate-200"></p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`relative isolate z-0 overflow-hidden pb-24 pt-24 ${sectionAnchorOffset}`}
          id="projects"
        >
          <div
            className={`pointer-events-none absolute inset-0 z-0 ${sectionBandFeature}`}
            aria-hidden="true"
          />
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 z-[2] h-px ${sectionDivider}`}
            aria-hidden="true"
          />
          <div className={`${container} relative z-10`}>
            <div className="mb-12 space-y-3 text-center" data-aos="fade-up">
              <span
                className={`text-xs font-semibold uppercase tracking-[0.28em] ${accentText}`}
              >
                Projects
              </span>
              <h2 className={`text-2xl font-semibold sm:text-3xl ${textPrimary}`}>
                Selected work built for real needs.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project, index) => (
                <article
                  className={`flex h-full flex-col gap-4 rounded-3xl border p-6 ${panelSurface}`}
                  key={project.title}
                  data-aos="fade-up"
                  data-aos-delay={`${index * 100}`}
                >
                  <div>
                    <h3 className={`text-lg font-semibold ${textPrimary}`}>
                      {project.title}
                    </h3>
                    <p className={`mt-1 text-sm ${textMuted}`}>
                      {project.subtitle}
                    </p>
                  </div>
                  <p className={`text-sm ${textSecondary}`}>
                    {project.description}
                  </p>
                  {project.highlights.length > 0 ? (
                    <ul className={`list-disc space-y-2 pl-5 text-sm ${textSecondary}`}>
                      {project.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tag) => {
                      const stackIcon = stackIconMap[tag];
                      const iconUrls = stackIcon?.iconUrls ?? [];

                      return (
                        <span
                          className={`inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full border px-2.5 ${chipSurface}`}
                          key={tag}
                          title={tag}
                          aria-label={tag}
                        >
                          {iconUrls.length > 0 ? (
                            iconUrls.map((iconUrl, iconIndex) => (
                              <img
                                key={`${tag}-${iconIndex}`}
                                className="h-5 w-5 rounded-sm object-contain"
                                src={iconUrl}
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                decoding="async"
                                onError={(event) => {
                                  const currentTarget = event.currentTarget;

                                  if (
                                    currentTarget.dataset.fallbackApplied ===
                                    "true"
                                  ) {
                                    currentTarget.style.display = "none";
                                    return;
                                  }

                                  currentTarget.dataset.fallbackApplied = "true";
                                  currentTarget.src =
                                    "https://api.iconify.design/mdi/code-tags.svg?color=%2364758b";
                                }}
                              />
                            ))
                          ) : null}
                          <span className="sr-only">{tag}</span>
                        </span>
                      );
                    })}
                  </div>
                  {project.link ? (
                    <a
                      className={`mt-auto inline-flex items-center gap-2 text-sm font-semibold transition ${accentLink}`}
                      href={project.link}
                      target={
                        project.linkDownload
                          ? undefined
                          : project.link?.startsWith("http")
                            ? "_blank"
                            : undefined
                      }
                      rel={
                        project.linkDownload
                          ? undefined
                          : project.link?.startsWith("http")
                            ? "noreferrer"
                            : undefined
                      }
                      download={project.linkDownload ? true : undefined}
                    >
                      {project.linkLabel ?? "Visit project"}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`relative isolate z-0 overflow-hidden pb-24 pt-24 ${sectionAnchorOffset}`}
          id="contact"
        >
          <div
            className={`pointer-events-none absolute inset-0 z-0 ${sectionBandPlain}`}
            style={lightPlainSectionStyle}
            aria-hidden="true"
          />
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 z-[2] h-px ${sectionDivider}`}
            aria-hidden="true"
          />
          <div className={`${container} relative z-10`}>
            <div
              className={`grid gap-6 rounded-[28px] border p-8 md:grid-cols-[1.1fr_0.9fr] ${panelSurfaceStrong}`}
              data-aos="fade-up"
            >
              <div className="space-y-4">
                <span
                  className={`text-xs font-semibold uppercase tracking-[0.28em] ${accentText}`}
                >
                  Contact
                </span>
                <h2 className={`text-2xl font-semibold sm:text-3xl ${textPrimary}`}>
                  Let&#39;s build something reliable together.
                </h2>
                <p className={`text-sm ${textSecondary}`}>
                  Open to web development roles, freelance work, and
                  collaborative projects focused on modern web experiences.
                </p>
              </div>
              <div className="grid gap-4">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      className={`rounded-2xl border p-4 text-sm ${insetSurface}`}
                      key={item.label}
                    >
                      <div
                        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${textMuted}`}
                      >
                        <Icon className={`h-4 w-4 ${accentText}`} />
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          className={`mt-2 block text-sm font-semibold ${textPrimary}`}
                          href={item.href}
                          target={
                            item.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            item.href.startsWith("http")
                              ? "noreferrer"
                              : undefined
                          }
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span
                          className={`mt-2 block text-sm font-semibold ${textPrimary}`}
                        >
                          {item.value}
                        </span>
                      )}
                    </div>
                  );
                })}
                <div className="flex flex-wrap gap-3 pt-2">
                  {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${isDark ? "border-white/10 bg-white/5 text-white hover:border-white/30 hover:bg-white/10" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100"}`}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
        </main>

        {activeCertImage ? (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Certification preview"
            onClick={() => setActiveCertImage(null)}
          >
            <div
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                className="h-full w-full rounded-2xl border border-white/20 bg-slate-900 object-contain shadow-2xl"
                src={activeCertImage}
                alt="Certification preview"
              />
              <button
                type="button"
                className="theme-keep-white absolute right-3 top-3 rounded-full border border-white/30 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-900"
                onClick={() => setActiveCertImage(null)}
              >
                Close
              </button>
            </div>
          </div>
        ) : null}

        <footer className={`pb-10 pt-8 text-sm ${textMuted}`}>
          <div
            className={`${container} flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center`}
          >
            <p>(c) 2026 Loren Dale Natabio Daluz. All rights reserved.</p>
            <a
              className={`text-sm font-semibold transition ${accentLink}`}
              href="#top"
            >
              Back to top
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
