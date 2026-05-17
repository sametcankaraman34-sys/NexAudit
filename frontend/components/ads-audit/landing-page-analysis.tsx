import { LayoutTemplate } from "lucide-react";
import type { LandingInsight } from "@/types/audit-intelligence";
import { cn } from "@/lib/utils";

interface LandingPageAnalysisProps {
  insights: LandingInsight[];
  animationDelay?: number;
}

export function LandingPageAnalysis({ insights, animationDelay = 0 }: LandingPageAnalysisProps) {
  return (
    <section className="audit-section" style={{ animationDelay: `${animationDelay}ms` }}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Landing sayfa analizi</h2>
        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
          Bölüm bazlı dönüşüm ve mesaj uyumu skorları
        </p>
      </div>
      <ul className="space-y-3">
        {insights.map((insight, index) => {
          const scoreColor =
            insight.score >= 70
              ? "var(--success)"
              : insight.score >= 50
                ? "var(--warning)"
                : "var(--danger)";
          return (
            <li
              key={insight.id}
              className="audit-row rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]"
              style={{ animationDelay: `${animationDelay + 40 + index * 45}ms` }}
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                    <LayoutTemplate className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{insight.section}</h3>
                </div>
                <span className="text-lg font-bold tabular-nums" style={{ color: scoreColor }}>
                  {insight.score}
                </span>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-[var(--text-secondary)]">{insight.insight}</p>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                <span
                  className={cn(
                    "audit-bar-grow block h-full rounded-full",
                    "bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/60",
                  )}
                  style={
                    {
                      "--audit-bar-target": `${insight.barPercent}%`,
                      animationDelay: `${animationDelay + 90 + index * 45}ms`,
                    } as React.CSSProperties
                  }
                />
              </div>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-primary)]">{insight.issueCount}</span> sorun
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
