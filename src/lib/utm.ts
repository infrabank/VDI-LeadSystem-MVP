/**
 * 소셜 채널 링크의 utm_source·utm_medium·utm_campaign을 세션에 보관해,
 * 페이지를 옮겨 다닌 뒤 폼을 보내도 문의 본문에 출처가 남게 한다.
 */
const KEY = "myloket-utm";
const FIELDS = ["utm_source", "utm_medium", "utm_campaign"] as const;

export type Utm = Partial<Record<(typeof FIELDS)[number], string>>;

export function captureUtm(): Utm {
  try {
    const params = new URLSearchParams(window.location.search);
    const fresh: Utm = {};
    for (const f of FIELDS) {
      const v = params.get(f)?.trim().slice(0, 100);
      if (v) fresh[f] = v;
    }
    if (Object.keys(fresh).length > 0) {
      sessionStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }
    const stored = sessionStorage.getItem(KEY);
    return stored ? (JSON.parse(stored) as Utm) : {};
  } catch {
    return {};
  }
}

export function utmLine(utm: Utm): string | null {
  const parts = FIELDS.map((f) => utm[f]).filter(Boolean);
  return parts.length > 0 ? `[출처] ${parts.join(" / ")}` : null;
}
