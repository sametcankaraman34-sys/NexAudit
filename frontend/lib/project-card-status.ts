import type { Project } from "@/types";

export type ProjectOperationalStatusId =
  | "active"
  | "auditing"
  | "waiting"
  | "completed"
  | "risky"
  | "archived";

export interface ProjectOperationalStatus {
  id: ProjectOperationalStatusId;
  label: string;
  tone: "success" | "primary" | "warning" | "danger" | "neutral" | "muted";
}

export function getProjectOperationalStatus(
  project: Project,
  options?: { isScanning?: boolean },
): ProjectOperationalStatus {
  if (project.status === "archived") {
    return { id: "archived", label: "Arşiv", tone: "muted" };
  }
  if (options?.isScanning) {
    return { id: "auditing", label: "Denetimde", tone: "primary" };
  }

  const allPhasesDone = project.phases.every((p) => p.status === "completed");
  if (allPhasesDone) {
    return { id: "completed", label: "Tamamlandı", tone: "success" };
  }

  if (project.riskLevel === "high" || project.criticalIssues >= 4) {
    return { id: "risky", label: "Riskli", tone: "danger" };
  }

  if (project.status === "draft") {
    return { id: "waiting", label: "Beklemede", tone: "warning" };
  }

  const inAudit = project.phases.some((p) => p.status === "in_progress");
  if (inAudit) {
    return { id: "auditing", label: "Denetimde", tone: "primary" };
  }

  return { id: "active", label: "Aktif", tone: "success" };
}

export function getScanTargetPhaseId(project: Project): "website" | "seo" | "ads" {
  const inProgress = project.phases.find((p) => p.status === "in_progress");
  if (inProgress) return inProgress.id;
  const unlocked = project.phases.find((p) => p.status !== "locked" && p.status !== "completed");
  if (unlocked) return unlocked.id;
  return "website";
}
