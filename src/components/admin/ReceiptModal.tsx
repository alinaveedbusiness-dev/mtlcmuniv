"use client";

import React, { useState, useEffect } from "react";
import { X, ExternalLink, Download, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { DelegateRegistration } from "@/lib/types";

interface ReceiptModalProps {
  delegate: DelegateRegistration;
  onClose: () => void;
}

export default function ReceiptModal({ delegate, onClose }: ReceiptModalProps) {
  const proofUrls =
    delegate.paymentProofUrls && delegate.paymentProofUrls.length > 0
      ? delegate.paymentProofUrls
      : [delegate.paymentProofUrl];

  const filenames =
    delegate.paymentProofFilenames && delegate.paymentProofFilenames.length > 0
      ? delegate.paymentProofFilenames
      : [delegate.paymentProofFilename || `receipt_${delegate.id}`];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % proofUrls.length);
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + proofUrls.length) % proofUrls.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, proofUrls.length]);

  const currentUrl = proofUrls[currentIndex] || "";
  const currentFilename = filenames[currentIndex] || `receipt_${currentIndex + 1}`;

  const isPdf =
    currentUrl.toLowerCase().endsWith(".pdf") ||
    currentFilename.toLowerCase().endsWith(".pdf");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#0a1811] border border-[#c5a059]/40 rounded-xl p-5 sm:p-6 flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#c5a059]/20">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg sm:text-xl text-[#f5f5f4] font-normal">
                {delegate.fullName}
              </h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30">
                {delegate.id}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {delegate.committee} • {proofUrls.length} Attached Payment File{proofUrls.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded text-stone-400 hover:text-[#c5a059] border border-[#c5a059]/20 transition-colors"
              title="Open currently displayed receipt in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={currentUrl}
              download={currentFilename}
              className="p-1.5 rounded text-stone-400 hover:text-[#c5a059] border border-[#c5a059]/20 transition-colors"
              title="Download currently displayed receipt"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-100 transition-colors ml-1"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Multi-file switcher tabs if more than 1 file */}
        {proofUrls.length > 1 && (
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 shrink-0 font-medium">
              Files:
            </span>
            {proofUrls.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 shrink-0 border ${
                  idx === currentIndex
                    ? "bg-[#c5a059] text-[#0a1811] font-semibold border-[#c5a059]"
                    : "bg-[#0a1811] text-stone-300 border-[#c5a059]/25 hover:border-[#c5a059]/60"
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Proof #{idx + 1}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content Preview Container */}
        <div className="relative flex-1 overflow-auto bg-black/50 rounded-lg p-2 flex items-center justify-center min-h-[340px] max-h-[560px]">
          {/* Previous / Next Arrow buttons */}
          {proofUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + proofUrls.length) % proofUrls.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-[#c5a059] text-white hover:text-black transition-colors z-10"
                title="Previous file"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % proofUrls.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-[#c5a059] text-white hover:text-black transition-colors z-10"
                title="Next file"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {isPdf ? (
            <iframe
              src={currentUrl}
              className="w-full h-[520px] rounded border border-stone-800"
              title={`Payment Proof: ${currentFilename}`}
            />
          ) : (
            <div className="relative max-w-full max-h-[520px] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUrl}
                alt={`Proof ${currentIndex + 1} for ${delegate.fullName}`}
                className="max-h-[500px] w-auto max-w-full object-contain rounded shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 flex items-center justify-between text-[11px] text-stone-400 border-t border-[#c5a059]/15 mt-2">
          <span className="truncate max-w-xs font-mono text-stone-300">
            {currentFilename}
          </span>
          <span>
            Proof {currentIndex + 1} of {proofUrls.length}
          </span>
        </div>
      </div>
    </div>
  );
}
