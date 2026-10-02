import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Contact from '../components/Contact.jsx';
import {
  validateContact,
  buildMailto,
  RULES,
} from '../lib/validateContact.js';

/**
 * Contact form tests.
 *
 * AC mapping (analysis doc, US-04 / FR-22..24):
 *   AC-03.1  Submit par validation chalti hai
 *   AC-03.2  Naam required
 *   AC-03.3  Email format required
 *   AC-03.4  Message >= 20 characters required
 *   AC-03.5  Errors accessible hain (role="alert", aria-invalid, focus)
 *   AC-03.6  Valid form → mailto + success message
 *
 * Note: AC-05.8 (YouTube CTA → #contact) youtube.test.jsx me covered hai.
 */

describe('validateContact — pure function (AC-03.2/03.3/03.4)', () => {
  it('sahi values → valid', () => {
    const result = validateContact({
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      message: 'Mujhe ek portfolio website banwani hai, kuch discuss karna hai.',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('AC-03.2: naam khaali → error', () => {
    const { valid, errors } = validateContact({
      name: '',
      email: 'a@b.com',
      message: 'x'.repeat(25),
    });
    expect(valid).toBe(false);
    expect(errors.name).toBeTruthy();
  });

  it('AC-03.2: naam sirf whitespace → error (trim hota hai)', () => {
    const { errors } = validateContact({
      name: '   ',
      email: 'a@b.com',
      message: 'x'.repeat(25),
    });
    expect(errors.name).toBeTruthy();
  });

  it('AC-03.2: 1-character naam → error (min 2)', () => {
    const { errors } = validateContact({
      name: 'A',
      email: 'a@b.com',
      message: 'x'.repeat(25),
    });
    expect(errors.name).toContain(String(RULES.name.min));
  });

  it('AC-03.3: galat email format → error', () => {
    const bad = ['plainstring', 'a@b', 'a@b.', '@b.com', 'a@@b.com', 'a b@c.com'];

    bad.forEach((email) => {
      const { valid, errors } = validateContact({
        name: 'Rahul',
        email,
        message: 'x'.repeat(25),
      });
      expect(valid, `expected "${email}" to be invalid`).toBe(false);
      expect(errors.email, `expected error for "${email}"`).toBeTruthy();
    });
  });

  it('AC-03.3: sahi email formats accept hote hain', () => {
    const good = [
      'a@b.com',
      'rahul.kumar@example.co.in',
      'user+tag@example.org',
      'USER@EXAMPLE.COM',
    ];

    good.forEach((email) => {
      const { errors } = validateContact({
        name: 'Rahul',
        email,
        message: 'x'.repeat(25),
      });
      expect(errors.email, `expected "${email}" to be valid`).toBeUndefined();
    });
  });

  it('AC-03.4: message 19 chars → error, 20 chars → valid', () => {
    const base = { name: 'Rahul', email: 'a@b.com' };

    const short = validateContact({ ...base, message: 'x'.repeat(19) });
    expect(short.errors.message).toBeTruthy();

    const exact = validateContact({ ...base, message: 'x'.repeat(20) });
    expect(exact.errors.message).toBeUndefined();
    expect(exact.valid).toBe(true);
  });

  it('error message me actual character count batata hai', () => {
    const { errors } = validateContact({
      name: 'Rahul',
      email: 'a@b.com',
      message: 'too short',
    });
    expect(errors.message).toContain('9');
  });

  it('sab fields khaali → teeno errors ek saath', () => {
    const { valid, errors } = validateContact({});
    expect(valid).toBe(false);
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name']);
  });

  it('undefined input bhi crash nahi karta', () => {
    expect(() => validateContact()).not.toThrow();
    expect(validateContact().valid).toBe(false);
  });
});

describe('buildMailto — AC-03.6', () => {
  it('mailto: link banata hai with subject + body', () => {
    const link = buildMailto({
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      message: 'Hello, let us talk.',
    });

    expect(link.startsWith('mailto:?subject=')).toBe(true);
    expect(decodeURIComponent(link)).toContain('Rahul Kumar');
    expect(decodeURIComponent(link)).toContain('rahul@example.com');
    expect(decodeURIComponent(link)).toContain('Hello, let us talk.');
  });

  it('special characters encode hote hain (spaces, &, ?)', () => {
    const link = buildMailto({
      name: 'A&B',
      email: 'a@b.com',
      message: '100% done? yes & no',
    });

    expect(link).not.toContain(' ');
    expect(link).toContain('%26');
    expect(link).toContain('%3F');
  });
});

describe('Contact component — AC-03.1/03.5', () => {
  beforeEach(() => {
    // JSDOM mailto navigate nahi kar sakta → location.href stub
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('AC-03.1: khaali form submit → teeno errors dikhte hain', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole('button', { name: /bhejo/i }));

    expect(await screen.findByText(/naam likhna zaroori hai/i)).toBeInTheDocument();
    expect(screen.getByText(/email likhna zaroori hai/i)).toBeInTheDocument();
    expect(screen.getByText(/message likhna zaroori hai/i)).toBeInTheDocument();
  });

  it('AC-03.5: errors role="alert" hain — screen reader turant bole', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole('button', { name: /bhejo/i }));

    const alerts = await screen.findAllByRole('alert');
    expect(alerts).toHaveLength(3);
  });

  it('AC-03.5: galat field par aria-invalid="true"', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole('button', { name: /bhejo/i }));

    expect(screen.getByLabelText(/naam/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('AC-03.5: focus pehle galat field pe jaata hai', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole('button', { name: /bhejo/i }));

    // Keyboard/screen-reader user ke liye zaroori — warna error dikhe
    // par focus kahin aur rahe
    expect(screen.getByLabelText(/naam/i)).toHaveFocus();
  });

  it('AC-03.5: error input se aria-describedby se juda hai', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole('button', { name: /bhejo/i }));

    const nameInput = screen.getByLabelText(/naam/i);
    const describedBy = nameInput.getAttribute('aria-describedby');
    expect(describedBy).toContain('name-error');
  });

  it('AC-03.1: blur par bhi error validate hota hai', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const email = screen.getByLabelText(/email/i);
    await user.click(email);
    await user.type(email, 'galat-email');
    await user.tab();

    expect(await screen.findByText(/sahi format me daalo/i)).toBeInTheDocument();
  });

  it('AC-03.1: type karte waqt error turant clear hota hai', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const email = screen.getByLabelText(/email/i);
    await user.click(email);
    await user.type(email, 'bad');
    await user.tab();

    expect(await screen.findByText(/sahi format me daalo/i)).toBeInTheDocument();

    await user.type(email, '-mail@ok.com');
    await user.tab();

    expect(screen.queryByText(/sahi format me daalo/i)).not.toBeInTheDocument();
  });

  it('character counter message field ke saath update hota hai', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const message = screen.getByLabelText(/message/i);
    await user.type(message, 'Hello');

    // RULES.message.max (2000) - 5 chars typed
    expect(screen.getByText(new RegExp(`Bache hue: ${RULES.message.max - 5}`))).toBeInTheDocument();
  });

  it('AC-03.6: valid form → mailto link ban jaata hai', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText(/naam/i), 'Rahul Kumar');
    await user.type(screen.getByLabelText(/email/i), 'rahul@example.com');
    await user.type(
      screen.getByLabelText(/message/i),
      'Mujhe ek portfolio website banwani hai.',
    );

    await user.click(screen.getByRole('button', { name: /bhejo/i }));

    expect(window.location.href).toContain('mailto:');
  });

  it('AC-03.6: success message role="status" se announce hoti hai', () => {
    render(<Contact />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('galat form → mailto NAHI khulna chahiye', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole('button', { name: /bhejo/i }));

    expect(window.location.href).not.toContain('mailto:');
  });

  it('contact details sidebar me render hote hain', () => {
    render(<Contact />);
    expect(screen.getByRole('heading', { name: /directly reach karo/i })).toBeInTheDocument();
    expect(screen.getByText(/aarav\.sharma@example\.com/)).toBeInTheDocument();
  });

  it('resume link download attribute ke saath hai', () => {
    render(<Contact />);
    expect(screen.getByRole('link', { name: /download pdf/i })).toHaveAttribute(
      'download',
    );
  });

  it('form par noValidate hai — browser ka apna bubble nahi aayega', () => {
    const { container } = render(<Contact />);
    expect(container.querySelector('form')).toHaveAttribute('novalidate');
  });

  it('AC-03.6: YouTube CTA ka target #contact yahan exist karta hai', () => {
    // AC-05.8 youtube section se link karta hai, id yahan banta hai
    render(<Contact />);
    expect(document.getElementById('contact')).toBeInTheDocument();
  });
});