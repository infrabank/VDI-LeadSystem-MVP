// VDI Sales Assurance Program — Template Library
// 벤더/네트워크 유형별 제안서 문구 및 Q&A 템플릿

import type { QAItem, ScoreDomain, VendorTrack, NetworkType } from "@/lib/types/sap";
import { DOMAIN_LABELS } from "@/lib/types/sap";

export interface TemplateContext {
  vendor_track: VendorTrack;
  network_type: NetworkType;
  user_count: number;
  site_count: number;
  ha_required: boolean;
  dr_required: boolean;
  backup_required: boolean;
  backup_retention_months: number | null;
  security_flags: Record<string, boolean>;
  domainScores: Record<ScoreDomain, number>;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export interface TemplateResult {
  proposalSnippets: string[];
  qaItems: QAItem[];
  riskParagraphs: string[];
}

// ---------- 벤더별 제안서 문구 ----------

const VENDOR_PROPOSAL_SNIPPETS: Record<VendorTrack, string[]> = {
  vmware: [
    "VMware Horizon은 업계 표준의 성숙된 VDI 플랫폼으로, vSphere 기반 인프라와의 완전한 통합을 통해 운영 일관성과 관리 효율성을 극대화합니다.",
    "VMware Workspace ONE과의 연계를 통해 제로 트러스트 기반의 통합 엔드포인트 관리 환경을 구성할 수 있으며, 이는 보안 컴플라이언스 요구사항을 효과적으로 충족합니다.",
    "VMware HCI(vSAN)를 활용한 하이퍼컨버지드 구성은 스토리지와 컴퓨트 자원의 통합 관리를 가능하게 하여 TCO 절감 및 확장성 향상에 기여합니다.",
    "VMware Blast Extreme 프로토콜은 고품질 멀티미디어 및 3D 그래픽 워크로드를 지원하며, 높은 네트워크 지연 환경에서도 우수한 사용자 경험을 제공합니다.",
    "NSX 네트워크 가상화 솔루션과의 통합을 통해 마이크로 세그멘테이션 기반의 고도화된 네트워크 보안 아키텍처를 구현할 수 있습니다.",
  ],
  citrix: [
    "Citrix Virtual Apps and Desktops는 다양한 애플리케이션 전달 방식(세션 기반, 가상 데스크탑, 게시 앱)을 단일 플랫폼에서 지원하여 유연한 엔드포인트 전략 구현이 가능합니다.",
    "Citrix HDX 기술은 압축 및 렌더링 최적화를 통해 저대역폭 환경에서도 고품질의 사용자 경험을 보장하며, 멀티미디어 리다이렉션 및 USB 디바이스 지원이 탁월합니다.",
    "Citrix ADC(NetScaler)를 활용한 부하 분산 및 SSL 오프로드 구성으로 안정적인 외부 접속 환경과 DDoS 대응 능력을 확보할 수 있습니다.",
    "Citrix Analytics for Performance를 통해 사용자 세션 경험을 실시간으로 측정하고, AI 기반의 이상 탐지 및 자동 최적화 기능으로 운영 부담을 최소화합니다.",
    "Citrix Cloud 전환 로드맵을 통해 온프레미스 투자를 보호하면서 클라우드 관리 레이어를 단계적으로 도입하는 하이브리드 전략을 권장합니다.",
  ],
  omnissa: [
    "Omnissa Horizon(구 VMware Horizon)은 멀티클라우드 VDI 전달의 선도적 플랫폼으로, Azure/AWS/GCP 및 온프레미스 환경을 단일 제어 평면에서 통합 관리합니다.",
    "Omnissa Horizon의 Smart Policies 기능을 통해 사용자 역할, 디바이스 유형, 접속 위치에 따른 세분화된 정책 적용이 가능하며, 제로 트러스트 아키텍처 구현을 지원합니다.",
    "Omnissa Workspace ONE Intelligence와의 연계로 사용자 행동 분석 기반의 동적 리소스 할당이 가능하여, 사용 패턴에 따른 인프라 비용 최적화 효과를 기대할 수 있습니다.",
    "Omnissa Horizon의 Instant Clone 기술은 골든 이미지에서 수 초 내 데스크탑 프로비저닝을 가능하게 하여, 대규모 사용자 환경에서의 부팅 폭주(boot storm) 문제를 해소합니다.",
    "Omnissa DEEM(Digital Employee Experience Management)을 통해 엔드포인트에서 백엔드까지 전체 사용자 경험 여정을 모니터링하고 선제적 문제 해결이 가능합니다.",
  ],
  microsoft: [
    "Microsoft Azure Virtual Desktop(AVD)은 Microsoft 365 라이선스와의 번들 혜택을 통해 Windows 11 멀티세션 및 Microsoft 365 앱 최적화 환경을 비용 효율적으로 제공합니다.",
    "Azure 클라우드 인프라를 활용하여 초기 CapEx 없이 OpEx 모델로 전환이 가능하며, 수요 변동에 따른 자동 스케일링으로 유휴 자원 비용을 최소화할 수 있습니다.",
    "Microsoft Entra ID(구 Azure AD)와의 네이티브 통합으로 SSO, MFA, 조건부 액세스 정책을 통한 제로 트러스트 보안 환경을 별도 솔루션 없이 구성할 수 있습니다.",
    "FSLogix 프로파일 컨테이너를 기본 포함하여 로그인 시간을 대폭 단축하고, OneDrive for Business와의 연계로 사용자 데이터의 클라우드 저장 및 동기화가 자동화됩니다.",
    "Microsoft Intune과의 통합을 통해 VDI 가상 머신 및 물리 엔드포인트를 단일 정책으로 관리할 수 있어 IT 운영팀의 관리 범위를 통일할 수 있습니다.",
  ],
  nutanix: [
    "Nutanix AHV 하이퍼바이저 기반의 HCI 플랫폼은 단일 클러스터에서 컴퓨트, 스토리지, 네트워크 자원을 통합 관리하여 VDI 인프라의 복잡성을 획기적으로 줄여줍니다.",
    "Nutanix Frame을 활용하면 온프레미스와 퍼블릭 클라우드(AWS, Azure, GCP)를 동시에 활용하는 하이브리드 VDI 환경을 단일 관리 포털로 운영할 수 있습니다.",
    "Nutanix AOS의 분산 스토리지 아키텍처는 로컬 I/O 최적화를 통해 VDI 부팅 폭주 및 안티바이러스 스캔으로 인한 I/O 폭증 문제를 효과적으로 완화합니다.",
    "Nutanix Prism Central의 AI 기반 용량 예측 기능을 통해 VDI 사용자 증가에 따른 인프라 확장 시점을 사전에 파악하고 선제적 투자 계획 수립이 가능합니다.",
    "Nutanix 플랫폼의 노드 단위 선형 확장 구조는 초기 투자를 최소화하고 비즈니스 성장에 맞춰 단계적으로 인프라를 확장할 수 있어 투자 위험을 분산합니다.",
  ],
  other: [
    "제안된 VDI 솔루션은 고객의 기술 요구사항과 예산 조건에 최적화된 아키텍처를 기반으로 설계되었으며, 표준 기술 프레임워크를 준수합니다.",
    "벤더 중립적 접근 방식을 통해 기존 인프라 투자를 최대한 활용하면서 VDI 환경으로의 원활한 전환을 지원합니다.",
    "오픈 스탠다드 기반의 솔루션 구성으로 벤더 종속성(vendor lock-in)을 최소화하고, 향후 솔루션 교체 또는 멀티벤더 전략 적용이 용이합니다.",
    "기술 성숙도와 레퍼런스를 검증하여 선정된 구성 요소들로 안정적인 VDI 환경을 구축하며, 전담 기술 지원 체계를 통해 운영 연속성을 보장합니다.",
  ],
};

// ---------- 네트워크 유형별 제안서 문구 ----------

const NETWORK_PROPOSAL_SNIPPETS: Record<NetworkType, string[]> = {
  on_premise: [
    "온프레미스 구성은 데이터 주권 및 규제 컴플라이언스 요구사항을 완전히 충족하며, 내부 네트워크 기반의 낮은 지연시간으로 최상의 사용자 경험을 제공합니다.",
    "물리 인프라에 대한 완전한 통제권을 확보하여 보안 정책 적용 및 감사 추적의 유연성이 높으며, 클라우드 의존성 없이 독립적인 운영이 가능합니다.",
  ],
  hybrid: [
    "하이브리드 아키텍처는 핵심 업무 시스템은 온프레미스에 유지하면서 유연성이 필요한 워크로드를 클라우드로 확장하는 최적의 전환 경로를 제공합니다.",
    "온프레미스와 클라우드 간의 일관된 관리 정책 적용을 위해 통합 ID 관리(SSO/MFA) 및 네트워크 보안 정책의 동기화가 필수적입니다.",
  ],
  cloud: [
    "클라우드 기반 VDI는 초기 자본 지출 없이 신속한 서비스 개시가 가능하며, 사용량 기반 과금 모델로 비용 예측성과 탄력성을 동시에 확보합니다.",
    "글로벌 클라우드 인프라를 활용하여 지역별 재해복구(DR) 사이트 구축 비용을 최소화하고, 지리적으로 분산된 사용자에게 최적의 접속 경험을 제공합니다.",
  ],
  multi_cloud: [
    "멀티클라우드 전략은 특정 클라우드 벤더의 서비스 장애로 인한 단일 장애점(SPOF)을 제거하고, 각 클라우드의 특화 서비스를 워크로드 특성에 맞게 선택적으로 활용합니다.",
    "클라우드 간 데이터 이동 비용(egress cost)과 네트워크 지연을 최소화하기 위한 워크로드 배치 전략 및 클라우드 게이트웨이 아키텍처 설계가 핵심 성공 요소입니다.",
  ],
};

// ---------- 도메인별 리스크 문구 ----------

function getDomainRiskParagraphs(
  domain: ScoreDomain,
  score: number,
  vendorTrack: VendorTrack
): string[] {
  const paras: string[] = [];
  const label = DOMAIN_LABELS[domain];

  if (score < 50) {
    paras.push(
      `[${label}] 점수 ${score}점 — 치명적 리스크: 해당 영역은 현재 제안에서 심각한 기술적 결함이 발견되었습니다. 수주 경쟁에서 직접적인 탈락 요인이 될 수 있으며, 즉각적인 보완이 요구됩니다.`
    );
  } else if (score < 65) {
    paras.push(
      `[${label}] 점수 ${score}점 — 주의 필요: 경쟁사 대비 열위에 있을 가능성이 높습니다. 고객 Q&A 과정에서 집중 질의를 받을 가능성이 높으므로 사전 대응 논리를 준비해야 합니다.`
    );
  }

  // 도메인별 벤더 특화 리스크 코멘트
  if (domain === "compute" && score < 70) {
    const vendorComments: Partial<Record<VendorTrack, string>> = {
      vmware: "VMware vSphere 클러스터의 오버커밋 비율 및 리소스 예약 설정을 재검토하고, DRS 규칙을 통한 VDI 워크로드 격리를 고려하십시오.",
      citrix: "Citrix Machine Catalog의 머신 유형(단일세션 OS vs. 멀티세션 OS) 선택 및 세션 호스트 사이징 산정 근거를 명확히 제시해야 합니다.",
      omnissa: "Horizon Pod 설계 및 Cloud Pod Architecture(CPA) 적용 여부를 재검토하고, Instant Clone 적용 시 부모 VM 리소스 할당 기준을 명시하십시오.",
      microsoft: "AVD 호스트 풀의 세션 한계(max session limit) 설정 및 자동 스케일링 정책 구성 계획을 제안서에 포함해야 합니다.",
      nutanix: "Nutanix AHV의 vCPU 오버커밋 비율과 메모리 압축(memory overcommit) 정책이 VDI 성능에 미치는 영향을 분석하여 제시하십시오.",
    };
    const comment = vendorComments[vendorTrack];
    if (comment) paras.push(comment);
  }

  if (domain === "storage" && score < 70) {
    const vendorComments: Partial<Record<VendorTrack, string>> = {
      vmware: "vSAN 정책(FTT, RAID 방식) 설정이 VDI 워크로드에 최적화되어 있는지 검토하고, 읽기 캐시 비율 및 중복제거/압축 적용 효과를 검증하십시오.",
      citrix: "Machine Creation Services(MCS) 또는 Provisioning Services(PVS) 사용 시 스토리지 I/O 패턴 분석 및 캐싱 전략을 명확히 제시해야 합니다.",
      nutanix: "Nutanix AOS의 CVM(Controller VM) 리소스 할당이 VDI 스토리지 I/O와 경쟁하지 않도록 사이징 검토가 필요합니다.",
    };
    const comment = vendorComments[vendorTrack];
    if (comment) paras.push(comment);
  }

  if (domain === "network" && score < 70) {
    paras.push(
      "VDI 프로토콜(HDX/Blast/PCoIP/RDP) 특성에 맞는 QoS 정책을 적용하고, 대역폭 시뮬레이션 결과를 제안서에 첨부하여 네트워크 충분성을 입증해야 합니다."
    );
  }

  if (domain === "ha_dr" && score < 70) {
    paras.push(
      "HA/DR 아키텍처의 RPO(복구 목표 시점)와 RTO(복구 목표 시간)를 구체적 수치로 제시하고, 해당 목표 달성을 위한 기술적 구성과 테스트 절차를 명시해야 합니다."
    );
  }

  if (domain === "backup" && score < 70) {
    paras.push(
      "백업 대상 범위(골든 이미지, 사용자 프로파일, 개인 데이터), 백업 주기, 보존 기간, 복구 절차를 구체적으로 정의하고 백업 솔루션과의 통합 방안을 제시해야 합니다."
    );
  }

  if (domain === "license" && score < 70) {
    paras.push(
      "라이선스 모델(동시 사용자/지정 사용자/디바이스) 선택 근거와 3년 TCO 비교 분석 결과를 제안서에 포함하고, 라이선스 초과 사용 시 패널티 조항을 고객에게 명확히 안내해야 합니다."
    );
  }

  return paras;
}

// ---------- Q&A 템플릿 (30~50개) ----------

function buildQAItems(ctx: TemplateContext): QAItem[] {
  const items: QAItem[] = [];

  // 카테고리: 라이선스 및 비용
  items.push(
    {
      category: "라이선스 및 비용",
      question: "VDI 라이선스 모델(동시 사용자 vs. 지정 사용자 vs. 디바이스)의 차이점과 당사 환경에 최적인 모델은 무엇인가요?",
      answer:
        "동시 사용자(CCU) 모델은 피크 동시 접속자 수 기준으로, 지정 사용자(Named User) 모델은 총 사용자 수 기준으로 비용이 산정됩니다. 교대 근무 환경처럼 동시 접속률이 낮은 경우 CCU가 유리하며, 상시 접속 사용자가 많은 경우 Named User가 비용 예측성이 높습니다. 실제 접속 패턴 데이터를 기반으로 시뮬레이션을 수행하여 최적 모델을 선택해야 합니다.",
    },
    {
      category: "라이선스 및 비용",
      question: "3년 TCO(총 소유 비용) 분석 결과를 제공할 수 있나요? 기존 PC 환경 대비 어느 정도의 비용 절감이 예상되나요?",
      answer:
        "TCO 분석에는 초기 하드웨어/소프트웨어 투자(CapEx), 연간 유지보수/구독료, 운영 인력 비용, 전력/공간 비용, 엔드포인트 교체 비용이 포함됩니다. 일반적으로 VDI 전환 시 엔드포인트 하드웨어 비용 절감(씬클라이언트 수명 7~10년)과 IT 운영 효율화로 3년 기준 15~30% TCO 절감이 가능합니다.",
    },
    {
      category: "라이선스 및 비용",
      question: "소프트웨어 어슈어런스(SA) 또는 구독 라이선스 전환 시 기존 라이선스 자산은 어떻게 처리되나요?",
      answer:
        "기존 영구 라이선스(Perpetual License)와 SA를 보유한 경우, 벤더별 업그레이드 경로 및 트레이드인(trade-in) 프로그램을 통해 구독 모델로 전환하는 비용 최적화 방안이 존재합니다. 현보유 라이선스 목록과 만료일을 확인하여 전환 타이밍을 설계하는 것이 중요합니다.",
    }
  );

  // 카테고리: 아키텍처 및 설계
  items.push(
    {
      category: "아키텍처 및 설계",
      question: `사용자 ${ctx.user_count}명 규모에 적합한 서버 사이징(CPU/메모리/스토리지) 기준은 무엇인가요?`,
      answer:
        "사용자 프로파일(태스크 워커: 2vCPU/2GB, 지식 근로자: 4vCPU/4GB, 파워 유저: 8vCPU/8GB)별 리소스 요구량을 산정한 후, 동시 접속률(일반적으로 80~90%), vCPU 오버커밋 비율(4:1~6:1), 메모리 오버커밋 비율(1.2:1~1.5:1)을 반영하여 최종 사이징을 산출합니다.",
    },
    {
      category: "아키텍처 및 설계",
      question: "VDI 이미지 관리 전략(골든 이미지, 레이어드 이미지, 지속/비지속 방식)은 어떻게 계획하고 있나요?",
      answer:
        "비지속(Non-persistent) VDI는 보안성과 관리 효율성이 높으나 사용자 개인화 수준이 제한됩니다. FSLogix 또는 UPM을 통한 프로파일 분리로 비지속 환경에서도 개인화 경험을 제공할 수 있습니다. 업무 특성상 로컬 설치가 필요한 애플리케이션이 있는 경우 앱 레이어링 솔루션 도입을 검토해야 합니다.",
    },
    {
      category: "아키텍처 및 설계",
      question: "CPU 집약적인 렌더링 또는 엔지니어링 소프트웨어 사용자를 위한 GPU 가상화 계획은 있나요?",
      answer:
        "NVIDIA GRID/vGPU 또는 AMD MxGPU를 활용하여 CAD, 3D 렌더링, 영상 편집 등 GPU 집약적 워크로드를 가상화할 수 있습니다. vGPU 프로파일 선택(Q 시리즈: 그래픽, C 시리즈: 컴퓨트)과 물리 GPU 공유 정책을 워크로드 특성에 맞게 설계해야 합니다.",
    },
    {
      category: "아키텍처 및 설계",
      question: "스토리지 아키텍처에서 읽기 캐시 및 쓰기 가속 전략은 어떻게 구성되어 있나요?",
      answer:
        "VDI 환경은 부팅 폭주(boot storm) 및 안티바이러스 스캔 시 높은 읽기 I/O를 발생시킵니다. 올플래시(All-Flash) 스토리지 또는 HCI의 분산 캐시 계층을 통해 이를 완화할 수 있으며, 중복제거(deduplication) 및 압축(compression)을 적용하여 스토리지 효율을 50~80% 향상시킬 수 있습니다.",
    }
  );

  // 카테고리: 네트워크
  items.push(
    {
      category: "네트워크",
      question: "VDI 프로토콜(HDX/PCoIP/Blast Extreme/RDP) 선택 기준과 네트워크 대역폭 요구사항은 어떻게 산정했나요?",
      answer:
        "사용자 업무 유형에 따라 프로토콜별 권장 대역폭이 상이합니다. 일반 업무 기준 ICA/HDX 100~150Kbps, Blast Extreme 100~200Kbps, PCoIP 150~250Kbps가 필요하며, 멀티미디어 재생 또는 화상회의 시 500Kbps~2Mbps까지 증가합니다. QoS 정책을 통한 VDI 트래픽 우선순위 지정이 필수적입니다.",
    },
    {
      category: "네트워크",
      question: "외부(재택/모바일) 접속 시 보안 접속 방안(게이트웨이, SSL, Zero Trust)은 어떻게 구성되나요?",
      answer:
        "외부 접속 시 게이트웨이(Citrix ADC, Unified Access Gateway, Azure Application Gateway 등)를 통한 SSL 암호화 연결이 기본입니다. Zero Trust Network Access(ZTNA) 적용 시 사용자 신원, 디바이스 상태, 접속 위치를 복합 검증하여 세션별 동적 권한 부여가 가능합니다.",
    }
  );

  if (ctx.site_count > 1) {
    items.push({
      category: "네트워크",
      question: `${ctx.site_count}개 사이트 간 VDI 트래픽 분산 및 지역별 게이트웨이 구성 방안은 무엇인가요?`,
      answer:
        "사이트별 로컬 Connection Broker 배치(Local Hosting) 또는 중앙 집중식 구성(Central Hosting) 중 사이트 간 WAN 대역폭과 지연시간을 기반으로 최적 아키텍처를 선택해야 합니다. Cloud Pod Architecture(CPA) 또는 Global Traffic Manager를 활용한 지역별 부하 분산 구성을 권장합니다.",
    });
  }

  // 카테고리: HA/DR
  if (ctx.ha_required) {
    items.push(
      {
        category: "HA/DR",
        question: "Connection Broker 이중화 및 자동 페일오버 구성 방안은 무엇인가요?",
        answer:
          "Connection Broker는 Active-Active 또는 Active-Passive 이중화 구성이 가능합니다. 부하 분산 장치(L4/L7 LB)를 통해 헬스 체크 기반의 자동 페일오버를 구성하며, 세션 상태 정보는 공유 데이터베이스 또는 분산 캐시에 저장하여 세션 연속성을 보장해야 합니다.",
      },
      {
        category: "HA/DR",
        question: "하이퍼바이저 레이어에서의 HA 구성(클러스터 HA, vMotion/Live Migration)은 어떻게 계획되어 있나요?",
        answer:
          "하이퍼바이저 클러스터 HA를 통해 호스트 장애 시 가상머신 자동 재시작이 가능합니다. VDI VM의 HA 우선순위(priority)를 설정하여 인프라 VM보다 VDI VM이 우선 복구되도록 구성하고, 리소스 예약(Admission Control)으로 HA 용량을 항상 확보해야 합니다.",
      }
    );
  }

  if (ctx.dr_required) {
    items.push(
      {
        category: "HA/DR",
        question: "DR 사이트 구성 시 RPO/RTO 목표치와 달성 방안을 구체적으로 제시해 주세요.",
        answer:
          "RPO(복구 목표 시점)는 데이터 복제 방식(동기: 0초, 비동기: 분~시간 단위)에 따라 결정되며, RTO(복구 목표 시간)는 DR 사이트 VM 기동, 서비스 연동 복구, 사용자 접속 재개까지의 전체 시간입니다. RPO 15분/RTO 2시간 기준의 일반적 DR 시나리오부터 RPO 0초/RTO 15분의 고가용성 시나리오까지 다양한 등급별 설계가 가능합니다.",
      },
      {
        category: "HA/DR",
        question: "연간 DR 훈련 계획과 실제 DR 전환 시 사용자 영향을 최소화하는 방안은 무엇인가요?",
        answer:
          "DR 훈련은 최소 연 1회(이상적으로 반기 1회) 실시하며, 프로덕션 서비스에 영향 없이 DR 사이트만으로 격리된 환경에서 훈련을 진행합니다. 자동화된 DR 오케스트레이션 도구(VMware Site Recovery Manager, Zerto 등)를 활용하면 클릭 몇 번으로 페일오버/페일백이 가능합니다.",
      }
    );
  }

  // 카테고리: 백업
  if (ctx.backup_required) {
    const retention = ctx.backup_retention_months
      ? `${ctx.backup_retention_months}개월`
      : "미정";
    items.push(
      {
        category: "백업",
        question: `백업 대상 범위(골든 이미지, 사용자 프로파일, 개인 데이터)와 보존 기간(${retention}) 정책을 어떻게 정의하고 있나요?`,
        answer:
          "골든 이미지는 패치/업데이트 적용 전후 스냅샷으로 관리하며, 최소 3세대 보존을 권장합니다. 사용자 프로파일 및 개인 데이터는 일 1회 이상 증분 백업을 실시하고, 규제 요구사항에 따라 장기 보존(아카이빙) 정책을 별도 정의해야 합니다.",
      },
      {
        category: "백업",
        question: "백업 솔루션의 VDI 플랫폼 통합 수준과 애플리케이션 일관성 백업 지원 여부를 확인해 주세요.",
        answer:
          "Veeam, Commvault, Veritas 등 주요 백업 솔루션은 VMware/Hyper-V/Nutanix와의 API 통합을 통해 어플리케이션 일관성(Application-Consistent) 스냅샷을 지원합니다. VSS(Volume Shadow Copy Service) 또는 Quiesce 기능을 활용하여 데이터베이스 및 파일 시스템의 정합성을 보장해야 합니다.",
      }
    );
  }

  // 카테고리: 보안
  const secFlags = ctx.security_flags;
  const hasSecurityRequirements = Object.values(secFlags).some(Boolean);

  if (hasSecurityRequirements || true) {
    items.push(
      {
        category: "보안",
        question: "VDI 환경에서 데이터 유출 방지(DLP) 및 USB 디바이스 제어 정책은 어떻게 구성되나요?",
        answer:
          "VDI 플랫폼의 정책 기능을 통해 USB 저장 디바이스 차단, 클립보드 복사 방향 제어(양방향/단방향/차단), 화면 캡처 차단, 프린터 매핑 제한 등을 세부적으로 제어할 수 있습니다. 업무 역할별 차등 정책 적용으로 보안과 사용 편의성을 균형 있게 설계해야 합니다.",
      },
      {
        category: "보안",
        question: "멀티팩터 인증(MFA) 연동 방안과 지원되는 인증 수단(OTP, FIDO2, 스마트카드 등)은 무엇인가요?",
        answer:
          "VDI 게이트웨이 레이어에서 RADIUS, SAML, OIDC 프로토콜을 통해 외부 MFA 솔루션(Microsoft Entra MFA, Google Authenticator, Duo Security 등)과 연동이 가능합니다. FIDO2/WebAuthn 지원 시 패스워드리스(Passwordless) 인증 환경 구현이 가능합니다.",
      },
      {
        category: "보안",
        question: "네트워크 마이크로 세그멘테이션 적용 시 VDI VM 간 측면 이동(Lateral Movement) 차단 방안은 무엇인가요?",
        answer:
          "NSX-T 또는 클라우드 네이티브 보안 그룹(Security Groups)을 활용하여 VDI VM 간 불필요한 통신을 차단하는 마이크로 세그멘테이션을 적용합니다. 사용자 그룹별 VDI VM을 별도 보안 구역(Segment)으로 격리하고, 필요한 서비스 포트만 명시적으로 허용하는 화이트리스트 정책을 적용합니다.",
      }
    );
  }

  // 카테고리: 운영 및 관리
  items.push(
    {
      category: "운영 및 관리",
      question: "VDI 사용자 경험(EUEM) 모니터링 도구와 성능 기준선(Baseline) 설정 계획은 어떻게 되나요?",
      answer:
        "ControlUp, Liquidware Stratusphere, Goliath Technologies 등 VDI 전문 모니터링 도구를 통해 로그인 시간, 세션 지연, 애플리케이션 응답 시간 등 사용자 체감 성능 지표(EUEM)를 실시간 측정합니다. 파일럿 단계에서 기준선을 설정하고 이상 탐지 임계값을 정의해야 합니다.",
    },
    {
      category: "운영 및 관리",
      question: "VDI 이미지 패치 및 업데이트 관리 프로세스와 무중단 패치 적용 방안은 무엇인가요?",
      answer:
        "Rolling Update 방식으로 전체 VDI VM을 동시에 패치하지 않고 일부씩 순차 적용하여 서비스 연속성을 유지합니다. 비지속 VDI의 경우 골든 이미지만 업데이트하면 재부팅 시 모든 VM에 자동 반영되어 관리 부담이 최소화됩니다.",
    },
    {
      category: "운영 및 관리",
      question: "1, 2, 3차 기술 지원 체계와 헬프데스크 연동 방안은 어떻게 구성되나요?",
      answer:
        "1차: 헬프데스크(기본 세션 재시작, 비밀번호 재설정, 표준 문의 대응), 2차: VDI 운영팀(이미지 관리, 용량 증설, 정책 변경), 3차: 벤더 기술 지원(버그 수정, 심층 분석)으로 에스컬레이션 체계를 구성합니다. ITSM 도구(ServiceNow, Jira 등)와 연동하여 티켓 추적 및 SLA 관리를 자동화합니다.",
    },
    {
      category: "운영 및 관리",
      question: "VDI 환경에서 프린터 드라이버 관리 및 유니버설 프린터 드라이버 적용 방안은 무엇인가요?",
      answer:
        "벤더 제공 유니버설 프린터 드라이버(Citrix UPD, VMware ThinPrint 등)를 적용하면 수백 종의 프린터를 단일 드라이버로 지원 가능합니다. 클라이언트 프린터 자동 매핑 정책과 세션별 기본 프린터 설정을 조합하여 사용자 편의성을 확보해야 합니다.",
    }
  );

  // 카테고리: 마이그레이션
  items.push(
    {
      category: "마이그레이션",
      question: "기존 PC 환경에서 VDI로의 마이그레이션 전략과 단계별 전환 계획은 어떻게 수립되어 있나요?",
      answer:
        "파일럿(10~20명 선도 그룹) → 1단계 전환(20~30% 사용자, 저위험 부서) → 2단계 전환(50% 사용자, 핵심 부서) → 전사 완료의 단계적 전환을 권장합니다. 각 단계 전환 전 애플리케이션 호환성 테스트, 성능 검증, 사용자 교육을 완료해야 합니다.",
    },
    {
      category: "마이그레이션",
      question: "마이그레이션 중 기존 PC와 VDI 병행 운영 기간과 롤백(rollback) 시나리오는 계획되어 있나요?",
      answer:
        "일반적으로 4~8주의 병행 운영 기간을 두어 사용자 적응과 문제 해결 시간을 확보합니다. 롤백 시나리오는 VDI 전환 후 심각한 애플리케이션 호환성 문제 또는 성능 이슈 발생 시 기존 PC로 복귀하는 절차를 사전에 정의하고 문서화해야 합니다.",
    },
    {
      category: "마이그레이션",
      question: "사용자 수용성 향상을 위한 교육 및 변화 관리(Change Management) 계획은 어떻게 됩니까?",
      answer:
        "최종 사용자 교육(VDI 클라이언트 사용법, 프린터/USB 정책, 세션 재연결 방법), IT 운영자 기술 이전(관리 콘솔 운영, 트러블슈팅), 핵심 사용자(Power User) 대상 심화 교육의 3단계 교육 체계를 운영합니다. 변화 저항을 줄이기 위해 초기 파일럿 그룹을 VDI 홍보 대사로 활용하는 전략이 효과적입니다.",
    }
  );

  // 카테고리: 성능 및 사용자 경험
  items.push(
    {
      category: "성능 및 사용자 경험",
      question: "VDI 세션 로그인 시간 목표치와 이를 달성하기 위한 최적화 방안은 무엇인가요?",
      answer:
        "세션 로그인 시간 목표는 일반적으로 20초 이내(그룹 정책 최적화 기준)입니다. FSLogix 프로파일 컨테이너 적용으로 50~70% 로그인 시간 단축이 가능하며, 스타트업 스크립트 최적화, 그룹 정책 필터링, 프리론치(Pre-launch) 세션 기능을 조합하여 추가 개선이 가능합니다.",
    },
    {
      category: "성능 및 사용자 경험",
      question: "VDI 환경에서 화상회의(Zoom/Teams/Webex) 최적화 방안과 클라이언트 오프로딩 지원 여부는 어떻게 되나요?",
      answer:
        "Citrix HDX RealTime Optimization Pack, VMware Blast Media Optimization, Microsoft Teams AVD 최적화 등 벤더별 전용 최적화 플러그인을 통해 화상회의 오디오/비디오 처리를 VDI 서버에서 클라이언트 엔드포인트로 오프로딩합니다. 이를 통해 서버 CPU 부하를 70~80% 절감하고 화상회의 품질을 향상시킬 수 있습니다.",
    },
    {
      category: "성능 및 사용자 경험",
      question: "씬 클라이언트 또는 제로 클라이언트 엔드포인트의 현재 VDI 솔루션 호환성과 지원 수명 주기는 어떻게 됩니까?",
      answer:
        "주요 씬 클라이언트 벤더(HP/IGEL/Stratodesk/WYSE)의 최신 펌웨어 기반 장치는 대부분 현재 VDI 솔루션을 지원합니다. 엔드포인트 교체 없이 기존 PC에 IGEL OS 또는 Stratodesk NoTouch를 설치하여 씬 클라이언트로 전환하는 방안도 비용 절감 대안으로 고려할 수 있습니다.",
    }
  );

  // 카테고리: POC 및 수주 전략
  items.push(
    {
      category: "POC 및 수주 전략",
      question: "POC(기술검증) 범위, 기간, 성공 기준을 어떻게 정의하고 있나요?",
      answer:
        "POC 범위: 핵심 사용 시나리오 3~5개(일반 업무, 화상회의, 특수 애플리케이션), 대표 사용자 그룹 5~10명, 4~6주 기간을 권장합니다. 성공 기준: 로그인 시간 20초 이내, 세션 안정성 99.5% 이상, 사용자 만족도 4/5점 이상으로 정량적 기준을 사전 합의해야 합니다.",
    },
    {
      category: "POC 및 수주 전략",
      question: "레퍼런스 고객 방문 또는 케이스 스터디 자료를 제공할 수 있나요?",
      answer:
        "동종 업계 또는 유사 규모의 VDI 구축 레퍼런스를 보유하고 있으며, 고객 동의 하에 방문 견학 또는 화상 인터뷰를 주선할 수 있습니다. 구체적인 성과 지표(로그인 시간 단축률, 운영 비용 절감액, 사용자 만족도 점수)를 포함한 케이스 스터디를 제출할 수 있습니다.",
    },
    {
      category: "POC 및 수주 전략",
      question: "경쟁 솔루션 대비 당사 제안의 차별화 포인트를 핵심 3가지로 요약하면 무엇인가요?",
      answer:
        "①기술 성숙도 및 레퍼런스: 동일 벤더 트랙의 국내외 구축 경험과 인증된 기술 역량, ②통합 관리 효율성: 단일 관리 콘솔 기반의 운영 자동화로 IT 운영 부담 최소화, ③TCO 최적화: 라이선스 모델 최적화 및 인프라 효율화를 통한 3년 TCO 절감 시뮬레이션 제시.",
    }
  );

  // 도메인별 저점 Q&A
  const DOMAINS: ScoreDomain[] = ["compute", "storage", "network", "ha_dr", "backup", "license"];
  for (const domain of DOMAINS) {
    const score = ctx.domainScores[domain] ?? 100;
    if (score < 60) {
      const label = DOMAIN_LABELS[domain];
      items.push({
        category: "도메인별 기술 질의",
        question: `${label} 영역 점수(${score}점)가 낮게 평가된 구체적 이유와 개선 방안은 무엇인가요?`,
        answer:
          `${label} 영역에서 현재 제안 내용에 기술적 보완이 필요한 사항이 식별되었습니다. 구체적인 미흡 사항을 보완하고, 경쟁사 대비 동등 수준 이상의 기술 역량을 입증하는 추가 자료를 제출해야 합니다. 상세 내용은 도메인별 세부 분석 섹션을 참조하십시오.`,
      });
    }
  }

  return items;
}

// ---------- 리스크 플래그 생성 ----------

function buildRiskFlags(ctx: TemplateContext): string[] {
  const flags: string[] = [];
  const scores = ctx.domainScores;

  if ((scores.ha_dr ?? 100) < 50) flags.push("HA/DR 점수 50 미만 — 수주 탈락 위험");
  if ((scores.backup ?? 100) < 50) flags.push("백업 점수 50 미만 — 데이터 보호 결함");
  if ((scores.compute ?? 100) < 50) flags.push("컴퓨트 점수 50 미만 — 사이징 재검토 필요");
  if ((scores.storage ?? 100) < 50) flags.push("스토리지 점수 50 미만 — I/O 성능 위험");
  if ((scores.network ?? 100) < 50) flags.push("네트워크 점수 50 미만 — 대역폭/QoS 미흡");
  if ((scores.license ?? 100) < 50) flags.push("라이선스 점수 50 미만 — 비용 구조 재검토 필요");

  if (ctx.backup_required && (scores.backup ?? 100) < 70) {
    flags.push("백업 요구사항 명시됐으나 백업 점수 70 미만");
  }
  if (ctx.ha_required && (scores.ha_dr ?? 100) < 70) {
    flags.push("HA 요구사항 명시됐으나 HA/DR 점수 70 미만");
  }
  if (ctx.dr_required && (scores.ha_dr ?? 100) < 70) {
    flags.push("DR 요구사항 명시됐으나 HA/DR 점수 70 미만");
  }
  if (!ctx.backup_required) {
    flags.push("백업 미설정 — 데이터 손실 리스크 존재");
  }
  if (ctx.user_count > 500 && (scores.compute ?? 100) < 70) {
    flags.push(`대규모 사용자(${ctx.user_count}명) 환경에서 컴퓨트 점수 70 미만`);
  }
  if (ctx.site_count > 2 && (scores.network ?? 100) < 70) {
    flags.push(`다중 사이트(${ctx.site_count}개) 환경에서 네트워크 점수 70 미만`);
  }
  if (ctx.network_type === "multi_cloud" && (scores.network ?? 100) < 75) {
    flags.push("멀티클라우드 환경에서 네트워크 점수 75 미만 — 클라우드 간 연동 리스크");
  }

  return flags;
}

// ---------- 메인 selectTemplates ----------

export function selectTemplates(ctx: TemplateContext): TemplateResult {
  const proposalSnippets: string[] = [
    ...VENDOR_PROPOSAL_SNIPPETS[ctx.vendor_track],
    ...NETWORK_PROPOSAL_SNIPPETS[ctx.network_type],
  ];

  const riskParagraphs: string[] = [];
  const DOMAINS: ScoreDomain[] = ["compute", "storage", "network", "ha_dr", "backup", "license"];
  for (const domain of DOMAINS) {
    const score = ctx.domainScores[domain] ?? 100;
    const paras = getDomainRiskParagraphs(domain, score, ctx.vendor_track);
    riskParagraphs.push(...paras);
  }

  const qaItems = buildQAItems(ctx);

  return { proposalSnippets, qaItems, riskParagraphs };
}
