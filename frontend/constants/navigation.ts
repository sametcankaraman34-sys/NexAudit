import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  ClipboardCheck,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Megaphone,
  Monitor,
  PlusCircle,
  Search,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    title: "PROJELER",
    items: [
      { label: "Projelerim", href: "/projects", icon: FolderKanban },
      { label: "Yeni Proje", href: "/new-project", icon: PlusCircle },
    ],
  },
  {
    title: "DENETİMLER",
    items: [
      { label: "Web Tasarım Denetimi", href: "/website-audit", icon: Monitor },
      { label: "SEO Optimizasyonu", href: "/seo-audit", icon: Search },
      {
        label: "Reklam & Dönüşüm",
        href: "/ads-audit",
        icon: Megaphone,
      },
    ],
  },
  {
    title: "BRIEF",
    items: [
      { label: "Brief Uygunluğu", href: "/brief", icon: ClipboardCheck },
    ],
  },
  {
    title: "DİĞER",
    items: [
      { label: "Bildirimler", href: "/notifications", icon: Bell },
      { label: "Rapor Geçmişi", href: "/report-history", icon: FileText },
      { label: "Ayarlar", href: "/settings", icon: Settings },
    ],
  },
];

export const DEMO_USER = {
  name: "Ajans Demo",
  email: "demo@nexaudit.app",
  initials: "AD",
};

export const ACTIVE_PROJECT = {
  id: "proj-1",
  name: "Ajans Demo Projesi",
};
