# 06 — DEPLOYMENT

> SDLC Phase 5. Ye doc batata hai ki site **live kaise** jayegi.

---

## 6.1 Hosting: GitHub Pages (free)

**Kyun GitHub Pages?**
- Free hai (private repo me Pro plan chahiye, $4/month)
- Git ke saath built-in — alag hosting account nahi
- HTTPS + CDN automatically
- GitHub Actions se auto-deploy ho sakta hai

⚠️ **Important limit:** Free plan me repo **PUBLIC** hona zaroori hai.
Private repo Pages nahi chala sakta (bina paid plan ke).

---

## 6.2 Repo settings (ek baar, manual)

1. Repo → **Settings** → **Pages**
2. **Source:** `GitHub Actions` chuno (dropdown me "Deploy from a branch"
   ya "GitHub Actions" — hume Actions chahiye)
3. **Save**

> Workflow file already repo me hai. Ye ek baar ka setting hai —
> iske baad har push apne aap deploy hoga.

---

## 6.3 Automatic deploy (recommended) — `.github/workflows/deploy.yml`

Har `main` push par ye 3 steps chalti hain:

```
┌──────────────┐   fail    ┌─────────────┐   fail    ┌──────────────┐
│  1. TEST     │ ────────► │  2. BUILD   │ ────────► │  3. DEPLOY   │
│              │           │             │           │              │
│ npm test     │           │ vite build  │           │ Pages me     │
│ contrast     │           │ base path   │           │ publish      │
│ self-test    │           │ set karna   │           │              │
└──────────────┘           └─────────────┘           └──────────────┘
       ↓ pass                      ↓ pass                      ↓
       └───────────────────────────┴──────────────────────────┘
                                   LIVE
```

**Step 1 — Test.** `npm ci`, `npm test`, `npm run test:contrast`.
Aapka test suite + contrast audit ka self-test.

**Step 2 — Build.** `vite build` with `VITE_BASE_PATH`.

**Step 3 — Deploy.** `actions/deploy-pages` artifact upload karta hai.

**Dependencies chhoti (`needs:`) chain me hain** — iska matlab test fail hua
to build aur deploy dono **skip** ho jaate hain. Galat code kabhi live nahi jayega.

### ⚠️ Sabse important step: `base path`

Pages site **root par nahi**, balki path ke neeche hoti hai:

```
❌ https://sakshamsharmatech.github.io          ← galat
✅ https://sakshamsharmatech.github.io/my-portfolio   ← sahi
```

Isliye Vite ko batana padta hai ke assets kahan se serve honge:

```yaml
env:
  VITE_BASE_PATH: /${{ github.event.repository.name }}/
```

`vite.config.js` me:

```js
base: process.env.VITE_BASE_PATH || '/',
```

Local dev me `VITE_BASE_PATH` undefined hota hai → `base: '/'` (normal).

> **⚠️ Warning:** Is setting ko bhoolne ka classic symptom —
> homepage dikhti hai par **kuch bhi styled nahi**, browser console me
> `404 (Not Found)` assets ke liye. Local pe test karo:
> ```bash
> VITE_BASE_PATH=/my-portfolio/ npm run build
> npx vite preview     # → http://localhost:4180/my-portfolio/
> ```

---

## 6.4 First deploy (manual steps)

```bash
# 1. Local origin ka naam badlo (practice remote tha)
git remote rename origin local

# 2. GitHub remote add karo
git remote add origin https://github.com/sakshamsharmatech/my-portfolio.git

# 3. Push
git push -u origin main
```

Phir repo me **Actions** tab kholo — workflow dikhega, "Enable workflow" dabao.
2–3 min me live URL par site aa jayegi:

```
https://sakshamsharmatech.github.io/my-portfolio
```

### Login issue (expected hai)

Git Credential Manager OAuth browser me karta hai — terminal se nahi.
Pehla `git push` par browser khulega, wahan sign in karo, wapas aa jao.

---

## 6.5 Manual deploy (fallback)

Agar Actions kisi wajah se na chale (workflow permission issue etc.):

```bash
npm run deploy:pages
```

Ye `gh-pages` package use karta hai — build karke **separate `gh-pages`
branch** me push karta hai. Pages us branch se serve karega.

⚠️ Dono methods ek saath mat chalao — dono ek hi branch push karte hain
aur ek dusre ko overwrite kar denge. **Ek chuno.**

---

## 6.6 Custom domain (future, optional)

Repo → Settings → Pages → **Custom domain**. Ek DNS record chahiye:

| Type | Name | Value |
|---|---|---|
| CNAME | `@` | `sakshamsharmatech.github.io` |
| A | `www` | `185.199.108.153` (ya CNAME → `sakshamsharmatech.github.io`) |

HTTPS auto-on ho jaata hai, lekin **"Enforce HTTPS"** checkbox zaroor on karo.

---

## 6.7 Rollback

Pages me pichla deployment har build ke baad automatically save hota hai.

**Rollback karna hai to:**
1. `git log --oneline` se pichla working commit dhoondo
2. Us commit ko revert karo:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
3. Workflow naya build karega → site wapas pichle state par.

> `git revert` isliye, `git reset` nahi — kyunki re-deploy ki history
> maintain rehni chahiye (audit ke liye).

---

## 6.8 Troubleshooting

| Problem | Reason | Fix |
|---|---|---|
| Site khuli par **unstyled** | `base path` galat | Workflow me `VITE_BASE_PATH` check karo |
| Actions me "Permission denied" | Workflow permissions | Settings → Actions → General → "Read and write permissions" |
| Workflow tab me dikha hi nahi | Disable hai | Actions tab → "Enable workflow" |
| 404 on assets locally | Base path set nahi | `VITE_BASE_PATH=/repo/ npm run build` |
| Changes live nahi ho rahe | Push `main` par nahi hua | `git branch --show-current` check karo |
| Deploy hi nahi hua | Tests fail | Actions me red X dekho, logs padho |

---

## 6.9 Deployment checklist (har release se pehle)

- [ ] `npm test` — sab pass
- [ ] `npm run test:contrast` — pass
- [ ] `npm run build` — no errors
- [ ] Bundle size < 200 KB
- [ ] `git status` clean, `main` par
- [ ] Base path sahi repo naam se hai
- [ ] README me link sahi hai
- [ ] Personal data replace ki (agar release kar rahe ho)

**Phir:** `git push origin main` → wait → verify live URL.