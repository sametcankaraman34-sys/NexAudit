"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createInitialDatabase, DEFAULT_PROJECT_ID } from "@/mock-data/seed";
import { withMockApi } from "@/services/mock-api";
import { OutcomeFeedback } from "@/lib/outcome-feedback";
import {
  buildPhaseUnlockedNotification,
  buildTeamHandoffNotification,
} from "@/lib/workflow-notify";
import { createProjectWorkflow } from "@/services/workflow-factory";
import { completeProjectPhase } from "@/services/phase-completion";
import { recalculateProjectMetrics } from "@/services/project-metrics";
import { runPhaseScan } from "@/stores/scan-runner";
import {
  buildActivityEntry,
  patchPhaseWorkflow,
  prependActivity,
} from "@/stores/workflow-helpers";
import type { AuditPhaseId } from "@/types";
import { APP_DB_VERSION } from "@/types/app-database";
import type {
  AppDatabase,
  AppSettings,
  AsyncState,
  CreateProjectInput,
} from "@/types/app-database";
import type { BriefItem, BriefItemStatus, Issue, IssueStatus, Notification, Project } from "@/types";

export interface AppStore extends AppDatabase {
  hydrated: boolean;
  async: AsyncState;
  isSwitching: boolean;
  setHydrated: (value: boolean) => void;
  setActiveProjectId: (id: string) => void;
  createProject: (input: CreateProjectInput) => Promise<Project>;
  updateProject: (id: string, patch: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  startPhaseScan: (projectId: string, phaseId: AuditPhaseId) => Promise<void>;
  completePhase: (
    projectId: string,
    phaseId: AuditPhaseId,
    options?: { force?: boolean },
  ) => Promise<boolean>;
  reopenPhase: (projectId: string, phaseId: AuditPhaseId) => Promise<void>;
  savePhaseDraft: (projectId: string, phaseId: AuditPhaseId) => Promise<void>;
  markPhaseReviewed: (projectId: string, phaseId: AuditPhaseId) => void;
  updateIssueStatus: (
    projectId: string,
    issueId: string,
    status: IssueStatus,
  ) => Promise<void>;
  markNotificationRead: (projectId: string, notificationId: string) => void;
  markAllNotificationsRead: (projectId: string) => void;
  clearNotifications: (projectId: string) => void;
  addNotification: (projectId: string, notification: Notification) => void;
  updateBriefItem: (
    projectId: string,
    itemId: string,
    patch: Partial<BriefItem>,
  ) => Promise<void>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  toggleIntegration: (integrationId: string) => Promise<void>;
  resetDatabase: () => void;
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function sectorDefaults(sector: string): Pick<Project, "riskLevel" | "briefScore"> {
  if (sector === "ecommerce") return { riskLevel: "medium", briefScore: 72 };
  if (sector === "health") return { riskLevel: "low", briefScore: 80 };
  return { riskLevel: "medium", briefScore: 75 };
}

function syncProjectInState(
  state: AppDatabase,
  projectId: string,
  project: Project,
): Partial<AppDatabase> {
  return {
    projects: state.projects.map((p) => (p.id === projectId ? project : p)),
  };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...createInitialDatabase(),
      hydrated: false,
      async: { isLoading: false, lastAction: null },
      isSwitching: false,

      setHydrated: (value) => set({ hydrated: value }),

      setActiveProjectId: (id) => {
        if (!get().projects.some((p) => p.id === id)) return;
        if (get().activeProjectId === id) return;
        set({ activeProjectId: id, isSwitching: true });
        window.setTimeout(() => set({ isSwitching: false }), 280);
      },

      createProject: async (input) => {
        set({ async: { isLoading: true, lastAction: "createProject" } });
        return withMockApi(() => {
          const id = generateId("proj");
          const extras = sectorDefaults(input.sector);
          const project: Project = {
            id,
            name: input.name,
            domain: input.domain,
            customerName: input.customerName,
            status: "active",
            overallScore: 0,
            updatedAt: new Date().toISOString().slice(0, 10),
            phases: [
              { id: "website", status: "in_progress", progress: 8 },
              { id: "seo", status: "locked", progress: 0 },
              { id: "ads", status: "locked", progress: 0 },
            ],
            criticalIssues: 0,
            briefScore: extras.briefScore,
            lastScanAt: "Az önce",
            lastActivity: "Proje oluşturuldu · ilk tarama kuyruğa alındı",
            riskLevel: extras.riskLevel,
            scoreTrend: 0,
            issueBreakdown: [0, 0, 0, 0],
            totalIssues: 0,
            scoreHistory: [0],
          };

          const seedIssues: Issue[] = [
            {
              id: `${id}-issue-1`,
              title: "İlk tarama bekleniyor",
              location: input.domain,
              severity: "medium",
              status: "detected",
              phase: "website",
            },
          ];

          const notification: Notification = {
            id: generateId("n"),
            title: "Yeni proje oluşturuldu",
            message: `${input.name} için Web Tasarım denetimi kuyruğa alındı.`,
            time: "Az önce",
            read: false,
            category: "system",
            severity: "low",
            actionHref: "/website-audit",
            actionLabel: "Denetimi gör",
          };

          set((state) => ({
            projects: [project, ...state.projects],
            issuesByProject: { ...state.issuesByProject, [id]: seedIssues },
            notificationsByProject: {
              ...state.notificationsByProject,
              [id]: [notification, ...(state.notificationsByProject[id] ?? [])],
            },
            briefItemsByProject: {
              ...state.briefItemsByProject,
              [id]: [],
            },
            workflowByProject: {
              ...state.workflowByProject,
              [id]: createProjectWorkflow(project.phases),
            },
            activityByProject: {
              ...state.activityByProject,
              [id]: [
                buildActivityEntry("scan.started", "Proje oluşturuldu · ilk tur hazır", "website"),
              ],
            },
            activeProjectId: id,
            async: { isLoading: false, lastAction: "createProject" },
          }));

          return project;
        });
      },

      updateProject: async (id, patch) => {
        set({ async: { isLoading: true, lastAction: "updateProject" } });
        await withMockApi(() => {
          set((state) => ({
            projects: state.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
            async: { isLoading: false, lastAction: "updateProject" },
          }));
        });
      },

      deleteProject: async (id) => {
        const projectName = get().projects.find((p) => p.id === id)?.name ?? "Proje";
        set({ async: { isLoading: true, lastAction: "deleteProject" } });
        await withMockApi(() => {
          set((state) => {
            const projects = state.projects.filter((p) => p.id !== id);
            const { [id]: _i, ...issuesByProject } = state.issuesByProject;
            const { [id]: _n, ...notificationsByProject } = state.notificationsByProject;
            const { [id]: _b, ...briefItemsByProject } = state.briefItemsByProject;
            const activeProjectId =
              state.activeProjectId === id
                ? (projects[0]?.id ?? DEFAULT_PROJECT_ID)
                : state.activeProjectId;
            return {
              projects,
              issuesByProject,
              notificationsByProject,
              briefItemsByProject,
              activeProjectId,
              async: { isLoading: false, lastAction: "deleteProject" },
            };
          });
        });
        OutcomeFeedback.projectDeleted(projectName);
      },

      archiveProject: async (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;
        set({ async: { isLoading: true, lastAction: "archiveProject" } });
        await withMockApi(() => {
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id
                ? {
                    ...p,
                    status: "archived" as const,
                    lastActivity: "Proje arşive kaldırıldı",
                    updatedAt: new Date().toISOString().slice(0, 10),
                  }
                : p,
            ),
            async: { isLoading: false, lastAction: "archiveProject" },
          }));
        });
        OutcomeFeedback.projectCancelled(id, project.name);
      },

      startPhaseScan: async (projectId, phaseId) => {
        set({ async: { isLoading: true, lastAction: "startPhaseScan" } });
        try {
          await runPhaseScan(get, set, projectId, phaseId);
        } catch {
          set((state) => ({
            workflowByProject: {
              ...state.workflowByProject,
              [projectId]: patchPhaseWorkflow(
                state.workflowByProject[projectId] ?? {},
                phaseId,
                {
                  scan: {
                    status: "error",
                    progress: 0,
                    currentStep: null,
                    lastError: "Tarama sırasında bir sorun oluştu.",
                  },
                },
              ),
            },
          }));
        } finally {
          set({ async: { isLoading: false, lastAction: "startPhaseScan" } });
        }
      },

      completePhase: async (projectId, phaseId, options) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project) return false;
        const current = project.phases.find((p) => p.id === phaseId);
        if (!current || current.status === "completed") return false;

        const wf = get().workflowByProject[projectId]?.[phaseId];
        if (!options?.force && wf?.scan.status !== "completed") {
          return false;
        }

        set({ async: { isLoading: true, lastAction: "completePhase" } });
        let ok = false;
        await withMockApi(
          () => {
            const { phases, unlockedPhaseId, allCompleted } = completeProjectPhase(
              project.phases,
              phaseId,
            );
            const phaseLabel =
              phaseId === "website" ? "Web Tasarım" : phaseId === "seo" ? "SEO" : "Reklam";
            const updated: Project = {
              ...project,
              phases,
              lastActivity: `${phaseLabel} onaylandı`,
              updatedAt: new Date().toISOString().slice(0, 10),
            };

            set((state) => {
              let activities = prependActivity(
                state.activityByProject[projectId] ?? [],
                buildActivityEntry("phase.completed", `${phaseLabel} tamamlandı`, phaseId),
              );
              const notifications = [...(state.notificationsByProject[projectId] ?? [])];
              let workflow = patchPhaseWorkflow(state.workflowByProject[projectId] ?? {}, phaseId, {
                operationalStatus: "approved",
                humanReviewed: true,
              });

              if (unlockedPhaseId) {
                const unlockNote = buildPhaseUnlockedNotification(project.name, unlockedPhaseId);
                notifications.unshift(unlockNote);
                notifications.unshift(
                  buildTeamHandoffNotification(project.name, phaseId, unlockedPhaseId),
                );
                activities = prependActivity(
                  activities,
                  buildActivityEntry(
                    "notification.sent",
                    `${phaseLabel} tamamlandı · ${unlockedPhaseId === "seo" ? "SEO" : "Reklam"} ekibine bildirim`,
                    unlockedPhaseId,
                  ),
                );
                activities = prependActivity(
                  activities,
                  buildActivityEntry("phase.unlocked", "Sonraki aşama kilidi açıldı", unlockedPhaseId),
                );
                workflow = patchPhaseWorkflow(workflow, unlockedPhaseId, {
                  assignedRoleId: unlockedPhaseId === "seo" ? "seo" : "ads",
                });
              }

              return {
                ...syncProjectInState(state, projectId, updated),
                workflowByProject: { ...state.workflowByProject, [projectId]: workflow },
                activityByProject: { ...state.activityByProject, [projectId]: activities },
                notificationsByProject: {
                  ...state.notificationsByProject,
                  [projectId]: notifications,
                },
                async: { isLoading: false, lastAction: "completePhase" },
              };
            });

            OutcomeFeedback.stageCompleted(projectId, project.name, phaseId);
            if (unlockedPhaseId) {
              window.setTimeout(
                () => OutcomeFeedback.stageUnlocked(projectId, project.name, unlockedPhaseId),
                480,
              );
            }
            if (allCompleted) {
              window.setTimeout(
                () => OutcomeFeedback.projectCompleted(projectId, project.name),
                unlockedPhaseId ? 1100 : 520,
              );
            }
            ok = true;
          },
          { delayMs: 360 },
        );
        return ok;
      },

      reopenPhase: async (projectId, phaseId) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project) return;
        await withMockApi(() => {
          const phases = project.phases.map((p) =>
            p.id === phaseId ? { ...p, status: "in_progress" as const, progress: Math.min(p.progress, 85) } : p,
          );
          set((state) => ({
            ...syncProjectInState(state, projectId, {
              ...project,
              phases,
              lastActivity: "Aşama yeniden açıldı · ek inceleme gerekli",
            }),
            workflowByProject: {
              ...state.workflowByProject,
              [projectId]: patchPhaseWorkflow(state.workflowByProject[projectId] ?? {}, phaseId, {
                operationalStatus: "reopened",
                humanReviewed: false,
                scan: { status: "idle", progress: 0, currentStep: null },
              }),
            },
            activityByProject: {
              ...state.activityByProject,
              [projectId]: prependActivity(
                state.activityByProject[projectId] ?? [],
                buildActivityEntry("phase.reopened", "Aşama yeniden açıldı", phaseId),
              ),
            },
          }));
        }, { delayMs: 240 });
      },

      savePhaseDraft: async (projectId, phaseId) => {
        await withMockApi(() => {
          set((state) => ({
            workflowByProject: {
              ...state.workflowByProject,
              [projectId]: patchPhaseWorkflow(state.workflowByProject[projectId] ?? {}, phaseId, {
                operationalStatus: "draft",
                draftSavedAt: new Date().toISOString(),
              }),
            },
            activityByProject: {
              ...state.activityByProject,
              [projectId]: prependActivity(
                state.activityByProject[projectId] ?? [],
                buildActivityEntry("phase.draft_saved", "Taslak olarak kaydedildi", phaseId),
              ),
            },
          }));
        }, { delayMs: 200 });
      },

      markPhaseReviewed: (projectId, phaseId) => {
        set((state) => ({
          workflowByProject: {
            ...state.workflowByProject,
            [projectId]: patchPhaseWorkflow(state.workflowByProject[projectId] ?? {}, phaseId, {
              humanReviewed: true,
              operationalStatus: "in_review",
            }),
          },
          activityByProject: {
            ...state.activityByProject,
            [projectId]: prependActivity(
              state.activityByProject[projectId] ?? [],
              buildActivityEntry("review.required", "Sonuçlar incelendi", phaseId),
            ),
          },
        }));
      },

      updateIssueStatus: async (projectId, issueId, status) => {
        set({ async: { isLoading: true, lastAction: "updateIssue" } });
        await withMockApi(
          () => {
            set((state) => {
              const issues = (state.issuesByProject[projectId] ?? []).map((issue) =>
                issue.id === issueId ? { ...issue, status } : issue,
              );
              const project = state.projects.find((p) => p.id === projectId);
              if (!project) return { async: { isLoading: false, lastAction: "updateIssue" } };
              const updated = recalculateProjectMetrics(project, issues);
              const websitePhase = updated.phases.find((p) => p.id === "website");
              if (websitePhase && status === "resolved") {
                websitePhase.progress = Math.min(92, websitePhase.progress + 6);
              }
              return {
                issuesByProject: { ...state.issuesByProject, [projectId]: issues },
                ...syncProjectInState(state, projectId, updated),
                async: { isLoading: false, lastAction: "updateIssue" },
              };
            });
          },
          { delayMs: 280 },
        );
      },

      markNotificationRead: (projectId, notificationId) => {
        set((state) => ({
          notificationsByProject: {
            ...state.notificationsByProject,
            [projectId]: (state.notificationsByProject[projectId] ?? []).map((n) =>
              n.id === notificationId ? { ...n, read: true } : n,
            ),
          },
        }));
      },

      markAllNotificationsRead: (projectId) => {
        set((state) => ({
          notificationsByProject: {
            ...state.notificationsByProject,
            [projectId]: (state.notificationsByProject[projectId] ?? []).map((n) => ({
              ...n,
              read: true,
            })),
          },
        }));
      },

      clearNotifications: (projectId) => {
        set((state) => ({
          notificationsByProject: { ...state.notificationsByProject, [projectId]: [] },
        }));
      },

      addNotification: (projectId, notification) => {
        set((state) => ({
          notificationsByProject: {
            ...state.notificationsByProject,
            [projectId]: [notification, ...(state.notificationsByProject[projectId] ?? [])],
          },
        }));
      },

      updateBriefItem: async (projectId, itemId, patch) => {
        set({ async: { isLoading: true, lastAction: "updateBrief" } });
        await withMockApi(() => {
          set((state) => {
            const items = (state.briefItemsByProject[projectId] ?? []).map((item) =>
              item.id === itemId ? { ...item, ...patch } : item,
            );
            const project = state.projects.find((p) => p.id === projectId);
            if (!project) {
              return { async: { isLoading: false, lastAction: "updateBrief" } };
            }
            const met = items.filter((i) => i.status === "met").length;
            const total = items.length || 1;
            const briefScore = Math.round((met / total) * 100);
            const updated = { ...project, briefScore };
            return {
              briefItemsByProject: { ...state.briefItemsByProject, [projectId]: items },
              ...syncProjectInState(state, projectId, updated),
              async: { isLoading: false, lastAction: "updateBrief" },
            };
          });
        });
      },

      updateSettings: async (patch) => {
        set({ async: { isLoading: true, lastAction: "updateSettings" } });
        await withMockApi(() => {
          set((state) => ({
            settings: {
              ...state.settings,
              ...patch,
              profile: { ...state.settings.profile, ...patch.profile },
              notifications: { ...state.settings.notifications, ...patch.notifications },
              audit: { ...state.settings.audit, ...patch.audit },
            },
            async: { isLoading: false, lastAction: "updateSettings" },
          }));
        });
      },

      toggleIntegration: async (integrationId) => {
        await withMockApi(() => {
          set((state) => ({
            settings: {
              ...state.settings,
              integrations: state.settings.integrations.map((item) =>
                item.id === integrationId ? { ...item, connected: !item.connected } : item,
              ),
            },
          }));
        }, { delayMs: 200 });
      },

      resetDatabase: () => {
        set({ ...createInitialDatabase(), async: { isLoading: false, lastAction: "reset" } });
      },
    }),
    {
      name: "nexaudit-app-db",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        const { hydrated, async, isSwitching, ...db } = state;
        return db;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      version: APP_DB_VERSION,
      migrate: (persisted) => {
        const base = createInitialDatabase();
        const data = persisted as Partial<AppDatabase> | undefined;
        if (!data?.projects?.length) return base;
        const merged: AppDatabase = { ...base, ...data, version: APP_DB_VERSION };
        for (const p of merged.projects) {
          if (!merged.workflowByProject[p.id]) {
            merged.workflowByProject[p.id] = createProjectWorkflow(p.phases);
          }
          if (!merged.activityByProject[p.id]) {
            merged.activityByProject[p.id] = [];
          }
        }
        return merged;
      },
    },
  ),
);

export function useActiveProjectFromStore(): Project {
  return useAppStore((s) => {
    const p = s.projects.find((x) => x.id === s.activeProjectId);
    return p ?? s.projects[0];
  });
}

export function useProjectsFromStore(): Project[] {
  return useAppStore((s) => s.projects);
}

export function useProjectIssues(projectId: string): Issue[] {
  return useAppStore((s) => s.issuesByProject[projectId] ?? []);
}

export function useProjectNotifications(projectId: string): Notification[] {
  return useAppStore((s) => s.notificationsByProject[projectId] ?? []);
}

export type { BriefItemStatus };
