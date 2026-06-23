import Link from "next/link";
import Image from "next/image";
import {
  company,
  partnerships,
  certifications,
  certificationStatusLabel,
  engineerCredentials,
} from "@/lib/site-config";
import { PartnerBadge } from "../../PartnerBadge";

const statusColorClass: Record<string, string> = {
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  gray: "bg-gray-50 text-gray-600 border-gray-200",
};

export const metadata = {
  title: `Certifications & Partnerships | ${company.name}`,
  description: `${company.name}의 보유 인증 및 기술·운영 파트너십 현황.`,
};

export default function CertificationsPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 text-xs text-gray-500">
          <Link href="/" className="hover:text-blue-600">홈</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700 font-medium">Certifications</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <p className="text-blue-600 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
          Certifications & Partnerships
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 kr-keep-all">
          인증·자격·파트너십
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mb-10 md:mb-14 max-w-2xl kr-keep-all">
          공공·연구기관 N²SF 전환 설계와 기존 VDI·망분리·MFA·백업 재정렬에 필요한 정보보호 인증 준비 현황과 기술 파트너십입니다.
        </p>

        {/* Certifications */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 kr-keep-all">정보보호 인증 현황</h2>
          <p className="text-xs text-gray-500 mb-5 kr-keep-all">
            인증 상태는 단계별로 정직하게 표시합니다 — 준비 / 신청 / 심사 / 보유. &quot;예정&quot;처럼 모호한 표기는 사용하지 않습니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {certifications.map((c) => {
              const statusMeta = certificationStatusLabel[c.status];
              const badgeClass = statusColorClass[statusMeta.color] || statusColorClass.gray;
              return (
                <div
                  key={c.name}
                  className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-base font-bold text-gray-900">{c.name}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed kr-keep-all mb-2">{c.desc}</p>
                      <dl className="space-y-1 text-xs text-gray-600">
                        {c.status === "certified" && c.certificateId && (
                          <div className="flex gap-2"><dt className="text-gray-400 w-20 shrink-0">인증서 번호</dt><dd>{c.certificateId}</dd></div>
                        )}
                        {c.status === "certified" && c.validUntil && (
                          <div className="flex gap-2"><dt className="text-gray-400 w-20 shrink-0">유효 기간</dt><dd>{c.validUntil}</dd></div>
                        )}
                        {c.targetMilestone && c.status !== "certified" && (
                          <div className="flex gap-2"><dt className="text-gray-400 w-20 shrink-0">목표</dt><dd>{c.targetMilestone}</dd></div>
                        )}
                        {c.certifyingBody && (
                          <div className="flex gap-2"><dt className="text-gray-400 w-20 shrink-0">심사기관</dt><dd>{c.certifyingBody}</dd></div>
                        )}
                        {c.scope && (
                          <div className="flex gap-2"><dt className="text-gray-400 w-20 shrink-0">인증 범위</dt><dd>{c.scope}</dd></div>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 엔지니어 기술자격 — 회사 인증과 구분 */}
        {engineerCredentials.length > 0 && (
          <section className="mb-12 md:mb-16">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 kr-keep-all">엔지니어 기술자격</h2>
            <p className="text-xs text-gray-500 mb-5 kr-keep-all">
              회사 인증과 별개로, 대표 엔지니어가 보유한 벤더 공식 기술자격입니다 — 실제 솔루션을 다룰 역량을 증빙합니다.
            </p>
            <div className="grid gap-4 md:gap-6">
              {engineerCredentials.map((cr) => (
                <div
                  key={cr.code}
                  className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
                >
                  <div className="grid md:grid-cols-[1fr_auto] gap-5 md:gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <p className="text-base font-bold text-gray-900">{cr.name}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                          보유
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed kr-keep-all mb-3">{cr.desc}</p>
                      <dl className="space-y-1 text-xs text-gray-600">
                        <div className="flex gap-2"><dt className="text-gray-400 w-20 shrink-0">보유자</dt><dd className="kr-keep-all">{cr.holder}</dd></div>
                        <div className="flex gap-2"><dt className="text-gray-400 w-20 shrink-0">발급 기관</dt><dd className="kr-keep-all">{cr.issuer}</dd></div>
                        <div className="flex gap-2"><dt className="text-gray-400 w-20 shrink-0">인증서 번호</dt><dd>{cr.certificateId}</dd></div>
                        <div className="flex gap-2"><dt className="text-gray-400 w-20 shrink-0">유효 기간</dt><dd>{cr.validUntil}</dd></div>
                      </dl>
                    </div>
                    {cr.imageFile && (
                      <a
                        href={`/credentials/${cr.imageFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block shrink-0 group"
                      >
                        <Image
                          src={`/credentials/${cr.imageFile}`}
                          alt={`${cr.name} 인증서`}
                          width={3509}
                          height={2216}
                          className="w-full md:w-72 h-auto rounded-lg border border-gray-200 group-hover:border-gray-300 transition-colors"
                        />
                        <span className="block text-center text-[11px] text-blue-600 mt-1.5 group-hover:text-blue-700">
                          인증서 원본 보기 →
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Partnerships — domain별 그룹 */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 kr-keep-all">기술·운영 파트너</h2>

          <h3 className="text-sm font-semibold text-blue-600 mb-3 mt-2 uppercase tracking-widest">
            보안 워크스페이스 (VDI · DaaS)
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {partnerships.filter((p) => p.domain === "vdi-workspace").map((p) => (
              <PartnerBadge key={p.name} partner={p} />
            ))}
          </div>

          <h3 className="text-sm font-semibold text-emerald-600 mb-3 mt-2 uppercase tracking-widest">
            데이터 보호 (백업 · 사이버복원력)
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {partnerships.filter((p) => p.domain === "data-protection").map((p) => (
              <PartnerBadge key={p.name} partner={p} />
            ))}
          </div>
        </section>

        {/* Note */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-amber-800 kr-keep-all">
            ※ 인증 등급(Authorized/Gold/Platinum 등)·갱신 주기는 파트너 정책에 따라 변동될 수 있습니다.
            최신 현황 확인은 <a href={`mailto:${company.email}`} className="underline font-semibold">{company.email}</a>로 문의 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
