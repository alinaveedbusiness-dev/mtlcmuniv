"use client";

import React from "react";
import { COMMITTEES } from "@/lib/constants";
import { BookOpen } from "lucide-react";
import { CommitteeInfo, ConferenceSettings } from "@/lib/types";

interface CommitteesSectionProps {
  settings?: ConferenceSettings;
}

export default function CommitteesSection({ settings }: CommitteesSectionProps) {
  return (
    <section id="committees" className="py-20 px-4 sm:px-6 lg:px-8 relative border-t border-gold-400/10 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 tracking-tight">
            Committees
          </h2>
          <div className="gold-divider w-20 mx-auto mt-4" />
        </div>

        {/* Committees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMMITTEES.map((comm: CommitteeInfo) => {
            const currentTopic = settings?.committeeAgendas?.[comm.id] || comm.topic;

            return (
              <div
                key={comm.id}
                className="glass-panel glass-panel-hover rounded-xl p-6 flex flex-col border border-gold-400/20 relative group transition-all duration-300"
              >
                {/* Subtle gold accent corner line */}
                <div className="absolute top-0 left-0 w-12 h-1 bg-gold-400/40 rounded-tl-xl group-hover:w-24 group-hover:bg-gold-400 transition-all duration-300" />

                {/* Committee Abbreviation */}
                <div className="mb-2">
                  <span className="font-serif text-2xl font-bold text-gold-300 tracking-wider">
                    {comm.id}
                  </span>
                </div>

                {/* Committee Full Name */}
                <h3 className="font-serif text-lg font-bold text-stone-100 mb-4 leading-snug">
                  {comm.name}
                </h3>

                {/* Committee Agenda */}
                <div className="bg-emerald-950/70 border border-gold-400/15 rounded-lg p-4 mt-auto">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gold-400 font-serif font-bold mb-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-gold-400" />
                    <span>Agenda</span>
                  </div>
                  <p className="text-stone-200 text-xs sm:text-sm font-serif leading-relaxed">
                    &quot;{currentTopic}&quot;
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
