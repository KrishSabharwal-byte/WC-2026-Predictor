import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const codes = [
  'mx', 'za', 'kr', 'cz', 'ca', 'ba', 'qa', 'ch', 'br', 'ma', 'gb-sct', 'ht',
  'us', 'py', 'au', 'tr', 'de', 'cw', 'ci', 'ec', 'nl', 'jp', 'se', 'tn',
  'be', 'eg', 'ir', 'nz', 'es', 'cv', 'uy', 'sa', 'fr', 'sn', 'no', 'iq',
  'ar', 'dz', 'at', 'jo', 'pt', 'cd', 'uz', 'co', 'gb-eng', 'hr', 'gh', 'pa',
];

const outDir = join(root, 'public', 'flags');
const srcDir = join(root, 'node_modules', 'flag-icons', 'flags', '4x3');

mkdirSync(outDir, { recursive: true });

for (const code of codes) {
  const src = join(srcDir, `${code}.svg`);
  const dest = join(outDir, `${code}.svg`);
  if (!existsSync(src)) {
    console.warn(`Missing flag source: ${code}`);
    continue;
  }
  copyFileSync(src, dest);
}

console.log(`Copied ${codes.length} flags to public/flags/`);
