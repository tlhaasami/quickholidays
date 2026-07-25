import { NextResponse } from "next/server";
import { Client } from "pg";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbPassword = process.env.DB_PASSWORD;

  if (!dbPassword) {
    return NextResponse.json(
      { error: "DB_PASSWORD env variable is not set" },
      { status: 500 }
    );
  }

  // Define our Schengen visa knowledge base chunks
  const knowledgeBase = [
    // Trust & Verification FAQs
    {
      content: "Is Quick Holidays Ltd a registered company in the UK? Yes, Quick Holidays Ltd is registered in England & Wales with Companies House Number 15948457. You can verify our record on the official UK government company registry.",
      metadata: { category: "Trust & Verification", type: "faq" }
    },
    {
      content: "Do you guarantee that my visa will be approved? No agency can guarantee visa approval, as consulates and embassies make all decisions. However, we back our document checking with our Accountability Promise: if your visa is rejected due to a documentation error we made, we refund our service fee in full.",
      metadata: { category: "Trust & Verification", type: "faq" }
    },
    {
      content: "Are my passport and documents kept secure? Yes. We handle document audits digitally through encrypted database entries and secure servers. We never keep your physical passport. You take your physical passport to the VFS or TLS contact center on your biometrics date.",
      metadata: { category: "Trust & Verification", type: "faq" }
    },
    {
      content: "Where is your physical office located? Quick Holidays Ltd is located at Office 25 Innovation Park, Edge Lane, Liverpool, England, L7 9NN.",
      metadata: { category: "Trust & Verification", type: "faq" }
    },

    // The Visa Process FAQs
    {
      content: "How long does a Schengen visa take to be processed? Typically, consulates take 15 calendar days from the date of your biometrics appointment to return a decision. Processing can take up to 30 or 45 days during peak seasons (May to August). Slot tracking and booking can also take time, so we recommend starting 6-8 weeks before your trip.",
      metadata: { category: "Visa Process", type: "faq" }
    },
    {
      content: "What happens during the biometrics appointment? You must attend the appointment center (VFS Global or TLScontact in London, Manchester, or Edinburgh) in person. They will capture your fingerprints and facial photograph, collect your prepared application forms and files, and keep your passport for processing.",
      metadata: { category: "Visa Process", type: "faq" }
    },
    {
      content: "I've had a Schengen visa refusal before. Can I reapply? Yes. We inspect your refusal letter to find the embassy's exact concerns, audit your files, and draft custom cover letters clarifying bank funds, UK ties, or trip itineraries to strengthen your reapplication.",
      metadata: { category: "Visa Process", type: "faq" }
    },

    // Fees & Payments FAQs
    {
      content: "What is the breakdown of Schengen visa fees? (1) Embassy fee (standard €90 for adults, €45 for kids 6-12), (2) Outsourcing booking fee (typically £30-£45 paid directly to VFS/TLS), and (3) Our service fee which covers checklists, cover letters, forms, and automated booking tracking.",
      metadata: { category: "Fees & Payments", type: "faq" }
    },
    {
      content: "What does my deposit cover? Your deposit of £100 starts your case: document assessment, custom checklist, cover letter preparation, and active appointment slot tracking. The remaining balance of £75 is only due once your appointment is secured and confirmed.",
      metadata: { category: "Fees & Payments", type: "faq" }
    },
    {
      content: "How does the Accountability Promise refund work? If your application is rejected because of a documented error on our side (e.g. incorrect form detail or missing requested checklist file), we refund our full service fee (up to £175 depending on your tier) within 5 working days.",
      metadata: { category: "Fees & Payments", type: "faq" }
    },

    // Documents FAQs
    {
      content: "What are the core documents required for a Schengen visa? Standard requirements for UK BRP holders: (1) Passport valid for 3+ months beyond your return, (2) UK Resident Permit (BRP) valid for 3+ months, (3) Travel insurance (covering €30k+ medical evacuation), (4) Employment details (contract/payslips), (5) 3 months of bank statements showing sufficient funds, and (6) Flights & hotel reservations.",
      metadata: { category: "Documents", type: "faq" }
    },
    {
      content: "Can you help me get flights and hotels? Yes, we compile reservation itineraries (refundable flights and pay-at-property hotels) compliant with embassy guidelines. This ensures you do not buy non-refundable tickets before your visa is approved.",
      metadata: { category: "Documents", type: "faq" }
    },

    // Service Tiers & Packages
    {
      content: "1. Complete Visa Service\nOriginal Price: £270 | Discounted Price: £175\nEverything handled. Start to finish. Nothing left for you to figure out. This is our premium, end-to-end service designed for maximum peace of mind. We take over the entire process so you can focus on planning your trip, knowing every detail is managed by professionals. One price. Every step covered.\nWhat is Included:\n- Free Consultation: Cost, checklist, and timeline assessment provided before you pay.\n- Custom Document Checklist: Built perfectly for your exact situation and profile.\n- Professional Cover Letter: Written for you to present a compelling and accurate itinerary to the embassy.\n- Visa Application Forms: Completed for you to ensure zero errors.\n- Travel Insurance: Sorted and guaranteed to meet Schengen requirements.\n- Appointment Booking & Confirmation: Your appointment is booked and confirmed, with your letter ready.\n- Flights & Hotels: Refundable options booked in your name. No markup. No lock-in.\n- Tracked to Decision Day: Continuous monitoring of your application status.",
      metadata: { category: "Pricing Tiers", type: "service" }
    },
    {
      content: "2. Documentation Service\nOriginal Price: £145 | Discounted Price: £95\nYour paperwork, done right — you handle the appointment yourself. This package is ideal if you already have an appointment booked or prefer to manage the portal yourself, but want the assurance that your file is flawless.\nWhat is Included:\n- Document Checklist: Built precisely for your personal and financial profile.\n- Professional Cover Letter: Expertly written for you.\n- Travel Insurance: Sorted for your exact travel dates.\n- Flights & Hotels: Refundable options booked in your name without financial risk.\nWhat is NOT Included:\n- Appointment booking.\n- Visa application form completion.",
      metadata: { category: "Pricing Tiers", type: "service" }
    },
    {
      content: "3. Appointment Booking Service\nOriginal Price: £145 | Discounted Price: £95\nAlready have your documents ready? This is for you. Appointment slots disappear in seconds. With this service, our processing team uses their continuous monitoring systems to secure your spot without the headache. Fast, simple, done.\nWhat is Included:\n- Appointment Booking: Secured and confirmed at your preferred centre.\n- Visa Application Form: Completed for you accurately.",
      metadata: { category: "Pricing Tiers", type: "service" }
    },

    // Refund Policy
    {
      content: "Refund & Cancellation Policy details: Case deposit of £100 starts document compiling. Fully refundable if you cancel before we start work. Non-refundable once work starts. The remaining service balance of £75 is due once appointment slots are confirmed. Complete service fees are fully covered by our Accountability Promise refund in case of our document errors.",
      metadata: { category: "Refund Policy", type: "policy" }
    },

    // General Schengen Rules
    {
      content: "Embassy Variations: Document requirements and biometrics timelines vary by destination consulate. We confirm your exact checklist and timelines at your free consultation before you pay.",
      metadata: { category: "Schengen Visa", type: "general" }
    },
    {
      content: "BRP Holder Travel Rules: Non-UK nationals residing in the UK on a BRP (spouse, work, or student visa) must obtain a Schengen visa for short stays in Europe. Your BRP must remain valid for at least 3 months after your intended return to the UK.",
      metadata: { category: "Schengen Visa", type: "general" }
    }
  ];

  // Helper to generate embedding using Cohere API
  const generateEmbedding = async (text: string) => {
    const cohereKey = process.env.COHERE_API_KEY;
    if (!cohereKey) {
      throw new Error("COHERE_API_KEY env variable is not configured");
    }

    const url = "https://api.cohere.com/v1/embed";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cohereKey}`
      },
      body: JSON.stringify({
        texts: [text],
        model: "embed-english-light-v3.0",
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
    user: process.env.DB_USER || "postgres.ehlqrvjorayhofbttnfw",
    host: process.env.DB_HOST || "aws-0-ap-southeast-1.pooler.supabase.com",
    database: "postgres",
    password: dbPassword,
    port: parseInt(process.env.DB_PORT || "6543"),
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
