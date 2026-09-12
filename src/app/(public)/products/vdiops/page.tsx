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
    "Omnissa Horizon에서 VM을 한 대씩 직접 만들어 쓰는 Manual 풀 운영을 자동화하는 제품입니다. vCenter, AD, Horizon 콘솔, IP 대장을 하나씩 열어 입력하던 VM 생성, 교체, 회수 작업을 요청서 하나와 승인으로 처리하고 모든 변경 내용을 기록합니다. (주)마이로켓이 만들어 고객 서버에 설치합니다.",
};

/* 한 줄 구호는 HVMPortal/docs/positioning.md 정본 그대로. 나머지 문구는 방문자(기관 전산 담당자)의 말로 풀어 쓴다. */
const ONE_LINER = "Manual VDI를 포기하지 않고 자동화한다.";

/* 지금의 운영: VM 한 대를 만들 때 사람이 오가는 자리. */
const currentConsoles = [
  { name: "vCenter", job: "템플릿을 복제하고 CPU, 메모리, 네트워크를 설정합니다" },
  { name: "Active Directory", job: "컴퓨터 계정을 만들고 사용자와 OU를 확인합니다" },
  { name: "Horizon Console", job: "풀에 등록하고 사용자를 배정하고 권한을 줍니다" },
  { name: "IP 대장", job: "엑셀에서 빈 주소를 찾아 적고 DNS에 등록합니다" },
];

const currentSteps = [
  "복제",
  "이름과 IP 지정",
  "도메인 가입",
  "풀 등록",
  "사용자 배정",
  "접속 확인",
];

/* VDIOps를 쓰면: 요청서 하나에 적는 것. 화면 문구는 demo-script.md 장면 2·3 기준. */
const oneJobFields = [
  "만드는 이유 (기록에 그대로 남습니다)",
  "사용할 템플릿, 호스트, 스토리지",
  "사용할 사람 (AD에 있는 계정만 선택할 수 있습니다)",
  "IP 대역 (빈 주소는 자동으로 찾아 줍니다)",
  "사용 기간과 실행 시각",
];

/* 승인·기록·권한: 보안 담당자가 먼저 읽는 자리. */
const controls = [
  {
    term: "승인",
    desc: "요청한 사람이 아닌 다른 사람이 승인해야 실행됩니다. VM 삭제처럼 되돌릴 수 없는 작업은 승인자 두 명이 필요하고 확인 절차를 한 번 더 거칩니다.",
  },
  {
    term: "기록",
    desc: "누가 무엇을 언제 요청하고 승인하고 실행했는지 모두 기록됩니다. 기록은 고치거나 지울 수 없습니다. 관리자가 승인 없이 바로 실행한 작업도 그대로 기록됩니다.",
  },
  {
    term: "권한 범위",
    desc: "AD에서는 지정한 OU 안에서만, vCenter에서는 정해진 역할로만, Horizon에서는 전용 계정으로만 작업합니다. 권한 범위는 각 시스템에서 직접 확인할 수 있습니다.",
  },
  {
    term: "작업 잠금",
    desc: "작업 종류별로 실행을 막아 둘 수 있습니다. 화면에서는 막는 것만 됩니다. 다시 열려면 서버 설정 파일을 고치고 재시작해야 합니다. 실수로 풀리지 않게 하기 위해서입니다.",
  },
];

/* 증거: 이 셋 외의 수치는 페이지에 넣지 않는다. 문서 링크는 두지 않고 요청 시 보낸다. */
const evidence = [
  {
    value: "Horizon 8.18 + vCenter 8.0.3",
    label: "검증한 환경",
    note: "마이로켓 실험실에서 VM 생성, 교체, 삭제, AD 계정 작업, IP 조사를 실제로 실행해 본 환경입니다",
  },
  { value: "3,490건", label: "자동 테스트", note: "제품 코드에 들어 있는 자동 테스트 수입니다" },
  { value: "약 25분", label: "설치에 걸린 시간", note: "준비가 끝난 고객 서버에 설치를 마치기까지 실제로 걸린 시간입니다" },
];

const supported = [
  "Omnissa Horizon과 vSphere를 함께 쓰는 환경",
  "Manual 풀에서 Full Clone VM을 한 대씩 만들어 사용자에게 지정해 주는 환경",
  "VM을 AD 도메인에 가입하고 고정 IP를 쓰는 환경",
  "VM 생성, 교체, 배정, 회수, 삭제와 IP·AD 계정 정리 작업",
  "인터넷이 안 되는 폐쇄망. 고객 서버에 설치하고 사내 계정으로 로그인합니다",
];

const notSupported = [
  "Instant Clone 풀은 조회, 유지보수 모드, 교체, 수량 조정만 할 수 있습니다. Instant Clone 자동화를 대신하는 제품이 아닙니다.",
  "Connection Server를 여러 Pod로 나눈 구성은 지원하지 않습니다.",
  "Linux 데스크톱과 OVA 형태의 배포는 없습니다.",
  "클라우드 서비스(SaaS)로는 제공하지 않습니다.",
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
      "Omnissa Horizon Manual 풀의 VM 생성, 교체, 배정, 회수, 삭제와 IP·AD 계정 정리를 요청서 하나와 승인으로 처리하고 모든 변경 기록을 남기는, 고객 서버에 설치하는 제품.",
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

/* 도식: 로고 기획서 방향 B. 요청 하나가 네 시스템을 차례로 지난다. */
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
      <title id="pierce-title">요청 하나가 네 시스템을 차례로 지나는 그림</title>
      <desc id="pierce-desc">
        vCenter, Active Directory, Horizon, IP 대장 네 칸을 붉은 세로선 하나가 위에서 아래로
        지납니다. 선의 시작은 요청과 승인, 끝은 기록입니다.
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
        기록
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

      {/* 1. 첫 화면 */}
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
                VM 한 대를 만들 때마다 vCenter, AD, Horizon 콘솔, IP 엑셀을 하나씩 열지 않아도 됩니다. 담당자는 요청서 하나만 쓰면 됩니다. 승인이 나면 VDIOps가 나머지 작업을 알아서 처리합니다. 누가 언제 무엇을 했는지도 모두 기록됩니다.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
                VM을 한 대씩 직접 만들어 사용자에게 지정해 주는 Manual 풀 방식은 그대로 씁니다. 고정 IP와 호스트명이 필요하거나, 사용자마다 설정이 다르거나, VM 한 대 단위로 장애를 처리해야 하는 기관을 위한 제품입니다. (주)마이로켓이 직접 만들었고 고객 서버에 설치합니다. 코드명은 HorizonOps입니다.
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

      {/* 2. 지금과 VDIOps를 쓸 때 */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Before / After
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            지금은 이렇게 하고 계실 겁니다
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            담당자가 손으로 하던 일만 바뀝니다. VM 구성이나 사용자가 쓰는 방식은 그대로입니다.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="p-6 rounded-xl bg-white border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">지금: VM 한 대에 콘솔 네 개</h3>
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-4">
                각각의 콘솔을 열어서 일일이 입력하다가 오류가 날 수도 있습니다. 작업 중에 다른 일이 생기면 어디까지 했는지 놓치기도 합니다.
              </p>
              <ul className="space-y-2 mb-5">
                {currentConsoles.map((c) => (
                  <li key={c.name} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-32 font-semibold text-gray-900">{c.name}</span>
                    <span className="text-gray-600 kr-keep-all">{c.job}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mb-2">손으로 하는 단계</p>
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
                  alt="VDIOps 로그인 화면(코드명 HorizonOps). 계정명과 비밀번호 입력란, Windows 계정 자동 로그인 버튼이 있다"
                  caption="장면 1. 로그인 화면입니다. 사내 계정으로 들어갑니다. 화면 속 제품명은 이름을 바꾸기 전이라 코드명 HorizonOps로 보입니다."
                />
              </div>
            </article>

            <article className="p-6 rounded-xl bg-white border-2 border-[#1a1f26]">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">VDIOps를 쓰면: 요청서 하나</h3>
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-4">
                풀 화면에서 요청서 하나만 작성해서 제출합니다. 승인이 나면 이름 정하기, IP 배정, 복제, 도메인 가입, 풀 등록, 사용자 배정, 접속 확인까지 VDIOps가 순서대로 자동으로 처리합니다. 중간에 오류가 나면 그 단계부터 다시 실행합니다. 이미 끝난 단계는 다시 하지 않습니다.
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
                VM 이름과 IP는 사람이 직접 정하지 않습니다. 사람이 정하면 대장과 실제 값이 달라지는 일이 생기기 때문입니다.
              </p>
              <div className="mt-6">
                <Capture
                  file="capture-02-fc-request.png"
                  alt="VDIOps 데스크톱 풀 화면(코드명 HorizonOps)에서 열린 Full Clone VM 생성 작업 지시서. 사유, 마스터(템플릿), 호스트, 스토리지, 네트워크, 디스크 형식, 사용자 할당 입력란과 Full Clone 생성 요청 버튼이 있다"
                  caption="장면 2. Full Clone VM 생성 작업 지시서입니다. 본문에서 요청서라고 부른 창입니다. 이름과 IP는 적는 칸이 없고 정책과 IP 대역에서 자동으로 정해집니다."
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 3. 승인·기록·권한 */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Approval · Audit · Least Privilege
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            보안 담당자가 먼저 보실 부분입니다
          </h2>
          <p className="text-base text-gray-700 leading-relaxed kr-keep-all mb-8 max-w-3xl">
            모든 작업은 요청하고 승인을 받아야 실행됩니다. 실행 직전에 대상과 정책을 한 번 더 확인하고 문제가 있으면 멈춥니다. VDIOps에 주는 권한은 AD, vCenter, Horizon마다 따로 설정하므로 어디까지 할 수 있는지 보안 담당자가 직접 확인할 수 있습니다. 자격 증명을 어떻게 보관하는지 포함한 보안 답변서는 요청하시면 보내 드립니다.
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
            실제로 측정한 숫자만 적습니다
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
            고객 사례와 절감 수치는 아직 없습니다. 첫 고객 환경에서 측정이 끝나고 해당 기관의 검토를 받은 뒤에 공개하겠습니다. 검증 기록과 테스트 결과 문서는 요청하시면 보내 드립니다.
          </p>
        </div>
      </section>

      {/* 5. 도입할 수 있는 환경과 없는 환경 */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Scope
          </p>
          <h2 className="h-base text-gray-900 mb-3 kr-keep-all">
            맞는 환경과 맞지 않는 환경
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            안 되는 것부터 말씀드립니다. 데모 전에 미리 알면 서로 시간을 아낄 수 있습니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-3">이런 환경에 맞습니다</h3>
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
              <h3 className="text-base font-semibold text-gray-900 mb-3">이건 안 됩니다</h3>
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
            데모는 30분 정도이며 마이로켓 실험실 화면을 공유하는 방식입니다. 데모 후에는 고객 환경에서 유료 시범 도입(PoC)을 진행합니다. 비용과 조건은 제안서에 따로 안내합니다.
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
                Horizon 버전, 풀 유형, VM 대수를 적어 주시면 도입 가능한 환경인지 먼저 확인하고 일정을 잡습니다. Instant Clone 풀만 쓰는 경우에는 첫 회신에서 바로 말씀드립니다.
              </p>
              <ul className="text-sm text-gray-700 space-y-1.5 kr-keep-all">
                <li>· 원격 데모 30분, 마이로켓 실험실 화면 공유</li>
                <li>· 데모가 끝나면 시범 도입 항목표와 설치 준비물 목록을 보내 드립니다</li>
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
