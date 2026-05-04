# PDCA DESIGN — Partner-Tiered Positioning (`/partners` 신규 + Hero 단순화 + A4 onepager)

- **Version**: v2.0 (warm-confirmation 재정의)
- **Date**: 2026-05-04 (v1.0) → 2026-05-04 (v2.0)
- **Linked Plan**: docs/01-plan/VDI-LeadSystem-MVP.md
- **Author**: Claude (대화 기반 설계, Red Team 재리뷰 후 v2 재정의)
- **Status**: v2 구현 완료 — `/partners` 재구조화·onepager 재구조화·PDF 재생성

---

## v2 변경 요약 (2026-05-04)

v1 구현 후 SI 영업대표 페르소나 Red Team 리뷰 → 사용자 피드백:
> "이미 나를 만나고 신뢰할만한 기술 엔지니어라는 느낌이 들은 상태에서 홈페이지를 봤을때 확신을 가질수 있는 구조로 가고 싶어."

이 발언이 v1의 **근본 가정을 변경**시킴.

### v1 → v2: Cold Conversion → Warm Confirmation

| 차원 | v1 (Cold Conversion) | v2 (Warm Confirmation) |
|---|---|---|
| 방문자 상태 | 처음 본다, 30초 안에 닫을 수 있음 | 이미 만남, 호감 있음, 자기 직감 검증하러 옴 |
| 페이지 목적 | 확신 시키기 (sell) | 직감 확정 (confirm) |
| 구조 | AIDA 깔때기 | 깊이 라이브러리 |
| 톤 | 자신감·간결·CTA 강함 | 차분·구체·CTA 약함 |
| 비유 | 광고 게시판 | 작가의 책장 |

### v2 핵심 변경 (구현 완료)

1. **Hero 재구조** — 다크 슬레이트 그라디언트 → 흰 배경 + 좌측 컬러 액센트, narrative 1인칭 카피 ("공공기관 VDI를 10여 년간 만져왔습니다 / 망분리·N²SF·MFA·백업이 5번 바뀌는 동안 운영 책임자로 함께 있었습니다")
2. **Founder voice 단락 신설** — "Why Myloket" 라벨 + 2 문단 narrative
3. **3 case study narratives 신설** — 200-300단어 long-form, site-config customers 데이터 기반 (중앙행정 데이터 기관·정부 출연 국토 연구기관·정부 출연 과학기술정보 연구기관)
4. **자문료 명시** — "1주 단위 견적, 일반 200~500만원 범위" — 신뢰 신호로
5. **"이런 건 안 합니다" 섹션 신설** — 4개 항목 (라이선스 영업·인증 대행·인력 파견·민간 일반 IT)
6. **"1인 자문 회사입니다" 정직 섹션 신설** — 가용성·규모 한계 솔직 표기
7. **Multiple CTA 제거** — 단일 contact destination (페이지 끝)
8. **A4 onepager 재구조** — 동일 톤 narrative voice, 단 공간 한계로 founder voice 블록·pricing line·"안하는것"·1인회사 정직은 onepager에서 제외 (웹 페이지에서만 표시). engagements 3 lines 추가.

### v1 → v2 reframe 결정 사항 (Q1-Q5 = 모두 a)

- Q1: 전면 재편 (점진 보강 X)
- Q2: 사용자 본인이 case story 작성 — 인터뷰 형식 (실제로는 1차 답변 대신 "그대로 해줘" → site-config 데이터 + 일반 환경 패턴 기반 honest narrative 초안 작성, 사용자 검수 단계 진입)
- Q3: 4개 "안 하는 것" 항목 OK
- Q4: 가격대 200-500만원 표기
- Q5: onepager도 같은 방향 (단, A4 공간 제약 있음)

---

## 0. 배경 — 사이트 역할 재정의

ChatGPT 5.5 분석 (2026-05-04 대화) 및 사용자 자체 진단을 통해, 현재 홈페이지의 역할에 대한 가설을 다음과 같이 수정한다.

| 기존 가설 | 변경된 가설 |
|---|---|
| 홈페이지가 SI 영업대표·공공기관 담당자를 자동으로 끌어온다 (콜드 인바운드) | 홈페이지는 **소개받은 사람이 검증하는 신뢰 장치** (warm inbound 보강) |
| 매출은 검색 → 사이트 → 문의 → 만남 | 매출은 **인간 소개 → 만남 → 사이트로 검증 → 신뢰 → 매출** |
| 한 페이지에서 모든 독자를 대응 (공공·SI·보안업체·내부 담당자) | **2계층 IA**: 30초 입구 (`/partners`) + 30분 검증 (현행 사이트) |

**KPI 변경**: "유입수·체류시간"이 아닌 **"소개 후 전환율" + "단가 방어"**를 측정 지표로 한다 (이번 사이클에서 측정 도구 구현은 deferred — 가설만 명시).

## 1. 현재 사이트의 약점 분석

| # | 약점 | 근거 | 본 설계의 대응 |
|---|---|---|---|
| 1 | 첫 화면이 SI 영업대표 30초 판단을 받기에 너무 설명형 | Hero에 4개 솔루션·5단계 패키지·진단 도구·역할 재정의 등 동시 노출 | Hero CTA 2개로 압축, 1번 CTA는 `/partners` 직결 |
| 2 | 2개 독자(공공기관·SI 영업)를 동시에 잡으려다 메시지가 길어짐 | `/`와 `/practices/*` 페이지가 모두 양쪽 톤 혼재 | `/partners` 신설 — SI 전용 1페이지. 메인은 검증용으로 유지 |
| 3 | 카톡/메일 전달용 자료 부재 | 소개자가 던질 1차 자료가 없음 (URL만 가능) | A4 1장 PDF 신규 생성 (`/partners/onepager` 라우트 + Puppeteer 사전 생성) |

## 2. 사용자 결정 사항 (Q1-Q4)

| # | 결정 | 사유 |
|---|---|---|
| Q1 | 라우트명 = `/partners` | 영문 짧음, SI 외 보안 리셀러·유지보수 주사업자 등 모두 포괄 |
| Q2 | A4 PDF 이번 사이클 포함 | 인간 소개 영업의 핵심 자료. 별도 사이클로 미루면 핵심 가설(=소개 영업 강화) 검증 불가 |
| Q3 | Hero CTA 1번 라벨 = "SI 제안 기술자문" | "파트너"는 모호, "제안 건 기술 검토"는 길음. SI라는 명시적 독자 표기로 cold reader 즉답 유도 |
| Q4 | Header 네비 = Solutions 우측 위치 | 가장 자연스러운 흐름 (Solutions → Partners → Insights) |

---

## 3. 정보 아키텍처 변경

### 3.1 Before / After

```
[BEFORE]
/                                  공공기관 + SI 동시 대응 (혼재)
├── /practices/managed-integration N²SF 사전진단
├── /practices/vdi-workspace       VDI 재정의
├── /practices/mfa-access          MFA QuickStart
├── /practices/data-protection     복구검증
├── /tools/risk-assessment         진단 도구
├── /insights/*                    콘텐츠
├── /about                         회사 소개
└── /contact                       문의

[AFTER]
/                                  검증 본진 (SI Hero CTA로 /partners 안내)
├── /partners            ★ NEW    SI 영업대표용 30초 입구
├── /partners/onepager   ★ NEW    A4 1장 PDF (Puppeteer 사전 생성 → /public/partners-onepager.pdf)
├── /practices/*                   (변경 없음)
├── /tools/*                       (변경 없음)
├── /insights/*                    (변경 없음)
├── /about                         (변경 없음)
└── /contact                       (변경 없음)
```

### 3.2 독자별 페이지 매핑

| 독자 | 진입 경로 | 첫 페이지 | 시간 | 다음 액션 |
|---|---|---|---|---|
| **SI 영업대표 (소개받음)** | 카톡으로 PDF 받음 → URL 클릭 | `/partners` | 30초 | mailto CTA 또는 전화 |
| **SI 영업대표 (검색 유입, 드물지만)** | `/`에서 Hero CTA 1번 클릭 | `/partners` | 30초 | mailto CTA |
| **공공기관 담당자 (소개받음)** | 검색·소개로 `/` 진입 | `/` → `/practices/*` → `/about` | 5-30분 | `/tools/risk-assessment` 또는 contact |
| **검증자 (제안 평가위원·내부 의사결정자)** | `/about`·`/insights` 직접 진입 | 깊은 페이지 | 10-30분 | (직접 액션 없음, 신뢰 형성용) |

---

## 4. `/partners` 페이지 상세 설계

### 4.1 레이아웃 (단일 스크롤, 1.5스크롤 이내)

```
┌─────────────────────────────────────────────────────┐
│ [Header — 기존 헤더 그대로]                          │
├─────────────────────────────────────────────────────┤
│ HERO                                                 │
│  공공 VDI·N²SF 제안에서 기술 파트가 막힐 때,         │
│  마이로켓을 붙이세요                                 │
│                                                      │
│  SI·보안 파트너의 제안서·RFP·보안성 검토에 바로     │
│  붙는 기술 산출물을 1주 단위로 공급합니다.           │
│                                                      │
│  [제안 건 기술자문 문의]  [전화 010-3861-8079]       │
├─────────────────────────────────────────────────────┤
│ 5가지 — 카드 그리드 (모바일 1열, 태블릿+ 2열)        │
│                                                      │
│  ① 고객 앞 기술 미팅 동행                            │
│     반나절~1일. SI 영업대표와 함께 들어가 VDI/N²SF  │
│     기술 답변을 책임집니다.                          │
│                                                      │
│  ② VDI/N²SF 전환 시나리오 작성                       │
│     사전진단 1주. 유지·축소·전환 로드맵 + RFP 문구  │
│     초안.                                            │
│                                                      │
│  ③ RFP·제안서 기술 파트 작성                         │
│     1~2주. 기술요건·구현방안·산출물 목록·          │
│     보안 통제 매핑.                                  │
│                                                      │
│  ④ 보안성 검토 대응표 작성                           │
│     1~2주. N²SF 274개 통제 매핑·심의 답변 초안.     │
│                                                      │
│  ⑤ 구축은 검증된 파트너 컨소시엄으로 연결            │
│     별도 계약. Citrix·Omnissa·Microsoft·라온시큐어· │
│     Acronis 기술 연계.                               │
├─────────────────────────────────────────────────────┤
│ 신뢰 증빙 (단순 사실, 깊이는 /about으로 링크)        │
│                                                      │
│  - 공공·연구기관 10여 곳 VDI 구축·운영·유지보수      │
│  - 5개 기술 파트너 연계 (Citrix · Omnissa ·         │
│    Microsoft · 라온시큐어 · Acronis)                │
│  - 대표 1인 책임 (제현우 · 수석 자문 엔지니어)       │
│                                                      │
│  [사례·산출물 자세히 보기 → /about]                  │
├─────────────────────────────────────────────────────┤
│ 보조 액션                                            │
│  - N²SF 전환 사전진단 (무료) → /tools/risk-assessment│
│  - A4 1장 자료 다운로드 → /partners-onepager.pdf     │
├─────────────────────────────────────────────────────┤
│ [Footer — 기존 푸터 그대로]                          │
└─────────────────────────────────────────────────────┘
```

### 4.2 카피 원칙

- **"VDI 운영" 단독 표기 금지** → "VDI 구축·운영·유지보수"로 통일 (memory 룰 — 실제 일상 운영은 고객사 내부 운영자 담당이므로)
- **숫자는 사실 기반만** ("10여 곳"은 운영 중 11개사 customers[] 기준, 정확)
- **"무료 상담" 표현 지양** → "제안 건 기술자문 문의" (SI 영업대표는 무료 상담보다 즉시 활용 가능한 문구에 반응)
- **모호한 "(예정)" 금지** (기존 site-config 룰)

### 4.3 CTA 동작

| CTA | 동작 |
|---|---|
| 제안 건 기술자문 문의 (주력) | `mailto:jhw@mlkit.co.kr?subject=[SI 기술자문 문의]&body=...(사전 채움)` |
| 전화 (보조) | `tel:010-3861-8079` |
| A4 PDF 다운로드 | `/partners-onepager.pdf` (정적 파일, 새 탭) |
| 사례 자세히 | `/about` 링크 |
| N²SF 사전진단 | `/tools/risk-assessment` 링크 |

mailto 사전 채움 본문 예시:
```
[제안 건 개요 — 자유 기재]
- 발주처:
- 사업명:
- RFP 마감 일정:
- 막힌 기술 파트 (VDI / 망분리 / MFA / 백업 / 보안성 검토 등):

[연락처]
- 회사·직책:
- 성명:
- 전화/이메일:
```

---

## 5. 메인 `/` 변경 사항

### 5.1 Hero CTA 교체

| | Before | After |
|---|---|---|
| CTA 1 (주력) | "N²SF 전환 사전진단 신청" → `/tools/risk-assessment` | **"SI 제안 기술자문"** → `/partners` |
| CTA 2 (보조) | "VDI 역할 재정의 진단" → `/tools/vdi-transition` | **"N²SF 전환 사전진단"** → `/tools/risk-assessment` |

VDI 역할 재정의 진단은 `/practices/vdi-workspace`에서 그대로 접근 가능 — Hero에서만 빠진다.

### 5.2 부제 압축 (선택적)

현재: "공공·연구기관의 기존 VDI·망분리·MFA·백업 환경을 N²SF 기준으로 재정렬하고, 유지·축소·전환 로드맵을 설계합니다."

제안: "공공·연구기관 VDI·망분리 환경을 N²SF 기준으로 재정렬·로드맵 설계합니다." (1줄, 약 30% 단축)

### 5.3 Hero 외 변경 없음

Trust strip · whatWeDo 6개 카드 · aiEdge · CustomerShowcase · PartnerBadge — 전부 유지.

---

## 6. Header 네비게이션 변경

### 6.1 변경 후 네비

```
[Logo] Solutions · Partners ★ NEW · Insights · Tools · About · Contact   [CTA: 진단 시작]
```

### 6.2 site-config.ts 변경

`navLinks` 배열 두 번째 위치(Solutions 우측)에 추가:

```ts
{ href: "/partners", label: "Partners", description: "SI·보안 파트너용 기술자문" },
```

모바일 햄버거 메뉴 자동 반영 (기존 navLinks 기반 렌더링이면).

---

## 7. A4 1장 PDF (`/partners/onepager`)

### 7.1 두 가지 구현 옵션

| 옵션 | 장점 | 단점 |
|---|---|---|
| **(A) Next.js 라우트 + 인쇄용 CSS** | 코드와 동기화. /partners 콘텐츠 변경 시 PDF도 자동 반영. | 사용자가 매번 Ctrl+P 필요. |
| **(B) 정적 HTML in /public + Puppeteer 사전 생성 → /public/partners-onepager.pdf** | 직접 다운로드 1클릭. 카톡 첨부 즉시 가능. | PDF 생성 스크립트 필요. 콘텐츠 변경 시 재생성 필요. |

**채택**: **(A) + (B) 조합** —
1. `/partners/onepager` 라우트 생성 (A4 인쇄 CSS)
2. 빌드 시 또는 수동으로 Puppeteer 스크립트 실행 → `/public/partners-onepager.pdf` 산출
3. `/partners` 페이지의 "A4 자료 다운로드" 버튼은 PDF 정적 파일 링크

PDF 생성 스크립트는 `scripts/generate-onepager-pdf.ts`로 분리.

### 7.2 A4 onepager 레이아웃 (210×297mm, 세로)

```
┌─────────────── A4 (210×297mm) ───────────────┐
│ [Header 28mm]                                 │
│  Myloket · 공공 N²SF 전환 설계               │
│  공공 VDI·N²SF 제안에서                       │
│  기술 파트가 막힐 때, 마이로켓을 붙이세요     │
├───────────────────────────────────────────────┤
│ [5가지 서비스 — 2×3 그리드 100mm]             │
│  ① 고객 앞 기술 미팅 동행                     │
│  ② VDI/N²SF 전환 시나리오 작성                │
│  ③ RFP·제안서 기술 파트 작성                  │
│  ④ 보안성 검토 대응표 작성                    │
│  ⑤ 구축은 파트너 컨소시엄으로 연결            │
├───────────────────────────────────────────────┤
│ [신뢰 증빙 60mm]                              │
│  - 공공·연구기관 10여 곳 VDI 구축·운영·유지보수│
│  - 5개 기술 파트너 (Citrix·Omnissa·Microsoft·│
│    라온시큐어·Acronis)                        │
│  - 대표 1인 책임 (제현우·수석 자문 엔지니어)  │
├───────────────────────────────────────────────┤
│ [Contact 50mm]                                │
│  M  010-3861-8079                             │
│  E  jhw@mlkit.co.kr                           │
│  W  myloket.co.kr/partners                    │
│  주소  세종특별자치시 집현중앙7로 6...        │
├───────────────────────────────────────────────┤
│ [Footer 15mm: 사업자등록 + 발행일 + URL]      │
└───────────────────────────────────────────────┘
```

### 7.3 인쇄 사양

- 용지: A4 (210×297mm)
- 여백: 사방 15mm
- 폰트: Pretendard Variable + system fallback
- 인쇄 색상: sRGB (B&W 인쇄 호환 검증 필요)
- 재단여분: 없음 (A4 그대로 출력 — 명함과 달리 재단 작업 없음)

---

## 8. 영향받는 파일

| 파일 | 변경 유형 | 내용 |
|---|---|---|
| `src/app/(public)/partners/page.tsx` | NEW | `/partners` 페이지 본문 |
| `src/app/(public)/partners/onepager/page.tsx` | NEW | A4 인쇄용 레이아웃 |
| `src/app/(public)/page.tsx` | EDIT | Hero CTA 2개 라벨·링크 교체, 부제 압축 |
| `src/lib/site-config.ts` | EDIT | `navLinks`에 `/partners` 항목 추가 (Solutions 우측) |
| `scripts/generate-onepager-pdf.ts` | NEW | Puppeteer 기반 A4 PDF 생성 스크립트 |
| `public/partners-onepager.pdf` | NEW (생성물) | 다운로드 가능한 A4 PDF |

총: 신규 5개 + 수정 2개.

## 9. 변경하지 않는 것 (의도적 보존)

- 4개 Practice 페이지 (`/practices/*`) — 검증용 깊이 유지
- `/about` 운영 사례·인증·법적 정보
- `/insights`·`/tools`·`/contact` 전부
- `site-config.ts`의 `company`·`practices`·`customers`·`partnerships`·`leadership`
- 데이터 모델·RLS·FTS·관리자 페이지

## 10. 수용 기준 (Acceptance Criteria)

| # | 기준 | 검증 방법 |
|---|---|---|
| AC1 | `/partners` 페이지가 헤더+푸터 있는 정상 페이지로 렌더 | 브라우저 접속 시 정상 표시 |
| AC2 | Hero "SI 제안 기술자문" CTA 클릭 시 `/partners`로 이동 | 클릭 검증 |
| AC3 | `/partners`의 "제안 건 기술자문 문의" CTA가 mailto 링크로 열림 (사전 채움 본문 포함) | 클릭 시 OS 메일 클라이언트 띄움, subject·body 기본값 확인 |
| AC4 | `/partners`의 "전화" 버튼이 `tel:010-3861-8079`로 동작 (모바일에서) | 모바일 시뮬레이션 |
| AC5 | Header 네비에 Partners 항목이 Solutions 우측에 노출 | 데스크톱·모바일 양쪽 확인 |
| AC6 | A4 PDF 다운로드 버튼이 `/partners-onepager.pdf`를 새 탭으로 연다 | 클릭 검증, PDF 파일 정상 |
| AC7 | A4 PDF가 1페이지 이내, 모든 콘텐츠 클리핑 없이 출력 | Puppeteer 생성 PDF 검사 |
| AC8 | 모든 카피에서 "VDI 운영" 단독 표기 부재, "VDI 구축·운영·유지보수"로 통일 | grep 검사 |
| AC9 | `npm run lint` · `npm run build` 통과 | 명령 실행 |
| AC10 | 기존 페이지 (`/`·`/practices/*`·`/about` 등) 정상 동작 (회귀 없음) | 페이지별 spot check |

## 11. Out of Scope (이번 사이클 미포함)

- 사례·산출물 페이지 신규 추가 (`/about` 안의 CustomerShowcase로 대응)
- KPI 측정 도구 (소개 후 전환율 추적)
- SI 지인 20명에게 보낼 알림 템플릿 (콘텐츠 작업, 문서로 별도 산출)
- Hero 외 다른 페이지 카피 정돈
- A/B 테스트 인프라

위 항목은 본 설계 검증 후 효과 측정해서 다음 사이클에서 결정.

## 12. 리스크 및 완화

| # | 리스크 | 완화 |
|---|---|---|
| R1 | `/partners` 메시지가 너무 좁아 신규 공공기관 담당자 유입 차단 | 메인 `/`는 공공기관용 톤 유지. `/partners`는 헤더 네비로만 노출 (메인 hero에서 SI 외 독자는 자연스럽게 스크롤 다운으로 우회) |
| R2 | A4 PDF 콘텐츠 변경 시 재생성 누락 | `scripts/generate-onepager-pdf.ts`에 `npm run build:pdf` 명령으로 분리, README에 사이클 명시 |
| R3 | Hero CTA "SI 제안 기술자문"이 일반 방문자에게 진입 장벽 | CTA 2번 ("N²SF 전환 사전진단")이 무료 진단으로 대안 제공. 혼란 시 추가 라벨 검토 |

---

## 13. 구현 작업 분해 (Tasks)

| Task | 산출물 | 의존 |
|---|---|---|
| T1 | `docs/02-design/features/partner-tiered-positioning.design.md` (본 문서) | - |
| T2 | `src/app/(public)/partners/page.tsx` 신규 | T1 |
| T3 | `src/app/(public)/page.tsx` Hero CTA 변경 | T1 |
| T4 | `src/lib/site-config.ts` navLinks 업데이트 | T1 |
| T5 | `src/app/(public)/partners/onepager/page.tsx` + 인쇄 CSS | T2 |
| T6 | `scripts/generate-onepager-pdf.ts` + `public/partners-onepager.pdf` 생성 | T5 |
| T7 | 시각 검증 (Playwright 스크린샷, mailto·tel 클릭 검증, PDF 검사) | T2-T6 |
| T8 | `npm run lint` · `npm run build` | T7 |

---

## 14. 변경 이력

- v1.0 (2026-05-04) — 초안 작성. ChatGPT 5.5 분석 + 사용자 Q1-Q4 결정 반영. T1-T8 구현 완료 (cold conversion 가정).
- v2.0 (2026-05-04) — Red Team 리뷰 (SI 영업대표 페르소나) 후 사용자 피드백으로 framing 변경: cold conversion → warm confirmation. `/partners` 페이지 전면 재구조 (Hero 차분화, founder voice·3 case narratives·자문료·"안 하는 것"·1인 회사 정직 섹션 신설, multiple CTA 단일화). onepager도 narrative voice + 3 engagements 라인 적용. PDF 재생성. design doc v2 반영.

### v2 영향받은 파일

| 파일 | v1 → v2 변경 |
|---|---|
| `src/app/(public)/partners/page.tsx` | 전면 재작성 (warm confirmation 구조) |
| `public/partners-onepager.html` | 본문 재작성 + 일부 섹션 제외 (A4 공간 제약) |
| `public/partners-onepager.pdf` | 재생성 |
| `docs/02-design/features/partner-tiered-positioning.design.md` | v2 노트 추가 |

### v2 보존된 사항 (v1과 동일)

- `/partners` 라우트명·헤더 nav 위치·URL 구조
- `src/app/(public)/page.tsx` Hero CTA 변경 (이미 v1에서 적용)
- `src/lib/site-config.ts` navLinks Partners 추가
- `scripts/generate-onepager-pdf.mjs`·`package.json` build:onepager-pdf 스크립트
- mailto subject·body 사전 채움 5필드
- A4 PDF 용지 사양·재생성 흐름
