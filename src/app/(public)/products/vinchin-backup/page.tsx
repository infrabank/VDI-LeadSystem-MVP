import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { companyLegal } from "@/lib/site-config";
import { breadcrumbLd, faqPageLd, SITE_URL, ORG_ID, type FaqItem } from "@/lib/schema";

const PHONE_TEL = `tel:${companyLegal.phone.replace(/-/g, "")}`;
const DOCS_URL = "https://vinchin.myloket.co.kr";

export const metadata: Metadata = {
  alternates: { canonical: "/products/vinchin-backup" },
  title: "Vinchin Backup & Recovery — 가상화 VM 백업·즉시 복구 솔루션",
  description:
    "VMware vSphere, Hyper-V, Proxmox VE, XCP-ng, Citrix Hypervisor 등 15종 이상 가상화 플랫폼을 에이전트리스로 백업하고, 장애 시 VM을 즉시 복구하며 다른 플랫폼으로 V2V 마이그레이션하는 Vinchin Backup & Recovery. VBTP 인증 엔지니어가 도입·구축·운영·유지보수를 지원합니다.",
};

/* ──────────────────────────────────────────────────────────────────
 * 이미지 슬롯 — 파트너 페이지(Vinchin)에서 조달한 자산을 채워 넣는 자리.
 * 사용자가 이미지를 /public/products/vinchin/<file> 에 올린 뒤
 * <ImgSlot> 자리를 <img>/<Image>로 교체하면 됩니다.
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
      className={`${ratio} w-full rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 flex flex-col items-center justify-center text-center px-4 py-6`}
    >
      <svg aria-hidden="true"
        className="w-8 h-8 text-emerald-400 mb-2"
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
      <p className="text-sm font-semibold text-emerald-700 kr-keep-all">{label}</p>
      <p className="mt-1 text-2xs text-emerald-700/90 font-mono">
        /products/vinchin/{file}
      </p>
      <p className="mt-1 text-2xs text-gray-600 kr-keep-all">
        파트너 페이지에서 조달 후 교체
      </p>
    </div>
  );
}

/* 신뢰 지표 — Vinchin 공식 수치 (제품 소개용). */
const metrics = [
  { value: "100+", label: "서비스 국가" },
  { value: "1.6M+", label: "보호 중인 VM" },
  { value: "10,000+", label: "전 세계 고객사" },
  { value: "15+", label: "지원 가상화 플랫폼" },
];

/* 핵심 가치 — 왜 Vinchin인가 (Top reasons). */
const highlights: { title: string; desc: string; icon: string }[] = [
  {
    title: "에이전트리스 백업",
    desc: "게스트 OS마다 에이전트를 설치하지 않고 가상화 호스트 레벨에서 VM을 통째로 백업합니다. 운영 부담과 장애 지점을 줄입니다.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    title: "즉시 복구 (Instant Recovery)",
    desc: "백업본에서 VM을 수십 초~수 분 내 부팅해 업무를 먼저 복귀시키고, 백그라운드로 정식 복원을 진행합니다.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "랜섬웨어 대비 구조",
    desc: "백업 데이터 암호화, 변경 불가(immutable) 보관, 이상 탐지로 감염 후에도 복구 가능한 백업 라인을 유지합니다.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "크로스 플랫폼 마이그레이션",
    desc: "백업본을 다른 가상화 플랫폼으로 복원하는 V2V로, VMware→Proxmox 등 플랫폼 전환·이중화에 활용합니다.",
    icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
  },
];

/* 지원 가상화 플랫폼 — Vinchin 공식 지원 목록 기준. */
const platforms = [
  "VMware vSphere / ESXi",
  "Microsoft Hyper-V",
  "Proxmox VE",
  "XCP-ng",
  "Citrix Hypervisor (XenServer)",
  "Red Hat Virtualization / oVirt",
  "Oracle Linux Virtualization (OLVM)",
  "Sangfor HCI",
  "Huawei FusionCompute",
  "H3C CAS / UIS",
  "OpenStack",
  "ZStack",
];

/* 추가 백업 대상 — VM 외 데이터. */
const otherTargets = [
  "데이터베이스 (Oracle, MySQL, SQL Server, PostgreSQL 등)",
  "파일 서버 · NAS 데이터",
  "물리 Windows / Linux 서버",
];

/* 주요 기능 — 기능 카드. */
const features: { title: string; desc: string }[] = [
  {
    title: "증분·영구증분 백업",
    desc: "CBT 기반 변경 블록만 백업해 백업 창과 스토리지 사용량을 최소화합니다.",
  },
  {
    title: "중복제거·압축",
    desc: "백업 데이터 중복제거와 압축으로 저장 비용을 낮춥니다.",
  },
  {
    title: "GFS 보존 정책",
    desc: "일·주·월·년 단위 세대 보존(GFS)으로 장기 보관 요건을 충족합니다.",
  },
  {
    title: "오프사이트 복제",
    desc: "원격지로 백업본을 복제해 본사 사고 시에도 복구 거점을 확보합니다.",
  },
  {
    title: "클라우드 아카이브",
    desc: "S3 호환 오브젝트 스토리지로 장기 백업을 아카이빙합니다.",
  },
  {
    title: "백업 데이터 암호화",
    desc: "전송·저장 구간 암호화와 변경 불가 보관으로 데이터를 보호합니다.",
  },
  {
    title: "세분화 복구",
    desc: "전체 VM부터 개별 파일까지 필요한 단위로 골라 복원합니다.",
  },
  {
    title: "복구 검증",
    desc: "복원 가능 여부를 사전에 확인해 \"백업은 됐지만 복구가 안 되는\" 상황을 방지합니다.",
  },
];

/* 에디션 — 정직한 제품 소개 (가격 비노출, 정확한 구성은 견적·공식 데이터시트 기준). */
const editions: {
  name: string;
  badge: string;
  summary: string;
  points: string[];
  highlight: boolean;
}[] = [
  {
    name: "Standard",
    badge: "기본 백업",
    summary: "단일 가상화 환경의 정기 백업·복구가 필요한 경우.",
    points: [
      "에이전트리스 VM 백업·복구",
      "증분·영구증분 백업",
      "GFS 보존 정책",
      "즉시 복구",
    ],
    highlight: false,
  },
  {
    name: "Enterprise",
    badge: "전사·재해복구",
    summary: "다중 환경·DR·랜섬웨어 대비까지 포함한 전사 운영용. (참조 페이지의 Perpetual Enterprise 라인)",
    points: [
      "Standard의 모든 기능",
      "크로스 플랫폼 V2V 복구·마이그레이션",
      "중복제거·압축",
      "오프사이트 복제 · 클라우드 아카이브",
      "데이터베이스 백업",
      "백업 암호화 · 변경 불가 보관",
    ],
    highlight: true,
  },
];

const faqs: FaqItem[] = [
  {
    q: "Vinchin Backup & Recovery는 어떤 제품인가요?",
    a: "VMware vSphere, Hyper-V, Proxmox VE, XCP-ng, Citrix Hypervisor 등 15종 이상의 가상화 플랫폼을 에이전트리스로 백업하고, 장애 시 VM을 즉시 복구하며 다른 플랫폼으로 마이그레이션할 수 있는 가상화 전용 백업·복구 솔루션입니다.",
  },
  {
    q: "에이전트리스 백업이 무엇이고 왜 좋은가요?",
    a: "게스트 VM마다 백업 에이전트를 설치하지 않고 가상화 호스트에 연동해 VM을 통째로 백업하는 방식입니다. VM이 늘어도 에이전트 관리 부담이 없고, 에이전트 자체가 만드는 장애 지점이 줄어듭니다.",
  },
  {
    q: "기존에 쓰던 가상화 플랫폼을 바꿔도 백업본을 쓸 수 있나요?",
    a: "가능합니다. Vinchin은 백업본을 다른 가상화 플랫폼으로 복원하는 V2V 마이그레이션을 지원합니다. 예를 들어 VMware에서 받은 백업을 Proxmox VE나 Hyper-V로 복원해 플랫폼 전환·이중화에 활용할 수 있습니다.",
  },
  {
    q: "Acronis와는 어떻게 다른가요?",
    a: "Acronis Cyber Protect는 서버·PC·NAS 같은 엔드포인트를 에이전트 기반으로 백업하고 랜섬웨어 방어·EDR을 함께 제공합니다. Vinchin은 가상화 호스트에 붙어 VM을 에이전트리스로 백업·즉시 복구하는 가상화 전용 솔루션입니다. 환경에 맞춰 둘을 조합하거나 한쪽만 운영할 수 있습니다.",
  },
  {
    q: "마이로켓은 Vinchin을 어떻게 지원하나요?",
    a: "마이로켓은 Vinchin Backup & Recovery를 취급하는 기술지원 회사로, 도입 전 환경 검토와 PoC, 구축·설정, 백업 정책 설계, 운영·유지보수, 복구 검증까지 지원합니다. 대표 엔지니어가 Vinchin 공식 기술자격(VBTP)을 보유하고 있습니다.",
  },
  {
    q: "도입 비용은 어떻게 되나요?",
    a: "라이선스는 보호 대상 규모(호스트·소켓·VM 수)와 에디션, 구독/영구 방식에 따라 달라집니다. 환경을 알려주시면 적합한 에디션과 견적 방향을 회신드립니다. 마이로켓은 단순 라이선스 판매가 아니라 도입·운영·복구검증까지 함께 책임지는 형태로 협업합니다.",
  },
];

/* JSON-LD — Product(SoftwareApplication) + Breadcrumb + FAQ. 가격은 비노출. */
const productLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Vinchin Backup & Recovery",
  applicationCategory: "Backup and Recovery Software",
  operatingSystem: "VMware vSphere, Microsoft Hyper-V, Proxmox VE, XCP-ng, Citrix Hypervisor",
  description:
    "15종 이상의 가상화 플랫폼을 에이전트리스로 백업하고, 즉시 복구·크로스 플랫폼 V2V 마이그레이션·랜섬웨어 대비 보관을 지원하는 가상화 전용 백업·복구 솔루션.",
  url: `${SITE_URL}/products/vinchin-backup`,
  brand: { "@type": "Brand", name: "Vinchin" },
  provider: { "@type": "ProfessionalService", "@id": ORG_ID },
};

const ldObjects = [
  productLd,
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "제품", path: "/products/vinchin-backup" },
    { name: "Vinchin Backup & Recovery", path: "/products/vinchin-backup" },
  ]),
  faqPageLd(faqs),
];

export default function VinchinBackupPage() {
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
          <Link href="/" className="hover:text-emerald-700">홈</Link>
          <span aria-hidden="true" className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">제품</span>
          <span aria-hidden="true" className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700 font-medium">Vinchin Backup &amp; Recovery</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative border-b border-gray-100">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-600 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-700 tracking-widest uppercase mb-5">
                Vinchin Backup &amp; Recovery
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold text-gray-900 leading-[1.25] kr-keep-all mb-5">
                가상화 VM을 통째로 백업하고,<br className="hidden md:block" />
                <span className="md:hidden"> </span>장애 시 즉시 복구합니다.
              </h1>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed kr-keep-all mb-8 max-w-xl">
                VMware·Hyper-V·Proxmox·XCP-ng·Citrix 등 15종 이상의 가상화 플랫폼을
                에이전트리스로 백업하고, 다른 플랫폼으로 복원하는 마이그레이션까지 지원하는
                가상화 전용 백업·복구 솔루션입니다.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Link
                  href="/contact?source=vinchin-product&interest=vinchin&subject=Vinchin 백업 도입 문의"
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-semibold shadow-sm transition"
                >
                  도입·견적 문의
                </Link>
                <a
                  href={DOCS_URL}
                  target="_blank"
                  rel="noopener"
                  className="px-5 py-2.5 bg-white text-gray-900 border border-gray-400 rounded-md hover:bg-gray-50 hover:border-gray-500 font-semibold transition"
                >
                  한글 헬프센터
                </a>
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
              label="제품 대표 이미지 (대시보드 / 제품 컷)"
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
                <p className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-1">
                  {m.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 kr-keep-all">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AEO 정의 문장 */}
      <section className="border-b border-gray-100 bg-emerald-50/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <p className="text-base sm:text-lg text-gray-800 leading-relaxed kr-keep-all max-w-3xl">
            <span className="font-semibold text-emerald-700">Vinchin Backup &amp; Recovery</span>는
            가상화 서버(VM)를 에이전트 설치 없이 호스트 레벨에서 통째로 백업하고, 장애 시 VM을
            즉시 복구하거나 다른 가상화 플랫폼으로 옮길 수 있는 가상화 전용 백업·복구
            솔루션입니다.
          </p>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Why Vinchin
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 kr-keep-all">
            가상화 백업에 특화된 이유
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="flex gap-4 p-6 rounded-xl bg-white border border-gray-200"
              >
                <span className="flex-shrink-0 w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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

      {/* 지원 플랫폼 */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Supported Platforms
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 kr-keep-all">
            지원 가상화 플랫폼
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            주요 상용·오픈소스 하이퍼바이저를 폭넓게 지원합니다. 단일 콘솔에서 멀티 플랫폼을
            함께 보호하고, 플랫폼 간 마이그레이션도 가능합니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {platforms.map((p) => (
              <div
                key={p}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 kr-keep-all"
              >
                <span className="text-emerald-700 font-bold flex-shrink-0">·</span>
                <span>{p}</span>
              </div>
            ))}
          </div>

          {/* 플랫폼 로고 스트립 슬롯 */}
          <ImgSlot
            label="지원 플랫폼 로고 스트립 (VMware · Hyper-V · Proxmox · XCP-ng · Citrix …)"
            file="platforms.png"
            ratio="aspect-[16/4]"
          />

          {/* 추가 백업 대상 */}
          <div className="mt-10">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Also Protects
            </p>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 kr-keep-all">
              VM 외 백업 대상
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {otherTargets.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2.5 p-4 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 leading-relaxed kr-keep-all"
                >
                  <span className="text-emerald-700 font-bold flex-shrink-0 mt-0.5">·</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
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

            {/* 백업 흐름 다이어그램 슬롯 */}
            <ImgSlot
              label="백업·복구 아키텍처 / 흐름 다이어그램"
              file="architecture.png"
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
            환경 규모와 요건에 따라 에디션을 선택합니다. 정확한 기능 구성·라이선스(호스트·소켓·VM
            단위, 구독/영구)는 공식 데이터시트와 견적 기준으로 안내드립니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editions.map((e) => (
              <div
                key={e.name}
                className={`flex flex-col p-6 rounded-xl bg-white border ${
                  e.highlight ? "border-emerald-300 ring-1 ring-emerald-200" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{e.name}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      e.highlight
                        ? "bg-emerald-600 text-white"
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
                      <span className="text-emerald-700 font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/contact?source=vinchin-product&interest=vinchin&subject=${encodeURIComponent(
                    `Vinchin ${e.name} 도입 문의`,
                  )}`}
                  className={`inline-flex items-center justify-center px-4 py-2.5 rounded-md font-semibold text-sm transition mt-auto ${
                    e.highlight
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-white text-gray-900 border border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {e.name} 견적 문의
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

      {/* 마이로켓이 제공하는 것 — 취급 솔루션·VBTP 정직 표기 */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            How Myloket Supports
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 kr-keep-all">
            마이로켓이 제공하는 것
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            마이로켓은 Vinchin Backup &amp; Recovery를 취급하는 기술지원 회사입니다. 단순 라이선스
            판매가 아니라 도입 검토부터 구축·운영·복구검증까지 대표 엔지니어가 직접 책임집니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { no: "01", title: "도입 검토·PoC", desc: "현재 가상화 환경에 맞는 에디션·구성을 검토하고 PoC로 검증합니다." },
              { no: "02", title: "구축·정책 설계", desc: "백업 정책, 보존 주기, 오프사이트·아카이브 구조를 설계합니다." },
              { no: "03", title: "운영·유지보수", desc: "백업 성공률·실패 이력을 점검하고 월간 보고서로 정리합니다." },
              { no: "04", title: "복구 검증", desc: "실제 복구 가능 여부를 정기적으로 테스트하고 결과를 남깁니다." },
            ].map((s) => (
              <div key={s.no} className="p-5 rounded-xl bg-white border border-gray-200">
                <p className="text-xs font-bold text-emerald-700 tracking-widest mb-2">{s.no}</p>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5 kr-keep-all">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* VBTP 인증 배지 + Silver Partner 배지 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="inline-flex flex-shrink-0 items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold">
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              VBTP 인증
            </span>
            <p className="text-sm text-gray-700 leading-relaxed kr-keep-all">
              대표 엔지니어가 Vinchin 공식 기술자격{" "}
              <strong className="text-gray-900">VBTP(Vinchin Backup Technology Professional)</strong>를
              보유하고 있습니다. 인증서 번호·유효기간은{" "}
              <Link href="/about/certifications" className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800">
                인증 페이지
              </Link>
              에서 확인할 수 있습니다.
            </p>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl bg-white border border-gray-200">
            <Image
              src="/credentials/vinchin-silver-partner.png"
              alt="Vinchin Silver Partner"
              width={120}
              height={107}
              className="w-24 h-auto flex-shrink-0 mx-auto sm:mx-0"
            />
            <p className="text-sm text-gray-700 leading-relaxed kr-keep-all">
              마이로켓은 <strong className="text-gray-900">Vinchin 공식 Silver Partner</strong>로,
              라이선스 공급부터 구축·운영까지 벤더 파트너 자격을 갖추고 지원합니다. 제품 스펙과
              구성 옵션이 정리된{" "}
              <a
                href="/vinchin-product-brochure.pdf"
                target="_blank"
                rel="noopener"
                className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
              >
                제품 브로슈어(PDF)
              </a>
              를 다운로드해 확인할 수 있습니다.
            </p>
          </div>

          <p className="mt-6 text-sm text-gray-600 kr-keep-all">
            엔드포인트(서버·PC·NAS) 백업과 함께 보려면{" "}
            <Link href="/services/acronis-backup" className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800">
              백업·보안 점검 서비스
            </Link>
            를 참고하세요.
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

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-emerald-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 kr-keep-all">
            가상화 VM, 지금 제대로 백업되고 있나요?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl leading-relaxed kr-keep-all">
            현재 가상화 플랫폼(VMware/Hyper-V/Proxmox 등)과 VM 규모, 백업 현황만 알려주시면
            적합한 에디션·구성과 견적 방향을 회신드립니다.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact?source=vinchin-product-bottom&interest=vinchin&subject=Vinchin 백업 도입 문의"
              className="inline-block px-7 py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/30 transition hover:-translate-y-0.5"
            >
              도입·견적 문의
            </Link>
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noopener"
              className="inline-block px-7 py-3.5 bg-white/10 border border-white/60 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base transition"
            >
              한글 헬프센터 보기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
