"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, X, ArrowLeft } from "lucide-react";
import { DelegateRegistration } from "@/lib/types";

interface ConfirmationModalProps {
  delegate: DelegateRegistration;
  onClose: () => void;
}

export default function ConfirmationModal({ delegate, onClose }: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-2xl border-2 border-gold-400/40 shadow-2xl shadow-black text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-gold-300 p-2 rounded-full hover:bg-emerald-900/40 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Seal & Heading */}
        <div className="mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-full border-2 border-gold-400 p-1 bg-emerald-950 shadow-gold-subtle flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-gold-400" />
          </div>

          <span className="text-[11px] uppercase tracking-widest text-gold-400 font-serif font-bold">
            MTLC MUN IV Secretariat
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 mt-2">
            Your Application Has Been Submitted
          </h3>
          <p className="text-xs text-stone-300 mt-2 font-sans max-w-md mx-auto leading-relaxed">
            Your registration has been successfully received by the MTLC MUN IV Secretariat.
          </p>
        </div>

        {/* Details Summary */}
        <div className="space-y-2 text-xs bg-emerald-900/20 p-4 rounded-xl border border-stone-800 mb-6 text-left">
          <div className="flex justify-between py-1 border-b border-stone-800/60">
            <span className="text-stone-400">Applicant Name:</span>
            <strong className="text-stone-100">{delegate.fullName}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-800/60">
            <span className="text-stone-400">Email Address:</span>
            <span className="text-stone-200">{delegate.email}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-stone-400">Committee / Track:</span>
            <strong className="text-gold-300">{delegate.committee}</strong>
          </div>
        </div>

        <p className="text-xs text-stone-400 max-w-md mx-auto mb-6">
          Thank you for registering. The Secretariat is reviewing your details and will get in touch with you shortly regarding confirmation and next steps.
        </p>

        {/* Action Button */}
        <div>
          <Link
            href="/"
            className="w-full btn-gold py-3 rounded text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
