import type { Notification } from "@/types";

type Listener = (notification: Notification) => void;

const listeners = new Set<Listener>();

export function subscribeLiveNotifications(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function pushLiveNotification(notification: Notification) {
  listeners.forEach((listener) => listener(notification));
}
