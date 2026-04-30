import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "N²SF 진단센터 | 정렬 진단·전환 준비도·역할 재정의 통합 허브 | VDI Expert",
  description:
    "N²SF 정렬 진단(274개 보안통제 매핑)·전환 준비도 진단(Level 1~5)·VDI 역할 재정의 진단·ROI 계산기. 공공·금융 보안 워크스페이스 전환의 모든 진단을 한 곳에서.",
};

interface ContentItemRow {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  tags: string[] | null;
  published_at: string | null;
}

export default async function N2sfHubPage() {
  const supabase = await createClient();

  const { data: contents } = await supabase
    .from("content_items")
    .select("slug, title, excerpt, category, tags, published_at")
    .eq("category", "n2sf")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6);

  const items: ContentItemRow[] = (contents as ContentItemRow[]) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 via-blue-900 to-blue-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            2026년 5월 N²SF 시행 예정 — 지금이 준비 시점
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            N²SF 진단센터
            <br className="hidden sm:block" />
            <span className="text-blue-300">정렬 진단·전환 준비도·역할 재정의 통합 허브</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-blue-100 leading-relaxed max-w-3xl">
            N²SF(국가 망 보안체계)는 망분리를 폐지하지 않습니다. 그러나 "모든 업무에
            VDI"라는 단순 구조는 더 이상 통하지 않습니다. <strong className="text-white">VDI는 끝나는 것이 아니라
            역할이 바뀝니다.</strong> 274개 보안통제 매핑부터 단계적 전환 로드맵까지,
            공공·금융 기관에 필요한 모든 진단을 무료로 제공합니다.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/tools/risk-assessment"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-800 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              N²SF 정렬 진단 시작 (7분)
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/diagnosis/n2sf-readiness"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              N²SF 전환 준비도 진단 (3분)
            </Link>
          </div>
        </div>
      </section>

      {/* Market Change Summary */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            시장은 이미 움직이고 있습니다
          </h2>
          <p className="text-slate-600 mb-10 max-w-3xl">
            정부 정책, 라이선스 구조, 클라우드 진입 절차 모두 동시에 변화 중입니다.
            '갱신만 하면 되겠지'라는 가정이 가장 위험합니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FactCard
              date="2025.09.30"
              title="N²SF 1.0 정식판 공개"
              body="보안통제 280여 개, 정보서비스 모델 11종 — 신규 발주의 사실상 표준."
            />
            <FactCard
              date="2026.05"
              title="개정 사이버보안 지침 시행"
              body="MFA·보안 예산 15%·인력 10% 의무화. 망분리는 '대체'로 명문화."
            />
            <FactCard
              date="2027~"
              title="신규 사업 자동 N²SF 사양"
              body="갱신 시점이 지나면 '기존 VDI' 단일 사양 발주가 사라집니다."
            />
          </div>
        </div>
      </section>

      {/* Risk Checkpoints */}
      <section className="bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            기존 VDI 환경의 전환 리스크 체크포인트
          </h2>
          <p className="text-slate-600 mb-10 max-w-3xl">
            아래 5개 항목 중 3개 이상이 해당된다면, 지금 진단을 받아보시는 것을 권합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "C/S/O 등급분류를 수행한 적이 없거나 일부 시스템에만 적용했다.",
              "MFA가 관리자 일부에만 적용되어 있다.",
              "특권 계정이 공용 계정으로 운영되거나 PAM이 없다.",
              "VMware/Citrix 라이선스 갱신 시점이 12개월 이내다.",
              "사용자가 VDI에 대해 불편을 자주 호소하거나 운영 장애가 잦다.",
              "보안정책 문서가 없거나 오래되어 미운영 상태다.",
            ].map((line, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200 shadow-sm"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">
                  !
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Diagnosis Tools */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 text-center">
            진단 도구 4종
          </h2>
          <p className="text-slate-600 mb-10 text-center max-w-2xl mx-auto">
            N²SF 정렬부터 VDI 운영 ROI까지, 공공·금융 보안 책임자를 위한 룰 기반 진단 도구입니다.
            이메일·기관 정보 외에 별도 가입은 필요하지 않습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1순위: N²SF 정렬 진단 — 강조 카드 */}
            <DiagnosisCta
              href="/tools/risk-assessment"
              tag="N²SF · 8영역 · 28문항"
              title="N²SF 정렬 진단 (v4)"
              description="274개 보안통제 매핑 · 8영역 28문항 · C/S/O 등급 자가분류 · 모델 3·8·10 권고. 공공·금융 기관의 N²SF 정렬 현황을 가장 체계적으로 진단합니다."
              meta="8개 단계 · 약 7분"
              ctaText="진단 시작"
              primary
            />
            {/* 2순위: N²SF 전환 준비도 */}
            <DiagnosisCta
              href="/diagnosis/n2sf-readiness"
              tag="N²SF · 5섹션 · 15문항"
              title="N²SF 전환 준비도 진단"
              description="망분리·등급분류·인증·SaaS·운영 5개 영역의 준비도를 Level 1~5로 산출하고, 3단계 전환 로드맵을 제시합니다."
              meta="5개 영역 · 약 3분"
              ctaText="진단 시작"
            />
            {/* 3순위: VDI 역할 재정의 */}
            <DiagnosisCta
              href="/diagnosis/vdi-transition"
              tag="VDI 재배치 · 9문항"
              title="VDI 역할 재정의 진단"
              description="현재 VDI 환경이 '유지 강화/제로트러스트 보완/점진적 축소/재설계' 중 어디에 해당하는지 4가지 시나리오로 분류합니다."
              meta="9문항 · 약 2분"
              ctaText="진단 시작"
            />
            {/* 4순위: ROI 계산기 */}
            <DiagnosisCta
              href="/tools/roi-calculator"
              tag="운영비용 시뮬레이션"
              title="VDI 운영 ROI 계산기"
              description="마이그레이션 비용, 장애 손실, 개선 투자 ROI를 수치로 산정합니다. 경영진 보고용 PDF로 제공됩니다."
              meta="비용 시뮬레이션 · 약 3분"
              ctaText="계산 시작"
            />
          </div>
        </div>
      </section>

      {/* Content Cards */}
      {items.length > 0 && (
        <section className="bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              먼저 알고 싶다면
            </h2>
            <p className="text-slate-600 mb-10 max-w-3xl">
              N²SF 정책의 핵심, 제로트러스트가 VDI에 미치는 영향, VDI의 재배치 시나리오를
              짧게 정리했습니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {items.map((c) => (
                <Link
                  key={c.slug}
                  href={`/content/${c.slug}`}
                  className="block p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {c.title}
                  </h3>
                  {c.excerpt && (
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {c.excerpt}
                    </p>
                  )}
                  <p className="text-xs text-blue-700 font-semibold mt-3">읽어보기 →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-blue-800 to-indigo-900 text-white">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            기존 망분리 구조를 아는 파트너가 전환 리스크를 줄입니다.
          </h2>
          <p className="text-blue-100 mb-8 leading-relaxed">
            VDI 운영 경험이 있는 전문가가 직접 N²SF 정렬 진단·컨설팅합니다. <br />
            대형 SI의 패키지 사업자가 놓치는 '기존 환경의 안정 운영'을 함께 설계합니다.
          </p>
          <Link
            href="/tools/risk-assessment"
            className="inline-flex items-center gap-2 px-7 py-3 bg-white text-blue-800 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
          >
            N²SF 정렬 진단 시작
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FactCard({
  date,
  title,
  body,
}: {
  date: string;
  title: string;
  body: string;
}) {
  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
      <p className="text-xs font-bold text-blue-700 mb-2">{date}</p>
      <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
    </div>
  );
}

function DiagnosisCta({
  href,
  tag,
  title,
  description,
  meta,
  ctaText,
  primary = false,
}: {
  href: string;
  tag: string;
  title: string;
  description: string;
  meta: string;
  ctaText: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block p-7 rounded-xl shadow-sm hover:shadow-md transition-all ${
        primary
          ? "bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-500 hover:border-blue-400 text-white"
          : "bg-gradient-to-br from-blue-50 to-white border border-blue-200 hover:border-blue-400"
      }`}
    >
      <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${primary ? "text-blue-200" : "text-blue-700"}`}>
        {tag}
      </p>
      <h3 className={`text-lg font-bold mb-3 ${primary ? "text-white" : "text-slate-900"}`}>{title}</h3>
      <p className={`text-sm leading-relaxed mb-3 ${primary ? "text-blue-100" : "text-slate-600"}`}>{description}</p>
      <p className={`text-xs mb-4 ${primary ? "text-blue-200" : "text-slate-400"}`}>{meta}</p>
      <span className={`inline-flex items-center gap-2 text-sm font-semibold ${primary ? "text-white" : "text-blue-700"}`}>
        {ctaText} →
      </span>
    </Link>
  );
}
