import { Lock } from "lucide-react";
import Link from "next/link";

interface LockedStateProps {
  title: string;
  description: string;
  unlockHint?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function LockedState({
  title,
  description,
  unlockHint,
  actionHref = "/website-audit",
  actionLabel = "Önceki Aşamaya Git",
}: LockedStateProps) {
  return (
    <div className="locked-fade flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-[var(--shadow-card)]">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-soft)]">
        <Lock className="h-7 w-7 text-[var(--text-secondary)]" strokeWidth={1.5} />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
      <p className="mb-2 max-w-md text-sm text-[var(--text-secondary)]">{description}</p>
      {unlockHint && (
        <p className="mb-8 max-w-md text-xs text-[var(--text-secondary)]">{unlockHint}</p>
      )}
      <Link
        href={actionHref}
        className="phase-cta phase-cta-primary btn-transition inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
