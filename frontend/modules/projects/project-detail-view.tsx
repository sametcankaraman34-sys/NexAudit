import Link from "next/link";
import { AuditPhaseCard } from "@/components/cards/audit-phase-card";
import { PageHeader } from "@/components/layout/page-header";
import { ProgressBar } from "@/components/feedback/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockAuditPhases } from "@/data/mock-audit";
import { mockProjects } from "@/data/mock-projects";

interface ProjectDetailViewProps {
  projectId?: string;
}

export function ProjectDetailView({ projectId }: ProjectDetailViewProps) {
  const project =
    mockProjects.find((p) => p.id === projectId) ?? mockProjects[0];

  return (
    <>
      <PageHeader
        title={project.name}
        description={project.domain}
      />

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
          <StatusBadge variant="good" label="Aktif" />
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
          <p className="mb-2 text-sm text-[var(--text-secondary)]">Denetim İlerlemesi</p>
          <ProgressBar value={33} />
        </div>
      </div>

      <section className="mb-6">
        <h2 className="mb-4 text-ui-section-title font-semibold text-[var(--text-primary)]">Denetim Aşamaları</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {mockAuditPhases.map((phase) => (
            <AuditPhaseCard key={phase.id} phase={phase} />
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/website-audit"
          className="btn-transition rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
        >
          Web Tasarım Sonuçları
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
