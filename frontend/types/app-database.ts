import type { AuditTimelineEntry } from "@/data/mock-report-history";
import type { BriefItem, Issue, Notification, Project } from "@/types";
import type { UserProfile } from "@/types/profile.types";
import type { ActivityEvent, ProjectWorkflowMap } from "@/types/workflow";

export type { UserProfile } from "@/types/profile.types";

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
  role: TeamMemberRole;
  initials: string;
}

export const APP_DB_VERSION = 5;
export const STORAGE_KEY = "nexaudit-app-db";

export interface NotificationPreferences {
  critical: boolean;
  seo: boolean;
  brief: boolean;
  realtime: boolean;
  email: boolean;
  push: boolean;
}

/** @deprecated Use UserProfile from profile.types */
export type ProfileSettings = UserProfile;

export type BriefSensitivity = "relaxed" | "balanced" | "strict";

export interface BriefAppSettings {
  sensitivity: BriefSensitivity;
  strictFields: boolean;
  colorTolerance: number;
  typographyTolerance: number;
}

export interface AiAppSettings {
  density: "low" | "medium" | "high";
  autoSuggest: boolean;
  contentAnalysis: boolean;
  toneAnalysis: boolean;
}

export type AuditDepth = "standard" | "deep" | "expert";

export interface AuditSettings {
  depth: AuditDepth;
  autoScan: boolean;
  weeklyReport: boolean;
}

export interface ProjectAuditSettings {
  depth: AuditDepth;
  modules: {
    website: boolean;
    seo: boolean;
    ads: boolean;
  };
  checks: {
    mobile: boolean;
    deepSeo: boolean;
    a11y: boolean;
    conversion: boolean;
  };
  scan: {
    autoScan: boolean;
    weeklyReport: boolean;
    recursive: boolean;
    screenshot: boolean;
    lighthouse: boolean;
    maxDepth: number;
  };
}

export type TeamMemberRole = "owner" | "admin" | "editor" | "viewer";

export interface AppSettings {
  profile: UserProfile;
  notifications: NotificationPreferences;
  audit: AuditSettings;
  brief: BriefAppSettings;
  ai: AiAppSettings;
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
  auditSettingsByProject: Record<string, ProjectAuditSettings>;
  settings: AppSettings;
}

export interface AsyncState {
  isLoading: boolean;
  lastAction: string | null;
}
