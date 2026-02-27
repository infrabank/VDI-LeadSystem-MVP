import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  runRiskAssessmentV2,
  type RiskAssessmentInput,
} from "@/lib/scoring/risk-assessment-v2";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { lead_id, input } = body as {
    lead_id: string;
    input: RiskAssessmentInput;
  };

  if (!lead_id || !input) {
    return NextResponse.json(
      { error: "lead_id and input are required" },
      { status: 400 }
    );
  }

  // Run v2 scoring
  const result = runRiskAssessmentV2(input);

  const supabase = createAdminClient();

  // Save tool run with v2 output
  const { data: toolRun, error } = await supabase
    .from("tool_runs")
    .insert({
      lead_id,
      tool_type: "risk_assessment",
      input_json: input,
      output_json: result,
      score: result.score,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Update lead score
  await supabase
    .from("leads")
    .update({ score: result.score })
    .eq("id", lead_id);

  return NextResponse.json({
    tool_run_id: toolRun.id,
    score: result.score,
    risk_level: result.risk_level,
    risks: result.risk_messages,
    next_steps: result.next_steps,
  });
}
