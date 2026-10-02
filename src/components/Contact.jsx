import { useState } from 'react';
import Field from './Field.jsx';
import { validateContact, buildMailto, RULES } from '../lib/validateContact.js';
import { profile } from '../data/profile.js';

/**
 * Contact — contact form + details (SMART component).
 *
 * Ye form ke liye SMART hai kyunki usse state chahiye (values + errors).
 * Baaki sab section DUMB hai. Ye wahi jagah hai jahan logic zaroori hai.
 *
 * Design decisions:
 *
 * 1. **Validate on submit, phir validate on change** (AC-03.1)
 *    Har keystroke par error dikhana UX bura hai — user type karta hua
 *    beech me error dekh ke confuse hota hai. Isliye:
 *      - pehli baar submit → saare errors dikhao
 *      - uske baad jo field user ne touch kiya → sirf usi ka error update
 *      - `touched` set track karta hai ki kaunsa field chhua gaya
 *
 * 2. **`noValidate`** (AC-03.1)
 *    Browser ka apna validation bubble inconsistent hai aur message English
 *    me aata hai. Humein apna controlled validation chahiye. `noValidate`
 *    browser wale ko rokta hai.
 *
 * 3. **No backend → mailto** (NFR-08)
 *    `buildMailto()` user ke form ko mail client me bhej deta hai.
 *    Static hosting me koi server nahi hai. Docs me clearly likha hai.
 */
export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const charsLeft = RULES.message.max - values.message.trim().length;

  function handleChange(event) {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };

    setValues(nextValues);

    // Sirf touched field ka error turant update karo
    if (touched[name] || submitted) {
      const { errors: nextErrors } = validateContact(nextValues);
      setErrors(nextErrors);
    }
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const { errors: nextErrors } = validateContact(values);
    setErrors(nextErrors);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const { valid, errors: nextErrors } = validateContact(values);
    setErrors(nextErrors);
    setSubmitted(true);

    if (!valid) {
      // Focus pehle galat field pe — keyboard/screen-reader user ke liye
      // zaroori, warna error dikhe par focus kahin aur rahe
      const firstError = Object.keys(nextErrors)[0];
      document.getElementById(firstError)?.focus();
      return;
    }

    // Valid → mail client kholo
    window.location.href = buildMailto(values);
    setSubmitted(true);
  }

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <header className="section__head" data-reveal>
          <p className="eyebrow">Get in touch</p>
          <h2 id="contact-title" className="section__title">
            Contact
          </h2>
          <p className="section__sub">
            Koi project hai ya YouTube channel grow karna hai — message karo, mai{' '}
            {profile.availability.toLowerCase()}.
          </p>
        </header>

        <div className="contact__grid">
          {/* ---- Details ---- */}
          <aside className="contact__aside" data-reveal>
            <h3 className="contact__aside-title">Directly reach karo</h3>

            <ul className="contact__list">
              <li>
                <span className="contact__label">Email</span>
                <a className="contact__value" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </li>
              <li>
                <span className="contact__label">Phone</span>
                <a className="contact__value" href={`tel:${profile.phone.replace(/\s/g, '')}`}>
                  {profile.phone}
                </a>
              </li>
              <li>
                <span className="contact__label">Location</span>
                <span className="contact__value">{profile.location}</span>
              </li>
              <li>
                <span className="contact__label">Resume</span>
                <a
                  className="contact__value"
                  href={profile.resumeUrl}
                  download
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Download PDF
                </a>
              </li>
            </ul>

            <p className="contact__note">
              Form bharne par aapka email app khul jaayega — message wahan draft
              ho jaayegi. Koi backend nahi hai is demo me (static hosting).
            </p>
          </aside>

          {/* ---- Form ---- */}
          <form className="contact__form" onSubmit={handleSubmit} noValidate data-reveal>
            <Field
              id="name"
              label="Naam"
              required
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              maxLength={RULES.name.max}
              autoComplete="name"
              placeholder="Aapka naam"
            />

            <Field
              id="email"
              label="Email"
              type="email"
              required
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              maxLength={RULES.email.max}
              autoComplete="email"
              placeholder="aap@example.com"
            />

            <Field
              id="message"
              label="Message"
              type="textarea"
              required
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.message}
              hint={`Kam se kam ${RULES.message.min} characters. Bache hue: ${charsLeft}`}
              maxLength={RULES.message.max}
              rows={5}
              placeholder="Kis cheez me madad chahiye?"
            />

            <button type="submit" className="btn btn--primary contact__submit">
              Bhejo
            </button>

            {/* Success message — form ke neeche, polite (aria-live) */}
            <p className="contact__success" role="status" aria-live="polite">
              {submitted &&
                Object.keys(errors).length === 0 &&
                'Email app khul gaya — message wahan draft mil jayegi.'}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}