"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ProjectDeleteDialogProps {
  open: boolean;
  projectName: string;
  confirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ProjectDeleteDialog({
  open,
  projectName,
  confirming = false,
  onConfirm,
  onCancel,
}: ProjectDeleteDialogProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-project-title"
    >
      <button
        type="button"
        className="outcome-modal-backdrop-enter fixed inset-0 bg-black/30 backdrop-blur-[3px]"
        onClick={onCancel}
        aria-label="Kapat"
      />
      <article className="outcome-modal-card-enter relative z-[1] w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--danger-soft)] text-[var(--danger)]">
          <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h2 id="delete-project-title" className="text-lg font-semibold text-[var(--text-primary)]">
          Projeyi sil
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">{projectName}</span> — bu
          projeyi silmek istediğine emin misin? Bu işlem geri alınamaz.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="btn-transition rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
          >
            Vazgeç
          </button>
          <button
            type="button"
            disabled={confirming}
            onClick={onConfirm}
            className={cn(
              "btn-transition rounded-xl bg-[var(--danger)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90",
              confirming && "opacity-70",
            )}
          >
            Projeyi sil
          </button>
        </div>
      </article>
    </div>,
    document.body,
  );
}
