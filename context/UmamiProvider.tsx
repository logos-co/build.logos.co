"use client";

import { type ReactNode } from "react";
import Script from "next/script";

const scriptSrc =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim();

const websiteId =
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

const dataDomains = (() => {
  const fromEnv = process.env.NEXT_PUBLIC_UMAMI_DATA_DOMAINS?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") return undefined;
  return "build.logos.co";
})();

/**
 * Fire a custom Umami event. Safe to call before the script loads.
 */
export function trackEvent(name: string, data: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && window.umami) {
    window.umami.track(name, data);
  }
}

/**
 * Loads the Umami analytics script. SPA pageviews are tracked automatically
 * by the script (it hooks into history.pushState), so no extra listener needed.
 */
export function UmamiProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {scriptSrc && websiteId && (
        <Script
          strategy="afterInteractive"
          src={scriptSrc}
          data-website-id={websiteId}
          data-domains={dataDomains}
        />
      )}
      {children}
    </>
  );
}
