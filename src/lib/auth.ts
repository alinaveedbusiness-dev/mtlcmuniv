import { cookies } from "next/headers";
import { getSettings } from "./db";

const ADMIN_SESSION_COOKIE = "mtlc_admin_session";
// Default secret token used for session verification (override via ADMIN_SESSION_SECRET env in production)
const SESSION_VALUE = process.env.ADMIN_SESSION_SECRET || "mtlc_legacy_authenticated_session_secret_2026";

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  return session?.value === SESSION_VALUE;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function validateAdminPassword(password: string): Promise<boolean> {
  const settings = await getSettings();
  const validPassword = settings.adminPassword || process.env.ADMIN_PASSWORD || "legacy2026";
  return password.trim() === validPassword.trim();
}
