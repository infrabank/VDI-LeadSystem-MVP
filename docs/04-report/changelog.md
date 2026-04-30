# Changelog

## [0.7.0] - 2026-04-30 — 리포지셔닝: Secure Workspace Practice
- 사이트 전체 포지셔닝을 "VDI 전문" → "공공·금융 보안 워크스페이스·접근통제 전문 (N²SF 정렬)"으로 재편
- 브랜드 부제 "Secure Workspace Practice" 추가 (헤더·푸터·SEO 메타)
- Hero H1·서브헤드·CTA·통계 섹션·Features 섹션 전체를 N²SF 4 Service Pillar 중심으로 교체
- N²SF 진단센터(/n2sf) — N²SF 정렬 진단(v4) 카드를 1순위로 추가, 4종 진단 도구 그리드 재편
- 루트 layout.tsx: title/description/openGraph/twitter/JSON-LD(ProfessionalService) N²SF 정렬로 업데이트

## [0.6.0] - 2026-04-30 — N²SF Primary-Source Alignment v4

### Added
- **N²SF 통제 데이터**: 274개 보안통제 정규화 (`controls.json` + `controls.index.ts`)
  - 6장 / 27도메인 / C/S/O 등급 + is_managerial 메타
  - 파서 검증: `parse-n2sf-controls.mjs` with CI row count assertion
- **N²SF 정보서비스 모델**: 3개 모델 매핑 (`models.json`)
  - 모델 3 (SaaS 협업) / 모델 8 (통합문서) / 모델 10 (무선환경)
  - 각 모델별 required_controls + emphasis_controls + vdi_signal
- **VDI Core Controls**: Top 10 통제 (`vdi-core.ts`)
  - DA-3/4, RA-2/6, SN-1, IF-1/14, EB-5, AC-1(2), IN-6
- **Risk Assessment v4**: N²SF 등급 기반 스코어링
  - 28문항 / 8스텝 (Step 2: 등급분류 + Step 3: 모델선택 신규)
  - `resolveGrade()` — 가이드라인 표 2-9 자동 승계 로직
  - 22 N²SF 매핑 룰 (SKIPPED_RULES 주석 추적)
  - 등급별 가중치 (C 1.5 / S 1.2 / O 1.0)
  - appropriateness_label (ready ≥70 / partial 40~69 / early <40)
- **Risk Assessment v4 리포트**: 11섹션 확장
  - §4: N²SF 등급·모델 카드
  - §5: N²SF 통제 준수 현황 (충족/미흡/권고)
  - §8: 모델별 강조 통제
  - §11: 법적 면책·외부 절차 안내
- **폼 UI**: 8-step으로 확장 (Step 1 기본정보 + Step 2~3 신규 + Step 4~8 기존)
  - Step 2: 데이터 등급 분류 (C/S/O 라디오) + 혼재정보 다중선택
  - Step 3: 운용 시나리오 (모델3/8/10 선택)
  - Inline help: 등급 정의 + 모델 설명
- **API 자동감지**: v4 입력 필드 추가 시 v4 처리
  - `POST /api/tools/risk-assessment/run`: data_grade + mixed_grade + service_model 지원
  - `POST /api/reports/[toolRunId]/generate`: v4 output_json 시 v4 템플릿 사용
- **3개 콘텐츠 초안**: N²SF 가이드라인 기반
  - n2sf-grade-classification-guide (C/S/O 자가분류)
  - vdi-saas-collab-controls-model3 (모델3 통제 12선)
  - vdi-wireless-office-checklist-model10 (모델10 체크리스트)
- **13개 v4 unit test** (`risk-assessment-v4.test.ts`)
  - 등급 자동 승계 테스트 (5개)
  - 스코어링 룰 매핑 테스트 (8개)
  - 100% pass

### Changed
- 폼 단계: 6 → 8 (33% 증가)
- 폼 문항: 25 → 28 (12% 증가)
- 리포트 섹션: 8 → 11 (37% 증가)
- 설계 문서 §3.1 도메인 개수 업데이트 예정 (22 → 27)

### Fixed
- 부록1 통제 파싱: 268 → 274 정정 (정규식 파서 기반)
- 도메인 카운트: 22 → 27 정정 (1차 소스 ground truth)

### Deferred to v5
- 입력 필드 5개 추가 (session_timeout_min, patch_management, monitoring_level, backup_encrypted, wireless_audit)
- 스코어링 룰 8개 활성화 (RULE-RA-01, IN-01, AC-02/03, DU-01, DLP, encryption_at_rest, audit_log, encryption_key)
- 모델 4~11 매트릭스 (부록2 8개 모델, v2 스프린트)
- 리포트 §5 N²SF ID enrichment (gap_controls 라벨)
- 리포트 §8 모델별 카드 렌더 (PDF 섹션 구현)
- 리포트 §9 로드맵 N²SF ID 매핑

### Quality Assurance
- Build: PASS (Next.js 16 production)
- Tests: 66/66 pass (v4 포함)
- TypeScript: strict mode, 에러 0
- Gap Analysis: 86.7% match rate (45 충족 + 14×0.5 부분 / 60 항목)

### Migration
- v3 입력 호환성 유지 (하위 호환)
- `?ver=3` 쿼리로 v3 폼 임시 유지 (1주 후 제거)
- Day 0~14 롤아웃 일정: opt-in → default → legacy 제거

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
