import { Check, X } from "lucide-react";
import type { KeywordInsight } from "@/types/audit-intelligence";
import { cn } from "@/lib/utils";

const statusStyles = {
  strong: { label: "Güçlü", className: "text-[var(--success)] bg-[var(--success-soft)]/50" },
  weak: { label: "Zayıf", className: "text-[var(--warning)] bg-[var(--warning-soft)]/50" },
  missing: { label: "Eksik", className: "text-[var(--danger)] bg-[var(--danger-soft)]/50" },
};

interface KeywordAnalysisSectionProps {
  keywords: KeywordInsight[];
  animationDelay?: number;
}

export function KeywordAnalysisSection({ keywords, animationDelay = 0 }: KeywordAnalysisSectionProps) {
  return (
    <section className="audit-section" style={{ animationDelay: `${animationDelay}ms` }}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Anahtar kelime analizi</h2>
        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
          Hedef kelimelerin title, meta ve H1 eşleşmesi
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-soft)]/60 text-xs text-[var(--text-secondary)]">
              <th className="px-4 py-3 font-medium">Anahtar kelime</th>
              <th className="px-4 py-3 font-medium">Yoğunluk</th>
              <th className="px-4 py-3 font-medium text-center">Title</th>
              <th className="px-4 py-3 font-medium text-center">Meta</th>
              <th className="px-4 py-3 font-medium text-center">H1</th>
              <th className="px-4 py-3 font-medium">Eşleşme</th>
              <th className="px-4 py-3 font-medium">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {keywords.map((kw, index) => {
              const status = statusStyles[kw.status];
              return (
                <tr
                  key={kw.id}
                  className="audit-row hover:bg-[var(--surface-soft)]/50"
                  style={{ animationDelay: `${animationDelay + 40 + index * 35}ms` }}
                >
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{kw.keyword}</td>
                  <td className="px-4 py-3 tabular-nums text-[var(--text-secondary)]">%{kw.density}</td>
                  <td className="px-4 py-3 text-center">
                    <PlacementIcon present={kw.inTitle} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <PlacementIcon present={kw.inMeta} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <PlacementIcon present={kw.inH1} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                        <span
                          className="audit-bar-grow block h-full rounded-full bg-[var(--primary)]"
                          style={
                            {
                              "--audit-bar-target": `${kw.matchScore}%`,
                              animationDelay: `${animationDelay + 80 + index * 35}ms`,
                            } as React.CSSProperties
                          }
                        />
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-[var(--primary)]">
                        {kw.matchScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PlacementIcon({ present }: { present: boolean }) {
  if (present) {
    return <Check className="mx-auto h-4 w-4 text-[var(--success)]" strokeWidth={2} />;
  }
  return <X className="mx-auto h-4 w-4 text-[var(--danger)]/70" strokeWidth={2} />;
}
