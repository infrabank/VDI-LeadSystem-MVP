import type { RiskAssessmentV4Output } from "@/lib/scoring/risk-assessment-v4";
import modelsData from "@/lib/n2sf/models.json";
import { byId } from "@/lib/n2sf/controls.index";
import type { N2sfServiceModel } from "@/lib/n2sf/types";

// ── Constants ──

const GRADE_LABEL: Record<"C" | "S" | "O", string> = {
  C: "기밀",
  S: "민감",
  O: "공개",
};

const APPROPRIATENESS_LABEL: Record<string, string> = {
  ready: "보안성 검토 신청 준비 완료 수준",
  partial: "일부 단계 재수행 필요",
  early: "주요 단계 재수행 필요",
};

const SERVICE_MODEL_NAME: Record<string, string> = {
  model3_saas_collab: "외부 클라우드 활용 업무협업 체계",
  model8_doc_mgmt: "클라우드 기반 통합문서체계",
  model10_wireless: "무선 업무환경",
  other: "일반 (모델 매핑 생략)",
};

const MODELS_BY_KEY = Object.fromEntries(
  (modelsData as N2sfServiceModel[]).map((m) => [m.key, m])
);

// ── Helpers ──

function renderControlList(ids: string[]): string {
  if (ids.length === 0) return "<ul><li>(해당 없음)</li></ul>";
  const items = ids
    .map((id) => {
      const ctrl = byId.get(id);
      const title = ctrl ? ctrl.title : id;
      return `<li>${id} — ${title}</li>`;
    })
    .join("\n");
  return `<ul>\n${items}\n</ul>`;
}

function renderEmphasisGrid(modelKey: string): string {
  if (modelKey === "other") return "";
  const model = MODELS_BY_KEY[modelKey as keyof typeof MODELS_BY_KEY];
  if (!model || !model.emphasis_controls || model.emphasis_controls.length === 0) return "";

  const cards = model.emphasis_controls
    .map((id) => {
      const ctrl = byId.get(id);
      const title = ctrl ? ctrl.title : id;
      const domain = ctrl ? ctrl.domain_kr : "";
      return `<div class="emphasis-card">
  <div class="emphasis-id">${id}</div>
  <div class="emphasis-domain">${domain}</div>
  <div class="emphasis-title">${title}</div>
</div>`;
    })
    .join("\n");

  return `<div class="emphasis-grid">\n${cards}\n</div>`;
}

function renderGradeList(grades: string[]): string {
  return grades.map((g) => GRADE_LABEL[g as "C" | "S" | "O"] || g).join(", ");
}

// ── Main export ──

export function buildV4Placeholders(
  output: RiskAssessmentV4Output
): Record<string, string> {
  const { resolved_grade, service_model, n2sf_compliance, appropriateness_label } = output;

  const model = MODELS_BY_KEY[service_model as keyof typeof MODELS_BY_KEY] as N2sfServiceModel | undefined;

  // §4 service_model card: "other" gets a special message
  const modelScenario =
    service_model === "other"
      ? "일반 점수만 산출됨 (모델 매핑 생략)"
      : model?.scenario_summary ?? "";

  const modelGrades =
    service_model === "other"
      ? "-"
      : model
      ? renderGradeList(model.applicable_grades)
      : "-";

  // §8 emphasis section: empty for "other"
  const emphasisHtml = renderEmphasisGrid(service_model);

  return {
    resolved_grade,
    resolved_grade_label: GRADE_LABEL[resolved_grade] ?? resolved_grade,
    service_model_name: SERVICE_MODEL_NAME[service_model] ?? service_model,
    service_model_scenario: modelScenario,
    service_model_grades: modelGrades,
    coverage_pct: String(n2sf_compliance.coverage_pct),
    matched_controls_html: renderControlList(n2sf_compliance.matched_controls),
    gap_controls_html: renderControlList(n2sf_compliance.gap_controls),
    recommended_controls_html: renderControlList(n2sf_compliance.recommended_controls),
    emphasis_controls_html: emphasisHtml,
    appropriateness_label_kr: APPROPRIATENESS_LABEL[appropriateness_label] ?? appropriateness_label,
  };
}
