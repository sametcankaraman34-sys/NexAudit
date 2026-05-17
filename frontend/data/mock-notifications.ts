import type { Notification, ReportHistoryItem } from "@/types";

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Web Tasarım Denetimi tamamlandı",
    message: "Ajans Demo Projesi için 48 sorun tespit edildi.",
    time: "2 saat önce",
    read: false,
    type: "audit",
  },
  {
    id: "n2",
    title: "12 kritik sorun bulundu",
    message: "Anasayfa meta description eksikliği kritik seviyede.",
    time: "3 saat önce",
    read: false,
    type: "issue",
  },
  {
    id: "n3",
    title: "Brief uygunluk skoru güncellendi",
    message: "Brief uygunluk skoru 82/100 olarak hesaplandı.",
    time: "5 saat önce",
    read: false,
    type: "audit",
  },
  {
    id: "n4",
    title: "SEO aşaması kilitli",
    message: "SEO Optimizasyonu için Web Tasarım Denetimi tamamlanmalı.",
    time: "1 gün önce",
    read: true,
    type: "system",
  },
  {
    id: "n5",
    title: "Yeni iyileştirme önerisi",
    message: "Görsel optimizasyonu +18 puan kazandırabilir.",
    time: "2 gün önce",
    read: true,
    type: "issue",
  },
];

export const mockReportHistory: ReportHistoryItem[] = [
  {
    id: "r1",
    projectName: "Ajans Demo Projesi",
    phase: "Web Tasarım Denetimi",
    score: 68,
    date: "15.05.2026",
  },
  {
    id: "r2",
    projectName: "E-Ticaret Mağazası",
    phase: "Web Tasarım Denetimi",
    score: 54,
    date: "10.05.2026",
  },
];
