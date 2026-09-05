"use client";

import React from "react";
import { COMMITTEES } from "@/lib/constants";
import { BookOpen, ArrowRight } from "lucide-react";
import { CommitteeInfo, ConferenceSettings } from "@/lib/types";

interface CommitteesSectionProps {
  settings?: ConferenceSettings;
  onSelectCommittee?: (committeeId: string) => void;
}

export default function CommitteesSection({ settings, onSelectCommittee }: CommitteesSectionProps) {
  const handleApply = (id: string) => {
    if (onSelectCommittee) {
      onSelectCommittee(id);
    }
    const formElement = document.getElementById("register");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="committees" className="py-20 px-4 sm:px-6 lg:px-8 relative border-t border-gold-400/10 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Minimal Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 tracking-tight">
            Committees
          </h2>
          <div className="gold-divider w-20 mx-auto mt-4" />
        </div>

        {/* Committees Grid - Minimal without difficulty badges or seats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMMITTEES.map((comm: CommitteeInfo) => {
            const currentTopic = settings?.committeeAgendas?.[comm.id] || comm.topic;

            return (
              <div
                key={comm.id}
                className="glass-panel glass-panel-hover rounded-xl p-6 flex flex-col justify-between border border-gold-400/20 relative group transition-all duration-300"
              >
                {/* Subtle gold accent corner line */}
                <div className="absolute top-0 left-0 w-12 h-1 bg-gold-400/40 rounded-tl-xl group-hover:w-24 group-hover:bg-gold-400 transition-all duration-300" />

                <div>
                  {/* Top Bar: Abbreviation */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-serif text-2xl font-bold text-gold-300 tracking-wider">
                      {comm.id}
                    </span>
                  </div>

                  {/* Council Full Title */}
                  <h3 className="font-serif text-lg font-bold text-stone-100 mb-3 leading-snug">
                    {comm.name}
                  </h3>

                  {/* Official Topic Agenda */}
                  <div className="bg-emerald-950/70 border border-gold-400/15 rounded-lg p-3.5 mb-4">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gold-400 font-serif font-bold mb-1">
                      <BookOpen className="w-3 h-3" />
                      <span>Agenda</span>
                    </div>
                    <p className="text-stone-200 text-xs font-serif leading-relaxed line-clamp-3">
                      &quot;{currentTopic}&quot;
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-stone-400 text-xs font-sans leading-relaxed mb-6 font-light">
                    {comm.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-gold-400/10 flex items-center justify-end">
                  <button
                    onClick={() => handleApply(comm.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-100 font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                  >
                    <span>Register</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
