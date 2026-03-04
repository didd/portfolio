"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail, Github, Linkedin, Copy, Check } from "lucide-react";
import { Toast } from "@/components/ui/toast";
import { trackEvent, trackLinkClick } from "@/lib/analytics";

const contactRows = [
  {
    label: "Email",
    value: "contact@diddtuni.dev",
    href: "mailto:contact@diddtuni.dev",
    icon: Mail,
    copyValue: "contact@diddtuni.dev",
  },
  {
    label: "GitHub",
    value: "github.com/didd",
    href: "https://github.com/didd",
    icon: Github,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/didd",
    href: "https://linkedin.com/in/didd",
    icon: Linkedin,
  },
];

export function ContactLinks() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(text);
    trackEvent("click", {
      event_category: "contact",
      event_label: "email_copied",
      value: 1,
    });
    if (copyResetTimerRef.current) {
      clearTimeout(copyResetTimerRef.current);
    }
    copyResetTimerRef.current = setTimeout(() => {
      setCopiedValue(null);
      copyResetTimerRef.current = null;
    }, 2000);
  }, []);

  return (
    <>
      <dl
        aria-label="Contact information"
        className="flex flex-col gap-px bg-p-border border border-p-border rounded-2xl lg:rounded-none overflow-hidden"
      >
        {contactRows.map((row) => {
          const isExternal = row.href?.startsWith("http");
          const Icon = row.icon;
          const copyableValue = row.copyValue || row.value;

          return (
            <div
              key={row.label}
              className="group flex items-center px-5 py-[1.1rem] bg-p-bg2 gap-4 hover:bg-p-bg3 transition-colors duration-200"
              data-analytics={`contact-${row.label.toLowerCase()}`}
            >
              <Icon
                aria-hidden="true"
                className="size-4 shrink-0 text-p-accent/70 group-hover:text-p-accent transition-colors duration-200"
              />

              <dt className="text-[0.62rem] font-semibold tracking-widest uppercase text-p-text3 min-w-18">
                {row.label}
              </dt>

              <dd className="text-[0.85rem] text-p-text flex-1 m-0">
                {row.href ? (
                  <a
                    href={row.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    onClick={() => {
                      trackLinkClick(
                        row.href,
                        `contact_${row.label.toLowerCase()}`,
                      );
                    }}
                    aria-label={
                      isExternal
                        ? `${row.label}: ${row.value} (opens in new tab)`
                        : `${row.label}: ${row.value}`
                    }
                    className="text-p-text no-underline hover:text-p-accent transition-colors duration-200"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>

              <span
                aria-hidden="true"
                className="text-p-accent flex items-center"
              >
                {row.copyValue ? (
                  <button
                    onClick={() => handleCopy(copyableValue)}
                    aria-label={`Copy ${row.label}: ${row.value}`}
                    className="inline-flex items-center justify-center rounded-md p-1 hover:bg-p-accent/10 transition-colors duration-200"
                  >
                    {copiedValue === copyableValue ? (
                      <Check className="size-4 opacity-100" />
                    ) : (
                      <Copy className="size-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ) : row.href ? (
                  <a
                    href={row.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    onClick={() => {
                      trackLinkClick(
                        row.href,
                        `contact_${row.label.toLowerCase()}`,
                      );
                    }}
                    aria-label={
                      isExternal
                        ? `Open ${row.label}: ${row.value} (opens in new tab)`
                        : `Open ${row.label}: ${row.value}`
                    }
                    className="inline-flex items-center justify-center rounded-md p-1 hover:bg-p-accent/10 transition-colors duration-200"
                  >
                    <ArrowUpRight className="size-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <span className="text-p-text3">—</span>
                )}
              </span>
            </div>
          );
        })}
      </dl>

      {copiedValue && <Toast message="Copied to clipboard!" duration={2000} />}
    </>
  );
}
