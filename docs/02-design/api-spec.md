# API Specification

- **Version**: v2.0
- **Date**: 2026-02-27

> Source of truth: `docs/02-design/features/vdi-leadsystem-mvp.design.md` § 5

## Authentication
Supabase Auth — Admin만 로그인 (이메일/비밀번호). 세션은 middleware에서 관리.
Admin API는 `requireAdmin()` 미들웨어로 보호.

---

## Public API (7 endpoints)

### GET /api/content
콘텐츠 검색/필터/페이지네이션
- Query: `?q=&tag=&type=&page=`
- FTS: `q` 파라미터 → Postgres FTS (`plainto_tsquery`)
- Returns: `{ data: ContentItem[], total: number, page: number }`

### GET /api/content/[slug]
콘텐츠 상세 (published만)
- Returns: `ContentItem` (body_md, faq_json 포함)

### POST /api/leads
리드 생성 (email 기반 upsert, admin client 사용)
- Body: `{ email, name?, company?, source?, consent_marketing }`
- Returns: `{ id, email }`
- Note: email UNIQUE constraint, 중복 시 기존 레코드 업데이트

### POST /api/tools/risk-assessment/run
리스크 진단 실행 + 스코어링. 버전 자동감지.
- Body:
  ```json
  {
    "lead_id": "uuid",
    "input": { ... },
    "version": "v3"  // optional, auto-detected from input shape
  }
  ```
- **v3 input** (25 fields): `platform, vm_count, host_count, concurrent_users?, storage_type, storage_protocol?, storage_migration, multipath_configured?, network_separation, ha_enabled, dr_site, rpo_target, rto_target, backup_exists, backup_frequency?, ops_staff_level, incident_response_maturity, change_management, documentation_level, automation_level, provisioning_time?, migration_rehearsal, access_method[], mfa_enabled, privileged_access_control?`
- **v2 input** (7 fields): `platform, vm_count, network_separation, storage_migration, backup_exists, downtime_tolerance, ops_staff_level?`
- **Auto-detection**: `host_count` 또는 `ha_enabled` 또는 `dr_site` 존재 시 v3으로 판정
- Returns:
  ```json
  {
    "tool_run_id": "uuid",
    "score": 65,
    "risk_level": "high",
    "risks": ["리스크 메시지 1", "..."],
    "next_steps": ["다음 단계 1", "..."]
  }
  ```
- Side effects: `tool_runs` INSERT + `leads.score` UPDATE

### POST /api/tools/roi/run
ROI 계산 실행
- Body: `{ lead_id, input: { user_count, current_pc_cost, vdi_license_cost, ... } }`
- Returns: `{ tool_run_id, score, ... }`
- Side effects: `tool_runs` INSERT (tool_type: `roi`) + `leads.score` UPDATE

### POST /api/reports/[toolRunId]/generate
리스크 리포트 PDF 생성 → Storage 업로드
- Version routing: `output_json.version` → v3/v2/v1 템플릿 선택
- Returns: `{ report_id, access_token, pdf_url }`
- PDF 실패 시: `pdf_url: null`, 리포트 레코드는 저장 (웹 리포트 제공)

### POST /api/reports/roi/[toolRunId]/generate
ROI 리포트 PDF 생성 → Storage 업로드
- Returns: `{ report_id, access_token, pdf_url }`

---

## Admin API (6 endpoints, Protected)

### POST /api/admin/content
콘텐츠 생성
- Body: `{ type, title, slug, body_md, excerpt?, tags?, category?, cover_image_url?, seo_title?, seo_description?, faq_json? }`
- Returns: `ContentItem`

### PUT /api/admin/content/[id]
콘텐츠 수정
- Body: 동일 (부분 업데이트)
- Returns: `ContentItem`

### DELETE /api/admin/content/[id]
콘텐츠 삭제
- Returns: `{ success: true }`

### POST /api/admin/content/[id]/publish
발행 처리 (`status = 'published'`, `published_at = now()`)
- Returns: `ContentItem`

### GET /api/admin/leads
리드 목록 조회
- Query: `?status=&page=`
- Returns: `{ data: Lead[], total: number }`

### POST /api/admin/upload
이미지 업로드 (Supabase Storage `images` bucket)
- Body: `FormData` (file)
- Returns: `{ url: "public_url" }`

---

## Utility API (1 endpoint)

### POST /api/reports/retry-pdf/[reportId]
PDF 재생성 (기존 report_html로 PDF 재시도)
- Condition: `pdf_url`이 null인 리포트만 대상
- Returns: `{ pdf_url }` 또는 에러
