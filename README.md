# Personal Developer Portfolio

> **SDLC practice project** — React + Vite + Git + GitHub Pages, poora
> Analysis → Design → Development → Testing → Deployment cycle follow karke.

[![CI](https://github.com/sakshamsharmatech/my-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/sakshamsharmatech/my-portfolio/actions/workflows/deploy.yml)

---

## 🔗 Live site

**https://sakshamsharmatech.github.io/my-portfolio**

---

## ⚡ 1 minute me customize karo

Sabse pehle — **content badalne ke liye koi component chhedna nahi hai.**
Saara text `src/data/` me hai.

| Badalna hai | File |
|---|---|
| Naam, role, email, phone, location, resume | `src/data/profile.js` |
| YouTube URL (dummy abhi) | `src/data/profile.js` → `socials` |
| Skills aur progress bars | `src/data/skills.js` |
| Projects + tags | `src/data/projects.js` |
| YouTube stats + 6 tabs ka content | `src/data/youtube.js` |
| Job history (timeline) | `src/data/experience.js` |
| Degree / certifications | `src/data/education.js` |

**3 cheezein jo bhoolne se "dummy data" dikhta hai:**

```js
// 1. src/data/profile.js — apni info
export const profile = {
  name: 'Aapka Naam',
  email: 'aapka@email.com',
  ...
};

// 2. src/data/youtube.js — FLIP this ONE flag (badge gayab ho jayegi)
export const ytStats = {
  isSampleData: true,   // ← apne asli numbers daalne ke baad false karo
};

// 3. src/data/projects.js — apne asli GitHub links
{ title: 'Project', links: [{ label: 'Code', url: 'https://github.com/...' }] }
```

Phir:

```bash
npm run dev     # check locally
npm run build   # production build
```

---

## 🧰 Features

- **9 sections** — Hero, About, Skills, YouTube, Projects, Experience, Education, Contact
- **Dark / light theme** — localStorage me save hota hai, system preference se start
- **YouTube Channel Management section** — 7-metric scroll strip + 6 clickable tabs + CTA
- **Contact form** — real validation, accessible errors, mailto fallback
- **Project filter** — tag-based, instant
- **Keyboard accessible** — arrow-key tabs, skip link, visible focus rings
- **WCAG AA contrast** — dono themes me, CI gate
- **Responsive** — 375px se 1440px+ tak
- **Reduced motion** support
- **SEO** — meta tags, Open Graph image, semantic HTML

---

## 🛠️ Stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Build | Vite 8 |
| Language | JavaScript (JSX) |
| Styling | Hand-written CSS + design tokens |
| Testing | Vitest + React Testing Library |
| Accessibility audit | Playwright (Core) + custom WCAG script |
| CI/CD | GitHub Actions → GitHub Pages |

**Koi CSS framework nahi, koi UI library nahi, koi icon library nahi.**
Is project ka maaza learning me hai — abstraction se pehle.

---

## 📁 Structure

```
src/
├── data/            ← saara content yahan (components ko chhedna mat)
├── components/      ← UI (dumb) + logic wale (smart)
│   └── YouTube/     ← is section ke 3 components
├── hooks/           ← useReveal, useScrollSpy, useTheme...
├── lib/             ← pure functions (validateContact)
├── styles/          ← tokens.css, base.css, components.css
├── context/         ← ThemeContext
└── test/            ← 73 tests
scripts/             ← contrast audit + generators
docs/                ← SDLC documentation
```

---

## 📚 SDLC docs

Ye project **process** kaise follow hota hai — ye bhi seekhne ka hissa hai:

| Doc | Phase |
|---|---|
| [`docs/01-analysis.md`](docs/01-analysis.md) | Analysis — FR, NFR, user stories, ACs, decision log |
| [`docs/02-design.md`](docs/02-design.md) | Design — architecture, components, data flow, tokens |
| [`docs/03-development-plan.md`](docs/03-development-plan.md) | Development plan — task list + branch strategy |
| [`docs/04-test-plan.md`](docs/04-test-plan.md) | Test plan — strategy + AC mapping |
| [`docs/05-test-report.md`](docs/05-test-report.md) | Test report — results + bugs found |
| [`docs/06-deployment.md`](docs/06-deployment.md) | Deployment — Pages + troubleshooting |
| [`docs/07-glossary.md`](docs/07-glossary.md) | Glossary — SDLC/React/Git terms |

---

## 🧪 Commands

```bash
npm install            # dependencies

npm run dev            # dev server (hot reload) → localhost:5173
npm run build          # production build → dist/
npm run preview        # production build ko locally dekho

npm test               # 73 tests
npm run test:watch     # watch mode
npm run test:coverage  # + coverage report

npm run test:contrast  # contrast audit tool ka self-test

npm run deploy:pages   # manual fallback deploy (gh-pages branch)
```

**Accessibility audit (asli browser me):**

```bash
npm run build && npm run preview
node scripts/contrast-audit.mjs http://localhost:4173
node scripts/contrast-audit.mjs http://localhost:4173 --headed   # browser dikhega
```

---

## 🌿 Git workflow

Ek concern = ek branch. Merge `--no-ff` se (merge commit preserve hota hai).

```
main ──┬── chore/scaffold ────────────────┐
       ├── docs/sdlc ─────────────────────┤
       ├── feature/theme-system ──────────┤
       ├── feature/hero-about ────────────┤
       ├── feature/skills ────────────────┤
       ├── feature/projects ──────────────┤
       ├── fix/scrollspy-and-mobile-cta ──┤
       ├── feature/youtube-section ───────┤
       ├── feature/experience-education ──┤
       └── chore/polish ──────────────────┘
```

`docs/01-analysis.md` → `docs/06-deployment.md` me har phase ka record hai.

---

## 📝 Note

Ye ek **learning project** hai. Personal details placeholder hain
(`Aarav Sharma`, `example.com` emails) — jaan-boojh kar rakhe gaye hain
taaki koi galat data accidentally live na jaaye.

YouTube metrics **sample data** hain, aur UI me "Sample data" badge
saaf-saaf dikhaya gaya hai (NFR-12).

---

## 📄 License

MIT — is repo ka code kaise bhi use kar sakte ho.