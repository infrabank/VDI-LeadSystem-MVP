#!/usr/bin/env node
// Parse N2SF Appendix-1 security controls markdown -> controls.json
// Usage: node scripts/parse-n2sf-controls.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const INPUT = path.join(ROOT, "_raw/_md/appendix1/appendix1_security_controls.md");
const OUT_CONTROLS = path.join(ROOT, "src/lib/n2sf/controls.json");
const OUT_META = path.join(ROOT, "src/lib/n2sf/controls.meta.json");

// ── Domain metadata ──────────────────────────────────────────────────────────

const DOMAIN_KR = {
  LP: "최소 권한", IV: "신원 검증", IM: "식별자 관리", AC: "계정 관리",
  MA: "다중요소 인증", EI: "외부인증수단", DA: "단말인증", AU: "인증보호",
  AP: "인증정책", AM: "인증수단", LI: "로그인",
  SG: "분리", IS: "격리",
  IF: "정보흐름", EB: "외부경계", CD: "CDS", RA: "원격접속",
  SN: "세션", WA: "무선망 접속", BC: "블루투스 연결",
  EK: "암호 키 관리", EA: "암호 모듈 사용", DT: "데이터 전송", DU: "데이터 사용",
  MD: "모바일 단말", DV: "하드웨어", IN: "정보시스템 구성요소",
};

const DOMAIN_CHAPTER = {
  LP: 1, IV: 1, IM: 1, AC: 1,
  MA: 2, EI: 2, DA: 2, AU: 2, AP: 2, AM: 2, LI: 2,
  SG: 3, IS: 3,
  IF: 4, EB: 4, CD: 4, RA: 4, SN: 4, WA: 4, BC: 4,
  EK: 5, EA: 5, DT: 5, DU: 5,
  MD: 6, DV: 6, IN: 6,
};

const CHAPTER_KR = {
  1: "권한", 2: "인증", 3: "분리 및 격리", 4: "통제", 5: "데이터", 6: "정보자산",
};

// Expected counts derived from the actual file content (ground truth).
// Note: these differ from the original task spec which had errors.
const EXPECTED_COUNTS = {
  LP: 13, IV: 5,  IM: 5,  AC: 14,
  MA: 6,  EI: 3,  DA: 7,  AU: 10, AP: 8,  AM: 11, LI: 12,
  SG: 14, IS: 6,
  IF: 20, EB: 20, CD: 17, RA: 10, SN: 12, WA: 8,  BC: 1,
  EK: 9,  EA: 3,  DT: 6,  DU: 8,
  MD: 13, DV: 14, IN: 19,
};

const EXPECTED_TOTAL = Object.values(EXPECTED_COUNTS).reduce((a, b) => a + b, 0);

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseCSO(cell) {
  return {
    C: /\*\*C\*\*/.test(cell),
    S: /\*\*S\*\*/.test(cell),
    O: /\*\*O\*\*/.test(cell),
  };
}

function cleanText(s) {
  return s
    .replace(/<br>/gi, " ")
    .replace(/\*\*/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

// ── Parsing ───────────────────────────────────────────────────────────────────

function parseMarkdown(lines) {
  // ID_RE matches N2SF-XX-N, N2SF-XX-N(M), N2SF-XX-MN forms
  const ID_RE = /N2SF-([A-Z]{2,3})-(\d+(?:\(\d+\))?|M\d+)/;

  const controls = [];
  const seenIds = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip separator rows and empty lines
    if (!line.trim() || /^\|[-| ]+\|$/.test(line.trim())) continue;

    const m = ID_RE.exec(line);
    if (!m) continue;

    const fullId = m[0];
    const domain = m[1];

    // Skip unknown domains
    if (!DOMAIN_KR[domain]) continue;

    // Skip description rows — they start with ||| (4-col desc) or || with no
    // N2SF id in leading position, or are continuation text lines.
    // A header row has the N2SF ID as one of the FIRST TWO pipe-cells.
    // Strategy: split on | and check position of the ID.
    const cells = line.split("|");
    // cells[0] = before first |, cells[cells.length-1] = after last |
    // inner cells are cells[1..cells.length-2]
    const inner = cells.slice(1, -1);

    // Determine if this is a header row: ID must be in inner[0] or inner[1]
    const idPos = inner.findIndex(c => ID_RE.test(c));
    if (idPos < 0 || idPos > 1) continue; // ID not in first two cells → skip

    // Skip if already seen (deduplication for text mentions in other rows)
    if (seenIds.has(fullId)) continue;
    seenIds.add(fullId);

    // Extract CSO and title based on position
    let csoCell = "";
    let titleCell = "";

    if (inner.length >= 4) {
      // 4-col table formats:
      // Format A: ||N2SF-XX|cso|title|  → idPos=1, cso=inner[2], title=inner[3]
      // Format B: |N2SF-XX||cso|title|  → idPos=0, inner[1]="", cso=inner[2], title=inner[3]
      if (idPos === 0 && inner[1].trim() === "") {
        // Format B: ID in col0, empty col1, cso in col2, title in col3
        csoCell = inner[2] || "";
        titleCell = inner[3] || "";
      } else if (idPos === 1 && inner[0].trim() === "") {
        // Format A: empty col0, ID in col1, cso in col2, title in col3
        csoCell = inner[2] || "";
        titleCell = inner[3] || "";
      } else {
        // Fallback for 4-col
        csoCell = inner[idPos + 1] || "";
        titleCell = inner[idPos + 2] || "";
      }
    } else if (inner.length === 3) {
      // Format C: |N2SF-XX|cso|title|  → idPos=0
      csoCell = inner[1] || "";
      titleCell = inner[2] || "";
    } else {
      continue; // unexpected
    }

    // Find description line: next non-empty, non-separator row
    // For 4-col formats: description row starts with |||
    // For 3-col formats: description row starts with || (2 leading pipes)
    let description = "";
    const is4col = inner.length >= 4;

    for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
      const dl = lines[j];
      if (!dl.trim() || /^\|[-| ]+\|$/.test(dl.trim())) continue;

      let descMatch = null;
      if (is4col) {
        // |||<desc>|| or |||<desc>|
        descMatch = /^\|\|\|(.+?)(?:\|\||\|)?$/.exec(dl);
        if (descMatch) descMatch[1] = descMatch[1].replace(/\|+$/, "").trim();
      } else {
        // ||<desc>|| or ||<desc>|
        descMatch = /^\|\|(.+?)(?:\|\||\|)?$/.exec(dl);
        if (descMatch) {
          // Make sure it's not a |||... row (which would be 4-col desc)
          if (dl.startsWith("|||")) { descMatch = null; }
          else descMatch[1] = descMatch[1].replace(/\|+$/, "").trim();
        }
      }

      if (descMatch) {
        description = cleanText(descMatch[1]);
        break;
      }

      // Stop if we hit another header row (ID in leading cells)
      if (ID_RE.test(dl)) {
        const dc = dl.split("|").slice(1, -1);
        const dpos = dc.findIndex(c => ID_RE.test(c));
        if (dpos >= 0 && dpos <= 1) break;
      }
    }

    const chapter = DOMAIN_CHAPTER[domain];
    const cso = parseCSO(csoCell);
    const title = cleanText(titleCell);

    controls.push({
      id: fullId,
      domain,
      domain_kr: DOMAIN_KR[domain],
      chapter,
      chapter_kr: CHAPTER_KR[chapter],
      title,
      description,
      cso,
      is_managerial: /-M\d+/.test(fullId),
    });
  }

  return controls;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const raw = fs.readFileSync(INPUT, "utf-8");
const allLines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

// Find start of detail section: "## **1. 최소 권한 (Least Privilege, LP)**"
// This is the first domain section heading (markdown h2), after the summary
// table ends (~line 476 in the file). We match only h2-level headings to
// avoid hitting the TOC entry on line 17.
let detailStart = 475; // 0-based fallback (line 476 in 1-based)
for (let i = 0; i < allLines.length; i++) {
  if (/^##\s/.test(allLines[i]) &&
      (allLines[i].includes("최소 권한") || allLines[i].includes("Least Privilege"))) {
    detailStart = i;
    break;
  }
}

const detailLines = allLines.slice(detailStart);
const controls = parseMarkdown(detailLines);

// ── Validation ────────────────────────────────────────────────────────────────

const domainCounts = {};
for (const c of controls) {
  domainCounts[c.domain] = (domainCounts[c.domain] || 0) + 1;
}

const validationErrors = [];

if (controls.length !== EXPECTED_TOTAL) {
  validationErrors.push(`Total count mismatch: got ${controls.length}, expected ${EXPECTED_TOTAL}`);
}

for (const [domain, expected] of Object.entries(EXPECTED_COUNTS)) {
  const got = domainCounts[domain] || 0;
  if (got !== expected) {
    validationErrors.push(`Domain ${domain}: got ${got}, expected ${expected}`);
  }
}

// Check for duplicate IDs (should never happen after deduplication)
const seen = new Set();
for (const c of controls) {
  if (seen.has(c.id)) validationErrors.push(`Duplicate ID: ${c.id}`);
  seen.add(c.id);
}

// Print domain distribution
console.log("\nDomain distribution:");
for (const [domain, count] of Object.entries(domainCounts).sort()) {
  const expected = EXPECTED_COUNTS[domain] || "?";
  const ok = count === expected ? "OK" : `MISMATCH (expected ${expected})`;
  console.log(`  ${domain.padEnd(4)} ${String(count).padStart(3)}  ${ok}`);
}
console.log(`\nTotal: ${controls.length} / ${EXPECTED_TOTAL} expected`);

if (validationErrors.length > 0) {
  console.error("\nValidation FAILED:");
  for (const e of validationErrors) console.error("  " + e);
  process.exit(1);
}

// ── Write outputs ─────────────────────────────────────────────────────────────

fs.mkdirSync(path.dirname(OUT_CONTROLS), { recursive: true });

fs.writeFileSync(OUT_CONTROLS, JSON.stringify(controls, null, 2), "utf-8");
console.log(`\nWrote ${OUT_CONTROLS}`);

const meta = {
  source_version: "v1.0",
  extracted_from: "appendix1_security_controls.md",
  total_count: controls.length,
  domains: domainCounts,
  generated_at: new Date().toISOString(),
};
fs.writeFileSync(OUT_META, JSON.stringify(meta, null, 2), "utf-8");
console.log(`Wrote ${OUT_META}`);

console.log(`\n✓ ${controls.length} controls extracted, OK`);
