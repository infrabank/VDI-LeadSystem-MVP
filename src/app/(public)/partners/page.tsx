import type { Metadata } from "next";
import Link from "next/link";
import { company, partnerships } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `SI·보안 파트너 기술자문 | ${company.name}`,
  description:
    "공공기관 VDI를 10여 년간 만져온 1인 자문 회사. SI·보안 파트너에게 N²SF 전환·VDI 재정의 기술 산출물을 공급합니다.",
};

const services = [
  {
    no: "01",
    title: "고객 앞 기술 미팅 동행",
    duration: "반나절~1일",
    desc: "SI 영업대표와 함께 들어가 VDI/N²SF 기술 답변을 책임집니다. 발주처 기술 담당자·CISO 미팅에서 솔루션 깊이 있는 질문을 직접 응대.",
  },
  {
    no: "02",
    title: "VDI/N²SF 전환 시나리오 작성",
    duration: "사전진단 1주",
    desc: "현재 VDI·망분리 구조 분석 → C/S/O 등급 예비 분류 → 유지·축소·전환 1차 로드맵 + RFP 반영 문구 초안.",
  },
  {
    no: "03",
    title: "RFP·제안서 기술 파트 작성",
    duration: "1~2주",
    desc: "기술요건·구현방안·산출물 목록·N²SF 통제 매핑·운영 리스크 관리 방안. SI 제안서에 그대로 붙일 수 있는 형태로 납품.",
  },
  {
    no: "04",
    title: "보안성 검토 대응표 작성",
    duration: "1~2주",
    desc: "N²SF 274개 통제 매핑 기반 심의 대응 답변 초안. 심의 위원 질문 패턴·실증 사례·근거 자료 정리.",
  },
  {
    no: "05",
    title: "구축은 검증된 파트너 컨소시엄으로 연결",
    duration: "별도 계약",
    desc: "Citrix · Omnissa · Microsoft · 라온시큐어 · Acronis 기술 연계. 마이로켓이 직접 구축하지 않고, 검증된 파트너사로 연결해 PMO·검수만 책임. 자문료와 별도, 구축비는 파트너사 인보이싱으로 분리.",
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

export default function PartnersPage() {
  return (
    <div className="bg-white">
      {/* ========== Hero — quiet, narrative ========== */}
      <section className="relative border-b border-gray-100">
        {/* 좌측 컬러 액센트 — 명함과 동일 톤 */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-600 via-blue-600 to-emerald-600 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28">
          <p className="text-xs sm:text-sm font-semibold text-gray-500 tracking-widest uppercase mb-6">
            For SI · 보안 파트너
          </p>
          <p className="text-base sm:text-lg text-gray-600 mb-3 leading-relaxed kr-keep-all">
            공공기관 VDI를 10여 년간 만져왔습니다.
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-[1.3] kr-keep-all mb-8">
            망분리·N²SF·MFA·백업이 5번 바뀌는 동안<br className="hidden md:block" />
            <span className="md:hidden"> </span>운영 책임자로 함께 있었습니다.
          </h1>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed kr-keep-all mb-10 max-w-2xl">
            이 자리에서 SI·보안 파트너에게 N²SF 전환·VDI 재정의 기술 산출물을
            공급합니다.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href={mailtoHref}
              className="px-5 py-2.5 bg-amber-400 text-slate-900 rounded-md hover:bg-amber-300 font-semibold shadow-sm transition-all"
            >
              jhw@mlkit.co.kr
            </a>
            <a
              href="tel:010-3861-8079"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              010-3861-8079
            </a>
          </div>
        </div>
      </section>

      {/* ========== Founder voice ========== */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Why Myloket
          </p>
          <div className="space-y-5 text-base sm:text-[17px] text-gray-800 leading-[1.85] kr-keep-all">
            <p>
              공공·정부출연연구기관의 VDI를 10여 년간 만져왔습니다. 처음에는
              Citrix XenDesktop으로 시작했고, 그 사이 망분리·N²SF·MFA·백업 정책이
              큰 사이클로 5번쯤 바뀌었습니다. 그 변화의 한가운데서 운영 책임자로
              함께 있었던 입장에서, 어떤 결정이 시간이 지나서도 옳았고 어떤 결정이
              결국 비싸게 청구되는지를 봤습니다.
            </p>
            <p>
              지금 마이로켓에서 하는 일은 그 경험을 바탕으로 — N²SF 전환을 앞둔
              공공·연구기관과, 그 기관에 들어가는 SI·보안 파트너에게 —{" "}
              <span className="font-semibold text-gray-900">
                유지·축소·전환 판단에 필요한 기술 산출물
              </span>
              을 공급하는 것입니다. 벤더 자료 정리가 아니라, 실제로 운영하면서
              무엇이 터지고 무엇이 견디는지를 아는 관점입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ========== 실제로 이런 일을 합니다 — 3 case narratives ========== */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Engagements
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 kr-keep-all">
            실제로 이런 일을 합니다
          </h2>
          <p className="text-sm text-gray-500 mb-12 kr-keep-all">
            기관명은 동의 정책에 따라 익명 표기. 환경·규모·역할은 사실 그대로.
          </p>

          {/* Case 1 */}
          <article className="mb-14">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-xs font-bold text-purple-700 tracking-widest">
                CASE 01
              </span>
              <span className="text-xs text-gray-400">
                Omnissa Horizon · VMware ESXi
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 kr-keep-all">
              중앙행정 데이터 기관 — 통계분석 환경 VDI
            </h3>
            <div className="space-y-4 text-base text-gray-700 leading-[1.85] kr-keep-all">
              <p>
                중앙행정 데이터 기관에서 통계분석 환경 VDI를 다년간
                구축·운영·유지보수 해왔습니다. 환경은 Omnissa Horizon · VMware
                ESXi 기반에 연구원·전문가·대학교수 수백 명이 외부에서 접속하는
                구조입니다. 사용자군이 정규직 연구원뿐 아니라 외부
                전문가·대학교수까지 포함되어 있어, 일반적인 사내 VDI보다 사용자
                입퇴장 빈도가 높고 분석 워크로드 패턴도 다양합니다.
              </p>
              <p>
                매월 운영 리포트와 장애 사후 분석 보고서를 정형화해 산출하고,
                PowerCLI 기반 스토리지 사용률 대시보드를 별도로 구축해
                운영합니다. 단순 임계치 알람보다 한 단계 앞서 — 과거 30일 IOPS
                추세와 신규 사용자 유입 패턴을 묶어서 — 병목 가능성을 사전에
                감지하는 운영 방식입니다.
              </p>
              <p>
                이런 규모와 외부 사용자 비중이 큰 환경에서는, 단발 장애 대응보다{" "}
                <em className="not-italic font-semibold text-gray-900">
                  언제 무엇이 터질지 예측 가능한 운영 구조
                </em>
                와 그 운영을{" "}
                <em className="not-italic font-semibold text-gray-900">
                  외부 발주처가 검증할 수 있는 산출물 형태
                </em>
                로 만드는 것이 핵심입니다.
              </p>
            </div>
          </article>

          {/* Case 2 */}
          <article className="mb-14">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-xs font-bold text-blue-700 tracking-widest">
                CASE 02
              </span>
              <span className="text-xs text-gray-400">
                Omnissa Horizon · UAG · VMware ESXi
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 kr-keep-all">
              정부 출연 국토 연구기관 — 외부접속 운영 안정화
            </h3>
            <div className="space-y-4 text-base text-gray-700 leading-[1.85] kr-keep-all">
              <p>
                정부 출연 국토 연구기관에서 Omnissa Horizon · UAG (VMware ESXi
                기반) 외부접속 운영을 안정화하는 일을 해왔습니다. 약 100~300명
                규모 연구원이 외부에서 정기적으로 접속해 연구 데이터에 접근하는
                구조라, 외부접속 안정성이 곧 연구 생산성에 직결됩니다.
              </p>
              <p>
                UAG 외부접속에서는 인증서 만료·세션 정책·VMware 측 가상 스위치
                구성·Horizon Connection Server 인증서 chain까지 여러 layer가
                함께 영향을 줍니다. 외부접속 안정화 화두가 처음 올라왔을 때,
                대부분의 경우 단일 원인이 아니라{" "}
                <em className="not-italic font-semibold text-gray-900">
                  각 layer가 서로 다른 주기로 만료/변경되며 누적된 결과
                </em>
                입니다 — 이런 종류의 문제에서는 root cause 분석 자체보다{" "}
                <em className="not-italic font-semibold text-gray-900">
                  layer별 점검 절차의 표준화
                </em>
                와{" "}
                <em className="not-italic font-semibold text-gray-900">
                  사용자 환경 운영 표준화
                </em>
                가 더 중요한 처방이 됩니다.
              </p>
              <p>
                매월 운영 리포트로 외부접속 가용률·인증서 잔여 기간·UAG 세션
                통계를 정리해, 발주처가 자체 점검할 수 있는 형태로 납품합니다.
              </p>
            </div>
          </article>

          {/* Case 3 */}
          <article>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-xs font-bold text-emerald-700 tracking-widest">
                CASE 03
              </span>
              <span className="text-xs text-gray-400">
                Citrix · Omnissa Workspace ONE
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 kr-keep-all">
              정부 출연 과학기술정보 연구기관 — 멀티 벤더 마이그레이션 자문
            </h3>
            <div className="space-y-4 text-base text-gray-700 leading-[1.85] kr-keep-all">
              <p>
                정부 출연 과학기술정보 연구기관에서 Citrix와 Omnissa Workspace
                ONE이 동시에 운영되는 멀티 벤더 환경을 다년간 봐왔습니다. 수백 명
                규모이고, 두 솔루션이 각각 다른 사용자군·다른 시기의 결정으로
                도입된 누적적 환경입니다.
              </p>
              <p>
                멀티 벤더 환경에서는{" "}
                <em className="not-italic font-semibold text-gray-900">
                  벤더 호환성
                </em>
                보다{" "}
                <em className="not-italic font-semibold text-gray-900">
                  벤더 정책 변경에 따른 운영 리스크
                </em>
                가 더 큰 변수입니다. Citrix는 라이선스 모델·지원 정책이 단계적으로
                바뀌어왔고, Omnissa는 VMware EUC 분리 이후 정책 변화가 이어지고
                있습니다. 두 벤더의 정책 변화가 한 환경 안에서 동시에 일어나면,
                단순 마이그레이션이 아니라{" "}
                <em className="not-italic font-semibold text-gray-900">
                  어느 사용자군을 어느 솔루션에 남기고, 어느 사용자군을 어디로
                  이동시킬지
                </em>
                에 대한 전략적 판단이 필요합니다.
              </p>
              <p>
                마이그레이션 가이드 형태로 — 사용자군 분류, 시나리오별
                비용·리스크, 전환 일정·검증 절차를 정리해 — 의사결정 기반을
                제공합니다. 단순한 “Citrix vs Omnissa 비교”가 아니라,{" "}
                <em className="not-italic font-semibold text-gray-900">
                  이 기관의 사용자 패턴과 운영 인력 구조를 전제로 한 권고
                </em>
                를 만드는 것이 핵심입니다.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* ========== 협업 형태 (5 services) — quieter ========== */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Engagement Models
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-10 kr-keep-all">
            협업 형태 5가지
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {services.map((s) => (
              <div
                key={s.no}
                className="p-5 sm:p-6 rounded-lg bg-white border border-gray-200"
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

          {/* Pricing line — 신뢰 신호 */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              자문료
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed kr-keep-all">
              기술자문은 <strong className="text-gray-900">1주 단위로 견적</strong>합니다.
              일반적으로{" "}
              <strong className="text-gray-900">200~500만원 범위</strong>이며,
              사업 규모와 산출물 깊이에 따라 협의합니다. 5번째 항목(구축 컨소시엄
              연결)은 자문료와 별도이고, 구축비는 파트너사 인보이싱으로
              분리됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* ========== 안 하는 것 ========== */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Out of Scope
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 kr-keep-all">
            이런 건 안 합니다
          </h2>
          <p className="text-sm text-gray-500 mb-8 kr-keep-all">
            자신이 못 하는 영역을 명시하는 게 자신이 잘 하는 영역을 더 신뢰하게
            만든다고 봅니다.
          </p>
          <ul className="space-y-3 text-base text-gray-700 leading-relaxed kr-keep-all">
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">—</span>
              <span>
                단순 라이선스 영업·총판 마진 — 벤더 사이드의 이해관계 없이
                자문합니다
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">—</span>
              <span>
                인증 신청 대행 (CC, GS, ISMS-P 등) — 인증 컨설팅 전문 회사가 따로
                있습니다
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">—</span>
              <span>
                인력 파견·SM 외주 — 자문 기반 산출물 공급만 합니다
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">—</span>
              <span>
                민간 일반 사무 IT 컨설팅 — 공공·연구기관 VDI/N²SF 영역 전용
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* ========== 1인 회사 정직 ========== */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            About the Structure
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 kr-keep-all">
            1인 자문 회사입니다
          </h2>
          <div className="space-y-5 text-base text-gray-700 leading-[1.85] kr-keep-all">
            <p>
              마이로켓은 1인 자문 회사입니다. 대표 1인이 직접 검토·납품합니다.
            </p>
            <p>
              <span className="font-semibold text-gray-900">가용성</span> — 사전
              부킹 시 일정 가용성을 확정 답변드립니다. 부재·과부하 상황에서는
              검증된 협력 엔지니어 1~2명에게 인계 가능한 구조로 운영하지만, 기본은{" "}
              <em className="not-italic font-semibold text-gray-900">
                “한 사람이 처음부터 끝까지 본다”
              </em>
              입니다. 이게 강점이자 동시에 한계라는 점을 솔직히 말씀드립니다.
            </p>
            <p>
              <span className="font-semibold text-gray-900">규모 한계</span> —
              대형 발주 풀 등록(매출 5억 이상·재무 등급 등) 대상은 아닙니다.
              사업부장급 외부 자문 풀 등록이 필요한 경우 다른 옵션을 권합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ========== Trust strip — 단순화 ========== */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <ul className="space-y-3 text-base text-gray-700 leading-relaxed kr-keep-all mb-8">
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">·</span>
              <span>
                공공·연구기관 VDI 구축·운영·유지보수 10여 곳 (실명 비공개 정책)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">·</span>
              <span>
                대표 1인 책임 — 제현우 · 수석 자문 엔지니어
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-gray-300 flex-shrink-0">·</span>
              <span>기술 파트너십 (벤더 중립 자문)</span>
            </li>
          </ul>
          <div className="flex flex-wrap gap-2 mb-8">
            {partnerships.map((p) => (
              <span
                key={p.name}
                className={`text-xs font-semibold px-3 py-1.5 rounded ${p.bgColor} ${p.textColor} border border-gray-200`}
              >
                {p.name}
              </span>
            ))}
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
          >
            인증·법적 정보·운영 사례 자세히
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ========== Insights teaser ========== */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Writing
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 kr-keep-all">
            글로 정리한 관점
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-6 max-w-2xl">
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

      {/* ========== Final contact — simple ========== */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 kr-keep-all">
            제안 건이 있으시면 메일로 알려주세요
          </h2>
          <p className="text-base text-gray-600 leading-relaxed kr-keep-all mb-8 max-w-2xl">
            RFP·고객 요구사항·막힌 기술 파트만 보내주시면, VDI·N²SF 리스크만
            빠르게 짚어드립니다. 1차 회신 1영업일 이내.
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
            <a
              href="/partners-onepager.pdf"
              target="_blank"
              rel="noopener"
              className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-4 decoration-gray-300"
            >
              A4 1장 자료 (PDF)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
