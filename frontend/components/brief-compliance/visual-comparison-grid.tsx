"use client";

import { GitCompare } from "lucide-react";
import { AnalysisSectionHeader } from "@/components/audit/analysis-section-header";
import { useActiveProject, useProjectWorkspace } from "@/lib/project-context";
import { ComplianceBar, scoreColor } from "./mini-score-ring";

export function VisualComparisonGrid() {
  const { activeProjectId } = useActiveProject();
  const { briefCompliance } = useProjectWorkspace();
  const visualComparisons = briefCompliance.visualComparisons;
  return (
    <section className="audit-section" style={{ animationDelay: "100ms" }}>
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-soft)] text-[var(--primary)]">
          <GitCompare className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <AnalysisSectionHeader
          title="Görsel karşılaştırma alanı"
          description="Brief ile sitedeki marka, tipografi, CTA ve layout öğelerinin eşleşme derinliği"
        />
      </div>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visualComparisons.map((item, index) => (
          <li key={item.id} className="list-none">
            <article
              className="audit-row card-interactive flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]"
              style={{ animationDelay: `${140 + index * 50}ms` }}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</h3>
                <span
                  className="text-lg font-bold tabular-nums"
                  style={{ color: scoreColor(item.matchPercent) }}
                >
                  {item.matchPercent}%
                </span>
              </div>

              <ComplianceBar
                key={`${activeProjectId}-${item.id}-match`}
                value={item.matchPercent}
                delayMs={160 + index * 45}
              />

              <div className="mt-3 flex h-9 items-end gap-1">
                {item.barValues.map((v, i) => (
                  <span
                    key={`${activeProjectId}-${item.id}-${i}-${v}`}
                    className="audit-vbar-grow flex-1 rounded-sm bg-[var(--primary)]/70"
                    style={{
                      height: `${Math.max(20, v)}%`,
                      animationDelay: `${180 + index * 40 + i * 30}ms`,
                      opacity: 0.35 + (v / 100) * 0.65,
                    }}
                  />
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-[var(--border)]/70 pt-3">
                <ComparisonRow label="Brief" value={item.briefValue} variant="brief" />
                <ComparisonRow label="Site" value={item.siteValue} variant="site" />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-[13px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                  Sapma göstergesi
                </span>
                <DeviationMeter percent={100 - item.matchPercent} />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ComparisonRow({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: "brief" | "site";
}) {
  return (
    <div className="flex gap-2 text-xs">
      <span
        className={
          variant === "brief"
            ? "shrink-0 rounded bg-[var(--primary-soft)] px-1.5 py-0.5 font-medium text-[var(--primary)]"
            : "shrink-0 rounded bg-[var(--surface-soft)] px-1.5 py-0.5 font-medium text-[var(--text-secondary)]"
        }
      >
        {label}
      </span>
      <span className="leading-relaxed text-[var(--text-secondary)]">{value}</span>
    </div>
  );
}

function DeviationMeter({ percent }: { percent: number }) {
  const intensity = percent >= 25 ? "var(--danger)" : percent >= 12 ? "var(--warning)" : "var(--success)";
  return (
    <div className="flex flex-1 items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--surface-soft)]">
        <div
          className="audit-bar-grow h-full rounded-full"
          style={{ width: `${Math.min(100, percent)}%`, backgroundColor: intensity }}
        />
      </div>
      <span className="text-[13px] font-semibold tabular-nums text-[var(--text-secondary)]">
        {percent}%
      </span>
    </div>
  );
}
