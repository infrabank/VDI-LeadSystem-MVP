// i18n harness for the Vinchin docs mirror (GitBook 3.2.3 static site).
//
// Translation units (global translation memory keyed by exact source string):
//   1. CONTENT blocks  — leaf block elements inside .markdown-section, translated as innerHTML
//      so inline tags (<strong>, <a>, <code>) and sentence word-order are preserved.
//   2. TEXT nodes      — everything else (sidebar nav labels, breadcrumbs, header/footer),
//      which are clean single labels with no fragmentation risk.
//   3. META            — <title> and <meta name=description>.
//
// Never touched: <script>, <style>, <pre>, <code>, <svg> bodies, all attributes except meta content,
// and all images (kept exactly as original).
//
// Commands:
//   node tools/i18n.mjs extract   → site/  → i18n/strings.en.json  (unique source strings + counts)
//   node tools/i18n.mjs apply     → site/ + i18n/strings.ko.json → dist/  (Korean site)
//   node tools/i18n.mjs assets    → copy non-HTML files site/ → dist/ (images/css/js, unchanged)
import { readFile, writeFile, mkdir, readdir, stat, copyFile } from "node:fs/promises";
import { join, dirname, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SITE = join(ROOT, "site");
const DIST = join(ROOT, "dist");
const I18N = join(ROOT, "i18n");
const EN_FILE = join(I18N, "strings.en.json");
const KO_FILE = join(I18N, "strings.ko.json");

const SKIP_TAGS = new Set(["script", "style", "pre", "code", "svg", "noscript"]);
const BLOCK_TAGS = ["p", "li", "h1", "h2", "h3", "h4", "h5", "h6", "td", "th", "caption", "dt", "dd", "figcaption", "blockquote"];
const BLOCK_SEL = BLOCK_TAGS.join(",");

const hasLetter = (s) => /[A-Za-z]/.test(s);
const normWs = (s) => s.replace(/\s+/g, " ").trim();
const padLike = (orig, tr) => orig.match(/^\s*/)[0] + tr + orig.match(/\s*$/)[0];
const loadHtml = (buf) => cheerio.load(buf.toString("utf8"), { decodeEntities: false });

function ancestorsSkipped(el) {
  let cur = el.parent;
  while (cur) { if (cur.name && SKIP_TAGS.has(cur.name)) return true; cur = cur.parent; }
  return false;
}

function markClaimed(el, set) {
  for (const c of el.children || []) {
    if (c.type === "text") set.add(c);
    else if (c.children) markClaimed(c, set);
  }
}

// Multiset of tag names in an HTML fragment — used to validate a translation didn't drop/add tags.
function tagSig(html) {
  const tags = (html.match(/<([a-z0-9]+)/gi) || []).map((t) => t.slice(1).toLowerCase()).filter((t) => t !== "br");
  return tags.sort().join(",");
}

// Returns ordered units: { kind:'html'|'text', key, get(), set(v) }.
function collectUnits($) {
  const units = [];
  const claimed = new Set();

  $(".markdown-section").find(BLOCK_SEL).each((_, el) => {
    if ($(el).find(BLOCK_SEL).length > 0) return;        // only leaf blocks
    if ($(el).closest("script,style,pre,code").length) return;
    const inner = $(el).html();
    if (inner == null || !hasLetter(inner)) return;
    const key = normWs(inner);
    if (!key) return;
    markClaimed(el, claimed);
    units.push({ kind: "html", key, get: () => $(el).html(), set: (v) => $(el).html(v) });
  });

  const visit = (el) => {
    if (!el) return;
    if (el.type === "text") {
      if (claimed.has(el) || ancestorsSkipped(el)) return;
      const raw = el.data;
      if (raw && hasLetter(raw) && raw.trim()) {
        units.push({ kind: "text", key: raw.trim(), get: () => el.data, set: (v) => { el.data = padLike(el.data, v); } });
      }
      return;
    }
    if (el.name && SKIP_TAGS.has(el.name)) return;
    if (el.children) el.children.forEach(visit);
  };
  $("body").each((_, b) => (b.children || []).forEach(visit));

  const title = $("head > title").first();
  if (title.length && hasLetter(title.text())) {
    const key = normWs(title.text());
    units.push({ kind: "text", key, get: () => title.text(), set: (v) => title.text(v) });
  }
  const meta = $('meta[name="description"]').first();
  if (meta.length && meta.attr("content") && hasLetter(meta.attr("content"))) {
    const key = normWs(meta.attr("content"));
    units.push({ kind: "text", key, get: () => meta.attr("content"), set: (v) => meta.attr("content", v) });
  }
  return units;
}

async function walkFiles(dir, ext, acc = []) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    const st = await stat(p);
    if (st.isDirectory()) await walkFiles(p, ext, acc);
    else if (!ext || extname(p).toLowerCase() === ext) acc.push(p);
  }
  return acc;
}

async function extract() {
  const files = await walkFiles(SITE, ".html");
  const map = new Map(); // key -> { c, kind }
  for (const f of files) {
    const $ = loadHtml(await readFile(f));
    for (const u of collectUnits($)) {
      const cur = map.get(u.key);
      if (cur) cur.c++;
      else map.set(u.key, { c: 1, kind: u.kind });
    }
  }
  const entries = [...map.entries()].sort((a, b) => b[1].c - a[1].c);
  await mkdir(I18N, { recursive: true });
  await writeFile(EN_FILE, JSON.stringify(entries.map(([t, m]) => ({ t, c: m.c, kind: m.kind })), null, 2));
  const total = entries.reduce((n, [, m]) => n + m.c, 0);
  const htmlU = entries.filter(([, m]) => m.kind === "html").length;
  console.log(`Pages: ${files.length}`);
  console.log(`Unique units: ${entries.length}  (html-blocks: ${htmlU}, text: ${entries.length - htmlU})`);
  console.log(`Total occurrences: ${total}`);
  console.log(`Total source chars: ${entries.reduce((n, [t]) => n + t.length, 0)}`);
  console.log(`Wrote ${relative(ROOT, EN_FILE)}`);
}

async function apply() {
  let ko = {};
  try { ko = JSON.parse(await readFile(KO_FILE, "utf8")); }
  catch { console.error(`Missing ${relative(ROOT, KO_FILE)} — translate first.`); process.exit(1); }
  const files = await walkFiles(SITE, ".html");
  let pages = 0, repl = 0, tagFails = 0;
  const missing = new Set();
  for (const f of files) {
    const $ = loadHtml(await readFile(f));
    $("html").attr("lang", "ko");
    for (const u of collectUnits($)) {
      const tr = ko[u.key];
      if (!tr) { missing.add(u.key); continue; }
      if (u.kind === "html" && tagSig(u.get()) !== tagSig(tr)) { tagFails++; continue; } // keep English if tags mangled
      u.set(tr);
      repl++;
    }
    const out = join(DIST, relative(SITE, f));
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, $.html());
    pages++;
  }
  console.log(`Applied to ${pages} pages, ${repl} replacements, ${tagFails} tag-mismatch skips.`);
  console.log(`Untranslated unique units remaining: ${missing.size}`);
  if (missing.size) await writeFile(join(I18N, "missing.json"), JSON.stringify([...missing], null, 2));
}

async function assets() {
  const files = await walkFiles(SITE, null);
  let n = 0;
  for (const f of files) {
    if (extname(f).toLowerCase() === ".html") continue;
    const out = join(DIST, relative(SITE, f));
    await mkdir(dirname(out), { recursive: true });
    await copyFile(f, out);
    n++;
  }
  console.log(`Copied ${n} asset files (images/css/js) site/ → dist/`);
}

const cmd = process.argv[2];
if (cmd === "extract") await extract();
else if (cmd === "apply") await apply();
else if (cmd === "assets") await assets();
else { console.error("usage: node tools/i18n.mjs <extract|apply|assets>"); process.exit(1); }
