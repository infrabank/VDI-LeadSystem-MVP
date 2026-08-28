import type { Metadata } from "next";
import Link from "next/link";
import { companyLegal, smbCustomers } from "@/lib/site-config";
import { breadcrumbLd, faqPageLd, serviceLd, type FaqItem } from "@/lib/schema";
import { RelatedTools } from "../RelatedTools";

const PHONE_TEL = `tel:${companyLegal.phone.replace(/-/g, "")}`;

export const metadata: Metadata = {
  alternates: { canonical: "/services/it-maintenance" },
  title: "중소기업 전산 통합 유지보수 — 세종·대전·충청 IT 기술지원",
  description:
    "전산 담당자가 부족한 회사를 위한 전산 유지보수, IT 유지보수, 사내 전산 관리 서비스입니다. PC, 서버, 네트워크, NAS, 백업, Linux/리눅스, Windows Server, HPE·Dell·Lenovo·Supermicro 서버 운영 점검과 장애 대응을 지원합니다.",
};

const AREA = ["세종특별자치시", "대전광역시", "청주시", "천안시", "대한민국"];

const scope = [
  {
    title: "PC·사무실 전산 관리",
    desc: "회사 PC 장애 대응, 사무실 컴퓨터 관리, 계정·권한·프린터·공유폴더 등 일상적인 전산 기술지원을 제공합니다.",
  },
  {
    title: "서버·스토리지 운영 점검",
    desc: "Windows Server, Linux/리눅스, NAS, 스토리지, 서버 RAID, 디스크 상태, 백업 상태를 점검합니다. HPE, Dell, Lenovo, Supermicro 등 주요 서버 장비의 장애 원인 구분과 교체 필요 여부 판단을 지원합니다.",
  },
  {
    title: "네트워크 장애 지원",
    desc: "회사 네트워크 장애, 사무실 인터넷 장애, 내부망 접속 문제를 확인하고 회선, 공유기, 스위치, DNS, 방화벽 등 원인을 구분합니다.",
  },
  {
    title: "백업·랜섬웨어 대비",
    desc: "회사 백업 관리, NAS 백업 관리, 서버 백업 상태를 확인하고 Acronis 기반 랜섬웨어 백업과 복구검증을 지원합니다. 가상 서버(VM) 환경은 Vinchin Backup & Recovery로 에이전트리스 백업을 구성합니다.",
  },
  {
    title: "전산 아웃소싱·IT 아웃소싱",
    desc: "전산 담당자 없을 때, 전산 담당자 퇴사 후 운영 공백이 생겼을 때 사내 전산 외주 또는 IT 아웃소싱 형태로 월간 점검과 기술지원을 제공합니다.",
  },
];

const faqs: FaqItem[] = [
  {
    q: "전산유지보수는 무엇을 해주나요?",
    a: "PC, 서버, 네트워크, NAS, 백업, 보안 상태를 정기적으로 점검하고 장애 발생 시 원인을 구분해 조치 방향을 정리합니다.",
  },
  {
    q: "전산 담당자가 없어도 이용할 수 있나요?",
    a: "가능합니다. 현재 장비 목록, 계정, 백업, 네트워크 구성을 먼저 확인하고 월간 점검 범위를 정리합니다.",
  },
  {
    q: "전산 담당자가 퇴사한 뒤 인수인계가 부족해도 가능한가요?",
    a: "가능합니다. 장비 목록, 계정, 백업, 네트워크 구성을 확인해 현재 운영 상태부터 정리합니다.",
  },
  {
    q: "서버 장비도 지원하나요?",
    a: "Windows Server, Linux/리눅스, NAS, HPE, Dell, Lenovo, Supermicro 등 주요 서버 장비의 기본 점검과 장애 원인 구분을 지원합니다. 제조사 보증 수리나 부품 교체는 필요 시 제조사 또는 협력사 절차와 함께 진행합니다.",
  },
  {
    q: "백업과 랜섬웨어 대비도 포함되나요?",
    a: "백업 정책과 실패 이력을 확인하고, Acronis(서버·PC·NAS)와 Vinchin(가상화 VM) 기반 백업·복구검증을 별도 또는 통합 유지보수 범위로 구성할 수 있습니다.",
  },
  {
    q: "세종, 대전, 청주, 천안도 방문 가능한가요?",
    a: "세종을 기준으로 대전, 청주, 천안 등 충청권 전산 유지보수 문의를 우선 검토합니다. 방문 범위와 주기는 계약 전 협의합니다.",
  },
  {
    q: "문의하면 바로 계약해야 하나요?",
    a: "아닙니다. 현황 확인과 점검 제안까지는 비용이 없으며, 점검 결과만 받고 판단해도 됩니다. 정기 계약 외에 단발 장애 대응도 가능합니다.",
  },
];

const ldObjects = [
  serviceLd({
    name: "전산 유지보수 · IT 기술지원",
    serviceType: "IT Maintenance Service",
    description:
      "PC, 서버, 네트워크, NAS, 백업, 보안 상태를 정기적으로 점검하고 장애 대응을 지원하는 전산 유지보수 서비스.",
    path: "/services/it-maintenance",
    areaServed: AREA,
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/#business" },
    { name: "전산 유지보수", path: "/services/it-maintenance" },
  ]),
  faqPageLd(faqs),
];

export default function ItMaintenancePage() {
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
          <Link href="/#business" className="hover:text-blue-600">서비스</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700 font-medium">전산 유지보수</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative border-b border-gray-100">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
          <p className="text-xs sm:text-sm font-semibold text-gray-500 tracking-widest uppercase mb-6">
            전산 통합 유지보수
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold text-gray-900 leading-[1.3] kr-keep-all mb-6">
            중소기업 전산 유지보수와<br className="hidden md:block" />
            <span className="md:hidden"> </span>IT 기술지원
          </h1>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed kr-keep-all mb-6 max-w-2xl">
            전산 담당자가 없거나 퇴사한 회사를 위해 PC, 서버, 네트워크, NAS, 백업, 보안 상태를
            월 단위로 점검합니다. 단순 방문 수리가 아니라 무엇을 점검했고 무엇을 조치했는지 점검표와
            운영 보고서로 남깁니다.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed kr-keep-all mb-10 max-w-2xl border-l-2 border-blue-400/60 pl-4">
            상담한 사람이 직접 작업합니다. 장비 교체보다 현재 환경에서 가능한 개선을 먼저 제안합니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/contact?source=it-maintenance&interest=it-maintenance&subject=월간 유지보수 상담"
              className="px-5 py-2.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold shadow-sm transition-all"
            >
              월간 유지보수 상담
            </Link>
            <a
              href={PHONE_TEL}
              className="px-5 py-2.5 bg-white text-gray-900 border border-gray-400 rounded-md hover:bg-gray-50 hover:border-gray-500 font-semibold transition-all"
            >
              ☎ {companyLegal.phone} 바로 통화
            </a>
          </div>
        </div>
      </section>

      {/* AEO 정의 문장 */}
      <section className="border-b border-gray-100 bg-blue-50/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <p className="text-base sm:text-lg text-gray-800 leading-relaxed kr-keep-all">
            <span className="font-semibold text-blue-700">전산통합유지보수</span>는 PC, 서버,
            네트워크, NAS, 백업, 보안 상태를 정기적으로 점검하고 장애 대응을 지원하는 서비스입니다.
          </p>
        </div>
      </section>

      {/* 지원 범위 */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            지원 범위
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 kr-keep-all">
            지원 범위
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scope.map((s) => (
              <div key={s.title} className="p-5 rounded-xl bg-white border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2 kr-keep-all">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 견적/문의 */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            견적·문의
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 kr-keep-all">
            견적·문의
          </h2>
          <p className="text-base text-gray-700 leading-relaxed kr-keep-all max-w-3xl mb-4">
            전산 유지보수 견적, IT 유지보수 견적, 전산 유지보수 계약이 필요하시면 현재 사용 중인
            PC 수, 서버/NAS 수, 백업 여부, 장애 이력을 알려주세요. 세종을 기준으로 대전, 청주,
            천안 등 충청권 전산 유지보수 문의를 우선 검토합니다.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed kr-keep-all max-w-3xl mb-6">
            계약을 전제로 하지 않음. 현황 확인과 점검 제안까지는 비용 없음 — 점검 결과만 받고
            판단해도 됨.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">운영 중 고객사</span>
            {smbCustomers.map((c, i) => (
              <span key={c.code} className="flex items-center gap-3">
                {i > 0 && <span className="text-gray-300">·</span>}
                <span className="font-medium text-gray-700">{c.name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-gray-100">
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

      {/* 관련 진단 도구 */}
      <RelatedTools
        tools={[
          {
            href: "/tools/backup-readiness",
            title: "백업·사이버복원력 자가 진단",
            desc: "서버·PC·NAS 백업이 실제 복구 가능한 상태인지 7영역 25문항으로 점검합니다.",
            duration: "약 7분",
          },
          {
            href: "/tools/backup-roi",
            title: "백업 ROI 계산기",
            desc: "장애·랜섬웨어 시나리오별 회피 비용으로 백업 투자 근거를 만듭니다.",
            duration: "약 4분",
          },
        ]}
      />

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 kr-keep-all">
            전산 운영 상태부터 점검해 드립니다
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl leading-relaxed kr-keep-all">
            PC 수, 서버/NAS 수, 백업 여부, 장애 이력만 알려주시면 점검 범위와 견적 방향을 회신드립니다.
          </p>
          <Link
            href="/contact?source=it-maintenance-bottom&interest=it-maintenance&subject=전산 유지보수 견적 문의"
            className="inline-block px-7 py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-0.5"
          >
            전산 유지보수 견적 문의
          </Link>
        </div>
      </section>
    </div>
  );
}
