export type CommitteeType =
  | "UNSC"
  | "UNHRC"
  | "UNW"
  | "DISEC"
  | "PNA"
  | "CRISIS"
  | "SPECPOL"
  | "UNCSW";

export interface CommitteeInfo {
  id: CommitteeType;
  name: string;
  shortName: string;
  topic: string;
  level: "Beginner Friendly" | "Intermediate" | "Advanced / Crisis";
  description: string;
  seatCount: number;
}

export type RegistrationType = "delegation" | "private_delegate" | "observer";

export interface DelegationMember {
  delegateNumber: number;
  fullName: string;
  phone: string;
  email: string;
  institution: string;
  committee: CommitteeType | string;
  isOptional?: boolean;
}

export interface DelegateRegistration {
  id: string; // e.g. MTLC-2026-1089
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  committee: CommitteeType | string;
  registrationType?: RegistrationType;
  comingAs?: "Delegate" | "Observer";
  delegates?: DelegationMember[];
  experience?: "Beginner" | "Intermediate" | "Advanced";
  countryPreference1?: string;
  countryPreference2?: string;
  paymentProofUrl: string;
  paymentProofFilename: string;
  paymentProofSize?: number;
  paymentProofUrls?: string[];
  paymentProofFilenames?: string[];
  status: "Pending" | "Verified" | "Approved" | "Rejected";
  createdAt: string;
  notes?: string;
}

export interface ConferenceSettings {
  eventDates: string;
  venue: string;
  registrationFee: string;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    easypaisaNumber: string;
    easypaisaTitle: string;
  };
  isRegistrationOpen: boolean;
  announcement: string;
  adminPassword?: string;
  committeeAgendas?: Record<string, string>;
  lastUpdated?: string;
}

export interface AdminStats {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  byCommittee: Record<string, number>;
}
