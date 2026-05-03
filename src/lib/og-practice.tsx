import { ImageResponse } from "next/og";
import { company } from "@/lib/site-config";
import { loadPretendard, OG_SIZE } from "@/lib/og-fonts";

/**
 * Practice 페이지별 OG 이미지 generator.
 *
 * 4 Practice 페이지(N²SF 사전진단·VDI 재정의·MFA QuickStart·복구검증)는 같은 layout과
 * 다른 색·메시지·pill을 공유한다. JSX 레이아웃을 한 곳에 정의하고, 각 page-level
 * opengraph-image.tsx는 config만 넘겨 ImageResponse를 받는다.
 */

export interface PracticeOgConfig {
  /** 상단 eyebrow (한글 또는 영문). N²SF / Repositioning 등 짧은 라벨 */
  eyebrow: string;
  /** 메인 헤드라인 1행 */
  headlineLine1: string;
  /** 메인 헤드라인 2행 (생략 시 단일 행) */
  headlineLine2?: string;
  /** 4개 이내의 핵심 산출물·시나리오 pill 라벨 */
  pills: string[];
  /** 배경 그라디언트 CSS 값 */
  gradient: string;
  /** 강조 컬러 (점·테두리·아이콘) */
  accentColor: string;
  /** 푸터에 노출할 도메인 + 경로 (예: "myloket.co.kr/practices/managed-integration") */
  footerPath: string;
}

export async function renderPracticeOg(config: PracticeOgConfig): Promise<ImageResponse> {
  const { bold, medium } = await loadPretendard();
  const {
    eyebrow,
    headlineLine1,
    headlineLine2,
    pills,
    gradient,
    accentColor,
    footerPath,
  } = config;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          background: gradient,
          color: "#ffffff",
          fontFamily: "Pretendard",
          position: "relative",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -140,
            width: 460,
            height: 460,
            borderRadius: 9999,
            background: `${accentColor}55`,
            filter: "blur(90px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -120,
            width: 360,
            height: 360,
            borderRadius: 9999,
            background: "rgba(255, 255, 255, 0.15)",
            filter: "blur(90px)",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "rgba(255, 255, 255, 0.85)",
            fontSize: 24,
            letterSpacing: 4,
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 18,
              height: 18,
              borderRadius: 9999,
              background: accentColor,
              boxShadow: `0 0 20px ${accentColor}`,
            }}
          />
          <span>{eyebrow}</span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: 700,
            fontSize: 78,
            lineHeight: 1.1,
            letterSpacing: -1.2,
            marginBottom: 32,
          }}
        >
          <span>{headlineLine1}</span>
          {headlineLine2 && <span>{headlineLine2}</span>}
        </div>

        {/* Pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {pills.map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 18px",
                borderRadius: 9999,
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.32)",
                fontSize: 22,
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.95)",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.22)",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 16,
                height: 16,
                borderRadius: 9999,
                background: accentColor,
                boxShadow: `0 0 24px ${accentColor}`,
              }}
            />
            <span>{company.legalName}</span>
            <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>·</span>
            <span style={{ color: "rgba(255, 255, 255, 0.85)", fontWeight: 500 }}>
              {footerPath}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.78)",
            }}
          >
            공공·연구 10여 곳 운영 · 1인 전문가 직접 진단
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Pretendard", data: bold, style: "normal", weight: 700 },
        { name: "Pretendard", data: medium, style: "normal", weight: 500 },
      ],
    },
  );
}
