import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Lock,
  Megaphone,
  Monitor,
  Search,
  Sparkles,
} from "lucide-react";
import { AUDIT_PHASE_LABELS, AUDIT_PHASE_ORDER } from "@/constants/audit";
import { cn } from "@/lib/utils";
import type { AuditPhaseId } from "@/types";

const phaseIcons: Record<AuditPhaseId, typeof Monitor> = {
  website: Monitor,
  seo: Search,
  ads: Megaphone,
};

const pipelineSteps = [
  { label: "Proje Oluştur", active: true },
  { label: "Denetimi Başlat", active: false },
  { label: "İçgörü Üret", active: false },
  { label: "SEO Aşamasını Aç", active: false },
  { label: "Dönüşümü Optimize Et", active: false },
];

export function AuditOnboardingPanel() {
  return (
    <aside className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-medium text-[var(--primary)]">
          <Sparkles className="h-3.5 w-3.5" />
          Denetim hattı
        </span>
        <h2 className="mt-3 text-lg font-semibold leading-snug text-[var(--text-primary)]">
          Profesyonel web denetimi burada başlar
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          Projenizi oluşturduğunuzda NexAudit, sitenizi aşamalı bir kalite kontrol sürecine
          alır. WordPress sürümü ve altyapı otomatik tespit edilir.
        </p>
      </div>

      <div className="mb-6 space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
          Denetim yolculuğu
        </p>
        <ol className="relative space-y-0">
          {AUDIT_PHASE_ORDER.map((id, index) => {
            const Icon = phaseIcons[id];
            const isFirst = index === 0;
            const isLast = index === AUDIT_PHASE_ORDER.length - 1;
            return (
              <li key={id} className="relative flex gap-3 pb-4 last:pb-0">
                {!isLast && (
                  <span
                    className="absolute left-[15px] top-8 h-[calc(100%-12px)] w-px bg-[var(--border)]"
                    aria-hidden
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                    isFirst
                      ? "border-[var(--primary)]/25 bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-secondary)]",
                  )}
                >
                  {isFirst ? (
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  ) : (
                    <Lock className="h-3.5 w-3.5" strokeWidth={1.75} />
                  )}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isFirst ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]",
                    )}
                  >
                    {AUDIT_PHASE_LABELS[id]}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {isFirst ? "İlk aşama — oluşturma sonrası başlar" : "Önceki aşama tamamlanınca açılır"}
                  </p>
                </div>
              </li>
            );
          })}
          <li className="relative flex gap-3 pt-1">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-secondary)]">
              <ClipboardCheck className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-[var(--text-secondary)]">Brief Uygunluğu</p>
              <p className="text-xs text-[var(--text-secondary)]">Müşteri brief&apos;i ile karşılaştırma</p>
            </div>
          </li>
        </ol>
      </div>

      <div className="mt-auto rounded-xl border border-[var(--border)]/80 bg-[var(--surface-soft)]/80 p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
          Oluşturma sonrası
        </p>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {pipelineSteps.map((step, i) => (
            <span key={step.label} className="inline-flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1",
                  step.active
                    ? "bg-[var(--primary-soft)] font-medium text-[var(--primary)]"
                    : "text-[var(--text-secondary)]",
                )}
              >
                {step.active && <CheckCircle2 className="h-3 w-3" />}
                {step.label}
              </span>
              {i < pipelineSteps.length - 1 && (
                <ArrowRight className="h-3 w-3 text-[var(--border)]" aria-hidden />
              )}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
