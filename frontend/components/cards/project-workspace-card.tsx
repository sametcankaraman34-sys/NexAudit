import { ArrowUpRight, Check, Lock, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AUDIT_PHASE_ORDER, AUDIT_PHASE_SHORT_LABELS } from "@/constants/audit";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { AuditPhaseId, Project, ProjectPhaseStatus, ProjectRiskLevel } from "@/types";

const PHASE_BAR_COLORS = [
  { top: "#38bdf8", bottom: "#7dd3fc" },
  { top: "#a78bfa", bottom: "#c4b5fd" },
  { top: "#fb923c", bottom: "#fca5a5" },
];
const ISSUE_COLORS = ["var(--danger)", "#ea580c", "var(--warning)", "#94a3b8"];
const ISSUE_LABELS = ["Kritik", "Yüksek", "Orta", "Düşük"] as const;

const riskAccent: Record<ProjectRiskLevel, string> = {
  low: "var(--success)",
  medium: "var(--warning)",
  high: "var(--danger)",
};

const riskLabel: Record<ProjectRiskLevel, string> = {
  low: "Sağlıklı",
  medium: "İzleniyor",
  high: "Yüksek risk",
};

const statusVariant = {
  active: "good" as const,
  draft: "detected" as const,
  archived: "locked" as const,
};

const statusLabel = {
  active: "Aktif",
  draft: "Taslak",
  archived: "Arşiv",
};

interface ProjectWorkspaceCardProps {
  project: Project;
  animationIndex?: number;
}

export function ProjectWorkspaceCard({
  project,
  animationIndex = 0,
}: ProjectWorkspaceCardProps) {
  const baseDelay = animationIndex * 70;
  const chartId = `proj-chart-${project.id}`;
  const completion = Math.round(
    project.phases.reduce((s, p) => s + p.progress, 0) / project.phases.length,
  );
  const hasScore = project.overallScore > 0;
  const densityTotal = project.issueBreakdown.reduce((a, b) => a + b, 0) || 1;
  const orderedPhases = AUDIT_PHASE_ORDER.map(
    (id) => project.phases.find((p) => p.id === id)!,
  );
  const scoreColor = !hasScore
    ? "#cbd5e1"
    : project.overallScore >= 70
      ? "var(--success)"
      : project.overallScore >= 50
        ? "var(--warning)"
        : "var(--danger)";

  return (
    <article
      className="card-interactive group page-enter flex h-full min-h-[180px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]"
      style={{ animationDelay: `${baseDelay}ms` }}
    >
      <div className="grid flex-1 grid-cols-[minmax(0,1fr)_minmax(124px,34%)] gap-4 p-4">
        <div className="flex min-w-0 flex-col gap-3">
          <header>
            <div className="mb-2 flex items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: riskAccent[project.riskLevel] }}
              />
              <StatusBadge
                variant={statusVariant[project.status]}
                label={statusLabel[project.status]}
                size="sm"
              />
            </div>
            <h3 className="truncate text-base font-semibold leading-snug text-[var(--text-primary)]">
              {project.name}
            </h3>
            <p className="truncate text-sm text-[var(--text-secondary)]">{project.domain}</p>
            <p className="truncate text-sm text-[var(--text-secondary)]/80">
              {project.customerName}
            </p>
          </header>

          <div className="space-y-1.5">
            <p className="text-sm text-[var(--text-secondary)]">Denetim skoru</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums leading-none text-[var(--text-primary)]">
                {hasScore ? project.overallScore : "—"}
              </span>
              <TrendInline trend={project.scoreTrend} />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="font-medium" style={{ color: riskAccent[project.riskLevel] }}>
                {riskLabel[project.riskLevel]}
              </span>
              <span className="mx-2 text-[var(--border)]">·</span>
              <span>%{completion} tamamlandı</span>
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-x-3 gap-y-1">
            <MetricRow label="Kritik" value={String(project.criticalIssues)} tone="danger" />
            <MetricRow
              label="Brief"
              value={project.briefScore !== null ? String(project.briefScore) : "—"}
              tone="primary"
            />
            <MetricRow label="Sorun" value={String(project.totalIssues)} tone="neutral" />
          </dl>

          <PhaseTextRow phases={orderedPhases} delay={baseDelay + 120} />

          <p className="mt-auto line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
            {project.lastScanAt} — {project.lastActivity}
          </p>
        </div>

        <aside className="flex min-h-[148px] flex-col items-stretch justify-between gap-3 self-stretch rounded-xl bg-[var(--surface-soft)]/70 px-3 py-3.5">
          <ScoreRing
            score={hasScore ? project.overallScore : 0}
            color={scoreColor}
            delay={baseDelay + 160}
            gradientId={`${chartId}-ring`}
          />
          <PhaseMiniChart phases={orderedPhases} delay={baseDelay + 220} chartId={chartId} />
          <IssueBreakdownStack
            breakdown={project.issueBreakdown}
            total={densityTotal}
            delay={baseDelay + 280}
          />
        </aside>
      </div>

      <Link
        href={`/project-detail?id=${project.id}`}
        className="btn-transition flex w-full items-center justify-center gap-1.5 py-3 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary-soft)]/60"
      >
        Detayları gör
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </article>
  );
}

function MetricRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "danger" | "primary" | "neutral";
}) {
  return (
    <>
      <dt className="text-xs text-[var(--text-secondary)]">{label}</dt>
      <dd
        className={cn(
          "text-base font-semibold tabular-nums",
          tone === "danger" && "text-[var(--danger)]",
          tone === "primary" && "text-[var(--primary)]",
          tone === "neutral" && "text-[var(--text-primary)]",
        )}
      >
        {value}
      </dd>
    </>
  );
}

function PhaseTextRow({
  phases,
  delay,
}: {
  phases: { id: AuditPhaseId; status: ProjectPhaseStatus }[];
  delay: number;
}) {
  return (
    <ul
      className="stat-chart-label flex flex-wrap gap-x-2.5 gap-y-1 text-xs text-[var(--text-secondary)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {phases.map((phase) => (
        <li key={phase.id} className="inline-flex items-center gap-1">
          {phase.status === "completed" && (
            <Check className="h-3.5 w-3.5 text-[var(--success)]" strokeWidth={2.5} />
          )}
          {phase.status === "locked" && <Lock className="h-3.5 w-3.5 opacity-50" strokeWidth={2} />}
          <span
            className={cn(
              phase.status === "in_progress" && "font-medium text-[var(--primary)]",
              phase.status === "completed" && "text-[var(--text-primary)]",
            )}
          >
            {AUDIT_PHASE_SHORT_LABELS[phase.id]}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ScoreRing({
  score,
  color,
  delay,
  gradientId,
}: {
  score: number;
  color: string;
  delay: number;
  gradientId: string;
}) {
  const size = 72;
  const stroke = 4.5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(score, 100) / 100);

  return (
    <div
      className="stat-chart-reveal relative mx-auto shrink-0"
      style={{ width: size, height: size, animationDelay: `${delay}ms` }}
    >
      <svg width={size} height={size} className="-rotate-90 drop-shadow-sm" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8ecf2" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stat-ring-progress"
          style={
            {
              "--ring-circ": circ,
              "--ring-end": score > 0 ? offset : circ,
              animationDelay: `${delay + 80}ms`,
            } as React.CSSProperties
          }
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-bold tabular-nums text-[var(--text-primary)]">
        {score > 0 ? score : "—"}
      </span>
    </div>
  );
}

function PhaseMiniChart({
  phases,
  delay,
  chartId,
}: {
  phases: { id: AuditPhaseId; status: ProjectPhaseStatus; progress: number }[];
  delay: number;
  chartId: string;
}) {
  const h = 56;
  const barW = 22;
  const gap = 8;
  const w = phases.length * barW + (phases.length - 1) * gap;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="stat-chart-reveal mx-auto h-14 w-full min-w-0"
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden
    >
      <defs>
        {phases.map((phase, i) => (
          <linearGradient
            key={phase.id}
            id={`${chartId}-bar-${i}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={PHASE_BAR_COLORS[i].top} />
            <stop offset="100%" stopColor={PHASE_BAR_COLORS[i].bottom} />
          </linearGradient>
        ))}
      </defs>
      <line x1={0} y1={h - 8} x2={w} y2={h - 8} stroke="#e8ecf2" strokeWidth="1" />
      {phases.map((phase, i) => {
        const x = i * (barW + gap);
        const barH = Math.max((phase.progress / 100) * (h - 16), phase.progress > 0 ? 6 : 3);
        const y = h - 8 - barH;
        const originX = x + barW / 2;
        const opacity =
          phase.status === "locked" ? 0.4 : phase.status === "not_started" ? 0.28 : 1;
        return (
          <g
            key={phase.id}
            className="stat-vbar"
            style={{
              transformOrigin: `${originX}px ${h - 8}px`,
              animationDelay: `${delay + 100 + i * 60}ms`,
              opacity,
            }}
          >
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={4}
              fill={`url(#${chartId}-bar-${i})`}
            />
          </g>
        );
      })}
    </svg>
  );
}

function IssueBreakdownStack({
  breakdown,
  total,
  delay,
}: {
  breakdown: [number, number, number, number];
  total: number;
  delay: number;
}) {
  const safeTotal = total || 1;

  return (
    <div
      className="stat-chart-reveal w-full space-y-1.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#eef0f4]">
        {breakdown.map((v, i) => (
          <div
            key={ISSUE_LABELS[i]}
            className="stat-stack-segment h-full first:rounded-l-full last:rounded-r-full"
            style={
              {
                "--seg-width": total > 0 ? `${(v / safeTotal) * 100}%` : "0%",
                backgroundColor: ISSUE_COLORS[i],
                animationDelay: `${delay + 120 + i * 65}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div
        className="stat-chart-label grid grid-cols-4 gap-0.5"
        style={{ animationDelay: `${delay + 420}ms` }}
      >
        {ISSUE_LABELS.map((label, i) => (
          <div key={label} className="text-center">
            <p
              className={cn(
                "text-[11px] font-semibold tabular-nums",
                i === 0 && "text-[var(--danger)]",
                i === 1 && "text-[#ea580c]",
                i === 2 && "text-[var(--warning)]",
                i === 3 && "text-[var(--text-secondary)]",
              )}
            >
              {breakdown[i]}
            </p>
            <p className="truncate text-[9px] text-[var(--text-secondary)]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendInline({ trend }: { trend: number }) {
  if (trend === 0) return null;
  const positive = trend > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums",
        positive ? "text-[var(--success)]" : "text-[var(--danger)]",
      )}
    >
      {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
      {positive ? "+" : ""}
      {trend}
    </span>
  );
}
