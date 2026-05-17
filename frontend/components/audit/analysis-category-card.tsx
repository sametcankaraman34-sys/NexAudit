import type { AnalysisCategory } from "@/types/audit-intelligence";

interface AnalysisCategoryCardProps {
  category: AnalysisCategory;
  animationDelay?: number;
}

export function AnalysisCategoryCard({ category, animationDelay = 0 }: AnalysisCategoryCardProps) {
  const scoreColor =
    category.score >= 70
      ? "var(--success)"
      : category.score >= 50
        ? "var(--warning)"
        : "var(--danger)";

  return (
    <article
      className="audit-section card-interactive flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{category.title}</h3>
        <span className="text-lg font-bold tabular-nums" style={{ color: scoreColor }}>
          {category.score}
        </span>
      </div>
      <div className="mb-3 flex h-10 items-end gap-1">
        {category.barValues.map((v, i) => (
          <span
            key={i}
            className="audit-vbar-grow flex-1 rounded-sm bg-[var(--primary)]/30"
            style={
              {
                height: `${Math.max(22, v * 0.45)}px`,
                animationDelay: `${animationDelay + 100 + i * 45}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <ul className="mb-3 space-y-1">
        {category.metrics.map((m) => (
          <li key={m.label} className="flex justify-between text-xs">
            <span className="text-[var(--text-secondary)]">{m.label}</span>
            <span className="font-medium tabular-nums text-[var(--text-primary)]">{m.value}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)]/80 pt-3 text-xs">
        <span className="text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">{category.issueCount}</span> sorun
          {category.criticalCount > 0 && (
            <span className="text-[var(--danger)]"> · {category.criticalCount} kritik</span>
          )}
        </span>
        <span className="font-medium text-[var(--primary)]">+{category.optimizationGain} puan</span>
      </div>
    </article>
  );
}
