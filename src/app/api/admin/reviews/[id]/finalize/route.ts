import { NextRequest, NextResponse } from "next/server";
import { getAPIUser, getAuthorizedRequest } from "@/lib/auth-sap";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";
import { renderSAPReportHtml } from "@/lib/sap/report-pdf";
import type { ReportContent, ReviewRequest } from "@/lib/types/sap";

/** POST /api/admin/reviews/[id]/finalize — finalize the latest draft → generate PDF */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAPIUser();
  if (!user || !["reviewer", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const request = await getAuthorizedRequest(id, user);
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const admin = createAdminClient();

  // Get latest draft report
  const { data: report } = await admin
    .from("review_reports")
    .select("*")
    .eq("request_id", id)
    .eq("state", "draft")
    .order("version", { ascending: false })
    .limit(1)
    .single();

  if (!report) {
    return NextResponse.json(
      { error: "No draft report found to finalize" },
      { status: 400 }
    );
  }

  // Generate PDF
  let pdfStorageKey: string | null = null;
  try {
    const html = renderSAPReportHtml(
      request as ReviewRequest,
      report.content_json as ReportContent
    );

    // Dynamic import for puppeteer (same pattern as existing pdf.ts)
    let browser;
    try {
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.default.launch({ headless: true });
    } catch {
      const puppeteerCore = await import("puppeteer-core");
      const chromium = await import("@sparticuz/chromium");
      browser = await puppeteerCore.default.launch({
        args: chromium.default.args,
        defaultViewport: null,
        executablePath: await chromium.default.executablePath(),
        headless: true,
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
      printBackground: true,
    });
    await browser.close();

    // Upload PDF
    const fileName = `sap/${id}/report-v${report.version}-final.pdf`;
    const { error: uploadError } = await admin.storage
      .from("reports")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (!uploadError) {
      pdfStorageKey = fileName;
    }
  } catch (err) {
    console.error("[finalize] PDF generation failed:", err);
    // Continue without PDF — report content is still finalized
  }

  // Update report to final
  const { data: finalized, error } = await admin
    .from("review_reports")
    .update({
      state: "final",
      pdf_storage_key: pdfStorageKey,
    })
    .eq("id", report.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Transition request status
  if (request.status === "draft_ready") {
    await admin
      .from("review_requests")
      .update({ status: "final_ready" })
      .eq("id", id);
  }

  await logAudit({
    orgId: request.org_id,
    requestId: id,
    actorUserId: user.id,
    action: "report.finalized",
    payload: { report_id: report.id, version: report.version, has_pdf: !!pdfStorageKey },
  });

  return NextResponse.json({ data: finalized });
}
