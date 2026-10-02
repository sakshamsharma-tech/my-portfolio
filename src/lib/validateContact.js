/* ============================================================
   PURE FUNCTION — Contact form validation (FR-22)

   Ye alag file me hai kyun? Do wajah:
     1. TESTABLE — bina UI ke, bina browser ke test ho jaata hai
     2. REUSABLE — same rules future me server-side bhi chahiengi

   Rule: function kuch bhi "side effect" nahi karta. Sirf input leta hai,
   output deta hai. Isliye har test deterministic hai.
   ============================================================ */

/** Neeche diye gaye rules AC-03.1 se AC-03.4 me map hote hain */
export const RULES = {
  name: { required: true, min: 2, max: 60 },
  email: { required: true, max: 254 },
  message: { required: true, min: 20, max: 2000 },
};

/**
 * Email validation.
 *
 * Simple regex hai — poori RFC 5322 compliant nahi (woh itna strict hai ki
 * valid emails bhi reject kar deta hai). Real form backend bhi yahi karta hai.
 *
 * Breakdown:
 *   ^            shuru me kuch nahi
 *   [^\s@]+      local part: koi bhi char, sirf whitespace/@ nahi
 *   @            ek @ (exactly ek — double @ reject hoga)
 *   [^\s@.]+     domain label
 *   (\.[^\s@.]+)+ ek ya zyada dot-separated labels → .com, .co.in
 *   \.[a-z]{2,}  top-level domain, kam se kam 2 letters
 */
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i;

/** Trim + normalise — user ke typing ke galtiyan clean kar deta hai */
const clean = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * Contact form validate karo.
 *
 * @param {{ name?: string, email?: string, message?: string }} values
 * @returns {{ valid: boolean, errors: Record<string,string> }}
 *          `errors` me sirf galat fields ka message hota hai —
 *          sahi fields ke liye kuch nahi (unnecessary error messages confuse karte hain).
 */
export function validateContact(values = {}) {
  const errors = {};

  const name = clean(values.name);
  const email = clean(values.email);
  const message = clean(values.message);

  // ---- Name ----
  if (!name) {
    errors.name = 'Naam likhna zaroori hai.';
  } else if (name.length < RULES.name.min) {
    errors.name = `Naam kam se kam ${RULES.name.min} characters ka hona chahiye.`;
  } else if (name.length > RULES.name.max) {
    errors.name = `Naam ${RULES.name.max} characters se lamba nahi ho sakta.`;
  }

  // ---- Email ----
  if (!email) {
    errors.email = 'Email likhna zaroori hai.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Email sahi format me daalo — jaise aap@example.com';
  } else if (email.length > RULES.email.max) {
    errors.email = 'Email bahut lamba hai.';
  }

  // ---- Message ----
  if (!message) {
    errors.message = 'Message likhna zaroori hai.';
  } else if (message.length < RULES.message.min) {
    // Character counter bhi dikhata hai, par error bhi — sirf counter
    // kaafi nahi, user ko rule samajh nahi aata
    errors.message = `Message kam se kam ${RULES.message.min} characters ka hona chahiye (abhi ${message.length}).`;
  } else if (message.length > RULES.message.max) {
    errors.message = `Message ${RULES.message.max} characters se lamba nahi ho sakta.`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Form ke values se `mailto:` link banao.
 *
 * Kyun mailto aur koi API nahi?
 *  - Is dummy portfolio me koi backend nahi hai (NFR-08: static hosting)
 *  - FormSubmit/Netlify Forms backend maangte hain
 *  - mailto: har device pe kaam karta hai, koi signup nahi
 *
 * ⚠️ Trade-off honestly: mailto user ka default email app kholta hai —
 * message wahan jaati hai, auto-send NAHI hoti. User ko bhejni padti hai.
 * Asli project me backend zaroori hoga.
 */
export function buildMailto(values) {
  const subject = `Portfolio contact — ${clean(values.name) || 'New message'}`;

  const body = [
    clean(values.message),
    '',
    '---',
    `From: ${clean(values.name)}`,
    `Email: ${clean(values.email)}`,
  ].join('\n');

  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}