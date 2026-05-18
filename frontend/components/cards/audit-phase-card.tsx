"use client";

import { ArrowRight, Lock, Monitor, Megaphone, Search, Trophy } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/feedback/progress-bar";
import { useActiveProject } from "@/lib/project-context";
import { NexToast } from "@/lib/nex-toast";
import { getAuditFinalMessage, getPhaseCardCopy } from "@/lib/phase-copy";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";
import type { AuditPhase } from "@/types";

const phaseIcons = {
  website: Monitor,
  seo: Search,
  ads: Megaphone,
};

interface AuditPhaseCardProps {
  phase: AuditPhase;
  allPhases?: AuditPhase[];
  showConnector?: boolean;
  compact?: boolean;
}

export function AuditPhaseCard({
  phase,
  allPhases,
  showConnector,
  compact,
}: AuditPhaseCardProps) {
  const phases = allPhases ?? [phase];
  const copy = getPhaseCardCopy(phase, phases);
  const Icon = phaseIcons[phase.id];
  const isLocked = phase.status === "locked";
  const isCompleted = phase.status === "completed";
  const isActive = phase.status === "active";
  const { activeProjectId } = useActiveProject();
  const startPhaseScan = useAppStore((s) => s.startPhaseScan);

  const handlePhaseAction = () => {
    if (copy.ctaDisabled) return;
    if (isCompleted && copy.ctaVariant === "success") {
      NexToast.success("Sıradaki adıma hazırsın", copy.statusLine);
      return;
    }
    if (!isLocked && isActive) {
      void startPhaseScan(activeProjectId, phase.id);
      NexToast.auditStarted(phase.title, copy.ctaHref);
    } else if (!isLocked) {
      NexToast.auditStarted(phase.title, copy.ctaHref);
    }
  };

  return (
    <div className="relative flex min-w-0 flex-col">
      {showConnector && !compact && (
        <div
          className="absolute -left-3 top-8 hidden h-px w-6 border-t border-dashed border-[var(--border)] lg:block"
          aria-hidden
        />
      )}
      <article
        className={cn(
          "card-interactive phase-card flex flex-col rounded-xl border shadow-[var(--shadow-card)]",
          compact ? "p-3.5" : "h-full rounded-2xl p-5",
          isLocked && "phase-card-locked border-[var(--border)] bg-[var(--surface-soft)] opacity-90",
          isCompleted && "phase-card-done border-[var(--success)]/25 bg-[var(--surface)]",
          isActive && "border-[var(--primary)]/25 bg-[var(--surface)]",
        )}
      >
        <div className="mb-2.5 flex items-start gap-2.5">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-lg transition-transform duration-300",
              compact ? "h-8 w-8" : "mb-4 h-11 w-11 rounded-xl",
              isLocked && "bg-[var(--surface-soft)] text-[var(--text-secondary)]",
              isCompleted && "bg-[var(--success-soft)] text-[var(--success)]",
              isActive && "bg-[var(--primary-soft)] text-[var(--primary)]",
            )}
          >
            {isLocked ? (
              <Lock className={compact ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.75} />
            ) : (
              <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.75} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                "font-semibold leading-snug text-[var(--text-primary)]",
                compact ? "text-sm" : "mb-1 text-sm",
              )}
            >
              {phase.title}
            </h3>
            <p
              className={cn(
                "text-[var(--text-secondary)]",
                compact
                  ? "mt-0.5 line-clamp-2 text-xs leading-relaxed"
                  : "mb-2 flex-1 text-xs leading-relaxed",
              )}
            >
              {copy.description}
            </p>
            {copy.statusLine && (
              <p
                className={cn(
                  "mt-1.5 text-xs leading-relaxed text-[var(--text-primary)]/85",
                  isCompleted && "text-[var(--success)]",
                )}
              >
                {copy.statusLine}
              </p>
            )}
          </div>
        </div>

        <div className={compact ? "mb-2.5" : "mb-4"}>
          <div className="mb-1 flex justify-between text-xs sm:text-sm">
            <span className="text-[var(--text-secondary)]">{copy.progressLabel}</span>
            <span className="font-medium tabular-nums text-[var(--text-primary)]">
              {phase.progress}%
            </span>
          </div>
          <ProgressBar
            value={phase.progress}
            barClassName={
              isLocked
                ? "bg-[var(--text-secondary)]/30"
                : isCompleted
                  ? "bg-[var(--success)]"
                  : undefined
            }
            animated={!isLocked}
          />
        </div>

        {copy.ctaDisabled ? (
          <button
            type="button"
            disabled
            className={cn(
              "phase-cta phase-cta-muted inline-flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] font-medium text-[var(--text-secondary)]",
              compact ? "h-8 text-xs" : "h-9 rounded-xl text-xs",
            )}
          >
            <Lock className="h-3 w-3" />
            {copy.ctaLabel}
          </button>
        ) : (
          <Link
            href={copy.ctaHref}
            onClick={handlePhaseAction}
            className={cn(
              "phase-cta inline-flex w-full items-center justify-center gap-1.5 rounded-lg font-medium",
              compact ? "h-8 text-xs" : "h-9 rounded-xl text-xs",
              copy.ctaVariant === "primary" && "phase-cta-primary bg-[var(--primary)] text-white",
              copy.ctaVariant === "outline" &&
                "phase-cta-outline border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]",
              copy.ctaVariant === "success" &&
                "phase-cta-success bg-[var(--success)] text-white",
            )}
          >
            {copy.ctaLabel}
            <ArrowRight className="h-3.5 w-3.5 opacity-80" strokeWidth={2} />
          </Link>
        )}
      </article>
    </div>
  );
}

interface AuditFinalCardProps {
  compact?: boolean;
  allPhases?: AuditPhase[];
}

export function AuditFinalCard({ compact, allPhases }: AuditFinalCardProps) {
  const message = allPhases?.length ? getAuditFinalMessage(allPhases) : getAuditFinalMessage([]);

  return (
    <article
      className={cn(
        "phase-final-card card-interactive flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] text-center",
        compact ? "px-3 py-4" : "h-full rounded-2xl p-5",
      )}
    >
      <div
        className={cn(
          "mb-2 flex items-center justify-center rounded-lg bg-[var(--warning-soft)] text-[var(--warning)]",
          compact ? "h-8 w-8" : "mb-3 h-11 w-11 rounded-xl",
        )}
      >
        <Trophy className={compact ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.75} />
      </div>
      <p
        className={cn(
          "leading-snug text-[var(--text-secondary)]",
          compact ? "text-xs" : "text-xs leading-relaxed",
        )}
      >
        {message}
      </p>
    </article>
  );
}
