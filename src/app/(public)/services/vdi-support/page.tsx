import type { Metadata } from "next";
import Link from "next/link";
import { companyLegal } from "@/lib/site-config";
import { breadcrumbLd, faqPageLd, serviceLd, type FaqItem } from "@/lib/schema";
import { RelatedTools } from "../RelatedTools";

const PHONE_TEL = `tel:${companyLegal.phone.replace(/-/g, "")}`;

const engagements = [
  "중앙행정기관 VDI 구축·운영·유지보수 지원",
  "정부출연연구기관 Horizon 유지보수",
  "공공기관 망분리 VDI 환경 지원",
  "VDI 스토리지 이관, UAG·Gateway 접속장애 대응",
];

export const metadata: Metadata = {
  alternates: { canonical: "/services/vdi-support" },
  title: "Citrix·Omnissa Horizon VDI 기술지원: 접속장애·프로파일·인증서 원인 분석",
  description:
    "Citrix VDA 등록 오류, Horizon UAG 접속 오류, FSLogix 로그인 지연, 인증서 교체 후 장애 등 VDI 운영장애의 원인을 사용자 단말부터 스토리지까지 한 기준으로 분석합니다. 공공기관 VDI 기술지원 경험, 장애보고서·작업계획서 작성 가능. 계약 없이 단발 지원 가능.",
};

const includes = [
  "Citrix Virtual Apps and Desktops 기술지원",
  "Omnissa Horizon 기술지원",
  "VMware vSphere / ESXi / vCenter 연계 이슈 분석",
  "UAG·Gateway·인증서·DNS 점검",
  "FSLogix·Citrix Profile Management 점검",
  "VDA·Agent·Client 이슈 확인",
  "마스터 이미지·Clone·Recompose 이슈 확인",
  "장애보고서·작업계획서·완료보고서 작성",
];

/**
 * 증상 중심 장애 시나리오 — 운영 담당자가 "내 문제"로 인식하도록 실제 증상 언어로 구성.
 * 각 항목: 증상 / 진단 범위 / 원인 구분 / 조치·산출물 / 문의 시 필요한 최소 정보.
 */
interface SymptomCase {
  symptom: string;
  scope: string;
  causes: string;
  deliverables: string;
  minInfo: string;
}

const symptomCases: SymptomCase[] = [
  {
    symptom: "Horizon 또는 Citrix 접속이 간헐적으로 실패합니다",
    scope: "UAG/Gateway 세션 로그, Connection Server·Delivery Controller 상태, DNS 응답, 인증서 체인, 부하분산 구성",
    causes: "게이트웨이 세션 한도·타임아웃, DNS 라운드로빈 불일치, 인증서 만료 임박, 백엔드 브로커 리소스 부족",
    deliverables: "원인 구분 결과와 조치 방향 정리, 필요 시 장애보고서",
    minInfo: "제품·버전, 실패 빈도(항상/간헐), 내부·외부 어느 쪽에서 실패하는지",
  },
  {
    symptom: "UAG·NetScaler·Gateway 외부 접속이 되지 않습니다",
    scope: "방화벽·NAT 경로, TLS 인증서 체인, UAG/NetScaler 구성·터널 상태, 백엔드 브로커 연동",
    causes: "인증서 체인 누락, 포트·프로토콜(443/4172/8443 등) 차단, 게이트웨이-브로커 페어링 오류",
    deliverables: "구간별 점검 결과, 설정 변경안 또는 변경 작업계획서",
    minInfo: "게이트웨이 제품·버전, 외부 도메인, 최근 변경 이력(인증서·방화벽·업그레이드)",
  },
  {
    symptom: "인증서 교체 후 접속 오류가 발생합니다",
    scope: "인증서 체인·SAN 구성, 게이트웨이·브로커·VDA 각 구간의 인증서 적용 상태, 클라이언트 신뢰 저장소",
    causes: "중간 인증서 누락, SAN 불일치, 일부 구간만 교체되어 체인 불일치, 인증서 고정(pinning)·Thumbprint 미갱신",
    deliverables: "구간별 인증서 적용 점검 결과, 재교체 절차서",
    minInfo: "교체한 인증서 범위(어느 서버), 오류 메시지 캡처",
  },
  {
    symptom: "사용자 로그인 시간이 길어졌습니다",
    scope: "로그온 단계별 소요(브로커 연결→프로파일 로드→정책 적용→셸 기동), GPO·스크립트, 스토리지 응답",
    causes: "프로파일 비대화, GPO·로그온 스크립트 지연, 스토리지 IOPS 부족, 안티바이러스 스캔 간섭",
    deliverables: "로그온 단계별 분석 결과와 개선 우선순위",
    minInfo: "체감 지연 시간, 전체·일부 사용자 여부, 최근 변경 사항",
  },
  {
    symptom: "FSLogix 또는 Citrix Profile Management 프로파일이 로드되지 않습니다",
    scope: "프로파일 컨테이너(VHD/VHDX) 잠금·경로, 파일서버 권한·용량, 정책 충돌, 이벤트 로그",
    causes: "VHD 잠금(이전 세션 미정리), SMB 경로·권한 문제, 프로파일 정책 중복 적용, 디스크 용량 부족",
    deliverables: "프로파일 구조 점검 결과, 재발 방지 설정 정리",
    minInfo: "프로파일 방식(FSLogix/CPM), 오류 이벤트 ID, 특정 사용자·전체 여부",
  },
  {
    symptom: "VDA·Agent가 등록되지 않습니다",
    scope: "VDA-브로커 통신(포트·DNS·시간동기), 도메인 가입 상태, 마스터 이미지 Agent 버전, 방화벽",
    causes: "DNS 역방향 조회 실패, 브로커 주소 설정 오류, Agent-브로커 버전 비호환, 이미지 봉인 문제",
    deliverables: "등록 실패 원인 구분, 이미지·배포 수정 절차",
    minInfo: "브로커·Agent 버전, 신규 배포·기존 머신 여부, 등록 오류 로그",
  },
  {
    symptom: "Instant Clone·MCS·PVS 배포가 실패합니다",
    scope: "vCenter 권한·리소스, 마스터 이미지 상태, 배포 로그, 데이터스토어 여유, 네트워크 프로파일",
    causes: "vCenter 권한 변경, 데이터스토어 부족, 이미지 스냅샷 체인 문제, 템플릿-호스트 버전 비호환",
    deliverables: "배포 실패 지점 구분, 이미지 정비·재배포 계획",
    minInfo: "배포 방식(IC/MCS/PVS), 실패 단계 메시지, 최근 vCenter·이미지 변경 여부",
  },
  {
    symptom: "vCenter·ESXi 업그레이드 후 VDI 연동에 문제가 생겼습니다",
    scope: "vCenter-브로커 API 호환성, 호스트·VM 하드웨어 버전, 인증서 갱신 여부, 배포 파이프라인",
    causes: "브로커가 지원하지 않는 vSphere 버전, 업그레이드 시 인증서 재발급으로 연동 끊김, 권한 계정 잠김",
    deliverables: "호환성 검토 결과, 연동 복구 절차 또는 롤백계획서",
    minInfo: "업그레이드 전후 버전(vCenter·ESXi·브로커), 증상 시작 시점",
  },
  {
    symptom: "전체 VDI가 느려졌습니다 (스토리지·네트워크 병목 의심)",
    scope: "데이터스토어 지연시간·IOPS, 호스트 CPU/메모리 오버커밋, 네트워크 대역·재전송률, 안티바이러스 정책",
    causes: "스토리지 지연 증가, 특정 호스트 편중, 백업·스캔 작업과 업무시간 중첩, 오버커밋 초과",
    deliverables: "병목 구간 분석 결과와 개선 우선순위 정리",
    minInfo: "느려진 시점·시간대, 전체·일부 사용자 여부, 스토리지 구성 개요",
  },
  {
    symptom: "라이선스 서버 또는 벤더 정책 변경으로 운영에 문제가 생겼습니다",
    scope: "라이선스 서버 상태·만료일, 제품 구독 전환 영향(Citrix·VMware·Omnissa 정책 변경), 버전 지원 종료 일정",
    causes: "라이선스 만료·모델 변경, 구독 전환에 따른 기능 제한, EOL 버전 사용",
    deliverables: "영향 범위 정리와 전환·갱신 검토안",
    minInfo: "제품·라이선스 형태, 받은 공지·오류 메시지",
  },
  {
    symptom: "구축업체가 철수했고 기술 문서가 남아 있지 않습니다",
    scope: "현행 구성 역분석(서버·네트워크·인증서·백업), 계정·라이선스 현황, 운영 위험 요소",
    causes: "해당 없음 (장애가 아닌 운영 인수 상황)",
    deliverables: "현행 구성도·운영 문서 재작성, 인수 점검 보고서",
    minInfo: "환경 개요(제품·규모), 접근 가능한 계정 범위",
  },
  {
    symptom: "장애 원인을 벤더·네트워크·서버 업체가 서로 떠넘깁니다",
    scope: "사용자 단말부터 스토리지까지 전체 흐름을 한 기준으로 재현·구간 분리",
    causes: "복합 원인(어느 한 업체 관점에서는 정상으로 보이는 경우)",
    deliverables: "구간별 판정 근거를 담은 장애보고서로 책임 구간을 데이터로 구분",
    minInfo: "각 업체가 확인한 내용, 재현 조건",
  },
];

/** E2E 분석 흐름 — VDI 장애는 한 제품만의 문제가 아님 */
const analysisFlow = [
  "사용자 단말",
  "DNS·인증서",
  "UAG·NetScaler·Gateway",
  "Connection Server·Delivery Controller",
  "VDA·Agent",
  "사용자 프로파일",
  "vCenter·ESXi",
  "스토리지·네트워크",
];

/** 지원 유형 4종 — 의뢰 방식 구체화 */
interface SupportType {
  title: string;
  fit: string;
  scope: string[];
  method: string;
  output: string;
  noContract?: string;
}

const supportTypes: SupportType[] = [
  {
    title: "단발 장애 기술지원",
    fit: "지금 발생한 장애의 원인을 빨리 구분해야 하는 운영 담당자",
    scope: ["장애 원인 분석·로그·설정 검토", "원격 지원 또는 현장 지원", "조치 방법 제시"],
    method: "원격 우선, 필요 시 방문",
    output: "원인 구분 결과 · 요청 시 장애보고서",
    noContract: "유지보수 계약 없이 단발 의뢰 가능",
  },
  {
    title: "프로젝트 기술지원",
    fit: "구축·마이그레이션·업그레이드를 앞둔 기관·기업",
    scope: [
      "vCenter·ESXi·Horizon·Citrix 버전 전환",
      "UAG·Gateway·인증서 변경, 스토리지 이관",
      "구축·마이그레이션 기술 수행",
    ],
    method: "작업 계획 기반 원격·방문 병행",
    output: "작업계획서 · 롤백계획서 · 완료보고서",
  },
  {
    title: "정기 유지보수",
    fit: "VDI·전산 환경을 안정적으로 유지하려는 운영 조직",
    scope: [
      "월간 상태 점검, 인증서·라이선스 만료 점검",
      "이벤트 로그·서비스 상태 점검",
      "백업 성공 여부·복구 가능성 점검, 장애 시 기술지원",
    ],
    method: "월 정기 원격 점검 + 필요 시 방문",
    output: "월간 점검 보고서",
  },
  {
    title: "SI 파트너 기술지원",
    fit: "공공기관 사업의 VDI·가상화·백업 영역이 필요한 SI·통합유지보수사",
    scope: [
      "제안 단계 기술 검토, 전문 영역 참여",
      "비상주 기술지원·장애 분석·기술 자문",
      "공공기관 제출용 기술문서 작성",
    ],
    method: "비상주 중심, 사업 구조에 따라 협의",
    output: "제안 기술 파트 · 장애보고서 등 제출 산출물",
  },
];

/** 견적 산정 기준 — 가격을 임의로 제시하지 않고 산정 변수를 공개 */
const quoteFactors = [
  "제품 종류 (Citrix / Horizon / vSphere / 백업)",
  "사용자 수·서버 및 사이트 수",
  "장애 긴급도",
  "원격 또는 방문 여부",
  "로그·구성도 보유 여부",
  "보고서 작성 범위",
];

const faqs: FaqItem[] = [
  {
    q: "VDI 접속장애는 어디부터 확인하나요?",
    a: "UAG/Gateway, 인증서, DNS, Connection Server, Delivery Controller, VDA/Agent, 사용자 프로파일, vSphere 리소스를 순서대로 확인합니다.",
  },
  {
    q: "Citrix와 Omnissa Horizon 모두 지원하나요?",
    a: "Citrix Virtual Apps and Desktops와 Omnissa Horizon 운영환경의 접속장애, 프로파일, 인증서, UAG/Gateway, vSphere 연계 이슈를 지원합니다.",
  },
  {
    q: "유지보수 계약 없이 단발 장애 지원도 가능한가요?",
    a: "가능합니다. 계약을 전제로 하지 않으며, 현재 장애의 원인 분석과 조치 방향 정리만 단발로 의뢰할 수 있습니다.",
  },
  {
    q: "Citrix VDA가 등록되지 않을 때 무엇을 확인하나요?",
    a: "VDA-브로커 통신(포트·DNS·시간동기), 도메인 가입 상태, 마스터 이미지의 Agent 버전, 방화벽 정책을 확인해 등록 실패 지점을 구분합니다.",
  },
  {
    q: "Horizon UAG 외부 접속 오류는 어떻게 진단하나요?",
    a: "TLS 인증서 체인, 방화벽·NAT 경로(443/4172/8443 등), UAG-Connection Server 페어링, DNS 응답을 구간별로 점검합니다.",
  },
  {
    q: "FSLogix 로그인 지연은 해결 가능한가요?",
    a: "프로파일 컨테이너 잠금, 파일서버 권한·용량, 정책 충돌, 스토리지 응답을 로그온 단계별로 분석해 지연 원인을 구분하고 개선 우선순위를 정리합니다.",
  },
  {
    q: "장애보고서나 작업계획서도 작성하나요?",
    a: "점검 결과, 원인 구분, 조치 내용, 고객 확인사항을 정리해 공공기관 제출 형식의 장애보고서·작업계획서·완료보고서로 작성할 수 있습니다.",
  },
  {
    q: "원격 지원만으로도 가능한가요?",
    a: "원격 지원을 우선으로 하며, 현장 확인이 필요한 작업은 방문 지원으로 진행합니다. 원격 접속 가능 여부를 문의 시 알려주시면 빠르게 조율됩니다.",
  },
];

const ldObjects = [
  serviceLd({
    name: "Citrix·Omnissa Horizon VDI 기술지원",
    serviceType: "VDI Technical Support Service",
    description:
      "Citrix, Omnissa Horizon, VMware 기반 가상 데스크톱 환경의 접속장애, 인증서, 프로파일, UAG/Gateway, vSphere 연계 문제를 분석하는 서비스.",
    path: "/services/vdi-support",
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/#business" },
    { name: "VDI 기술지원", path: "/services/vdi-support" },
  ]),
  faqPageLd(faqs),
];

export default function VdiSupportPage() {
  return (
    <div className="bg-white">
      {ldObjects.map((o, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }}
        />
      ))}

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-gray-500">
          <Link href="/" className="inline-flex items-center min-h-6 px-2 -mx-2 hover:text-blue-700">홈</Link>
          <span aria-hidden="true" className="mx-2 text-gray-400">/</span>
          <Link href="/#business" className="inline-flex items-center min-h-6 px-2 -mx-2 hover:text-blue-700">서비스</Link>
          <span aria-hidden="true" className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700 font-medium">VDI 기술지원</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative border-b border-gray-100">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
          <p className="text-xs sm:text-sm font-semibold text-gray-500 tracking-widest mb-6">
            VDI 기술지원
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold text-gray-900 leading-[1.3] kr-keep-all mb-6">
            Citrix·Omnissa Horizon<br className="hidden md:block" />
            <span className="md:hidden"> </span>VDI 기술지원
          </h1>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed kr-keep-all mb-6 max-w-2xl">
            VDI 장애는 접속 서버 하나만의 문제가 아닌 경우가 많습니다. 인증서, DNS, UAG/Gateway,
            Connection Server, Delivery Controller, VDA/Agent, 사용자 프로파일, FSLogix, vSphere
            리소스, 스토리지 병목이 함께 영향을 줍니다. 마이로켓은 운영 흐름 기준으로 원인을
            구분하고 조치 방향을 정리합니다.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed kr-keep-all mb-10 max-w-2xl border-l-2 border-blue-400/60 pl-4">
            SI 프로젝트 협업, VDI 운영 고객사 장애 대응, 프로젝트 단위 기술지원에서
            장애보고서·작업계획서·완료보고서를 제출할 수 있습니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/contact?source=vdi-support&interest=vdi&subject=VDI 장애 원인 상담"
              className="px-5 py-2.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold shadow-sm transition"
            >
              VDI 장애 원인 상담
            </Link>
            <Link
              href="/partners/integrated-maintenance"
              className="px-5 py-2.5 bg-white text-gray-900 border border-gray-400 rounded-md hover:bg-gray-50 hover:border-gray-500 font-semibold transition"
            >
              SI 파트너 협업 보기
            </Link>
            <a
              href={PHONE_TEL}
              className="px-5 py-2.5 bg-white text-gray-900 border border-gray-400 rounded-md hover:bg-gray-50 hover:border-gray-500 font-semibold transition"
            >
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {companyLegal.phone}
            </a>
          </div>
        </div>
      </section>

      {/* AEO 정의 문장 */}
      <section className="border-b border-gray-100 bg-blue-50/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <p className="text-base sm:text-lg text-gray-800 leading-relaxed kr-keep-all">
            <span className="font-semibold text-blue-700">가상 데스크톱(VDI) 기술지원</span>은
            Citrix, Omnissa Horizon, VMware 기반 가상 데스크톱 환경의 접속장애, 인증서, 프로파일,
            UAG/Gateway, vSphere 연계 문제를 분석하는 서비스입니다. VDI는 직원 PC 업무화면을
            서버에서 통합 운영하는 환경으로, 공공기관 망분리·금융권·재택근무 환경에서 주로
            사용됩니다.
          </p>
        </div>
      </section>

      {/* 증상 중심 장애 시나리오 */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 tracking-widest mb-2">
            운영 장애 시나리오
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 kr-keep-all">
            지금 이런 증상이라면, 문의 대상입니다
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed kr-keep-all mb-8">
            증상을 클릭하면 진단 범위, 자주 있는 원인, 제공 산출물, 문의 시 알려주시면
            좋은 정보를 볼 수 있습니다.
          </p>
          <div className="space-y-3">
            {symptomCases.map((c) => (
              <details
                key={c.symptom}
                className="group rounded-xl bg-white border border-gray-200 p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-3 text-base font-semibold text-gray-900 kr-keep-all">
                  <span>{c.symptom}</span>
                  <span className="mt-1 flex-shrink-0 text-gray-600 transition-transform group-open:rotate-180">
                    <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <dl className="mt-4 space-y-2.5 text-sm leading-relaxed kr-keep-all">
                  <div className="flex gap-2">
                    <dt className="flex-shrink-0 w-24 font-semibold text-gray-500">진단 범위</dt>
                    <dd className="text-gray-700">{c.scope}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="flex-shrink-0 w-24 font-semibold text-gray-500">자주 있는 원인</dt>
                    <dd className="text-gray-700">{c.causes}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="flex-shrink-0 w-24 font-semibold text-gray-500">조치·산출물</dt>
                    <dd className="text-gray-700">{c.deliverables}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="flex-shrink-0 w-24 font-semibold text-blue-600">문의 시 정보</dt>
                    <dd className="text-gray-700">{c.minInfo}</dd>
                  </div>
                </dl>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm sm:text-base text-gray-700 kr-keep-all">
              목록에 없는 증상도 같은 기준으로 원인을 구분해 드립니다.
            </p>
            <Link
              href="/contact?source=vdi-symptoms&interest=vdi&subject=VDI 장애 원인 상담"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:translate-x-0.5 transition-transform"
            >
              VDI 장애 원인 상담 →
            </Link>
          </div>
        </div>
      </section>

      {/* E2E 분석 흐름 */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 tracking-widest mb-2">
            분석 범위
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 kr-keep-all">
            VDI 장애는 한 제품만의 문제가 아닙니다
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            접속이 안 되는 원인은 단말, 인증서, 게이트웨이, 브로커, 프로파일, 가상화 기반,
            스토리지 어디에나 있을 수 있습니다. 마이로켓은 아래 전체 흐름을 하나의 기준으로
            분석해 책임 구간을 구분합니다.
          </p>
          <div className="flex flex-wrap items-center gap-y-3">
            {analysisFlow.map((step, i) => (
              <span key={step} className="flex items-center">
                <span className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-800 whitespace-nowrap">
                  {step}
                </span>
                {i < analysisFlow.length - 1 && (
                  <span className="mx-1.5 text-gray-600 text-sm" aria-hidden="true">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 지원 유형·의뢰 방식 */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 tracking-widest mb-2">
            지원 유형
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 kr-keep-all">
            이렇게 의뢰할 수 있습니다
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed kr-keep-all mb-8">
            문의 접수 → 1영업일 내 1차 회신 → 지원 범위·견적 협의 → 원격/방문 지원 → 결과
            보고 순서로 진행됩니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {supportTypes.map((t) => (
              <div key={t.title} className="flex flex-col p-5 sm:p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 kr-keep-all">
                  {t.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-blue-700 mb-3 kr-keep-all">{t.fit}</p>
                <ul className="space-y-1.5 text-sm text-gray-700 mb-4 flex-1 kr-keep-all">
                  {t.scope.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span aria-hidden="true" className="text-blue-600 flex-shrink-0">·</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <dl className="text-xs sm:text-[13px] space-y-1 border-t border-gray-100 pt-3 kr-keep-all">
                  <div className="flex gap-2">
                    <dt className="text-gray-600 flex-shrink-0 w-10">방식</dt>
                    <dd className="text-gray-700">{t.method}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-600 flex-shrink-0 w-10">결과물</dt>
                    <dd className="text-gray-700">{t.output}</dd>
                  </div>
                  {t.noContract && (
                    <div className="flex gap-2">
                      <dt className="text-gray-600 flex-shrink-0 w-10">계약</dt>
                      <dd className="text-emerald-700 font-medium">{t.noContract}</dd>
                    </div>
                  )}
                </dl>
              </div>
            ))}
          </div>

          {/* 견적 산정 기준 */}
          <div className="mt-8 p-5 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 kr-keep-all">
              견적은 아래 기준으로 산정합니다
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 kr-keep-all">
              환경마다 범위가 달라 일률적인 가격표 대신 산정 기준을 공개합니다. 아래 정보를
              보내주시면 견적 범위를 회신드립니다.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-gray-700 kr-keep-all">
              {quoteFactors.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-gray-600 flex-shrink-0">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 지원 범위 요약 */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 tracking-widest mb-2">
            지원 범위
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 kr-keep-all">
            지원 범위 요약
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {includes.map((t) => (
              <li
                key={t}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200 text-base text-gray-700 leading-relaxed kr-keep-all"
              >
                <span className="text-blue-600 font-bold flex-shrink-0 mt-0.5">·</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 수행 경험 — 2차 타깃(SI·운영사)의 신뢰 확인 지점 */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 tracking-widest mb-2">
            수행 실적
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 kr-keep-all">
            수행 경험
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed kr-keep-all mb-8">
            공공기관·정부출연연구기관 10여 곳의 VDI 환경을 구축·운영·유지보수해 왔습니다.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {engagements.map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200 text-base text-gray-700 leading-relaxed kr-keep-all"
              >
                <span className="text-blue-600 font-bold flex-shrink-0 mt-0.5">·</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            FAQ
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 kr-keep-all">
            자주 묻는 질문
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl bg-white border border-gray-200 p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-3 text-base font-semibold text-gray-900 kr-keep-all">
                  <span>{f.q}</span>
                  <span className="mt-1 flex-shrink-0 text-gray-600 transition-transform group-open:rotate-180">
                    <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed kr-keep-all">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 관련 진단 도구 */}
      <RelatedTools
        tools={[
          {
            href: "/tools/vdi-transition",
            title: "VDI 역할 재정의 진단",
            desc: "9문항으로 유지·보완·축소·재설계 4가지 시나리오 후보를 도출합니다.",
            duration: "약 3분",
          },
          {
            href: "/tools/roi-calculator",
            title: "VDI 운영 ROI 시뮬레이션",
            desc: "마이그레이션·운영비용을 시뮬레이션하고 경영진 보고용 PDF를 제공합니다.",
            duration: "약 4분",
          },
        ]}
      />

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 kr-keep-all">
            VDI 장애, 제품·버전·증상만 보내주세요
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl leading-relaxed kr-keep-all">
            제품명·버전·증상만 보내주시면 1영업일 내 지원 가능 범위와 다음 확인사항을 회신합니다.
            계약 여부와 관계없이 현재 문제와 필요한 조치 범위를 먼저 확인합니다.
          </p>
          <Link
            href="/contact?source=vdi-support-bottom&interest=vdi&subject=VDI 장애 원인 상담"
            className="inline-block px-7 py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/30 transition hover:-translate-y-0.5"
          >
            VDI 장애 원인 상담
          </Link>
        </div>
      </section>
    </div>
  );
}
