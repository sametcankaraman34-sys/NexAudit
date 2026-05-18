import type { ProjectAuditSettings } from "@/types/app-database";

export const DEFAULT_PROJECT_AUDIT_SETTINGS: ProjectAuditSettings = {
  depth: "deep",
  modules: { website: true, seo: true, ads: true },
  checks: { mobile: true, deepSeo: false, a11y: true, conversion: true },
  scan: {
    autoScan: true,
    weeklyReport: true,
    recursive: true,
    screenshot: false,
    lighthouse: true,
    maxDepth: 5,
  },
};

type ProjectAuditSettingsPatch = Partial<
  Omit<ProjectAuditSettings, "modules" | "checks" | "scan">
> & {
  modules?: Partial<ProjectAuditSettings["modules"]>;
  checks?: Partial<ProjectAuditSettings["checks"]>;
  scan?: Partial<ProjectAuditSettings["scan"]>;
};

export function createProjectAuditSettings(
  partial?: ProjectAuditSettingsPatch,
): ProjectAuditSettings {
  return {
    ...DEFAULT_PROJECT_AUDIT_SETTINGS,
    ...partial,
    modules: { ...DEFAULT_PROJECT_AUDIT_SETTINGS.modules, ...partial?.modules },
    checks: { ...DEFAULT_PROJECT_AUDIT_SETTINGS.checks, ...partial?.checks },
    scan: { ...DEFAULT_PROJECT_AUDIT_SETTINGS.scan, ...partial?.scan },
  };
}
