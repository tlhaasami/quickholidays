import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// GET: Fetch current server-side accounts from Supabase Auth
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const fullAccounts: Record<string, { password: string; suspended: boolean; role: string }> = {};
    const safeAccounts: Record<string, { suspended: boolean; role: string }> = {};

    data.users.forEach(u => {
      const username = u.user_metadata?.username || u.email?.split("@")[0] || "";
      if (username) {
        const userInfo = {
          password: "••••••••", // Password is masked on client, handled by Supabase Auth
          suspended: u.user_metadata?.suspended || false,
          role: u.user_metadata?.role || "agent"
        };
        fullAccounts[username] = userInfo;
        safeAccounts[username] = { suspended: userInfo.suspended, role: userInfo.role };
      }
    });

    return NextResponse.json({ success: true, accounts: safeAccounts, fullAccounts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Server error" }, { status: 500 });
  }
}

// POST: Handles global login authentication, password changes & account management
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, username, password, oldPassword, newPassword, targetUser, suspendState } = body;
    const userClean = (username || "").trim().toLowerCase();

    // 1. Login Authentication via Supabase Auth
    if (action === "login") {
      const email = `${userClean}@quickholidays.co.uk`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.user) {
        return NextResponse.json({ success: false, error: "Invalid username or password." }, { status: 401 });
      }

      if (data.user.user_metadata?.suspended) {
        return NextResponse.json({ success: false, error: `Access Denied: The account "${username}" has been suspended.` }, { status: 403 });
      }

      const role = data.user.user_metadata?.role || "agent";
      return NextResponse.json({ success: true, role, username: userClean });
    }

    // 2. Change Password via Supabase Auth
    if (action === "change_password") {
      const email = `${userClean}@quickholidays.co.uk`;
      
      // Verify the old password first by signing in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: oldPassword
      });

      if (authError || !authData.user) {
        return NextResponse.json({ success: false, error: "Existing password / access code is incorrect." }, { status: 400 });
      }

      // Update password using the Admin Client
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(authData.user.id, {
        password: newPassword
      });

      if (updateError) {
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: `Access code updated successfully for @${userClean} across all production sessions!` });
    }

    // 3. Admin / Owner Account Creation via Supabase Auth Admin client
    if (action === "create_account") {
      const newClean = (targetUser || "").trim().toLowerCase();
      if (!newClean || !newPassword) {
        return NextResponse.json({ success: false, error: "Username and password required." }, { status: 400 });
      }

      const email = `${newClean}@quickholidays.co.uk`;
      
      const { error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: newPassword,
        email_confirm: true,
        user_metadata: {
          role: "agent",
          username: newClean,
          suspended: false
        }
      });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: `Created new agent @${newClean} server-wide!` });
    }

    // 4. Admin / Owner Account Suspension Toggle via Supabase Auth metadata
    if (action === "toggle_suspend") {
      const targetClean = (targetUser || "").trim().toLowerCase();
      const email = `${targetClean}@quickholidays.co.uk`;

      const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) {
        return NextResponse.json({ success: false, error: listError.message }, { status: 500 });
      }

      const targetUserObj = usersData.users.find(u => u.email?.toLowerCase() === email);
      if (!targetUserObj) {
        return NextResponse.json({ success: false, error: "Target account not found." }, { status: 404 });
      }

      const existingMetadata = targetUserObj.user_metadata || {};
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUserObj.id, {
        user_metadata: {
          ...existingMetadata,
          suspended: suspendState
        }
      });

      if (updateError) {
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: `Updated suspension status for @${targetClean}` });
    }

    // 5. Admin / Owner Account Deletion via Supabase Auth Admin client
    if (action === "delete_account") {
      const targetClean = (targetUser || "").trim().toLowerCase();
      if (targetClean === "admin" || targetClean === "owner") {
        return NextResponse.json({ success: false, error: "Cannot delete system administration accounts." }, { status: 400 });
      }

      const email = `${targetClean}@quickholidays.co.uk`;

      const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) {
        return NextResponse.json({ success: false, error: listError.message }, { status: 500 });
      }

      const targetUserObj = usersData.users.find(u => u.email?.toLowerCase() === email);
      if (!targetUserObj) {
        return NextResponse.json({ success: false, error: "Target account not found." }, { status: 404 });
      }

      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(targetUserObj.id);
      if (deleteError) {
        return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: `Deleted account @${targetClean} server-wide!` });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Server authentication error" }, { status: 500 });
  }
}
