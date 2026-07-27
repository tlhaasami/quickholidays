"use client";

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  phone: string;
  whatsappUrl: string;
  address: string;
  companyNumber: string;
  promoText: string;
}

export const defaultSiteConfig: SiteConfig = {
  heroTitle: "Quick Holidays",
  heroSubtitle: "Schengen Visa Consulting",
  heroDescription: "Quick Holidays is a UK-based Schengen visa consultancy trusted by hundreds of non-UK nationals — BRP holders, spouse, work, and student visa holders — who need expert, honest help securing their European tourist visas. No hidden fees, no guesswork, just results.",
  phone: "+44 7828 707425",
  whatsappUrl: "https://wa.me/447828707425?text=Hi,%20I'd%20like%20to%20get%20help%20with%20my%20Schengen%20visa%20application.",
  address: "Office 25 Innovation Park, Edge Lane, Liverpool, England, L7 9NN",
  companyNumber: "15948457",
  promoText: "avail 35% Discount now"
};

export function getSiteConfig(): SiteConfig {
  if (typeof window === "undefined") {
    return defaultSiteConfig;
  }
  
  try {
    const config: Partial<SiteConfig> = {};
    const keys: (keyof SiteConfig)[] = [
      "heroTitle", "heroSubtitle", "heroDescription", "phone", "whatsappUrl", "address", "companyNumber", "promoText"
    ];
    
    let hasSaved = false;
    for (const key of keys) {
      const val = localStorage.getItem(`site_${key}`);
      if (val) {
        config[key] = val;
        hasSaved = true;
      }
    }
    
    return hasSaved ? { ...defaultSiteConfig, ...config } : defaultSiteConfig;
  } catch (e) {
    return defaultSiteConfig;
  }
}

export function saveSiteConfig(config: SiteConfig) {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem("site_heroTitle", config.heroTitle);
    localStorage.setItem("site_heroSubtitle", config.heroSubtitle);
    localStorage.setItem("site_heroDescription", config.heroDescription);
    localStorage.setItem("site_phone", config.phone);
    localStorage.setItem("site_whatsappUrl", config.whatsappUrl);
    localStorage.setItem("site_address", config.address);
    localStorage.setItem("site_companyNumber", config.companyNumber);
    localStorage.setItem("site_promoText", config.promoText);
    
    // Dispatch storage event to notify other open tabs / components
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Failed to save site config to localStorage", e);
  }
}
