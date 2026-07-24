export function trackEvent(name: string, data?: any) {
  if (typeof window !== "undefined") {
    console.log(`[Analytics EVENT: ${name}]`, data || "");
    // Future integrations (e.g. Meta Pixel / Google Tag Manager) can be added here
  }
}

export function trackPageView(url: string) {
  trackEvent("PageView", { url });
}

export function trackViewContent(country: string) {
  trackEvent("ViewContent", { content_name: country, content_category: "Schengen Visa Country Page" });
}

export function trackLead(email: string, details?: any) {
  trackEvent("Lead", { email, ...details });
}

export function trackContact(method: "WhatsApp" | "Phone") {
  trackEvent("Contact", { method });
}

export function trackFormAbandon(step: number, fieldName: string) {
  trackEvent("FormAbandon", { step, last_focused_field: fieldName });
}
