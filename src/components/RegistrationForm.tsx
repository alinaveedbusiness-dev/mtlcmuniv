"use client";

import React, { useState, useRef } from "react";
import { COMMITTEES } from "@/lib/constants";
import { DelegateRegistration } from "@/lib/types";
import ConfirmationModal from "./ConfirmationModal";
import {
  User,
  Mail,
  Phone,
  School,
  FileCheck,
  Upload,
  AlertCircle,
  Loader2,
  FileText,
  X,
  Sparkles,
} from "lucide-react";

interface RegistrationFormProps {
  initialCommittee?: string;
}

export default function RegistrationForm({ initialCommittee }: RegistrationFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [committee, setCommittee] = useState(initialCommittee || "UNSC");
  const [experience, setExperience] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [countryPreference1, setCountryPreference1] = useState("");
  const [countryPreference2, setCountryPreference2] = useState("");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredDelegate, setRegisteredDelegate] = useState<DelegateRegistration | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize initial committee if changed externally
  React.useEffect(() => {
    if (initialCommittee) {
      setCommittee(initialCommittee);
    }
  }, [initialCommittee]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File exceeds 5MB limit. Please upload a smaller receipt.");
      return;
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Unsupported file format. Please upload JPG, PNG, WEBP, or PDF.");
      return;
    }

    setErrorMessage(null);
    setPaymentFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File exceeds 5MB limit.");
        return;
      }
      setErrorMessage(null);
      setPaymentFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setPaymentFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate basic inputs
    if (!fullName.trim()) {
      setErrorMessage("Please enter your full official name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please provide a valid email address for conference credentials.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Please enter your WhatsApp / phone number.");
      return;
    }
    if (!paymentFile) {
      setErrorMessage("Please upload your payment receipt or transfer screenshot.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("institution", institution || "Independent Delegate");
      formData.append("committee", committee);
      formData.append("experience", experience);
      formData.append("countryPreference1", countryPreference1);
      formData.append("countryPreference2", countryPreference2);
      formData.append("paymentProof", paymentFile);

      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit registration.");
      }

      // Success
      setRegisteredDelegate(data.delegate);

      // Reset Form fields
      setFullName("");
      setEmail("");
      setPhone("");
      setInstitution("");
      setCountryPreference1("");
      setCountryPreference2("");
      setPaymentFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unknown error occurred during registration.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="register" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/20 bg-emerald-900/40 text-gold-300 text-xs uppercase tracking-widest font-semibold mb-3">
            <FileCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>Official Application</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 mb-4">
            Delegate <span className="text-gold-gradient">Registration Dossier</span>
          </h2>
          <div className="gold-divider w-24 mx-auto mb-6" />
          <p className="max-w-xl mx-auto text-stone-300 text-sm font-light">
            Complete the formal registration credentials below. Ensure your payment proof clearly demonstrates the transaction reference.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Registration Alert: </span>
              {errorMessage}
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Registration Form Card */}
        <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-gold-400/30 relative shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Personal & Contact Information */}
            <div>
              <h3 className="font-serif text-lg font-bold text-gold-200 mb-4 pb-2 border-b border-gold-400/15 flex items-center gap-2">
                <User className="w-4 h-4 text-gold-400" />
                <span>Personal &amp; Contact Credentials</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
                    Full Official Name <span className="text-gold-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Maryam Tariq"
                      className="w-full px-4 py-3 rounded-lg bg-emerald-950/80 border border-stone-700/80 focus:border-gold-400 focus:outline-none text-stone-100 placeholder-stone-500 text-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
                    Official Email Address <span className="text-gold-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. delegate@institution.edu"
                      className="w-full px-4 py-3 rounded-lg bg-emerald-950/80 border border-stone-700/80 focus:border-gold-400 focus:outline-none text-stone-100 placeholder-stone-500 text-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
                    WhatsApp / Phone Number <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +92 300 1234567"
                    className="w-full px-4 py-3 rounded-lg bg-emerald-950/80 border border-stone-700/80 focus:border-gold-400 focus:outline-none text-stone-100 placeholder-stone-500 text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
                    Institution / Delegation
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. LUMS / Aitchison / Independent"
                    className="w-full px-4 py-3 rounded-lg bg-emerald-950/80 border border-stone-700/80 focus:border-gold-400 focus:outline-none text-stone-100 placeholder-stone-500 text-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 2. Committee & Portfolio Preferences */}
            <div>
              <h3 className="font-serif text-lg font-bold text-gold-200 mb-4 pb-2 border-b border-gold-400/15 flex items-center gap-2">
                <School className="w-4 h-4 text-gold-400" />
                <span>Council Allocation Preferences</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
                    Primary Committee Preference <span className="text-gold-400">*</span>
                  </label>
                  <select
                    value={committee}
                    onChange={(e) => setCommittee(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-emerald-950/90 border border-stone-700/80 focus:border-gold-400 focus:outline-none text-stone-100 text-sm transition-colors cursor-pointer"
                  >
                    {COMMITTEES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-emerald-950 text-stone-100 py-1">
                        {c.id} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
                    Prior Model UN Experience <span className="text-gold-400">*</span>
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-lg bg-emerald-950/90 border border-stone-700/80 focus:border-gold-400 focus:outline-none text-stone-100 text-sm transition-colors cursor-pointer"
                  >
                    <option value="Beginner" className="bg-emerald-950">Beginner (0 – 1 Conferences)</option>
                    <option value="Intermediate" className="bg-emerald-950">Intermediate (2 – 4 Conferences)</option>
                    <option value="Advanced" className="bg-emerald-950">Advanced / Veteran (5+ Conferences)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
                    Country / Portfolio Choice 1
                  </label>
                  <input
                    type="text"
                    value={countryPreference1}
                    onChange={(e) => setCountryPreference1(e.target.value)}
                    placeholder="e.g. United Kingdom / Minister of Finance"
                    className="w-full px-4 py-3 rounded-lg bg-emerald-950/80 border border-stone-700/80 focus:border-gold-400 focus:outline-none text-stone-100 placeholder-stone-500 text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
                    Country / Portfolio Choice 2
                  </label>
                  <input
                    type="text"
                    value={countryPreference2}
                    onChange={(e) => setCountryPreference2(e.target.value)}
                    placeholder="e.g. France / Foreign Minister"
                    className="w-full px-4 py-3 rounded-lg bg-emerald-950/80 border border-stone-700/80 focus:border-gold-400 focus:outline-none text-stone-100 placeholder-stone-500 text-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Proof Upload */}
            <div>
              <h3 className="font-serif text-lg font-bold text-gold-200 mb-4 pb-2 border-b border-gold-400/15 flex items-center gap-2">
                <Upload className="w-4 h-4 text-gold-400" />
                <span>Upload Payment Proof <span className="text-gold-400">*</span></span>
              </h3>

              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  paymentFile
                    ? "border-gold-400/60 bg-emerald-900/30"
                    : "border-stone-700/80 hover:border-gold-400/50 bg-emerald-950/50 hover:bg-emerald-900/20"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {paymentFile ? (
                  <div className="flex flex-col items-center justify-center gap-3">
                    {filePreview ? (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gold-400/40 shadow-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={filePreview}
                          alt="Receipt Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-emerald-900/80 border border-gold-400/40 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gold-400" />
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-bold text-stone-100 break-all">{paymentFile.name}</p>
                      <p className="text-xs text-stone-400">
                        {(paymentFile.size / 1024).toFixed(1)} KB • Click to change file
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-semibold px-2.5 py-1 rounded bg-red-950/50 border border-red-500/30"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove Document</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-14 h-14 rounded-full bg-emerald-900/40 border border-gold-400/20 flex items-center justify-center mb-1">
                      <Upload className="w-6 h-6 text-gold-400" />
                    </div>
                    <p className="text-stone-200 text-sm font-semibold">
                      Drag &amp; drop payment screenshot, or <span className="text-gold-400 underline">browse device</span>
                    </p>
                    <p className="text-stone-400 text-xs">
                      Supports JPG, PNG, WEBP, and PDF receipts (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="pt-4 border-t border-gold-400/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-stone-400 text-center sm:text-left">
                By submitting, you pledge to adhere to all diplomatic protocols and the MTLC Charter of Conduct.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto btn-gold px-10 py-4 rounded text-xs font-bold uppercase tracking-widest shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Application...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Delegation Dossier</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {registeredDelegate && (
        <ConfirmationModal
          delegate={registeredDelegate}
          onClose={() => setRegisteredDelegate(null)}
        />
      )}
    </section>
  );
}
