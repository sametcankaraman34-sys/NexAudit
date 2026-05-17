import { FileText } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import type { MetricFinding } from "@/types/audit-intelligence";

interface ContentQualityPanelProps {
  findings: MetricFinding[];
  animationDelay?: number;
}

export function ContentQualityPanel({ findings, animationDelay = 0 }: ContentQualityPanelProps) {
  return (
    <section
      className="audit-section rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <FileText className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">İçerik kalitesi</h2>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            Okunabilirlik, derinlik ve heading yapısı bulguları
          </p>
        </div>
      </div>
      <ul className="space-y-3">
        {findings.map((finding, index) => (
          <li
            key={finding.id}
            className="audit-row flex flex-col gap-2 rounded-xl border border-[var(--border)]/80 bg-[var(--surface-soft)]/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            style={{ animationDelay: `${animationDelay + 50 + index * 45}ms` }}
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <SeverityBadge severity={finding.severity} size="sm" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">{finding.title}</span>
              </div>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{finding.description}</p>
            </div>
            <div className="flex shrink-0 items-baseline gap-1 sm:text-right">
              <span className="text-lg font-bold tabular-nums text-[var(--primary)]">{finding.metric}</span>
              <span className="text-xs text-[var(--text-secondary)]">{finding.metricLabel}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
