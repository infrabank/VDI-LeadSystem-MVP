// Resumable batching for translation.
//   node tools/batch.mjs make [size]  → write UNtranslated strings into i18n/batches/b-NNN.json
//   node tools/batch.mjs merge        → fold i18n/batches/*.ko.json into i18n/strings.ko.json (additive)
//   node tools/batch.mjs status       → coverage report
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const I18N = join(ROOT, "i18n");
const BATCHES = join(I18N, "batches");
const EN = join(I18N, "strings.en.json");
const KO = join(I18N, "strings.ko.json");

const readJson = async (p, def) => { try { return JSON.parse(await readFile(p, "utf8")); } catch { return def; } };
const tagSig = (h) => (h.match(/<([a-z0-9]+)/gi) || []).map((t) => t.slice(1).toLowerCase()).filter((t) => t !== "br").sort().join(",");
const accept = (en, v) => typeof v === "string" && v.length > 0 && tagSig(en) === tagSig(v);

async function loadKo() { return existsSync(KO) ? readJson(KO, {}) : {}; }

async function foldBatches(ko) {
  if (!existsSync(BATCHES)) return ko;
  const enSet = new Set((await readJson(EN, [])).map((e) => e.t));
  for (const f of (await readdir(BATCHES)).filter((f) => /\.ko\.json$/.test(f)).sort()) {
    const obj = await readJson(join(BATCHES, f), null);
    if (!obj) { console.warn(`! ${f}: invalid JSON, skipped`); continue; }
    const keys = Object.keys(obj);
    const indexFormat = keys.length > 0 && keys.every((k) => /^\d+$/.test(k));
    if (indexFormat) {
      // {"0":"ko",...} paired by index with the matching input batch b-NNN.json
      const inputName = f.replace(/\.ko\.json$/, ".json");
      const input = await readJson(join(BATCHES, inputName), null);
      if (!input) { console.warn(`! ${f}: missing input ${inputName}, skipped`); continue; }
      for (const [i, v] of Object.entries(obj)) {
        const en = input[Number(i)];
        if (en !== undefined && accept(en, v)) ko[en] = v;
      }
    } else {
      for (const [k, v] of Object.entries(obj)) if (enSet.has(k) && accept(k, v)) ko[k] = v;
    }
  }
  return ko;
}

async function make(size) {
  const en = (await readJson(EN, [])).map((e) => e.t);
  const ko = await foldBatches(await loadKo());
  await writeFile(KO, JSON.stringify(ko, null, 2));
  const remaining = en.filter((s) => !ko[s]);
  await mkdir(BATCHES, { recursive: true });
  // All completed work is now durably in strings.ko.json; remove ALL batch files
  // (inputs + outputs) so regenerated index-keyed outputs can't mis-pair against new inputs.
  for (const f of (await readdir(BATCHES)).filter((f) => /\.json$/.test(f))) {
    await rm(join(BATCHES, f));
  }
  let n = 0;
  for (let i = 0; i < remaining.length; i += size) {
    await writeFile(join(BATCHES, `b-${String(n).padStart(3, "0")}.json`), JSON.stringify(remaining.slice(i, i + size), null, 2));
    n++;
  }
  console.log(`Total units: ${en.length} | translated: ${en.length - remaining.length} | remaining: ${remaining.length}`);
  console.log(`Wrote ${n} input batches (size ${size}) → i18n/batches/b-000..b-${String(n - 1).padStart(3, "0")}.json`);
}

async function merge() {
  const en = (await readJson(EN, [])).map((e) => e.t);
  const ko = await foldBatches(await loadKo());
  await writeFile(KO, JSON.stringify(ko, null, 2));
  const covered = en.filter((s) => ko[s]).length;
  console.log(`Coverage: ${covered}/${en.length} (${(covered / en.length * 100).toFixed(1)}%)`);
}

async function status() {
  const en = (await readJson(EN, [])).map((e) => e.t);
  const ko = await loadKo();
  const covered = en.filter((s) => ko[s]).length;
  console.log(`Coverage: ${covered}/${en.length} (${(covered / en.length * 100).toFixed(1)}%)`);
  if (existsSync(BATCHES)) {
    const outs = (await readdir(BATCHES)).filter((f) => /\.ko\.json$/.test(f));
    const ins = (await readdir(BATCHES)).filter((f) => /^b-\d+\.json$/.test(f));
    console.log(`Batches: ${ins.length} input, ${outs.length} translated output files`);
  }
}

const cmd = process.argv[2];
if (cmd === "make") await make(Number(process.argv[3] || 120));
else if (cmd === "merge") await merge();
else if (cmd === "status") await status();
else { console.error("usage: node tools/batch.mjs <make [size]|merge|status>"); process.exit(1); }
