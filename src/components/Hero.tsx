"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, ArrowRight, ChevronDown, Calendar } from "lucide-react";
import { ConferenceSettings } from "@/lib/types";

interface HeroProps {
  settings: ConferenceSettings;
}

export default function Hero({ settings }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 27,
    hours: 14,
    minutes: 38,
    seconds: 22,
  });

  useEffect(() => {
    const target = new Date("2026-10-03T09:00:00").getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorative Radial Shimmers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gold-400/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-screen bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center z-10 flex flex-col items-center">
        {/* Conference Emblem */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-4 bg-gold-400/25 rounded-full blur-2xl group-hover:bg-gold-400/35 transition-all duration-700" />
          <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 mx-auto drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)]">
            <Image
              src="/images/logo.png"
              alt="MTLC MUN IV Official Seal"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Conference Title & Subtitle */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-stone-100 mb-2 drop-shadow-md">
          <span className="text-gold-gradient">MTLC MUN IV</span>
        </h1>

        <div className="mb-4">
          <span className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-gold-200/90 tracking-wide">
            Legacy Edition
          </span>
        </div>

        {/* Motto Display */}
        <div className="my-4 relative inline-block">
          <div className="gold-divider w-28 sm:w-40 mx-auto mb-2.5" />
          <p className="font-serif tracking-[0.3em] sm:tracking-[0.4em] uppercase text-xs sm:text-sm font-bold text-gold-400 drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
            DIALOGUE. DIPLOMACY. IMPACT.
          </p>
          <div className="gold-divider w-28 sm:w-40 mx-auto mt-2.5" />
        </div>

        {/* Date & Location Badges */}
        <div className="my-4 flex flex-wrap items-center justify-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-gold-400/30 text-xs sm:text-sm text-gold-300 shadow-gold-subtle">
            <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
            <span className="font-semibold tracking-wide">{settings?.eventDates || "October 3 - 4 - 5, 2026"}</span>
          </div>

          <a
            href="https://maps.app.goo.gl/Wop3i4t6TH1oHv4t8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-gold-400/30 hover:border-gold-400/70 text-xs sm:text-sm text-stone-200 hover:text-gold-200 transition-all duration-300 shadow-gold-subtle group"
          >
            <MapPin className="w-4 h-4 text-gold-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="font-medium">The City School MTLC</span>
            <span className="text-[11px] text-gold-400/80 font-mono underline underline-offset-2 ml-1">
              View Map ↗
            </span>
          </a>
        </div>

        {/* Minimal Primary Call To Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mx-auto my-6">
          <a
            href="#register"
            className="w-full sm:w-auto btn-gold px-8 py-3 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold-glow"
          >
            <span>Register Now</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#committees"
            className="w-full sm:w-auto btn-outline-gold px-7 py-3 rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>Committees</span>
          </a>
        </div>

        {/* Live Countdown Timer */}
        <div className="glass-panel px-6 py-4 rounded-xl max-w-md w-full mt-2">
          <div className="text-[10px] uppercase tracking-widest text-gold-400/90 font-serif mb-2 font-semibold">
            Conclave Countdown
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
            <div className="bg-emerald-950/70 border border-gold-400/20 rounded py-2">
              <span className="block font-serif text-lg sm:text-xl font-bold text-gold-100">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-stone-400">Days</span>
            </div>
            <div className="bg-emerald-950/70 border border-gold-400/20 rounded py-2">
              <span className="block font-serif text-lg sm:text-xl font-bold text-gold-100">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-stone-400">Hours</span>
            </div>
            <div className="bg-emerald-950/70 border border-gold-400/20 rounded py-2">
              <span className="block font-serif text-lg sm:text-xl font-bold text-gold-100">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-stone-400">Minutes</span>
            </div>
            <div className="bg-emerald-950/70 border border-gold-400/20 rounded py-2">
              <span className="block font-serif text-lg sm:text-xl font-bold text-gold-100">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-stone-400">Seconds</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
