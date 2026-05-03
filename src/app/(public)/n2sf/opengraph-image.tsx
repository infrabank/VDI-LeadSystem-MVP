import { ImageResponse } from "next/og";
import { company } from "@/lib/site-config";
import { loadPretendard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-fonts";

/**
 * /n2sf 진단센터 페이지별 OG 변형.
 * 메시지: "4종 진단 + 4상품을 한 곳에서"라는 허브 톤.
 */
export const runtime = "nodejs";
export const alt = `N²SF 진단센터 — 4종 진단 + 4상품 통합 허브 | ${company.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function N2sfOpengraphImage() {
  const { bold, medium } = await loadPretendard();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #4338ca 100%)",
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
            background: "rgba(96, 165, 250, 0.32)",
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
            background: "rgba(129, 140, 248, 0.28)",
            filter: "blur(90px)",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#fde68a",
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
              width: 12,
              height: 12,
              borderRadius: 9999,
              background: "#fbbf24",
              boxShadow: "0 0 18px rgba(251, 191, 36, 0.8)",
            }}
          />
          <span>2026년 5월 N²SF 시행 — 지금이 준비 시점</span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: 700,
            fontSize: 86,
            lineHeight: 1.08,
            letterSpacing: -1.5,
            marginBottom: 36,
          }}
        >
          <span>N²SF 진단센터</span>
          <span style={{ color: "#bfdbfe", fontSize: 56, marginTop: 12, fontWeight: 700 }}>
            4종 진단 + 4상품 통합 허브
          </span>
        </div>

        {/* Subtitle as inline pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 14,
          }}
        >
          {[
            "정렬 진단 7분",
            "전환 준비도 3분",
            "VDI 역할 재정의 2분",
            "ROI 시뮬레이션",
          ].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 18px",
                borderRadius: 9999,
                background: "rgba(255, 255, 255, 0.10)",
                border: "1px solid rgba(191, 219, 254, 0.32)",
                fontSize: 22,
                fontWeight: 500,
                color: "rgba(219, 234, 254, 0.95)",
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
            borderTop: "1px solid rgba(191, 219, 254, 0.25)",
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
                width: 18,
                height: 18,
                borderRadius: 9999,
                background: "#60a5fa",
                boxShadow: "0 0 28px rgba(96, 165, 250, 0.7)",
              }}
            />
            <span>{company.legalName}</span>
            <span style={{ color: "rgba(191, 219, 254, 0.55)" }}>·</span>
            <span style={{ color: "#93c5fd", fontWeight: 500 }}>{company.domain}/n2sf</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 500,
              color: "rgba(191, 219, 254, 0.85)",
            }}
          >
            공공·연구 10여 곳 운영 · 1인 전문가 직접 진단
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: bold, style: "normal", weight: 700 },
        { name: "Pretendard", data: medium, style: "normal", weight: 500 },
      ],
    },
  );
}
