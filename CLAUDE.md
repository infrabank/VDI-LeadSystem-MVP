# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VDI Lead Management System MVP — 구조화된 기술 콘텐츠(CMS) + 진단 도구 + PDF 리포트를 통해 리드를 획득하는 시스템.

**핵심 흐름**: 콘텐츠 발행 → 검색 유입 → 진단 도구 → 웹 리포트 + PDF → 리드 획득

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Backend/BaaS**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Search**: PostgreSQL Full-Text Search
- **PDF**: Puppeteer (server-side HTML template rendering)
- **Package Manager**: npm

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (flat config)
```

## Architecture

```
src/
├── app/
│   ├── layout.tsx                          # Root layout (html/body)
│   ├── globals.css                         # Tailwind v4 global styles
│   ├── middleware.ts                       # Supabase session management
│   ├── (public)/                           # Public route group
│   │   ├── layout.tsx                      # Public header/footer
│   │   ├── page.tsx                        # / (홈)
│   │   ├── content/page.tsx                # 콘텐츠 리스트 + FTS 검색
│   │   ├── content/[slug]/page.tsx         # 콘텐츠 상세 (markdown + FAQ + JSON-LD)
│   │   ├── tools/risk-assessment/page.tsx  # 진단 입력 (2-step: 리드 → 진단)
│   │   ├── reports/[token]/page.tsx        # 웹 리포트 뷰 + PDF 다운로드
│   │   └── thank-you/page.tsx
│   ├── admin/
│   │   ├── layout.tsx                      # Passthrough (no auth)
│   │   ├── login/page.tsx                  # Admin 로그인
│   │   ├── components/AdminNav.tsx         # Admin 네비게이션
│   │   └── (dashboard)/                    # Protected route group
│   │       ├── layout.tsx                  # Auth check + AdminNav
│   │       ├── content/page.tsx            # 콘텐츠 목록
│   │       ├── content/new/page.tsx        # 콘텐츠 작성
│   │       ├── content/[id]/edit/page.tsx  # 콘텐츠 편집 + 발행/삭제
│   │       ├── content/components/ContentForm.tsx
│   │       └── leads/page.tsx              # 리드 목록
│   └── api/
│       ├── content/route.ts                # GET 콘텐츠 검색/필터
│       ├── content/[slug]/route.ts         # GET 콘텐츠 상세
│       ├── leads/route.ts                  # POST 리드 upsert (admin client)
│       ├── tools/risk-assessment/run/route.ts  # POST 진단 실행 + 스코어링
│       ├── reports/[toolRunId]/generate/route.ts  # POST PDF 생성 + Storage
│       └── admin/
│           ├── content/route.ts            # POST 콘텐츠 생성
│           ├── content/[id]/route.ts       # PUT/DELETE 콘텐츠
│           ├── content/[id]/publish/route.ts  # POST 발행
│           ├── leads/route.ts              # GET 리드 목록
│           └── upload/route.ts             # POST 이미지 업로드
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       # Browser client (createBrowserClient)
│   │   ├── server.ts                       # Server Component client
│   │   ├── admin.ts                        # Service role client (bypasses RLS)
│   │   └── middleware.ts                   # Session refresh
│   ├── auth.ts                             # getSession(), requireAdmin()
│   ├── markdown.ts                         # remark + remark-html renderer
│   ├── pdf.ts                              # renderReportHtml() + generatePdf() via Puppeteer
│   └── scoring/
│       └── risk-assessment.ts              # Rule-based scoring engine (0~100)
└── templates/
    └── reports/
        └── risk-assessment.html            # PDF HTML template with {{placeholders}}
```

## Database Tables (Supabase)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| content_items | CMS 콘텐츠 | type, slug, body_md, tags, faq_json, FTS |
| leads | 리드 | email (UNIQUE/upsert), name, company, score |
| tool_runs | 진단 실행 | tool_type, input_json, output_json, score |
| reports | 리포트 | report_html, pdf_url, access_token (토큰 접근) |

Migration files: `supabase/migrations/001-006`

## Key Conventions

- Path alias `@/*` → `./src/*`
- TypeScript strict mode
- ESLint flat config: `core-web-vitals` + `typescript`
- Tailwind CSS v4 (PostCSS plugin)
- Public 콘텐츠: `status = 'published'`만 노출 (RLS)
- 리포트 접근: URL `access_token` 기반 (개인정보 보호)
- Admin 인증: Supabase Auth, (dashboard) route group에서 requireAdmin()
- 리드 생성: email 기반 upsert, admin client (service role) 사용
- 진단 스코어링: 룰 기반 (AI 사용 금지), 점수 0~100 clamp
- SEO: JSON-LD (Article + FAQPage), 최종 업데이트 날짜 표시
- PDF 실패 시: pdf_url null로 저장, 웹 리포트는 항상 제공

## Supabase Client Usage

- **Client Components**: `@/lib/supabase/client` (browser)
- **Server Components / Route Handlers**: `@/lib/supabase/server` (cookie-based)
- **Admin operations (bypass RLS)**: `@/lib/supabase/admin` (service role)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

## PDCA Documents

```
docs/
├── 01-plan/VDI-LeadSystem-MVP.md                  # Master plan (source of truth)
├── 01-plan/features/vdi-leadsystem-mvp.do.md       # Implementation task breakdown
├── 02-design/features/vdi-leadsystem-mvp.design.md # Full design spec
├── 02-design/data-model.md                         # DB schema + RLS + FTS
├── 02-design/api-spec.md                           # API routes
├── 03-analysis/                                    # Gap analysis
└── 04-report/                                      # Completion reports
```
