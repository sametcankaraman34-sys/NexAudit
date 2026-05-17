import type { AuditPhaseId, AuditPhaseStatus, ProjectPhaseState } from "@/types";
import { getLockedMessage, getLockedScreenCopy } from "@/lib/phase-copy";

export function getPhaseStatus(
  phaseId: AuditPhaseId,
  phases: ProjectPhaseState[],
): AuditPhaseStatus {
  const phase = phases.find((p) => p.id === phaseId);
  if (!phase) return "locked";
  if (phase.status === "completed") return "completed";
  if (phase.status === "in_progress") return "active";
  return "locked";
}

export function isPhaseLocked(
  phaseId: AuditPhaseId,
  phases: ProjectPhaseState[],
): boolean {
  return getPhaseStatus(phaseId, phases) === "locked";
}

export { getLockedMessage, getLockedScreenCopy };
