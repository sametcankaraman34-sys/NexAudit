"use client";

import { GitCompareArrows } from "lucide-react";
import { AnalysisSectionHeader } from "@/components/audit/analysis-section-header";
import { useProjectWorkspace } from "@/lib/project-context";
import { cn } from "@/lib/utils";

function barColor(changePercent: number) {
  if (changePercent < 0) return "var(--success)";
  return "var(--primary)";
}

export function EvolutionComparisonSection() {
  const { reportHistory } = useProjectWorkspace();
  const evolutionMetrics = reportHistory.evolution;

  return (
    <section
      className="audit-section rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6"
      style={{ animationDelay: "200ms" }}
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <GitCompareArrows className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <AnalysisSectionHeader
          title="Evrim karşılaştırması"
          description="Skor artışı, kritik sorun azalması ve kanal bazlı büyüme"
        />
      </div>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {evolutionMetrics.map((metric, index) => {
          const maxBar = Math.max(...metric.barValues, 1);
          return (
            <li
              key={metric.id}
              className="audit-section rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/50 p-4"
              style={{ animationDelay: `${240 + index * 50}ms` }}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-[var(--text-primary)]">{metric.label}</p>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[12px] font-medium",
                    metric.changePercent <= 0
                      ? "bg-[var(--success-soft)] text-[var(--success)]"
                      : "bg-[var(--primary-soft)] text-[var(--primary)]",
                  )}
                >
                  {metric.changePercent > 0 ? "+" : ""}
                  {metric.changePercent}%
                </span>
              </div>

              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[12px] text-[var(--text-secondary)]">Önce</p>
                  <p className="text-lg font-semibold tabular-nums text-[var(--text-secondary)]">
                    {metric.before}
                    {metric.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] text-[var(--text-secondary)]">Sonra</p>
                  <p className="text-lg font-semibold tabular-nums text-[var(--text-primary)]">
                    {metric.after}
                    {metric.unit}
                  </p>
                </div>
              </div>

              <div className="flex h-8 items-end gap-1">
                {metric.barValues.map((value, barIndex) => (
                  <span
                    key={barIndex}
                    className="flex-1 rounded-t-sm transition-[height] duration-500"
                    style={{
                      height: `${Math.max(12, (value / maxBar) * 100)}%`,
                      backgroundColor: barColor(metric.changePercent),
                      opacity: 0.35 + barIndex * 0.12,
                    }}
                  />
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
