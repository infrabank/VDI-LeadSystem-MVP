# PDCA DESIGN — VDI-LeadSystem-MVP

- **Version**: v0.1
- **Date**: 2026-02-27
- **Linked Plan**: docs/01-plan/VDI-LeadSystem-MVP.md

---

## 1. 아키텍처 개요

- Next.js(App Router)로 Public + Admin + API 구현
- Supabase:
  - Auth: Admin 로그인
  - Postgres: 콘텐츠/리드/진단/리포트 저장
  - Storage: 이미지 + PDF 저장
- PDF 생성: 서버 API에서 HTML 템플릿 렌더 후 PDF 생성

## 2. 권한 모델(RBAC)

- Admin만 `/admin` 접근
- Public은 `content_items.status = 'published'`만 조회
- reports는 토큰 기반 접근 (MVP 권장)

## 3. 데이터 모델(MVP 최소)

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
| score | integer | default 0 | 리드 스코어 |
| created_at | timestamptz | default now() | 생성일 |
| updated_at | timestamptz | default now() | 수정일 |

### tool_runs
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | 진단 실행 ID |
| lead_id | uuid | FK → leads, nullable | 연결 리드 (MVP는 필수 권장) |
| tool_type | text | NOT NULL | risk_assessment |
| input_json | jsonb | NOT NULL | 설문 응답 |
| output_json | jsonb | | 스코어링 결과 (리스크 목록) |
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
| access_token | text | UNIQUE | URL 접근 토큰 |
| created_at | timestamptz | default now() | 생성일 |

## 4. 라우팅(페이지)

### Public
| Path | Description |
|------|-------------|
| `/` | 홈 |
| `/content` | 콘텐츠 리스트/검색 |
| `/content/[slug]` | 콘텐츠 상세 |
| `/tools/risk-assessment` | 진단 입력 폼 |
| `/reports/[token]` | 웹 리포트 뷰 |
| `/thank-you` | 완료/감사 페이지 |

### Admin
| Path | Description |
|------|-------------|
| `/admin/login` | 로그인 |
| `/admin/content` | 콘텐츠 목록 |
| `/admin/content/new` | 콘텐츠 작성 |
| `/admin/content/[id]/edit` | 콘텐츠 수정 |
| `/admin/leads` | 리드 목록 |

## 5. API

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/content?q=&tag=&type=&page=` | 콘텐츠 검색/필터 |
| GET | `/api/content/[slug]` | 콘텐츠 상세 |
| POST | `/api/leads` | 리드 생성 (upsert by email) |
| POST | `/api/tools/risk-assessment/run` | 진단 실행 → 스코어링 |
| POST | `/api/reports/[toolRunId]/generate` | PDF 생성 |

### Admin (Protected)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/content` | 콘텐츠 생성 |
| PUT | `/api/admin/content/[id]` | 콘텐츠 수정 |
| DELETE | `/api/admin/content/[id]` | 콘텐츠 삭제 |
| POST | `/api/admin/content/[id]/publish` | 발행 처리 |
| GET | `/api/admin/leads` | 리드 목록 |

## 6. 진단 스코어링(룰 기반)

### 입력
| Field | Type | Values |
|-------|------|--------|
| platform | text | citrix / vmware / xenserver / mixed |
| vm_count | number | |
| network_separation | boolean | |
| storage_migration | boolean | |
| backup_exists | boolean | |
| downtime_tolerance | text | none / short / night |
| ops_staff_level | text | low / mid / high (옵션) |

### 점수 규칙
| Condition | Score |
|-----------|-------|
| vm_count >= 500 | +15 |
| storage_migration = yes | +20 |
| downtime_tolerance = none | +20 |
| backup_exists = no | +15 |
| network_separation = yes | +10 |
| ops_staff_level = low | +10 |

점수 범위: 0~100 (clamp)

### 출력 (Top 5 리스크)
규칙별 문장 템플릿으로 생성 (초기 AI 사용 금지):
- "다운타임 허용이 낮아 사전 리허설 및 단계적 컷오버 설계가 필수"
- "스토리지 이관은 병목/검증/롤백 설계 없으면 일정/품질 리스크 급증"

## 7. PDF 템플릿

- 경로: `/templates/reports/risk-assessment.html`
- 변수: `{{lead.company}}`, `{{score}}`, `{{risks[]}}`, `{{next_steps[]}}`, `{{date}}`
- 흐름: 리포트 HTML 저장 → PDF 생성 → Storage 업로드 → pdf_url 저장

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
