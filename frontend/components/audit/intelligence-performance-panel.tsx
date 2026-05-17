import { Gauge, Timer } from "lucide-react";
import type { PerformanceFactor } from "@/types/audit-intelligence";
import { cn } from "@/lib/utils";

const impactLabel = {
  high: { text: "Yüksek etki", className: "text-[var(--danger)]" },
  medium: { text: "Orta etki", className: "text-[var(--warning)]" },
  low: { text: "Düşük etki", className: "text-[var(--text-secondary)]" },
};

interface IntelligencePerformancePanelProps {
  title?: string;
  subtitle?: string;
  factors: PerformanceFactor[];
  animationDelay?: number;
}

export function IntelligencePerformancePanel({
  title = "Performans etkisi",
  subtitle = "Siteyi yavaşlatan faktörler ve tahmini gecikme",
  factors,
  animationDelay = 0,
}: IntelligencePerformancePanelProps) {
  const totalPenalty = factors.reduce((s, f) => s + f.scorePenalty, 0);

  return (
    <section
      className="audit-section rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
            <Gauge className="h-4 w-4 text-[var(--primary)]" strokeWidth={1.75} />
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{subtitle}</p>
        </div>
        <div className="rounded-xl border border-[var(--danger)]/20 bg-[var(--danger-soft)]/40 px-4 py-2 text-center sm:text-right">
          <p className="text-xs text-[var(--text-secondary)]">Toplam skor kaybı</p>
          <p className="text-xl font-bold tabular-nums text-[var(--danger)]">−{totalPenalty}</p>
        </div>
      </div>

      <ul className="space-y-4">
        {factors.map((factor, index) => {
          const impact = impactLabel[factor.impact];
          return (
            <li
              key={factor.id}
              className="audit-row rounded-xl border border-[var(--border)]/80 bg-[var(--surface-soft)]/50 px-4 py-3"
              style={{ animationDelay: `${animationDelay + 70 + index * 50}ms` }}
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">{factor.label}</span>
                <span className={cn("text-xs font-medium", impact.className)}>{impact.text}</span>
              </div>
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-[var(--surface)]">
                <span
                  className="audit-bar-grow block h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/60"
                  style={
                    {
                      "--audit-bar-target": `${factor.barPercent}%`,
                      animationDelay: `${animationDelay + 120 + index * 50}ms`,
                    } as React.CSSProperties
                  }
                />
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-[var(--text-secondary)]">
                {factor.estimatedMs != null && (
                  <span className="inline-flex items-center gap-1">
                    <Timer className="h-3 w-3" />~{factor.estimatedMs}
                    {factor.unit ?? "ms"} gecikme
                  </span>
                )}
                <span>Skor etkisi: −{factor.scorePenalty}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
