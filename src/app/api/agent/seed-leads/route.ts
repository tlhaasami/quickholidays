import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { RAG_CONFIG } from "@/rag/config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const dbPassword = process.env.DB_PASSWORD;

  if (!dbPassword) {
    return NextResponse.json(
      { error: "DB_PASSWORD env variable is not configured" },
      { status: 500 }
    );
  }

  const dummyLeads = [
    {
      name: "Amit Patel",
      email: "amit.patel@gmail.com",
      phone: "+447911122233",
      nationality: "Indian",
      destination: "spain",
      priorVisas: "1",
      channel: "WhatsApp",
      comment: "I have flights booked for Sep 20. Need Schengen visa slot appointments quickly.",
      plan: "Complete Visa Service (£175)",
      priorityUpgrade: true
    },
    {
      name: "Sarah Connor",
      email: "sconnor@cyberdyne.org",
      phone: "+447988877766",
      nationality: "American",
      destination: "france",
      priorVisas: "None",
      channel: "Email",
      comment: "Spouse of UK citizen. Need documentation review and file drafting.",
      plan: "Documentation Service (£95)",
      priorityUpgrade: false
    },
    {
      name: "Carlos Santana",
      email: "carlos.guitar@yahoo.com",
      phone: "+447566655544",
      nationality: "Mexican",
      destination: "germany",
      priorVisas: "3+",
      channel: "Call",
      comment: "Frequent traveler. Assured appointment booking required.",
      plan: "Appointment Booking Service (£95)",
      priorityUpgrade: true
    }
  ];

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

    try {
      // 1. Ensure table exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS lead_submissions (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          payload JSONB
        );
      `);

      // 2. Insert dummy leads
      for (const lead of dummyLeads) {
        await client.query(
          "INSERT INTO lead_submissions (payload) VALUES ($1);",
          [JSON.stringify(lead)]
        );
      }
    } finally {
      await client.end();
    }

    return NextResponse.json({
      success: true,
      message: `${dummyLeads.length} dummy lead submissions seeded successfully.`
    });

  } catch (err: any) {
    console.error("Dummy leads seeding error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to seed dummy leads" },
      { status: 500 }
    );
  }
}
