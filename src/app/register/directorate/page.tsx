import React from "react";
import MinimalRegistrationPortal from "@/components/MinimalRegistrationPortal";
import { getSettings } from "@/lib/db";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Directorate Application | MTLC MUN IV",
  description: "Official Host Team & Directorate Recruitment for MTLC MUN IV. Apply for Media, Logistics, Publication, Security, Del Affairs, Secretariat Affairs, and Socials.",
};

export default async function DirectorateRegistrationPage() {
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-[#0a1811] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <MinimalRegistrationPortal
        settings={settings}
        lockedTrack="directorate"
        showBackLink={true}
      />
    </main>
  );
}
