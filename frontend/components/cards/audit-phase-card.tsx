import { Lock, Monitor, Megaphone, Search, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/feedback/progress-bar";
import { cn } from "@/lib/utils";
import type { AuditPhase } from "@/types";

const phaseIcons = {
  website: Monitor,
  seo: Search,
  ads: Megaphone,
};

const phaseLinks = {
  website: "/website-audit",
  seo: "/seo-audit",
  ads: "/ads-audit",
};

interface AuditPhaseCardProps {
  phase: AuditPhase;
  showConnector?: boolean;
  compact?: boolean;
}

export function AuditPhaseCard({ phase, showConnector, compact }: AuditPhaseCardProps) {
  const Icon = phaseIcons[phase.id];
  const isLocked = phase.status === "locked";
  const isCompleted = phase.status === "completed";

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
          "card-interactive locked-fade flex flex-col rounded-xl border shadow-[var(--shadow-card)]",
          compact ? "p-3.5" : "h-full rounded-2xl p-5",
          isLocked
            ? "border-[var(--border)] bg-[var(--surface-soft)] opacity-80"
            : "border-[var(--primary)]/20 bg-[var(--surface)]",
        )}
      >
        <div className="mb-2.5 flex items-start gap-2.5">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-lg",
              compact ? "h-8 w-8" : "mb-4 h-11 w-11 rounded-xl",
              isLocked
                ? "bg-[var(--surface-soft)] text-[var(--text-secondary)]"
                : "bg-[var(--primary-soft)] text-[var(--primary)]",
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
                  : "mb-4 flex-1 text-xs leading-relaxed",
              )}
            >
              {phase.description}
            </p>
          </div>
        </div>

        <div className={compact ? "mb-2.5" : "mb-4"}>
          <div className="mb-1 flex justify-between text-xs sm:text-sm">
            <span className="text-[var(--text-secondary)]">İlerleme</span>
            <span className="font-medium text-[var(--text-primary)]">{phase.progress}%</span>
          </div>
          <ProgressBar
            value={phase.progress}
            barClassName={isLocked ? "bg-[var(--text-secondary)]/30" : undefined}
            animated={!isLocked}
          />
        </div>

        {isLocked ? (
          <Button
            type="button"
            variant="outline"
            disabled
            className={cn(
              "btn-transition w-full rounded-lg border-[var(--border)] bg-[var(--surface)] font-medium",
              compact ? "h-8 text-xs" : "h-9 rounded-xl text-xs",
            )}
          >
            <Lock className="h-3 w-3" />
            Kilidi Aç
          </Button>
        ) : (
          <Link
            href={phaseLinks[phase.id]}
            className={cn(
              "btn-transition inline-flex w-full items-center justify-center rounded-lg bg-[var(--primary)] font-medium text-white hover:bg-[var(--primary-hover)]",
              compact ? "h-8 text-xs" : "h-9 rounded-xl text-xs",
            )}
          >
            {isCompleted ? "Sonuçları Gör" : "Denetimi Başlat"}
          </Link>
        )}
      </article>
    </div>
  );
}

export function AuditFinalCard({ compact }: { compact?: boolean }) {
  return (
    <article
      className={cn(
        "card-interactive flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] text-center",
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
        Tüm aşamaları tamamla ve siteni zirveye taşı!
      </p>
    </article>
  );
}
