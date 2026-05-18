"use client";

import { useActiveProject } from "@/lib/project-context";
import { NexToast } from "@/lib/nex-toast";
import { useAppStore } from "@/stores/app-store";
import type { BriefItem, BriefItemStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_CYCLE: BriefItemStatus[] = ["missing", "partial", "met", "critical"];

function nextStatus(current: BriefItemStatus): BriefItemStatus {
  const idx = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length] ?? "partial";
}

const statusLabel: Record<BriefItemStatus, string> = {
  met: "Uyumlu",
  missing: "Eksik",
  partial: "Kısmi",
  critical: "Kritik",
};

export function BriefItemsEditor() {
  const { activeProjectId } = useActiveProject();
  const items = useAppStore((s) => s.briefItemsByProject[activeProjectId] ?? []);
  const updateBriefItem = useAppStore((s) => s.updateBriefItem);

  if (!items.length) {
    return null;
  }

  const handleCycle = async (item: BriefItem) => {
    const next = nextStatus(item.status);
    await updateBriefItem(activeProjectId, item.id, { status: next });
    NexToast.briefScoreUpdated(
      useAppStore.getState().projects.find((p) => p.id === activeProjectId)?.briefScore ?? 0,
    );
  };

  return (
    <section className="audit-section rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6">
      <h2 className="text-base font-semibold text-[var(--text-primary)]">Brief maddeleri</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Duruma tıklayarak uyumluluk skorunu güncelleyebilirsin.
      </p>
      <ul className="mt-4 divide-y divide-[var(--border)]">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
              {item.detail && (
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.detail}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => void handleCycle(item)}
              className={cn(
                "btn-transition shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold",
                item.status === "met" && "border-[var(--success)]/30 bg-[var(--success-soft)] text-[var(--success)]",
                item.status === "critical" && "border-[var(--danger)]/30 bg-[var(--danger-soft)] text-[var(--danger)]",
                item.status === "partial" && "border-[var(--warning)]/30 bg-[var(--warning-soft)] text-[var(--warning)]",
                item.status === "missing" && "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-secondary)]",
              )}
            >
              {statusLabel[item.status]}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
