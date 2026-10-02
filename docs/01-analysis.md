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
| **Client (YouTube channel owner)** | **Proof ki channel grow hoga — retention/CTR/brand deals ka evidence** |
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

**Persona 3 — "Mr. Verma, Course Creator"** *(naya — YouTube section ke liye)*
> Apna channel grow karna chahta hai, par video banane se zyada **channel management**
> (SEO, retention, monetization) uski problem hai. Isko dekhna hai ki "isne kisi aur
> ka channel chalaya hai ya nahi" — aur uske liye is section ka maaksad **contact** hai.

---

## 1.4 Scope

### In Scope (v1 me banayenge)
1. Hero section — naam, role, 2 CTA buttons
2. About — chhoti intro + quick stats
3. Skills — category-wise tags
4. **YouTube Channel Management section** — stats strip + 6 clickable tabs (yaani **youTubeChannelManagement** capability dikhana hai)
5. Projects — **filterable** grid (yeh main interactive feature hai)
6. Experience — vertical timeline
7. Education + Certifications
8. Contact form — **client-side validation** ke saath
9. Dark / Light theme toggle (localStorage me persist)
10. Mobile responsive + sticky nav
11. Contact form + theme toggle + YouTube tabs ka automated test coverage

> **YouTube section ka scope kyun?** Owner ka real kaam sirf frontend nahi — wo doosre logon ke
> YouTube channels bhi manage karta hai (scripting, editing, SEO, publishing, analytics,
> monetization, community). Ye ek **doosri revenue stream / service offering** hai, isliye use
> apna section aur apni user story (US-05) maangi gayi — skills list me chipka dena kaafi nahi tha.

### Out of Scope (v1 me nahi — future me)
- Backend / real email sending (form abhi simulate karta hai)
- Blog / CMS integration
- Analytics (Google Analytics)
- Admin panel se content edit karna
- SEO ke liye dynamic sitemap (static meta tags kaafi hain)
- **Real YouTube videos ka embedded player / thumbnails** (pehle phase me — dummy data se kaam chalayenge)

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
| FR-18 | Nav bar me "YouTube" link hoga jo scroll karke YouTube section par le jayega |
| FR-19 | YouTube section me ek **stats strip** hoga — Subscribers, Videos, Views, Niches (chaar primary metrics) |
| FR-20 | Stats strip ke neeche ek secondary row hoga — Channels Managed, Videos Delivered, Growth stat |
| FR-21 | YouTube section me **6 clickable tabs** honge, har ek service area represent karta hoga |
| FR-22 | Tab click karne par active tab ka panel dikhega aur baaki panels hide honge |
| FR-23 | Tabs keyboard se navigate ho sake (Left/Right arrow, Home/End) — sirf mouse na chahiye |
| FR-24 | YouTube section me ek CTA button hoga jo visitor ko Contact section par le jayega |
| FR-25 | YouTube stats dummy/sample data hongi, aur section me visibly **"Sample data"** label lagega (taaki koi na samjhe ki ye asli numbers hain) |
| FR-26 | Header aur Footer ke social icons me YouTube icon add hoga |

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
| NFR-09 | YouTube tabs keyboard se navigate ho (Left/Right arrow, Home/End) aur `role="tablist"/"tab"/"tabpanel"` sahi ho | RTL `userEvent.keyboard` test |
| NFR-10 | Focus indicator background se **3:1** minimum | `scripts/contrast-audit.mjs` + computed outline check |
| NFR-11 | Saare text elements apne *effective* background pe **WCAG AA** — gradient aur semi-transparent bhi mila kar | `node scripts/contrast-audit.mjs` (dono themes, exit 0 = pass) |
| NFR-12 | Dummy/sample data kahin bhi misleading na lage — visibly label lage | Manual + review |

## 1.7 Constraints

1. **No backend** — contact form simulate karega (v1 constraint, product decision).
2. **Static hosting** — GitHub Pages (free, HTTPS, repo se linked).
3. **Hash-based anchors** (`#projects`) — taaki Pages pe deep-link 404 na de.
4. **YouTube stats dummy hongi** — koi real YouTube API call nahi. Data `src/data/youtube.js` me static hai, taaki repo public hone par bhi koi real claim galat na na ho. Baad me API lagana ho toh sirf wahi file badalni hai.
5. **YouTube section me embedded video player nahi** — v1 me sirf service areas + stats. Player se page weight aur consent banner dono badhte.

---

## 1.7.1 YouTube section — shape (owner ke saath finalised)

> Ye section 2026-10-02 ko requirements discussion ke baad decide hua. Owner ne confirm kiya.

**Page me position:** `Skills` ke turant baad, `Projects` se pehle.
Nav link: `YouTube` (About / Skills / **YouTube** / Projects / Experience / Contact)

**Section me 2 blocks:**

1. **Stats strip** — "Dono mix" decide kiya:
   - Primary row (channel metrics): Subscribers, Videos, Views, Niches
   - Secondary row (service proof): Channels Managed, Videos Delivered, Growth

2. **6 clickable tabs** — har tab ek service area. Click → sirf uska panel dikhe.
   Tabs user ne **"sahi 6, content strategy merge karke"** chune:
   | # | Tab | Isme kya hai |
   |---|---|---|
   | 1 | Content Strategy, Thumbnails & SEO | topic planning, niche + competitor research, titles, tags, descriptions, thumbnail design |
   | 2 | Scripting & Editing | script writing, shoot, edit, subtitles, motion graphics |
   | 3 | Publishing & Scheduling | upload, schedule, playlists, end screens, community posts |
   | 4 | Analytics & Growth | watch time, retention curve, CTR analyse karke improve karna |
   | 5 | Monetization & Brand Deals | AdSense, sponsorship, brand collaboration outreach |
   | 6 | Community Engagement | comments reply, collaborations, audience retention |

   *(Content Strategy alag card nahi hai — uska kaam Tab 1 me merge hai, taaki card count consistent rahe.)*

3. **CTA** — "Apna channel grow karna hai?" → button jo Contact section par scroll kare.

**Kya jaan-boojh kar nahi rakha:**
- ❌ Recent videos block — owner ne confirm kiya "sirf service cards". Isliye thumbnails ka sawal moot ho gaya (pehle "local SVG placeholder thumbnails" ka jawab diya tha, par videos block baad me hata diya gaya).
- ❌ Niche chips block — niche sirf section ke subtitle text me mention hoga.
- ❌ YouTube API / real analytics.

**Niche:** "Tech + Lifestyle mix" — dummy channel isi par banaya jayega.

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

### US-05 — YouTube channel management capability dikhe
**As a** business owner, **I want** dekh sakein ki ye developer doosre logon ke YouTube channels
manage karte hain, **so that** main unhe apna channel grow karne ke liye hire kar sakoon.

- AC-05.1 Skills section ke baad YouTube section render ho, aur nav ka "YouTube" link us par scroll kare
- AC-05.2 Stats strip me **4 primary metrics** (Subscribers, Videos, Views, Niches) dikhein
- AC-05.3 Stats strip ke neeche **service proof counters** (Channels Managed, Videos Delivered, Growth) dikhein
- AC-05.4 **6 tabs** render hon; pehla by default active ho
- AC-05.5 Tab click karne par **sirf uska panel** dikhe, baaki panels hidden hon
- AC-05.6 Active tab visually highlighted ho **aur** `aria-selected="true"` ho
- AC-05.7 Right/Left arrow keys se tab switch ho (NFR-09)
- AC-05.8 CTA button click karne par Contact section par scroll ho
- AC-05.9 Header **aur** Footer dono me YouTube social link ho
- AC-05.10 Stats ke paas **"Sample data"** label dikhe (NFR-12)

### US-06 — YouTube dummy data mislead na kare
**As a** visitor, **I want** pata chal jaye ki YouTube numbers sample hain, **so that** main inhe
apni asli track record na samajhoon.

- AC-06.1 Stats strip me visible "Sample data" ya equivalent label ho
- AC-06.2 Label ka contrast WCAG AA pass kare (NFR-11)
- AC-06.3 Dummy numbers `src/data/youtube.js` me hon, component me hardcode nahi (FR-17)

---

## 1.10 Definition of Done (DoD)

Feature "done" tab maana jayega jab:
- [ ] Code `main` branch me merge ho
- [ ] Review pass ho (naming, structure, comments)
- [ ] Automated tests likhe hon aur pass hon
- [ ] NFR checklist (mobile + console + a11y) verify ho
- [ ] Docs update ho
- [ ] Dummy data placeholder ho to README me "1 minute me change karo" step ho (NFR-12)

---

## 1.11 Decision Log

> SDLC me har important decision ka **record** rakhna chahiye — warna 6 mahine baad koi
> (ya tum khud) sochega "ye decision kyun liya tha?" Isliye ADR-lite format me rakhte hain.

| ID | Date | Decision | Kyun | Kisne |
|---|---|---|---|---|
| DL-01 | 2026-10-02 | Personal details placeholder rahenge (`Aarav Sharma`, `example.com` emails, non-existent GitHub repo links) | Repo dummy content ke saath hi push hoga. Asli data baad me `src/data/` se badalna hai — 1 file, 2 minute ka kaam | Owner |
| DL-02 | 2026-10-02 | **GitHub push + Pages deploy sabse aakhir me** | Pehle saare requirements confirm, tests pass, phir deploy. Adhoora deploy karke wapas na lautna pade | Owner |
| DL-03 | 2026-10-02 | YouTube service cards **tabs** me hongi, accordion me nahi | 6 areas ko space-efficient tarike se dikhane ke liye; tab pattern keyboard-friendly hai | Owner |
| DL-04 | 2026-10-02 | Recent videos block YouTube section me **nahi** | Scope chhota rakhte hue; dummy video thumbnails fake lagte | Owner |
| DL-05 | 2026-10-02 | YouTube stats dummy hongi, par **visibly "Sample data"** label lagega | Dummy number ko na pakadna — koi job ya client mislead na ho | Owner |
| DL-06 | 2026-10-02 | Content Strategy card ko Tab 1 me merge kiya (6 cards, 7 nahi) | Card count consistent rakhne ke liye; merge bhi semantically sahi hai | Owner |
| DL-07 | 2026-10-02 | Skill cards nahi, **clickable tabs** chune gaye | Har service area ka detail panel me full space milta hai | Owner |
| DL-08 | 2026-10-02 | Header **aur** Footer dono me YouTube social icon | Social proof ek hi jagah nahi — dono zaroori | Owner |
| DL-09 | 2026-10-02 | Stats strip me **channel metrics + service proof dono** | "Mer channel bada hai" (credibility) aur "main manage karta hoon" (service) — dono angles | Owner |
| DL-10 | 2026-10-02 | `--brand` token ko 2 me toda: `--brand` + `--brand-solid` | Ek colour text-accent aur white-text-background dono ke liye use ho raha tha; dono ka WCAG requirement alag hai | Engineering |

---

## 1.12 Open Questions (ye resolve nahi hue, build se pehle pooch lena)

| # | Sawaal | Kyun zaroori |
|---|---|---|
| Q1 | Kya social links `src/data/profile.js` me YouTube URL kya hoga? (dummy `youtube.com/@...` theek hai?) | Header/Footer link tootega agar URL galat ho |
| Q2 | Contact form ke social icons me YouTube bhi chahiye, ya sirf Header/Footer me? | Consistency check |
| Q3 | Kya tabs ka content `src/data/youtube.js` me poora rahe (saare bullets), ya component me hardcode? | FR-17 kehti hai `src/data/` me — confirm karna hai owner ko |
| Q4 | Stats strip numbers 4 + 3 = 7 total — mobile pe wrap kaise kare? (2 columns? slider?) | NFR-01 mobile checklist |

---

**Next phase →** [02 — DESIGN](./02-design.md)

---

> **📌 Analysis phase me 2 baar update hua (traceability ke liye):**
>
> | Kab | Kya change hua |
> |---|---|
> | Initial | v1 scope — Hero → Contact, FR-01..17, US-01..04 |
> | 2026-10-02 | YouTube Channel Management section add: FR-18..26, NFR-09..12, US-05, US-06, Persona 3, Constraints 4-5, Decision Log (DL-01..10), Open Questions |
>
> Agle phase ka kaam: `docs/02-design.md` me YouTube section ka architecture likhna hai
> (component split, tab state management, `src/data/youtube.js` ka shape).