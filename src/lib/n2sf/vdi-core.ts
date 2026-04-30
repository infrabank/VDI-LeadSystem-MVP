/**
 * VDI 직결 N²SF 보안통제 Top 10.
 * 부록2 모델 3·8·10 분석에서 공통·반복 등장하며 VDI 게이트웨이·세션·데이터흐름과 직결되는 통제.
 * 출처: docs/02-design/features/n2sf-alignment.design.md §3.3
 */
export const VDI_CORE_CONTROLS = [
  "N2SF-DA-3",   // 단말 식별 및 인증
  "N2SF-DA-4",   // 인증된 단말 접속 관리
  "N2SF-RA-2",   // 원격접속 세션 암호화
  "N2SF-RA-6",   // 원격접속 자동 종료·비활성화
  "N2SF-SN-1",   // 로그아웃 시 세션 즉시 무효화
  "N2SF-IF-1",   // 정보흐름 동적 통제
  "N2SF-IF-14",  // 보안등급 기반 흐름 통제
  "N2SF-EB-5",   // 통신 경유 프록시 강제화
  "N2SF-AC-1(2)",// 계정 상태 모니터링
  "N2SF-IN-6",   // 불필요한 구성요소 제거
] as const;

export type VdiCoreControlId = (typeof VDI_CORE_CONTROLS)[number];

/** 모델 키 → 한글 표시명 */
export const SERVICE_MODEL_LABELS = {
  model3_saas_collab: "외부 SaaS 협업",
  model8_doc_mgmt: "클라우드 통합문서",
  model10_wireless: "무선 업무환경",
  other: "기타 / 혼합",
} as const;

export type ServiceModelKey = keyof typeof SERVICE_MODEL_LABELS;
