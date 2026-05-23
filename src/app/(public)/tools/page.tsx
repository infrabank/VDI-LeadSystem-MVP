import Link from "next/link";
import { company } from "@/lib/site-config";

export const metadata = {
  title: `Tools | ${company.name}`,
  description: "N²SF 정렬·전환 준비도·VDI 역할 재정의·VDI ROI 등 진단·계산 도구 모음.",
};

const tools = [
  {
    rank: "01",
    title: "N²SF 정렬 진단",
    desc: "N²SF 보안통제 매핑 기반 · 8영역 28문항 · 업무 등급별 적용 가능 모델 후보",
    duration: "약 7분",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "#2563eb",
    href: "/tools/risk-assessment",
    primary: true,
  },
  {
    rank: "02",
    title: "N²SF 전환 준비도",
    desc: "5섹션 15문항 · 5단계 성숙도 + 3단계 로드맵",
    duration: "약 5분",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "#2563eb",
    href: "/tools/n2sf-readiness",
    primary: false,
  },
  {
    rank: "03",
    title: "VDI 역할 재정의",
    desc: "9문항 · 4가지 시나리오 후보 도출 (유지/보완/축소/재설계)",
    duration: "약 3분",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    color: "#4f46e5",
    href: "/tools/vdi-transition",
    primary: false,
  },
  {
    rank: "04",
    title: "VDI 운영 ROI",
    desc: "마이그레이션·운영비용 시뮬레이션 · 경영진 보고용 PDF 제공",
    duration: "약 4분",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "#059669",
    href: "/tools/roi-calculator",
    primary: false,
  },
  {
    rank: "05",
    title: "백업·사이버복원력 자가 진단",
    desc: "7영역 25문항 · 5단계 성숙도 + 보완 우선순위",
    duration: "약 7분",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "#059669",
    href: "/tools/backup-readiness",
    primary: false,
  },
  {
    rank: "06",
    title: "백업 ROI 계산기",
    desc: "5필드 입력 → 5년 누적 회피 비용·ROI%·Payback. Best/Expected/Worst 시나리오",
    duration: "약 4분",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "#0d9488",
    href: "/tools/backup-roi",
    primary: false,
  },
];

export default function ToolsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Tools · Free
          </p>
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 sm:mb-8 leading-[1.15] kr-keep-all">
            7분 만에 N²SF 정렬·VDI 재정의·복구 가능성을<br className="hidden md:block" />
            <span className="md:hidden"> </span>진단합니다
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            6가지 무료 진단·계산으로 현재 환경의 빈틈을 짚고, 담당자 보고용
            PDF 리포트를 받습니다. 별도 가입 없이 이메일만으로 — 정식 판단은
            후속 인터뷰에서 확정합니다.
          </p>
        </div>
      </section>

      {/* Tools grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {tools.map((t) => (
            <Link
              key={t.rank}
              href={t.href}
              className={`card-hover group p-5 sm:p-7 bg-white rounded-xl shadow-sm block transition-all hover:-translate-y-0.5 hover:shadow-md ${
                t.primary ? "ring-2 ring-blue-600 ring-offset-2" : ""
              }`}
              style={{ border: "1px solid #e5e7eb", borderTop: `4px solid ${t.color}` }}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                    t.primary ? "bg-blue-600" : "bg-blue-50"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${t.primary ? "text-white" : "text-blue-600"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
                  </svg>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-gray-300">{t.rank}</span>
                  <span className="text-[10px] sm:text-xs text-gray-400">{t.duration}</span>
                </div>
              </div>
              <h2 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-2.5 kr-keep-all">
                {t.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 kr-keep-all">{t.desc}</p>
              <span className={`text-sm font-semibold ${t.primary ? "text-blue-600" : "text-gray-500"} group-hover:text-blue-600 transition-colors`}>
                진단 시작 →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
