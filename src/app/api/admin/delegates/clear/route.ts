import { NextResponse } from "next/server";
import { clearAllDelegates } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function POST() {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await clearAllDelegates();
    return NextResponse.json({ success: true, message: "All registrations purged successfully." });
  } catch (err) {
    console.error("POST /api/admin/delegates/clear error:", err);
    return NextResponse.json({ error: "Failed to clear registrations" }, { status: 500 });
  }
}
