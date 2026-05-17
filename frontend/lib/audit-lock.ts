import { mockAuditPhases } from "@/data/mock-audit";
import type { AuditPhaseId } from "@/types";

export function getPhaseStatus(phaseId: AuditPhaseId) {
  return mockAuditPhases.find((p) => p.id === phaseId)?.status ?? "locked";
}

export function isPhaseLocked(phaseId: AuditPhaseId): boolean {
  const status = getPhaseStatus(phaseId);
  return status === "locked";
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
