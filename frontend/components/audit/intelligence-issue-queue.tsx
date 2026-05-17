import { ChevronRight, Zap } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import type { IntelligenceIssue } from "@/types/audit-intelligence";
import { cn } from "@/lib/utils";

const statusVariant = {
  detected: "detected" as const,
  in_progress: "in_progress" as const,
  resolved: "resolved" as const,
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
      <ul className="divide-y divide-[var(--border)]">
        {issues.map((issue, index) => (
          <li key={issue.id}>
            <IssueQueueItem issue={issue} animationDelay={animationDelay + 60 + index * 45} />
          </li>
        ))}
      </ul>
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
  return (
    <article
      className={cn(
        "audit-row group flex flex-col gap-3 px-5 py-4 transition-colors duration-[var(--transition-base)]",
        "hover:bg-[var(--surface-soft)]/70 sm:flex-row sm:items-center sm:gap-4",
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex shrink-0 items-center gap-2">
          <SeverityBadge severity={issue.severity} size="sm" />
          <StatusBadge variant={statusVariant[issue.status]} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-ui-card-title font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)]">
            {issue.title}
          </h3>
          <p className="mt-0.5 text-ui-secondary text-[var(--text-secondary)]">
            <span className="font-medium text-[var(--text-primary)]/80">{issue.location}</span>
            {issue.affectedElement && (
              <span className="ml-2 font-mono text-[13px] text-[var(--text-secondary)]">
                {issue.affectedElement}
              </span>
            )}
          </p>
          <p className="mt-1.5 text-ui-secondary leading-relaxed text-[var(--text-secondary)]">{issue.impact}</p>
          {issue.fixHint && (
            <p className="mt-1 text-ui-secondary font-medium text-[var(--primary)]">{issue.fixHint}</p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-36 sm:items-end">
        <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
          <span className="flex items-center gap-1 text-[13px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
            <Zap className="h-3 w-3 text-[var(--primary)]" />
            Potansiyel
          </span>
          <span className="text-sm font-bold tabular-nums text-[var(--primary)]">
            {issue.optimizationPotential}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-soft)] sm:w-28">
          <span
            className="audit-bar-grow block h-full rounded-full bg-[var(--primary)]"
            style={
              {
                "--audit-bar-target": `${issue.optimizationPotential}%`,
                animationDelay: `${animationDelay + 120}ms`,
              } as React.CSSProperties
            }
          />
        </div>
        <ChevronRight className="hidden h-4 w-4 text-[var(--text-secondary)] opacity-0 transition-opacity group-hover:opacity-100 sm:block" />
      </div>
    </article>
  );
}
