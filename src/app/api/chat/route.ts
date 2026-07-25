import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const groqKey = process.env.GROQ_API_KEY;
  const dbPassword = process.env.DB_PASSWORD;

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message query is required" }, { status: 400 });
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
    const embedUrl = "https://api.cohere.com/v1/embed";
    const embedRes = await fetch(embedUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cohereKey}`
      },
      body: JSON.stringify({
        texts: [message],
        model: "embed-english-light-v3.0",
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
      user: process.env.DB_USER || "postgres.ehlqrvjorayhofbttnfw",
      host: process.env.DB_HOST || "aws-0-ap-southeast-1.pooler.supabase.com",
      database: "postgres",
      password: dbPassword,
      port: parseInt(process.env.DB_PORT || "6543"),
      ssl: {
        rejectUnauthorized: false
      }
    });

    let matchedDocuments: any[] = [];
    try {
      await client.connect();
      const matchThreshold = 0.3;
      const matchCount = 4;
      
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
    const systemPrompt = `You are the Quick Holidays Schengen Visa AI Assistant, a friendly and professional visa consultancy expert. Your job is to answer questions about Schengen visa rules, documents, and our services.

CRITICAL RULE FOR RELEVANCY AND CONTEXT LIMITATION:
You can ONLY answer questions related to Schengen visas, requirements, consulates, application steps, and Quick Holidays services.
If the user's question is completely unrelated to Schengen visas, travel rules, or our business services (e.g. general programming, history, math, unrelated chat, random jokes, other countries outside Europe), you MUST start your response exactly with the prefix "[INVALID]" followed by a polite explanation that you can only answer Schengen visa-related questions.
Do not bypass this rule. Example of invalid query response: "[INVALID] I'm sorry, but I can only answer questions related to Schengen visas, consulates, and our services."

If the user's question is a valid Schengen visa question but is not directly answered in the verified context below, you may answer it accurately using your general Schengen visa knowledge, but do NOT start with [INVALID]. Only use [INVALID] for queries that are completely out-of-scope.

Always follow these rules:
- Be polite, professional, and clear.
- Keep your response extremely short and concise (maximum 1-2 brief sentences).
- Do not make up facts.
- Mention our "Accountability Promise" (refund on document error) if they ask about trust or rejections.
- If they ask about services, refer to our "Complete Visa Service" (£175), "Documentation Service" (£95), and "Appointment Booking Service" (£95).

VERIFIED SITE CONTEXT:
${contextText}

USER QUESTION:
${message}

AI ASSISTANT RESPONSE:`;

    // 5. Query Groq completions API to Generate Answer
    const chatUrl = "https://api.groq.com/openai/v1/chat/completions";
    const chatRes = await fetch(chatUrl, {
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
        model: "llama-3.3-70b-versatile",
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
    const formattedReply = `${cleanGenerated}\n\nIf you want details ask me or you can call us on our WhatsApp or drop a message, we'll contact you in working hours.`;

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
