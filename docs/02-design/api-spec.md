# API Specification

> Source of truth: `docs/02-design/features/vdi-leadsystem-mvp.design.md` § 5

## Authentication
Supabase Auth — Admin만 로그인 (이메일/비밀번호). 세션은 middleware에서 관리.

## Public API

### GET /api/content
콘텐츠 검색/필터/페이지네이션
- Query: `?q=&tag=&type=&page=`
- FTS: `q` 파라미터 → Postgres FTS
- Returns: `{ data: ContentItem[], total: number, page: number }`

### GET /api/content/[slug]
콘텐츠 상세 (published만)
- Returns: `ContentItem`

### POST /api/leads
리드 생성 (email 기반 upsert)
- Body: `{ email, name?, company?, source?, consent_marketing }`
- Returns: `{ id, email }`

### POST /api/tools/risk-assessment/run
진단 실행 + 스코어링
- Body: `{ lead_id, input: { platform, vm_count, network_separation, storage_migration, backup_exists, downtime_tolerance, ops_staff_level? } }`
- Returns: `{ tool_run_id, score, risks: string[], next_steps: string[] }`

### POST /api/reports/[toolRunId]/generate
PDF 생성 → Storage 업로드
- Returns: `{ report_id, access_token, pdf_url }`

## Admin API (Protected)

### POST /api/admin/content
콘텐츠 생성
- Body: `{ type, title, slug, body_md, excerpt?, tags?, category?, cover_image_url?, seo_title?, seo_description?, faq_json? }`

### PUT /api/admin/content/[id]
콘텐츠 수정

### DELETE /api/admin/content/[id]
콘텐츠 삭제

### POST /api/admin/content/[id]/publish
발행 처리 (`status = 'published'`, `published_at = now()`)

### GET /api/admin/leads
리드 목록 조회
- Query: `?status=&page=`
- Returns: `{ data: Lead[], total: number }`
