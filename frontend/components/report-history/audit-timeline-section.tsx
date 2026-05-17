"use client";

import { History, Megaphone, Monitor, Search } from "lucide-react";
import { AnalysisSectionHeader } from "@/components/audit/analysis-section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import type { AuditTimelineEntry } from "@/data/mock-report-history";
import { useProjectWorkspace } from "@/lib/project-context";
import { cn } from "@/lib/utils";

const phaseIcons = {
  website: Monitor,
  seo: Search,
  ads: Megaphone,
};

function scoreColor(score: number) {
  if (score >= 70) return "var(--success)";
  if (score >= 50) return "var(--warning)";
  return "var(--danger)";
}

export function AuditTimelineSection() {
  const { reportHistory } = useProjectWorkspace();
  const auditTimeline = reportHistory.timeline;
  return (
    <section className="audit-section" style={{ animationDelay: "120ms" }}>
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-soft)] text-[var(--primary)]">
          <History className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <AnalysisSectionHeader
          title="Denetim zaman çizelgesi"
          description="Her kayıt bir optimizasyon dönüm noktası — skor, sorun ve kazanımlar"
        />
      </div>

      <ol className="relative space-y-0">
        {auditTimeline.map((entry, index) => (
          <TimelineItem key={entry.id} entry={entry} index={index} isLast={index === auditTimeline.length - 1} />
        ))}
      </ol>
    </section>
  );
}

function TimelineItem({
  entry,
  index,
  isLast,
}: {
  entry: AuditTimelineEntry;
  index: number;
  isLast: boolean;
}) {
  const Icon = phaseIcons[entry.phaseId] ?? Monitor;
  const delta = entry.newScore - entry.previousScore;
  const deltaPositive = delta >= 0;

  return (
    <li
      className="audit-row relative flex gap-4 pb-6 last:pb-0"
      style={{ animationDelay: `${160 + index * 55}ms` }}
    >
      {!isLast && (
        <span
          className="absolute left-[15px] top-10 h-[calc(100%-12px)] w-px bg-[var(--border)]"
          aria-hidden
        />
      )}
      <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] shadow-[var(--shadow-card)]">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>

      <article className="card-interactive min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{entry.projectName}</p>
            <p className="text-xs text-[var(--text-secondary)]">{entry.phase}</p>
          </div>
          <StatusBadge
            variant={entry.status === "completed" ? "good" : "in_progress"}
            label={entry.status === "completed" ? "Tamamlandı" : "Devam ediyor"}
          />
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold tabular-nums text-[var(--text-secondary)]">
              {entry.previousScore}
            </span>
            <span className="text-[var(--text-secondary)]">→</span>
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: scoreColor(entry.newScore) }}
            >
              {entry.newScore}
            </span>
          </div>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums",
              deltaPositive
                ? "bg-[var(--success-soft)] text-[var(--success)]"
                : "bg-[var(--danger-soft)] text-[var(--danger)]",
            )}
          >
            {deltaPositive ? "+" : ""}
            {delta}
          </span>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <MiniStat label="Çözülen sorun" value={String(entry.issuesResolved)} />
          <MiniStat label="Kritik azalma" value={String(entry.criticalReduced)} />
          <MiniStat label="Tarih" value={entry.date} className="col-span-2 sm:col-span-1" />
        </div>

        <div className="mb-3 flex h-7 items-end gap-0.5">
          {entry.scoreSparkline.map((v, i) => (
            <span
              key={i}
              className="audit-vbar-grow flex-1 rounded-sm bg-[var(--primary)]/70"
              style={{
                height: `${Math.max(20, v)}%`,
                animationDelay: `${200 + index * 40 + i * 30}ms`,
                opacity: 0.3 + (i / entry.scoreSparkline.length) * 0.65,
              }}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {entry.optimizationGains.map((gain) => (
            <span
              key={gain}
              className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-0.5 text-[13px] font-medium text-[var(--text-secondary)]"
            >
              {gain}
            </span>
          ))}
        </div>
      </article>
    </li>
  );
}

function MiniStat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-[var(--border)]/80 bg-[var(--surface-soft)]/50 px-2.5 py-2", className)}>
      <p className="text-[13px] text-[var(--text-secondary)]">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">{value}</p>
    </div>
  );
}
