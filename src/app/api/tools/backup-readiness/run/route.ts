import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { runBackupReadiness } from "@/lib/scoring/backup-readiness";
import type { BackupReadinessAnswers } from "@/lib/tools/backup-readiness/questions";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { lead_id, input } = body as {
    lead_id: string;
    input: BackupReadinessAnswers;
  };

  if (!lead_id || !input) {
    return NextResponse.json(
      { error: "lead_id and input are required" },
      { status: 400 }
    );
  }

  const result = runBackupReadiness(input);

  const supabase = createAdminClient();

  const { data: toolRun, error } = await supabase
    .from("tool_runs")
    .insert({
      lead_id,
      tool_type: "backup_readiness",
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

  // Update lead score (highest across all diagnostics)
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
    level: result.level,
    level_name: result.level_name,
    summary: result.summary,
  });
}
