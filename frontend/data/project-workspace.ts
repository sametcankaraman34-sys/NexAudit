import {
  mockAuditPhases,
  mockDashboardStats,
  mockIssueDistribution,
  mockRecommendations,
} from "@/data/mock-audit";
import {
  briefAiInsights,
  briefComplianceMeta,
  briefComplianceMetrics,
  briefDeviations,
  complianceAnalytics,
  visualComparisons,
} from "@/data/mock-brief-compliance";
import {
  mockBriefCritical,
  mockBriefMet,
  mockBriefMissing,
  mockBriefPartial,
} from "@/data/mock-brief";
import { mockFeaturedIssues } from "@/data/mock-issues";
import { mockNotifications } from "@/data/mock-notifications";
import type { AppDatabase } from "@/types/app-database";
import type { IntelligenceIssue } from "@/types/audit-intelligence";
import {
  auditTimeline,
  evolutionMetrics,
  historicalInsights,
  reportHistoryOverview,
} from "@/data/mock-report-history";
import {
  adsGuidance,
  adsIssues,
  adsMetricFindings,
  adsPerformanceFactors,
  adsSummary,
  landingInsights,
  trackingCards,
} from "@/data/mock-ads-audit";
import {
  seoSummary,
  seoCategories,
  seoContentFindings,
  seoGuidance,
  seoIssues,
  seoKeywords,
  seoPerformanceFactors,
} from "@/data/mock-seo-audit";
import {
  analysisCategories,
  websiteAuditSummary,
  websiteGuidanceItems,
  websiteIntelligenceIssues,
  websiteIntelligenceSummary,
  websiteMetricFindings,
  websitePerformanceFactors,
} from "@/data/mock-website-audit";
import { getPhaseDescription } from "@/lib/phase-copy";
import { recalculateProjectMetrics } from "@/services/project-metrics";
import type {
  AuditPhase,
  AuditPhaseStatus,
  BriefItem,
  DashboardStat,
  Issue,
  IssueDistribution,
  Notification,
  Project,
  ProjectPhaseState,
  Recommendation,
} from "@/types";
import type { AuditIntelligenceSummary, AnalysisCategory } from "@/types/audit-intelligence";
import type {
  BriefComplianceMetric,
  BriefAiInsight,
  BriefDeviation,
  ComplianceAnalyticItem,
  VisualComparisonItem,
} from "@/data/mock-brief-compliance";
import type {
  AuditTimelineEntry,
  EvolutionMetric,
  HistoricalInsight,
  ReportHistoryOverview,
} from "@/data/mock-report-history";

const BASELINE_SCORE = 68;

export interface ProjectBriefData {
  score: number;
  maxScore: number;
  label: string;
  met: typeof mockBriefMet;
  missing: typeof mockBriefMissing;
  partial: typeof mockBriefPartial;
  critical: typeof mockBriefCritical;
}

export interface ProjectBriefComplianceData {
  meta: typeof briefComplianceMeta;
  metrics: BriefComplianceMetric[];
  visualComparisons: VisualComparisonItem[];
  deviations: BriefDeviation[];
  analytics: ComplianceAnalyticItem[];
  aiInsights: BriefAiInsight[];
}

export interface ProjectWorkspace {
  project: Project;
  dashboard: {
    stats: DashboardStat[];
    auditPhases: AuditPhase[];
    issueDistribution: IssueDistribution[];
    recommendations: Recommendation[];
    featuredIssues: Issue[];
  };
  brief: ProjectBriefData;
  briefCompliance: ProjectBriefComplianceData;
  notifications: Notification[];
  reportHistory: {
    overview: ReportHistoryOverview;
    timeline: AuditTimelineEntry[];
    evolution: EvolutionMetric[];
    insights: HistoricalInsight[];
  };
  websiteAudit: {
    summary: Omit<typeof websiteAuditSummary, "riskLevel"> & {
      riskLevel: Project["riskLevel"];
    };
    intelligenceSummary: AuditIntelligenceSummary;
    categories: AnalysisCategory[];
    issues: typeof websiteIntelligenceIssues;
    metrics: typeof websiteMetricFindings;
    performance: typeof websitePerformanceFactors;
    guidance: typeof websiteGuidanceItems;
  };
  seoAudit: {
    summary: AuditIntelligenceSummary;
    categories: AnalysisCategory[];
    issues: typeof seoIssues;
    keywords: typeof seoKeywords;
    contentFindings: typeof seoContentFindings;
    performance: typeof seoPerformanceFactors;
    guidance: typeof seoGuidance;
  };
  adsAudit: {
    summary: AuditIntelligenceSummary;
    issues: typeof adsIssues;
    metricFindings: typeof adsMetricFindings;
    performance: typeof adsPerformanceFactors;
    guidance: typeof adsGuidance;
    trackingCards: typeof trackingCards;
    landingInsights: typeof landingInsights;
  };
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function scaleScore(base: number, project: Project): number {
  if (project.overallScore === 0) return 0;
  return clampScore((base / BASELINE_SCORE) * project.overallScore);
}

function projectFingerprint(projectId: string, salt: number): number {
  let hash = salt;
  for (let i = 0; i < projectId.length; i++) {
    hash = (hash * 31 + projectId.charCodeAt(i)) % 23;
  }
  return hash - 11;
}

function countBreakdownFromIssues(issues: Issue[]): {
  breakdown: [number, number, number, number];
  totalOpen: number;
} {
  const open = issues.filter((i) => i.status !== "resolved");
  const breakdown: [number, number, number, number] = [0, 0, 0, 0];
  for (const issue of open) {
    if (issue.severity === "critical") breakdown[0]++;
    else if (issue.severity === "high") breakdown[1]++;
    else if (issue.severity === "medium") breakdown[2]++;
    else breakdown[3]++;
  }
  return { breakdown, totalOpen: open.length };
}

function resolveDisplayProject(project: Project, issues: Issue[]): Project {
  if (!issues.length) return project;
  return recalculateProjectMetrics(project, issues);
}

function scaleCategories(categories: AnalysisCategory[], project: Project): AnalysisCategory[] {
  return categories.map((cat, index) => {
    const variation = projectFingerprint(project.id, index + 1);
    const baseScore = scaleScore(cat.score, project);
    const score = clampScore(baseScore + variation);
    return {
      ...cat,
      score,
      issueCount: Math.max(0, cat.issueCount + Math.floor(variation / 4)),
      criticalCount: Math.max(0, cat.criticalCount + (variation > 5 ? 1 : 0)),
      barValues: cat.barValues.map((v, barIndex) =>
        clampScore(scaleScore(v, project) + projectFingerprint(project.id, index * 4 + barIndex)),
      ),
    };
  });
}

function mapPhaseToAuditStatus(status: ProjectPhaseState["status"]): AuditPhaseStatus {
  if (status === "completed") return "completed";
  if (status === "in_progress") return "active";
  return "locked";
}

function buildAuditPhases(project: Project): AuditPhase[] {
  const phases = mockAuditPhases.map((phase) => {
    const projectPhase = project.phases.find((p) => p.id === phase.id);
    const progress = projectPhase?.progress ?? 0;
    const status = projectPhase
      ? mapPhaseToAuditStatus(projectPhase.status)
      : "locked";
    return { ...phase, status, progress };
  });
  return phases.map((phase) => ({
    ...phase,
    description: getPhaseDescription({ ...phase }),
  }));
}

function buildDashboardStats(project: Project, issues: Issue[]): DashboardStat[] {
  const display = resolveDisplayProject(project, issues);
  const fromIssues = issues.length ? countBreakdownFromIssues(issues) : null;
  const [c, h, m, l] = fromIssues?.breakdown ?? display.issueBreakdown;
  const totalOpen = fromIssues?.totalOpen ?? display.totalIssues;
  const improvement = Math.max(0, totalOpen - (c + h + m + l));
  const trendPrefix = display.scoreTrend >= 0 ? "+" : "";
  const opportunityValue = Math.max(4, Math.round(totalOpen * 0.48));
  const opportunityBars =
    display.scoreHistory.length >= 3
      ? display.scoreHistory.slice(-5)
      : [
          Math.max(1, Math.round(opportunityValue * 0.55)),
          Math.max(1, Math.round(opportunityValue * 0.68)),
          Math.max(1, Math.round(opportunityValue * 0.8)),
          Math.max(1, Math.round(opportunityValue * 0.92)),
          opportunityValue,
        ];

  return [
    {
      ...mockDashboardStats[0],
      value: String(display.overallScore),
      trend: `${trendPrefix}${display.scoreTrend}`,
      trendDirection: display.scoreTrend >= 0 ? "up" : "down",
      trendPositive: display.scoreTrend >= 0,
      chart: { type: "sparkline", values: [...display.scoreHistory] },
    },
    {
      ...mockDashboardStats[1],
      value: String(c),
      trend: c > 8 ? `+${c - 5}` : `+${c}`,
      trendDirection: "up",
      trendPositive: false,
      chart: {
        type: "ring",
        values: [c],
        max: Math.max(totalOpen, 1),
      },
    },
    {
      ...mockDashboardStats[2],
      value: String(totalOpen),
      trend: `+${Math.max(1, Math.round(totalOpen * 0.2))}`,
      trendDirection: "up",
      trendPositive: false,
      chart: {
        type: "stacked",
        values: [c, h, m, l, improvement],
      },
    },
    {
      ...mockDashboardStats[3],
      value: String(opportunityValue),
      trend: `+${Math.max(1, Math.round(opportunityValue * 0.25))}`,
      trendDirection: "up",
      trendPositive: true,
      chart: { type: "bars", values: opportunityBars },
    },
  ];
}

function buildIssueDistribution(project: Project, issues: Issue[]): IssueDistribution[] {
  const display = resolveDisplayProject(project, issues);
  const fromIssues = issues.length ? countBreakdownFromIssues(issues) : null;
  const [c, h, m, l] = fromIssues?.breakdown ?? display.issueBreakdown;
  const totalOpen = fromIssues?.totalOpen ?? display.totalIssues;
  const improvement = Math.max(0, totalOpen - (c + h + m + l));
  return [
    { label: "Kritik", value: c },
    { label: "Yüksek", value: h },
    { label: "Orta", value: m },
    { label: "Düşük", value: l },
    { label: "İyileştirme", value: improvement },
  ];
}

function buildBrief(project: Project): ProjectBriefData {
  const score = project.briefScore ?? 0;
  const label =
    score >= 85 ? "Mükemmel" : score >= 70 ? "İyi" : score >= 50 ? "Orta" : score > 0 ? "Geliştirilmeli" : "—";

  return {
    score,
    maxScore: 100,
    label,
    met: mockBriefMet,
    missing: mockBriefMissing,
    partial: mockBriefPartial,
    critical: mockBriefCritical,
  };
}

function buildBriefCompliance(project: Project, briefItems: BriefItem[]): ProjectBriefComplianceData {
  const score = project.briefScore ?? 0;
  const prev = clampScore(score - Math.abs(project.scoreTrend));
  const metCount = briefItems.filter((i) => i.status === "met").length;
  const derivedScore =
    briefItems.length > 0 ? Math.round((metCount / briefItems.length) * 100) : score;

  return {
    meta: {
      ...briefComplianceMeta,
      projectName: project.name,
      domain: project.domain,
      overallScore: derivedScore,
      previousScore: prev,
      trend: derivedScore - prev,
      alignmentLabel:
        derivedScore >= 80
          ? "Güçlü uyum — kritik sapmalar giderildiğinde 90+ hedeflenir"
          : derivedScore >= 60
            ? "Orta uyum — brief sapmaları önceliklendirilmeli"
            : derivedScore > 0
              ? "Zayıf uyum — marka ve UX hizalaması gözden geçirilmeli"
              : "Brief analizi henüz başlamadı",
    },
    metrics: briefComplianceMetrics.map((m, index) => ({
      ...m,
      score:
        m.id === "overall"
          ? derivedScore
          : clampScore(scaleScore(m.score, project) + projectFingerprint(project.id, index + 3)),
    })),
    visualComparisons: visualComparisons.map((item, index) => ({
      ...item,
      matchPercent: clampScore(
        scaleScore(item.matchPercent, project) + projectFingerprint(project.id, index + 9),
      ),
      barValues: item.barValues.map((v, barIndex) =>
        clampScore(scaleScore(v, project) + projectFingerprint(project.id, index + barIndex + 20)),
      ),
    })),
    deviations: briefDeviations,
    analytics: complianceAnalytics.map((item) => ({
      ...item,
      complianceLevel: scaleScore(item.complianceLevel, project),
    })),
    aiInsights: briefAiInsights,
  };
}

function personalizeText(text: string, project: Project): string {
  return text
    .replace(/Ajans Demo Projesi/g, project.name)
    .replace(/ajansdemo\.com\.tr/g, project.domain)
    .replace(/Ajans Demo/g, project.customerName);
}

function buildNotifications(project: Project): Notification[] {
  return mockNotifications.map((n) => ({
    ...n,
    id: `${project.id}-${n.id}`,
    message: personalizeText(n.message, project),
  }));
}

function buildReportHistory(project: Project) {
  const timeline = auditTimeline
    .filter((entry) => entry.projectName === "Ajans Demo Projesi")
    .map((entry) => ({
      ...entry,
      id: `${project.id}-${entry.id}`,
      projectName: project.name,
      previousScore: scaleScore(entry.previousScore, project),
      newScore: scaleScore(entry.newScore, project),
      scoreSparkline: entry.scoreSparkline.map((v) => scaleScore(v, project)),
    }));

  const overview: ReportHistoryOverview = {
    ...reportHistoryOverview,
    averageScore: project.overallScore || reportHistoryOverview.averageScore,
    scoreSparkline: project.scoreHistory.length
      ? project.scoreHistory
      : reportHistoryOverview.scoreSparkline,
    lastAuditDate: project.updatedAt,
    totalAudits: Math.max(3, timeline.length * 2),
    issuesResolved: Math.max(0, project.totalIssues * 4),
  };

  return {
    overview,
    timeline: project.status === "draft" ? [] : timeline,
    evolution: evolutionMetrics.map((m) => ({
      ...m,
      before: scaleScore(m.before, project),
      after: scaleScore(m.after, project),
    })),
    insights: historicalInsights.map((insight) => ({
      ...insight,
      id: `${project.id}-${insight.id}`,
      insight: personalizeText(insight.insight, project),
    })),
  };
}

function buildIntelligenceSummary(
  base: AuditIntelligenceSummary,
  project: Project,
  score: number,
): AuditIntelligenceSummary {
  const previous = clampScore(score - Math.abs(project.scoreTrend));
  return {
    ...base,
    domain: project.domain,
    lastScanAt: project.lastScanAt,
    overallScore: score,
    previousScore: previous,
    trend: score - previous,
    riskLevel: project.riskLevel,
    statusLabel: project.status === "draft" ? "Tarama bekliyor" : base.statusLabel,
  };
}

function buildWebsiteAudit(project: Project) {
  const webScore = scaleScore(websiteAuditSummary.overallScore, project);
  return {
    summary: {
      ...websiteAuditSummary,
      overallScore: webScore,
      previousScore: clampScore(webScore - project.scoreTrend),
      trend: project.scoreTrend,
      riskLevel: project.riskLevel,
      domain: project.domain,
      lastScanAt: project.lastScanAt,
    },
    intelligenceSummary: buildIntelligenceSummary(
      websiteIntelligenceSummary,
      project,
      webScore,
    ),
    categories: scaleCategories(analysisCategories, project),
    issues: websiteIntelligenceIssues,
    metrics: websiteMetricFindings,
    performance: websitePerformanceFactors,
    guidance: websiteGuidanceItems,
  };
}

function buildSeoAudit(project: Project) {
  const seoPhase = project.phases.find((p) => p.id === "seo");
  const seoScore = seoPhase?.progress
    ? scaleScore(seoSummary.overallScore, project)
    : scaleScore(seoSummary.overallScore, project);

  return {
    summary: buildIntelligenceSummary(seoSummary, project, seoScore),
    categories: scaleCategories(seoCategories, project),
    issues: seoIssues,
    keywords: seoKeywords,
    contentFindings: seoContentFindings,
    performance: seoPerformanceFactors,
    guidance: seoGuidance,
  };
}

function buildAdsAudit(project: Project) {
  const adsPhase = project.phases.find((p) => p.id === "ads");
  const adsScore = adsPhase?.progress
    ? scaleScore(adsSummary.overallScore, project)
    : scaleScore(adsSummary.overallScore, project);

  return {
    summary: buildIntelligenceSummary(adsSummary, project, adsScore),
    issues: adsIssues,
    metricFindings: adsMetricFindings,
    performance: adsPerformanceFactors,
    guidance: adsGuidance,
    trackingCards,
    landingInsights,
  };
}

function issuesToIntelligence(issues: Issue[]): IntelligenceIssue[] {
  const impactBySeverity: Record<Issue["severity"], string> = {
    critical: "Arama görünürlüğü ve dönüşümde yüksek risk",
    high: "Performans ve SEO skorunu düşürüyor",
    medium: "Kullanıcı deneyimini etkiliyor",
    low: "İyileştirme fırsatı",
    improvement: "Optimizasyon potansiyeli",
  };
  return issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    location: issue.location,
    severity: issue.severity,
    status: issue.status,
    impact: impactBySeverity[issue.severity],
    optimizationPotential:
      issue.severity === "critical" ? 18 : issue.severity === "high" ? 12 : 8,
    fixHint: issue.status === "resolved" ? "Çözüldü" : "Düzeltme rehberine bakın",
  }));
}

export function buildProjectWorkspace(
  project: Project,
  live?: { issues?: Issue[]; notifications?: Notification[]; briefItems?: BriefItem[] },
): ProjectWorkspace {
  const issues = live?.issues ?? [];
  const briefItems = live?.briefItems ?? [];
  const notifications = live?.notifications ?? buildNotifications(project);
  const featuredIssues = (issues.length ? issues : mockFeaturedIssues).slice(0, 8);
  const displayProject = resolveDisplayProject(project, issues);

  const websiteAuditBase = buildWebsiteAudit(displayProject);
  const intelligenceFromStore = issuesToIntelligence(issues);

  return {
    project: displayProject,
    dashboard: {
      stats: buildDashboardStats(project, issues),
      auditPhases: buildAuditPhases(displayProject),
      issueDistribution: buildIssueDistribution(project, issues),
      recommendations: mockRecommendations,
      featuredIssues,
    },
    brief: buildBrief(displayProject),
    briefCompliance: buildBriefCompliance(displayProject, briefItems),
    notifications,
    reportHistory: buildReportHistory(displayProject),
    websiteAudit: {
      ...websiteAuditBase,
      intelligenceSummary: {
        ...websiteAuditBase.intelligenceSummary,
        overallScore: scaleScore(websiteAuditBase.intelligenceSummary.overallScore, displayProject),
      },
      issues:
        intelligenceFromStore.length > 0
          ? intelligenceFromStore
          : websiteAuditBase.issues,
    },
    seoAudit: buildSeoAudit(displayProject),
    adsAudit: buildAdsAudit(displayProject),
  };
}

export function getProjectWorkspaceFromDb(db: AppDatabase, projectId: string): ProjectWorkspace {
  const project = db.projects.find((p) => p.id === projectId) ?? db.projects[0];
  if (!project) {
    throw new Error("Proje bulunamadı");
  }
  return buildProjectWorkspace(project, {
    issues: db.issuesByProject[projectId] ?? [],
    notifications: db.notificationsByProject[projectId] ?? [],
    briefItems: db.briefItemsByProject[projectId] ?? [],
  });
}

export function getProjectByIdFromDb(db: AppDatabase, projectId: string): Project {
  return db.projects.find((p) => p.id === projectId) ?? db.projects[0];
}

export const DEFAULT_PROJECT_ID = "proj-1";
