import type { ReviewRequest, ReportContent } from "@/lib/types/sap";
import { VENDOR_LABELS, NETWORK_LABELS } from "@/lib/types/sap";

/**
 * Render SAP review report as a self-contained HTML page for PDF generation.
 * Supports 8-section structure with proposal snippets, risk flags,
 * categorized Q&A, and conclusion section.
 */
export function renderSAPReportHtml(
  request: ReviewRequest,
  content: ReportContent
): string {
  const vendorName = VENDOR_LABELS[request.vendor_track] ?? request.vendor_track;
  const networkName = NETWORK_LABELS[request.network_type] ?? request.network_type;
  const riskColor =
    content.risk_level === "low"
      ? "#16a34a"
      : content.risk_level === "medium"
        ? "#d97706"
        : content.risk_level === "high"
          ? "#dc2626"
          : "#7c2d12";
  const riskLabel =
    content.risk_level === "low"
      ? "낮음"
      : content.risk_level === "medium"
        ? "보통"
        : content.risk_level === "high"
          ? "높음"
          : "심각";

  // --- Sections ---
  const sectionsHtml = content.sections
    .map(
      (s) => `
      <div class="section">
        <h2>${esc(s.title)}</h2>
        <div class="section-body">${esc(s.body).replace(/\n/g, "<br>")}</div>
      </div>`
    )
    .join("\n");

  // --- Top issues / recommendations ---
  const issuesHtml = content.top_issues
    .map((i) => `<li>${esc(i)}</li>`)
    .join("\n");

  const recsHtml = content.top_recommendations
    .map((r) => `<li>${esc(r)}</li>`)
    .join("\n");

  // --- Risk flags ---
  const riskFlagsHtml =
    content.risk_flags && content.risk_flags.length > 0
      ? `<div class="risk-flags">
        ${content.risk_flags.map((f) => `<span class="risk-flag">${esc(f)}</span>`).join("\n        ")}
      </div>`
      : "";

  // --- Q&A grouped by category ---
  // Build ordered list of categories, preserving first-occurrence order.
  const categoryOrder: string[] = [];
  const categoryMap: Map<string, typeof content.qa_items> = new Map();
  for (const qa of content.qa_items) {
    const cat = qa.category?.trim() || "일반";
    if (!categoryMap.has(cat)) {
      categoryOrder.push(cat);
      categoryMap.set(cat, []);
    }
    categoryMap.get(cat)!.push(qa);
  }

  let globalQIndex = 0;
  const qaHtml = categoryOrder
    .map((cat) => {
      const items = categoryMap.get(cat)!;
      const itemsHtml = items
        .map((qa) => {
          globalQIndex += 1;
          return `
        <div class="qa-item">
          <div class="qa-q">Q${globalQIndex}. ${esc(qa.question)}</div>
          <div class="qa-a">${esc(qa.answer)}</div>
        </div>`;
        })
        .join("\n");
      return `
      <div class="qa-category">
        <h3>${esc(cat)}</h3>
        ${itemsHtml}
      </div>`;
    })
    .join("\n");

  // --- Proposal snippets ---
  const proposalHtml =
    content.proposal_snippets && content.proposal_snippets.length > 0
      ? `<div class="proposal-section">
    <h2>제안서 삽입 문구 모음</h2>
    ${content.proposal_snippets
      .map(
        (snip) => `<div class="proposal-card">
      <p>${esc(snip).replace(/\n/g, "<br>")}</p>
    </div>`
      )
      .join("\n    ")}
  </div>`
      : "";

  // --- Conclusion ---
  const conclusionHtml = content.conclusion
    ? `<div class="conclusion">
    <h2>결론 및 수주 영향도 분석</h2>
    <p>${esc(content.conclusion).replace(/\n/g, "<br>")}</p>
  </div>`
    : "";

  // --- Backup retention display ---
  const backupRetentionDisplay =
    request.backup_retention_months != null
      ? `${request.backup_retention_months}개월`
      : "미지정";

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>VDI 기술 검토 리포트 — ${esc(request.project_name)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-size: 11pt; color: #1a1a1a; line-height: 1.6; }
    .cover { text-align: center; padding: 60px 40px; border-bottom: 3px solid #2563eb; margin-bottom: 30px; }
    .cover h1 { font-size: 24pt; color: #1e3a5f; margin-bottom: 12px; }
    .cover .subtitle { font-size: 14pt; color: #475569; }
    .cover .meta { margin-top: 20px; font-size: 10pt; color: #64748b; }
    .risk-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; color: white; font-weight: bold; font-size: 12pt; margin-top: 16px; background: ${riskColor}; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 20px 0; padding: 16px; background: #f8fafc; border-radius: 8px; font-size: 10pt; }
    .info-grid dt { color: #64748b; }
    .info-grid dd { font-weight: 600; }
    .executive { padding: 20px; background: #eff6ff; border-left: 4px solid #2563eb; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .executive h2 { color: #1e40af; margin-bottom: 8px; }
    .risk-flags { margin: 12px 0 20px 0; }
    .risk-flag { display: inline-block; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 12px; font-size: 9pt; font-weight: 600; margin: 2px 4px; }
    .top-list { margin: 16px 0; }
    .top-list h3 { font-size: 11pt; color: #1e3a5f; margin-bottom: 6px; }
    .top-list ul { padding-left: 20px; }
    .top-list li { margin-bottom: 4px; }
    .section { margin: 24px 0; page-break-inside: avoid; }
    .section h2 { font-size: 14pt; color: #1e3a5f; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px; }
    .section-body { white-space: pre-line; font-size: 10.5pt; }
    .proposal-section { margin: 30px 0; page-break-before: auto; }
    .proposal-section h2 { font-size: 14pt; color: #1e3a5f; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 14px; }
    .proposal-card { border: 1px solid #cbd5e1; border-left: 4px solid #2563eb; padding: 12px 16px; margin-bottom: 12px; border-radius: 0 8px 8px 0; background: #f8fafc; }
    .qa-section { margin-top: 30px; page-break-before: auto; }
    .qa-section h2 { font-size: 14pt; color: #1e3a5f; border-bottom: 2px solid #2563eb; padding-bottom: 6px; margin-bottom: 16px; }
    .qa-category { page-break-inside: avoid; margin-bottom: 8px; }
    .qa-category h3 { font-size: 11pt; color: #1e3a5f; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin: 16px 0 8px 0; }
    .qa-item { margin-bottom: 14px; }
    .qa-q { font-weight: 700; color: #1e3a5f; margin-bottom: 2px; }
    .qa-a { padding-left: 12px; color: #334155; font-size: 10.5pt; }
    .conclusion { background: linear-gradient(135deg, #eff6ff, #f0fdf4); border: 2px solid #2563eb; border-radius: 12px; padding: 20px; margin: 30px 0; }
    .conclusion h2 { font-size: 14pt; color: #1e3a5f; margin-bottom: 10px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 9pt; color: #94a3b8; }
    @media print { .section { page-break-inside: avoid; } .qa-category { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="cover">
    <h1>VDI 기술 검토 리포트</h1>
    <div class="subtitle">${esc(request.project_name)}</div>
    <div class="risk-badge">위험도: ${riskLabel}</div>
    <div class="meta">
      작성일: ${new Date().toLocaleDateString("ko-KR")} | ${esc(request.customer_name ?? "")}
    </div>
  </div>

  <dl class="info-grid">
    <dt>벤더 트랙</dt><dd>${vendorName}</dd>
    <dt>네트워크</dt><dd>${networkName}</dd>
    <dt>사용자 수</dt><dd>${request.user_count}명</dd>
    <dt>사이트 수</dt><dd>${request.site_count}개</dd>
    <dt>HA</dt><dd>${request.ha_required ? "필요" : "불필요"}</dd>
    <dt>DR</dt><dd>${request.dr_required ? "필요" : "불필요"}</dd>
    <dt>백업</dt><dd>${request.backup_required ? "필요" : "불필요"}</dd>
    <dt>백업 보존 기간</dt><dd>${backupRetentionDisplay}</dd>
  </dl>

  <div class="executive">
    <h2>Executive Summary</h2>
    <p>${esc(content.executive_summary).replace(/\n/g, "<br>")}</p>
  </div>

  ${riskFlagsHtml}

  ${
    content.top_issues.length > 0
      ? `<div class="top-list"><h3>주요 이슈 (Top 3)</h3><ul>${issuesHtml}</ul></div>`
      : ""
  }

  ${
    content.top_recommendations.length > 0
      ? `<div class="top-list"><h3>주요 권고사항 (Top 3)</h3><ul>${recsHtml}</ul></div>`
      : ""
  }

  ${sectionsHtml}

  ${proposalHtml}

  <div class="qa-section">
    <h2>Q&amp;A</h2>
    ${qaHtml}
  </div>

  ${conclusionHtml}

  <div class="footer">
    VDI Expert — Sales Assurance Program | Confidential
  </div>
</body>
</html>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
