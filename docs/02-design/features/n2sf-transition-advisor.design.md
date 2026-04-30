# N²SF Transition Advisor — 설계 문서

> 공공기관 보안 전환(N²SF / 제로트러스트) 시장 대응을 위한 vdiexpert 확장 모듈
> 최종 수정: 2026-04-30

---

## 1. 배경 및 목적

### 1.1 시장 변화

- N²SF(국가 망 보안체계) 1.0이 2025-09-30 공지, **2026-05 시행** 예정 (국가 사이버보안 기본 지침 개정 명문화).
- 망분리 ‘폐지’가 아닌 **C/S/O(기밀/민감/공개) 등급 차등 통제**로 재정의.
- VDI는 “소멸”이 아닌 **축소 + 고도화 + 역할 재정의** 단계 진입 (C등급 보존, O/S등급은 DaaS·ZTNA·RBI·DRM·SaaS로 분산).
- 중소 VDI 전문기업의 **2027 하반기~2028 상반기 매출 절벽** 위험.

### 1.2 본 모듈 목적

기존 vdiexpert(VDI 리스크 진단)에 **공공기관 보안 전환 컨설팅 리드 채널**을 추가하여:

1. 공공기관 담당자가 **N²SF 전환 준비도**를 자가 진단하도록 한다.
2. 기존 VDI 환경의 **재배치 방향**(유지/보완/축소/전환)을 제시한다.
3. SI 영업대표가 고객 미팅에 활용할 **요약 리포트**를 제공한다 (Phase 2).
4. 단계적 **전환 로드맵**을 시각화하여 상담 리드를 발생시킨다.

### 1.3 핵심 메시지(카피)

- “VDI를 없앨 것인가가 아니라, 어떤 업무에 남길 것인가를 판단해야 합니다.”
- “기존 망분리 구조를 모르는 전환 컨설팅은 현장에서 실패합니다.”
- “VDI 운영 경험은 N²SF 전환기에도 중요한 자산입니다.”

---

## 2. 범위(Scope)

### 2.1 Phase 1 MVP (본 문서 대상)

| # | 산출물 | 비고 |
|---|---|---|
| 1 | N²SF 전환 준비도 진단(15문항+) | Level 1~5 |
| 2 | VDI 역할 재정의 진단(9문항) | 4결과 유형 |
| 3 | 결과 리포트 웹뷰 | `/reports/[token]` 확장 |
| 4 | 리드 입력 폼(공공기관 확장 필드) | 기관명/부서/연락처/관심분야 |
| 5 | 콘텐츠 3건(N²SF/제로트러스트/VDI 재배치) | `content_items` SEED |
| 6 | 관리자 리드 상태 관리 | 7단계 status + 메모 + 이력 |
| 7 | 메인 랜딩 N²SF 섹션 | 기존 홈에 모듈 추가 |

### 2.2 Phase 2 (별도 작업)

- N²SF 진단 PDF 리포트
- 단계적 전환 로드맵 생성기 (입력 조건별 3/5단계)
- SI 영업대표용 미팅 질문 자동 생성기 (`/partner/sales-kit`)
- PDF 다운로드, 진단 이력 저장
- 리드 상세 메모 다중

### 2.3 Phase 3

- AI 기반 제안 방향 추천
- 기관 유형별 로드맵 자동화
- 제안서 초안 생성
- 유지보수/컨설팅 상품화 페이지
- 이메일 발송 연동

### 2.4 비범위(Out of Scope)

- 기존 `risk-assessment` v3 진단의 변경 ❌ (기존 트래픽 보존)
- 별도 도메인/별도 프로젝트 ❌ (기존 vdiexpert.vercel.app에 모듈 추가)

---

## 3. 정보 아키텍처(IA)

### 3.1 신규 라우트

```
/n2sf                                  # N²SF 허브(랜딩)
/diagnosis/n2sf-readiness              # N²SF 전환 준비도 진단 입력
/diagnosis/vdi-transition              # VDI 역할 재정의 진단 입력
/content/n2sf-overview                 # "N²SF란 무엇인가" (기존 CMS 활용)
/content/zero-trust-impact-public-vdi  # "제로트러스트가 공공기관 VDI에 미치는 영향"
/content/vdi-disappear-or-relocate     # "VDI는 사라지는가, 재배치되는가"
/admin/leads/[id]                      # 관리자 리드 상세(상태 변경, 메모)
```

### 3.2 기존 라우트 변경

```
/                                      # 메인 — N²SF 섹션 추가 (기존 콘텐츠 유지)
/reports/[token]                       # tool_type 분기로 N²SF/VDI 결과도 렌더
/admin/(dashboard)/leads               # 상태 필터/정렬, 상세 링크 추가
```

---

## 4. 데이터 모델

### 4.1 변경 요약

| 변경 | 대상 | 설명 |
|---|---|---|
| ALTER | `leads.status` CHECK | 기존 5상태 → 7상태로 확장(역호환 가능) |
| NEW | `lead_extensions` | 공공기관 확장 필드(1:1) |
| NEW | `lead_status_history` | 상태 변경 이력 |
| NEW | `sales_partner_notes` | 관리자/영업 메모(N개) |
| 변경 X | `tool_runs` | `tool_type='n2sf_readiness'` / `'vdi_role'` 추가 사용만 |
| 변경 X | `reports` | 그대로 사용 |
| 변경 X | `content_items` | type='content' SEED만 추가 |

### 4.2 status enum 확장 매핑

| 기존(legacy) | 신규 | 한글 |
|---|---|---|
| new | new | 신규 |
| contacted | reviewing | 검토중 |
| qualified | meeting_scheduled | 미팅예정 |
| (신규) | proposing | 제안중 |
| (신규) | on_hold | 보류 |
| converted | won | 수주 |
| lost | lost | 실패 |

> 마이그레이션은 ALTER ... DROP CONSTRAINT + 새 CHECK + UPDATE로 기존 row 보존.

### 4.3 신규 테이블

```sql
-- lead_extensions: 공공기관/B2B 확장 필드
CREATE TABLE lead_extensions (
  lead_id uuid PRIMARY KEY REFERENCES leads(id) ON DELETE CASCADE,
  organization_name text,        -- 기관명
  organization_type text,        -- 'central' | 'local' | 'public-corp' | 'agency' | 'private' | 'other'
  department text,               -- 부서
  phone text,                    -- 연락처
  interest_area text[],          -- 관심분야 다중 선택
  message text,                  -- 상담 희망 내용
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- lead_status_history: 상태 변경 이력
CREATE TABLE lead_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  note text,
  created_at timestamptz DEFAULT now(),
  created_by text                -- email or user id
);

-- sales_partner_notes: 자유 메모
CREATE TABLE sales_partner_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by text
);
```

### 4.4 RLS 정책

- `lead_extensions`: 익명 INSERT 허용(리드 폼 제출), 익명 SELECT 차단, authenticated SELECT/UPDATE 전체.
- `lead_status_history`, `sales_partner_notes`: 익명 차단, authenticated full.

---

## 5. 진단 도구 사양

### 5.1 N²SF 전환 준비도 진단 (`n2sf_readiness`)

**구조**: 5섹션 × 3문항 = **총 15문항** (요구 최소치 충족, 추후 확장 가능).
**점수**: 각 문항 0~5점 환산, 만점 75점 → **0~100 정규화**.
**등급**:

| Level | 점수 범위 | 명칭 | 의미 |
|---|---|---|---|
| 1 | 0~30 | 기존 망분리 의존형 | 등급분류·통제 미수립 |
| 2 | 31~50 | 부분 개선 필요형 | 일부 통제 도입, 전체 일관성 부족 |
| 3 | 51~65 | 전환 준비 초기형 | 진단·PoC 진입 가능 |
| 4 | 66~80 | 단계적 전환 가능형 | 컨소시엄 진입 자격 |
| 5 | 81~100 | 고도화 준비형 | C/S/O 분류·운영체계 보유 |

**섹션**(예시 — 실제는 코드 questions.ts에 확정):

1. **망분리·VDI 현황** — 망분리 형태, VDI 사용 비중, 망연계 의존도
2. **데이터·업무 분류** — C/S/O 분류 여부, 업무 데이터 분류 수준, 보안정책 문서화
3. **인증·접근 통제** — MFA, 권한관리, 특권계정, 외부 접속/재택근무 통제
4. **클라우드·SaaS 활용** — SaaS/클라우드 도입 수준, 생성형 AI 활용 정책
5. **운영·예산 준비도** — 단말 보안, 로그/감사, 전환 예산/조직 준비

### 5.2 VDI 역할 재정의 진단 (`vdi_role`)

**구조**: 9문항.
**결과 유형 4종**(Strategy Type):

| Type | 명칭 | 조건(요약) |
|---|---|---|
| `maintain` | 유지 강화 | C등급 비중 높음, 안정성↑, SaaS 전환 가능 업무↓ |
| `complement` | 제로트러스트 보완 | S등급 비중 높음, 인증/권한 연계 미흡 |
| `reduce` | 점진적 축소 | O등급 비중 높음, 사용자 불편↑, SaaS 전환 가능 |
| `redesign` | 업무 재분류 후 재설계 | 비용 대비 효과↓, 운영 장애 빈번, 망연계 의존도↓ |

각 문항의 답을 4가지 유형별 가중치 매트릭스에 합산 → 최고 점수 유형이 결과.

---

## 6. 결과 리포트 구조

`tool_runs.output_json`에 저장되는 통합 출력 인터페이스:

### 6.1 `n2sf_readiness` 출력

```ts
type N2sfReadinessOutput = {
  version: 'v1';
  tool: 'n2sf_readiness';
  score: number;                // 0~100
  level: 1 | 2 | 3 | 4 | 5;
  level_name: string;
  section_scores: {
    network_separation: number; data_classification: number;
    authentication: number; cloud_saas: number; operations: number;
  };
  summary: string;              // 종합 진단 요약
  top_risks: string[];          // 핵심 리스크 3개
  priority_actions: string[];   // 우선 개선 과제 5개
  vdi_strategy_hint: string;    // 함께 권하는 VDI 전략 요약
  roadmap: { phase: string; duration: string; goals: string[] }[]; // 3단계
  next_steps: string[];
};
```

### 6.2 `vdi_role` 출력

```ts
type VdiRoleOutput = {
  version: 'v1';
  tool: 'vdi_role';
  result_type: 'maintain' | 'complement' | 'reduce' | 'redesign';
  result_name: string;
  type_scores: Record<'maintain'|'complement'|'reduce'|'redesign', number>;
  rationale: string[];          // 그 유형이 도출된 근거 3~5개
  recommended_actions: string[];
  vdi_disposition: {            // 업무 영역별 권장 처리
    keep: string[]; reduce: string[]; redesign: string[];
  };
  next_steps: string[];
};
```

### 6.3 결과 리포트 페이지

`/reports/[token]` 기존 페이지에서 `tool_runs.tool_type` 분기:

- `risk_assessment` → 기존 V3 리포트 컴포넌트
- `n2sf_readiness` → 신규 `N2sfReadinessReport` 컴포넌트
- `vdi_role` → 신규 `VdiRoleReport` 컴포넌트

신규 컴포넌트 공통 섹션:
1. 헤더(기관명, 진단일, 등급/유형 배지)
2. 종합 점수/유형 카드
3. 섹션별 점수(Bar) — n2sf만
4. 핵심 리스크 / 도출 근거
5. 우선 개선 과제 / 권장 조치
6. 3단계 실행 로드맵 — n2sf만
7. CTA(상담 요청)

---

## 7. API

### 7.1 신규/변경 엔드포인트

| Method | Path | 설명 |
|---|---|---|
| POST | `/api/leads` | **확장**: `lead_extensions` 동시 upsert |
| POST | `/api/tools/n2sf-readiness/run` | N²SF 진단 실행 |
| POST | `/api/tools/vdi-role/run` | VDI 역할 진단 실행 |
| POST | `/api/reports/[toolRunId]/generate` | **확장**: tool_type 분기 (Phase 1은 web report만, PDF는 Phase 1.5) |
| GET | `/api/admin/leads/[id]` | 관리자 리드 상세 |
| PATCH | `/api/admin/leads/[id]/status` | 상태 변경 + 이력 기록 |
| POST | `/api/admin/leads/[id]/notes` | 관리자 메모 추가 |

### 7.2 `/api/leads` 확장 본문

```json
{
  "email": "...", "name": "...", "company": "...",
  "source": "n2sf-readiness",
  "consent_marketing": true,
  "extension": {
    "organization_name": "...", "organization_type": "central",
    "department": "...", "phone": "...",
    "interest_area": ["n2sf", "zero-trust"], "message": "..."
  }
}
```

`extension` 필드가 있으면 `lead_extensions`에 upsert.

---

## 8. 페이지 구성

### 8.1 `/n2sf` 허브
Hero · 시장 변화 요약(2026.05 시행, C/S/O) · 기존 VDI 환경 리스크 · 체크포인트 · 두 진단 CTA · 콘텐츠 3건 카드 · 상담 CTA.

### 8.2 진단 페이지(공통 패턴)
2단계: ① 리드 입력(공공기관 확장 필드) → ② 섹션별 진단(기존 risk-assessment 패턴 재사용).

### 8.3 결과 리포트(`/reports/[token]`)
도구별 분기 렌더링.

### 8.4 관리자 `/admin/leads/[id]`
- 좌: 기본 정보(연락처, 기관, 출처, 관심분야)
- 중: 상태 변경 select + 메모 입력 폼
- 우: 진단 이력(`tool_runs` join), 상태 이력
- 하: 메모 타임라인

---

## 9. 카피 가이드(서비스 톤)

**사용 권장**

- “기존 망분리 구조를 아는 파트너가 전환 리스크를 줄입니다.”
- “N²SF는 보안 솔루션 교체가 아니라 업무환경 재설계에 가깝습니다.”
- “공공기관 보안 전환의 핵심은 안정 운영을 유지하면서 단계적으로 바꾸는 것입니다.”

**금지**

- “VDI는 끝났다”, “모든 망분리는 사라진다”, “제로트러스트만 하면 된다”, “단기간 전면 전환 가능”.

색조: 신뢰감 있는 블루(#1d4ed8)/그레이(#475569). 카드형 UI, 표·단계형 로드맵 사용.

---

## 10. 운영·관측

- 진단 실행 시 `source` 필드에 `n2sf-readiness` / `vdi-role` 기록 → 리드 출처 분석.
- 관리자 status 변경 시 자동으로 `lead_status_history` insert(API 책임).
- 추후 Vercel Analytics + 진단 완료율(섹션별 이탈) 측정.

---

## 11. 트레이드오프 및 결정 사유

| 결정 | 대안 | 채택 사유 |
|---|---|---|
| `tool_runs` 재사용 | `diagnosis_sessions` 신설 | 기존 패턴(점수/output/리포트 토큰) 99% 재사용 가능. 중복 회피. |
| status enum 확장 | 별도 `lead_pipeline_status` | 기존 `leads.status` 컬럼 그대로 살리면서 한글 매핑만 UI에서 처리. |
| 별도 도메인 X | `n2sf-readiness.kr` 등 | vdiexpert SEO/콘텐츠 자산 활용, 1인 운영 부담 최소화. |
| Phase 1에 PDF 제외 | 즉시 PDF | Puppeteer 템플릿 신규 작성 비용 큼. 웹 리포트만 우선. |
| 진단 질문은 코드(데이터 X) | DB seed | v3 패턴 그대로(`questions.v3.ts`). 빠른 반복. |

---

## 12. 마이그레이션 체크리스트

- [ ] `010_n2sf_transition_advisor.sql` 작성 및 dry-run
- [ ] 기존 `leads.status='contacted'` row 존재 여부 확인 후 `reviewing`으로 데이터 이전 (없으면 스킵)
- [ ] 기존 `leads.status='qualified'` → `meeting_scheduled` 데이터 이전
- [ ] 기존 `leads.status='converted'` → `won` 데이터 이전
- [ ] CMS에 N²SF 콘텐츠 3건 SEED INSERT
- [ ] 환경변수 변경 없음 확인

---

## 13. 검증/완료 기준 (DoD)

- [ ] 비로그인 사용자가 `/n2sf` → `/diagnosis/n2sf-readiness` → 결과 리포트까지 도달
- [ ] 비로그인 사용자가 `/diagnosis/vdi-transition` 진단 후 4유형 중 하나 결과 수신
- [ ] 리드 폼에 기관명/부서/연락처/관심분야 저장됨
- [ ] 관리자에서 리드 상세 진입, 상태 변경 시 `lead_status_history` 기록됨
- [ ] 콘텐츠 3건이 `/content/...`에서 노출됨
- [ ] 기존 `/tools/risk-assessment` 흐름 리그레션 없음
- [ ] `npm run build` 통과

---

## 14. 참조

- `_raw/compass_artifact_*.md` — Claude 심층 리서치 (전략 메모, 액션 체크리스트)
- `_raw/deep-research-report.md` — GPT 심층 리서치 (정책 일정, 24개월 KPI)
- 국정원 NCSC, 「N²SF 보안 가이드라인 1.0」 (2025-09-30)
- KISA, 「2026 N²SF 도입 지원사업 공모」 (2026-02)
