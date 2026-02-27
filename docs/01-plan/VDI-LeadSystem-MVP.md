# PDCA PLAN — VDI-LeadSystem-MVP
버전: v0.1  
기준일: 2026-02-27  
목표: “VDI 전문성”을 광고가 아니라 **AI/검색/평가 프로세스가 인용하는 구조**로 고정하고, **CMS → 진단 → 리포트(PDF) → 리드**까지 최소 기능으로 end-to-end 연결한다.

## 1. 문제 정의
- 단순 홈페이지/블로그는 “전문성 증명”이 아니라 “자기 주장”으로 인식되어 전환이 낮다.
- 지속 고객 확보에는 (1) 구조화된 기술 자산 축적 (2) 반복 노출 (3) 리드 전환 장치 (4) 후속 관리 자동화가 필요하다.
- MVP는 ‘대규모 자동화’가 아니라 **운영자가 매일 콘텐츠를 발행할 수 있는 CMS**와 **진단 기반 리드 획득 흐름**을 만든다.

## 2. 성공 기준(KPI)
- 콘텐츠 운영: 운영자가 CMS에서 10분 내 게시물 1개 발행 가능
- 리드 전환: 진단 완료 대비 이메일 제출 전환율(초기 목표 5~15% 범위, 실제 측정 기반 조정)
- 산출물: 진단 결과 PDF 자동 생성(스토리지 저장 + 링크 제공)
- 기술 신뢰: FAQ/체크리스트 포함 콘텐츠 비중 50% 이상

## 3. MVP 범위(포함)
### Public
- 콘텐츠 리스트/검색/상세 (published만 노출)
- 진단 도구 1개: “VDI 마이그레이션/운영 리스크 진단”(설문형)
- 리드 폼(이메일 필수 + 동의)
- 진단 결과 웹 리포트 + PDF 생성

### Admin(CMS)
- Admin 로그인
- 콘텐츠 CRUD(type, tags, category, md body, status, published_at)
- 커버 이미지 업로드
- 리드 리스트(기본 조회)

## 4. MVP 범위(제외/보류)
- 다중 도구(복수 계산기)
- 고급 승인 워크플로(Reviewer/approval)
- 외부 CRM 연동(n8n/Slack/HubSpot 등)
- 유료 결제/구독
- 자동 제안서/견적서 생성(추후)

## 5. 사용자 여정(핵심)
1) Visitor가 검색으로 콘텐츠 유입
2) 상세 페이지 CTA 클릭 → 진단 페이지 이동
3) 진단 입력 → 결과 웹리포트 확인
4) PDF 생성 및 다운로드(이메일/리드 생성)
5) Admin이 리드 확인 후 상담/제안 진행

## 6. 위험요인/대응
- SEO는 3~6개월 지연: 초기엔 “진단 도구”와 “케이스/체크리스트”로 직접 유입 경로 확보
- AI 생성 텍스트 환각: MVP에서는 AI를 “메타/FAQ 후보/구조화 보조”로 제한하고 발행 전 사람이 검수
- 개인정보: 최소 수집(이메일), 동의 필수, 리포트 URL 토큰화

## 7. 결정을 고정(Decision Log)
- 스택: Next.js(App Router) + Supabase(Postgres/Auth/Storage)
- CMS: 외부 헤드리스 CMS 도입 보류(내장 Admin으로 시작)
- 검색: Postgres FTS로 시작
- PDF: 서버 사이드 HTML 템플릿 → PDF 렌더링(Playwright/Puppeteer 중 1개 선택)

## 8. 산출물/리포 구조
- /docs
  - system-design.md
  - mvp-spec.md
  - pdca/VDI-LeadSystem-MVP/plan.md (bkit 생성/관리)
  - pdca/VDI-LeadSystem-MVP/design.md
  - pdca/VDI-LeadSystem-MVP/do.md
- /app (Next.js)
- /supabase (migrations)
- /templates/reports (HTML/CSS)
- /lib (db, auth, scoring rules)
