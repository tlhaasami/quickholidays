import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import fs from "fs";
import path from "path";

const RAG_CONFIG = {
  DB_DEFAULT_HOST: "localhost",
  DB_DEFAULT_PORT: 5432,
  DB_DEFAULT_USER: "postgres",
  DB_DEFAULT_NAME: "postgres"
};

// Default accounts logic matching /api/agent/auth
const DEFAULT_ACCOUNTS: Record<string, { password: string; suspended: boolean; role: string }> = {
  owner: { password: "QH_Owner#2026!Secured89", suspended: false, role: "owner" },
  admin: { password: "QH_Admin#2026!Master74", suspended: false, role: "admin" },
  tlhaasami: { password: "QH_Agent#2026!Talha92", suspended: false, role: "agent" }
};
const STORAGE_FILE = path.join(process.cwd(), ".data_accounts.json");

function loadAccounts(): Record<string, { password: string; suspended: boolean; role: string }> {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const fileData = fs.readFileSync(STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(fileData);
      return { ...DEFAULT_ACCOUNTS, ...parsed };
    }
  } catch (err) {
    console.error("Failed reading server accounts file:", err);
  }
  return { ...DEFAULT_ACCOUNTS };
}

function extractYoutubeId(urlOrId: string): string {
  const clean = urlOrId.trim();
  if (clean.length === 11) return clean; // Already an ID
  
  // Standard watch or embed URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = clean.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  
  // Shorts URL matcher
  const shortsReg = /\/shorts\/([a-zA-Z0-9_-]{11})/;
  const shortsMatch = clean.match(shortsReg);
  if (shortsMatch && shortsMatch[1].length === 11) {
    return shortsMatch[1];
  }

  return clean;
}

// Helper to open connection to PG
function getPgClient() {
  const dbPassword = process.env.DB_PASSWORD;
  return new Client({
    user: process.env.DB_USER || RAG_CONFIG.DB_DEFAULT_USER,
    host: process.env.DB_HOST || RAG_CONFIG.DB_DEFAULT_HOST,
    database: process.env.DB_DATABASE || RAG_CONFIG.DB_DEFAULT_NAME,
    password: dbPassword,
    port: parseInt(process.env.DB_PORT || String(RAG_CONFIG.DB_DEFAULT_PORT)),
    ssl: {
      rejectUnauthorized: false
    }
  });
}

// GET: Fetch all video reviews, initialize & seed table if not exists
export async function GET() {
  const client = getPgClient();
  try {
    await client.connect();

    // 1. Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS video_reviews (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        country TEXT NOT NULL,
        youtube_id TEXT NOT NULL,
        caption TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Fetch existing reviews
    let res = await client.query("SELECT * FROM video_reviews ORDER BY id ASC;");

    // 3. Seed initial 5 reviews if empty
    if (res.rows.length === 0) {
      const seedReviews = [
        { name: "Natasha K.", country: "France Visa", youtubeId: "tgbNymZ7vqY", caption: "Assisted by Nile after a refusal. Smooth biometrics support." },
        { name: "KJ Ldn", country: "Schengen Visa", youtubeId: "H5v3kku4y6Q", caption: "Anaya found my TLS appointment in 6 days. Highly recommend." },
        { name: "Nadeeka W.", country: "Spain Visa", youtubeId: "dQw4w9WgXcQ", caption: "Jenny prepared our family file stress-free. 10/10 service." },
        { name: "Amara O.", country: "Germany Visa", youtubeId: "9bZkp7q19f0", caption: "Professional cover letter and checklist. Approved in 8 days." },
        { name: "Dmitry K.", country: "Italy Visa", youtubeId: "L_LUpnjgPso", caption: "Superb slot tracking. The split-deposit model gives true peace of mind." }
      ];

      for (const rev of seedReviews) {
        await client.query(
          "INSERT INTO video_reviews (name, country, youtube_id, caption) VALUES ($1, $2, $3, $4);",
          [rev.name, rev.country, rev.youtubeId, rev.caption]
        );
      }

      // Re-fetch seeded rows
      res = await client.query("SELECT * FROM video_reviews ORDER BY id ASC;");
    }

    // Format output, filtering out duplicates by youtubeId
    const seen = new Set<string>();
    const formatted: any[] = [];
    for (const row of res.rows) {
      if (!seen.has(row.youtube_id)) {
        seen.add(row.youtube_id);
        formatted.push({
          id: String(row.id),
          name: row.name,
          country: row.country,
          youtubeId: row.youtube_id,
          caption: row.caption
        });
      }
    }

    return NextResponse.json({ success: true, reviews: formatted });
  } catch (err: any) {
    console.error("Database reviews error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to load reviews" }, { status: 500 });
  } finally {
    await client.end();
  }
}

// POST: Add new video review (requires credentials)
export async function POST(req: NextRequest) {
  const client = getPgClient();
  try {
    const body = await req.json();
    const { username, password, name, country, youtubeLink, caption } = body;

    // 1. Authenticate user credentials
    const accounts = loadAccounts();
    const userClean = (username || "").trim().toLowerCase();
    const account = accounts[userClean];
    if (!account || account.password !== password || account.suspended) {
      return NextResponse.json({ success: false, error: "Access Denied: Invalid credentials." }, { status: 401 });
    }

    // 2. Validate payload fields
    if (!name || !country || !youtubeLink || !caption) {
      return NextResponse.json({ success: false, error: "All fields (name, country, youtubeLink, caption) are required." }, { status: 400 });
    }

    const youtubeId = extractYoutubeId(youtubeLink);
    if (!youtubeId || youtubeId.length !== 11) {
      return NextResponse.json({ success: false, error: "Invalid YouTube video link or ID (must resolve to an 11-char ID)." }, { status: 400 });
    }

    // 3. Connect and insert
    await client.connect();
    const res = await client.query(
      "INSERT INTO video_reviews (name, country, youtube_id, caption) VALUES ($1, $2, $3, $4) RETURNING *;",
      [name.trim(), country.trim(), youtubeId, caption.trim()]
    );

    const newRow = res.rows[0];
    return NextResponse.json({
      success: true,
      review: {
        id: String(newRow.id),
        name: newRow.name,
        country: newRow.country,
        youtubeId: newRow.youtube_id,
        caption: newRow.caption
      }
    });
  } catch (err: any) {
    console.error("Add review error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Database insert error" }, { status: 500 });
  } finally {
    await client.end();
  }
}
