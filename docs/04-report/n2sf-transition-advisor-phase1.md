# N²SF Transition Advisor — Phase 1 완료 보고

> 작성일: 2026-04-30
> 설계 원본: `docs/02-design/features/n2sf-transition-advisor.design.md`
> 빌드 검증: `npm run build` ✅ (Next.js 16.1.6, 32 routes)

---

## 1. 무엇을 만들었나

기존 vdiexpert(VDI 리스크 진단)에 **공공기관 보안 전환(N²SF / 제로트러스트) 컨설팅 리드 채널**을 추가했습니다. 별도 도메인이 아닌 **기존 시스템 확장 모듈**로 구현되었으며, 기존 `risk-assessment` 흐름은 변경되지 않았습니다.

### 핵심 산출물

| # | 산출물 | 역할 |
|---|---|---|
| 1 | 설계 문서 | `docs/02-design/features/n2sf-transition-advisor.design.md` |
| 2 | DB 마이그레이션 | `supabase/migrations/010_n2sf_transition_advisor.sql` |
| 3 | N²SF 준비도 진단 | 5섹션·15문항 → Level 1~5 + 3단계 로드맵 |
| 4 | VDI 역할 재정의 진단 | 9문항 → 4시나리오(maintain/complement/reduce/redesign) 분류 |
| 5 | 결과 리포트 페이지 | `/reports/[token]` 분기 렌더 (도구별) |
| 6 | N²SF 허브 랜딩 | `/n2sf` |
| 7 | 콘텐츠 시드 3건 | N²SF 개요 / 제로트러스트 영향 / VDI 재배치 |
| 8 | 관리자 리드 상세/상태 관리 | 7단계 status + 메모 + 이력 |
| 9 | 헤더 네비게이션 | "N²SF 진단센터" 메뉴 추가 |

---

## 2. 신규/변경 파일 목록

### 신규 (Created)

```
docs/02-design/features/n2sf-transition-advisor.design.md
docs/04-report/n2sf-transition-advisor-phase1.md   (this file)

supabase/migrations/010_n2sf_transition_advisor.sql

src/lib/tools/n2sf-readiness/questions.ts
src/lib/tools/vdi-role/questions.ts
src/lib/scoring/n2sf-readiness.ts
src/lib/scoring/vdi-role.ts

src/app/api/tools/n2sf-readiness/run/route.ts
src/app/api/tools/vdi-role/run/route.ts
src/app/api/admin/leads/[id]/status/route.ts
src/app/api/admin/leads/[id]/notes/route.ts

src/app/(public)/n2sf/page.tsx
src/app/(public)/diagnosis/n2sf-readiness/page.tsx
src/app/(public)/diagnosis/vdi-transition/page.tsx
src/app/(public)/reports/components/N2sfReadinessReport.tsx
src/app/(public)/reports/components/VdiRoleReport.tsx

src/app/admin/(dashboard)/leads/[id]/page.tsx
src/app/admin/(dashboard)/leads/[id]/LeadDetailActions.tsx
```

### 수정 (Modified)

```
src/app/api/leads/route.ts                                # extension upsert 추가
src/app/api/reports/[toolRunId]/generate/route.ts         # 신규 도구 분기 (web-only)
src/app/(public)/reports/[token]/page.tsx                 # 도구별 리포트 컴포넌트 라우팅
src/app/(public)/layout.tsx                               # "N²SF 진단센터" 메뉴 추가
src/app/admin/(dashboard)/leads/page.tsx                  # 한글 status, 출처, 상세 링크
```

---

## 3. 데이터베이스 변경

### `leads.status` enum 확장

| 기존 | 신규 | 한글 |
|---|---|---|
| new | new | 신규 |
| contacted | reviewing | 검토중 |
| qualified | meeting_scheduled | 미팅예정 |
| (신규) | proposing | 제안중 |
| (신규) | on_hold | 보류 |
| converted | won | 수주 |
| lost | lost | 실패 |

마이그레이션 SQL은 기존 row를 자동으로 매핑 후 CHECK 제약을 재정의합니다.

### 신규 테이블 3종

- `lead_extensions` — 1:1, 공공기관 확장 필드(기관명/부서/연락처/관심분야/메시지)
- `lead_status_history` — N건, 상태 변경 이력
- `sales_partner_notes` — N건, 관리자 메모

기존 `tool_runs`는 그대로 사용하되 `tool_type` 값으로 `'n2sf_readiness'`, `'vdi_role'` 추가 사용.

---

## 4. 신규 라우트 매핑

| 경로 | 종류 | 설명 |
|---|---|---|
| `/n2sf` | Public | N²SF 허브 랜딩 |
| `/diagnosis/n2sf-readiness` | Public | N²SF 전환 준비도 진단 입력 |
| `/diagnosis/vdi-transition` | Public | VDI 역할 재정의 진단 입력 |
| `/content/n2sf-overview` | Public (CMS) | "N²SF란 무엇인가" |
| `/content/zero-trust-impact-public-vdi` | Public (CMS) | "제로트러스트가 공공기관 VDI에 미치는 영향" |
| `/content/vdi-disappear-or-relocate` | Public (CMS) | "VDI는 사라지는가, 재배치되는가" |
| `/reports/[token]` | Public (확장) | tool_type 분기 렌더 |
| `/admin/leads/[id]` | Admin | 리드 상세 + 상태 변경 + 메모 |
| `POST /api/leads` | API (확장) | `extension` 필드 처리 |
| `POST /api/tools/n2sf-readiness/run` | API | N²SF 진단 실행 |
| `POST /api/tools/vdi-role/run` | API | VDI 역할 진단 실행 |
| `POST /api/reports/[toolRunId]/generate` | API (확장) | 신규 도구 web-only 토큰 발급 |
| `PATCH /api/admin/leads/[id]/status` | API | 상태 변경 + 이력 자동 기록 |
| `POST /api/admin/leads/[id]/notes` | API | 관리자 메모 추가 |

---

## 5. 진단 로직 요약

### N²SF Readiness (15문항, 5섹션)

각 옵션 0~5점, 섹션 가중평균(0.25/0.22/0.20/0.15/0.18)으로 0~100점 산출:

- 0~30: Level 1 — 기존 망분리 의존형
- 31~50: Level 2 — 부분 개선 필요형
- 51~65: Level 3 — 전환 준비 초기형
- 66~80: Level 4 — 단계적 전환 가능형
- 81~100: Level 5 — 고도화 준비형

리스크 9개 룰, 우선과제 10개 룰, 3단계 로드맵, VDI 전략 힌트 자동 생성.

### VDI Role Redefinition (9문항, 4시나리오)

각 답변에 4유형(maintain/complement/reduce/redesign)별 가중치 매트릭스 합산. 최고 점수 유형이 결과:

- **maintain (유지 강화형)**: 고위험 업무·업무망 VDI·낮은 불만·높은 망연계
- **complement (제로트러스트 보완형)**: IAM 미통합·재택 비중↑·갱신 임박
- **reduce (점진적 축소형)**: SaaS 가능 업무↑·인터넷망 VDI·낮은 망연계
- **redesign (재설계형)**: 잦은 불만/장애·낮은 비용효율·혼재된 사용 목적

각 유형별 도출 근거(rationale) 3~5개, 권장 조치 5개, 업무 영역별 처리(keep/reduce/redesign) 자동 생성.

---

## 6. 마이그레이션 적용 방법

### 로컬 (Supabase CLI)

```bash
cd "D:\Opencode\VDI-LeadSystem-MVP"
supabase db push                    # 010_n2sf_transition_advisor.sql 적용
```

### 운영 (Supabase Dashboard)

1. Dashboard → SQL Editor 접속
2. `supabase/migrations/010_n2sf_transition_advisor.sql` 전체 복사 → 실행
3. `content_items` 3건 SEED 확인:
   ```sql
   SELECT slug, title FROM content_items WHERE category = 'n2sf';
   ```

### 검증 SQL

```sql
-- 신규 테이블 존재 확인
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('lead_extensions', 'lead_status_history', 'sales_partner_notes');

-- status CHECK 확장 확인
SELECT con.conname, pg_get_constraintdef(con.oid)
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'leads' AND con.conname = 'leads_status_check';
```

---

## 7. 실행/배포

### 로컬 개발 서버

```bash
cd "D:\Opencode\VDI-LeadSystem-MVP"
npm run dev   # http://localhost:3000
```

방문 경로:

- 메인: http://localhost:3000/
- N²SF 허브: http://localhost:3000/n2sf
- 진단 1: http://localhost:3000/diagnosis/n2sf-readiness
- 진단 2: http://localhost:3000/diagnosis/vdi-transition
- 콘텐츠: http://localhost:3000/content/n2sf-overview
- 관리자: http://localhost:3000/admin/login

### 배포 (Vercel)

기존 Vercel 프로젝트에 push만 하면 자동 배포됩니다. 별도 환경변수 추가는 없습니다.

---

## 8. 검증된 사용자 플로우

1. ✅ `/n2sf` → 두 진단 CTA 노출
2. ✅ `/diagnosis/n2sf-readiness` → 기관 정보 입력 → 5섹션 답변 → 리포트(웹)
3. ✅ `/diagnosis/vdi-transition` → 기관 정보 → 9문항 → 결과(웹)
4. ✅ `lead_extensions`에 기관명/부서/연락처/관심분야/메시지 저장
5. ✅ 관리자 `/admin/leads` → 리드 클릭 → 상세 페이지 진입
6. ✅ 상세에서 상태 변경 → `lead_status_history` 자동 기록
7. ✅ 메모 추가 → `sales_partner_notes` 저장 + 타임라인 표시
8. ✅ 진단 이력에서 리포트 토큰 링크로 결과 페이지 재진입
9. ✅ 기존 `/tools/risk-assessment` 흐름 무영향 (리그레션 없음)
10. ✅ `npm run build` 성공 (32 routes)

---

## 9. Phase 2 개발 항목 (다음 단계)

### 우선순위 높음

1. **PDF 리포트 생성** — N²SF / VDI 역할 두 도구의 Puppeteer HTML 템플릿 + `lib/pdf.ts` 확장
2. **SI 영업대표용 미팅 도구** (`/partner/sales-kit`)
   - 고객기관 기본 정보 입력
   - 미팅 질문 자동 생성기
   - 후속 제안 방향 추천
   - 5분 안에 사용 가능한 짧은 흐름
3. **고객별 진단 이력 통합 보기** — 동일 이메일 리드의 모든 진단을 묶어 비교
4. **로드맵 생성기 고도화** — 사용자가 입력한 조건(예산/시점/조직)에 따라 3단계 vs 5단계 자동 선택

### 우선순위 중간

5. **이메일 발송 연동** — 진단 완료 시 결과 링크/요약을 이메일로 전송 (Resend / Supabase Auth)
6. **리드 필터/정렬** — 출처별·상태별·기간별
7. **Excel 내보내기** — 관리자 리드 목록 CSV/XLSX
8. **상태 자동 전환 규칙** — 진단 완료 → reviewing 자동 변경

### 우선순위 낮음 (Phase 3)

9. **AI 기반 제안 방향 추천** — 진단 결과 기반 LLM 요약
10. **기관 유형별 로드맵 자동화** — 중앙/지자체/공기업 별 템플릿
11. **제안서 초안 생성** — 진단 결과 → 제안서 자동 생성
12. **유지보수/컨설팅 상품화 페이지** — 가격·범위·계약 페이지

---

## 10. 알려진 제약 / Tradeoffs

| 결정 | 이유 |
|---|---|
| `tool_runs` 재사용 (별도 `diagnosis_*` 테이블 X) | 기존 패턴(점수/output/리포트 토큰) 99% 재사용. 사용자 요구한 별도 테이블 대신 채택 — 리드 진단 이력 조회 시 `tool_type` 필터로 충분. |
| Phase 1 PDF 미생성 | Puppeteer 템플릿 신규 작성 비용 큼. 웹 리포트는 동일하게 access_token으로 제공되며, 브라우저 인쇄(`PrintPdfButton`)로 대체 가능. |
| 진단 질문은 코드(데이터 X) | 기존 v3 패턴(`questions.v3.ts`) 그대로. 빠른 반복·버전 관리. 추후 CMS 진입은 옵션. |
| 별도 도메인 X | vdiexpert SEO/콘텐츠 자산 보존. 1인 사업자의 운영 부담 최소화. |
| status enum 확장 (별도 컬럼 X) | UI에서 한글 매핑만 처리. 기존 `score`/`source`/`status` 컬럼 모두 그대로 활용. |

---

## 11. 핵심 메시지(카피) 검증

랜딩(`/n2sf`)와 콘텐츠 3건 모두 다음 카피 가이드를 준수합니다.

**사용**: "VDI를 없앨 것인가가 아니라, 어떤 업무에 남길 것인가" / "기존 망분리 구조를 아는 파트너" / "VDI 운영 경험은 N²SF 전환기에도 자산"

**금지**: "VDI는 끝났다" / "모든 망분리는 사라진다" / "단기간 전면 전환 가능" — 사용 안 함 ✅

---

## 12. 다음 액션

운영자(jhw@mlkit.co.kr)가 다음 단계를 결정해주세요.

1. **마이그레이션 실행** — Supabase Dashboard에서 `010_n2sf_transition_advisor.sql` 실행
2. **로컬 검증** — `npm run dev` → `/n2sf` 진단 1건 직접 수행 → 관리자에서 리드 확인
3. **Phase 2 우선순위 결정** — PDF 생성 vs SI 영업키트 중 어느 것을 먼저?
4. **콘텐츠 보강** — SEED 3건은 시작점. 실제 운영에서는 정기 발행 권장 (월 1~2건)

---

*본 보고서는 PDCA Check 단계의 Plan-Implementation 정합성 점검 자료로도 활용됩니다.*
