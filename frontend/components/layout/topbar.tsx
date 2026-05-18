"use client";

import { Menu, Plus } from "lucide-react";
import { GlobalSearchField } from "@/components/search/global-search-field";
import Link from "next/link";
import { ProjectSwitcher } from "@/components/project-switcher/project-switcher";
import { NotificationBell } from "@/components/notifications/notification-center";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Topbar({ onMenuClick, showMenuButton = false }: TopbarProps) {
  return (
    <header className="relative z-20 shrink-0 overflow-visible border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="flex h-[var(--topbar-height)] items-center gap-2 px-4 sm:gap-3 sm:px-6">
        {showMenuButton && (
          <button
            type="button"
            onClick={onMenuClick}
            className="btn-transition flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] lg:hidden"
            aria-label="Menüyü aç"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <ProjectSwitcher />

        <GlobalSearchField className="mx-auto hidden min-w-0 max-w-xl flex-1 lg:block" />

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <NotificationBell />

          <Link
            href="/new-project"
            className={cn(
              "btn-transition inline-flex min-h-[44px] items-center rounded-xl bg-[var(--primary)] px-3 text-ui-secondary font-medium text-white hover:bg-[var(--primary-hover)] sm:px-4",
            )}
          >
            <Plus className="mr-1.5 h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">Yeni Proje</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-[var(--border)] px-4 pb-3 pt-0 lg:hidden">
        <GlobalSearchField compact />
      </div>
    </header>
  );
}
