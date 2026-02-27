import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("content_items")
    .insert({
      type: body.type,
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      body_md: body.body_md,
      tags: body.tags,
      category: body.category,
      seo_title: body.seo_title,
      seo_description: body.seo_description,
      cover_image_url: body.cover_image_url,
      faq_json: body.faq_json,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
