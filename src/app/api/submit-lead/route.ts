import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { RAG_CONFIG } from "@/rag/config";

export const dynamic = "force-dynamic";

const getPeriodStart = () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(12, 0, 0, 0);
  if (now < start) {
    // If before 12pm today, the current rate-limit period started 12pm yesterday
    start.setDate(start.getDate() - 1);
  }
  return start;
};

export async function POST(req: NextRequest) {
  const dbPassword = process.env.DB_PASSWORD;

  if (!dbPassword) {
    return NextResponse.json(
      { error: "DB_PASSWORD env variable is not configured" },
      { status: 500 }
    );
  }

  try {
    const payload = await req.json();

    // Basic payload check
    if (!payload || !payload.email || !payload.name || !payload.phone) {
      return NextResponse.json({ error: "Missing required contact details" }, { status: 400 });
    }

    const client = new Client({
      user: process.env.DB_USER || RAG_CONFIG.DB_DEFAULT_USER,
      host: process.env.DB_HOST || RAG_CONFIG.DB_DEFAULT_HOST,
      database: process.env.DB_DATABASE || RAG_CONFIG.DB_DEFAULT_NAME,
      password: dbPassword,
      port: parseInt(process.env.DB_PORT || String(RAG_CONFIG.DB_DEFAULT_PORT)),
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();

    try {
      // 1. Ensure table exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS lead_submissions (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          payload JSONB
        );
      `);

      // 2. Count submissions in the current period starting at 12:00 PM
      const periodStart = getPeriodStart();
      const countRes = await client.query(
        "SELECT COUNT(*) AS count FROM lead_submissions WHERE created_at >= $1;",
        [periodStart.toISOString()]
      );

      const count = parseInt(countRes.rows[0].count, 10);

      if (count >= 15) {
        return NextResponse.json(
          { error: "The daily consultation booking limit has been reached. Please try again after 12:00 PM." },
          { status: 429 }
        );
      }

      // 3. Log submission in database
      await client.query(
        "INSERT INTO lead_submissions (payload) VALUES ($1);",
        [JSON.stringify(payload)]
      );
    } finally {
      await client.end();
    }

    // 4. Forward payload to GoHighLevel Webhook securely from the server
    const ghlResponse = await fetch("https://services.leadconnectorhq.com/hooks/ZRAicdXpBGpeZlzyPy22/webhook-trigger/15cc21aa-a6f6-48e4-9fce-5d4a6b41556d", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!ghlResponse.ok) {
      console.warn(`GHL webhook warning: returned status ${ghlResponse.status}`);
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("Lead submission endpoint error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process lead submission" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const dbPassword = process.env.DB_PASSWORD;

  if (!dbPassword) {
    return NextResponse.json(
      { error: "DB_PASSWORD env variable is not configured" },
      { status: 500 }
    );
  }

  try {
    const client = new Client({
      user: process.env.DB_USER || RAG_CONFIG.DB_DEFAULT_USER,
      host: process.env.DB_HOST || RAG_CONFIG.DB_DEFAULT_HOST,
      database: process.env.DB_DATABASE || RAG_CONFIG.DB_DEFAULT_NAME,
      password: dbPassword,
      port: parseInt(process.env.DB_PORT || String(RAG_CONFIG.DB_DEFAULT_PORT)),
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();
    let leads: any[] = [];
    try {
      // Ensure table exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS lead_submissions (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          payload JSONB
        );
      `);

      const res = await client.query("SELECT id, created_at, payload FROM lead_submissions ORDER BY created_at DESC LIMIT 50;");
      leads = res.rows;
    } finally {
      await client.end();
    }

    return NextResponse.json({ leads });
  } catch (err: any) {
    console.error("Failed to fetch leads:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
