"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { mockProjects } from "@/data/mock-projects";
import {
  DEFAULT_PROJECT_ID,
  getProjectById,
  getProjectWorkspace,
  type ProjectWorkspace,
} from "@/data/project-workspace";
import type { Project } from "@/types";

const STORAGE_KEY = "nexaudit-active-project";

interface ProjectContextValue {
  activeProjectId: string;
  activeProject: Project;
  workspace: ProjectWorkspace;
  projects: Project[];
  setActiveProjectId: (id: string) => void;
  isSwitching: boolean;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [activeProjectId, setActiveProjectIdState] = useState(DEFAULT_PROJECT_ID);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && mockProjects.some((p) => p.id === stored)) {
        setActiveProjectIdState(stored);
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  const skipSwitchAnimation = useRef(true);

  const setActiveProjectId = useCallback((id: string) => {
    if (!mockProjects.some((p) => p.id === id)) return;
    setActiveProjectIdState(id);
  }, []);

  useEffect(() => {
    if (skipSwitchAnimation.current) {
      skipSwitchAnimation.current = false;
      return;
    }
    setIsSwitching(true);
    const timer = window.setTimeout(() => setIsSwitching(false), 280);
    try {
      localStorage.setItem(STORAGE_KEY, activeProjectId);
    } catch {
      /* ignore */
    }
    return () => window.clearTimeout(timer);
  }, [activeProjectId]);

  const activeProject = useMemo(
    () => getProjectById(activeProjectId),
    [activeProjectId],
  );

  const workspace = useMemo(
    () => getProjectWorkspace(activeProjectId),
    [activeProjectId],
  );

  const value = useMemo<ProjectContextValue>(
    () => ({
      activeProjectId,
      activeProject,
      workspace,
      projects: mockProjects,
      setActiveProjectId,
      isSwitching,
    }),
    [activeProject, activeProjectId, isSwitching, setActiveProjectId, workspace],
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useActiveProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useActiveProject must be used within ProjectProvider");
  }
  return ctx;
}

export function useProjectWorkspace() {
  return useActiveProject().workspace;
}
