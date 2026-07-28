import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * 태그 페이지를 색인 대상으로 삼는 최소 글 수.
 *
 * 2026-07-28 기준 발행글 37건에 고유 태그가 108개이고 그중 79개가 글 1건짜리다.
 * 전부 페이지로 열면 목록이 거의 같은 얇은 페이지를 대량 생성하게 되므로,
 * 이 기준 미만인 태그는 링크하지 않고 sitemap에도 넣지 않는다.
 */
export const TAG_MIN_ARTICLES = 3;

/** 발행글 기준 태그별 글 수. */
export const getTagCounts = cache(async (): Promise<Map<string, number>> => {
  const counts = new Map<string, number>();
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("content_items")
      .select("tags")
      .eq("status", "published");

    for (const row of (data || []) as { tags: string[] | null }[]) {
      for (const tag of row.tags || []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
  } catch {
    // Supabase 미연결 시 빈 맵 — 호출부는 태그 링크를 생략하고 넘어간다.
  }
  return counts;
});

/** 자체 페이지를 가질 만큼 글이 쌓인 태그. */
export const getIndexableTags = cache(async (): Promise<string[]> => {
  const counts = await getTagCounts();
  return [...counts.entries()]
    .filter(([, n]) => n >= TAG_MIN_ARTICLES)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
});
