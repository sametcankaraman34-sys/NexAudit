import type { IssueSeverity, IssueStatus } from "@/types";
import type {
  AuditIntelligenceSummary,
  GuidanceItem,
  IntelligenceIssue,
  MetricFinding,
  PerformanceFactor as IntelligencePerformanceFactor,
} from "@/types/audit-intelligence";

export interface WebsiteAuditIssue {
  id: string;
  title: string;
  location: string;
  severity: IssueSeverity;
  status: IssueStatus;
  impact: string;
  optimizationPotential: number;
  affectedElement?: string;
  fixGuidance: string;
}

export interface AnalysisCategory {
  id: string;
  title: string;
  score: number;
  issueCount: number;
  criticalCount: number;
  optimizationGain: number;
  barValues: number[];
  metrics: { label: string; value: string }[];
}

export interface VisualFinding {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  metric: string;
  metricLabel: string;
}

export interface PerformanceFactor {
  id: string;
  label: string;
  impact: "high" | "medium" | "low";
  estimatedMs: number;
  scorePenalty: number;
  barPercent: number;
}

export interface FixGuidanceItem {
  id: string;
  issueTitle: string;
  guidance: string;
  editorHint: string;
  priority: IssueSeverity;
}

export const websiteAuditSummary = {
  overallScore: 62,
  previousScore: 54,
  trend: 8,
  riskLevel: "medium" as const,
  lastScanAt: "15 May 2026 · 14:32",
  scanStatus: "completed" as const,
  domain: "ajansdemo.com.tr",
  pagesScanned: 24,
  elementsAnalyzed: 1842,
};

export const analysisCategories: AnalysisCategory[] = [
  {
    id: "responsive",
    title: "Responsive Analiz",
    score: 71,
    issueCount: 4,
    criticalCount: 0,
    optimizationGain: 12,
    barValues: [88, 72, 65, 58],
    metrics: [
      { label: "Breakpoint uyumu", value: "%88" },
      { label: "Mobil taşma", value: "3 nokta" },
    ],
  },
  {
    id: "images",
    title: "Görsel Optimizasyon",
    score: 48,
    issueCount: 9,
    criticalCount: 2,
    optimizationGain: 22,
    barValues: [42, 38, 55, 48],
    metrics: [
      { label: "Ort. görsel boyutu", value: "840 KB" },
      { label: "WebP kullanımı", value: "%12" },
    ],
  },
  {
    id: "performance",
    title: "Performans Analizi",
    score: 55,
    issueCount: 6,
    criticalCount: 1,
    optimizationGain: 18,
    barValues: [52, 48, 61, 58],
    metrics: [
      { label: "LCP tahmini", value: "3.2s" },
      { label: "Render blok", value: "4 kaynak" },
    ],
  },
  {
    id: "content",
    title: "İçerik Kalitesi",
    score: 74,
    issueCount: 3,
    criticalCount: 0,
    optimizationGain: 8,
    barValues: [78, 72, 70, 76],
    metrics: [
      { label: "Meta tamamlık", value: "%74" },
      { label: "H1 tutarlılığı", value: "2 uyarı" },
    ],
  },
  {
    id: "accessibility",
    title: "Erişilebilirlik",
    score: 58,
    issueCount: 7,
    criticalCount: 1,
    optimizationGain: 15,
    barValues: [62, 55, 48, 66],
    metrics: [
      { label: "Kontrast uyarısı", value: "5 alan" },
      { label: "Alt metin eksik", value: "8 görsel" },
    ],
  },
  {
    id: "technical",
    title: "Teknik Yapı",
    score: 68,
    issueCount: 5,
    criticalCount: 0,
    optimizationGain: 10,
    barValues: [70, 68, 72, 62],
    metrics: [
      { label: "DOM derinliği", value: "18 seviye" },
      { label: "Script yükü", value: "34 dosya" },
    ],
  },
];

export const websiteAuditIssues: WebsiteAuditIssue[] = [
  {
    id: "wa-1",
    title: "Meta description eksik",
    location: "Anasayfa",
    severity: "critical",
    status: "detected",
    impact: "Arama görünürlüğü ve tıklama oranı doğrudan etkilenir",
    optimizationPotential: 92,
    affectedElement: "<head> meta",
    fixGuidance:
      "Yoast SEO veya Rank Math panelinden Anasayfa meta açıklamasını 150–160 karakter aralığında tamamlayın.",
  },
  {
    id: "wa-2",
    title: "Hero görseli aşırı boyutlu",
    location: "Anasayfa",
    severity: "critical",
    status: "detected",
    impact: "LCP skorunu ~1.2s geciktirir, mobil veri tüketimini artırır",
    optimizationPotential: 88,
    affectedElement: "img.hero-banner",
    fixGuidance:
      "Elementor Hero bölümündeki görseli WebP formatına çevirin; max genişlik 1920px ile sınırlandırın.",
  },
  {
    id: "wa-3",
    title: "Görsel alt etiketi yok",
    location: "Hakkımızda",
    severity: "high",
    status: "detected",
    impact: "Erişilebilirlik ve SEO görsel indekslemesi zayıflar",
    optimizationPotential: 76,
    affectedElement: "8× <img> without alt",
    fixGuidance:
      "Medya kütüphanesinden ilgili görsellere anlamlı alt metin ekleyin veya Elementor Image widget alt alanını doldurun.",
  },
  {
    id: "wa-4",
    title: "Sayfa yükleme süresi yüksek",
    location: "Ürünler",
    severity: "high",
    status: "in_progress",
    impact: "Dönüşüm hunisinde %8–12 kayıp riski",
    optimizationPotential: 81,
    affectedElement: "WooCommerce archive",
    fixGuidance:
      "LiteSpeed veya WP Rocket ile ürün listesi lazy-load açın; kullanılmayan eklenti scriptlerini devre dışı bırakın.",
  },
  {
    id: "wa-5",
    title: "CTA butonu kontrastı düşük",
    location: "İletişim",
    severity: "medium",
    status: "detected",
    impact: "WCAG AA kontrast eşiğinin altında; tıklanabilirlik algısı düşük",
    optimizationPotential: 64,
    affectedElement: ".elementor-button",
    fixGuidance:
      "Elementor İletişim şablonunda CTA arka plan rengini #4F46E5 tonuna çekin; metin beyaz kalsın.",
  },
  {
    id: "wa-6",
    title: "H1 etiketi çoklu kullanım",
    location: "Blog",
    severity: "medium",
    status: "detected",
    impact: "İçerik hiyerarşisi ve SEO başlık sinyali zayıflar",
    optimizationPotential: 58,
    affectedElement: "2× <h1>",
    fixGuidance:
      "Blog şablonunda yalnızca yazı başlığı H1 kalsın; sidebar widget başlıklarını H2/H3 yapın.",
  },
  {
    id: "wa-7",
    title: "Mobil yatay taşma",
    location: "Hizmetler",
    severity: "medium",
    status: "detected",
    impact: "Mobil kullanıcı deneyimi ve Core Web Vitals CLS",
    optimizationPotential: 70,
    affectedElement: ".services-grid",
    fixGuidance:
      "Elementor Column genişliklerini %100 yapın; sabit px genişlikli inner section'ları kaldırın.",
  },
];

export const visualFindings: VisualFinding[] = [
  {
    id: "vf-1",
    title: "Aşırı boyutlu görseller",
    description: "4 görsel 500KB üzeri; toplam 3.2MB sayfa ağırlığı",
    severity: "critical",
    metric: "3.2",
    metricLabel: "MB fazla yük",
  },
  {
    id: "vf-2",
    title: "Layout taşması",
    description: "Mobil görünümde 2 bölüm yatay scroll üretiyor",
    severity: "high",
    metric: "2",
    metricLabel: "taşma noktası",
  },
  {
    id: "vf-3",
    title: "Ağır asset paketi",
    description: "Optimize edilmemiş CSS/JS bundle birleşimi",
    severity: "high",
    metric: "890",
    metricLabel: "KB toplam",
  },
  {
    id: "vf-4",
    title: "DOM karmaşıklığı",
    description: "Anasayfada 1.240 DOM node — önerilen < 800",
    severity: "medium",
    metric: "1240",
    metricLabel: "node",
  },
  {
    id: "vf-5",
    title: "Tipografi tutarsızlığı",
    description: "5 farklı font-size kaynağı; görsel hiyerarşi dağınık",
    severity: "medium",
    metric: "5",
    metricLabel: "kaynak",
  },
  {
    id: "vf-6",
    title: "CTA görünürlüğü",
    description: "Fold altında kalan birincil CTA; scroll gerektiriyor",
    severity: "low",
    metric: "68",
    metricLabel: "% görünürlük",
  },
];

export const performanceFactors: PerformanceFactor[] = [
  {
    id: "pf-1",
    label: "Hero görseli (LCP adayı)",
    impact: "high",
    estimatedMs: 1240,
    scorePenalty: 18,
    barPercent: 92,
  },
  {
    id: "pf-2",
    label: "Render-blocking CSS",
    impact: "high",
    estimatedMs: 680,
    scorePenalty: 12,
    barPercent: 74,
  },
  {
    id: "pf-3",
    label: "jQuery + eklenti scriptleri",
    impact: "medium",
    estimatedMs: 420,
    scorePenalty: 8,
    barPercent: 58,
  },
  {
    id: "pf-4",
    label: "Web font yükleme",
    impact: "medium",
    estimatedMs: 310,
    scorePenalty: 6,
    barPercent: 45,
  },
  {
    id: "pf-5",
    label: "Third-party embed (harita)",
    impact: "low",
    estimatedMs: 180,
    scorePenalty: 3,
    barPercent: 28,
  },
];

export const fixGuidanceItems: FixGuidanceItem[] = [
  {
    id: "fg-1",
    issueTitle: "CTA kontrastı zayıf",
    guidance: "İletişim sayfasındaki birincil buton WCAG AA altında.",
    editorHint: "Elementor → İletişim şablonu → Button widget → Stil → Arka plan #4F46E5",
    priority: "medium",
  },
  {
    id: "fg-2",
    issueTitle: "Hero görseli optimize değil",
    guidance: "Anasayfa LCP öğesi 2.1MB PNG; WebP ile ~340KB hedeflenmeli.",
    editorHint: "Elementor Hero section → Görsel → Shortpixel veya Smush ile WebP dönüşümü",
    priority: "critical",
  },
  {
    id: "fg-3",
    issueTitle: "Meta description boş",
    guidance: "Anasayfa SERP snippet'i varsayılan site açıklamasına düşüyor.",
    editorHint: "Yoast SEO → Anasayfa → Meta açıklama alanı (TR, 155 karakter)",
    priority: "critical",
  },
  {
    id: "fg-4",
    issueTitle: "Mobil grid taşması",
    guidance: "Hizmetler sayfasında 375px viewport'ta yatay kaydırma var.",
    editorHint: "Elementor → Hizmetler → Column → Genişlik %100, Overflow hidden",
    priority: "medium",
  },
];

export const websiteIntelligenceSummary: AuditIntelligenceSummary = {
  title: "Web Tasarım Denetimi",
  badgeLabel: "Canlı denetim merkezi",
  domain: websiteAuditSummary.domain,
  lastScanAt: websiteAuditSummary.lastScanAt,
  overallScore: websiteAuditSummary.overallScore,
  previousScore: websiteAuditSummary.previousScore,
  trend: websiteAuditSummary.trend,
  riskLevel: websiteAuditSummary.riskLevel,
  statusLabel: "Tarama tamamlandı",
  chips: [
    { label: "Taranan sayfa", value: String(websiteAuditSummary.pagesScanned) },
    {
      label: "Analiz edilen öğe",
      value: websiteAuditSummary.elementsAnalyzed.toLocaleString("tr-TR"),
    },
    { label: "Skor değişimi", value: `+${websiteAuditSummary.trend}`, accent: "success" },
  ],
  sideStats: [],
};

export const websiteIntelligenceIssues: IntelligenceIssue[] = websiteAuditIssues.map((issue) => ({
  id: issue.id,
  title: issue.title,
  location: issue.location,
  severity: issue.severity,
  status: issue.status,
  impact: issue.impact,
  optimizationPotential: issue.optimizationPotential,
  affectedElement: issue.affectedElement,
  fixHint: issue.fixGuidance,
}));

export const websiteMetricFindings: MetricFinding[] = visualFindings.map((f) => ({
  id: f.id,
  title: f.title,
  description: f.description,
  severity: f.severity,
  metric: f.metric,
  metricLabel: f.metricLabel,
}));

export const websiteGuidanceItems: GuidanceItem[] = fixGuidanceItems.map((item) => ({
  id: item.id,
  issueTitle: item.issueTitle,
  guidance: item.guidance,
  editorHint: item.editorHint,
  priority: item.priority,
}));

export const websitePerformanceFactors: IntelligencePerformanceFactor[] = performanceFactors.map(
  (f) => ({
    id: f.id,
    label: f.label,
    impact: f.impact,
    estimatedMs: f.estimatedMs,
    scorePenalty: f.scorePenalty,
    barPercent: f.barPercent,
  }),
);
