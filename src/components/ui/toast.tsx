"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface ToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, duration = 2000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-300 animate-fade-up flex items-center gap-3 px-4 py-3 rounded-lg bg-p-accent text-p-bg text-sm font-medium shadow-lg"
    >
      <Check className="size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = (message: string, duration?: number) => {
    setToast({ message, duration });
  };

  const ToastComponent = toast ? (
    <Toast {...toast} onClose={() => setToast(null)} />
  ) : null;

  return { showToast, toast: ToastComponent };
}
