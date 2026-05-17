import type { IssueSeverity } from "@/types";

export interface BriefComplianceMetric {
  id: string;
  label: string;
  score: number;
  trend?: number;
}

export interface VisualComparisonItem {
  id: string;
  title: string;
  matchPercent: number;
  briefValue: string;
  siteValue: string;
  barValues: number[];
}

export interface BriefDeviation {
  id: string;
  message: string;
  severity: IssueSeverity;
  category: string;
  deviationValue?: string;
}

export interface ComplianceAnalyticItem {
  id: string;
  label: string;
  status: "met" | "partial" | "missing" | "critical";
  complianceLevel: number;
  confidence: number;
  impact: "high" | "medium" | "low";
  affectedArea: string;
  recommendation: string;
  detail?: string;
}

export interface BriefAiInsight {
  id: string;
  insight: string;
  strategicNote: string;
  priority: IssueSeverity;
}

export const briefComplianceMeta = {
  projectName: "Ajans Demo Projesi",
  domain: "ajansdemo.com.tr",
  lastAnalysisAt: "17 May 2026 · 11:48",
  briefVersion: "v2.3 · Kurumsal ton",
  overallScore: 82,
  previousScore: 74,
  trend: 8,
  alignmentLabel: "Güçlü uyum — kritik sapmalar giderildiğinde 90+ hedeflenir",
};

export const briefComplianceMetrics: BriefComplianceMetric[] = [
  { id: "overall", label: "Genel Brief Skoru", score: 82, trend: 8 },
  { id: "brand", label: "Marka Uyumu", score: 88, trend: 5 },
  { id: "ux", label: "UX Uyumu", score: 76, trend: 6 },
  { id: "content", label: "İçerik Uyumu", score: 79, trend: 4 },
  { id: "cta", label: "CTA Uyumu", score: 64, trend: -2 },
  { id: "mobile", label: "Mobil Uyum", score: 71, trend: 3 },
];

export const visualComparisons: VisualComparisonItem[] = [
  {
    id: "vc-1",
    title: "Renk paleti eşleşmesi",
    matchPercent: 77,
    briefValue: "Primary #6366F1 · Nötr gri",
    siteValue: "Primary #5B5BD6 · Sıcak gri",
    barValues: [82, 74, 68, 77],
  },
  {
    id: "vc-2",
    title: "Tipografi eşleşmesi",
    matchPercent: 84,
    briefValue: "SF Pro / 16–32px hiyerarşi",
    siteValue: "SF Pro · 2 başlık sapması",
    barValues: [88, 85, 80, 84],
  },
  {
    id: "vc-3",
    title: "CTA yapısı",
    matchPercent: 62,
    briefValue: "Teklif Al · birincil CTA",
    siteValue: "İletişime Geç · farklı metin",
    barValues: [70, 58, 65, 62],
  },
  {
    id: "vc-4",
    title: "Layout benzerliği",
    matchPercent: 81,
    briefValue: "Hero + 3 kolon hizmet",
    siteValue: "Hero + 3 kolon · spacing farkı",
    barValues: [85, 78, 82, 81],
  },
  {
    id: "vc-5",
    title: "Spacing tutarlılığı",
    matchPercent: 73,
    briefValue: "8px grid · 24/32 section",
    siteValue: "Karışık 20/28px aralıklar",
    barValues: [76, 70, 74, 73],
  },
  {
    id: "vc-6",
    title: "Bölüm hiyerarşisi",
    matchPercent: 86,
    briefValue: "H1→H2→kart yapısı",
    siteValue: "Uyumlu · 1 alt başlık eksik",
    barValues: [90, 84, 86, 86],
  },
];

export const briefDeviations: BriefDeviation[] = [
  {
    id: "dev-1",
    message: "Birincil marka rengi brief'ten sapıyor",
    severity: "critical",
    category: "Marka",
    deviationValue: "%23 ton farkı",
  },
  {
    id: "dev-2",
    message: "Hero CTA metni brief ile farklı ifade kullanıyor",
    severity: "high",
    category: "CTA",
    deviationValue: "Brief: Teklif Al",
  },
  {
    id: "dev-3",
    message: "Tipografi hiyerarşisi brief'teki ölçekle tam örtüşmüyor",
    severity: "medium",
    category: "Tipografi",
    deviationValue: "H2 −2px sapma",
  },
  {
    id: "dev-4",
    message: "Mobil section spacing brief layout beklentisinden geniş",
    severity: "medium",
    category: "Mobil",
    deviationValue: "+12px ortalama",
  },
  {
    id: "dev-5",
    message: "Kurumsal ton brief'e göre daha agresif satış dili içeriyor",
    severity: "low",
    category: "İçerik",
    deviationValue: "Ton analizi",
  },
];

export const complianceAnalytics: ComplianceAnalyticItem[] = [
  {
    id: "ca-1",
    label: "Logo ve marka renkleri uygulandı",
    status: "met",
    complianceLevel: 94,
    confidence: 96,
    impact: "high",
    affectedArea: "Global tema",
    recommendation: "Mevcut uygulama korunabilir; secondary renk dokümantasyonu güncellensin.",
  },
  {
    id: "ca-2",
    label: "Ana sayfa hero brief'e uygun",
    status: "met",
    complianceLevel: 91,
    confidence: 92,
    impact: "high",
    affectedArea: "Anasayfa",
    recommendation: "Hero görsel brief moodboard ile uyumlu; metin tonu hafif yumuşatılabilir.",
  },
  {
    id: "ca-3",
    label: "CTA metni brief ile uyuşmuyor",
    status: "critical",
    complianceLevel: 48,
    confidence: 89,
    impact: "high",
    affectedArea: "Hero / Header",
    recommendation: "Birincil CTA'yı 'Teklif Al' olarak güncelleyin; Elementor Hero widget.",
    detail: "Brief: Teklif Al — Sitede: İletişime Geç",
  },
  {
    id: "ca-4",
    label: "Hizmetler bölümü kısmen uyumlu",
    status: "partial",
    complianceLevel: 68,
    confidence: 85,
    impact: "medium",
    affectedArea: "Hizmetler",
    recommendation: "3/5 kart brief sırasıyla eşleşiyor; eksik 2 kart brief'ten kopyalanmalı.",
    detail: "3/5 hizmet kartı eşleşiyor",
  },
  {
    id: "ca-5",
    label: "Referanslar sayfası henüz eklenmedi",
    status: "missing",
    complianceLevel: 0,
    confidence: 98,
    impact: "medium",
    affectedArea: "Referanslar",
    recommendation: "Brief'te zorunlu referans grid'i için yeni sayfa ve menü öğesi ekleyin.",
  },
  {
    id: "ca-6",
    label: "Renk paleti sapması",
    status: "critical",
    complianceLevel: 52,
    confidence: 91,
    impact: "high",
    affectedArea: "Tema / CSS değişkenleri",
    recommendation: "Primary token #6366F1 olarak global style'da düzeltilmeli.",
    detail: "#6366F1 yerine #5B5BD6",
  },
];

export const briefAiInsights: BriefAiInsight[] = [
  {
    id: "ai-1",
    insight: "Brief daha kurumsal ve güven veren bir ton hedefliyor; mevcut CTA dili agresif satış hissi veriyor.",
    strategicNote: "CTA ve hero alt metnini brief'teki 'danışmanlık' çerçevesine çekin.",
    priority: "high",
  },
  {
    id: "ai-2",
    insight: "Görsel hiyerarşi brief beklentisine yakın; spacing tutarsızlıkları marka algısını zayıflatıyor.",
    strategicNote: "8px grid sistemini section padding'lerinde yeniden uygulayın.",
    priority: "medium",
  },
  {
    id: "ai-3",
    insight: "Marka renk sapması küçük görünse de tüm UI yüzeyinde kümülatif etki yaratıyor.",
    strategicNote: "Elementor global colors → brief palette import önerilir.",
    priority: "critical",
  },
  {
    id: "ai-4",
    insight: "Mobil deneyim brief'teki sade layout'a göre daha yoğun; scroll derinliği fazla.",
    strategicNote: "Mobilde section aralıklarını brief'teki 24px standardına indirin.",
    priority: "medium",
  },
];
