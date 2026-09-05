import fs from "fs/promises";
import path from "path";
import { ConferenceSettings, DelegateRegistration, AdminStats } from "./types";
import { DEFAULT_SETTINGS } from "./constants";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const DELEGATES_FILE = path.join(DATA_DIR, "delegates.json");

// In-memory fallback caches for serverless environments with read-only filesystems
let inMemorySettings: ConferenceSettings | null = null;
let inMemoryDelegates: DelegateRegistration[] | null = null;

async function safeWriteFile(filePath: string, content: string): Promise<boolean> {
  try {
    await fs.writeFile(filePath, content, "utf-8");
    return true;
  } catch {
    // Read-only filesystem or serverless execution; in-memory state will persist for instance lifetime
    return false;
  }
}

// Helper to ensure data directory and files exist
async function ensureDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory might already exist or filesystem is read-only
  }

  try {
    await fs.access(SETTINGS_FILE);
  } catch {
    await safeWriteFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
  }

  try {
    await fs.access(DELEGATES_FILE);
  } catch {
    // Initialize with a couple of high-quality sample registrations for instant demonstration
    const initialDelegates: DelegateRegistration[] = [
      {
        id: "MTLC-2026-1042",
        fullName: "Zainab Fatima Khan",
        email: "zainab.fatima@diplomacy.edu.pk",
        phone: "+92 301 5551234",
        institution: "Lahore University of Management Sciences",
        committee: "UNSC",
        experience: "Advanced",
        countryPreference1: "United Kingdom",
        countryPreference2: "France",
        paymentProofUrl: "/images/logo.png",
        paymentProofFilename: "receipt_zainab_1042.png",
        paymentProofSize: 245120,
        status: "Verified",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        notes: "Assigned Delegate of United Kingdom. Fee verified via Meezan Bank transfer.",
      },
      {
        id: "MTLC-2026-1043",
        fullName: "Hamza Tariq Qureshi",
        email: "hamza.tariq@aitchison.edu.pk",
        phone: "+92 321 4448765",
        institution: "Aitchison College, Lahore",
        committee: "DISEC",
        experience: "Intermediate",
        countryPreference1: "Germany",
        countryPreference2: "Japan",
        paymentProofUrl: "/images/logo.png",
        paymentProofFilename: "receipt_hamza_1043.png",
        paymentProofSize: 312500,
        status: "Pending",
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        notes: "Pending transaction slip re-confirmation with bank statement.",
      },
      {
        id: "MTLC-2026-1044",
        fullName: "Ayesha Noor Malik",
        email: "ayesha.malik@nust.edu.pk",
        phone: "+92 333 8889922",
        institution: "NUST Islamabad",
        committee: "PNA",
        experience: "Advanced",
        countryPreference1: "Leader of Opposition",
        countryPreference2: "Federal Minister of Finance",
        paymentProofUrl: "/images/logo.png",
        paymentProofFilename: "receipt_ayesha_1044.png",
        paymentProofSize: 198400,
        status: "Verified",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        notes: "Portfolio confirmed: Leader of the Opposition.",
      },
      {
        id: "MTLC-2026-1045",
        fullName: "Bilal Ahmed Siddiqui",
        email: "bilal.siddiqui@iba.edu.pk",
        phone: "+92 345 7771144",
        institution: "IBA Karachi",
        committee: "UNHRC",
        experience: "Beginner",
        countryPreference1: "Switzerland",
        countryPreference2: "Norway",
        paymentProofUrl: "/images/logo.png",
        paymentProofFilename: "receipt_bilal_1045.png",
        paymentProofSize: 421000,
        status: "Pending",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ];
    await fs.writeFile(DELEGATES_FILE, JSON.stringify(initialDelegates, null, 2), "utf-8");
  }
}

// Settings operations
export async function getSettings(): Promise<ConferenceSettings> {
  if (inMemorySettings) return inMemorySettings;
  await ensureDataFiles();
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
    const parsed: ConferenceSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    inMemorySettings = parsed;
    return parsed;
  } catch (err) {
    console.error("Error reading settings:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(updates: Partial<ConferenceSettings>): Promise<ConferenceSettings> {
  await ensureDataFiles();
  const current = await getSettings();
  const updated: ConferenceSettings = {
    ...current,
    ...updates,
    bankDetails: {
      ...current.bankDetails,
      ...(updates.bankDetails || {}),
    },
    committeeAgendas: {
      ...(current.committeeAgendas || {}),
      ...(updates.committeeAgendas || {}),
    },
    lastUpdated: new Date().toISOString(),
  };

  inMemorySettings = updated;
  await safeWriteFile(SETTINGS_FILE, JSON.stringify(updated, null, 2));
  return updated;
}

// Delegates operations
export async function getAllDelegates(): Promise<DelegateRegistration[]> {
  if (inMemoryDelegates) return inMemoryDelegates;
  await ensureDataFiles();
  try {
    const raw = await fs.readFile(DELEGATES_FILE, "utf-8");
    const parsed = JSON.parse(raw) as DelegateRegistration[];
    inMemoryDelegates = parsed;
    return parsed;
  } catch (err) {
    console.error("Error reading delegates:", err);
    return [];
  }
}

export async function getDelegates(filters?: {
  search?: string;
  status?: string;
  committee?: string;
}): Promise<DelegateRegistration[]> {
  const delegates = await getAllDelegates();
  return delegates.filter((d) => {
    if (filters?.status && filters.status !== "ALL" && d.status !== filters.status) {
      return false;
    }
    if (filters?.committee && filters.committee !== "ALL" && d.committee !== filters.committee) {
      return false;
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      const matchName = d.fullName.toLowerCase().includes(q);
      const matchEmail = d.email.toLowerCase().includes(q);
      const matchId = d.id.toLowerCase().includes(q);
      const matchPhone = d.phone.toLowerCase().includes(q);
      const matchInst = (d.institution || "").toLowerCase().includes(q);
      const matchSubDelegates = (d.delegates || []).some(
        (sub) =>
          sub.fullName.toLowerCase().includes(q) ||
          sub.email.toLowerCase().includes(q) ||
          sub.phone.toLowerCase().includes(q) ||
          (sub.institution || "").toLowerCase().includes(q) ||
          (sub.committee || "").toLowerCase().includes(q)
      );
      if (!matchName && !matchEmail && !matchId && !matchPhone && !matchInst && !matchSubDelegates) {
        return false;
      }
    }
    return true;
  });
}

export async function getDelegateById(id: string): Promise<DelegateRegistration | null> {
  const delegates = await getAllDelegates();
  return delegates.find((d) => d.id.toLowerCase() === id.toLowerCase()) || null;
}

export async function createDelegate(
  data: Omit<DelegateRegistration, "id" | "createdAt" | "status">
): Promise<DelegateRegistration> {
  await ensureDataFiles();
  const delegates = await getAllDelegates();

  // Generate unique ID like MTLC-2026-1046
  let newId = "";
  let isUnique = false;
  while (!isUnique) {
    const num = Math.floor(1000 + Math.random() * 9000);
    newId = `MTLC-2026-${num}`;
    if (!delegates.some((d) => d.id === newId)) {
      isUnique = true;
    }
  }

  const newDelegate: DelegateRegistration = {
    ...data,
    id: newId,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  delegates.unshift(newDelegate);
  inMemoryDelegates = delegates;
  await safeWriteFile(DELEGATES_FILE, JSON.stringify(delegates, null, 2));
  return newDelegate;
}

export async function updateDelegateStatus(
  id: string,
  status: "Pending" | "Verified" | "Approved" | "Rejected",
  notes?: string
): Promise<DelegateRegistration | null> {
  await ensureDataFiles();
  const delegates = await getAllDelegates();
  const index = delegates.findIndex((d) => d.id.toLowerCase() === id.toLowerCase());

  if (index === -1) return null;

  delegates[index].status = status;
  if (notes !== undefined) {
    delegates[index].notes = notes;
  }

  inMemoryDelegates = delegates;
  await safeWriteFile(DELEGATES_FILE, JSON.stringify(delegates, null, 2));
  return delegates[index];
}

export async function deleteDelegate(id: string): Promise<boolean> {
  await ensureDataFiles();
  const delegates = await getAllDelegates();
  const filtered = delegates.filter((d) => d.id.toLowerCase() !== id.toLowerCase());

  if (filtered.length === delegates.length) return false;

  inMemoryDelegates = filtered;
  await safeWriteFile(DELEGATES_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

export async function getAdminStats(): Promise<AdminStats> {
  const delegates = await getAllDelegates();
  const stats: AdminStats = {
    total: delegates.length,
    verified: 0,
    pending: 0,
    rejected: 0,
    byCommittee: {},
  };

  for (const d of delegates) {
    if (d.status === "Verified") stats.verified++;
    else if (d.status === "Pending") stats.pending++;
    else if (d.status === "Rejected") stats.rejected++;

    const comm = d.committee || "Unassigned";
    stats.byCommittee[comm] = (stats.byCommittee[comm] || 0) + 1;
  }

  return stats;
}
