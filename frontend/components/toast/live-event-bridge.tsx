"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useActiveProject } from "@/lib/project-context";
import { NexToast, toast } from "@/lib/nex-toast";

function sessionKey(route: string, event: string) {
  return `nex-live-${route}-${event}`;
}

function hasSeen(route: string, event: string) {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(sessionKey(route, event)) === "1";
}

function markSeen(route: string, event: string) {
  sessionStorage.setItem(sessionKey(route, event), "1");
}

function scheduleEvent(
  timers: ReturnType<typeof setTimeout>[],
  route: string,
  event: string,
  delayMs: number,
  fn: () => void,
) {
  if (hasSeen(route, event)) return;
  const id = setTimeout(() => {
    fn();
    markSeen(route, event);
  }, delayMs);
  timers.push(id);
}

/** Route-based live events — once per session per route */
export function LiveEventBridge() {
  const pathname = usePathname();
  const { activeProject } = useActiveProject();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    const timers = timersRef.current;

    if (pathname === "/") {
      scheduleEvent(timers, "/", "scan-active", 2800, () =>
        NexToast.scanStarted(activeProject.name),
      );
    }

    if (pathname === "/website-audit") {
      scheduleEvent(timers, pathname, "audit-complete", 1600, () =>
        toast({
          variant: "success",
          title: "Web turu tamam",
          description: `Tasarım denetimi bitti · skor ${activeProject.overallScore}/100 — SEO tarafına geçebiliriz.`,
          action: { label: "SEO'ya geç", href: "/seo-audit" },
        }),
      );
      scheduleEvent(timers, pathname, "critical-meta", 4200, () =>
        NexToast.criticalIssue("Anasayfada meta description eksik."),
      );
    }

    if (pathname === "/seo-audit") {
      scheduleEvent(timers, pathname, "seo-unlock", 1200, () => NexToast.seoUnlocked());
    }

    if (pathname === "/brief") {
      scheduleEvent(timers, pathname, "brief-score", 1400, () =>
        NexToast.briefScoreUpdated(activeProject.briefScore ?? 0),
      );
    }

    if (pathname === "/ads-audit") {
      scheduleEvent(timers, pathname, "conversion", 1800, () =>
        NexToast.conversionIssue("Landing CTA görünürlüğü mobilde düşük."),
      );
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [pathname, activeProject]);

  return null;
}
