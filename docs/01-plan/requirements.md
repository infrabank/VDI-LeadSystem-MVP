# VDI-LeadSystem-MVP Requirements

## Project Overview
VDI 전문성을 구조화된 콘텐츠 + 진단 도구로 증명하고, 리드 전환까지 연결하는 MVP 시스템.

**핵심 흐름**: CMS → 콘텐츠 발행 → 검색 유입 → 진단 도구 → PDF 리포트 → 리드 획득

## Tech Stack
- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Backend/BaaS**: Supabase (PostgreSQL, Auth, Storage)
- **Search**: PostgreSQL Full-Text Search (FTS)
- **PDF**: 서버 사이드 HTML 템플릿 → Playwright/Puppeteer 렌더링
- **Package Manager**: npm

## KPI
- 콘텐츠 운영: CMS에서 10분 내 게시물 1개 발행
- 리드 전환: 진단 완료 대비 이메일 제출 전환율 5~15%
- 산출물: 진단 결과 PDF 자동 생성
- 콘텐츠 품질: FAQ/체크리스트 포함 비중 50% 이상

## Decision Log
- CMS: 외부 헤드리스 CMS 보류 → 내장 Admin
- 검색: Postgres FTS로 시작
- PDF: 서버 사이드 HTML → PDF (Playwright or Puppeteer)
- AI: 메타/FAQ/구조화 보조로만 제한, 발행 전 사람 검수
- 개인정보: 최소 수집(이메일), 동의 필수, 리포트 URL 토큰화
