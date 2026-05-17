import { Activity } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import type { MetricFinding } from "@/types/audit-intelligence";

interface AnalyticsHealthPanelProps {
  findings: MetricFinding[];
  animationDelay?: number;
}

export function AnalyticsHealthPanel({ findings, animationDelay = 0 }: AnalyticsHealthPanelProps) {
  return (
    <section
      className="audit-section rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <Activity className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Analytics sağlığı</h2>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            Event kapsamı, consent ve attribution bütünlüğü
          </p>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {findings.map((finding, index) => (
          <li
            key={finding.id}
            className="audit-row rounded-xl border border-[var(--border)]/80 bg-[var(--surface-soft)]/50 p-4"
            style={{ animationDelay: `${animationDelay + 50 + index * 45}ms` }}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <SeverityBadge severity={finding.severity} size="sm" />
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold tabular-nums text-[var(--primary)]">{finding.metric}</span>
                <span className="text-xs text-[var(--text-secondary)]">{finding.metricLabel}</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">{finding.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{finding.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
