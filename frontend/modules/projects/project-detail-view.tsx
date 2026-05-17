"use client";

import Link from "next/link";
import { AuditPhaseCard } from "@/components/cards/audit-phase-card";
import { PageHeader } from "@/components/layout/page-header";
import { ProgressBar } from "@/components/feedback/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { PROJECT_STATUS_LABELS } from "@/constants/ui-tr";
import { buildProjectWorkspace } from "@/data/project-workspace";
import { useActiveProject } from "@/lib/project-context";
import { useAppStore } from "@/stores/app-store";

interface ProjectDetailViewProps {
  projectId?: string;
}

export function ProjectDetailView({ projectId }: ProjectDetailViewProps) {
  const { setActiveProjectId } = useActiveProject();
  const projects = useAppStore((s) => s.projects);
  const issuesByProject = useAppStore((s) => s.issuesByProject);
  const notificationsByProject = useAppStore((s) => s.notificationsByProject);
  const project = projectId
    ? (projects.find((p) => p.id === projectId) ?? projects[0])
    : projects[0];
  const { dashboard } = buildProjectWorkspace(project, {
    issues: issuesByProject[project.id] ?? [],
    notifications: notificationsByProject[project.id] ?? [],
  });
  const websitePhase = project.phases.find((p) => p.id === "website");
  const progress = websitePhase?.progress ?? 0;
  const statusLabel = PROJECT_STATUS_LABELS[project.status];

  return (
    <>
      <PageHeader title={project.name} description={project.domain} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
          <p className="mb-1 text-sm text-[var(--text-secondary)]">Genel Skor</p>
          <p className="text-3xl font-semibold text-[var(--text-primary)]">
            {project.overallScore}
            <span className="text-lg text-[var(--text-secondary)]">/100</span>
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
          <p className="mb-1 text-sm text-[var(--text-secondary)]">Durum</p>
          <StatusBadge variant="good" label={statusLabel} />
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
          <p className="mb-2 text-sm text-[var(--text-secondary)]">Denetim İlerlemesi</p>
          <ProgressBar value={progress} />
        </div>
      </div>

      <section className="mb-6">
        <h2 className="mb-4 text-ui-section-title font-semibold text-[var(--text-primary)]">
          Denetim yolculuğu
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {dashboard.auditPhases.map((phase) => (
            <AuditPhaseCard
              key={phase.id}
              phase={phase}
              allPhases={dashboard.auditPhases}
            />
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveProjectId(project.id)}
          className="btn-transition rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
        >
          Bu projeyi workspace olarak seç
        </button>
        <Link
          href="/website-audit"
          className="btn-transition rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
        >
          Web Denetimine Git
        </Link>
        <Link
          href="/brief"
          className="btn-transition rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
        >
          Brief Uygunluğu
        </Link>
      </div>
    </>
  );
}
