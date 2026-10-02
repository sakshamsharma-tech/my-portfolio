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
│   └── ErrorBoundary               ← pehle commit 3e2bd5c me add hua (crash fallback)
│   ├── Header
│   │   ├── Brand (logo + naam)
│   │   ├── Nav                     (anchor links + scroll-spy)
│   │   └── ThemeToggle
│   ├── main
│   │   ├── Hero
│   │   ├── About                   (intro + stats)
│   │   ├── Skills
│   │   │   └── SkillGroup   ×4
│   │   ├── YouTube                 ← NAYA (2.3.1 me detail)
│   │   │   ├── StatsStrip          (dumb — 7 cards, horizontal scroll)
│   │   │   └── TabGroup            (SMART — activeTab state)
│   │   │       └── TabPanel   ×6   (dumb — 1 visible at a time)
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

## 2.3.1 YouTube Section — Design (Naya, 2026-10-02)

> Analysis ke FR-18..26, US-05, US-06 aur DL-11..14 ka technical design.

### Smart / Dumb split

```
┌──────────────────────────────┐
│  <YouTube/>          SMART   │  activeTab state yahan hai
│  (section wrapper, id="youtube")
└───────┬──────────────┬───────┘
        │              │
        ▼              ▼
┌──────────────┐  ┌──────────────────┐
│ <StatsStrip/>│  │  <TabGroup/>     │  SMART
│    DUMB      │  │  activeTab state │
│              │  └────────┬─────────┘
│ 7 × StatCard │           │  map() → sirf active wala
│ (scroll-x)   │           ▼
└──────────────┘  ┌──────────────────┐
                  │  <TabPanel/>     │  DUMB
                  │  ×6 (1 mounted,  │  panel me
                  │  baaki hidden)   │  aria-labelledby
                  └──────────────────┘
```

**`<YouTube/>`** khud state nahi rakhta — sirf composition hai. State `<TabGroup/>` me hai,
kyunki sirf usi ko chahiye (state colocation — 2.5 ka rule).

### Tabs ka state + keyboard behaviour

```js
// src/components/YouTube/TabGroup.jsx
const [activeTab, setActiveTab] = useState(0);   // number = index

function onKeyDown(e) {
  const last = tabs.length - 1;
  switch (e.key) {
    case 'ArrowRight': setActiveTab((i) => (i === last ? 0 : i + 1)); break;
    case 'ArrowLeft':  setActiveTab((i) => (i === 0 ? last : i - 1)); break;
    case 'Home':       setActiveTab(0); break;
    case 'End':        setActiveTab(last); break;
    default: return;   // baaki keys ignore
  }
  e.preventDefault();  // page scroll na ho
}
```

**Wrap-around** chuna (`last → 0`) — 6 tabs me natural lagta hai.

**Roving tabindex** (a11y ka standard pattern):
- active tab → `tabIndex={0}`
- baaki tabs → `tabIndex={-1}` (Tab se skip, sirf arrow se reach)
- isse 6 tabs pe `Tab` 6 baar nahi, **ek baar** chahiye

### Accessibility markup (WAI-ARIA Tabs pattern)

```jsx
<div role="tablist" aria-label="YouTube channel management services">
  {tabs.map((tab, i) => (
    <button
      key={tab.id}
      role="tab"
      id={`yt-tab-${tab.id}`}
      aria-selected={i === activeTab}
      aria-controls={`yt-panel-${tab.id}`}
      tabIndex={i === activeTab ? 0 : -1}
      onClick={() => setActiveTab(i)}
    >
      {tab.label}
    </button>
  ))}
</div>

<div
  role="tabpanel"
  id={`yt-panel-${tabs[activeTab].id}`}
  aria-labelledby={`yt-tab-${tabs[activeTab].id}`}
  tabIndex={0}          // panel focusable — keyboard user scroll kar sake
>
  ...
</div>
```

**Sirf active panel DOM me rahega** — `hidden` attribute use nahi karenge, kyunki hidden
panels screen readers me awkward hote hain. Map me sirf active render hoga. Isse
AC-05.5 ("sirf uska panel dikhe") naturally satisfy hota hai.

### Stats strip — horizontal scroll (DL-14)

```css
.stats-strip {
  display: flex;
  gap: var(--space-3);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;          /* scroll affordance visible */
  padding-bottom: var(--space-2);
}
.stat-card {
  flex: 0 0 auto;                 /* shrink na ho */
  scroll-snap-align: start;
  min-width: 148px;
}
```

**Cut-off trick (AC-05.3.3):** strip ko container se thoda chhota rakhte hain —
7 cards ek line me aayenge, last card partially cut hoga → user ko visually pata
chalega "aur bhi hain, scroll karo".

**Keyboard (NFR-13):** browser native arrow-key scrolling parent container pe hoti hai.
Extra code ki zarurat nahi, bas har `.stat-card` ko `tabIndex={0}` dena zaroori hai
taaki keyboard user us tak pahunch sake.

### Data Model — `src/data/youtube.js` (DL-13)

Poora content yahan, component me kuch bhi hardcode nahi:

```js
export const ytStats = {
  isSampleData: true,          // AC-05.10 / AC-06.1 → "Sample data" label
  channel: {
    label: 'Sample channel metrics',
    items: [
      { id: 'subs', value: '48K+', label: 'Subscribers' },
      { id: 'videos', value: '320', label: 'Videos' },
      { id: 'views', value: '1.2M', label: 'Views' },
      { id: 'niches', value: '4', label: 'Niches' },
    ],
  },
  service: {
    label: 'Channels managed',
    items: [
      { id: 'channels', value: '8', label: 'Channels Managed' },
      { id: 'delivered', value: '140+', label: 'Videos Delivered' },
      { id: 'growth', value: '+68%', label: 'Avg Retention Gain' },
    ],
  },
};

export const ytTabs = [
  {
    id: 'strategy',
    label: 'Strategy & SEO',
    icon: 'compass',
    summary: '1-2 line ka summary panel ke top pe.',
    points: [
      'Topic planning + niche research',
      'Competitor channel analysis',
      'Titles, tags, descriptions likhna',
      'Thumbnail design (CTR badhane ke liye)',
    ],
  },
  // ... baaki 5 tabs (analysis 1.7.1 me map hai)
];
```

**Kyun `isSampleData: true` flag?** Isse UI automatically "Sample data" badge dikha
sakta hai. Agar owner baad me real numbers daale to flag `false` karna padega — ek
 jagah, na ki har component me condition likhna padega.

### Section CSS merge anchors

`components.css` me YouTube section ke liye **naya anchor** chahiye:

```css
/* ===== anchor:youtube ===== */
```

Ye anchor Skills aur Projects ke beech aayega (page order follow karta hai),
taaki parallel branch me conflict na ho.

### Nav integration

- `useScrollSpy` ki `SECTION_IDS` me `'youtube'` add hoga
- Nav link: `{ href: '#youtube', label: 'YouTube' }`
- Scroll-spy fix (pehle ka bug) ka pattern yahan bhi apply: page bottom pe
  last **existing** section select ho, non-existent link highlight na ho

---

## 2.4 Custom Hooks

| Hook | Kaam | Kyun banaya (DRY principle) |
|---|---|---|
| `useLocalStorage(key, initial)` | State + browser storage sync | Theme aur form dono me chahiye |
| `useTheme()` | Theme context ka consumer hook | Context ko directly na chuna pade |
| `useScrollSpy(ids)` | Active section track karta hai nav ke liye | Pure DOM logic, component se alag |
| `useReveal()` | Scroll par element fade-in | 6 sections me repeat ho raha tha |
| `validateContact(form)` | Form validation (pure function) | Testing me bina UI ke test ho jaayen |

### 2.4.1 `useReveal` — do-observer design (Phase 1 ke bug se)

Pehle ye sirf mount pe `IntersectionObserver` lagata tha (`useEffect(..., [])`).
Iska matlab: **dynamically render hone wale** `[data-reveal]` elements (jaise filter
ke baad aane wale project cards) kabhi observe hi nahi hue → `opacity: 0` par
**invisible atak** gaye. Content DOM me tha par screen pe nahi dikh raha tha.

**Fix — do observer saath chalte hain:**

```js
// 1. IntersectionObserver → animation trigger karta hai
const io = new IntersectionObserver(...);
// 2. MutationObserver → React ke naye DOM nodes pakadta hai aur turant observe karta hai
const mo = new MutationObserver((mutations) => {
  mutations.forEach((m) => m.addedNodes.forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches('[data-reveal]')) observe(node);
    node.querySelectorAll('[data-reveal]').forEach(observe);
  }));
});
```

Sirf ek call (`App.jsx` me) kaafi hai — kisi section me alag call nahi.

**Alternative** jo consider kiya tha par chhoda: har render pe rescan
(`useEffect` bina dep array ke). Simple tha, par wasteful — har re-render pe naye
observer banate. MutationObserver zyada surgical hai.

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
  --bg, --bg-alt, --surface, --surface-2,
  --text, --text-2, --muted, --border,
  --brand, --brand-2,          /* on-surface  (accent text, gradient text) */
  --brand-solid,               /* background   (upar WHITE text) */
  --brand-solid-2,
  --brand-soft,
  --ring, --shadow-sm/md/lg, --space-*, --radius-*, --fs-*
}
[data-theme="dark"] {     /* Dark theme — sirf values override */
  --bg, --surface, --text, ...   /* --brand halka, --brand-solid same */
}
```

- **Colour:** Indigo → Violet gradient (`--brand`, `--brand-2`)
- **Type:** `Space Grotesk` (headings) + `Inter` (body), Google Fonts
- **Radius:** `--radius: 14px`
- **Spacing:** 4px base scale (`--space-1 … --space-9`)
- **Shadow:** 3 levels (`--shadow-sm/md/lg`)

### 2.7.1 `--brand` vs `--brand-solid` — kyun do tokens chahiye

Ye Phase 1 ke review me seekha gaya (DL-10). Ek brand colour **do contradictory**
kaam karta hai:

| Token | Role | Requirement | Light value | White-on-it |
|---|---|---|---|---|
| `--brand` | text / accent (surface ke upar) | dark bg pe halka, light bg pe gehra | `#4f46e5` | — |
| `--brand-solid` | background (upar white text) | **WCAG AA: ≥ 4.5:1** | `#4f46e5` | **6.29:1** ✅ |

Agar ek hi token rakhte:
- `#818cf8` (dark bg pe text ke liye perfect) → white uske upar **2.98:1** ❌
- `#6366f1` (light theme original) → light surface pe text **3.89:1** ❌

**Rule:** jahan bhi `color: #fff` hai aur background brand hai → `--brand-solid` use karo.
Jahan brand colour khud text hai → `--brand`.

**7 rules** is rule ke mutabiq hain: `.btn--primary`, `.skip-link`, `::selection`,
`.brand__mark`, `.avatar-card__monogram`, `.filter--active`, `.social-btn:hover`.

### 2.7.2 Contrast verification ka tooling

Sirf "colour pick kar liya" pe bharosa nahi — **har commit pe verify** hota hai:

```bash
node scripts/contrast-audit.mjs http://localhost:4173 --headed
```

Ye script:
- har text element ka **effective** background ancestors se resolve karti hai
- **gradient ke sabse kharab stop** ko consider karti hai (WCAG me wahi count hota hai)
- `background-clip: text` ko sahi handle karti hai
- dono themes check karti hai, **exit code 0 = pass, 1 = fail**

Current state: dark **5.70:1**, light **3.44:1** (64px gradient hero title — large
text ko 3:1 chahiye) → dono pass (NFR-11).

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
│   ├── favicon.svg
│   ├── og-image.svg            ← social preview (placeholder)
│   └── aarav-sharma-resume.pdf ← placeholder PDF (script se generate)
├── scripts/
│   ├── generate-placeholder-resume.mjs   ← placeholder PDF banata hai
│   └── contrast-audit.mjs               ← WCAG audit (NFR-11 gate)
├── src/
│   ├── main.jsx                ← entry point (StrictMode + ErrorBoundary)
│   ├── App.jsx                 ← composition
│   ├── data/                   ← content (FR-17)
│   │   ├── profile.js, projects.js, skills.js
│   │   └── youtube.js          ← NAYA — stats + 6 tabs (DL-13)
│   ├── context/ThemeContext.jsx
│   ├── hooks/                  ← useLocalStorage, useTheme, useScrollSpy, useReveal
│   ├── lib/validateContact.js  ← pure function (testable)
│   ├── components/             ← 16 components
│   │   ├── ErrorBoundary.jsx   ← crash fallback
│   │   └── YouTube/
│   │       ├── StatsStrip.jsx  ← DUMB
│   │       ├── TabGroup.jsx    ← SMART (activeTab)
│   │       └── TabPanel.jsx    ← DUMB
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
| `youtube.test.jsx` | AC-05.1 … 05.12 + AC-06.1 … 06.4 (tabs, keyboard, stats, sample label, social links) |
| `errorBoundary.test.jsx` | Crash pe fallback UI dikhe (blank screen nahi) |

Strategy: **User ke perspective se test karo** — user kya click karta hai, wahi assert karo.
`data-testid` tabhi use karo jab koi accessible query na ho.

### 2.11.1 YouTube tabs ke test cases (AC-05 se map)

```js
// AC-05.4  → 6 tabs render hon, pehla active
expect(screen.getAllByRole('tab')).toHaveLength(6);
expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true');

// AC-05.5  → click karne par sirf uska panel
await user.click(screen.getByRole('tab', { name: /editing/i }));
expect(screen.getAllByRole('tabpanel')).toHaveLength(1);

// AC-05.6  → aria-selected shift
expect(screen.getByRole('tab', { name: /editing/i })).toHaveAttribute('aria-selected', 'true');

// AC-05.7  → arrow key se switch
await user.keyboard('{ArrowRight}');
expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');

// AC-06.1  → sample data label
expect(screen.getByText(/sample data/i)).toBeInTheDocument();
```

**Ek important testing lesson (Phase 1 review se):**
`toBeInTheDocument()` kaafi nahi — element DOM me hona ≠ user ko **dikhta** hona.
Isliye reveal-animation wale elements ke liye `opacity`/`is-visible` bhi assert karo.
Ye `useReveal` ke bug se seekha gaya tha.

---

**Next phase →** [03 — Development Plan & Git Strategy](./03-development-plan.md)