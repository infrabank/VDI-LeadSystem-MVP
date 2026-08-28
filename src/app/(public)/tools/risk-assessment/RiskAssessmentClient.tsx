"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { V4Form } from "./V4Form";

/* v3는 ?ver=3 으로만 들어오는 구버전이다. 정적 import 하면 문항 데이터가
   기본 경로 번들에 함께 실리므로 필요할 때만 내려받는다. */
const V3Form = dynamic(() => import("./V3Form"), {
  loading: () => <Spinner />,
});

function Spinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    </div>
  );
}

function Router({ intro }: { intro: ReactNode }) {
  const searchParams = useSearchParams();
  return searchParams.get("ver") === "3" ? <V3Form /> : <V4Form intro={intro} />;
}

/** 서버 페이지가 만든 정적 인트로를 받아 폼 안에 배치한다. 인트로 자체는 훅이 없어
    서버에서 렌더되고, 이 경계 안쪽만 클라이언트 번들로 내려간다. */
export function RiskAssessmentClient({ intro }: { intro: ReactNode }) {
  return (
    <Suspense fallback={<Spinner />}>
      <Router intro={intro} />
    </Suspense>
  );
}
