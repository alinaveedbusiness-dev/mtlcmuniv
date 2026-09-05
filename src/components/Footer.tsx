import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-emerald-950/95 border-t border-gold-400/20 pt-14 pb-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-stone-800">
          {/* Col 1: Brand & Motto */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full border border-gold-400/40 p-0.5 overflow-hidden bg-emerald-900/60 shadow-gold-subtle">
                <Image
                  src="/images/logo.png"
                  alt="MTLC MUN IV Seal"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-100">MTLC MUN IV</h3>
                <p className="font-serif italic text-xs text-gold-300">Legacy Edition</p>
              </div>
            </div>

            <p className="font-serif tracking-[0.25em] uppercase text-xs font-bold text-gold-400 pt-1">
              DIALOGUE. DIPLOMACY. IMPACT.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-serif text-xs font-bold text-stone-100 uppercase tracking-wider mb-3 border-l-2 border-gold-400 pl-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#committees" className="text-stone-400 hover:text-gold-300 transition-colors">
                  Committees
                </a>
              </li>
              <li>
                <a href="#register" className="text-stone-400 hover:text-gold-300 transition-colors">
                  Register Now
                </a>
              </li>
              <li>
                <Link href="/register/delegation" className="text-stone-400 hover:text-gold-300 transition-colors">
                  Delegation Registration
                </Link>
              </li>
              <li>
                <Link href="/register/private-delegate" className="text-stone-400 hover:text-gold-300 transition-colors">
                  Private Delegate Registration
                </Link>
              </li>
              <li>
                <Link href="/register/observer" className="text-stone-400 hover:text-gold-300 transition-colors">
                  Observer Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Secretariat & Venue */}
          <div>
            <h4 className="font-serif text-xs font-bold text-stone-100 uppercase tracking-wider mb-3 border-l-2 border-gold-400 pl-2">
              Venue &amp; Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/Wop3i4t6TH1oHv4t8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-300 transition-colors underline underline-offset-2"
                >
                  The City School MTLC (View on Google Maps ↗)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="mailto:secretariat@mtlcmun.org" className="hover:text-gold-300">
                  secretariat@mtlcmun.org
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-stone-400 hover:text-gold-300 transition-colors font-medium border border-stone-800 rounded px-2.5 py-1 bg-stone-900/50"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} MTLC MUN IV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
