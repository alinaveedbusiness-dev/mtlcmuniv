"use client";

import React, { useState } from "react";
import { Copy, Check, Landmark, Smartphone, AlertCircle, ShieldCheck } from "lucide-react";
import { ConferenceSettings } from "@/lib/types";

interface PaymentGuidelinesProps {
  settings: ConferenceSettings;
}

export default function PaymentGuidelines({ settings }: PaymentGuidelinesProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const steps = [
    {
      num: "01",
      title: "Fill Information",
      desc: "Provide your official personal, academic, and preferred committee choices in the registration form below.",
    },
    {
      num: "02",
      title: "Remit Delegate Fee",
      desc: `Transfer the official registration fee (${settings.registrationFee}) to our verified society bank or mobile wallet account.`,
    },
    {
      num: "03",
      title: "Upload Payment Proof",
      desc: "Capture a crisp screenshot or export PDF receipt displaying the transaction ID, sender name, and timestamp.",
    },
    {
      num: "04",
      title: "Receive Tracking ID",
      desc: "Obtain your unique Delegation Code (e.g. MTLC-2026-XXXX) for instant status tracking and dais allocation.",
    },
  ];

  return (
    <section id="guidelines" className="py-20 px-4 sm:px-6 lg:px-8 relative bg-emerald-950/70 border-t border-gold-400/10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/20 bg-emerald-900/40 text-gold-300 text-xs uppercase tracking-widest font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>Registration Protocol</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 mb-4">
            Payment & <span className="text-gold-gradient">Allocation Guidelines</span>
          </h2>
          <div className="gold-divider w-24 mx-auto mb-6" />
          <p className="max-w-2xl mx-auto text-stone-300 text-sm font-light">
            All applications are processed on a rolling, merit-assisted dais allocation system. Please review our payment instructions carefully.
          </p>
        </div>

        {/* 4 Step Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step) => (
            <div
              key={step.num}
              className="glass-panel p-6 rounded-xl border border-gold-400/20 relative flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-3xl font-bold text-gold-400/60 mb-3 block">
                  {step.num}
                </span>
                <h4 className="font-serif text-lg font-bold text-stone-100 mb-2">
                  {step.title}
                </h4>
                <p className="text-stone-300 text-xs leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bank & Mobile Transfer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Direct Bank Transfer */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gold-400/25 relative">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gold-400/15">
              <div className="w-10 h-10 rounded-lg bg-emerald-900/60 border border-gold-400/30 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  Official Bank Transfer
                </h3>
                <p className="text-xs text-stone-400">Standard Interbank Funds Transfer (IBFT / Raast)</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/70 border border-stone-800">
                <span className="text-stone-400 font-medium">Bank Name</span>
                <span className="font-bold text-stone-100 text-right">{settings.bankDetails.bankName}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/70 border border-stone-800">
                <span className="text-stone-400 font-medium">Account Title</span>
                <span className="font-bold text-stone-100 text-right">{settings.bankDetails.accountTitle}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/70 border border-stone-800">
                <div>
                  <div className="text-stone-400 font-medium">Account Number</div>
                  <div className="font-mono font-bold text-gold-200 mt-0.5">{settings.bankDetails.accountNumber}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(settings.bankDetails.accountNumber, "accNum")}
                  className="btn-outline-gold px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-semibold"
                >
                  {copiedKey === "accNum" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gold-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/70 border border-stone-800">
                <div>
                  <div className="text-stone-400 font-medium">IBAN Number</div>
                  <div className="font-mono text-xs font-bold text-gold-200 mt-0.5 break-all">{settings.bankDetails.iban}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(settings.bankDetails.iban, "iban")}
                  className="btn-outline-gold px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-semibold shrink-0 ml-2"
                >
                  {copiedKey === "iban" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gold-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Wallets & Instructions */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gold-400/25 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gold-400/15">
                <div className="w-10 h-10 rounded-lg bg-emerald-900/60 border border-gold-400/30 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-100">
                    Mobile Wallets (Easypaisa / JazzCash)
                  </h3>
                  <p className="text-xs text-stone-400">Instant transfer via mobile wallet apps</p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/70 border border-stone-800">
                  <span className="text-stone-400 font-medium">Account Title</span>
                  <span className="font-bold text-stone-100 text-right">{settings.bankDetails.easypaisaTitle}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/70 border border-stone-800">
                  <div>
                    <div className="text-stone-400 font-medium">Mobile Wallet Number</div>
                    <div className="font-mono font-bold text-gold-200 mt-0.5">{settings.bankDetails.easypaisaNumber}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(settings.bankDetails.easypaisaNumber, "mobileWallet")}
                    className="btn-outline-gold px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-semibold"
                  >
                    {copiedKey === "mobileWallet" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gold-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Notice Box */}
              <div className="mt-6 p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-stone-300 text-xs leading-relaxed">
                  <strong>Important:</strong> Please ensure your payment receipt clearly reveals the transaction Reference / ID. Uploading fraudulent or unreadable proofs will lead to automatic rejection by the Secretariat.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gold-400/15 flex items-center justify-between text-xs text-stone-400">
              <span>Standard Delegate Fee</span>
              <span className="font-serif font-bold text-gold-300 text-base">{settings.registrationFee}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
