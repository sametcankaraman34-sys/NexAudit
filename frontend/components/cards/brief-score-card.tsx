"use client";

import { CheckCircle2, ClipboardList } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { useProjectWorkspace } from "@/lib/project-context";
import { cn } from "@/lib/utils";

interface BriefScoreCardProps {
  compact?: boolean;
}

export function BriefScoreCard({ compact }: BriefScoreCardProps) {
  const { brief } = useProjectWorkspace();
  const items = brief.met.slice(0, compact ? 2 : 3);
  const badgeVariant = brief.score >= 70 ? "good" : brief.score >= 50 ? "in_progress" : "detected";

  return (
    <Link
      href="/brief"
      className={cn(
        "card-interactive block rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]",
        compact ? "p-3.5" : "rounded-2xl p-5",
      )}
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-base font-medium text-[var(--text-primary)]">Brief Uygunluğu</p>
          {!compact && (
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              Brief ile site karşılaştırması
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg bg-[var(--success-soft)] text-[var(--success)]",
            compact ? "h-8 w-8" : "h-10 w-10 rounded-xl",
          )}
        >
          <ClipboardList className={compact ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.75} />
        </div>
      </div>

      <div className={cn("flex gap-3", compact && "items-center")}>
        <div className="shrink-0">
          <div className="flex items-end gap-1">
            <span
              className={cn(
                "font-semibold text-[var(--text-primary)]",
                compact ? "text-[1.75rem] leading-none" : "text-3xl",
              )}
            >
              {brief.score || "—"}
            </span>
            <span
              className={cn(
                "text-[var(--text-secondary)]",
                compact ? "mb-0.5 text-sm" : "mb-1 text-lg",
              )}
            >
              / {brief.maxScore}
            </span>
          </div>
          {brief.score > 0 && (
            <StatusBadge variant={badgeVariant} label={brief.label} className="mt-1.5" />
          )}
        </div>

        {compact && (
          <ul className="min-w-0 flex-1 space-y-1 border-l border-[var(--border)] pl-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]"
              >
                <CheckCircle2 className="h-3 w-3 shrink-0 text-[var(--success)]" />
                <span className="truncate">{item.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!compact && (
        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--success)]" />
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
