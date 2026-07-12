import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, nationality, city, pastVisas, responsePreferred } = body;

    // Server-side validation
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json({ error: "Full Name is required." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      nationality: nationality ? nationality.trim() : "",
      city: city ? city.trim() : "",
      pastVisas: pastVisas ? pastVisas.trim() : "",
      responsePreferred: responsePreferred || "Not specified",
      submittedAt: new Date().toISOString()
    };

    console.log("Contact Us Form Submission received:", payload);

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      console.log("Forwarding submission to webhook:", webhookUrl);
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.error(`Webhook returned status ${response.status}: ${await response.text()}`);
        } else {
          console.log("Successfully forwarded to webhook.");
        }
      } catch (err) {
        console.error("Failed to call webhook:", err);
      }
    } else {
      console.warn("CONTACT_WEBHOOK_URL is not set. Submission logged locally only.");
    }

    return NextResponse.json({ success: true, message: "Consultation booked successfully!" });
  } catch (error) {
    console.error("Error processing contact submission:", error);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
