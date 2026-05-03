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
];

export function findTemplate(slug: string): Template | undefined {
  return templates.find((t) => t.slug === slug && t.published);
}

export const publishedTemplates = templates.filter((t) => t.published);
