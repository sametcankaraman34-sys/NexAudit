"use client";

import {
  CheckCircle2,
  FileCheck,
  Loader2,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { ActivityTimeline } from "@/components/workflow/activity-timeline";
import { CompletePhaseDialog } from "@/components/workflow/complete-phase-dialog";
import { ScanStateBadge } from "@/components/workflow/scan-state-badge";
import { ProgressBar } from "@/components/feedback/progress-bar";
import { PHASE_SCAN_LABELS, ROLE_LABELS } from "@/constants/workflow";
import { usePhaseWorkflow } from "@/hooks/use-phase-workflow";
import { cn } from "@/lib/utils";
import type { AuditPhaseId } from "@/types";

interface AuditWorkflowPanelProps {
  projectId: string;
  phaseId: AuditPhaseId;
  className?: string;
}

export function AuditWorkflowPanel({ projectId, phaseId, className }: AuditWorkflowPanelProps) {
  const wf = usePhaseWorkflow(projectId, phaseId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scanKey, setScanKey] = useState(0);

  const phaseLocked = wf.phaseState?.status === "locked";
  const phaseDone = wf.phaseState?.status === "completed";
  const assignee = wf.record.assignedRoleId
    ? ROLE_LABELS[wf.record.assignedRoleId]
    : ROLE_LABELS[phaseId === "website" ? "web_design" : phaseId];

  const handleScan = async () => {
    await wf.startPhaseScan();
    setScanKey((k) => k + 1);
  };

  const handleComplete = async (force = false) => {
    setDialogOpen(false);
    await wf.completePhase(force);
  };

  const hasOpenWarnings = wf.openCritical > 0 || wf.briefGaps > 0;

  const tryComplete = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <section
        className={cn(
          "audit-section workflow-panel rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6",
          wf.isScanning && "workflow-panel-scanning",
          className,
        )}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-medium text-[var(--primary)]">
                <ScanSearch className="h-3.5 w-3.5" strokeWidth={1.75} />
                Operasyon merkezi
              </span>
              <ScanStateBadge status={wf.record.scan.status} pulse={wf.isScanning} />
              {wf.record.humanReviewed && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--success)]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Sonuçlar incelendi
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tarama & onay akışı</h2>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              Önce tara, sonuçları incele, ardından onaylayarak sonraki aşamaya geç. Sorumlu:{" "}
              <span className="font-medium text-[var(--text-primary)]">{assignee}</span>
            </p>
          </div>
        </div>

        {wf.isScanning && (
          <div className="workflow-scan-progress mt-4 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary-soft)]/30 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-[var(--primary)]">
                {wf.record.scan.currentStep ?? "Analiz ediliyor…"}
              </span>
              <span className="tabular-nums text-[var(--text-secondary)]">%{wf.record.scan.progress}</span>
            </div>
            <ProgressBar value={wf.record.scan.progress} barClassName="bg-[var(--primary)]" animated />
            <ul className="mt-3 space-y-1.5">
              {["Görseller", "Mobil", "Performans", "CTA"].map((label, i) => (
                <li
                  key={label}
                  className={cn(
                    "workflow-scan-step flex items-center gap-2 text-xs text-[var(--text-secondary)]",
                    wf.record.scan.progress > i * 22 && "text-[var(--text-primary)]",
                  )}
                >
                  <Loader2
                    className={cn(
                      "h-3 w-3 shrink-0",
                      wf.record.scan.progress > i * 22 ? "animate-spin text-[var(--primary)]" : "opacity-30",
                    )}
                  />
                  {label} kontrol ediliyor…
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            disabled={phaseLocked || phaseDone || wf.isScanning || wf.isLoading}
            onClick={() => void handleScan()}
            className={cn(
              "workflow-scan-cta phase-cta-primary inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white sm:min-w-[200px] sm:flex-none",
              (phaseLocked || phaseDone || wf.isScanning) && "cursor-not-allowed opacity-50",
            )}
          >
            {wf.isScanning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ScanSearch className="h-4 w-4" strokeWidth={2} />
            )}
            {PHASE_SCAN_LABELS[phaseId]}
          </button>

          <button
            type="button"
            disabled={wf.isLoading || phaseDone}
            onClick={tryComplete}
            title={
              !wf.canComplete && !phaseDone
                ? "Önce taramayı bitir, sonuçları incele — ardından onaylayabilirsin"
                : undefined
            }
            className={cn(
              "btn-transition inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold sm:min-w-[200px] sm:flex-none",
              wf.canComplete && !phaseDone
                ? "phase-cta-success border-[var(--success)] bg-[var(--success)] text-white"
                : "cursor-not-allowed border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-secondary)]",
            )}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} />
            {phaseDone
              ? "Aşama tamamlandı"
              : wf.canComplete
                ? "Aşamayı tamamla"
                : "Önce taramayı bitir"}
          </button>

          <button
            type="button"
            disabled={phaseLocked || wf.isLoading}
            onClick={() => void wf.reopenPhase()}
            className="btn-transition inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
          >
            <RotateCcw className="h-4 w-4" />
            Aşamayı yeniden aç
          </button>

          <button
            type="button"
            disabled={phaseLocked || wf.isLoading}
            onClick={() => void wf.savePhaseDraft()}
            className="btn-transition inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <FileCheck className="h-4 w-4" />
            Taslak kaydet
          </button>
        </div>

        {!wf.record.humanReviewed && wf.record.scan.status === "completed" && !phaseDone && (
          <button
            type="button"
            onClick={wf.markPhaseReviewed}
            className="mt-3 text-sm font-medium text-[var(--primary)] hover:underline"
          >
            Sonuçları inceledim, onaya hazır
          </button>
        )}

        {wf.record.scan.lastScanAt && (
          <p className="mt-3 text-xs text-[var(--text-secondary)]">
            Son tarama: {wf.record.scan.lastScanAt}
            {wf.record.scan.scanCount > 0 && ` · ${wf.record.scan.scanCount} tur`}
          </p>
        )}

        <div key={scanKey} className="mt-6 grid gap-4 lg:grid-cols-[1fr_280px]">
          <ActivityTimeline events={wf.activities} maxItems={6} />
          <aside className="rounded-xl border border-[var(--border)]/80 bg-[var(--surface-soft)]/60 p-3 text-xs text-[var(--text-secondary)]">
            <p className="font-medium text-[var(--text-primary)]">Akış</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Tara</li>
              <li>Sonuçları incele</li>
              <li>Onaya hazır işaretle</li>
              <li>Aşamayı tamamla</li>
            </ol>
          </aside>
        </div>
      </section>

      <CompletePhaseDialog
        open={dialogOpen}
        blocked={!wf.canComplete && !phaseDone}
        criticalCount={wf.openCritical}
        briefGaps={wf.briefGaps}
        onCancel={() => setDialogOpen(false)}
        onConfirm={() => void handleComplete(hasOpenWarnings)}
      />
    </>
  );
}
