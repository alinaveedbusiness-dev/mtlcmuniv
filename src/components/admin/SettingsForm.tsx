"use client";

import React, { useState } from "react";
import { Settings, Save, Check, AlertCircle, Loader2, Sparkles, BookOpen, CreditCard } from "lucide-react";
import { ConferenceSettings } from "@/lib/types";
import { COMMITTEES } from "@/lib/constants";

interface SettingsFormProps {
  initialSettings: ConferenceSettings;
  onSettingsSaved?: (newSettings: ConferenceSettings) => void;
}

export default function SettingsForm({ initialSettings, onSettingsSaved }: SettingsFormProps) {
  const [eventDates, setEventDates] = useState(initialSettings.eventDates);
  const [venue, setVenue] = useState(initialSettings.venue);
  const [registrationFee, setRegistrationFee] = useState(initialSettings.registrationFee);
  const [earlyBirdDelegateFee, setEarlyBirdDelegateFee] = useState(
    initialSettings.earlyBirdDelegateFee || "PKR 3,500 / Delegate"
  );
  const [earlyBirdDelegationFee, setEarlyBirdDelegationFee] = useState(
    initialSettings.earlyBirdDelegationFee || "PKR 14,000 / Delegation"
  );
  const [earlyBirdDeadline, setEarlyBirdDeadline] = useState(
    initialSettings.earlyBirdDeadline || "October 10, 2026"
  );
  const [regularDelegateFee, setRegularDelegateFee] = useState(
    initialSettings.regularDelegateFee || initialSettings.registrationFee || "PKR 4,500 / Delegate"
  );
  const [regularDelegationFee, setRegularDelegationFee] = useState(
    initialSettings.regularDelegationFee || "PKR 18,000 / Delegation"
  );
  const [registrationDeadline, setRegistrationDeadline] = useState(
    initialSettings.registrationDeadline || "October 20, 2026"
  );
  const [privateDelegateFee, setPrivateDelegateFee] = useState(
    initialSettings.privateDelegateFee ||
      initialSettings.regularDelegateFee ||
      initialSettings.registrationFee ||
      "PKR 4,500 / Delegate"
  );
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(initialSettings.isRegistrationOpen);
  const [announcement, setAnnouncement] = useState(initialSettings.announcement || "");

  // Bank details
  const [bankName, setBankName] = useState(initialSettings.bankDetails?.bankName || "");
  const [accountTitle, setAccountTitle] = useState(initialSettings.bankDetails?.accountTitle || "");
  const [accountNumber, setAccountNumber] = useState(initialSettings.bankDetails?.accountNumber || "");
  const [iban, setIban] = useState(initialSettings.bankDetails?.iban || "");
  const [easypaisaNumber, setEasypaisaNumber] = useState(initialSettings.bankDetails?.easypaisaNumber || "");
  const [easypaisaTitle, setEasypaisaTitle] = useState(initialSettings.bankDetails?.easypaisaTitle || "");

  // Committee Agendas
  const [committeeAgendas, setCommitteeAgendas] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    COMMITTEES.forEach((comm) => {
      init[comm.id] = initialSettings.committeeAgendas?.[comm.id] || comm.topic;
    });
    return init;
  });

  const [adminPassword, setAdminPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const payload: Partial<ConferenceSettings> = {
        eventDates,
        venue,
        registrationFee: regularDelegateFee || registrationFee,
        earlyBirdDelegateFee,
        earlyBirdDelegationFee,
        earlyBirdDeadline,
        regularDelegateFee,
        regularDelegationFee,
        registrationDeadline,
        privateDelegateFee,
        isRegistrationOpen,
        announcement,
        bankDetails: {
          bankName,
          accountTitle,
          accountNumber,
          iban,
          easypaisaNumber,
          easypaisaTitle,
        },
        committeeAgendas,
      };

      if (adminPassword.trim()) {
        payload.adminPassword = adminPassword.trim();
      }

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update settings.");
      }

      setSaveSuccess(true);
      if (onSettingsSaved) {
        onSettingsSaved(data.settings);
      }

      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred while saving settings.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gold-400/25">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-gold-400/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-900/60 border border-gold-400/30 flex items-center justify-center">
            <Settings className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Conference Settings &amp; Real-Time Parameters
            </h3>
            <p className="text-xs text-stone-400">
              Modifications immediately update the public landing page, hero banners, and payment slips.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded border border-emerald-500/40 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Settings Live &amp; Saved!</span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mb-6 p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Event Dates and Registration Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
              Conference Event Dates (Live on Landing Page) <span className="text-gold-400">*</span>
            </label>
            <input
              type="text"
              required
              value={eventDates}
              onChange={(e) => setEventDates(e.target.value)}
              placeholder="e.g. October 23 - 24 - 25, 2026"
              className="w-full px-4 py-2.5 rounded-lg bg-emerald-950/80 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
              Registration Status
            </label>
            <select
              value={isRegistrationOpen ? "OPEN" : "CLOSED"}
              onChange={(e) => setIsRegistrationOpen(e.target.value === "OPEN")}
              className="w-full px-4 py-2.5 rounded-lg bg-emerald-950/80 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-sm cursor-pointer"
            >
              <option value="OPEN" className="bg-emerald-950 text-emerald-300">
                🟢 Open (Accepting Delegations)
              </option>
              <option value="CLOSED" className="bg-emerald-950 text-red-300">
                🔴 Closed (Registrations Paused)
              </option>
            </select>
          </div>
        </div>

        {/* Conference Venue */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
            Conference Venue
          </label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Venue name & city"
            className="w-full px-4 py-2.5 rounded-lg bg-emerald-950/80 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-sm"
          />
        </div>

        {/* Fee Structure & Deadlines */}
        <div className="rounded-xl border border-gold-400/25 bg-emerald-950/40 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gold-400/20 gap-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gold-400" />
              <h4 className="font-serif text-sm sm:text-base font-semibold text-gold-300">
                Registration Fee Structure &amp; Deadlines
              </h4>
            </div>
            <span className="text-[11px] text-stone-400">
              Displayed dynamically on Delegation and Private Delegate registration portals
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Early Bird Tier */}
            <div className="p-4 rounded-lg bg-emerald-950/70 border border-emerald-500/25 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Early Bird Registration Tier
                </span>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1">
                  Early Bird Delegate Fee
                </label>
                <input
                  type="text"
                  value={earlyBirdDelegateFee}
                  onChange={(e) => setEarlyBirdDelegateFee(e.target.value)}
                  placeholder="e.g. PKR 3,500 / Delegate"
                  className="w-full px-3 py-2 rounded bg-emerald-900/60 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1">
                  Early Bird Delegation Fee
                </label>
                <input
                  type="text"
                  value={earlyBirdDelegationFee}
                  onChange={(e) => setEarlyBirdDelegationFee(e.target.value)}
                  placeholder="e.g. PKR 14,000 / Delegation"
                  className="w-full px-3 py-2 rounded bg-emerald-900/60 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1">
                  Early Bird Deadline
                </label>
                <input
                  type="text"
                  value={earlyBirdDeadline}
                  onChange={(e) => setEarlyBirdDeadline(e.target.value)}
                  placeholder="e.g. October 10, 2026"
                  className="w-full px-3 py-2 rounded bg-emerald-900/60 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-xs"
                />
              </div>
            </div>

            {/* Regular Tier */}
            <div className="p-4 rounded-lg bg-emerald-950/70 border border-gold-400/25 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gold-400/20">
                <span className="text-xs uppercase tracking-wider font-semibold text-gold-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-gold-400" />
                  Regular Registration Tier
                </span>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1">
                  Regular Delegate Fee
                </label>
                <input
                  type="text"
                  value={regularDelegateFee}
                  onChange={(e) => {
                    setRegularDelegateFee(e.target.value);
                    setRegistrationFee(e.target.value);
                  }}
                  placeholder="e.g. PKR 4,500 / Delegate"
                  className="w-full px-3 py-2 rounded bg-emerald-900/60 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1">
                  Regular Delegation Fee
                </label>
                <input
                  type="text"
                  value={regularDelegationFee}
                  onChange={(e) => setRegularDelegationFee(e.target.value)}
                  placeholder="e.g. PKR 18,000 / Delegation"
                  className="w-full px-3 py-2 rounded bg-emerald-900/60 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1">
                  Regular Registration Deadline
                </label>
                <input
                  type="text"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  placeholder="e.g. October 20, 2026"
                  className="w-full px-3 py-2 rounded bg-emerald-900/60 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1">
                  Private Delegate Fee (Regular)
                </label>
                <input
                  type="text"
                  value={privateDelegateFee}
                  onChange={(e) => setPrivateDelegateFee(e.target.value)}
                  placeholder="e.g. PKR 4,500 / Delegate"
                  className="w-full px-3 py-2 rounded bg-emerald-900/60 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Ticker */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
            Top Broadcast Announcement Ticker
          </label>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Special broadcast message displayed at top of portal..."
            className="w-full px-4 py-2.5 rounded-lg bg-emerald-950/80 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-sm"
          />
        </div>

        {/* Secretariat Admin Password */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-2">
            Secretariat Admin Access Password
          </label>
          <input
            type="text"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Change admin password (leave empty to keep current: MTLCMUN2026(1))"
            className="w-full px-4 py-2.5 rounded-lg bg-emerald-950/80 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-sm"
          />
          <p className="text-[11px] text-stone-400 mt-1">
            Current default password: <code className="text-gold-400 font-mono">MTLCMUN2026(1)</code>. Enter a new password to update it.
          </p>
        </div>

        {/* Bank & Remittance Credentials */}
        <div className="pt-4 border-t border-gold-400/15">
          <h4 className="font-serif text-sm font-bold text-gold-300 uppercase tracking-wider mb-4">
            Treasury Remittance Accounts
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 rounded bg-emerald-950/80 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                Bank Account Title
              </label>
              <input
                type="text"
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                className="w-full px-3 py-2 rounded bg-emerald-950/80 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                Bank Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 rounded bg-emerald-950/80 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-xs font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                IBAN Number
              </label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="w-full px-3 py-2 rounded bg-emerald-950/80 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                Mobile Wallet (Number)
              </label>
              <input
                type="text"
                value={easypaisaNumber}
                onChange={(e) => setEasypaisaNumber(e.target.value)}
                className="w-full px-3 py-2 rounded bg-emerald-950/80 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Committee Agendas Section */}
        <div className="pt-4 border-t border-gold-400/15">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-gold-400" />
            <h4 className="font-serif text-sm font-bold text-gold-300 uppercase tracking-wider">
              Council Topic Agendas (6 Committees)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMITTEES.map((comm) => (
              <div
                key={comm.id}
                className="bg-emerald-950/60 border border-stone-700/80 rounded-lg p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gold-300">{comm.id}</span>
                  <span className="text-[11px] text-stone-400 truncate max-w-[200px]">{comm.name}</span>
                </div>
                <textarea
                  rows={2}
                  value={committeeAgendas[comm.id] || ""}
                  onChange={(e) =>
                    setCommitteeAgendas((prev) => ({ ...prev, [comm.id]: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded bg-emerald-950/90 border border-stone-700 focus:border-gold-400 focus:outline-none text-stone-100 text-xs leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-gold-400/15">
          <button
            type="submit"
            disabled={saving}
            className="btn-gold px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-gold-subtle disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synchronizing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Conference Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
