// Mirror helpcenter.vinchin.com (GitBook 3.2.3 static site) into ./site
// Preserves exact directory structure so all relative links/assets/images resolve identically.
// Same-origin assets are downloaded; cross-origin (e.g. www.vinchin.com images) stay as original links.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const ORIGIN = "https://helpcenter.vinchin.com";
const ROOT = new URL("/", ORIGIN).href;
const OUT = fileURLToPath(new URL("../site/", import.meta.url));
const MANIFEST = fileURLToPath(new URL("../manifest.json", import.meta.url));
const UA = "Mozilla/5.0 (compatible; MyloketDocsMirror/1.0)";

const HTML_EXTS = /\.html?$/i;
const ASSET_EXTS = /\.(css|js|json|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|map)$/i;

const visited = new Set();
const htmlPages = new Set();
const queue = [];
let downloaded = 0, failed = 0;

function toLocalPath(urlStr) {
  const u = new URL(urlStr);
  let p = decodeURIComponent(u.pathname);
  if (p.endsWith("/")) p += "index.html";
  if (p.startsWith("/")) p = p.slice(1);
  return p;
}

function sameOrigin(urlStr) {
  try { return new URL(urlStr).origin === ORIGIN; } catch { return false; }
}

async function fetchBuf(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  const buf = Buffer.from(await res.arrayBuffer());
  return { buf, ct };
}

async function save(localPath, buf) {
  const fsPath = join(OUT, localPath);
  await mkdir(dirname(fsPath), { recursive: true });
  await writeFile(fsPath, buf);
}

function extractRefs($, pageUrl) {
  const refs = [];
  const add = (val) => {
    if (!val) return;
    if (/^(data:|mailto:|tel:|javascript:|#)/i.test(val)) return;
    let abs;
    try { abs = new URL(val, pageUrl).href; } catch { return; }
    abs = abs.split("#")[0];
    if (sameOrigin(abs)) refs.push(abs);
  };
  $("a[href]").each((_, el) => add($(el).attr("href")));
  $("link[href]").each((_, el) => add($(el).attr("href")));
  $("script[src]").each((_, el) => add($(el).attr("src")));
  $("img[src]").each((_, el) => add($(el).attr("src")));
  $("img[data-src]").each((_, el) => add($(el).attr("data-src")));
  $("source[src]").each((_, el) => add($(el).attr("src")));
  return refs;
}

async function processOne(url) {
  const clean = url.split("#")[0];
  if (visited.has(clean)) return;
  visited.add(clean);
  const localPath = toLocalPath(clean);
  const isHtml = HTML_EXTS.test(localPath) || !/\.[a-z0-9]+$/i.test(localPath);
  const isAsset = ASSET_EXTS.test(localPath);
  if (!isHtml && !isAsset) return;
  try {
    const { buf, ct } = await fetchBuf(clean);
    await save(localPath, buf);
    downloaded++;
    if (isHtml || ct.includes("text/html")) {
      htmlPages.add(localPath);
      const $ = cheerio.load(buf.toString("utf8"));
      for (const ref of extractRefs($, clean)) {
        if (!visited.has(ref)) queue.push(ref);
      }
    }
    if (downloaded % 25 === 0) console.log(`  …${downloaded} files (queue ${queue.length})`);
  } catch (e) {
    failed++;
    console.warn(`  ! ${clean} -> ${e.message}`);
  }
}

async function run() {
  console.log(`Mirroring ${ORIGIN} → site/`);
  queue.push(ROOT);
  const CONC = 8;
  while (queue.length) {
    const batch = queue.splice(0, CONC);
    await Promise.all(batch.map(processOne));
  }
  const pages = [...htmlPages].sort();
  await writeFile(MANIFEST, JSON.stringify({
    origin: ORIGIN, generated: "mirror", total: pages.length,
    pages: pages.map((p) => ({ path: p, translated: false })),
  }, null, 2));
  console.log(`\nDone. downloaded=${downloaded} failed=${failed} htmlPages=${pages.length}`);
  console.log(`Manifest: vinchin-docs/manifest.json`);
}

run();
