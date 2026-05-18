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
import { AvatarUploader } from "@/components/settings/avatar-uploader";
import { PROFILE_ROLE_OPTIONS, updateProfile } from "@/services/profile.service";
import { useProfile } from "@/stores/profile-store";
import { useSettingsStore } from "@/stores/settings-store";
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from "@/constants/ui-tr";
import type { SettingsSectionId } from "@/data/mock-settings";
import {
  clearReportHistoryWithFeedback,
  inviteTeamMember,
  resetDatabaseWithFeedback,
  saveProjectAuditSettings,
  toggleIntegrationWithFeedback,
  updateTeamMemberRole,
} from "@/services/settings-actions";
import { getProjectAuditSettings } from "@/services/settings-service";
import { NotificationService } from "@/services/notification-service";
import { useActiveProject } from "@/lib/project-context";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";
import type { TeamMemberRole } from "@/types/app-database";

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
  const profile = useProfile();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [companyName, setCompanyName] = useState(profile.companyName);
  const [role, setRole] = useState(profile.role);
  const [website, setWebsite] = useState(profile.website);
  const [timezone, setTimezone] = useState(profile.timezone);
  const [language, setLanguage] = useState(profile.language);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatarUrl);

  const save = () => {
    void updateProfile({
      name,
      email,
      companyName,
      role,
      website,
      timezone,
      language,
      avatarUrl,
    });
  };

  return (
    <div className="settings-panel space-y-4">
      <SettingsPanelHeader
        icon={User}
        title="Profil & Organizasyon"
        description="Hesap, ekip kimliği ve bölgesel tercihler"
      />
      <SettingsSectionCard title="Profil" description="Kişisel bilgileriniz">
        <AvatarUploader name={name} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} />
        <div className="grid gap-4 sm:grid-cols-2">
          <ControlledField label="Ad Soyad" value={name} onChange={setName} />
          <ControlledField label="E-posta" value={email} onChange={setEmail} type="email" />
        </div>
      </SettingsSectionCard>
      <SettingsSectionCard title="Organizasyon" description="Ajans ve ekip bilgileri">
        <div className="grid gap-4 sm:grid-cols-2">
          <ControlledField label="Şirket / Ajans adı" value={companyName} onChange={setCompanyName} />
          <PremiumSelect
            label="Rol"
            options={PROFILE_ROLE_OPTIONS}
            value={role}
            onValueChange={(v) => v && setRole(v as typeof role)}
          />
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
  const { activeProjectId } = useActiveProject();
  const audit =
    useAppStore((s) => s.auditSettingsByProject[activeProjectId]) ??
    getProjectAuditSettings(activeProjectId);
  const updateAudit = useAppStore((s) => s.updateProjectAuditSettings);

  return (
    <div className="settings-panel space-y-4">
      <SettingsPanelHeader
        icon={Shield}
        title="Denetim Ayarları"
        description="Modül, derinlik ve analiz kapsamı"
      />
      <SettingsSectionCard title="Aktif modüller">
        <ToggleRow
          label="Web Tasarım Denetimi"
          checked={audit.modules.website}
          onChange={(v) => void updateAudit(activeProjectId, { modules: { ...audit.modules, website: v } })}
          bordered
        />
        <ToggleRow
          label="SEO Optimizasyonu"
          checked={audit.modules.seo}
          onChange={(v) => void updateAudit(activeProjectId, { modules: { ...audit.modules, seo: v } })}
          bordered
        />
        <ToggleRow
          label="Reklam & Dönüşüm"
          checked={audit.modules.ads}
          onChange={(v) => void updateAudit(activeProjectId, { modules: { ...audit.modules, ads: v } })}
          bordered
        />
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
          value={audit.depth}
          onValueChange={(v) => v && void updateAudit(activeProjectId, { depth: v as typeof audit.depth })}
        />
        <div className="mt-4 space-y-0">
          <ToggleRow
            label="Mobil kontroller"
            checked={audit.checks.mobile}
            onChange={(v) => void updateAudit(activeProjectId, { checks: { ...audit.checks, mobile: v } })}
            bordered
          />
          <ToggleRow
            label="SEO derin tarama"
            checked={audit.checks.deepSeo}
            onChange={(v) => void updateAudit(activeProjectId, { checks: { ...audit.checks, deepSeo: v } })}
            bordered
          />
          <ToggleRow
            label="Erişilebilirlik kontrolleri"
            checked={audit.checks.a11y}
            onChange={(v) => void updateAudit(activeProjectId, { checks: { ...audit.checks, a11y: v } })}
            bordered
          />
          <ToggleRow
            label="Dönüşüm analizi"
            checked={audit.checks.conversion}
            onChange={(v) => void updateAudit(activeProjectId, { checks: { ...audit.checks, conversion: v } })}
          />
        </div>
      </SettingsSectionCard>
      <SaveBar
        onSave={() => void saveProjectAuditSettings(activeProjectId, audit)}
      />
    </div>
  );
}

function ScanPanel() {
  const { activeProjectId } = useActiveProject();
  const audit =
    useAppStore((s) => s.auditSettingsByProject[activeProjectId]) ??
    getProjectAuditSettings(activeProjectId);
  const updateAudit = useAppStore((s) => s.updateProjectAuditSettings);

  return (
    <div className="settings-panel space-y-4">
      <SettingsPanelHeader
        icon={ScanSearch}
        title="Tarama Ayarları"
        description="Otomatik tarama, zamanlama ve sayfa derinliği"
      />
      <SettingsSectionCard title="Tarama modu">
        <ToggleRow
          label="Otomatik tarama"
          description="Proje oluşturulunca ilk tarama"
          checked={audit.scan.autoScan}
          onChange={(v) => void updateAudit(activeProjectId, { scan: { ...audit.scan, autoScan: v } })}
          bordered
        />
        <ToggleRow
          label="Zamanlanmış tarama"
          description="Haftalık periyodik denetim"
          checked={audit.scan.weeklyReport}
          onChange={(v) => void updateAudit(activeProjectId, { scan: { ...audit.scan, weeklyReport: v } })}
          bordered
        />
        <ToggleRow
          label="Özyinelemeli sayfa taraması"
          checked={audit.scan.recursive}
          onChange={(v) => void updateAudit(activeProjectId, { scan: { ...audit.scan, recursive: v } })}
          bordered
        />
        <SettingsRow label="Maksimum sayfa derinliği" description="Site haritası derinliği">
          <Input
            type="number"
            value={audit.scan.maxDepth}
            onChange={(e) =>
              void updateAudit(activeProjectId, {
                scan: { ...audit.scan, maxDepth: Number(e.target.value) || 1 },
              })
            }
            className={cn(settingsInputClass, "sm:max-w-[100px]")}
          />
        </SettingsRow>
      </SettingsSectionCard>
      <SettingsSectionCard title="Gelişmiş">
        <ToggleRow
          label="Ekran görüntüsü analizi"
          checked={audit.scan.screenshot}
          onChange={(v) => void updateAudit(activeProjectId, { scan: { ...audit.scan, screenshot: v } })}
          bordered
        />
        <ToggleRow
          label="Lighthouse modu"
          description="Performans metrikleri"
          checked={audit.scan.lighthouse}
          onChange={(v) => void updateAudit(activeProjectId, { scan: { ...audit.scan, lighthouse: v } })}
        />
      </SettingsSectionCard>
      <SaveBar
        onSave={() => void saveProjectAuditSettings(activeProjectId, audit, "Tarama ayarları kaydedildi")}
      />
    </div>
  );
}

function IntegrationsPanel() {
  const integrations = useAppStore((s) => s.settings.integrations);

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
                  void toggleIntegrationWithFeedback(item.id, item.name);
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
  const team = useAppStore((s) => s.settings.team);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMemberRole>("editor");

  return (
    <div className="settings-panel space-y-4">
      <SettingsPanelHeader
        icon={Users}
        title="Ekip Yönetimi"
        description="Üyeler, roller ve proje erişimi"
      />
      <SettingsSectionCard
        title="Ekip üyeleri"
        description={`${team.length} üye`}
      >
        <ul className="space-y-2">
          {team.map((member) => (
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
                onValueChange={(v) => v && void updateTeamMemberRole(member.id, v as TeamMemberRole)}
                className="sm:min-w-[140px]"
              />
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <Input
            type="email"
            placeholder="eposta@ornek.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className={settingsInputClass}
          />
          <PremiumSelect
            label=""
            options={[
              { value: "admin", label: "Yönetici" },
              { value: "editor", label: "Editör" },
              { value: "viewer", label: "Görüntüleyici" },
            ]}
            value={inviteRole}
            onValueChange={(v) => v && setInviteRole(v as TeamMemberRole)}
            className="sm:min-w-[120px]"
          />
          <Button
            type="button"
            className="btn-transition h-9 rounded-lg bg-[var(--primary)] text-xs text-white hover:bg-[var(--primary-hover)]"
            onClick={() => {
              if (!inviteEmail.trim()) return;
              void inviteTeamMember(inviteEmail.trim(), inviteRole);
              setInviteEmail("");
            }}
          >
            Üye davet et
          </Button>
        </div>
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
  const { brief, updateBrief } = useSettingsStore();

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
          value={brief.sensitivity}
          onValueChange={(v) => v && updateBrief({ sensitivity: v as typeof brief.sensitivity })}
        />
        <div className="mt-4">
          <ToggleRow
            label="Zorunlu brief alanları"
            description="Eksik alanlarda uyarı üret"
            checked={brief.strictFields}
            onChange={(v) => updateBrief({ strictFields: v })}
          />
        </div>
      </SettingsSectionCard>
      <SettingsSectionCard title="Tolerans eşikleri">
        <SettingsRow label="Renk sapma eşiği" description="Brief paleti toleransı (%)">
          <Input
            type="number"
            value={brief.colorTolerance}
            onChange={(e) => updateBrief({ colorTolerance: Number(e.target.value) || 0 })}
            className={cn(settingsInputClass, "sm:max-w-[100px]")}
          />
        </SettingsRow>
        <SettingsRow label="Tipografi toleransı" description="Punto farkı (px)" bordered>
          <Input
            type="number"
            value={brief.typographyTolerance}
            onChange={(e) => updateBrief({ typographyTolerance: Number(e.target.value) || 0 })}
            className={cn(settingsInputClass, "sm:max-w-[100px]")}
          />
        </SettingsRow>
      </SettingsSectionCard>
      <p className="text-xs text-[var(--text-secondary)]">Değişiklikler anında kaydedilir.</p>
    </div>
  );
}

function AiPanel() {
  const { ai, updateAi } = useSettingsStore();

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
          value={ai.density}
          onValueChange={(v) => v && updateAi({ density: v as typeof ai.density })}
        />
        <div className="mt-4 space-y-0">
          <ToggleRow
            label="Otomatik öneriler"
            checked={ai.autoSuggest}
            onChange={(v) => updateAi({ autoSuggest: v })}
            bordered
          />
          <ToggleRow
            label="Yapay zeka içerik analizi"
            checked={ai.contentAnalysis}
            onChange={(v) => updateAi({ contentAnalysis: v })}
            bordered
          />
          <ToggleRow
            label="Ton analizi"
            checked={ai.toneAnalysis}
            onChange={(v) => updateAi({ toneAnalysis: v })}
          />
        </div>
      </SettingsSectionCard>
      <p className="text-xs text-[var(--text-secondary)]">Değişiklikler anında kaydedilir.</p>
    </div>
  );
}

function DangerPanel() {
  const { activeProject } = useActiveProject();
  const deleteProject = useAppStore((s) => s.deleteProject);
  const archiveProject = useAppStore((s) => s.archiveProject);
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
              void resetDatabaseWithFeedback();
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
              void clearReportHistoryWithFeedback(activeProject.id);
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
              void resetDatabaseWithFeedback();
            }
          }}
        />
      </SettingsSectionCard>
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
          (() => NotificationService.success("Ayarlar kaydedildi", "Tercihlerin güncellendi."))
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
