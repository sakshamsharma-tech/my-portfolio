/**
 * WCAG contrast audit — poora page, dono themes.
 *
 * ── YE TOOL KAISE BANAYA GAYA (aur kyun) ──────────────────────────
 *
 * Version 1 (galat) do galtiyan karta tha:
 *
 *   1. `.gradient-text` ko FALSE POSITIVE deta tha.
 *      Wo CSS hai: `background-clip: text` + `color: transparent`.
 *      Yaani text ko gradient PAINT karta hai, `color` se nahi.
 *      Tool `color: rgba(0,0,0,0)` padhta → ratio 1:1 → galat FAIL.
 *
 *   2. Gradient BACKGROUND wale elements galat background resolve karte the.
 *      `.filter--active` ka bg `background-image` me hai, `background-color` me nahi.
 *      Tool apna transparent bg chhod ke parent ka bg uthata → galat ratio.
 *
 * Is version me:
 *   • gradient-text  → foreground = gradient ke colour STOPS
 *   • gradient bg    → background = gradient ke colour STOPS
 *   • hum minimum ratio lete hain (sabse kharab combination) — WCAG me
 *     "sabse kharab stop" hi count hota hai.
 *   • fully-transparent text jo background-clip:text NAHI hai
 *     → wo asli bug hai, alag category me report hota hai.
 *
 * ── CHALAANE KA TARIKA ────────────────────────────────────────────
 *   node scripts/contrast-audit.mjs [url] [--headed]
 *   default url: http://localhost:4173   (pehle `npm run preview` chalao)
 *
 *   --headed  → browser visibly khulega (khud dekhne ke liye)
 *
 * Exit code: 0 = saare pass, 1 = koi fail
 */

import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const HEADED = args.includes('--headed');
const URL = args.find((a) => !a.startsWith('--')) ?? 'http://localhost:4173';

/* ─────────────────────────  page ke andar chalne wala hissa  ───────────────────────── */

function auditPage() {
  /* ---------- colour helpers ---------- */

  /** '#abc' / '#aabbcc' / '#aabbccdd' / 'rgb()' / 'rgba()' / 'transparent' -> [r,g,b,a] */
  const parse = (input) => {
    if (!input) return null;
    const s = String(input).trim();
    if (s === 'transparent') return [0, 0, 0, 0];

    if (s[0] === '#') {
      let h = s.slice(1);
      if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
      if (h.length < 6) return null;
      const n = parseInt(h.slice(0, 6), 16);
      const a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a];
    }

    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    if (p.length < 3 || p.some(Number.isNaN)) return null;
    return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]];
  };

  /**
   * `background-image` se saare colour stops nikaalta hai.
   * getComputedStyle custom properties (var(--brand)) ko resolve kar deta hai,
   * isliye yahan raw rgb() milte hain — regex kaam karta hai.
   */
  const gradientStops = (bgImage) => {
    if (!bgImage || bgImage === 'none' || !/gradient/i.test(bgImage)) return [];
    const found = bgImage.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)/g);
    if (!found) return [];
    return found.map(parse).filter((c) => c && c[3] > 0);
  };

  /** foreground ko background ke upar paint karo (source-over) */
  const over = (fg, bg) => [
    fg[0] * fg[3] + bg[0] * (1 - fg[3]),
    fg[1] * fg[3] + bg[1] * (1 - fg[3]),
    fg[2] * fg[3] + bg[2] * (1 - fg[3]),
    1,
  ];

  const lum = (c) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };

  const ratio = (a, b) => {
    const l1 = lum(a);
    const l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  /**
   * Candidates ki list chhoti karta hai — par ARBITRARILY nahi.
   *
   * Pehle `slice(0, 12)` tha, jo asli worst cases ko kaat sakta tha
   * (jo bhi pehle aaya, wahi raha). Ab hum **6 sabse dark + 6 sabse light**
   * rakhte hain. Kyun? Caller ko minimum ratio chahiye — aur minimum ratio
   * hamesha do extremes me se ek par aata hai (kisi bhi beech ke colour
   * par nahi). Toh extremes rakhne se koi worst case miss nahi hota.
   */
  const cap = (list, keep = 6) => {
    if (list.length <= keep * 2) return dedupe(list);

    const sorted = [...list].sort((a, b) => lum(a) - lum(b));
    return dedupe([
      ...sorted.slice(0, keep),                      // sabse dark
      ...sorted.slice(-keep),                         // sabse light
    ]);
  };

  const dedupe = (list) => {
    const seen = new Set();
    const out = [];
    for (const c of list) {
      const k = c.map((v) => Math.round(v)).join(',');
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(c);
    }
    return out;
  };

  /** kya ye element apna background TEXT ko paint kar raha hai? */
  const isGradientText = (el) => {
    const cs = getComputedStyle(el);
    const clip = (cs.webkitBackgroundClip || cs.backgroundClip || '').trim();
    return clip === 'text' && gradientStops(cs.backgroundImage).length > 0;
  };

  /**
   * Element ke ancestors tak chalkar background ki "paint stack" banata hai,
   * phir usse OUTERMOST → INNERMOST order me composite karta hai.
   *
   * ⚠️ Composite order hi asli fix hai (2026-10-02). Pehle ye bottom-up tha:
   *   `el` se ancestor ki taraf chalta tha aur har semi-transparent layer ko
   *   us waqt ke candidates pe paint karta tha. Problem: tab tak sirf
   *   **white canvas** candidates me hota tha, kyunki andar kisi node ka
   *   background nahi mila tha.
   *
   *   Iska matlab: `rgba(129,140,248,0.16)` (dark theme ka `--brand-soft`)
   *   ko white pe paint kiya gaya → rgb(235,237,254) → ek BRIGHT background
   *   report hua, jabki asli me wo DARK page ke upar paint hota hai.
   *   `.yt-stat--service` ka label 2.23:1 FAIL dikha, jo galat report tha.
   *
   *   Real browsers me semi-transparent layer apne neeche wale (ancestor)
   *   background ke upar paint hota hai — isliye ab hum pehle poori layer
   *   list banate hain (innermost → outermost), phir ULTA chalate hain.
   *
   * Return: { candidates: [[r,g,b,a], ...], layersFound: bool }
   */
  const backgroundCandidates = (el) => {
    const stack = []; // per-node paint layers, innermost → outermost
    let layersFound = false;

    let node = el;
    while (node && node !== document.documentElement.parentNode) {
      const cs = getComputedStyle(node);
      const isTextClip = isGradientText(node);

      // gradient-text wale element ka gradient BACKGROUND nahi hai
      const stops = isTextClip ? [] : gradientStops(cs.backgroundImage);
      const bgc = parse(cs.backgroundColor);

      // CSS paint order: background-COLOUR sabse neeche, background-IMAGE
      // uske upar. (Ye order galat rakhne se gradient ke neeche ka
      //  background-color ignore ho jata tha.)
      const layerColors = [];
      if (bgc && bgc[3] > 0) layerColors.push(bgc);
      layerColors.push(...stops);

      if (layerColors.length) {
        layersFound = true;
        stack.push(layerColors);
      }

      // ⚠️ Sirf OPAQUE `background-COLOUR` par walk rokna hai.
      //
      // Gradient ke andar ka opaque stop bhi poore element ko cover NAHI
      // karta — wo sirf us position ka colour hai (interpolation beech me
      // kuch aur deti hai). Pehle yahan `layerColors.some(opaq)` tha, jisse
      // `.yt-stat--service` par walk ruk gaya aur uske 16%-alpha stop ko
      // white canvas pe paint kiya gaya → rgb(235,237,254) ka jhootha
      // bright background → 2.23:1 ka jhootha FAIL.
      if (bgc && bgc[3] === 1) break;
      node = node.parentElement;
    }

    // Sabse neeche: white canvas. Phir outermost → innermost paint karo.
    let candidates = [[255, 255, 255, 1]];
    for (let i = stack.length - 1; i >= 0; i -= 1) {
      const next = [];
      for (const base of candidates) {
        // ⚠️ Yahan koi `break` NAHI daalna. Layer ke SAARE colour stops
        // candidates hain — gradient me "sabse kharab stop" hi count hota hai.
        for (const col of stack[i]) next.push(over(col, base));
      }
      candidates = cap(next);
    }

    return { candidates, layersFound };
  };

  /* ---------- audit shuru ---------- */

  const rows = [];
  const invisibleText = [];
  const seen = new Set();

  document.querySelectorAll('*').forEach((el) => {
    // sirf un elements jin ke apne visible text nodes hain
    const ownText = [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
    );
    if (!ownText) return;

    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    if (Number(cs.opacity) === 0) return;

    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const sel =
      el.tagName.toLowerCase() +
      (typeof el.className === 'string' && el.className.trim()
        ? '.' + el.className.trim().split(/\s+/).join('.')
        : '');

    const gradientText = isGradientText(el);
    const textColor = parse(cs.color);
    const ownStops = gradientStops(cs.backgroundImage);

    // ── invisible text: colour transparent hai par gradient-text bhi nahi ──
    if (!gradientText && textColor && textColor[3] === 0) {
      invisibleText.push({ selector: sel, text: el.textContent.trim().slice(0, 40) });
      return;
    }

    const { candidates: bgs } = backgroundCandidates(el);
    if (!bgs.length) return;

    // foreground candidates: gradient-text ho to stops, warna text colour
    let fgs;
    if (gradientText) {
      fgs = ownStops.length ? ownStops : [textColor];
    } else {
      fgs = [textColor];
    }
    if (!fgs.length) return;

    // sabse kharab (minimum) ratio — WCAG me wahi count hota hai
    let worst = Infinity;
    let worstFg = fgs[0];
    let worstBg = bgs[0];
    for (const fg of fgs) {
      // semi-transparent text ko background pe pehle composite karo
      for (const bg of bgs) {
        const effectiveFg = fg[3] < 1 ? over(fg, bg) : fg;
        const r = ratio(effectiveFg, bg);
        if (r < worst) {
          worst = r;
          worstFg = effectiveFg;
          worstBg = bg;
        }
      }
    }

    const sizePx = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    // WCAG "large text" = >=24px, ya >=18.66px + bold
    const isLarge = sizePx >= 24 || (sizePx >= 18.66 && weight >= 700);
    const required = isLarge ? 3 : 4.5;

    const key = `${sel}|${Math.round(worst * 100)}|${required}`;
    if (seen.has(key)) return;
    seen.add(key);

    const rgb = (c) => `rgb(${c.slice(0, 3).map(Math.round).join(', ')})`;

    rows.push({
      selector: sel,
      text: el.textContent.trim().slice(0, 38),
      kind: gradientText ? 'gradient-text' : ownStops.length ? 'text-on-gradient' : 'plain',
      fg: rgb(worstFg),
      bg: rgb(worstBg),
      fontSize: `${sizePx}px`,
      weight,
      ratio: +worst.toFixed(2),
      required,
      pass: worst >= required,
    });
  });

  return { rows, invisibleText };
}

/* ─────────────────────────  node runner  ───────────────────────── */

async function launch() {
  const attempts = [{ channel: 'chrome' }, { channel: 'msedge' }, {}];
  let lastError;
  for (const opts of attempts) {
    try {
      return await chromium.launch({ ...opts, headless: !HEADED });
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    `Browser launch nahi hua. Ek installed browser chahiye (Chrome/Edge).\n${lastError?.message ?? ''}`,
  );
}

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

let exitCode = 0;

try {
  await page.goto(URL, { waitUntil: 'networkidle' });

  for (const theme of ['dark', 'light']) {
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);

    // poori page scroll karo taaki sab reveal-wale elements visible ho jaayein
    await page.evaluate(async () => {
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((r) => setTimeout(r, 1400));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
    });

    const { rows, invisibleText } = await page.evaluate(auditPage);
    const fails = rows.filter((r) => !r.pass).sort((a, b) => a.ratio - b.ratio);
    const lowest = rows.length ? Math.min(...rows.map((r) => r.ratio)) : 0;

    const line = '='.repeat(70);
    console.log(`\n${line}`);
    console.log(`THEME: ${theme.toUpperCase()}   (${rows.length} unique text styles)`);
    console.log(`Lowest ratio: ${lowest}:1`);
    console.log(line);

    if (fails.length === 0) {
      console.log('PASS — har text element apne effective background pe WCAG AA par hai.');
    } else {
      exitCode = 1;
      console.log(`FAIL — ${fails.length} element(s) WCAG AA se neeche:\n`);
      for (const f of fails) {
        console.log(`  ${String(f.ratio).padStart(5)}:1  (chahiye ${f.required})  ${f.selector}`);
        console.log(`          "${f.text}"  ${f.fontSize} w${f.weight}  [${f.kind}]`);
        console.log(`          ${f.fg} on ${f.bg}\n`);
      }
    }

    if (invisibleText.length) {
      exitCode = 1;
      console.log(`  ALERT: ${invisibleText.length} element(s) ka text fully transparent hai`);
      invisibleText.forEach((e) => console.log(`          ${e.selector}  "${e.text}"`));
    }
  }
} finally {
  await browser.close();
}

process.exit(exitCode);
