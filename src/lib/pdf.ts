import { readFileSync } from "fs";
import { join } from "path";

interface ReportData {
  company: string;
  date: string;
  score: number;
  risk_level: string;
  risks: string[];
  next_steps: string[];
  input: Record<string, unknown>;
}

const RISK_LEVEL_LABELS: Record<string, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  critical: "매우 높음",
};

const RISK_LEVEL_DESCRIPTIONS: Record<string, string> = {
  low: "현재 환경의 리스크가 낮습니다. 표준 절차에 따라 진행하세요.",
  medium: "일부 리스크 요소가 있습니다. 사전 계획을 꼼꼼히 수립하세요.",
  high: "높은 리스크가 감지되었습니다. 전문가 검토를 권장합니다.",
  critical:
    "매우 높은 리스크입니다. 반드시 전문 컨설팅을 받은 후 진행하세요.",
};

const INPUT_LABELS: Record<string, string> = {
  platform: "플랫폼",
  vm_count: "VM 수",
  network_separation: "네트워크 분리",
  storage_migration: "스토리지 이관",
  backup_exists: "백업 체계",
  downtime_tolerance: "다운타임 허용",
  ops_staff_level: "운영 인력 수준",
};

function formatInputValue(key: string, value: unknown): string {
  if (typeof value === "boolean") return value ? "예" : "아니오";
  if (key === "downtime_tolerance") {
    const map: Record<string, string> = {
      none: "허용 불가",
      short: "짧은 시간",
      night: "야간 작업 가능",
    };
    return map[value as string] || String(value);
  }
  if (key === "ops_staff_level") {
    const map: Record<string, string> = {
      low: "낮음",
      mid: "보통",
      high: "높음",
    };
    return map[value as string] || String(value);
  }
  return String(value);
}

export function renderReportHtml(data: ReportData): string {
  const templatePath = join(
    process.cwd(),
    "src/templates/reports/risk-assessment.html"
  );
  let html = readFileSync(templatePath, "utf-8");

  // Replace simple placeholders
  html = html.replace(/\{\{company\}\}/g, data.company || "-");
  html = html.replace(/\{\{date\}\}/g, data.date);
  html = html.replace(/\{\{score\}\}/g, String(data.score));
  html = html.replace(/\{\{risk_level\}\}/g, data.risk_level);
  html = html.replace(
    /\{\{risk_level_label\}\}/g,
    RISK_LEVEL_LABELS[data.risk_level] || data.risk_level
  );
  html = html.replace(
    /\{\{risk_level_description\}\}/g,
    RISK_LEVEL_DESCRIPTIONS[data.risk_level] || ""
  );

  // Risks HTML
  const risksHtml = data.risks
    .map(
      (risk, i) =>
        `<div class="risk-item"><span class="num">${i + 1}</span><span>${risk}</span></div>`
    )
    .join("\n");
  html = html.replace(/\{\{risks_html\}\}/g, risksHtml);

  // Next steps HTML
  const stepsHtml = data.next_steps
    .map(
      (step, i) =>
        `<div class="step-item"><span class="num">${i + 1}</span><span>${step}</span></div>`
    )
    .join("\n");
  html = html.replace(/\{\{next_steps_html\}\}/g, stepsHtml);

  // Input table HTML
  const inputRows = Object.entries(data.input)
    .filter(([key]) => INPUT_LABELS[key])
    .map(
      ([key, value]) =>
        `<tr><th>${INPUT_LABELS[key]}</th><td>${formatInputValue(key, value)}</td></tr>`
    )
    .join("\n");
  html = html.replace(/\{\{input_table_html\}\}/g, inputRows);

  return html;
}

// === ROI Report ===

interface ROIReportData {
  company: string;
  date: string;
  annual_loss: number;
  annual_saving: number;
  investment_cost: number;
  payback_years: number | null;
  grade: string;
  risk_summary: string[];
  improvement_effects: string[];
  next_steps: string[];
  formatted: Record<string, string>;
  input: Record<string, unknown>;
}

const GRADE_LABELS: Record<string, string> = {
  high: "높음 (5억원 초과)",
  medium: "보통 (1~5억원)",
  low: "낮음 (1억원 이하)",
};

const ROI_INPUT_LABELS: Record<string, string> = {
  total_users: "VDI 사용자 수",
  avg_hourly_cost: "1인 시간당 인건비",
  avg_downtime_hours: "1회 평균 중단시간",
  incidents_per_year: "연간 장애 횟수",
  current_backup: "백업/DR 체계",
  recovery_time_improvement_percent: "복구시간 단축 예상률",
};

function formatROIInputValue(key: string, value: unknown): string {
  if (typeof value === "boolean") return value ? "보유" : "미보유";
  if (key === "avg_hourly_cost") {
    return new Intl.NumberFormat("ko-KR").format(Number(value)) + "원";
  }
  if (key === "avg_downtime_hours") return value + "시간";
  if (key === "incidents_per_year") return value + "회";
  if (key === "total_users") return value + "명";
  if (key === "recovery_time_improvement_percent") return value + "%";
  return String(value);
}

export function renderROIReportHtml(data: ROIReportData): string {
  const templatePath = join(
    process.cwd(),
    "src/templates/reports/roi-downtime.html"
  );
  let html = readFileSync(templatePath, "utf-8");

  html = html.replace(/\{\{company\}\}/g, data.company || "-");
  html = html.replace(/\{\{date\}\}/g, data.date);
  html = html.replace(/\{\{grade\}\}/g, data.grade);
  html = html.replace(
    /\{\{grade_label\}\}/g,
    GRADE_LABELS[data.grade] || data.grade
  );
  html = html.replace(
    /\{\{annual_loss_formatted\}\}/g,
    data.formatted.annual_loss
  );
  html = html.replace(
    /\{\{annual_saving_formatted\}\}/g,
    data.formatted.annual_saving
  );
  html = html.replace(
    /\{\{payback_years_formatted\}\}/g,
    data.formatted.payback_years
  );

  // Risk summary
  const riskSummaryHtml = data.risk_summary
    .map((line) => `<div class="insight-item">${line}</div>`)
    .join("\n");
  html = html.replace(/\{\{risk_summary_html\}\}/g, riskSummaryHtml);

  // Improvement effects
  const effectsHtml = data.improvement_effects
    .map(
      (effect, i) =>
        `<div class="effect-item"><span class="num">${i + 1}</span><span>${effect}</span></div>`
    )
    .join("\n");
  html = html.replace(/\{\{improvement_effects_html\}\}/g, effectsHtml);

  // Next steps
  const stepsHtml = data.next_steps
    .map(
      (step, i) =>
        `<div class="step-item"><span class="num">${i + 1}</span><span>${step}</span></div>`
    )
    .join("\n");
  html = html.replace(/\{\{next_steps_html\}\}/g, stepsHtml);

  // Input table
  const inputRows = Object.entries(data.input)
    .filter(([key]) => ROI_INPUT_LABELS[key])
    .map(
      ([key, value]) =>
        `<tr><th>${ROI_INPUT_LABELS[key]}</th><td>${formatROIInputValue(key, value)}</td></tr>`
    )
    .join("\n");
  html = html.replace(/\{\{input_table_html\}\}/g, inputRows);

  return html;
}

// === ROI V2 Report ===

export interface ROIV2ReportData {
  company: string;
  date: string;
  output: {
    grade: string;
    annual_loss: number;
    annual_saving: number;
    loss_3y: number;
    saving_3y: number;
    major_incident_loss: number;
    benchmark_text: string;
    benchmark_comparison: string;
    warnings: string[];
    next_steps: string[];
    risk_summary: string[];
    improvement_effects: string[];
    assumptions: {
      impact_rate_percent: number;
      recovery_time_improvement_percent: number;
      major_incident_hours: number;
      investment_model: string;
      base_cost_low: number;
      base_cost_high: number;
      per_user_low: number;
      per_user_high: number;
    };
    formatted: {
      annual_loss: string;
      annual_saving: string;
      loss_3y: string;
      saving_3y: string;
      major_incident_loss: string;
      investment_range: string;
      payback_range: string;
      investment_low: string;
      investment_high: string;
    };
  };
  input: Record<string, unknown>;
}

const GRADE_LABELS_V2: Record<string, string> = {
  critical: "매우 높음 (5억원 초과)",
  high: "높음 (1~5억원)",
  medium: "보통 (3천만~1억원)",
  low: "낮음 (3천만원 이하)",
};

const ROI_V2_INPUT_LABELS: Record<string, string> = {
  total_users: "VDI 사용자 수",
  avg_hourly_cost: "1인 시간당 인건비",
  avg_downtime_hours: "1회 평균 중단시간",
  incidents_per_year: "연간 장애 횟수",
  current_backup: "백업/DR 체계",
  recovery_time_improvement_percent: "복구시간 단축 예상률",
  impact_rate_percent: "생산성 영향률",
  major_incident_hours: "대형 장애 가정시간",
};

function formatROIV2InputValue(key: string, value: unknown): string {
  if (typeof value === "boolean") return value ? "보유" : "미보유";
  if (key === "avg_hourly_cost") {
    return new Intl.NumberFormat("ko-KR").format(Number(value)) + "원";
  }
  if (key === "avg_downtime_hours") return value + "시간";
  if (key === "incidents_per_year") return value + "회";
  if (key === "total_users") return value + "명";
  if (key === "recovery_time_improvement_percent") return value + "%";
  if (key === "impact_rate_percent") return value + "%";
  if (key === "major_incident_hours") return value + "시간";
  return String(value);
}

function formatFullKRW(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(amount)) + "원";
}

export function renderROIV2ReportHtml(data: ROIV2ReportData): string {
  const templatePath = join(
    process.cwd(),
    "src/templates/reports/roi-downtime-v2.html"
  );
  let html = readFileSync(templatePath, "utf-8");

  const { output, input } = data;
  const { assumptions, formatted } = output;

  // Simple placeholders
  html = html.replace(/\{\{company\}\}/g, data.company || "-");
  html = html.replace(/\{\{date\}\}/g, data.date);
  html = html.replace(/\{\{grade\}\}/g, output.grade);
  html = html.replace(
    /\{\{grade_label\}\}/g,
    GRADE_LABELS_V2[output.grade] || output.grade
  );
  html = html.replace(/\{\{annual_loss_fmt\}\}/g, formatted.annual_loss);
  html = html.replace(
    /\{\{annual_loss_full\}\}/g,
    formatFullKRW(output.annual_loss)
  );
  html = html.replace(/\{\{annual_saving_fmt\}\}/g, formatted.annual_saving);
  html = html.replace(
    /\{\{annual_saving_full\}\}/g,
    formatFullKRW(output.annual_saving)
  );
  html = html.replace(/\{\{payback_range\}\}/g, formatted.payback_range);
  html = html.replace(/\{\{investment_range\}\}/g, formatted.investment_range);
  html = html.replace(/\{\{loss_3y_fmt\}\}/g, formatted.loss_3y);
  html = html.replace(/\{\{saving_3y_fmt\}\}/g, formatted.saving_3y);
  html = html.replace(
    /\{\{major_incident_loss_fmt\}\}/g,
    formatted.major_incident_loss
  );
  html = html.replace(/\{\{benchmark_text\}\}/g, output.benchmark_text);
  html = html.replace(
    /\{\{benchmark_comparison\}\}/g,
    output.benchmark_comparison
  );
  html = html.replace(/\{\{investment_model\}\}/g, assumptions.investment_model);
  html = html.replace(
    /\{\{base_cost_low_fmt\}\}/g,
    formatFullKRW(assumptions.base_cost_low)
  );
  html = html.replace(
    /\{\{base_cost_high_fmt\}\}/g,
    formatFullKRW(assumptions.base_cost_high)
  );
  html = html.replace(
    /\{\{per_user_low_fmt\}\}/g,
    formatFullKRW(assumptions.per_user_low)
  );
  html = html.replace(
    /\{\{per_user_high_fmt\}\}/g,
    formatFullKRW(assumptions.per_user_high)
  );
  html = html.replace(
    /\{\{impact_rate_percent\}\}/g,
    String(assumptions.impact_rate_percent)
  );
  html = html.replace(
    /\{\{recovery_percent\}\}/g,
    String(assumptions.recovery_time_improvement_percent)
  );
  html = html.replace(
    /\{\{major_hours\}\}/g,
    String(assumptions.major_incident_hours)
  );

  // Warnings HTML
  const warningsHtml = output.warnings
    .map((w) => `<div class="warning-item">${w}</div>`)
    .join("\n");
  html = html.replace(/\{\{warnings_html\}\}/g, warningsHtml);

  // Next steps HTML
  const nextStepsHtml = output.next_steps
    .map(
      (step, i) =>
        `<div class="step-item"><span class="num">${i + 1}</span><span>${step}</span></div>`
    )
    .join("\n");
  html = html.replace(/\{\{next_steps_html\}\}/g, nextStepsHtml);

  // Risk summary HTML
  const riskSummaryHtml = output.risk_summary
    .map(
      (item, i) =>
        `<div class="risk-item"><span class="num">${i + 1}</span><span>${item}</span></div>`
    )
    .join("\n");
  html = html.replace(/\{\{risk_summary_html\}\}/g, riskSummaryHtml);

  // Improvement effects HTML
  const effectsHtml = output.improvement_effects
    .map(
      (effect, i) =>
        `<div class="effect-item"><span class="num">${i + 1}</span><span>${effect}</span></div>`
    )
    .join("\n");
  html = html.replace(/\{\{improvement_effects_html\}\}/g, effectsHtml);

  // Input table HTML
  const inputRows = Object.entries(input)
    .filter(([key]) => ROI_V2_INPUT_LABELS[key])
    .map(
      ([key, value]) =>
        `<tr><th>${ROI_V2_INPUT_LABELS[key]}</th><td>${formatROIV2InputValue(key, value)}</td></tr>`
    )
    .join("\n");
  html = html.replace(/\{\{input_table_html\}\}/g, inputRows);

  return html;
}

// === Risk Assessment V2 Report ===

import type { RiskAssessmentV2Output } from "@/lib/scoring/risk-assessment-v2";

export interface RiskV2ReportData {
  company: string;
  date: string;
  output: RiskAssessmentV2Output;
  input: Record<string, unknown>;
}

const RISK_V2_LEVEL_LABELS: Record<string, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  critical: "매우 높음",
};

const LIKELIHOOD_LABELS: Record<string, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
};

export function renderRiskV2ReportHtml(data: RiskV2ReportData): string {
  const templatePath = join(
    process.cwd(),
    "src/templates/reports/risk-assessment-v2.html"
  );
  let html = readFileSync(templatePath, "utf-8");

  const { output, input } = data;
  const mm = output.maturity_model;

  // Simple placeholders
  html = html.replace(/\{\{company\}\}/g, data.company || "-");
  html = html.replace(/\{\{date\}\}/g, data.date);
  html = html.replace(/\{\{score\}\}/g, String(output.score));
  html = html.replace(/\{\{risk_level\}\}/g, output.risk_level);
  html = html.replace(
    /\{\{risk_level_label\}\}/g,
    RISK_V2_LEVEL_LABELS[output.risk_level] || output.risk_level
  );
  html = html.replace(/\{\{executive_summary\}\}/g, output.executive_summary);
  html = html.replace(/\{\{benchmark_text\}\}/g, output.benchmark_text);
  html = html.replace(/\{\{benchmark_comparison\}\}/g, output.benchmark_comparison);

  // Maturity scores
  html = html.replace(/\{\{migration_score\}\}/g, String(mm.migration.score));
  html = html.replace(/\{\{migration_level\}\}/g, String(mm.migration.level));
  html = html.replace(/\{\{dr_score\}\}/g, String(mm.dr.score));
  html = html.replace(/\{\{dr_level\}\}/g, String(mm.dr.level));
  html = html.replace(/\{\{ops_score\}\}/g, String(mm.operations.score));
  html = html.replace(/\{\{ops_level\}\}/g, String(mm.operations.level));
  html = html.replace(/\{\{auto_score\}\}/g, String(mm.automation.score));
  html = html.replace(/\{\{auto_level\}\}/g, String(mm.automation.level));

  // Risk summary (short list for page 1)
  const riskSummaryHtml = output.risks
    .slice(0, 3)
    .map(
      (r) =>
        `<div style="font-size:11px; padding:4px 0; border-bottom:1px solid #f1f5f9;"><strong>${r.title}</strong> — ${r.potential_impact.slice(0, 60)}...</div>`
    )
    .join("\n");
  html = html.replace(/\{\{risk_summary_html\}\}/g, riskSummaryHtml);

  // Risk detail cards (page 2)
  const riskDetailsHtml = output.risks
    .map(
      (r) =>
        `<div class="risk-card">
          <div class="risk-title">${r.title}</div>
          <div class="risk-meta">
            <span>영향 범위: ${r.impact_scope}</span>
            <span class="tag">발생 가능성: ${LIKELIHOOD_LABELS[r.likelihood] || r.likelihood}</span>
          </div>
          <div class="risk-body"><strong>유발 조건:</strong> ${r.trigger_condition}<br/><strong>예상 영향:</strong> ${r.potential_impact}</div>
        </div>`
    )
    .join("\n");
  html = html.replace(/\{\{risk_details_html\}\}/g, riskDetailsHtml);

  // Projection
  html = html.replace(/\{\{projection_short\}\}/g, output.current_state_projection.short_term_risk);
  html = html.replace(/\{\{projection_mid\}\}/g, output.current_state_projection.mid_term_risk);
  html = html.replace(/\{\{projection_large\}\}/g, output.current_state_projection.large_scale_event_risk);

  // Roadmap
  const phases = [
    { key: "phase_1", data: output.roadmap.phase_1, color: "phase-1-color" },
    { key: "phase_2", data: output.roadmap.phase_2, color: "phase-2-color" },
    { key: "phase_3", data: output.roadmap.phase_3, color: "phase-3-color" },
  ];
  const roadmapHtml = phases
    .map(
      (p, i) =>
        `<div class="roadmap-phase">
          <div class="phase-marker">
            <div class="phase-num ${p.color}">${i + 1}</div>
            <div class="phase-dur">${p.data.duration}</div>
          </div>
          <div class="phase-content">
            <h4>${p.data.title}</h4>
            ${p.data.actions.map((a) => `<div class="phase-action">${a}</div>`).join("\n")}
          </div>
        </div>`
    )
    .join("\n");
  html = html.replace(/\{\{roadmap_html\}\}/g, roadmapHtml);

  // Next steps
  const nextStepsHtml = output.next_steps
    .map(
      (step, i) =>
        `<div style="display:flex; gap:8px; padding:6px 10px; margin-bottom:5px; background:#eff6ff; border-radius:6px; font-size:11px;">
          <span style="flex-shrink:0; width:20px; height:20px; background:#bfdbfe; color:#2563eb; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:600;">${i + 1}</span>
          <span>${step}</span>
        </div>`
    )
    .join("\n");
  html = html.replace(/\{\{next_steps_html\}\}/g, nextStepsHtml);

  // Input table
  const inputRows = Object.entries(input)
    .filter(([key]) => INPUT_LABELS[key])
    .map(
      ([key, value]) =>
        `<tr><th>${INPUT_LABELS[key]}</th><td>${formatInputValue(key, value)}</td></tr>`
    )
    .join("\n");
  html = html.replace(/\{\{input_table_html\}\}/g, inputRows);

  return html;
}

export async function generatePdf(html: string): Promise<Buffer> {
  const isDev = process.env.NODE_ENV === "development";

  let browser;

  if (isDev) {
    // Development: use full puppeteer with bundled Chromium
    const puppeteer = await import("puppeteer");
    browser = await puppeteer.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } else {
    // Production/serverless: use puppeteer-core + @sparticuz/chromium
    const puppeteerCore = await import("puppeteer-core");
    const chromium = await import("@sparticuz/chromium");
    browser = await puppeteerCore.default.launch({
      args: chromium.default.args,
      defaultViewport: null,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  }

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
