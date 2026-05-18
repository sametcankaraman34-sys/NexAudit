"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Radar } from "lucide-react";
import { NexToast } from "@/lib/nex-toast";
import { useAppStore } from "@/stores/app-store";
import { AuditOnboardingPanel } from "@/components/projects/audit-onboarding-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { PremiumSelect } from "@/components/ui/premium-select";
import { PROJECT_SECTORS } from "@/constants/sectors";
import { cn } from "@/lib/utils";

function FormField({
  id,
  label,
  hint,
  children,
  className,
  style,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cn("new-project-field space-y-2", className)} style={style}>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--text-primary)]">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-[var(--text-secondary)]">{hint}</p>}
    </div>
  );
}

const inputClassName = cn(
  "h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
  "transition-[border-color,box-shadow] duration-[var(--transition-fast)]",
  "placeholder:text-[var(--text-secondary)]",
  "hover:border-[var(--primary)]/35 focus-visible:border-[var(--primary)] focus-visible:ring-4 focus-visible:ring-[var(--primary-soft)]",
);

export function NewProjectView() {
  const router = useRouter();
  const createProject = useAppStore((s) => s.createProject);
  const isLoading = useAppStore((s) => s.async.isLoading);
  const [sector, setSector] = useState("ecommerce");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const domain = (form.elements.namedItem("domain") as HTMLInputElement).value.trim();
    const customerName = (form.elements.namedItem("client") as HTMLInputElement).value.trim();

    const project = await createProject({
      name,
      domain: domain.replace(/^https?:\/\//, ""),
      customerName,
      sector,
    });

    NexToast.projectCreated(project.name);
    NexToast.auditStarted("Web Tasarım Denetimi", "/website-audit", project.name);
    router.push("/");
  };

  return (
    <>
      <div className="new-project-header">
        <PageHeader
          title="Yeni Denetim Başlat"
          description="Proje bilgilerini girin ve profesyonel web denetim sürecinizi başlatın."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
        <div className="new-project-panel-left">
          <AuditOnboardingPanel />
        </div>

        <section
          className={cn(
            "new-project-panel-right rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] lg:p-7",
          )}
        >
          <div
            className="new-project-field mb-6 border-b border-[var(--border)]/80 pb-5"
            style={{ animationDelay: "200ms" }}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
              Adım 1 · Proje tanımı
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
              Denetim hedefini belirleyin
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Temel bilgiler yeterli. Brief ve detaylı notlar sonraki aşamalarda eklenecek.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <FormField id="name" label="Proje Adı" hint="Ekip içinde tanınacak isim" style={{ animationDelay: "260ms" }}>
              <Input
                id="name"
                placeholder="Örn: Ajans Demo Projesi"
                className={inputClassName}
                required
              />
            </FormField>

            <FormField
              id="domain"
              label="Domain"
              hint="Denetlenecek web sitesi adresi — WordPress otomatik algılanır"
              style={{ animationDelay: "320ms" }}
            >
              <Input
                id="domain"
                type="text"
                inputMode="url"
                placeholder="ornek.com"
                className={inputClassName}
                required
              />
            </FormField>

            <FormField id="client" label="Müşteri / Firma Adı" style={{ animationDelay: "380ms" }}>
              <Input
                id="client"
                placeholder="Örn: Ajans Demo"
                className={inputClassName}
                required
              />
            </FormField>

            <div className="new-project-field" style={{ animationDelay: "440ms" }}>
              <PremiumSelect
                id="sector"
                label="Sektör"
                hint="Sektöre göre denetim öncelikleri özelleştirilir"
                placeholder="Sektör seçin"
                options={PROJECT_SECTORS}
                value={sector}
                onValueChange={(v) => v && setSector(v)}
              />
            </div>

            <div
              className="new-project-field rounded-xl border border-[var(--primary)]/15 bg-[var(--primary-soft)]/50 px-4 py-3"
              style={{ animationDelay: "500ms" }}
            >
              <p className="flex items-start gap-2 text-xs leading-relaxed text-[var(--text-primary)]">
                <Radar className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" strokeWidth={1.75} />
                Oluşturma sonrası ilk tarama kuyruğa alınır; Web Tasarım denetimi otomatik başlar.
              </p>
            </div>

            <div
              className="new-project-actions flex flex-col gap-3 pt-2 sm:flex-row sm:items-center"
              style={{ animationDelay: "560ms" }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "btn-transition group inline-flex flex-1 items-center justify-center gap-2 rounded-xl",
                  "bg-[var(--primary)] px-5 py-3.5 text-sm font-semibold text-white",
                  "shadow-[0_1px_2px_rgba(99,102,241,0.2),0_8px_24px_rgba(99,102,241,0.28)]",
                  "hover:bg-[var(--primary-hover)] hover:shadow-[0_2px_4px_rgba(99,102,241,0.25),0_12px_28px_rgba(99,102,241,0.32)]",
                )}
              >
                {isLoading ? "Oluşturuluyor…" : "Denetim Sürecini Başlat"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <Link
                href="/projects"
                className="btn-transition inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)] sm:shrink-0"
              >
                Vazgeç
              </Link>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
