import { DEMO_AUDIT_PHASE_STATUS } from "@/constants/audit";
import type { AuditPhaseId } from "@/types";

export function getPhaseStatus(phaseId: AuditPhaseId) {
  return DEMO_AUDIT_PHASE_STATUS[phaseId] ?? "locked";
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
