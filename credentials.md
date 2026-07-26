# Quick Holidays - Employee Portal Credentials

This document lists the default seeded credentials for the **Quick Holidays Portal** workspaces.

> [!WARNING]
> These credentials are local development defaults initialized in the browser's `localStorage` (key: `qh-agent-accounts`).

## Portal Accounts Directory

| Username | Default Password / Access Code | Account Type / Mode | Permissions Profile |
| :--- | :--- | :--- | :--- |
| `@admin` | `admin123` | **System Administrator** | Full access to portal settings, user creations, directory list edits, credential edits, and manual suspensions/deletions. |
| `@owner` | `owner123` | **Owner Mode** | Full access to accounts directory list, credential edits, manual suspensions/deletions. *Note: User profile creation is restricted.* |
| `@agent` | `agent123` | **Agent** | Normal access to the 3-column Schengen Visa Form parser assistant workspace. |

## Security & Anti-Brute-Force Lockout Rules

To protect the portal from brute force and automated attacks:
1. **Username lockouts**: 10 consecutive failed login attempts on any individual username automatically suspends the profile. The administrator or owner must manually activate it in the Control Center.
2. **IP Address lockouts**: 10 consecutive failed attempts from the same client IP address locks out all login requests from that IP globally, displaying a network restriction warning.
3. **Login Audit Trail**: Every authentication attempt is logged in detail under the `qh-login-audit-logs` registry, including username, client IP, timestamp, and status.
