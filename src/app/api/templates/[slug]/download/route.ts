import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { findTemplate, TEMPLATE_CATEGORY_LABEL } from "@/lib/templates";
import { renderMarkdown } from "@/lib/markdown";
import { generatePdf } from "@/lib/pdf";
import { company } from "@/lib/site-config";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * 인쇄 친화적 PDF용 HTML 래퍼.
 * Pretendard CDN + A4 마진 + 헤더/푸터 페이지 번호.
 *
 * Pretendard는 Korean+Latin 통합 OTF로 Puppeteer에서 networkidle0 대기 시 로드됨.
 */
function buildPdfHtml(opts: {
  title: string;
  category: string;
  bodyHtml: string;
  updatedAt: string;
}): string {
  const today = new Date().toISOString().slice(0, 10);
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>${opts.title} | ${company.name}</title>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
/>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #0f172a;
    font-size: 11pt;
    line-height: 1.6;
  }
  .page {
    padding: 18mm 16mm 18mm 16mm;
  }
  header.cover {
    border-bottom: 4px solid #2563eb;
    padding-bottom: 18px;
    margin-bottom: 28px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12pt;
    font-weight: 700;
    color: #1e3a8a;
  }
  .brand .dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #2563eb;
    box-shadow: 0 0 8px rgba(37, 99, 235, 0.5);
  }
  .meta {
    text-align: right;
    font-size: 9pt;
    color: #64748b;
    line-height: 1.5;
  }
  .category-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 0.04em;
    margin-bottom: 14px;
  }
  h1.title {
    font-size: 24pt;
    line-height: 1.25;
    color: #0f172a;
    margin: 0 0 24px 0;
    font-weight: 700;
    letter-spacing: -0.5px;
  }
  article.body h1 {
    font-size: 18pt;
    margin: 28px 0 12px 0;
    color: #1e3a8a;
    font-weight: 700;
    border-bottom: 2px solid #dbeafe;
    padding-bottom: 6px;
  }
  article.body h2 {
    font-size: 14pt;
    margin: 22px 0 10px 0;
    color: #1d4ed8;
    font-weight: 700;
  }
  article.body h3 {
    font-size: 12pt;
    margin: 16px 0 6px 0;
    color: #1e293b;
    font-weight: 700;
  }
  article.body p {
    margin: 8px 0;
  }
  article.body ul, article.body ol {
    margin: 8px 0;
    padding-left: 22px;
  }
  article.body li {
    margin: 4px 0;
  }
  article.body blockquote {
    margin: 12px 0;
    padding: 10px 14px;
    background: #f8fafc;
    border-left: 4px solid #93c5fd;
    color: #1e293b;
    font-size: 10.5pt;
  }
  article.body code {
    background: #f1f5f9;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 10pt;
    color: #1e3a8a;
  }
  article.body table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 10pt;
  }
  article.body th,
  article.body td {
    border: 1px solid #cbd5e1;
    padding: 7px 10px;
    text-align: left;
    vertical-align: top;
  }
  article.body th {
    background: #f1f5f9;
    font-weight: 700;
    color: #0f172a;
  }
  article.body a { color: #1d4ed8; text-decoration: underline; }
  article.body strong { color: #0f172a; }
  article.body hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 22px 0;
  }
  footer.footnote {
    margin-top: 32px;
    padding-top: 14px;
    border-top: 1px solid #e2e8f0;
    font-size: 9pt;
    color: #64748b;
    display: flex;
    justify-content: space-between;
  }
</style>
</head>
<body>
  <div class="page">
    <header class="cover">
      <div class="brand">
        <span class="dot"></span>
        <span>${company.legalName}</span>
      </div>
      <div class="meta">
        <div>${company.taglineKo}</div>
        <div>${company.domain}</div>
      </div>
    </header>
    <span class="category-badge">${opts.category}</span>
    <h1 class="title">${opts.title}</h1>
    <article class="body">${opts.bodyHtml}</article>
    <footer class="footnote">
      <span>최근 갱신 ${opts.updatedAt} · 생성일 ${today}</span>
      <span>${company.email}</span>
    </footer>
  </div>
</body>
</html>`;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const template = findTemplate(slug);
  if (!template) {
    return NextResponse.json({ error: "template_not_found" }, { status: 404 });
  }

  let md: string;
  try {
    md = await readFile(
      join(process.cwd(), "docs", "templates", template.sourceFile),
      "utf-8",
    );
  } catch {
    return NextResponse.json({ error: "source_not_available" }, { status: 500 });
  }

  const bodyHtml = await renderMarkdown(md);
  const html = buildPdfHtml({
    title: template.title,
    category: TEMPLATE_CATEGORY_LABEL[template.category],
    bodyHtml,
    updatedAt: template.updatedAt,
  });

  let pdf: Buffer;
  try {
    pdf = await generatePdf(html);
  } catch (err) {
    console.error("[templates/download] generatePdf failed", err);
    return NextResponse.json({ error: "pdf_generation_failed" }, { status: 500 });
  }

  const filename = `${template.slug}-${template.updatedAt}.pdf`;
  // RFC 5987 — non-ASCII filename은 filename*=UTF-8''<encoded>로
  const filenameStarValue = encodeURIComponent(filename);

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${template.slug}-${template.updatedAt}.pdf"; filename*=UTF-8''${filenameStarValue}`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
