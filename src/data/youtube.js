/* ============================================================
   CONTENT FILE — YouTube Channel Management section
   ------------------------------------------------------------
   FR-17 ke mutabiq poora content yahan hai. Is file ko edit
   karo, component ko kabhi nahi chhedna.

   ⚠️  YE SAARE NUMBERS SAMPLE / PLACEHOLDER HAIN (DL-05, AC-06)
   Isliye `isSampleData: true` set hai — UI automatically
   "Sample data" badge dikhata hai. Asli numbers daalne ke baad
   ise `false` kar dena, BAS. Ek jagah badalna padega.
   ============================================================ */

export const ytStats = {
  /** true = numbers dummy hain → UI me "Sample data" label (AC-05.10) */
  isSampleData: true,

  /** Channel ke apne numbers (credibility) */
  channel: {
    label: 'Channel metrics',
    items: [
      { id: 'subs', value: '48K+', label: 'Subscribers' },
      { id: 'videos', value: '320', label: 'Videos' },
      { id: 'views', value: '1.2M', label: 'Views' },
      { id: 'niches', value: '4', label: 'Niches' },
    ],
  },

  /** Meri service ka proof — "main manage karta hoon" */
  service: {
    label: 'Channels managed',
    items: [
      { id: 'channels', value: '8', label: 'Channels Managed' },
      { id: 'delivered', value: '140+', label: 'Videos Delivered' },
      { id: 'retention', value: '+68%', label: 'Avg Retention Gain' },
    ],
  },
};

/**
 * 6 service areas. Har tab ka poora content yahan hai (DL-13).
 * Analysis 1.7.1 se map kiya gaya hai.
 */
export const ytTabs = [
  {
    id: 'strategy',
    label: 'Strategy & SEO',
    icon: 'compass',
    summary:
      'Video se pehle ka kaam — kya banayein, kis keyword pe rank karein, aur thumbnail se click kaise laayein.',
    points: [
      'Topic planning + niche research (kya chalega, kya nahi)',
      'Competitor channel analysis — unka structure dekho',
      'Titles, tags, descriptions likhna jo search me laayein',
      'Thumbnail design — CTR badhane ke liye A/B testing',
      'Content calendar + upload consistency planning',
    ],
  },
  {
    id: 'production',
    label: 'Scripting & Editing',
    icon: 'film',
    summary:
      'Raw idea se publish-ready video tak ka full pipeline — scripting se lekar final export tak.',
    points: [
      'Script likhna — hook + retention structure ke saath',
      'Shoot setup, framing, audio quality',
      'Editing — cuts, pacing, B-roll, motion graphics',
      'Subtitles + captions (accessibility + reach dono)',
      'Final export: resolution, bitrate, safe margins',
    ],
  },
  {
    id: 'publishing',
    label: 'Publishing & Schedule',
    icon: 'calendar',
    summary:
      'Sahi time par sahi jagah publish karna — consistency hi channel ko grow karati hai.',
    points: [
      'Upload + scheduling (peak-time analysis ke hisaab se)',
      'Playlists banana taaki watch time cluster ho',
      'End screens, cards, chapters — retention ke liye',
      'Community posts + shorts se main channel pe traffic',
      'Publish calendar + backlog management',
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & Growth',
    icon: 'chart',
    summary:
      'Data dekhna nahi, data se **kuch badalna**. Retention curve padho aur problem fix karo.',
    points: [
      'Watch time + average view duration track karna',
      'Retention curve — kahan log chhod rahe hain, wo dhoondna',
      'CTR analysis — thumbnail aur title ka asar',
      'Traffic source dekhna (search vs suggested vs external)',
      'Har video ke baad ek measurable improvement',
    ],
  },
  {
    id: 'monetization',
    label: 'Monetization & Deals',
    icon: 'coin',
    summary:
      'Channel ko business ki tarah chalaana — revenue streams aur brand partnerships.',
    points: [
      'AdSense setup aur monetization eligibility',
      'Rate card banana (per-deliverable, per-campaign)',
      'Brand outreach — cold email + media kit',
      'Sponsorship ke liye rates + deliverables negotiate karna',
      'Affiliate + merch + own product revenue streams',
    ],
  },
  {
    id: 'community',
    label: 'Community',
    icon: 'chat',
    summary:
      'Subscribers sirf count nahi, community hai. Retention aur growth dono yahin se aati hai.',
    points: [
      'Comments ka timely reply — algorithm bhi reward karta hai',
      'Community tab + polls se engagement badhana',
      'Creator collaborations + shoutouts',
      'Supporter ko value dena (behind-the-scenes, exclusive)',
      'Community guidelines + moderation',
    ],
  },
];

/** Section ka CTA — contact form tak le jata hai (FR-24) */
export const ytCta = {
  title: 'Apna channel grow karna hai?',
  text: 'Channel audit ya strategy session chahiye? Batao kahan atak rahe ho — main wohi point fix karta hoon.',
  buttonLabel: 'Baat karo',
  href: '#contact',
};

/** Section heading + intro (NFR-12 ke liye sample-data note yahan hai) */
export const ytSection = {
  id: 'youtube',
  eyebrow: 'Beyond frontend',
  title: 'YouTube Channel Management',
  subtitle:
    'Tech aur lifestyle content ke liye doosron ke YouTube channels manage karta hoon — strategy se lekar monetization tak, poora cycle.',
  sampleBadge: 'Sample data',
};
