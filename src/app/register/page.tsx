import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, User, Eye, ArrowRight, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Now | MTLC MUN IV",
  description: "Choose your registration track for MTLC MUN IV: Delegation, Private Delegate, or Observer.",
};

export default function RegisterHubPage() {
  return (
    <main className="min-h-screen bg-[#0a1811] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gold-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl w-full z-10">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-gold-400 hover:text-gold-300 transition-colors group uppercase tracking-widest font-semibold"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to MTLC MUN IV Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-400/30 bg-emerald-950/80 text-gold-300 text-xs uppercase tracking-widest font-semibold mb-4 shadow-gold-subtle">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>The Fourth Annual Assembly</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-100 tracking-tight mb-4">
            Register <span className="text-gold-gradient">Now!</span>
          </h1>
          <div className="gold-divider w-24 mx-auto mb-4" />
          <p className="max-w-xl mx-auto text-stone-300 text-sm sm:text-base font-light">
            Select your preferred participation track to access its dedicated registration portal.
          </p>
        </div>

        {/* 3 Main Registration Track Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Delegation */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-gold-400/30 hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-300 group relative">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>

              <div className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-gold-400/15 text-gold-300 border border-gold-400/30 font-semibold mb-2">
                Teams &amp; Institutions
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mb-2">
                Delegation Registration
              </h2>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                For school, college, and university delegations. Register a designated <strong>Head Delegate</strong> alongside 3 required delegates (and up to 2 optional members).
              </p>

              <ul className="text-xs text-stone-400 space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Head Delegate + 3 to 5 Delegates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Preferences across all 6 committees</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Attach up to 5 payment proofs (&le; 1 MB)</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register/delegation"
              className="btn-gold w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold-subtle group-hover:shadow-gold-glow transition-all text-center"
            >
              <span>Register Delegation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Private Delegate */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-gold-400/30 hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-300 group relative">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>

              <div className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-gold-400/15 text-gold-300 border border-gold-400/30 font-semibold mb-2">
                Independent Delegates
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mb-2">
                Private Delegate
              </h2>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                Individual delegate registration with direct committee allocation. Choose to participate either as a full <strong>Delegate</strong> or as an <strong>Observer</strong>.
              </p>

              <ul className="text-xs text-stone-400 space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Coming as Delegate or Observer</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Choose from UNSC, UNHRC, UNW, DISEC, PNA, CRISIS</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Attach proof of payment (&le; 1 MB)</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register/private-delegate"
              className="btn-gold w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold-subtle group-hover:shadow-gold-glow transition-all text-center"
            >
              <span>Register Private Delegate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 3: Observer */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-gold-400/30 hover:border-gold-400/70 hover:shadow-gold-glow transition-all duration-300 group relative">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>

              <div className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-gold-400/15 text-gold-300 border border-gold-400/30 font-semibold mb-2">
                Diplomatic Pass
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mb-2">
                Observer Registration
              </h2>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                Fast-track observer pass for visitors, faculty advisors, mentors, and delegates attending general assembly sessions and diplomatic social events.
              </p>

              <ul className="text-xs text-stone-400 space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Simplified fast-track form</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Complete conference observation pass</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Attach proof of payment (&le; 1 MB)</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register/observer"
              className="btn-gold w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold-subtle group-hover:shadow-gold-glow transition-all text-center"
            >
              <span>Register as Observer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
