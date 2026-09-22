import { connect } from "@tidbcloud/serverless";
import { ConferenceSettings, DelegateRegistration } from "./types";

type TiDBConn = ReturnType<typeof connect>;
let conn: TiDBConn | null = null;
let isSchemaInitialized = false;

export function isTiDBConfigured(): boolean {
  const url = process.env.TIDB_DATABASE_URL || process.env.DATABASE_URL;
  if (url && (url.startsWith("mysql://") || url.startsWith("mysqls://") || url.includes("tidbcloud.com"))) {
    return true;
  }
  return Boolean(process.env.TIDB_HOST && process.env.TIDB_USER && process.env.TIDB_PASSWORD);
}

function getTiDBConnection(): TiDBConn | null {
  if (!isTiDBConfigured()) return null;
  if (conn) return conn;

  try {
    const url = process.env.TIDB_DATABASE_URL || process.env.DATABASE_URL;
    if (url) {
      conn = connect({ url });
    } else if (process.env.TIDB_HOST && process.env.TIDB_USER) {
      conn = connect({
        host: process.env.TIDB_HOST,
        username: process.env.TIDB_USER,
        password: process.env.TIDB_PASSWORD || "",
        database: process.env.TIDB_DATABASE || "test",
        port: Number(process.env.TIDB_PORT) || 4000,
      });
    }
    return conn;
  } catch (err) {
    console.error("[TiDB] Connection initialization failed:", err);
    return null;
  }
}

// Auto-create tables on first request
export async function ensureTiDBSchema(): Promise<boolean> {
  if (isSchemaInitialized) return true;
  const db = getTiDBConnection();
  if (!db) return false;

  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS mtlc_delegates (
        id VARCHAR(64) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(64),
        institution VARCHAR(255),
        committee VARCHAR(64),
        registration_type VARCHAR(64),
        status VARCHAR(32) DEFAULT 'Pending',
        data JSON NOT NULL,
        created_at VARCHAR(64) NOT NULL,
        INDEX idx_status (status),
        INDEX idx_committee (committee),
        INDEX idx_type (registration_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS mtlc_settings (
        id VARCHAR(32) PRIMARY KEY DEFAULT 'current',
        data JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    isSchemaInitialized = true;
    return true;
  } catch (err) {
    console.error("[TiDB] Schema migration failed:", err);
    return false;
  }
}

// ============================================================
// Delegates TiDB Operations
// ============================================================

export async function getTiDBAllDelegates(): Promise<DelegateRegistration[] | null> {
  const db = getTiDBConnection();
  if (!db) return null;

  try {
    await ensureTiDBSchema();
    const rows = (await db.execute(
      "SELECT data FROM mtlc_delegates ORDER BY created_at DESC"
    )) as Array<{ data: string | object }>;

    if (!Array.isArray(rows)) return [];

    return rows.map((row) => {
      if (typeof row.data === "string") {
        try {
          return JSON.parse(row.data) as DelegateRegistration;
        } catch {
          return row.data as unknown as DelegateRegistration;
        }
      }
      return row.data as unknown as DelegateRegistration;
    });
  } catch (err) {
    console.error("[TiDB] Failed to fetch delegates:", err);
    return null;
  }
}

export async function insertTiDBDelegate(delegate: DelegateRegistration): Promise<boolean> {
  const db = getTiDBConnection();
  if (!db) return false;

  try {
    await ensureTiDBSchema();
    const jsonStr = JSON.stringify(delegate);

    await db.execute(
      `INSERT INTO mtlc_delegates (
        id, full_name, email, phone, institution, committee, registration_type, status, data, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE status = VALUES(status), data = VALUES(data)`,
      [
        delegate.id,
        delegate.fullName || "",
        delegate.email || "",
        delegate.phone || "",
        delegate.institution || "",
        delegate.committee || "",
        delegate.registrationType || "private_delegate",
        delegate.status || "Pending",
        jsonStr,
        delegate.createdAt || new Date().toISOString(),
      ]
    );

    return true;
  } catch (err) {
    console.error("[TiDB] Failed to insert delegate:", err);
    return false;
  }
}

export async function updateTiDBDelegateStatus(
  id: string,
  status: "Pending" | "Verified" | "Approved" | "Rejected",
  notes?: string
): Promise<DelegateRegistration | null> {
  const db = getTiDBConnection();
  if (!db) return null;

  try {
    await ensureTiDBSchema();
    const rows = (await db.execute(
      "SELECT data FROM mtlc_delegates WHERE id = ? LIMIT 1",
      [id]
    )) as Array<{ data: string | object }>;

    if (!Array.isArray(rows) || rows.length === 0) return null;

    const currentData =
      typeof rows[0].data === "string"
        ? (JSON.parse(rows[0].data) as DelegateRegistration)
        : (rows[0].data as unknown as DelegateRegistration);

    currentData.status = status;
    if (notes !== undefined) {
      currentData.notes = notes;
    }

    const jsonStr = JSON.stringify(currentData);
    await db.execute(
      "UPDATE mtlc_delegates SET status = ?, data = ? WHERE id = ?",
      [status, jsonStr, id]
    );

    return currentData;
  } catch (err) {
    console.error("[TiDB] Failed to update delegate status:", err);
    return null;
  }
}

export async function deleteTiDBDelegate(id: string): Promise<boolean> {
  const db = getTiDBConnection();
  if (!db) return false;

  try {
    await ensureTiDBSchema();
    await db.execute("DELETE FROM mtlc_delegates WHERE id = ?", [id]);
    return true;
  } catch (err) {
    console.error("[TiDB] Failed to delete delegate:", err);
    return false;
  }
}

export async function clearTiDBDelegates(): Promise<boolean> {
  const db = getTiDBConnection();
  if (!db) return false;

  try {
    await ensureTiDBSchema();
    await db.execute("DELETE FROM mtlc_delegates");
    return true;
  } catch (err) {
    console.error("[TiDB] Failed to clear delegates:", err);
    return false;
  }
}

// ============================================================
// Settings TiDB Operations
// ============================================================

export async function getTiDBSettings(): Promise<ConferenceSettings | null> {
  const db = getTiDBConnection();
  if (!db) return null;

  try {
    await ensureTiDBSchema();
    const rows = (await db.execute(
      "SELECT data FROM mtlc_settings WHERE id = 'current' LIMIT 1"
    )) as Array<{ data: string | object }>;

    if (!Array.isArray(rows) || rows.length === 0) return null;

    if (typeof rows[0].data === "string") {
      return JSON.parse(rows[0].data) as ConferenceSettings;
    }
    return rows[0].data as unknown as ConferenceSettings;
  } catch (err) {
    console.error("[TiDB] Failed to fetch settings:", err);
    return null;
  }
}

export async function updateTiDBSettings(settings: ConferenceSettings): Promise<boolean> {
  const db = getTiDBConnection();
  if (!db) return false;

  try {
    await ensureTiDBSchema();
    const jsonStr = JSON.stringify(settings);

    await db.execute(
      `INSERT INTO mtlc_settings (id, data) VALUES ('current', ?)
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [jsonStr]
    );

    return true;
  } catch (err) {
    console.error("[TiDB] Failed to update settings:", err);
    return false;
  }
}
