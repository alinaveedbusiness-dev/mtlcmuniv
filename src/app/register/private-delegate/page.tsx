import React from "react";
import MinimalRegistrationPortal from "@/components/MinimalRegistrationPortal";
import { getSettings } from "@/lib/db";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Private Delegate Registration | MTLC MUN IV",
  description: "Official Private Delegate Registration for MTLC MUN IV. Direct allocation across all 6 committees.",
};

export default async function PrivateDelegateRegistrationPage() {
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-[#0a1811] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <MinimalRegistrationPortal
        settings={settings}
        lockedTrack="private_delegate"
        showBackLink={true}
      />
    </main>
  );
}
