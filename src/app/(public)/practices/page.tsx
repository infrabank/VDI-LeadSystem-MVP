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

/**
 * 참고 단가 — 분석서 §13 기반 범위 노출. 실제 견적은 환경·규모·산출물 깊이에 따라 결정.
 * 작업량이 아니라 "고객이 피하는 리스크" 기준으로 산정.
 */
const pricingItems: {
  title: string;
  brand: string;
  range: string;
  unit: string;
  outcome: string;
  href: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
}[] = [
  {
    title: "N²SF 전환 사전진단",
    brand: "Transition Diagnosis",
    range: "300만~700만 원",
    unit: "1회 프로젝트",
    outcome: "현재 구조도 + C/S/O 예비 분류 + 1차 로드맵·RFP 문구",
    href: "/practices/managed-integration",
    borderColor: "#7c3aed",
    textColor: "text-purple-700",
    badgeBg: "bg-purple-50",
  },
  {
    title: "VDI 역할 재정의 컨설팅",
    brand: "VDI Repositioning",
    range: "700만~1,500만 원",
    unit: "1회 프로젝트",
    outcome: "유지·축소·DaaS·고위험 분리 시나리오 비교 + 운영 리스크 평가",
    href: "/practices/vdi-workspace",
    borderColor: "#2563eb",
    textColor: "text-blue-700",
    badgeBg: "bg-blue-50",
  },
  {
    title: "MFA QuickStart for VDI/DaaS",
    brand: "MFA Design",
    range: "500만~1,200만 원",
    unit: "1회 프로젝트",
    outcome: "사용자군별 인증 흐름도·예외/장애 우회·관리자 보호·PoC 체크리스트",
    href: "/practices/mfa-access",
    borderColor: "#4f46e5",
    textColor: "text-indigo-700",
    badgeBg: "bg-indigo-50",
  },
  {
    title: "백업·DR 복구검증",
    brand: "Recovery Verification",
    range: "월 100만~300만 원",
    unit: "월 단위 매니지드",
    outcome: "월간 복구 테스트 리포트·RTO/RPO 기준표·24h 대응·무결성 검증",
    href: "/practices/data-protection",
    borderColor: "#059669",
    textColor: "text-emerald-700",
    badgeBg: "bg-emerald-50",
  },
  {
    title: "SI 제안 기술자문 (옵션)",
    brand: "SI Consortium Advisory",
    range: "건당 300만~1,000만 원",
    unit: "프로젝트 단위",
    outcome: "SI 컨소시엄 안에서 N²SF·VDI 파트 설명·산출물 정리·수주 지원",
    href: "/contact?source=practices&interest=si-advisory",
    borderColor: "#475569",
    textColor: "text-slate-700",
    badgeBg: "bg-slate-100",
  },
];

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

      {/* 참고 단가 */}
      <section id="pricing" className="bg-white border-t border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Pricing Guide
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
            참고 단가 — 작업량이 아니라 리스크 기준
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-2xl mx-auto kr-keep-all">
            범위는 환경·규모·산출물 깊이에 따라 결정됩니다. 정확한 견적은 인터뷰 후 산출합니다.
          </p>
          <div className="space-y-3 sm:space-y-4">
            {pricingItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-5 sm:p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                style={{ borderLeft: `4px solid ${item.borderColor}` }}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${item.textColor}`}>
                    {item.brand}
                  </p>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 kr-keep-all">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed kr-keep-all">
                    {item.outcome}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 sm:flex-col sm:items-end sm:text-right">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${item.badgeBg} ${item.textColor}`}
                  >
                    {item.unit}
                  </span>
                  <p className="text-base sm:text-lg font-bold text-gray-900 whitespace-nowrap">
                    {item.range}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 md:mt-10 p-5 sm:p-6 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
              <span className="font-semibold text-gray-900">왜 이런 가격인가요.</span>{" "}
              마이로켓이 파는 것은 시간당 작업이 아니라 <strong>고객이 피하는 리스크</strong>입니다 —
              잘못된 N²SF 정렬, 보안성 검토 반려, 망분리 완화 후 운영 장애, 랜섬웨어 사고 시 복구 실패.
              참고 단가는 분석·산출물·후속 자문을 묶은 패키지 기준이며, 단순 시간당 단가보다 결과 책임이 큰 만큼 다르게 책정됩니다.
            </p>
          </div>
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
