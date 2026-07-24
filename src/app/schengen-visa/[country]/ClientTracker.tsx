"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/analytics";

export function ClientTracker({ countryName }: { countryName: string }) {
  useEffect(() => {
    trackViewContent(countryName);
  }, [countryName]);

  return null;
}
