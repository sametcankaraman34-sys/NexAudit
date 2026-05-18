"use client";

import { useState } from "react";
import { ChevronRight, RotateCcw, Zap } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useActiveProject } from "@/lib/project-context";
import { NexToast } from "@/lib/nex-toast";
import { useAppStore } from "@/stores/app-store";
import type { IntelligenceIssue } from "@/types/audit-intelligence";
import type { IssueStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusVariant: Record<
  IssueStatus,
  "detected" | "in_progress" | "resolved" | "ignored"
> = {
  detected: "detected",
  in_progress: "in_progress",
  resolved: "resolved",
  ignored: "ignored",
};

interface IntelligenceIssueQueueProps {
  title?: string;
  subtitle?: string;
  issues: IntelligenceIssue[];
  animationDelay?: number;
}

export function IntelligenceIssueQueue({
  title = "Öncelik kuyruğu",
  subtitle = "Canlı bulgular — etki ve optimizasyon potansiyeline göre sıralı",
  issues,
  animationDelay = 0,
}: IntelligenceIssueQueueProps) {
  return (
    <section
      className="audit-section rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-ui-section-title font-semibold text-[var(--text-primary)]">{title}</h2>
        <p className="mt-1 text-ui-secondary text-[var(--text-secondary)]">{subtitle}</p>
      </div>
      {issues.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-[var(--text-secondary)]">
          Henüz bulgu yok — taramayı başlatarak listeyi oluşturabilirsin.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {issues.map((issue, index) => (
            <li key={issue.id}>
              <IssueQueueItem issue={issue} animationDelay={animationDelay + 60 + index * 45} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function IssueQueueItem({
  issue,
  animationDelay,
}: {
  issue: IntelligenceIssue;
  animationDelay: number;
}) {
  const { activeProjectId } = useActiveProject();
  const updateIssueStatus = useAppStore((s) => s.updateIssueStatus);
  const [pending, setPending] = useState(false);

  const applyStatus = async (status: IssueStatus, toastTitle: string) => {
    if (pending) return;
    setPending(true);
    try {
      await updateIssueStatus(activeProjectId, issue.id, status);
      NexToast.success(toastTitle, issue.title);
    } finally {
      setPending(false);
    }
  };

  return (
    <article
      className={cn(
        "audit-row group flex flex-col gap-3 px-5 py-4 transition-colors duration-[var(--transition-base)]",
        "hover:bg-[var(--surface-soft)]/70 sm:flex-row sm:items-center sm:gap-4",
        (issue.status === "resolved" || issue.status === "ignored") && "opacity-70",
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex shrink-0 items-center gap-2">
          <SeverityBadge severity={issue.severity} size="sm" />
          <StatusBadge variant={statusVariant[issue.status]} />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "text-ui-card-title font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)]",
              (issue.status === "resolved" || issue.status === "ignored") &&
                "line-through text-[var(--text-secondary)]",
            )}
          >
            {issue.title}
          </h3>
          <p className="mt-0.5 text-ui-secondary text-[var(--text-secondary)]">
            <span className="font-medium text-[var(--text-primary)]/80">{issue.location}</span>
          </p>
          <p className="mt-1.5 text-ui-secondary leading-relaxed text-[var(--text-secondary)]">
            {issue.impact}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-44">
        {issue.status !== "resolved" && issue.status !== "ignored" && (
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              disabled={pending}
              onClick={() => void applyStatus("resolved", "Sorun çözüldü")}
              className="btn-transition flex-1 rounded-lg bg-[var(--success-soft)] px-2 py-1.5 text-[11px] font-semibold text-[var(--success)] hover:bg-[var(--success)] hover:text-white"
            >
              Çözüldü
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => void applyStatus("ignored", "Yok sayıldı")}
              className="btn-transition flex-1 rounded-lg border border-[var(--border)] px-2 py-1.5 text-[11px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
            >
              Yok say
            </button>
          </div>
        )}
        {(issue.status === "resolved" || issue.status === "ignored") && (
          <button
            type="button"
            disabled={pending}
            onClick={() => void applyStatus("detected", "Sorun yeniden açıldı")}
            className="btn-transition inline-flex items-center justify-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1.5 text-[11px] font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
          >
            <RotateCcw className="h-3 w-3" />
            Yeniden aç
          </button>
        )}
        <div className="flex items-center justify-between gap-2 text-[13px] text-[var(--text-secondary)]">
          <span className="flex items-center gap-1 font-medium uppercase tracking-wide">
            <Zap className="h-3 w-3 text-[var(--primary)]" />
            Potansiyel
          </span>
          <span className="font-bold tabular-nums text-[var(--primary)]">
            {issue.optimizationPotential}%
          </span>
        </div>
        <ChevronRight className="hidden h-4 w-4 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 sm:ml-auto" />
      </div>
    </article>
  );
}
