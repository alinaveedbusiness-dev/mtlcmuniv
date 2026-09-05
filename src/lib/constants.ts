import { CommitteeInfo, ConferenceSettings } from "./types";

export const COMMITTEES: CommitteeInfo[] = [
  {
    id: "UNSC",
    name: "United Nations Security Council",
    shortName: "UNSC",
    topic: "Addressing Escalating Geopolitical Flashpoints and Autonomous Warfare in Maritime Corridors",
    level: "Advanced / Crisis",
    description: "The primary organ responsible for international peace and security. Delegates will navigate rapid crisis developments, draft binding resolutions under Chapter VII, and balance sovereign interests with global stability.",
    seatCount: 25,
  },
  {
    id: "UNHRC",
    name: "United Nations Human Rights Council",
    shortName: "UNHRC",
    topic: "Safeguarding Civil Liberties, Digital Privacy, and Protections for Displaced Populations",
    level: "Intermediate",
    description: "Tasked with strengthening the promotion and protection of human rights globally. Addressing urgent violations, refugee corridors, and emerging digital surveillance threats.",
    seatCount: 35,
  },
  {
    id: "UNW",
    name: "UN Women (Gender Equality & Empowerment)",
    shortName: "UNW",
    topic: "Institutional Protection for Women in Conflict Zones and Economic Autonomy in the Digital Age",
    level: "Intermediate",
    description: "Dedicated to gender equality and women's empowerment, formulating policy frameworks for protection from institutional violence, education access, and economic leadership.",
    seatCount: 30,
  },
  {
    id: "DISEC",
    name: "Disarmament and International Security Committee",
    shortName: "DISEC (GA-1)",
    topic: "Proliferation of Cyber-Kinetic Weapons and Establishing Global Norms for AI in Defense",
    level: "Intermediate",
    description: "Deliberating on multilateral disarmament, non-proliferation treaties, and mitigating systemic risks posed by hypersonic weaponry and weaponized artificial intelligence.",
    seatCount: 40,
  },
  {
    id: "PNA",
    name: "Pakistan National Assembly (Special Parliamentary Session)",
    shortName: "PNA",
    topic: "National Economic Sovereign Debt Restructuring and Climate Resilience Infrastructure Framework",
    level: "Intermediate",
    description: "A dynamic parliamentary simulation debating real-time socio-economic legislative bills, constitutional safeguards, and energy transition strategies.",
    seatCount: 30,
  },
  {
    id: "CRISIS",
    name: "Crisis Committee (Joint Crisis Cabinet)",
    shortName: "CRISIS",
    topic: "Midnight Strategic Directives, Espionage, and Rapid Geopolitical Escalation",
    level: "Advanced / Crisis",
    description: "A high-stakes, fast-paced crisis chamber requiring delegates to issue swift directives, navigate covert maneuvers, and respond to real-time breaking crisis updates.",
    seatCount: 20,
  },
];

export const DEFAULT_SETTINGS: ConferenceSettings = {
  eventDates: "October 3 - 4 - 5, 2026",
  venue: "The City School MTLC",
  registrationFee: "PKR 4,500 / Delegate",
  bankDetails: {
    bankName: "Meezan Bank Islamic Banking",
    accountTitle: "MTLC Model United Nations Society",
    accountNumber: "0245-0104889201",
    iban: "PK78MEZN0002450104889201",
    easypaisaNumber: "0300-9876543",
    easypaisaTitle: "MTLC Secretariat (Ali Naveed)",
  },
  isRegistrationOpen: true,
  announcement: "Registrations for MTLC MUN IV (October 3 - 4 - 5, 2026) are now live! Secure your committee allocations.",
  adminPassword: "legacy2026",
  committeeAgendas: {
    UNSC: "Addressing Escalating Geopolitical Flashpoints and Autonomous Warfare in Maritime Corridors",
    UNHRC: "Safeguarding Civil Liberties, Digital Privacy, and Protections for Displaced Populations",
    UNW: "Institutional Protection for Women in Conflict Zones and Economic Autonomy in the Digital Age",
    DISEC: "Proliferation of Cyber-Kinetic Weapons and Establishing Global Norms for AI in Defense",
    PNA: "National Economic Sovereign Debt Restructuring and Climate Resilience Infrastructure Framework",
    CRISIS: "Midnight Strategic Directives, Espionage, and Rapid Geopolitical Escalation",
  },
  lastUpdated: new Date().toISOString(),
};

export const SCHEDULE_DAYS = [
  {
    day: "Day 01",
    date: "Saturday, Oct 3",
    title: "Opening Plenary & Committee Inception",
    items: [
      { time: "08:30 AM – 10:00 AM", title: "Delegate Check-In & Diplomatic Kit Distribution", location: "Grand Foyer" },
      { time: "10:30 AM – 12:00 PM", title: "Solemn Opening Ceremony & Keynote Address", location: "Auditorium Magna" },
      { time: "12:00 PM – 01:30 PM", title: "Networking Lunch & Informal Caucus", location: "Dining Pavilion" },
      { time: "01:30 PM – 04:30 PM", title: "Committee Session I: Setting the Agenda & General Speakers List", location: "Assigned Committee Chambers" },
      { time: "04:30 PM – 05:00 PM", title: "High Tea & Diplomatic Consultations", location: "Diplomatic Terrace" },
      { time: "05:00 PM – 07:00 PM", title: "Committee Session II: Moderated Caucus & Blocs Formation", location: "Assigned Committee Chambers" },
    ],
  },
  {
    day: "Day 02",
    date: "Sunday, Oct 4",
    title: "Crisis Directives & Working Papers",
    items: [
      { time: "09:00 AM – 12:00 PM", title: "Committee Session III: Introduction of Working Papers", location: "Assigned Committee Chambers" },
      { time: "12:00 PM – 01:00 PM", title: "Diplomatic Lunch", location: "Dining Pavilion" },
      { time: "01:00 PM – 03:30 PM", title: "Committee Session IV: Midnight Crisis Simulation & Emergency Directives", location: "Assigned Committee Chambers" },
      { time: "03:30 PM – 04:00 PM", title: "Refreshment Break", location: "Diplomatic Terrace" },
      { time: "04:00 PM – 06:30 PM", title: "Committee Session V: Merger of Draft Resolutions", location: "Assigned Committee Chambers" },
      { time: "08:00 PM – 11:00 PM", title: "The Grand Diplomatic Gala Dinner & Musical Soirée", location: "Imperial Royal Gardens" },
    ],
  },
  {
    day: "Day 03",
    date: "Monday, Oct 5",
    title: "Final Voting & Grand Award Ceremony",
    items: [
      { time: "09:30 AM – 12:30 PM", title: "Committee Session VI: Substantive Amendments & Final Voting Procedure", location: "Assigned Committee Chambers" },
      { time: "12:30 PM – 01:45 PM", title: "Farewell Lunch & Secretariat Photography", location: "Dining Pavilion" },
      { time: "02:00 PM – 04:30 PM", title: "Grand Plenary Conclave & Resolution Ratification", location: "Auditorium Magna" },
      { time: "04:30 PM – 06:30 PM", title: "Award Ceremony: Best Delegate, Outstanding Diplomacy & Closing Remarks", location: "Auditorium Magna" },
    ],
  },
];
