import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  BarChart3,
  Code2,
  Database,
  Facebook,
  Github,
  Layout,
  Mail,
  MapPin,
  PenTool,
  Phone,
  Smartphone,
} from 'lucide-react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const navLinks = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

function App() {
  const [activeHref, setActiveHref] = useState('#top')

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' })
  }, [])

  const profile = {
    name: 'Dale',
    role: 'Web Developer',
    location: 'Cabanatuan City, Nueva Ecija',
    phone: '+63 9193994203',
    email: 'lorendaledaluz@gmail.com',
    degree:
      'BS in Information Technology (BSIT), Specialized in Web Systems Technology | NEUST',
  }

  const summary =
    'I design and build modern web experiences that are fast, accessible, and easy to scale. From polished interfaces to dependable systems, I focus on clarity, collaboration, and measurable outcomes for real users.'

  const phoneLink = profile.phone.replace(/\s/g, '')
  const emailLink =
    'https://mail.google.com/mail/?view=cm&fs=1&to=lorendaledaluz@gmail.com'
  const container = 'mx-auto w-[90vw] max-w-[1200px]'

  useEffect(() => {
    const sectionIds = navLinks
      .map((link) => link.href.replace('#', ''))
      .filter(Boolean)
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    if (sections.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries.length > 0) {
          const nextId = visibleEntries[0].target.id
          if (nextId) {
            setActiveHref(`#${nextId}`)
          }
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.2, 0.5, 0.8],
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const navItems = navLinks.map((link) => ({
    ...link,
    isActive: link.href === activeHref,
  }))

  

  const services = [
    {
      title: 'Web Application',
      description:
        'End-to-end web apps with clean UI, role-based access, and scalable architecture.',
      icon: Layout,
    },
    {
      title: 'Web Development',
      description:
        'Responsive sites and landing pages optimized for performance and SEO.',
      icon: Code2,
    },
    {
      title: 'App Development',
      description:
        'Mobile-first experiences and hybrid prototypes with consistent design systems.',
      icon: Smartphone,
    },
    {
      title: 'Database Management',
      description:
        'Schema design, data integrity, and query performance for reliable systems.',
      icon: Database,
    },
    {
      title: 'Data Analysis',
      description:
        'Dashboards and reporting that turn raw data into actionable insights.',
      icon: BarChart3,
    },
    {
      title: 'Web Design',
      description:
        'Wireframes, UI systems, and polished layouts aligned to brand goals.',
      icon: PenTool,
    },
  ]

  const frontEndStack = [
    {
      name: 'JavaScript',
      icon: 'https://skillicons.dev/icons?i=js',
      badgeClass: 'bg-yellow-400',
    },
    {
      name: 'TypeScript',
      icon: 'https://skillicons.dev/icons?i=ts',
      badgeClass: 'bg-sky-500',
    },
    {
      name: 'HTML5',
      icon: 'https://cdn-icons-png.flaticon.com/512/6528/6528608.png',
      badgeClass: 'bg-orange-500',
    },
    {
      name: 'CSS3',
      icon: 'https://cdn-icons-png.flaticon.com/512/82/82127.png',
      badgeClass: 'bg-blue-500',
    },
    {
      name: 'Tailwind CSS',
      icon: 'https://skillicons.dev/icons?i=tailwind',
      badgeClass: 'bg-cyan-400',
    },
    {
      name: 'React',
      icon: 'https://skillicons.dev/icons?i=react',
      badgeClass: 'bg-sky-400',
    },
    {
      name: 'Bootstrap',
      icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968672.png',
      badgeClass: 'bg-violet-400',
    },
  ]

  const backEndStack = [
    {
      name: 'PHP',
      icon: 'https://skillicons.dev/icons?i=php',
      badgeClass: 'bg-slate-200',
    },
    {
      name: 'Laravel',
      icon: 'https://skillicons.dev/icons?i=laravel',
      badgeClass: 'bg-red-500',
    },
    {
      name: 'Node.js',
      icon: 'https://skillicons.dev/icons?i=nodejs',
      badgeClass: 'bg-emerald-500',
    },
    
    {
      name: 'MySQL',
      icon: 'https://cdn-icons-png.flaticon.com/512/18968/18968868.png',
      badgeClass: 'bg-blue-500',
    },
    
  ]

  const toolsStack = [
    {
      name: 'Microsoft Word',
      icon: 'https://icons.iconarchive.com/icons/simpleicons-team/simple/128/microsoft-word-icon.png',
      badgeClass: 'bg-sky-500',
    },
    {
      name: 'Microsoft Excel',
      icon: 'https://icons.iconarchive.com/icons/simpleicons-team/simple/128/microsoft-excel-icon.png',
      badgeClass: 'bg-emerald-500',
    },
    {
      name: 'Canva',
      icon: 'https://icons.iconarchive.com/icons/simpleicons-team/simple/128/canva-icon.png',
      badgeClass: 'bg-cyan-500',
    },
    {
      name: 'Microsoft PowerPoint',
      icon: 'https://icons.iconarchive.com/icons/simpleicons-team/simple/128/microsoft-powerpoint-icon.png',
      badgeClass: 'bg-orange-500',
    },
    {
      name: 'Figma',
      icon: 'https://skillicons.dev/icons?i=figma',
      badgeClass: 'bg-slate-800',
    },
    {
      name: 'Adobe Audition',
      icon: 'https://skillicons.dev/icons?i=audition',
      badgeClass: 'bg-blue-600',
    },
  ]

  const certifications = [
    { image: '/Picture1.png' },
    { image: '/Picture2.png' },
    { image: '/Picture3.png' },
    { image: '/Picture4.png' },
    { image: '/Picture5.png' },
    { image: '/Picture6.png' },
    { image: '/Picture7.png' },
    { image: '/Picture8.png' },
    { image: '/Picture9.png' },
  ]

  const stats = [
    { value: '12k+', label: 'Users served' },
    { value: '2', label: 'Campuses supported' },
    { value: '1.27', label: 'GWA (3rd Year)' },
  ]

  const projects = [
    {
      title: 'IDentify',
      subtitle:
        'Web-based ID card issuance tracking and monitoring system with email notification',
      description:
        'Capstone system for NEUST that streamlines administrative workflows and delivers real-time status updates.',
      highlights: [
        'Automated email notifications',
        'Real-time status updates for 12,000+ users across two campuses',
      ],
      stack: [
        'JavaScript',
        'React + Vite',
        'Tailwind CSS',
        'MySQL',
        'Leaflet',
        'Google Maps API',
        'Face API',
        'reCAPTCHA',
      ],
      link: 'https://neust-identify.app',
      linkLabel: 'Visit project',
    },
    {
      title: 'FinFlow',
      subtitle: 'Mobile budgeting app',
      description:
        'A mobile budgeting application built with Ionic, Angular, SQLite, and NgxCharts.',
      highlights: [],
      stack: ['Ionic', 'Angular', 'SQLite', 'NgxCharts'],
      link: '/app-debug.apk',
      linkLabel: 'Download app',
      linkDownload: true,
    },
  ]

  const education = [
    {
      school: 'NEUST Sumacab Campus',
      program: 'Bachelor of Science in Information Technology',
      period: '2022 - 2026',
      details: [
        'Specialized in Web Systems Technology',
        'Capstone: "IDentify" with automated email notifications.',
        'GWA (3rd Year): 1.27',
      ],
    },
    {
      school: 'NEUST Laboratory High School',
      program: 'Senior High School - ABM Strand',
      period: '2020 - 2022',
      details: ['Graduated with honors.'],
    },
    {
      school: 'NEUST Laboratory High School',
      program: 'Junior High School',
      period: '2016 - 2020',
      details: ['Graduated with honors.'],
    },
  ]

  const socialLinks = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/ldaluz19/',
      icon: Facebook,
    },
    {
      label: 'GitHub',
      href: 'https://github.com/LorenDaleDaluz',
      icon: Github,
    },
    {
      label: 'Email',
      href: emailLink,
      icon: Mail,
    },
  ]

  const contactItems = [
    {
      label: 'Email',
      value: profile.email,
      href: emailLink,
      icon: Mail,
    },
    {
      label: 'Phone',
      value: profile.phone,
      href: `tel:${phoneLink}`,
      icon: Phone,
    },
    {
      label: 'Location',
      value: profile.location,
      icon: MapPin,
    },
  ]


  return (
    <div className="relative min-h-screen bg-slate-950 font-body text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_18%,rgba(124,58,237,0.35),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(236,72,153,0.3),transparent_50%),radial-gradient(circle_at_20%_85%,rgba(34,211,238,0.2),transparent_55%)]" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div
          className={`${container} flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between`}
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-red-500 to-red-900 font-display text-lg font-semibold text-white shadow-lg">
              LD
            </span>
            <div>
              <p className="m-0 font-semibold text-white">{profile.name}</p>
              <p className="mt-1 text-sm text-slate-400">
                {profile.role} | System Developer | App Developer
              </p>
            </div>
          </div>

          <nav
            className="flex flex-wrap gap-4 text-sm font-medium text-slate-400"
            aria-label="Primary"
          >
            {navItems.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveHref(link.href)}
                className={`transition ${
                  link.isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-current={link.isActive ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
            href="#contact"
          >
            Let&#39;s talk
          </a>
        </div>
      </header>

      <main>
        <section className="pb-20 pt-16" id="top">
          <div
            className={`${container} grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]`}
          >
            <div className="space-y-6" data-aos="fade-right">
             
              <h1 className="text-4xl font-semibold text-white sm:text-5xl">
                Loren Dale <br>
                
                </br>Daluz
              </h1>
              <p className="text-base text-slate-300 sm:text-lg">{summary}</p>
              <div className="flex flex-wrap gap-4">
                <a
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:from-red-400 hover:to-red-400"
                  href="#contact"
                >
                  Get in touch
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                  href="#projects"
                >
                  View projects
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10"
                      aria-label={link.label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {contactItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                      key={item.label}
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        <Icon className="h-4 w-4 text-red-300" />
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          className="mt-2 block text-sm font-semibold text-white"
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="mt-2 block text-sm font-semibold text-white">
                          {item.value}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="relative flex items-center justify-center" data-aos="fade-left">
              <div className="absolute h-72 w-72 rounded-full bg-gradient-to-br from-red-500/40 via-red-500/30 to-cyan-400/20 blur-3xl" />
              <div className="relative h-80 w-80 overflow-hidden rounded-full border border-white/15 bg-slate-900 shadow-[0_30px_80px_rgba(15,23,42,0.7)]">
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

        <section className="py-20" id="about">
          <div className={`${container} grid gap-8 lg:grid-cols-[1.2fr_0.8fr]`}>
            <div
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-lg"
              data-aos="fade-up"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300">
                About
              </span>
              <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                Professional summary and focus.
              </h2>
              <p className="mt-4 text-sm text-slate-300 sm:text-base">
                {summary}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    key={stat.label}
                  >
                    <span className="block text-xl font-semibold text-white">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-slate-400">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-lg"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300">
                Education
              </span>
              <div className="mt-5 space-y-4">
                {education.map((item) => (
                  <div
                    className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                    key={`${item.school}-${item.period}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {item.school}
                        </h3>
                        <p className="text-xs text-slate-400">{item.program}</p>
                      </div>
                      <span className="text-xs font-semibold text-red-300">
                        {item.period}
                      </span>
                    </div>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-300">
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

        <section className="py-20" id="services">
          <div className={container}>
            <div className="mb-8 space-y-3" data-aos="fade-up">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300">
                Services
              </span>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                Reliable solutions for modern web needs.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <article
                    className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg transition hover:-translate-y-1 hover:border-white/25"
                    key={service.title}
                    data-aos="fade-up"
                    data-aos-delay={`${index * 80}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-red-200">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-300">
                      {service.description}
                    </p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-20" id="skills">
          <div className={container}>
            <div
              className="rounded-[32px] border border-white/10 bg-slate-900/70 p-8 shadow-lg"
              data-aos="fade-up"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                    My Skillset
                  </h2>
                  <p className="text-sm text-slate-300">
                    Front-end, back-end, and tools I use to ship reliable
                    products.
                  </p>
                </div>
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                  Tech Stack
                </span>
              </div>

              <div className="mt-8 space-y-6">
                <div className="flex flex-wrap items-center gap-5">
                  <span className="w-24 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Front-End
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {frontEndStack.map((item) => (
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg ${item.badgeClass}`}
                        key={item.name}
                      >
                        <img
                          className="h-6 w-6"
                          src={item.icon}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  <span className="w-24 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Back-End
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {backEndStack.map((item) => (
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg ${item.badgeClass}`}
                        key={item.name}
                      >
                        <img
                          className="h-6 w-6"
                          src={item.icon}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  <span className="w-24 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Tools
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {toolsStack.map((item) => (
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg ${item.badgeClass}`}
                        key={item.name}
                      >
                        <img
                          className="h-6 w-6"
                          src={item.icon}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20" id="certifications">
          <div className={container}>
            <div className="mb-8 space-y-3" data-aos="fade-up">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300">
                Certifications
              </span>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                Credentials and completed training.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((certification, index) => (
                <article
                  className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-lg transition hover:-translate-y-1 hover:border-white/25"
                  
                  data-aos="fade-up"
                  data-aos-delay={`${index * 80}`}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
                    <img
                      className="h-full w-full object-cover"
                      src={certification.image}
                      
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-200">
            
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" id="projects">
          <div className={container}>
            <div className="mb-8 space-y-3" data-aos="fade-up">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300">
                Projects
              </span>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                Selected work built for real needs.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project, index) => (
                <article
                  className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg"
                  key={project.title}
                  data-aos="fade-up"
                  data-aos-delay={`${index * 100}`}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {project.subtitle}
                    </p>
                  </div>
                  <p className="text-sm text-slate-300">{project.description}</p>
                  {project.highlights.length > 0 ? (
                    <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                      {project.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tag) => (
                      <span
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.link ? (
                    <a
                      className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-red-300 transition hover:text-red-200"
                      href={project.link}
                      target={
                        project.linkDownload
                          ? undefined
                          : project.link?.startsWith('http')
                            ? '_blank'
                            : undefined
                      }
                      rel={
                        project.linkDownload
                          ? undefined
                          : project.link?.startsWith('http')
                            ? 'noreferrer'
                            : undefined
                      }
                      download={project.linkDownload ? true : undefined}
                    >
                      {project.linkLabel ?? 'Visit project'}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" id="contact">
          <div className={container}>
            <div
              className="grid gap-6 rounded-[28px] border border-white/10 bg-slate-900/80 p-8 shadow-lg md:grid-cols-[1.1fr_0.9fr]"
              data-aos="fade-up"
            >
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300">
                  Contact
                </span>
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                  Let&#39;s build something reliable together.
                </h2>
                <p className="text-sm text-slate-300">
                  Open to web development roles, freelance work, and
                  collaborative projects focused on modern web experiences.
                </p>
              </div>
              <div className="grid gap-4">
                {contactItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm"
                      key={item.label}
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        <Icon className="h-4 w-4 text-red-300" />
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          className="mt-2 block text-sm font-semibold text-white"
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="mt-2 block text-sm font-semibold text-white">
                          {item.value}
                        </span>
                      )}
                    </div>
                  )
                })}
                <div className="flex flex-wrap gap-3 pt-2">
                  {socialLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white/30 hover:bg-white/10"
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="pb-10 pt-8 text-sm text-slate-400">
        <div
          className={`${container} flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center`}
        >
          <p>(c) 2026 Loren Dale Natabio Daluz. All rights reserved.</p>
          <a
            className="text-sm font-semibold text-red-300 transition hover:text-red-200"
            href="#top"
          >
            Back to top
          </a>
        </div>
      </footer>
    </div>
  )  
}

export default App
