/**
 * Authentication & Access Control Helpers
 */

export function isAgentAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const session = localStorage.getItem("qh-agent-session");
    return session === "authenticated";
  } catch {
    return false;
  }
}

export function getAuthenticatedAgentUsername(): string | null {
  if (!isAgentAuthenticated()) return null;
  try {
    return localStorage.getItem("qh-agent-username") || "agent";
  } catch {
    return null;
  }
}
