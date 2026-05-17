import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_USER } from "@/constants/navigation";

export function SettingsView() {
  return (
    <>
      <PageHeader
        title="Ayarlar"
        description="Hesap ve uygulama tercihlerinizi yönetin."
      />

      <div className="mx-auto max-w-2xl space-y-6">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">Profil</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">Ad</label>
              <Input defaultValue={DEMO_USER.name} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">E-posta</label>
              <Input defaultValue={DEMO_USER.email} className="h-11 rounded-xl" />
            </div>
          </div>
          <Button className="btn-transition mt-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)]">
            Kaydet
          </Button>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-2 text-sm font-semibold text-[var(--text-primary)]">Bildirimler</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            E-posta bildirimleri production sürümünde etkinleştirilecektir.
          </p>
        </section>
      </div>
    </>
  );
}
