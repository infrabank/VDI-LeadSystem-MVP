import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { company } from "@/lib/site-config";

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
  { path: "/case-studies", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((s) => ({
    url: `${base}${s.path}`,
    lastModified: now,
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

  return [...staticEntries, ...dynamicEntries];
}
