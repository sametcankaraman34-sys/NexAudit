import { Radio } from "lucide-react";
import type { TrackingCard } from "@/types/audit-intelligence";
import { cn } from "@/lib/utils";

const statusStyles = {
  active: { label: "Aktif", dot: "bg-[var(--success)]" },
  partial: { label: "Kısmi", dot: "bg-[var(--warning)]" },
  missing: { label: "Eksik", dot: "bg-[var(--danger)]" },
};

interface TrackingInfrastructureGridProps {
  cards: TrackingCard[];
  animationDelay?: number;
}

export function TrackingInfrastructureGrid({ cards, animationDelay = 0 }: TrackingInfrastructureGridProps) {
  return (
    <section className="audit-section" style={{ animationDelay: `${animationDelay}ms` }}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">İzleme altyapısı</h2>
        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
          Pixel, tag ve dönüşüm event kapsamı
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => {
          const status = statusStyles[card.status];
          return (
            <li key={card.id}>
              <article
                className={cn(
                  "card-interactive audit-section flex h-full flex-col rounded-xl border border-[var(--border)]",
                  "bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]",
                )}
                style={{ animationDelay: `${animationDelay + 45 + index * 50}ms` }}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                    <Radio className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                    <span className={cn("h-2 w-2 rounded-full", status.dot)} />
                    {status.label}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{card.title}</h3>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-[var(--text-secondary)]">{card.detail}</p>
                <div className="mb-3 mt-3 flex h-8 items-end gap-1">
                  {card.barValues.map((v, i) => (
                    <span
                      key={i}
                      className="audit-vbar-grow flex-1 rounded-sm bg-[var(--primary)]/30"
                      style={
                        {
                          height: `${Math.max(8, v * 0.35)}px`,
                          animationDelay: `${animationDelay + 90 + i * 40}ms`,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap justify-between gap-2 border-t border-[var(--border)]/80 pt-3 text-xs">
                  <span className="text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--text-primary)]">{card.eventsDetected}</span> event
                  </span>
                  <span className="text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--danger)]">{card.issues}</span> sorun
                  </span>
                  <span className="font-medium text-[var(--primary)]">+{card.optimizationGain} puan</span>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
