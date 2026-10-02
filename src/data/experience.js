/* ============================================================
   CONTENT FILE — Experience timeline (FR-17)

   Naya job add karna hai? Sirf yahan ek object add karo.
   `upcoming: true` wala future/ongoing role dikhata hai.
   ============================================================ */

export const experience = {
  id: 'experience',
  eyebrow: 'Where I have worked',
  title: 'Experience',
  subtitle:
    'Product companies aur startups dono me kaam kiya — har jagar frontend ki performance aur accessibility par focus raha.',

  /** Naya role sabse upar. Timeline latest → oldest order me hai. */
  items: [
    {
      id: 'exp-nimbus',
      role: 'Frontend Developer',
      company: 'Nimbus Analytics',
      location: 'Bengaluru, India',
      period: 'Mar 2024 — Present',
      type: 'Full-time',
      summary:
        'Analytics dashboard platform ka frontend — 40+ screens, ek design system pe.',
      points: [
        'React + TypeScript se 12 reusable components banaye (Team me 3 logo ne reuse kiya)',
        'Dashboard ka first paint 3.2s → 1.1s (code-splitting + image optimisation)',
        'Lighthouse Accessibility score 62 → 96 (axe audit + keyboard testing)',
        'Design tokens + Storybook set up kiya — naye screens 2 din me banne lage',
      ],
      stack: ['React', 'TypeScript', 'Vite', 'Storybook', 'CSS Variables'],
      current: true,
    },
    {
      id: 'exp-pixelcraft',
      role: 'Frontend Developer',
      company: 'Pixelcraft Studio',
      location: 'Remote',
      period: 'Jul 2022 — Feb 2024',
      type: 'Full-time',
      summary:
        'Digital agency — 14 clients ke websites aur web apps banaye, akela frontend.',
      points: [
        '14 client projects ship kiye (React + WordPress headless)',
        'Har project me Lighthouse 90+ maintain kiya',
        'Client onboarding ke liye ek starter template banaya (setup 2 din → 2 ghante)',
        'SEO me average 20% traffic improvement',
      ],
      stack: ['React', 'Next.js', 'Tailwind', 'GSAP'],
    },
    {
      id: 'exp-freelance',
      role: 'Freelance Web Developer',
      company: 'Self-employed',
      location: 'Bengaluru, India',
      period: 'Jan 2021 — Jun 2022',
      type: 'Freelance',
      summary: 'Small businesses ke liye websites banayi — 20+ chhote projects.',
      points: [
        '20+ small-business websites (₹15K–₹60K range)',
        'Har client ke liye SEO + analytics setup',
        'Maintenance retainers — 5 clients monthly',
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'WordPress'],
    },
  ],
};