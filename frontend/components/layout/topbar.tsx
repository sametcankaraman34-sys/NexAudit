"use client";

import { Menu, Plus, Search } from "lucide-react";
import Link from "next/link";
import { ProjectSwitcher } from "@/components/project-switcher/project-switcher";
import { NotificationBell } from "@/components/notifications/notification-center";
import { UI_SHORTCUT_SEARCH } from "@/constants/ui-tr";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Topbar({ onMenuClick, showMenuButton = false }: TopbarProps) {
  return (
    <header className="shrink-0 border-b border-[var(--border)] bg-[var(--surface)]">
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

        <div className="relative mx-auto hidden min-w-0 max-w-xl flex-1 lg:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="search"
            placeholder="Proje, domain veya menü ara..."
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] pl-11 pr-16 text-ui-secondary text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[13px] text-[var(--text-secondary)] sm:inline">
            {UI_SHORTCUT_SEARCH}
          </kbd>
        </div>

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
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="search"
            placeholder="Ara..."
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] pl-10 pr-3 text-ui-secondary text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
          />
        </div>
      </div>
    </header>
  );
}
