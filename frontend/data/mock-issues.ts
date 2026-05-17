import type { Issue } from "@/types";

export const mockFeaturedIssues: Issue[] = [
  {
    id: "issue-1",
    title: "Meta description eksik",
    location: "Anasayfa",
    severity: "critical",
    status: "detected",
    phase: "website",
  },
  {
    id: "issue-2",
    title: "Görsel alt etiketi yok",
    location: "Hakkımızda",
    severity: "high",
    status: "detected",
    phase: "website",
  },
  {
    id: "issue-3",
    title: "H1 etiketi çoklu kullanım",
    location: "Blog",
    severity: "medium",
    status: "detected",
    phase: "website",
  },
  {
    id: "issue-4",
    title: "Sayfa yükleme süresi yüksek",
    location: "Ürünler",
    severity: "high",
    status: "detected",
    phase: "website",
  },
  {
    id: "issue-5",
    title: "CTA butonu kontrastı düşük",
    location: "İletişim",
    severity: "medium",
    status: "detected",
    phase: "website",
  },
];

export const mockWebsiteIssues: Issue[] = [
  ...mockFeaturedIssues,
  {
    id: "issue-6",
    title: "Form etiketleri eksik",
    location: "İletişim",
    severity: "low",
    status: "detected",
    phase: "website",
  },
  {
    id: "issue-7",
    title: "Favicon boyutu optimize değil",
    location: "Global",
    severity: "improvement",
    status: "detected",
    phase: "website",
  },
];
