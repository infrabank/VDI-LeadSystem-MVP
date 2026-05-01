# Red Team 적대적 분석 보고서

> 작성: 2026-05-01
> 분석 방법: 3 페르소나(공공 CISO·민간 보안·경쟁 SI) + 보안 감사 병렬 Red Team
> 대상: Myloket 회사 메인 홈페이지 (Phase 1+2 통합 완료 시점)

## 임무·접근

"왜 이 회사를 안 고를까"를 찾는 적대적 평가. 칭찬 최소화·약점 발굴 우선.
3 고객 페르소나 비평 + 사이트 자체 보안·법규 감사를 병렬 수행.

---

## 페르소나별 1분 평가

### 페르소나 1 — 공공기관 정보보안 책임자(50대 CISO)

> "익명 회사에 우리 통제 정보 못 넘긴다. About 첫 줄이 '정보 업데이트 중'이면 끝."

**받아들일 수 없는 약점**:
- Leadership 4슬롯 전원 익명 (`name` 필드 통째로 비어 있음)
- ISMS-P·ISO27001 둘 다 "(예정)" — 영업현장에서 "없음"과 동의어
- secure-workspace "50+ 공공·금융 자문 사례" vs site-config 11개 고객사 — 통계와 실증 모순

### 페르소나 2 — 민간 보안 과장(30대)

> "공공·금융 타깃이라 우리 사이즈 reference 없고, 모든 길이 contact 폼 깔때기 = 함정."

**받아들일 수 없는 약점**:
- 민간 레퍼런스 1곳(DJGLASS)뿐 — 11개 중 10개가 공공·연구
- 데이터 보호 페이지 모든 CTA가 "상담 문의" — 가격·라이선스·SKU 0
- 콘텐츠 5건 전부 Acronis 마케팅 톤 — Veeam·Commvault 비교 0건

### 페르소나 3 — 경쟁 SI 영업(적대적)

> "VMware·Omnissa·Citrix·Acronis 다? 24x7 MSP를 4명 익명 팀이? 한 줄로 깐다."

**약점 발굴**:
- 상충 파트너십 동시 표기 (VMware/Omnissa/Citrix 모두 secure-workspace 도메인 병렬)
- 24x7 MSP 운영을 4명짜리 leadership 슬롯이 책임 (NOC 위치·야간 인력 명시 0)
- "50+" 통계 vs 11개 명단 — 영업미팅 1분 안에 깨짐

**공정한 차별화 인정**: N²SF 274통제 매핑 자가진단 정량 룰 구현 — 다만 결과지에 안 쓰고 있음

---

## 영업미팅 시뮬레이션 (실패 시나리오)

```
KISTI급 정부출연연구기관 정보보안팀장 미팅
옆자리: 경쟁 SI(안랩·시큐아이·메가존클라우드 파트너) 동석 비교 PT

팀장: "Myloket 대표 누구신가요?"
Myloket: (About 보여주는 순간) "지금 업데이트 중입니다…"
경쟁사: (웃으며) "저희는 작년 ISMS-P 갱신, 대표 약력 사이트에 다 있습니다."

팀장: "공공 N²SF 50개 사례 있다 하셨는데 참고 가능한 건?"
Myloket: "...11곳 중에..."
경쟁사: (PDF 꺼내며) "동일 등급 연구기관 3곳 사례 PDF 가져왔습니다."

→ 그 자리에서 후보군 컷오프, 기술 검증 단계까지도 못 감
```

---

## 종합 Red Team 결론 — 가장 심각한 5가지

| 순위 | 약점 | 영향 |
|---|---|---|
| 1 | **신뢰 신호 결손** — Leadership 익명 + 인증 모두 "예정" + 사례 0건 + 사업자등록번호·주소·대표자명 사이트 부재 | 한국 B2B 기본 5종 세트 누락 |
| 2 | **숫자 모순** — "50+" vs "11" | 두 페이지가 서로 반박 |
| 3 | **Practice 두 축 과부하 인상** — 컨설팅+MSP 24x7 — 회사 규모 대비 정체성 흐릿 | 공공기관·민간 모두 회의적 |
| 4 | **벤더 마케팅 톤 콘텐츠** — 데이터 보호 5건 전부 Acronis 홍보 | "벤더 물어준 글"로 분류 |
| 5 | **모든 길이 contact 폼 깔때기** — 가격·SKU 0 | 비교 쇼핑 사용자 30초 이탈 |

**한 줄 평**: 콘텐츠와 진단 도구의 기술 깊이는 한국 SI 평균 대비 위쪽이지만, **회사가 실재한다는 가장 기본적인 신호**가 빠져 있어 진단 도구를 써보기도 전에 페르소나 1·3에서 컷오프된다. **우선순위는 "Practice 추가" 아니라 "회사 신원 공개 + 실 사례 1건 + 인증 신청 상태 명시"**.

---

## 보안·프라이버시 감사

### CRITICAL (즉시 조치)

| # | 항목 | 위치 | 문제 |
|---|---|---|---|
| 1 | 마크다운 XSS | src/lib/markdown.ts | `remark-html`만 사용, sanitize 없음 — 콘텐츠 본문 통한 세션 탈취·피싱 가능 |
| 2 | 고객사 비동의 노출 | site-config.ts:165 | KINS·KINAC(원자력 안보 기관) 등 실명 + VDI/Citrix 노트 공개. 동의 흔적 0 |
| 3 | 개인정보처리방침 부재 | repo 전체 0건 | 한국 개인정보보호법 §15·17·30 위반 소지 |
| 4 | Rate limiting 부재 | 모든 API route | 봇 1대로 leads 무한 적재·webhook flooding |

### HIGH (1주 내)

| # | 항목 | 조치 |
|---|---|---|
| 5 | Postgres 에러 그대로 노출 (30+곳 `error.message`) | API 에러 마스킹 헬퍼 |
| 6 | tool_runs anon SELECT 전체 허용 | RLS 정책 `USING (false)` 또는 admin client만 |
| 7 | reports access_token 정책 무방비 | UUID 매칭 RPC SECURITY DEFINER |
| 8 | 보안 헤더 0건 (CSP/HSTS/X-Frame) | next.config.ts headers() |
| 9 | 입력 검증 부재 (email regex·length 상한) | zod 도입 |

### MEDIUM (1개월 내)

- Notify webhook payload PII 평문 — lead_id·요약만 전송
- lead_id 검증 없는 score 업데이트 — 단명 토큰 도입
- 인증 체크가 `getUser`만 — `app_metadata.role === 'admin'` 추가
- CORS·Origin 검증 부재
- service role 키 anon 엔드포인트와 동일 핸들러 — RLS 통과 시도 후 admin

### LOW

- 명함·이메일 서명 HTML 인덱싱 가능 — robots.txt
- consent_marketing 텍스트 부정확 — 수집·이용/마케팅 분리
- lead_extensions.message 무검증 저장

### 칭찬할 점

- service role 키 NEXT_PUBLIC_ 오용 없음
- access_token이 `crypto.randomUUID()` v4 (122-bit 엔트로피)
- organization_type allowlist 검증 (enum 화이트리스트)

---

## 즉시 조치 순서 (3일 plan)

### Day 1 — 비기술 (가장 시급)
- [ ] 11개 고객사 외부 표기 동의 메일 발송 (KINS·KINAC 등 안보 관련 우선)
- [ ] 미동의 기관 즉시 익명화 ("국가 R&D 연구기관 A" 형식)
- [ ] secure-workspace "50+" 통계 → 실제 수치(또는 제거)

### Day 2 — 법규
- [ ] /legal/privacy 개인정보처리방침
- [ ] /legal/terms 이용약관
- [ ] 동의 체크박스 분리 (수집·이용 / 마케팅 활용)
- [ ] 푸터·폼에 처방·약관 링크

### Day 3 — 기술
- [ ] rehype-sanitize 도입 (XSS 차단)
- [ ] next.config.ts securityHeaders + CSP·HSTS·X-Frame-Options
- [ ] Rate limiting (`@upstash/ratelimit`)
- [ ] RLS 정책 강화 (tool_runs·reports SELECT)
- [ ] API 에러 메시지 마스킹

---

## 자동 수정 진행 사항 (2026-05-01 본 보고서 작성과 동시)

본 보고서 작성 직후 다음 항목을 자동 진행:

1. ✅ 숫자 모순 제거 + 고객사 `disclosed` 플래그
2. ✅ /legal/privacy + /legal/terms 표준 템플릿
3. ✅ next.config.ts 보안 헤더
4. ✅ rehype-sanitize XSS 차단
5. ✅ API 에러 마스킹 헬퍼
6. ✅ RLS 강화 (013 마이그레이션)
7. ✅ 동의 체크박스 분리

다음 단계 (사용자 작업):
- 11개 고객사 동의 확인·익명화
- Leadership 정보 입력
- 인증 신청 상태 명시 ("ISMS-P 2026 Q3 신청 예정" 형식)
- Rate limiting (Upstash 계정 생성 후 환경변수 추가)

---

## 참조 파일 (감사 증거)

- `src/lib/markdown.ts`, `src/lib/site-config.ts`, `src/lib/notify.ts`
- `src/app/api/inquiries/route.ts`, `src/app/api/leads/route.ts`
- `src/app/api/tools/risk-assessment/run/route.ts`
- `src/app/api/reports/[toolRunId]/generate/route.ts`
- `src/app/(public)/contact/ContactForm.tsx`
- `src/app/(public)/insights/[slug]/page.tsx`
- `supabase/migrations/002_leads.sql`, `003_tool_runs.sql`, `004_reports.sql`, `010_n2sf_transition_advisor.sql`
- `next.config.ts`
- `public/email-signature-preview.html`, `public/business-card.html`
