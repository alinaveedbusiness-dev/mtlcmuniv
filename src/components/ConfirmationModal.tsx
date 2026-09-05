"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Copy, Check, Download, X, ExternalLink, ShieldCheck } from "lucide-react";
import { DelegateRegistration } from "@/lib/types";

interface ConfirmationModalProps {
  delegate: DelegateRegistration;
  onClose: () => void;
}

export default function ConfirmationModal({ delegate, onClose }: ConfirmationModalProps) {
  const [copied, setCopied] = useState(false);

  const copyTrackingId = () => {
    navigator.clipboard.writeText(delegate.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-2xl border-2 border-gold-400/40 shadow-2xl shadow-black">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-gold-300 p-2 rounded-full hover:bg-emerald-900/40 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Seal & Heading */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 relative rounded-full border-2 border-gold-400 p-1 bg-emerald-950 shadow-gold-subtle flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-gold-400" />
          </div>

          <span className="text-[11px] uppercase tracking-widest text-gold-400 font-serif font-bold">
            MTLC MUN IV Secretariat
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 mt-1">
            Application Registered
          </h3>
          <p className="text-xs text-stone-300 mt-1 font-sans">
            Your official delegate dossier has been dispatched to the Dais Directorate.
          </p>
        </div>

        {/* Unique Tracking ID Box */}
        <div className="bg-emerald-950/90 border border-gold-400/40 rounded-xl p-4 text-center mb-6 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-widest text-gold-400/80 font-serif mb-1">
            Official Tracking Code
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-gold-gradient tracking-wider">
              {delegate.id}
            </span>
            <button
              onClick={copyTrackingId}
              className="p-2 rounded bg-emerald-900/60 border border-gold-400/30 hover:border-gold-400 text-stone-200 hover:text-gold-300 transition-colors"
              title="Copy Tracking ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gold-400" />}
            </button>
          </div>
          {copied && (
            <span className="text-[10px] text-emerald-400 font-medium mt-1 block">
              Copied to clipboard!
            </span>
          )}
        </div>

        {/* Application Details Summary */}
        <div className="space-y-2.5 text-xs bg-emerald-900/20 p-4 rounded-xl border border-stone-800 mb-6">
          <div className="flex justify-between py-1 border-b border-stone-800/60">
            <span className="text-stone-400">Delegate Name:</span>
            <strong className="text-stone-100">{delegate.fullName}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-800/60">
            <span className="text-stone-400">Email Address:</span>
            <span className="text-stone-200">{delegate.email}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-800/60">
            <span className="text-stone-400">Preferred Committee:</span>
            <strong className="text-gold-300">{delegate.committee}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-800/60">
            <span className="text-stone-400">Current Status:</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-500/30">
              Pending Financial Verification
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-stone-400">Payment Receipt:</span>
            <a
              href={delegate.paymentProofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>View Uploaded Proof</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-[11px] text-stone-300 space-y-1 mb-6 text-center">
          <p>
            Please save your <strong>Tracking Code ({delegate.id})</strong>.
          </p>
          <p className="text-stone-400">
            Our finance team will verify your receipt and dispatch your official Committee Allocation &amp; Study Guide to your email address within 24 to 48 hours.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn-gold py-3 rounded text-xs font-bold uppercase tracking-wider"
          >
            Done &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
}
