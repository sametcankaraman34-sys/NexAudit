import type {
  AuditPhase,
  DashboardStat,
  IssueDistribution,
  Recommendation,
} from "@/types";

export const mockDashboardStats: DashboardStat[] = [
  {
    id: "overall-score",
    label: "Genel Skor",
    value: "68",
    subValue: "/ 100",
    trend: "+12",
    trendDirection: "up",
    trendPositive: true,
    icon: "chart",
    accent: "primary",
    chart: { type: "sparkline", values: [52, 55, 54, 61, 64, 68] },
  },
  {
    id: "critical-issues",
    label: "Kritik Sorunlar",
    value: "12",
    trend: "+4",
    trendDirection: "up",
    trendPositive: false,
    icon: "alert",
    accent: "danger",
    chart: { type: "ring", values: [12], max: 48 },
  },
  {
    id: "total-issues",
    label: "Toplam Sorun",
    value: "48",
    trend: "+9",
    trendDirection: "up",
    trendPositive: false,
    icon: "file",
    accent: "info",
    chart: { type: "stacked", values: [12, 15, 11, 6, 4] },
  },
  {
    id: "opportunities",
    label: "İyileştirme Fırsatları",
    value: "23",
    trend: "+6",
    trendDirection: "up",
    trendPositive: true,
    icon: "trending",
    accent: "success",
    chart: { type: "bars", values: [9, 12, 15, 19, 23] },
  },
];

export const mockAuditPhases: AuditPhase[] = [
  {
    id: "website",
    title: "Web Tasarım Denetimi",
    description: "UI/UX, erişilebilirlik ve performans analizi",
    status: "completed",
    progress: 100,
  },
  {
    id: "seo",
    title: "SEO Optimizasyonu",
    description: "Teknik SEO, içerik ve anahtar kelime analizi",
    status: "active",
    progress: 42,
  },
  {
    id: "ads",
    title: "Reklam & Dönüşüm",
    description: "Dönüşüm hunisi ve reklam performansı",
    status: "active",
    progress: 28,
  },
];

export const mockIssueDistribution: IssueDistribution[] = [
  { label: "Kritik", value: 12 },
  { label: "Yüksek", value: 15 },
  { label: "Orta", value: 11 },
  { label: "Düşük", value: 6 },
  { label: "İyileştirme", value: 4 },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: "rec-1",
    title: "Görsel optimizasyonu yap",
    description: "WebP formatına geçiş ve lazy loading",
    impact: "high",
    scoreGain: 18,
    icon: "image",
  },
  {
    id: "rec-2",
    title: "Sayfa hızını artır",
    description: "CSS/JS minify ve cache stratejisi",
    impact: "high",
    scoreGain: 15,
    icon: "zap",
  },
  {
    id: "rec-3",
    title: "Meta etiketlerini tamamla",
    description: "Eksik title ve description alanları",
    impact: "medium",
    scoreGain: 10,
    icon: "search",
  },
  {
    id: "rec-4",
    title: "Mobil uyumluluğu iyileştir",
    description: "Viewport ve touch target düzenlemeleri",
    impact: "medium",
    scoreGain: 8,
    icon: "smartphone",
  },
];
