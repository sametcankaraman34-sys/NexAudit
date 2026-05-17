import Link from "next/link";
import { ProjectWorkspaceCard } from "@/components/cards/project-workspace-card";
import { PageHeader } from "@/components/layout/page-header";
import { mockProjects, projectsSummary } from "@/data/mock-projects";

export function ProjectsView() {
  return (
    <>
      <PageHeader
        title="Projelerim"
        description="Canlı proje istihbarat merkezi — 2 sütunlu operasyon paneli."
      />

      <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ul className="flex flex-wrap gap-2">
          <SummaryPill label="Toplam proje" value={projectsSummary.total} />
          <SummaryPill label="Aktif" value={projectsSummary.active} accent="primary" />
          <SummaryPill label="Denetimde" value={projectsSummary.inProgress} accent="warning" />
          <SummaryPill label="Yüksek risk" value={projectsSummary.highRisk} accent="danger" />
        </ul>
        <Link
          href="/new-project"
          className="btn-transition inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
        >
          + Yeni Proje
        </Link>
      </section>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 lg:gap-4">
        {mockProjects.map((project, index) => (
          <li key={project.id} className="list-none">
            <ProjectWorkspaceCard project={project} animationIndex={index} />
          </li>
        ))}
      </ul>
    </>
  );
}

function SummaryPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "primary" | "warning" | "danger";
}) {
  const accentClass =
    accent === "primary"
      ? "border-[var(--primary)]/20 bg-[var(--primary-soft)] text-[var(--primary)]"
      : accent === "warning"
        ? "border-[var(--warning)]/25 bg-[var(--warning-soft)] text-[var(--warning)]"
        : accent === "danger"
          ? "border-[var(--danger)]/25 bg-[var(--danger-soft)] text-[var(--danger)]"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]";

  return (
    <li
      className={`list-none rounded-full border px-3 py-1.5 text-xs ${accentClass}`}
    >
      <span className="font-medium">{label}</span>
      <span className="ml-1.5 font-semibold tabular-nums">{value}</span>
    </li>
  );
}
