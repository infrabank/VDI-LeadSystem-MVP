# Red Team 적대적 분석 보고서 — Round 2

> 작성: 2026-05-01
> 분석 방법: 6 페르소나 병렬 critic 에이전트 (Opus)
> 대상: Myloket 회사 메인 홈페이지 (Round 1 권고 7건 적용 후 시점, commit 6c47a0d)
> 이전 보고서: docs/04-report/red-team-analysis.md

---

## 임무·접근

Round 1이 코드를 바꿨다면, Round 2는 **"코드를 바꿔도 데이터·명세가 안 따라오면 신뢰는 회복되지 않는다"**는 실증 분석.
6명의 페르소나(공공 CISO·구매·IT 운영자·컴플라이언스·경쟁사·마케터)가 독립적으로 같은 사이트를 비판해 **공통 적출 vs 페르소나별 고유 발견**을 분리.

---

## 페르소나별 평결

| 페르소나 | 평결 | 한 줄 |
|---|---|---|
| P1 공공 CISO | **컷오프** | 영업미팅 1분 안에 후보군 제외 |
| P2 구매/재무 | **RFP 후보 제외** | 가격 신호 0 → 비교표 진입 자체 차단 |
| P3 IT 운영자 | **사내 공유 불가** | 망분리·DR·VM수 외부 사이트에 못 넣음 |
| P4 컴플라이언스 | **REVISE / 시정 권고** | 7개 항목 즉시 수정 시 통과 |
| P5 경쟁사 | **한 줄로 꺾을 무기 5장 보유** | "274 마케팅 vs 엔진 0회"가 결정타 |
| P6 마케터 | **월 자연유입 0~2건 추정** | hero bounce 70~80% |

---

## 공통 적출 (4명+ 독립 발견) — CRITICAL

| # | 사안 | 발견 페르소나 | 증거 |
|---|---|---|---|
| C1 | 사업자등록번호·대표자·주소·전화 미표시 (전자상거래법 §10 위반 의심) | P1, P4, P6 | `layout.tsx:124-131`, `site-config.ts:10-22` 필드 부재 |
| C2 | 고객사 11곳 100% 익명 — `disclosed=true` 0개 | P1, P5, P6 | `site-config.ts:174-185` |
| C3 | Leadership 4슬롯 전원 placeholder | P1, P5, P6 | `site-config.ts:112-133`, `LeaderCard.tsx:41-43` |
| C4 | 인증 모두 "(예정)" — 신청 단계·심사기관·예정 심사일 0 | P1, P5, P6 | `site-config.ts:86-89` |
| C5 | N²SF "274 통제 매핑"이 4페이지에 도배되었지만 v4 진단엔진(460줄)에 "274" 문자열 0회 등장 | P3, P5 | `page.tsx:100`, `secure-workspace/page.tsx:18,127`, `n2sf/page.tsx:64` vs `risk-assessment-v4.ts` grep 0 |

**C5는 가장 위험한 발견** — 경쟁사가 RFP 자리에서 한 줄로 사용 가능한 무기.

---

## 페르소나별 단독 발견

### P2 구매/재무
- 가격·SKU·SLA·NOC 위치 0건
- ROI 도구 가정값 자기유리 고정 — `backup-roi.ts:46-62` worst-case조차 사고 영향 -20%, 다운타임 -40% 강제. ROI 999%까지 표시 가능
- 공공조달 적합성 정보 0 (나라장터·G-Cloud·SW직구·중소기업확인서)
- Acronis 단일 벤더 Lock-in 회피 전략 0

### P3 IT 운영자
- "7분" 거짓 — `tools/page.tsx:14`("약 7분") vs `questions.v4.ts` 28문항. 실측 12~20분
- 공공기관 정보 외부 입력 불가 — VM수·망분리·DR·MFA·접속경로를 외부 Supabase에 평문 저장 → **타겟 고객 99%가 진단 시작도 못 함**
- 진단엔진 v2(483줄)·v3(568줄)·v4(460줄) 동시 존재 — 안정 버전 없음
- 모든 insights 글마다 동일 CTA → "벤더 영업 매체"

### P4 컴플라이언스 (CRITICAL 3 + HIGH 3)
- 개인정보 국외이전 §28의-8 별도 동의 미수령 — Supabase/Vercel/Resend 모두 해외, 5요소(소재국가·항목·시점·방법·책임자) 누락
- access_token URL 노출 + 만료 정책 0 — `migrations/004_reports.sql`에 `expires_at` 없음, noindex 헤더 없음
- Slack/Discord webhook PII 평문 전송 — 명세는 "lead_id만"이라 했으나 `notify.ts:48-55,97-117`은 PII 전부 송신
- CSP `unsafe-inline` + `unsafe-eval` 잔존 (`next.config.ts:25`)
- `leads/route.ts:62-67` `api-error` 마스킹 미적용

### P5 경쟁사 (영업 공격 카드 5장)
1. "한 회사가 둘 다는 못 합니다" (Practice 2개 동시)
2. "274는 숫자일 뿐, 엔진엔 없습니다"
3. "진단 엔진이 v2/v3/v4로 4번 갈아엎힌 미완성품"
4. "고객 11곳 전원이 이름 못 거는 사정이 있습니까"
5. "인증·리더십·사례 모두 'Coming Soon'"

### P6 마케터 (정량 추정)
- 월 자연유입 0~2건 / Hero bounce 70~80% / CTA 분산 추가 30%
- Hero CTA 시각 위계와 `ctaLink` 의도 불일치 — `site-config.ts:241`은 진단을 메인으로 정의했으나 디자인은 Practices가 흰 강조
- ContactForm 9필드 → 80% 이탈 추정

---

## 영업미팅 1분 시뮬레이션 (P1 작성 — 실패 시나리오)

```
CISO: "회사 소개부터 부탁드립니다. 사업자등록번호하고 대표이사 성함이 어떻게 되시죠?"
Myloket: "(웹사이트엔 없고…) 자료 따로 보내드리겠습니다."
CISO: "ISMS-P가 (예정)이라고 적혀 있던데, 신청은 들어가셨나요? 심사기관·심사일자가요?"
Myloket: "현재 준비 단계로…"
CISO: "운영 중인 11개 기관 다 익명이시던데, 그중 한 군데라도 레퍼런스 콜 가능합니까?"
Myloket: "동의 미확인 상태라…"
CISO: "팀 소개 페이지에 4명 다 '정보 업데이트 예정'이고 CEO 성함도 없는데, 누가 PM이고
       누가 책임지는 거죠? VMware·Omnissa·Citrix 셋 다 파트너인 게 맞습니까?"
→ 미팅 종료. 후보군 제외.
```

---

## Round 1 권고(commit 6c47a0d) 검증

| 권고 항목 | 상태 | 평가 |
|---|---|---|
| disclosed flag 도입 | **부분 — 역효과** | 11/11=false → 노출률 0% (P1·P5·P6) |
| Leadership name optional + placeholder | **부분 — 역효과** | 4/4 빈 슬롯 → "실체 없음" 시각화 (P1·P6) |
| /legal/privacy + /legal/terms | **부분** | §28 국외이전·책임자 실명·"동의 거부 권리" 누락 (P4) |
| next.config.ts 보안 헤더 | **부분** | unsafe-inline + unsafe-eval 잔존 (P4) |
| API 에러 마스킹 헬퍼 | **부분** | inquiries만 적용, leads 미적용 (P4) |
| RLS 강화 | **해결** | 단, reports.expires_at 누락 (P4) |
| notify.ts "lead_id만 전송" | **미해결** | 명세 vs 실제 코드 불일치, PII 전체 송신 중 (P4) |

**결론**: 6건 중 완전 해결은 1건. 나머지는 코드만 추가되고 데이터·명세 일관성 작업이 0건이라 효과 미흡.

---

## Round 2 즉시 적용 사항 (본 보고서 작성과 동시)

### 코드 수정 (5건)
1. ✅ `site-config.ts`에 `companyLegal` 구조 + `hasLegalInfo()`/`hasPrivacyOfficer()` 헬퍼 추가 — 전자상거래법 §10·정보통신망법 표시 의무 대비. 사용자가 실 데이터 입력하면 자동 노출.
2. ✅ `certifications` 단계 명시 (preparing/applied/in_review/certified/not_pursued) + 심사기관·목표 시점·인증범위 필드. "(예정)" 모호 표기 폐기.
3. ✅ `notify.ts` PII 마스킹 — 외부 webhook(Slack/Discord)으로는 마스킹된 정보(`maskName`/`maskEmail`/`maskPhone`/`maskOrgCategory`)만 송신. raw payload 송신 차단.
4. ✅ `migration 014_reports_token_expiry.sql` — `reports.expires_at` 컬럼 + 90일 기본값 + 부분 인덱스. 만료 토큰은 `ExpiredReportNotice`로 안내.
5. ✅ `next.config.ts` CSP에서 `unsafe-eval` 제거. `/reports/[token]` 전용 헤더 (X-Robots-Tag: noindex, Referrer-Policy: no-referrer, Cache-Control: no-store).
6. ✅ `leads/route.ts`에 `apiError`/`validationError` 마스킹 적용.
7. ✅ `privacy/page.tsx`에 §28 국외이전 표 (수탁자·이전 항목·국가·시점·방법) + §31 책임자 hasPrivacyOfficer() 분기.
8. ✅ `ContactForm.tsx` 동의 문구에 "국외이전 위탁" + "동의 거부 권리·거부 시 불이익" 명시 (§22).
9. ✅ `terms/page.tsx` §8 분쟁 해결에 본점 소재지 자동 노출 (companyLegal.address 사용).

### 산출물 (4건)
- ✅ 본 보고서 (`docs/04-report/red-team-analysis-round2.md`)
- ✅ N²SF 274 통제 매핑 카탈로그 (`docs/n2sf-rule-mapping.md`) — P5 결정타 차단용
- ✅ 오프라인 자가진단 PDF 설계 (`docs/02-design/features/offline-self-assessment.design.md`) — P3 우회로
- ✅ 고객사 외부 표기 동의 메일 템플릿 (`docs/customer-consent-email-template.md`) — C2 차단용

---

## 다음 단계 (사용자 작업 — 코드만으로는 해결 안 되는 것)

### 1주 내 (가장 시급, 매출에 직결)
- [ ] **회사 신원 5종 입력** → `site-config.ts:companyLegal`의 빈 필드 채우기
  - 사업자등록번호 (필수, 형식: `000-00-00000`)
  - 대표자 실명
  - 본점 소재지 (도로명 전체 주소)
  - 대표 전화
  - 통신판매업 신고번호 (해당 시)
  - 개인정보보호 책임자 (실명·직책·이메일·전화)
- [ ] **고객 동의 영업** — KIEP·KISTI·KRIHS 중 1~2곳에 `customer-consent-email-template.md` 발송 → 동의 받으면 `customers[].disclosed = true` 전환 (마케팅 작업 아닌 세일즈 작업)
- [ ] **Leadership 결정**: 실 데이터 채우거나 섹션 통째 비공개 (placeholder 4개 노출보다 안 보이는 게 낫다)

### 2~4주
- [ ] ISMS-P 신청 단계 진입 → `certifications[0].status`를 `"applied"` 또는 `"in_review"`로 전환
- [ ] N²SF 274 통제 매핑 카탈로그(`docs/n2sf-rule-mapping.md`) 발행 — 마케팅 카피와 엔진 사이 갭 해소
- [ ] `/tools/risk-assessment` 첫 화면에 오프라인 PDF 다운로드 추가 (`offline-self-assessment.design.md` 참조)
- [ ] `risk-assessment-v2.ts`/`v3.ts` deprecate, v4 단일화

### 1개월+
- [ ] Rate limiting (Upstash 환경변수)
- [ ] CSP nonce 기반 전환 (`unsafe-inline` 제거)
- [ ] 가격 구간 표시 ("프로젝트 5천만~3억원", "MSP 월 200만~600만원")
- [ ] 공공조달 채널 등록 (나라장터·G-Cloud) 후 사이트 표기

---

## 한 줄 종합

> **Round 1이 코드를 바꿨다면, Round 2는 "데이터·명세가 안 따라오면 코드는 무력화된다"는 사실을 증명함.**
> Round 2 코드 수정으로 법적 인프라(처방·동의·헤더·토큰 만료·PII 마스킹)는 갖춰졌다.
> 이제 남은 일은 **회사 신원 5종 입력 + 고객 1~2곳 동의 영업** — 개발 작업이 아니라 사람 일.
> C1·C2·C3 셋이 안 풀리면 C4·C5 풀어도 후보군 진입 안 됨.

---

## 참조 파일 (Round 2 수정 증거)

코드:
- `src/lib/site-config.ts` — companyLegal·certifications 단계화
- `src/app/(public)/layout.tsx` — 푸터 사업자 정보 섹션
- `src/app/(public)/legal/privacy/page.tsx` — §28 국외이전·§31 책임자
- `src/app/(public)/legal/terms/page.tsx` — 본점 소재지 자동 노출
- `src/app/(public)/contact/ContactForm.tsx` — 국외이전 동의·거부권 명시
- `src/app/(public)/about/page.tsx`, `about/certifications/page.tsx` — 인증 단계 표시
- `src/app/(public)/reports/[token]/page.tsx` — noindex metadata + 만료 안내
- `src/lib/notify.ts` — webhook PII 마스킹
- `src/app/api/leads/route.ts` — apiError 마스킹
- `next.config.ts` — CSP unsafe-eval 제거 + /reports 전용 헤더
- `supabase/migrations/014_reports_token_expiry.sql` — 토큰 만료 컬럼

문서:
- `docs/n2sf-rule-mapping.md` (신규)
- `docs/02-design/features/offline-self-assessment.design.md` (신규)
- `docs/customer-consent-email-template.md` (신규)
