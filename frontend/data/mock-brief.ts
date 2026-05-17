import type { BriefItem } from "@/types";

export const mockBriefScore = {
  score: 82,
  maxScore: 100,
  label: "İyi",
};

export const mockBriefMet: BriefItem[] = [
  { id: "b1", label: "Logo ve marka renkleri uygulandı", status: "met" },
  { id: "b2", label: "Ana sayfa hero bölümü brief'e uygun", status: "met" },
  { id: "b3", label: "İletişim formu alanları tamamlandı", status: "met" },
  { id: "b4", label: "Footer bilgileri eksiksiz", status: "met" },
];

export const mockBriefMissing: BriefItem[] = [
  { id: "b5", label: "Referanslar sayfası henüz eklenmedi", status: "missing" },
  { id: "b6", label: "Blog kategorileri brief'teki gibi değil", status: "missing" },
];

export const mockBriefPartial: BriefItem[] = [
  {
    id: "b7",
    label: "Hizmetler bölümü kısmen uyumlu",
    status: "partial",
    detail: "3/5 hizmet kartı brief ile eşleşiyor",
  },
  {
    id: "b8",
    label: "Tipografi hiyerarşisi kısmen uyumlu",
    status: "partial",
    detail: "Başlık boyutları brief'ten 2px farklı",
  },
];

export const mockBriefCritical: BriefItem[] = [
  {
    id: "b9",
    label: "CTA metni brief ile uyuşmuyor",
    status: "critical",
    detail: "Brief: 'Teklif Al' — Sitede: 'İletişime Geç'",
  },
  {
    id: "b10",
    label: "Renk paleti sapması",
    status: "critical",
    detail: "Primary renk #6366F1 yerine #5B5BD6 kullanılmış",
  },
];
