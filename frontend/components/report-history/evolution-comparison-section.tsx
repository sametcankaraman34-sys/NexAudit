import { GitCompareArrows } from "lucide-react";
import { AnalysisSectionHeader } from "@/components/audit/analysis-section-header";
import { evolutionMetrics } from "@/data/mock-report-history";
import { cn } from "@/lib/utils";

function barColor(changePercent: number) {
  if (changePercent < 0) return "var(--success)";
  return "var(--primary)";
}

export function EvolutionComparisonSection() {
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
          const color = barColor(metric.changePercent);
          const improved = metric.changePercent < 0 ? "azaldı" : "arttı";
          return (
            <li key={metric.id} className="list-none">
              <article
                className="audit-row card-interactive rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/40 p-4"
                style={{ animationDelay: `${240 + index * 45}ms` }}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{metric.label}</h3>
                  <span
                    className={cn(
                      "shrink-0 rounded-md px-2 py-0.5 text-xs font-bold tabular-nums",
                      metric.changePercent < 0
                        ? "bg-[var(--success-soft)] text-[var(--success)]"
                        : "bg-[var(--primary-soft)] text-[var(--primary)]",
                    )}
                  >
                    {metric.changePercent > 0 ? "+" : ""}
                    {metric.changePercent}%
                  </span>
                </div>

                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">
                    Önce: <strong className="text-[var(--text-primary)]">{metric.before}</strong>{" "}
                    {metric.unit}
                  </span>
                  <span className="text-[var(--text-secondary)]">
                    Sonra: <strong style={{ color }}>{metric.after}</strong> {metric.unit}
                  </span>
                </div>

                <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                  <div
                    className="audit-bar-grow h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (metric.after / Math.max(metric.before, metric.after)) * 100)}%`,
                      backgroundColor: color,
                      animationDelay: `${260 + index * 40}ms`,
                    }}
                  />
                </div>

                <div className="flex h-8 items-end gap-1">
                  {metric.barValues.map((v, i) => (
                    <span
                      key={i}
                      className="audit-vbar-grow flex-1 rounded-sm"
                      style={{
                        height: `${Math.max(18, (v / Math.max(...metric.barValues)) * 100)}%`,
                        backgroundColor: color,
                        opacity: 0.35 + (i / metric.barValues.length) * 0.55,
                        animationDelay: `${280 + index * 35 + i * 25}ms`,
                      }}
                    />
                  ))}
                </div>

                <p className="mt-2 text-[13px] text-[var(--text-secondary)]">
                  Dönem içinde {improved}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
