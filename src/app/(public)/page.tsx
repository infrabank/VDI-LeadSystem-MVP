import Link from "next/link";
import { company, practicesList, partnerships } from "@/lib/site-config";
import { PartnerBadge } from "./PartnerBadge";
import { CustomerShowcase } from "./CustomerShowcase";

const practiceColorMap: Record<string, { border: string; text: string; soft: string }> = {
  blue: { border: "#2563eb", text: "text-blue-600", soft: "bg-blue-50" },
  indigo: { border: "#4f46e5", text: "text-indigo-600", soft: "bg-indigo-50" },
  emerald: { border: "#059669", text: "text-emerald-600", soft: "bg-emerald-50" },
  purple: { border: "#7c3aed", text: "text-purple-600", soft: "bg-purple-50" },
};

const customerProblems = [
  "N²SF 이후 기존 VDI를 유지해야 할지 판단이 어렵다",
  "망분리 완화는 필요하지만 보안성 검토가 부담스럽다",
  "MFA·백업·DaaS 벤더가 각자 자기 솔루션만 말한다",
  "내부 담당자에게는 산출물과 책임 구조가 필요하다",
  "SI·보안 파트너가 제안·구축 단계에서 놓치기 쉬운 기존 VDI 운영 리스크를 기술 산출물로 보강합니다.",
];

const whatWeDo = [
  {
    title: "기존 VDI/망분리 구조 분석",
    desc: "물리·논리 구성·사용자군·외부 협력사 접근 경로를 정리합니다.",
  },
  {
    title: "N²SF C/S/O 업무 분류 지원",
    desc: "업무·시스템 단위 등급 자가분류를 근거 메모와 함께 산출합니다.",
  },
  {
    title: "VDI 유지·축소·전환 판단",
    desc: "운영 리스크와 비용을 함께 보고 시나리오를 비교합니다.",
  },
  {
    title: "MFA·조건부 접근 설계",
    desc: "사용자군별 정책·예외 계정·장애 우회 절차까지 정리합니다.",
  },
  {
    title: "백업·DR 복원력 검증",
    desc: "사고 시 실제 복구 가능한지 월간 단위로 검증·증빙합니다.",
  },
  {
    title: "RFP·보안성 검토·운영계획 산출물",
    desc: "발주·심의·운영 단계에서 쓸 문서를 한 사이클로 묶어 제공합니다.",
  },
];

const aiEdge = [
  {
    no: "01",
    title: "책임 있는 아키텍처 판단",
    desc: "벤더 자료가 아닌, 실제 환경에서 무엇을 남길지·버릴지를 결정합니다.",
  },
  {
    no: "02",
    title: "공공기관 산출물·보안성 검토 대응",
    desc: "착수보고서·현황분석·위험분석·전환 로드맵·검수 체크리스트를 직접 작성합니다.",
  },
  {
    no: "03",
    title: "실제 장애·운영 경험 기반",
    desc: "FSLogix·UAG·NetScaler·인증서·라이선스 등 실제로 터지는 문제를 압니다.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        <div className="bg-dot-pattern absolute inset-0 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 text-center">
          <p className="inline-flex items-center gap-2 text-blue-200 font-semibold text-xs sm:text-sm mb-4 sm:mb-5 tracking-widest uppercase">
            <span className="w-3 sm:w-4 h-px bg-blue-300 inline-block"></span>
            공공기관 N²SF 전환 설계
            <span className="w-3 sm:w-4 h-px bg-blue-300 inline-block"></span>
          </p>
          <h1 className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-5 sm:mb-6 leading-[1.1] kr-keep-all">
            망분리 이후, VDI를<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>어떻게 할지 결정해야 할 때입니다
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed kr-keep-all">
            공공·연구기관의 기존 VDI·망분리·MFA·백업 환경을 N²SF 기준으로 재정렬하고,
            유지·축소·전환 로드맵을 설계합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:flex-wrap">
            <Link
              href="/tools/risk-assessment"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white text-blue-700 rounded-md hover:bg-blue-50 font-semibold text-sm sm:text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
            >
              N²SF 전환 사전진단 신청
            </Link>
            <Link
              href="/tools/vdi-transition"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white/10 border border-white/30 text-white rounded-md hover:bg-white/20 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all"
            >
              VDI 역할 재정의 진단
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip — 1인 전문가 정직 표기 */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            <div className="text-center sm:text-left p-4 sm:p-5 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
              <p className="text-2xl sm:text-3xl font-bold text-blue-700 mb-1">10<span className="text-base sm:text-lg">+</span></p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 kr-keep-all">공공·연구기관 VDI 운영</p>
              <p className="text-xs text-gray-500 kr-keep-all">중앙행정·정부 출연 연구기관 다수 직접 운영</p>
            </div>
            <div className="text-center sm:text-left p-4 sm:p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100">
              <p className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-1.5">대표 1인 책임</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 kr-keep-all">대표 엔지니어가 직접 진단·설계</p>
              <p className="text-xs text-gray-500 kr-keep-all">SI·보안 파트너가 제안에 바로 붙일 수 있는 산출물</p>
            </div>
            <div className="text-center sm:text-left p-4 sm:p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100">
              <p className="text-sm font-bold text-emerald-700 uppercase tracking-widest mb-1.5">검증 파트너 컨소시엄</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 kr-keep-all">구축은 검증된 파트너와 함께</p>
              <p className="text-xs text-gray-500 kr-keep-all">공공·금융 규모 사업 수행 가능</p>
            </div>
          </div>
        </div>
      </section>

      {/* 고객이 지금 겪는 문제 */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-amber-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            The Problem
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
            고객이 지금 겪는 문제
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-2xl mx-auto kr-keep-all">
            2026년 5월 N²SF 시행이 가까워지며, 다음 다섯 질문이 동시에 책상 위에 놓입니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {customerProblems.map((line, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 sm:p-5 bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <span className="flex-shrink-0 w-7 h-7 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed kr-keep-all">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 마이로켓이 하는 일 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          What We Do
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
          마이로켓이 하는 일
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-2xl mx-auto kr-keep-all">
          기술 카테고리가 아니라 고객이 마주한 문제를 기준으로 묶었습니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {whatWeDo.map((it, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-xl border border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-base font-bold text-gray-900 mb-1.5 kr-keep-all">{it.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">{it.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 문제 기반 4상품 */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-purple-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Our Solutions
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
            4가지 문제, 4가지 답
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-2xl mx-auto kr-keep-all">
            기술 카테고리(VDI·MFA·백업) 대신, 고객이 돈 내는 문제로 4상품을 정렬했습니다.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {practicesList.map((p, idx) => {
              const c = practiceColorMap[p.primaryColor] || practiceColorMap.blue;
              const featured = idx === 0;
              return (
                <Link
                  key={p.id}
                  href={p.href}
                  className={`card-hover group bg-white rounded-xl border p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col ${
                    featured ? "border-purple-200 ring-1 ring-purple-100" : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ borderTop: `4px solid ${c.border}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>
                      {p.brand}
                    </span>
                    {featured && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                        1순위
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 kr-keep-all">{p.title}</h3>
                  <p className="text-xs font-medium text-gray-500 mb-3 kr-keep-all">{p.tagline}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 kr-keep-all flex-1">
                    {p.description.length > 100 ? p.description.slice(0, 100) + "…" : p.description}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold ${c.text} group-hover:translate-x-0.5 transition-transform`}
                  >
                    자세히 →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5단계 패키지 깊이 */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <p className="text-blue-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
            Engagement Depth
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
            5단계 패키지 — 어디서부터 시작할지
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10 md:mb-14 max-w-2xl mx-auto kr-keep-all">
            무료 자가 진단부터 월간 매니지드까지. 정확한 비용은 기관 환경·규모·산출물 깊이에 따라 인터뷰 후 산정합니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { stage: "Stage 0", level: "무료", title: "자가진단", duration: "7분 (셀프)", outcome: "1쪽 PDF 리포트 + 이메일 수집", href: "/tools/risk-assessment", color: "#0ea5e9", bg: "bg-sky-50", text: "text-sky-700" },
              { stage: "Stage 1", level: "입문", title: "사전진단", duration: "1주", outcome: "현재 구조도 + C/S/O 분류 + 1차 로드맵", href: "/practices/managed-integration", color: "#7c3aed", bg: "bg-purple-50", text: "text-purple-700" },
              { stage: "Stage 2", level: "핵심", title: "역할 재정의 워크숍", duration: "2주", outcome: "유지·축소·DaaS·고위험 분리 시나리오 비교", href: "/practices/vdi-workspace", color: "#2563eb", bg: "bg-blue-50", text: "text-blue-700" },
              { stage: "Stage 3", level: "고급", title: "RFP·심의 대응 패키지", duration: "4주", outcome: "착수·현황·위험·로드맵·대응표·운영·검수 7종", href: "/practices/managed-integration", color: "#4f46e5", bg: "bg-indigo-50", text: "text-indigo-700" },
              { stage: "Stage 4", level: "반복 매출", title: "월간 복구검증", duration: "월 단위 매니지드", outcome: "복구 시연 리포트 + RTO/RPO 기준표 + 24h 절차", href: "/practices/data-protection", color: "#059669", bg: "bg-emerald-50", text: "text-emerald-700" },
              { stage: "옵션", level: "SI 컨소시엄", title: "SI 제안 기술자문", duration: "프로젝트 단위", outcome: "SI 제안에서 N²SF·VDI 파트 보강·산출물 정리", href: "/contact?source=home-stages&interest=si-advisory", color: "#475569", bg: "bg-slate-100", text: "text-slate-700" },
            ].map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group block p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                style={{ borderLeft: `4px solid ${s.color}` }}
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${s.bg} ${s.text}`}>
                    {s.stage}
                  </span>
                  <span className={`text-[11px] font-semibold ${s.text}`}>{s.level}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1 kr-keep-all">{s.title}</h3>
                <p className="text-xs font-semibold text-gray-700 mb-2">{s.duration}</p>
                <p className="text-xs text-gray-500 leading-relaxed kr-keep-all">{s.outcome}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6 md:mt-8">
            <Link href="/practices#pricing" className="text-sm font-medium text-blue-700 hover:text-blue-800">
              5단계 패키지 자세히 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* AI 시대 1인 전문가의 강점 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <p className="text-indigo-600 font-semibold text-xs sm:text-sm text-center mb-3 tracking-widest uppercase">
          Why a Solo Specialist
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 kr-keep-all">
          AI 시대, 모방하기 어려운 전문성
        </h2>
        <p className="text-gray-600 text-center text-sm sm:text-base mb-10 md:mb-14 max-w-3xl mx-auto leading-relaxed kr-keep-all">
          AI로 일반 SI 자료·진단도구는 누구나 만들 수 있습니다. 그러나
          Horizon·UAG·FSLogix·XenServer·NetApp·인증서·망분리 운영에서 실제로 터지는 문제와
          공공기관 산출물 흐름은 경험 없이는 얕습니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
          {aiEdge.map((e) => (
            <div
              key={e.no}
              className="p-6 rounded-xl border border-gray-200 bg-white"
            >
              <p className="text-xs font-bold text-indigo-600 tracking-widest mb-3">{e.no}</p>
              <h3 className="text-base font-bold text-gray-900 mb-2 kr-keep-all">{e.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customers trust strip */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Trusted By
          </p>
          <p className="text-center text-sm sm:text-base font-semibold text-gray-700 mb-6 md:mb-8 kr-keep-all">
            공공·연구기관 10여 곳의 VDI·DaaS 환경을 직접 운영해 왔습니다
          </p>
          <CustomerShowcase variant="compact" />
          <div className="text-center mt-6 md:mt-8">
            <Link href="/about#customers" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
              전체 고객사 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* Partnerships strip */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 md:mb-8">
            Technology Partnerships
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4">
            {partnerships.map((p) => (
              <PartnerBadge key={p.name} partner={p} variant="strip" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-800/30 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <p className="text-blue-200 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
            Free First Diagnosis
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 kr-keep-all">
            현재 VDI를 어떻게 재조합할지, 7분이면 첫 그림이 나옵니다
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mb-6 max-w-2xl mx-auto leading-relaxed kr-keep-all">
            8개 영역 28문항 자가 진단 후, 다음 5가지를 정리한 PDF 리포트를 받습니다. 추가 상담은 대표가 직접 회신.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3 max-w-3xl mx-auto mb-8 md:mb-10">
            {[
              "VDI 유지/축소/전환 1차 판정",
              "C/S/O 등급 예비 분류표",
              "MFA 보완 지점",
              "백업·DR 보완 지점",
              "담당자 보고용 1쪽 요약",
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-3 text-left"
              >
                <p className="text-[10px] font-bold text-blue-200 mb-1">{String(i + 1).padStart(2, "0")}</p>
                <p className="text-xs sm:text-[13px] text-white font-medium leading-snug kr-keep-all">{item}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tools/risk-assessment"
              className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-semibold text-sm sm:text-base shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
            >
              N²SF 전환 사전진단 시작
            </Link>
            <a
              href="mailto:jhw@mlkit.co.kr"
              className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 font-semibold text-sm sm:text-base backdrop-blur-sm transition-all"
            >
              대표에게 직접 메일
            </a>
          </div>
          <p className="text-xs text-blue-200/80 mt-4">
            {company.email} · 평일 1영업일 내 회신
          </p>
        </div>
      </section>
    </div>
  );
}
