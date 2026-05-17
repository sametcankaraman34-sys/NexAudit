import type { AuditPhaseId } from "@/types";

/** Tarama yaşam döngüsü */
export type ScanStatus = "idle" | "scanning" | "analyzing" | "completed" | "error";

/** Operasyonel aşama durumu (ekip onayı) */
export type PhaseOperationalStatus = "draft" | "in_review" | "approved" | "reopened";

/** İleride rol ataması için */
export type AuditRoleId = "web_design" | "seo" | "ads" | "owner";

export interface PhaseScanState {
  status: ScanStatus;
  progress: number;
  currentStep: string | null;
  lastScanAt: string | null;
  lastError: string | null;
  scanCount: number;
}

export interface PhaseWorkflowRecord {
  phaseId: AuditPhaseId;
  scan: PhaseScanState;
  operationalStatus: PhaseOperationalStatus;
  humanReviewed: boolean;
  draftSavedAt: string | null;
  assignedRoleId: AuditRoleId | null;
}

export type ActivityEventType =
  | "scan.started"
  | "scan.step"
  | "scan.completed"
  | "scan.failed"
  | "phase.completed"
  | "phase.reopened"
  | "phase.draft_saved"
  | "phase.unlocked"
  | "notification.sent"
  | "issue.detected"
  | "review.required";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  phaseId?: AuditPhaseId;
  message: string;
  timeLabel: string;
  createdAt: number;
  assigneeRoleId?: AuditRoleId;
}

export type ProjectWorkflowMap = Record<AuditPhaseId, PhaseWorkflowRecord>;
