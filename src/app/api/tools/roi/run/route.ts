import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateROIV2 } from "@/lib/scoring/roi-v2";

const inputSchema = z.object({
  lead_id: z.string().uuid(),
  input: z.object({
    total_users: z.number().int().positive(),
    avg_hourly_cost: z.number().positive(),
    avg_downtime_hours: z.number().positive(),
    incidents_per_year: z.number().int().min(0),
    current_backup: z.boolean(),
    recovery_time_improvement_percent: z.number().min(0).max(100),
    impact_rate_percent: z.number().min(0).max(100),
    major_incident_hours: z.number().min(0.5),
  }),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { lead_id, input } = parsed.data;

  // Run v2 calculation (server-only)
  const result = calculateROIV2(input);

  const supabase = createAdminClient();

  // Save to tool_runs
  const { data: toolRun, error } = await supabase
    .from("tool_runs")
    .insert({
      lead_id,
      tool_type: "roi_downtime",
      input_json: input,
      output_json: result,
      score: Math.round(result.annual_loss / 10_000_000),
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    tool_run_id: toolRun.id,
    ...result,
  });
}
