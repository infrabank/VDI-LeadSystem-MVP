import { ImageResponse } from "next/og";
import { company } from "@/lib/site-config";
import { loadPretendard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-fonts";

/**
 * 사이트 루트 OG 이미지 (1200x630).
 * Next.js가 metadata.openGraph.images에 자동 매핑.
 */
export const runtime = "nodejs";
export const alt = `${company.legalName} — ${company.taglineKo}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #312e81 100%)",
          color: "#ffffff",
          fontFamily: "Pretendard",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "rgba(99, 102, 241, 0.35)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 320,
            height: 320,
            borderRadius: 9999,
            background: "rgba(59, 130, 246, 0.25)",
            filter: "blur(80px)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#bfdbfe",
            fontSize: 26,
            letterSpacing: 4,
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: 44,
          }}
        >
          <div style={{ width: 36, height: 2, background: "#93c5fd" }} />
          <span>VDI · Backup Technical Support</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: 700,
            fontSize: 72,
            lineHeight: 1.15,
            letterSpacing: -1,
            marginBottom: 36,
          }}
        >
          <span>VDI와 백업 운영장애,</span>
          <span>구축 경험 있는 엔지니어가 직접 지원합니다</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 500,
            lineHeight: 1.45,
            color: "rgba(219, 234, 254, 0.92)",
            maxWidth: 1020,
          }}
        >
          Citrix Virtual Apps and Desktops · Omnissa Horizon · Acronis Cyber Protect 환경의 기술지원·유지보수·복구검증.
        </div>

        <div style={{ display: "flex", flex: 1 }} />

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
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 18,
                height: 18,
                borderRadius: 9999,
                background: "#3b82f6",
                boxShadow: "0 0 28px rgba(59, 130, 246, 0.7)",
              }}
            />
            <span>{company.legalName}</span>
            <span style={{ color: "rgba(191, 219, 254, 0.55)" }}>·</span>
            <span style={{ color: "#93c5fd", fontWeight: 500 }}>{company.domain}</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
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
