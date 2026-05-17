import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function NewProjectView() {
  return (
    <>
      <PageHeader
        title="Yeni Proje"
        description="WordPress siteniz için yeni bir denetim projesi oluşturun."
      />

      <form className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-[var(--text-primary)]">
            Proje Adı
          </label>
          <Input
            id="name"
            placeholder="Örn: Ajans Demo Projesi"
            className="h-11 rounded-xl border-[var(--border)]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="domain" className="text-sm font-medium text-[var(--text-primary)]">
            Domain
          </label>
          <Input
            id="domain"
            placeholder="ornek.com"
            className="h-11 rounded-xl border-[var(--border)]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-primary)]">WordPress Sürümü</label>
          <Select>
            <SelectTrigger className="h-11 w-full rounded-xl border-[var(--border)]">
              <SelectValue placeholder="Sürüm seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6.5">6.5+</SelectItem>
              <SelectItem value="6.4">6.4</SelectItem>
              <SelectItem value="6.3">6.3 ve altı</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium text-[var(--text-primary)]">
            Notlar
          </label>
          <Textarea
            id="notes"
            placeholder="Proje hakkında ek bilgiler..."
            className="min-h-[120px] rounded-xl border-[var(--border)]"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            className="btn-transition flex-1 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
          >
            Projeyi Oluştur
          </Button>
          <Link
            href="/projects"
            className="btn-transition inline-flex flex-1 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
          >
            İptal
          </Link>
        </div>
      </form>
    </>
  );
}
