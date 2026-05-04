/**
 * Generate /public/partners-onepager.pdf from /public/partners-onepager.html.
 *
 * Usage: node scripts/generate-onepager-pdf.mjs
 *
 * Run after editing partners-onepager.html. The PDF is committed so visitors can
 * download via /partners-onepager.pdf without server-side rendering.
 */

import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");

const htmlPath = resolve(projectRoot, "public/partners-onepager.html");
const pdfPath = resolve(projectRoot, "public/partners-onepager.pdf");
const fileUrl = `file:///${htmlPath.replace(/\\/g, "/")}`;

console.log(`Source HTML: ${htmlPath}`);
console.log(`Output PDF:  ${pdfPath}`);

const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage({
    viewport: { width: 1240, height: 1754 },
    deviceScaleFactor: 2,
  });
  await page.goto(fileUrl);
  await page.waitForLoadState("domcontentloaded");
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(400); // 폰트 렌더 대기

  await page.pdf({
    path: pdfPath,
    format: "A4",
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    printBackground: true,
    preferCSSPageSize: true,
  });

  console.log("✓ PDF generated successfully");
} finally {
  await browser.close();
}
