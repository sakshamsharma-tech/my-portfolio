# 01 — ANALYSIS (Requirement Gathering)

> SDLC Phase 1. Iska matlab: **"Kya banana hai?"** — iske liye humein pata hona chahiye ki
> kaun use karega, kya problem solve hoga, aur "done" kya hoga.
> Yahan hum <kbd>User Story</kbd> + <kbd>Acceptance Criteria</kbd> likhte hain — yehi Testing phase ka base banega.

---

## 1.1 Problem Statement

Ek developer ko apna kaam online dikhana hota hai — recruiters, clients aur khud ke liye.
PDF resume boring lagta hai aur usme "kaam" dikhne ki jagah sirf "words" hote hain.

**Problem:** Developer ke paas skills/projects ka live proof nahi hota.
**Solution:** Ek responsive personal portfolio website jo live ho, fast ho, aur recruiter
ko 30 second me bata de ki "yeh kaun hai aur isne kya banaya hai".

---

## 1.2 Stakeholders (kaun impacted hai)

| Stakeholder | Kya chahta hai |
|---|---|
| Recruiter / HR | 30 second me skill + proof samajhna, phone/email par seedha contact |
| Client (freelance) | Past work + stack + availability |
| Khud ka developer (owner) | Bina coding ke naam/links/projects badal sake (content alag file me) |
| Engineering team | Clean code, tests, reproducible deploy |

---

## 1.3 Personas

**Persona 1 — "Riya, Technical Recruiter"**
> 6 second me scroll karti hai, mobile pe dekhti hai. Sirf dekhti hai ki
> React dikhta hai ya nahi, aur ek reachable contact hai ya nahi.

**Persona 2 — "Dev, Freelance Client"**
> Specific project dhundhta hai — e.g. "dashboard" ya "payment" — dekhna chahta hai
> ki usne real problem solve ki ya nahi.

---

## 1.4 Scope

### In Scope (v1 me banayenge)
1. Hero section — naam, role, 2 CTA buttons
2. About — chhoti intro + quick stats
3. Skills — category-wise tags
4. Projects — **filterable** grid (yeh main interactive feature hai)
5. Experience — vertical timeline
6. Education + Certifications
7. Contact form — **client-side validation** ke saath
8. Dark / Light theme toggle (localStorage me persist)
9. Mobile responsive + sticky nav
10. Contact form + theme toggle ka automated test coverage

### Out of Scope (v1 me nahi — future me)
- Backend / real email sending (form abhi simulate karta hai)
- Blog / CMS integration
- Analytics (Google Analytics)
- Admin panel se content edit karna
- SEO ke liye dynamic sitemap (static meta tags kaafi hain)

**Yeh decision kyun?** Scope control SDLC ka "Planning" hissa hai. Zyada scope =
zyada time + zyada bug. Pehle core value deliver karo.

---

## 1.5 Functional Requirements (FR) — "System kya karega"

| ID | Requirement |
|---|---|
| FR-01 | Website par ek sticky header dikhega jismein logo + navigation links + theme toggle hon |
| FR-02 | Mobile (<= 768px) par navigation ek menu button ke peeche collapse hogi |
| FR-03 | Hero section `profile` data se naam, role aur summary render karega |
| FR-04 | Skills 4 categories me group hokar render hongi |
| FR-05 | Projects grid me saare projects render honge |
| FR-06 | Projects section me tag filter buttons honge; click karne par sirf us tag wale projects dikhenge |
| FR-07 | "All" filter click karne par saare projects wapas dikhenge |
| FR-08 | Experience vertical timeline me chronological order me render hoga |
| FR-09 | Contact form 3 fields lega: Name, Email, Message |
| FR-10 | Form submit: koi field khaali ho to field-specific error message dikhega |
| FR-11 | Form submit: email format galat ho to email error message dikhega |
| FR-12 | Form submit: message < 20 characters ho to error message dikhega |
| FR-13 | Form valid hone par success message + "Open in mail app" link dikhega |
| FR-14 | Theme toggle dark/light switch karega |
| FR-15 | Theme choice `localStorage` me save hogi aur reload ke baad bhi rahegi |
| FR-16 | Footer me social links aur copyright hon |
| FR-17 | Saare content ek `src/data/` folder me hoga — components me hardcode text nahi |

## 1.6 Non-Functional Requirements (NFR) — "System kaisa hona chahiye"

| ID | Requirement | Kaise check karenge |
|---|---|---|
| NFR-01 | Mobile responsive | 375px, 768px, 1440px pe manual check |
| NFR-02 | Lighthouse Performance >= 90 | Lighthouse |
| NFR-03 | Build size < 200 KB gzip | Vite output |
| NFR-04 | Keyboard accessible (Tab, Enter) | Manual + `role`/`aria` usage |
| NFR-05 | WCAG contrast >= 4.5:1 | Colour tokens picked accordingly |
| NFR-06 | `prefers-reduced-motion` respected | CSS media query |
| NFR-07 | No console errors | Browser console |
| NFR-08 | 100% automated test pass | `npm test` |

## 1.7 Constraints

1. **No backend** — contact form simulate karega (v1 constraint, product decision).
2. **Static hosting** — GitHub Pages (free, HTTPS, repo se linked).
3. **Hash-based anchors** (`#projects`) — taaki Pages pe deep-link 404 na de.

## 1.8 Risks

| Risk | Probability | Mitigation |
|---|---|---|
| Content placeholder reh gaya | Medium | README me "1 file me change karo" step likha hai |
| Tests CI me fail | Low | Workflow me `npm test` step |
| Pages enable na ho | Medium | Actions workflow + manual `npm run deploy:pages` fallback |
| Mobile layout toot gaya | Low | NFR-01 manual checklist |

---

## 1.9 User Stories + Acceptance Criteria

> **Acceptance Criteria** = wo conditions jo poori hone par story "DONE" maani jaati hain.
> Phase 4 (Testing) me hum inhi ko test cases bana kar verify karenge.

### US-01 — Recruiter ko hero info dikhe
**As a** recruiter, **I want** page kholte hi naam + role + CTA dikhe, **so that** main 5 second me samajh saku ki yeh kaun hai.

- AC-01.1 Naam screen reader + visually dono ko readable ho
- AC-01.2 Role aur 1-line summary dikhe
- AC-01.3 Kam se kam 2 CTA buttons hon
- AC-01.4 Mobile pe CTA stack ho (side me nahi)

### US-02 — Projects filter
**As a** client, **I want** projects ko tag se filter kar sakein, **so that** mujhe apne kaam se related projects dikhein.

- AC-02.1 Saare projects initially render hon
- AC-02.2 Har unique tag ka ek filter button ho
- AC-02.3 Filter click karne par sirf us tag wale projects dikhein
- AC-02.4 "All" click karne par sab projects wapas aayein
- AC-02.5 Active filter visually highlighted ho

### US-03 — Contact validation
**As a** visitor, **I want** galat form submit karne par turant bata mil jaye, **so that** main galti se message na bhejun.

- AC-03.1 Empty submit → Name, Email, Message teeno errors dikhein
- AC-03.2 Invalid email (`abc@`) → email-specific error
- AC-03.3 Message < 20 chars → length error
- AC-03.4 Valid submit → success message + mailto link
- AC-03.5 Error message `role="alert"` ho (screen reader announce kare)

### US-04 — Theme persistence
**As a** visitor, **I want** apni theme choice yaad rahe, **so that** har visit pe dobara switch na karna pade.

- AC-04.1 Toggle click → `data-theme` attribute change ho
- AC-04.2 Choice `localStorage.theme` me save ho
- AC-04.3 Reload ke baad saved theme restore ho

---

## 1.10 Definition of Done (DoD)

Feature "done" tab maana jayega jab:
- [ ] Code `main` branch me merge ho
- [ ] Review pass ho (naming, structure, comments)
- [ ] Automated tests likhe hon aur pass hon
- [ ] NFR checklist (mobile + console + a11y) verify ho
- [ ] Docs update ho

---

**Next phase →** [02 — DESIGN](./02-design.md)