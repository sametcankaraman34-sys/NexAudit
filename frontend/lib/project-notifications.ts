import type { Notification } from "@/types";

function baseNotification(
  id: string,
  title: string,
  message: string,
): Notification {
  return {
    id,
    title,
    message,
    time: "Az önce",
    read: false,
    category: "system",
    severity: "low",
    actionHref: "/projects",
    actionLabel: "Projelere git",
  };
}

export function buildProjectArchivedNotification(projectName: string): Notification {
  return baseNotification(
    `n-arch-${Date.now()}`,
    "Proje arşivlendi",
    `${projectName} arşive taşındı — aktif listeden kaldırıldı.`,
  );
}

export function buildProjectUpdatedNotification(projectName: string): Notification {
  return baseNotification(
    `n-upd-${Date.now()}`,
    "Proje güncellendi",
    `${projectName} bilgileri kaydedildi.`,
  );
}

export function buildProjectDeletedNotification(projectName: string): Notification {
  return baseNotification(
    `n-del-${Date.now()}`,
    "Proje silindi",
    `${projectName} kalıcı olarak kaldırıldı.`,
  );
}
