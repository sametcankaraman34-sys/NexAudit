"use client";

import {
  AlertTriangle,
  Bell,
  Bot,
  ClipboardCheck,
  Plug,
  Radar,
  ScanSearch,
  Shield,
  User,
  Users,
} from "lucide-react";
import type { SettingsSectionId } from "@/data/mock-settings";
import { SETTINGS_SECTIONS } from "@/data/mock-settings";
import { SETTINGS_GROUP_LABELS } from "@/constants/ui-tr";
import { cn } from "@/lib/utils";

const sectionIcons: Record<SettingsSectionId, typeof User> = {
  profile: User,
  notifications: Bell,
  audit: Shield,
  scan: ScanSearch,
  integrations: Plug,
  team: Users,
  brief: ClipboardCheck,
  ai: Bot,
  danger: AlertTriangle,
};

const groups = [
  { key: "general" as const, label: SETTINGS_GROUP_LABELS.general },
  { key: "platform" as const, label: SETTINGS_GROUP_LABELS.platform },
  { key: "advanced" as const, label: SETTINGS_GROUP_LABELS.advanced },
];

interface SettingsNavProps {
  active: SettingsSectionId;
  onChange: (id: SettingsSectionId) => void;
}

export function SettingsNav({ active, onChange }: SettingsNavProps) {
  return (
    <nav
      className="settings-nav w-full shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow-card)] lg:sticky lg:top-6 lg:w-[240px] lg:self-start"
      aria-label="Ayarlar menüsü"
    >
      {groups.map((group) => (
        <div key={group.key} className="mb-1 last:mb-0">
          <p className="px-2.5 py-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {SETTINGS_SECTIONS.filter((s) => s.group === group.key).map((section) => {
              const Icon = sectionIcons[section.id];
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => onChange(section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "settings-nav-item btn-transition flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left",
                      isActive
                        ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]",
                      section.id === "danger" &&
                        !isActive &&
                        "hover:bg-[var(--danger-soft)]/50 hover:text-[var(--danger)]",
                      section.id === "danger" && isActive && "bg-[var(--danger-soft)] text-[var(--danger)]",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span className="min-w-0">
                      <span className="block truncate text-ui-secondary font-medium leading-tight">
                        {section.label}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function SettingsPanelHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Radar;
}) {
  return (
    <div className="settings-panel-header mb-5 flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{description}</p>
      </div>
    </div>
  );
}
