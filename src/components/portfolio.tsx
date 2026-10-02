"use client";

import Image from "next/image";
import Link from "next/link";
import LazyDomainScene from "@/components/lazy-domain-scene";
import GitHubAnalytics from "@/components/github-analytics";
import EasterEggs from "@/components/easter-eggs";
import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  Command,
  Github,
  GraduationCap,
  Layers3,
  Menu,
  Search,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { projects } from "@/data/projects";

const skills = [
  { name: "Next.js", group: "Frameworks", note: "App Router · React" },
  { name: "React", group: "Frameworks", note: "Component-based UI library" },
  { name: "Flutter", group: "Frameworks", note: "Cross-platform UI toolkit" },
  { name: "Node.js", group: "Frameworks", note: "JavaScript runtime" },
  { name: "Django", group: "Frameworks", note: "Python web framework" },
  { name: ".NET", group: "Frameworks", note: "Application platform" },
  { name: "TensorFlow", group: "Frameworks", note: "Machine learning" },
  { name: "TensorFlow Lite", group: "Frameworks", note: "On-device ML" },
  { name: "TypeScript", group: "Languages", note: "Typed JavaScript" },
  { name: "Java", group: "Languages", note: "Object-oriented programming" },
  { name: "C", group: "Languages", note: "Systems programming language" },
  {
    name: "C++",
    group: "Languages",
    note: "General-purpose programming language",
  },
  { name: "Python", group: "Languages", note: "General-purpose programming" },
  { name: "PHP", group: "Languages", note: "Server-side development" },
  { name: "HTML5", group: "Languages", note: "Web markup" },
  { name: "CSS3", group: "Languages", note: "Web styling" },
  { name: "JavaScript", group: "Languages", note: "Web programming language" },
  { name: "XML", group: "Languages", note: "Structured markup" },
  { name: "PostgreSQL", group: "Databases", note: "Relational database" },
  { name: "MySQL", group: "Databases", note: "Relational database" },
  { name: "SQLite", group: "Databases", note: "Embedded database" },
  { name: "VS Code", group: "Tools", note: "Code editor" },
  { name: "Android Studio", group: "Tools", note: "Android development" },
  { name: "Visual Studio", group: "Tools", note: "IDE" },
  { name: "IntelliJ IDEA", group: "Tools", note: "IDE" },
  { name: "Jupyter", group: "Tools", note: "Notebook environment" },
  { name: "C++ Builder", group: "Tools", note: "IDE" },
];
const journey = [
  ["01", "The beginning", "Curiosity turns into a first line of code."],
  [
    "02",
    "Learning the fundamentals",
    "Building understanding across programming, software, and systems.",
  ],
  [
    "03",
    "Building projects",
    "Turning ideas into applications through personal and college projects.",
  ],
  [
    "04",
    "Exploring what’s next",
    "Continuing to learn, experiment, and make more useful things.",
  ],
];
const projectFilters = [
  { key: "all", label: "ALL MISSIONS" },
  ...(["Personal", "College", "Company"] as const)
    .filter((category) =>
      projects.some((project) => project.category === category),
    )
    .map((category) => ({
      key: category.toLowerCase(),
      label: category.toUpperCase(),
    })),
];
const projectTypes = [
  ...new Set(
    projects
      .map((project) => project.projectType)
      .filter((type): type is string => Boolean(type)),
  ),
];
const socials = [
  ["GitHub", "https://github.com/MeeLn"],
  ["Instagram", "https://www.instagram.com/meeln8/"],
  ["Facebook", "https://www.facebook.com/mi.lana.521512"],
  ["Reddit", "https://www.reddit.com/user/Old_Signature_351"],
  ["X", "https://x.com/MeeLn84"],
];

export default function Portfolio() {
  const [active, setActive] = useState("all");
  const [activeSection, setActiveSection] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(skills[0]);
  const [light, setLight] = useState(false);
  const [menu, setMenu] = useState(false);
  const [command, setCommand] = useState(false);
  const [intro, setIntro] = useState(true);
  const [animeReveal, setAnimeReveal] = useState(false);
  const reduceMotion = useReducedMotion();
  const filtered = useMemo(
    () =>
      projects.filter((project) => {
        const matchesCategory =
          active === "all" || project.category.toLowerCase() === active;
        const matchesType =
          activeType === "all" || project.projectType === activeType;
        const query = searchTerm.trim().toLowerCase();
        const searchable = [
          project.title,
          project.description,
          project.category,
          project.projectType,
          ...project.technologies,
        ]
          .join(" ")
          .toLowerCase();
        return (
          matchesCategory &&
          matchesType &&
          (!query || searchable.includes(query))
        );
      }),
    [active, activeType, searchTerm],
  );

  useEffect(() => {
    const stored = localStorage.getItem("milan-theme");
    const done = sessionStorage.getItem("milan-intro");
    const initialFrame = window.requestAnimationFrame(() => {
      setLight(stored === "light");
      if (done) setIntro(false);
    });
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommand((v) => !v);
      }
      if (e.key === "Escape") {
        setCommand(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("keydown", handler);
    };
  }, []);
  useEffect(() => {
    if (!command) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const modal = document.querySelector<HTMLElement>(".command-box");
    const focusable = () =>
      modal?.querySelectorAll<HTMLElement>("a[href],button:not([disabled])") ??
      [];
    focusable()[0]?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [command]);

  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-22% 0px -66% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
    localStorage.setItem("milan-theme", light ? "light" : "dark");
  }, [light]);
  useEffect(() => {
    if (!intro) return;
    const timer = window.setTimeout(
      () => {
        setIntro(false);
        sessionStorage.setItem("milan-intro", "1");
      },
      reduceMotion ? 300 : 1300,
    );
    return () => window.clearTimeout(timer);
  }, [intro, reduceMotion]);
  const nav = [
    ["About", "about"],
    ["Abilities", "skills"],
    ["Missions", "projects"],
    ["Journey", "journey"],
    ["Contact", "contact"],
  ];
  const dismissIntro = () => {
    setIntro(false);
    sessionStorage.setItem("milan-intro", "1");
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="universe">
        <a className="skip-link" href="#home">
          Skip to content
        </a>
        <AnimatePresence>
          {intro && (
            <motion.div
              className="intro"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.45 } }}
              onClick={dismissIntro}
              aria-label="Skip introduction"
            >
              <div className="intro-mark">
                MR<span> / SYSTEM 01</span>
              </div>
              <p>INITIALIZING DEVELOPER SYSTEM</p>
              <div className="intro-line">
                <i />
              </div>
              <button onClick={dismissIntro}>
                ENTER THE ARCHIVE <ArrowRight size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grain" aria-hidden="true" />
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <header className="topbar">
          <Link href="#home" className="wordmark">
            <span className="wordmark-symbol">
              M<span>R</span>
            </span>
            <span>
              MILAN RAUT<small>DEVELOPER / PORTFOLIO</small>
            </span>
          </Link>
          <nav
            className={menu ? "nav-links open" : "nav-links"}
            aria-label="Primary navigation"
          >
            {nav.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className={activeSection === id ? "active" : ""}
                aria-current={activeSection === id ? "location" : undefined}
                onClick={() => setMenu(false)}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="top-actions">
            <button
              className="icon-button theme-toggle"
              onClick={() => setLight((v) => !v)}
              aria-label={`Switch to ${light ? "dark" : "light"} theme`}
            >
              {light ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              className="command-trigger"
              onClick={() => setCommand(true)}
              aria-label="Open command menu"
            >
              <Command size={14} />
              <span>⌘ K</span>
            </button>
            <button
              className="icon-button menu-toggle"
              onClick={() => setMenu((v) => !v)}
              aria-label={menu ? "Close menu" : "Open menu"}
            >
              {menu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>
        <div className="reading-progress" aria-hidden="true" />
        <EasterEggs />
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow status">
              <span className="status-dot" /> AVAILABLE FOR THE NEXT CHAPTER{" "}
              <span className="status-line" />
            </div>
            <h1>
              MILAN
              <br />
              <span>RAUT</span>
              <sup>®</sup>
            </h1>
            <p className="hero-role">
              SOFTWARE DEVELOPER <b>·</b> BE INFORMATION TECHNOLOGY
            </p>
            <p className="hero-description">
              Building digital worlds,
              <br className="desktop-break" /> one line at a time.
            </p>
            <p className="hero-sub">
              An IT engineering student passionate about software development,
              solving problems, and turning ideas into useful applications.
            </p>
            <div className="hero-actions">
              <a className="button-primary" href="#projects">
                Explore missions <ArrowRight size={15} />
              </a>
              <a className="button-quiet" href="#about">
                About me <ArrowRight size={14} />
              </a>
              <a
                className="button-quiet"
                href="https://github.com/MeeLn"
                target="_blank"
                rel="noreferrer"
              >
                GitHub profile <ArrowUpRight size={14} />
              </a>
              <a
                className="button-quiet"
                href="/cv/CV.pdf"
                download="Milan-Raut-CV.pdf"
              >
                Download CV <ArrowDown size={14} />
              </a>
            </div>
            <div className="hero-index">
              <span>01 / 05</span>
              <i />
              <span>THE DEVELOPER UNIVERSE</span>
            </div>
          </div>
          <div className="hero-stage">
            <div className="stage-grid" />
            <div className="stage-orbit orbit-a" />
            <div className="stage-orbit orbit-b" />
            <div className="stage-coordinates">
              DIGITAL REALM
              <br />
              PROFILE 001
            </div>
            <div className="stage-label">
              FIG. 001 <span>DEVELOPER PROFILE</span>
            </div>
            <div className="portrait-shadow" />
            <Image
              src="/profile/profile_1.png"
              alt="Portrait of Milan Raut"
              fill
              priority
              sizes="(max-width: 760px) 88vw, 52vw"
              className="hero-portrait"
            />
            <AnimatePresence>
              {animeReveal && (
                <motion.div
                  className="hero-anime-reveal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Image
                    src="/images/characters/hero-hunter.webp"
                    alt="Illustrated hunter form inspired by Milan Raut"
                    fill
                    sizes="(max-width: 760px) 88vw, 52vw"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              className="anime-reveal-toggle"
              onClick={() => setAnimeReveal((value) => !value)}
              aria-pressed={animeReveal}
            >
              {animeReveal ? "RETURN TO PHOTO" : "REVEAL ILLUSTRATED FORM"}
            </button>
            <div className="stage-hud">
              <span className="hud-top">
                <i /> DEVELOPER / PROFILE
              </span>
              <b>MILAN RAUT</b>
              <span>
                CLASS <strong>FULL-STACK DEVELOPER</strong>
              </span>
              <span>
                RANK <strong>CONTINUOUSLY EVOLVING</strong>
              </span>
              <span>
                STATUS{" "}
                <strong className="cyan">BUILDING THE NEXT EXPERIENCE</strong>
              </span>
              <span className="hud-meter">
                <i />
              </span>
            </div>
            <div className="stage-number">001</div>
          </div>
          <a className="scroll-cue" href="#about">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={14} />
          </a>
        </section>
        <section className="about section-wrap" id="about">
          <div className="section-heading">
            <p className="eyebrow">01 — CHARACTER PROFILE</p>
            <span className="heading-rule" />
          </div>
          <div className="about-layout">
            <div className="about-photo">
              <Image
                src="/profile/profile_2.png"
                alt="Milan Raut, software developer"
                fill
                sizes="(max-width: 760px) 90vw, 36vw"
              />
              <span className="photo-caption">SUBJECT / MR-01</span>
              <span className="photo-bracket" />
            </div>
            <div className="about-copy">
              <p className="eyebrow">THE PERSON BEHIND THE CODE</p>
              <h2>
                Curiosity is
                <br />
                my <em>starting point.</em>
              </h2>
              <p>
                I’m Milan, a software developer with a BE in Information
                Technology. I enjoy solving problems, exploring emerging
                technologies, and creating applications that make ideas useful.
              </p>
              <p>
                My work spans personal and college projects. I like learning by
                building, understanding how each piece fits, and refining the
                result until it feels clear and purposeful.
              </p>
              <div className="education-line">
                <GraduationCap size={19} />
                <span>
                  EDUCATION<small>BE in Information Technology</small>
                </span>
                <span className="edu-status">FOUNDATION</span>
              </div>
              <div className="about-bottom">
                <span>
                  BUILDING WHAT’S NEXT <i /> ALWAYS LEARNING
                </span>
                <a href="/cv/CV.pdf" download="Milan-Raut-CV.pdf">
                  Curriculum vitae <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="skills section-wrap" id="skills">
          <div className="section-heading">
            <p className="eyebrow">02 — ABILITY MATRIX</p>
            <span className="heading-rule" />
          </div>
          <div className="skills-title">
            <div>
              <p className="eyebrow">SKILL TREE / UNLOCKED BY BUILDING</p>
              <h2>
                Tools of the
                <br />
                <em>trade.</em>
              </h2>
            </div>
            <p className="skills-blurb">
              A growing toolkit shaped through study, experimentation, and
              projects. Select a node to inspect its place in the tree.
            </p>
          </div>
          <div className="skill-console">
            <div className="skill-groups">
              <div className="tree-connectors" aria-hidden="true" />
              <div className="skill-group">
                <span className="group-label">01 / FRAMEWORKS</span>
                <div className="skill-nodes">
                  {skills
                    .filter((s) => s.group === "Frameworks")
                    .map((s) => (
                      <button
                        key={s.name}
                        className={
                          selected.name === s.name ? "skill-node selected" : ""
                        }
                        onClick={() => setSelected(s)}
                      >
                        {s.name}
                      </button>
                    ))}
                </div>
              </div>
              <div className="skill-group">
                <span className="group-label">02 / LANGUAGES</span>
                <div className="skill-nodes">
                  {skills
                    .filter((s) => s.group === "Languages")
                    .map((s) => (
                      <button
                        key={s.name}
                        className={
                          selected.name === s.name ? "skill-node selected" : ""
                        }
                        onClick={() => setSelected(s)}
                      >
                        {s.name}
                      </button>
                    ))}
                </div>
              </div>
              <div className="skill-group">
                <span className="group-label">03 / DATA + TOOLS</span>
                <div className="skill-nodes">
                  {skills
                    .filter(
                      (s) => s.group === "Databases" || s.group === "Tools",
                    )
                    .map((s) => (
                      <button
                        key={s.name}
                        className={
                          selected.name === s.name ? "skill-node selected" : ""
                        }
                        onClick={() => setSelected(s)}
                      >
                        {s.name}
                      </button>
                    ))}
                </div>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.aside
                className="skill-inspector"
                key={selected.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="inspector-icon">
                  <Braces size={22} />
                </div>
                <span className="eyebrow">NODE INSPECTOR / ACTIVE</span>
                <h3>{selected.name}</h3>
                <p>{selected.note}</p>
                <div className="inspector-meta">
                  <span>CATEGORY</span>
                  <b>{selected.group}</b>
                </div>
                <div className="inspector-meta">
                  <span>STATE</span>
                  <b className="cyan">
                    <i /> IN THE TOOLKIT
                  </b>
                </div>
                <div className="inspector-foot">
                  NO LEVELS ASSIGNED <span>SKILL TREE / MR</span>
                </div>
              </motion.aside>
            </AnimatePresence>
          </div>
        </section>
        <section className="projects section-wrap" id="projects">
          <div className="section-heading">
            <p className="eyebrow">03 — MISSION ARCHIVE</p>
            <span className="heading-rule" />
          </div>
          <div className="projects-head">
            <div>
              <p className="eyebrow">EVERY PROJECT STARTS SOMEWHERE</p>
              <h2>
                Ideas into
                <br />
                <em>missions.</em>
              </h2>
            </div>
            <p>
              Small worlds built from curiosity, coursework, and a desire to
              make something work.
            </p>
          </div>
          <div className="archive-toolbar">
            <div
              className="filter-tabs"
              role="group"
              aria-label="Filter projects"
            >
              {projectFilters.map(({ key, label }) => (
                <button
                  key={key}
                  className={active === key ? "active" : ""}
                  onClick={() => setActive(key)}
                >
                  {label}
                  <sup>
                    {key === "all"
                      ? projects.length
                      : projects.filter((p) => p.category.toLowerCase() === key)
                          .length}
                  </sup>
                </button>
              ))}
            </div>
            <label className="archive-search">
              <Search size={14} />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search projects by name, description, or technology"
                placeholder="SEARCH MISSIONS / TECH"
              />
            </label>
            <label className="archive-type-filter">
              <span>TYPE</span>
              <select
                value={activeType}
                onChange={(event) => setActiveType(event.target.value)}
                aria-label="Filter projects by type"
              >
                <option value="all">ALL TYPES</option>
                {projectTypes.map((type) => (
                  <option value={type} key={type}>
                    {type.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
            <span className="archive-count">
              ARCHIVE / {String(filtered.length).padStart(2, "0")} ENTRIES
            </span>
          </div>
          {filtered.length === 0 ? (
            <div className="archive-empty" role="status">
              <span>NO MISSIONS MATCH THIS SEARCH.</span>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActive("all");
                  setActiveType("all");
                }}
              >
                RESET ARCHIVE <X size={13} />
              </button>
            </div>
          ) : (
            <div className="project-grid">
              {filtered.map((p, i) => (
                <motion.article
                  className="mission-card"
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                >
                  <Link href={`/projects/${p.slug}`} className="mission-image">
                    <Image
                      src={p.coverImage}
                      alt={`${p.title} app icon`}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 34vw"
                    />
                    <span className="mission-image-index">
                      MISSION // 0{i + 1}
                    </span>
                    <span className="mission-open">
                      <ArrowUpRight size={18} />
                    </span>
                  </Link>
                  <div className="mission-info">
                    <div className="mission-overline">
                      <span>{p.category.toUpperCase()} PROJECT</span>
                      <span>{p.category.toUpperCase()}</span>
                    </div>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="mission-title"
                    >
                      {p.title}
                      <ArrowUpRight size={16} />
                    </Link>
                    <p>{p.description}</p>
                    <div className="mission-tags">
                      {p.technologies.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
          <div className="archive-foot">
            <span>CURATED PROJECTS</span>
            <span>PERSONAL + COLLEGE PROJECTS</span>
            <a
              href="https://github.com/MeeLn?tab=repositories"
              target="_blank"
              rel="noreferrer"
            >
              Browse public repositories <ArrowUpRight size={13} />
            </a>
          </div>
        </section>
        <section className="analytics section-wrap" id="analytics">
          <div className="section-heading">
            <p className="eyebrow">04 — SYSTEM ANALYTICS</p>
            <span className="heading-rule" />
          </div>
          <div className="analytics-layout">
            <div className="analytics-intro">
              <p className="eyebrow">PUBLIC PROFILE / DATA FEED</p>
              <h2>
                Signal from
                <br />
                <em>the source.</em>
              </h2>
              <p>
                Live public profile data from GitHub, with a direct profile link
                if the feed is unavailable.
              </p>
              <a
                href="https://github.com/MeeLn"
                target="_blank"
                rel="noreferrer"
              >
                <Github size={15} /> Open GitHub profile{" "}
                <ArrowUpRight size={14} />
              </a>
            </div>
            <GitHubAnalytics />
          </div>
        </section>
        <section className="journey section-wrap" id="journey">
          <div className="section-heading">
            <p className="eyebrow">05 — THE LONG GAME</p>
            <span className="heading-rule" />
          </div>
          <div className="journey-head">
            <div>
              <p className="eyebrow">NO SHORTCUTS IN THIS STORY</p>
              <h2>
                Still in
                <br />
                <em>progress.</em>
              </h2>
            </div>
            <p>
              A path made of practice, projects, and staying curious.
              <br />
              The next chapter is always under construction.
            </p>
          </div>
          <div className="journey-art">
            <Image
              src="/images/characters/journey-adventure.webp"
              alt="Milan Raut in an adventure-inspired anime scene"
              fill
              sizes="(max-width: 760px) 60vw, 28vw"
            />
          </div>
          <div className="timeline">
            {journey.map(([n, title, body], i) => (
              <motion.div
                className="timeline-item"
                key={n}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="timeline-marker">
                  <span>{n}</span>
                  <i />
                </div>
                <div className="timeline-copy">
                  <span className="eyebrow">CHAPTER {n}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
                <span className="timeline-state">
                  {i === 3 ? "NOW UNFOLDING" : "FOUNDATION"}
                </span>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="domain section-wrap" id="domain">
          <div className="domain-bg">
            <Image
              src="/images/characters/domain-sorcerer.webp"
              alt="Anime sorcerer framed by blue spatial energy"
              fill
              sizes="(max-width: 760px) 100vw, 55vw"
            />
          </div>
          <LazyDomainScene />
          <div className="domain-rings" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="domain-copy">
            <p className="eyebrow">SPECIAL ABILITY / INTERACTIVE REALM</p>
            <p className="domain-kicker">DOMAIN EXPANSION</p>
            <h2>
              Enter the
              <br />
              <em>digital realm.</em>
            </h2>
            <p>
              A small portal into the worlds built from code. Choose a mission
              to inspect its source and project notes.
            </p>
            <div className="portal-links">
              {projects.slice(0, 3).map((project, index) => (
                <Link href={`/projects/${project.slug}`} key={project.id}>
                  <span>0{index + 1}</span>
                  {project.title}
                  <ArrowUpRight size={15} />
                </Link>
              ))}
            </div>
          </div>
          <span className="domain-vertical">EXPANSION / MR-01</span>
        </section>
        <section
          className="shadow-archive section-wrap"
          aria-labelledby="shadow-title"
        >
          <div className="shadow-wash" />
          <div className="shadow-content">
            <p className="eyebrow">OPTIONAL ENCOUNTER / 06</p>
            <p className="shadow-kicker">THE SHADOW ARCHIVE</p>
            <h2 id="shadow-title">
              What’s built
              <br />
              leaves a <em>trace.</em>
            </h2>
            <p>
              Every experiment leaves behind a lesson. Every finished mission
              becomes part of the next one.
            </p>
            <a href="#projects">
              Revisit the missions <ArrowRight size={14} />
            </a>
          </div>
          <div className="shadow-art" aria-hidden="true">
            <Image
              src="/images/characters/shadow-monarch.webp"
              alt=""
              fill
              sizes="(max-width: 760px) 55vw, 30vw"
            />
            <Image
              className="shadow-poster"
              src="/images/characters/shadow-army.webp"
              alt=""
              fill
              sizes="(max-width: 760px) 30vw, 17vw"
            />
          </div>
          <div className="shadow-nodes" aria-label="Project memories">
            <span className="eyebrow">SELECT A MEMORY / OPEN MISSION</span>
            {projects.map((project, index) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project.id}
                className="shadow-node"
              >
                <i>{String(index + 1).padStart(2, "0")}</i>
                <span>
                  <b>{project.title}</b>
                  <small>{project.technologies.slice(0, 2).join(" · ")}</small>
                </span>
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
          <div className="shadow-seal" aria-hidden="true">
            <span>MR</span>
            <i />
            <b />
            <small>ARCHIVE 001</small>
          </div>
          <span className="shadow-vertical">MEMORY / MOMENTUM / MAKING</span>
        </section>
        <section className="contact section-wrap" id="contact">
          <div className="section-heading">
            <p className="eyebrow">06 — FINAL CHAPTER</p>
            <span className="heading-rule" />
          </div>
          <div className="contact-content">
            <p className="eyebrow">
              <span className="status-dot" /> THE NEXT IDEA STARTS WITH A
              CONVERSATION
            </p>
            <h2>
              Let’s build
              <br />
              <em>something</em>
              <br />
              meaningful.
            </h2>
            <a className="contact-email" href="mailto:rttmilan76@gmail.com">
              rttmilan76@gmail.com <ArrowUpRight size={18} />
            </a>
            <div className="social-row">
              {socials.map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noreferrer">
                  {name}
                  <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>
          <div className="contact-aside">
            <div className="contact-symbol">
              M<span>R</span>
            </div>
            <p>
              SOFTWARE DEVELOPER
              <br />
              ALWAYS LEARNING
            </p>
            <span>
              PROFILE / MR-01
              <br />
              STATUS / ACTIVE
            </span>
          </div>
        </section>
        <footer className="site-footer">
          <span>© MILAN RAUT</span>
          <span>THE STORY IS STILL BEING WRITTEN.</span>
          <a href="#home">BACK TO THE TOP ↑</a>
        </footer>
        <button
          className="floating-index"
          onClick={() => setCommand(true)}
          aria-label="Open navigation commands"
        >
          <Layers3 size={15} />
          <span>INDEX</span>
        </button>
        <AnimatePresence>
          {command && (
            <motion.div
              className="command-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) setCommand(false);
              }}
            >
              <motion.div
                className="command-box"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                role="dialog"
                aria-modal="true"
                aria-label="Portfolio navigation"
              >
                <div className="command-head">
                  <Command size={16} />
                  <span>DEVELOPER SYSTEM / QUICK ACCESS</span>
                  <button
                    onClick={() => setCommand(false)}
                    aria-label="Close command menu"
                  >
                    <X size={17} />
                  </button>
                </div>
                <div className="command-list">
                  {nav.map(([label, id], i) => (
                    <a
                      href={`#${id}`}
                      key={id}
                      onClick={() => setCommand(false)}
                    >
                      <span className="command-num">0{i + 1}</span>
                      <span>{label}</span>
                      <ArrowRight size={15} />
                    </a>
                  ))}
                  <a
                    href="https://github.com/MeeLn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github size={15} />
                    <span>GitHub profile</span>
                    <ArrowUpRight size={14} />
                  </a>
                  {projects.map((project) => (
                    <Link
                      href={`/projects/${project.slug}`}
                      key={project.id}
                      onClick={() => setCommand(false)}
                    >
                      <span className="command-num">M</span>
                      <span>Open {project.title}</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  ))}
                  <a
                    href="mailto:rttmilan76@gmail.com"
                    onClick={() => setCommand(false)}
                  >
                    <span className="command-num">@</span>
                    <span>Contact Milan</span>
                    <ArrowUpRight size={14} />
                  </a>
                  <button onClick={() => setLight((v) => !v)}>
                    <span className="command-num">↗</span>
                    <span>Switch to {light ? "dark" : "light"} mode</span>
                    <Check size={14} />
                  </button>
                </div>
                <div className="command-foot">
                  ESC TO CLOSE <span>CTRL / ⌘ + K</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
