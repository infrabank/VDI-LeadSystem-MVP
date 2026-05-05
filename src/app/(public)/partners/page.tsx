import type { Metadata } from "next";
import Link from "next/link";
import { partnerships } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "SI·보안 파트너 기술자문 | Myloket",
  description:
    "공공 VDI·N²SF 제안에서 기술 파트가 막히면 붙이세요. RFP 기술요건·제안서 구현방안·보안성 검토 대응표·고객 앞 기술 미팅까지 대표 엔지니어가 직접 지원합니다.",
};

const services = [
  {
    no: "01",
    title: "고객 앞 기술 미팅 동행",
    nickname: "기술질문 방어 동행 · Tech Q&A Shield",
    duration: "반나절~1일",
    desc: "발주처 기술 담당자·CISO 미팅에서 VDI/N²SF 질문 직접 응대.",
  },
  {
    no: "02",
    title: "VDI/N²SF 전환 시나리오",
    nickname: "VDI 3방향 판단표 · VDI 3-Way Decision Map",
    duration: "사전진단 1주",
    desc: "현재 구조 분석 → C/S/O 분류 → 유지·축소·전환 비교표 + RFP 문구 초안.",
  },
  {
    no: "03",
    title: "RFP·제안서 기술 파트",
    nickname: "RFP 리스크 차단표 · RFP Risk Cut Sheet",
    duration: "1~2주",
    desc: "기술요건·구현방안·통제 매핑·운영 리스크. 제안서에 그대로 붙는 형태로 납품.",
  },
  {
    no: "04",
    title: "보안성 검토 대응표",
    nickname: "N²SF 통제 매핑 대응 · N²SF Control Response Pack",
    duration: "1~2주",
    desc: "N²SF 274개 통제 매핑 기반 심의 대응 답변 초안 + 근거 자료.",
  },
  {
    no: "05",
    title: "구축 파트너 연결",
    nickname: "구축 컨소시엄 브리지 · Build Partner Bridge",
    duration: "별도 계약",
    desc: "구축비는 파트너사 인보이싱, 마이로켓은 기술자문·PMO·검수만 책임.",
  },
];

const triggers = [
  '고객이 "N²SF 이후 VDI는 남겨야 합니까?"라고 묻는다',
  "제안서에 VDI·N²SF 전환 시나리오가 필요하다",
  "RFP 기술요건을 어떻게 써야 할지 애매하다",
  "보안성 검토 대응표가 필요하다",
  "고객 앞 기술 미팅에 동행할 전문가가 필요하다",
];

const cases = [
  {
    color: "purple",
    label: "CASE 01",
    org: "중앙행정 데이터 기관",
    env: "Omnissa Horizon · VMware ESXi",
    line: "수백 명 규모 외부 연구자 접속형 VDI 다년간 구축·운영·유지보수. 월간 운영 리포트, 장애 분석, PowerCLI 스토리지 대시보드 제공.",
  },
  {
    color: "blue",
    label: "CASE 02",
    org: "정부 출연 국토 연구기관",
    env: "Omnissa Horizon · UAG · VMware ESXi",
    line: "100~300명 규모 외부접속 운영 안정화. UAG·인증서·세션 layer별 점검 표준화, 가용률·인증서 잔여 기간 월간 리포트 납품.",
  },
  {
    color: "emerald",
    label: "CASE 03",
    org: "정부 출연 과학기술정보 연구기관",
    env: "Citrix · Omnissa Workspace ONE",
    line: "멀티 벤더 환경 다년간 자문. 사용자군 분류, 시나리오별 비용·리스크, 전환 일정·검증 절차 가이드로 의사결정 기반 제공.",
  },
];

const inquiryEmailBody = `[제안 건 개요 — 자유 기재]
- 발주처:
- 사업명:
- RFP 마감 일정:
- 막힌 기술 파트 (VDI / 망분리 / MFA / 백업 / 보안성 검토 등):

[연락처]
- 회사·직책:
- 성명:
- 전화/이메일:`;

const mailtoHref = `mailto:jhw@mlkit.co.kr?subject=${encodeURIComponent("[SI 기술자문 문의]")}&body=${encodeURIComponent(inquiryEmailBody)}`;

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
            For SI · 보안 파트너
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold text-gray-900 leading-[1.3] kr-keep-all mb-6">
            공공 VDI·N²SF 제안에서 기술 파트가 막히면,<br className="hidden md:block" />
            <span className="md:hidden"> </span>마이로켓을 붙이세요.
          </h1>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed kr-keep-all mb-10 max-w-2xl">
            RFP 기술요건, 제안서 구현방안, 보안성 검토 대응표,
            고객 앞 기술 미팅까지 대표 엔지니어가 직접 지원합니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <a
              href={mailtoHref}
              className="px-5 py-2.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold shadow-sm transition-all"
            >
              제안 건 기술검토 요청
            </a>
            <a
              href="/partners-onepager.pdf"
              target="_blank"
              rel="noopener"
              className="px-5 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 font-semibold transition-all"
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

      {/* ========== 해주는 일 5개 ========== */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            What We Do
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 kr-keep-all">
            바로 하는 일 5가지
          </h2>
          <p className="text-sm text-gray-500 mb-8 kr-keep-all">
            각 항목은 SI 영업·제안 현장에서 바로 부를 수 있는 단위로 정리되어
            있습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {services.map((s) => (
              <div
                key={s.no}
                className="p-5 rounded-lg bg-white border border-gray-200"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 tracking-widest">
                    {s.no}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {s.duration}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1 kr-keep-all">
                  {s.title}
                </h3>
                <p className="text-[11.5px] font-semibold text-purple-700 mb-2 kr-keep-all">
                  {s.nickname}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed kr-keep-all">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
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
            사전 단계에서 SI 영업대표가 자문료를 따로 결재하지 않습니다.
            정산은 수주 이후 프로젝트 안에서 이뤄집니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-5 rounded-lg bg-emerald-50/60 border border-emerald-200">
              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest mb-2">
                STAGE 1 · 사전
              </p>
              <h3 className="text-base font-semibold text-gray-900 mb-2 kr-keep-all">
                기술 검토·미팅 동행
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed kr-keep-all">
                <strong className="text-emerald-800">공동 영업으로 진행, 별도 청구 없음.</strong>{" "}
                RFP 기술 리스크 검토, 고객 미팅 1~2회 동행은 수주 가능성을
                함께 만드는 단계로 봅니다.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-blue-50/60 border border-blue-200">
              <p className="text-[11px] font-bold text-blue-700 uppercase tracking-widest mb-2">
                STAGE 2 · 수주 이후
              </p>
              <h3 className="text-base font-semibold text-gray-900 mb-2 kr-keep-all">
                자문·PMO·검수
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed kr-keep-all">
                <strong className="text-blue-800">프로젝트 견적에 자문료 항목으로 포함.</strong>{" "}
                기술 자문·산출물 검수·N²SF 통제 매핑 대응 등 사업 기간 동안
                대표 엔지니어가 함께 책임집니다.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2">
                STAGE 3 · 구축
              </p>
              <h3 className="text-base font-semibold text-gray-900 mb-2 kr-keep-all">
                구축비는 파트너사 직접 청구
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed kr-keep-all">
                구축은 검증된 파트너 컨소시엄이 수행하고{" "}
                <strong className="text-gray-900">구축비는 파트너사가 직접 인보이싱</strong>합니다.
                마이로켓은 자문·PMO·검수 역할만.
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-6 kr-keep-all max-w-3xl">
            * 단독 자문(사전진단·전환 시나리오만 별도 발주)은 드물게 1주
            단위로 협의 견적합니다.
          </p>
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
              <span>
                공공·연구기관 VDI 10여 곳 구축·운영·유지보수 — 망분리·N²SF·MFA·백업
                정책 변화 5번을 운영 책임자로 함께 통과
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">·</span>
              <span>
                Citrix · Omnissa Horizon · UAG · Workspace ONE · Acronis · MFA — 벤더
                중립 자문
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">·</span>
              <span>
                대표 엔지니어 직접 수행 — 영업 거치지 않고 처음부터 끝까지 한 사람이
                책임
              </span>
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
            기관명은 동의 정책에 따라 익명 표기. 환경·규모·역할은 사실 그대로.
          </p>

          <div className="space-y-3">
            {cases.map((c) => (
              <div
                key={c.label}
                className="p-5 rounded-lg bg-white border border-gray-200"
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
            마이로켓은 1인 기술자문 회사입니다. 대표가 직접 검토·납품하며,
            대규모 구축은 파트너사가 수행하고 마이로켓은 기술자문·PMO·검수
            역할로 참여합니다. 상주·SM·총판 영업은 하지 않습니다.
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
            N²SF 통제 매핑·VDI 역할 재정의·MFA 적용 위치·복구검증 같은 주제로
            기술 인사이트를 정리해두고 있습니다. 발주처·SI 영업대표가 의사결정에
            참고할 수 있는 형태입니다.
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
            RFP·고객 요구사항을 보내주세요
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            막힌 기술 파트만 보내주시면 1영업일 내 VDI·N²SF 리스크를 짚어드립니다.
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
