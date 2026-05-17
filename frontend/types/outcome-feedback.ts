import type { AuditPhaseId } from "@/types";

export type OutcomeEventType =
  | "project.completed"
  | "project.cancelled"
  | "project.deleted"
  | "stage.completed"
  | "stage.unlocked";

export interface OutcomeEventBase {
  id: string;
  createdAt: number;
}

export interface ProjectOutcomeEvent extends OutcomeEventBase {
  type: "project.completed" | "project.cancelled" | "project.deleted";
  projectId: string;
  projectName: string;
}

export interface StageOutcomeEvent extends OutcomeEventBase {
  type: "stage.completed" | "stage.unlocked";
  projectId: string;
  projectName: string;
  stageId: AuditPhaseId;
}

export type OutcomeEvent = ProjectOutcomeEvent | StageOutcomeEvent;

export function isModalOutcome(event: OutcomeEvent): boolean {
  return (
    event.type === "project.completed" ||
    event.type === "project.cancelled" ||
    event.type === "stage.completed"
  );
}

export function isToastOutcome(event: OutcomeEvent): boolean {
  return event.type === "project.deleted" || event.type === "stage.unlocked";
}
