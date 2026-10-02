# 04 — TEST PLAN

> SDLC Phase 4. Analysis me humne AC (Acceptance Criteria) likhe the.
> Test plan batata hai **un AC ko kaise verify karenge** — kaunsa tool,
> kaunsa test type, aur kya manually check hoga.

---

## 4.1 Test Strategy — 3 layers

| Layer | Kya test karta hai | Tool | Kyun zaroori |
|---|---|---|---|
| **Unit** | Pure functions — `validateContact()`, `buildMailto()` | Vitest | Sabse tez, bugs yahin sabse zyada milte hain |
| **Integration** | Components + user actions — tabs, filter, form submit | Vitest + RTL | Real user journey simulate hoti hai |
| **E2E / Audit** | Asli browser me — console errors, 404s, overflow, contrast | Playwright (`playwright-core`) + `contrast-audit.mjs` | JSDOM ki limitations hain; kuch cheezein sirf asli browser me pata chalti hain |

**Kyun teeno layers?** Sirf unit tests likhne wala common trap ye hai ki
tests pass ho jaate hain par page chhota screen pe toot jaata hai.
Isi liye Phase 1 ke review me humne seekha — **DOM me hona ≠ dikhna**.

---

## 4.2 Manual test checklist (automated nahi ho sakte)

Ye cheezein kisi bhi script se verify nahi ho sakti, isliye human check:

- [ ] Font sach me load ho raha hai (offline pe fallback dikhta hai)
- [ ] Gradient text readable hai — brand colours dono themes me
- [ ] Scroll animation "silly" nahi lagti
- [ ] Keyboard se poora page navigate ho sakta hai (Tab → Shift+Tab)
- [ ] Mobile par koi element bahar na nikle (375px par check karo)
- [ ] Dark ↔ light switch karne par koi flash nahi

---

## 4.3 AC → Test mapping

### AC-01 — Hero (1.1 – 1.3)
| AC | Verify | Type | Status |
|---|---|---|---|
| AC-01.1 | Naam, role, tagline render | Integration | ✅ |
| AC-01.2 | CTA buttons `#about` / download resume | Integration | ✅ |
| AC-01.3 | Social icons with `rel="noreferrer noopener"` | Integration | ✅ |

### AC-02 — Projects (2.1 – 2.5)
| AC | Verify | Type | Status |
|---|---|---|---|
| AC-02.1 | Sab projects render | Integration | ✅ |
| AC-02.2 | Filter click → sirf matching cards | Integration | ✅ |
| AC-02.3 | Count text update hota hai | Integration | ✅ |
| AC-02.4 | "All" → sab cards wapas | Integration | ✅ |
| AC-02.5 | Filter state visually mark hoti hai (`aria-pressed`) | Integration | ✅ |

### AC-03 — Contact (3.1 – 3.6)
| AC | Verify | Type | Status |
|---|---|---|---|
| AC-03.1 | Submit par validation chalti hai | Integration | ✅ |
| AC-03.2 | Naam required (min 2) | Unit + Integration | ✅ |
| AC-03.3 | Email format required | Unit + Integration | ✅ |
| AC-03.4 | Message ≥ 20 chars | Unit + Integration | ✅ |
| AC-03.5 | Errors accessible (`role="alert"`, focus, `aria-invalid`) | Integration | ✅ |
| AC-03.6 | Valid form → mailto + success message | Unit + Integration | ✅ |

### AC-04 — Theme (4.1 – 4.3)
| AC | Verify | Type | Status |
|---|---|---|---|
| AC-04.1 | Toggle theme badalta hai | Integration | ✅ |
| AC-04.2 | Choice localStorage me save hoti hai | Integration | ✅ |
| AC-04.3 | Reload par same theme rehta hai | Integration | ✅ |

### AC-05 — YouTube (5.1 – 5.12)
| AC | Verify | Type | Status |
|---|---|---|---|
| AC-05.1 | Section `id="youtube"` render | Integration | ✅ |
| AC-05.2 | 4 primary metrics | Integration | ✅ |
| AC-05.3 | 3 service counters (total 7) | Integration | ✅ |
| AC-05.3.1 | Horizontal scroll strip | Integration | ✅ |
| AC-05.3.2 | Keyboard se scroll (focusable strip) | Integration | ✅ |
| AC-05.3.3 | Partial card cut-off visible | Manual | ✅ |
| AC-05.4 | 6 tabs, pehla active | Integration | ✅ |
| AC-05.5 | Sirf active panel render | Integration | ✅ |
| AC-05.6 | `aria-selected` shift | Integration | ✅ |
| AC-05.7 | Arrow/Home/End keys + wrap-around | Integration | ✅ |
| AC-05.8 | CTA `href="#contact"` | Integration | ✅ |
| AC-05.9 | Header + Footer dono me YouTube link | Integration | ✅ |
| AC-05.10 | "Sample data" label visible | Integration | ✅ |
| AC-05.11 | `target="_blank"` + `rel="noreferrer noopener"` | Integration | ✅ |
| AC-05.12 | Icon ka accessible name "YouTube" | Integration | ✅ |

### AC-06 — Content quality (6.1 – 6.4)
| AC | Verify | Type | Status |
|---|---|---|---|
| AC-06.1 | Sample-data label | Integration | ✅ |
| AC-06.2 | Placeholder values honest | Manual | ✅ |
| AC-06.3 | Numbers data file me, hardcoded nahi | Integration | ✅ |
| AC-06.4 | Tab bullets bhi data file me | Integration | ✅ |

### AC-08 / AC-09 — Experience + Education
| AC | Verify | Type | Status |
|---|---|---|---|
| AC-08.1–08.7 | Section, order, period, points, "Current" badge, `<ol>` semantics, chips | Integration | ✅ |
| AC-09.1–09.3 | Section, degree/school/period, data-driven | Integration | ✅ |

### Non-functional
| NFR | Verify | Tool | Status |
|---|---|---|---|
| NFR-01 | Responsive 375 / 768 / 1440 | Playwright (overflow check) | ✅ |
| NFR-02 | Keyboard navigation | Playwright + RTL | ✅ |
| NFR-03 | Bundle < 200 KB gzip | `vite build` output | ✅ 81 KB |
| NFR-04 | Semantic HTML + ARIA | RTL assertions | ✅ |
| NFR-05 | `prefers-reduced-motion` supported | Code review | ✅ |
| NFR-11 | **WCAG AA contrast, dono themes** | `contrast-audit.mjs` | ✅ DARK 4.72 / LIGHT 3.10 |
| NFR-12 | Dummy data visibly labelled | Integration | ✅ |
| NFR-13 | Scroll strip keyboard-accessible | Integration | ✅ |
| NFR-14 | External links `rel="noreferrer noopener"` | Integration | ✅ |

---

## 4.4 Contrast audit ka self-test (alag se)

Contrast audit khud ek tool hai — aur **tool ka bhi test hona chahiye**.
Warna ek broken audit hamesha "PASS" bolegi aur humein false confidence degi.

```
npm run test:contrast
```

Fixture (`scripts/fixtures/contrast-selftest.html`) me 5 cases hain:
- 3 jaan-boojh kar **FAIL** hone wale (plain, large-text, semi-transparent text)
- 2 **PASS** hone wale — inme se ek wahi case hai jo Phase 1 ka bug tha
  (dark page + semi-transparent gradient stop)

Ye gate **false positives** pakadta hai. Isi liye ye CI me hai.

---

## 4.5 Jaanch kaise chalati hai

```bash
npm test                    # 73 unit + integration tests
npm run test:coverage       # + coverage report
npm run test:contrast       # audit tool ka self-test

# Full audit (preview server chalu hona chahiye)
npm run build && npm run preview
node scripts/contrast-audit.mjs http://localhost:4173
```

**Gate rule:** CI me sab pass hona zaroori hai. Koi bhi fail → merge blocked.