import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const filterType = searchParams.get("type") || null;
  const filterTag = searchParams.get("tag") || null;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  const supabase = await createClient();

  if (query) {
    const { data, error } = await supabase.rpc("search_contents", {
      search_query: query,
      filter_type: filterType,
      filter_tag: filterTag,
      page_num: page,
      page_size: pageSize,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, page });
  }

  let q = supabase
    .from("content_items")
    .select("id, type, title, slug, excerpt, cover_image_url, tags, category, published_at", {
      count: "exact",
    })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (filterType) q = q.eq("type", filterType);
  if (filterTag) q = q.contains("tags", [filterTag]);

  const { data, count, error } = await q;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data, total: count, page });
}
