import { Suspense } from "react";
import { company, companyLegal } from "@/lib/site-config";
import ContactForm from "./ContactForm";

export const metadata = {
  alternates: { canonical: "/contact" },
  title: "VDI 장애·전산 유지보수 기술지원 문의",
  description: `${company.name} 기술지원 문의: Citrix Virtual Apps and Desktops, Omnissa Horizon, Acronis Cyber Protect 환경의 운영장애·유지보수·복구검증 상담. 제품명·버전·증상만 보내주세요. 공공기관·연구기관·기업 IT 운영자 및 SI 파트너 모두 가능.`,
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 sm:mb-8 leading-[1.15] kr-keep-all">
            기술지원 문의
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed kr-keep-all">
            VDI 장애, 전산 유지보수, SI 프로젝트 협업 중에서 문의 유형을 선택하고 아는 내용만
            적어주시면 됩니다. 세부 사항은 회신·통화에서 확인하며, 1영업일 내 담당 엔지니어가
            직접 회신합니다.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* JS 미실행 환경(크롤러·noscript) 대비 — 폼 대신 문의 방법이 항상 HTML에 남도록 구성 */}
        <noscript>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 text-sm text-gray-700">
            브라우저에서 JavaScript가 꺼져 있어 문의 폼을 사용할 수 없습니다. 아래 이메일 또는
            전화로 직접 문의해 주세요. 제품명·버전·증상만 보내주시면 1영업일 내 회신합니다.
          </div>
        </noscript>
        <Suspense
          fallback={
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-sm text-gray-700 leading-relaxed">
              <p className="font-bold text-gray-900 mb-3">
                문의 유형: VDI 장애·기술지원 / 전산 통합 유지보수 / SI 프로젝트 협업
              </p>
              <p className="mb-3">
                제품명·버전·증상 등 아는 내용만 보내주시면 1영업일 내 담당 엔지니어가 직접
                회신합니다. 폼이 표시되지 않으면 아래로 직접 연락해 주세요.
              </p>
              <ul className="space-y-1">
                <li>
                  이메일:{" "}
                  <a href={`mailto:${company.email}`} className="text-blue-600 underline">
                    {company.email}
                  </a>
                </li>
                <li>
                  전화:{" "}
                  <a href="tel:01038618079" className="text-blue-600 underline">
                    010-3861-8079
                  </a>
                </li>
              </ul>
            </div>
          }
        >
          <ContactForm />
        </Suspense>

        {/* 폼 밖의 연락 수단. 장애로 급한 방문자가 폼을 채우지 않고 바로 통화할 수 있어야 한다.
            여기서 홈으로 되돌리는 링크는 폼 이탈만 만들기 때문에 두지 않는다. */}
        <section className="mt-10">
          <h2 className="text-base font-bold text-gray-900 mb-3">폼 대신 바로 연락하기</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
                전화
              </p>
              <a
                href={`tel:${companyLegal.phone.replace(/-/g, "")}`}
                className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold text-base nums"
              >
                <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {companyLegal.phone}
              </a>
              <p className="text-xs text-gray-600 mt-1.5 kr-keep-all">
                서비스가 멈춘 상황이라면 폼보다 통화가 빠릅니다.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
                이메일
              </p>
              <a
                href={`mailto:${company.email}`}
                className="text-blue-700 hover:text-blue-800 font-medium break-all"
              >
                {company.email}
              </a>
              <p className="text-xs text-gray-600 mt-1.5">평일 1영업일 내 회신</p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
