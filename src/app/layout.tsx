import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./motion.css";
import "./liquid.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { currentUser } from "@/lib/session";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GG Play — Good Game Play | Sorteos gamer en LATAM",
    template: "%s · GG Play",
  },
  description:
    "La comunidad gamer de LATAM: sorteos de consolas, PCs y perifericos cada mes, con sorteo en vivo y resultado verificable por cualquiera.",
  keywords: ["sorteos gamer", "consolas", "PC gamer", "LATAM", "giveaway", "GG Play"],
  openGraph: {
    title: "GG Play — Good Game Play",
    description:
      "Sorteos gamer con resultado verificable. Consolas, PCs y perifericos cada mes para toda LATAM.",
    type: "website",
    locale: "es_MX",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  return (
    <html lang="es" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <SiteHeader user={user ? { name: user.name, role: user.role } : null} />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
