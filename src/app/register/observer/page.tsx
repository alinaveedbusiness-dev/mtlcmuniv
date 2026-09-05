import React from "react";
import MinimalRegistrationPortal from "@/components/MinimalRegistrationPortal";
import { getSettings } from "@/lib/db";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Observer Registration | MTLC MUN IV",
  description: "Official Observer Registration for MTLC MUN IV. Diplomatic pass and general assembly access.",
};

export default async function ObserverRegistrationPage() {
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-[#0a1811] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <MinimalRegistrationPortal
        settings={settings}
        lockedTrack="observer"
        showBackLink={true}
      />
    </main>
  );
}
