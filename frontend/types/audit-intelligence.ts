import type { IssueSeverity, IssueStatus } from "@/types";

export type AuditRiskLevel = "low" | "medium" | "high";

export interface AuditSummaryChip {
  label: string;
  value: string;
  accent?: "success" | "warning" | "primary";
}

export interface AuditIntelligenceSummary {
  title: string;
  badgeLabel: string;
  domain: string;
  lastScanAt: string;
  overallScore: number;
  previousScore: number;
  trend: number;
  riskLevel: AuditRiskLevel;
  statusLabel: string;
  chips: AuditSummaryChip[];
  sideStats: { label: string; value: string; sublabel?: string }[];
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

export interface IntelligenceIssue {
  id: string;
  title: string;
  location: string;
  severity: IssueSeverity;
  status: IssueStatus;
  impact: string;
  optimizationPotential: number;
  affectedElement?: string;
  fixHint?: string;
}

export interface MetricFinding {
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
  estimatedMs?: number;
  scorePenalty: number;
  barPercent: number;
  unit?: string;
}

export interface GuidanceItem {
  id: string;
  issueTitle: string;
  guidance: string;
  editorHint: string;
  priority: IssueSeverity;
}

export interface KeywordInsight {
  id: string;
  keyword: string;
  density: number;
  inTitle: boolean;
  inMeta: boolean;
  inH1: boolean;
  matchScore: number;
  status: "strong" | "weak" | "missing";
}

export interface TrackingCard {
  id: string;
  title: string;
  status: "active" | "partial" | "missing";
  eventsDetected: number;
  issues: number;
  optimizationGain: number;
  barValues: number[];
  detail: string;
}

export interface LandingInsight {
  id: string;
  section: string;
  score: number;
  issueCount: number;
  insight: string;
  barPercent: number;
}
