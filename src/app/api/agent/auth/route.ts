import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Strong production passwords initialized as default server credentials
const DEFAULT_ACCOUNTS: Record<string, { password: string; suspended: boolean; role: string }> = {
  owner: { password: "QH_Owner#2026!Secured89", suspended: false, role: "owner" },
  admin: { password: "QH_Admin#2026!Master74", suspended: false, role: "admin" },
  tlhaasami: { password: "QH_Agent#2026!Talha92", suspended: false, role: "agent" }
};

// In-memory & file persistence path for global production server state
const STORAGE_FILE = path.join(process.cwd(), ".data_accounts.json");

function loadServerAccounts(): Record<string, { password: string; suspended: boolean; role: string }> {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const fileData = fs.readFileSync(STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(fileData);
      return { ...DEFAULT_ACCOUNTS, ...parsed };
    }
  } catch (err) {
    console.error("Failed reading server accounts file:", err);
  }
  return { ...DEFAULT_ACCOUNTS };
}

function saveServerAccounts(accounts: Record<string, { password: string; suspended: boolean; role: string }>) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(accounts, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed saving server accounts file:", err);
  }
}

// GET: Fetch current server-side accounts
export async function GET() {
  const accounts = loadServerAccounts();
  const safeAccounts: Record<string, { suspended: boolean; role: string }> = {};
  for (const [user, info] of Object.entries(accounts)) {
    safeAccounts[user] = { suspended: info.suspended, role: info.role };
  }
  return NextResponse.json({ success: true, accounts: safeAccounts, fullAccounts: accounts });
}

// POST: Handles global login authentication, password changes & account management
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, username, password, oldPassword, newPassword, targetUser, suspendState } = body;
    const accounts = loadServerAccounts();
    const userClean = (username || "").trim().toLowerCase();

    // 1. Production Login Authentication
    if (action === "login") {
      const account = accounts[userClean];
      if (!account) {
        return NextResponse.json({ success: false, error: "Invalid username or password." }, { status: 401 });
      }
      if (account.suspended) {
        return NextResponse.json({ success: false, error: `Access Denied: The account "${username}" has been suspended.` }, { status: 403 });
      }
      if (account.password !== password) {
        return NextResponse.json({ success: false, error: "Invalid username or password." }, { status: 401 });
      }
      return NextResponse.json({ success: true, role: account.role, username: userClean });
    }

    // 2. Global Password / Access Code Change (Updates server-wide across all production sessions)
    if (action === "change_password") {
      const account = accounts[userClean];
      if (!account) {
        return NextResponse.json({ success: false, error: "Account not found." }, { status: 404 });
      }
      if (account.password !== oldPassword) {
        return NextResponse.json({ success: false, error: "Existing password / access code is incorrect." }, { status: 400 });
      }
      accounts[userClean].password = newPassword;
      saveServerAccounts(accounts);
      return NextResponse.json({ success: true, message: `Access code updated successfully for @${userClean} across all production sessions!` });
    }

    // 3. Admin / Owner Account Creation
    if (action === "create_account") {
      const newClean = (targetUser || "").trim().toLowerCase();
      if (!newClean || !newPassword) {
        return NextResponse.json({ success: false, error: "Username and password required." }, { status: 400 });
      }
      accounts[newClean] = { password: newPassword, suspended: false, role: "agent" };
      saveServerAccounts(accounts);
      return NextResponse.json({ success: true, message: `Created new agent @${newClean} server-wide!` });
    }

    // 4. Admin / Owner Account Suspension Toggle
    if (action === "toggle_suspend") {
      const targetClean = (targetUser || "").trim().toLowerCase();
      if (accounts[targetClean]) {
        accounts[targetClean].suspended = suspendState;
        saveServerAccounts(accounts);
        return NextResponse.json({ success: true, message: `Updated suspension status for @${targetClean}` });
      }
      return NextResponse.json({ success: false, error: "Target account not found." }, { status: 404 });
    }

    // 5. Admin / Owner Account Deletion
    if (action === "delete_account") {
      const targetClean = (targetUser || "").trim().toLowerCase();
      if (targetClean === "admin" || targetClean === "owner") {
        return NextResponse.json({ success: false, error: "Cannot delete system administration accounts." }, { status: 400 });
      }
      if (accounts[targetClean]) {
        delete accounts[targetClean];
        saveServerAccounts(accounts);
        return NextResponse.json({ success: true, message: `Deleted account @${targetClean} server-wide!` });
      }
      return NextResponse.json({ success: false, error: "Target account not found." }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Server authentication error" }, { status: 500 });
  }
}
