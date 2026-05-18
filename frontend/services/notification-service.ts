import { useAppStore } from "@/stores/app-store";
import type { Notification, NotificationCategory } from "@/types";
import type { IssueSeverity } from "@/types";
import type { ToastInput, ToastVariant } from "@/types/toast";

type PushToastFn = (input: ToastInput) => string;

let pushToast: PushToastFn | null = null;

export function registerNotificationToast(fn: PushToastFn) {
  pushToast = fn;
  return () => {
    if (pushToast === fn) pushToast = null;
  };
}

export interface NotifyInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  category?: NotificationCategory;
  severity?: IssueSeverity;
  projectId?: string;
  actionHref?: string;
  actionLabel?: string;
  duration?: number;
  action?: ToastInput["action"];
  persist?: boolean;
  skipToast?: boolean;
}

function variantToCategory(variant: ToastVariant): NotificationCategory {
  if (variant === "critical") return "critical";
  if (variant === "warning") return "seo";
  if (variant === "success") return "audit";
  return "system";
}

function variantToSeverity(variant: ToastVariant): IssueSeverity {
  if (variant === "critical") return "critical";
  if (variant === "warning") return "medium";
  if (variant === "success") return "low";
  return "improvement";
}

function shouldNotify(
  category: NotificationCategory,
  prefs: ReturnType<typeof useAppStore.getState>["settings"]["notifications"],
): boolean {
  if (!prefs.realtime) return false;
  if (category === "critical" && !prefs.critical) return false;
  if (category === "seo" && !prefs.seo) return false;
  if (category === "brief" && !prefs.brief) return false;
  return true;
}

function buildNotification(input: NotifyInput, category: NotificationCategory): Notification {
  const variant = input.variant ?? "info";
  return {
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: input.title,
    message: input.description ?? "",
    time: "Az önce",
    read: false,
    category,
    severity: input.severity ?? variantToSeverity(variant),
    actionHref: input.actionHref ?? input.action?.href ?? "/notifications",
    actionLabel: input.actionLabel ?? input.action?.label ?? "Görüntüle",
  };
}

/** Merkezi bildirim + toast girişi */
export function notify(input: NotifyInput): string | undefined {
  const state = useAppStore.getState();
  const variant = input.variant ?? "info";
  const category = input.category ?? variantToCategory(variant);
  const projectId = input.projectId ?? state.activeProjectId;

  if (!shouldNotify(category, state.settings.notifications)) {
    return undefined;
  }

  if (input.persist !== false && projectId) {
    state.addNotification(projectId, buildNotification(input, category));
  }

  if (!input.skipToast && pushToast) {
    return pushToast({
      variant,
      title: input.title,
      description: input.description,
      duration: input.duration,
      action: input.action,
    });
  }

  return undefined;
}

export const NotificationService = {
  success(title: string, description?: string, projectId?: string) {
    return notify({ variant: "success", title, description, projectId });
  },
  info(title: string, description?: string, projectId?: string) {
    return notify({ variant: "info", title, description, projectId });
  },
  warning(title: string, description?: string, projectId?: string) {
    return notify({ variant: "warning", title, description, projectId });
  },
  critical(title: string, description?: string, projectId?: string) {
    return notify({
      variant: "critical",
      title,
      description,
      projectId,
      category: "critical",
      duration: 7000,
    });
  },
};
