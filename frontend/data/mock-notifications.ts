import type { Notification, NotificationCategory } from "@/types";

export const NOTIFICATION_CATEGORY_META: Record<
  NotificationCategory,
  { label: string; order: number }
> = {
  critical: { label: "Kritik Sorunlar", order: 0 },
  audit: { label: "Denetim Güncellemeleri", order: 1 },
  seo: { label: "SEO Uyarıları", order: 2 },
  brief: { label: "Brief Uygunluğu", order: 3 },
  system: { label: "Sistem Aktivitesi", order: 4 },
};

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Kritik sorun tespit edildi",
    message: "Anasayfada meta description eksik — arama görünürlüğü risk altında.",
    time: "2 dakika önce",
    read: false,
    category: "critical",
    severity: "critical",
    actionHref: "/website-audit",
    actionLabel: "Denetimi Gör",
  },
  {
    id: "n2",
    title: "CTA uyumsuzluğu",
    message: "Hero CTA metni brief ile eşleşmiyor; dönüşüm etkisi yüksek.",
    time: "18 dakika önce",
    read: false,
    category: "critical",
    severity: "high",
    actionHref: "/brief",
    actionLabel: "Brief Uygunluğu",
  },
  {
    id: "n3",
    title: "Web Tasarım Denetimi tamamlandı",
    message: "Ajans Demo Projesi için 48 sorun tespit edildi; skor 68.",
    time: "2 saat önce",
    read: false,
    category: "audit",
    severity: "medium",
    actionHref: "/website-audit",
    actionLabel: "Denetimi Gör",
  },
  {
    id: "n4",
    title: "Performans skoru güncellendi",
    message: "LCP iyileşmesi sonrası performans +6 puan.",
    time: "4 saat önce",
    read: true,
    category: "audit",
    severity: "low",
    actionHref: "/website-audit",
    actionLabel: "Metrikleri Gör",
  },
  {
    id: "n5",
    title: "Title tag çok kısa",
    message: "Anasayfa title 28 karakter — önerilen minimum 50.",
    time: "1 saat önce",
    read: false,
    category: "seo",
    severity: "high",
    actionHref: "/seo-audit",
    actionLabel: "SEO Denetimi",
  },
  {
    id: "n6",
    title: "Anahtar kelime fırsatı",
    message: "3 yüksek hacimli kelime için içerik boşluğu tespit edildi.",
    time: "6 saat önce",
    read: true,
    category: "seo",
    severity: "medium",
    actionHref: "/seo-audit",
    actionLabel: "Analizi Aç",
  },
  {
    id: "n7",
    title: "Brief uygunluk skoru güncellendi",
    message: "Genel brief skoru 82/100 — CTA uyumu düşük kaldı.",
    time: "5 saat önce",
    read: false,
    category: "brief",
    severity: "medium",
    actionHref: "/brief",
    actionLabel: "Karşılaştır",
  },
  {
    id: "n8",
    title: "Marka rengi sapması",
    message: "Birincil renk brief paletinden %23 sapıyor.",
    time: "8 saat önce",
    read: true,
    category: "brief",
    severity: "high",
    actionHref: "/brief",
    actionLabel: "Sapmayı Gör",
  },
  {
    id: "n9",
    title: "Reklam aşaması hazır",
    message: "SEO denetimi tamamlandı — Reklam & Dönüşüm açıldı.",
    time: "1 gün önce",
    read: true,
    category: "system",
    severity: "low",
    actionHref: "/ads-audit",
    actionLabel: "Aşamaya Git",
  },
  {
    id: "n10",
    title: "Otomatik tarama planlandı",
    message: "Yarın 09:00 için periyodik denetim kuyruğa alındı.",
    time: "2 gün önce",
    read: true,
    category: "system",
    severity: "improvement",
    actionHref: "/settings",
    actionLabel: "Ayarlar",
  },
];

export function getUnreadNotificationCount(items: Notification[]) {
  return items.filter((n) => !n.read).length;
}

export function groupNotificationsByCategory(items: Notification[]) {
  const groups = new Map<NotificationCategory, Notification[]>();
  for (const item of items) {
    const list = groups.get(item.category) ?? [];
    list.push(item);
    groups.set(item.category, list);
  }
  return [...groups.entries()].sort(
    ([a], [b]) => NOTIFICATION_CATEGORY_META[a].order - NOTIFICATION_CATEGORY_META[b].order,
  );
}

export { mockReportHistory } from "@/data/mock-report-history";
