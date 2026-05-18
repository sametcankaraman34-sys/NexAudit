"use client";

import {
  Archive,
  Check,
  Loader2,
  Lock,
  Pencil,
  Radar,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProjectDeleteDialog } from "@/components/projects/project-delete-dialog";
import { ProjectEditDialog } from "@/components/projects/project-edit-dialog";
import { AUDIT_PHASE_ORDER, AUDIT_PHASE_SHORT_LABELS } from "@/constants/audit";
import { useProfile } from "@/stores/profile-store";
import { useActiveProject } from "@/lib/project-context";
import {
  getProjectOperationalStatus,
  getScanTargetPhaseId,
  type ProjectOperationalStatus,
} from "@/lib/project-card-status";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
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

const operationalToneClass: Record<ProjectOperationalStatus["tone"], string> = {
  success: "bg-[var(--success-soft)] text-[var(--success)]",
  primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  neutral: "bg-[var(--surface-soft)] text-[var(--text-secondary)]",
  muted: "bg-[var(--surface-soft)] text-[var(--text-secondary)]",
};

interface ProjectWorkspaceCardProps {
  project: Project;
  animationIndex?: number;
}

export function ProjectWorkspaceCard({
  project,
  animationIndex = 0,
}: ProjectWorkspaceCardProps) {
  const router = useRouter();
  const { activeProjectId, setActiveProjectId } = useActiveProject();
  const issues = useAppStore((s) => s.issuesByProject[project.id] ?? []);
  const workflow = useAppStore((s) => s.workflowByProject[project.id]);
  const activities = useAppStore((s) => s.activityByProject[project.id] ?? []);
  const updateProject = useAppStore((s) => s.updateProject);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const archiveProject = useAppStore((s) => s.archiveProject);
  const startPhaseScan = useAppStore((s) => s.startPhaseScan);
  const asyncLoading = useAppStore((s) => s.async.isLoading);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionBusy, setActionBusy] = useState<string | null>(null);

  const isActiveWorkspace = activeProjectId === project.id;
  const baseDelay = animationIndex * 70;
  const isArchived = project.status === "archived";

  let activeScan: {
    phaseId: AuditPhaseId;
    progress: number;
    step: string | null;
  } | null = null;
  if (workflow) {
    for (const phaseId of AUDIT_PHASE_ORDER) {
      const scan = workflow[phaseId]?.scan;
      if (scan?.status === "scanning" || scan?.status === "analyzing") {
        activeScan = { phaseId, progress: scan.progress, step: scan.currentStep };
        break;
      }
    }
  }

  const isScanning = Boolean(activeScan);
  const operational = getProjectOperationalStatus(project, { isScanning });

  const openIssues = issues.filter(
    (i) => i.status !== "resolved" && i.status !== "ignored",
  ).length;
  const resolvedIssues = issues.filter((i) => i.status === "resolved").length;
  const profileName = useProfile().name;
  const lastActor = project.lastActor ?? profileName;
  const latestActivity = activities[0]?.message ?? project.lastActivity;

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

  const activateProject = () => {
    setActiveProjectId(project.id);
    router.push("/");
  };

  const handleScan = async () => {
    if (isArchived || isScanning) return;
    setActionBusy("scan");
    setActiveProjectId(project.id);
    const phaseId = getScanTargetPhaseId(project);
    try {
      await startPhaseScan(project.id, phaseId);
    } finally {
      setActionBusy(null);
    }
  };

  const handleArchive = async () => {
    if (isArchived) return;
    setActionBusy("archive");
    try {
      await archiveProject(project.id);
    } finally {
      setActionBusy(null);
    }
  };

  const handleDelete = async () => {
    setActionBusy("delete");
    try {
      await deleteProject(project.id);
      setDeleteOpen(false);
    } finally {
      setActionBusy(null);
    }
  };

  const handleSaveEdit = async (patch: Partial<Project>) => {
    setActionBusy("edit");
    try {
      await updateProject(project.id, patch);
      setEditOpen(false);
    } finally {
      setActionBusy(null);
    }
  };

  return (
    <>
      <article
        className={cn(
          "card-interactive group page-enter relative flex h-full min-h-[180px] flex-col overflow-hidden rounded-xl border bg-[var(--surface)] shadow-[var(--shadow-card)] transition-[border-color,box-shadow]",
          isActiveWorkspace
            ? "border-[var(--primary)]/40 shadow-[0_0_0_1px_rgba(99,102,241,0.12),var(--shadow-card)]"
            : "border-[var(--border)]",
        )}
        style={{ animationDelay: `${baseDelay}ms` }}
      >
        {isScanning && activeScan && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[var(--surface)]/92 backdrop-blur-[2px]">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" strokeWidth={1.75} />
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {AUDIT_PHASE_SHORT_LABELS[activeScan.phaseId]} taranıyor…
            </p>
            <div className="h-1.5 w-48 max-w-[70%] overflow-hidden rounded-full bg-[var(--surface-soft)]">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-[width] duration-300"
                style={{ width: `${activeScan.progress}%` }}
              />
            </div>
            {activeScan.step && (
              <p className="max-w-[85%] truncate text-xs text-[var(--text-secondary)]">
                {activeScan.step}
              </p>
            )}
          </div>
        )}

        <div className="grid flex-1 grid-cols-1 gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(124px,34%)]">
          <div className="flex min-w-0 flex-col gap-3">
            <header>
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: riskAccent[project.riskLevel] }}
                />
                <OperationalBadge status={operational} />
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
                <span>%{completion} aşama ilerlemesi</span>
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3">
              <MetricRow label="Açık issue" value={String(openIssues)} tone="danger" />
              <MetricRow label="Çözülen" value={String(resolvedIssues)} tone="success" />
              <MetricRow
                label="Brief uyumu"
                value={project.briefScore !== null ? String(project.briefScore) : "—"}
                tone="primary"
              />
              <MetricRow label="Son tarama" value={project.lastScanAt} tone="neutral" small />
              <MetricRow label="Son işlem" value={lastActor} tone="neutral" small />
              <MetricRow label="Toplam sorun" value={String(project.totalIssues)} tone="neutral" />
            </dl>

            <PhaseTextRow phases={orderedPhases} delay={baseDelay + 120} />

            <p className="mt-auto line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
              {latestActivity}
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

        <div className="border-t border-[var(--border)] bg-[var(--surface-soft)]/30">
          <button
            type="button"
            onClick={activateProject}
            disabled={isActiveWorkspace}
            className={cn(
              "btn-transition flex w-full items-center justify-center gap-1.5 border-b border-[var(--border)] py-3 text-sm font-medium",
              isActiveWorkspace
                ? "cursor-default bg-[var(--primary-soft)]/50 text-[var(--primary)]"
                : "text-[var(--text-primary)] hover:bg-[var(--surface-soft)]",
            )}
          >
            {isActiveWorkspace ? (
              <>
                <Check className="h-4 w-4" strokeWidth={2} />
                Aktif proje
              </>
            ) : (
              "Projeye geç"
            )}
          </button>
          <div className="grid grid-cols-2 gap-px bg-[var(--border)] sm:grid-cols-4">
            <OpButton
              icon={Radar}
              label="Tara"
              onClick={handleScan}
              disabled={isArchived || isScanning || actionBusy === "scan"}
              loading={actionBusy === "scan" || isScanning}
              accent="primary"
            />
            <OpButton
              icon={Pencil}
              label="Düzenle"
              onClick={() => setEditOpen(true)}
              disabled={Boolean(actionBusy)}
            />
            {!isArchived && (
              <OpButton
                icon={Archive}
                label="Arşivle"
                onClick={handleArchive}
                disabled={Boolean(actionBusy)}
                loading={actionBusy === "archive"}
              />
            )}
            {isArchived && <OpButton icon={Archive} label="Arşivde" disabled muted />}
            <OpButton
              icon={Trash2}
              label="Sil"
              onClick={() => setDeleteOpen(true)}
              disabled={Boolean(actionBusy) || asyncLoading}
              danger
            />
          </div>
        </div>
      </article>

      <ProjectEditDialog
        open={editOpen}
        project={project}
        saving={actionBusy === "edit"}
        onSave={handleSaveEdit}
        onCancel={() => setEditOpen(false)}
      />
      <ProjectDeleteDialog
        open={deleteOpen}
        projectName={project.name}
        confirming={actionBusy === "delete"}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}

function OperationalBadge({ status }: { status: ProjectOperationalStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[13px] font-medium",
        operationalToneClass[status.tone],
      )}
    >
      {status.label}
    </span>
  );
}

function OpButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  loading,
  danger,
  accent,
  muted,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  danger?: boolean;
  accent?: "primary";
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "btn-transition flex min-h-[44px] flex-col items-center justify-center gap-0.5 bg-[var(--surface)] px-2 py-2.5 text-xs font-medium sm:text-sm",
        muted && "text-[var(--text-secondary)]",
        !muted && !danger && accent !== "primary" && "text-[var(--text-primary)] hover:bg-[var(--surface-soft)]",
        accent === "primary" && "text-[var(--primary)] hover:bg-[var(--primary-soft)]/50",
        danger && "text-[var(--danger)] hover:bg-[var(--danger-soft)]",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
      ) : (
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      )}
      <span>{label}</span>
    </button>
  );
}

function MetricRow({
  label,
  value,
  tone,
  small,
}: {
  label: string;
  value: string;
  tone: "danger" | "primary" | "neutral" | "success";
  small?: boolean;
}) {
  return (
    <>
      <dt className="text-xs text-[var(--text-secondary)]">{label}</dt>
      <dd
        className={cn(
          "font-semibold tabular-nums",
          small ? "truncate text-xs" : "text-base",
          tone === "danger" && "text-[var(--danger)]",
          tone === "primary" && "text-[var(--primary)]",
          tone === "success" && "text-[var(--success)]",
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
                "text-sm font-semibold tabular-nums",
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
