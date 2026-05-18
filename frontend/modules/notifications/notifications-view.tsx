"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useActiveProject, useProjectWorkspace } from "@/lib/project-context";
import { useAppStore } from "@/stores/app-store";
import type { Notification } from "@/types";
import { cn } from "@/lib/utils";

export function NotificationsView() {
  const { activeProject, activeProjectId } = useActiveProject();
  const { notifications } = useProjectWorkspace();
  const markRead = useAppStore((s) => s.markNotificationRead);
  const markAllRead = useAppStore((s) => s.markAllNotificationsRead);
  const clearAll = useAppStore((s) => s.clearNotifications);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      <PageHeader
        title="Bildirimler"
        description={`${activeProject.name} · tüm operasyonel uyarılar`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {unread > 0 && (
          <span className="text-sm text-[var(--text-secondary)]">{unread} okunmamış</span>
        )}
        {notifications.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => markAllRead(activeProjectId)}
              className="btn-transition rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--primary)]"
            >
              Tümünü okundu yap
            </button>
            <button
              type="button"
              onClick={() => clearAll(activeProjectId)}
              className="btn-transition rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]"
            >
              Bildirimleri temizle
            </button>
          </>
        )}
        <Link
          href="/"
          className="btn-transition ml-auto rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white"
        >
          Kontrol paneline dön
        </Link>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)]/50 px-6 py-16 text-center">
          <Bell className="mx-auto h-10 w-10 text-[var(--text-secondary)]" strokeWidth={1.5} />
          <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">Henüz bildirim yok</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Tarama veya aşama tamamlama sonrası uyarılar burada görünecek.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <NotificationListItem
              key={n.id}
              notification={n}
              onRead={() => markRead(activeProjectId, n.id)}
            />
          ))}
        </ul>
      )}
    </>
  );
}

function NotificationListItem({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: () => void;
}) {
  return (
    <li
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]",
        !notification.read && "border-[var(--primary)]/20 bg-[var(--primary-soft)]/20",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{notification.title}</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{notification.message}</p>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">{notification.time}</p>
        </div>
        <StatusBadge variant={notification.read ? "detected" : "good"} label={notification.read ? "Okundu" : "Yeni"} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {!notification.read && (
          <button
            type="button"
            onClick={onRead}
            className="btn-transition rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
          >
            Okundu işaretle
          </button>
        )}
        {notification.actionHref && (
          <Link
            href={notification.actionHref}
            onClick={onRead}
            className="btn-transition rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white"
          >
            {notification.actionLabel ?? "Görüntüle"}
          </Link>
        )}
      </div>
    </li>
  );
}
