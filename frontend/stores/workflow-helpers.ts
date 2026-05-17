import { PHASE_ROLE_MAP } from "@/constants/workflow";
import { formatActivityTime } from "@/services/workflow-factory";
import type { AppDatabase } from "@/types/app-database";
import type { AuditPhaseId } from "@/types";
import type {
  ActivityEvent,
  ActivityEventType,
  PhaseWorkflowRecord,
  ProjectWorkflowMap,
} from "@/types/workflow";
import {
  createDefaultPhaseWorkflow,
  createProjectWorkflow,
} from "@/services/workflow-factory";

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ensureProjectWorkflow(
  state: AppDatabase,
  projectId: string,
): ProjectWorkflowMap {
  const existing = state.workflowByProject[projectId];
  if (existing) return existing;
  const project = state.projects.find((p) => p.id === projectId);
  if (!project) return {} as ProjectWorkflowMap;
  return createProjectWorkflow(project.phases);
}

export function patchPhaseWorkflow(
  workflow: ProjectWorkflowMap,
  phaseId: AuditPhaseId,
  patch: Omit<Partial<PhaseWorkflowRecord>, "scan"> & {
    scan?: Partial<PhaseWorkflowRecord["scan"]>;
  },
): ProjectWorkflowMap {
  const current = workflow[phaseId] ?? createDefaultPhaseWorkflow(phaseId);
  return {
    ...workflow,
    [phaseId]: {
      ...current,
      ...patch,
      scan: { ...current.scan, ...patch.scan },
      assignedRoleId: patch.assignedRoleId ?? current.assignedRoleId ?? PHASE_ROLE_MAP[phaseId],
    },
  };
}

export function buildActivityEntry(
  type: ActivityEventType,
  message: string,
  phaseId?: AuditPhaseId,
): ActivityEvent {
  return {
    id: generateId("act"),
    type,
    phaseId,
    message,
    timeLabel: formatActivityTime(),
    createdAt: Date.now(),
    assigneeRoleId: phaseId ? PHASE_ROLE_MAP[phaseId] : undefined,
  };
}

export function prependActivity(
  activities: ActivityEvent[],
  entry: ActivityEvent,
  max = 40,
): ActivityEvent[] {
  return [entry, ...activities].slice(0, max);
}
