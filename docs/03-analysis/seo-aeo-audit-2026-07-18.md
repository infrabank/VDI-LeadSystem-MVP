# 검색·AI 노출 최적화 감사·실행 보고서 (2026-07-18)

> 입력: `myloket_search_ai_optimization_prompt.md` (20개 지시 항목)
> 원칙: 순위·AI 추천 보장 표현 금지, 숨김 키워드·가짜 신호 금지, 확인 안 된 정보 생성 금지.

## 1. 기술 SEO 감사표 (실사이트 응답 기준, 수정 전)

| URL | 상태 | 문제 | 조치 |
|---|---|---|---|
| http://myloket.co.kr | 308 → https | 정상 | 유지 |
| https://myloket.co.kr | 200 | — 대표 도메인 | 유지 |
| http(s)://www.myloket.co.kr | **200 (중복 서빙)** | www가 리디렉션 없이 동일 콘텐츠 | **호스트 기반 308 → non-www (수정 완료)** |
| https://mlkit.co.kr | **307 → www.mlkit** | 임시 리디렉션 + 잘못된 대상 | **308 → myloket.co.kr (수정 완료)** |
| https://www.mlkit.co.kr | **200 (중복 서빙)** | 옛 도메인이 전체 사이트 서빙 | **경로 보존 308 → myloket.co.kr (수정 완료)** |
| 모든 서브페이지 canonical | **홈으로 지정** | 루트 layout `canonical:"/"` 상속 → 전 페이지가 홈의 중복으로 인식될 수 있는 **치명적 색인 버그** | **페이지별 self-canonical (수정 완료)** |
| robots.txt | 200, 정상 | AI 크롤러 명시 규칙 없음 | 명시 규칙 추가 (수정 완료) |
| sitemap.xml | 200, canonical만 포함 | 정상 (7/18 오전 lastmod 정비됨) | 유지 |
| /contact (JS 미실행) | "폼을 불러오는 중"만 노출 | 크롤러가 문의 수단 못 봄 | SSR 폴백+noscript (수정 완료) |
| GA4 | **CSP가 googletagmanager 차단** | 프로덕션에서 GA4 로드 실패 상태였음 | CSP 허용 추가 (수정 완료) |
| 페이지 title | `... | Myloket | Myloket` 중복 | 7/18 오전 수정 완료 | 접미사 `| 마이로켓`으로 통일 |

## 2. 적용 완료 (코드)

### 도메인 통합 (§2)
- `next.config.ts`에 호스트 기반 영구 리디렉션 3종: `www.myloket.co.kr`, `mlkit.co.kr`,
  `www.mlkit.co.kr` → `https://myloket.co.kr/:path*` — **한 번의 응답, 경로 보존** 확인
  (예: mlkit `/services/vdi-support` → myloket 동일 경로). 리디렉션 체인 없음.
- 문의 페이지 `?source=` 등 파라미터 URL은 `/contact` self-canonical로 정규화.

### canonical 정비 (§2·§1)
- 루트 layout의 canonical 상속 제거 + 공개 페이지 전체(21개 metadata + client 도구
  페이지 5개용 layout 신설)에 self-canonical 선언. thank-you는 noindex.

### 브랜드·타이틀 (§3·§8)
- 타이틀 접미사 `| Myloket` → `| 마이로켓` 통일 (루트 템플릿).
- 홈: "Citrix·Omnissa Horizon VDI 기술지원·전산 유지보수 | 마이로켓" (권장안 채택).
- 문의: "VDI 장애·전산 유지보수 기술지원 문의". 서비스 페이지들은 7/18 오전 재설계분 유지.

### 파트너 표기 (§4)
- 대표 확인(2026-07-18): 5개 벤더 모두 공식 파트너 → "공식 파트너" 통합 표기.
  VBTP 기술자격은 인증번호·유효기간과 함께 별도 표시(기존). 증빙 이미지는 Vinchin만
  확보 — 나머지 벤더 증빙·디렉터리 등재는 외부 작업 항목.

### 크롤러 정책 (§5)
- robots.txt에 Googlebot·Bingbot·OAI-SearchBot·ChatGPT-User·PerplexityBot·
  Perplexity-User·Claude-SearchBot·Claude-User 명시 허용 (비공개 영역 공통 차단).
- GPTBot(학습용)은 현재 허용 정책 — 학습 제공을 원치 않으면 robots.ts에 GPTBot
  disallow 규칙만 추가하면 되고, 검색 노출(OAI-SearchBot)과는 분리되어 영향 없음.

### sitemap·색인 통지 (§6)
- sitemap: canonical URL만, lastmod 임의 갱신 없음 (기존 정비 유지).
- **IndexNow 구현**: 키 파일(`/af82…aca.txt`) + `lib/indexnow.ts` + 콘텐츠 발행 API에서
  발행 즉시 Bing·Naver 계열에 통지 (best-effort, 발행 흐름 비차단).
- `llms.txt` 보조 파일 제공 (사이트 요약 + canonical 링크; HTML·sitemap 대체 아님).

### 서버 렌더링·접근성 (§7)
- 문의 페이지: Suspense 폴백을 "문의 유형 3종 + 이메일·전화 직접 링크"가 담긴 정적
  콘텐츠로 교체 → JS 미실행 크롤러도 문의 수단 확인 가능. `<noscript>` 안내 추가.
- 폼 필드는 전부 명시적 `<label>` + 유형 버튼 `aria-pressed` (7/18 오전 적용분).

### 구조화 데이터 (§9)
- 루트: `Organization`+`ProfessionalService` 통합(@id 유지) — logo·email·founder 추가,
  `WebSite` LD 신설. 화면에 없는 가격·평점 없음.
- About: 대표 `Person` LD (name·jobTitle·image(founder.jpg)·knowsAbout·hasCredential
  VBTP·worksFor) — 화면 표시 정보와 일치.
- Insights Article: author를 `Person`(제현우, author.url=/about)으로 교체.
  BreadcrumbList·FAQPage 기존 유지.

### 검색 의도-전환 연결 (§18)
- Insights 상세 CTA를 콘텐츠 주제별 분기: Horizon("현재 Horizon 환경 검토 요청") /
  Citrix("Citrix 장애 원인 상담") / 백업("백업 복구 가능성 점검") / 유지보수("월간
  유지보수 상담") / 범용. CTA 아래 진행 4단계 표기. 문의 폼 유형(type=)과 연동.

### 측정 (§17)
- GA4 차단하던 CSP 수정 (script-src·connect-src에 GA 도메인 허용) — **이번 수정 전에는
  프로덕션에서 GA4가 로드되지 않았을 가능성이 높음.** 배포 후 실시간 보고서로 확인 필요.
- referral 채널(chatgpt.com/perplexity.ai/claude.ai)·utm_source=chatgpt.com 구분은 GA4
  자동 수집 데이터로 가능 — GA4 UI에서 채널 그룹 정의(외부 작업).

## 3. 수정 후 검증 결과 (로컬 프로덕션 빌드)

- 서브페이지 canonical: `/services/vdi-support` → 자기 자신 ✓ (수정 전: 홈)
- 호스트 리디렉션: 3개 호스트 모두 단일 308, 경로 보존 ✓
- robots.txt: AI 크롤러 규칙 출력 ✓ · llms.txt 200 ✓ · IndexNow 키 200 ✓
- 홈 title "…VDI 기술지원·전산 유지보수 | 마이로켓" ✓
- 문의 페이지 JS-less HTML에 문의 유형·이메일·전화 노출 ✓
- lint 0건, 빌드 성공 ✓

## 4. 외부 작업 (코드로 불가 — 담당자 실행 필요)

| 작업 | 도구 | 비고 |
|---|---|---|
| Search Console에 myloket.co.kr·mlkit.co.kr 모두 등록, 도메인 변경(주소 이전) 신청 | Google Search Console | mlkit 색인·백링크 이전 손실 최소화 |
| Bing Webmaster Tools 등록 + sitemap 제출 | Bing | IndexNow 키 자동 인증됨 |
| 네이버 서치어드바이저 sitemap 제출 (소유확인 완료됨) | 네이버 | |
| Google 비즈니스 프로필·네이버 스마트플레이스 등록 (NAP 일치: (주)마이로켓·세종 주소·010-3861-8079) | GBP·네이버 | 지역 검색(§15) 핵심 |
| LinkedIn 회사 페이지·대표 프로필 → 확보 후 Organization LD `sameAs`에 추가 | LinkedIn | §14 |
| 벤더 파트너 디렉터리 등재 확인 (Citrix·VMware·Omnissa·Acronis·Vinchin) | 각 벤더 포털 | AI 인용의 외부 근거 |
| contact@myloket.co.kr 메일 개설 검토 (기존 mlkit 주소는 전달용 유지) | 메일 호스팅 | §3 도메인-이메일 일치 |
| Rich Results Test·Schema Validator로 배포 후 LD 검증 | Google 도구 | |

## 5. 콘텐츠 작업 (단기·중기 — §10~§13)

- **Insights 37개 검수** (중복·구식 라이선스 정책·벤더 명칭(VMware→Omnissa)·출처 부족·
  일괄 생성 패턴): 콘텐츠 감사는 별도 세션에서 DB 조회로 수행 권장. 낮은 가치 글은
  삭제보다 통합+301.
- **신규 콘텐츠 우선순위** (검색 의도 × 상담 연결 기준 상위 10):
  1. Citrix VDA가 등록되지 않을 때 확인할 항목
  2. Horizon UAG 외부접속 장애 점검 순서
  3. Horizon 인증서 교체 후 접속 오류
  4. FSLogix 로그인 지연 원인 구분
  5. VMware Horizon→Omnissa Horizon 전환 후 확인사항
  6. 백업 성공과 실제 복구 가능성이 다른 이유
  7. vCenter 업그레이드 전 Horizon/Citrix 호환성 점검
  8. 전산 담당자 퇴사 후 가장 먼저 확인할 항목
  9. VDI 유지보수 업체가 월간 점검해야 하는 항목
  10. 기존 구축업체 철수 시 인수인계 복구 방법
  — 각 글은 §10 구조(질문 제목→결론 요약→적용 버전→증상→원인→확인 순서→조치→검증→
  주의·롤백→벤더 문서 출처→수행 경험→작성자·검토일→관련 CTA)로 작성. 작성자 제현우
  실명 + /about 링크. 대량 일괄 발행 금지 — 주 1~2건.
- **사례 분류(§12)**: CMS에 실제 수행 사례(type=case)와 도입 시나리오·기술 가이드를
  분리 표기. 실사례는 대표 인터뷰 기반으로만 작성 (7/18 오전 보고서의 8종 목록 참조).

## 6. AI 질의 테스트 (§16)

배포 전 테스트는 무의미(변경 미반영)하므로, **배포 + Search Console 재색인 후 2주 뒤**
브랜드명 없는 질의 14종(문서 목록)을 Google/Bing/네이버/ChatGPT/Perplexity/Claude에서
실행하고 문서 양식(노출 여부·인용 URL·경쟁 출처·부족 정보·개선 페이지)으로 기록할 것.
이번에 수정한 canonical 버그가 서브페이지 색인의 선결 조건이었으므로, 테스트는 반드시
재색인 이후에 의미가 있음.

## 7. 30·60·90일 계획

- **30일**: 배포 → Search Console·Bing·네이버 sitemap 제출과 주요 URL 색인 요청 →
  GBP·네이버 플레이스 등록 → GA4 로드 정상화 확인 → 신규 콘텐츠 2~4건(우선순위 1~4).
- **60일**: Insights 37개 검수·통합, 실사례 4종 발행(대표 인터뷰), LinkedIn·벤더
  디렉터리 sameAs 반영, 비브랜드 검색 노출·contact_click 첫 측정 리포트.
- **90일**: AI 질의 테스트 14종 실행·기록, 경쟁 출처 분석 기반 콘텐츠 보강, 지역
  페이지(충청권) 검토 — 실제 방문 사례 있을 때만, 월간 성과 보고 체계 고정.
