import { company } from "@/lib/site-config";

/**
 * IndexNow — 콘텐츠 발행·수정 시 Bing·Naver 등 참여 검색엔진에 즉시 색인 통지.
 * 키 파일: public/{INDEXNOW_KEY}.txt (호스트 소유 증명).
 * 실패해도 발행 흐름을 막지 않는 best-effort 호출로만 사용할 것.
 */
const INDEXNOW_KEY = "af82027208f44c4e9ccb5ba359a29aca";
const HOST = company.domain; // myloket.co.kr

export async function notifyIndexNow(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: paths.map((p) => `https://${HOST}${p}`),
      }),
      // 발행 응답을 지연시키지 않도록 짧게 제한
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok && res.status !== 202) {
      console.warn(`[indexnow] non-ok response: ${res.status}`);
    }
  } catch (err) {
    console.warn("[indexnow] notify failed (non-blocking):", err);
  }
}
