export interface ReportHistoryOverview {
  totalAudits: number;
  totalAuditsTrend: number;
  averageScore: number;
  averageScoreTrend: number;
  issuesResolved: number;
  issuesResolvedTrend: number;
  seoImprovements: number;
  seoImprovementsTrend: number;
  lastAuditDate: string;
  scoreSparkline: number[];
}

export interface AuditTimelineEntry {
  id: string;
  projectName: string;
  phase: string;
  phaseId: "website" | "seo" | "ads";
  previousScore: number;
  newScore: number;
  issuesResolved: number;
  criticalReduced: number;
  optimizationGains: string[];
  date: string;
  status: "completed" | "in_progress";
  scoreSparkline: number[];
}

export interface EvolutionMetric {
  id: string;
  label: string;
  before: number;
  after: number;
  unit: string;
  changePercent: number;
  barValues: number[];
}

export interface HistoricalInsight {
  id: string;
  insight: string;
  category: string;
}

export const reportHistoryOverview: ReportHistoryOverview = {
  totalAudits: 24,
  totalAuditsTrend: 6,
  averageScore: 74,
  averageScoreTrend: 11,
  issuesResolved: 186,
  issuesResolvedTrend: 34,
  seoImprovements: 28,
  seoImprovementsTrend: 9,
  lastAuditDate: "17 May 2026",
  scoreSparkline: [58, 61, 64, 68, 71, 74],
};

export const auditTimeline: AuditTimelineEntry[] = [
  {
    id: "t1",
    projectName: "Ajans Demo Projesi",
    phase: "Web Tasarım Denetimi",
    phaseId: "website",
    previousScore: 68,
    newScore: 82,
    issuesResolved: 12,
    criticalReduced: 4,
    optimizationGains: ["Görsel optimizasyon", "Meta düzenlemeleri"],
    date: "17 May 2026",
    status: "completed",
    scoreSparkline: [62, 65, 68, 74, 79, 82],
  },
  {
    id: "t2",
    projectName: "Ajans Demo Projesi",
    phase: "SEO Optimizasyonu",
    phaseId: "seo",
    previousScore: 54,
    newScore: 71,
    issuesResolved: 18,
    criticalReduced: 2,
    optimizationGains: ["Başlık hiyerarşisi", "İç link yapısı"],
    date: "14 May 2026",
    status: "completed",
    scoreSparkline: [48, 52, 54, 61, 67, 71],
  },
  {
    id: "t3",
    projectName: "E-Ticaret Mağazası",
    phase: "Web Tasarım Denetimi",
    phaseId: "website",
    previousScore: 54,
    newScore: 68,
    issuesResolved: 9,
    criticalReduced: 3,
    optimizationGains: ["Mobil spacing", "CTA hizalaması"],
    date: "10 May 2026",
    status: "completed",
    scoreSparkline: [50, 52, 54, 58, 63, 68],
  },
  {
    id: "t4",
    projectName: "E-Ticaret Mağazası",
    phase: "Reklam & Dönüşüm",
    phaseId: "ads",
    previousScore: 41,
    newScore: 58,
    issuesResolved: 7,
    criticalReduced: 1,
    optimizationGains: ["Landing CTA", "Form alanı sadeleştirme"],
    date: "6 May 2026",
    status: "in_progress",
    scoreSparkline: [38, 40, 41, 48, 54, 58],
  },
  {
    id: "t5",
    projectName: "Ajans Demo Projesi",
    phase: "Brief Uygunluk",
    phaseId: "website",
    previousScore: 76,
    newScore: 82,
    issuesResolved: 5,
    criticalReduced: 1,
    optimizationGains: ["Renk paleti", "Tipografi hiyerarşisi"],
    date: "3 May 2026",
    status: "completed",
    scoreSparkline: [72, 74, 76, 78, 80, 82],
  },
];

export const evolutionMetrics: EvolutionMetric[] = [
  {
    id: "e1",
    label: "Genel skor artışı",
    before: 58,
    after: 82,
    unit: "puan",
    changePercent: 41,
    barValues: [58, 64, 68, 74, 79, 82],
  },
  {
    id: "e2",
    label: "Kritik sorun azalması",
    before: 24,
    after: 8,
    unit: "sorun",
    changePercent: -67,
    barValues: [24, 20, 16, 14, 10, 8],
  },
  {
    id: "e3",
    label: "SEO büyümesi",
    before: 48,
    after: 71,
    unit: "puan",
    changePercent: 48,
    barValues: [48, 52, 54, 61, 67, 71],
  },
  {
    id: "e4",
    label: "Performans iyileşmesi",
    before: 62,
    after: 78,
    unit: "puan",
    changePercent: 26,
    barValues: [62, 65, 68, 72, 75, 78],
  },
  {
    id: "e5",
    label: "Dönüşüm optimizasyonu",
    before: 41,
    after: 58,
    unit: "puan",
    changePercent: 41,
    barValues: [41, 44, 48, 52, 55, 58],
  },
];

export const historicalInsights: HistoricalInsight[] = [
  {
    id: "hi1",
    insight:
      "Görsel optimizasyon sonrası performans skoru belirgin şekilde yükseldi; LCP 2.1s altına indi.",
    category: "Performans",
  },
  {
    id: "hi2",
    insight: "Başlık hiyerarşisi düzeltmelerinden sonra SEO skoru 17 puan arttı.",
    category: "SEO",
  },
  {
    id: "hi3",
    insight: "Mobil kullanılabilirlik sorunları son 30 günde %42 azaldı.",
    category: "UX",
  },
  {
    id: "hi4",
    insight: "Brief uyum düzeltmeleri marka tutarlılığını güçlendirdi; CTA uyumu hâlâ izleniyor.",
    category: "Brief",
  },
];

/** @deprecated use auditTimeline — kept for any legacy imports */
export const mockReportHistory = auditTimeline.map((entry) => ({
  id: entry.id,
  projectName: entry.projectName,
  phase: entry.phase,
  score: entry.newScore,
  date: entry.date,
}));
