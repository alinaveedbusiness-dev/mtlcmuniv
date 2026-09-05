import React from "react";
import { Users, CheckCircle2, Clock, XCircle, DollarSign, Award } from "lucide-react";
import { AdminStats, ConferenceSettings } from "@/lib/types";

interface StatsOverviewProps {
  stats: AdminStats;
  settings: ConferenceSettings;
}

export default function StatsOverview({ stats, settings }: StatsOverviewProps) {
  // Extract number from registration fee (e.g. "PKR 4,500" -> 4500)
  const feeNumber = parseInt(settings.registrationFee.replace(/[^0-9]/g, ""), 10) || 4500;
  const totalRevenue = stats.verified * feeNumber;

  return (
    <div className="space-y-6">
      {/* 5 Main Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total */}
        <div className="glass-panel p-5 rounded-xl border border-gold-400/25">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">Total Received</span>
            <Users className="w-4 h-4 text-gold-400" />
          </div>
          <div className="font-serif text-3xl font-bold text-stone-100">{stats.total}</div>
          <p className="text-[11px] text-stone-400 mt-1">Delegate Applications</p>
        </div>

        {/* Verified */}
        <div className="glass-panel p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-medium">Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-serif text-3xl font-bold text-emerald-200">{stats.verified}</div>
          <p className="text-[11px] text-emerald-400/80 mt-1">Confirmed Portfolios</p>
        </div>

        {/* Pending */}
        <div className="glass-panel p-5 rounded-xl border border-amber-500/30 bg-amber-950/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-medium">Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-serif text-3xl font-bold text-amber-200">{stats.pending}</div>
          <p className="text-[11px] text-amber-400/80 mt-1">Awaiting Receipt Check</p>
        </div>

        {/* Rejected */}
        <div className="glass-panel p-5 rounded-xl border border-red-500/30 bg-red-950/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-red-400 font-medium">Rejected</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-serif text-3xl font-bold text-red-200">{stats.rejected}</div>
          <p className="text-[11px] text-red-400/80 mt-1">Declined / Duplicate</p>
        </div>

        {/* Verified Revenue */}
        <div className="glass-panel p-5 rounded-xl border border-gold-400/30 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-gold-300 font-medium">Verified Revenue</span>
            <DollarSign className="w-4 h-4 text-gold-400" />
          </div>
          <div className="font-serif text-2xl font-bold text-gold-100">
            PKR {totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">At {settings.registrationFee}</p>
        </div>
      </div>

      {/* Committee Distribution Pills */}
      <div className="glass-panel p-4 rounded-xl border border-gold-400/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs uppercase font-serif font-bold text-gold-300 tracking-wider">
            <Award className="w-3.5 h-3.5 text-gold-400" />
            <span>Committee Allocation Distribution</span>
          </div>
          <span className="text-xs text-stone-400">Total Chambers: 6</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {["UNSC", "UNHRC", "DISEC", "PNA", "SPECPOL", "UNCSW"].map((cName) => {
            const count = stats.byCommittee[cName] || 0;
            return (
              <div
                key={cName}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-stone-800 text-xs"
              >
                <span className="font-serif font-bold text-gold-300">{cName}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-900 text-stone-200 font-mono text-[11px] font-bold">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
