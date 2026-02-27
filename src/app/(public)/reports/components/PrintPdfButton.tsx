"use client";

export default function PrintPdfButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all duration-150 text-sm print:hidden"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      PDF 저장
    </button>
  );
}
