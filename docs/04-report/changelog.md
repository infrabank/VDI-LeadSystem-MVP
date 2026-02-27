# Changelog

## [0.5.0] - 2026-02-27 — Risk Assessment v3
- 25문항 6섹션 심층 진단 (규모/아키텍처/DR/운영/자동화/보안)
- 6-step 프로그레시브 폼 UI (진행률 표시)
- v3 스코어링 엔진: 4카테고리 성숙도 모델 (Migration/DR/Operations/Automation)
- 리스크 상세: 최소 5개, 카테고리 태그 (이관/DR/운영/자동화/보안)
- 3시나리오 예측 (단기/중기/대형장애)
- 3단계 개선 로드맵 (즉시조치/파일럿/실행)
- 3페이지 PDF 템플릿 (Executive Summary + 상세분석 + 로드맵)
- API 버전 자동감지 (v1/v2/v3)
- 21개 v3 테스트 추가 (총 64개)

## [0.4.0] - 2026-02-27 — Bug/Gap Fixes + Dead Code Cleanup
- v1 risk-assessment.ts 데드코드 삭제
- v1 risk-assessment.test.ts 삭제
- 리드 점수 writeback 확인 (이미 구현됨)
- FAQ 입력 UI 확인 (이미 구현됨)
- /thank-you 페이지 연결 확인 (이미 구현됨)

## [0.3.0] - 2026-02-27 — Risk Assessment Report v2 (Consulting-Grade)
- 4카테고리 성숙도 모델 (Migration/DR/Operations/Automation)
- 벤치마크 비교 (VM 규모별 평균 대비)
- 3~5개 리스크 상세 (제목/범위/영향/조건/가능성)
- 현 상태 유지 시 3시나리오 예측
- 3단계 개선 로드맵 (2-3 액션/단계)
- Executive Summary 자동 생성
- 2페이지 PDF 템플릿
- 16개 v2 테스트 추가

## [0.2.0] - 2026-02-27 — ROI Calculator + PDF Improvements
- ROI Calculator v2 (3년 TCO, 절감액, 투자회수기간)
- PDF retry 메커니즘 (생성 실패 시 재시도)
- Client-side window.print() fallback (Vercel 호환)
- A4 인쇄 맞춤
- ROI 전용 리포트/PDF

## [0.1.0] - 2026-02-27 — Project Initialization + MVP
- Next.js 16 + TypeScript + Tailwind CSS v4 project scaffolded
- Supabase client/server/middleware configured
- PDCA document structure created
- Admin CMS (콘텐츠 CRUD + 발행 + 이미지 업로드)
- Public 콘텐츠 (리스트/검색/상세 + JSON-LD SEO)
- 리드 획득 (이메일 upsert + 동의)
- Risk Assessment v1 (7문항 기본 진단)
- PDF 생성 (Puppeteer + HTML 템플릿)
- 웹 리포트 뷰어 (access_token 기반)
