import { NAV_GROUPS } from "@/constants/navigation";
import type { Project, Issue } from "@/types";

export type SearchResultKind = "project" | "nav" | "issue";

export interface SearchResult {
  id: string;
  kind: SearchResultKind;
  title: string;
  subtitle?: string;
  href: string;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function searchWorkspace(
  query: string,
  projects: Project[],
  issuesByProject: Record<string, Issue[]>,
  activeProjectId: string,
): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const project of projects) {
    if (
      project.name.toLowerCase().includes(q) ||
      project.domain.toLowerCase().includes(q) ||
      project.customerName.toLowerCase().includes(q)
    ) {
      results.push({
        id: `project-${project.id}`,
        kind: "project",
        title: project.name,
        subtitle: project.domain,
        href: project.id === activeProjectId ? "/" : `/project-detail?id=${project.id}`,
      });
    }
  }

  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.label.toLowerCase().includes(q)) {
        results.push({
          id: `nav-${item.href}`,
          kind: "nav",
          title: item.label,
          subtitle: group.title || "Menü",
          href: item.href,
        });
      }
    }
  }

  const activeIssues = issuesByProject[activeProjectId] ?? [];
  for (const issue of activeIssues) {
    if (
      issue.title.toLowerCase().includes(q) ||
      issue.location.toLowerCase().includes(q)
    ) {
      const href =
        issue.phase === "seo"
          ? "/seo-audit"
          : issue.phase === "ads"
            ? "/ads-audit"
            : "/website-audit";
      results.push({
        id: `issue-${issue.id}`,
        kind: "issue",
        title: issue.title,
        subtitle: issue.location,
        href,
      });
    }
  }

  return results.slice(0, 12);
}
