import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const annexC = readFileSync(join(dir, '../src/data/annexC.ts'), 'utf8');
const keys = [...annexC.matchAll(/"([A-L]{8})":/g)].map((m) => m[1]);
console.log('Annex C keys:', keys.length, keys.length === 495 ? 'OK' : 'FAIL');
