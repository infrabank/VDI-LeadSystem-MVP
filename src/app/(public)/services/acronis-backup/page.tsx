import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbLd, faqPageLd, serviceLd, type FaqItem } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Acronis 백업·복구보안 | 서버·PC 랜섬웨어 대비 | Myloket",
  description:
    "Acronis Cyber Protect 기반으로 서버, PC, NAS 데이터를 보호하고 장애나 랜섬웨어 상황에서 실제 복구 가능한지 정기적으로 확인합니다. 백업 정책, 실패 이력, 복구 테스트 결과를 보고서로 정리합니다.",
};

const AREA = ["세종특별자치시", "대전광역시", "청주시", "천안시", "대한민국"];

const includes = [
  "Acronis Cyber Protect 도입·운영",
  "서버·PC·NAS 백업 정책 구성",
  "백업 실패 이력 점검",
  "복구 테스트와 결과 보고서",
  "랜섬웨어 대응 복구 절차 정리",
];

const faqs: FaqItem[] = [
  {
    q: "백업이 성공했다고 나오면 충분한가요?",
    a: "아닙니다. 백업 성공 여부와 실제 복구 가능성은 다를 수 있습니다. 정기적인 복구 테스트와 결과 기록이 필요합니다.",
  },
  {
    q: "랜섬웨어 대비에도 도움이 되나요?",
    a: "Acronis 백업 정책과 복구 절차를 정리하면 감염 후 복구 가능성을 높일 수 있습니다. 단, 백업만으로 모든 보안 위협을 막을 수는 없으므로 계정, 패치, 엔드포인트 보안도 함께 확인해야 합니다.",
  },
];

const ldObjects = [
  serviceLd({
    name: "Acronis 백업·복구보안",
    serviceType: "Backup and Recovery Service",
    description:
      "Acronis Cyber Protect 기반으로 서버와 PC 데이터를 백업하고, 장애나 랜섬웨어 상황에서 실제 복구 가능한지 확인하는 서비스.",
    path: "/services/acronis-backup",
    areaServed: AREA,
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/#services" },
    { name: "Acronis 백업·복구보안", path: "/services/acronis-backup" },
  ]),
  faqPageLd(faqs),
];

export default function AcronisBackupPage() {
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
          <Link href="/" className="hover:text-emerald-600">홈</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link href="/#services" className="hover:text-emerald-600">서비스</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700 font-medium">Acronis 백업·복구보안</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative border-b border-gray-100">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-600 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
          <p className="text-xs sm:text-sm font-semibold text-gray-500 tracking-widest uppercase mb-6">
            Acronis Backup
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold text-gray-900 leading-[1.3] kr-keep-all mb-6">
            Acronis 백업·복구보안
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-emerald-700 leading-snug kr-keep-all mb-5 max-w-2xl">
            백업 성공률보다 중요한 것은 실제 복구 가능성입니다.
          </p>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed kr-keep-all mb-10 max-w-2xl">
            Acronis Cyber Protect 기반으로 서버, PC, NAS 데이터를 보호하고, 장애나 랜섬웨어
            상황에서 실제 복구 가능한지 정기적으로 확인합니다. 백업 정책, 실패 이력, 에이전트 상태,
            복구 테스트 결과를 보고서로 정리합니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/contact?source=acronis-backup&interest=acronis&subject=Acronis 백업 상담"
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-semibold shadow-sm transition-all"
            >
              Acronis 백업 상담
            </Link>
            <Link
              href="/services/it-maintenance"
              className="px-5 py-2.5 bg-white text-gray-900 border border-gray-400 rounded-md hover:bg-gray-50 hover:border-gray-500 font-semibold transition-all"
            >
              전산 유지보수 보기
            </Link>
          </div>
        </div>
      </section>

      {/* AEO 정의 문장 */}
      <section className="border-b border-gray-100 bg-emerald-50/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <p className="text-base sm:text-lg text-gray-800 leading-relaxed kr-keep-all">
            <span className="font-semibold text-emerald-700">Acronis 백업·복구보안</span>은 서버와
            PC 데이터를 백업하고, 장애나 랜섬웨어 상황에서 실제 복구 가능한지 확인하는 서비스입니다.
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
                <span className="text-emerald-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                <span>{t}</span>
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
          <p className="text-emerald-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 kr-keep-all">
            지금 백업, 실제로 복구되나요?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl leading-relaxed kr-keep-all">
            현재 백업 방식, 대상 서버·PC·NAS, 최근 복구 테스트 여부만 알려주시면 점검 방향을 회신드립니다.
          </p>
          <Link
            href="/contact?source=acronis-backup-bottom&interest=acronis&subject=Acronis 백업 상담"
            className="inline-block px-7 py-3.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-0.5"
          >
            Acronis 백업 상담
          </Link>
        </div>
      </section>
    </div>
  );
}
