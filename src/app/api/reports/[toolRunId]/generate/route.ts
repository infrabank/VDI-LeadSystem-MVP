import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderReportHtml, renderRiskV2ReportHtml, renderRiskV3ReportHtml, renderRiskV4ReportHtml, generatePdf } from "@/lib/pdf";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ toolRunId: string }> }
) {
  const { toolRunId } = await params;
  const supabase = createAdminClient();

  // Fetch tool run with lead info
  const { data: toolRun, error: trError } = await supabase
    .from("tool_runs")
    .select("*, leads(id, email, name, company)")
    .eq("id", toolRunId)
    .single();

  if (trError || !toolRun) {
    return NextResponse.json(
      { error: "Tool run not found" },
      { status: 404 }
    );
  }

  const lead = toolRun.leads;
  const output = toolRun.output_json as Record<string, unknown>;
  const version = output.version as string | undefined;

  // Generate access token
  const accessToken = crypto.randomUUID();

  // Render HTML report (v1, v2, v3, or v4)
  let reportHtml: string;
  if (version === "v4") {
    reportHtml = renderRiskV4ReportHtml({
      company: lead?.company || "",
      date: new Date().toLocaleDateString("ko-KR"),
      output: output as unknown as import("@/lib/scoring/risk-assessment-v4").RiskAssessmentV4Output,
      input: toolRun.input_json as Record<string, unknown>,
    });
  } else if (version === "v3") {
    reportHtml = renderRiskV3ReportHtml({
      company: lead?.company || "",
      date: new Date().toLocaleDateString("ko-KR"),
      output: output as unknown as import("@/lib/scoring/risk-assessment-v3").RiskAssessmentV3Output,
      input: toolRun.input_json as Record<string, unknown>,
    });
  } else if (version === "v2") {
    reportHtml = renderRiskV2ReportHtml({
      company: lead?.company || "",
      date: new Date().toLocaleDateString("ko-KR"),
      output: output as unknown as import("@/lib/scoring/risk-assessment-v2").RiskAssessmentV2Output,
      input: toolRun.input_json as Record<string, unknown>,
    });
  } else {
    const v1Output = output as {
      risks: string[];
      next_steps: string[];
      risk_level: string;
    };
    reportHtml = renderReportHtml({
      company: lead?.company || "",
      date: new Date().toLocaleDateString("ko-KR"),
      score: toolRun.score || 0,
      risk_level: v1Output.risk_level,
      risks: v1Output.risks,
      next_steps: v1Output.next_steps,
      input: toolRun.input_json as Record<string, unknown>,
    });
  }

  // Generate PDF
  let pdfUrl: string | null = null;
  try {
    const pdfBuffer = await generatePdf(reportHtml);
    const fileName = `report-${accessToken}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
      });

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("reports").getPublicUrl(fileName);
      pdfUrl = publicUrl;
    }
  } catch {
    // PDF generation failed — continue without PDF (can retry later)
    console.error("PDF generation failed, continuing without PDF");
  }

  // Save report record
  const { data: report, error: reportError } = await supabase
    .from("reports")
    .insert({
      lead_id: lead?.id || toolRun.lead_id,
      tool_run_id: toolRunId,
      title: "VDI 리스크 진단 리포트",
      report_html: reportHtml,
      pdf_url: pdfUrl,
      access_token: accessToken,
    })
    .select("id, access_token, pdf_url")
    .single();

  if (reportError) {
    return NextResponse.json(
      { error: reportError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    report_id: report.id,
    access_token: report.access_token,
    pdf_url: report.pdf_url,
  });
}
