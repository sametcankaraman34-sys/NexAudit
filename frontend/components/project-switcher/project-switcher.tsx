"use client";

import { Building2, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectSwitcherItem } from "@/components/project-switcher/project-switcher-item";
import { useActiveProject } from "@/lib/project-context";
import { cn } from "@/lib/utils";

export function ProjectSwitcher() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { activeProject, activeProjectId, projects, setActiveProjectId } =
    useActiveProject();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [close, open]);

  return (
    <div ref={rootRef} className="relative z-30 min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "btn-transition flex min-h-[44px] max-w-[min(100%,220px)] items-center gap-2 truncate rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-ui-secondary font-medium text-[var(--text-primary)] sm:max-w-[240px] md:px-3.5",
          "hover:border-[var(--primary)]/30 hover:bg-[var(--surface-soft)] hover:shadow-[0_0_0_1px_rgba(99,102,241,0.08)]",
          open && "border-[var(--primary)]/25 bg-[var(--surface-soft)] shadow-[0_0_0_1px_rgba(99,102,241,0.1)]",
        )}
        aria-label="Proje değiştir"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
          <Building2 className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-sm font-medium leading-tight">
            {activeProject.name}
          </span>
          <span className="mt-0.5 block truncate text-[12px] font-normal text-[var(--text-secondary)]">
            {activeProject.domain}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-[var(--transition-fast)]",
            open && "rotate-180 text-[var(--primary)]",
          )}
        />
      </button>

      {open && (
        <>
          <div
            className="project-switcher-backdrop fixed inset-0 z-40 lg:absolute lg:inset-auto"
            aria-hidden
            onClick={close}
          />
          <div
            className="project-switcher-panel fixed left-3 right-3 top-[calc(var(--topbar-height)+0.5rem)] z-50 overflow-hidden rounded-2xl border border-[var(--border)]/90 bg-[var(--surface)]/95 shadow-[0_12px_40px_rgba(15,23,42,0.12),0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur-xl sm:left-0 sm:right-auto sm:top-[calc(100%+8px)] sm:w-[min(400px,calc(100vw-2rem))]"
            role="listbox"
            aria-label="Projeler"
          >
            <div className="border-b border-[var(--border)]/80 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Workspace
              </p>
              <p className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">
                Proje seçin
              </p>
            </div>

            <ul className="project-switcher-list max-h-[min(340px,55vh)] overflow-y-auto overscroll-contain p-2">
              {projects.map((project, index) => (
                <ProjectSwitcherItem
                  key={project.id}
                  project={project}
                  active={project.id === activeProjectId}
                  index={index}
                  onSelect={() => {
                    setActiveProjectId(project.id);
                    close();
                  }}
                />
              ))}
            </ul>

            <div className="border-t border-[var(--border)]/80 p-2">
              <Link
                href="/new-project"
                onClick={close}
                className="project-switcher-create btn-transition flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--primary)]/35 bg-[var(--primary-soft)]/40 px-4 py-2.5 text-sm font-medium text-[var(--primary)] transition-[background,box-shadow,border-color] duration-[var(--transition-fast)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary-soft)] hover:shadow-[0_0_20px_rgba(99,102,241,0.12)]"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                Yeni Proje Oluştur
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
