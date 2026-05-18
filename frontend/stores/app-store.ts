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
import { createPhaseCompleteReportEntry } from "@/services/report-history";
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
  ProjectAuditSettings,
  TeamMemberRecord,
  TeamMemberRole,
} from "@/types/app-database";
import { DEMO_USER } from "@/constants/navigation";
import { NotificationService } from "@/services/notification-service";
import {
  createProjectAuditSettings,
  DEFAULT_PROJECT_AUDIT_SETTINGS,
} from "@/services/default-audit-settings";
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
  updateProjectAuditSettings: (
    projectId: string,
    patch: Partial<ProjectAuditSettings>,
  ) => Promise<void>;
  updateTeamMember: (memberId: string, patch: Partial<TeamMemberRecord>) => Promise<void>;
  inviteTeamMember: (input: { email: string; role: TeamMemberRole }) => Promise<void>;
  toggleIntegration: (integrationId: string) => Promise<void>;
  resetDatabase: () => void;
  clearReportHistory: (projectId: string) => Promise<void>;
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
            reportHistoryByProject: {
              ...state.reportHistoryByProject,
              [id]: [],
            },
            auditSettingsByProject: {
              ...state.auditSettingsByProject,
              [id]: createProjectAuditSettings({
                depth: state.settings.audit.depth,
                scan: {
                  ...DEFAULT_PROJECT_AUDIT_SETTINGS.scan,
                  autoScan: state.settings.audit.autoScan,
                  weeklyReport: state.settings.audit.weeklyReport,
                },
              }),
            },
            activeProjectId: id,
            async: { isLoading: false, lastAction: "createProject" },
          }));

          return project;
        });
      },

      updateProject: async (id, patch) => {
        const existing = get().projects.find((p) => p.id === id);
        if (!existing) return;
        set({ async: { isLoading: true, lastAction: "updateProject" } });
        await withMockApi(() => {
          set((state) => {
            const updated: Project = {
              ...existing,
              ...patch,
              updatedAt: new Date().toISOString().slice(0, 10),
              lastActor: DEMO_USER.name,
              lastActivity: patch.lastActivity ?? "Proje bilgileri güncellendi",
            };
            return {
              projects: state.projects.map((p) => (p.id === id ? updated : p)),
              activityByProject: {
                ...state.activityByProject,
                [id]: prependActivity(
                  state.activityByProject[id] ?? [],
                  buildActivityEntry("notification.sent", "Proje düzenlendi"),
                ),
              },
              async: { isLoading: false, lastAction: "updateProject" },
            };
          });
        });
        NotificationService.success("Proje güncellendi", existing.name, id);
      },

      deleteProject: async (id) => {
        set({ async: { isLoading: true, lastAction: "deleteProject" } });
        await withMockApi(() => {
          set((state) => {
            const projects = state.projects.filter((p) => p.id !== id);
            const issuesByProject = { ...state.issuesByProject };
            const notificationsByProject = { ...state.notificationsByProject };
            const briefItemsByProject = { ...state.briefItemsByProject };
            const workflowByProject = { ...state.workflowByProject };
            const activityByProject = { ...state.activityByProject };
            const reportHistoryByProject = { ...state.reportHistoryByProject };
            const auditSettingsByProject = { ...state.auditSettingsByProject };
            delete issuesByProject[id];
            delete notificationsByProject[id];
            delete briefItemsByProject[id];
            delete workflowByProject[id];
            delete activityByProject[id];
            delete reportHistoryByProject[id];
            delete auditSettingsByProject[id];
            const activeProjectId =
              state.activeProjectId === id
                ? (projects[0]?.id ?? DEFAULT_PROJECT_ID)
                : state.activeProjectId;
            return {
              projects,
              issuesByProject,
              notificationsByProject,
              briefItemsByProject,
              workflowByProject,
              activityByProject,
              reportHistoryByProject,
              auditSettingsByProject,
              activeProjectId,
              async: { isLoading: false, lastAction: "deleteProject" },
            };
          });
        });
        NotificationService.success("Proje silindi.");
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
                    lastActivity: "Proje arşive taşındı",
                    lastActor: DEMO_USER.name,
                    updatedAt: new Date().toISOString().slice(0, 10),
                  }
                : p,
            ),
            activityByProject: {
              ...state.activityByProject,
              [id]: prependActivity(
                state.activityByProject[id] ?? [],
                buildActivityEntry("notification.sent", "Proje arşive taşındı"),
              ),
            },
            async: { isLoading: false, lastAction: "archiveProject" },
          }));
        });
        NotificationService.success("Proje arşive taşındı.", project.name, id);
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
            const issues = get().issuesByProject[projectId] ?? [];
            const previousScore = project.overallScore;
            const resolvedCount = issues.filter((i) => i.status === "resolved").length;
            const updated: Project = recalculateProjectMetrics(
              {
                ...project,
                phases,
                lastActivity: `${phaseLabel} onaylandı`,
                updatedAt: new Date().toISOString().slice(0, 10),
              },
              issues,
            );

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

              const reportEntry = createPhaseCompleteReportEntry(
                updated,
                phaseId,
                previousScore,
                updated.overallScore,
                resolvedCount,
              );

              return {
                ...syncProjectInState(state, projectId, updated),
                workflowByProject: { ...state.workflowByProject, [projectId]: workflow },
                activityByProject: { ...state.activityByProject, [projectId]: activities },
                notificationsByProject: {
                  ...state.notificationsByProject,
                  [projectId]: notifications,
                },
                reportHistoryByProject: {
                  ...state.reportHistoryByProject,
                  [projectId]: [
                    reportEntry,
                    ...(state.reportHistoryByProject[projectId] ?? []),
                  ].slice(0, 40),
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
        const phaseLabel =
          phaseId === "website" ? "Web Tasarım" : phaseId === "seo" ? "SEO" : "Reklam";
        await withMockApi(() => {
          const phases = project.phases.map((p) =>
            p.id === phaseId
              ? {
                  ...p,
                  status: "in_progress" as const,
                  progress: Math.min(Math.max(p.progress, 40), 85),
                }
              : p,
          );
          const notification: Notification = {
            id: generateId("n"),
            title: `${phaseLabel} yeniden açıldı`,
            message: `${project.name} · ek inceleme için aşama tekrar aktif.`,
            time: "Az önce",
            read: false,
            category: "audit",
            severity: "medium",
            actionHref:
              phaseId === "website"
                ? "/website-audit"
                : phaseId === "seo"
                  ? "/seo-audit"
                  : "/ads-audit",
            actionLabel: "Denetime git",
          };
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
            notificationsByProject: {
              ...state.notificationsByProject,
              [projectId]: [notification, ...(state.notificationsByProject[projectId] ?? [])],
            },
            activityByProject: {
              ...state.activityByProject,
              [projectId]: prependActivity(
                state.activityByProject[projectId] ?? [],
                buildActivityEntry("phase.reopened", "Aşama yeniden açıldı", phaseId),
              ),
            },
          }));
          NotificationService.success(
            "Aşama yeniden açıldı",
            `${phaseLabel} turu tekrar düzenlenebilir.`,
            projectId,
          );
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
        await withMockApi(
          () => {
            set((state) => {
              const prevIssue = (state.issuesByProject[projectId] ?? []).find((i) => i.id === issueId);
              const issues = (state.issuesByProject[projectId] ?? []).map((issue) =>
                issue.id === issueId ? { ...issue, status } : issue,
              );
              const project = state.projects.find((p) => p.id === projectId);
              if (!project) return state;
              const updated = recalculateProjectMetrics(project, issues);
              const phase = prevIssue?.phase;
              if (phase && phase !== "brief") {
                const phaseState = updated.phases.find((p) => p.id === phase);
                if (phaseState && status === "resolved") {
                  phaseState.progress = Math.min(92, phaseState.progress + 6);
                }
              }
              const statusLabel =
                status === "resolved"
                  ? "çözüldü"
                  : status === "ignored"
                    ? "yok sayıldı"
                    : status === "in_progress"
                      ? "devam ediyor"
                      : "yeniden açıldı";
              return {
                issuesByProject: { ...state.issuesByProject, [projectId]: issues },
                ...syncProjectInState(state, projectId, updated),
                activityByProject: {
                  ...state.activityByProject,
                  [projectId]: prependActivity(
                    state.activityByProject[projectId] ?? [],
                    buildActivityEntry(
                      "issue.detected",
                      prevIssue
                        ? `«${prevIssue.title}» ${statusLabel}`
                        : `Sorun durumu güncellendi`,
                      phase && phase !== "brief" ? phase : "website",
                    ),
                  ),
                },
              };
            });
          },
          { delayMs: 220 },
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
        await withMockApi(() => {
          set((state) => {
            const items = (state.briefItemsByProject[projectId] ?? []).map((item) =>
              item.id === itemId ? { ...item, ...patch } : item,
            );
            const project = state.projects.find((p) => p.id === projectId);
            if (!project) return state;
            const met = items.filter((i) => i.status === "met").length;
            const total = items.length || 1;
            const briefScore = Math.round((met / total) * 100);
            const updated = {
              ...project,
              briefScore,
              lastActivity: "Brief uyumluluk skoru güncellendi",
            };
            const item = items.find((i) => i.id === itemId);
            return {
              briefItemsByProject: { ...state.briefItemsByProject, [projectId]: items },
              ...syncProjectInState(state, projectId, updated),
              activityByProject: {
                ...state.activityByProject,
                [projectId]: prependActivity(
                  state.activityByProject[projectId] ?? [],
                  buildActivityEntry(
                    "review.required",
                    item ? `Brief: ${item.label}` : "Brief maddesi güncellendi",
                    "website",
                  ),
                ),
              },
            };
          });
        }, { delayMs: 180 });
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
              team: patch.team ?? state.settings.team,
              integrations: patch.integrations ?? state.settings.integrations,
            },
            async: { isLoading: false, lastAction: "updateSettings" },
          }));
        });
      },

      updateProjectAuditSettings: async (projectId, patch) => {
        await withMockApi(() => {
          set((state) => {
            const current =
              state.auditSettingsByProject[projectId] ?? createProjectAuditSettings();
            return {
              auditSettingsByProject: {
                ...state.auditSettingsByProject,
                [projectId]: {
                  ...current,
                  ...patch,
                  modules: { ...current.modules, ...patch.modules },
                  checks: { ...current.checks, ...patch.checks },
                  scan: { ...current.scan, ...patch.scan },
                },
              },
            };
          });
        }, { delayMs: 120 });
      },

      updateTeamMember: async (memberId, patch) => {
        await withMockApi(() => {
          set((state) => ({
            settings: {
              ...state.settings,
              team: state.settings.team.map((member) =>
                member.id === memberId ? { ...member, ...patch } : member,
              ),
            },
          }));
        }, { delayMs: 120 });
      },

      inviteTeamMember: async ({ email, role }) => {
        const name = email.split("@")[0] ?? "Yeni üye";
        const initials = name.slice(0, 2).toUpperCase();
        await withMockApi(() => {
          set((state) => ({
            settings: {
              ...state.settings,
              team: [
                ...state.settings.team,
                {
                  id: generateId("u"),
                  name,
                  email,
                  role,
                  initials,
                },
              ],
            },
          }));
        }, { delayMs: 200 });
        NotificationService.success("Davet gönderildi", `${email} ekibe eklendi.`);
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

      clearReportHistory: async (projectId) => {
        await withMockApi(() => {
          set((state) => ({
            reportHistoryByProject: { ...state.reportHistoryByProject, [projectId]: [] },
          }));
        }, { delayMs: 160 });
      },
    }),
    {
      name: "nexaudit-app-db",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        const {
          hydrated: _hydrated,
          async: _asyncState,
          isSwitching: _isSwitching,
          ...db
        } = state;
        void _hydrated;
        void _asyncState;
        void _isSwitching;
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
        if (!merged.reportHistoryByProject) {
          merged.reportHistoryByProject = {};
        }
        if (!merged.auditSettingsByProject) {
          merged.auditSettingsByProject = {};
        }
        for (const p of merged.projects) {
          if (!merged.workflowByProject[p.id]) {
            merged.workflowByProject[p.id] = createProjectWorkflow(p.phases);
          }
          if (!merged.activityByProject[p.id]) {
            merged.activityByProject[p.id] = [];
          }
          if (!merged.reportHistoryByProject[p.id]) {
            merged.reportHistoryByProject[p.id] = [];
          }
          if (!merged.auditSettingsByProject[p.id]) {
            merged.auditSettingsByProject[p.id] = createProjectAuditSettings({
              depth: merged.settings.audit.depth,
              scan: {
                autoScan: merged.settings.audit.autoScan,
                weeklyReport: merged.settings.audit.weeklyReport,
              },
            });
          }
        }
        merged.version = APP_DB_VERSION;
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
