"use client";
import { useEffect } from "react";
interface GtagEventData {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: string | number | boolean | undefined;
}
interface GtagInstance {
    (command: "config", targetId: string, config?: Record<string, unknown>): void;
    (command: "event", eventName: string, eventData?: GtagEventData): void;
    (command: "js", date: Date): void;
    (command: string, ...args: unknown[]): void;
}
interface WindowWithGtag extends Window {
    gtag?: GtagInstance;
    dataLayer?: unknown[];
}
type EventType = "click" | "page_view" | "scroll" | "form_submit" | "contact_submit" | "project_view" | "reference_view" | "theme_toggle" | "mobile_menu_toggle";
interface AnalyticsEventData extends GtagEventData {
    event_category: string;
    event_label: string;
    timestamp?: number;
}
function initializeGoogleAnalytics(measurementId: string): void {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
    const windowRef = window as WindowWithGtag;
    windowRef.dataLayer = windowRef.dataLayer || [];
    function gtag(...args: unknown[]): void {
        (windowRef.dataLayer as unknown[]).push(args);
    }
    windowRef.gtag = gtag as GtagInstance;
    gtag("js", new Date());
    gtag("config", measurementId);
}
function getGtag(): GtagInstance | null {
    const windowRef = window as WindowWithGtag;
    return windowRef.gtag || null;
}
export function useAnalytics(): void {
    useEffect(() => {
        const measurementId = process.env.NEXT_PUBLIC_GA_ID;
        if (!measurementId) {
            console.warn("Google Analytics Measurement ID not configured");
            return;
        }
        initializeGoogleAnalytics(measurementId);
        const handleClick = (event: MouseEvent): void => {
            const target = (event.target as HTMLElement).closest("[data-analytics]");
            if (target instanceof HTMLElement) {
                const analyticsId = target.getAttribute("data-analytics");
                if (analyticsId) {
                    trackEvent("click", {
                        event_category: "engagement",
                        event_label: analyticsId,
                        value: 1,
                    });
                }
            }
        };
        document.addEventListener("click", handleClick);
        return (): void => {
            document.removeEventListener("click", handleClick);
        };
    }, []);
}
export function trackEvent(eventType: EventType, eventData: AnalyticsEventData): void {
    if (typeof window === "undefined")
        return;
    const gtag = getGtag();
    if (!gtag) {
        console.warn("Google Analytics not initialized");
        return;
    }
    const enrichedData: GtagEventData = {
        ...eventData,
        timestamp: Date.now(),
    };
    gtag("event", eventType, enrichedData);
}
export function trackPageView(path: string, title?: string): void {
    if (typeof window === "undefined")
        return;
    const gtag = getGtag();
    if (!gtag) {
        console.warn("Google Analytics not initialized");
        return;
    }
    gtag("event", "page_view", {
        page_path: path,
        page_title: title || document.title,
    });
}
export function trackScrollDepth(depth: number): void {
    if (typeof window === "undefined")
        return;
    const gtag = getGtag();
    if (!gtag)
        return;
    gtag("event", "scroll", {
        event_category: "engagement",
        event_label: `scroll_${Math.round(depth / 25) * 25}percent`,
        value: depth,
    });
}
export function trackLinkClick(href: string, label?: string): void {
    if (typeof window === "undefined")
        return;
    const gtag = getGtag();
    if (!gtag)
        return;
    gtag("event", "click", {
        event_category: "outbound",
        event_label: label || href,
        value: 1,
    });
}
