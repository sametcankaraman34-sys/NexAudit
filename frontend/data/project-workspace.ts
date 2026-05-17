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
import { mockProjects } from "@/data/mock-projects";
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
import type {
  AuditPhase,
  AuditPhaseStatus,
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

function scaleCategories(categories: AnalysisCategory[], project: Project): AnalysisCategory[] {
  return categories.map((cat) => ({
    ...cat,
    score: scaleScore(cat.score, project),
    barValues: cat.barValues.map((v) => scaleScore(v, project)),
  }));
}

function mapPhaseToAuditStatus(status: ProjectPhaseState["status"]): AuditPhaseStatus {
  if (status === "completed") return "completed";
  if (status === "in_progress") return "active";
  return "locked";
}

function buildAuditPhases(project: Project): AuditPhase[] {
  return mockAuditPhases.map((phase) => {
    const projectPhase = project.phases.find((p) => p.id === phase.id);
    const progress = projectPhase?.progress ?? 0;
    const status = projectPhase
      ? mapPhaseToAuditStatus(projectPhase.status)
      : "locked";
    return { ...phase, status, progress };
  });
}

function buildDashboardStats(project: Project): DashboardStat[] {
  const [c, h, m, l] = project.issueBreakdown;
  const improvement = Math.max(0, project.totalIssues - (c + h + m + l));
  const trendPrefix = project.scoreTrend >= 0 ? "+" : "";

  return [
    {
      ...mockDashboardStats[0],
      value: String(project.overallScore),
      trend: `${trendPrefix}${project.scoreTrend}`,
      trendDirection: project.scoreTrend >= 0 ? "up" : "down",
      trendPositive: project.scoreTrend >= 0,
      chart: { type: "sparkline", values: project.scoreHistory },
    },
    {
      ...mockDashboardStats[1],
      value: String(project.criticalIssues),
      chart: {
        type: "ring",
        values: [project.criticalIssues],
        max: Math.max(project.totalIssues, 1),
      },
    },
    {
      ...mockDashboardStats[2],
      value: String(project.totalIssues),
      chart: {
        type: "stacked",
        values: [c, h, m, l, improvement],
      },
    },
    {
      ...mockDashboardStats[3],
      value: String(Math.max(8, Math.round(project.totalIssues * 0.48))),
    },
  ];
}

function buildIssueDistribution(project: Project): IssueDistribution[] {
  const [c, h, m, l] = project.issueBreakdown;
  const improvement = Math.max(0, project.totalIssues - (c + h + m + l));
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

function buildBriefCompliance(project: Project): ProjectBriefComplianceData {
  const score = project.briefScore ?? 0;
  const prev = clampScore(score - Math.abs(project.scoreTrend));

  return {
    meta: {
      ...briefComplianceMeta,
      projectName: project.name,
      domain: project.domain,
      overallScore: score,
      previousScore: prev,
      trend: score - prev,
      alignmentLabel:
        score >= 80
          ? "Güçlü uyum — kritik sapmalar giderildiğinde 90+ hedeflenir"
          : score >= 60
            ? "Orta uyum — brief sapmaları önceliklendirilmeli"
            : score > 0
              ? "Zayıf uyum — marka ve UX hizalaması gözden geçirilmeli"
              : "Brief analizi henüz başlamadı",
    },
    metrics: briefComplianceMetrics.map((m) => ({
      ...m,
      score: m.id === "overall" ? score : scaleScore(m.score, project),
    })),
    visualComparisons: visualComparisons.map((item) => ({
      ...item,
      matchPercent: scaleScore(item.matchPercent, project),
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

const workspaceCache = new Map<string, ProjectWorkspace>();

export function getProjectWorkspace(projectId: string): ProjectWorkspace {
  const cached = workspaceCache.get(projectId);
  if (cached) return cached;

  const project = mockProjects.find((p) => p.id === projectId) ?? mockProjects[0];
  const workspace: ProjectWorkspace = {
    project,
    dashboard: {
      stats: buildDashboardStats(project),
      auditPhases: buildAuditPhases(project),
      issueDistribution: buildIssueDistribution(project),
      recommendations: mockRecommendations,
      featuredIssues: mockFeaturedIssues.map((issue) => ({
        ...issue,
        id: `${project.id}-${issue.id}`,
        location: personalizeText(issue.location, project),
      })),
    },
    brief: buildBrief(project),
    briefCompliance: buildBriefCompliance(project),
    notifications: buildNotifications(project),
    reportHistory: buildReportHistory(project),
    websiteAudit: buildWebsiteAudit(project),
    seoAudit: buildSeoAudit(project),
    adsAudit: buildAdsAudit(project),
  };

  workspaceCache.set(projectId, workspace);
  return workspace;
}

export function getProjectById(projectId: string): Project {
  return mockProjects.find((p) => p.id === projectId) ?? mockProjects[0];
}

export const DEFAULT_PROJECT_ID = "proj-1";
