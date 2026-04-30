"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const reportToken = searchParams.get("report");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Checkmark Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">감사합니다!</h1>
          <p className="text-base text-gray-500 leading-relaxed">
            진단 결과가 생성되었습니다.<br />
            리포트를 확인하고 다음 단계를 시작해보세요.
          </p>
        </div>

        {/* Report Link Button */}
        {reportToken && (
          <div className="mb-6">
            <Link
              href={`/reports/${reportToken}`}
              className="block w-full py-3.5 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-150"
            >
              리포트 보기
            </Link>
          </div>
        )}

        {/* Next Action Cards */}
        <div className="space-y-3 mb-8">
          {reportToken && (
            <Link
              href={`/reports/${reportToken}`}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-start gap-4 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">진단 리포트 확인</p>
                <p className="text-xs text-gray-500 mt-0.5">상세 진단 결과와 PDF 리포트를 확인하세요.</p>
              </div>
            </Link>
          )}

          <Link
            href="/content"
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-start gap-4 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">관련 콘텐츠 탐색</p>
              <p className="text-xs text-gray-500 mt-0.5">VDI 마이그레이션 전략과 모범 사례를 담은 전문 자료를 확인하세요.</p>
            </div>
          </Link>

          <Link
            href="/tools/risk-assessment"
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-start gap-4 hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">다시 진단하기</p>
              <p className="text-xs text-gray-500 mt-0.5">환경이 변경되었거나 다른 시나리오를 점검하고 싶다면 다시 진단하세요.</p>
            </div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href="/content"
            className="flex-1 py-3 text-center border border-gray-300 bg-white text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-150"
          >
            콘텐츠 보기
          </Link>
          <Link
            href="/tools/risk-assessment"
            className="flex-1 py-3 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-150"
          >
            다시 진단하기
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
          <strong>본 진단은 N²SF 적절성 평가의 사전 준비도 측정 도구입니다.</strong> 국가정보원 보안성 검토는 별도의 외부 절차이며, 본 진단 결과로 대체될 수 없습니다.
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400">로딩 중...</p></div>}>
      <ThankYouContent />
    </Suspense>
  );
}
