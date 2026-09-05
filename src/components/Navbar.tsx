"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Menu, X, ArrowRight, Sparkles } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Committees", href: "#committees" },
    { name: "Itinerary", href: "#schedule" },
    { name: "Payment Guide", href: "#guidelines" },
    { name: "Register", href: "#register" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-emerald-950/90 backdrop-blur-md border-b border-gold-400/20 py-3 shadow-lg shadow-black/50"
          : "bg-transparent py-5 border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="MTLC MUN IV Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <div>
            <div className="font-serif tracking-wider text-base sm:text-lg font-bold text-stone-100 flex items-center gap-1.5">
              <span>MTLC MUN IV</span>
              <span className="text-[10px] uppercase font-sans font-semibold tracking-widest text-gold-400 bg-gold-400/10 px-1.5 py-0.5 rounded border border-gold-400/30">
                Legacy
              </span>
            </div>
            <p className="text-[10px] text-stone-400 tracking-widest uppercase font-serif">
              Model United Nations
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-stone-300 hover:text-gold-300 text-xs uppercase tracking-widest font-medium transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-gold-400 hover:after:w-full after:transition-all after:duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-gold-300 transition-colors px-3 py-1.5 rounded border border-stone-700/50 hover:border-gold-400/40 bg-stone-900/40"
            title="Secretariat Admin Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span className="tracking-wide">Admin Portal</span>
          </Link>

          <a
            href="#register"
            className="btn-gold text-xs px-5 py-2.5 rounded-sm flex items-center gap-2 shadow-md uppercase tracking-wider font-semibold"
          >
            <span>Register Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/admin"
            className="text-stone-400 hover:text-gold-400 p-2"
            title="Admin Portal"
          >
            <ShieldCheck className="w-5 h-5 text-gold-400" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-stone-200 hover:text-gold-400 p-2 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-950/95 border-b border-gold-400/20 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-stone-300 hover:text-gold-300 text-sm uppercase tracking-wider py-2 font-medium border-b border-stone-800/40"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            <a
              href="#register"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-gold text-center py-2.5 rounded text-xs font-bold uppercase tracking-wider block"
            >
              Register as Delegate
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
