import type { Issue, Project, ProjectRiskLevel } from "@/types";

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function riskFromScore(score: number, critical: number): ProjectRiskLevel {
  if (critical >= 10 || score < 50) return "high";
  if (score < 70) return "medium";
  return "low";
}

/** Sorun listesinden proje metriklerini yeniden hesaplar */
export function recalculateProjectMetrics(project: Project, issues: Issue[]): Project {
  const open = issues.filter((i) => i.status !== "resolved");
  const breakdown: [number, number, number, number] = [0, 0, 0, 0];

  for (const issue of open) {
    if (issue.severity === "critical") breakdown[0]++;
    else if (issue.severity === "high") breakdown[1]++;
    else if (issue.severity === "medium") breakdown[2]++;
    else breakdown[3]++;
  }

  const resolvedCount = issues.length - open.length;
  const penalty = breakdown[0] * 4 + breakdown[1] * 2 + breakdown[2];
  const boost = resolvedCount * 2;
  const overallScore = clampScore(42 + boost + Math.min(project.phases[0]?.progress ?? 0, 100) * 0.25 - penalty);

  const previous = project.scoreHistory.at(-1) ?? project.overallScore;
  const scoreTrend = overallScore - previous;
  const scoreHistory = [...project.scoreHistory.slice(-5), overallScore];

  return {
    ...project,
    overallScore,
    criticalIssues: breakdown[0],
    totalIssues: open.length,
    issueBreakdown: breakdown,
    scoreTrend,
    scoreHistory,
    riskLevel: riskFromScore(overallScore, breakdown[0]),
    updatedAt: new Date().toISOString().slice(0, 10),
    lastActivity:
      open.length === 0
        ? "Tüm açık sorunlar giderildi · rapor güncellendi"
        : `${open.length} açık sorun · ${resolvedCount} çözüldü`,
  };
}
