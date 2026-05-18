"use client";

import {
  AlertCircle,
  AlertTriangle,
  Archive,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { registerNotificationToast } from "@/services/notification-service";
import type { Toast, ToastInput, ToastVariant } from "@/types/toast";
import { cn } from "@/lib/utils";

const DEFAULT_DURATION = 5200;
const MAX_VISIBLE = 4;

const variantMeta: Record<
  ToastVariant,
  { icon: typeof Info; accent: string; duration: number }
> = {
  success: { icon: CheckCircle2, accent: "var(--success)", duration: DEFAULT_DURATION },
  info: { icon: Info, accent: "var(--primary)", duration: DEFAULT_DURATION },
  warning: { icon: AlertTriangle, accent: "var(--warning)", duration: 5800 },
  critical: { icon: AlertCircle, accent: "var(--danger)", duration: 7000 },
  neutral: { icon: Archive, accent: "var(--text-secondary)", duration: 3400 },
};

interface ToastContextValue {
  push: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function createId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 240);
  }, []);

  const push = useCallback((input: ToastInput) => {
    const id = createId();
    const variant = input.variant ?? "info";
    const toast: Toast = {
      id,
      title: input.title,
      description: input.description,
      variant,
      duration: input.duration ?? variantMeta[variant].duration,
      action: input.action,
      createdAt: Date.now(),
    };

    setToasts((prev) => [toast, ...prev].slice(0, MAX_VISIBLE + 2));
    return id;
  }, []);

  useEffect(() => registerNotificationToast(push), [push]);

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  const display = toasts.slice(0, MAX_VISIBLE + 1);

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-3 right-3 z-[100] flex flex-col-reverse gap-2 sm:left-auto sm:right-4 sm:w-[min(360px,calc(100vw-2rem))]"
      aria-live="polite"
      aria-label="Canlı bildirimler"
    >
      {display.map((item) => (
        <ToastCard key={item.id} toast={item} onDismiss={() => onDismiss(item.id)} />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const meta = variantMeta[toast.variant];
  const Icon = meta.icon;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef(toast.duration ?? DEFAULT_DURATION);
  const startedRef = useRef(0);
  const pausedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleDismiss = useCallback(() => {
    clearTimer();
    if (toast.exiting) return;
    timerRef.current = setTimeout(onDismiss, remainingRef.current);
  }, [clearTimer, onDismiss, toast.exiting]);

  useEffect(() => {
    if (toast.exiting) return;
    startedRef.current = Date.now();
    scheduleDismiss();
    return clearTimer;
  }, [toast.exiting, scheduleDismiss, clearTimer]);

  const handleMouseEnter = () => {
    if (pausedRef.current || toast.exiting) return;
    pausedRef.current = true;
    const elapsed = Date.now() - startedRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    clearTimer();
  };

  const handleMouseLeave = () => {
    if (!pausedRef.current || toast.exiting) return;
    pausedRef.current = false;
    startedRef.current = Date.now();
    scheduleDismiss();
  };

  const shellClass = cn(
    "toast-card group pointer-events-auto relative flex gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 shadow-[var(--shadow-card)] transition-[box-shadow,background-color] duration-[var(--transition-fast)] hover:bg-[var(--surface-soft)]/60 hover:shadow-[var(--shadow-card-hover)]",
    toast.exiting ? "toast-exit" : "toast-enter",
  );

  const body = (
    <>
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--surface-soft)]"
        style={{ color: meta.accent }}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium leading-tight text-[var(--text-primary)]">
          {toast.title}
        </p>
        {toast.description && (
          <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-[var(--text-secondary)]">
            {toast.description}
          </p>
        )}
      </div>
      <span
        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full opacity-80"
        style={{ backgroundColor: meta.accent }}
        aria-hidden
      />
    </>
  );

  const closeButton = (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDismiss();
      }}
      className="btn-transition absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-md text-[var(--text-secondary)] opacity-0 transition-opacity hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)] group-hover:opacity-100"
      aria-label="Kapat"
    >
      <X className="h-3 w-3" strokeWidth={2} />
    </button>
  );

  if (toast.action) {
    return (
      <Link
        href={toast.action.href}
        role="status"
        onClick={onDismiss}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={shellClass}
      >
        {body}
        {closeButton}
      </Link>
    );
  }

  return (
    <article
      role="status"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={shellClass}
    >
      {body}
      {closeButton}
    </article>
  );
}
