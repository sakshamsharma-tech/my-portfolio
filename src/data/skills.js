/* ============================================================
   CONTENT FILE  —  skills yahan change karo (FR-17)
   `level` = 0 se 100 (yeh sirf dikhane ke liye hai, koi claim nahi)
   ============================================================ */

export const skillGroups = [
  {
    id: 'frontend',
    label: 'Frontend',
    summary: 'Jis cheez se roz kaam karta hu',
    items: [
      { name: 'React', level: 90 },
      { name: 'JavaScript (ES2023)', level: 88 },
      { name: 'HTML5 & Semantics', level: 94 },
      { name: 'CSS Architecture', level: 86 },
      { name: 'Responsive Design', level: 89 },
    ],
  },
  {
    id: 'tooling',
    label: 'Tooling',
    summary: 'Build, test aur deploy ka setup',
    items: [
      { name: 'Vite', level: 84 },
      { name: 'Vitest + Testing Library', level: 80 },
      { name: 'Git & GitHub Actions', level: 82 },
      { name: 'Playwright', level: 72 },
    ],
  },
  {
    id: 'backend',
    label: 'Backend Basics',
    summary: 'Frontend ke saath full-stack samajh',
    items: [
      { name: 'Node.js', level: 74 },
      { name: 'Express', level: 70 },
      { name: 'MongoDB', level: 66 },
      { name: 'REST APIs', level: 78 },
    ],
  },
  {
    id: 'craft',
    label: 'Craft & Tools',
    summary: 'Kaam ki quality aur workflow',
    items: [
      { name: 'Figma → Code', level: 82 },
      { name: 'Accessibility (a11y)', level: 79 },
      { name: 'Agile / Scrum', level: 75 },
    ],
  },
];

/** Simple tag cloud — technologies ka raw list */
export const toolStack = [
  'React', 'Vite', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind',
  'Node.js', 'Express', 'MongoDB', 'Git', 'GitHub Actions', 'Figma', 'Postman',
  'Jest', 'Vitest', 'Playwright', 'Linux',
];