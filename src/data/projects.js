/* ============================================================
   CONTENT FILE  —  projects yahan change karo (FR-17)
   tags    → filter buttons apne aap ban jayenge (unique tags)
   featured → "Featured" badge
   ============================================================ */

export const projects = [
  {
    id: 'shopnest',
    title: 'ShopNest',
    blurb:
      'Headless commerce storefront jisme cart state URL me sync hota hai — user back button use kar sakta hai bina state khoye.',
    tags: ['React', 'CSS', 'State Management'],
    demoUrl: 'https://example.com/shopnest',
    codeUrl: 'https://github.com/sakshamsharmatech/shopnest',
    featured: true,
    year: '2025',
  },
  {
    id: 'pulse-analytics',
    title: 'Pulse Analytics',
    blurb:
      'Real-time dashboard jo 12-second interval pe data refresh karta hai. Virtualized tables se 10k rows smoothly scroll hoti hain.',
    tags: ['React', 'Data Viz', 'Performance'],
    demoUrl: 'https://example.com/pulse',
    codeUrl: 'https://github.com/sakshamsharmatech/pulse-analytics',
    featured: true,
    year: '2025',
  },
  {
    id: 'green-route',
    title: 'GreenRoute',
    blurb:
      'EV charging station locator. Offline-first hai — network na ho tab bhi last loaded stations cached map se dikhte hain.',
    tags: ['React', 'PWA', 'Maps'],
    demoUrl: 'https://example.com/greenroute',
    codeUrl: 'https://github.com/sakshamsharmatech/greenroute',
    featured: false,
    year: '2024',
  },
  {
    id: 'quickcv',
    title: 'QuickCV',
    blurb:
      'Resume builder jisme ek form se live PDF banta hai. Poori app 40 KB gzip me aati hai — koi UI library nahi.',
    tags: ['React', 'CSS', 'Performance'],
    demoUrl: 'https://example.com/quickcv',
    codeUrl: 'https://github.com/sakshamsharmatech/quickcv',
    featured: false,
    year: '2024',
  },
  {
    id: 'devmate-cli',
    title: 'devmate-cli',
    blurb:
      'Open-source Node CLI jo naye React projects scaffold karta hai — Vite config, tests aur CI workflow included.',
    tags: ['Node.js', 'Tooling', 'Open Source'],
    demoUrl: '',
    codeUrl: 'https://github.com/sakshamsharmatech/devmate-cli',
    featured: false,
    year: '2024',
  },
  {
    id: 'medtrack',
    title: 'MedTrack',
    blurb:
      'Clinic appointment reminders ke liye WhatsApp bot backend. Patient ko timezone-aware slot suggestions milte hain.',
    tags: ['Node.js', 'REST API', 'Backend'],
    demoUrl: '',
    codeUrl: 'https://github.com/sakshamsharmatech/medtrack',
    featured: false,
    year: '2023',
  },
];

/** Saare unique tags + "All" — filter bar isi list se banta hai */
export const ALL_TAGS = 'All';
export const projectTags = [
  ALL_TAGS,
  ...Array.from(new Set(projects.flatMap((p) => p.tags))),
];