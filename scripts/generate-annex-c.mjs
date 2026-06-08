import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourcePath = process.argv[2] || join(__dirname, '../../.cursor/projects/empty-window/agent-tools/ecb7cacf-1280-4b3b-8725-55f0b265df73.txt');

const text = readFileSync(sourcePath, 'utf8');
const slots = ['1A', '1B', '1D', '1E', '1G', '1I', '1K', '1L'];

const rows = [];
const pattern = /(\d+)\s+((?:3[A-L]\s*){8})/g;
let match;

while ((match = pattern.exec(text)) !== null) {
  const thirds = [...match[2].matchAll(/3([A-L])/g)].map((m) => m[1]);
  if (thirds.length !== 8) continue;

  const key = [...thirds].sort().join('');
  const mapping = {};
  slots.forEach((slot, i) => {
    mapping[slot] = `3${thirds[i]}`;
  });

  rows.push({ id: parseInt(match[1], 10), key, mapping });
}

const uniqueKeys = new Set(rows.map((r) => r.key));
const map = Object.fromEntries(rows.map((r) => [r.key, r.mapping]));

console.log(`Parsed ${rows.length} rows, ${uniqueKeys.size} unique keys`);

if (uniqueKeys.size !== 495) {
  console.warn('Expected 495 unique combinations');
}

const out = `// Auto-generated from FIFA World Cup 2026 Regulations Annex C
export type RoundOf32Slot = '1A' | '1B' | '1D' | '1E' | '1G' | '1I' | '1K' | '1L';
export type ThirdPlaceMapping = Record<RoundOf32Slot, string>;

export const annexCMap: Record<string, ThirdPlaceMapping> = ${JSON.stringify(map, null, 2)} as Record<string, ThirdPlaceMapping>;
`;

writeFileSync(join(__dirname, '../src/data/annexC.ts'), out);
console.log('Written src/data/annexC.ts');
