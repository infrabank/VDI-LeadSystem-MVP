# PDCA DO — VDI-LeadSystem-MVP
버전: v0.1
기준일: 2026-02-27

## 0. 구현 원칙
- "동작하는 최소" 우선: CMS → Public → Lead → Tool → Report(PDF)
- 외부 서비스 최소화: Supabase + Next.js만으로 MVP 완주
- AI 기능은 보류(메타 자동 생성은 2차)

## 1. 작업 분해(Task Breakdown)
### Phase 1 — 프로젝트/인프라
1) Next.js(App Router, TS) 초기화
2) Supabase 프로젝트 생성 + env 연결
3) Supabase migrations 작성
4) Admin Auth 구성(이메일/패스워드)

### Phase 2 — CMS(Admin)
5) /admin/login 구현
6) /admin/content list/new/edit 구현
7) content CRUD API 구현(서버에서 service role 사용)
8) 이미지 업로드(Supabase Storage)

### Phase 3 — Public 콘텐츠
9) /content 리스트/검색(FTS)
10) /content/[slug] 상세 렌더(마크다운)
11) 관련 콘텐츠(태그 기반)
12) SEO 메타 + 업데이트 날짜 표시

### Phase 4 — Lead + Tool
13) 리드 폼(/tools 진입 전 또는 결과 PDF 생성 전)
14) risk-assessment 입력 폼
15) /api/tools/risk-assessment/run: score + risks 생성
16) /reports/[token] 웹 리포트 페이지

### Phase 5 — PDF
17) /api/reports/[toolRunId]/generate: HTML 렌더 → PDF 생성
18) Storage 업로드 + pdf_url 저장
19) 웹리포트에서 PDF 다운로드 링크 제공

## 2. 폴더 구조(권장)
- /app
  - /(public)
    - page.tsx
    - content/page.tsx
    - content/[slug]/page.tsx
    - tools/risk-assessment/page.tsx
    - reports/[token]/page.tsx
  - /admin
    - login/page.tsx
    - content/page.tsx
    - content/new/page.tsx
    - content/[id]/edit/page.tsx
    - leads/page.tsx
  - /api
    - content/route.ts
    - content/[slug]/route.ts
    - leads/route.ts
    - tools/risk-assessment/run/route.ts
    - reports/[toolRunId]/generate/route.ts
    - admin/content/route.ts
    - admin/content/[id]/publish/route.ts
    - admin/leads/route.ts
- /lib
  - supabase-client.ts
  - supabase-admin.ts
  - auth.ts
  - scoring/risk-assessment.ts
- /templates/reports
  - risk-assessment.html
  - risk-assessment.css
- /supabase/migrations
- /docs

## 3. 구현 체크포인트(Definition of Done)
- Admin이 콘텐츠를 draft→published로 발행 가능
- Public에서 published 콘텐츠만 노출
- 진단 실행 시 tool_runs 기록 생성
- 리포트 생성 시 reports 레코드 + token 생성
- PDF 생성 성공 + storage 저장 + 링크 접근 가능
- 리포트 링크(token)는 추측 불가능(랜덤)

## 4. 테스트(최소)
- 콘텐츠 CRUD 단위 테스트(또는 간단한 API 스모크)
- risk scoring 입력 케이스 5개(점수/문장 기대값)
- PDF 생성 1개 케이스(로컬/스테이징)

## 5. 롤백/장애 대비(최소)
- PDF 생성 실패 시: reports에 pdf_url null로 저장하고 재시도 버튼 제공
- Storage 업로드 실패 시: 에러 로깅 + 재시도
