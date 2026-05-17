"use client";

import { useEffect, type ReactNode } from "react";
import { useAppStore } from "@/stores/app-store";

export function StoreProvider({ children }: { children: ReactNode }) {
  const setHydrated = useAppStore((s) => s.setHydrated);
  const hydrated = useAppStore((s) => s.hydrated);

  useEffect(() => {
    const finish = () => setHydrated(true);
    if (useAppStore.persist.hasHydrated()) {
      finish();
      return;
    }
    return useAppStore.persist.onFinishHydration(finish);
  }, [setHydrated]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
          <p className="text-sm text-[var(--text-secondary)]">NexAudit yükleniyor…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
