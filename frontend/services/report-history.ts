import type { AuditTimelineEntry } from "@/data/mock-report-history";
import type { AuditPhaseId, Project } from "@/types";

const PHASE_LABELS: Record<AuditPhaseId, string> = {
  website: "Web Tasarım Denetimi",
  seo: "SEO Optimizasyonu",
  ads: "Reklam & Dönüşüm",
};

export function createPhaseCompleteReportEntry(
  project: Project,
  phaseId: AuditPhaseId,
  previousScore: number,
  newScore: number,
  issuesResolved: number,
): AuditTimelineEntry {
  return createScanReportEntry(project, phaseId, previousScore, newScore, issuesResolved);
}

export function createScanReportEntry(
  project: Project,
  phaseId: AuditPhaseId,
  previousScore: number,
  newScore: number,
  issuesResolved: number,
): AuditTimelineEntry {
  return {
    id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    projectName: project.name,
    phase: PHASE_LABELS[phaseId],
    phaseId,
    previousScore,
    newScore,
    issuesResolved,
    criticalReduced: Math.max(0, Math.round(issuesResolved * 0.25)),
    optimizationGains: ["Skor güncellendi", "Yeni bulgular kaydedildi"],
    date: new Date().toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    status: "completed",
    scoreSparkline:
      project.scoreHistory.length >= 2
        ? [...project.scoreHistory.slice(-4), newScore]
        : [previousScore, newScore],
  };
}
