/** Uygulama arayüzü metinleri — merkezi Türkçe etiketler */

export const UI_SHORTCUT_SEARCH = "Ctrl+K";

export const SETTINGS_GROUP_LABELS = {
  general: "Genel",
  platform: "Sistem",
  advanced: "Gelişmiş",
} as const;

export const INTEGRATION_CATEGORY_LABELS: Record<string, string> = {
  Analytics: "Analitik",
  Ads: "Reklam",
  Bildirim: "Bildirim",
  API: "API",
  AI: "Yapay Zeka",
};

export const LANGUAGE_OPTIONS = [
  { value: "tr", label: "Türkçe" },
  { value: "en", label: "İngilizce (arayüz dili)" },
] as const;

export const TIMEZONE_OPTIONS = [
  { value: "eu-istanbul", label: "Avrupa/İstanbul (GMT+3)" },
  { value: "eu-london", label: "Avrupa/Londra (GMT+0)" },
] as const;

export const PROJECT_STATUS_LABELS = {
  active: "Aktif",
  draft: "Taslak",
  archived: "Arşiv",
} as const;

export const AUDIT_PHASE_STATUS_LABELS = {
  active: "Aktif",
  completed: "Tamamlandı",
  locked: "Kilitli",
} as const;
