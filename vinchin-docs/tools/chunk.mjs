// Split i18n/strings.en.json into translation chunks for parallel agents.
// Each chunk file is a JSON array of English unit strings.
// Resumable: a chunk is considered done when its sibling *.ko.json exists.
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const I18N = join(ROOT, "i18n");
const CHUNKS = join(I18N, "chunks");
const SIZE = Number(process.argv[2] || 220);

const en = JSON.parse(await readFile(join(I18N, "strings.en.json"), "utf8"));
const strings = en.map((e) => e.t);
await mkdir(CHUNKS, { recursive: true });

let n = 0;
for (let start = 0; start < strings.length; start += SIZE) {
  const id = String(n).padStart(3, "0");
  await writeFile(join(CHUNKS, `chunk-${id}.json`), JSON.stringify(strings.slice(start, start + SIZE), null, 2));
  n++;
}
const existing = (await readdir(CHUNKS)).filter((f) => /^chunk-\d+\.ko\.json$/.test(f));
console.log(`Units: ${strings.length}`);
console.log(`Chunk size: ${SIZE} → ${n} chunks (chunk-000..chunk-${String(n - 1).padStart(3, "0")})`);
console.log(`Already translated chunks present: ${existing.length}`);
