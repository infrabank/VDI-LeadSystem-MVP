// Post-process dist/ pages: Myloket branding + Korean web font + attribution/disclaimer,
// and localize remaining GitBook UI chrome (search box, search results, font-settings menu).
// Idempotent: HTML pages skip if already branded; JS chrome patch is plain string replace (no-op once Korean).
import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist");
const ORIGIN = "https://helpcenter.vinchin.com";

const STYLE = `
/* Myloket localization styles */
:root { --mlk:#00855b; }
body, .book, .markdown-section, .book-summary, .page-inner {
  font-family: "Pretendard","Apple SD Gothic Neo","Malgun Gothic","맑은 고딕",
    -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans KR",sans-serif !important;
  word-break: keep-all;
}
.markdown-section { line-height: 1.75; }
#mlk-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 9999;
  background: #0f1d2b; color: #e6eef5; font-size: 12px; line-height: 1.45;
  padding: 7px 14px; display: flex; gap: 8px 12px; align-items: center; justify-content: center;
  flex-wrap: wrap; box-shadow: 0 -1px 6px rgba(0,0,0,.18);
  font-family: "Pretendard","Apple SD Gothic Neo","Malgun Gothic",sans-serif;
}
#mlk-bar b { color:#fff; }
#mlk-bar .mlk-dot { color: var(--mlk); font-weight:700; }
#mlk-bar .mlk-sep { opacity:.4; }
#mlk-bar .mlk-note { opacity:.85; }
#mlk-bar a { color:#7fd4b6; text-decoration:none; font-weight:600; white-space:nowrap; }
#mlk-bar a:hover { text-decoration:underline; }
.book .book-body { padding-bottom: 46px; }
@media (max-width:600px){ #mlk-bar{ font-size:11px; padding:6px 10px; gap:4px 8px; } #mlk-bar .mlk-note{ display:none; } }
`;

function barHtml(originalUrl) {
  return `<div id="mlk-bar" role="contentinfo">` +
    `<span><span class="mlk-dot">●</span> <b>Myloket(마이로켓)</b> 제공 한글 번역본</span>` +
    `<span class="mlk-sep">|</span>` +
    `<span class="mlk-note">Vinchin Backup &amp; Recovery 공식 매뉴얼의 <b>비공식 한국어 번역</b>입니다. ` +
    `최신·정확한 내용은 원문을 기준으로 하세요. 모든 상표·이미지 권리는 Vinchin에 있습니다.</span>` +
    `<a href="${originalUrl}" target="_blank" rel="noopener nofollow">원문(English) ↗</a>` +
    `</div>`;
}

// Localize the GitBook search widget + results headings (spans are kept; JS fills them).
function localizeChrome($) {
  $("#book-search-input input").attr("placeholder", "검색어를 입력하세요");
  $(".search-results .has-results .search-results-title").html(
    `&ldquo;<span class="search-query"></span>&rdquo; 검색 결과 <span class="search-results-count"></span>건`
  );
  $(".search-results .no-results .search-results-title").html(
    `&ldquo;<span class="search-query"></span>&rdquo;에 대한 검색 결과가 없습니다`
  );
}

async function walk(dir, acc = []) {
  for (const n of await readdir(dir)) {
    const p = join(dir, n);
    const st = await stat(p);
    if (st.isDirectory()) await walk(p, acc);
    else if (extname(p).toLowerCase() === ".html") acc.push(p);
  }
  return acc;
}

// Patch font-settings menu labels (Theme/Family) in the plugin JS, in place. Idempotent.
async function patchFontSettings() {
  const js = join(DIST, "gitbook/gitbook-plugin-fontsettings/fontsettings.js");
  if (!existsSync(js)) return false;
  let src = await readFile(js, "utf8");
  const map = {
    "text: 'White'": "text: '화이트'",
    "text: 'Sepia'": "text: '세피아'",
    "text: 'Night'": "text: '나이트'",
    "text: 'Serif'": "text: '세리프'",
    "text: 'Sans'": "text: '산세리프'",
  };
  let changed = false;
  for (const [en, ko] of Object.entries(map)) {
    if (src.includes(en)) { src = src.split(en).join(ko); changed = true; }
  }
  if (changed) await writeFile(js, src);
  return changed;
}

const files = await walk(DIST);
let done = 0;
for (const f of files) {
  const html = await readFile(f, "utf8");
  if (html.includes('id="mlk-bar"')) { done++; continue; }
  const $ = cheerio.load(html, { decodeEntities: false });
  $("html").attr("lang", "ko");
  $("head").append(`<style id="mlk-style">${STYLE}</style>`);
  localizeChrome($);
  const rel = relative(DIST, f).split("\\").join("/");
  $("body").append(barHtml(`${ORIGIN}/${rel}`));
  await writeFile(f, $.html());
  done++;
}
const fontPatched = await patchFontSettings();
console.log(`Branded ${done}/${files.length} pages. Search+chrome localized. Font-settings JS patched: ${fontPatched}.`);
