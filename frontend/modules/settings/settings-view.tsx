"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsNav } from "@/components/settings/settings-nav";
import { SettingsPanel } from "@/components/settings/settings-panels";
import type { SettingsSectionId } from "@/data/mock-settings";

export function SettingsView() {
  const [section, setSection] = useState<SettingsSectionId>("profile");

  return (
    <div className="audit-page space-y-6">
      <PageHeader
        title="Ayarlar"
        description="Sistem yapılandırması, denetim motoru ve ekip kontrol merkezi."
      />

      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start">
        <SettingsNav active={section} onChange={setSection} />
        <div key={section} className="settings-content min-w-0 flex-1">
          <SettingsPanel section={section} />
        </div>
      </div>
    </div>
  );
}
