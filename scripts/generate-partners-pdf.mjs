import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";

const htmlPath = path.resolve("public/partners-onepager.html");
const outPath = path.resolve("public/partners-onepager.pdf");
const fileUrl = pathToFileURL(htmlPath).href;

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.goto(fileUrl, { waitUntil: "networkidle0" });
  await page.emulateMediaType("print");
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    preferCSSPageSize: true,
  });
  fs.writeFileSync(outPath, pdf);
  const stats = fs.statSync(outPath);
  console.log("PDF written:", outPath, "(" + Math.round(stats.size / 1024) + " KB)");
} finally {
  await browser.close();
}
