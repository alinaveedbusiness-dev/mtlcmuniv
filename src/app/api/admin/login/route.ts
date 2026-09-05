import { NextRequest, NextResponse } from "next/server";
import { validateAdminPassword, setAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const isValid = await validateAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid Secretariat administrative credentials." }, { status: 401 });
    }

    await setAdminSession();
    return NextResponse.json({ success: true, message: "Authentication successful." });
  } catch (err) {
    console.error("POST /api/admin/login error:", err);
    return NextResponse.json({ error: "Internal authentication error" }, { status: 500 });
  }
}
