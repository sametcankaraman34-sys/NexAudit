import type { AuditPhaseId, ProjectPhaseState } from "@/types";

const NEXT_PHASE: Record<AuditPhaseId, AuditPhaseId | null> = {
  website: "seo",
  seo: "ads",
  ads: null,
};

export function completeProjectPhase(
  phases: ProjectPhaseState[],
  phaseId: AuditPhaseId,
): {
  phases: ProjectPhaseState[];
  unlockedPhaseId: AuditPhaseId | null;
  allCompleted: boolean;
} {
  const updated = phases.map((p) =>
    p.id === phaseId ? { ...p, status: "completed" as const, progress: 100 } : p,
  );

  const nextId = NEXT_PHASE[phaseId];
  let unlockedPhaseId: AuditPhaseId | null = null;
  let result = updated;

  if (nextId) {
    const next = updated.find((p) => p.id === nextId);
    if (next?.status === "locked") {
      unlockedPhaseId = nextId;
      result = updated.map((p) =>
        p.id === nextId
          ? { ...p, status: "in_progress" as const, progress: Math.max(p.progress, 8) }
          : p,
      );
    }
  }

  const allCompleted = result.every((p) => p.status === "completed");
  return { phases: result, unlockedPhaseId, allCompleted };
}
