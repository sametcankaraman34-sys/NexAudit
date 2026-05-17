"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import {
  CompletionFeedback,
  NeutralOutcomeIcon,
} from "@/components/feedback/completion-feedback";
import { getOutcomePresentation } from "@/lib/outcome-copy";
import { useOutcomeFeedbackStore } from "@/stores/outcome-feedback-store";
import { cn } from "@/lib/utils";

const AUTO_DISMISS_MS = 3600;

export function ProjectStatusModal() {
  const modal = useOutcomeFeedbackStore((s) => s.modal);
  const exiting = useOutcomeFeedbackStore((s) => s.modalExiting);
  const dismissModal = useOutcomeFeedbackStore((s) => s.dismissModal);

  useEffect(() => {
    if (!modal) return;
    const timer = window.setTimeout(() => dismissModal(), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [modal, dismissModal]);

  if (!modal) return null;

  const copy = getOutcomePresentation(modal);
  const isSuccess = copy.tone === "success";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="outcome-modal-title"
    >
      <button
        type="button"
        className={cn(
          "outcome-modal-backdrop absolute inset-0 bg-black/20 backdrop-blur-[2px]",
          exiting ? "outcome-modal-backdrop-exit" : "outcome-modal-backdrop-enter",
        )}
        onClick={dismissModal}
        aria-label="Kapat"
      />
      <article
        className={cn(
          "outcome-modal-card relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-7 text-center shadow-[0_24px_64px_rgba(15,23,42,0.12)]",
          exiting ? "outcome-modal-card-exit" : "outcome-modal-card-enter",
          isSuccess && "outcome-modal-card-success",
        )}
      >
        <button
          type="button"
          onClick={dismissModal}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-soft)]"
          aria-label="Kapat"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5">{isSuccess ? <CompletionFeedback /> : <NeutralOutcomeIcon />}</div>

        <h2
          id="outcome-modal-title"
          className="text-lg font-semibold tracking-tight text-[var(--text-primary)]"
        >
          {copy.title}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
          {copy.description}
        </p>

        {copy.actionHref && copy.actionLabel && (
          <Link
            href={copy.actionHref}
            onClick={dismissModal}
            className={cn(
              "phase-cta mt-6 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium",
              isSuccess
                ? "phase-cta-success bg-[var(--success)] text-white"
                : "phase-cta-outline border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]",
            )}
          >
            {copy.actionLabel}
          </Link>
        )}
      </article>
    </div>
  );
}
