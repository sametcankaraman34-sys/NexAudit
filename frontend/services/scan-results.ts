import type { AuditPhaseId, Issue, Project } from "@/types";
import { recalculateProjectMetrics } from "@/services/project-metrics";

const SCAN_ISSUE_TEMPLATES: Record<
  AuditPhaseId,
  { title: string; location: string; severity: Issue["severity"] }[]
> = {
  website: [
    { title: "Hero görseli optimize edilmeli", location: "Anasayfa", severity: "medium" },
    { title: "Mobil menü taşması", location: "Header", severity: "high" },
  ],
  seo: [
    { title: "Meta description eksik", location: "/hizmetler", severity: "critical" },
    { title: "H1 tekrarı", location: "Blog", severity: "high" },
  ],
  ads: [
    { title: "Landing CTA fold altında", location: "Kampanya LP", severity: "high" },
    { title: "Form alanı fazla uzun", location: "İletişim", severity: "medium" },
  ],
};

export function applyScanResultsToProject(
  project: Project,
  issues: Issue[],
  phaseId: AuditPhaseId,
): { project: Project; issues: Issue[]; newIssueCount: number } {
  const templates = SCAN_ISSUE_TEMPLATES[phaseId];
  const newIssues: Issue[] = templates.map((t, i) => ({
    id: `scan-${project.id}-${phaseId}-${Date.now()}-${i}`,
    title: t.title,
    location: t.location,
    severity: t.severity,
    status: "detected",
    phase: phaseId,
  }));

  const merged = [...newIssues, ...issues.filter((i) => i.phase !== phaseId || i.status === "resolved")];
  let updated = recalculateProjectMetrics(project, merged);

  const phase = updated.phases.find((p) => p.id === phaseId);
  if (phase && phase.status === "in_progress") {
    phase.progress = Math.min(92, Math.max(phase.progress, 55) + 18);
  }

  updated = {
    ...updated,
    lastScanAt: "Az önce",
    lastActivity: `${phaseId === "website" ? "Web" : phaseId === "seo" ? "SEO" : "Reklam"} taraması tamamlandı · ${newIssues.length} yeni bulgu`,
    scoreTrend: Math.min(12, updated.scoreTrend + 2),
  };

  return { project: updated, issues: merged, newIssueCount: newIssues.length };
}
