# Data Model - Supabase Schema

> Source of truth: `docs/02-design/features/vdi-leadsystem-mvp.design.md` § 3

## Tables

### content_items (CMS 콘텐츠)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default gen_random_uuid() | 콘텐츠 ID |
| type | text | NOT NULL | article / case / checklist / comparison |
| title | text | NOT NULL | 제목 |
| slug | text | UNIQUE, NOT NULL | URL slug |
| status | text | default 'draft' | draft / published |
| excerpt | text | | 요약 |
| body_md | text | | Markdown 본문 |
| cover_image_url | text | nullable | 커버 이미지 (Supabase Storage) |
| tags | text[] | default '{}' | 태그 배열 |
| category | text | | 카테고리 |
| seo_title | text | nullable | SEO 제목 |
| seo_description | text | nullable | SEO 설명 |
| faq_json | jsonb | nullable | Q/A 배열 `[{q, a}]` |
| created_at | timestamptz | default now() | 생성일 |
| updated_at | timestamptz | default now() | 수정일 |
| published_at | timestamptz | nullable | 발행일 |

### leads (리드)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default gen_random_uuid() | 리드 ID |
| email | text | UNIQUE (upsert) | 이메일 |
| name | text | nullable | 이름 |
| company | text | nullable | 회사명 |
| source | text | | seo / direct / referral / campaign / ai |
| consent_marketing | boolean | default false | 마케팅 동의 |
| status | text | default 'new' | new / contacted / qualified / ... |
| score | integer | default 0 | 리드 스코어 |
| created_at | timestamptz | default now() | 생성일 |
| updated_at | timestamptz | default now() | 수정일 |

### tool_runs (진단 실행)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default gen_random_uuid() | 진단 실행 ID |
| lead_id | uuid | FK → leads, nullable | 연결 리드 |
| tool_type | text | NOT NULL | risk_assessment |
| input_json | jsonb | NOT NULL | 설문 응답 |
| output_json | jsonb | | 스코어링 결과 |
| score | integer | | 종합 점수 (0~100) |
| created_at | timestamptz | default now() | 생성일 |

### reports (리포트)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default gen_random_uuid() | 리포트 ID |
| lead_id | uuid | FK → leads | 리드 |
| tool_run_id | uuid | FK → tool_runs | 진단 실행 |
| title | text | | 리포트 제목 |
| report_html | text | | 렌더링된 HTML |
| pdf_url | text | nullable | PDF Storage 경로 |
| access_token | text | UNIQUE, NOT NULL | URL 접근 토큰 |
| created_at | timestamptz | default now() | 생성일 |

## Full-Text Search (Postgres FTS)

```sql
ALTER TABLE content_items ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(body_md, '')), 'C')
  ) STORED;

CREATE INDEX content_items_fts_idx ON content_items USING gin(fts);
```

## Row Level Security (RLS)

### content_items
- Public: `SELECT WHERE status = 'published'`
- Admin: Full CRUD

### leads
- Public: `INSERT` (upsert)
- Admin: `SELECT`, `UPDATE`

### tool_runs
- Public: `INSERT`
- Admin: `SELECT`

### reports
- Public: `SELECT WHERE access_token = :token`
- Admin: `SELECT`

## Relationships
- `tool_runs.lead_id` → `leads.id`
- `reports.lead_id` → `leads.id`
- `reports.tool_run_id` → `tool_runs.id`

## Indexes
- `content_items(slug)` — UNIQUE
- `content_items(status, published_at)` — 목록 조회
- `content_items(fts)` — GIN (FTS)
- `leads(email)` — UNIQUE (upsert)
- `reports(access_token)` — UNIQUE (토큰 조회)
- `tool_runs(lead_id)` — FK 조회
