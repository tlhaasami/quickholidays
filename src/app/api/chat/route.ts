import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { RAG_CONFIG } from "@/rag/config";
import { getSystemPrompt } from "@/rag/prompt";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const groqKey = process.env.GROQ_API_KEY;
  const dbPassword = process.env.DB_PASSWORD;

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message query is required" }, { status: 400 });
    }

    if (message.length > 1000) {
      return NextResponse.json({ error: "Message exceeds character limit of 1000 characters" }, { status: 400 });
    }

    if (!groqKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY env variable is not configured" },
        { status: 500 }
      );
    }

    if (!dbPassword) {
      return NextResponse.json(
        { error: "DB_PASSWORD env variable is not configured" },
        { status: 500 }
      );
    }

    const cohereKey = process.env.COHERE_API_KEY;
    if (!cohereKey) {
      return NextResponse.json(
        { error: "COHERE_API_KEY env variable is not configured" },
        { status: 500 }
      );
    }

    // 1. Generate Query Vector Embedding using Cohere API
    const embedRes = await fetch(RAG_CONFIG.COHERE_EMBED_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cohereKey}`
      },
      body: JSON.stringify({
        texts: [message],
        model: RAG_CONFIG.EMBEDDING_MODEL,
        input_type: "search_query"
      }),
    });

    if (!embedRes.ok) {
      const errText = await embedRes.text();
      throw new Error(`Embedding failed: ${embedRes.status} - ${errText}`);
    }

    const embedData = await embedRes.json();
    if (!embedData.embeddings || embedData.embeddings.length === 0) {
      throw new Error("No embeddings returned by Cohere");
    }
    const query_embedding = embedData.embeddings[0] as number[];

    // 2. Query Postgres Vector DB directly using pg Client
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

    let matchedDocuments: any[] = [];
    try {
      await client.connect();
      const matchThreshold = RAG_CONFIG.MATCH_THRESHOLD;
      const matchCount = RAG_CONFIG.MATCH_COUNT;

      const query = `
        select content, metadata, 1 - (embedding <=> $1::vector) as similarity 
        from documents 
        where 1 - (embedding <=> $1::vector) > $2 
        order by embedding <=> $1::vector 
        limit $3;
      `;

      const queryVectorString = `[${query_embedding.join(",")}]`;
      const res = await client.query(query, [queryVectorString, matchThreshold, matchCount]);
      matchedDocuments = res.rows;
    } catch (dbErr) {
      console.error("Direct Database query error:", dbErr);
      // Fallback: continue with empty context if database fails
    } finally {
      await client.end();
    }

    // 3. Construct context from matching chunks
    const contextText = matchedDocuments && matchedDocuments.length > 0
      ? matchedDocuments.map((doc: any) => `- ${doc.content}`).join("\n")
      : "No specific local documentation found.";

    // 4. Construct System Prompt + User Query (with Strict Relevance Check)
    const systemPrompt = getSystemPrompt(contextText, message);

    // 5. Query Groq completions API to Generate Answer
    const chatRes = await fetch(RAG_CONFIG.GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: systemPrompt,
          },
        ],
        model: RAG_CONFIG.CHAT_MODEL,
        temperature: 0.25,
        max_tokens: 600
      }),
    });

    if (!chatRes.ok) {
      const errText = await chatRes.text();
      throw new Error(`Groq completions API failed: ${chatRes.status} - ${errText}`);
    }

    const chatData = await chatRes.json();
    const generatedText = (chatData.choices?.[0]?.message?.content || "I'm sorry, I am currently unable to process your request. Please try again or book a free consultation.").trim();

    const cleanGenerated = generatedText.replace("[INVALID]", "").trim();
    const formattedReply = cleanGenerated;

    // Check if the AI marked this query as invalid/out-of-scope
    if (generatedText.startsWith("[INVALID]")) {
      return NextResponse.json({
        text: formattedReply,
        isValid: false
      });
    }

    return NextResponse.json({
      text: formattedReply,
      isValid: true
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
