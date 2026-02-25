"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    if (this.props.onError) {
      this.props.onError(error);
    }
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full py-24 px-6 md:py-32" role="alert">
            <div className="mx-auto max-w-350 flex flex-col items-center justify-center gap-6 rounded-2xl border border-p-border/60 bg-linear-to-b from-p-bg to-p-bg2/40 px-8 py-16 md:px-12 md:py-24 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-white/6 dark:from-p-bg dark:to-p-bg2/20">
              
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-p-accent/10 dark:bg-p-accent/5">
                <svg
                  className="h-8 w-8 text-p-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4v2m-6.924-12A8.973 8.973 0 0112 2c4.97 0 9.185 3.364 9.924 8M4.076 22A8.973 8.973 0 0112 22c4.97 0 9.185-3.364 9.924-8"
                  />
                </svg>
              </div>

              
              <div className="space-y-2">
                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-p-text dark:text-white">
                  Unable to Load This Section
                </h3>
                <p className="text-base text-p-text2 dark:text-white/70">
                  We encountered an issue while loading this content.
                </p>
              </div>

              
              <div className="max-w-sm space-y-3 rounded-lg bg-p-bg2/50 px-4 py-3 border border-p-border/30 dark:bg-white/3 dark:border-white/6">
                <p className="text-sm leading-relaxed text-p-text3 dark:text-white/60">
                  This might be due to:
                </p>
                <ul className="text-left space-y-2 text-sm text-p-text3 dark:text-white/60">
                  <li className="flex gap-2">
                    <span className="text-p-accent">•</span>
                    <span>A temporary connection issue</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-p-accent">•</span>
                    <span>An external resource not loading properly</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-p-accent">•</span>
                    <span>Browser cache or cookies</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => window.location.reload()}
                  variant="default"
                  size="default"
                  className="rounded-lg"
                >
                  Refresh Page
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="default"
                  className="rounded-lg"
                >
                  <Link href="/">Go Home</Link>
                </Button>
              </div>

              <p className="text-sm text-p-text3/80 dark:text-white/60 pt-2 max-w-lg">
                If the problem persists, please try clearing your browser cache
                or disabling browser extensions that may interfere. For further
                assistance, email support at
                <a
                  href="mailto:contact@diddtuni.dev"
                  className="ml-2 inline-block font-medium text-p-accent underline"
                >
                  contact@diddtuni.dev
                </a>
                .
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
