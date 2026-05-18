"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ProjectWorkspaceCard } from "@/components/cards/project-workspace-card";
import { PageHeader } from "@/components/layout/page-header";
import { useAppStore } from "@/stores/app-store";

export function ProjectsView() {
  const projects = useAppStore((s) => s.projects);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived" | "draft">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (statusFilter === "all" && p.status === "archived") return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q)
      );
    });
  }, [projects, query, statusFilter]);

  const summary = useMemo(
    () => ({
      total: projects.length,
      active: projects.filter((p) => p.status === "active").length,
      inProgress: projects.filter((p) =>
        p.phases.some((ph) => ph.status === "in_progress"),
      ).length,
      highRisk: projects.filter((p) => p.riskLevel === "high").length,
    }),
    [projects],
  );

  return (
    <>
      <PageHeader
        title="Projelerim"
        description="Canlı proje istihbarat merkezi — 2 sütunlu operasyon paneli."
      />

      <section className="mb-4 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Proje ara…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 max-w-md rounded-xl border-[var(--border)] bg-[var(--surface)]"
          />
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "Tümü"],
                ["active", "Aktif"],
                ["draft", "Taslak"],
                ["archived", "Arşiv"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setStatusFilter(id)}
                className={`btn-transition rounded-full border px-3 py-1.5 text-xs font-medium ${
                  statusFilter === id
                    ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                    : "border-[var(--border)] text-[var(--text-secondary)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ul className="flex flex-wrap gap-2">
          <SummaryPill label="Toplam proje" value={summary.total} />
          <SummaryPill label="Aktif" value={summary.active} accent="primary" />
          <SummaryPill label="Denetimde" value={summary.inProgress} accent="warning" />
          <SummaryPill label="Yüksek risk" value={summary.highRisk} accent="danger" />
        </ul>
        <Link
          href="/new-project"
          className="btn-transition inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
        >
          + Yeni Proje
        </Link>
        </div>
      </section>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 lg:gap-4">
        {filtered.map((project, index) => (
          <li key={project.id} className="list-none">
            <ProjectWorkspaceCard project={project} animationIndex={index} />
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-[var(--text-secondary)]">
          Arama kriterine uygun proje bulunamadı.
        </p>
      )}
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
