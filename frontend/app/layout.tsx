import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { sfProDisplay } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexAudit — WordPress Denetim Platformu",
  description:
    "WordPress projeleri için 3 aşamalı denetim sistemi: Web Tasarım, SEO ve Reklam & Dönüşüm.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${sfProDisplay.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
