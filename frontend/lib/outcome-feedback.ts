import { useOutcomeFeedbackStore } from "@/stores/outcome-feedback-store";
import type { AuditPhaseId } from "@/types";

export const OutcomeFeedback = {
  projectCompleted(projectId: string, projectName: string) {
    useOutcomeFeedbackStore.getState().emit({
      type: "project.completed",
      projectId,
      projectName,
    });
  },

  projectCancelled(projectId: string, projectName: string) {
    useOutcomeFeedbackStore.getState().emit({
      type: "project.cancelled",
      projectId,
      projectName,
    });
  },

  projectDeleted(projectName: string) {
    useOutcomeFeedbackStore.getState().emit({
      type: "project.deleted",
      projectId: "",
      projectName,
    });
  },

  stageCompleted(projectId: string, projectName: string, stageId: AuditPhaseId) {
    useOutcomeFeedbackStore.getState().emit({
      type: "stage.completed",
      projectId,
      projectName,
      stageId,
    });
  },

  stageUnlocked(projectId: string, projectName: string, stageId: AuditPhaseId) {
    useOutcomeFeedbackStore.getState().emit({
      type: "stage.unlocked",
      projectId,
      projectName,
      stageId,
    });
  },
};
