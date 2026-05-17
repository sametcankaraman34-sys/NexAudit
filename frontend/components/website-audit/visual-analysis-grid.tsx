import { Eye, Layout, Smartphone, Type } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import type { VisualFinding } from "@/data/mock-website-audit";
import { cn } from "@/lib/utils";

const iconMap = {
  default: Eye,
  layout: Layout,
  mobile: Smartphone,
  type: Type,
};

interface VisualAnalysisGridProps {
  findings: VisualFinding[];
  animationDelay?: number;
}

export function VisualAnalysisGrid({ findings, animationDelay = 0 }: VisualAnalysisGridProps) {
  return (
    <section
      className="audit-section"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Görsel analiz</h2>
        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
          Derinlemesine yapısal ve görsel inceleme bulguları
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {findings.map((finding, index) => {
          const Icon = iconMap.default;
          return (
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
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <SeverityBadge severity={finding.severity} size="sm" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{finding.title}</h3>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {finding.description}
                </p>
                <div className="mt-3 flex items-baseline gap-1 border-t border-[var(--border)]/80 pt-3">
                  <span className="text-xl font-bold tabular-nums text-[var(--primary)]">
                    {finding.metric}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">{finding.metricLabel}</span>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
