import { ImageResponse } from "next/og";
import { company } from "@/lib/site-config";

/**
 * OG 이미지 자동 생성 (1200x630).
 *
 * 폰트 주의: satori(ImageResponse 내부)는 TTF/OTF만 지원 — woff2 불가.
 * Google Fonts CSS API는 모던 UA에 woff2를 반환하므로 사용 불가능.
 * Pretendard OTF를 jsdelivr CDN에서 직접 가져온다(한글·영문 통일된 한국 디자인 표준).
 *
 * runtime은 nodejs로 두어 빌드 환경 의존을 줄인다(Edge에서도 fetch는 가능하지만
 * 일부 환경에서 외부 fetch가 차단되는 경우가 있어 nodejs가 안전).
 */
export const runtime = "nodejs";
export const alt = `${company.legalName} — ${company.taglineKo}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PRETENDARD_BOLD =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf";
const PRETENDARD_MEDIUM =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Medium.otf";

async function fetchFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Font fetch failed (${res.status}): ${url}`);
  return await res.arrayBuffer();
}

export default async function OpengraphImage() {
  const [bold, medium] = await Promise.all([
    fetchFont(PRETENDARD_BOLD),
    fetchFont(PRETENDARD_MEDIUM),
  ]);

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
        {/* Decorative blurred blob */}
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

        {/* Eyebrow */}
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
          <span>공공기관 N²SF 전환 설계</span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: 700,
            fontSize: 78,
            lineHeight: 1.12,
            letterSpacing: -1,
            marginBottom: 36,
          }}
        >
          <span>망분리 이후, VDI를</span>
          <span>어떻게 할지 결정해야 할 때입니다</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.45,
            color: "rgba(219, 234, 254, 0.92)",
            maxWidth: 1000,
          }}
        >
          공공·연구기관의 기존 VDI·망분리·MFA·백업 환경을 N²SF 기준으로 재정렬합니다.
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
