import fs from "fs/promises";
import path from "path";
import os from "os";
import { ConferenceSettings, DelegateRegistration, AdminStats } from "./types";
import { DEFAULT_SETTINGS } from "./constants";
import {
  isTiDBConfigured,
  getTiDBAllDelegates,
  insertTiDBDelegate,
  updateTiDBDelegateStatus,
  deleteTiDBDelegate,
  clearTiDBDelegates,
  getTiDBSettings,
  updateTiDBSettings,
} from "./tidb";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const DELEGATES_FILE = path.join(DATA_DIR, "delegates.json");

// Serverless /tmp fallback paths
const TMP_SETTINGS_FILE = path.join(os.tmpdir(), "mtlc_settings.json");
const TMP_DELEGATES_FILE = path.join(os.tmpdir(), "mtlc_delegates.json");

// In-memory fallback caches
let inMemorySettings: ConferenceSettings | null = null;
let inMemoryDelegates: DelegateRegistration[] | null = null;

// Cloud KV configuration helper (Upstash Redis / Vercel KV REST API)
function getCloudKVConfig() {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_URL ||
    "";
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_TOKEN ||
    "";

  if (url && token) {
    return { url: url.replace(/\/$/, ""), token };
  }
  return null;
}

export function getStorageStatus(): { isCloudConnected: boolean; provider: string } {
  if (isTiDBConfigured()) {
    return { isCloudConnected: true, provider: "TiDB Cloud Serverless (Distributed MySQL)" };
  }
  const config = getCloudKVConfig();
  if (config) {
    return { isCloudConnected: true, provider: "Upstash Redis / Vercel KV" };
  }
  return {
    isCloudConnected: false,
    provider: "Local Filesystem (Requires TiDB or Cloud DB for Git/Vercel persistence)",
  };
}

// Execute command on Upstash Redis / Vercel KV REST API
async function executeCloudKV<T>(command: (string | number)[]): Promise<T | null> {
  const config = getCloudKVConfig();
  if (!config) return null;

  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[CloudKV] Command failed with status ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.result as T;
  } catch (err) {
    console.warn("[CloudKV] Network or API error:", err);
    return null;
  }
}

async function safeWriteFile(filePath: string, content: string): Promise<boolean> {
  try {
    await fs.writeFile(filePath, content, "utf-8");
    return true;
  } catch {
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
    await safeWriteFile(DELEGATES_FILE, JSON.stringify([], null, 2));
  }
}

// ==========================================
// Settings operations
// ==========================================

export async function getSettings(): Promise<ConferenceSettings> {
  // 1. Try TiDB Serverless if configured
  if (isTiDBConfigured()) {
    const tidbSettings = await getTiDBSettings();
    if (tidbSettings) {
      const merged: ConferenceSettings = { ...DEFAULT_SETTINGS, ...tidbSettings };
      inMemorySettings = merged;
      return merged;
    }
  }

  // 2. Try Cloud KV if configured
  const cloudData = await executeCloudKV<string>(["GET", "mtlc_settings"]);
  if (cloudData) {
    try {
      const parsed = typeof cloudData === "string" ? JSON.parse(cloudData) : cloudData;
      const merged: ConferenceSettings = { ...DEFAULT_SETTINGS, ...parsed };
      inMemorySettings = merged;
      return merged;
    } catch {
      // Continue to fallbacks
    }
  }

  // 3. In-memory fallback
  if (inMemorySettings) return inMemorySettings;

  await ensureDataFiles();

  // 4. Try reading from primary settings file
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
    const parsed: ConferenceSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    inMemorySettings = parsed;
    return parsed;
  } catch {
    // 5. Try reading from serverless /tmp fallback
    try {
      const tmpRaw = await fs.readFile(TMP_SETTINGS_FILE, "utf-8");
      const parsed: ConferenceSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(tmpRaw) };
      inMemorySettings = parsed;
      return parsed;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
}

export async function updateSettings(updates: Partial<ConferenceSettings>): Promise<ConferenceSettings> {
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
  const jsonStr = JSON.stringify(updated, null, 2);

  // 1. Persist to TiDB if configured
  if (isTiDBConfigured()) {
    await updateTiDBSettings(updated);
  }

  // 2. Update Cloud KV if configured
  await executeCloudKV(["SET", "mtlc_settings", jsonStr]);

  // 3. Mirror to local file and /tmp
  await safeWriteFile(SETTINGS_FILE, jsonStr);
  await safeWriteFile(TMP_SETTINGS_FILE, jsonStr);

  return updated;
}

// ==========================================
// Delegates operations
// ==========================================

export async function getAllDelegates(): Promise<DelegateRegistration[]> {
  // 1. Try TiDB Serverless first
  if (isTiDBConfigured()) {
    const tidbDelegates = await getTiDBAllDelegates();
    if (tidbDelegates !== null) {
      inMemoryDelegates = tidbDelegates;
      return tidbDelegates;
    }
  }

  // 2. Try Cloud KV
  const cloudData = await executeCloudKV<string>(["GET", "mtlc_delegates"]);
  if (cloudData) {
    try {
      const parsed = typeof cloudData === "string" ? JSON.parse(cloudData) : cloudData;
      if (Array.isArray(parsed)) {
        inMemoryDelegates = parsed;
        return parsed;
      }
    } catch {
      // Continue to fallbacks
    }
  }

  // 3. Return in-memory if already loaded
  if (inMemoryDelegates) return inMemoryDelegates;

  await ensureDataFiles();

  // 4. Try reading primary local file
  try {
    const raw = await fs.readFile(DELEGATES_FILE, "utf-8");
    const parsed = JSON.parse(raw) as DelegateRegistration[];
    if (Array.isArray(parsed)) {
      inMemoryDelegates = parsed;
      return parsed;
    }
  } catch {
    // 5. Try reading /tmp file for serverless environments
    try {
      const tmpRaw = await fs.readFile(TMP_DELEGATES_FILE, "utf-8");
      const parsed = JSON.parse(tmpRaw) as DelegateRegistration[];
      if (Array.isArray(parsed)) {
        inMemoryDelegates = parsed;
        return parsed;
      }
    } catch {
      // Return empty list
    }
  }

  inMemoryDelegates = [];
  return [];
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

  const jsonStr = JSON.stringify(delegates, null, 2);

  // 1. Persist to TiDB
  if (isTiDBConfigured()) {
    await insertTiDBDelegate(newDelegate);
  }

  // 2. Persist to Cloud KV
  await executeCloudKV(["SET", "mtlc_delegates", jsonStr]);

  // 3. Persist to local filesystem and serverless /tmp
  await safeWriteFile(DELEGATES_FILE, jsonStr);
  await safeWriteFile(TMP_DELEGATES_FILE, jsonStr);

  return newDelegate;
}

export async function updateDelegateStatus(
  id: string,
  status: "Pending" | "Verified" | "Approved" | "Rejected",
  notes?: string
): Promise<DelegateRegistration | null> {
  const delegates = await getAllDelegates();
  const index = delegates.findIndex((d) => d.id.toLowerCase() === id.toLowerCase());

  if (index === -1) return null;

  delegates[index].status = status;
  if (notes !== undefined) {
    delegates[index].notes = notes;
  }

  inMemoryDelegates = delegates;
  const jsonStr = JSON.stringify(delegates, null, 2);

  // 1. Persist to TiDB
  if (isTiDBConfigured()) {
    await updateTiDBDelegateStatus(id, status, notes);
  }

  // 2. Persist to Cloud KV
  await executeCloudKV(["SET", "mtlc_delegates", jsonStr]);

  // 3. Persist to local file and /tmp
  await safeWriteFile(DELEGATES_FILE, jsonStr);
  await safeWriteFile(TMP_DELEGATES_FILE, jsonStr);

  return delegates[index];
}

export async function deleteDelegate(id: string): Promise<boolean> {
  const delegates = await getAllDelegates();
  const filtered = delegates.filter((d) => d.id.toLowerCase() !== id.toLowerCase());

  if (filtered.length === delegates.length) return false;

  inMemoryDelegates = filtered;
  const jsonStr = JSON.stringify(filtered, null, 2);

  // 1. Delete from TiDB
  if (isTiDBConfigured()) {
    await deleteTiDBDelegate(id);
  }

  // 2. Persist to Cloud KV
  await executeCloudKV(["SET", "mtlc_delegates", jsonStr]);

  // 3. Persist to local file and /tmp
  await safeWriteFile(DELEGATES_FILE, jsonStr);
  await safeWriteFile(TMP_DELEGATES_FILE, jsonStr);

  return true;
}

export async function clearAllDelegates(): Promise<boolean> {
  inMemoryDelegates = [];
  const jsonStr = JSON.stringify([], null, 2);

  // 1. Clear TiDB
  if (isTiDBConfigured()) {
    await clearTiDBDelegates();
  }

  // 2. Clear Cloud KV
  await executeCloudKV(["SET", "mtlc_delegates", jsonStr]);

  // 3. Clear local file and /tmp
  await safeWriteFile(DELEGATES_FILE, jsonStr);
  await safeWriteFile(TMP_DELEGATES_FILE, jsonStr);

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
