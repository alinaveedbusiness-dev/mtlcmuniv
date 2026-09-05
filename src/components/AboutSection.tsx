import React from "react";
import { Compass, Scale, Landmark, Feather, Award, Users, Globe2, ShieldCheck } from "lucide-react";

export default function AboutSection() {
  const pillars = [
    {
      icon: <Scale className="w-6 h-6 text-gold-400" />,
      title: "Substantive Rigor",
      description:
        "Engineered with comprehensive background study guides and nuanced parliamentary procedures that challenge both seasoned veterans and emerging leaders.",
    },
    {
      icon: <Globe2 className="w-6 h-6 text-gold-400" />,
      title: "Multilateral Consensus",
      description:
        "True diplomacy goes beyond rhetoric. We emphasize coalition building, bilateral drafting, and the art of harmonizing competing sovereign interests.",
    },
    {
      icon: <Feather className="w-6 h-6 text-gold-400" />,
      title: "The Legacy Standard",
      description:
        "Now in its fourth distinguished iteration, MTLC MUN IV sets the gold standard for delegate hospitality, crisis execution, and impartial dais leadership.",
    },
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 relative border-t border-gold-400/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/20 bg-emerald-900/40 text-gold-300 text-xs uppercase tracking-widest font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            <span>The Secretariat&apos;s Welcome</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 mb-4">
            A Conclave of <span className="text-gold-gradient">Statesmanship & Honor</span>
          </h2>
          <div className="gold-divider w-24 mx-auto mb-6" />
        </div>

        {/* Diplomatic Address Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/5 rounded-bl-full pointer-events-none" />
            <span className="text-xs uppercase tracking-widest text-gold-400 font-serif font-bold mb-2 block">
              Official Communiqué
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mb-4">
              &quot;In an era of fragmenting alliances, our table remains open.&quot;
            </h3>
            <div className="space-y-4 text-stone-300 text-sm sm:text-base leading-relaxed font-sans">
              <p>
                Distinguished Delegates, Faculty Advisors, and Guests of Honor:
              </p>
              <p>
                It is with utmost gravitas that we convene for <strong>MTLC MUN IV: Legacy Edition</strong>. 
                Our world confronts unprecedented challenges — autonomous warfare, climate vulnerability, 
                and delicate geopolitical realignments. In these chambers, you do not simply role-play diplomats; 
                you inherit the imperative to deliberate, mediate, and enact transformative policy.
              </p>
              <p>
                Whether you enter the high-stakes midnight sessions of the United Nations Security Council 
                or champion constitutional debate in the Pakistan National Assembly, we demand intellectual integrity, 
                persuasive eloquence, and respect for the international order.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gold-400/15 flex items-center justify-between">
              <div>
                <h4 className="font-serif text-gold-200 font-bold text-sm">Ali Naveed</h4>
                <p className="text-stone-400 text-xs tracking-wider">Secretary-General, MTLC MUN IV</p>
              </div>
              <div className="w-16 h-10 border border-gold-400/30 rounded flex items-center justify-center bg-emerald-950/60">
                <span className="font-serif italic text-gold-400 text-xs">SEAL</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-xl text-center border-gold-400/20">
              <Users className="w-6 h-6 text-gold-400 mx-auto mb-2" />
              <div className="font-serif text-3xl font-bold text-stone-100 mb-1">500+</div>
              <div className="text-xs uppercase tracking-wider text-stone-400">Future Diplomats</div>
            </div>

            <div className="glass-panel p-6 rounded-xl text-center border-gold-400/20">
              <Landmark className="w-6 h-6 text-gold-400 mx-auto mb-2" />
              <div className="font-serif text-3xl font-bold text-stone-100 mb-1">06</div>
              <div className="text-xs uppercase tracking-wider text-stone-400">Elite Chambers</div>
            </div>

            <div className="glass-panel p-6 rounded-xl text-center border-gold-400/20">
              <Award className="w-6 h-6 text-gold-400 mx-auto mb-2" />
              <div className="font-serif text-3xl font-bold text-stone-100 mb-1">24+</div>
              <div className="text-xs uppercase tracking-wider text-stone-400">Diplomatic Accolades</div>
            </div>

            <div className="glass-panel p-6 rounded-xl text-center border-gold-400/20">
              <ShieldCheck className="w-6 h-6 text-gold-400 mx-auto mb-2" />
              <div className="font-serif text-3xl font-bold text-stone-100 mb-1">03</div>
              <div className="text-xs uppercase tracking-wider text-stone-400">Days of Legacy</div>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover p-6 rounded-xl border border-gold-400/20"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-900/60 border border-gold-400/30 flex items-center justify-center mb-4">
                {pillar.icon}
              </div>
              <h4 className="font-serif text-lg font-bold text-stone-100 mb-2">
                {pillar.title}
              </h4>
              <p className="text-stone-400 text-sm leading-relaxed font-sans">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
