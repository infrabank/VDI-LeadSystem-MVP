import Link from "next/link";
import { company, partnerships, certifications } from "@/lib/site-config";

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
          공공·금융 보안 자문 수행에 필요한 정보보호 인증과 기술 벤더 파트너십 현황입니다.
        </p>

        {/* Certifications */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 kr-keep-all">정보보호 인증</h2>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {certifications.map((c) => (
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
                  <div>
                    <p className="text-base font-bold text-gray-900 mb-1">{c.name}</p>
                    <p className="text-sm text-gray-500 leading-relaxed kr-keep-all">{c.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partnerships */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 kr-keep-all">기술·운영 파트너</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {partnerships.map((p) => (
              <div
                key={p.name}
                className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
              >
                <p className="text-base font-bold text-gray-900 mb-1">{p.name}</p>
                <p className="text-xs text-gray-500 kr-keep-all">{p.role}</p>
              </div>
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
