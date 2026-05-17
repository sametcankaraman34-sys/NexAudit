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
  const ringRadius = 44;
  const circumference = 2 * Math.PI * ringRadius;
  const offset = circumference - (summary.overallScore / 100) * circumference;
  const scoreColor =
    summary.overallScore >= 70
      ? "var(--success)"
      : summary.overallScore >= 50
        ? "var(--warning)"
        : "var(--danger)";

  return (
    <section className="audit-section card-interactive rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-medium text-[var(--primary)]">
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            {summary.badgeLabel}
          </span>
          <StatusBadge variant="good" label={summary.statusLabel} />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          <div className="min-w-0 flex-1 space-y-3 lg:max-w-xl">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                {summary.title}
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]/90">{summary.domain}</span>
                <span className="mx-1.5 text-[var(--border)]">·</span>
                Son tarama: {summary.lastScanAt}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.chips.map((chip) => (
                <SummaryChip key={chip.label} {...chip} />
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-4">
            <ScoreRing
              score={summary.overallScore}
              scoreColor={scoreColor}
              circumference={circumference}
              offset={offset}
              radius={ringRadius}
            />
            <div className="grid grid-cols-2 gap-2">
              <MiniStat label="Önceki skor" value={String(summary.previousScore)} />
              {summary.sideStats.map((stat) => (
                <MiniStat
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  sublabel={stat.sublabel}
                />
              ))}
              <MiniStat
                label="Risk"
                value={risk.label}
                accentColor={risk.color}
                icon={<ShieldAlert className="h-3 w-3 shrink-0" style={{ color: risk.color }} />}
                footer={
                  summary.trend !== 0 ? (
                    <span className="mt-0.5 flex items-center gap-0.5 text-[10px] font-medium text-[var(--success)]">
                      <ArrowUpRight className="h-3 w-3" />+{summary.trend} puan
                    </span>
                  ) : undefined
                }
              />
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
  radius,
}: {
  score: number;
  scoreColor: string;
  circumference: number;
  offset: number;
  radius: number;
}) {
  const size = radius * 2 + 16;
  const center = radius + 8;
  const viewSize = center * 2;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${viewSize} ${viewSize}`} aria-hidden>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--surface-soft)"
          strokeWidth="7"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth="7"
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
        <span className="text-2xl font-bold tabular-nums leading-none text-[var(--text-primary)]">
          {score}
        </span>
        <span className="mt-0.5 text-[10px] font-medium text-[var(--text-secondary)]">/ 100</span>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  sublabel,
  footer,
  icon,
  accentColor,
}: {
  label: string;
  value: string;
  sublabel?: string;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div className="min-w-[108px] rounded-lg border border-[var(--border)] bg-[var(--surface-soft)]/80 px-2.5 py-2">
      <p className="flex items-center gap-1 text-[10px] font-medium text-[var(--text-secondary)]">
        {icon}
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 text-sm font-semibold tabular-nums leading-tight text-[var(--text-primary)]",
        )}
        style={accentColor ? { color: accentColor } : undefined}
      >
        {value}
      </p>
      {sublabel && <p className="text-[10px] text-[var(--text-secondary)]">{sublabel}</p>}
      {footer}
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
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)]/60 px-2.5 py-1 text-xs">
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
