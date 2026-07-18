import type { Metadata } from "next";
import Link from "next/link";
import { partnerships } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "SI 파트너를 위한 VDI·백업 기술지원 협업",
  description:
    "Citrix Virtual Apps and Desktops, Omnissa Horizon, Acronis Cyber Protect 기반 제안·구축·유지보수에 필요한 기술 검토, 장애 원인 분석, 월간 점검 리포트, 백업 복구검증 산출물을 SI 파트너와 함께 제공합니다.",
};

const services = [
  {
    no: "01",
    title: "기술 미팅 동행",
    duration: "반나절~1일",
    desc: "고객 미팅에 함께 들어가 질문에 직접 대응합니다.",
  },
  {
    no: "02",
    title: "운영환경 사전 점검",
    duration: "1주",
    desc: "고객 환경을 점검하고 리스크를 정리합니다.",
  },
  {
    no: "03",
    title: "장애 원인 분석",
    duration: "1~3일",
    desc: "로그를 보고 원인을 구분하고 조치 방향을 정리합니다.",
  },
  {
    no: "04",
    title: "월간 점검 보고서",
    duration: "월 단위",
    desc: "점검 결과를 제출 가능한 형태로 정리합니다.",
  },
  {
    no: "05",
    title: "백업 복구검증",
    duration: "1~2주",
    desc: "백업이 실제로 복구되는지 테스트하고 보고서로 남깁니다.",
  },
  {
    no: "06",
    title: "벤더 SR 대응 보조",
    duration: "건당",
    desc: "SR 케이스 정리와 회신 해석을 보조합니다.",
  },
  {
    no: "07",
    title: "제안서 기술 검토",
    duration: "1~2주",
    desc: "RFP 기술요건과 운영 리스크를 검토합니다.",
  },
];

const triggers = [
  "고객 환경에서 접속장애·FSLogix·UAG 이슈가 반복된다",
  "백업은 되는데 복구가 검증되지 않았다",
  "Citrix·Horizon 업그레이드 리스크가 크다",
  "월간 점검 보고서를 공공기관 형식으로 납품해야 한다",
  "고객 미팅에 동행할 운영 경험자가 필요하다",
  "벤더 SR 회신 해석이 어렵다",
];

const cases = [
  {
    color: "purple",
    label: "CASE 01",
    org: "중앙행정 데이터 기관",
    env: "Omnissa Horizon · VMware ESXi",
    line: "외부 연구자 접속형 VDI를 다년간 운영. 월간 리포트와 장애 분석을 제공했습니다.",
  },
  {
    color: "blue",
    label: "CASE 02",
    org: "정부 출연 국토 연구기관",
    env: "Omnissa Horizon · UAG · VMware ESXi",
    line: "UAG·인증서·세션 점검을 표준화하고 월간 가용률 리포트를 납품했습니다.",
  },
  {
    color: "emerald",
    label: "CASE 03",
    org: "정부 출연 과학기술정보 연구기관",
    env: "Citrix · Omnissa Workspace ONE",
    line: "멀티 벤더 환경을 다년간 자문. 마이그레이션 가이드를 제공했습니다.",
  },
];

const inquiryEmailBody = `[고객 환경 / 협업 건 개요 — 자유 기재]
- 고객 (발주처·기관·기업):
- 사용 제품·버전 (Citrix VAD / Omnissa Horizon / Acronis Cyber Protect / Vinchin Backup & Recovery / 기타):
- 막힌 기술 파트 (접속장애 / FSLogix / UAG·NetScaler / 인증서·라이선스 / 스토리지·성능 / 백업·복구검증 / 가상화 VM 백업):
- 요청 형태 (기술 미팅 동행 / 사전 점검 / 장애 분석 / 월간 보고서 / 복구검증 / SR 대응 / 제안서 검토):
- 일정·마감:

[연락처]
- 회사·직책:
- 성명:
- 전화/이메일:`;

const mailtoHref = `mailto:jhw@mlkit.co.kr?subject=${encodeURIComponent("[SI 기술지원 협업 문의]")}&body=${encodeURIComponent(inquiryEmailBody)}`;

const colorMap = {
  purple: "text-purple-700",
  blue: "text-blue-700",
  emerald: "text-emerald-700",
} as const;

export default function PartnersPage() {
  return (
    <div className="bg-white">
      {/* ========== Hero — SI가 얻는 것 먼저 ========== */}
      <section className="relative border-b border-gray-100">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-600 via-blue-600 to-emerald-600 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
          <p className="text-xs sm:text-sm font-semibold text-gray-500 tracking-widest uppercase mb-6">
            For SI Partners — VDI · Backup Technical Support
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold text-gray-900 leading-[1.3] kr-keep-all mb-6">
            고객 앞 기술 질문과 운영 장애 대응에<br className="hidden md:block" />
            <span className="md:hidden"> </span>대표 엔지니어가 함께 들어갑니다.
          </h1>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed kr-keep-all mb-10 max-w-2xl">
            Citrix, Omnissa Horizon, Acronis, Vinchin 기반 제안과 운영에 필요한 기술 검토,
            장애 분석, 점검 리포트, 복구 검증을 함께 만듭니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <a
              href={mailtoHref}
              className="px-5 py-2.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold shadow-sm transition-all"
            >
              기술지원 협업 요청
            </a>
            <a
              href="/partners-onepager.pdf"
              target="_blank"
              rel="noopener"
              className="px-5 py-2.5 bg-white text-gray-900 border border-gray-400 rounded-md hover:bg-gray-50 hover:border-gray-500 font-semibold transition-all"
            >
              A4 1장 자료 (PDF)
            </a>
            <a
              href="tel:010-3861-8079"
              className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium"
            >
              010-3861-8079
            </a>
          </div>
        </div>
      </section>

      {/* ========== 이런 상황에서 부르세요 — 트리거 ========== */}
      <section className="border-b border-gray-100 bg-amber-50/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">
            When to Call
          </p>
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-semibold text-gray-900 mb-6 kr-keep-all">
            이런 상황에서 부르세요
          </h2>
          <ul className="space-y-2.5">
            {triggers.map((t) => (
              <li
                key={t}
                className="flex gap-3 text-base text-gray-800 leading-relaxed kr-keep-all"
              >
                <span className="text-amber-500 font-bold flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ========== 통합유지보수 사업 협업 ========== */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-2">
            Integrated Maintenance
          </p>
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-semibold text-gray-900 mb-4 kr-keep-all">
            전산통합유지보수 사업 안의 VDI·가상화·백업 영역을 지원합니다
          </h2>
          <p className="text-base text-gray-700 leading-relaxed kr-keep-all mb-6 max-w-3xl">
            공공기관 전산통합유지보수 공고에는 서버, 네트워크, 보안, 업무시스템과 함께
            VDI·가상화·백업 운영 범위가 포함되는 경우가 많습니다. 주사업자가 전체 사업을 총괄하고,
            마이로켓은 Citrix, Omnissa Horizon, VMware vSphere, Acronis, Vinchin처럼 별도 경험이 필요한 영역을
            비상주 전문 기술지원 형태로 맡습니다.
          </p>
          <ul className="space-y-2.5 text-base text-gray-700 leading-relaxed kr-keep-all mb-6">
            {[
              "RFP의 VDI·가상화·백업 요구사항 검토",
              "제안 단계 기술 리스크와 견적 범위 정리",
              "수주 후 월간 점검, 장애 분석, 패치 검토 지원",
              "고객 제출용 점검보고서, 장애보고서, 작업계획서 작성",
              "벤더 SR 회신 정리와 조치 방향 검토",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="text-purple-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 leading-relaxed kr-keep-all mb-6 max-w-3xl bg-gray-50 border border-gray-200 rounded-xl p-4">
            상주 SM 인력 파견은 하지 않습니다. 대신 통합유지보수 사업 안에서 전문 영역을 맡는
            비상주 기술지원, 정기점검, 장애분석, 산출물 작성 방식으로 협업합니다.
          </p>
          <Link
            href="/partners/integrated-maintenance"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:text-purple-800"
          >
            통합유지보수 협업 페이지 보기 →
          </Link>
        </div>
      </section>

      {/* ========== 해주는 일 5개 ========== */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            What We Do
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 kr-keep-all">
            바로 하는 일
          </h2>
          <p className="text-sm text-gray-500 mb-8 kr-keep-all">
            제안·미팅 현장에서 바로 요청할 수 있는 단위로 정리했습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {services.map((s) => (
              <div
                key={s.no}
                className="p-5 rounded-xl bg-white border border-gray-200"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 tracking-widest">
                    {s.no}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {s.duration}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2 kr-keep-all">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 보조 가능 영역 ========== */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Auxiliary Scope
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 kr-keep-all">
            보조 가능 영역
          </h2>
          <p className="text-sm text-gray-500 mb-5 kr-keep-all max-w-3xl">
            메인은 VDI·백업 기술지원·유지보수입니다. 다음 항목은 SI 제안의 부수 요구로 추가
            지원 가능하지만, 단독 상품으로 판매하지는 않습니다.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700 kr-keep-all">
            <li className="flex gap-2"><span className="text-gray-300 flex-shrink-0">·</span>N²SF 환경에서의 VDI 역할 검토 (운영자 관점)</li>
            <li className="flex gap-2"><span className="text-gray-300 flex-shrink-0">·</span>RFP 기술요건 일부 검토</li>
            <li className="flex gap-2"><span className="text-gray-300 flex-shrink-0">·</span>보안성 검토 응답 자료 보조</li>
            <li className="flex gap-2"><span className="text-gray-300 flex-shrink-0">·</span>MFA가 VDI 접속에 미치는 운영 영향 검토</li>
          </ul>
        </div>
      </section>

      {/* ========== 협업·정산 구조 ========== */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            How We Work
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 kr-keep-all">
            협업·정산 구조
          </h2>
          <p className="text-sm text-gray-500 mb-6 kr-keep-all max-w-3xl">
            사전 단계는 별도 청구하지 않습니다. 수주 후 프로젝트 안에서 정산합니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest mb-2">
                STAGE 1 · 사전
              </p>
              <h3 className="text-base font-semibold text-gray-900 mb-2 kr-keep-all">
                기술 검토·미팅 동행
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed kr-keep-all">
                <strong className="text-emerald-800">별도 청구 없음.</strong>{" "}
                기술 리스크 검토와 고객 미팅 동행은 공동 영업으로 진행합니다.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200">
              <p className="text-[11px] font-bold text-blue-700 uppercase tracking-widest mb-2">
                STAGE 2 · 수주 이후
              </p>
              <h3 className="text-base font-semibold text-gray-900 mb-2 kr-keep-all">
                자문·PMO·검수
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed kr-keep-all">
                <strong className="text-blue-800">프로젝트 견적에 포함.</strong>{" "}
                사업 기간 동안 대표 엔지니어가 함께 책임집니다.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2">
                STAGE 3 · 구축
              </p>
              <h3 className="text-base font-semibold text-gray-900 mb-2 kr-keep-all">
                파트너사 직접 청구
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed kr-keep-all">
                구축은 파트너가 수행·인보이싱하고 마이로켓은 자문·검수만 맡습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 왜 마이로켓인가 — 신뢰 신호 ========== */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Why Myloket
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5 kr-keep-all">
            왜 마이로켓인가
          </h2>
          <ul className="space-y-3 text-base text-gray-700 leading-relaxed kr-keep-all mb-6">
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">·</span>
              <span>공공·연구기관 VDI 10여 곳을 다년간 운영해 왔습니다.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">·</span>
              <span>Citrix · Omnissa Horizon · Acronis · Vinchin 운영 경험 기반, 벤더 중립.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">·</span>
              <span>대표 엔지니어가 처음부터 끝까지 직접 맡습니다.</span>
            </li>
          </ul>
          <div className="flex flex-wrap gap-2">
            {partnerships.map((p) => (
              <span
                key={p.name}
                className={`text-xs font-semibold px-3 py-1.5 rounded ${p.bgColor} ${p.textColor} border border-gray-200`}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 사례 3개 카드 — 3줄로 ========== */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Engagements
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 kr-keep-all">
            실제 경험
          </h2>
          <p className="text-sm text-gray-500 mb-8 kr-keep-all">
            기관명은 익명, 환경과 역할은 사실대로 적습니다.
          </p>

          <div className="space-y-3">
            {cases.map((c) => (
              <div
                key={c.label}
                className="p-5 rounded-xl bg-white border border-gray-200"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                  <span
                    className={`text-xs font-bold tracking-widest ${colorMap[c.color as keyof typeof colorMap]}`}
                  >
                    {c.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 kr-keep-all">
                    {c.org}
                  </span>
                  <span className="text-xs text-gray-500">· {c.env}</span>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed kr-keep-all">
                  {c.line}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 1인 회사 — 짧게 ========== */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            About the Structure
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 kr-keep-all">
            1인 기술자문 회사입니다
          </h2>
          <p className="text-base text-gray-700 leading-[1.85] kr-keep-all">
            1인 기술자문 회사입니다. 대표가 직접 검토·납품하고, 대규모 구축은 파트너가 맡습니다.
            상주 SM 인력 파견·총판 영업은 하지 않지만, 통합유지보수 사업 안의 VDI·가상화·백업
            전문영역은 비상주 기술지원으로 맡습니다.
          </p>
        </div>
      </section>

      {/* ========== Out of Scope — 하단 배치 ========== */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Out of Scope
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5 kr-keep-all">
            단, 이런 건 하지 않습니다
          </h2>
          <ul className="space-y-2.5 text-base text-gray-700 leading-relaxed kr-keep-all">
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">—</span>
              <span>단순 라이선스 영업·총판 마진</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">—</span>
              <span>인증 신청 대행 (CC, GS, ISMS-P 등)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">—</span>
              <span>인력 파견·SM 외주·상주</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">—</span>
              <span>민간 일반 사무 IT 컨설팅</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ========== Insights teaser ========== */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Writing
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 kr-keep-all">
            글로 정리한 관점
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-5 max-w-2xl">
            Citrix · Horizon · Acronis 운영 노트를 인사이트로 정리해 둡니다.
            미팅·제안 단계에서 그대로 참고할 수 있습니다.
          </p>
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
          >
            Insights 전체 보기
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ========== Final contact ========== */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-5 kr-keep-all">
            고객 환경과 증상만 보내주세요
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            제품·버전·증상·요청 형태만 보내주시면 1영업일 내 1차 원인 구분과 가능한 협업 방식을 회신드립니다.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-base">
            <a
              href={mailtoHref}
              className="font-semibold text-gray-900 hover:text-amber-700 underline underline-offset-4 decoration-amber-400"
            >
              jhw@mlkit.co.kr
            </a>
            <a
              href="tel:010-3861-8079"
              className="text-gray-700 hover:text-gray-900"
            >
              010-3861-8079
            </a>
            <Link
              href="/about"
              className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-4 decoration-gray-300"
            >
              회사·법적 정보
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
