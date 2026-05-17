"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { LiveEventBridge } from "@/components/toast/live-event-bridge";
import { ToastProvider } from "@/components/toast/toast-provider";
import { ProjectProvider, useActiveProject } from "@/lib/project-context";
import { StoreProvider } from "@/providers/store-provider";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

function AppShellMain({ children }: AppShellProps) {
  const { activeProjectId, isSwitching } = useActiveProject();

  return (
    <main
      key={activeProjectId}
      className={cn(
        "page-enter flex-1 overflow-x-hidden overflow-y-auto p-3 transition-opacity duration-[var(--transition-base)] sm:p-4 lg:p-6",
        isSwitching && "pointer-events-none opacity-60",
      )}
    >
      {children}
    </main>
  );
}

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <StoreProvider>
      <ProjectProvider>
        <LiveEventBridge />
        <div className="flex min-h-screen bg-[var(--bg)]">
          <div className="hidden shrink-0 lg:block">
            <Sidebar />
          </div>

          {mobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/20"
                onClick={() => setMobileOpen(false)}
                aria-label="Menüyü kapat"
              />
              <div className="relative z-10 h-full w-[var(--sidebar-width)] shadow-xl">
                <Sidebar onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar showMenuButton onMenuClick={() => setMobileOpen(true)} />
            <AppShellMain>{children}</AppShellMain>
          </div>
        </div>
      </ProjectProvider>
      </StoreProvider>
    </ToastProvider>
  );
}
