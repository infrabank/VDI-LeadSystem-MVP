import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generatePdf } from "@/lib/pdf";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;
  const supabase = createAdminClient();

  // Fetch existing report
  const { data: report, error: fetchError } = await supabase
    .from("reports")
    .select("id, access_token, report_html")
    .eq("id", reportId)
    .single();

  if (fetchError || !report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // Generate PDF from stored HTML
  try {
    const pdfBuffer = await generatePdf(report.report_html);
    const fileName = `report-${report.access_token}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "PDF upload failed: " + uploadError.message },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("reports").getPublicUrl(fileName);

    // Update existing report with pdf_url
    const { error: updateError } = await supabase
      .from("reports")
      .update({ pdf_url: publicUrl })
      .eq("id", reportId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update report: " + updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ pdf_url: publicUrl });
  } catch (err) {
    console.error("PDF retry failed:", err);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 }
    );
  }
}
