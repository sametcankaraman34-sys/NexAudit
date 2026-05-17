"use client";

import { ArrowUpRight, FileCheck, TrendingUp } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { useActiveProject, useProjectWorkspace } from "@/lib/project-context";
import { cn } from "@/lib/utils";
import { ComplianceBar, MiniScoreRing } from "./mini-score-ring";

export function BriefMultiScoreHero() {
  const { activeProjectId } = useActiveProject();
  const { briefCompliance } = useProjectWorkspace();
  const { meta, metrics: briefComplianceMetrics } = briefCompliance;
  const overall = briefComplianceMetrics.find((m) => m.id === "overall")!;
  const subMetrics = briefComplianceMetrics.filter((m) => m.id !== "overall");

  return (
    <section className="audit-section card-interactive rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-medium text-[var(--primary)]">
            <FileCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
            Brief uygunluk motoru
          </span>
          <StatusBadge variant="good" label="Analiz hazır" />
        </div>

        <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                Brief Uygunluğu
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]/90">
                  {meta.projectName}
                </span>
                <span className="mx-1.5 text-[var(--border)]">·</span>
                {meta.domain}
                <span className="mx-1.5 text-[var(--border)]">·</span>
                {meta.lastAnalysisAt}
              </p>
            </div>

            <p className="rounded-xl border border-[var(--primary)]/15 bg-[var(--primary-soft)]/25 px-3 py-2.5 text-sm leading-relaxed text-[var(--text-primary)]">
              <span className="font-medium text-[var(--primary)]">Hizalama: </span>
              {meta.alignmentLabel}
            </p>

            <div className="flex flex-wrap gap-2">
              <Chip label="Brief" value={meta.briefVersion} accent="primary" />
              <Chip label="Önceki skor" value={String(meta.previousScore)} />
              <Chip
                label="Trend"
                value={`+${meta.trend}`}
                accent="success"
                icon={<TrendingUp className="h-3 w-3" strokeWidth={2} />}
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-3 self-end">
            <MiniScoreRing key={`${activeProjectId}-overall`} score={overall.score} size="lg" />
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--success)]">
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
              +{overall.trend} puan · önceki dönem
            </span>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3 border-t border-[var(--border)]/80 pt-5 sm:grid-cols-3 lg:grid-cols-5">
          {subMetrics.map((metric, index) => (
            <li
              key={metric.id}
              className="audit-row card-interactive rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/50 p-3"
              style={{ animationDelay: `${80 + index * 45}ms` }}
            >
              <div className="flex items-center gap-2.5">
                <MiniScoreRing
                  key={`${activeProjectId}-${metric.id}`}
                  score={metric.score}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--text-secondary)]">
                    {metric.label}
                  </p>
                  {metric.trend !== undefined && (
                    <p
                      className={cn(
                        "mt-0.5 text-[13px] font-semibold tabular-nums",
                        metric.trend >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]",
                      )}
                    >
                      {metric.trend >= 0 ? "+" : ""}
                      {metric.trend}
                    </p>
                  )}
                </div>
              </div>
              <ComplianceBar
                key={`${activeProjectId}-${metric.id}-bar`}
                value={metric.score}
                className="mt-2.5"
                delayMs={120 + index * 40}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Chip({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent?: "success" | "primary";
  icon?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)]/60 px-2.5 py-1 text-xs">
      {icon}
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span
        className={cn(
          "font-semibold tabular-nums",
          accent === "success" && "text-[var(--success)]",
          accent === "primary" && "text-[var(--primary)]",
          !accent && "text-[var(--text-primary)]",
        )}
      >
        {value}
      </span>
    </span>
  );
}
