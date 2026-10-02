# 07 — GLOSSARY

> SDLC doc ka padhai-sahi part. Ye har technical word ka matlab hai jo is
> project me aaya — simple bhasha me, examples ke saath.

---

## A. SDLC (Software Development Life Cycle)

| Term | Matlab | Is project me kaha |
|---|---|---|
| **SDLC** | Software banane ka poora process — plan → design → code → test → deploy | `docs/01` se `docs/06` |
| **Requirement** | Software kya karega (features) | FR-01 … FR-26 |
| **FR (Functional Requirement)** | Feature jo user ko dikhta hai — "Contact form ho" | Analysis §1.4 |
| **NFR (Non-Functional Requirement)** | Quality — "fast ho", "accessible ho" | NFR-01 … NFR-14 |
| **User Story** | User ki ek kaam ki kahani — "Mai chahta hu ki…" | US-01 … US-06 |
| **Acceptance Criteria (AC)** | Testable condition — "dono tab switch honge" | AC-01.1, AC-05.7… |
| **Stakeholder** | Project se affected log | Owner |
| **Scope** | Project me kya **hai** aur kya **nahi** | Analysis §1.3 |
| **Sprint** | Chhota time-box jisme kuch tasks complete hon | N/A (branch-per-task) |
| **Traceability** | Requirement → Design → Code → Test ka link | §4.3 mapping tables |
| **Decision Log (DL)** | Kaunsa option chuna, kyun | Analysis §1.11 |

---

## B. Git

| Term | Matlab |
|---|---|
| **Repository / repo** | Poora project ka folder + uska history |
| **Commit** | Ek snapshot — "isme ye change save kar diya" |
| **Stage / staging** | "Next commit me ye files jayengi" |
| **Working tree** | Jo abhi disk pe hai (edited state) |
| **Branch** | Parallel line of work — feature alag, code safe |
| **Switch / checkout** | Branch badalna |
| **Merge** | Do branches ka kaam ek line me laana |
| **`--no-ff`** | Merge ko **force** karo commit banaye (history readable rehti hai) |
| **Fast-forward** | Merge bina naya commit banaye (history seedhi — avoid karte hain) |
| **Remote** | Doosra computer ka repo (`origin` = default naam) |
| **Origin** | Us remote ka alias jo `git remote add` se bana |
| **Push** | Local commits → remote |
| **Pull / fetch** | Remote → local |
| **Conflict** | Do branches ne same line alag-alag badli |
| **Resolve conflict** | Decide karna kaunsi rakhni hai, phir `git add` |
| **Rebase** | Apne commits ko naye base par lagaana (history seedhi, shared history me mat karo) |
| **Reset** | Branch ka pointer hilaana (history badal jaati hai — careful) |
| **Revert** | Naya commit jo pichla undo karta hai (history bachi rehti hai — safe) |
| **Tag** | Named pointer — `v1.0.0` release marker |
| **HEAD** | Abhi aap kis branch par ho |
| **.gitignore** | Git ko mat batana kaunsi files track na karein (`node_modules/`, `dist/`) |

---

## C. GitHub / CI-CD / Deployment

| Term | Matlab |
|---|---|
| **CI (Continuous Integration)** | Har push par automatically tests chalana |
| **CD (Continuous Deployment)** | Pass ho to automatically live karna |
| **GitHub Actions** | GitHub ka built-in CI/CD — `.github/workflows/*.yml` |
| **Workflow** | Ek YAML file jo batati hai kya karna hai |
| **Job** | Workflow ke andar ek task (`test`, `build`, `deploy`) |
| **Step** | Job ke andar ek command |
| **Runner** | Wo machine jo kaam karti hai (GitHub ka server) |
| **Artifact** | Build output jo ek step se doosre me jaata hai (`dist/`) |
| **Cache** | Baar-baar download hone wale files store karna (`node_modules`) |
| **`npm ci`** | `package-lock.json` se **exact** versions install (reproducible) |
| **Gate** | Aisi check jiske fail hone par aage nahi badhte |
| **Base path** | Site kitne nested URL par hai (`/repo/` vs `/`) |
| **Static site** | Sirf HTML/CSS/JS — koi server nahi |
| **GitHub Pages** | GitHub ka free static hosting |
| **404** | "Not Found" — file/URL exist nahi karti |
| **White screen** | JS error ki wajah se page khaali dikhe |

---

## D. React

| Term | Matlab |
|---|---|
| **Component** | UI ka ek reusable tukda (ek function jo JSX return kare) |
| **JSX** | HTML jaisa syntax JS me — `<div className="x">` |
| **Props** | Parent se child ko bheja data (`{ title }`) |
| **State** | Component ka apna badalne wala data |
| **`useState`** | State banane ka hook — `[value, setValue]` |
| **`useEffect`** | Side effects chalana (event listener, API call) |
| **Hook** | React ka special function, `use` se shuru |
| **`useRef`** | Value rakhna jo rerender par bhi bachi rahe, DOM node pakadna |
| **Dumb / Presentational** | Component jo sirf props se render karta hai |
| **Smart / Container** | Component jo state aur logic rakhta hai |
| **State colocation** | State usi component me rakho jahan zarurat hai |
| **Lifting state up** | State ko parent me le jaana jab children ko zarurat ho |
| **Composition** | Chhote components ko jodke bada banana (children prop) |
| **Composition root** | App jahan sab components jode jaate hain |
| **Controlled component** | Value React state se chalti, DOM se nahi |
| **Event handler** | `onClick`, `onChange` — user action ka React function |
| **Conditional render** | `{condition && <JSX/>}` |
| **Key prop** | List me har item ka identity — rerender bug rokta hai |
| **Reconciliation** | React ka naya tree se purana tree compare karna |
| **Virtual DOM** | React ka halka virtual representation of DOM |
| **StrictMode** | Double-render karke common bugs pakadta hai |
| **`ErrorBoundary`** | Crash par blank screen dikhane ke bajaye fallback UI |
| **Custom hook** | `use` se shuru hoane wala khud ka reusable function |

---

## E. Vite / Build

| Term | Matlab |
|---|---|
| **Vite** | Fast dev server + build tool (Next.js se simple) |
| **Dev server** | Code likhte waqt local server jo turant reload karta hai |
| **HMR** | Hot Module Replacement — sirf badli file reload |
| **Build** | Source → production-ready static files |
| **`dist/`** | Build output folder (yahi Pages par upload hota hai) |
| **Bundler** | Bahut saari files ko ek me jodne wala tool |
| **Minification** | Production build me code chhota karna |
| **Tree-shaking** | Unused code automatically hata dena |
| **Code-splitting** | Sirf zaroori code load karna, baaki baad me |
| **Gzip** | Text compress karke size kam karna |
| **Source map** | Built code ko original se jodne wali file (debugging) |
| **Hash** | File content ka short ID — caching ke liye |
| **`base` config** | Assets kis URL path se serve honge |

---

## F. CSS

| Term | Matlab |
|---|---|
| **CSS Variables** | `--name: value;` — dobara istemal ho sakta hai |
| **Design token** | Ek design decision ko naam dena (colour, spacing, radius) |
| **`tokens.css`** | Sab design tokens ki file |
| **`data-theme` attribute** | `<html data-theme="dark">` se poori theme badalna |
| **Custom property** | CSS variable ka official naam |
| **Gradient** | Ek se do ya zyada colours ka smooth mix |
| **`linear-gradient(150deg, a, b)`** | Direction + colours |
| **`background-clip: text`** | Gradient ko text ka shape kar dena |
| **Flexbox** | 1D layout (ek line me排列) |
| **Grid** | 2D layout (rows + columns) |
| **`auto-fit` + `minmax()`** | Responsive grid bina media query ke |
| **`clamp()`** | `clamp(min, preferred, max)` — fluid type scale |
| **Pseudo-element** | `::before` / `::after` — content CSS se generate |
| **Specificity** | Kaunsa rule jeeta — inline > id > class > element |
| **Cascade** | Rules conflict ho to priority order |
| **`z-index`** | Layer order |
| **`overflow-x: auto`** | Horizontal scrolling container |
| **`scroll-snap`** | Scroll rok ke "click" feel |
| **Reflow / Repaint** | Browser ka layout dobara banana / sirf colour badalna |
| **FOUC** | Flash of Unstyled Content — style load hone se pehle |

---

## G. Accessibility (a11y)

| Term | Matlab |
|---|---|
| **WCAG** | Web Content Accessibility Guidelines (standards) |
| **WCAG AA** | Conformance level — 4.5:1 normal, 3:1 bade text |
| **Contrast ratio** | Text aur background ka contrast (1:1 → 21:1) |
| **Semantic HTML** | Sahi tag ka use (`<nav>`, `<main>`, `<ul>`) |
| **Landmark** | Page ke main zones (`header`, `main`, `footer`) |
| **Skip link** | Keyboard user ko seedha content pe le jaane wala link |
| **`aria-*`** | HTML me extra accessibility info (attributes) |
| **Accessible name** | Button/link ka screen-reader wala naam (`aria-label`) |
| **Focus ring** | Keyboard focus ki visual indication |
| **`:focus-visible`** | Sirf tab-key focus par ring (mouse click par nahi) |
| **Tab order** | Tab key ka order — DOM order follow karta hai |
| **Roving tabindex** | Ek group me sirf active item `tabIndex=0` |
| **Screen reader** | Blind users ke liye voice (NVDA, JAWS, VoiceOver) |
| **Colour not the only signal** | Sirf range na ho — text/icon bhi ho |
| **`prefers-reduced-motion`** | User ne animation band ki ho |

---

## H. Testing

| Term | Matlab |
|---|---|
| **Unit test** | Ek function/function ko alag test karna |
| **Integration test** | Components ko saath me test karna |
| **E2E test** | Poora user journey, real browser me |
| **Vitest** | Vite ka test runner |
| **React Testing Library (RTL)** | Components test karne ke liye (user ki tarah query karo) |
| **jsdom** | Node me chalne wala fake browser DOM |
| **`userEvent`** | Real keyboard/mouse events simulate karta hai |
| **Mock** | Kisi cheez ka nakli version (network, module) |
| **Spies / stubs** | Function ko observe ya replace karna |
| **Coverage** | Kitna code tests ne touch kiya (%) |
| **Assertion** | "Ye hona chahiye" — `expect(x).toBe(y)` |
| **Flaky test** | Kabhi pass kabhi fail — unreliable |
| **Regression** "phir se toot gaya" | Pehle theek tha, fix ke baad wapas bug aa gaya |
| **TDD** | Test pehle likhna, phir code |
| **Gate** | Fail hone par aage nahi badhne wali check |

---

## I. This project

| Term | Matlab |
|---|---|
| **Smart / Dumb component** | Logic wala vs sirf render wala |
| **Merge anchor** | `/* ===== anchor:xyz ===== */` — parallel branches me conflict kam karne ke liye |
| **Commit convention** | `type(scope): kya kiya` — `feat`, `fix`, `docs`, `chore` |
| **`--no-ff` merge** | Har merge ka apna commit — history me dikhta hai |
| **Branch-per-concern** | Ek feature = ek branch |
| **Self-test** | Tool ka apna test (audit ke liye audit) |
| **False positive** | Tool ne galti se FAIL bola |
| **Trade-off** | "Ye milega, par ye chhunga" |
| **Worst-case candidate** | Audit me: possible backgrounds me sabse kharab wala |

---

## J. NFR targets (quick reference)

| NFR | Target | Actual |
|---|---|---|
| NFR-03 Bundle | < 200 KB gzip | 81 KB ✅ |
| NFR-11 Contrast | WCAG AA dono themes | DARK 4.72 / LIGHT 3.10 ✅ |
| NFR-01 Responsive | 375 / 768 / 1440 | ✅ |
| NFR-05 Motion | `prefers-reduced-motion` | ✅ |

---

**Aur koi shabd confuse kare?** Doc me add kar lo — glossary badhna chahiye,
taaki agle baar dobara na padho.