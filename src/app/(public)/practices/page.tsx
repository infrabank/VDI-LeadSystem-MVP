import Link from "next/link";
import { practicesList, company } from "@/lib/site-config";

export const metadata = {
  alternates: { canonical: "/practices" },
  title: "컨설팅 라인",
  description: `${company.name}의 4가지 컨설팅 라인 — N²SF 전환 사전진단, VDI 역할 재정의, MFA QuickStart, 백업·DR 복구검증. 메인 서비스는 VDI·백업 기술지원·유지보수이며, 본 페이지는 컨설팅·자문 라인 정보입니다.`,
};

const colorMap: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  blue: { border: "var(--color-domain-vdi)", bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  indigo: { border: "var(--color-domain-mfa)", bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
  emerald: { border: "var(--color-domain-backup)", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  purple: { border: "var(--color-domain-managed)", bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-500" },
};

/**
 * 5단계 패키지 — 무료 자가 진단 → 1차 진단 리포트 → 워크숍 → RFP 패키지 → 월간 매니지드.
 * 가격은 환경·규모·산출물 깊이에 따라 인터뷰 후 산정 (시간당 단가 아님).
 * 출처: docs/00-strategy/AI대전환과마이로켓의미래.md §13 (단계·기간·산출물 기준)
 */
const stageItems: {
  stage: string;
  level: string;
  title: string;
  duration: string;
  priceGuide: string;
  outcome: string;
  href: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
}[] = [
  {
    stage: "Stage 0",
    level: "무료",
    title: "N²SF 정렬 자가 진단",
    duration: "7분 (셀프)",
    priceGuide: "무료",
    outcome:
      "C/S/O 예비 분류 + VDI 유지/축소/전환 1차 검토 의견 + MFA·백업 보완 지점 PDF 리포트",
    href: "/tools/risk-assessment",
    borderColor: "var(--color-domain-vdi)",
    textColor: "text-blue-700",
    badgeBg: "bg-blue-50",
  },
  {
    stage: "Stage 1",
    level: "입문",
    title: "N²SF 전환 1차 진단 리포트",
    duration: "1주 (인터뷰 + 산출물)",
    priceGuide: "소형 환경 기준 300만 원대~",
    outcome:
      "현재 VDI/망분리 구조도 + C/S/O 예비 분류 + 1차 로드맵·RFP 문구 초안",
    href: "/practices/managed-integration",
    borderColor: "var(--color-domain-managed)",
    textColor: "text-purple-700",
    badgeBg: "bg-purple-50",
  },
  {
    stage: "Stage 2",
    level: "핵심",
    title: "VDI 역할 재정의 워크숍",
    duration: "2주 (인터뷰 + 시나리오 비교)",
    priceGuide: "범위 협의 (소형/표준/대형)",
    outcome:
      "유지·축소·DaaS·고위험 분리 시나리오 비교 + 운영 리스크 평가",
    href: "/practices/vdi-workspace",
    borderColor: "var(--color-domain-vdi)",
    textColor: "text-blue-700",
    badgeBg: "bg-blue-50",
  },
  {
    stage: "Stage 3",
    level: "고급",
    title: "RFP·보안성 검토 대응 패키지",
    duration: "4주 (산출물 7종 작성)",
    priceGuide: "산출물 범위별 견적",
    outcome:
      "착수보고서·현황·위험·로드맵·대응표·운영계획·검수 체크리스트 7종",
    href: "/practices/managed-integration",
    borderColor: "var(--color-domain-mfa)",
    textColor: "text-indigo-700",
    badgeBg: "bg-indigo-50",
  },
  {
    stage: "Stage 4",
    level: "반복 매출",
    title: "백업·DR 월간 복구검증",
    duration: "월 단위 매니지드",
    priceGuide: "월 단위 계약",
    outcome:
      "월간 복구 시연 리포트 + RTO/RPO 기준표 + 24h 대응 절차 + 무결성 검증",
    href: "/practices/data-protection",
    borderColor: "var(--color-domain-backup)",
    textColor: "text-emerald-700",
    badgeBg: "bg-emerald-50",
  },
  {
    stage: "옵션",
    level: "SI 컨소시엄",
    title: "SI 제안 기술자문",
    duration: "프로젝트 단위",
    priceGuide: "수주 후 정산 · 사전 단계 별도 청구 없음",
    outcome:
      "SI 컨소시엄 안에서 N²SF·VDI 기술 파트 보강 (수주 후 자문·PMO·검수). 사전 검토·미팅 동행은 공동 영업으로 진행",
    href: "/partners",
    borderColor: "var(--color-domain-neutral)",
    textColor: "text-gray-700",
    badgeBg: "bg-gray-100",
  },
];

export default function PracticesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Consulting Lines
          </p>
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 sm:mb-8 leading-[1.15] kr-keep-all">
            컨설팅·자문 라인 4종
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            메인 서비스는 <Link href="/" className="text-white underline underline-offset-4 decoration-blue-300">VDI·백업 기술지원·유지보수</Link>입니다.
            본 페이지는 N²SF 전환 사전진단·VDI 역할 재정의 등 컨설팅·자문 라인 정보입니다.
            기존 환경의 운영장애·점검·복구검증이 우선이면 홈으로 돌아가세요.
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
                className="card-hover group bg-white rounded-xl border border-gray-200 p-6 sm:p-8 transition hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300"
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

      {/* 5단계 패키지 */}
      <section id="pricing" className="bg-white border-t border-gray-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Engagement Stages
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
            단계·기간으로 보는 5단계 패키지
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-2xl mx-auto kr-keep-all">
            무료 자가 진단부터 월간 매니지드까지. 정확한 비용은 기관 환경·규모·산출물 깊이에 따라 인터뷰 후 산정합니다.
          </p>
          <div className="space-y-3 sm:space-y-4">
            {stageItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-5 sm:p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-2xs font-bold uppercase tracking-widest ${item.badgeBg} ${item.textColor}`}
                    >
                      {item.stage}
                    </span>
                    <span className={`text-2xs font-semibold ${item.textColor}`}>
                      {item.level}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 kr-keep-all">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed kr-keep-all">
                    {item.outcome}
                  </p>
                </div>
                <div className="flex items-center sm:flex-col sm:items-end sm:text-right gap-2 sm:gap-1">
                  <p className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap">
                    {item.duration}
                  </p>
                  <p className="text-2xs sm:text-xs font-semibold text-gray-500 whitespace-nowrap kr-keep-all">
                    참고 가격대 · {item.priceGuide}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 md:mt-10 p-5 sm:p-6 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
              <span className="font-semibold text-gray-900">참고 가격대는 어떻게 보나요.</span>{" "}
              내부 예산 검토용 <strong>예산감</strong>입니다. 동일한 단계라도 기관 환경·시스템 수·산출물 깊이·외부 협력사 수에 따라 비용이 달라지므로,
              <strong>최종 견적은 1~2회 인터뷰 후 단계·산출물 범위와 함께 확정</strong>합니다.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
              <span className="font-semibold text-gray-900">왜 기간으로도 표시하나요.</span>{" "}
              마이로켓이 파는 것은 시간당 작업이 아니라 <strong>단계별 산출물과 결과 책임</strong>입니다. 본 표는 결정에 필요한 <strong>단계·기간·예산감</strong>을 함께 보여줍니다.
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
              className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-300 font-semibold text-sm sm:text-base shadow-sm shadow-amber-200/70 transition hover:-translate-y-0.5"
            >
              N²SF 전환 사전진단
            </Link>
            <Link
              href="/contact?source=practices"
              className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm sm:text-base transition"
            >
              대표에게 상담 요청
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
