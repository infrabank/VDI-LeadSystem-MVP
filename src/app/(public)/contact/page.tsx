import { Suspense } from "react";
import Link from "next/link";
import { company } from "@/lib/site-config";
import ContactForm from "./ContactForm";

export const metadata = {
  title: `기술지원 문의 | ${company.name}`,
  description: `${company.name} 기술지원 문의 — Citrix Virtual Apps and Desktops, Omnissa Horizon, Acronis Cyber Protect 환경의 운영장애·유지보수·복구검증 상담. 제품명·버전·증상만 보내주세요. 공공기관·연구기관·기업 IT 운영자 및 SI 파트너 모두 가능.`,
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Contact
          </p>
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 sm:mb-8 leading-[1.15] kr-keep-all">
            기술지원 문의
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed kr-keep-all">
            운영 중인 VDI 또는 백업 환경에 문제가 있다면 제품명·버전·증상만 먼저 보내주세요.
            구성도·로그를 첨부해 주시면 1차 원인 구분이 빨라집니다. 공공기관·연구기관·기업 IT 운영자와 SI 파트너 모두 문의하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <Suspense
          fallback={
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center text-sm text-gray-500">
              폼을 불러오는 중...
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
              유지보수 패키지 확인
            </p>
            <Link
              href="/#maintenance"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              월간 점검·장애 대응·복구검증 →
            </Link>
            <p className="text-xs text-gray-400 mt-1">홈의 유지보수 4 패키지 보기</p>
          </div>
        </div>
      </section>
    </div>
  );
}
