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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${targetId}`);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorative Radial Shimmers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gold-400/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-screen bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Emblem */}
        <div className="mb-4 relative">
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full p-2 border-2 border-gold-400/40 shadow-gold-glow flex items-center justify-center bg-emerald-950/80 backdrop-blur-md">
            <Image
              src="/images/logo.png"
              alt="MTLC MUN IV Seal"
              width={240}
              height={240}
              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              priority
            />
          </div>
        </div>

        {/* Official Assembly Heading */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-100 max-w-3xl leading-[1.1] mb-4">
          MTLC MUN <span className="text-gold-gradient">IV</span>
        </h1>

        {/* Minimal Badges: Date & Venue */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs sm:text-sm font-serif">
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-medium tracking-wide">{settings.eventDates}</span>
          </div>
          <a
            href="https://maps.app.goo.gl/Wop3i4t6TH1oHv4t8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-gold-400/25 hover:border-gold-400/60 transition-all text-xs sm:text-sm text-stone-300 hover:text-gold-200"
          >
            <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
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
            onClick={(e) => scrollToSection(e, "register")}
            className="w-full sm:w-auto btn-gold px-8 py-3 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold-glow transition-all duration-200 active:scale-95 cursor-pointer group"
          >
            <span>Register Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#committees"
            onClick={(e) => scrollToSection(e, "committees")}
            className="w-full sm:w-auto btn-outline-gold px-7 py-3 rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer"
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
