import React from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import CommitteesSection from "@/components/CommitteesSection";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/db";
import { Users, User, Eye, ArrowRight } from "lucide-react";

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
        {/* REGISTER NOW SECTION - 3 BUTTONS FOR 3 DEDICATED FORM PAGES */}
        {/* ========================================================================= */}
        <section
          id="register"
          className="py-20 px-4 sm:px-6 lg:px-8 relative border-t border-gold-400/20 bg-gradient-to-b from-[#08150f] via-[#0a1811] to-[#08150f]"
        >
          {/* Ambient Decorative Shimmers */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-600/10 rounded-full blur-[130px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[250px] bg-gold-400/10 rounded-full blur-[80px]" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
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

            {/* 3 Prominent Registration Buttons & Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Delegation Registration */}
              <div className="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-gold-400/30 hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-5 group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-100 mb-2">
                    Delegation Form
                  </h3>

                  <p className="text-stone-300 text-xs leading-relaxed mb-5 font-light">
                    For institutional teams. Register a designated <strong>Head Delegate</strong> plus 3 required delegates (and up to 2 optional delegates).
                  </p>

                  <div className="space-y-1.5 text-xs text-stone-400 mb-6 border-t border-gold-400/15 pt-3">
                    <div className="flex items-center justify-between">
                      <span>Roster</span>
                      <span className="text-stone-200">Head Delegate + 3–5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Committees</span>
                      <span className="text-stone-200">All 6 Councils</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/register/delegation"
                  className="btn-gold w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold-subtle group-hover:shadow-gold-glow transition-all text-center"
                >
                  <span>Register Delegation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Card 2: Private Delegate */}
              <div className="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-gold-400/30 hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-5 group-hover:scale-105 transition-transform">
                    <User className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-100 mb-2">
                    Private Delegate Form
                  </h3>

                  <p className="text-stone-300 text-xs leading-relaxed mb-5 font-light">
                    For independent candidates. Choose to participate either as a full <strong>Delegate</strong> or as an <strong>Observer</strong>.
                  </p>

                  <div className="space-y-1.5 text-xs text-stone-400 mb-6 border-t border-gold-400/15 pt-3">
                    <div className="flex items-center justify-between">
                      <span>Type</span>
                      <span className="text-stone-200">Delegate / Observer</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Committees</span>
                      <span className="text-stone-200">Direct Selection</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/register/private-delegate"
                  className="btn-gold w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold-subtle group-hover:shadow-gold-glow transition-all text-center"
                >
                  <span>Register Private Delegate</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Card 3: Observer */}
              <div className="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-gold-400/30 hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-5 group-hover:scale-105 transition-transform">
                    <Eye className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-100 mb-2">
                    Observer Form
                  </h3>

                  <p className="text-stone-300 text-xs leading-relaxed mb-5 font-light">
                    Fast-track pass for visitors, faculty advisors, mentors, and guests attending assembly proceedings and social events.
                  </p>

                  <div className="space-y-1.5 text-xs text-stone-400 mb-6 border-t border-gold-400/15 pt-3">
                    <div className="flex items-center justify-between">
                      <span>Form</span>
                      <span className="text-stone-200">3 Quick Fields</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Access</span>
                      <span className="text-stone-200">Conclave Pass</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/register/observer"
                  className="btn-gold w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold-subtle group-hover:shadow-gold-glow transition-all text-center"
                >
                  <span>Register as Observer</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
