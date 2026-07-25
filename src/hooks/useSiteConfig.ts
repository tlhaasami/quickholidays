"use client";

import { useState, useEffect } from "react";
import { getSiteConfig, defaultSiteConfig, SiteConfig } from "@/utils/siteConfig";

export function useSiteConfig(): SiteConfig {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);

  useEffect(() => {
    // Read from localStorage on mount
    setConfig(getSiteConfig());

    // Listen for storage change events to sync changes instantly
    const handleStorage = () => {
      setConfig(getSiteConfig());
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return config;
}
