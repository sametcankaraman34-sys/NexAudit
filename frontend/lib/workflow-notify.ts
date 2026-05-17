import { AUDIT_PHASE_LABELS } from "@/constants/audit";
import { PHASE_ROLE_MAP, ROLE_LABELS, UNLOCK_NOTIFY_ROLE } from "@/constants/workflow";
import type { AuditPhaseId } from "@/types";
import type { Notification } from "@/types";
import type { AuditRoleId } from "@/types/workflow";

export function buildScanCompletedNotification(
  projectName: string,
  phaseId: AuditPhaseId,
  issueCount: number,
): Notification {
  const phaseLabel = AUDIT_PHASE_LABELS[phaseId];
  return {
    id: `n-scan-${Date.now()}`,
    title: `${phaseLabel} taraması tamamlandı`,
    message:
      issueCount > 0
        ? `${projectName} · ${issueCount} yeni bulgu — inceleme için hazır.`
        : `${projectName} · sonuçlar güncellendi, kontrol edebilirsin.`,
    time: "Az önce",
    read: false,
    category: phaseId === "seo" ? "seo" : "audit",
    severity: issueCount > 0 ? "medium" : "low",
    actionHref: phaseId === "website" ? "/website-audit" : phaseId === "seo" ? "/seo-audit" : "/ads-audit",
    actionLabel: "Sonuçları gör",
  };
}

export function buildPhaseUnlockedNotification(
  projectName: string,
  phaseId: AuditPhaseId,
): Notification {
  const phaseLabel = AUDIT_PHASE_LABELS[phaseId];
  const roleId = UNLOCK_NOTIFY_ROLE[phaseId];
  const assignee = roleId ? ROLE_LABELS[roleId] : "Ekip";
  return {
    id: `n-unlock-${Date.now()}`,
    title: `${phaseLabel} kilidi açıldı ✨`,
    message: `${projectName} · ${assignee} için sıradaki tur hazır.`,
    time: "Az önce",
    read: false,
    category: phaseId === "seo" ? "seo" : "audit",
    severity: "low",
    actionHref: phaseId === "seo" ? "/seo-audit" : phaseId === "ads" ? "/ads-audit" : "/website-audit",
    actionLabel: "Aşamaya git",
  };
}

export function buildTeamHandoffNotification(
  projectName: string,
  fromPhase: AuditPhaseId,
  toPhase: AuditPhaseId,
): Notification {
  const roleId = PHASE_ROLE_MAP[toPhase];
  return {
    id: `n-handoff-${Date.now()}`,
    title: `${ROLE_LABELS[roleId]} bilgilendirildi`,
    message: `${AUDIT_PHASE_LABELS[fromPhase]} tamamlandı — ${AUDIT_PHASE_LABELS[toPhase]} turu açıldı.`,
    time: "Az önce",
    read: false,
    category: "system",
    severity: "low",
    actionHref: toPhase === "seo" ? "/seo-audit" : toPhase === "ads" ? "/ads-audit" : "/website-audit",
    actionLabel: "Tura git",
  };
}

export function resolveAssigneeForPhase(phaseId: AuditPhaseId): AuditRoleId {
  return PHASE_ROLE_MAP[phaseId];
}
