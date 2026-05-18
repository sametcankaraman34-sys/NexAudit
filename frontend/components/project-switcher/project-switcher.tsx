"use client";

import { Building2, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProjectSwitcherItem } from "@/components/project-switcher/project-switcher-item";
import { useActiveProject } from "@/lib/project-context";
import { cn } from "@/lib/utils";

interface PanelPosition {
  top: number;
  left: number;
  width: number;
}

function getPanelPosition(trigger: HTMLElement): PanelPosition {
  const rect = trigger.getBoundingClientRect();
  const width = Math.min(400, window.innerWidth - 16);
  const left = Math.min(
    Math.max(8, rect.left),
    window.innerWidth - width - 8,
  );
  const top = rect.bottom + 8;
  return { top, left, width };
}

export function ProjectSwitcher() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [panelPos, setPanelPos] = useState<PanelPosition>({ top: 0, left: 0, width: 400 });
  const { activeProject, activeProjectId, projects, setActiveProjectId } =
    useActiveProject();

  const close = useCallback(() => setOpen(false), []);

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      setPanelPos(getPanelPosition(triggerRef.current));
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, updatePosition]);

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
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      const panel = document.getElementById("project-switcher-panel");
      if (panel?.contains(target)) return;
      close();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [close, open]);

  const handleSelect = (projectId: string) => {
    setActiveProjectId(projectId);
    close();
  };

  const dropdown = open ? (
    <>
      <div
        className="project-switcher-backdrop fixed inset-0 z-[200]"
        aria-hidden
        onClick={close}
      />
      <div
        id="project-switcher-panel"
        className="project-switcher-panel fixed z-[210] overflow-hidden rounded-2xl border border-[var(--border)]/90 bg-[var(--surface)]/98 shadow-[0_12px_40px_rgba(15,23,42,0.14),0_2px_8px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        style={{
          top: panelPos.top,
          left: panelPos.left,
          width: panelPos.width,
        }}
        role="listbox"
        aria-label="Projeler"
      >
        <div className="border-b border-[var(--border)]/80 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Çalışma alanı
              </p>
              <p className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">
                Proje seçin
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-[12px] font-semibold tabular-nums text-[var(--primary)]">
              {projects.length} proje
            </span>
          </div>
        </div>

        <ul className="project-switcher-list max-h-[min(420px,calc(100vh-12rem))] overflow-y-auto overscroll-contain p-2">
          {projects.map((project, index) => (
            <ProjectSwitcherItem
              key={project.id}
              project={project}
              active={project.id === activeProjectId}
              index={index}
              onSelect={() => handleSelect(project.id)}
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
  ) : null;

  return (
    <>
      <div className="relative z-30 min-w-0 max-w-[min(100%,260px)]">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => {
            setOpen((v) => {
              const next = !v;
              if (next) updatePosition();
              return next;
            });
          }}
          className={cn(
            "btn-transition flex min-h-[44px] w-full items-center gap-2 truncate rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-ui-secondary font-medium text-[var(--text-primary)] md:px-3.5",
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
      </div>

      {typeof document !== "undefined" && dropdown
        ? createPortal(dropdown, document.body)
        : null}
    </>
  );
}
