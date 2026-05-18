"use client";

import { createDefaultPhaseWorkflow } from "@/services/workflow-factory";
import { useAppStore } from "@/stores/app-store";
import type { AuditPhaseId } from "@/types";

export function usePhaseWorkflow(projectId: string, phaseId: AuditPhaseId) {
  const record = useAppStore(
    (s) => s.workflowByProject[projectId]?.[phaseId] ?? createDefaultPhaseWorkflow(phaseId),
  );
  const activities = useAppStore((s) => s.activityByProject[projectId] ?? []);
  const project = useAppStore((s) => s.projects.find((p) => p.id === projectId));
  const issues = useAppStore((s) => s.issuesByProject[projectId] ?? []);
  const startPhaseScan = useAppStore((s) => s.startPhaseScan);
  const completePhase = useAppStore((s) => s.completePhase);
  const reopenPhase = useAppStore((s) => s.reopenPhase);
  const savePhaseDraft = useAppStore((s) => s.savePhaseDraft);
  const markPhaseReviewed = useAppStore((s) => s.markPhaseReviewed);
  const isLoading = useAppStore((s) => s.async.isLoading);

  const phaseState = project?.phases.find((p) => p.id === phaseId);
  const openCritical = issues.filter(
    (i) =>
      i.phase === phaseId &&
      i.severity === "critical" &&
      i.status !== "resolved" &&
      i.status !== "ignored",
  ).length;
  const briefItems = useAppStore((s) => s.briefItemsByProject[projectId] ?? []);
  const briefGaps = briefItems.filter((b) => b.status === "missing" || b.status === "critical").length;

  const isScanning =
    record.scan.status === "scanning" || record.scan.status === "analyzing";
  const canComplete =
    phaseState?.status !== "completed" &&
    phaseState?.status !== "locked" &&
    record.scan.status === "completed" &&
    !isScanning;

  return {
    record,
    activities,
    project,
    phaseState,
    openCritical,
    briefGaps,
    isScanning,
    canComplete,
    isLoading,
    startPhaseScan: () => startPhaseScan(projectId, phaseId),
    completePhase: (force?: boolean) => completePhase(projectId, phaseId, { force }),
    reopenPhase: () => reopenPhase(projectId, phaseId),
    savePhaseDraft: () => savePhaseDraft(projectId, phaseId),
    markPhaseReviewed: () => markPhaseReviewed(projectId, phaseId),
  };
}
