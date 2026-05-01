# Design — 백업·사이버복원력 자가 진단 도구

> Phase 2.1 / Plan: `docs/01-plan/features/backup-readiness.plan.md`
> 작성: 2026-05-01

## 1. 진단 구조 개요

- **총 7영역 / 25문항** (각 영역 3~4문항)
- **각 문항 0~3점 척도** (4지선다)
- **영역별 가중치 합 = 100%**
- **최종 score = 0~100점**, **Level 1~5 등급**

## 2. 영역·문항·가중치

### 영역 1. 백업 적용 범위 (Scope) — 가중치 18%

| # | 문항 | 0점 | 1점 | 2점 | 3점 |
|---|---|---|---|---|---|
| 1.1 | 서버·VM 백업 적용 범위 | 일부 핵심만 | 운영 환경 절반 이상 | 운영 환경 전부 | 운영+개발/테스트 포함 전부 |
| 1.2 | 엔드포인트(노트북·PC) 백업 | 미운영 | 임원·핵심부서만 | 전사 50% 이상 | 전사 100% |
| 1.3 | SaaS·클라우드 데이터(M365/Google) | 백업 안 함 | 일부 데이터만 | 메일·드라이브 통합 | 모든 SaaS 통합 백업 |
| 1.4 | DB·중요 애플리케이션 별도 정책 | 정책 없음 | 일부만 | 주요 DB 모두 | 트랜잭션 일관성까지 보장 |

### 영역 2. 백업 주기·정책 (Policy) — 가중치 14%

| # | 문항 | 0점 | 1점 | 2점 | 3점 |
|---|---|---|---|---|---|
| 2.1 | 백업 주기 | 부정기/월 1회 미만 | 주 1회 | 일 1회 | 일 1회 + 시간 단위 증분 |
| 2.2 | 보관 기간 정책 | 정해진 기준 없음 | ≤30일 | 31~90일 | 단계별 보관 (3-2-1 준수) |
| 2.3 | 백업 사본 분리 (3-2-1 규칙) | 단일 사본 | 동일 사이트 2사본 | 다른 매체 2사본 | 3-2-1 (오프사이트 1사본 포함) |

### 영역 3. 랜섬웨어 보호 (Ransomware) — 가중치 18%

| # | 문항 | 0점 | 1점 | 2점 | 3점 |
|---|---|---|---|---|---|
| 3.1 | Immutable / WORM 백업 | 미적용 | 일부 핵심만 | 대부분 | 모든 백업 immutable |
| 3.2 | 안티-멀웨어·EDR 통합 | 별도 운영 (분리) | 일부 통합 | 통합 운영 | AI 행위 탐지·자동 차단 통합 |
| 3.3 | 백업 데이터 무결성 검증 | 검증 안 함 | 수기 검증 | 자동 해시 검증 | AI 기반 이상 탐지 |
| 3.4 | 랜섬웨어 사고 시 롤백 시나리오 | 정의 없음 | 문서만 존재 | 연 1회 모의훈련 | 분기 1회 자동화 훈련 |

### 영역 4. 복구 검증 (Recovery Validation) — 가중치 14%

| # | 문항 | 0점 | 1점 | 2점 | 3점 |
|---|---|---|---|---|---|
| 4.1 | 정기 복구 테스트 주기 | 안 함 | 연 1회 | 분기 1회 | 월 1회 자동 검증 |
| 4.2 | 복구 시간 측정·기록 | 안 함 | 가끔 | 매 테스트마다 | 자동 리포트화 |
| 4.3 | 복구 시나리오 문서화 | 없음 | 핵심 시스템만 | 대부분 | 시나리오별 runbook |

### 영역 5. RTO/RPO 정의 (Service Level) — 가중치 10%

| # | 문항 | 0점 | 1점 | 2점 | 3점 |
|---|---|---|---|---|---|
| 5.1 | 업무별 RTO 정의 | 없음 | 일부 시스템만 | 핵심 업무 모두 | 등급별 SLA로 명문화 |
| 5.2 | 업무별 RPO 정의 | 없음 | 일부만 | 핵심 업무 모두 | 등급별 SLA로 명문화 |
| 5.3 | RTO/RPO 위반 시 escalation | 없음 | 비공식 | 절차 정의 | 자동 알림+책임자 명시 |

### 영역 6. DR/페일오버 (Disaster Recovery) — 가중치 14%

| # | 문항 | 0점 | 1점 | 2점 | 3점 |
|---|---|---|---|---|---|
| 6.1 | DR 사이트·클라우드 페일오버 | 없음 | 콜드 (수기 복구) | 웜 (부분 자동) | 핫/지속 복제 |
| 6.2 | DR 훈련 주기 | 안 함 | 연 1회 | 반기 1회 | 분기 1회 + 자동 검증 |
| 6.3 | DR 사이트 데이터 동기화 지연 | 알 수 없음 | 일 단위 | 시간 단위 | 분 단위 |

### 영역 7. 백업 보안 (Security & Access) — 가중치 12%

| # | 문항 | 0점 | 1점 | 2점 | 3점 |
|---|---|---|---|---|---|
| 7.1 | 백업 데이터 암호화 | 평문 | 저장 시만 | 저장+전송 | 저장+전송+키관리(KMS) |
| 7.2 | 백업 콘솔 MFA | 없음 | 일부 관리자만 | 모든 관리자 | MFA + 권한 분리(SoD) |
| 7.3 | 백업 시스템 접근 로그·감사 | 없음 | 일부 | 통합 로깅 | 통합+이상행위 알림 |

## 3. 스코어 계산

```
영역_점수 = (영역_문항_점수합 / (문항수 × 3)) × 100  // 0~100
최종_score = Σ(영역_점수 × 가중치)                   // 0~100, clamp [0, 100]
```

## 4. 등급 정의 (Level 1~5)

| Level | Score | 명칭 | 설명 |
|---|---|---|---|
| 1 | 0~19 | Initial | 백업 정책 부재. 사고 시 데이터 손실 위험 매우 높음. 즉시 기초 백업 도입 필요. |
| 2 | 20~39 | Reactive | 핵심 시스템 백업만 운영, 검증·DR·랜섬웨어 보호 미흡. 사고 발생 시 복구 지연 가능. |
| 3 | 40~59 | Defined | 정책·범위 명문화, 정기 백업 운영. 검증·DR 미성숙, 랜섬웨어 대응 부분적. |
| 4 | 60~79 | Managed | 자동화·검증·DR 운영, RTO/RPO SLA 정의. 랜섬웨어 immutable 보호 가능. |
| 5 | 80~100 | Optimized | 사이버복원력 표준 충족. AI 기반 탐지·자동화·24x7 검증, 컴플라이언스 대응 가능. |

## 5. 권고 (Recommendation Engine)

각 영역 점수 < 60% 시 해당 영역 권고 출력:

| 영역 | 권고 헤드라인 | Acronis 매칭 |
|---|---|---|
| Scope | 백업 적용 범위 확대 — 엔드포인트·SaaS 통합 | Cyber Protect Cloud 통합 보호 |
| Policy | 3-2-1 규칙 도입 + 보관 정책 단계화 | Storage tiering 자동 분리 |
| Ransomware | Immutable 백업 + 안티-멀웨어 통합 | Active Protection 행위 기반 차단 |
| Recovery Validation | 자동 복구 테스트·검증 도입 | Cyber Protect Recovery Verification |
| Service Level | 등급별 RTO/RPO SLA 명문화 | Acronis 컨설팅 SLA 워크샵 |
| Disaster Recovery | DR 사이트·클라우드 페일오버 도입 | Acronis Cyber Disaster Recovery |
| Security & Access | 키관리·MFA·SoD 강화 | Acronis MSP MFA + Audit |

## 6. UI 흐름

```
Step 0: Lead 입력 (이름·이메일·기관·전화·동의)
   ↓
Step 1~7: 각 영역 카드 (3~4문항씩, 진행 도트)
   ↓
Step 8: 제출 → 스코어링 → 토큰 발급
   ↓
Redirect: /reports/backup-readiness/[token]
```

7-step 진단 도트 (lead 단계 별도). 각 step 완료 시 자동 다음 step.

## 7. 데이터 모델

```typescript
// tool_runs row
{
  tool_type: 'backup_readiness',
  lead_id: uuid,
  input_json: {
    answers: { '1.1': 2, '1.2': 1, ... },
    leadSource: 'backup-readiness'
  },
  output_json: {
    score: 56,
    level: 3,
    levelName: 'Defined',
    sections: [
      { id: 'scope', name: '백업 적용 범위', score: 75, weight: 18 },
      ...
    ],
    recommendations: ['Ransomware', 'Disaster Recovery', ...]
  },
  score: 56
}

// reports row
{
  tool_run_id: uuid,
  access_token: random uuid,
  pdf_url: storage_url | null,
  report_html: rendered_html
}
```

## 8. 기존 패턴과의 차이

| 항목 | n2sf-readiness | backup-readiness |
|---|---|---|
| 영역 수 | 5 | 7 |
| 문항 수 | 15 | 25 |
| 가중치 합 | 100% | 100% |
| 등급 | Level 1~5 | Level 1~5 (명칭만 다름) |
| 권고 매칭 | N²SF 통제 | Acronis 제품군 |

## 9. PDF 리포트 구조

A4 1페이지 안에 압축:
- 헤더: 기관명·날짜·진단명
- 좌: 점수 게이지(0~100) + Level 등급 라벨
- 우: 영역별 점수 7행 미니 막대
- 하: 우선 개선 권고 3건 + Acronis 매칭

## 10. 검증 시나리오 (e2e)

1. `/tools/backup-readiness` 진입 → Lead 입력 → 7 step 답변 → 제출
2. `/reports/backup-readiness/[token]` 정상 표시 (점수·등급·권고)
3. PDF 다운로드 정상
4. Supabase: `leads`, `tool_runs(tool_type='backup_readiness')`, `reports` 각 1건 추가
5. 동일 이메일 재제출 시 lead upsert (중복 미생성)
