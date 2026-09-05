import React from "react";
import MinimalRegistrationPortal from "@/components/MinimalRegistrationPortal";
import { getSettings } from "@/lib/db";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Delegation Registration | MTLC MUN IV",
  description: "Official Delegation Registration for MTLC MUN IV. Register Head Delegate and team members.",
};

export default async function DelegationRegistrationPage() {
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-[#0a1811] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <MinimalRegistrationPortal
        settings={settings}
        lockedTrack="delegation"
        showBackLink={true}
      />
    </main>
  );
}
