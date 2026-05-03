/**
 * OG 이미지(satori/ImageResponse)용 Pretendard 폰트 로더.
 *
 * satori는 TTF/OTF만 지원(woff2 불가). Google Fonts CSS API는 모던 UA에 woff2를
 * 반환하므로 jsdelivr 통한 Pretendard OTF를 직접 fetch한다.
 *
 * runtime nodejs 권장(외부 fetch 차단 환경 회피). force-cache로 빌드 캐시.
 */

const PRETENDARD_BOLD =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf";

const PRETENDARD_MEDIUM =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Medium.otf";

async function fetchFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Font fetch failed (${res.status}): ${url}`);
  return await res.arrayBuffer();
}

export async function loadPretendard(): Promise<{
  bold: ArrayBuffer;
  medium: ArrayBuffer;
}> {
  const [bold, medium] = await Promise.all([
    fetchFont(PRETENDARD_BOLD),
    fetchFont(PRETENDARD_MEDIUM),
  ]);
  return { bold, medium };
}

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;
