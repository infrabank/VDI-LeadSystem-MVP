// Merge all i18n/chunks/chunk-*.ko.json maps into i18n/strings.ko.json.
// Reports coverage against strings.en.json so we know what's left.
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const I18N = join(ROOT, "i18n");
const CHUNKS = join(I18N, "chunks");

const en = JSON.parse(await readFile(join(I18N, "strings.en.json"), "utf8")).map((e) => e.t);
const enSet = new Set(en);
const ko = {};
let files = 0, entries = 0, foreign = 0;
for (const f of (await readdir(CHUNKS)).filter((f) => /\.ko\.json$/.test(f)).sort()) {
  let obj;
  try { obj = JSON.parse(await readFile(join(CHUNKS, f), "utf8")); }
  catch (e) { console.warn(`! ${f}: invalid JSON (${e.message})`); continue; }
  files++;
  for (const [k, v] of Object.entries(obj)) {
    if (!enSet.has(k)) { foreign++; continue; }
    if (typeof v === "string" && v.length) { ko[k] = v; entries++; }
  }
}
await writeFile(join(I18N, "strings.ko.json"), JSON.stringify(ko, null, 2));
const covered = en.filter((s) => ko[s]).length;
console.log(`Merged ${files} ko chunk files, ${entries} entries (${foreign} foreign keys ignored).`);
console.log(`Coverage: ${covered}/${en.length} units (${(covered / en.length * 100).toFixed(1)}%).`);
const missing = en.filter((s) => !ko[s]);
if (missing.length) {
  await writeFile(join(I18N, "untranslated.json"), JSON.stringify(missing, null, 2));
  console.log(`Untranslated → i18n/untranslated.json (${missing.length}).`);
}
