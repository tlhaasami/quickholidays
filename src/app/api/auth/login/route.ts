import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase/server";

// Simple in-memory rate-limiter map
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes block after 5 failed/total attempts in a short window

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "127.0.0.1";
  
  // Rate limiting check
  const now = Date.now();
  const attemptInfo = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
  
  // Reset if block duration has passed
  if (now - attemptInfo.lastAttempt > BLOCK_DURATION) {
    attemptInfo.count = 0;
  }
  
  if (attemptInfo.count >= MAX_ATTEMPTS) {
    const timeRemaining = Math.ceil((BLOCK_DURATION - (now - attemptInfo.lastAttempt)) / 1000 / 60);
    return NextResponse.json(
      { error: `Too many login attempts. Please try again in ${timeRemaining} minutes.` },
      { status: 429 }
    );
  }

  // Update last attempt timestamp
  attemptInfo.lastAttempt = now;
  loginAttempts.set(ip, attemptInfo);

  try {
    const { usernameOrEmail, password } = await request.json();

    if (!usernameOrEmail || !password) {
      return NextResponse.json({ error: "Username/Email and Password are required." }, { status: 400 });
    }

    const supabase = await createServer();
    let loginEmail = usernameOrEmail.trim();

    // If it's not a standard email, check if it's a username
    if (!loginEmail.includes("@")) {
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", loginEmail.toLowerCase())
        .maybeSingle();
      
      if (profileErr || !profile) {
        attemptInfo.count += 1;
        loginAttempts.set(ip, attemptInfo);
        return NextResponse.json({ error: "No account found with this username." }, { status: 400 });
      }
      loginEmail = profile.email;
    }

    // Sign in using Supabase Auth on the server
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: password,
    });

    if (authErr || !authData.user) {
      attemptInfo.count += 1;
      loginAttempts.set(ip, attemptInfo);
      return NextResponse.json({ error: authErr?.message || "Authentication failed." }, { status: 401 });
    }

    // Retrieve their dashboard role profile to verify status
    const { data: profile, error: dbErr } = await supabase
      .from("profiles")
      .select("name, username, role, status")
      .eq("id", authData.user.id)
      .single();

    if (dbErr || !profile) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "Failed to fetch user profile details." }, { status: 500 });
    }

    if (profile.status === "pending") {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "Access Pending: Awaiting Admin approval." }, { status: 403 });
    }

    if (profile.status === "suspended") {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "Account Suspended: Contact administrator." }, { status: 403 });
    }

    // Login successful - reset rate limit count
    attemptInfo.count = 0;
    loginAttempts.set(ip, attemptInfo);

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        name: profile.name,
        username: profile.username,
        email: loginEmail,
        role: profile.role,
        status: profile.status,
      }
    });

  } catch (error) {
    console.error("Login API route error:", error);
    return NextResponse.json({ error: "An unexpected error occurred during sign in." }, { status: 500 });
  }
}
