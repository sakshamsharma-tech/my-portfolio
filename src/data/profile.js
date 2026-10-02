/* ============================================================
   CONTENT FILE  —  apni info yahan change karo (FR-17)
   Components ko chhedne ki zarurat nahi.
   ============================================================ */

export const profile = {
  name: 'Aarav Sharma',
  role: 'Frontend Developer',
  tagline: 'Mai responsive, accessible aur fast web apps banata hu — React aur modern CSS ke saath.',
  initials: 'AS',
  location: 'Bengaluru, India',
  email: 'aarav.sharma@example.com',
  phone: '+91 90000 00000',
  availability: 'Open to new work',
  resumeUrl: '/aarav-sharma-resume.pdf',

  /** About section ke paragraphs */
  about: [
    'Mai 3+ saal se frontend banata hu aur meri sabse badi khushi tab aati hai jab ek tricky design problem ko simple, fast aur accessible solution me badal deta hu.',
    'Meri approach: pehle problem aur user ko samajhta hu, phir component structure banata hu, aur last me tests likhta hu — taaki kaam sirf dikhta nahi, pakka bhi rahe.',
    'Off time me mai open-source contribute karta hu, design systems padhta hu aur naye tools try karta hu.',
  ],

  /** Hero ke quick numbers */
  stats: [
    { value: '3+', label: 'Years experience' },
    { value: '25+', label: 'Projects shipped' },
    { value: '18', label: 'Clients served' },
  ],

  /**
   * Social links — Header me sirf YouTube (compact), Footer me sab.
   * `youtube` DL-11 ke mutabiq dummy hai: https://youtube.com/@sakshamsharmatech
   * Asli channel ka URL yahan badalna, kahin aur nahi.
   */
  socials: [
    { label: 'GitHub', url: 'https://github.com/your-username', icon: 'github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/your-username', icon: 'linkedin' },
    { label: 'X', url: 'https://x.com/your-username', icon: 'x' },
    { label: 'YouTube', url: 'https://youtube.com/@sakshamsharmatech', icon: 'youtube', header: true },
    { label: 'Email', url: 'mailto:aarav.sharma@example.com', icon: 'mail' },
  ],
};