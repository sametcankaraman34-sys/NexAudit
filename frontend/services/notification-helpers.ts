import type { Notification } from "@/types";

export function getUnreadNotificationCount(items: Notification[]): number {
  return items.filter((n) => !n.read).length;
}
