# PDCA DESIGN — VDI-LeadSystem-MVP

- **Version**: v2.0
- **Date**: 2026-02-27
- **Linked Plan**: docs/01-plan/VDI-LeadSystem-MVP.md

---

## 1. 아키텍처 개요

- Next.js 16 (App Router, Turbopack) — Public + Admin + API
- Supabase:
  - Auth: Admin 로그인 (이메일/비밀번호)
  - Postgres: 콘텐츠/리드/진단/리포트 저장
  - Storage: 이미지 + PDF 저장
- PDF 생성: Puppeteer (서버 사이드 HTML 템플릿 렌더링)
- Fallback: Client-side `window.print()` (Vercel 서버리스 환경)

## 2. 권한 모델(RBAC)

- Admin만 `/admin` 접근 (Supabase Auth + requireAdmin middleware)
- Public은 `content_items.status = 'published'`만 조회
- reports는 토큰 기반 접근 (`access_token`)

## 3. 데이터 모델

> 상세: `docs/02-design/data-model.md`

### content_items
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | 콘텐츠 ID |
| type | text | NOT NULL | article / case / checklist / comparison |
| title | text | NOT NULL | 제목 |
| slug | text | UNIQUE, NOT NULL | URL slug |
| status | text | default 'draft' | draft / published |
| excerpt | text | | 요약 |
| body_md | text | | Markdown 본문 |
| cover_image_url | text | nullable | 커버 이미지 (Storage) |
| tags | text[] | default '{}' | 태그 배열 |
| category | text | | 카테고리 |
| seo_title | text | nullable | SEO 제목 |
| seo_description | text | nullable | SEO 설명 |
| faq_json | jsonb | nullable | Q/A 배열 `[{q, a}]` |
| created_at | timestamptz | default now() | 생성일 |
| updated_at | timestamptz | default now() | 수정일 |
| published_at | timestamptz | nullable | 발행일 |

### leads
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | 리드 ID |
| email | text | UNIQUE (upsert) | 이메일 |
| name | text | nullable | 이름 |
| company | text | nullable | 회사명 |
| source | text | | seo / direct / referral / campaign / ai |
| consent_marketing | boolean | default false | 마케팅 동의 |
| status | text | default 'new' | new / contacted / qualified / ... |
| score | integer | default 0 | 리드 스코어 (진단 실행 시 자동 업데이트) |
| created_at | timestamptz | default now() | 생성일 |
| updated_at | timestamptz | default now() | 수정일 |

### tool_runs
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | 진단 실행 ID |
| lead_id | uuid | FK → leads, nullable | 연결 리드 |
| tool_type | text | NOT NULL | `risk_assessment` / `roi` |
| input_json | jsonb | NOT NULL | 설문 응답 |
| output_json | jsonb | | 스코어링 결과 (version 필드로 v1/v2/v3 구분) |
| score | integer | | 종합 점수 (0~100) |
| created_at | timestamptz | default now() | 생성일 |

### reports
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | 리포트 ID |
| lead_id | uuid | FK → leads | 리드 |
| tool_run_id | uuid | FK → tool_runs | 진단 실행 |
| title | text | | 리포트 제목 |
| report_html | text | | 렌더링된 HTML |
| pdf_url | text | nullable | PDF Storage 경로 |
| access_token | text | UNIQUE, NOT NULL | URL 접근 토큰 |
| created_at | timestamptz | default now() | 생성일 |

## 4. 라우팅(페이지)

### Public (8 routes)
| Path | Type | Description |
|------|------|-------------|
| `/` | Static | 홈 |
| `/content` | Dynamic | 콘텐츠 리스트/검색 (FTS) |
| `/content/[slug]` | Dynamic | 콘텐츠 상세 (Markdown + FAQ + JSON-LD) |
| `/tools/risk-assessment` | Static | 리스크 진단 입력 (v3: 6-step 25문항) |
| `/tools/roi-calculator` | Static | ROI 계산기 입력 |
| `/reports/[token]` | Dynamic | 리스크 웹 리포트 뷰 + PDF 다운로드 |
| `/reports/roi/[token]` | Dynamic | ROI 웹 리포트 뷰 + PDF 다운로드 |
| `/thank-you` | Static | 완료/감사 페이지 (리포트 링크 제공) |

### Admin (5 routes)
| Path | Type | Description |
|------|------|-------------|
| `/admin/login` | Static | 로그인 |
| `/admin/content` | Dynamic | 콘텐츠 목록 |
| `/admin/content/new` | Dynamic | 콘텐츠 작성 |
| `/admin/content/[id]/edit` | Dynamic | 콘텐츠 수정/발행/삭제 |
| `/admin/leads` | Dynamic | 리드 목록 |

## 5. API

> 상세: `docs/02-design/api-spec.md`

### Public (7 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/content?q=&tag=&type=&page=` | 콘텐츠 검색/필터 |
| GET | `/api/content/[slug]` | 콘텐츠 상세 |
| POST | `/api/leads` | 리드 생성 (email upsert) |
| POST | `/api/tools/risk-assessment/run` | 리스크 진단 실행 (v2/v3 자동감지) |
| POST | `/api/tools/roi/run` | ROI 계산 실행 |
| POST | `/api/reports/[toolRunId]/generate` | 리스크 PDF 생성 |
| POST | `/api/reports/roi/[toolRunId]/generate` | ROI PDF 생성 |

### Admin (6 endpoints)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/content` | 콘텐츠 생성 |
| PUT | `/api/admin/content/[id]` | 콘텐츠 수정 |
| DELETE | `/api/admin/content/[id]` | 콘텐츠 삭제 |
| POST | `/api/admin/content/[id]/publish` | 발행 처리 |
| GET | `/api/admin/leads` | 리드 목록 조회 |
| POST | `/api/admin/upload` | 이미지 업로드 (Storage) |

### Utility (1 endpoint)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/reports/retry-pdf/[reportId]` | PDF 재생성 (실패 시 재시도) |

## 6. 진단 도구

### 6.1 Risk Assessment v3 (현행)

**25문항 6섹션 심층 진단**

| 섹션 | ID | 문항 수 | 주요 항목 |
|------|-----|---------|----------|
| 기본 규모 | scale | 4 | platform, vm_count, host_count, concurrent_users |
| 아키텍처/스토리지 | arch | 5 | storage_type, storage_protocol, storage_migration, multipath, network_separation |
| 가용성/DR | dr | 6 | ha_enabled, dr_site, rpo_target, rto_target, backup_exists, backup_frequency |
| 운영/변경관리 | ops | 4 | ops_staff_level, incident_response_maturity, change_management, documentation_level |
| 자동화/확장성 | auto | 3 | automation_level, provisioning_time, migration_rehearsal |
| 보안/접속 | sec | 3 | access_method(multiselect), mfa_enabled, privileged_access_control |

**스코어링 모델: 4카테고리 성숙도**

| 카테고리 | 범위 | 설명 |
|---------|------|------|
| Migration Readiness | 0~25 | 이관 준비도 (스토리지, 리허설, 변경관리) |
| DR/Backup | 0~25 | 재해복구 체계 (백업, DR사이트, RPO/RTO) |
| Operations | 0~25 | 운영 성숙도 (인력, 장애대응, 문서화) |
| Automation & Scale | 0~25 | 자동화 수준 (자동화, 프로비저닝, 규모대응) |

- 각 카테고리: 25점 시작, 조건별 감점
- 종합 리스크 점수 = `100 - (Migration + DR + Operations + Automation)`
- 성숙도 레벨: 0-5=L1, 6-10=L2, 11-17=L3, 18-22=L4, 23-25=L5

**리스크 등급**:
| 점수 | 등급 |
|------|------|
| 0~25 | Low |
| 26~50 | Medium |
| 51~75 | High |
| 76~100 | Critical |

**출력 구조 (RiskAssessmentV3Output)**:
| 필드 | 설명 |
|------|------|
| version | "v3" |
| score | 종합 리스크 점수 (0~100) |
| risk_level | low / medium / high / critical |
| maturity_model | 4카테고리 점수 + 레벨 |
| benchmark_text | 벤치마크 비교 텍스트 |
| benchmark_comparison | 동일 규모 평균 대비 분석 |
| risks[] | 최소 5개 리스크 상세 (title, impact_scope, potential_impact, trigger_condition, likelihood, category) |
| current_state_projection | 3시나리오 예측 (단기/중기/대형장애) |
| roadmap | 3단계 로드맵 (즉시조치/파일럿/실행, 각 2-4 액션) |
| executive_summary | 종합 분석 요약 |
| risk_messages[] | 호환용 리스크 문장 배열 |
| next_steps[] | 권장 다음 단계 배열 |

**버전 호환**:
- v3: 25문항 입력 → 4카테고리 성숙도 모델 (현행)
- v2: 7문항 입력 → 4카테고리 성숙도 모델 (하위호환)
- v1: 삭제됨 (데드코드 정리)
- API 자동감지: `version` 필드 또는 입력 shape (`host_count`, `ha_enabled` 등 존재 시 v3)

### 6.2 ROI Calculator v2

**VDI 비용 절감 계산기**
- 입력: 사용자 수, 현재 PC 비용, VDI 라이선스 비용, 인건비 등
- 출력: 3년 TCO 비교, 연간 절감액, 투자회수기간(ROI), 절감률

## 7. PDF 템플릿

| 파일 | 대상 | 페이지 수 |
|------|------|----------|
| `risk-assessment.html` | Risk v1 리포트 | 1 |
| `risk-assessment-v2.html` | Risk v2 리포트 | 2 |
| `risk-assessment-v3.html` | Risk v3 리포트 (3페이지: Executive Summary + 상세분석 + 로드맵) | 3 |
| `roi.html` | ROI v1 리포트 | 1 |
| `roi-v2.html` | ROI v2 리포트 | 2 |

**렌더링 흐름**: HTML 템플릿(`{{placeholder}}`) → `renderReport*Html()` → `generatePdf()` (Puppeteer) → Storage 업로드 → `pdf_url` 저장

**실패 시**: `pdf_url = null`로 저장, 웹 리포트는 항상 제공, `retry-pdf` API로 재시도 가능

## 8. SEO/AI 인용을 위한 콘텐츠 구조

### 필수 규칙
- 모든 콘텐츠에:
  - 적용 범위(버전/전제조건) 섹션
  - 체크리스트(또는 단계)
  - FAQ (가능하면 3개 이상)
- "최종 업데이트 날짜" 표시 (페이지 상단)

### JSON-LD
- `Article` — 모든 콘텐츠
- `FAQPage` — FAQ가 있을 때 추가

## 9. 폼 UX (Risk Assessment v3)

**6-step 프로그레시브 폼**:
1. **리드 입력** — 이름, 이메일, 회사명, 마케팅 동의
2. **기본 규모** — 플랫폼, VM 수, 호스트 수, 동시사용자
3. **아키텍처/스토리지** — 스토리지 유형, 프로토콜, 이관 포함, 멀티패스, 망분리
4. **가용성/DR** — HA, DR사이트, RPO/RTO, 백업, 백업주기
5. **운영/변경관리** — 인력 수준, 장애 대응, 변경관리, 문서화
6. **자동화+보안** — 자동화 수준, 프로비저닝, 리허설, 접속방식, MFA, PAM

**UI 요소**: 진행률 바(%) + 스텝 인디케이터 + 이전/다음 네비게이션 + 섹션별 검증

**완료 플로우**: 리드 생성 → v3 진단 실행 → 리포트 생성 → `/thank-you?report=` 리다이렉트

## 10. 테스트 현황

| Suite | 테스트 수 | 대상 |
|-------|----------|------|
| risk-assessment-v3.test.ts | 21 | v3 스코어링 (점수/등급/성숙도/리스크/로드맵/시나리오) |
| risk-assessment-v2.test.ts | 16 | v2 스코어링 |
| roi-v2.test.ts | 16 | ROI 계산기 |
| pdf.test.ts | 11 | PDF 렌더링 (v1/v2/v3 HTML 생성) |
| **합계** | **64** | |
