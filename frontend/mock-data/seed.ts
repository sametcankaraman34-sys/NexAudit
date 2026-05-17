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
import { DEMO_USER } from "@/constants/navigation";
import type { AppDatabase, AppSettings } from "@/types/app-database";
import type { BriefItem, Issue, Notification, Project } from "@/types";

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
    profile: {
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      companyName: "Ajans Demo",
      website: "ajansdemo.com.tr",
      timezone: "eu-istanbul",
      language: "tr",
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

  for (const project of mockProjects) {
    const issueSource =
      project.id === DEFAULT_PROJECT_ID ? mockWebsiteIssues : mockFeaturedIssues;
    issuesByProject[project.id] = cloneIssuesForProject(project.id, issueSource);
    notificationsByProject[project.id] = cloneNotificationsForProject(project.id, project);
    briefItemsByProject[project.id] = defaultBriefItems().map((item, index) => ({
      ...item,
      id: `${project.id}-brief-${index}`,
    }));
  }

  return {
    version: 1,
    activeProjectId: DEFAULT_PROJECT_ID,
    projects: mockProjects.map((p) => ({ ...p, phases: p.phases.map((ph) => ({ ...ph })) })),
    issuesByProject,
    notificationsByProject,
    briefItemsByProject,
    settings: defaultSettings(),
  };
}

export { DEFAULT_PROJECT_ID };
