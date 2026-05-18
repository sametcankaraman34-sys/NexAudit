import {
  mockBriefCritical,
  mockBriefMet,
  mockBriefMissing,
  mockBriefPartial,
} from "@/data/mock-brief";
import { mockFeaturedIssues, mockWebsiteIssues } from "@/data/mock-issues";
import { mockNotifications } from "@/data/mock-notifications";
import { mockProjects } from "@/data/mock-projects";
import { mockIntegrations, mockTeamMembers } from "@/data/mock-settings";
import { createDefaultProfile } from "@/services/profile.service";
import { createProjectAuditSettings } from "@/services/default-audit-settings";
import { createProjectWorkflow } from "@/services/workflow-factory";
import { APP_DB_VERSION, type AppDatabase, type AppSettings } from "@/types/app-database";
import type { BriefItem, Issue, Notification, Project } from "@/types";
import type { ActivityEvent } from "@/types/workflow";

export type IntegrationRecord = (typeof mockIntegrations)[number];
export type TeamMemberRecord = (typeof mockTeamMembers)[number];

const DEFAULT_PROJECT_ID = "proj-1";

function cloneIssuesForProject(projectId: string, source: Issue[]): Issue[] {
  return source.map((issue, index) => ({
    ...issue,
    id: `${projectId}-${issue.id}-${index}`,
  }));
}

function cloneNotificationsForProject(projectId: string, project: Project): Notification[] {
  return mockNotifications.map((n) => ({
    ...n,
    id: `${projectId}-${n.id}`,
    message: n.message
      .replace(/Ajans Demo Projesi/g, project.name)
      .replace(/ajansdemo\.com\.tr/g, project.domain)
      .replace(/Ajans Demo/g, project.customerName),
  }));
}

function defaultBriefItems(): BriefItem[] {
  return [
    ...mockBriefMet,
    ...mockBriefMissing,
    ...mockBriefPartial,
    ...mockBriefCritical,
  ];
}

function defaultSettings(): AppSettings {
  return {
    profile: createDefaultProfile(),
    brief: {
      sensitivity: "balanced",
      strictFields: false,
      colorTolerance: 15,
      typographyTolerance: 2,
    },
    ai: {
      density: "medium",
      autoSuggest: true,
      contentAnalysis: true,
      toneAnalysis: true,
    },
    notifications: {
      critical: true,
      seo: true,
      brief: true,
      realtime: true,
      email: false,
      push: true,
    },
    audit: {
      depth: "deep",
      autoScan: true,
      weeklyReport: true,
    },
    integrations: mockIntegrations.map((i) => ({ ...i })),
    team: mockTeamMembers.map((m) => ({ ...m })),
  };
}

export function createInitialDatabase(): AppDatabase {
  const issuesByProject: Record<string, Issue[]> = {};
  const notificationsByProject: Record<string, Notification[]> = {};
  const briefItemsByProject: Record<string, BriefItem[]> = {};
  const workflowByProject: AppDatabase["workflowByProject"] = {};
  const activityByProject: Record<string, ActivityEvent[]> = {};
  const reportHistoryByProject: Record<string, AppDatabase["reportHistoryByProject"][string]> = {};
  const auditSettingsByProject: AppDatabase["auditSettingsByProject"] = {};

  for (const project of mockProjects) {
    const issueSource =
      project.id === DEFAULT_PROJECT_ID ? mockWebsiteIssues : mockFeaturedIssues;
    issuesByProject[project.id] = cloneIssuesForProject(project.id, issueSource);
    notificationsByProject[project.id] = cloneNotificationsForProject(project.id, project);
    briefItemsByProject[project.id] = defaultBriefItems().map((item, index) => ({
      ...item,
      id: `${project.id}-brief-${index}`,
    }));
    workflowByProject[project.id] = createProjectWorkflow(project.phases);
    reportHistoryByProject[project.id] = [];
    auditSettingsByProject[project.id] = createProjectAuditSettings();
    activityByProject[project.id] =
      project.status === "draft"
        ? []
        : [
            {
              id: `${project.id}-act-seed-1`,
              type: "scan.completed",
              phaseId: "website",
              message: "Web sitesi tarandı",
              timeLabel: "14:22",
              createdAt: Date.now() - 300_000,
            },
            {
              id: `${project.id}-act-seed-2`,
              type: "issue.detected",
              phaseId: "website",
              message: `${project.criticalIssues} kritik sorun bulundu`,
              timeLabel: "14:23",
              createdAt: Date.now() - 240_000,
            },
          ];
  }

  return {
    version: APP_DB_VERSION,
    activeProjectId: DEFAULT_PROJECT_ID,
    projects: mockProjects.map((p) => ({ ...p, phases: p.phases.map((ph) => ({ ...ph })) })),
    issuesByProject,
    notificationsByProject,
    briefItemsByProject,
    workflowByProject,
    activityByProject,
    reportHistoryByProject,
    auditSettingsByProject,
    settings: defaultSettings(),
  };
}

export { DEFAULT_PROJECT_ID };
