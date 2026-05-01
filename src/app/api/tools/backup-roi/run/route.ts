import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { runBackupRoi, type BackupRoiInputs } from "@/lib/scoring/backup-roi";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { lead_id, input } = body as {
    lead_id: string;
    input: BackupRoiInputs;
  };

  if (!lead_id || !input) {
    return NextResponse.json(
      { error: "lead_id and input are required" },
      { status: 400 }
    );
  }

  const result = runBackupRoi(input);

  const supabase = createAdminClient();

  const { data: toolRun, error } = await supabase
    .from("tool_runs")
    .insert({
      lead_id,
      tool_type: "backup_roi",
      input_json: input,
      output_json: result,
      score: result.score,
    })
    .select("id")
    .single();

  if (error || !toolRun) {
    return NextResponse.json(
      { error: error?.message || "Tool run insert failed" },
      { status: 400 }
    );
  }

  // Update lead score (highest across all tools)
  const { data: existingLead } = await supabase
    .from("leads")
    .select("score")
    .eq("id", lead_id)
    .single();

  const nextScore = Math.max(result.score, existingLead?.score ?? 0);
  await supabase.from("leads").update({ score: nextScore }).eq("id", lead_id);

  return NextResponse.json({
    tool_run_id: toolRun.id,
    score: result.score,
    expected_roi_pct: result.scenarios.expected.roi_pct,
    payback_months: result.scenarios.expected.payback_months,
  });
}
