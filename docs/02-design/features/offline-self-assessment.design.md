# Offline Self-Assessment (오프라인 자가진단지) — Design

> 작성: 2026-05-01 · Red Team Round 2 산출물
> 페르소나: P3 IT 운영자(공공기관 차장) — "공공기관에서 망분리·DR·VM수 같은 정보를 외부 사이트에 평문으로 못 넣는다"
> 목표: 외부 데이터 송신 없이 사내에서 자가채점 가능한 PDF 양식 제공 → 진단 도구의 실제 도달 가능 사용자 확장

---

## 1. 문제 정의

### 1.1 현 상태의 함정
`/tools/risk-assessment`는 28문항 8단계 진단을 제공하지만, **타겟 고객(공공·연구기관)의 99%가 진단 시작 자체를 못 한다**.
이유는:
- VM 수, 호스트 수, 동시 접속자 수, **망분리 여부**, **DR Hot/Warm**, **RPO/RTO**, **MFA 적용률**, **PAM**, **접속 경로**(VPN/제로트러스트/직접 등) 입력이 요구됨
- 이 묶음 자체가 N²SF 보호대상 정보 (S 등급 이상)
- 공공기관 보안팀 사전 승인 없이 외부 사이트에 입력하는 것 자체가 보안 위반 가능

### 1.2 결과
- 진단 도구의 실 사용률 = 매우 낮음 (P3 추정: 100명 중 1~2명만 시작)
- 그나마 시작한 사람도 Step 1~2에서 이탈 (P3 가상 체험)
- 리드 전환율 0~2건/월 (P6 추정과 일치)

---

## 2. 해결 방향

### 2.1 핵심 원칙
**"외부 송신 없이도 가치를 받게 한다"** — 사내에서 작성·자가채점 후, **결과 비교만** 외부 사이트에서 진행.

### 2.2 3트랙 게이팅

| 트랙 | 입력 위치 | 외부 송신 | 게이팅 조건 |
|---|---|---|---|
| A. 오프라인 PDF (신규) | 사내 (PDF 작성) | 없음 | 항상 사용 가능 |
| B. 온라인 진단 (현행, O 등급 한정) | 외부 사이트 | 입력값 + 결과 | `data_grade === "O"` (공개 정보) 일 때만 |
| C. 의뢰형 컨설팅 진단 (신규) | NDA 후 미팅 | 직접 전달 | `/contact?source=offline-assessment` 통한 NDA 절차 |

### 2.3 사용자 흐름

```
/tools/risk-assessment 첫 화면

┌─────────────────────────────────────────────────────────────┐
│ N²SF 정렬 진단 — 작성 방식 선택                                 │
├─────────────────────────────────────────────────────────────┤
│ ① 사내에서 작성 (오프라인 PDF) ← 권장                          │
│    - 28문항 PDF 다운로드 → 출력 → 사내 작성 → 자가채점          │
│    - 외부 데이터 송신 없음                                     │
│    - 결과 비교 시 익명 입력 가능 (점수만 입력)                    │
│                                                              │
│ ② 온라인 진단 (공개 정보(O 등급) 환경 한정)                       │
│    - 사용자 폼 입력 → 즉시 PDF 리포트                           │
│    - 외부 송신 동의 필수 (개인정보·진단 입력값)                   │
│                                                              │
│ ③ NDA 기반 컨설팅 진단                                         │
│    - 보안 정책상 외부 입력 불가 환경                             │
│    - NDA 체결 후 컨설턴트 방문·이메일로 진단지 직접 전달            │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 트랙 A: 오프라인 PDF 상세 설계

### 3.1 PDF 구조 (1장 양면 또는 2장)

**1면 — 작성 안내·메타**
- 진단 명: `Myloket N²SF 정렬 진단 (오프라인 v1.0)`
- 작성일·작성자(임의·옵션)·기관 코드(임의·옵션)
- 사용 안내 3줄
- 자가채점 산식 요약 (rule weight 표 — 등급별 C 1.5/S 1.2/O 1.0)
- 외부 송신 안내: "본 양식은 사내에서만 작성·보관됩니다. 외부 송신 금지."

**2면 — 28문항 (8 섹션)**
- Step 1 기본 정보 (4) — VM 수, 호스트 수, 동시 사용자, 플랫폼
- Step 2 N²SF 등급 (2) — data_grade(C/S/O), mixed_grade
- Step 3 운용 모델 (1) — model3/8/10/other
- Step 4 아키텍처 (5) — 스토리지, 멀티패스, 망분리
- Step 5 가용성/DR (6) — HA, DR site, RPO, RTO, 백업
- Step 6 운영/변경 (4) — 운영 인력, 장애 대응, 변경 관리, 문서화
- Step 7 자동화 (3) — 자동화, 프로비저닝, 리허설
- Step 8 보안/접속 (3) — 접속방식, MFA, PAM

각 문항 옆에 **점수 칸** (가중치 표시)

**3면 — 자가채점 표 + 권고 모델**
- 섹션별 점수 합산 표
- 등급 결정 표 (C/S/O 자동 승계 룰 — `resolveGrade()` 로직 요약)
- 등급 가중치 적용 후 최종 점수 계산
- appropriateness_label 분기 (≥70 ready / ≥40 partial / <40 early)
- N²SF 부록2 권고 모델 매핑 (모델 3/8/10 + emphasis_controls)

**4면 — 결과 활용 안내**
- 사내 보고서로 활용 가이드
- 결과만 익명 입력해 비교 리포트 받기 (선택)
- NDA 후 컨설팅 의뢰 (선택)

### 3.2 기술 구현

**경로**:
- 양식 파일: `public/assessments/n2sf-self-assessment-v1.pdf`
- 생성 소스: `src/templates/assessments/n2sf-self-assessment.html` (Puppeteer로 PDF 빌드)
- 빌드 스크립트: `scripts/build-self-assessment-pdf.ts` (반자동 — 룰·문항 변경 시 재빌드)
- 다운로드 라우트: `src/app/api/assessments/n2sf-self-assessment/route.ts` (GET, Cache-Control: public, max-age=3600)

**진입점 추가**:
- `src/app/(public)/tools/risk-assessment/page.tsx` 첫 화면 (`step === "intro"`)에 3트랙 카드 노출
- "오프라인 PDF 다운로드" 버튼 클릭 시 `/api/assessments/n2sf-self-assessment` 호출

### 3.3 결과 비교 (선택 트랙 — 익명 입력)

`/tools/risk-assessment/compare`:
- 입력: `data_grade`, `service_model`, `score (0-100)`, `appropriateness_label` 4개 필드만
- 외부 데이터 송신 = 4개 필드 + 기관 카테고리 (선택)
- 출력: 동일 등급·모델 사용자 대비 분포 (anon 통계만)
- DB: `tool_runs` 테이블에 `tool_type='risk_assessment_anon_compare'`로 기록 (PII 0)

### 3.4 NDA 의뢰 트랙

`/contact?source=offline-assessment&track=consulting`:
- 자동 채워지는 메시지: "오프라인 자가진단 결과 검토 및 NDA 후 정식 진단 의뢰 요청"
- 회신: NDA 템플릿 PDF + 컨설턴트 미팅 일정 제안

---

## 4. 데이터 모델 변경

### 4.1 마이그레이션 (선택, compare 트랙 도입 시)

```sql
-- migration 015_anon_assessment_compare.sql
-- 익명 비교용 — PII 없이 점수만 저장
CREATE TABLE anon_assessment_compares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data_grade text NOT NULL CHECK (data_grade IN ('C', 'S', 'O')),
  service_model text NOT NULL,
  score int NOT NULL CHECK (score BETWEEN 0 AND 100),
  appropriateness_label text NOT NULL CHECK (appropriateness_label IN ('ready', 'partial', 'early')),
  org_category text CHECK (org_category IN ('central', 'local', 'public-corp', 'agency', 'private', 'other')),
  -- IP·UA 등 식별자 0 — 의도적 누락
  created_at timestamptz DEFAULT now()
);

-- RLS: anon SELECT 허용 (이미 PII 없음), INSERT는 admin client만
ALTER TABLE anon_assessment_compares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon can read aggregated stats" ON anon_assessment_compares FOR SELECT TO anon USING (true);
```

### 4.2 변경 없는 영역
- 기존 `tool_runs` 테이블은 그대로
- `risk-assessment-v4` 엔진 변경 없음 (로직 동일)

---

## 5. 마케팅·SEO 메시지

### 5.1 홈 hero copy 변경 (권장)

**현재**: "274개 보안통제 기준 N²SF 정렬 진단으로 우리 기관 현황을 파악하고 맞춤 리포트를 받아보세요."

**Round 2 권장**: "사내에서 작성하는 N²SF 정렬 자가진단지(PDF) — 외부 송신 없이, 7분이면 점수 산출."

이유:
- "외부 송신 없음"이 P3·P4 모두에게 통하는 신뢰 시그널
- "사내" 키워드가 공공기관 보안팀 검색에 잡힘
- "PDF 양식"은 RFP·결재 첨부 가능

### 5.2 SEO 키워드

검색어 추가 후보:
- "N²SF 자가진단 양식"
- "N2SF 점검 체크리스트 PDF"
- "VDI 보안 자가진단지"
- "공공기관 N²SF 정렬도 점검표"

---

## 6. 우선순위·일정

| 단계 | 작업 | 예상 공수 |
|---|---|---|
| 1주 | HTML 템플릿 작성 + Puppeteer 빌드 스크립트 + GET 라우트 | 2일 |
| 1주 | `/tools/risk-assessment` 첫 화면 3트랙 분기 UI | 1일 |
| 2주 | `/tools/risk-assessment/compare` 익명 비교 페이지 | 2일 |
| 2주 | `migration 015` + 익명 비교 백엔드 | 1일 |
| 3주 | NDA 트랙 — `/contact?source=...&track=consulting` 사전 채움 | 0.5일 |
| 3주 | 홈 hero copy 변경 + SEO 메타 변경 | 0.5일 |

총 **약 7일** (1.5주 spread).

---

## 7. 성공 지표

- 트랙 A PDF 다운로드 수 (월 50+ 목표)
- 트랙 A → 트랙 B(온라인 비교) 전환율 (10%+ 목표)
- 트랙 A → 트랙 C(NDA 컨설팅) 전환율 (2%+ 목표)
- 공공기관 도메인(.go.kr·.re.kr) IP에서의 사이트 체류 시간 (현재 추정 1분 이하 → 3분+ 목표)

---

## 8. 리스크·대응

| 리스크 | 대응 |
|---|---|
| PDF 양식이 다른 컨설팅사에 베껴짐 | 양식 footer에 워터마크 + 버전 + 출처 명시. 양식 자체는 가치 = 약함 ⇒ 베껴도 OK. **본 게임은 결과 비교·NDA 컨설팅 트랙**. |
| 사내 작성 PDF의 자가채점 오류 | 산식 명시 + 예시 1개 포함. 익명 비교 트랙에서 검증 가능 |
| "외부 송신 없음"이 매출 이탈 유도 | 트랙 C(NDA 컨설팅)가 진짜 매출. 트랙 A는 funnel 입구 확장 |

---

## 9. 다음 액션

- [ ] HTML 템플릿 wireframe 검토 (`src/templates/assessments/n2sf-self-assessment.html`)
- [ ] Puppeteer 빌드 스크립트 작성 (`scripts/build-self-assessment-pdf.ts`)
- [ ] 첫 PDF 빌드 → `public/assessments/n2sf-self-assessment-v1.pdf` 배포
- [ ] `/tools/risk-assessment` 첫 화면 3트랙 카드 UI
- [ ] `/api/assessments/n2sf-self-assessment` GET 라우트 (캐시 헤더 포함)
- [ ] hero copy 변경 PR

본 설계는 P3 결정타 ("공공기관에서 외부 사이트에 입력 불가")를 우회하는 게 목적. 진단 도구 자체의 깊이를 늘리는 작업이 아니라 **funnel 입구 자체를 99% 닫혀 있는 상태에서 50%로 여는** 게 핵심 가치.
