import fs from "fs";
const content = `"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UI_SHORTCUT_SEARCH } from "@/constants/ui-tr";
import { useActiveProject } from "@/lib/project-context";
import { searchWorkspace } from "@/services/search-service";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";

interface GlobalSearchFieldProps {
  className?: string;
  compact?: boolean;
}

export function GlobalSearchField({ className, compact = false }: GlobalSearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { activeProjectId } = useActiveProject();
  const projects = useAppStore((s) => s.projects);
  const issuesByProject = useAppStore((s) => s.issuesByProject);

  const results = useMemo(
    () => searchWorkspace(query, projects, issuesByProject, activeProjectId),
    [query, projects, issuesByProject, activeProjectId],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  const onSelect = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  return (
    <motionmotionmotionmotiondiv ref={rootRef} className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={compact ? "Ara..." : "Proje, domain veya menü ara..."}
        className={cn(
          "h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15",
          compact ? "pl-10 pr-3 text-ui-secondary" : "pl-11 pr-16 text-ui-secondary",
        )}
      />
      {!compact && (
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[13px] text-[var(--text-secondary)] sm:inline">
          {UI_SHORTCUT_SEARCH}
        </kbd>
      )}
      {open && query.trim() && (
        <ul className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1 shadow-[var(--shadow-card)]">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-[var(--text-secondary)]">Sonuç bulunamadı.</li>
          ) : (
            results.map((r) => (
              <li key={r.id}>
                <Link
                  href={r.href}
                  onClick={onSelect}
                  className="block px-4 py-2.5 hover:bg-[var(--surface-soft)]"
                >
                  <p className="text-sm font-medium text-[var(--text-primary)]">{r.title}</p>
                  {r.subtitle && (
                    <p className="text-xs text-[var(--text-secondary)]">{r.subtitle}</p>
                  )}
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </motionmotionmotionmotionmotiondiv>
  );
}
`.replace(/motionmotionmotionmotionmotiondiv/g, "motionmotionmotionmotiondiv").replace(/motionmotionmotionmotiondiv/g, "div");

fs.writeFileSync(
  new URL("../components/search/global-search-field.tsx", import.meta.url),
  content,
);
