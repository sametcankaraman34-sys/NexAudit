export type SettingsSectionId =
  | "profile"
  | "notifications"
  | "audit"
  | "scan"
  | "integrations"
  | "team"
  | "brief"
  | "ai"
  | "danger";

export const SETTINGS_SECTIONS: {
  id: SettingsSectionId;
  label: string;
  description: string;
  group: "general" | "platform" | "advanced";
}[] = [
  { id: "profile", label: "Profil & Organizasyon", description: "Hesap ve ekip bilgileri", group: "general" },
  { id: "notifications", label: "Bildirimler", description: "Uyarı ve kanal tercihleri", group: "general" },
  { id: "audit", label: "Denetim", description: "Modül ve analiz derinliği", group: "platform" },
  { id: "scan", label: "Tarama", description: "Otomatik ve zamanlanmış taramalar", group: "platform" },
  { id: "integrations", label: "Entegrasyonlar", description: "Harici araç bağlantıları", group: "platform" },
  { id: "team", label: "Ekip", description: "Üyeler ve erişim", group: "platform" },
  { id: "brief", label: "Brief Sistemi", description: "Uyumluluk hassasiyeti", group: "advanced" },
  { id: "ai", label: "Yapay Zeka", description: "Öneri ve analiz motoru", group: "advanced" },
  { id: "danger", label: "Tehlikeli Bölge", description: "Silme ve sıfırlama", group: "advanced" },
];

export const mockTeamMembers = [
  { id: "u1", name: "Ajans Demo", email: "demo@nexaudit.app", role: "owner", initials: "AD" },
  { id: "u2", name: "Elif Kaya", email: "elif@ajansdemo.com", role: "admin", initials: "EK" },
  { id: "u3", name: "Mert Yılmaz", email: "mert@ajansdemo.com", role: "editor", initials: "MY" },
];

export const mockIntegrations = [
  { id: "ga4", name: "Google Analytics 4", category: "Analitik", connected: true },
  { id: "gtm", name: "Google Tag Manager", category: "Analitik", connected: true },
  { id: "meta", name: "Meta Pixel", category: "Reklam", connected: false },
  { id: "slack", name: "Slack", category: "Bildirim", connected: true },
  { id: "discord", name: "Discord", category: "Bildirim", connected: false },
  { id: "telegram", name: "Telegram", category: "Bildirim", connected: false },
  { id: "webhook", name: "Webhooks", category: "API", connected: true },
  { id: "openai", name: "OpenAI API", category: "Yapay Zeka", connected: true },
];
