"use client";

/**
 * 진단 페이지 진입 화면(lead step) 위에 노출되는 안내 박스.
 * - 진단 완료 시 받는 5가지 산출물 명시
 * - 1인 전문가 신뢰 라인
 *
 * page.tsx가 "use client"라 server-rendered intro section은 import 불가.
 * 동일 client 환경에서 단순 노출용 — 첫 HTML에는 빈 상태로 들어가지만 metadata는
 * layout.tsx로 SNS 공유 친화 문구가 노출된다.
 */
export function RiskAssessmentIntro() {
  const deliverables = [
    {
      no: "01",
      title: "VDI 유지/축소/전환 1차 검토 의견",
      desc: "환경별로 어떤 시나리오가 적합한지 첫 그림을 제시합니다.",
    },
    {
      no: "02",
      title: "C/S/O 등급 예비 분류표",
      desc: "업무·시스템 단위 N²SF 등급을 예비 검토표로 정리합니다.",
    },
    {
      no: "03",
      title: "MFA 보완 지점",
      desc: "어디에 어떤 정책으로 MFA를 적용해야 하는지 표시합니다.",
    },
    {
      no: "04",
      title: "백업·DR 보완 지점",
      desc: "복원력 증빙 관점에서 부족한 산출물·운영 항목을 짚습니다.",
    },
    {
      no: "05",
      title: "담당자 보고용 1쪽 요약 PDF",
      desc: "임원·심의위원회 보고에 그대로 사용 가능한 1쪽 PDF.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <p className="text-blue-600 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
          N²SF Alignment Diagnosis
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 kr-keep-all">
          7분 자가 진단으로 N²SF 정렬 첫 그림을 잡습니다
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mb-6 md:mb-8 leading-relaxed kr-keep-all max-w-2xl">
          공공·연구기관의 기존 VDI·망분리·MFA·백업 환경을 N²SF 기준으로 정렬 진단합니다.
          진단 완료 시 다음 5가지 산출물을 무료 PDF 리포트로 받습니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-6 md:mb-8">
          {deliverables.map((d) => (
            <div
              key={d.no}
              className="p-3 sm:p-4 bg-white rounded-lg border border-slate-200"
            >
              <p className="text-[10px] font-bold text-blue-600 mb-1">{d.no}</p>
              <p className="text-xs sm:text-[13px] font-bold text-slate-900 mb-1 kr-keep-all leading-snug">
                {d.title}
              </p>
              <p className="text-[11px] text-slate-500 leading-snug kr-keep-all">{d.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>공공·연구기관 10여 곳 구축·운영·유지보수 지원 경험</span>
          </span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>대표 1인이 직접 진단·자문</span>
          </span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>구축은 검증된 파트너 컨소시엄</span>
          </span>
        </div>
      </div>
    </section>
  );
}
