import type {
  VendorTrack,
  NetworkType,
  ComparisonRow,
  VendorDefenseBlocks,
  DefenseQAItem,
} from "@/lib/types/sap";

export interface VendorDefenseInput {
  vendorTrack: VendorTrack;
  networkType: NetworkType;
  haRequired: boolean;
  drRequired: boolean;
  backupRequired: boolean;
  userCount: number;
  complianceLevel: "low" | "medium" | "high";
  securityFlags: Record<string, boolean>;
}

// ---------------------------------------------------------------------------
// A) Vendor-neutral baseline (20 items, grouped by perspective)
// ---------------------------------------------------------------------------

const NEUTRAL_REQUIREMENTS: string[] = [
  "RFP 기술 요구사항 대비 솔루션 기능 매핑이 완료되었으며, 모든 필수 요구사항에 대한 충족 방안이 제안서에 명시되어 있습니다.",
  "사용자 프로파일별 리소스 산정 근거를 제시하고, 실 사용 환경 기반의 사이징 검증(POC 포함)을 통해 요구 성능 충족을 입증합니다.",
  "접속 게이트웨이, 인증, 세션 관리 등 전체 사용자 접속 경로에 대한 설계가 포함되어 있으며, 단일 장애점(SPOF)이 제거된 아키텍처를 제안합니다.",
  "스토리지 I/O 요구량 산정 시 부팅 폭주(boot storm), 안티바이러스 스캔, 업데이트 배포 등 피크 시나리오를 반영한 설계를 포함합니다.",
  "엔드포인트 디바이스 전략(씬 클라이언트, 제로 클라이언트, 기존 PC 재활용)에 대한 호환성 검증 결과를 제안서에 포함합니다.",
];

const NEUTRAL_OPERATIONS: string[] = [
  "이미지 관리(골든 이미지, 패치, 업데이트)에 대한 운영 절차와 자동화 방안이 제안에 포함되어 있습니다.",
  "사용자 경험 모니터링(EUEM) 도구 도입 및 성능 기준선(Baseline) 설정 계획이 수립되어 있습니다.",
  "1/2/3차 기술 지원 에스컬레이션 체계와 SLA 관리 방안이 명시되어 있습니다.",
  "운영 인력 교육 계획(관리자 기술 이전, 최종 사용자 교육)이 전환 일정에 포함되어 있습니다.",
  "무중단 패치 적용(Rolling Update) 및 비상 시 롤백 절차가 운영 매뉴얼에 정의되어 있습니다.",
];

const NEUTRAL_SECURITY: string[] = [
  "데이터 유출 방지(DLP) 정책(USB 차단, 클립보드 제어, 화면 캡처 차단)이 사용자 역할별로 차등 적용됩니다.",
  "다중 인증(MFA) 연동이 게이트웨이 레이어에서 구현되며, RADIUS/SAML/OIDC 프로토콜을 지원합니다.",
  "네트워크 마이크로 세그멘테이션을 통한 VDI VM 간 측면 이동(Lateral Movement) 차단이 적용됩니다.",
  "세션 암호화(TLS 1.2 이상) 및 전송 구간 암호화가 전체 접속 경로에 적용됩니다.",
  "감사 로그(Audit Trail) 수집 및 장기 보존 체계가 구축되어 컴플라이언스 요구사항을 충족합니다.",
];

const NEUTRAL_PERFORMANCE: string[] = [
  "초기 도입 규모 대비 3년 내 확장 시나리오(사용자 증가, 사이트 추가)에 대한 설계가 포함되어 있습니다.",
  "화상회의(Zoom/Teams/Webex) 최적화를 위한 클라이언트 오프로딩 방안이 적용됩니다.",
  "GPU 가상화(vGPU) 대상 사용자 그룹 식별 및 프로파일 선정이 완료되어 있습니다.",
  "VDI 프로토콜 대역폭 시뮬레이션 결과와 QoS 정책 적용 계획이 제안에 포함됩니다.",
  "프로파일 관리 솔루션(FSLogix/UPM 등) 적용을 통한 로그인 시간 최적화 방안이 제시됩니다.",
];

// HA-specific neutral items (added when haRequired=true)
const NEUTRAL_HA_SUPPLEMENT: string[] = [
  "컴퓨트/스토리지/네트워크 전 계층에 걸친 HA 설계 근거가 명시되어 있으며, 각 구성요소별 목표 복구 시간(RTO)이 정의되어 있습니다.",
  "HA 구성에 대한 정기적인 페일오버 테스트 계획 및 테스트 결과 보고 체계가 수립되어 있습니다.",
];

// ---------------------------------------------------------------------------
// B) Citrix defense blocks (8 items)
// ---------------------------------------------------------------------------

const CITRIX_BLOCKS: string[] = [
  "Citrix CVAD 아키텍처에서 Delivery Controller는 세션 브로커링 및 머신 할당을 담당하며, Active-Active 이중화 구성으로 단일 장애점을 제거합니다.",
  "Citrix ADC(NetScaler)를 외부 접속 게이트웨이로 선정한 근거: SSL 오프로드, 부하 분산, DDoS 완화 기능을 단일 장비에서 통합 제공합니다.",
  "HDX 프로토콜의 적응형 전송(EDT over UDP) 기능은 고지연/저대역폭 환경에서 사용자 경험 저하를 최소화하기 위한 선택입니다.",
  "StoreFront의 로컬 호스트 캐시(Local Host Cache) 기능으로 Connection Broker 장애 시에도 기존 세션 유지 및 제한된 신규 세션 할당이 가능합니다.",
  "Machine Creation Services(MCS) 기반 이미지 관리를 통해 골든 이미지 변경 시 전체 VM에 자동 반영되는 운영 효율성을 확보합니다.",
  "Citrix Analytics for Performance를 통한 실시간 사용자 경험 모니터링 및 이상 징후 자동 탐지가 운영 부담 감소에 기여합니다.",
  "Citrix Cloud 하이브리드 구성을 통해 관리 플레인은 클라우드에서 운영하되 데이터/워크로드는 온프레미스에 유지하는 단계적 전환이 가능합니다.",
  "Workspace Environment Management(WEM)을 통한 CPU/메모리 최적화로 서버당 수용 사용자 수를 15~25% 향상시킬 수 있습니다.",
];

// ---------------------------------------------------------------------------
// C) Omnissa defense blocks (8 items)
// ---------------------------------------------------------------------------

const OMNISSA_BLOCKS: string[] = [
  "Omnissa Horizon Connection Server는 Pod 단위로 구성되며, Cloud Pod Architecture(CPA)를 통해 다중 사이트 간 글로벌 리소스 풀링이 가능합니다.",
  "Unified Access Gateway(UAG)를 DMZ에 배치하여 내부 네트워크 노출 없이 외부 접속을 허용하며, Blast Extreme 프로토콜의 암호화된 전송을 보장합니다.",
  "Blast Extreme의 적응형 코덱(HEVC/H.264)은 네트워크 상태에 따라 자동 전환되어 다양한 네트워크 환경에서 일관된 사용자 경험을 제공합니다.",
  "Instant Clone 기술을 통해 부모 VM에서 수 초 내 데스크탑 프로비저닝이 가능하며, 로그오프 시 자동 삭제/재생성으로 보안 기준선을 유지합니다.",
  "App Volumes를 통한 애플리케이션 레이어 관리로 골든 이미지 변경 없이 애플리케이션 배포/업데이트가 가능합니다.",
  "Dynamic Environment Manager(DEM)로 사용자 프로파일 및 환경 설정을 비지속 VDI에서도 유지하며, 역할별 차등 정책 적용이 가능합니다.",
  "Workspace ONE Intelligence와의 연계로 사용자 행동 분석 기반의 동적 리소스 할당 및 이상 징후 탐지가 가능합니다.",
  "Horizon Console의 중앙 관리 대시보드를 통해 다중 Pod/사이트의 전체 VDI 환경을 단일 화면에서 모니터링합니다.",
];

// ---------------------------------------------------------------------------
// D) Competition attack/defense points (6 each)
// ---------------------------------------------------------------------------

const COMPETITION_ATTACK_POINTS: DefenseQAItem[] = [
  {
    question: "상대 제안의 DR 구성에서 RTO/RPO 목표값이 명시되어 있지 않습니다. 실제 재해 발생 시 복구 실효성을 어떻게 보장하겠습니까?",
    answer:
      "본 제안에서는 DR 설계 시 컴포넌트별 RTO/RPO를 명시하고, 연 1회 이상 실제 페일오버 전환 테스트 계획 및 결과 보고 체계를 제안서에 포함하였습니다.",
    evidence:
      "제안서 DR 설계 섹션 내 RTO/RPO 정의 표, 페일오버 테스트 시나리오 및 수행 일정 포함 여부 확인",
  },
  {
    question: "Storage IOPS 산정 근거가 제안서에 누락되어 있습니다. 피크 시나리오(boot storm 등)를 어떻게 반영했습니까?",
    answer:
      "사용자 프로파일별 IOPS 요구량을 산정하고, 부팅 폭주·안티바이러스 스캔·패치 배포 동시 발생 시나리오를 반영한 피크 IOPS 계산 근거를 제안서에 첨부하였습니다.",
    evidence:
      "스토리지 사이징 산출 근거 문서, 시뮬레이션 또는 벤더 레퍼런스 데이터 첨부 확인",
  },
  {
    question: "감사 데이터에 대한 불변 저장(Immutable/WORM) 구성이 보이지 않습니다. 감사 로그 위·변조 방지는 어떻게 처리합니까?",
    answer:
      "감사 로그 저장소에 WORM 정책 또는 외부 SIEM 연동을 통한 무결성 보장 방안을 제안에 포함하였으며, 로그 보존 기간과 접근 권한 통제 정책을 명시하였습니다.",
    evidence:
      "SIEM 연동 아키텍처 다이어그램, 감사 로그 보존 정책 문서, WORM 스토리지 또는 동등 수준 통제 방안 포함 여부",
  },
  {
    question: "Secure Gateway 이중 암호화 구성으로 인해 성능 저하와 운영 복잡성이 우려됩니다. 어떻게 대응하겠습니까?",
    answer:
      "게이트웨이 레이어에서의 SSL 오프로드 및 하드웨어 가속을 통해 암호화 처리 부하를 분산하고, 운영 복잡성은 중앙 관리 콘솔과 자동화된 인증서 갱신 체계로 최소화하는 방안을 제안하였습니다.",
    evidence:
      "게이트웨이 성능 사양서(SSL TPS 용량), 인증서 관리 자동화 도구 및 운영 절차서 포함 확인",
  },
  {
    question: "라이선스 산정이 실제 동시 접속자 수 대비 과소 책정된 것으로 보입니다. 추가 비용 발생 리스크는 어떻게 관리합니까?",
    answer:
      "최대 동시 접속 사용자 수 분석 결과를 기반으로 라이선스를 산정하였으며, 계약서에 사용자 증가 시 라이선스 확장 단가 및 조건을 사전 명시하여 예상치 못한 추가 비용 발생을 방지합니다.",
    evidence:
      "동시 접속 사용자 분석 데이터, 라이선스 모델 상세(CCU/Named/서브스크립션), 확장 옵션 계약 조건 포함 여부",
  },
  {
    question: "비지속(Non-persistent) VDI 환경에서 사용자 프로파일 관리 방안이 구체적이지 않습니다. 로그인 시간 지연 문제를 어떻게 해결합니까?",
    answer:
      "FSLogix/UPM 등 프로파일 컨테이너 솔루션을 적용하여 사용자 프로파일을 네트워크 공유에서 로컬 캐시로 전환하고, 로그인 시간 목표치(30초 이내)를 POC를 통해 검증한 결과를 제안서에 포함하였습니다.",
    evidence:
      "프로파일 관리 솔루션 아키텍처 문서, POC 로그인 시간 측정 결과(Before/After 비교), 운영 환경 적용 계획",
  },
];

const COMPETITION_DEFENSE_POINTS: DefenseQAItem[] = [
  {
    question: "본 제안의 DR 설계에서 RTO/RPO는 어떻게 정의하고 검증합니까?",
    answer:
      "애플리케이션 중요도별 RTO/RPO 등급(Tier 1: RTO 1시간 이내, RPO 4시간 이내 등)을 정의하고, 연 1회 계획된 페일오버 테스트를 통해 목표 달성 여부를 검증하며, 결과 보고서를 고객에게 제출합니다.",
    evidence:
      "제안서 내 RTO/RPO 정의 표, 연간 DR 테스트 계획서, 테스트 시나리오 및 성공 기준 명시 문서",
  },
  {
    question: "본 제안의 스토리지 IOPS 산정은 어떤 방법론으로 수행되었습니까?",
    answer:
      "사용자 프로파일(Knowledge Worker, Power User, Task Worker)별 Login VSI 또는 벤더 공식 사이징 도구를 활용하여 IOPS를 산정하고, 부팅 폭주 시 최대 3배 피크 계수를 적용하였습니다.",
    evidence:
      "Login VSI 또는 사이징 도구 산출 결과 보고서, 피크 IOPS 계산 근거 스프레드시트, 스토리지 벤더 사양 대비 여유율(20% 이상) 확인",
  },
  {
    question: "감사 로그의 무결성과 장기 보존은 어떻게 보장합니까?",
    answer:
      "감사 로그는 외부 SIEM(예: Splunk, QRadar)으로 실시간 전송하여 원본 시스템과 분리 보관하고, 로그 저장소에는 삭제 불가 정책(Retention Lock)을 적용합니다. 보존 기간은 컴플라이언스 요구사항에 따라 최소 1년 이상으로 설정합니다.",
    evidence:
      "SIEM 연동 아키텍처 다이어그램, Retention Lock 또는 WORM 설정 스크린샷, 감사 로그 보존 정책 문서",
  },
  {
    question: "게이트웨이 구성의 암호화 처리 성능과 운영 복잡성을 어떻게 관리합니까?",
    answer:
      "SSL 오프로드를 지원하는 하드웨어 어플라이언스 또는 소프트웨어 가속 기능을 활용하여 암호화 처리 부하를 분산합니다. 인증서 관리는 자동 갱신(Let's Encrypt 또는 내부 CA 연동)을 통해 운영 부담을 최소화합니다.",
    evidence:
      "게이트웨이 SSL TPS 성능 사양, 인증서 갱신 자동화 설정 화면, 운영 절차 간소화 사례(레퍼런스 또는 POC 결과)",
  },
  {
    question: "사용자 증가 시 라이선스 확장 비용은 어떻게 예측하고 통제합니까?",
    answer:
      "사용자 증가 시나리오별(10%, 20%, 50% 증가) 라이선스 추가 비용 시뮬레이션을 제안서에 포함하였으며, Enterprise Agreement 또는 ELA 방식으로 계약하여 단가 고정 및 예산 예측 가능성을 확보합니다.",
    evidence:
      "라이선스 확장 단가표, ELA/EA 계약 옵션 제안서, 3년 TCO 시나리오 분석 문서",
  },
  {
    question: "비지속 VDI에서 사용자 경험(로그인 시간, 환경 복원)을 어떻게 보장합니까?",
    answer:
      "FSLogix Profile Container를 적용하여 사용자 프로파일을 VHD(x) 파일로 관리하고, SMB Multichannel 지원 파일 서버에 저장하여 로그인 시간을 30초 이내로 유지합니다. POC 환경에서 측정된 Before/After 비교 데이터를 제안서에 첨부합니다.",
    evidence:
      "FSLogix 설정 문서, POC 로그인 시간 측정 결과(평균/최대값), 고가용성 파일 서버(DFS-R 또는 동등) 구성 아키텍처",
  },
];

// ---------------------------------------------------------------------------
// E) Citrix vs Omnissa comparison matrix (7 rows)
// ---------------------------------------------------------------------------

const COMPARISON_MATRIX: ComparisonRow[] = [
  {
    aspect: "접근 게이트웨이(외부접속)",
    citrix: "Citrix ADC(NetScaler) — L4/L7 부하분산, SSL 오프로드, WAF 통합",
    omnissa: "Unified Access Gateway(UAG) — DMZ 배치, Blast/PCoIP 터널링",
    neutral_note:
      "ADC는 다기능이나 별도 라이선스 필요, UAG는 기본 제공이나 기능 범위 제한",
  },
  {
    aspect: "세션 프로토콜",
    citrix:
      "HDX/ICA — EDT over UDP 적응형 전송, 고지연 환경 최적화, Thinwire+ 코덱",
    omnissa:
      "Blast Extreme — HEVC/H.264 적응형 코덱, UDP/TCP 이중 지원, 멀티미디어 최적화",
    neutral_note:
      "두 프로토콜 모두 적응형 전송을 지원하며, 실사용 환경 성능은 네트워크 조건과 워크로드에 따라 다를 수 있음",
  },
  {
    aspect: "구성요소 역할(브로커/게이트웨이)",
    citrix:
      "Delivery Controller(세션 브로커) + StoreFront(앱 스토어) + ADC(게이트웨이) 분리 구성",
    omnissa:
      "Connection Server(브로커+게이트웨이 통합) + UAG(외부 접속 전용) 구성",
    neutral_note:
      "Citrix는 역할 분리로 유연성 증가, Omnissa는 통합 구성으로 관리 단순화 — 조직 운영 역량에 따라 선택",
  },
  {
    aspect: "운영 포인트(패치/업그레이드/도구)",
    citrix:
      "Citrix Director(모니터링) + WEM(리소스 최적화) + MCS/PVS(이미지 관리) 통합 운영",
    omnissa:
      "Horizon Console(중앙 대시보드) + DEM(프로파일/환경 관리) + Instant Clone(이미지 관리)",
    neutral_note:
      "두 솔루션 모두 중앙화된 운영 도구를 제공하며, 기존 인프라 환경 및 운영팀 역량에 따라 학습 비용이 다름",
  },
  {
    aspect: "장애 대응 포인트(이중화/페일오버)",
    citrix:
      "Local Host Cache(LHC) — Connection Broker 장애 시에도 세션 지속, Zone Preference로 사이트 우선순위 지정",
    omnissa:
      "Cloud Pod Architecture(CPA) — 다중 Pod/사이트 글로벌 부하분산, Pod 장애 시 자동 세션 재라우팅",
    neutral_note:
      "LHC는 소규모 단일 사이트에 강점, CPA는 대규모 멀티사이트 환경에서 글로벌 HA 제공 — 사이트 수와 규모에 따라 선택",
  },
  {
    aspect: "라이선스 산정 리스크",
    citrix:
      "CCU(동시접속), Named User, Hybrid Rights(온프레미스+클라우드 혼용) 옵션 — 모델 복잡성 높음",
    omnissa:
      "Standard/Advanced/Enterprise/Universal 계층형 라이선스 — 기능 티어별 가격 차등",
    neutral_note:
      "두 벤더 모두 라이선스 모델이 복잡하므로 초기 계약 시 실제 사용 패턴 기반 정확한 산정과 확장 조건 명시가 필요",
  },
  {
    aspect: "공공 감사 대응 포인트",
    citrix:
      "Session Recording(세션 영상 녹화), SmartAccess(조건부 접근 정책), 감사 로그 연동",
    omnissa:
      "Horizon Compliance 기능, Carbon Black 연계 EDR, 세션 로그 및 이벤트 감사 추적",
    neutral_note:
      "공공기관 감사 요구사항(국정원 보안 가이드라인 등) 충족을 위해 두 솔루션 모두 추가 설정 및 문서화가 필요하며, 세션 녹화 기능 포함 여부는 라이선스 등급에 따라 다름",
  },
];

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function getVendorDefenseBlocks(
  input: VendorDefenseInput
): VendorDefenseBlocks {
  const {
    vendorTrack,
    haRequired,
    complianceLevel,
  } = input;

  // Build neutral baseline
  const neutral: string[] = [
    ...NEUTRAL_REQUIREMENTS,
    ...NEUTRAL_OPERATIONS,
    ...NEUTRAL_SECURITY,
    ...NEUTRAL_PERFORMANCE,
  ];

  // Conditionally append HA items
  if (haRequired) {
    neutral.push(...NEUTRAL_HA_SUPPLEMENT);
  }

  // If complianceLevel is high, security items are already present in
  // NEUTRAL_SECURITY (items 11–15). We duplicate emphasis by adding a
  // dedicated high-compliance annotation item.
  if (complianceLevel === "high") {
    neutral.push(
      "보안 컴플라이언스 수준이 높은 환경에서는 국정원 클라우드 보안 가이드라인 및 ISMS-P 요구사항에 대한 충족 여부를 제안서 내 별도 컴플라이언스 매핑 표로 제시합니다."
    );
    neutral.push(
      "고위험 컴플라이언스 환경에서는 접근 제어, 세션 모니터링, 감사 로그 보존 등 전 영역에 걸친 제3자 보안 감사(Penetration Test 결과 포함)를 제안 범위에 포함합니다."
    );
  }

  // Build vendor-specific blocks based on track
  const citrix: string[] =
    vendorTrack === "citrix" || vendorTrack === "other"
      ? [...CITRIX_BLOCKS]
      : [];

  const omnissa: string[] =
    vendorTrack === "omnissa" ||
    vendorTrack === "vmware" ||
    vendorTrack === "other"
      ? [...OMNISSA_BLOCKS]
      : [];

  return {
    neutral,
    citrix,
    omnissa,
    competition_attack_points: COMPETITION_ATTACK_POINTS,
    competition_defense_points: COMPETITION_DEFENSE_POINTS,
    comparison_matrix: COMPARISON_MATRIX,
  };
}
