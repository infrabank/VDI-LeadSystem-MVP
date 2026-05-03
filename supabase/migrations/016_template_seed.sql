-- 016_template_seed.sql
-- 9 산출물 템플릿을 자료실(content_items) 콘텐츠로 발행.
--
-- 정책:
-- - 자료실 콘텐츠 = 템플릿 안내 + PDF 다운로드 유도 (트래픽 유입·검색 친화)
-- - 본문 마크다운은 PDF에서 받음 (/api/templates/{slug}/download)
-- - slug는 templates.ts와 동일 — /insights/{slug} 와 /api/templates/{slug}/download 연결
-- - 멱등: ON CONFLICT (slug) DO UPDATE — 재실행 안전
--
-- 실행: Supabase Dashboard → SQL Editor에 통째로 paste 후 Run
-- 또는: supabase db push (마이그레이션 자동 실행)

INSERT INTO content_items (
  type, title, slug, status, excerpt, body_md, tags, category,
  seo_title, seo_description, published_at
) VALUES

-- ──────────────────────────────────────────────────────────
-- 1. N²SF 전환 사전진단 체크리스트
-- ──────────────────────────────────────────────────────────
(
  'checklist',
  'N²SF 전환 사전진단 체크리스트 (다운로드)',
  'n2sf-pre-diagnosis-checklist',
  'published',
  '공공·연구·금융 기관의 기존 VDI·망분리 환경을 N²SF 발주 전에 1차 점검하는 자가 워크시트. 30~45분이면 채울 수 있고 그대로 임원·심의위원회 보고에 사용 가능.',
  $tpl_01$> 📥 **PDF 다운로드**: [n2sf-pre-diagnosis-checklist-2026-05-03.pdf](/api/templates/n2sf-pre-diagnosis-checklist/download) — 인쇄 친화적 6쪽

## 이 체크리스트가 다루는 것

- **현재 VDI/망분리 환경 자가확인** — VDI 인프라·망 구성·인증·접근통제·백업·DR
- **C/S/O 예비 분류 워크시트** — 핵심 업무 10~20개를 N²SF 등급으로 분류
- **유지/축소/전환 대상 1차 분류** — 기존 영역별 N²SF 매핑 질문 + 시나리오 4종 ✓ 표기
- **MFA·백업·외부접속 보완 지점** — 시급도 평가 표
- **보안성 검토 대응 체크** — 발주 전 통과 가능성 자가 평가

## 누가 사용하나

공공·연구·금융 기관의 **정보화·정보보호 담당자**. 정식 N²SF 정렬 컨설팅을 받기 *전*에 자가 점검으로 *부족한 자료가 무엇인지* 먼저 파악할 때.

## 사용 시점

- **N²SF 발주·예산 결정 12개월 이내** — 부족 항목 보완 일정 확보
- **VDI 라이선스 갱신 시점이 12개월 이내** — 갱신 vs 전환 결정
- **보안성 검토 위원회 일정 6개월 이내** — 산출물 현황 점검

## 결과를 어떻게 활용하나

1. ❓ 표기가 5개 이상이면 → 외부 1차 진단 의뢰가 시간·비용 합리적
2. ❌ 표기가 3개 이상인 영역 → N²SF 전환 *전* 보완 우선순위
3. 자료가 부족해도 *부족한 그대로* 인터뷰부터 시작 — 완벽한 자료 기다리면 시작 안 됨

## 관련 자료

- [VDI 유지·축소·전환 의사결정 매트릭스](/insights/vdi-decision-matrix) — 본 체크리스트 결과를 시나리오 비교로 펼치는 다음 단계
- [보안성 검토 대응 체크리스트](/insights/security-review-response-checklist) — 발주 RFP 작성 전 점검
- [N²SF 진단센터](/n2sf) — 4종 진단 도구 + 4상품 통합 허브
- [참고 단가 — 5단계 패키지](/practices#pricing) — 무료 진단 → 1주 리포트 → 2주 워크숍 → 4주 RFP → 월간 매니지드

## 의뢰

본 체크리스트의 결과로 1차 진단 인터뷰를 받고 싶다면 — **jhw@mlkit.co.kr** / 평일 1영업일 내 회신.
$tpl_01$,
  ARRAY['n2sf', 'template', 'checklist', 'vdi', 'pre-diagnosis'],
  'n2sf',
  'N²SF 전환 사전진단 체크리스트 — 무료 PDF 다운로드',
  '공공·연구·금융 기관의 기존 VDI·망분리 환경을 N²SF 발주 전에 자가 점검하는 6쪽 워크시트. 현재 환경 자가확인·C/S/O 예비 분류·유지/축소/전환 1차 분류·MFA·백업 보완·보안성 검토 대응 5섹션. 무료 PDF.',
  now()
),

-- ──────────────────────────────────────────────────────────
-- 2. VDI 의사결정 매트릭스
-- ──────────────────────────────────────────────────────────
(
  'comparison',
  'VDI 유지·축소·전환 의사결정 매트릭스 (다운로드)',
  'vdi-decision-matrix',
  'published',
  '1차 진단 결과를 영역별 시나리오 4종(유지·DaaS·고위험 분리·안정화)으로 비교하고, 임원 보고·내부 합의·발주 RFP 작성에 그대로 사용 가능한 1장의 결정문을 도출.',
  $tpl_02$> 📥 **PDF 다운로드**: [vdi-decision-matrix-2026-05-03.pdf](/api/templates/vdi-decision-matrix/download) — 인쇄 친화적 5쪽

## 이 매트릭스가 다루는 것

- **영역별 N²SF 전환 질문 매트릭스** — 인터넷 VDI·업무 VDI(C/S)·망연계·UAG·백업·DaaS·외부 협력사 8영역
- **시나리오 4종 비교** — A 유지+축소 / B DaaS 부분 전환 / C 고위험 분리 / D 운영 안정화
- **시나리오별 영향 비교** — 일정·비용·N²SF 정렬도·운영 변화·5년 TCO 추정·외부 자문 비중
- **5문장 결정문** — 임원 보고·내부 합의 자료에 그대로 사용
- **영역별 1차 결정 요약 표** — 책임자·일정 명시

## 누가 사용하나

사전진단(Stage 0~1)을 마친 후 **시나리오 결정**을 해야 하는 정보화·정보보호 책임자, 사업 PM. 임원 보고에 *근거 있는 1장 결정문*이 필요한 시점.

## 사용 시점

- 사전진단 결과 도출 직후
- N²SF 발주 RFP 작성 전 4~8주
- 임원·심의위원회 보고 안건 자료 준비 시

## 결과를 어떻게 활용하나

1. **임원 보고 1장**: 5문장 결정문 + 영역별 결정 표
2. **RFP 작성 입력**: 영역별 결정이 그대로 RFP 사양으로 변환
3. **예산 협의**: 시나리오별 5년 TCO 추정으로 협상

## 관련 자료

- [N²SF 전환 사전진단 체크리스트](/insights/n2sf-pre-diagnosis-checklist) — 본 매트릭스의 입력 자료
- [전환 로드맵 (4 Phase 산출물)](/insights/transition-roadmap) — 결정 후 일정 펼치기
- [참고 단가 — Stage 2 VDI 역할 재정의 워크숍](/practices#pricing) — 본 매트릭스를 인터뷰로 정밀화

## 의뢰

본 매트릭스 작성·임원 보고 자문이 필요하면 — **jhw@mlkit.co.kr** / 평일 1영업일 내 회신.
$tpl_02$,
  ARRAY['n2sf', 'template', 'comparison', 'vdi', 'decision-matrix'],
  'n2sf',
  'VDI 유지·축소·전환 의사결정 매트릭스 — 무료 PDF',
  '1차 진단 결과를 영역별 시나리오 4종으로 비교하고 1장의 결정문을 도출. 영역별 N²SF 전환 질문·시나리오 비교·5년 TCO 추정·5문장 결정문·다음 단계.',
  now()
),

-- ──────────────────────────────────────────────────────────
-- 3. 보안성 검토 대응 체크리스트
-- ──────────────────────────────────────────────────────────
(
  'checklist',
  '보안성 검토 대응 체크리스트 (다운로드)',
  'security-review-response-checklist',
  'published',
  '발주 전 보안성 검토 위원회 통과 가능성을 자가 평가하고, RFP 반영 문구·FAQ 답안 예시를 함께 정리. 산출물 7종 보유 현황 + 클라우드 적합성 점검 포함.',
  $tpl_03$> 📥 **PDF 다운로드**: [security-review-response-checklist-2026-05-03.pdf](/api/templates/security-review-response-checklist/download) — 인쇄 친화적 6쪽

## 이 체크리스트가 다루는 것

- **정책·근거 자료** 자가 점검 (5항목)
- **절차·운영** 자가 점검 (5항목)
- **산출물 7종 보유 현황** (착수·현황·위험·로드맵·대응표·운영계획·검수)
- **사용자·교육** + **클라우드·DaaS 적합성**(해당 시)
- **RFP 반영 문구 예시 4종** — N²SF 정렬·MFA·백업·산출물 요건
- **보안성 검토 위원회 FAQ 답안 예시 5건** — "왜 망분리 완화하는가" 등

## 누가 사용하나

**N²SF 발주를 6개월 이내 앞둔** 기관의 정보보호 책임자·사업 PM. 위원회 통과 가능성을 *발주 전*에 점검하고 부족한 산출물 보완 우선순위를 정해야 할 때.

## 사용 시점

- 보안성 검토 위원회 일정 6개월 이내
- RFP 작성 전 4~8주
- 위원회 1차 심의 후 보완 요청 받았을 때

## 결과를 어떻게 활용하나

1. **❌·❓가 한 섹션 3개 이상** → 발주 전 보완 필요
2. **산출물 7종 중 보유한 것 3개 이하** → 외부 자문 시간·비용 합리적
3. **FAQ 답안 예시**: 위원회 자주 묻는 질문에 미리 답안 준비
4. **RFP 반영 문구**: 발주 사양서에 보안 요건을 명확히 박아 둬 발주 후 변경 비용 차단

## 관련 자료

- [N²SF 전환 사전진단 체크리스트](/insights/n2sf-pre-diagnosis-checklist) — 본 체크리스트의 입력 자료
- [전환 로드맵](/insights/transition-roadmap) — 산출물 7종을 4 Phase로 작성
- [위험분석서 템플릿](/insights/risk-analysis) — 산출물 7종 중 하나
- [참고 단가 — Stage 3 RFP·보안성 검토 대응 패키지](/practices#pricing) — 4주 산출물 작성 패키지

## 의뢰

산출물 작성 자문·위원회 답안 정리가 필요하면 — **jhw@mlkit.co.kr** / 평일 1영업일 내 회신.
$tpl_03$,
  ARRAY['n2sf', 'template', 'checklist', 'security-review', 'rfp'],
  'n2sf',
  '보안성 검토 대응 체크리스트 — 무료 PDF',
  '발주 전 보안성 검토 위원회 통과 가능성을 자가 평가. 산출물 7종 보유 현황·RFP 반영 문구 예시·위원회 FAQ 답안 예시. 무료 PDF.',
  now()
),

-- ──────────────────────────────────────────────────────────
-- 4. 착수보고서
-- ──────────────────────────────────────────────────────────
(
  'article',
  '착수보고서 템플릿 (다운로드)',
  'project-kickoff-report',
  'published',
  'N²SF 전환·VDI 재정의 사업의 목표·범위·체계·일정·예산을 1장으로 정리하는 표준 착수보고서 양식. 임원 승인·예산 확정·위원회 안건 자료 그대로 사용 가능.',
  $tpl_04$> 📥 **PDF 다운로드**: [project-kickoff-report-2026-05-03.pdf](/api/templates/project-kickoff-report/download) — 인쇄 친화적 3쪽

## 이 양식이 다루는 것

- **사업 개요** — 사업명·발주 기관·책임자·기간·예산 표
- **사업 목표 (3~5개)** + 측정 지표
- **사업 범위** — 포함/제외 명시
- **추진 체계** — 역할·책임 표 (1인 회사 + 검증 파트너 컨소시엄 구조 권고)
- **일정 마일스톤** — Phase 1~6 표
- **핵심 산출물 7종** 목록
- **1차 식별 위험 요소 (Top 5)** + 시급도·대응 방향
- **의사결정 요청 사항**

## 누가 사용하나

N²SF 전환·VDI 재정의 사업의 **착수 단계 책임자**. 임원·심의위원회에 1장 보고가 필요한 시점.

## 사용 시점

- 사업 계약 체결 직후
- Phase 1(착수) 종료·검수 회의 안건

## 결과를 어떻게 활용하나

1. 임원 보고 그대로 사용
2. 위원회 안건 자료
3. 사업 PM·책임자 인수인계 자료

## 관련 자료

- [현황분석서 템플릿](/insights/current-state-analysis) — Phase 2 산출물
- [위험분석서 템플릿](/insights/risk-analysis) — Phase 3 산출물
- [전환 로드맵 템플릿](/insights/transition-roadmap) — Phase 5 산출물
- [참고 단가](/practices#pricing) — 단계별 패키지

## 의뢰

착수보고서 작성·임원 발표 자문 — **jhw@mlkit.co.kr**.
$tpl_04$,
  ARRAY['n2sf', 'template', 'kickoff', 'project-management'],
  'n2sf',
  '착수보고서 템플릿 — 무료 PDF',
  'N²SF 전환·VDI 재정의 사업의 목표·범위·체계·일정·예산을 1장으로 정리. 임원 승인·예산 확정·심의위원회 안건 자료 그대로 사용. 무료 PDF.',
  now()
),

-- ──────────────────────────────────────────────────────────
-- 5. 현황분석서
-- ──────────────────────────────────────────────────────────
(
  'article',
  '현황분석서 템플릿 (다운로드)',
  'current-state-analysis',
  'published',
  '분석 시점의 인프라·VDI·인증·백업·운영 이슈를 일관된 형식으로 정리. 후속 위험 분석·시나리오 비교의 정량 근거.',
  $tpl_05$> 📥 **PDF 다운로드**: [current-state-analysis-2026-05-03.pdf](/api/templates/current-state-analysis/download) — 인쇄 친화적 3쪽

## 이 양식이 다루는 것

- **분석 개요** — 시점·범위·방법·분석자·검토자
- **인프라 구성** — 물리·VDI·망 (3 영역 표)
- **인증·접근통제** — VDI 진입·MFA·특권 계정·외부 접속·정책 분리
- **백업·DR** — 솔루션·정책·RTO/RPO·복구 시연·DR 사이트·24h 절차
- **운영 이슈·장애 이력** (최근 12개월)
- **보안 정책·산출물 현황** — 정책서·운영 절차·인증
- **분석 결과 요약 (Top 5)** — 한 줄씩

## 누가 사용하나

N²SF 전환·VDI 재정의 사업의 **분석 단계 담당자**. 자료가 부족한 항목은 *부족한 그대로* "확인 필요"로 표기 — 그것 자체가 분석 자료다.

## 사용 시점

- Phase 2(분석) 시작 시점
- 위험분석서·의사결정 매트릭스 작성 *전*

## 결과를 어떻게 활용하나

1. 위험분석서(R-### 자산 식별)의 입력 자료
2. 의사결정 매트릭스(영역별 N²SF 전환 질문)의 입력 자료
3. 분기별 재분석으로 환경 변화 추적

## 관련 자료

- [N²SF 전환 사전진단 체크리스트](/insights/n2sf-pre-diagnosis-checklist) — 1차 자가 점검
- [위험분석서 템플릿](/insights/risk-analysis) — 다음 단계
- [VDI 의사결정 매트릭스](/insights/vdi-decision-matrix) — 다음 단계
- [참고 단가 — Stage 1 1차 진단 리포트](/practices#pricing)

## 의뢰

현황 분석 인터뷰·산출물 정리 자문 — **jhw@mlkit.co.kr**.
$tpl_05$,
  ARRAY['n2sf', 'template', 'analysis', 'vdi', 'mfa', 'backup'],
  'n2sf',
  '현황분석서 템플릿 — 무료 PDF',
  '분석 시점의 인프라·VDI·인증·백업·운영 이슈를 일관된 형식으로 정리. 임원 보고·보안성 검토·전환 로드맵의 정량 근거. 무료 PDF.',
  now()
),

-- ──────────────────────────────────────────────────────────
-- 6. 위험분석서
-- ──────────────────────────────────────────────────────────
(
  'article',
  '위험분석서 템플릿 (다운로드)',
  'risk-analysis',
  'published',
  '자산·위협·취약점·영향도 평가로 Top 10 위험 등록부 작성. 보안성 검토·전환 로드맵·운영계획서의 입력 자료.',
  $tpl_06$> 📥 **PDF 다운로드**: [risk-analysis-2026-05-03.pdf](/api/templates/risk-analysis/download) — 인쇄 친화적 3쪽

## 이 양식이 다루는 것

- **평가 방법론** — 위험도 = 영향 × 가능성 (Critical/High/Medium/Low 4등급)
- **자산 식별** (A-01~) — VDI·데이터·게이트웨이·백업·MFA 인프라
- **위협 식별** (T-01~) — 외부 침해·자격증명 유출·내부자·운영 실수·EOS·측면 이동
- **취약점 식별** (V-01~) — MFA 미적용·특권 공용·백업 검증 부재 등
- **위험 등록부 (Top 10)** — 자산 + 위협 + 취약점 → 점수 → 등급 → 1차 대응
- **위험 등급별 대응 전략** — 회피/완화/전이/수용
- **잔존 위험 + 모니터링 지표**

## 누가 사용하나

**정보보호 책임자·정보화 담당자**. ISMS-P·금융보안 정밀 평가 *전*에 1차 자가 위험 평가가 필요한 시점.

## 사용 시점

- Phase 3(위험 분석) 단계
- 보안성 검토 대응표 작성 *전*
- 의사결정 매트릭스의 입력으로

## 결과를 어떻게 활용하나

1. **Critical(10~12) 위험** → Phase 1 즉시 대응
2. **High(7~9) 위험** → 단기 3개월 대응
3. **Medium(4~6) 위험** → 중기 모니터링 + 보완
4. 보안성 검토 위원회 답안 자료

## 관련 자료

- [현황분석서 템플릿](/insights/current-state-analysis) — 자산 식별 입력 자료
- [전환 로드맵](/insights/transition-roadmap) — 위험 대응 일정
- [보안성 검토 대응 체크리스트](/insights/security-review-response-checklist)

## 의뢰

위험 평가 워크숍·등록부 정리 자문 — **jhw@mlkit.co.kr**.
$tpl_06$,
  ARRAY['n2sf', 'template', 'risk', 'isms', 'security'],
  'n2sf',
  '위험분석서 템플릿 — 무료 PDF',
  '자산·위협·취약점·영향도 평가로 Top 10 위험 등록부 작성. 보안성 검토·전환 로드맵의 입력 자료. 무료 PDF.',
  now()
),

-- ──────────────────────────────────────────────────────────
-- 7. 전환 로드맵
-- ──────────────────────────────────────────────────────────
(
  'article',
  '전환 로드맵 템플릿 (다운로드)',
  'transition-roadmap',
  'published',
  '의사결정 결과를 4 Phase로 펼쳐 활동·산출물·게이트·KPI를 정리. 임원 승인·예산 확정·발주 RFP 일정 섹션의 정량 근거.',
  $tpl_07$> 📥 **PDF 다운로드**: [transition-roadmap-2026-05-03.pdf](/api/templates/transition-roadmap/download) — 인쇄 친화적 3쪽

## 이 양식이 다루는 것

- **로드맵 개요** — 전환 방향 한 줄 + 전체 기간/예산/KPI
- **Phase 1 안정화·기초 통제** (Months 1~3) — 활동·산출물·책임 + 게이트
- **Phase 2 N²SF 정렬·시나리오 비교** (Months 3~7)
- **Phase 3 구축·전환** (Months 6~14)
- **Phase 4 운영·검증** (Months 12~18)
- **자원·예산 배분** — Phase별 인력·예산 비중
- **의존성·전제 조건** — 외부·내부·기술·법적
- **KPI·체크포인트** — N²SF 정렬도·MFA 적용·복구 시연·심의 통과율

## 누가 사용하나

**사업 책임자·정보화 담당자**. 임원 승인·예산 확정·발주 RFP 일정 섹션의 정량 근거가 필요한 시점.

## 사용 시점

- Phase 2(분석·결정) 종료 직후
- 임원·심의위원회 승인 안건 작성 시
- 발주 RFP의 일정·예산 섹션 작성 시

## 결과를 어떻게 활용하나

1. **임원 보고 1장** + 4 Phase 게이트 명시
2. **RFP 일정·예산 섹션** 정량 근거
3. **각 Phase 게이트 검수 기준** 으로 활용

## 관련 자료

- [VDI 의사결정 매트릭스](/insights/vdi-decision-matrix) — 본 로드맵의 입력
- [위험분석서](/insights/risk-analysis) — Phase별 대응 우선순위
- [운영계획서 템플릿](/insights/operations-plan) — Phase 4 운영 단계
- [참고 단가 — Stage 3 RFP 패키지](/practices#pricing)

## 의뢰

로드맵 Phase 정밀화·임원 보고 자문 — **jhw@mlkit.co.kr**.
$tpl_07$,
  ARRAY['n2sf', 'template', 'roadmap', 'project-management', 'phase'],
  'n2sf',
  '전환 로드맵 템플릿 — 무료 PDF',
  '의사결정 결과를 4 Phase로 펼쳐 활동·산출물·게이트·KPI 정리. 임원 승인·예산 확정·발주 RFP 일정 섹션의 정량 근거. 무료 PDF.',
  now()
),

-- ──────────────────────────────────────────────────────────
-- 8. 운영계획서
-- ──────────────────────────────────────────────────────────
(
  'article',
  '운영계획서 템플릿 (다운로드)',
  'operations-plan',
  'published',
  '일상 운영·정기 점검·사고 대응·변경 관리·보고 체계를 RACI로 정리. 보안성 검토 운영계획 첨부 + 운영팀 인수인계 자료.',
  $tpl_08$> 📥 **PDF 다운로드**: [operations-plan-2026-05-03.pdf](/api/templates/operations-plan/download) — 인쇄 친화적 3쪽

## 이 양식이 다루는 것

- **운영 조직·책임 매트릭스 (RACI)** — 활동별 R/A/C/I 표
- **일상 운영 절차** — 모니터링 표(임계값·알림 채널) + 정기 점검(주기·산출물)
- **사고 대응 절차** — P0~P3 4등급 정의 + 24시간 대응 흐름 (5단계)
- **변경 관리·릴리스 절차** — 변경 종류별 승인자·검토·통보
- **보고 체계** — 일간·월간·분기·연간·사고 사후
- **외부 의존성·계약** — 라이선스·MFA·백업·외부 자문 갱신 일정

## 누가 사용하나

**운영 책임자·정보보호 담당자**. 신규 환경(N²SF 전환 후) 운영 안정화 + 보안성 검토 운영계획 첨부가 필요한 시점.

## 사용 시점

- Phase 4(운영·검증) 시작 시점
- 보안성 검토 운영계획 첨부 작성 시
- 운영팀 인수인계 시점
- 외부 자문·검증 파트너 컨소시엄 합류 시

## 결과를 어떻게 활용하나

1. **운영 인수인계 가이드**
2. **보안성 검토 운영계획 첨부** 자료
3. **사고 대응 시 절차 매뉴얼**
4. **외부 자문·컨소시엄과 책임 분담** 근거

## 관련 자료

- [전환 로드맵](/insights/transition-roadmap) — Phase 4의 입력
- [검수 체크리스트](/insights/acceptance-checklist) — Phase 4 종료 검수
- [참고 단가 — Stage 4 월간 매니지드](/practices#pricing) — 운영 단계 매니지드 서비스

## 의뢰

운영 절차 정비·인수인계 자문 — **jhw@mlkit.co.kr**.
$tpl_08$,
  ARRAY['n2sf', 'template', 'operations', 'raci', 'incident-response'],
  'n2sf',
  '운영계획서 템플릿 — 무료 PDF',
  '일상 운영·정기 점검·사고 대응·변경 관리·보고 체계를 RACI로 정리. 보안성 검토 운영계획 첨부 + 운영팀 인수인계. 무료 PDF.',
  now()
),

-- ──────────────────────────────────────────────────────────
-- 9. 검수 체크리스트
-- ──────────────────────────────────────────────────────────
(
  'checklist',
  '검수 체크리스트 (다운로드)',
  'acceptance-checklist',
  'published',
  '단계별(착수·분석·설계·구축·운영) 산출물·보안·기능·성능·교육 검수 기준과 서명 절차.',
  $tpl_09$> 📥 **PDF 다운로드**: [acceptance-checklist-2026-05-03.pdf](/api/templates/acceptance-checklist/download) — 인쇄 친화적 4쪽

## 이 체크리스트가 다루는 것

- **5 단계 검수** — 착수·분석·설계·구축·운영
- **산출물 완성도** (모든 단계 공통) — 양식 일관성·데이터 정합성·서명·버전 관리
- **단계 1 착수 검수** — 사업 범위·추진 체계·일정·예산·1차 위험
- **단계 2 분석 검수** — 자료 수집·C/S/O 분류·위험 등록부·시나리오·운영 이슈
- **단계 3 설계 검수** — 아키텍처·통제 매핑·MFA·외부 협력사·백업/DR
- **단계 4 구축 검수** — 보안·기능·성능·교육 4 영역
- **단계 5 운영 검수** — 운영 리포트·KPI·사고·복구 시연
- **검수 절차·서명** — 회의·서명란·미완 항목 처리 표

## 누가 사용하나

**사업 책임자·정보화 담당자·정보보호 담당자**. 단계별 검수·인수에 *기준이 일관*되어야 하는 시점.

## 사용 시점

- 각 Phase 종료 시점 (1~3일 검수)
- 사업 종료·인수 시점

## 결과를 어떻게 활용하나

1. **단계별 검수 회의 안건 자료**
2. **미완 항목 보완 계획표** — 책임자·일정 명시
3. **사업 종료 검수 보고서** 그대로

## 관련 자료

- [착수보고서 템플릿](/insights/project-kickoff-report) — 단계 1 검수 입력
- [전환 로드맵](/insights/transition-roadmap) — Phase별 게이트 검수 기준
- [운영계획서 템플릿](/insights/operations-plan) — 단계 5 검수 입력

## 의뢰

검수 회의·미완 항목 보완 자문 — **jhw@mlkit.co.kr**.
$tpl_09$,
  ARRAY['n2sf', 'template', 'checklist', 'acceptance', 'project-management'],
  'n2sf',
  '검수 체크리스트 — 무료 PDF',
  '단계별(착수·분석·설계·구축·운영) 산출물·보안·기능·성능·교육 검수 기준과 서명 절차. 사업 검수 보고서 + 인수 서명·미완 항목 보완 계획. 무료 PDF.',
  now()
)

ON CONFLICT (slug) DO UPDATE SET
  type          = EXCLUDED.type,
  title         = EXCLUDED.title,
  status        = EXCLUDED.status,
  excerpt       = EXCLUDED.excerpt,
  body_md       = EXCLUDED.body_md,
  tags          = EXCLUDED.tags,
  category      = EXCLUDED.category,
  seo_title     = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  published_at  = EXCLUDED.published_at,
  updated_at    = now();

-- 검증 쿼리 (실행 후 결과 확인용)
-- SELECT slug, type, title, status, array_length(tags, 1) AS tag_count
-- FROM content_items
-- WHERE slug IN (
--   'n2sf-pre-diagnosis-checklist', 'vdi-decision-matrix', 'security-review-response-checklist',
--   'project-kickoff-report', 'current-state-analysis', 'risk-analysis',
--   'transition-roadmap', 'operations-plan', 'acceptance-checklist'
-- )
-- ORDER BY published_at DESC;
