/**
 * Placeholder resume PDF generate karta hai.
 *
 * Kyu?  Kyunki Hero section ka "Resume" button ek real file link karta hai.
 * Agar file na ho toh user ko 404 dikhta hai — jo demo ko "broken" dikhata hai.
 *
 * Chhota dependency-free PDF writer (koi library nahi).
 *
 * Run:  node scripts/generate-placeholder-resume.mjs
 * Apni asli PDF daalni ho toh: bas public/aarav-sharma-resume.pdf ko replace kar do.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'aarav-sharma-resume.pdf');

const lines = [
  { text: 'AARAV SHARMA', size: 22, gap: 26 },
  { text: 'Frontend Developer  |  aarav.sharma@example.com  |  +91 90000 00000', size: 11, gap: 16 },
  { text: 'Bengaluru, India', size: 11, gap: 24 },

  { text: 'SUMMARY', size: 13, gap: 14 },
  {
    text: 'Frontend developer with 3+ years building responsive, accessible web',
    size: 11,
    gap: 15,
  },
  { text: 'applications with React and modern CSS. Shipped 25+ projects for 18 clients.', size: 11, gap: 22 },

  { text: 'SKILLS', size: 13, gap: 14 },
  { text: 'React, JavaScript, HTML5, CSS Architecture, Vite, Vitest,', size: 11, gap: 15 },
  { text: 'Node.js, Express, MongoDB, Git, GitHub Actions, Playwright', size: 11, gap: 22 },

  { text: 'EXPERIENCE', size: 13, gap: 14 },
  { text: 'Frontend Developer  -  Nexlify Labs  -  2023 to present', size: 11, gap: 15 },
  { text: 'Built customer-facing dashboards in React. Cut bundle size by 38%.', size: 11, gap: 15 },
  { text: 'UI Engineer  -  Brightwave  -  2021 to 2023', size: 11, gap: 15 },
  { text: 'Shipped 12 marketing sites with strict Lighthouse performance budgets.', size: 11, gap: 22 },

  { text: 'EDUCATION', size: 13, gap: 14 },
  { text: 'B.E. Computer Science  -  Anna University  -  2021  -  8.4 CGPA', size: 11, gap: 30 },

  {
    text: 'This is a PLACEHOLDER file generated for the portfolio demo.',
    size: 9,
    gap: 0,
  },
  { text: 'Replace public/aarav-sharma-resume.pdf with your real resume PDF.', size: 9, gap: 0 },
];

/** PDF me text draw karna: BT / font / size / position ... (text) Tj ... ET */
function contentStream() {
  const parts = ['BT'];
  let y = 780;
  lines.forEach(({ text, size, gap }) => {
    y -= gap;
    const escaped = text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    parts.push(`/F1 ${size} Tf`);
    parts.push(`56 ${y} Td`);
    parts.push(`(${escaped}) Tj`);
    y -= size + 6;
  });
  parts.push('ET');
  return parts.join('\n');
}

const content = contentStream();

// PDF objects. Numbering: 1 catalog, 2 pages, 3 page, 4 font, 5 contents
const objects = [
  '<</Type/Catalog/Pages 2 0 R>>',
  '<</Type/Pages/Kids[3 0 R]/Count 1>>',
  '<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>',
  '<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold>>',
  `<</Length ${Buffer.byteLength(content, 'latin1')}>>\nstream\n${content}\nendstream`,
];

let pdf = '%PDF-1.4\n';
const offsets = [];

objects.forEach((body, i) => {
  offsets.push(Buffer.byteLength(pdf, 'latin1'));
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefOffset = Buffer.byteLength(pdf, 'latin1');
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += '0000000000 65535 f \n';
offsets.forEach((offset) => {
  pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
});
pdf += `trailer\n<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF\n`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, Buffer.from(pdf, 'latin1'));

console.log(`✅ Resume placeholder bana diya: ${OUT}`);
console.log(`   Size: ${Buffer.byteLength(pdf, 'latin1')} bytes`);