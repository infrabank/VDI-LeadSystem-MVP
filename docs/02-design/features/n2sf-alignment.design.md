# PDCA DESIGN — N²SF Primary-Source Alignment (v4)

- **Version**: v1.0 (proposal)
- **Date**: 2026-04-30
- **Linked Plan**: docs/01-plan/VDI-LeadSystem-MVP.md
- **Supersedes (partially)**: docs/02-design/features/vdi-leadsystem-mvp.design.md §스코어링·리포트
- **Author**: Claude (분석 위임 → 사용자 답변 반영)
- **Status**: 승인 대기 (사용자 검토 후 구현 단계 진입)

---

## 0. 배경

현재 활성 시스템(`risk-assessment-v3.ts` + `risk-assessment-v3.html`)은 2차 자료(Compass 리서치 + `deep-research-report.md`)를 기반으로 작성됐다. 1차 소스인 N²SF 가이드라인 v1.0(국정원 정식판)이 `_raw/_md/`에 마크다운으로 추출됨에 따라, 진단 룰·리포트·콘텐츠 시드를 1차 소스 기반으로 재정렬한다.

## 1. 1차 소스 분석 요약

### 1.1 부록1 — 보안통제 항목 해설서

| 항목 | 값 |
|---|---|
| 정규 통제 ID | **274개** (M-접미 관리적 55 + 기술적 219) |
| 분석 노트 | 초기 분석은 종합표 grep 기준 268개로 추정했으나, 파서가 도메인 상세표 3종(3-col / 4-col empty-first / 4-col empty-second) 모두를 dedup 처리한 결과 274개 확정 |
| 구조 | 6장 / 27 도메인 / 도메인마다 `정의 → 통제표 → 구현 예시 → 적용 기술` 4블록 반복 |
| 항목 스키마 | `{N2SF_ID, cso_grades, title, description}` |
| C/S/O 표기 | 상세표 `**C**<br>**S**<br>**O**` / 종합표 `●` |
| 등급 적용률 | C 94% · S 86% · O 35% |

### 1.2 부록2 — 11 정보서비스 모델 (우선순위 3개만)

사용자 결정에 따라 v1에서는 모델 **3 / 8 / 10** 만 매트릭스화한다.

| 모델 | 명칭 | 핵심 등급 | VDI 시사점 |
|---|---|---|---|
| 3 | 외부 클라우드 활용 업무협업 (SaaS) | O 한정 | SaaS 직접 연결 + O등급 데이터 전송 통제가 고위험 시그널 |
| 8 | 클라우드 기반 통합문서체계 | S+O 혼재 | 단말 등급 검증(DA-3/5) + 문서 등급 흐름 통제(DU-M1, CD-1/2) 필수 |
| 10 | 무선 업무환경 운용 체계 | 순수 S | WA-1~6 + WIPS + SN-4/6 자동 종료 + MD-M2 분실 대응 |

나머지 8개 모델(1·2·4·5·6·7·9·11)은 v2로 deferred. 결정 근거: 모델 3·8·10이 VDI 게이트웨이·세션 흐름과 직결.

### 1.3 본문 — C/S/O 정의 및 절차

| 등급 | 정의 (정보공개법 §9 기반) | 진단 폼 가이드 텍스트 |
|---|---|---|
| **C 기밀** | §9 1~4호 (국방·수사·생명·재판) | "국방·외교·수사 또는 국민 생명·신체와 직결된 정보" |
| **S 민감** | §9 5~8호 + 시스템 로그·임시백업 | "개인정보·영업비밀·내부심의 자료 또는 시스템 로그" |
| **O 공개** | C·S 외 전부 | "그 외 일반 업무정보" |

**5단계 절차**: ➊준비 → ➋C/S/O 분류 → ➌위협식별 → ➍보안대책 수립 → ➎적절성 평가·조정 → 국정원 보안성 검토(외부)

**복수 등급 혼재 룰** (표 2-9): S+O → S, C+S → C, C+O → C (상위 자동 승계)

**적절성 평가**는 이진(적합/부적합) 체크리스트. 우리의 0~100 점수는 "적절성 평가 사전 준비도 지표"로 포지셔닝.

### 1.4 현재 v3 → 1차 소스 갭

- **274개 통제 중 V3에서 직접 매핑되는 항목: 6~8개 (2~3%)**
- **갭이 큰 영역 Top 5**: ① CDS/외부경계 37개 · ② 인증보호·수단 20개 · ③ 세션/로그인 23개 · ④ 데이터·암호 26개 · ⑤ 정보시스템 구성요소·하드웨어 33개

---

## 2. v4 설계 목표

| # | 목표 | 측정 지표 |
|---|---|---|
| G1 | 274 통제 ID를 정규화된 데이터로 보유 | `controls.json` 274행 |
| G2 | 진단 폼에 C/S/O 등급 + 모델(3/8/10) 입력 추가 | 폼 단계 6 → 7 |
| G3 | 스코어링 룰 v4: VDI 직결 Top 10 + 모델별 추가 통제 | 룰 매핑률 ≥ 30% (Top 30 통제) |
| G4 | 리포트에 "준수 통제 / 미흡 통제 / 권고 통제" 표 + 모델 카드 | 섹션 추가 3개 |
| G5 | 본문 §9 등급 정의 인라인 가이드 | 폼 등급 질문 옆 expander |
| G6 | 적절성 평가 점수 구간 매핑 | 70+ / 40~69 / <40 라벨 |
| G7 | "보안성 검토 = 국정원 외부 절차" 면책 문구 | 리포트 footer |

---

## 3. 데이터 구조

### 3.1 `src/lib/n2sf/controls.json` (신규, 274행 — D1에서 자동 생성)

```ts
type N2sfControl = {
  id: string;            // "N2SF-LP-1", "N2SF-MA-2", "N2SF-AC-1(2)"
  domain: string;        // "LP" | "IV" | ... (22종)
  domain_kr: string;     // "최소 권한"
  chapter: 1 | 2 | 3 | 4 | 5 | 6;
  chapter_kr: string;    // "권한"
  title: string;
  description: string;
  cso: { C: boolean; S: boolean; O: boolean };
  is_managerial: boolean; // M-접미 여부
};
```

생성 방법: 부록1 마크다운 정규식 파싱 (executor 위임). 인덱스 파일 `controls.index.ts`에서 `byId`, `byDomain`, `byChapter` export.

### 3.2 `src/lib/n2sf/models.json` (신규, 3행 — v1 한정)

```ts
type N2sfServiceModel = {
  key: "model3_saas_collab" | "model8_doc_mgmt" | "model10_wireless";
  number: 3 | 8 | 10;
  name_kr: string;
  scenario_summary: string;
  applicable_grades: ("C" | "S" | "O")[];
  primary_threats: string[];
  required_controls: string[];   // N2SF ID 배열
  emphasis_controls: string[];   // ●중점 통제 ID
  vdi_signal: string;            // "고위험" 분류 시그널 텍스트
};
```

### 3.3 `src/lib/n2sf/vdi-core.ts` (신규)

VDI 직결 공통 통제 Top 10:

```ts
export const VDI_CORE_CONTROLS = [
  "N2SF-DA-3",   // 단말 식별·인증
  "N2SF-DA-4",   // 인증된 단말 접속 관리
  "N2SF-RA-2",   // 원격접속 세션 암호화
  "N2SF-RA-6",   // 자동 종료·비활성화
  "N2SF-SN-1",   // 로그아웃 세션 무효화
  "N2SF-IF-1",   // 정보흐름 동적 통제
  "N2SF-IF-14",  // 보안등급 기반 흐름 통제
  "N2SF-EB-5",   // 통신 경유 프록시 강제화
  "N2SF-AC-1(2)", // 계정 상태 모니터링
  "N2SF-IN-6",   // 불필요 구성요소 제거
] as const;
```

---

## 4. 진단 폼 변경 (v3 → v4)

### 4.1 단계 추가

```
v3: [기본 정보] [현황] [DR/백업] [운영] [자동화] [보안]   (6 step, 25 Q)
v4: [기본 정보] [등급 분류] [모델 선택] [현황] [DR/백업] [운영] [자동화] [보안]   (8 step, 28 Q)
                ↑ 신규           ↑ 신규                                 (+3 Q)
```

### 4.2 신규 질문 — 등급 분류 (Step 2)

```yaml
- id: data_grade
  type: radio
  required: true
  question: "현재 시스템이 다루는 업무정보의 최고 등급은?"
  inline_help: |
    국방·외교·수사 또는 국민 생명·신체와 직결된 정보 → **C(기밀)**
    개인정보·영업비밀·내부심의 자료 또는 시스템 로그 → **S(민감)**
    그 외 일반 업무정보 → **O(공개)**
  options:
    - { value: "C", label: "C (기밀) — 정보공개법 §9 1~4호" }
    - { value: "S", label: "S (민감) — 정보공개법 §9 5~8호 + 로그/백업" }
    - { value: "O", label: "O (공개) — 그 외" }

- id: mixed_grade
  type: checkbox
  multiselect: true
  question: "함께 처리되는 정보 유형 (해당사항 모두 선택)"
  options:
    - { value: "personal_info", label: "개인정보 (이름·주민번호 등)" }
    - { value: "trade_secret", label: "영업비밀·계약정보" }
    - { value: "system_log", label: "시스템 로그·감사로그" }
    - { value: "open_data", label: "공개 가능 일반 정보" }
  # 복수 선택 시 상위 등급 자동 승계 (표 2-9)
```

### 4.3 신규 질문 — 모델 선택 (Step 3)

```yaml
- id: service_model
  type: radio
  required: true
  question: "가장 가까운 운용 시나리오는?"
  options:
    - value: "model3_saas_collab"
      label: "SaaS 협업 (외부 클라우드 직접 연결)"
      desc: "Microsoft 365·Google Workspace·Slack 등을 업무 단말에서 직접 사용"
    - value: "model8_doc_mgmt"
      label: "클라우드 통합문서체계"
      desc: "기관 내부 + 외부 모바일·원격 단말이 동일 문서 시스템 접근"
    - value: "model10_wireless"
      label: "무선 업무환경"
      desc: "청사 내 Wi-Fi 통한 업무시스템 접속"
    - value: "other"
      label: "위 중 어느 것도 아님 / 혼합"
      desc: "v1 기준 일반 점수만 산출 (모델 매핑 생략)"
```

### 4.4 등급 자동 승계 룰 (스코어링 사전 처리)

```ts
function resolveGrade(input: V4Input): "C" | "S" | "O" {
  const declared = input.data_grade;
  const mixed = input.mixed_grade ?? [];
  let derived: "C" | "S" | "O" = "O";
  if (mixed.includes("personal_info") || mixed.includes("trade_secret") || mixed.includes("system_log")) {
    derived = "S";
  }
  // 표 2-9: 상위 등급 우선
  const order = { O: 0, S: 1, C: 2 };
  return order[declared] >= order[derived] ? declared : derived;
}
```

---

## 5. 스코어링 룰 v4

### 5.1 점수 구조

기존 v3의 4 카테고리 + security를 유지하되, **security 가중치 두 배 + N²SF 매핑 메타데이터 추가**.

```ts
type V4Output = V3Output & {
  version: "v4";
  resolved_grade: "C" | "S" | "O";
  service_model: string;
  n2sf_compliance: {
    matched_controls: string[];     // 입력에서 충족된 N²SF ID
    gap_controls: string[];          // 미흡 N²SF ID
    recommended_controls: string[];  // 모델 기반 추가 권고
    coverage_pct: number;            // matched / (matched + gap)
  };
  appropriateness_label: "ready" | "partial" | "early";
  // 70+ → ready, 40~69 → partial, <40 → early
};
```

### 5.2 매핑 룰 (예시 5개, 전체 30개 룰은 구현 시 확정)

| 입력 필드 | 값 | 충족 N²SF ID | 미흡 N²SF ID | 비고 |
|---|---|---|---|---|
| `mfa_enabled` | true | N2SF-MA-1, MA-2, AM-9 | — | C/S 등급 필수 |
| `mfa_enabled` | false | — | N2SF-MA-1, MA-2 | C/S 등급에서 -8점 |
| `network_separation` | yes | N2SF-SG-4, SG-5, IS-4 | — | |
| `access_method` | zero_trust | N2SF-DA-3, DA-4, RA-2, EB-5 | — | VDI Core 4종 일괄 |
| `access_method` | vpn_only | N2SF-RA-2, EB-3 | N2SF-DA-3, DA-4 | 단말 인증 미흡 |
| `session_timeout_min` | ≤30 | N2SF-SN-1, RA-6 | — | |
| `session_timeout_min` | >30 or null | — | N2SF-SN-1, RA-6 | |
| `service_model` | model10_wireless | (조건부) WA-1, WA-4 | (없으면) WA-1, WA-4, MD-M2 | 모델 10 한정 |

전체 룰 매트릭스: `src/lib/scoring/v4/rules.ts`. 각 룰은 `{ when, awards: [], gaps: [], deltaScore }` 형식.

### 5.3 등급별 가중치

```ts
const GRADE_WEIGHT = { C: 1.5, S: 1.2, O: 1.0 };
finalScore = baseScore × GRADE_WEIGHT[resolvedGrade];
// max-cap 100, 0~100 clamp
```

C/S 등급에서 동일 미흡 항목이 더 큰 감점을 받도록 한다.

### 5.4 적절성 평가 라벨

| score | label | 리포트 헤드라인 |
|---|---|---|
| ≥ 70 | `ready` | "보안성 검토 신청 준비 완료 수준" |
| 40~69 | `partial` | "일부 단계 재수행 필요 (협의·조정 단계 예상)" |
| < 40 | `early` | "주요 단계 재수행 필요 (등급분류·위협식별 단계 미비)" |

---

## 6. 리포트 템플릿 변경

### 6.1 신규 섹션 (현 8 섹션 → 11 섹션)

| # | 섹션 | 신규/수정 | 출력 |
|---|---|---|---|
| 1 | Executive Summary | 수정 | `appropriateness_label` 헤드라인 추가 |
| 2 | 점수 + 5단계 성숙도 | 유지 | |
| 3 | 벤치마크 비교 | 유지 | |
| 4 | **N²SF 등급·모델 카드** | **신규** | 사용자 등급 + 선택 모델 + 시나리오 요약 |
| 5 | **N²SF 통제 준수 현황** | **신규** | 표: 충족 / 미흡 / 권고 (ID + 한글명) |
| 6 | 리스크 상세 | 수정 | 각 리스크에 N²SF ID 라벨 부착 |
| 7 | 현황 투영 | 유지 | |
| 8 | **모델별 권고 통제** | **신규** | 선택 모델의 emphasis_controls 카드 |
| 9 | 3단계 로드맵 | 수정 | Phase 1 액션에 N²SF ID 매핑 |
| 10 | Next Steps | 유지 | |
| 11 | **법적 면책·외부 절차 안내** | **신규** | "본 진단은 N2SF 준비도 측정이며, 보안성 검토는 국정원 외부 절차" |

### 6.2 신규 템플릿 파일

`src/templates/reports/risk-assessment-v4.html` 신규 작성. 기존 v3 템플릿을 베이스로 §4·5·8·11만 추가/교체. CSS 토큰은 v3와 동일하게 유지.

---

## 7. API · 라우팅 변경

| 변경 대상 | 변경 내용 | 호환성 |
|---|---|---|
| `POST /api/tools/risk-assessment/run` | 입력 스키마에 `data_grade`, `mixed_grade`, `service_model` 추가. version 자동 감지 (v2/v3/v4) | 하위 호환 (없으면 v3 fallback) |
| `POST /api/reports/[toolRunId]/generate` | output_json.version === "v4" 시 v4 템플릿 사용 | 하위 호환 |
| `/tools/risk-assessment/page.tsx` | 8-step 폼으로 확장. v3 페이지는 `?ver=3` 쿼리로 임시 유지 (1주 후 제거) | flag-driven |
| 추가 | 없음 (모든 변경 기존 라우트 위에서 동작) | |

DB 스키마 변경 없음. `tool_runs.input_json`, `output_json`이 jsonb이므로 신규 필드 자유롭게 추가 가능.

---

## 8. 콘텐츠 시드 업데이트

### 8.1 우선순위 3건 (v1 한정)

| slug | 제목 | 핵심 N²SF ID |
|---|---|---|
| `n2sf-grade-classification-guide` | "N²SF C/S/O 등급 자가분류 5분 가이드" | 본문 §2 + 표 2-7~2-9 |
| `vdi-saas-collab-controls-model3` | "외부 SaaS 활용 시 반드시 챙겨야 할 N²SF 통제 12선" | 모델 3 통제 매트릭스 |
| `vdi-wireless-office-checklist-model10` | "무선 업무환경 N²SF 체크리스트 (WA-1 ~ WA-7)" | 모델 10 통제 |

기존 콘텐츠 7건은 그대로 유지하되, body_md 안 N²SF ID 인용 부분만 v1 정식 ID로 수정 (예: "N2SF-AC-2.1" → "N2SF-AC-1(2)").

### 8.2 RAG/검색용 메타데이터

콘텐츠 시드에 `n2sf_control_ids: text[]` 컬럼 추가 검토 — 단, **마이그레이션 비용 vs 가치를 v2에서 재평가**. v1에서는 본문 인라인 참조로 충분.

---

## 9. 구현 단계 (PDCA Do)

| 단계 | 작업 | 위임 | 완료 기준 |
|---|---|---|---|
| D1 | `controls.json` 274행 자동 생성 | executor (sonnet) | `npm run build` 성공 + 274 행 ✅ 완료 |
| D2 | `models.json` 3행 + `vdi-core.ts` 작성 | executor (sonnet) | 타입 export 통과 |
| D3 | `questions.v4.ts` (28문항) 정의 | executor (sonnet) | 폼 렌더 OK |
| D4 | `risk-assessment-v4.ts` 룰 30개 + `resolveGrade` | executor (opus, 복잡) | unit test 5개 |
| D5 | `risk-assessment-v4.html` 템플릿 | designer (sonnet) | Puppeteer 렌더 성공 |
| D6 | `/tools/risk-assessment/page.tsx` 8-step | executor (sonnet) | E2E 클릭 가능 |
| D7 | API route version 자동 감지 | executor (sonnet) | v3 입력도 통과 |
| D8 | 콘텐츠 3건 시드 마이그레이션 | writer | published 3건 |
| D9 | Gap analysis (Check) | gap-detector | 매핑률 ≥ 30% |
| D10 | 완료 보고 | report-generator | `04-report/` 작성 |

---

## 10. 테스트 전략

### 10.1 Unit (`src/lib/scoring/v4/__tests__/`)

| 케이스 | 입력 | 기대 출력 |
|---|---|---|
| 등급 자동 승계 (S+O) | `data_grade=O, mixed_grade=[personal_info]` | `resolved_grade=S` |
| C 등급 가중치 | `data_grade=C, base=50` | `final=75` |
| MFA 미흡 + S 등급 | `mfa=false, grade=S` | `gap_controls.includes("N2SF-MA-1")` |
| Zero-trust 입력 | `access_method=zero_trust` | `matched_controls ⊇ {DA-3, DA-4, RA-2, EB-5}` |
| 모델 10 + 무선 미점검 | `model=model10_wireless, wireless_audit=no` | `gap_controls.includes("N2SF-WA-4")` |

### 10.2 E2E (Playwright)

- 8-step 폼 전체 클릭 → 리포트 페이지 도달 → PDF 다운로드 200 응답
- v3 입력 (legacy URL `?ver=3`) 정상 동작 확인 (회귀 방지)

### 10.3 Zero Script QA

- Docker 로그에서 `[v4][score]`, `[v4][grade-resolve]`, `[v4][model-match]` 3개 태그가 모두 출력되는지 확인
- 274-row controls.json 로드 시간 < 50ms

---

## 11. 마이그레이션 / 롤아웃

| 일정 | 액션 | 트래픽 라우팅 |
|---|---|---|
| Day 0 (PR merge) | v4 코드 배포, v3 default 유지 | 100% v3 |
| Day 1 | 폼 `?ver=4` 베타 공개 | v3 default, v4 opt-in |
| Day 3 | 내부 QA + 콘텐츠 3건 발행 | v3 default |
| Day 7 | v4 default 전환, v3는 `?ver=3` legacy | 100% v4 |
| Day 14 | v3 폼 페이지 제거 (코드는 한 cycle 보존) | v4 only |

---

## 12. 리스크 / 미해결 이슈

| # | 리스크 | 완화책 |
|---|---|---|
| R1 | 274 통제 자동 파싱 실패 (마크다운 표 변형) | 파싱 후 description 비어있음=0 검증 통과. CI에 row count = 274 assertion 추가 권고 |
| R2 | C/S/O 자동 승계 로직이 사용자 의도와 다를 가능성 | 폼에서 `resolved_grade` 미리보기 박스로 표시 + 수동 override 허용 |
| R3 | 모델 매핑이 "other" 응답에 편중될 위험 | other 선택 시 안내 텍스트 + 모델 카드 섹션 생략 (기존 v3 점수만 보여줌) |
| R4 | 다이어그램(약 10p) 미반영 | 본 v1에서 OCR 미진행. v2에서 의사결정 트리·CDS 구조도 OCR 후 본문 통합 검토 |
| R5 | 가이드라인 개정 시 ID 호환성 | `controls.json`에 `source_version: "v1.0"` 메타 + 개정 시 diff 도구 작성 (v2 백로그) |
| R6 | "보안성 검토 ≠ 본 진단" 오해 | 리포트 §11 면책 + 폼 시작·완료 페이지 모두 명시 |

---

## 13. 승인 체크리스트 (사용자 답변 필요)

> 사용자가 본 설계를 승인하면 §9 D1부터 순차 구현 위임 시작.

- [ ] §3 데이터 구조 (`controls.json`, `models.json`, `vdi-core.ts`) 위치·스키마 OK
- [ ] §4 폼 단계 6→8 확장 OK (질문 추가 3개)
- [ ] §5 스코어링 룰 v4 구조 OK (등급 가중치 1.5/1.2/1.0)
- [ ] §6 리포트 섹션 8→11 확장 OK (신규 §4·5·8·11)
- [ ] §8 콘텐츠 시드 3건 우선순위 OK
- [ ] §11 마이그레이션 일정 (Day 0~14) OK
- [ ] §12 R2 (등급 자동 승계 미리보기) UX OK

---

## 14. 참고 출처

- `_raw/_md/n2sf-main/N2SF_guideline_v1.0.md` (1908 lines)
- `_raw/_md/appendix1/appendix1_security_controls.md` (3467 lines, 274 controls 추출)
- `_raw/_md/appendix2/appendix2_모델3_*.md` (748 lines)
- `_raw/_md/appendix2/appendix2_모델8_*.md` (822 lines)
- `_raw/_md/appendix2/appendix2_모델10_*.md` (731 lines)

내부 메모리:
- `memory/reference_n2sf_extracted_docs.md`
- `memory/project_next_session_n2sf_integration.md`
