import { BarChart3 } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import type { MetricFinding } from "@/types/audit-intelligence";
import { cn } from "@/lib/utils";

interface IntelligenceMetricGridProps {
  title?: string;
  subtitle?: string;
  findings: MetricFinding[];
  animationDelay?: number;
}

export function IntelligenceMetricGrid({
  title = "Metrik analizi",
  subtitle = "Derinlemesine yapısal ve performans bulguları",
  findings,
  animationDelay = 0,
}: IntelligenceMetricGridProps) {
  return (
    <section className="audit-section" style={{ animationDelay: `${animationDelay}ms` }}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{subtitle}</p>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {findings.map((finding, index) => (
          <li key={finding.id}>
            <article
              className={cn(
                "card-interactive audit-section flex h-full flex-col rounded-xl border border-[var(--border)]",
                "bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]",
              )}
              style={{ animationDelay: `${animationDelay + 50 + index * 55}ms` }}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                  <BarChart3 className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <SeverityBadge severity={finding.severity} size="sm" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{finding.title}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                {finding.description}
              </p>
              <div className="mt-3 flex items-baseline gap-1 border-t border-[var(--border)]/80 pt-3">
                <span className="text-xl font-bold tabular-nums text-[var(--primary)]">{finding.metric}</span>
                <span className="text-xs text-[var(--text-secondary)]">{finding.metricLabel}</span>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
