"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Users,
  User,
  Eye,
  Copy,
  Check,
  Building2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Sparkles,
  Crown,
  ArrowLeft,
} from "lucide-react";
import { ConferenceSettings, CommitteeType, RegistrationType } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/constants";

interface MinimalRegistrationPortalProps {
  settings?: ConferenceSettings;
  lockedTrack?: RegistrationType;
  showBackLink?: boolean;
}

const COMMITTEES: { id: CommitteeType; name: string; tag: string }[] = [
  { id: "UNSC", name: "United Nations Security Council", tag: "Advanced / Crisis" },
  { id: "UNHRC", name: "United Nations Human Rights Council", tag: "Intermediate" },
  { id: "UNW", name: "UN Women (Gender Equality)", tag: "Intermediate" },
  { id: "DISEC", name: "Disarmament & International Security", tag: "Intermediate" },
  { id: "PNA", name: "Pakistan National Assembly", tag: "Intermediate" },
  { id: "CRISIS", name: "Crisis Committee (Joint Crisis Cabinet)", tag: "Advanced / Crisis" },
];

interface DelegateInputState {
  fullName: string;
  phone: string;
  email: string;
  institution: string;
  committee: string;
}

const initialDelegate = (): DelegateInputState => ({
  fullName: "",
  phone: "",
  email: "",
  institution: "",
  committee: "",
});

export default function MinimalRegistrationPortal({
  settings = DEFAULT_SETTINGS,
  lockedTrack,
  showBackLink = false,
}: MinimalRegistrationPortalProps) {
  // Active track
  const [activeTab, setActiveTab] = useState<RegistrationType>(lockedTrack || "delegation");

  // Track 1: Delegation Form (Head Delegate + 3 required + 2 optional)
  const [delegationType, setDelegationType] = useState<"institutional" | "private">("institutional");
  const [delegationInstitution, setDelegationInstitution] = useState("");
  const [delegationMembers, setDelegationMembers] = useState<DelegateInputState[]>([
    initialDelegate(), // Delegate 1 (Head Delegate)
    initialDelegate(), // Delegate 2
    initialDelegate(), // Delegate 3
    initialDelegate(), // Delegate 4
    initialDelegate(), // Delegate 5 (Optional)
    initialDelegate(), // Delegate 6 (Optional)
  ]);

  // Track 2: Private Delegate Form
  const [privateDelegate, setPrivateDelegate] = useState({
    fullName: "",
    phone: "",
    email: "",
    institution: "",
    comingAs: "Delegate" as "Delegate" | "Observer",
    committee: "",
  });

  // Track 3: Observer Registration Form
  const [observerData, setObserverData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  // Multi-file payment proof state (Max 5 files, Max 1 MB each)
  const [paymentFiles, setPaymentFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // Success Confirmation State
  const [registeredResult, setRegisteredResult] = useState<{
    id: string;
    fullName: string;
    registrationType: RegistrationType;
    committee: string;
    delegateCount?: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Delegation Member input change
  const handleDelegationMemberChange = (
    index: number,
    field: keyof DelegateInputState,
    value: string
  ) => {
    setDelegationMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };



  // File Upload Handlers (enforce max 5 files, <= 1MB each)
  const handleAddFiles = (newFiles: FileList | File[]) => {
    const validFiles: File[] = [];
    let localError: string | null = null;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    const MAX_SIZE = 1 * 1024 * 1024; // 1 MB per file

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];

      if (!allowed.includes(file.type)) {
        localError = `File "${file.name}" has an unsupported format. Please upload JPG, PNG, WEBP, or PDF.`;
        continue;
      }

      if (file.size > MAX_SIZE) {
        localError = `File "${file.name}" exceeds the maximum limit of 1 MB (${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)} MB). Please compress or choose a smaller file.`;
        continue;
      }

      // Avoid duplicate names in same batch
      if (paymentFiles.some((f) => f.name === file.name && f.size === file.size)) {
        continue;
      }

      validFiles.push(file);
    }

    if (localError) {
      setErrorMsg(localError);
    } else {
      setErrorMsg(null);
    }

    if (validFiles.length > 0) {
      setPaymentFiles((prev) => {
        const combined = [...prev, ...validFiles];
        if (combined.length > 5) {
          setErrorMsg("Maximum 5 payment proof files allowed. Additional files were skipped.");
          return combined.slice(0, 5);
        }
        return combined;
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setPaymentFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate payment proofs
    if (paymentFiles.length === 0) {
      setErrorMsg("Please attach at least one proof of payment file (Max 1 MB per file, up to 5 files).");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("registrationType", activeTab);

      // Append all payment proof files
      paymentFiles.forEach((file) => {
        data.append("paymentProof", file);
      });

      if (activeTab === "delegation") {
        const isPrivate = delegationType === "private";
        if (!isPrivate && !delegationInstitution.trim()) {
          throw new Error("Institute of delegation is required.");
        }

        const resolvedInstitution = isPrivate
          ? (delegationInstitution.trim() || "Private Delegation")
          : delegationInstitution.trim();

        // Prepare delegates array (Head Delegate + Delegates 2-4 required, 5-6 optional)
        for (let i = 0; i < 4; i++) {
          const d = delegationMembers[i];
          const num = i + 1;
          const roleLabel = i === 0 ? "Head Delegate" : `Delegate ${num}`;
          if (!d.fullName.trim()) throw new Error(`${roleLabel}: Name of delegate is required.`);
          if (!d.phone.trim()) throw new Error(`${roleLabel}: Contact No. is required.`);
          if (!d.email.trim()) throw new Error(`${roleLabel}: Email Address is required.`);
          if (!d.committee) throw new Error(`${roleLabel}: Committee Preference is required.`);
        }

        const validRoster = delegationMembers
          .slice(0, 6)
          .filter((d, idx) => {
            if (idx < 4) return true;
            return Boolean(d.fullName.trim());
          })
          .map((d, idx) => ({
            delegateNumber: idx + 1,
            fullName: d.fullName.trim(),
            phone: d.phone.trim(),
            email: d.email.trim(),
            institution: resolvedInstitution,
            committee: d.committee,
            isOptional: idx >= 4,
          }));

        data.append("delegationCategory", delegationType);
        data.append("institution", resolvedInstitution);
        data.append("delegatesData", JSON.stringify(validRoster));
      } else if (activeTab === "private_delegate") {
        if (!privateDelegate.fullName.trim()) throw new Error("Name of delegate is required.");
        if (!privateDelegate.phone.trim()) throw new Error("Contact no. is required.");
        if (!privateDelegate.email.trim()) throw new Error("Email Address is required.");
        if (!privateDelegate.institution.trim()) throw new Error("Institute of delegate is required.");
        if (privateDelegate.comingAs === "Delegate" && !privateDelegate.committee) {
          throw new Error("Please select your preferred committee.");
        }

        data.append("fullName", privateDelegate.fullName.trim());
        data.append("phone", privateDelegate.phone.trim());
        data.append("email", privateDelegate.email.trim());
        data.append("institution", privateDelegate.institution.trim());
        data.append("comingAs", privateDelegate.comingAs);
        data.append("committee", privateDelegate.committee);
      } else if (activeTab === "observer") {
        if (!observerData.fullName.trim()) throw new Error("Delegate / Observer name is required.");
        if (!observerData.phone.trim()) throw new Error("Contact number is required.");
        if (!observerData.email.trim()) throw new Error("Email address is required.");

        data.append("fullName", observerData.fullName.trim());
        data.append("phone", observerData.phone.trim());
        data.append("email", observerData.email.trim());
      }

      const res = await fetch("/api/register", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Submission failed. Please verify your entries.");
      }

      setRegisteredResult({
        id: result.delegate.id,
        fullName: result.delegate.fullName,
        registrationType: activeTab,
        committee: result.delegate.committee,
        delegateCount: result.delegate.delegates?.length,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setDelegationType("institutional");
    setDelegationInstitution("");
    setDelegationMembers([
      initialDelegate(),
      initialDelegate(),
      initialDelegate(),
      initialDelegate(),
      initialDelegate(),
      initialDelegate(),
    ]);
    setPrivateDelegate({
      fullName: "",
      phone: "",
      email: "",
      institution: "",
      comingAs: "Delegate",
      committee: "",
    });
    setObserverData({
      fullName: "",
      phone: "",
      email: "",
    });
    setPaymentFiles([]);
    setErrorMsg(null);
    setRegisteredResult(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 font-sans">
      {/* Editorial Header */}
      <header className="text-center mb-8 sm:mb-10">
        <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-4 relative drop-shadow-[0_0_30px_rgba(197,160,89,0.35)]">
          <Image
            src="/images/logo.png"
            alt="MTLC MUN Seal"
            width={144}
            height={144}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#f5f5f4] font-medium tracking-wide">
          MTLC MUN IV
        </h1>

        <p className="text-xs uppercase tracking-[0.28em] text-[#c5a059] font-medium mt-1">
          Legacy Edition • Diplomatic Registration
        </p>

        <p className="font-serif text-[11px] sm:text-xs uppercase tracking-[0.3em] text-stone-400 mt-2.5">
          DIALOGUE. DIPLOMACY. IMPACT.
        </p>

        {settings?.eventDates && (
          <div className="mt-4 inline-block border-t border-b border-[#c5a059]/30 py-1 px-5 bg-[#0a1811]/60">
            <p className="text-xs text-stone-200 font-light tracking-widest uppercase">
              {settings.eventDates}
            </p>
          </div>
        )}
      </header>

      {/* Success Confirmation State */}
      {registeredResult ? (
        <div className="border border-[#c5a059]/40 rounded-xl p-6 sm:p-10 bg-[#08150f] text-center space-y-5 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-[#c5a059] stroke-[1.5]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f5f4] font-normal">
            Diplomatic Dossier Submitted
          </h2>

          <p className="text-sm text-stone-300 leading-relaxed max-w-lg mx-auto">
            Your registration has been successfully recorded under reference credentials.
          </p>

          <div className="border border-[#c5a059]/30 bg-[#0a1811] rounded-lg py-3 px-6 inline-block my-2 shadow-inner">
            <span className="text-[10px] uppercase tracking-widest text-[#c5a059] block font-medium">
              Official Tracking Code
            </span>
            <span className="font-mono text-xl sm:text-2xl text-[#f5f5f4] font-bold tracking-wider">
              {registeredResult.id}
            </span>
          </div>

          <div className="text-xs text-stone-400 max-w-md mx-auto space-y-1">
            <p>
              <span className="text-stone-300 font-medium">Registration Track:</span>{" "}
              <span className="capitalize text-[#c5a059]">
                {registeredResult.registrationType.replace("_", " ")}
              </span>
            </p>
            {registeredResult.delegateCount && (
              <p>
                <span className="text-stone-300 font-medium">Roster Capacity:</span>{" "}
                <span className="text-[#c5a059]">{registeredResult.delegateCount} Delegates</span>
              </p>
            )}
            <p className="text-[11px] text-stone-500 pt-2">
              The MTLC MUN Secretariat will verify the attached payment proofs against bank records and issue formal allocation letters.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="btn-gold px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Submit Another Registration</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Back Link if Standalone Page */}
          {showBackLink && (
            <div className="flex items-center justify-between pb-3 border-b border-[#c5a059]/20">
              <Link
                href="/#register"
                className="inline-flex items-center gap-1.5 text-xs text-[#c5a059] hover:text-[#d4af37] transition-colors group font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Home &amp; All Forms</span>
              </Link>
              <div className="text-[11px] uppercase tracking-widest text-[#d4af37] font-serif font-semibold">
                MTLC MUN IV
              </div>
            </div>
          )}

          {/* Track Selection Navigation Tabs or Locked Header */}
          {!lockedTrack ? (
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#08150f] border border-[#c5a059]/30">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("delegation");
                  setErrorMsg(null);
                }}
                className={`py-2.5 px-2 rounded-lg text-xs font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  activeTab === "delegation"
                    ? "bg-[#c5a059] text-[#0a1811] font-bold shadow-md"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span className="truncate">Delegation</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("private_delegate");
                  setErrorMsg(null);
                }}
                className={`py-2.5 px-2 rounded-lg text-xs font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  activeTab === "private_delegate"
                    ? "bg-[#c5a059] text-[#0a1811] font-bold shadow-md"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="truncate">Private Delegate</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("observer");
                  setErrorMsg(null);
                }}
                className={`py-2.5 px-2 rounded-lg text-xs font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  activeTab === "observer"
                    ? "bg-[#c5a059] text-[#0a1811] font-bold shadow-md"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <Eye className="w-4 h-4 shrink-0" />
                <span className="truncate">Observer</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-[#08150f] border border-[#c5a059]/35 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center text-[#d4af37]">
                  {lockedTrack === "delegation" ? (
                    <Users className="w-4 h-4" />
                  ) : lockedTrack === "private_delegate" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-serif font-bold text-stone-100">
                    {lockedTrack === "delegation"
                      ? "Delegation Registration"
                      : lockedTrack === "private_delegate"
                      ? "Private Delegate Registration"
                      : "Observer Registration"}
                  </h2>
                  <p className="text-[11px] text-stone-400">
                    {lockedTrack === "delegation"
                      ? "Head Delegate + 3 Required & 2 Optional Members"
                      : lockedTrack === "private_delegate"
                      ? "Individual Delegate / Observer Track"
                      : "Diplomatic Pass & Assembly Observer Access"}
                  </p>
                </div>
              </div>
              <Link
                href="/#register"
                className="hidden sm:inline-flex text-[11px] text-[#c5a059] hover:text-[#d4af37] underline underline-offset-4"
              >
                Switch Form
              </Link>
            </div>
          )}

          {/* Registration Form Wrapper */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-lg border border-red-900/50 bg-red-950/30 text-red-300 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TRACK 1: DELEGATION REGISTRATION FORM */}
            {/* ========================================================================= */}
            {activeTab === "delegation" && (
              <div className="space-y-6">
                <div className="border-b border-[#c5a059]/20 pb-3">
                  <h2 className="font-serif text-lg sm:text-xl text-[#f5f5f4] font-normal">
                    Delegation Registration
                  </h2>
                  <p className="text-xs text-stone-400">
                    4 Delegates required • Up to 2 optional delegates (6 Max)
                  </p>
                </div>

                {/* Delegation Category Selector (Institutional vs Private) */}
                <div className="rounded-xl border border-[#c5a059]/30 bg-[#08150f] p-4 sm:p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block uppercase tracking-wider text-[#d4af37] font-semibold text-xs">
                      Delegation Category
                    </label>
                    <span className="text-[11px] text-stone-400">
                      Choose institutional or independent delegation
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDelegationType("institutional")}
                      className={`flex items-center justify-center gap-2.5 p-3 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                        delegationType === "institutional"
                          ? "bg-[#c5a059]/20 border-[#d4af37] text-[#d4af37] shadow-sm ring-1 ring-[#d4af37]/30 font-semibold"
                          : "bg-[#0a1811] border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700"
                      }`}
                    >
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span>Institutional Delegation</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDelegationType("private")}
                      className={`flex items-center justify-center gap-2.5 p-3 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                        delegationType === "private"
                          ? "bg-[#c5a059]/20 border-[#d4af37] text-[#d4af37] shadow-sm ring-1 ring-[#d4af37]/30 font-semibold"
                          : "bg-[#0a1811] border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700"
                      }`}
                    >
                      <Users className="w-4 h-4 shrink-0" />
                      <span>Private Delegation</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    {delegationType === "institutional"
                      ? "Official representation from a school, college, or university."
                      : "Independent delegation of delegates participating together without institutional representation."}
                  </p>
                </div>

                {/* Institute of Delegation (Asked ONLY if Institutional Delegation is selected) */}
                {delegationType === "institutional" && (
                  <div className="rounded-xl border border-[#d4af37]/50 bg-[#08150f] p-4 sm:p-5 shadow-md shadow-[#d4af37]/5 animate-fade-in">
                    <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#c5a059]/15">
                      <Building2 className="w-4 h-4 text-[#d4af37]" />
                      <span className="font-serif text-sm sm:text-base text-[#d4af37] font-semibold tracking-wide">
                        Delegation Institute
                      </span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 font-semibold">
                        Required
                      </span>
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1.5 text-[11px]">
                        Institute of delegation *
                      </label>
                      <input
                        type="text"
                        required={delegationType === "institutional"}
                        value={delegationInstitution}
                        onChange={(e) => setDelegationInstitution(e.target.value)}
                        placeholder="School / College / University name (e.g. Lahore Grammar School, The City School)"
                        className="w-full bg-[#0a1811] border border-[#c5a059]/30 rounded px-3.5 py-2.5 text-stone-100 placeholder-stone-600 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      />
                      <p className="text-[11px] text-stone-400 mt-1.5">
                        This educational institution applies to the Head Delegate and all delegates in this delegation.
                      </p>
                    </div>
                  </div>
                )}

                {/* Delegate Cards (1 to 6) */}
                <div className="space-y-5">
                  {delegationMembers.map((member, index) => {
                    const isHeadDelegate = index === 0;
                    const delegateNum = index + 1;
                    const isOptional = index >= 4;

                    return (
                      <div
                        key={delegateNum}
                        className={`rounded-xl border p-4 sm:p-5 transition-colors ${
                          isHeadDelegate
                            ? "bg-[#08150f] border-[#d4af37]/60 shadow-md shadow-[#d4af37]/5"
                            : isOptional
                            ? "bg-[#08150f]/80 border-[#c5a059]/20"
                            : "bg-[#08150f] border-[#c5a059]/40 shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#c5a059]/15">
                          <div className="flex items-center gap-2">
                            {isHeadDelegate && <Crown className="w-4 h-4 text-[#d4af37]" />}
                            <span className={`font-serif text-sm sm:text-base tracking-wide ${isHeadDelegate ? "text-[#d4af37] font-semibold" : "text-[#f5f5f4] font-medium"}`}>
                              {isHeadDelegate ? "Head Delegate" : `Delegate ${delegateNum}`}
                            </span>
                            {isHeadDelegate ? (
                              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 font-semibold">
                                Required • Lead
                              </span>
                            ) : isOptional ? (
                              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
                                Optional
                              </span>
                            ) : (
                              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30">
                                Required
                              </span>
                            )}
                          </div>
                          {isHeadDelegate && (
                            <span className="hidden sm:inline-block text-[11px] text-stone-400 italic">
                              Lead Delegation Representative
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          {/* Name of delegate */}
                          <div>
                            <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1.5 text-[11px]">
                              Name of {isHeadDelegate ? "head delegate" : "delegate"} {isOptional ? "" : "*"}
                            </label>
                            <input
                              type="text"
                              required={!isOptional}
                              value={member.fullName}
                              onChange={(e) =>
                                handleDelegationMemberChange(index, "fullName", e.target.value)
                              }
                              placeholder={isHeadDelegate ? "Full official name (Head Delegate)" : isOptional ? "Optional delegate name" : "Full official name"}
                              className="w-full bg-[#0a1811] border border-[#c5a059]/25 rounded px-3.5 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-[#d4af37] transition-colors"
                            />
                          </div>

                          {/* Contact No. */}
                          <div>
                            <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1.5 text-[11px]">
                              Contact No. {isOptional ? "" : "*"}
                            </label>
                            <input
                              type="tel"
                              required={!isOptional && Boolean(member.fullName.trim())}
                              value={member.phone}
                              onChange={(e) =>
                                handleDelegationMemberChange(index, "phone", e.target.value)
                              }
                              placeholder="e.g. +92 300 1234567"
                              className="w-full bg-[#0a1811] border border-[#c5a059]/25 rounded px-3.5 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-[#c5a059] transition-colors font-mono"
                            />
                          </div>

                          {/* Email Address */}
                          <div>
                            <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1.5 text-[11px]">
                              Email Address {isOptional ? "" : "*"}
                            </label>
                            <input
                              type="email"
                              required={!isOptional && Boolean(member.fullName.trim())}
                              value={member.email}
                              onChange={(e) =>
                                handleDelegationMemberChange(index, "email", e.target.value)
                              }
                              placeholder="delegate@institution.edu"
                              className="w-full bg-[#0a1811] border border-[#c5a059]/25 rounded px-3.5 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-[#c5a059] transition-colors"
                            />
                          </div>

                          {/* Committee Preference */}
                          <div>
                            <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1.5 text-[11px]">
                              Committee Preference {isOptional ? "" : "*"}
                            </label>
                            <select
                              required={!isOptional && Boolean(member.fullName.trim())}
                              value={member.committee}
                              onChange={(e) =>
                                handleDelegationMemberChange(index, "committee", e.target.value)
                              }
                              className="w-full bg-[#0a1811] border border-[#c5a059]/25 rounded px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-[#c5a059] transition-colors cursor-pointer"
                            >
                              <option value="" disabled className="bg-[#0a1811] text-stone-500">
                                Select committee preference...
                              </option>
                              {COMMITTEES.map((comm) => (
                                <option
                                  key={comm.id}
                                  value={comm.id}
                                  className="bg-[#0a1811] text-stone-200"
                                >
                                  {comm.id} — {comm.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TRACK 2: PRIVATE DELEGATE REGISTRATION FORM */}
            {/* ========================================================================= */}
            {activeTab === "private_delegate" && (
              <div className="rounded-xl border border-[#c5a059]/40 bg-[#08150f] p-5 sm:p-6 space-y-5 shadow-sm">
                <div className="border-b border-[#c5a059]/20 pb-3">
                  <h2 className="font-serif text-lg sm:text-xl text-[#f5f5f4] font-normal">
                    Private Delegate Registration Form
                  </h2>
                  <p className="text-xs text-stone-400">
                    Individual delegate credentials and preferred committee assignment
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Name of delegate * */}
                  <div>
                    <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1.5 text-[11px]">
                      Name of delegate *
                    </label>
                    <input
                      type="text"
                      required
                      value={privateDelegate.fullName}
                      onChange={(e) =>
                        setPrivateDelegate((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      placeholder="e.g. Eleanor Vance"
                      className="w-full bg-[#0a1811] border border-[#c5a059]/25 rounded px-3.5 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-[#c5a059] transition-colors"
                    />
                  </div>

                  {/* Contact no. * */}
                  <div>
                    <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1.5 text-[11px]">
                      Contact no. *
                    </label>
                    <input
                      type="tel"
                      required
                      value={privateDelegate.phone}
                      onChange={(e) =>
                        setPrivateDelegate((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="e.g. +92 300 1234567"
                      className="w-full bg-[#0a1811] border border-[#c5a059]/25 rounded px-3.5 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-[#c5a059] transition-colors font-mono"
                    />
                  </div>

                  {/* Email Address * */}
                  <div>
                    <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1.5 text-[11px]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={privateDelegate.email}
                      onChange={(e) =>
                        setPrivateDelegate((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="delegate@institution.edu"
                      className="w-full bg-[#0a1811] border border-[#c5a059]/25 rounded px-3.5 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-[#c5a059] transition-colors"
                    />
                  </div>

                  {/* Institute of delegate * */}
                  <div>
                    <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1.5 text-[11px]">
                      Institute of delegate *
                    </label>
                    <input
                      type="text"
                      required
                      value={privateDelegate.institution}
                      onChange={(e) =>
                        setPrivateDelegate((prev) => ({ ...prev, institution: e.target.value }))
                      }
                      placeholder="e.g. Aitchison College / LUMS / Independent"
                      className="w-full bg-[#0a1811] border border-[#c5a059]/25 rounded px-3.5 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-[#c5a059] transition-colors"
                    />
                  </div>

                  {/* Coming as * (Delegate / Observer) */}
                  <div>
                    <label className="block uppercase tracking-wider text-stone-400 font-medium mb-2 text-[11px]">
                      Coming as *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={`border rounded-lg p-3 flex items-center gap-2.5 cursor-pointer transition-all ${
                          privateDelegate.comingAs === "Delegate"
                            ? "bg-[#c5a059]/15 border-[#c5a059] text-[#f5f5f4]"
                            : "bg-[#0a1811] border-stone-800 text-stone-400 hover:border-stone-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="comingAs"
                          value="Delegate"
                          checked={privateDelegate.comingAs === "Delegate"}
                          onChange={() =>
                            setPrivateDelegate((prev) => ({ ...prev, comingAs: "Delegate" }))
                          }
                          className="accent-[#c5a059]"
                        />
                        <span className="font-medium text-xs">Delegate</span>
                      </label>

                      <label
                        className={`border rounded-lg p-3 flex items-center gap-2.5 cursor-pointer transition-all ${
                          privateDelegate.comingAs === "Observer"
                            ? "bg-[#c5a059]/15 border-[#c5a059] text-[#f5f5f4]"
                            : "bg-[#0a1811] border-stone-800 text-stone-400 hover:border-stone-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="comingAs"
                          value="Observer"
                          checked={privateDelegate.comingAs === "Observer"}
                          onChange={() =>
                            setPrivateDelegate((prev) => ({ ...prev, comingAs: "Observer" }))
                          }
                          className="accent-[#c5a059]"
                        />
                        <span className="font-medium text-xs">Observer</span>
                      </label>
                    </div>
                  </div>

                  {/* Committees * (UNSC, UNHRC, UNW, DISEC, PNA, CRISIS) */}
                  {privateDelegate.comingAs === "Delegate" && (
                    <div>
                      <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1.5 text-[11px]">
                        Committees *
                      </label>
                      <select
                        required
                        value={privateDelegate.committee}
                        onChange={(e) =>
                          setPrivateDelegate((prev) => ({ ...prev, committee: e.target.value }))
                        }
                        className="w-full bg-[#0a1811] border border-[#c5a059]/25 rounded px-3.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-[#c5a059] transition-colors cursor-pointer"
                      >
                        <option value="" disabled className="bg-[#0a1811] text-stone-500">
                          Select preferred committee...
                        </option>
                        {COMMITTEES.map((comm) => (
                          <option
                            key={comm.id}
                            value={comm.id}
                            className="bg-[#0a1811] text-stone-200"
                          >
                            {comm.id} — {comm.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TRACK 3: OBSERVER REGISTRATION FORM */}
            {/* ========================================================================= */}
            {activeTab === "observer" && (
              <div className="rounded-xl border border-[#c5a059]/40 bg-[#08150f] p-5 sm:p-6 space-y-5 shadow-sm">
                <div className="border-b border-[#c5a059]/20 pb-3">
                  <h2 className="font-serif text-lg sm:text-xl text-[#f5f5f4] font-normal">
                    Observer Registration Form
                  </h2>
                  <p className="text-xs text-stone-400">
                    Official observer pass and conference access credentials
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* delegate name* */}
                  <div>
                    <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1.5 text-[11px]">
                      Delegate / Observer name *
                    </label>
                    <input
                      type="text"
                      required
                      value={observerData.fullName}
                      onChange={(e) =>
                        setObserverData((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      placeholder="e.g. Julian Montgomery"
                      className="w-full bg-[#0a1811] border border-[#c5a059]/25 rounded px-3.5 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-[#c5a059] transition-colors"
                    />
                  </div>

                  {/* contact number* */}
                  <div>
                    <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1.5 text-[11px]">
                      Contact number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={observerData.phone}
                      onChange={(e) =>
                        setObserverData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="e.g. +92 300 9876543"
                      className="w-full bg-[#0a1811] border border-[#c5a059]/25 rounded px-3.5 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-[#c5a059] transition-colors font-mono"
                    />
                  </div>

                  {/* email address* */}
                  <div>
                    <label className="block uppercase tracking-wider text-stone-400 font-medium mb-1.5 text-[11px]">
                      Email address *
                    </label>
                    <input
                      type="email"
                      required
                      value={observerData.email}
                      onChange={(e) =>
                        setObserverData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="observer@institution.edu"
                      className="w-full bg-[#0a1811] border border-[#c5a059]/25 rounded px-3.5 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-[#c5a059] transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PAYMENT DETAILS SECTION & PROOF UPLOAD (SHARED ACROSS TRACKS) */}
            {/* ========================================================================= */}
            <div className="rounded-xl border border-[#c5a059]/40 bg-[#08150f] p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-3">
                <div>
                  <h3 className="font-serif text-base sm:text-lg text-[#f5f5f4] font-normal flex items-center gap-2">
                    <span>Payment Details</span>
                    <span className="text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 rounded bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30">
                      Required
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Attach proof of payment • Upload up to 5 supported files • Max 1 MB per file
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPaymentDetails((prev) => !prev)}
                  className="text-xs text-[#c5a059] hover:underline flex items-center gap-1 font-medium"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{showPaymentDetails ? "Hide Accounts" : "View Accounts"}</span>
                  {showPaymentDetails ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Collapsible Official Banking Details Drawer */}
              {showPaymentDetails && (
                <div className="rounded-lg border border-[#c5a059]/25 bg-[#0a1811] p-4 text-xs space-y-3 animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between gap-3 pb-2 border-b border-[#c5a059]/15">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
                        Bank Transfer (Meezan Bank)
                      </span>
                      <p className="text-stone-200 font-medium">
                        {settings.bankDetails.bankName}
                      </p>
                      <p className="text-stone-400 text-[11px]">
                        Title: {settings.bankDetails.accountTitle}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 sm:items-end">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-stone-200 text-xs">
                          {settings.bankDetails.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(settings.bankDetails.accountNumber, "accNum")
                          }
                          className="text-stone-400 hover:text-[#c5a059]"
                          title="Copy account number"
                        >
                          {copiedField === "accNum" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-stone-400 text-[10px]">
                          IBAN: {settings.bankDetails.iban}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(settings.bankDetails.iban, "iban")}
                          className="text-stone-400 hover:text-[#c5a059]"
                          title="Copy IBAN"
                        >
                          {copiedField === "iban" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
                        Mobile Banking (EasyPaisa)
                      </span>
                      <p className="text-stone-200 text-xs">
                        {settings.bankDetails.easypaisaTitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-stone-200 text-xs">
                        {settings.bankDetails.easypaisaNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(settings.bankDetails.easypaisaNumber, "epNum")
                        }
                        className="text-stone-400 hover:text-[#c5a059]"
                        title="Copy EasyPaisa Number"
                      >
                        {copiedField === "epNum" ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Drop Zone */}
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleAddFiles(e.target.files);
                    }
                  }}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-[#c5a059] bg-[#c5a059]/10"
                      : "border-[#c5a059]/30 hover:border-[#c5a059]/70 bg-[#0a1811]/60"
                  }`}
                >
                  <Upload className="w-6 h-6 text-[#c5a059] mx-auto mb-2 stroke-[1.5]" />
                  <p className="text-xs text-stone-200 font-medium">
                    Click to attach proof of payment or drag &amp; drop files
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Upload up to 5 supported files • Max 1 MB per file (JPG, PNG, WEBP, or PDF)
                  </p>
                </div>

                {/* List of attached files */}
                {paymentFiles.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs text-stone-400 px-1">
                      <span>Attached Receipts ({paymentFiles.length}/5):</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentFiles([]);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="text-[11px] text-stone-500 hover:text-red-400 transition-colors"
                      >
                        Remove all
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {paymentFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="border border-[#c5a059]/30 rounded-lg p-2.5 bg-[#0a1811] flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <FileText className="w-4 h-4 text-[#c5a059] shrink-0" />
                            <div className="truncate">
                              <p className="text-xs text-stone-200 truncate font-mono">
                                {file.name}
                              </p>
                              <p className="text-[10px] text-stone-400 font-mono">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="p-1 text-stone-500 hover:text-red-400 transition-colors"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#c5a059] hover:bg-[#d4af37] text-[#0a1811] font-bold text-xs uppercase tracking-widest py-3.5 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-gold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0a1811] border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Registration Dossier...</span>
                  </>
                ) : (
                  <span>
                    Submit{" "}
                    {activeTab === "delegation"
                      ? "Delegation Registration"
                      : activeTab === "private_delegate"
                      ? "Private Delegate Registration"
                      : "Observer Registration"}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
