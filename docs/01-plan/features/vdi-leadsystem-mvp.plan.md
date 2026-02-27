# Plan: VDI-LeadSystem-MVP

- **Feature**: VDI-LeadSystem-MVP (전체 MVP)
- **Date**: 2026-02-27
- **Status**: Draft
- **Source**: docs/01-plan/VDI-LeadSystem-MVP.md

---

## 1. Objectives

"VDI 전문성"을 광고가 아니라 AI/검색/평가 프로세스가 인용하는 구조로 고정하고,
**CMS → 진단 → 리포트(PDF) → 리드**까지 최소 기능으로 end-to-end 연결한다.

### 문제 정의
- 단순 홈페이지/블로그는 "전문성 증명"이 아니라 "자기 주장"으로 인식 → 전환 낮음
- 지속 고객 확보에 필요: 구조화된 기술 자산 축적 / 반복 노출 / 리드 전환 장치 / 후속 관리 자동화
- MVP는 **운영자가 매일 콘텐츠를 발행할 수 있는 CMS**와 **진단 기반 리드 획득 흐름** 구축

## 2. Scope

### In Scope (Public)
- [x] 콘텐츠 리스트/검색/상세 (published만 노출, Postgres FTS)
- [ ] 진단 도구 1개: "VDI 마이그레이션/운영 리스크 진단" (설문형)
- [ ] 리드 폼 (이메일 필수 + 동의)
- [ ] 진단 결과 웹 리포트 + PDF 생성

### In Scope (Admin CMS)
- [ ] Admin 로그인 (Supabase Auth)
- [ ] 콘텐츠 CRUD (type, tags, category, md body, status, published_at)
- [ ] 커버 이미지 업로드 (Supabase Storage)
- [ ] 리드 리스트 (기본 조회)

### Out of Scope
- 다중 도구 (복수 계산기)
- 고급 승인 워크플로 (Reviewer/approval)
- 외부 CRM 연동 (n8n/Slack/HubSpot)
- 유료 결제/구독
- 자동 제안서/견적서 생성

## 3. Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Admin이 CMS에서 10분 내 게시물 1개 발행 가능 | Must |
| FR-02 | 콘텐츠 리스트/검색/상세 (published만 Public 노출) | Must |
| FR-03 | Postgres FTS 기반 콘텐츠 검색 | Must |
| FR-04 | 진단 도구: 설문형 VDI 마이그레이션/운영 리스크 진단 | Must |
| FR-05 | 진단 결과 웹 리포트 확인 | Must |
| FR-06 | 진단 결과 PDF 자동 생성 (스토리지 저장 + 링크 제공) | Must |
| FR-07 | 리드 폼: 이메일 필수 + 동의 체크 | Must |
| FR-08 | Admin 리드 리스트 조회 | Must |
| FR-09 | 커버 이미지 업로드 (Supabase Storage) | Should |
| FR-10 | FAQ/체크리스트 포함 콘텐츠 비중 50% 이상 지원 | Should |

### Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | 리드 전환율 | 진단 완료 대비 이메일 제출 5~15% |
| NFR-02 | 개인정보 | 최소 수집(이메일), 동의 필수, 리포트 URL 토큰화 |
| NFR-03 | AI 활용 범위 | 메타/FAQ 후보/구조화 보조로 제한, 발행 전 사람 검수 |

## 4. User Journey

1. Visitor가 검색으로 콘텐츠 유입
2. 상세 페이지 CTA 클릭 → 진단 페이지 이동
3. 진단 입력 → 결과 웹 리포트 확인
4. PDF 생성 및 다운로드 (이메일/리드 생성)
5. Admin이 리드 확인 후 상담/제안 진행

## 5. Technical Decisions

- 스택: Next.js (App Router) + Supabase (Postgres/Auth/Storage)
- CMS: 외부 헤드리스 CMS 도입 보류 → 내장 Admin으로 시작
- 검색: Postgres FTS로 시작
- PDF: 서버 사이드 HTML 템플릿 → PDF 렌더링 (Playwright 또는 Puppeteer)

## 6. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| SEO는 3~6개월 지연 | 중 | 초기엔 진단 도구 + 케이스/체크리스트로 직접 유입 경로 확보 |
| AI 생성 텍스트 환각 | 중 | AI를 보조로 제한, 발행 전 사람 검수 |
| 개인정보 리스크 | 높 | 최소 수집, 동의 필수, URL 토큰화 |

## 7. Implementation Phases

| Phase | Description |
|-------|-------------|
| Phase 1 | Auth + Admin 레이아웃 + CMS (콘텐츠 CRUD) |
| Phase 2 | Public 콘텐츠 (리스트/검색/상세) |
| Phase 3 | 진단 도구 + 스코어링 로직 |
| Phase 4 | 리드 폼 + PDF 생성 + 리포트 |

## 8. Success Criteria (KPI)

- [ ] 운영자가 CMS에서 10분 내 게시물 1개 발행 가능
- [ ] 진단 완료 대비 이메일 제출 전환율 측정 가능
- [ ] 진단 결과 PDF 자동 생성 동작
- [ ] FAQ/체크리스트 포함 콘텐츠 타입 지원
- [ ] 프로덕션 빌드 에러 0
