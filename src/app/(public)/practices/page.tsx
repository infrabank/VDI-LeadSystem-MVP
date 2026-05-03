import Link from "next/link";
import { practicesList, company } from "@/lib/site-config";

export const metadata = {
  title: `Solutions | ${company.name}`,
  description: `${company.name}의 4가지 문제 기반 상품 — N²SF 전환 사전진단, VDI 역할 재정의, MFA QuickStart, 백업·DR 복구검증.`,
};

const colorMap: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  blue: { border: "#2563eb", bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  indigo: { border: "#4f46e5", bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
  emerald: { border: "#059669", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  purple: { border: "#7c3aed", bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-500" },
};

export default function PracticesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Solutions
          </p>
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4 leading-[1.15] kr-keep-all">
            공공기관이 N²SF 전환기에 마주치는<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>4가지 문제, 1인 전문가가 답합니다
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            대표 엔지니어가 직접 진단·설계합니다. 구축은 검증된 파트너 컨소시엄으로 수행하므로,
            1인 회사여도 공공·금융 규모 사업을 받을 수 있습니다.
          </p>
        </div>
      </section>

      {/* Practices grid (4 cards) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="grid sm:grid-cols-2 gap-5 md:gap-8">
          {practicesList.map((p) => {
            const c = colorMap[p.primaryColor] || colorMap.blue;
            return (
              <Link
                key={p.id}
                href={p.href}
                className="card-hover group bg-white rounded-xl border border-gray-200 p-6 sm:p-8 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300"
                style={{ borderTop: `4px solid ${c.border}` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>
                    {p.brand}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 kr-keep-all">{p.title}</h2>
                <p className="text-sm font-medium text-gray-500 mb-4 kr-keep-all">{p.tagline}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 kr-keep-all">{p.description}</p>
                <ul className="space-y-1.5 mb-5 text-sm text-gray-700">
                  {p.pillars.map((pl) => (
                    <li key={pl.title} className="flex items-start gap-2">
                      <span
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`}
                      ></span>
                      <span>
                        <span className="font-semibold">{pl.title}</span>{" "}
                        <span className="text-gray-500">— {pl.desc}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${c.text} group-hover:translate-x-0.5 transition-transform`}
                >
                  자세히 보기 →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 kr-keep-all">
            어디서부터 손대야 할지 모르겠다면, 사전진단부터
          </h2>
          <p className="text-sm text-gray-600 mb-6 max-w-xl mx-auto kr-keep-all">
            7분 자가 진단으로 현재 VDI·망분리 환경의 N²SF 정렬 위치를 확인하거나, 대표에게 직접 상담을 요청해주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tools/risk-assessment"
              className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm sm:text-base shadow-sm shadow-blue-200 transition-all hover:-translate-y-0.5"
            >
              N²SF 전환 사전진단
            </Link>
            <Link
              href="/contact?source=practices"
              className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm sm:text-base transition-all"
            >
              대표에게 상담 요청
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
