"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface CompletePhaseDialogProps {
  open: boolean;
  /** Tarama bitmeden veya aşama kilitliyken onay kapalı */
  blocked?: boolean;
  criticalCount: number;
  briefGaps: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CompletePhaseDialog({
  open,
  blocked = false,
  criticalCount,
  briefGaps,
  onConfirm,
  onCancel,
}: CompletePhaseDialogProps) {
  const [confirming, setConfirming] = useState(false);

  const hasWarnings = !blocked && (criticalCount > 0 || briefGaps > 0);

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

  const content = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="complete-phase-dialog-title"
    >
      <button
        type="button"
        className="outcome-modal-backdrop-enter fixed inset-0 bg-black/30 backdrop-blur-[3px]"
        onClick={onCancel}
        aria-label="Kapat"
      />
      <article
        className={cn(
          "outcome-modal-card-enter relative z-[1] w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_64px_rgba(15,23,42,0.18)]",
          "max-h-[min(90vh,calc(100dvh-2rem))] overflow-y-auto overscroll-contain",
        )}
      >
        <div
          className={cn(
            "mb-4 flex h-11 w-11 items-center justify-center rounded-xl",
            blocked
              ? "bg-[var(--surface-soft)] text-[var(--text-secondary)]"
              : hasWarnings
                ? "bg-[var(--warning-soft)] text-[var(--warning)]"
                : "bg-[var(--success-soft)] text-[var(--success)]",
          )}
        >
          {blocked || hasWarnings ? (
            <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
          ) : (
            <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />
          )}
        </div>
        <h2 id="complete-phase-dialog-title" className="text-lg font-semibold text-[var(--text-primary)]">
          {blocked
            ? "Önce taramayı bitir"
            : hasWarnings
              ? "Açık bulgular var"
              : "Aşamayı tamamlayalım mı?"}
        </h2>
        <div className="mt-2 space-y-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {blocked ? (
            <p>
              Bu aşamayı kapatabilmek için önce taramayı çalıştır, sonuçları incele ve gerekirse{" "}
              <span className="font-medium text-[var(--text-primary)]">Sonuçları inceledim</span> ile onaya hazır
              işaretle.
            </p>
          ) : (
            <>
          {criticalCount > 0 && (
            <p>
              <span className="font-semibold text-[var(--danger)]">{criticalCount} kritik sorun</span> hâlâ
              açık.
            </p>
          )}
          {briefGaps > 0 && (
            <p>
              Brief tarafında <span className="font-semibold text-[var(--text-primary)]">{briefGaps}</span> eksik
              madde var.
            </p>
          )}
          {hasWarnings ? (
            <p className="text-[var(--text-primary)]/90">
              Yine de onaylarsan sonraki aşama açılır — karar sende.
            </p>
          ) : (
            <p>
              Tarama ve inceleme tamamsa bu aşamayı kapatabilir, sonraki tura geçebilirsin.
            </p>
          )}
            </>
          )}
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {blocked ? (
            <button
              type="button"
              onClick={onCancel}
              className="btn-transition rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Anladım
            </button>
          ) : (
            <>
              <button
                type="button"
            onClick={() => {
              setConfirming(false);
              onCancel();
            }}
            className="btn-transition rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
          >
            Vazgeç
          </button>
          <button
            type="button"
            disabled={confirming}
            onClick={() => {
              setConfirming(true);
              onCancel();
              onConfirm();
            }}
                className={cn(
                  "phase-cta-success rounded-xl bg-[var(--success)] px-4 py-2.5 text-sm font-medium text-white",
                  confirming && "opacity-70",
                )}
              >
                {hasWarnings ? "Yine de tamamla" : "Evet, aşamayı tamamla"}
              </button>
            </>
          )}
        </div>
      </article>
    </div>
  );

  return createPortal(content, document.body);
}
