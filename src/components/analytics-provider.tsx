"use client";

import { useAnalytics } from "@/lib/analytics";

/**
 * Analytics provider - call this once at the root to initialize Google Analytics
 */
export function AnalyticsProvider() {
  useAnalytics();
  return null;
}
