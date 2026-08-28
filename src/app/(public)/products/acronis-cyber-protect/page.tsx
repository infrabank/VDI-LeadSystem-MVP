import type { Metadata } from "next";
import Link from "next/link";
import { companyLegal } from "@/lib/site-config";
import { breadcrumbLd, faqPageLd, SITE_URL, ORG_ID, type FaqItem } from "@/lib/schema";

const PHONE_TEL = `tel:${companyLegal.phone.replace(/-/g, "")}`;

export const metadata: Metadata = {
  alternates: { canonical: "/products/acronis-cyber-protect" },
  title: "Acronis Cyber Protect — 백업·랜섬웨어 방어 통합 솔루션",
  description:
    "서버·PC·NAS·Microsoft 365를 이미지 백업하고, 안티랜섬웨어·안티멀웨어·EDR·패치 관리를 하나로 통합한 Acronis Cyber Protect. Authorized Partner / MSP로서 도입·구축·운영·복구검증을 지원합니다.",
};

/* ──────────────────────────────────────────────────────────────────
 * 이미지 슬롯 — 파트너 페이지(Acronis)에서 조달한 자산을 채워 넣는 자리.
 * /public/products/acronis/<file> 에 올린 뒤 <ImgSlot>을 <img>/<Image>로 교체.
 * ────────────────────────────────────────────────────────────────── */
function ImgSlot({
  label,
  file,
  ratio = "aspect-[16/9]",
}: {
  label: string;
  file: string;
  ratio?: string;
}) {
  return (
    <div
      className={`${ratio} w-full rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/40 flex flex-col items-center justify-center text-center px-4 py-6`}
    >
      <svg
        className="w-8 h-8 text-blue-400 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z"
        />
      </svg>
      <p className="text-sm font-semibold text-blue-700 kr-keep-all">{label}</p>
      <p className="mt-1 text-[11px] text-blue-600/80 font-mono">
        /products/acronis/{file}
      </p>
      <p className="mt-1 text-[11px] text-gray-400 kr-keep-all">
        파트너 페이지에서 조달 후 교체
      </p>
    </div>
  );
}

/* 신뢰 지표 — Acronis 공식 수치 (제품 소개용). */
const metrics = [
  { value: "750,000+", label: "사용 기업" },
  { value: "150+", label: "서비스 국가" },
  { value: "26개", label: "지원 언어" },
  { value: "올인원", label: "백업 + 보안 통합" },
];

/* 핵심 가치 — 왜 Acronis인가. */
const highlights: { title: string; desc: string; icon: string }[] = [
  {
    title: "백업과 보안을 하나로",
    desc: "백업, 안티멀웨어, EDR, 패치 관리, 복구를 별도 제품으로 따로 운영하지 않고 단일 에이전트·단일 콘솔에서 통합 운영합니다.",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  {
    title: "랜섬웨어 능동 방어",
    desc: "Active Protection이 랜섬웨어의 파일 암호화 행위를 실시간 차단하고, 피해 발생 시 변경된 파일을 자동 복구합니다.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "신속한 전체 복구",
    desc: "베어메탈 복구와 유니버설 리스토어로 다른 하드웨어에도 시스템 전체를 복원하고, 즉시 실행으로 다운타임을 줄입니다.",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  },
  {
    title: "통합 관리 콘솔",
    desc: "서버·PC·NAS·Microsoft 365까지 보호 대상을 한 화면에서 모니터링하고, 백업 성공률·위협·패치 상태를 함께 관리합니다.",
    icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
  },
];

/* 보호 대상 (workloads). */
const workloads = [
  "Windows / Linux 서버",
  "업무용 PC · 노트북",
  "Mac",
  "가상머신 (VMware · Hyper-V)",
  "Microsoft 365 · Google Workspace",
  "NAS · 파일 서버",
];

/* 주요 기능. */
const features: { title: string; desc: string }[] = [
  {
    title: "이미지·파일 백업",
    desc: "디스크 전체 이미지부터 개별 파일까지, 시스템 상태 그대로 백업합니다.",
  },
  {
    title: "애플리케이션 인식 백업",
    desc: "MS SQL, Exchange, SharePoint, Active Directory를 정합성 있게 백업·복원합니다.",
  },
  {
    title: "안티랜섬웨어 · 안티멀웨어",
    desc: "행위 기반 탐지로 랜섬웨어·악성코드를 차단하고 손상 파일을 복구합니다.",
  },
  {
    title: "EDR · 위협 대응",
    desc: "엔드포인트 위협을 탐지·분석하고 사고 대응 흐름을 기록합니다.",
  },
  {
    title: "취약점 평가 · 패치 관리",
    desc: "OS·애플리케이션 취약점을 점검하고 패치를 배포·관리합니다.",
  },
  {
    title: "베어메탈 · 유니버설 복구",
    desc: "다른 하드웨어에도 시스템 전체를 복원하는 재해복구를 지원합니다.",
  },
  {
    title: "유연한 백업 저장소",
    desc: "로컬 디스크, NAS, Acronis Cloud, 타 클라우드로 백업본을 분산 보관합니다.",
  },
  {
    title: "복구 검증",
    desc: "백업본이 실제로 복구되는지 사전에 확인해 \"백업은 됐지만 복구가 안 되는\" 상황을 방지합니다.",
  },
];

/* 에디션 — 정직한 제품 소개 (가격 비노출). */
const editions: {
  name: string;
  badge: string;
  summary: string;
  points: string[];
  highlight: boolean;
}[] = [
  {
    name: "Cyber Protect Standard",
    badge: "백업 + 기본 보안",
    summary: "서버·PC 백업과 기본 안티랜섬웨어 보호가 필요한 경우.",
    points: [
      "이미지·파일 백업",
      "Active Protection 안티랜섬웨어",
      "베어메탈 복구",
      "로컬·NAS·클라우드 저장소",
    ],
    highlight: false,
  },
  {
    name: "Cyber Protect Advanced",
    badge: "전사·고급 보안",
    summary: "EDR·패치 관리·애플리케이션 백업까지 포함한 전사 운영용.",
    points: [
      "Standard의 모든 기능",
      "EDR · 고급 위협 대응",
      "취약점 평가 · 패치 관리",
      "애플리케이션 인식 백업 (SQL·Exchange·AD)",
      "Microsoft 365 · 가상머신 백업",
      "유니버설 리스토어",
    ],
    highlight: true,
  },
];

const faqs: FaqItem[] = [
  {
    q: "Acronis Cyber Protect는 어떤 제품인가요?",
    a: "백업과 사이버 보안을 하나로 묶은 통합 솔루션입니다. 서버·PC·NAS·Microsoft 365를 이미지 백업하고, 안티랜섬웨어·안티멀웨어·EDR·취약점 평가·패치 관리를 단일 에이전트와 콘솔에서 함께 운영합니다.",
  },
  {
    q: "단순 백업 솔루션과 무엇이 다른가요?",
    a: "전통적 백업은 데이터 복사에 초점이 있지만, Acronis Cyber Protect는 백업에 더해 랜섬웨어 능동 방어, 안티멀웨어, EDR, 패치 관리를 통합합니다. 백업 데이터 자체도 멀웨어 검사를 거쳐 감염된 복원을 방지합니다.",
  },
  {
    q: "가상머신도 백업할 수 있나요?",
    a: "VMware·Hyper-V 가상머신 백업을 지원합니다. 다만 다양한 가상화 플랫폼(Proxmox·XCP-ng·Citrix 등)을 에이전트리스로 폭넓게 보호하려면 Vinchin Backup & Recovery가 더 적합합니다. 엔드포인트는 Acronis, 가상화 VM은 Vinchin으로 조합하는 구성을 권장합니다.",
  },
  {
    q: "Vinchin과는 어떻게 다른가요?",
    a: "Acronis Cyber Protect는 서버·PC·NAS 같은 엔드포인트를 에이전트 기반으로 백업하고 보안까지 통합합니다. Vinchin은 가상화 호스트에 붙어 VM을 에이전트리스로 백업·즉시 복구하는 가상화 전용 솔루션입니다. 환경에 맞춰 둘을 조합하거나 한쪽만 운영할 수 있습니다.",
  },
  {
    q: "마이로켓은 Acronis를 어떻게 지원하나요?",
    a: "마이로켓은 Acronis Cyber Protect Authorized Partner / MSP로서 도입 검토와 PoC, 구축·정책 설계, 운영·유지보수, 정기 복구 검증까지 지원합니다. 단순 라이선스 판매가 아니라 운영과 복구 가능성을 함께 책임집니다.",
  },
  {
    q: "도입 비용은 어떻게 되나요?",
    a: "라이선스는 보호 대상 종류·수량(서버·워크스테이션·워크로드)과 에디션, 구독 방식에 따라 달라집니다. 환경을 알려주시면 적합한 에디션과 견적 방향을 회신드립니다.",
  },
];

/* JSON-LD — Product(SoftwareApplication) + Breadcrumb + FAQ. 가격 비노출. */
const productLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Acronis Cyber Protect",
  applicationCategory: "Backup and Cybersecurity Software",
  operatingSystem: "Windows, Linux, macOS, VMware, Hyper-V, Microsoft 365",
  description:
    "백업, 안티랜섬웨어, 안티멀웨어, EDR, 취약점 평가·패치 관리를 단일 에이전트와 콘솔로 통합한 사이버 보호 솔루션.",
  url: `${SITE_URL}/products/acronis-cyber-protect`,
  brand: { "@type": "Brand", name: "Acronis" },
  provider: { "@type": "ProfessionalService", "@id": ORG_ID },
};

const ldObjects = [
  productLd,
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "제품", path: "/products/acronis-cyber-protect" },
    { name: "Acronis Cyber Protect", path: "/products/acronis-cyber-protect" },
  ]),
  faqPageLd(faqs),
];

export default function AcronisCyberProtectPage() {
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
          <Link href="/" className="hover:text-blue-600">홈</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-400">제품</span>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700 font-medium">Acronis Cyber Protect</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative border-b border-gray-100">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-blue-700 tracking-widest uppercase mb-5">
                Acronis Cyber Protect
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold text-gray-900 leading-[1.25] kr-keep-all mb-5">
                백업과 보안을 하나로,<br className="hidden md:block" />
                <span className="md:hidden"> </span>사고가 나도 복구됩니다.
              </h1>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed kr-keep-all mb-8 max-w-xl">
                서버·PC·NAS·Microsoft 365를 이미지 백업하고, 안티랜섬웨어·안티멀웨어·EDR·패치
                관리를 단일 에이전트와 콘솔로 통합한 사이버 보호 솔루션입니다.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Link
                  href="/contact?source=acronis-product&interest=acronis&subject=Acronis Cyber Protect 도입 문의"
                  className="px-5 py-2.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold shadow-sm transition-all"
                >
                  도입·견적 문의
                </Link>
                <Link
                  href="/services/acronis-backup"
                  className="px-5 py-2.5 bg-white text-gray-900 border border-gray-400 rounded-md hover:bg-gray-50 hover:border-gray-500 font-semibold transition-all"
                >
                  백업·보안 점검 서비스
                </Link>
                <a
                  href={PHONE_TEL}
                  className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium"
                >
                  ☎ {companyLegal.phone}
                </a>
              </div>
            </div>

            {/* 제품 대표 이미지 슬롯 */}
            <ImgSlot
              label="제품 대표 이미지 (콘솔 / 제품 컷)"
              file="hero.png"
              ratio="aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* 신뢰 지표 */}
      <section className="border-b border-gray-100 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {metrics.map((m) => (
              <div key={m.label}>
                <p className="text-3xl sm:text-4xl font-bold text-blue-400 mb-1">
                  {m.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 kr-keep-all">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AEO 정의 문장 */}
      <section className="border-b border-gray-100 bg-blue-50/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <p className="text-base sm:text-lg text-gray-800 leading-relaxed kr-keep-all max-w-3xl">
            <span className="font-semibold text-blue-700">Acronis Cyber Protect</span>는 데이터
            백업과 사이버 보안(안티랜섬웨어·안티멀웨어·EDR·패치 관리)을 하나의 에이전트와 콘솔로
            통합해, 사고를 예방하고 사고가 나도 빠르게 복구하는 통합 사이버 보호 솔루션입니다.
          </p>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Why Acronis
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 kr-keep-all">
            백업과 보안을 함께 보는 이유
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="flex gap-4 p-6 rounded-xl bg-white border border-gray-200"
              >
                <span className="flex-shrink-0 w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={h.icon} />
                  </svg>
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5 kr-keep-all">
                    {h.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                    {h.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 보호 대상 */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Protected Workloads
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 kr-keep-all">
            보호 대상
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            물리·가상·클라우드 워크로드를 폭넓게 보호합니다. 한 콘솔에서 서버부터 Microsoft
            365까지 함께 관리합니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {workloads.map((w) => (
              <div
                key={w}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 kr-keep-all"
              >
                <span className="text-blue-600 font-bold flex-shrink-0">·</span>
                <span>{w}</span>
              </div>
            ))}
          </div>

          {/* 보호 대상 다이어그램 슬롯 */}
          <ImgSlot
            label="보호 대상 / 5중 보호(예방·탐지·대응·복구·포렌식) 다이어그램"
            file="protection.png"
            ratio="aspect-[16/5]"
          />
        </div>
      </section>

      {/* 주요 기능 */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Key Features
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 kr-keep-all">
            주요 기능
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f) => (
                <li
                  key={f.title}
                  className="p-5 rounded-xl bg-white border border-gray-200"
                >
                  <h3 className="text-base font-semibold text-gray-900 mb-1.5 kr-keep-all">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                    {f.desc}
                  </p>
                </li>
              ))}
            </ul>

            {/* 콘솔/기능 스크린샷 슬롯 */}
            <ImgSlot
              label="관리 콘솔 / 기능 스크린샷"
              file="console.png"
              ratio="aspect-[3/4]"
            />
          </div>
        </div>
      </section>

      {/* 에디션 */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Editions
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 kr-keep-all">
            에디션
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            보호 대상과 보안 요건에 따라 에디션을 선택합니다. 정확한 기능 구성·라이선스(워크로드
            단위, 구독)는 공식 데이터시트와 견적 기준으로 안내드립니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editions.map((e) => (
              <div
                key={e.name}
                className={`flex flex-col p-6 rounded-xl bg-white border ${
                  e.highlight ? "border-blue-300 ring-1 ring-blue-200" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{e.name}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      e.highlight
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {e.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-5">
                  {e.summary}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {e.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-gray-700 kr-keep-all">
                      <span className="text-blue-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/contact?source=acronis-product&interest=acronis&subject=${encodeURIComponent(
                    `Acronis ${e.name} 도입 문의`,
                  )}`}
                  className={`inline-flex items-center justify-center px-4 py-2.5 rounded-md font-semibold text-sm transition-all mt-auto ${
                    e.highlight
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-gray-900 border border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {e.name.replace("Cyber Protect ", "")} 견적 문의
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 kr-keep-all">
            * 라이선스 가격은 단독 판매가 아니라 환경 검토·도입·운영을 포함한 협업 형태로
            안내드립니다.
          </p>
        </div>
      </section>

      {/* 마이로켓이 제공하는 것 — Authorized Partner / MSP 정직 표기 */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            How Myloket Supports
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 kr-keep-all">
            마이로켓이 제공하는 것
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            마이로켓은 Acronis Cyber Protect Authorized Partner / MSP입니다. 단순 라이선스
            판매가 아니라 도입 검토부터 구축·운영·복구검증까지 대표 엔지니어가 직접 책임집니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { no: "01", title: "도입 검토·PoC", desc: "보호 대상에 맞는 에디션·구성을 검토하고 PoC로 검증합니다." },
              { no: "02", title: "구축·정책 설계", desc: "백업 정책, 보존 주기, 보안·패치 정책을 설계합니다." },
              { no: "03", title: "운영·유지보수", desc: "백업 성공률·위협·패치 상태를 점검하고 월간 보고서로 정리합니다." },
              { no: "04", title: "복구 검증", desc: "실제 복구 가능 여부를 정기적으로 테스트하고 결과를 남깁니다." },
            ].map((s) => (
              <div key={s.no} className="p-5 rounded-xl bg-white border border-gray-200">
                <p className="text-xs font-bold text-blue-700 tracking-widest mb-2">{s.no}</p>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5 kr-keep-all">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">{s.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-600 kr-keep-all">
            가상화 VM(VMware·Hyper-V·Proxmox·XCP-ng 등) 백업을 함께 보려면{" "}
            <Link href="/products/vinchin-backup" className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800">
              Vinchin Backup &amp; Recovery
            </Link>
            를, 점검·복구검증 서비스는{" "}
            <Link href="/services/acronis-backup" className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800">
              백업·보안 점검
            </Link>
            을 참고하세요.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            FAQ
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 kr-keep-all">
            자주 묻는 질문
          </h2>
          <div className="space-y-3 max-w-3xl">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl bg-white border border-gray-200 p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-3 text-base font-semibold text-gray-900 kr-keep-all">
                  <span>{f.q}</span>
                  <span className="mt-1 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 kr-keep-all">
            지금 백업, 사고가 나도 복구되나요?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl leading-relaxed kr-keep-all">
            보호할 대상(서버·PC·NAS·Microsoft 365)과 수량, 현재 백업·보안 현황만 알려주시면
            적합한 에디션·구성과 견적 방향을 회신드립니다.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact?source=acronis-product-bottom&interest=acronis&subject=Acronis Cyber Protect 도입 문의"
              className="inline-block px-7 py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-0.5"
            >
              도입·견적 문의
            </Link>
            <Link
              href="/services/acronis-backup"
              className="inline-block px-7 py-3.5 bg-white/10 border border-white/60 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base transition-all"
            >
              백업·보안 점검 서비스
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
