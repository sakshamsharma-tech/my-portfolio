# 02 — DESIGN (Technical Design)

> SDLC Phase 2. Analysis me humne bola **"kya banana hai"**, design me hum decide karte hain
> **"banayenge kaise"** — architecture, components, data flow, styling, file structure.
> Yehi document kaam karne waale developer (ya AI) ke liye "blueprint" hai.

---

## 2.1 Tech Stack Decision

| Layer | Choice | Why (aur kya reject kiya) |
|---|---|---|
| UI Library | **React 19** | Component model + hooks. Reject: Vue/Svelte (React hi seekhna hai) |
| Build tool | **Vite 8** | Instant HMR, `npm create vite` se ready. Reject: Next.js (server chahiye, humein static chahiye) |
| Language | JavaScript (JSX) | Beginner friendly. Reject: TypeScript (v1 me extra friction) |
| Styling | **Hand-written CSS + CSS Variables** | Full control, zero extra deps, design tokens sikhne ke liye best |
| Animation | CSS transitions + `IntersectionObserver` | React-Animation libs ki jagah native |
| Testing | **Vitest + React Testing Library** | Vite ke saath same config, bahut fast |
| Hosting | **GitHub Pages** (via GitHub Actions) | Free, HTTPS, auto-deploy |
| CI/CD | GitHub Actions | Push → test → build → deploy |

**Koi CSS framework kyun nahi?** Tailwind/Bootstrap fast shuru karte hain, lekin v1 ka
learning goal **React + Git + SDLC** hai. Hand-written CSS se `tokens.css` ka concept
achhe se samajh aata hai aur future me kisi bhi project me kaam aata hai.

---

## 2.2 Architecture — "Smart Component vs Dumb Component"

```
                    ┌─────────────────────────┐
                    │        App.jsx          │  ← sirf sections ko jodta hai
                    │  (composition root)     │
                    └────────────┬────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│  <Header/>    │        │  <Projects/>  │        │  <Contact/>   │
│  dumb         │        │  SMART        │        │  SMART        │
│  (no state)   │        │  (useState:   │        │  (form state  │
│               │        │   activeTag)  │        │   + errors)   │
└───────────────┘        └───────┬───────┘        └───────────────┘
        │                        │                        │
        │                        ▼                        │
        │              ┌──────────────────┐                │
        │              │  <ProjectCard/>  │ ← dumb        │
        │              └──────────────────┘                │
        ▼                                                 ▼
   ┌─────────────────┐                           ┌──────────────────┐
   │  ThemeProvider  │ ← Context (global state)  │  useLocalStorage │
   │  src/context/   │   kaam karta hai           │  custom hook     │
   └─────────────────┘                           └──────────────────┘
```

**Rule (exam me bhi poochha jata hai):**
- **Dumb / Presentational component** → sirf props se render karta hai, apna koi state nahi.
  Example: `ProjectCard`, `Hero`, `SkillGroup`.
- **Smart / Container component** → state rakhta hai, logic handle karta hai, dumb components
  ko props deta hai. Example: `Projects` (filter state), `Contact` (form state).
- **App.jsx** → koi business logic nahi, sirf layout/composition.

---

## 2.3 Component Tree

```
App
├── ThemeProvider                  (context: theme + toggle)
│   ├── Header
│   │   ├── Brand (logo + naam)
│   │   ├── Nav                     (anchor links + scroll-spy)
│   │   └── ThemeToggle
│   ├── main
│   │   ├── Hero
│   │   ├── About                   (intro + stats)
│   │   ├── Skills
│   │   │   └── SkillGroup   ×4
│   │   ├── Projects                (SMART — filter logic)
│   │   │   ├── FilterBar
│   │   │   └── ProjectCard   ×N
│   │   ├── Experience
│   │   │   └── TimelineItem ×N
│   │   ├── Education
│   │   └── Contact                 (SMART — validation)
│   │       └── Field (reusable input + error)
│   ├── BackToTop
│   └── Footer
```

---

## 2.4 Custom Hooks

| Hook | Kaam | Kyun banaya (DRY principle) |
|---|---|---|
| `useLocalStorage(key, initial)` | State + browser storage sync | Theme aur form dono me chahiye |
| `useTheme()` | Theme context ka consumer hook | Context ko directly na chuna pade |
| `useScrollSpy(ids)` | Active section track karta hai nav ke liye | Pure DOM logic, component se alag |
| `useReveal()` | Scroll par element fade-in | 6 sections me repeat ho raha tha |
| `validateContact(form)` | Form validation (pure function) | Testing me bina UI ke test ho jaayen |

---

## 2.5 State Management Decision

| Data | Kahan? | Kyun |
|---|---|---|
| Theme | React Context + localStorage | Poore app ko chahiye → global |
| Projects filter | `useState` inside `<Projects>` | Sirf usi component ko chahiye → local |
| Contact form fields + errors | `useState` inside `<Contact>` | Sirf form ko chahiye → local |
| Projects / Skills / Experience data | **Static JS file** | Content hai, state nahi → server ki zarurat nahi |

**Rule:** State ko utna upar rakho jitna zaroori hai. Har cheez global mat banao.
(Yahi "state colocation" kehlata hai.)

---

## 2.6 Data Model (content yahan se aata hai — FR-17)

```js
// src/data/profile.js
export const profile = {
  name: "Aarav Sharma",
  role: "Frontend Developer",
  tagline: "...",
  email: "aarav@example.com",
  phone: "+91 90000 00000",
  location: "Bengaluru, India",
  resumeUrl: "...",          // PDF daalo
  socials: [{ label, url, icon }],
  stats: [{ label, value }], // hero ke numbers
};

// src/data/projects.js
export const projects = [
  { id, title, blurb, tags: ["React","CSS"], demoUrl, codeUrl, featured }
];

// src/data/skills.js      → [{ category, items: [] }]
// src/data/experience.js  → [{ role, company, period, bullets: [] }]
// src/data/education.js   → [{ degree, school, period, score }]
```

**Isse kya hota hai?** Content badalne ke liye component chhedna hi nahi padta —
sirf `src/data/` edit. Yehi FR-17 hai.

---

## 2.7 Design Tokens (Design System)

`src/styles/tokens.css` me sab kuch define hai. Theme switch sirf `<html data-theme>` badalta hai.

```css
:root {                    /* Light theme (default) */
  --bg, --surface, --text, --muted, --border,
  --brand, --brand-2, --accent, --ring, --shadow
}
[data-theme="dark"] {     /* Dark theme — sirf values override */
  --bg, --surface, --text, ...
}
```

- **Colour:** Indigo → Violet gradient (`--brand`, `--brand-2`)
- **Type:** `Space Grotesk` (headings) + `Inter` (body), Google Fonts
- **Radius:** `--radius: 14px`
- **Spacing:** 4px base scale (`--space-1 … --space-6`)
- **Shadow:** 3 levels (`--shadow-sm/md/lg`)

**Benefit:** Theme toggle = sirf `data-theme` attribute change. Koi component me
hardcoded colour nahi. Ek jagah badlo, poori site badal jaati hai.

---

## 2.8 Styling Convention

- **BEM-lite class names:** `.project-card`, `.project-card__title`
- Koi inline style nahi (except dynamic width bars — wahan CSS var use karo)
- Mobile-first: base styles mobile, `@media (min-width: …)` par enhance
- `@media (prefers-reduced-motion: reduce)` → animation off (NFR-06)

---

## 2.9 File Structure

```
portfolio-react/
├── docs/                       ← SDLC artifacts (yeh "office ka kaagaz" hai)
│   ├── 01-analysis.md
│   ├── 02-design.md            ← tum ho yahan
│   ├── 03-development-plan.md
│   ├── 04-test-plan.md
│   ├── 05-test-report.md
│   ├── 06-deployment.md
│   └── 07-glossary.md
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx                ← app ka entry point
│   ├── App.jsx                 ← composition
│   ├── data/                   ← content (FR-17)
│   ├── context/ThemeContext.jsx
│   ├── hooks/                  ← useLocalStorage, useTheme, useScrollSpy, useReveal
│   ├── lib/validateContact.js  ← pure function (testable)
│   ├── components/             ← 14 components
│   ├── styles/                 ← tokens.css, base.css, components.css
│   └── test/
│       ├── setup.js
│       └── *.test.jsx
├── .github/workflows/deploy.yml
├── index.html
├── vite.config.js
└── package.json
```

---

## 2.10 Routing Decision

**Router use nahi kiya.** Sections same page pe hain aur nav `#about`, `#projects`
jaise **hash anchors** use karta hai.

**Kyun?**
1. Single page hai — router ka koi kaam nahi
2. GitHub Pages static hai; hash anchors se deep-link 404 nahi dete (Constraint #3)
3. Bundle chhoti rehti hai — faster load (NFR-02)

Agar future me alag pages chahiye (blog, project detail), tab `react-router` add karenge.

---

## 2.11 Testing Design (Phase 4 ka base)

| Test file | Kya verify karega |
|---|---|
| `contact.test.jsx` | AC-03.1 … 03.5 (validation + success) |
| `projects.test.jsx` | AC-02.1 … 02.5 (filter logic) |
| `theme.test.jsx` | AC-04.1 … 04.3 (toggle + persist) |
| `hero.test.jsx` | AC-01.1 … 01.3 (content render) |

Strategy: **User ke perspective se test karo** — user kya click karta hai, wahi assert karo.
`data-testid` tabhi use karo jab koi accessible query na ho.

---

**Next phase →** [03 — Development Plan & Git Strategy](./03-development-plan.md)