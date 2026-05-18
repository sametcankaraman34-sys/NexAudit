import {
  createProjectAuditSettings,
  DEFAULT_PROJECT_AUDIT_SETTINGS,
} from "@/services/default-audit-settings";
import { useAppStore } from "@/stores/app-store";
import type { ProjectAuditSettings, TeamMemberRecord } from "@/types/app-database";

export function getProjectAuditSettings(projectId: string): ProjectAuditSettings {
  const state = useAppStore.getState();
  return (
    state.auditSettingsByProject[projectId] ??
    createProjectAuditSettings({
      depth: state.settings.audit.depth,
      scan: {
        ...DEFAULT_PROJECT_AUDIT_SETTINGS.scan,
        autoScan: state.settings.audit.autoScan,
        weeklyReport: state.settings.audit.weeklyReport,
      },
    } satisfies Partial<ProjectAuditSettings>)
  );
}

export function getTeamMembers(): TeamMemberRecord[] {
  return useAppStore.getState().settings.team;
}

export { DEFAULT_PROJECT_AUDIT_SETTINGS };
