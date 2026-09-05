import { NextResponse } from "next/server";
import { getAllDelegates } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const delegates = await getAllDelegates();

    // Helper to safely escape CSV values
    const escapeCsv = (str: string | number | undefined | null) => {
      if (str === undefined || str === null) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const headers = [
      "Tracking ID",
      "Registration Type",
      "Lead / Delegate Name",
      "Email Address",
      "Phone / WhatsApp",
      "Institution",
      "Committee / Role",
      "Status",
      "Delegation Members Roster",
      "Payment Proof URLs",
      "Submission Date",
      "Secretariat Notes",
    ];

    const rows: string[][] = [];

    for (const d of delegates) {
      const typeLabel =
        d.registrationType === "delegation"
          ? "Delegation"
          : d.registrationType === "observer"
          ? "Observer"
          : d.comingAs === "Observer"
          ? "Observer (Private)"
          : "Private Delegate";

      let rosterSummary = "";
      if (d.delegates && d.delegates.length > 0) {
        rosterSummary = d.delegates
          .map(
            (m) =>
              `[${m.delegateNumber === 1 ? "Head Delegate" : `D${m.delegateNumber}`}: ${m.fullName} | ${m.committee} | ${m.email} | ${m.phone}]`
          )
          .join(" ; ");
      }

      const allProofUrls = (d.paymentProofUrls && d.paymentProofUrls.length > 0)
        ? d.paymentProofUrls.join(" | ")
        : d.paymentProofUrl || "";

      rows.push([
        escapeCsv(d.id),
        escapeCsv(typeLabel),
        escapeCsv(d.fullName),
        escapeCsv(d.email),
        escapeCsv(d.phone),
        escapeCsv(d.institution),
        escapeCsv(d.committee),
        escapeCsv(d.status),
        escapeCsv(rosterSummary),
        escapeCsv(allProofUrls),
        escapeCsv(new Date(d.createdAt).toLocaleString()),
        escapeCsv(d.notes || ""),
      ]);
    }

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const filename = `MTLC_MUN_IV_Delegates_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("GET /api/admin/export error:", err);
    return NextResponse.json({ error: "Failed to generate CSV export" }, { status: 500 });
  }
}
