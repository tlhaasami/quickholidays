import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { RAG_CONFIG } from "@/rag/config";

export const dynamic = "force-dynamic";

// Helper to get connected DB client
async function getDbClient() {
  const dbPassword = process.env.DB_PASSWORD;
  if (!dbPassword) {
    throw new Error("DB_PASSWORD env variable is not configured");
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
  return client;
}

// Ensure table exists on first startup/call
async function ensureTableExists(client: Client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS client_forms (
      id TEXT PRIMARY KEY,
      timestamp BIGINT NOT NULL,
      agent_username TEXT NOT NULL,
      messages JSONB NOT NULL DEFAULT '[]'::jsonb,
      parsed_data JSONB NOT NULL DEFAULT '{}'::jsonb,
      missing_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
      assistant_msg TEXT NOT NULL DEFAULT '',
      cover_letter_text TEXT DEFAULT '',
      cover_letter_ai_input TEXT DEFAULT '',
      cover_letter_messages JSONB DEFAULT '[]'::jsonb
    );
  `);
}

// GET all client forms
export async function GET(req: NextRequest) {
  let client;
  try {
    client = await getDbClient();
    await ensureTableExists(client);

    const res = await client.query(
      "SELECT * FROM client_forms ORDER BY timestamp DESC;"
    );

    const mapped = res.rows.map(row => ({
      id: row.id,
      timestamp: Number(row.timestamp),
      agentUsername: row.agent_username,
      messages: row.messages,
      parsedData: row.parsed_data,
      missingFields: row.missing_fields,
      assistantMsg: row.assistant_msg,
      coverLetterText: row.cover_letter_text,
      coverLetterAiInput: row.cover_letter_ai_input,
      coverLetterMessages: row.cover_letter_messages
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (err: any) {
    console.error("Fetch client forms error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch client forms" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end();
    }
  }
}

// POST: Upsert a client form
export async function POST(req: NextRequest) {
  let client;
  try {
    const body = await req.json();
    
    const id = body.id;
    const timestamp = body.timestamp;
    const agent_username = body.agentUsername || body.agent_username || "";
    const messages = body.messages || [];
    const parsed_data = body.parsedData || body.parsed_data || {};
    const missing_fields = body.missingFields || body.missing_fields || [];
    const assistant_msg = body.assistantMsg || body.assistant_msg || "";
    const cover_letter_text = body.coverLetterText || body.cover_letter_text || "";
    const cover_letter_ai_input = body.coverLetterAiInput || body.cover_letter_ai_input || "";
    const cover_letter_messages = body.coverLetterMessages || body.cover_letter_messages || [];

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Client unique id/username is required" }, { status: 400 });
    }

    client = await getDbClient();
    await ensureTableExists(client);

    // Upsert query
    const query = `
      INSERT INTO client_forms (
        id,
        timestamp,
        agent_username,
        messages,
        parsed_data,
        missing_fields,
        assistant_msg,
        cover_letter_text,
        cover_letter_ai_input,
        cover_letter_messages
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        timestamp = EXCLUDED.timestamp,
        agent_username = EXCLUDED.agent_username,
        messages = EXCLUDED.messages,
        parsed_data = EXCLUDED.parsed_data,
        missing_fields = EXCLUDED.missing_fields,
        assistant_msg = EXCLUDED.assistant_msg,
        cover_letter_text = EXCLUDED.cover_letter_text,
        cover_letter_ai_input = EXCLUDED.cover_letter_ai_input,
        cover_letter_messages = EXCLUDED.cover_letter_messages;
    `;

    await client.query(query, [
      id,
      timestamp,
      agent_username,
      JSON.stringify(messages),
      JSON.stringify(parsed_data),
      JSON.stringify(missing_fields),
      assistant_msg,
      cover_letter_text,
      cover_letter_ai_input,
      JSON.stringify(cover_letter_messages)
    ]);

    return NextResponse.json({ success: true, message: "Client form synced successfully." });
  } catch (err: any) {
    console.error("Sync client form error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to sync client form" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end();
    }
  }
}

// DELETE a client form
export async function DELETE(req: NextRequest) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
    }

    client = await getDbClient();
    await ensureTableExists(client);

    await client.query("DELETE FROM client_forms WHERE id = $1;", [id]);

    return NextResponse.json({ success: true, message: `Client form ${id} deleted successfully.` });
  } catch (err: any) {
    console.error("Delete client form error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete client form" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end();
    }
  }
}
