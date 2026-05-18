"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_GROUPS } from "@/constants/navigation";
import { useProfileStore } from "@/stores/profile-store";

interface SidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ collapsed = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { profile, initials } = useProfileStore();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-[var(--border)] bg-[var(--surface)]",
        collapsed ? "w-[72px]" : "w-[var(--sidebar-width)]",
      )}
    >
      <Link
        href="/"
        onClick={onNavigate}
        className={cn(
          "flex items-center px-5 py-5 transition-opacity duration-[220ms] hover:opacity-90",
          collapsed && "justify-center px-3",
        )}
      >
        <Image
          src="/logo.png"
          alt="NexAudit"
          width={168}
          height={40}
          priority
          className={cn(
            "h-9 w-auto max-w-[168px] object-contain object-left",
            collapsed && "h-8 max-w-[52px] object-center",
          )}
        />
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.title || "main"}>
            {group.title && !collapsed && (
              <p className="mb-2 px-3 text-[13px] font-semibold tracking-wider text-[var(--text-secondary)]">
                {group.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "sidebar-item flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium",
                        active
                          ? "bg-[var(--primary)] text-white shadow-sm"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]",
                        collapsed && "justify-center px-2",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={cn("border-t border-[var(--border)] p-4", collapsed && "px-2")}>
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl bg-[var(--surface-soft)] p-3",
            collapsed && "justify-center p-2",
          )}
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--primary-soft)] text-sm font-semibold text-[var(--primary)]">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-[15px] font-medium text-[var(--text-primary)]">
                {profile.name}
              </p>
              <p className="truncate text-ui-secondary text-[var(--text-secondary)]">
                {profile.email}
              </p>
            </div>
          )}
        </div>
        {!collapsed && (
          <p className="mt-4 px-1 text-[13px] text-[var(--text-secondary)]">© 2026 NexAudit</p>
        )}
      </div>
    </aside>
  );
}
