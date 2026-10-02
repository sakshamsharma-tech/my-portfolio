import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Experience from '../components/Experience.jsx';
import Education from '../components/Education.jsx';
import { experience } from '../data/experience.js';
import { education } from '../data/education.js';

/**
 * Experience + Education tests.
 * AC mapping: analysis doc me FR-19 (Experience) aur FR-21 (Education).
 * In dono ka koi explicit AC number nahi tha — isliye maine acceptance
 * criteria yahan define kiye hain, design doc se consistent.
 *
 *   AC-08.1  Experience section render hota hai, sahi heading ke saath
 *   AC-08.2  Timeline me sabhi roles render hote hain
 *   AC-08.3  Har role ka period, summary aur sab points dikhte hain
 *   AC-08.4  Latest → oldest order
 *   AC-08.5  Current role par "Current" badge
 *   AC-08.6  Timeline semantic <ol> hai (list of items)
 *   AC-08.7  Tech stack chips render hote hain
 *   AC-09.1  Education section render hota hai
 *   AC-09.2  Degree + school + period dikhte hain
 *   AC-09.3  Content data file se aata hai (FR-17)
 */

describe('AC-08 — Experience section', () => {
  it('AC-08.1: section id="experience" aur "Experience" heading', () => {
    render(<Experience />);

    expect(document.getElementById('experience')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument();
  });

  it('AC-08.2: sabhi roles render hote hain', () => {
    render(<Experience />);

    // Do roles ka title same hai ("Frontend Developer"), isliye
    // getAllByRole + index-based matching, getByRole nahi.
    const roleHeadings = screen.getAllByRole('heading', { level: 3 });
    const rendered = roleHeadings.map((h) => h.textContent);

    experience.items.forEach((item) => {
      expect(rendered, `role "${item.role}" render nahi hua`).toContain(
        item.role,
      );
      expect(screen.getAllByText(item.company).length).toBeGreaterThan(0);
    });
  });

  it('AC-08.3: har role ka period, summary aur points dikhte hain', () => {
    render(<Experience />);

    experience.items.forEach((item) => {
      expect(screen.getByText(item.period)).toBeInTheDocument();
      expect(screen.getByText(item.summary)).toBeInTheDocument();
      item.points.forEach((point) => {
        expect(screen.getByText(point)).toBeInTheDocument();
      });
    });
  });

  it('AC-08.4: latest → oldest order maintain hai', () => {
    render(<Experience />);

    const roles = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent);

    expect(roles).toEqual(experience.items.map((i) => i.role));
  });

  it('AC-08.5: current role par "Current" badge dikhta hai', () => {
    render(<Experience />);

    const currentCount = experience.items.filter((i) => i.current).length;
    expect(screen.getAllByText('Current')).toHaveLength(currentCount);
  });

  it('AC-08.6: timeline semantic <ol> hai — list of items', () => {
    render(<Experience />);

    const timeline = document.querySelector('.timeline');
    expect(timeline.tagName).toBe('OL');

    // ⚠️ `getAllByRole('listitem')` gehre (nested) `<ul>` ke items bhi
    // pakadta hai — points aur stack ke items bhi listitem hain.
    // Sirf DIRECT children count karne hain → `:scope > li`.
    const directItems = timeline.querySelectorAll(':scope > li');
    expect(directItems).toHaveLength(experience.items.length);

    directItems.forEach((li) => {
      expect(li.querySelector('article')).toBeInTheDocument();
    });
  });

  it('AC-08.7: tech stack chips render hote hain', () => {
    render(<Experience />);

    // Har timeline item ka apna stack list hai → multiple
    const stackLists = screen.getAllByLabelText('Technologies used');
    const withStack = experience.items.filter((i) => i.stack?.length > 0);
    expect(stackLists).toHaveLength(withStack.length);

    const renderedChips = stackLists
      .flatMap((list) => within(list).getAllByRole('listitem'))
      .map((li) => li.textContent);

    withStack.forEach((item) => {
      item.stack.forEach((tech) => {
        expect(renderedChips).toContain(tech);
      });
    });
  });

  it('aria-labelledby heading se juda hai', () => {
    render(<Experience />);
    const section = document.getElementById('experience');
    expect(section).toHaveAttribute('aria-labelledby', 'experience-title');
  });
});

describe('AC-09 — Education section', () => {
  it('AC-09.1: section id="education" aur "Education" heading', () => {
    render(<Education />);

    expect(document.getElementById('education')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument();
  });

  it('AC-09.2: degree, school aur period sab dikhte hain', () => {
    render(<Education />);

    education.items.forEach((item) => {
      expect(screen.getByRole('heading', { name: item.degree })).toBeInTheDocument();
      expect(screen.getByText(item.period)).toBeInTheDocument();

      // School + location `·` separator se do nodes me bat gaye hain,
      // isliye exact text match nahi chalega — function matcher use karo.
      expect(
        screen.getByText((_, el) => el?.tagName === 'P' && el.textContent.includes(item.school)),
        `school "${item.school}" render nahi hua`,
      ).toBeInTheDocument();

      expect(screen.getByText(item.detail)).toBeInTheDocument();
    });
  });

  it('AC-09.3: content data file se aata hai — FR-17', () => {
    render(<Education />);
    expect(education.items.length).toBeGreaterThan(0);

    const cards = screen.getAllByRole('listitem');
    expect(cards).toHaveLength(education.items.length);
  });

  it('Education section Experience ke alag section hai (FR-21)', () => {
    const { unmount } = render(<Education />);
    expect(document.getElementById('experience')).not.toBeInTheDocument();
    expect(document.getElementById('education')).toBeInTheDocument();
    unmount();
  });
});

describe('Both sections — keyboard + structure', () => {
  it('timeline items ka content pure text hai — koi nested button nahi', () => {
    render(<Experience />);
    // Timeline read-only hai, sirf Contact me interactive elements hain
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('render karne par koi error nahi aata', () => {
    const consoleError = console.error;
    const spy = [];
    console.error = (...args) => spy.push(args.join(' '));

    render(<Experience />);
    render(<Education />);

    console.error = consoleError;
    expect(spy).toHaveLength(0);
  });

  it('duplicate ids nahi banate (a11y: html id unique hona chahiye)', () => {
    render(
      <>
        <Experience />
        <Education />
      </>,
    );

    const ids = [...document.querySelectorAll('[id]')].map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('user tab se timeline padh sakta hai — koi tabindex trap nahi', async () => {
    const user = userEvent.setup();
    render(<Experience />);

    // Timeline me koi focusable element nahi hai — tab aage badh jaana chahiye
    await user.tab();
    // Kuch bhi focused nahi hona chahiye within timeline
    const timeline = document.querySelector('.timeline');
    expect(timeline.contains(document.activeElement)).toBe(false);
  });
});