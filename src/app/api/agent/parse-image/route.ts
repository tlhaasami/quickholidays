import { NextRequest, NextResponse } from "next/server";
import { RAG_CONFIG } from "@/rag/config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const groqKey = process.env.GROQ_API_KEY;

  if (!groqKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY env variable is not configured" },
      { status: 500 }
    );
  }

  try {
    const { image } = await req.json();

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Base64 image string is required" }, { status: 400 });
    }

    // Verify it is a valid base64 data URL
    if (!image.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image format. Must be a base64 image data URL." }, { status: 400 });
    }

    const messages = [
      {
        role: "system",
        content: `You are an expert OCR administrative assistant for Quick Holidays Ltd. Your job is to extract details from scanned images of passports or BRP (Biometric Residence Permit) cards and return them in a structured JSON format.
        
You must output a JSON object matching this schema. Set any fields that cannot be read from the document to null:
{
  "personal_surname": string or null (Surname/Family Name),
  "personal_first_names": string or null (Given/First Names),
  "personal_dob": string or null (YYYY-MM-DD Date of birth),
  "personal_pob": string or null (Place of birth),
  "personal_cob": string or null (Country of birth),
  "personal_nationality": string or null (e.g. 'INDIAN'),
  "personal_sex": string or null ('MALE' or 'FEMALE' or 'OTHER'),
  "passport_number": string or null (Passport number),
  "passport_issue_date": string or null (YYYY-MM-DD),
  "passport_expiry_date": string or null (YYYY-MM-DD),
  "uk_share_code": string or null (Extract share code if present on the document),
  "uk_share_code_expiry": string or null (Extract BRP card expiry date if present)
}`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Read the attached document image and output only a valid JSON object matching the schema."
          },
          {
            type: "image_url",
            image_url: {
              url: image
            }
          }
        ]
      }
    ];

    const chatRes = await fetch(RAG_CONFIG.GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        messages,
        model: "qwen/qwen3.6-27b",
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
    });

    if (!chatRes.ok) {
      const errText = await chatRes.text();
      throw new Error(`Groq Vision API failed: ${chatRes.status} - ${errText}`);
    }

    const chatData = await chatRes.json();
    const content = chatData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No OCR output returned from Groq Vision model.");
    }

    const parsed = JSON.parse(content.trim());
    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("Agent document vision parser error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
