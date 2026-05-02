# MFA 벤더 비교 — Cisco Duo · Microsoft Entra · Okta · OneLogin

> **목적**: 1인 기업이 MFA 솔루션 딜리버리 사업을 시작할 때 1~2개 주력 벤더 선정을 위한 비교 분석.
> **결론**: **Cisco Duo (1순위)** + **Microsoft Entra ID (2순위)** 조합 권장.

---

## 비교 기준 5가지

1. 가격·라이선스 모델
2. VDI·DaaS 통합
3. 국내 레퍼런스·지원
4. MSP 가능성 (다중 고객 관리)
5. 1인 기업의 진입 장벽

---

## 1. Cisco Duo

### 기본 정보
- **본사**: 미국 (Cisco 소속)
- **제품 라인**: Essentials / Advantage / Premier
- **국내 파트너**: 다수 SI·총판 운영
- **국내 인지도**: 높음 (특히 보안 우선 중견·금융권)

### 가격 (2026년 기준)
| 등급 | 1인 월 가격 | 무료 한도 | 주요 기능 |
|---|---|---|---|
| **Essentials** | $3 | 10인 | MFA + Self-Service Portal |
| **Advantage** | $6 | - | + Adaptive Auth, Trusted Endpoints |
| **Premier** | $9 | - | + Trust Monitor, ZTNA(Beyond) |

### VDI 통합 강점
- ★★★ Citrix StoreFront/NetScaler 통합 (전용 가이드·플러그인)
- ★★★ VMware UAG 통합
- ★★ Omnissa Workspace ONE 호환
- ★★★ 클라우드 DaaS (AVD, Citrix DaaS) 지원

### MSP 운영
- **Duo Partner Edition** (별도 구독)
- 다중 고객 통합 콘솔 가능
- 고객별 정책 템플릿 적용

### 1인 기업 진입 장벽
- **장점**: Cisco 파트너 등록 쉬움 (Cisco Partner Locator)
- **장점**: 도입 PoC 진행 쉬움 (10인 무료 + 14일 트라이얼)
- **단점**: 가격 협상 폭 좁음 (대형 거래만 협상 가능)

### 국내 레퍼런스
- 금융권 다수 (은행, 증권)
- 공공기관 일부
- 중견 제조·IT 다수

### 종합 평가: **★★★★★ (1순위)**
- VDI 사업과 가장 자연스럽게 연결
- 도입 가장 쉽고 운영 부담 적음
- 1인 기업이 가장 빠르게 시작 가능

---

## 2. Microsoft Entra ID (구 Azure AD)

### 기본 정보
- **본사**: 미국 (Microsoft)
- **제품 라인**: Free / P1 / P2 (M365 통합)
- **국내 파트너**: M365 파트너 모두 가능
- **국내 인지도**: 매우 높음 (M365 보유 모든 기관)

### 가격 (2026년 기준)
| 등급 | 1인 월 가격 | 비고 |
|---|---|---|
| **Entra ID Free** | 무료 | 기본 MFA 포함 |
| **Entra ID P1** | $6 | Conditional Access, Self-Service |
| **Entra ID P2** | $9 | + Identity Protection, PIM |
| **M365 Business Premium** | $22 | Entra ID P1 포함 |
| **M365 E3** | $36 | Entra ID P1 포함 |
| **M365 E5** | $57 | Entra ID P2 포함 |

### VDI 통합 강점
- ★★ Citrix NetScaler SAML 연동
- ★★ VMware Horizon SAML 연동
- ★★ Omnissa SAML 연동
- ★★★★ AVD/Windows 365 네이티브 통합 (가장 강함)

### MSP 운영
- **CSP (Cloud Solution Provider) 프로그램** 통한 다중 고객 관리
- 단일 콘솔에서 여러 테넌트 관리 가능
- M365 파트너십 활용

### 1인 기업 진입 장벽
- **장점**: Microsoft Partner Network 가입 쉬움
- **장점**: M365 보유 고객은 추가 라이선스 구매 없이 활성화만 (구축 단가 위주 매출)
- **단점**: M365 미보유 고객은 진입 어려움 (별도 라이선스 필요)
- **단점**: Microsoft 정책 잦은 변화 (제품명·라이선스 자주 변경)

### 국내 레퍼런스
- M365 도입 모든 기관 (사실상 시장 점유율 1위)
- 외국계 다국적 기업 표준
- 중견·대기업 다수

### 종합 평가: **★★★★ (2순위)**
- M365 보유 고객 대상 사업 진입 쉬움
- 다른 벤더 대비 운영 부담 적음
- 단점: 고객이 M365 안 쓰면 진입 불가

---

## 3. Okta

### 기본 정보
- **본사**: 미국 (Okta Inc.)
- **제품 라인**: MFA / Workforce Identity Cloud
- **국내 파트너**: 일부 외국계 SI
- **국내 인지도**: 외국계 IT·스타트업 중심

### 가격
| 등급 | 1인 월 가격 |
|---|---|
| **MFA only** | $2 |
| **Single Sign-On** | $4 |
| **Workforce Identity Cloud** | $15 |

### VDI 통합 강점
- ★★ SAML 기반 통합 (Citrix, VMware, Omnissa)
- ★★ AVD/Windows 365 통합
- 강한 SaaS 통합 (M365, Salesforce, GitHub 등 7000+ 앱)

### MSP 운영
- 가능하나 Okta MSP 프로그램은 제한적
- 100인 미만 고객은 비싸짐 (가격 구조)

### 1인 기업 진입 장벽
- **단점**: 한국 직접 지원 약함
- **단점**: 한국어 문서·교육 자료 적음
- **단점**: 국내 SI 파트너 제한적
- **장점**: 글로벌 SaaS 통합 시 가장 강력

### 종합 평가: **★★★ (특수 시나리오만)**
- 외국계 다국적 기업 고객 대상으로만 검토
- 일반 국내 중견·공공 시장에는 비추천

---

## 4. OneLogin

### 기본 정보
- **본사**: 미국 (One Identity 인수)
- **제품 라인**: SSO / MFA / Unified Endpoint
- **국내 파트너**: 소수 SI
- **국내 인지도**: 낮음

### 가격
| 등급 | 1인 월 가격 |
|---|---|
| **MFA** | $2 |
| **SSO** | $4 |
| **Unlimited** | $8 |

### VDI 통합 강점
- ★★ 기본 SAML 지원
- ★ AVD/Windows 365 통합 약함

### MSP 운영
- 기본 제공
- 가격 협상 폭 큼

### 1인 기업 진입 장벽
- **단점**: 국내 사례 적음 → 신뢰 빌드 어려움
- **단점**: 한국어 지원 약함
- **장점**: 가격 협상 시 검토 가치

### 종합 평가: **★★ (비추천)**
- 국내 시장 진입 어려움
- 신뢰 빌드 부담 大

---

## 종합 비교표

| 기준 | Cisco Duo | Microsoft Entra | Okta | OneLogin |
|---|---|---|---|---|
| **가격 (시작)** | $3 | 무료 (M365 포함) | $2 | $2 |
| **VDI 통합** | ★★★ | ★★ (AVD ★★★★) | ★★ | ★★ |
| **국내 레퍼런스** | ★★★ | ★★★★ | ★★ | ★ |
| **MSP 가능성** | ★★★ (Partner Edition) | ★★★ (CSP) | ★★ | ★★ |
| **1인 기업 진입** | ★★★★ | ★★★ | ★★ | ★★ |
| **한국 지원** | ★★★ | ★★★★ | ★ | ★ |
| **종합** | **5/5** | **4/5** | **3/5** | **2/5** |

---

## 권장 전략 (1인 기업)

### Phase 1 (즉시 ~ 3개월): Cisco Duo 주력 시작
- **이유**: VDI 사업과 가장 자연스럽게 연결, 진입 장벽 가장 낮음
- **액션**:
  1. Cisco Partner Locator 등록
  2. Duo 10인 무료 환경 + 자체 PoC (Citrix + Duo)
  3. 기존 VDI 고객 12개 기관에 MFA 도입 제안서 발송
  4. Duo Essentials/Advantage 차이 학습

### Phase 2 (3~6개월): Microsoft Entra 추가
- **이유**: M365 보유 고객 대상 추가 매출 기회
- **액션**:
  1. Microsoft Partner Network 등록
  2. SC-300 (Identity Administrator) 시험 응시
  3. M365 보유 고객 2~3개 기관에 Entra MFA 활성화 제안

### Phase 3 (6~12개월): MSP 모델 확장
- **이유**: 누적 고객 5~10개 확보 후 통합 운영 효율 추구
- **액션**:
  1. Duo Partner Edition 구독 검토
  2. Microsoft CSP 프로그램 검토
  3. MSP 운영 콘솔로 통합 모니터링

---

## 수익 모델

### 매출 구성
- **라이선스 리셀**: 마진 10~25% (벤더·등급에 따라)
- **구축비 (1회성)**: 사용자 수에 따라 100~500만원
- **유지보수 (연간)**: 라이선스 비용의 15~20%

### 예상 수익 (50인 고객 1개 기준, 5년)
- **Cisco Duo Advantage 50인**: $300/월 × 12개월 × 5년 = $18,000
  - 라이선스 마진: $1,800 ~ $4,500
  - 구축비: $2,000 ~ $5,000
  - 유지보수: $2,700 ~ $3,600 (연 270~720)
- **5년 누적**: 약 $6,500 ~ $13,000 (한화 850~1700만원)

### 목표 (12개월 후)
- MFA 도입 고객 5~10개 확보
- 연 매출 5,000~1억 (구축비 + 라이선스 마진 + 유지보수)

---

## 다음 단계

1. Cisco Partner Locator 등록 (즉시)
2. Duo PoC 환경 구축 (1주)
3. 기존 VDI 고객 대상 영업 자료 작성 (2주)
4. 첫 MFA 도입 프로젝트 수주 (3개월)
