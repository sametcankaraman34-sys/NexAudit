import type { AuditTimelineEntry } from "@/data/mock-report-history";
import type { BriefItem, Issue, Notification, Project } from "@/types";
import type { ActivityEvent, ProjectWorkflowMap } from "@/types/workflow";

export interface IntegrationRecord {
  id: string;
  name: string;
  category: string;
  connected: boolean;
}

export interface TeamMemberRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

export const APP_DB_VERSION = 3;
export const STORAGE_KEY = "nexaudit-app-db";

export interface NotificationPreferences {
  critical: boolean;
  seo: boolean;
  brief: boolean;
  realtime: boolean;
  email: boolean;
  push: boolean;
}

export interface ProfileSettings {
  name: string;
  email: string;
  companyName: string;
  website: string;
  timezone: string;
  language: string;
}

export interface AuditSettings {
  depth: "standard" | "deep" | "expert";
  autoScan: boolean;
  weeklyReport: boolean;
}

export interface AppSettings {
  profile: ProfileSettings;
  notifications: NotificationPreferences;
  audit: AuditSettings;
  integrations: IntegrationRecord[];
  team: TeamMemberRecord[];
}

export interface CreateProjectInput {
  name: string;
  domain: string;
  customerName: string;
  sector: string;
}

export interface AppDatabase {
  version: number;
  activeProjectId: string;
  projects: Project[];
  issuesByProject: Record<string, Issue[]>;
  notificationsByProject: Record<string, Notification[]>;
  briefItemsByProject: Record<string, BriefItem[]>;
  workflowByProject: Record<string, ProjectWorkflowMap>;
  activityByProject: Record<string, ActivityEvent[]>;
  reportHistoryByProject: Record<string, AuditTimelineEntry[]>;
  settings: AppSettings;
}

export interface AsyncState {
  isLoading: boolean;
  lastAction: string | null;
}
