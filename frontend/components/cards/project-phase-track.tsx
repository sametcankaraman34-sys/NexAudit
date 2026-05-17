import { Check, Lock, Megaphone, Monitor, Search } from "lucide-react";
import { AUDIT_PHASE_ORDER, AUDIT_PHASE_SHORT_LABELS } from "@/constants/audit";
import { cn } from "@/lib/utils";
import type { AuditPhaseId, ProjectPhaseState, ProjectPhaseStatus } from "@/types";

const phaseIcons: Record<AuditPhaseId, typeof Monitor> = {
  website: Monitor,
  seo: Search,
  ads: Megaphone,
};

const statusConfig: Record<
  ProjectPhaseStatus,
  { label: string; pill: string; icon?: "check" | "lock" }
> = {
  completed: {
    label: "Tamam",
    pill: "border-[var(--success)]/25 bg-[var(--success-soft)] text-[var(--success)]",
    icon: "check",
  },
  in_progress: {
    label: "Devam ediyor",
    pill: "border-[var(--primary)]/25 bg-[var(--primary-soft)] text-[var(--primary)]",
  },
  locked: {
    label: "Sırada",
    pill: "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-secondary)]",
    icon: "lock",
  },
  not_started: {
    label: "Bekliyor",
    pill: "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]",
  },
};

interface ProjectPhaseTrackProps {
  phases: ProjectPhaseState[];
  className?: string;
}

export function ProjectPhaseTrack({ phases, className }: ProjectPhaseTrackProps) {
  const ordered = AUDIT_PHASE_ORDER.map(
    (id) =>
      phases.find((p) => p.id === id) ?? {
        id,
        status: "not_started" as const,
        progress: 0,
      },
  );

  const completedCount = ordered.filter((p) => p.status === "completed").length;
  const overallProgress = Math.round(
    ordered.reduce((sum, p) => sum + p.progress, 0) / ordered.length,
  );

  return (
    <section className={cn("min-w-0", className)}>
      <header className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-[var(--text-secondary)]">Denetim ilerlemesi</p>
        <p className="text-xs font-semibold tabular-nums text-[var(--text-primary)]">
          {completedCount}/{ordered.length} aşama · %{overallProgress}
        </p>
      </header>

      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[#eef0f4]">
        <span
          className="block h-full rounded-full bg-[var(--primary)] transition-[width] duration-500 ease-out"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {ordered.map((phase) => {
          const Icon = phaseIcons[phase.id];
          const config = statusConfig[phase.status];

          return (
            <li
              key={phase.id}
              className={cn(
                "flex min-w-0 list-none flex-col gap-1.5 rounded-lg border px-2.5 py-2",
                config.pill,
              )}
            >
              <span className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" strokeWidth={1.75} />
                <span className="truncate text-xs font-medium">
                  {AUDIT_PHASE_SHORT_LABELS[phase.id]}
                </span>
              </span>
              <span className="flex items-center justify-between gap-1">
                <span className="text-sm opacity-90">{config.label}</span>
                {config.icon === "check" && (
                  <Check className="h-3 w-3 shrink-0" strokeWidth={2.5} />
                )}
                {config.icon === "lock" && (
                  <Lock className="h-3 w-3 shrink-0 opacity-70" strokeWidth={1.75} />
                )}
                {phase.status === "in_progress" && (
                  <span className="text-sm font-semibold tabular-nums">
                    %{phase.progress}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
