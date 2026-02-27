import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderROIV2ReportHtml, generatePdf, type ROIV2ReportData } from "@/lib/pdf";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ toolRunId: string }> }
) {
  const { toolRunId } = await params;
  const supabase = createAdminClient();

  // Fetch tool_run with lead info
  const { data: toolRun, error: trError } = await supabase
    .from("tool_runs")
    .select("*, leads(email, name, company)")
    .eq("id", toolRunId)
    .single();

  if (trError || !toolRun) {
    return NextResponse.json(
      { error: "Tool run not found" },
      { status: 404 }
    );
  }

  const lead = toolRun.leads as { email: string; name: string | null; company: string | null } | null;
  const output = toolRun.output_json as Record<string, unknown>;
  const input = toolRun.input_json as Record<string, unknown>;

  // Generate access token
  const accessToken = crypto.randomUUID();

  // Render HTML report
  const reportHtml = renderROIV2ReportHtml({
    company: (lead?.company as string) || "-",
    date: new Date().toLocaleDateString("ko-KR"),
    output: output as ROIV2ReportData["output"],
    input,
  });

  // Generate PDF
  let pdfUrl: string | null = null;
  try {
    const pdfBuffer = await generatePdf(reportHtml);

    // Upload PDF to Storage
    const pdfFileName = `roi-report-${accessToken}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(pdfFileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("reports")
        .getPublicUrl(pdfFileName);
      pdfUrl = urlData.publicUrl;
    }
  } catch {
    // PDF generation failed — continue without PDF (can retry later)
    console.error("PDF generation failed, continuing without PDF");
  }

  // Save report
  const { data: report, error: reportError } = await supabase
    .from("reports")
    .insert({
      lead_id: toolRun.lead_id,
      tool_run_id: toolRunId,
      title: "VDI 다운타임 비용/ROI 분석 리포트",
      report_html: reportHtml,
      pdf_url: pdfUrl,
      access_token: accessToken,
    })
    .select("id, access_token, pdf_url")
    .single();

  if (reportError) {
    return NextResponse.json({ error: reportError.message }, { status: 400 });
  }

  return NextResponse.json({
    report_id: report.id,
    access_token: report.access_token,
    pdf_url: report.pdf_url,
  });
}
