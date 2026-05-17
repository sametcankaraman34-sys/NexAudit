import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/tables/data-table";
import { mockReportHistory } from "@/data/mock-notifications";
import type { ReportHistoryItem } from "@/types";

export function ReportHistoryView() {
  const columns = [
    {
      key: "project",
      header: "Proje",
      render: (row: ReportHistoryItem) => (
        <span className="text-sm font-medium text-[var(--text-primary)]">{row.projectName}</span>
      ),
    },
    {
      key: "phase",
      header: "Aşama",
      render: (row: ReportHistoryItem) => (
        <span className="text-sm text-[var(--text-secondary)]">{row.phase}</span>
      ),
    },
    {
      key: "score",
      header: "Skor",
      render: (row: ReportHistoryItem) => (
        <span className="text-sm font-medium text-[var(--text-primary)]">{row.score}/100</span>
      ),
    },
    {
      key: "date",
      header: "Tarih",
      className: "text-right",
      render: (row: ReportHistoryItem) => (
        <span className="text-sm text-[var(--text-secondary)]">{row.date}</span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Rapor Geçmişi"
        description="Tamamlanan denetim raporlarının geçmişi."
      />
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
        <DataTable
          columns={columns}
          data={mockReportHistory}
          getRowKey={(r) => r.id}
          emptyMessage="Henüz rapor geçmişi yok."
        />
      </section>
    </>
  );
}
