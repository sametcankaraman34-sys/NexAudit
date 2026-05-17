"use client";

import {
  Activity,
  AlertCircle,
  Bell,
  ClipboardCheck,
  Monitor,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getUnreadNotificationCount, mockNotifications } from "@/data/mock-notifications";
import { subscribeLiveNotifications } from "@/lib/live-notification-store";
import type { Notification, NotificationCategory } from "@/types";
import type { IssueSeverity } from "@/types";
import { cn } from "@/lib/utils";

const categoryIcons: Record<NotificationCategory, typeof Bell> = {
  critical: AlertCircle,
  audit: Monitor,
  seo: Search,
  brief: ClipboardCheck,
  system: Activity,
};

const severityAccent: Record<IssueSeverity, string> = {
  critical: "var(--danger)",
  high: "var(--danger)",
  medium: "var(--warning)",
  low: "var(--success)",
  improvement: "var(--primary)",
};

const severitySoftBg: Record<IssueSeverity, string> = {
  critical: "var(--danger-soft)",
  high: "var(--danger-soft)",
  medium: "var(--warning-soft)",
  low: "var(--success-soft)",
  improvement: "var(--primary-soft)",
};

export function NotificationBell() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>(mockNotifications);
  const unreadCount = useMemo(() => getUnreadNotificationCount(items), [items]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, improvement: 4 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [items]);

  const markRead = useCallback((id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  useEffect(() => {
    return subscribeLiveNotifications((notification) => {
      setItems((prev) => [notification, ...prev]);
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "btn-transition relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]",
          open && "border-[var(--primary)]/25 bg-[var(--surface-soft)] text-[var(--text-primary)]",
        )}
        aria-label="Bildirimler"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[9px] font-semibold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="notif-dropdown-backdrop fixed inset-0 z-40"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            className="notif-dropdown absolute right-0 top-[calc(100%+8px)] z-50 w-[min(360px,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-[var(--border)]/90 bg-[var(--surface)]/95 shadow-[0_8px_30px_rgba(15,23,42,0.1),0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur-md"
            role="menu"
            aria-label="Bildirimler"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)]/80 px-3.5 py-2.5">
              <p className="text-xs font-semibold text-[var(--text-primary)]">Bildirimler</p>
              {unreadCount > 0 && (
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                  {unreadCount} yeni
                </span>
              )}
            </div>

            <ul className="notif-dropdown-list max-h-[min(280px,50vh)] overflow-y-auto overscroll-contain py-1">
              {sortedItems.map((notification, index) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  index={index}
                  onSelect={() => {
                    markRead(notification.id);
                    setOpen(false);
                  }}
                />
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationRow({
  notification,
  index,
  onSelect,
}: {
  notification: Notification;
  index: number;
  onSelect: () => void;
}) {
  const Icon = categoryIcons[notification.category];
  const accent = severityAccent[notification.severity];
  const softBg = severitySoftBg[notification.severity];

  return (
    <li>
      <Link
        href={notification.actionHref}
        onClick={onSelect}
        className={cn(
          "notif-dropdown-item flex gap-2.5 px-3.5 py-2.5 transition-colors hover:bg-[var(--surface-soft)]",
          !notification.read && "bg-[var(--primary-soft)]/15",
        )}
        style={{ animationDelay: `${index * 35}ms` }}
        role="menuitem"
      >
        <span
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: softBg, color: accent }}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium leading-tight text-[var(--text-primary)]">
            {notification.title}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[var(--text-secondary)]">
            {notification.message}
          </p>
          <p className="mt-1 text-[10px] text-[var(--text-secondary)]/90">{notification.time}</p>
        </div>
        {!notification.read && (
          <span
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]"
            aria-hidden
          />
        )}
      </Link>
    </li>
  );
}
