import { NextRequest, NextResponse } from "next/server";
import { updateDelegateStatus, deleteDelegate, getDelegateById } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    if (status && !["Pending", "Verified", "Approved", "Rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await updateDelegateStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json({ error: "Delegate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, delegate: updated });
  } catch (err) {
    console.error("PATCH /api/admin/delegates/[id] error:", err);
    return NextResponse.json({ error: "Failed to update delegate" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const success = await deleteDelegate(id);

    if (!success) {
      return NextResponse.json({ error: "Delegate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Delegate deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/admin/delegates/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete delegate" }, { status: 500 });
  }
}
