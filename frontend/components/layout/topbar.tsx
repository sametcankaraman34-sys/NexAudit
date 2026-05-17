"use client";

import { Building2, Menu, Plus, Search } from "lucide-react";
import Link from "next/link";
import { NotificationBell } from "@/components/notifications/notification-center";
import { ACTIVE_PROJECT } from "@/constants/navigation";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Topbar({ onMenuClick, showMenuButton = false }: TopbarProps) {
  return (
    <header className="flex h-[var(--topbar-height)] shrink-0 items-center gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-6">
      {showMenuButton && (
        <button
          type="button"
          onClick={onMenuClick}
          className="btn-transition flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] lg:hidden"
          aria-label="Menüyü aç"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <button
        type="button"
        className="btn-transition hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-soft)] md:flex"
      >
        <Building2 className="h-4 w-4 text-[var(--primary)]" />
        <span className="max-w-[180px] truncate">{ACTIVE_PROJECT.name}</span>
      </button>

      <div className="relative mx-auto hidden max-w-xl flex-1 lg:block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="search"
          placeholder="Proje, domain veya menü ara..."
          className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] pl-11 pr-16 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)] sm:inline">
          ⌘ K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <NotificationBell />

        <Link
          href="/new-project"
          className={cn(
            "btn-transition hidden h-10 items-center rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white hover:bg-[var(--primary-hover)] sm:inline-flex",
          )}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Yeni Proje
        </Link>
      </div>
    </header>
  );
}
