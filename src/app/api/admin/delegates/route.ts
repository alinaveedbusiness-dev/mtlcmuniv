import { NextRequest, NextResponse } from "next/server";
import { getDelegates, getAdminStats } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const committee = searchParams.get("committee") || "ALL";

    const delegates = await getDelegates({ search, status, committee });
    const stats = await getAdminStats();

    return NextResponse.json({
      success: true,
      delegates,
      stats,
    });
  } catch (err) {
    console.error("GET /api/admin/delegates error:", err);
    return NextResponse.json({ error: "Failed to fetch delegates" }, { status: 500 });
  }
}
