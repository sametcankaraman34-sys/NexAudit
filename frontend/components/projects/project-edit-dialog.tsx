"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectEditDialogProps {
  open: boolean;
  project: Project;
  saving?: boolean;
  onSave: (patch: Partial<Project>) => void;
  onCancel: () => void;
}

export function ProjectEditDialog({
  open,
  project,
  saving = false,
  onSave,
  onCancel,
}: ProjectEditDialogProps) {
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

  const formKey = `${project.id}-${project.updatedAt}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-project-title"
    >
      <button
        type="button"
        className="outcome-modal-backdrop-enter fixed inset-0 bg-black/30 backdrop-blur-[3px]"
        onClick={onCancel}
        aria-label="Kapat"
      />
      <article
        className={cn(
          "outcome-modal-card-enter relative z-[1] w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_64px_rgba(15,23,42,0.18)]",
          "max-h-[min(90vh,calc(100dvh-2rem))] overflow-y-auto overscroll-contain",
        )}
      >
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <Pencil className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h2 id="edit-project-title" className="text-lg font-semibold text-[var(--text-primary)]">
          Projeyi düzenle
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{project.name}</p>

        <ProjectEditForm
          key={formKey}
          project={project}
          saving={saving}
          onSave={onSave}
          onCancel={onCancel}
        />
      </article>
    </div>,
    document.body,
  );
}

function ProjectEditForm({
  project,
  saving,
  onSave,
  onCancel,
}: {
  project: Project;
  saving: boolean;
  onSave: (patch: Partial<Project>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(project.name);
  const [domain, setDomain] = useState(project.domain);
  const [customerName, setCustomerName] = useState(project.customerName);
  const [status, setStatus] = useState(project.status);
  const [notes, setNotes] = useState(project.notes ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || project.name,
      domain: domain.trim() || project.domain,
      customerName: customerName.trim() || project.customerName,
      status,
      notes: notes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Field label="Proje adı">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-xl border-[var(--border)] bg-[var(--surface)]"
            />
          </Field>
          <Field label="Domain">
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="h-10 rounded-xl border-[var(--border)] bg-[var(--surface)]"
            />
          </Field>
          <Field label="Müşteri adı">
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="h-10 rounded-xl border-[var(--border)] bg-[var(--surface)]"
            />
          </Field>
          <Field label="Durum">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Project["status"])}
              className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text-primary)] outline-none focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20"
            >
              <option value="active">Aktif</option>
              <option value="draft">Beklemede (taslak)</option>
              <option value="archived">Arşiv</option>
            </select>
          </Field>
          <Field label="Notlar">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Operasyon notları, müşteri beklentileri…"
              className="min-h-[88px] rounded-xl border-[var(--border)] bg-[var(--surface)]"
            />
          </Field>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/60 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
              Brief uyumu
            </p>
            <p className="mt-1 text-sm text-[var(--text-primary)]">
              Skor:{" "}
              <span className="font-semibold tabular-nums">
                {project.briefScore !== null ? `${project.briefScore}/100` : "—"}
              </span>
            </p>
            <Link
              href="/brief"
              className="btn-transition mt-2 inline-block text-sm font-medium text-[var(--primary)] hover:underline"
            >
              Brief maddelerini düzenle →
            </Link>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="btn-transition rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={saving}
              className={cn(
                "btn-transition rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-hover)]",
                saving && "opacity-70",
              )}
            >
              Kaydet
            </button>
          </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      {children}
    </label>
  );
}
