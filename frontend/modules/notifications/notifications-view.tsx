import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockNotifications } from "@/data/mock-notifications";
import { cn } from "@/lib/utils";

export function NotificationsView() {
  return (
    <>
      <PageHeader
        title="Bildirimler"
        description="Denetim ve sorun bildirimleriniz."
      />

      <ul className="space-y-3">
        {mockNotifications.map((notification) => (
          <li
            key={notification.id}
            className={cn(
              "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]",
              !notification.read && "border-[var(--primary)]/20 bg-[var(--primary-soft)]/30",
            )}
          >
            <div className="mb-2 flex items-start justify-between gap-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                {notification.title}
              </h3>
              {!notification.read && <StatusBadge variant="in_progress" label="Yeni" />}
            </div>
            <p className="mb-2 text-sm text-[var(--text-secondary)]">{notification.message}</p>
            <p className="text-xs text-[var(--text-secondary)]">{notification.time}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
