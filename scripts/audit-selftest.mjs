/**
 * Contrast audit ka SELF-TEST.
 *
 * Ye script khud `contrast-audit.mjs` ko test karti hai. Kyun zaroori?
 *
 * Kyunki ek accessibility tool jo hamesha "PASS" bolta hai, sabse khatarnaak
 * hota hai — wo aapko false confidence deta hai. Isliye ek fixture page hai
 * (`fixtures/contrast-selftest.html`) jisme jaan-boojh kar FAIL karne wale
 * aur jaan-boojh kar PASS karne wale cases rakhe hain. Agar audit ka logic
 * kabhi kharab hua, ye script pakad legi.
 *
 * Run:  npm run test:contrast
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(here, 'fixtures', 'contrast-selftest.html').replace(/\\/g, '/');
const auditScript = resolve(here, 'contrast-audit.mjs');

/** Case 1, 2, 3 me se koi ek bhi FAIL hona chahiye (jaan-boojh kar bura hai). */
const MUST_FAIL = [
  'case one plain low contrast',
  'case two large text low contrast',
  'case three semi transparent text',
];

/** Case 4 aur 5 PASS hone chahiye — inme se ek bhi FAIL hua to bug aa gaya. */
const MUST_PASS = [
  // Ye wahi case hai jo 2026-10-02 ka bug tha: dark page pe semi-transparent
  // gradient stop ko white canvas pe paint kar deta tha → jhootha FAIL.
  'case four dark page semi transparent gradient',
  'case five good contrast',
];

const result = spawnSync('node', [auditScript, `file:///${fixture}`], {
  encoding: 'utf8',
});

const output = result.stdout ?? '';
const problems = [];

/** Ek specific case fail report me hai ya nahi */
const isReportedAsFail = (text) =>
  output.split('THEME:').some((chunk) =>
    // FAIL block me wo text dikhna chahiye
    chunk.includes('FAIL') && chunk.includes(text),
  );

// --- Assertion 1: tool ko FAIL dena hi chahiye (fixture me jaan-boojh ke failures hain)
if (result.status !== 1) {
  problems.push(
    `Audit ka exit code ${result.status} chahiye tha 1 (fixture me jaan-boojh kar FAIL hai).`,
  );
}

// --- Assertion 2: teeno "must fail" cases pakde gaye
for (const text of MUST_FAIL) {
  if (!isReportedAsFail(text)) {
    problems.push(`MISSED a real failure: "${text}" — audit ne ise pass bata diya.`);
  }
}

// --- Assertion 3: "must pass" cases galat se FAIL nahi hue
for (const text of MUST_PASS) {
  if (isReportedAsFail(text)) {
    problems.push(
      `FALSE POSITIVE: "${text}" ko audit ne FAIL bola, jabki uska contrast theek hai.\n` +
        `   → Ye background-resolution bug ka nishani hai (white-canvas compositing).`,
    );
  }
}

// --- Report
console.log('='.repeat(70));
console.log('CONTRAST AUDIT — SELF TEST');
console.log('='.repeat(70));
console.log(`fixture : ${fixture}`);
console.log(`must FAIL : ${MUST_FAIL.length} case(s)`);
console.log(`must PASS : ${MUST_PASS.length} case(s)`);
console.log('');

if (problems.length === 0) {
  console.log('PASS — audit tool khud sahi behave kar raha hai.');
  console.log('       (Failures pakde, aur sahi contrast ko fail nahi bola)');
  process.exit(0);
} else {
  console.log(`FAIL — ${problems.length} problem(s):\n`);
  problems.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));
  console.log('\n--- audit ka raw output ---');
  console.log(output);
  process.exit(1);
}