"use client";

import { Check } from "lucide-react";
import { PROJECT_STATUS_LABELS } from "@/constants/ui-tr";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

const riskAccent: Record<Project["riskLevel"], string> = {
  low: "var(--success)",
  medium: "var(--warning)",
  high: "var(--danger)",
};

interface ProjectSwitcherItemProps {
  project: Project;
  active: boolean;
  index: number;
  onSelect: () => void;
}

export function ProjectSwitcherItem({
  project,
  active,
  index,
  onSelect,
}: ProjectSwitcherItemProps) {
  const scoreLabel =
    project.overallScore > 0 ? `${project.overallScore}/100` : "—";

  return (
    <li>
      <button
        type="button"
        role="menuitemradio"
        aria-checked={active}
        onClick={onSelect}
        className={cn(
          "project-switcher-item group flex w-full gap-3 rounded-xl px-3 py-2.5 text-left transition-[background,box-shadow,transform] duration-[var(--transition-fast)]",
          active
            ? "bg-[var(--primary-soft)]/80 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.12)]"
            : "hover:bg-[var(--surface-soft)] hover:shadow-[0_0_0_1px_rgba(99,102,241,0.06),0_4px_16px_rgba(99,102,241,0.06)]",
        )}
        style={{ animationDelay: `${index * 40}ms` }}
      >
        <span
          className="mt-1.5 h-2 w-2 shrink-0 rounded-full ring-2 ring-white/80"
          style={{ backgroundColor: riskAccent[project.riskLevel] }}
          aria-hidden
        />

        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-[var(--text-primary)]">
                {project.name}
              </span>
              <span className="mt-0.5 block truncate text-[13px] text-[var(--text-secondary)]">
                {project.domain}
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                {scoreLabel}
              </span>
              <span className="mt-0.5 block text-[12px] text-[var(--text-secondary)]">
                {PROJECT_STATUS_LABELS[project.status]}
              </span>
            </span>
          </span>

          <span className="mt-1.5 flex flex-wrap items-center gap-2">
            {active && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[12px] font-medium text-[var(--primary)]">
                <Check className="h-3 w-3" strokeWidth={2.5} />
                Aktif proje
              </span>
            )}
            <span className="text-[12px] text-[var(--text-secondary)]">
              {project.lastScanAt}
            </span>
          </span>
        </span>
      </button>
    </li>
  );
}
