/**
 * 다운로드 가능한 템플릿 자산 메타.
 *
 * sourceFile은 `docs/templates/{file}.md` 경로 하위의 마크다운 파일.
 * 다운로드 라우트(/api/templates/[slug]/download)에서 fs.readFile로 로드 후
 * renderMarkdown → HTML → generatePdf 파이프라인으로 PDF 응답.
 *
 * 새 템플릿 추가:
 * 1. docs/templates/0X-{slug}.md 작성
 * 2. 본 배열에 entry 추가
 * 3. /resources/templates 페이지가 자동 매핑
 */

export type TemplateCategory = "checklist" | "matrix" | "framework";

export interface Template {
  /** URL slug (영문 kebab-case) */
  slug: string;
  /** 카드·PDF 표지에 노출할 한글 제목 */
  title: string;
  /** 1줄 설명 */
  summary: string;
  /** 카테고리 라벨 */
  category: TemplateCategory;
  /** docs/templates/ 하위 마크다운 파일명 (확장자 포함) */
  sourceFile: string;
  /** 추정 분량 (페이지) — 카드에 가이드 라벨로 노출 */
  pages: number;
  /** 첫 발행 / 최근 갱신 일자 (yyyy-mm-dd) */
  updatedAt: string;
  /** 활성 여부 — false면 카드 노출 안 함 (작업 중 템플릿 안전장치) */
  published: boolean;
}

export const TEMPLATE_CATEGORY_LABEL: Record<TemplateCategory, string> = {
  checklist: "체크리스트",
  matrix: "의사결정 매트릭스",
  framework: "산출물 프레임워크",
};

export const templates: Template[] = [
  {
    slug: "n2sf-pre-diagnosis-checklist",
    title: "N²SF 전환 사전진단 체크리스트",
    summary:
      "공공·연구·금융 기관의 기존 VDI·망분리 환경을 N²SF 발주 전에 1차 점검하는 자가 워크시트.",
    category: "checklist",
    sourceFile: "01-n2sf-pre-diagnosis-checklist.md",
    pages: 6,
    updatedAt: "2026-05-03",
    published: true,
  },
  {
    slug: "vdi-decision-matrix",
    title: "VDI 유지·축소·전환 의사결정 매트릭스",
    summary:
      "1차 진단 결과를 영역별 시나리오 4종(유지·DaaS·고위험 분리·안정화)으로 비교하고 1장의 결정문을 도출.",
    category: "matrix",
    sourceFile: "02-vdi-decision-matrix.md",
    pages: 5,
    updatedAt: "2026-05-03",
    published: true,
  },
  {
    slug: "security-review-response-checklist",
    title: "보안성 검토 대응 체크리스트",
    summary:
      "발주 전 보안성 검토 위원회 통과 가능성을 자가 평가하고, RFP 반영 문구·FAQ 답안 예시를 함께 정리.",
    category: "checklist",
    sourceFile: "03-security-review-response-checklist.md",
    pages: 6,
    updatedAt: "2026-05-03",
    published: true,
  },
  {
    slug: "project-kickoff-report",
    title: "착수보고서",
    summary:
      "사업 목표·범위·체계·일정·예산을 1장으로 정리해 임원·심의위원회 안건 자료로 사용.",
    category: "framework",
    sourceFile: "04-project-kickoff-report.md",
    pages: 3,
    updatedAt: "2026-05-03",
    published: true,
  },
  {
    slug: "current-state-analysis",
    title: "현황분석서",
    summary:
      "분석 시점의 인프라·VDI·인증·백업·운영 이슈를 일관된 형식으로 정리. 후속 분석의 정량 근거.",
    category: "framework",
    sourceFile: "05-current-state-analysis.md",
    pages: 3,
    updatedAt: "2026-05-03",
    published: true,
  },
  {
    slug: "risk-analysis",
    title: "위험분석서",
    summary:
      "자산·위협·취약점·영향도 평가로 Top 10 위험 등록부 작성. 보안성 검토·로드맵의 입력 자료.",
    category: "framework",
    sourceFile: "06-risk-analysis.md",
    pages: 3,
    updatedAt: "2026-05-03",
    published: true,
  },
  {
    slug: "transition-roadmap",
    title: "전환 로드맵",
    summary:
      "의사결정 결과를 4 Phase로 펼쳐 활동·산출물·게이트·KPI를 정리. 임원 승인·예산 확정의 정량 근거.",
    category: "framework",
    sourceFile: "07-transition-roadmap.md",
    pages: 3,
    updatedAt: "2026-05-03",
    published: true,
  },
  {
    slug: "operations-plan",
    title: "운영계획서",
    summary:
      "일상 운영·정기 점검·사고 대응·변경 관리·보고 체계를 RACI로 정리. 보안성 검토 운영계획 첨부.",
    category: "framework",
    sourceFile: "08-operations-plan.md",
    pages: 3,
    updatedAt: "2026-05-03",
    published: true,
  },
  {
    slug: "acceptance-checklist",
    title: "검수 체크리스트",
    summary:
      "단계별(착수·분석·설계·구축·운영) 산출물·보안·기능·성능·교육 검수 기준과 서명 절차.",
    category: "checklist",
    sourceFile: "09-acceptance-checklist.md",
    pages: 4,
    updatedAt: "2026-05-03",
    published: true,
  },
];

export function findTemplate(slug: string): Template | undefined {
  return templates.find((t) => t.slug === slug && t.published);
}

export const publishedTemplates = templates.filter((t) => t.published);
