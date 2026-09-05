"use client";

import React, { useState } from "react";
import { SCHEDULE_DAYS } from "@/lib/constants";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";

export default function ScheduleSection() {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const activeDay = SCHEDULE_DAYS[activeDayIndex];

  return (
    <section id="schedule" className="py-20 px-4 sm:px-6 lg:px-8 relative border-t border-gold-400/10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/20 bg-emerald-900/40 text-gold-300 text-xs uppercase tracking-widest font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span>Conference Itinerary</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 mb-4">
            Three Days of <span className="text-gold-gradient">Intensive Diplomacy</span>
          </h2>
          <div className="gold-divider w-24 mx-auto mb-6" />
          <p className="max-w-xl mx-auto text-stone-300 text-sm font-light">
            Plan your caucus strategy. From the solemn opening procession to the climactic plenary voting session.
          </p>

          {/* Day Tabs */}
          <div className="flex justify-center gap-2 sm:gap-4 mt-8">
            {SCHEDULE_DAYS.map((day, idx) => (
              <button
                key={day.day}
                onClick={() => setActiveDayIndex(idx)}
                className={`flex flex-col items-center px-4 sm:px-8 py-3 rounded-xl border transition-all duration-300 ${
                  activeDayIndex === idx
                    ? "bg-emerald-900/70 border-gold-400 shadow-gold-subtle text-stone-100"
                    : "bg-emerald-950/50 border-stone-800/80 text-stone-400 hover:border-gold-400/30 hover:text-stone-200"
                }`}
              >
                <span className="font-serif font-bold text-sm sm:text-base text-gold-300">
                  {day.day}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-stone-400">
                  {day.date}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Day Header Title */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gold-400/25">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gold-400/15">
            <div>
              <span className="text-xs font-serif uppercase tracking-widest text-gold-400 font-bold block mb-1">
                {activeDay.day} Focus
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
                {activeDay.title}
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-gold-300 bg-emerald-900/50 px-3 py-1.5 rounded border border-gold-400/20">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Full Attendance Mandatory</span>
            </div>
          </div>

          {/* Timeline Items */}
          <div className="relative pl-6 sm:pl-8 border-l border-gold-400/30 space-y-6">
            {activeDay.items.map((item, i) => (
              <div key={i} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-gold-400 border-2 border-emerald-950 ring-4 ring-emerald-900/50 group-hover:scale-125 transition-transform" />

                <div className="bg-emerald-950/60 border border-stone-800/80 hover:border-gold-400/30 p-4 rounded-lg transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gold-300">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <h4 className="font-serif text-stone-100 font-bold text-sm sm:text-base">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
