"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

export type ToastVariant = "default" | "success" | "error";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  id?: number;
}

interface ToastInternal extends Required<Omit<ToastOptions, "description">> {
  description?: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = options.id ?? Date.now();
    const variant = options.variant ?? "default";
    const duration = options.duration ?? 6000;

    setToasts((current) => {
      const exists = current.some((item) => item.id === id);
      if (exists) {
        return current.map((item) =>
          item.id === id
            ? {
                ...item,
                ...options,
                variant,
                duration
              }
            : item
        );
      }

      return [
        ...current,
        {
          id,
          title: options.title,
          description: options.description,
          variant,
          duration
        }
      ];
    });

    if (duration > 0 && typeof window !== "undefined") {
      const timer = window.setTimeout(() => {
        dismiss(id);
      }, duration);
      timers.current.set(id, timer);
    }
  }, [dismiss]);

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div className="toast-viewport" role="region" aria-live="polite" aria-label="Notifications">
            {toasts.map((item) => (
              <div
                key={item.id}
                className={clsx("toast", {
                  "toast--success": item.variant === "success",
                  "toast--error": item.variant === "error"
                })}
              >
                <div className="toast__title">{item.title}</div>
                {item.description ? <div className="toast__description">{item.description}</div> : null}
                <button
                  type="button"
                  className="toast__dismiss"
                  onClick={() => dismiss(item.id)}
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}
