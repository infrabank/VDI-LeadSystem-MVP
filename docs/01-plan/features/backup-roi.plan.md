# Plan — 백업 ROI 계산기

> Phase 2.2 / 데이터 보호 Practice의 두 번째 lead-gen 도구
> 작성: 2026-05-01

## 비즈니스 의도

랜섬웨어·운영 중단 위험을 **금액으로 환산**해 경영진 의사결정용 PDF 리포트를 즉시 발급. 백업 솔루션 도입 ROI를 **수치로 정량화**하여 영업 미팅 진입점 확보.

**KPI**:
- 입력 후 PDF 생성 ≥ 80%
- ROI 결과 → email 제출 전환 ≥ 12% (자가진단보다 ↑ — 결과를 보고 싶어하므로)
- 1개월 내 첫 10건 lead 확보

## 핵심 가치 제안

| 사용자 | 제공 |
|---|---|
| IT 운영팀장·CISO | 5년 TCO 비교 + 회피 비용 환산 → 경영진 보고 자료 즉시 |
| Myloket | 정량 ROI 수치 = 영업·견적 전환의 anchor point |

## 입력·출력 개요

**입력 (5개 단순)**:
1. 임직원 수 (명)
2. 시간당 업무 중단 비용 (만원/시간)
3. 보호 대상 데이터 규모 (TB)
4. 현재 연간 백업·복구 운영 비용 (만원)
5. 최근 3년간 다운타임 시간 (시간/년)

**출력**:
- 5년 TCO: 현 환경 vs Acronis Cyber Protect 도입
- 연간 회피 가능 비용 (다운타임·랜섬웨어·복구 인건비)
- ROI % (5년 누적)
- Payback 기간 (개월)
- 시나리오 3종: Best / Expected / Worst

## 산출물

- `/tools/backup-roi` — 입력 폼 (1-page, 5필드)
- `/reports/[token]` (backup_roi 분기) — 비교 차트·ROI 카드·CTA

## Out of Scope (이번 범위 외)

- 라이선스 SKU별 정확 견적 (영업 단계 처리)
- 실제 사고 데이터 인용 (참고치만 표기)

---

# Design

## 1. 계산 모델

### 1.1 현 환경 5년 비용 (current_5yr)

```
current_op_cost   = annual_backup_cost × 5
ransomware_risk   = users × (1.2만원/명/년) × 5     // 업계 평균 사고 영향 인건수
downtime_cost     = annual_downtime_hours × hourly_loss × 5
manual_recovery   = users × 0.3만원/명 × 0.5사고/년 × 5
─────────────────────────────────────────────────
current_5yr = current_op_cost + ransomware_risk + downtime_cost + manual_recovery
```

### 1.2 Acronis 도입 5년 비용 (acronis_5yr)

```
acronis_license   = users × 12만원/년 × 5            // EP·서버 통합
acronis_storage   = data_tb × 18만원/TB/년 × 5       // 클라우드 백업 단가 추정
implementation    = 1500만원 (1회 일괄)
managed_service   = 600만원/년 × 5                   // MSP 운영 옵션
risk_residual     = ransomware_risk × 0.15           // 85% 감소 가정
downtime_residual = downtime_cost × 0.30             // 70% 감소 가정 (DR·자동복구)
─────────────────────────────────────────────────
acronis_5yr = acronis_license + acronis_storage + implementation + managed_service + risk_residual + downtime_residual
```

### 1.3 회피 비용·ROI

```
avoided_5yr    = current_5yr - acronis_5yr
investment_5yr = acronis_license + acronis_storage + implementation + managed_service
roi_pct        = (avoided_5yr / investment_5yr) × 100
payback_months = (implementation × 12) / (annual_avoided / 1)   // 단순 환산
```

### 1.4 시나리오 (불확실성 처리)

| 시나리오 | 가정 |
|---|---|
| Best | 사고 영향 ↓50% / 다운타임 ↓80% / Acronis 절감 +10% |
| Expected | 위 기본 계수 그대로 |
| Worst | 사고 영향 ↓20% / 다운타임 ↓40% / Acronis 절감 -10% |

## 2. 출력 데이터 구조

```typescript
interface BackupRoiOutput {
  version: "v1";
  tool: "backup_roi";
  inputs: {
    users: number;
    hourly_loss_kw: number;
    data_tb: number;
    annual_backup_cost_kw: number;
    annual_downtime_hours: number;
  };
  current_5yr: { total: number; breakdown: Record<string, number> };
  acronis_5yr: { total: number; breakdown: Record<string, number> };
  scenarios: {
    best:     { avoided_5yr: number; roi_pct: number; payback_months: number };
    expected: { avoided_5yr: number; roi_pct: number; payback_months: number };
    worst:    { avoided_5yr: number; roi_pct: number; payback_months: number };
  };
  summary: string;
  recommendations: string[];
  score: number;  // 0~100, ROI 기반 매핑 (display용)
}
```

## 3. UI

**1-page 폼** (멀티스텝 아님 — 입력 5개라 짧음):
- Lead 정보 (이름·이메일·기관·동의)
- ROI 입력 5개
- 제출 → 즉시 결과 페이지 redirect

**리포트 페이지** (`/reports/[token]` backup_roi 분기):
- 헤더: 기관명·날짜
- 핵심 수치: Expected ROI %·Payback·5년 누적 회피액
- 비교 차트: 현 환경 vs Acronis (스택 막대)
- 시나리오 3종 카드 (Best/Expected/Worst)
- 권고: 우선 도입 컴포넌트
- CTA: 상세 견적 상담

## 4. 검증

```
1. 폼 입력 → POST /api/leads → POST /api/tools/backup-roi/run → POST /api/reports/[toolRunId]/generate → redirect
2. /reports/[token] 정상 표시
3. tool_runs 1건 (tool_type='backup_roi'), reports 1건 추가
4. 동일 email 재제출 시 lead upsert
```

## 5. 참고 단가 (디폴트값, 사용자가 조정 가능)

- 시간당 업무 중단 비용 디폴트: 100만원/시간 (중소 규모 공공기관 추정)
- 데이터 규모 디폴트: 10TB
- 현재 백업 비용 디폴트: 1500만원/년
- 다운타임 디폴트: 24시간/년 (월 2시간)
