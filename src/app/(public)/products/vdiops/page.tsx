import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { companyLegal } from "@/lib/site-config";
import { breadcrumbLd, SITE_URL, ORG_ID } from "@/lib/schema";
import DemoRequestForm from "./DemoRequestForm";

const PHONE_TEL = `tel:${companyLegal.phone.replace(/-/g, "")}`;
const PAGE_PATH = "/products/vdiops";

export const metadata: Metadata = {
  alternates: { canonical: PAGE_PATH },
  title: "VDIOps: Omnissa Horizon Manual VDI 운영 자동화",
  description:
    "Manual VDI를 포기하지 않고 자동화한다. Omnissa Horizon Manual Desktop Pool의 Full Clone VM 생성·교체·할당·회수·삭제와 정적 IP·AD 계정 정리를 vCenter·AD·Horizon·IP 대장을 오가던 절차 대신 검토와 승인을 거치는 단일 작업으로 실행합니다. 마이로켓이 만든 온프레미스 제품이며, 데모를 신청할 수 있습니다.",
};

/* 문구는 HVMPortal/docs/positioning.md 정본을 그대로 쓴다. 바꿀 때는 정본을 먼저 고친다. */
const ONE_LINER = "Manual VDI를 포기하지 않고 자동화한다.";
const TWO_LINER =
  "VDI 한 대를 만들기 위해 관리 콘솔 네 개를 열지 않는다. 한 작업이 vCenter·AD·Horizon·IP를 한 번에 관통하고, 모든 변경은 승인과 감사가 찍힌 도면으로 남는다.";
const TECH_LINE =
  "Manual Persistent VDI의 통제성은 유지하고 Lifecycle은 자동화한다. 실행은 durable 큐·단계별 체크포인트·실행 직전 재검증·fail-closed 안전장치 위에서 이루어진다.";

/* 지금의 운영: VM 한 대를 만들 때 사람이 오가는 자리. */
const currentConsoles = [
  { name: "vCenter", job: "템플릿 복제, CPU·메모리, 네트워크" },
  { name: "Active Directory", job: "컴퓨터 계정, 사용자, OU" },
  { name: "Horizon Console", job: "풀 등록, 사용자 할당, 권한" },
  { name: "IP 대장", job: "엑셀 등에서 빈 주소 찾기, DNS 등록" },
];

const currentSteps = [
  "복제",
  "이름·IP 지정",
  "도메인 가입",
  "풀 등록",
  "사용자 할당",
  "확인",
];

/* 한 작업: 지시서 하나로 끝나는 절차. 화면 문구는 demo-script.md 장면 2·3 기준. */
const oneJobFields = [
  "사유 (감사 기록에 그대로 남음)",
  "마스터 템플릿, 호스트, 스토리지, 네트워크",
  "사용자 할당 (검증된 계정만 제출 가능)",
  "서브넷 (정적 IP 자동 배정)",
  "사용기간, 예약 실행",
];

/* 승인·감사·최소권한: 보안 담당자가 먼저 읽는 자리. */
const controls = [
  {
    term: "승인 흐름",
    desc: "요청자와 다른 사람이 승인해야 실행됩니다. 영구 삭제처럼 위험한 작업은 승인자 2인과 확인 토큰이 필요합니다.",
  },
  {
    term: "감사 기록",
    desc: "누가 무엇을 언제 요청하고 승인하고 실행했는지가 덧붙이기만 가능한 기록으로 남습니다. 승인을 생략한 관리자 실행도 기록됩니다.",
  },
  {
    term: "최소권한",
    desc: "AD 위임 ACE, vCenter 역할, Horizon 계정 분리로 제품이 가진 권한의 범위를 고객이 직접 확인할 수 있습니다.",
  },
  {
    term: "킬스위치",
    desc: "작업 유형별로 실행을 잠글 수 있습니다. 화면에서는 조이는 방향만 가능하고, 푸는 방향은 서버 설정 파일 수정과 재시작이 필요합니다.",
  },
];

/* 증거: 이 셋 외의 수치는 페이지에 넣지 않는다. 문서 링크는 두지 않고 요청 시 보낸다. */
const evidence = [
  { value: "Horizon 8.18 + vCenter 8.0.3", label: "검증 환경", note: "실 Lab에서 생성·교체·삭제·AD 계정 작업·IP 조사를 끝까지 실행한 기록" },
  { value: "3,490건", label: "자동 시험", note: "저장소에 포함된 자동 테스트 건수" },
  { value: "약 25분", label: "설치 실측", note: "준비물이 갖춰진 고객 서버에 설치를 마치기까지" },
];

const supported = [
  "Omnissa Horizon + vSphere 환경",
  "Manual Desktop Pool의 Full Clone VM",
  "AD 도메인 가입과 고정 IP를 쓰는 VM",
  "생성·교체·할당·회수·삭제와 정적 IP·AD 계정 정리",
  "폐쇄망 온프레미스 설치, 사내 계정 로그인",
];

const notSupported = [
  "Instant Clone 풀은 조회·유지보수·교체·수량 조정만 지원합니다. Instant Clone 자동화 풀을 대체하지 않습니다.",
  "다중 Pod 구성은 지원하지 않습니다.",
  "Linux 데스크톱과 OVA 배포는 없습니다.",
  "SaaS 형태로 제공하지 않습니다. 고객 서버에 설치합니다.",
];

const ldObjects = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VDIOps",
    alternateName: "HorizonOps",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Windows Server",
    description:
      "Omnissa Horizon Manual Desktop Pool의 Full Clone VM 생성·교체·할당·회수·삭제와 정적 IP·AD 계정 정리를 승인과 감사를 거치는 단일 작업으로 실행하는 온프레미스 제품.",
    url: `${SITE_URL}${PAGE_PATH}`,
    author: { "@type": "Organization", "@id": ORG_ID },
    provider: { "@type": "ProfessionalService", "@id": ORG_ID },
  },
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "제품", path: PAGE_PATH },
    { name: "VDIOps", path: PAGE_PATH },
  ]),
];

/* 관통 도식: 로고 기획서 방향 B. 가로 띠 넷을 주서 세로선 하나가 꿰뚫는다. */
function PierceDiagram() {
  const bands = ["vCenter", "Active Directory", "Horizon", "IP 대장"];
  const ink = "#1a1f26";
  const red = "#c33d1f";
  const hair = "#c2c9d2";
  return (
    <svg
      viewBox="0 0 360 300"
      role="img"
      aria-labelledby="pierce-title pierce-desc"
      className="w-full h-auto max-w-md mx-auto"
    >
      <title id="pierce-title">한 작업이 네 시스템을 관통하는 도식</title>
      <desc id="pierce-desc">
        vCenter, Active Directory, Horizon, IP 대장 네 띠를 하나의 붉은 세로선이 위에서 아래로
        지나고, 선의 시작에는 요청과 승인, 끝에는 감사 기록이 있습니다.
      </desc>
      <text x="180" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>
        요청 · 승인
      </text>
      {bands.map((b, i) => {
        const y = 44 + i * 54;
        return (
          <g key={b}>
            <rect x="40" y={y} width="280" height="36" fill="#fff" stroke={ink} strokeWidth="1.5" />
            <line x1="40" y1={y + 18} x2="24" y2={y + 18} stroke={hair} strokeWidth="1" />
            <line x1="320" y1={y + 18} x2="336" y2={y + 18} stroke={hair} strokeWidth="1" />
            <text x="56" y={y + 23} fontSize="13" fontWeight="600" fill={ink}>
              {b}
            </text>
          </g>
        );
      })}
      <line x1="180" y1="30" x2="180" y2="270" stroke={red} strokeWidth="3" />
      <rect x="174" y="264" width="12" height="12" fill={red} />
      <text x="180" y="292" textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>
        감사 기록
      </text>
    </svg>
  );
}

/* 화면 캡처: 마이로켓 Lab 데이터만 담긴 1280×720. 화면 안 제품명은 이름 변경 전이라 코드명 HorizonOps로 보인다. */
function Capture({ file, alt, caption }: { file: string; alt: string; caption: string }) {
  return (
    <figure>
      <Image
        src={`/products/vdiops/${file}`}
        alt={alt}
        width={1280}
        height={720}
        sizes="(max-width: 1024px) 100vw, 480px"
        className="w-full h-auto rounded-xl border border-gray-200"
      />
      <figcaption className="mt-2 text-xs text-gray-500 kr-keep-all">{caption}</figcaption>
    </figure>
  );
}

export default function VdiOpsPage() {
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-900">홈</Link>
          <span aria-hidden="true" className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">제품</span>
          <span aria-hidden="true" className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700 font-medium">VDIOps</span>
        </div>
      </div>

      {/* 1. 한 줄·두 줄 문장과 관통 도식 */}
      <section className="relative border-b border-gray-100">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#c33d1f] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-3">
              {/* 가로 조합(심볼 + 워드마크). 최소 높이 20px 규칙에 맞춰 36px로 둔다. 비율은 SVG viewBox 기준. */}
              <div className="mb-5">
                <Image
                  src="/products/vdiops/lockup-h.svg"
                  alt="VDIOps"
                  width={183}
                  height={36}
                  className="h-9 w-auto"
                  priority
                />
                <p className="mt-2 text-xs text-gray-500 tracking-widest uppercase">
                  Manual Persistent VDI Lifecycle Automation for Omnissa Horizon
                </p>
              </div>
              <h1 className="h-lead text-gray-900 kr-keep-all mb-5">{ONE_LINER}</h1>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed kr-keep-all mb-4 max-w-2xl">
                {TWO_LINER}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
                {TECH_LINE} 코드명은 HorizonOps이며, (주)마이로켓이 만들어 고객 서버에 설치합니다.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <a
                  href="#demo"
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-semibold shadow-sm transition"
                >
                  데모 신청
                </a>
                <Link
                  href="/tools/vdi-ops-checklist"
                  className="px-5 py-2.5 bg-white text-gray-900 border border-gray-400 rounded-md hover:bg-gray-50 hover:border-gray-500 font-semibold transition"
                >
                  VDI 운영 진단 체크리스트
                </Link>
                <a href={PHONE_TEL} className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium">
                  {companyLegal.phone}
                </a>
              </div>
            </div>
            <div className="lg:col-span-2">
              <PierceDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 지금의 운영과 한 작업 */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Before / After
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            지금의 운영과 한 작업
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            Manual VM이 주는 통제성, 곧 고정 IP·고정 호스트명·개별 변경·VM 단위 장애 대응과
            사용자 경험은 그대로 둡니다. 바뀌는 것은 운영자가 콘솔을 오가던 절차뿐입니다.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="p-6 rounded-xl bg-white border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">지금의 운영</h3>
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-4">
                VM 한 대를 만들기 위해 운영자가 콘솔을 차례로 열고, 값을 손으로 옮겨 적습니다.
                어느 단계에서 멈췄는지는 사람의 기억에만 남습니다.
              </p>
              <ul className="space-y-2 mb-5">
                {currentConsoles.map((c) => (
                  <li key={c.name} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-32 font-semibold text-gray-900">{c.name}</span>
                    <span className="text-gray-600 kr-keep-all">{c.job}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mb-2">수작업 단계</p>
              <ol className="flex flex-wrap gap-1.5">
                {currentSteps.map((s, i) => (
                  <li key={s} className="px-2.5 py-1 rounded-md bg-gray-100 text-xs text-gray-700">
                    {i + 1}. {s}
                  </li>
                ))}
              </ol>
              <div className="mt-6">
                <Capture
                  file="capture-01-login.png"
                  alt="VDIOps 로그인 화면(코드명 HorizonOps). 계정명과 비밀번호 입력란, Windows 계정 자동 로그인 버튼, 도면번호 /login과 모드 Lab 표시"
                  caption="장면 1. 로그인 화면. VDIOps 화면(코드명 HorizonOps), 마이로켓 Lab."
                />
              </div>
            </article>

            <article className="p-6 rounded-xl bg-white border-2 border-[#1a1f26]">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">한 작업</h3>
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-4">
                풀에서 지시서 하나를 채우고 요청합니다. 승인이 나면 이름 예약, IP 배정, 복제,
                도메인 가입, 풀 등록, 할당, 검증이 단계별로 실행되고, 실패하면 실패한 단계부터
                다시 합니다. 이미 성공한 단계는 다시 실행하지 않습니다.
              </p>
              <ul className="space-y-2 mb-5">
                {oneJobFields.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-gray-700 kr-keep-all">
                    <span aria-hidden="true" className="flex-shrink-0 mt-2 w-1.5 h-1.5 bg-[#c33d1f]" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-800 kr-keep-all">
                이름도 IP도 사람이 정하지 않습니다. 정하는 순간 대장과 실제가 갈라지기 때문입니다.
              </p>
              <div className="mt-6">
                <Capture
                  file="capture-02-fc-request.png"
                  alt="VDIOps 데스크톱 풀 화면(코드명 HorizonOps)에서 열린 Full Clone VM 생성 지시서. 사유, 마스터 템플릿, 호스트, 스토리지, 네트워크, 디스크 형식, 사용자 할당 입력란과 Full Clone 생성 요청 버튼"
                  caption="장면 2. Full Clone 생성 지시서. 이름과 IP는 입력 항목이 아니며 정책과 서브넷에서 자동 배정됩니다. 마이로켓 Lab."
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 3. 승인·감사·최소권한 */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Approval · Audit · Least Privilege
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            승인과 감사, 최소권한
          </h2>
          <p className="text-base text-gray-700 leading-relaxed kr-keep-all mb-8 max-w-3xl">
            모든 변경은 요청과 승인을 거쳐 실행되고, 실행 직전에 대상과 정책을 다시 검증합니다.
            검증에 실패하면 만들기 전에 멈춥니다. 제품이 쓰는 권한은 AD 위임 항목, vCenter 역할,
            Horizon 계정으로 나뉘어 있어 보안 담당자가 범위를 직접 읽을 수 있고, 감사 기록은
            덧붙이기만 가능합니다. 자격 증명 보관 방식을 포함한 보안 답변서는 요청하시면 보내 드립니다.
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {controls.map((c) => (
              <div key={c.term} className="p-5 rounded-xl bg-white border border-gray-200">
                <dt className="text-sm font-semibold text-gray-900 mb-1.5">{c.term}</dt>
                <dd className="text-sm text-gray-600 leading-relaxed kr-keep-all">{c.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 4. 증거 */}
      <section className="border-b border-gray-100 bg-[#1a1f26] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Evidence
          </p>
          <h2 className="h-base text-white mb-8 kr-keep-all">
            근거는 실 Lab 검증 기록과 설치 기록뿐입니다
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {evidence.map((e) => (
              <div key={e.label} className="border-l-2 border-[#c33d1f] pl-4">
                <p className="text-xl sm:text-2xl font-bold text-white mb-1">{e.value}</p>
                <p className="text-sm font-semibold text-gray-200 mb-1">{e.label}</p>
                <p className="text-xs text-gray-400 kr-keep-all">{e.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-gray-400 kr-keep-all max-w-2xl">
            고객 사례와 절감 수치는 아직 없습니다. 첫 고객 환경의 측정이 끝나고 기관 검토를 거친
            뒤에만 공개합니다. 검증 기록과 시험 결과 문서는 요청하시면 보내 드립니다.
          </p>
        </div>
      </section>

      {/* 5. 지원 범위와 하지 않는 것 */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Scope
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            지원 범위와 하지 않는 것
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            못 하는 것을 먼저 말씀드립니다. 데모에서 걸러지는 편이 PoC에서 걸러지는 것보다
            양쪽 모두에게 낫습니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-3">지원하는 환경과 작업</h3>
              <ul className="space-y-2">
                {supported.map((s) => (
                  <li key={s} className="flex gap-2.5 text-sm text-gray-700 kr-keep-all">
                    <span aria-hidden="true" className="flex-shrink-0 mt-2 w-1.5 h-1.5 bg-[#1a1f26]" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-amber-50/60 border border-amber-200">
              <h3 className="text-base font-semibold text-gray-900 mb-3">하지 않는 것</h3>
              <ul className="space-y-2">
                {notSupported.map((s) => (
                  <li key={s} className="flex gap-2.5 text-sm text-gray-800 kr-keep-all">
                    <span aria-hidden="true" className="flex-shrink-0 mt-2 w-1.5 h-1.5 bg-[#c33d1f]" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-600 kr-keep-all max-w-2xl">
            데모는 30분이며 Lab 환경에서 진행합니다. 다음 단계는 고객 환경에서 진행하는 유료
            PoC이고, 비용과 조건은 제안서에 별첨합니다.
          </p>
        </div>
      </section>

      {/* 6. 데모 신청 */}
      <section id="demo" className="border-b border-gray-100 bg-gray-50/50 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Demo Request
              </p>
              <h2 className="h-base text-gray-900 mb-3 kr-keep-all">데모 신청</h2>
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-5">
                Horizon 버전과 풀 유형, VM 대수를 적어 주시면 대상 여부를 먼저 확인하고 일정을
                잡습니다. Instant Clone 풀만 운영하는 곳은 첫 회신에서 범위를 말씀드립니다.
              </p>
              <ul className="text-sm text-gray-700 space-y-1.5 kr-keep-all">
                <li>· 원격 데모 30분, Lab 환경 화면 공유</li>
                <li>· 데모 뒤 PoC 항목표와 설치 준비물 체크리스트 발송</li>
                <li>· 미리 채워 두면 좋은 것: <Link href="/tools/vdi-ops-checklist" className="underline underline-offset-2 text-gray-900">VDI 운영 진단 체크리스트</Link></li>
              </ul>
            </div>
            <div className="lg:col-span-3">
              <DemoRequestForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
