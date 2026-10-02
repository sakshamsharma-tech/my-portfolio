# 03 — DEVELOPMENT PLAN & GIT STRATEGY

> SDLC Phase 3 (Planning + Development). Yahan hum **kaam ko chhote tasks me todte hain**
> aur decide karte hain ki **har task apni branch me kaise jayegi**.

---

## 3.1 Task Breakdown (WBS — Work Breakdown Structure)

| # | Task | Depends on | Branch | Estimate |
|---|---|---|---|---|
| 1 | Project scaffold + `.gitignore` | — | `chore/scaffold` | 5 min |
| 2 | SDLC docs (Analysis + Design) | 1 | `docs/sdlc` | 30 min |
| 3 | Theme system + Header + Nav | 1 | `feature/theme-system` | 40 min |
| 4 | Hero + About sections | 3 | `feature/hero-about` | 40 min |
| 5 | Skills section | 4 | `feature/skills` | 30 min |
| 6 | Projects section (filter logic) | 5 | `feature/projects` | 60 min |
| 7 | Experience + Education + Footer | 6 | `feature/experience-education` | 45 min |
| 8 | Contact form + validation | 7 | `feature/contact-form` | 60 min |
| 9 | Reveal animations + BackToTop + polish | 8 | `chore/polish` | 30 min |
| 10 | Acceptance test suite | 9 | `test/acceptance-suite` | 60 min |
| 11 | CI/CD + GitHub Pages workflow | 10 | `ci/pages-deploy` | 30 min |
| 12 | Live deploy + verification | 11 | `release/v1.0.0` | 30 min |

> **Estimate kya hota hai?** Ek experienced developer ko ye kaam kitne time me karne me
> lagta hai. Project planning me use hota hai — deadline aur cost decide karne ke liye.

---

## 3.2 Branch Naming Convention (Conventional + type prefix)

```
feature/<kya-bana>        → naya feature        e.g. feature/contact-form
fix/<kya-toota>           → bug fix             e.g. fix/mobile-nav-overlap
test/<kya-test>           → tests               e.g. test/acceptance-suite
chore/<kya-setup>         → config/deps         e.g. chore/scaffold
docs/<kya-doc>            → documentation       e.g. docs/sdlc
ci/<kya-ci>               → CI/CD               e.g. ci/pages-deploy
release/<version>         → release branch      e.g. release/v1.0.0
```

**Branch kab banate hain?** Feature start karne se pehle. **Kab merge karte hain?**
Feature + tests done hone ke baad (Definition of Done).

---

## 3.3 Commit Message Convention (Conventional Commits)

Format: `<type>: <short description>`

| Type | Kab use karo |
|---|---|
| `feat` | naya feature (FR implement hua) |
| `fix` | bug fix |
| `test` | test add/update |
| `docs` | documentation change |
| `style` | sirf formatting (code logic nahi badla) |
| `refactor` | code restructure, behaviour same |
| `chore` | build/deps/config |
| `ci` | workflow/automation |

**Achha message:**
```
feat(contact): add client-side validation with field errors
```
**Bura message:** `update kiya`, `changes`, `asdfgh`

Rules: present tense (`add`, not `added`), 1 line ≤ 72 chars, optional scope `(area)`,
body me **kyu** likho agar *kya* obvious nahi hai.

---

## 3.4 Git Workflow (jo is project me follow kiya gaya)

```
        ┌────────────────────────── main (production-ready) ──────────────────────────┐
        │                                                                              │
        ├── chore/scaffold ──┐                                                          │
        ├── docs/sdlc ───────┤                                                          │
        ├── feature/theme-system ┐                                                      │
        ├── feature/hero-about ──┤                                                      │
        ├── feature/skills ──────┤                                                       │
        ├── feature/projects ────┤                                                       │
        ├── feature/experience-education ──┤                                             │
        ├── feature/contact-form ──────────┤                                             │
        ├── chore/polish ──────────────────┤                                             │
        ├── test/acceptance-suite ─────────┤                                             │
        ├── ci/pages-deploy ───────────────┤                                             │
        └── release/v1.0.0 ────────────────┘                                             │
                                          ▲                                               │
                                          └───────── merge (--no-ff) ────────────────┘
```

**Flow:**
1. `git switch main` → `git pull` (latest lao)
2. `git switch -c feature/xyz` (naya branch banao)
3. Kaam karo → `git add .` → `git commit` (chhote commits)
4. `npm test` chalao
5. `git switch main` → `git merge --no-ff feature/xyz` (merge with history)
6. Branch delete: `git branch -d feature/xyz`
7. `git push origin main`

**`--no-ff` kyun?** Har feature ka merge ek alag commit dikhta hai. History me pata
chalta hai "yeh feature kab add hua" — merge commit se.

---

## 3.5 Remotes (Practice ke liye local remote)

Is project me **2 remotes** hain — yeh practice ke liye bahut useful hai:

| Remote | URL | Kaun hai |
|---|---|---|
| `origin` (pehle) | `D:/dev/portfolio-remote.git` | **local bare repo** — practice ke liye. `git push`/`pull`/`clone` yahin se seekhna |
| `origin` (baad me) | `https://github.com/<user>/<repo>.git` | Asli GitHub repo → GitHub Pages deploy |

**Local bare repo kya hai?** `git init --bare` se banta hai — yeh "remote server" ka
local simulation hai. Isme koi working files nahi hote, sirf history.

**Kaunsa kya sikhata hai:**
```bash
git push -u origin feature/xyz      # nayi branch remote pe bhej do
git fetch origin                    # sirf data lao (merge nahi)
git pull                            # fetch + merge
git push                            # local commits bhejo
git clone <url>                     # repo ka copy banao
git remote -v                       # kaunse remotes hain
```

Phir deploy ke waqt:
```bash
git remote rename origin local      # practice wala backup ho jayega
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

---

## 3.6 Conflict Resolution Plan (hota hai toh kya karo)

Conflict tab aata hai jab **do branches ek hi line ko alag-alag badlengi**.

```bash
git merge feature/skills
# → CONFLICT (content): Merge conflict in src/styles/tokens.css

git status                      # 1. kaun se files conflict me hain
# open file and look for:
#   <<<<<<< HEAD          ← tera merge wala (current branch)
#   =======
#   >>>>>>> feature/skills ← doosri branch wala

# 2. markers hatao, dono ka sahi combo likho, save

git add src/styles/tokens.css   # 3. resolved mark karo
git commit                      # 4. merge commit banao (message default rakho)
```

**Golden rules:**
- Kabhi bhi `git merge --abort` se ghabrao mat karo (yani hota nahi hai, wo **revert** hota hai)
- Conflict sirf tab resolve karo jab samajh aaye ki **dono change chahiye**
- `--theirs` / `--ours` = ek side jeeetni hai (usually galat choice)

**Is project me ek deliberate conflict bhi kiya gaya** (tokens.css me do branches ne
alag-alag tokens add kiye) — real practice ke liye.

---

## 3.7 Versioning (Semantic Versioning)

`MAJOR.MINOR.PATCH` → `1.0.0`

| Change | Type | Example |
|---|---|---|
| Bug fix, kuch toota hua | PATCH | `1.0.1` |
| Naya feature (backward compatible) | MINOR | `1.1.0` |
| Bhari/broking change | MAJOR | `2.0.0` |

Release pe tag lagta hai:
```bash
git tag -a v1.0.0 -m "Portfolio v1 — live on GitHub Pages"
git push origin v1.0.0
```

---

## 3.8 Risk Register → Mitigation Tasks

| Risk | Task jisse mitigate hota hai |
|---|---|
| Content reh gaya | `README.md` "Customize in 1 minute" section |
| Tests fail ho jaayein | Task 10 + CI me `npm test` step |
| Pages enable na ho | Actions workflow + manual fallback script |
| Merge conflict | Task 5 + 6 me deliberate conflict practice |

---

**Next phase →** Development start (Tasks 1–9) → [04 — Test Plan](./04-test-plan.md)