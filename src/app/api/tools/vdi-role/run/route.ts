import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { runVdiRole } from "@/lib/scoring/vdi-role";
import type { VdiRoleAnswers } from "@/lib/tools/vdi-role/questions";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { lead_id, input } = body as {
    lead_id: string;
    input: VdiRoleAnswers;
  };

  if (!lead_id || !input) {
    return NextResponse.json(
      { error: "lead_id and input are required" },
      { status: 400 }
    );
  }

  const result = runVdiRole(input);

  const supabase = createAdminClient();

  const { data: toolRun, error } = await supabase
    .from("tool_runs")
    .insert({
      lead_id,
      tool_type: "vdi_role",
      input_json: input,
      output_json: result,
      score: 0, // VDI role 진단은 점수 대신 유형 분류이므로 0으로 저장
    })
    .select("id")
    .single();

  if (error || !toolRun) {
    return NextResponse.json(
      { error: error?.message || "Tool run insert failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    tool_run_id: toolRun.id,
    result_type: result.result_type,
    result_name: result.result_name,
  });
}
