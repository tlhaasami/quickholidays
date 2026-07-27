# Quick Holidays - Official Production Credentials

This document lists the official production accounts, high-entropy passwords, and server-wide authentication details for the **Quick Holidays Portal**.

---

## 1. Production Credentials Directory

| Username | Production Password | Account Role | Global Permissions |
| :--- | :--- | :--- | :--- |
| **`@owner`** | `QH_Owner#2026!Secured89` | **Owner** | Master portal account with full administration & control privileges. |
| **`@admin`** | `QH_Admin#2026!Master74` | **System Administrator** | Access to portal administration, user management, and audit registries. |
| **`@tlhaasami`** | `QH_Agent#2026!Talha92` | **Agent** | Active agent account for Schengen Visa Application and Cover Letter workspaces. |

---

## 2. Server-Wide Global Password Persistence

- **Global Production Sync**: Password changes made inside the portal (`Change Access Code`) are submitted to `/api/agent/auth` and saved **server-wide**, immediately applying to all production sessions, devices, and browsers.
- **10-Attempt Lockout**: 10 consecutive failed login attempts automatically lock out the username.
- **12-Hour IP Suspension**: 10 failed login attempts from a single IP temporarily suspend login requests from that IP address.
