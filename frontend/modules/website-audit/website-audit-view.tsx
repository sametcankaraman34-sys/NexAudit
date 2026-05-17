import { PageHeader } from "@/components/layout/page-header";
import { ProgressBar } from "@/components/feedback/progress-bar";
import { IssueList } from "@/components/tables/issue-list";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockWebsiteIssues } from "@/data/mock-issues";

export function WebsiteAuditView() {
  return (
    <>
      <PageHeader
        title="Web Tasarım Denetimi"
        description="UI/UX, erişilebilirlik ve performans analizi sonuçları."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
          <p className="mb-1 text-sm text-[var(--text-secondary)]">Aşama Durumu</p>
          <StatusBadge variant="good" label="Tamamlandı" />
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
          <p className="mb-2 text-sm text-[var(--text-secondary)]">İlerleme</p>
          <ProgressBar value={100} />
          <p className="mt-2 text-xs font-medium text-[var(--text-primary)]">100%</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
          <p className="mb-1 text-sm text-[var(--text-secondary)]">Tespit Edilen Sorun</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">
            {mockWebsiteIssues.length}
          </p>
        </div>
      </div>

      <IssueList issues={mockWebsiteIssues} title="Tüm Sorunlar" />
    </>
  );
}
