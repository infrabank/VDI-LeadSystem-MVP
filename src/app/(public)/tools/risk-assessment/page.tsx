import { RiskAssessmentClient } from "./RiskAssessmentClient";
import { RiskAssessmentIntro } from "./IntroSection";

/* 페이지는 서버 컴포넌트다. 인트로(훅 없는 정적 마크업)를 여기서 렌더해 prop으로
   넘기면 클라이언트 번들에서 빠진다. 이전에는 페이지 전체가 "use client"라
   인트로까지 41KB 청크에 실렸다. */
export default function RiskAssessmentPage() {
  return <RiskAssessmentClient intro={<RiskAssessmentIntro />} />;
}
