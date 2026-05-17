"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createInitialDatabase, DEFAULT_PROJECT_ID } from "@/mock-data/seed";
import { withMockApi } from "@/services/mock-api";
import { OutcomeFeedback } from "@/lib/outcome-feedback";
import { completeProjectPhase } from "@/services/phase-completion";
import { recalculateProjectMetrics } from "@/services/project-metrics";
import type { AuditPhaseId } from "@/types";
import type {
  AppDatabase,
  AppSettings,
  AsyncState,
  CreateProjectInput,
} from "@/types/app-database";
import type { BriefItem, BriefItemStatus, Issue, IssueStatus, Notification, Project } from "@/types";

interface AppStore extends AppDatabase {
  hydrated: boolean;
  async: AsyncState;
  isSwitching: boolean;
  setHydrated: (value: boolean) => void;
  setActiveProjectId: (id: string) => void;
  createProject: (input: CreateProjectInput) => Promise<Project>;
  updateProject: (id: string, patch: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  completePhase: (projectId: string, phaseId: AuditPhaseId) => Promise<void>;
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

      completePhase: async (projectId, phaseId) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project) return;
        const current = project.phases.find((p) => p.id === phaseId);
        if (!current || current.status === "completed") return;

        set({ async: { isLoading: true, lastAction: "completePhase" } });
        await withMockApi(
          () => {
            const { phases, unlockedPhaseId, allCompleted } = completeProjectPhase(
              project.phases,
              phaseId,
            );
            const updated: Project = {
              ...project,
              phases,
              lastActivity:
                phaseId === "website"
                  ? "Web tasarım denetimi tamamlandı"
                  : phaseId === "seo"
                    ? "SEO optimizasyonu tamamlandı"
                    : "Reklam & dönüşüm denetimi tamamlandı",
              updatedAt: new Date().toISOString().slice(0, 10),
            };
            set((state) => ({
              ...syncProjectInState(state, projectId, updated),
              async: { isLoading: false, lastAction: "completePhase" },
            }));

            OutcomeFeedback.stageCompleted(projectId, project.name, phaseId);
            if (unlockedPhaseId) {
              window.setTimeout(
                () =>
                  OutcomeFeedback.stageUnlocked(projectId, project.name, unlockedPhaseId),
                480,
              );
            }
            if (allCompleted) {
              window.setTimeout(
                () => OutcomeFeedback.projectCompleted(projectId, project.name),
                unlockedPhaseId ? 1100 : 520,
              );
            }
          },
          { delayMs: 360 },
        );
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
                websitePhase.progress = Math.min(100, websitePhase.progress + 6);
                if (
                  websitePhase.progress >= 100 &&
                  websitePhase.status !== "completed"
                ) {
                  const { phases, unlockedPhaseId, allCompleted } = completeProjectPhase(
                    updated.phases,
                    "website",
                  );
                  updated.phases = phases;
                  const name = project.name;
                  queueMicrotask(() => {
                    OutcomeFeedback.stageCompleted(project.id, name, "website");
                    if (unlockedPhaseId) {
                      OutcomeFeedback.stageUnlocked(project.id, name, unlockedPhaseId);
                    }
                    if (allCompleted) {
                      OutcomeFeedback.projectCompleted(project.id, name);
                    }
                  });
                }
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
      version: 1,
      migrate: (persisted) => {
        const data = persisted as AppDatabase | undefined;
        if (!data?.projects?.length) return createInitialDatabase();
        return { ...createInitialDatabase(), ...data, version: 1 };
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
