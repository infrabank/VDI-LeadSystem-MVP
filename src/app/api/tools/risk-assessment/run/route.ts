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
import {
  calculateRiskAssessmentV4,
} from "@/lib/scoring/risk-assessment-v4";
import type { RiskAssessmentV3Input } from "@/lib/tools/risk-assessment/questions.v3";
import type { RiskAssessmentV4Input } from "@/lib/tools/risk-assessment/questions.v4";

const VALID_GRADES = ["C", "S", "O"] as const;

function isV4Input(input: Record<string, unknown>): boolean {
  // V4 inputs have both data_grade and service_model fields
  return "data_grade" in input && "service_model" in input;
}

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

  // Determine version: explicit v4, auto-detect from input shape, or fall through to v3/v2
  const useV4 = version === "v4" || isV4Input(input);
  const useV3 = !useV4 && (version === "v3" || isV3Input(input));

  if (useV4) {
    // Validate data_grade
    const dataGrade = input.data_grade as string | undefined;
    if (!dataGrade || !(VALID_GRADES as readonly string[]).includes(dataGrade)) {
      return NextResponse.json(
        { error: "data_grade must be one of C, S, O" },
        { status: 400 }
      );
    }

    const v4Input = input as unknown as RiskAssessmentV4Input;
    const result = calculateRiskAssessmentV4(v4Input);

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
      resolved_grade: result.resolved_grade,
      appropriateness_label: result.appropriateness_label,
      n2sf_compliance: result.n2sf_compliance,
      risks: result.risk_messages,
      next_steps: result.next_steps,
    });
  } else if (useV3) {
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
