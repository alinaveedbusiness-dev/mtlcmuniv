import React from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import CommitteesSection from "@/components/CommitteesSection";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/db";
import { Users, User, Eye, ArrowRight, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-[#0a1811] text-stone-100 flex flex-col selection:bg-gold-500 selection:text-emerald-950">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero settings={settings} />

        {/* Committees Section */}
        <CommitteesSection settings={settings} />

        {/* ========================================================================= */}
        {/* REGISTER NOW SECTION - 4 DEDICATED TRACKS */}
        {/* ========================================================================= */}
        <section
          id="register"
          className="py-20 px-4 sm:px-6 lg:px-8 relative border-t border-gold-400/20 bg-gradient-to-b from-[#08150f] via-[#0a1811] to-[#08150f] scroll-mt-16"
        >
          {/* Ambient Decorative Shimmers */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-600/10 rounded-full blur-[130px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[250px] bg-gold-400/10 rounded-full blur-[80px]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Minimal Section Header */}
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 tracking-tight">
                Register <span className="text-gold-gradient">Now!</span>
              </h2>
              <div className="gold-divider w-20 mx-auto mt-4 mb-4" />
              <p className="max-w-xl mx-auto text-stone-400 text-xs sm:text-sm font-light">
                Select your registration track below to access its dedicated portal.
              </p>
            </div>

            {/* 4 Prominent Registration Buttons & Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Delegation Registration */}
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-gold-400/30 hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-300 group">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-4 group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>

                  <h3 className="font-serif text-lg font-bold text-stone-100 mb-6">
                    Delegation Form
                  </h3>
                </div>

                <Link
                  href="/register/delegation"
                  className="btn-gold w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-gold-subtle group-hover:shadow-gold-glow transition-all text-center"
                >
                  <span>Register Delegation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Card 2: Private Delegate */}
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-gold-400/30 hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-300 group">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-4 group-hover:scale-105 transition-transform">
                    <User className="w-5 h-5" />
                  </div>

                  <h3 className="font-serif text-lg font-bold text-stone-100 mb-6">
                    Private Delegate Form
                  </h3>
                </div>

                <Link
                  href="/register/private-delegate"
                  className="btn-gold w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-gold-subtle group-hover:shadow-gold-glow transition-all text-center"
                >
                  <span>Register Private</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Card 3: Observer */}
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-gold-400/30 hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-300 group">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-4 group-hover:scale-105 transition-transform">
                    <Eye className="w-5 h-5" />
                  </div>

                  <h3 className="font-serif text-lg font-bold text-stone-100 mb-6">
                    Observer Form
                  </h3>
                </div>

                <Link
                  href="/register/observer"
                  className="btn-gold w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-gold-subtle group-hover:shadow-gold-glow transition-all text-center"
                >
                  <span>Register Observer</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Card 4: Directorate Form */}
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-gold-400/30 hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-300 group">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-4 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>

                  <h3 className="font-serif text-lg font-bold text-stone-100 mb-6">
                    Directorate Form
                  </h3>
                </div>

                <Link
                  href="/register/directorate"
                  className="btn-gold w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-gold-subtle group-hover:shadow-gold-glow transition-all text-center"
                >
                  <span>Apply Directorate</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
