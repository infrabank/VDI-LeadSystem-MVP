import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  runRiskAssessmentV2,
  type RiskAssessmentInput,
} from "@/lib/scoring/risk-assessment-v2";
import {
  runRiskAssessmentV3,
  type RiskAssessmentV3Output,
} from "@/lib/scoring/risk-assessment-v3";
import type { RiskAssessmentV3Input } from "@/lib/tools/risk-assessment/questions.v3";

function isV3Input(input: Record<string, unknown>): boolean {
  // V3 inputs have fields like host_count, ha_enabled, dr_site, etc.
  return (
    "host_count" in input ||
    "ha_enabled" in input ||
    "dr_site" in input ||
    "incident_response_maturity" in input ||
    "automation_level" in input
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { lead_id, input, version } = body as {
    lead_id: string;
    input: Record<string, unknown>;
    version?: string;
  };

  if (!lead_id || !input) {
    return NextResponse.json(
      { error: "lead_id and input are required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Determine version: explicit v3, or auto-detect from input shape
  const useV3 = version === "v3" || isV3Input(input);

  if (useV3) {
    // V3 scoring
    const v3Input = input as unknown as RiskAssessmentV3Input;
    const result: RiskAssessmentV3Output = runRiskAssessmentV3(v3Input);

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
  } else {
    // V2 scoring (backward compat for old form payloads)
    const v2Input = input as unknown as RiskAssessmentInput;
    const result = runRiskAssessmentV2(v2Input);

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
}
