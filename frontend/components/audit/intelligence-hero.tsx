import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { AuditIntelligenceSummary } from "@/types/audit-intelligence";
import { cn } from "@/lib/utils";

const riskStyles = {
  low: { label: "Düşük risk", color: "var(--success)" },
  medium: { label: "Orta risk", color: "var(--warning)" },
  high: { label: "Yüksek risk", color: "var(--danger)" },
};

interface IntelligenceHeroProps {
  summary: AuditIntelligenceSummary;
  icon: LucideIcon;
}

export function IntelligenceHero({ summary, icon: Icon }: IntelligenceHeroProps) {
  const risk = riskStyles[summary.riskLevel];
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (summary.overallScore / 100) * circumference;
  const scoreColor =
    summary.overallScore >= 70
      ? "var(--success)"
      : summary.overallScore >= 50
        ? "var(--warning)"
        : "var(--danger)";

  return (
    <section className="audit-section card-interactive rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] lg:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-medium text-[var(--primary)]">
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              {summary.badgeLabel}
            </span>
            <StatusBadge variant="good" label={summary.statusLabel} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {summary.title}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {summary.domain} · Son tarama: {summary.lastScanAt}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {summary.chips.map((chip) => (
              <SummaryChip key={chip.label} {...chip} />
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-6">
          <ScoreRing
            score={summary.overallScore}
            scoreColor={scoreColor}
            circumference={circumference}
            offset={offset}
          />
          <div className="hidden flex-col gap-3 sm:flex">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/80 px-4 py-3">
              <p className="text-xs text-[var(--text-secondary)]">Önceki skor</p>
              <p className="text-lg font-semibold tabular-nums text-[var(--text-primary)]">
                {summary.previousScore}
              </p>
            </div>
            {summary.sideStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/80 px-4 py-3"
              >
                <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{stat.value}</p>
                {stat.sublabel && (
                  <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{stat.sublabel}</p>
                )}
              </div>
            ))}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/80 px-4 py-3">
              <p className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <ShieldAlert className="h-3.5 w-3.5" style={{ color: risk.color }} />
                Risk
              </p>
              <p className="text-sm font-semibold" style={{ color: risk.color }}>
                {risk.label}
              </p>
              {summary.trend !== 0 && (
                <p className="mt-1 flex items-center gap-0.5 text-xs font-medium text-[var(--success)]">
                  <ArrowUpRight className="h-3 w-3" />+{summary.trend} puan
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreRing({
  score,
  scoreColor,
  circumference,
  offset,
}: {
  score: number;
  scoreColor: string;
  circumference: number;
  offset: number;
}) {
  return (
    <div className="relative h-[128px] w-[128px]">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--surface-soft)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={scoreColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="audit-ring-draw"
          style={
            {
              "--ring-circumference": circumference,
              "--ring-offset": offset,
            } as React.CSSProperties
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">{score}</span>
        <span className="text-[11px] font-medium text-[var(--text-secondary)]">/ 100</span>
      </div>
    </div>
  );
}

function SummaryChip({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "success" | "warning" | "primary";
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)]/60 px-3 py-1.5 text-xs">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span
        className={cn(
          "font-semibold tabular-nums",
          accent === "success" && "text-[var(--success)]",
          accent === "warning" && "text-[var(--warning)]",
          accent === "primary" && "text-[var(--primary)]",
          !accent && "text-[var(--text-primary)]",
        )}
      >
        {value}
      </span>
    </span>
  );
}
