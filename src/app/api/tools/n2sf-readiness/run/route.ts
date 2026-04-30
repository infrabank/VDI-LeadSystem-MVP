import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { runN2sfReadiness } from "@/lib/scoring/n2sf-readiness";
import type { N2sfReadinessAnswers } from "@/lib/tools/n2sf-readiness/questions";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { lead_id, input } = body as {
    lead_id: string;
    input: N2sfReadinessAnswers;
  };

  if (!lead_id || !input) {
    return NextResponse.json(
      { error: "lead_id and input are required" },
      { status: 400 }
    );
  }

  const result = runN2sfReadiness(input);

  const supabase = createAdminClient();

  const { data: toolRun, error } = await supabase
    .from("tool_runs")
    .insert({
      lead_id,
      tool_type: "n2sf_readiness",
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

  // Update lead score (top score across all diagnostics — keep highest)
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
