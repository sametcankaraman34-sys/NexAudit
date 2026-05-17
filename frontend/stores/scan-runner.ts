import { SCAN_STEPS } from "@/constants/workflow";
import { buildScanCompletedNotification } from "@/lib/workflow-notify";
import { applyScanResultsToProject } from "@/services/scan-results";
import { formatActivityTime } from "@/services/workflow-factory";
import {
  buildActivityEntry,
  patchPhaseWorkflow,
  prependActivity,
} from "@/stores/workflow-helpers";
import type { AuditPhaseId, Notification, Project } from "@/types";
import type { AppDatabase } from "@/types/app-database";

type ScanStore = AppDatabase & {
  addNotification: (projectId: string, notification: Notification) => void;
};

function syncProjectInState(
  state: ScanStore,
  projectId: string,
  project: Project,
): Partial<ScanStore> {
  return {
    projects: state.projects.map((p) => (p.id === projectId ? project : p)),
  };
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function syncWorkflow(
  set: (fn: (state: ScanStore) => Partial<ScanStore>) => void,
  projectId: string,
  phaseId: AuditPhaseId,
  workflowPatch: Parameters<typeof patchPhaseWorkflow>[2],
  activity?: ReturnType<typeof buildActivityEntry>,
) {
  set((state) => {
    const workflow = state.workflowByProject[projectId] ?? {};
    const nextWorkflow = patchPhaseWorkflow(workflow, phaseId, workflowPatch);
    const activities = activity
      ? prependActivity(state.activityByProject[projectId] ?? [], activity)
      : state.activityByProject[projectId] ?? [];
    return {
      workflowByProject: { ...state.workflowByProject, [projectId]: nextWorkflow },
      activityByProject: activity
        ? { ...state.activityByProject, [projectId]: activities }
        : state.activityByProject,
    };
  });
}

export async function runPhaseScan(
  get: () => ScanStore,
  set: (fn: (state: ScanStore) => Partial<ScanStore>) => void,
  projectId: string,
  phaseId: AuditPhaseId,
): Promise<void> {
  const project = get().projects.find((p) => p.id === projectId);
  if (!project) return;

  const phase = project.phases.find((p) => p.id === phaseId);
  if (!phase || phase.status === "locked") return;

  const wf = get().workflowByProject[projectId]?.[phaseId];
  if (wf?.scan.status === "scanning" || wf?.scan.status === "analyzing") return;

  const steps = SCAN_STEPS[phaseId];
  const phaseLabel =
    phaseId === "website" ? "Web sitesi" : phaseId === "seo" ? "SEO" : "Reklam";

  syncWorkflow(
    set,
    projectId,
    phaseId,
    {
      scan: {
        status: "scanning",
        progress: 0,
        currentStep: steps[0],
        lastError: null,
      },
      operationalStatus: "in_review",
      humanReviewed: false,
    },
    buildActivityEntry("scan.started", `${phaseLabel} taraması başlatıldı`, phaseId),
  );

  for (let i = 0; i < steps.length; i++) {
    await delay(380);
    const progress = Math.round(((i + 1) / steps.length) * 82);
    syncWorkflow(set, projectId, phaseId, {
      scan: { status: "scanning", progress, currentStep: steps[i] },
    });
    if (i % 2 === 0) {
      set((state) => ({
        activityByProject: {
          ...state.activityByProject,
          [projectId]: prependActivity(
            state.activityByProject[projectId] ?? [],
            buildActivityEntry("scan.step", steps[i], phaseId),
          ),
        },
      }));
    }
  }

  await delay(320);
  syncWorkflow(set, projectId, phaseId, {
    scan: { status: "analyzing", progress: 90, currentStep: "Bulgular derleniyor…" },
  });

  await delay(420);

  const issues = get().issuesByProject[projectId] ?? [];
  const { project: updatedProject, issues: newIssues, newIssueCount } =
    applyScanResultsToProject(project, issues, phaseId);

  set((state) => ({
    ...syncProjectInState(state, projectId, updatedProject),
    issuesByProject: { ...state.issuesByProject, [projectId]: newIssues },
    notificationsByProject: {
      ...state.notificationsByProject,
      [projectId]: [
        buildScanCompletedNotification(project.name, phaseId, newIssueCount),
        ...(state.notificationsByProject[projectId] ?? []),
      ],
    },
    workflowByProject: {
      ...state.workflowByProject,
      [projectId]: patchPhaseWorkflow(
        state.workflowByProject[projectId] ?? {},
        phaseId,
        {
          scan: {
            status: "completed",
            progress: 100,
            currentStep: null,
            lastScanAt: formatActivityTime(),
            lastError: null,
            scanCount: (wf?.scan.scanCount ?? 0) + 1,
          },
          operationalStatus: "in_review",
          humanReviewed: false,
        },
      ),
    },
    activityByProject: (() => {
      let activities = state.activityByProject[projectId] ?? [];
      activities = prependActivity(
        activities,
        buildActivityEntry("review.required", "Ekip incelemesi bekleniyor", phaseId),
      );
      activities = prependActivity(
        activities,
        buildActivityEntry(
          "issue.detected",
          newIssueCount > 0
            ? `${newIssueCount} yeni bulgu kaydedildi`
            : "Metrikler güncellendi",
          phaseId,
        ),
      );
      activities = prependActivity(
        activities,
        buildActivityEntry("scan.completed", `${phaseLabel} tarandı`, phaseId),
      );
      return { ...state.activityByProject, [projectId]: activities };
    })(),
  }));

}
