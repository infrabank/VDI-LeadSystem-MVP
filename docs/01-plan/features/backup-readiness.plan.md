# Plan — 백업·사이버복원력 자가 진단 도구

> Phase 2.1 / 데이터 보호 Practice의 첫 lead-gen 도구
> 작성: 2026-05-01

## 비즈니스 의도

**목표**: 공공·연구·민간 기관의 백업·복원력 성숙도를 7분 안에 자가 진단하게 만들어 데이터 보호 Practice (Acronis Powered) 의 lead-gen 진입점을 확보한다.

**Why now**:
- 현 `/practices/data-protection` 페이지에 "Coming Soon" placeholder만 있어 lead 전환 경로 없음
- 기존 N²SF 진단(보안 워크스페이스)은 lead 생성 검증된 반면, 데이터 보호는 0건
- 공공·연구기관 11개 운영 중인데, 이들 대부분이 백업·DR 영역에서 추가 컨설팅 수요 보유

**KPI**:
- 진단 완료율 ≥ 60% (현 N²SF 정렬 진단 수준)
- 진단 → email 제출 전환율 ≥ 10%
- 1주일 내 첫 5건 lead 확보

## 사용자

### Primary Persona — 공공·연구기관 IT 운영팀장
- 백업 운영 중이지만 정책·범위가 정합한지 불안
- 랜섬웨어 사고 뉴스로 경영진 우려 증가, "우리는 안전한가?" 답변 필요
- 30분 미팅이 부담 → 7분 자가 진단으로 객관 점수 받고 싶음

### Secondary Persona — 정보보안 책임자(CISO/CSO)
- 백업·DR 정책 수립 중, 외부 표준·체크리스트 필요
- 경영진 보고용 PDF 리포트 필요

## 핵심 가치 제안

| 사용자 가치 | Myloket 가치 |
|---|---|
| 7분 만에 백업·복원력 객관 점수 (Level 1~5) | Lead 자동 확보 (email upsert) |
| Acronis Cyber Protect 도입 시나리오 권고 | Practice 차별화 (보안 워크스페이스 ↔ 데이터 보호 양축) |
| 무료 PDF 리포트 (경영진 보고용) | 영업·기술 미팅 진입점 |

## 진단 영역 (개요 — Design 문서에서 상세)

7개 영역으로 백업·사이버복원력 전반을 커버:

1. 백업 적용 범위 (Scope)
2. 백업 주기·정책 (Policy)
3. 랜섬웨어 보호 (Ransomware)
4. 복구 검증 (Recovery Validation)
5. RTO/RPO 정의 (Service Level)
6. DR/페일오버 (Disaster Recovery)
7. 백업 보안 (Security & Access)

## 산출물

| 항목 | 위치 |
|---|---|
| 진단 폼 | `/tools/backup-readiness` |
| 웹 리포트 | `/reports/backup-readiness/[token]` |
| PDF 리포트 | Storage 업로드 후 access_token URL |
| Lead 자동 등록 | leads.source = `backup-readiness` |

## 제약·결정

- **AI 사용 금지** — 룰 기반 스코어링 (기존 진단 도구와 일관성)
- **DB 변경 최소** — `tool_runs.tool_type` enum에 `backup_readiness` 1줄 추가만
- **PDF는 best-effort** — Puppeteer 실패 시 pdf_url null 저장, 웹 리포트는 항상 제공 (기존 정책 준수)
- **개인정보 보호** — Lead 정보는 admin client (RLS bypass), 리포트는 access_token 기반 접근

## 의존성

- 기존 패턴 100% 재사용:
  - `src/lib/scoring/n2sf-readiness.ts` — 가장 유사한 구조 (영역별 가중·합산)
  - `src/app/api/tools/n2sf-readiness/run/route.ts` — API 패턴
  - `src/templates/reports/risk-assessment-v4.html` — PDF 템플릿 패턴
  - `src/app/(public)/tools/n2sf-readiness/page.tsx` — 멀티스텝 폼
  - `src/app/(public)/reports/components/N2sfReadinessReport.tsx` — 리포트 컴포넌트

## Out of Scope

- 백업 ROI 계산기 (Phase 2.2 별도)
- RTO/RPO 결정 인터랙티브 가이드 (Phase 2.4)
- 영문 i18n
- 기관 익명 비교 (anonymous benchmarking)
- 답변 자동 저장(autosave) — MVP는 단일 세션

## 일정 추정

전체 ≈ 1.5일 (12단계 PDCA)
- Plan + Design: 30분
- Schema + Scoring: 2시간
- API + PDF + 폼 UI + 리포트: 6시간 (executor 위임 가능 영역 多)
- 통합 + 빌드 검증: 1시간
- 커밋·배포: 30분
