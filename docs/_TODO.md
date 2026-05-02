# 작업 대기 항목 (User TODO)

> Phase 2 완료 후 사용자가 직접 채워야 하는 정보·콘텐츠 목록
> 코드 변경은 필요 없음 — 모두 데이터 입력만 하면 자동 노출

---

## 1. Leadership 정보 입력

**위치**: `src/lib/site-config.ts:leadership` 배열 (4슬롯)

### 슬롯별 채울 필드

각 슬롯에 아래 필드 추가:

```ts
{
  slot: "ceo",                              // 그대로 유지
  role: "CEO · Founder",                    // 필요 시 수정
  name: "홍길동",                           // ← 추가
  bio: "20년 보안 컨설팅 경력...",          // ← 추가 (1~2 문장)
  photoFile: "ceo.jpg",                     // ← 추가 + /public/team/ceo.jpg 업로드
  expertise: ["기업 보안 전략", ...],       // 이미 있음, 필요시 수정
  email: "ceo@mlkit.co.kr",                 // ← 선택
  linkedinUrl: "https://linkedin.com/in/..." // ← 선택
}
```

### 4개 슬롯
- [ ] **vdi-lead** — VDI 딜리버리 책임 (Citrix·VMware·Omnissa·DaaS)
- [ ] **mfa-lead** — MFA·접근통제 책임 (Microsoft Entra·라온시큐어·Zero Trust)
- [ ] **data-protection-lead** — 백업·EDR 책임 (Acronis·DR/BCP)
- [ ] **integration-lead** — 융합 솔루션 설계 책임 (통합 아키텍처·TCO·MSP)

### 사진 업로드
- [ ] `/public/team/vdi-lead.jpg` (400×400 정사각형, ≤200KB)
- [ ] `/public/team/mfa-lead.jpg`
- [ ] `/public/team/data-protection-lead.jpg`
- [ ] `/public/team/integration-lead.jpg`

> 사진 미준비 시 자동으로 이니셜 placeholder 표시.

---

## 2. Case Studies 콘텐츠 작성

**위치**: `/case-studies` 페이지 (현재 빈 상태 placeholder 표시 중)

**목표**: 운영 11곳 중 외부 공개 동의받은 기관부터 사례 추가

### 작성 방법 2가지

#### A. 관리자 CMS로 작성 (권장)
1. `/admin/login` → 콘텐츠 작성
2. **Type**: `Case Study` 선택
3. 제목·요약·본문(마크다운)·태그·커버 이미지 업로드
4. 발행 → `/case-studies` 자동 노출

#### B. SQL 직접 INSERT
`supabase/migrations/`에 신규 파일 생성:
```sql
INSERT INTO content_items (type, slug, title, excerpt, body_md, tags, category, status, published_at)
VALUES (
  'case',
  'kisti-vdi-modernization',  -- URL slug
  'KISTI VDI 운영 효율화 — 사례 연구',
  '한 줄 요약',
  $md$# 본문
  ## 도전 과제
  ## 해결 방법
  ## 결과
  $md$,
  ARRAY['kisti', 'vdi', 'public-research'],
  'case-study',  -- 또는 'data-protection', 'secure-workspace'
  'published',
  now()
);
```

### 우선 작성 권장 사례 (5건)

운영 고객사 중 공개 동의받은 곳부터:

- [ ] **KISTI** (한국과학기술정보연구원) — 정부 출연 연구기관 VDI 운영
- [ ] **MODS** (국가데이터처) — SDC 통계데이터센터 VDI 서비스 운영
- [ ] **MPM** (인사혁신처) — Citrix Virtual Desktop 운영
- [ ] **KRIHS** (국토연구원) — VDI + AD 백업 정책 적용
- [ ] **SFD** (세종소방) — 신규 도입 사례

### 사례 작성 시 권장 구조

```
1. 도전 과제 (기관이 안고 있던 문제)
2. 해결 접근 (Myloket이 적용한 방법)
3. 결과·효과 (정량 가능하면 숫자)
4. 적용 기술 (VMware/Citrix/Acronis 등)
5. 고객 코멘트 (선택)
```

> 외부 공개 전 각 기관 보안담당자 동의 확인 필수.

---

## 3. 운영 자동화·체크리스트

### 외부 자산
- [ ] 파트너 로고 SVG 4종 업로드 (`public/partners/`)
  - vmware.svg / omnissa.svg / citrix.svg / acronis.svg
  - 각 벤더 brand portal에서 다운로드 (자세한 가이드: `public/partners/README.md`)

### Supabase
- [ ] 마이그레이션 011·012 적용 확인 (Dashboard SQL Editor 또는 `supabase db push`)
- [ ] 신규 마이그레이션 추가 시 같은 흐름

### 보안
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 회전 + Vercel Sensitive 등록 (Production·Preview만)
- [ ] Local `.env.local` 새 키로 갱신

### 발행 전 동의 확인
- [ ] 운영 고객사 11곳 중 사이트 표기 동의 확인
- [ ] 미동의 기관은 `site-config.ts:customers`에서 익명화 또는 제거

---

## 진행 추적

이 파일을 직접 편집해서 `[ ]` → `[x]`로 체크 표시하시면 됩니다.
완료된 항목은 다음 PDCA 사이클에서 `docs/04-report/`로 이전됩니다.
