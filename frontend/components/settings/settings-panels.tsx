"use client";

import {
  AlertTriangle,
  Bell,
  Bot,
  ClipboardCheck,
  Plug,
  ScanSearch,
  Shield,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { SettingsPanelHeader } from "@/components/settings/settings-nav";
import {
  SettingsRow,
  SettingsSectionCard,
  settingsInputClass,
} from "@/components/settings/settings-primitives";
import { SettingsToggle } from "@/components/settings/settings-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PremiumSelect } from "@/components/ui/premium-select";
import { DEMO_USER } from "@/constants/navigation";
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from "@/constants/ui-tr";
import type { SettingsSectionId } from "@/data/mock-settings";
import { mockIntegrations, mockTeamMembers } from "@/data/mock-settings";
import { NexToast } from "@/lib/nex-toast";
import { useActiveProject } from "@/lib/project-context";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";

function useToggle(initial: boolean) {
  const [value, setValue] = useState(initial);
  return [value, setValue] as const;
}

export function SettingsPanel({ section }: { section: SettingsSectionId }) {
  switch (section) {
    case "profile":
      return <ProfilePanel />;
    case "notifications":
      return <NotificationsPanel />;
    case "audit":
      return <AuditPanel />;
    case "scan":
      return <ScanPanel />;
    case "integrations":
      return <IntegrationsPanel />;
    case "team":
      return <TeamPanel />;
    case "brief":
      return <BriefPanel />;
    case "ai":
      return <AiPanel />;
    case "danger":
      return <DangerPanel />;
    default:
      return null;
  }
}

function ProfilePanel() {
  const profile = useAppStore((s) => s.settings.profile);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [companyName, setCompanyName] = useState(profile.companyName);
  const [website, setWebsite] = useState(profile.website);
  const [timezone, setTimezone] = useState(profile.timezone);
  const [language, setLanguage] = useState(profile.language);

  const save = () => {
    void updateSettings({
      profile: { name, email, companyName, website, timezone, language },
    }).then(() => NexToast.success("Ayarlar kaydedildi", "Profil bilgilerin güncellendi."));
  };

  return (
    <div className="settings-panel space-y-4">
      <SettingsPanelHeader
        icon={User}
        title="Profil & Organizasyon"
        description="Hesap, ekip kimliği ve bölgesel tercihler"
      />
      <SettingsSectionCard title="Profil" description="Kişisel bilgileriniz">
        <div className="mb-5 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-lg font-semibold text-[var(--primary)]">
            {DEMO_USER.initials}
          </span>
          <div>
            <Button
              type="button"
              variant="outline"
              className="btn-transition h-9 rounded-lg border-[var(--border)] text-xs"
              onClick={() => NexToast.success("Yükleme", "Avatar yükleme yakında eklenecek.")}
            >
              Avatar yükle
            </Button>
            <p className="mt-1 text-[13px] text-[var(--text-secondary)]">PNG veya JPG, en fazla 2 MB</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ControlledField label="Ad Soyad" value={name} onChange={setName} />
          <ControlledField label="E-posta" value={email} onChange={setEmail} type="email" />
        </div>
      </SettingsSectionCard>
      <SettingsSectionCard title="Organizasyon" description="Ajans ve ekip bilgileri">
        <div className="grid gap-4 sm:grid-cols-2">
          <ControlledField label="Şirket / Ekip adı" value={companyName} onChange={setCompanyName} />
          <ControlledField label="Web sitesi" value={website} onChange={setWebsite} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <PremiumSelect
            label="Saat dilimi"
            options={[...TIMEZONE_OPTIONS]}
            value={timezone}
            onValueChange={(v) => v && setTimezone(v)}
          />
          <PremiumSelect
            label="Dil"
            options={[...LANGUAGE_OPTIONS]}
            value={language}
            onValueChange={(v) => v && setLanguage(v)}
          />
        </div>
      </SettingsSectionCard>
      <SaveBar onSave={save} />
    </div>
  );
}

function NotificationsPanel() {
  const prefs = useAppStore((s) => s.settings.notifications);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const set = (patch: Partial<typeof prefs>) =>
    updateSettings({ notifications: { ...prefs, ...patch } });

  return (
    <div className="settings-panel space-y-4">
      <SettingsPanelHeader
        icon={Bell}
        title="Bildirim Ayarları"
        description="Uyarı kanalları ve operasyonel bildirim tercihleri"
      />
      <SettingsSectionCard title="Denetim uyarıları">
        <ToggleRow label="Kritik sorun uyarıları" description="Anında toast ve zil bildirimi" checked={prefs.critical} onChange={(v) => set({ critical: v })} bordered />
        <ToggleRow label="SEO uyarıları" description="Teknik ve içerik SEO sapmaları" checked={prefs.seo} onChange={(v) => set({ seo: v })} bordered />
        <ToggleRow label="Brief uyumsuzluk uyarıları" description="Marka ve CTA sapmaları" checked={prefs.brief} onChange={(v) => set({ brief: v })} bordered />
      </SettingsSectionCard>
      <SettingsSectionCard title="Kanallar">
        <ToggleRow label="Gerçek zamanlı bildirimler" description="Uygulama içi canlı toast" checked={prefs.realtime} onChange={(v) => set({ realtime: v })} bordered />
        <ToggleRow label="E-posta bildirimleri" description="Özet ve kritik raporlar" checked={prefs.email} onChange={(v) => set({ email: v })} bordered />
        <ToggleRow label="Anlık bildirimler (tarayıcı)" description="Tarayıcı bildirimi yakında" checked={prefs.push} onChange={(v) => set({ push: v })} />
      </SettingsSectionCard>
      <p className="text-xs text-[var(--text-secondary)]">Değişiklikler anında kaydedilir.</p>
    </div>
  );
}

function AuditPanel() {
  const audit = useAppStore((s) => s.settings.audit);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [depth, setDepth] = useState(audit.depth);
  const [web, setWeb] = useToggle(true);
  const [seo, setSeo] = useToggle(true);
  const [ads, setAds] = useToggle(true);
  const [mobile, setMobile] = useToggle(true);
  const [a11y, setA11y] = useToggle(true);
  const [conversion, setConversion] = useToggle(true);
  const [deepSeo, setDeepSeo] = useToggle(false);

  return (
    <div className="settings-panel space-y-4">
      <SettingsPanelHeader
        icon={Shield}
        title="Denetim Ayarları"
        description="Modül, derinlik ve analiz kapsamı"
      />
      <SettingsSectionCard title="Aktif modüller">
        <ToggleRow label="Web Tasarım Denetimi" checked={web} onChange={setWeb} bordered />
        <ToggleRow label="SEO Optimizasyonu" checked={seo} onChange={setSeo} bordered />
        <ToggleRow label="Reklam & Dönüşüm" checked={ads} onChange={setAds} bordered />
      </SettingsSectionCard>
      <SettingsSectionCard title="Analiz derinliği">
        <PremiumSelect
          label="Varsayılan analiz derinliği"
          hint="Daha derin tarama daha uzun sürer"
          options={[
            { value: "standard", label: "Standart" },
            { value: "deep", label: "Derin" },
            { value: "expert", label: "Uzman" },
          ]}
          value={depth}
          onValueChange={(v) => v && setDepth(v as typeof depth)}
        />
        <div className="mt-4 space-y-0">
          <ToggleRow label="Mobil kontroller" checked={mobile} onChange={setMobile} bordered />
          <ToggleRow label="SEO derin tarama" checked={deepSeo} onChange={setDeepSeo} bordered />
          <ToggleRow label="Erişilebilirlik kontrolleri" checked={a11y} onChange={setA11y} bordered />
          <ToggleRow label="Dönüşüm analizi" checked={conversion} onChange={setConversion} />
        </div>
      </SettingsSectionCard>
      <SaveBar
        onSave={() => {
          void updateSettings({
            audit: { ...audit, depth },
          }).then(() => NexToast.success("Denetim ayarları kaydedildi"));
        }}
      />
    </div>
  );
}

function ScanPanel() {
  const audit = useAppStore((s) => s.settings.audit);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [auto, setAuto] = useState(audit.autoScan);
  const [scheduled, setScheduled] = useState(audit.weeklyReport);
  const [recursive, setRecursive] = useToggle(true);
  const [screenshot, setScreenshot] = useToggle(false);
  const [lighthouse, setLighthouse] = useToggle(true);

  return (
    <div className="settings-panel space-y-4">
      <SettingsPanelHeader
        icon={ScanSearch}
        title="Tarama Ayarları"
        description="Otomatik tarama, zamanlama ve sayfa derinliği"
      />
      <SettingsSectionCard title="Tarama modu">
        <ToggleRow label="Otomatik tarama" description="Proje oluşturulunca ilk tarama" checked={auto} onChange={setAuto} bordered />
        <ToggleRow label="Zamanlanmış tarama" description="Haftalık periyodik denetim" checked={scheduled} onChange={setScheduled} bordered />
        <ToggleRow label="Özyinelemeli sayfa taraması" checked={recursive} onChange={setRecursive} bordered />
        <SettingsRow label="Maksimum sayfa derinliği" description="Site haritası derinliği">
          <Input type="number" defaultValue="5" className={cn(settingsInputClass, "sm:max-w-[100px]")} />
        </SettingsRow>
      </SettingsSectionCard>
      <SettingsSectionCard title="Gelişmiş">
        <ToggleRow label="Ekran görüntüsü analizi" checked={screenshot} onChange={setScreenshot} bordered />
        <ToggleRow label="Lighthouse modu" description="Performans metrikleri" checked={lighthouse} onChange={setLighthouse} />
      </SettingsSectionCard>
      <SaveBar
        onSave={() => {
          void updateSettings({
            audit: { ...audit, autoScan: auto, weeklyReport: scheduled },
          }).then(() => NexToast.success("Tarama ayarları kaydedildi"));
        }}
      />
    </div>
  );
}

function IntegrationsPanel() {
  const integrations = useAppStore((s) => s.settings.integrations);
  const toggleIntegration = useAppStore((s) => s.toggleIntegration);

  return (
    <div className="settings-panel space-y-4">
      <SettingsPanelHeader
        icon={Plug}
        title="Entegrasyonlar"
        description="Analytics, bildirim ve AI servis bağlantıları"
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {integrations.map((item) => (
          <li key={item.id}>
            <article className="card-interactive flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{item.name}</p>
                  <p className="text-[13px] text-[var(--text-secondary)]">{item.category}</p>
                </div>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[13px] font-medium",
                    item.connected
                      ? "bg-[var(--success-soft)] text-[var(--success)]"
                      : "bg-[var(--surface-soft)] text-[var(--text-secondary)]",
                  )}
                >
                  {item.connected ? "Bağlı" : "Bağlı değil"}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                className="btn-transition mt-auto h-8 w-full rounded-lg border-[var(--border)] text-xs"
                onClick={() => {
                  void toggleIntegration(item.id).then(() =>
                    NexToast.success(
                      item.connected ? "Bağlantı kesildi" : "Entegrasyon bağlandı",
                      item.name,
                    ),
                  );
                }}
              >
                {item.connected ? "Bağlantıyı kes" : "Bağlan"}
              </Button>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TeamPanel() {
  return (
    <div className="settings-panel space-y-4">
      <SettingsPanelHeader
        icon={Users}
        title="Ekip Yönetimi"
        description="Üyeler, roller ve proje erişimi"
      />
      <SettingsSectionCard
        title="Ekip üyeleri"
        description="Ajans Demo · 3 üye"
      >
        <ul className="space-y-2">
          {mockTeamMembers.map((member) => (
            <li
              key={member.id}
              className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/50 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-xs font-semibold text-[var(--primary)]">
                  {member.initials}
                </span>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{member.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{member.email}</p>
                </div>
              </div>
              <PremiumSelect
                label=""
                options={[
                  { value: "owner", label: "Sahip" },
                  { value: "admin", label: "Yönetici" },
                  { value: "editor", label: "Editör" },
                  { value: "viewer", label: "Görüntüleyici" },
                ]}
                value={member.role}
                className="sm:min-w-[140px]"
              />
            </li>
          ))}
        </ul>
        <Button
          type="button"
          className="btn-transition mt-4 h-9 rounded-lg bg-[var(--primary)] text-xs text-white hover:bg-[var(--primary-hover)]"
          onClick={() => NexToast.success("Davet gönderildi", "Ekip üyesi daveti simüle edildi.")}
        >
          Üye davet et
        </Button>
      </SettingsSectionCard>
      <SettingsSectionCard title="Proje erişimi">
        <SettingsRow label="Varsayılan erişim" description="Yeni projelerde ekip görünürlüğü">
          <PremiumSelect
            label=""
            options={[
              { value: "all", label: "Tüm ekip" },
              { value: "assigned", label: "Atanan üyeler" },
            ]}
            value="all"
            className="sm:min-w-[160px]"
          />
        </SettingsRow>
      </SettingsSectionCard>
    </div>
  );
}

function BriefPanel() {
  const [strict, setStrict] = useToggle(false);

  return (
    <div className="settings-panel space-y-4">
      <SettingsPanelHeader
        icon={ClipboardCheck}
        title="Brief Sistemi"
        description="Uyumluluk hassasiyeti ve eşleşme toleransları"
      />
      <SettingsSectionCard title="Uyumluluk">
        <PremiumSelect
          label="Hassasiyet seviyesi"
          options={[
            { value: "relaxed", label: "Esnek" },
            { value: "balanced", label: "Dengeli" },
            { value: "strict", label: "Katı" },
          ]}
          value="balanced"
        />
        <div className="mt-4">
          <ToggleRow
            label="Zorunlu brief alanları"
            description="Eksik alanlarda uyarı üret"
            checked={strict}
            onChange={setStrict}
          />
        </div>
      </SettingsSectionCard>
      <SettingsSectionCard title="Tolerans eşikleri">
        <SettingsRow label="Renk sapma eşiği" description="Brief paleti toleransı (%)">
          <Input type="number" defaultValue="15" className={cn(settingsInputClass, "sm:max-w-[100px]")} />
        </SettingsRow>
        <SettingsRow label="Tipografi toleransı" description="Punto farkı (px)" bordered>
          <Input type="number" defaultValue="2" className={cn(settingsInputClass, "sm:max-w-[100px]")} />
        </SettingsRow>
      </SettingsSectionCard>
      <SaveBar
        onSave={() => NexToast.success("Brief ayarları kaydedildi", "Tercihler uygulandı.")}
      />
    </div>
  );
}

function AiPanel() {
  const [autoSuggest, setAutoSuggest] = useToggle(true);
  const [content, setContent] = useToggle(true);
  const [tone, setTone] = useToggle(true);

  return (
    <div className="settings-panel space-y-4">
      <SettingsPanelHeader
        icon={Bot}
        title="Yapay Zeka Ayarları"
        description="Öneri yoğunluğu ve otomatik analiz motoru"
      />
      <SettingsSectionCard title="Öneri motoru">
        <PremiumSelect
          label="Yapay zeka öneri yoğunluğu"
          options={[
            { value: "low", label: "Düşük" },
            { value: "medium", label: "Orta" },
            { value: "high", label: "Yüksek" },
          ]}
          value="medium"
        />
        <div className="mt-4 space-y-0">
          <ToggleRow label="Otomatik öneriler" checked={autoSuggest} onChange={setAutoSuggest} bordered />
          <ToggleRow label="Yapay zeka içerik analizi" checked={content} onChange={setContent} bordered />
          <ToggleRow label="Ton analizi" checked={tone} onChange={setTone} />
        </div>
      </SettingsSectionCard>
      <SaveBar
        onSave={() => NexToast.success("Yapay zeka ayarları kaydedildi", "Tercihler uygulandı.")}
      />
    </div>
  );
}

function DangerPanel() {
  const { activeProject } = useActiveProject();
  const deleteProject = useAppStore((s) => s.deleteProject);
  const archiveProject = useAppStore((s) => s.archiveProject);
  const resetDatabase = useAppStore((s) => s.resetDatabase);
  const clearReportHistory = useAppStore((s) => s.clearReportHistory);

  return (
    <div className="settings-panel space-y-4">
      <SettingsPanelHeader
        icon={AlertTriangle}
        title="Tehlikeli Bölge"
        description="Geri alınamaz işlemler — dikkatli kullanın"
      />
      <SettingsSectionCard
        title="Proje işlemleri"
        description="Seçili proje verilerini kalıcı olarak siler"
        danger
      >
        <DangerRow
          label="Projeyi arşivle"
          description={`${activeProject.name} iptal edilir ve arşive alınır`}
          actionLabel="Projeyi iptal et"
          variant="outline"
          onAction={() => {
            if (
              window.confirm(
                `${activeProject.name} arşivlensin mi? İstediğin zaman yeni bir denetime başlayabilirsin.`,
              )
            ) {
              void archiveProject(activeProject.id);
            }
          }}
        />
        <DangerRow
          label="Projeyi sil"
          description={`${activeProject.name} ve tüm denetim geçmişi kalıcı olarak silinir`}
          actionLabel="Projeyi sil"
          bordered
          onAction={() => {
            if (window.confirm(`${activeProject.name} kalıcı olarak silinsin mi?`)) {
              void deleteProject(activeProject.id);
            }
          }}
        />
      </SettingsSectionCard>
      <SettingsSectionCard title="Veri sıfırlama" danger>
        <DangerRow
          label="Tüm verileri sıfırla"
          description="Tüm yerel verileri varsayılan demo haline döndürür"
          actionLabel="Veritabanını sıfırla"
          variant="outline"
          onAction={() => {
            if (window.confirm("Tüm uygulama verileri sıfırlansın mı?")) {
              resetDatabase();
              NexToast.success("Veriler sıfırlandı", "Varsayılan demo verisi yüklendi.");
            }
          }}
        />
        <DangerRow
          label="Analitik verileri sıfırla"
          description="Rapor geçmişi ve trend verileri silinir"
          actionLabel="Analitiği sıfırla"
          variant="outline"
          bordered
          onAction={() => {
            if (window.confirm(`${activeProject.name} rapor geçmişi silinsin mi?`)) {
              void clearReportHistory(activeProject.id).then(() =>
                NexToast.success("Rapor geçmişi temizlendi"),
              );
            }
          }}
        />
      </SettingsSectionCard>
      <SettingsSectionCard title="Hesap" danger>
        <DangerRow
          label="Hesabı sil"
          description="Tüm projeler, ekip ve ayarlar kalıcı olarak silinir"
          actionLabel="Hesabı sil"
          onAction={() => {
            if (window.confirm("Hesap silme simülasyonu — tüm veriler sıfırlansın mı?")) {
              resetDatabase();
              NexToast.success("Hesap sıfırlandı", "Yerel veriler temizlendi.");
            }
          }}
        />
      </SettingsSectionCard>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
      <Input type={type} defaultValue={defaultValue} className={settingsInputClass} />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  bordered,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  bordered?: boolean;
}) {
  return (
    <SettingsRow label={label} description={description} bordered={bordered}>
      <SettingsToggle checked={checked} onChange={onChange} label={label} />
    </SettingsRow>
  );
}

function SaveBar({ onSave }: { onSave?: () => void }) {
  return (
    <div className="flex justify-end pt-1">
      <Button
        type="button"
        onClick={
          onSave ??
          (() => NexToast.success("Ayarlar kaydedildi", "Tercihlerin güncellendi."))
        }
        className="btn-transition h-10 rounded-xl bg-[var(--primary)] px-5 text-sm font-medium hover:bg-[var(--primary-hover)]"
      >
        Değişiklikleri kaydet
      </Button>
    </div>
  );
}

function ControlledField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={settingsInputClass}
      />
    </div>
  );
}

function DangerRow({
  label,
  description,
  actionLabel,
  variant = "danger",
  bordered,
  onAction,
}: {
  label: string;
  description: string;
  actionLabel: string;
  variant?: "danger" | "outline";
  bordered?: boolean;
  onAction?: () => void;
}) {
  return (
    <SettingsRow label={label} description={description} bordered={bordered}>
      <Button
        type="button"
        variant="outline"
        disabled={!onAction}
        onClick={onAction}
        className={cn(
          "btn-transition h-9 rounded-lg text-xs font-medium",
          variant === "danger"
            ? "border-[var(--danger)]/40 text-[var(--danger)] hover:bg-[var(--danger-soft)]"
            : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-soft)]",
        )}
      >
        {variant === "danger" && <Trash2 className="mr-1.5 h-3.5 w-3.5" />}
        {actionLabel}
      </Button>
    </SettingsRow>
  );
}
