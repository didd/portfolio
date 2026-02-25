"use client";

import { ReactNode } from "react";
import { useScrollTracking } from "@/hooks/use-scroll-tracking";

interface PageContentProps {
  children: ReactNode;
}

/**
 * Client-side wrapper for page content
 * Initializes scroll tracking and other client-side analytics
 */
export function PageContent({ children }: PageContentProps) {
  useScrollTracking();
  return <>{children}</>;
}
