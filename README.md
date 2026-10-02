# Milan Raut — Anime-Inspired Developer Portfolio

A production-ready, responsive personal portfolio presented as a cinematic anime-inspired developer universe. The experience combines an editorial software-developer portfolio with a restrained game HUD, blue and violet supernatural effects, original character artwork, a lightweight Three.js scene, project “missions,” and keyboard-accessible navigation.

This guide is the complete project brief and maintenance manual. It documents the current implementation, real content, appearance, interactions, architecture, external data sources, limitations, and how to run and extend the application.

## At a glance

- **Owner:** Milan Raut, software developer; BE in Information Technology.
- **Primary profile:** [github.com/MeeLn](https://github.com/MeeLn)
- **Application:** Next.js App Router, React, strict TypeScript, Tailwind CSS 4, and Framer Motion.
- **Rendering:** Static/prerendered pages by default. Interactive areas are isolated in client components.
- **3D:** Three.js scene loaded only when its section approaches the viewport.
- **Backend or API key:** None. GitHub analytics use public, browser-fetched data and have fallback states.
- **Real project content:** ALTKit, ZeroGrid, AttendEase (personal), and AttendEase Legacy (college).
- **Company projects:** Supported by the data model, but hidden until real project data is supplied.
- **Resume:** `public/cv/CV.pdf`, linked as a real download.

## Visual direction and UI

The site is an understated nighttime anime world rather than a standard grid of generic developer cards. Neutral charcoal and near-black surfaces establish the page; electric blue is reserved for selected controls, focus, links, HUD details, and energy effects. Violet appears mainly in the Shadow Archive. Light mode switches to neutral warm whites and charcoal text while retaining restrained blue accents.

The main design tokens are defined in `src/app/globals.css`:

| Role            | Dark mode | Light mode |
| --------------- | --------- | ---------- |
| Page background | `#090b0f` | `#f0f0ed`  |
| Surface         | `#101318` | `#e8e8e4`  |
| Primary text    | `#f3f4f3` | `#15181c`  |
| Muted text      | `#8a909b` | `#626a72`  |
| Accent blue     | `#83c9ff` | `#236ba5`  |
| Special violet  | `#a69af2` | `#6555a8`  |

Inter is used for readable editorial text and JetBrains Mono for the system labels, project metadata, coordinates, and HUD. Both fonts are self-hosted through `next/font/local`; no third-party font request is needed. The layout uses a subtle grain texture, a thin reading-progress indicator, restrained glow, thin rules, precise typography, and spacious section layouts. Motion is short and purposeful; reduced-motion preferences are respected.

### Page sequence

The home page tells the story in this order:

1. **Cinematic intro:** A short “INITIALIZING DEVELOPER SYSTEM” title card. It can be skipped immediately. It is shown once per browser session; under reduced motion it dismisses quickly.
2. **Hero / developer profile:** The supplied anime hunter illustration (`public/images/characters/hero-hunter.webp`) is the dominant character identity. It is layered with a true Three.js environment, spatial wireframe structures, particles, rings, camera parallax, a dark dungeon wash, and the “DEVELOPER SYSTEM” HUD. Copy introduces Milan and links to Projects, About, GitHub, and the CV from the About section.
3. **Character profile / About:** The supplied anime sorcerer portrait (`public/images/characters/about-portrait.webp`), personal introduction, BE in Information Technology, development interests, problem-solving approach, and learning-by-building approach. Original real-life portraits are retained under `public/profile/` as source assets but are not used as the hero or About artwork.
4. **Developer abilities / skill tree:** Selectable technology nodes grouped into frameworks, languages, databases, and tools. Selecting a node updates the inspector with its name, category, and short factual description. No skill percentages, seniority ranks, or years are claimed.
5. **Mission Archive:** Searchable and filterable project entries. The available category filters are generated from populated data, so Company is not shown while there are no company projects. Cards show real icons, category, description, and technologies; each opens its own project route.
6. **System Analytics:** A developer-console panel showing the public repository count, contribution activity for the last year, and the primary language distribution of up to 100 recently updated public repositories.
7. **Journey:** An editable, date-free progression from learning fundamentals through building projects and continuing to explore. No milestones or dates have been invented.
8. **Domain Expansion / Digital Realm:** A Three.js scene with intersecting wireframe energy rings, a geometric core, and a bounded particle field. Project portals link directly to project detail pages. The hero also has a separate true 3D scene with perspective wireframe architecture, orbiting energy rings, light, and particles; pointer movement subtly shifts its camera and scroll progress nudges its depth.
9. **Shadow Archive:** Violet and blue artwork plus selectable project-memory nodes. A node reveals the mission name and technology hints; selecting it opens that mission.
10. **Final Chapter / Contact:** Functional email, GitHub, Instagram, Facebook, Reddit, and X links, followed by “THE STORY IS STILL BEING WRITTEN.” and Milan’s copyright.

The sticky navigation covers About, Abilities, Missions, Journey, and Contact, tracks the active section, and becomes a touch-friendly menu on small screens. The design reflows into a vertical hero and stacked content on mobile instead of simply shrinking the desktop composition.

### Skill tree inventory

The interactive skill selector currently contains the following technologies (the detail copy is a brief neutral description, not a claim of proficiency level):

- **Frameworks and libraries:** Next.js, React, Flutter, Node.js, Django, .NET, TensorFlow, TensorFlow Lite.
- **Languages and web foundations:** TypeScript, Java, C, C++, Python, PHP, HTML5, CSS3, JavaScript, XML.
- **Databases:** PostgreSQL, MySQL, SQLite.
- **Tools and IDEs:** VS Code, Android Studio, Visual Studio, IntelliJ IDEA, Jupyter, C++ Builder.

Selecting a technology activates its node and fills the inspector with its name, category, note, and “in the toolkit” state. There are no percentage ratings or experience-year claims. The current renderer uses a shared code-symbol icon with selectable labeled nodes rather than downloading third-party logos.

### Journey chapter copy

The date-free timeline is data-driven in the home client and contains these chapters:

1. **The beginning:** Curiosity turns into a first line of code.
2. **Learning the fundamentals:** Building understanding across programming, software, and systems.
3. **Building projects:** Turning ideas into applications through personal and college projects.
4. **Exploring what’s next:** Continuing to learn, experiment, and make more useful things.

These are intentionally broad narrative stages, not dated employment or achievement milestones.

### Interaction guide

- **Intro:** Click the panel or choose “ENTER THE ARCHIVE” to skip.
- **Navigation:** Sticky section links; the mobile menu can be opened and closed from the header.
- **Command palette:** Press `Ctrl+K` on Windows/Linux or `Cmd+K` on macOS. It includes section navigation, curated project routes, GitHub, contact, and theme switching. `Escape` closes it; keyboard focus is trapped while it is open.
- **Theme:** Use the sun/moon control. Choice is saved in `localStorage` under `milan-theme`.
- **Project archive:** Filter by populated category or project type; search title, description, category, type, and technologies. “Reset archive” clears all filters when no results match.
- **Project galleries:** If a project has real screenshots, select a thumbnail to open the native dialog viewer. Previous/next controls and left/right arrow keys change images; Escape closes the dialog. Empty screenshot arrays render no fake gallery.
- **Hero and domain 3D:** The hero and domain scenes are separate, dynamically imported Three.js canvases. Both cap pixel ratio, observe visibility, pause rendering offscreen, respect reduced motion, and dispose WebGL resources. The anime artwork and CSS layers remain visible if WebGL cannot initialize.
- **Developer console:** Press `Alt+Shift+D`. It is a local informational dialog, not a shell or remote command runner; Escape closes it, focus stays inside, and focus returns to the trigger.
- **Achievement easter egg:** Enter the Konami sequence (↑ ↑ ↓ ↓ ← → ← → B A) to show a brief accessible achievement notification and temporary violet/blue visual pulse.
- **Gallery, buttons, links, filters, and dialogs:** Use semantic controls with keyboard operation and visible focus treatment. Motion is reduced when the visitor requests reduced motion.

## Projects and factual content

Project data is centralized in `src/data/projects.ts`, independently of presentation components. The current entries are:

### ALTKit — Personal project

A modular Flutter utility app with dedicated feature screens, synced navigation, and an admin-only settings flow. Current listed tools include scanner, notes, connectivity tools, compass, flashlight, sound meter, wallpaper studio, device information, unit converter, mini browser, and file cleaner. Technologies: Flutter, Dart, Riverpod, Android.

### ZeroGrid — Personal project

An air-gapped file transfer application. The sender displays fountain-coded QR frames; the receiver scans and reconstructs the file. It does not rely on Wi-Fi, Bluetooth, cellular data, or network sockets. Technologies: Flutter, Dart, QR, optical transfer.

### AttendEase — Personal project

The Flutter version of AttendEase has admin, teacher, and student workflows and local SQLite persistence for users, courses, departments, and attendance. On Android, face verification uses CameraX, ML Kit, and a TensorFlow Lite MobileFaceNet model before attendance is marked. Technologies: Flutter, Dart, SQLite, CameraX, ML Kit, TensorFlow Lite.

### AttendEase · Legacy Android — College project

The original Android Studio predecessor to the Flutter application, with role-based dashboards, SQLite-backed attendance, and native face registration and recognition using CameraX, ML Kit, and TensorFlow Lite. Its public repository and README are linked. A real APK is available at `public/downloads/attendease-legacy.apk` (listed as 97 MiB / 101.7 MB).

### Content accuracy rules

- Do not invent employers, employment dates, project dates, user counts, project statistics, awards, achievements, repository URLs, app-store links, screenshots, or live demos.
- The three personal app repositories are not linked because public repository URLs could not be verified. The Legacy Android repository is public and linked.
- Company projects are an allowed `ProjectCategory`, but the filter and cards only appear when actual Company entries exist.
- The unlabelled images in `public/projects/` include unrelated LMS and game imagery. They are deliberately not used as screenshots for these four projects.
- At present, project `screenshots` arrays are empty. The gallery component is implemented, but genuine matching project captures need to be supplied before gallery controls appear.
- Download buttons only render from actual `downloadLinks`. Only the Legacy Android APK is currently provided. Resume links point to the existing CV PDF.

## Adding or updating project content

Edit one entry in `src/data/projects.ts`. The TypeScript `PortfolioProject` schema supports:

```ts
{
  id: string;
  slug: string;                 // URL segment: /projects/{slug}
  title: string;
  category: "Personal" | "College" | "Company";
  projectType?: string;
  description: string;          // archive card and page lead
  longDescription: string;      // project overview
  problem?: string;
  features?: string[];
  highlights?: string[];
  videoUrl?: string;
  year?: number;                // include only when verified
  coverImage: string;           // local public path, e.g. /projects/icons/app.webp
  screenshots: string[];        // local public paths; can be []
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;
  downloadLinks?: {
    label: string;
    href: string;
    version?: string;
    fileSize?: string;
    releaseNotes?: string;
  }[];
  featured?: boolean;
  status?: string;
}
```

Put local public files below `public/` and refer to them with a URL path beginning with `/`; do not include the word `public` in the URL. Use WebP/AVIF where appropriate and retain a meaningful source image ratio. Use `screenshots: []` until actual screenshots for that project are available. A project detail route is generated statically from each `slug`; the archive, Shadow Archive, and domain portals consume this same data source.

Optional fields remain optional. The detail page conditionally shows the problem statement, feature list, development highlights, screenshot viewer, demonstration link, source/documentation/live links, and download section only where those fields are present. APK metadata should be added only when known. A real release can be added like this:

```ts
downloadLinks: [
  {
    label: "Download Android APK",
    href: "/downloads/example.apk",
    version: "1.2.0",             // omit if unknown
    fileSize: "42 MB",            // omit if unknown
    releaseNotes: "Verified notes", // omit if unavailable
  },
],
```

Use a direct local path for a hosted file or a real external release URL. Never add a visible download button with a missing file.

The currently rendered fields are the identity/category/type, short and long descriptions, problem statement, features, highlights, cover image, screenshot list, technologies, video link, source/live/documentation links, and download information. The schema also reserves `year`, `featured`, and `status` for future content needs; those fields do not currently change the visual presentation. `featured` is populated on the current projects for future curation but all real entries are shown in the archive today.

## GitHub data and external requests

The analytics component fetches data in the visitor’s browser:

1. `https://api.github.com/users/MeeLn` for the current public repository count.
2. `https://api.github.com/users/MeeLn/repos?per_page=100&sort=updated` for primary language usage among up to 100 recently updated public repositories.
3. `https://github-contributions-api.jogruber.de/v4/MeeLn?y=last` for the last-year contribution calendar.

The account is public; these endpoints do not require an API key. The dashboard validates basic payload shape, handles each feed failing independently, and shows loading, partial, or unavailable states instead of making up numbers. The contribution calendar depends on the third-party Jogruber service; if it is unavailable, the GitHub profile link remains available. Browser network policy, service availability, and GitHub’s unauthenticated rate limit can affect displayed data. There is no server-side GitHub proxy and no credential is stored in this repository.

## Source map

```text
src/
├── app/
│   ├── layout.tsx                 Root metadata, local fonts, viewport
│   ├── page.tsx                   Home route
│   ├── globals.css                Design system, responsive UI, animation styles
│   ├── loading.tsx                Route loading view
│   ├── not-found.tsx              Branded 404
│   ├── robots.ts                  Robots metadata route
│   ├── sitemap.ts                 Sitemap generated from project slugs
│   └── projects/[slug]/page.tsx   Static project detail route
├── components/
│   ├── portfolio.tsx              Home sections, theme, navigation, intro, filters
│   ├── github-analytics.tsx       Public GitHub data and analytics display
│   ├── project-gallery.tsx        Accessible screenshot viewer
│   ├── lazy-hero-scene.tsx        Near-viewport loading for hero WebGL scene
│   ├── hero-canvas.tsx            Three.js hero environment and camera motion
│   ├── lazy-domain-scene.tsx      Near-viewport loading for domain scene
│   ├── domain-canvas.tsx          Three.js renderer and resource lifecycle
│   └── easter-eggs.tsx            Secret console and achievement interaction
└── data/
    └── projects.ts                Typed source of project content

public/
├── profile/                       Original profile photos, retained but not used as hero/About art
├── images/characters/             Optimized anime chapter illustrations (WebP)
├── generated image/               Supplied source artwork; preserved originals
├── projects/icons/                Project app icons used by mission cards/details
├── projects/                      Unlabelled legacy images; unrelated images excluded
├── downloads/                     Real distributable files, including Legacy APK
├── cv/CV.pdf                      Resume/CV download
├── og/portfolio.webp              1200×630 anime social preview image
└── favicon.svg                     Custom MR monogram favicon
```

## Architecture and implementation notes

- `src/app/page.tsx` is a Server Component that renders the interactive portfolio client component. Project detail routes are Server Components and statically generated using `generateStaticParams` from the project data.
- `src/components/portfolio.tsx` owns home-page interactions: theme persistence, active-section tracking, mobile navigation, the short intro, command palette, filtering/search, and section motion. The rest of the document is not made interactive solely to support Three.js.
- `src/components/lazy-domain-scene.tsx` waits until the 3D section nears the viewport before dynamically importing `domain-canvas.tsx` with server rendering disabled. The WebGL renderer uses low-power preferences, capped device pixel ratio, intersection visibility pausing, reduced-motion support, and explicit GPU resource disposal.
- Framer Motion provides view reveals, short transitions, and dialog/command palette animation. CSS handles ambient effects, loops, layout, and reduced-motion fallbacks. Three.js is reserved for the meaningful 3D domain scene; the rest of the site remains regular semantic HTML and optimized images.
- Images use `next/image` where appropriate, with explicit `sizes`; Next image output is configured to prefer AVIF/WebP. Anime artwork leads the hero, About section, and social preview. Original transparent profile PNGs remain in `public/profile/` but are not rendered as the main or About character image.
- `src/app/layout.tsx` contains the global title/description, Open Graph and X/Twitter card metadata, anime preview image, custom favicon, local fonts, and viewport configuration. Project routes set their own title, description, social metadata, and canonical path when the site origin is configured.
- `src/app/robots.ts` and `src/app/sitemap.ts` provide metadata routes. Set `NEXT_PUBLIC_SITE_URL` to the canonical deployed origin to enable canonical URL metadata, absolute Open Graph/X social preview metadata, sitemap URLs, and the sitemap reference in robots output. Use the origin only, for example `https://portfolio.example.com`, without a trailing path.
- No database, server actions, API routes, authentication, or secret environment variables are part of the app.

## Development

Requirements: Node.js compatible with the installed Next.js 16 release and pnpm. From this directory:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The repository includes `.env.example`, and this checkout has a local `.env.local` configured with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`. To set up another checkout, copy `.env.example` to `.env.local`. For production, replace the value in your hosting provider's environment variables with your real canonical site origin (for example, `https://your-domain.com`):

```bash
NEXT_PUBLIC_SITE_URL=https://your-real-domain.com
```

`.env.local` is ignored by Git and should not be committed. Set the production value in the deployment provider's build environment for canonical metadata, absolute Open Graph/X URLs, and a populated sitemap. Restart the development server after changing the local value.

## Validation and production

```bash
pnpm lint       # ESLint
pnpm typecheck  # strict TypeScript check
pnpm build      # optimized Next.js production build
pnpm start      # serve the production build
```

The current production build statically generates the home route, four project pages, not-found page, robots route, and sitemap route. Lint, typecheck, and production build have been verified. There is no automated test suite configured. HTTP smoke checks have verified the home page, project routes, SEO endpoints, portrait/social images, and Legacy APK response.

Deploy as a standard Next.js application (for example, a Next.js-compatible hosting provider). The `public/` files must be included in the deployment. No API key or separate backend needs provisioning. GitHub analytics require the visitor’s browser to reach the public GitHub API and Jogruber endpoint.

## Personal links

- GitHub: [github.com/MeeLn](https://github.com/MeeLn)
- GitHub repositories: [github.com/MeeLn?tab=repositories](https://github.com/MeeLn?tab=repositories)
- Email: [rttmilan76@gmail.com](mailto:rttmilan76@gmail.com)
- Instagram: [@meeln8](https://www.instagram.com/meeln8/)
- Facebook: [mi.lana.521512](https://www.facebook.com/mi.lana.521512)
- Reddit: [u/Old_Signature_351](https://www.reddit.com/user/Old_Signature_351)
- X: [@MeeLn84](https://x.com/MeeLn84)

## Current content gaps to remember

The site and its project schema are ready for verified content updates, but they should not be mistaken for content that has already been supplied. Specifically, the three personal repository links, personal app screenshots, demo videos, live demos, store listings, version/release notes, and dated milestones are not currently present. Add them when verified; until then, the corresponding UI stays absent. The hero and About sections use supplied anime illustrations as requested. Original real-life portraits remain unused under `public/profile/`; no AI image generation or face alteration is part of this implementation.
