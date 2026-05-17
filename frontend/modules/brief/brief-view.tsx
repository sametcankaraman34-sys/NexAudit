import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  mockBriefCritical,
  mockBriefMet,
  mockBriefMissing,
  mockBriefPartial,
  mockBriefScore,
} from "@/data/mock-brief";
import type { BriefItem } from "@/types";

function BriefSection({
  title,
  items,
  variant,
}: {
  title: string;
  items: BriefItem[];
  variant: "good" | "detected" | "in_progress" | "locked";
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/50 p-3"
          >
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
              {item.detail && (
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.detail}</p>
              )}
            </div>
            <StatusBadge variant={variant} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function BriefView() {
  return (
    <>
      <PageHeader
        title="Brief Uygunluğu"
        description="Brief ile mevcut site durumunun karşılaştırması."
      />

      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <p className="mb-2 text-sm text-[var(--text-secondary)]">Brief Uygunluk Skoru</p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-semibold text-[var(--text-primary)]">
            {mockBriefScore.score}
          </span>
          <span className="mb-1 text-xl text-[var(--text-secondary)]">
            / {mockBriefScore.maxScore}
          </span>
          <StatusBadge variant="good" label={mockBriefScore.label} className="mb-2 ml-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BriefSection title="Karşılanan İstekler" items={mockBriefMet} variant="good" />
        <BriefSection title="Eksik İstekler" items={mockBriefMissing} variant="detected" />
        <BriefSection title="Kısmi Uyumlar" items={mockBriefPartial} variant="in_progress" />
        <BriefSection title="Kritik Uyumsuzluklar" items={mockBriefCritical} variant="locked" />
      </div>
    </>
  );
}
