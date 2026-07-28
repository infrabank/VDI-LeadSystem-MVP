import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { company } from "@/lib/site-config";
import { getIndexableTags } from "@/lib/insights-tags";

const base = `https://${company.domain}`;

const staticPaths: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about/certifications", priority: 0.6, changeFrequency: "monthly" },
  { path: "/practices", priority: 0.9, changeFrequency: "monthly" },
  { path: "/practices/managed-integration", priority: 0.9, changeFrequency: "monthly" },
  { path: "/practices/vdi-workspace", priority: 0.8, changeFrequency: "monthly" },
  { path: "/practices/mfa-access", priority: 0.8, changeFrequency: "monthly" },
  { path: "/practices/data-protection", priority: 0.8, changeFrequency: "monthly" },
  { path: "/n2sf", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/risk-assessment", priority: 0.9, changeFrequency: "monthly" },
  { path: "/tools/vdi-transition", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/n2sf-readiness", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/roi-calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/backup-readiness", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/backup-roi", priority: 0.7, changeFrequency: "monthly" },
  { path: "/insights", priority: 0.7, changeFrequency: "weekly" },
  { path: "/services/it-maintenance", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services/acronis-backup", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services/vdi-support", priority: 0.9, changeFrequency: "monthly" },
  { path: "/products/acronis-cyber-protect", priority: 0.8, changeFrequency: "monthly" },
  { path: "/products/vinchin-backup", priority: 0.8, changeFrequency: "monthly" },
  { path: "/resources/templates", priority: 0.8, changeFrequency: "monthly" },
  { path: "/partners", priority: 0.8, changeFrequency: "monthly" },
  { path: "/partners/integrated-maintenance", priority: 0.9, changeFrequency: "monthly" },
  { path: "/case-studies", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 정적 페이지는 lastModified 생략 — 빌드 시각을 넣으면 매 배포마다 전체가 갱신된 것으로
  // 보여 검색엔진이 lastmod를 신뢰하지 않게 됨. 동적 콘텐츠만 실제 수정일을 제공.
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((s) => ({
    url: `${base}${s.path}`,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));

  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("content_items")
      .select("slug, updated_at, published_at")
      .eq("status", "published");

    dynamicEntries = (data || []).map((row: { slug: string; updated_at: string | null; published_at: string | null }) => ({
      url: `${base}/insights/${row.slug}`,
      lastModified: row.updated_at ? new Date(row.updated_at) : row.published_at ? new Date(row.published_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Supabase 미연결 시(빌드 환경 등) 동적 항목 생략 — 정적만으로도 sitemap 유효
  }

  // 글이 충분히 쌓인 태그만 — 기준 미만 태그 페이지는 noindex라 sitemap에 넣지 않는다.
  const tagEntries: MetadataRoute.Sitemap = (await getIndexableTags()).map((tag) => ({
    url: `${base}/insights/tag/${encodeURIComponent(tag)}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...dynamicEntries, ...tagEntries];
}
