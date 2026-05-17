import type { AuditPhaseId, AuditPhaseStatus, ProjectPhaseState } from "@/types";

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

export function getLockedMessage(phaseId: AuditPhaseId): string {
  if (phaseId === "seo") {
    return "SEO Optimizasyonu için önce Web Tasarım Denetimi tamamlanmalıdır.";
  }
  if (phaseId === "ads") {
    return "Reklam & Dönüşüm için önce SEO Optimizasyonu tamamlanmalıdır.";
  }
  return "Bu aşama henüz kilitli.";
}
