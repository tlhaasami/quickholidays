import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { knowledgeBase } from "@/rag/documents";
import { RAG_CONFIG } from "@/rag/config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Security guard: Only allow in development or if valid admin token is provided
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const isDev = process.env.NODE_ENV === "development";
  const adminToken = process.env.ADMIN_SEED_TOKEN;

  if (!isDev && (!adminToken || token !== adminToken)) {
    return NextResponse.json(
      { error: "Unauthorized access: Seeding is blocked in production unless a valid token is provided" },
      { status: 401 }
    );
  }

  const dbPassword = process.env.DB_PASSWORD;

  if (!dbPassword) {
    return NextResponse.json(
      { error: "DB_PASSWORD env variable is not set" },
      { status: 500 }
    );
  }

  // Helper to generate embedding using Cohere API
  const generateEmbedding = async (text: string) => {
    const cohereKey = process.env.COHERE_API_KEY;
    if (!cohereKey) {
      throw new Error("COHERE_API_KEY env variable is not configured");
    }

    const response = await fetch(RAG_CONFIG.COHERE_EMBED_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cohereKey}`
      },
      body: JSON.stringify({
        texts: [text],
        model: RAG_CONFIG.EMBEDDING_MODEL,
        input_type: "search_document"
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cohere Embedding API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    if (data.embeddings && data.embeddings.length > 0) {
      return data.embeddings[0] as number[];
    }
    throw new Error("No embeddings returned by Cohere");
  };

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

  try {
    console.log("Connecting to database...");
    await client.connect();

    // 1. DDL Setup migrations (Runs automatically if table does not exist)
    console.log("Applying migrations (384 dimensions)...");
    await client.query("create extension if not exists vector;");
    
    // Drop existing table if it was previously created with 768 dimensions
    await client.query("drop table if exists documents cascade;");
    
    await client.query(`
      create table documents (
        id uuid default gen_random_uuid() primary key,
        content text not null,
        metadata jsonb,
        embedding vector(384)
      );
    `);
    
    await client.query(`
      create index if not exists documents_embedding_hnsw_idx 
        on documents 
        using hnsw (embedding vector_cosine_ops);
    `);
    
    await client.query(`
      create or replace function match_documents (
        query_embedding vector(384),
        match_threshold float,
        match_count int
      )
      returns table (
        id uuid,
        content text,
        metadata jsonb,
        similarity float
      )
      language plpgsql
      as $$
      begin
        return query
        select
          documents.id,
          documents.content,
          documents.metadata,
          1 - (documents.embedding <=> query_embedding) as similarity
        from documents
        where 1 - (documents.embedding <=> query_embedding) > match_threshold
        order by documents.embedding <=> query_embedding
        limit match_count;
      end;
      $$;
    `);

    // 2. Clear existing entries
    console.log("Clearing documents table...");
    await client.query("delete from documents;");

    // 3. Generate embeddings and seed database
    console.log("Generating embeddings and seeding...");
    const seeded = [];
    for (const doc of knowledgeBase) {
      const embedding = await generateEmbedding(doc.content);
      const vectorString = `[${embedding.join(",")}]`;
      
      await client.query(
        "insert into documents (content, metadata, embedding) values ($1, $2, $3::vector);",
        [doc.content, JSON.stringify(doc.metadata), vectorString]
      );

      seeded.push(doc.content.substring(0, 35) + "...");
    }

    return NextResponse.json({
      success: true,
      message: `Database schema created (384 dims) and ${seeded.length} documents seeded successfully.`,
      seeded,
    });
  } catch (error: any) {
    console.error("Setup/Seeding error:", error);
    return NextResponse.json(
      { error: error.message || "Database configuration failed" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}
