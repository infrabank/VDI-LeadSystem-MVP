import type { Metadata } from "next";
import Link from "next/link";
import { companyLegal } from "@/lib/site-config";
import { breadcrumbLd, faqPageLd, serviceLd, type FaqItem } from "@/lib/schema";

const PHONE_TEL = `tel:${companyLegal.phone.replace(/-/g, "")}`;

const engagements = [
  "중앙행정기관 VDI 구축·운영·유지보수 지원",
  "정부출연연구기관 Horizon 유지보수",
  "공공기관 망분리 VDI 환경 지원",
  "VDI 스토리지 이관, UAG·Gateway 접속장애 대응",
];

export const metadata: Metadata = {
  title: "Citrix·Omnissa Horizon VDI 기술지원 | Myloket",
  description:
    "Citrix Virtual Apps and Desktops, Omnissa Horizon, VMware vSphere 기반 VDI 운영환경의 접속장애, 인증서, 프로파일, UAG/Gateway, FSLogix, vCenter 연계 문제를 분석하고 보고서로 정리합니다.",
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
    q: "장애보고서나 작업계획서도 작성하나요?",
    a: "점검 결과, 원인 구분, 조치 내용, 고객 확인사항을 정리해 운영 보고서나 장애보고서 형태로 작성할 수 있습니다.",
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
    { name: "서비스", path: "/#services" },
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
          <Link href="/" className="hover:text-blue-600">홈</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link href="/#services" className="hover:text-blue-600">서비스</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700 font-medium">VDI 기술지원</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative border-b border-gray-100">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
          <p className="text-xs sm:text-sm font-semibold text-gray-500 tracking-widest uppercase mb-6">
            VDI Technical Support
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
            SI 프로젝트 협업, VDI 운영 고객사 장애 대응, 프로젝트 단위 기술지원 —
            장애보고서·작업계획서·완료보고서 제출 가능함.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/contact?source=vdi-support&interest=vdi&subject=VDI 기술지원 문의"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold shadow-sm transition-all"
            >
              VDI 기술지원 문의
            </Link>
            <Link
              href="/partners/integrated-maintenance"
              className="px-5 py-2.5 bg-white text-gray-900 border border-gray-400 rounded-md hover:bg-gray-50 hover:border-gray-500 font-semibold transition-all"
            >
              SI 파트너 협업 보기
            </Link>
            <a
              href={PHONE_TEL}
              className="px-5 py-2.5 bg-white text-gray-900 border border-gray-400 rounded-md hover:bg-gray-50 hover:border-gray-500 font-semibold transition-all"
            >
              ☎ {companyLegal.phone}
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

      {/* 포함 항목 */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Includes
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 kr-keep-all">
            포함 항목
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
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Engagements
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
            VDI 장애, 제품·버전·증상만 보내주세요
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl leading-relaxed kr-keep-all">
            Citrix·Omnissa Horizon·VMware 환경과 증상을 보내주시면 1영업일 내 1차 원인 구분을 회신드립니다.
          </p>
          <Link
            href="/contact?source=vdi-support-bottom&interest=vdi&subject=VDI 기술지원 문의"
            className="inline-block px-7 py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-0.5"
          >
            VDI 기술지원 문의
          </Link>
        </div>
      </section>
    </div>
  );
}
