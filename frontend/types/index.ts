export type AuditPhaseId = "website" | "seo" | "ads";

export type AuditPhaseStatus = "active" | "completed" | "locked";

export type IssueSeverity = "critical" | "high" | "medium" | "low" | "improvement";

export type IssueStatus = "detected" | "in_progress" | "resolved";

export type BriefItemStatus = "met" | "missing" | "partial" | "critical";

export type ProjectRiskLevel = "low" | "medium" | "high";

export type ProjectPhaseStatus = "completed" | "in_progress" | "locked" | "not_started";

export interface ProjectPhaseState {
  id: AuditPhaseId;
  status: ProjectPhaseStatus;
  progress: number;
}

export interface Project {
  id: string;
  name: string;
  domain: string;
  customerName: string;
  status: "active" | "draft" | "archived";
  overallScore: number;
  updatedAt: string;
  phases: ProjectPhaseState[];
  criticalIssues: number;
  briefScore: number | null;
  lastScanAt: string;
  lastActivity: string;
  riskLevel: ProjectRiskLevel;
  scoreTrend: number;
  issueBreakdown: [number, number, number, number];
  totalIssues: number;
  scoreHistory: number[];
}

export interface AuditPhase {
  id: AuditPhaseId;
  title: string;
  description: string;
  status: AuditPhaseStatus;
  progress: number;
}

export type StatChartType = "sparkline" | "ring" | "stacked" | "bars";

export interface DashboardStatChart {
  type: StatChartType;
  values: number[];
  max?: number;
}

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  trend?: string;
  trendDirection?: "up" | "down";
  trendPositive?: boolean;
  icon: string;
  accent: "primary" | "danger" | "info" | "success";
  chart?: DashboardStatChart;
}

export interface Issue {
  id: string;
  title: string;
  location: string;
  severity: IssueSeverity;
  status: IssueStatus;
  phase: AuditPhaseId | "brief";
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  scoreGain: number;
  icon: string;
}

export interface BriefItem {
  id: string;
  label: string;
  status: BriefItemStatus;
  detail?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "audit" | "issue" | "system";
}

export interface IssueDistribution {
  label: string;
  value: number;
}

export interface ReportHistoryItem {
  id: string;
  projectName: string;
  phase: string;
  score: number;
  date: string;
}
