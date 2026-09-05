"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LogOut,
  RefreshCw,
  Search,
  ExternalLink,
  Check,
  Loader2,
  Trash2,
  Users,
  Download,
  X,
  FileText,
  Building,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Save,
  RotateCcw,
  User,
} from "lucide-react";
import { ConferenceSettings, DelegateRegistration } from "@/lib/types";
import { COMMITTEES } from "@/lib/constants";
import ReceiptModal from "./ReceiptModal";

interface AdminDashboardClientProps {
  initialSettings: ConferenceSettings;
  initialDelegates: DelegateRegistration[];
}

export default function AdminDashboardClient({
  initialSettings,
  initialDelegates,
}: AdminDashboardClientProps) {
  const router = useRouter();

  // Conference Dates state
  const [eventDates, setEventDates] = useState(initialSettings.eventDates || "");
  const [isSavingDate, setIsSavingDate] = useState(false);
  const [dateFeedback, setDateFeedback] = useState<string | null>(null);

  // Committee Agendas state
  const [agendas, setAgendas] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    COMMITTEES.forEach((comm) => {
      init[comm.id] = initialSettings.committeeAgendas?.[comm.id] || comm.topic;
    });
    return init;
  });
  const [isSavingAgendas, setIsSavingAgendas] = useState(false);
  const [agendasFeedback, setAgendasFeedback] = useState<string | null>(null);
  const [isAgendasExpanded, setIsAgendasExpanded] = useState(true);

  // Delegates state
  const [delegates, setDelegates] = useState<DelegateRegistration[]>(initialDelegates);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "delegation" | "private_delegate" | "observer">("ALL");
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [selectedReceiptDelegate, setSelectedReceiptDelegate] =
    useState<DelegateRegistration | null>(null);
  const [selectedRosterDelegate, setSelectedRosterDelegate] =
    useState<DelegateRegistration | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Total delegate metrics
  const totalDelegatesCount = delegates.reduce((sum, d) => {
    if (d.registrationType === "delegation" || Boolean(d.delegates && d.delegates.length > 0)) {
      return sum + (d.delegates && d.delegates.length > 0 ? d.delegates.length : 4);
    }
    return sum + 1;
  }, 0);

  const delegationDossiersCount = delegates.filter(
    (d) => d.registrationType === "delegation" || Boolean(d.delegates && d.delegates.length > 0)
  ).length;

  const privateDossiersCount = delegates.filter(
    (d) =>
      d.registrationType === "private_delegate" ||
      (!d.registrationType && d.comingAs !== "Observer" && (!d.delegates || d.delegates.length === 0))
  ).length;

  const observerDossiersCount = delegates.filter(
    (d) => d.registrationType === "observer" || d.comingAs === "Observer"
  ).length;

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  // Handle Manual Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/delegates");
      if (res.ok) {
        const data = await res.json();
        setDelegates(data.delegates || []);
      }
    } catch {
      router.refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Save Dynamic Conference Dates
  const handleSaveDates = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDate(true);
    setDateFeedback(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventDates: eventDates.trim() }),
      });

      if (!res.ok) throw new Error("Failed to save dates");

      setDateFeedback("Conference dates updated.");
      setTimeout(() => setDateFeedback(null), 3000);
    } catch {
      setDateFeedback("Failed to update conference dates.");
    } finally {
      setIsSavingDate(false);
    }
  };

  // Committee Agendas Handlers
  const handleAgendaChange = (id: string, val: string) => {
    setAgendas((prev) => ({ ...prev, [id]: val }));
  };

  const handleResetAgenda = (id: string) => {
    const defaultTopic = COMMITTEES.find((c) => c.id === id)?.topic || "";
    setAgendas((prev) => ({ ...prev, [id]: defaultTopic }));
  };

  const handleSaveAgendas = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAgendas(true);
    setAgendasFeedback(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ committeeAgendas: agendas }),
      });

      if (!res.ok) throw new Error("Failed to save agendas");

      setAgendasFeedback("Committee agendas updated. Changes are live on the public site.");
      setTimeout(() => setAgendasFeedback(null), 3500);
    } catch {
      setAgendasFeedback("Failed to update committee agendas.");
    } finally {
      setIsSavingAgendas(false);
    }
  };

  // Update Delegate Verification Status
  const handleStatusChange = async (id: string, newStatus: "Pending" | "Approved") => {
    setStatusUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/delegates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();
      setDelegates((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: data.delegate.status } : d))
      );
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Delete Delegate
  const handleDeleteDelegate = async (id: string, name: string) => {
    if (!confirm(`Delete registration dossier for ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/delegates/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDelegates((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Filter delegates
  const filteredDelegates = delegates.filter((d) => {
    if (typeFilter !== "ALL") {
      if (typeFilter === "delegation" && d.registrationType !== "delegation") return false;
      if (typeFilter === "observer" && d.registrationType !== "observer" && d.comingAs !== "Observer") return false;
      if (
        typeFilter === "private_delegate" &&
        (d.registrationType === "delegation" || d.registrationType === "observer" || d.comingAs === "Observer")
      ) {
        return false;
      }
    }

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const matchBase =
      d.fullName.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      d.phone.toLowerCase().includes(q) ||
      d.committee.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      (d.institution || "").toLowerCase().includes(q);

    const matchRoster = (d.delegates || []).some(
      (sub) =>
        sub.fullName.toLowerCase().includes(q) ||
        sub.email.toLowerCase().includes(q) ||
        sub.phone.toLowerCase().includes(q) ||
        sub.institution.toLowerCase().includes(q) ||
        sub.committee.toLowerCase().includes(q)
    );

    return matchBase || matchRoster;
  });

  return (
    <div className="min-h-screen bg-[#0a1811] text-stone-200 flex flex-col font-sans">
      {/* Minimal Header */}
      <header className="border-b border-[#c5a059]/20 px-6 py-4 bg-[#07120d]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 relative">
              <Image
                src="/images/logo.png"
                alt="MTLC MUN"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-serif text-base text-[#f5f5f4] font-normal tracking-wide">
                MTLC MUN IV
              </h1>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5a059] block">
                Secretariat Admin Conclave • {totalDelegatesCount} Total Delegates
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/admin/export"
              className="flex items-center gap-1.5 text-xs text-[#c5a059] hover:text-[#d4af37] transition-colors py-1.5 px-3 rounded border border-[#c5a059]/30 hover:border-[#c5a059]"
              title="Download full CSV roster"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </a>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-stone-400 hover:text-[#c5a059] p-1.5 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#c5a059]" : ""}`} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-400 transition-colors py-1 px-2.5 rounded border border-stone-800 hover:border-red-900/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Control Panel */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Date Editor */}
        <section className="border border-[#c5a059]/30 rounded-lg p-5 bg-[#08150f] shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">
                Conference Dates
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Update the public conference dates displayed on the landing portal.
              </p>
            </div>

            <form onSubmit={handleSaveDates} className="flex items-center gap-2">
              <input
                type="text"
                value={eventDates}
                onChange={(e) => setEventDates(e.target.value)}
                placeholder="e.g. October 3 - 4 - 5, 2026"
                className="w-64 bg-[#0a1811] border border-[#c5a059]/30 rounded px-3 py-1.5 text-stone-100 text-xs focus:outline-none focus:border-[#c5a059]"
              />
              <button
                type="submit"
                disabled={isSavingDate}
                className="bg-[#c5a059] hover:bg-[#d4af37] text-[#0a1811] text-xs font-semibold uppercase tracking-wider py-1.5 px-4 rounded transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {isSavingDate ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Save</span>
                )}
              </button>
            </form>
          </div>

          {dateFeedback && (
            <p className="text-xs text-[#c5a059] mt-2.5 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{dateFeedback}</span>
            </p>
          )}
        </section>

        {/* Committee Agendas Editor Section */}
        <section className="border border-[#c5a059]/30 rounded-lg p-5 bg-[#08150f] shadow-lg">
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#c5a059]/15">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#07120d] border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs uppercase tracking-widest text-[#c5a059] font-medium flex items-center gap-2">
                  <span>Committee Agendas</span>
                  <span className="text-[10px] lowercase px-2 py-0.5 rounded bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30">
                    6 councils live
                  </span>
                </h2>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Customize the official discussion agenda / topics shown in the Committees section of the website.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAgendasExpanded((prev) => !prev)}
              className="text-stone-400 hover:text-[#c5a059] text-xs flex items-center gap-1 transition-colors px-2.5 py-1 rounded border border-stone-800 hover:border-[#c5a059]/40"
            >
              <span>{isAgendasExpanded ? "Collapse" : "Expand"}</span>
              {isAgendasExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {isAgendasExpanded && (
            <form onSubmit={handleSaveAgendas} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMMITTEES.map((comm) => {
                  const val = agendas[comm.id] ?? comm.topic;
                  const isModified = val !== comm.topic;

                  return (
                    <div
                      key={comm.id}
                      className="bg-[#0a1811] border border-[#c5a059]/20 rounded-lg p-3.5 flex flex-col justify-between space-y-2.5 hover:border-[#c5a059]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-xs text-[#d4af37] px-2 py-0.5 bg-[#d4af37]/10 rounded border border-[#d4af37]/30">
                            {comm.id}
                          </span>
                          <span className="text-xs text-stone-200 font-medium truncate max-w-[220px]">
                            {comm.name}
                          </span>
                        </div>
                        {isModified && (
                          <button
                            type="button"
                            onClick={() => handleResetAgenda(comm.id)}
                            className="text-[10px] text-stone-400 hover:text-[#c5a059] flex items-center gap-1 transition-colors"
                            title="Reset to default topic"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                          Official Topic / Agenda:
                        </label>
                        <textarea
                          rows={2}
                          value={val}
                          onChange={(e) => handleAgendaChange(comm.id, e.target.value)}
                          placeholder={`Enter agenda for ${comm.id}...`}
                          className="w-full bg-[#07120d] border border-stone-800 focus:border-[#c5a059] rounded p-2 text-stone-200 text-xs focus:outline-none transition-colors leading-relaxed resize-y"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#c5a059]/15">
                <p className="text-[11px] text-stone-400">
                  Edits take effect immediately for delegates visiting the Committees section.
                </p>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {agendasFeedback && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1.5 animate-fade-in">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{agendasFeedback}</span>
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={isSavingAgendas}
                    className="bg-[#c5a059] hover:bg-[#d4af37] text-[#0a1811] text-xs font-semibold uppercase tracking-wider py-1.5 px-4 rounded transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                  >
                    {isSavingAgendas ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Committee Agendas</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </section>

        {/* Quick Delegate Counts Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#08150f] border border-[#d4af37]/40 rounded-xl p-4 shadow-md shadow-[#d4af37]/5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#c5a059] font-medium">
                Total Delegates
              </span>
              <Users className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#f5f5f4] mt-1">
              {totalDelegatesCount}
            </div>
            <p className="text-[10px] text-stone-400 mt-0.5">
              Attending delegates across all tracks
            </p>
          </div>

          <div className="bg-[#08150f] border border-[#c5a059]/25 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
                Delegations
              </span>
              <Building className="w-4 h-4 text-[#c5a059]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#f5f5f4] mt-1">
              {delegationDossiersCount}
            </div>
            <p className="text-[10px] text-stone-400 mt-0.5">
              Teams (4–6 delegates each)
            </p>
          </div>

          <div className="bg-[#08150f] border border-[#c5a059]/25 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
                Private Delegates
              </span>
              <User className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#f5f5f4] mt-1">
              {privateDossiersCount}
            </div>
            <p className="text-[10px] text-stone-400 mt-0.5">
              Individual delegates
            </p>
          </div>

          <div className="bg-[#08150f] border border-[#c5a059]/25 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
                Total Dossiers
              </span>
              <FileText className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#f5f5f4] mt-1">
              {delegates.length}
            </div>
            <p className="text-[10px] text-stone-400 mt-0.5">
              Registration dossiers
            </p>
          </div>
        </div>

        {/* Delegate Data Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-lg sm:text-xl text-[#f5f5f4] font-normal tracking-wide">
                  Delegate Registrations
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40 shadow-sm">
                  {totalDelegatesCount} Total Delegates
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {delegates.length} registration dossier{delegates.length === 1 ? "" : "s"} representing {totalDelegatesCount} participating delegates
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Registration Type Filter Buttons */}
              <div className="flex items-center bg-[#07120d] p-1 rounded border border-[#c5a059]/25 text-xs">
                <button
                  type="button"
                  onClick={() => setTypeFilter("ALL")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    typeFilter === "ALL"
                      ? "bg-[#c5a059] text-[#0a1811] font-semibold"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  All ({delegates.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter("delegation")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    typeFilter === "delegation"
                      ? "bg-[#c5a059] text-[#0a1811] font-semibold"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  Delegations ({delegationDossiersCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter("private_delegate")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    typeFilter === "private_delegate"
                      ? "bg-[#c5a059] text-[#0a1811] font-semibold"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  Private ({privateDossiersCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter("observer")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    typeFilter === "observer"
                      ? "bg-[#c5a059] text-[#0a1811] font-semibold"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  Observers ({observerDossiersCount})
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, ID, phone..."
                  className="w-full bg-[#0a1811] border border-[#c5a059]/25 rounded pl-9 pr-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>
          </div>

          {/* Clean Borderless Table */}
          <div className="overflow-x-auto border border-[#c5a059]/20 rounded-lg bg-[#08150f]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c5a059]/20 bg-[#0a1811]/60 text-[10px] sm:text-[11px] uppercase tracking-widest text-[#c5a059] font-medium">
                  <th className="py-3 px-3">Type &amp; ID</th>
                  <th className="py-3 px-3">Name &amp; Institution</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Committee / Track</th>
                  <th className="py-3 px-3">Payment Proof</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c5a059]/10 text-xs">
                {filteredDelegates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-stone-500">
                      No registrations found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDelegates.map((delegate) => {
                    const isApproved =
                      delegate.status === "Approved" || delegate.status === "Verified";
                    const isDelegation = delegate.registrationType === "delegation" || Boolean(delegate.delegates && delegate.delegates.length > 0);
                    const isObserver = delegate.registrationType === "observer" || delegate.comingAs === "Observer";
                    const proofCount = delegate.paymentProofUrls?.length || (delegate.paymentProofUrl ? 1 : 0);

                    return (
                      <tr
                        key={delegate.id}
                        className="hover:bg-[#c5a059]/5 transition-colors"
                      >
                        {/* Type & ID */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-block text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold border ${
                              isDelegation
                                ? "bg-amber-950/60 text-amber-300 border-amber-600/40"
                                : isObserver
                                ? "bg-blue-950/60 text-blue-300 border-blue-600/40"
                                : "bg-emerald-950/60 text-emerald-300 border-emerald-600/40"
                            }`}
                          >
                            {isDelegation ? "Delegation" : isObserver ? "Observer" : "Private"}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400 block mt-0.5">
                            {delegate.id}
                          </span>
                        </td>

                        {/* Name & Institution */}
                        <td className="py-3.5 px-3">
                          <span className="font-medium text-stone-100 block">
                            {delegate.fullName}
                          </span>
                          <span className="text-[11px] text-stone-400 block truncate max-w-[200px]">
                            {delegate.institution}
                          </span>

                          {/* If Delegation: View Roster button */}
                          {isDelegation && delegate.delegates && delegate.delegates.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setSelectedRosterDelegate(delegate)}
                              className="mt-1 text-[11px] text-[#c5a059] hover:underline underline-offset-2 inline-flex items-center gap-1 font-medium"
                            >
                              <Users className="w-3 h-3" />
                              <span>View Roster ({delegate.delegates.length} Delegates)</span>
                            </button>
                          )}
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-3 text-stone-300 whitespace-nowrap">
                          <div className="text-xs text-stone-200">{delegate.phone}</div>
                          <div className="text-[11px] text-stone-400">{delegate.email}</div>
                        </td>

                        {/* Committee */}
                        <td className="py-3.5 px-3 text-[#c5a059] font-medium whitespace-nowrap">
                          {delegate.committee}
                        </td>

                        {/* Payment Proof link */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {proofCount > 0 ? (
                            <button
                              type="button"
                              onClick={() => setSelectedReceiptDelegate(delegate)}
                              className="inline-flex items-center gap-1 text-[#c5a059] hover:underline underline-offset-2"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View {proofCount > 1 ? `${proofCount} Proofs` : "Proof"}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-stone-500">No file</span>
                          )}
                        </td>

                        {/* Verification Status (Pending / Approved) */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <select
                              value={isApproved ? "Approved" : "Pending"}
                              onChange={(e) =>
                                handleStatusChange(
                                  delegate.id,
                                  e.target.value as "Pending" | "Approved"
                                )
                              }
                              disabled={statusUpdatingId === delegate.id}
                              className={`bg-[#0a1811] text-xs rounded px-2.5 py-1 border transition-colors focus:outline-none ${
                                isApproved
                                  ? "border-emerald-500/50 text-emerald-400"
                                  : "border-[#c5a059]/30 text-amber-300"
                              }`}
                            >
                              <option value="Pending" className="bg-[#0a1811] text-amber-300">
                                Pending
                              </option>
                              <option value="Approved" className="bg-[#0a1811] text-emerald-400">
                                Approved
                              </option>
                            </select>

                            {statusUpdatingId === delegate.id && (
                              <Loader2 className="w-3 h-3 animate-spin text-[#c5a059]" />
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleDeleteDelegate(delegate.id, delegate.fullName)
                            }
                            className="text-stone-500 hover:text-red-400 p-1 transition-colors"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Roster Modal for Delegation */}
      {selectedRosterDelegate && selectedRosterDelegate.delegates && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedRosterDelegate(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] bg-[#0a1811] border border-[#c5a059]/40 rounded-xl p-5 sm:p-6 flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#c5a059]/20">
              <div>
                <h3 className="font-serif text-xl text-[#f5f5f4] font-normal flex items-center gap-2">
                  <span>Delegation Roster</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30">
                    {selectedRosterDelegate.id}
                  </span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {selectedRosterDelegate.institution} • {selectedRosterDelegate.delegates.length} Delegates Registered
                </p>
              </div>

              <button
                onClick={() => setSelectedRosterDelegate(null)}
                className="p-1.5 text-stone-400 hover:text-stone-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {selectedRosterDelegate.delegates.map((member) => (
                <div
                  key={member.delegateNumber}
                  className="border border-[#c5a059]/25 rounded-lg p-3.5 bg-[#08150f] hover:border-[#c5a059]/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {member.delegateNumber === 1 ? (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                          Head Delegate
                        </span>
                      ) : (
                        <span className="text-xs font-serif text-[#c5a059] font-medium tracking-wide">
                          Delegate {member.delegateNumber} {member.isOptional ? "(Optional)" : ""}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30">
                      {member.committee}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-stone-500 text-[10px] uppercase tracking-wider block">
                        Name
                      </span>
                      <span className="text-stone-100 font-medium">{member.fullName}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] uppercase tracking-wider block">
                        Institution
                      </span>
                      <span className="text-stone-300">{member.institution}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] uppercase tracking-wider block">
                        Contact No.
                      </span>
                      <span className="text-stone-300 font-mono">{member.phone}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] uppercase tracking-wider block">
                        Email Address
                      </span>
                      <span className="text-stone-300 truncate block">{member.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceiptDelegate && (
        <ReceiptModal
          delegate={selectedReceiptDelegate}
          onClose={() => setSelectedReceiptDelegate(null)}
        />
      )}
    </div>
  );
}
