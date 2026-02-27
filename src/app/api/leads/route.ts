import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, name, company, source, consent_marketing } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Upsert by email
  const { data, error } = await supabase
    .from("leads")
    .upsert(
      {
        email,
        name: name || null,
        company: company || null,
        source: source || "direct",
        consent_marketing: consent_marketing || false,
      },
      { onConflict: "email" }
    )
    .select("id, email")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
