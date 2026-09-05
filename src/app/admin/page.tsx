import React from "react";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import { getSettings, getAllDelegates } from "@/lib/db";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuthenticated = await verifyAdminSession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const [settings, delegates] = await Promise.all([
    getSettings(),
    getAllDelegates(),
  ]);

  return (
    <AdminDashboardClient
      initialSettings={settings}
      initialDelegates={delegates}
    />
  );
}
