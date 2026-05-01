import { Suspense } from "react";
import Link from "next/link";
import { company } from "@/lib/site-config";
import ContactForm from "./ContactForm";

export const metadata = {
  title: `Contact | ${company.name}`,
  description: `${company.name} 상담 문의 — VDI·Zero Trust·N²SF·Acronis 백업·DR에 관한 기술 상담 및 프로젝트 협업.`,
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 border-b border-slate-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
          <p className="text-blue-300 font-semibold text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Contact
          </p>
          <h1 className="text-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4 leading-[1.15] kr-keep-all">
            상담 문의
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed kr-keep-all">
            보안 워크스페이스(VDI·Zero Trust·N²SF) · 데이터 보호(Acronis 백업·DR)에 관한
            기술 상담·프로젝트 협업·견적 문의를 환영합니다.
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
              먼저 자가 진단부터?
            </p>
            <Link
              href="/tools"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              진단·계산 도구 6종 →
            </Link>
            <p className="text-xs text-gray-400 mt-1">7분 무료 진단 · PDF 리포트</p>
          </div>
        </div>
      </section>
    </div>
  );
}
