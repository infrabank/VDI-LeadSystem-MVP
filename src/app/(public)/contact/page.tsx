import { Suspense } from "react";
import Link from "next/link";
import { company } from "@/lib/site-config";
import ContactForm from "./ContactForm";

export const metadata = {
  alternates: { canonical: "/contact" },
  title: "VDI 장애·전산 유지보수 기술지원 문의",
  description: `${company.name} 기술지원 문의 — Citrix Virtual Apps and Desktops, Omnissa Horizon, Acronis Cyber Protect 환경의 운영장애·유지보수·복구검증 상담. 제품명·버전·증상만 보내주세요. 공공기관·연구기관·기업 IT 운영자 및 SI 파트너 모두 가능.`,
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-wider">
            문의
          </p>
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 sm:mb-8 leading-[1.15] kr-keep-all">
            기술지원 문의
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed kr-keep-all">
            VDI 장애, 전산 유지보수, SI 프로젝트 협업 — 문의 유형을 선택하고 아는 내용만
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

        <div className="mt-10 grid sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              직접 이메일
            </p>
            <a
              href={`mailto:${company.email}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {company.email}
            </a>
            <p className="text-xs text-gray-400 mt-1">평일 1영업일 내 회신</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              서비스 범위 확인
            </p>
            <Link
              href="/#business"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              유지보수·백업·VDI 서비스 →
            </Link>
            <p className="text-xs text-gray-400 mt-1">홈의 사업 영역 4개 보기</p>
          </div>
        </div>
      </section>
    </div>
  );
}
