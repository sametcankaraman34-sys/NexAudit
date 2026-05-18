"use client";

import { useMemo, type ReactNode } from "react";
import { getProjectWorkspaceFromDb, type ProjectWorkspace } from "@/data/project-workspace";
import { useAppStore } from "@/stores/app-store";
import type { AppDatabase } from "@/types/app-database";
import type { Project } from "@/types";

interface ProjectContextValue {
  activeProjectId: string;
  activeProject: Project;
  workspace: ProjectWorkspace;
  projects: Project[];
  setActiveProjectId: (id: string) => void;
  isSwitching: boolean;
  isLoading: boolean;
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function selectDb(state: ReturnType<typeof useAppStore.getState>): AppDatabase {
  return {
    version: state.version,
    activeProjectId: state.activeProjectId,
    projects: state.projects,
    issuesByProject: state.issuesByProject,
    notificationsByProject: state.notificationsByProject,
    briefItemsByProject: state.briefItemsByProject,
    workflowByProject: state.workflowByProject,
    activityByProject: state.activityByProject,
    reportHistoryByProject: state.reportHistoryByProject,
    settings: state.settings,
  };
}

export function useActiveProject(): ProjectContextValue {
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const projects = useAppStore((s) => s.projects);
  const issuesByProject = useAppStore((s) => s.issuesByProject);
  const notificationsByProject = useAppStore((s) => s.notificationsByProject);
  const briefItemsByProject = useAppStore((s) => s.briefItemsByProject);
  const workflowByProject = useAppStore((s) => s.workflowByProject);
  const activityByProject = useAppStore((s) => s.activityByProject);
  const reportHistoryByProject = useAppStore((s) => s.reportHistoryByProject);
  const settings = useAppStore((s) => s.settings);
  const version = useAppStore((s) => s.version);
  const setActiveProjectId = useAppStore((s) => s.setActiveProjectId);
  const isSwitching = useAppStore((s) => s.isSwitching);
  const isLoading = useAppStore((s) => s.async.isLoading);

  const workspace = useMemo(() => {
    const db: AppDatabase = {
      version,
      activeProjectId,
      projects,
      issuesByProject,
      notificationsByProject,
      briefItemsByProject,
      workflowByProject,
      activityByProject,
      reportHistoryByProject,
      settings,
    };
    return getProjectWorkspaceFromDb(db, activeProjectId);
  }, [
    activeProjectId,
    activityByProject,
    briefItemsByProject,
    issuesByProject,
    notificationsByProject,
    projects,
    reportHistoryByProject,
    settings,
    version,
    workflowByProject,
  ]);

  return {
    activeProjectId,
    activeProject: workspace.project,
    workspace,
    projects,
    setActiveProjectId,
    isSwitching,
    isLoading,
  };
}

export function useProjectWorkspace(): ProjectWorkspace {
  return useActiveProject().workspace;
}
