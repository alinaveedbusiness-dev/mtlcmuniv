import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "MTLC MUN IV: Legacy Edition",
  description: "DIALOGUE. DIPLOMACY. IMPACT. Official delegate portal for MTLC MUN IV.",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "MTLC MUN IV: Legacy Edition",
    description: "DIALOGUE. DIPLOMACY. IMPACT.",
    images: ["/images/logo.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0a1811] text-stone-300 min-h-screen antialiased selection:bg-[#c5a059] selection:text-[#0a1811]">
        {children}
      </body>
    </html>
  );
}
