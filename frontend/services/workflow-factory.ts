import type { AuditPhaseId } from "@/types";
import type { PhaseWorkflowRecord, ProjectWorkflowMap } from "@/types/workflow";
import type { ProjectPhaseState } from "@/types";

export function createDefaultPhaseWorkflow(phaseId: AuditPhaseId): PhaseWorkflowRecord {
  return {
    phaseId,
    scan: {
      status: "idle",
      progress: 0,
      currentStep: null,
      lastScanAt: null,
      lastError: null,
      scanCount: 0,
    },
    operationalStatus: "draft",
    humanReviewed: false,
    draftSavedAt: null,
    assignedRoleId: null,
  };
}

export function createProjectWorkflow(
  phases: ProjectPhaseState[],
): ProjectWorkflowMap {
  const map = {} as ProjectWorkflowMap;
  for (const phase of phases) {
    const record = createDefaultPhaseWorkflow(phase.id);
    if (phase.status === "completed") {
      record.scan = {
        status: "completed",
        progress: 100,
        currentStep: null,
        lastScanAt: "Önceki oturum",
        lastError: null,
        scanCount: 1,
      };
      record.operationalStatus = "approved";
      record.humanReviewed = true;
    } else if (phase.status === "in_progress" && phase.progress >= 40) {
      record.scan = {
        status: "completed",
        progress: 100,
        currentStep: null,
        lastScanAt: "Son tarama",
        lastError: null,
        scanCount: 1,
      };
      record.operationalStatus = "in_review";
    }
    map[phase.id] = record;
  }
  return map;
}

export function formatActivityTime(date = new Date()): string {
  return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}
