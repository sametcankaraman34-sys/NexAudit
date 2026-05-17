# NexAudit — Project Overview

## Proje Tanımı

NexAudit, WordPress tabanlı web sitelerini analiz eden, kalite kontrolünü sağlayan, eksikleri tespit eden ve kullanıcıyı süreç bazlı yönlendiren gelişmiş bir denetim platformudur.

Bu sistem yalnızca klasik bir audit aracı değildir.

NexAudit;

* web tasarım denetimi yapar
* SEO optimizasyonunu analiz eder
* reklam ve dönüşüm altyapısını kontrol eder
* brief uyumluluğunu ölçer
* kullanıcıya uygulanabilir çözüm önerileri sunar
* teslim öncesi kalite kontrol sürecini yönetir

Amaç:

WordPress projelerini teslim edilmeden önce profesyonel şekilde analiz etmek ve optimize etmektir.

---

# Ana Sistem Mantığı

Sistem progression-based çalışır.

Yani:

1. Web Tasarım Denetimi
2. SEO Optimizasyonu
3. Reklam & Dönüşüm Optimizasyonu

Bir aşama tamamlanmadan diğer aşama açılmaz.

Mantık:

* Temeli bozuk siteye SEO yapılmaz.
* SEO altyapısı zayıf siteye reklam çıkılmaz.
* Önce kalite, sonra görünürlük, sonra dönüşüm.

---

# Ana Modüller

## 1. Web Tasarım Denetimi

Amaç:
Sitenin teknik ve görsel olarak teslim edilmeye hazır olup olmadığını analiz etmek.

Kontroller:

* responsive yapı
* mobil uyumluluk
* görsel optimizasyonu
* büyük assetler
* favicon/logo
* header/footer
* typography
* spacing problemleri
* form alanları
* CTA alanları
* DOM yoğunluğu
* Elementor yapısı
* WordPress algılama
* WooCommerce algılama
* Contact Form 7 algılama
* performans problemleri

---

## 2. SEO Optimizasyonu

Bu aşama yalnızca Web Tasarım Denetimi tamamlandıktan sonra açılır.

Kontroller:

* title
* meta description
* H1-H2-H3 yapısı
* robots.txt
* sitemap.xml
* schema
* Open Graph
* alt etiketler
* keyword kullanımı
* içerik yapısı
* internal linking
* teknik SEO problemleri

---

## 3. Reklam & Dönüşüm Optimizasyonu

Bu aşama yalnızca SEO aşaması tamamlandıktan sonra açılır.

Kontroller:

* GTM
* GA4
* Meta Pixel
* dönüşüm eventleri
* CTA alanları
* form görünürlüğü
* WhatsApp erişimi
* landing page yapısı
* reklam uyumluluğu
* mobil dönüşüm deneyimi

---

# Brief Uygunluğu Sistemi

NexAudit’in en güçlü modüllerinden biridir.

Kullanıcı müşteri briefi yükler veya oluşturur.

Sistem siteyi yalnızca teknik olarak değil,
müşteri isteklerine göre de analiz eder.

Örnek:

* “WhatsApp butonu istenmiş”
* “Sitede WhatsApp alanı bulunamadı”

veya:

* “Mor ağırlıklı marka kimliği istenmiş”
* “Site mavi ağırlıklı tasarlanmış”

Sistem şunları raporlar:

* karşılanan istekler
* eksik istekler
* kısmi uyumlar
* kritik uyumsuzluklar
* önerilen düzeltmeler

---

# Dashboard Yapısı

Tüm sistem dashboard üzerinden çalışır.

PDF export mantığı yoktur.

Kullanıcı:

* skorları
* sorunları
* önerileri
* progression sistemini
* brief uyumluluğunu
* geçmiş taramaları

dashboard üzerinden canlı şekilde görüntüler.

---

# Skor Sistemi

Sistem çeşitli skorlar üretir:

* Genel Skor
* Web Tasarım Skoru
* SEO Skoru
* Hız Skoru
* Mobil Skoru
* Dönüşüm Skoru
* Brief Uygunluk Skoru

---

# Rapor Yapısı

Her problem için:

* sorun açıklaması
* önem derecesi
* etkisi
* çözüm önerisi
* muhtemel düzenleme yolu

gösterilir.

Önem seviyeleri:

* Kritik
* Yüksek
* Orta
* Düşük
* Bilgi

---

# UI/UX Tasarım Dili

NexAudit’in tasarım dili:

* light-only
* Apple/macOS inspired
* premium SaaS workspace
* temiz grid sistemi
* güçlü hizalama
* sakin renk kullanımı
* büyük whitespace alanları
* ince border sistemi
* yumuşak shadow sistemi

Dark mode bulunmaz.

Tasarım dili:
Apple System Settings,
Linear,
Vercel
ve modern macOS panel deneyiminden ilham alır.

---

# Teknik Mimari

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui

## Backend

İleri aşamada:

* Next.js API
* Scanner services
* Audit engines

## Database

İleri aşamada:

* PostgreSQL
* Supabase

---

# Klasör Mimarisi

Frontend, backend ve database kesinlikle ayrıdır.

```txt
nexaudit/
├── frontend/
├── backend/
├── database/
├── shared/
└── docs/
```

---

# Frontend Yapısı

```txt
frontend/
├── app/
├── components/
├── modules/
├── constants/
├── data/
├── hooks/
├── lib/
├── types/
└── public/
```

---

# Component Yaklaşımı

UI componentleri tekrar kullanılabilir şekilde tasarlanır.

Örnek componentler:

* Sidebar
* Topbar
* StatCard
* AuditPhaseCard
* IssueList
* SeverityBadge
* LockedState
* ProgressBar
* BriefScoreCard

Business logic component içine gömülmez.

---

# Kod Kalitesi Kuralları

* temiz mimari
* modüler yapı
* anlamlı klasör yapısı
* reusable component sistemi
* minimal dependency
* okunabilir TypeScript
* gereksiz yorumlardan kaçınma
* sürdürülebilir yapı
* ölçeklenebilir sistem mantığı

---

# İlk Geliştirme Fazı

İlk fazda:

* frontend dashboard sistemi
* progression yapısı
* mock data sistemi
* dashboard ekranları
* audit UI yapıları

oluşturulacaktır.

Gerçek scanner engine daha sonra eklenecektir.

---

# Uzun Vadeli Hedef

Türkiye’de WordPress odaklı:

* teslim kontrolü yapan
* kalite kontrolü yapan
* SEO denetimi yapan
* reklam dönüşüm altyapısını kontrol eden
* brief uyumluluğunu analiz eden

premium bir WordPress denetim platformu oluşturmak.
