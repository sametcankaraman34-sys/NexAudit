"use client";

import { useAppStore } from "@/stores/app-store";
import type {
  AiAppSettings,
  BriefAppSettings,
  NotificationPreferences,
} from "@/types/app-database";

export function useNotificationSettings(): NotificationPreferences {
  return useAppStore((s) => s.settings.notifications);
}

export function useBriefSettings(): BriefAppSettings {
  return useAppStore((s) => s.settings.brief);
}

export function useAiSettings(): AiAppSettings {
  return useAppStore((s) => s.settings.ai);
}

export function useSettingsStore() {
  const updateSettings = useAppStore((s) => s.updateSettings);
  const notifications = useNotificationSettings();
  const brief = useBriefSettings();
  const ai = useAiSettings();

  return {
    notifications,
    brief,
    ai,
    updateNotifications: (patch: Partial<NotificationPreferences>) =>
      updateSettings({ notifications: { ...notifications, ...patch } }),
    updateBrief: (patch: Partial<BriefAppSettings>) => {
      void updateSettings({ brief: { ...brief, ...patch } });
    },
    updateAi: (patch: Partial<AiAppSettings>) => {
      void updateSettings({ ai: { ...ai, ...patch } });
    },
  };
}
