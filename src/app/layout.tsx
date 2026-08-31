import type { Metadata } from "next";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/** Tipografía angular para titulares, legible para texto y mono para HUD. */
const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jet = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jet",
  display: "swap",
});
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { currentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: {
    default: "GG Play — Good Game Play | Sorteos gamer en LATAM",
    template: "%s · GG Play",
  },
  description:
    "La comunidad gamer de LATAM: sorteos de consolas, PCs y periféricos cada mes, con sorteo en vivo y resultado verificable por cualquiera.",
  keywords: ["sorteos gamer", "consolas", "PC gamer", "LATAM", "giveaway", "GG Play"],
  openGraph: {
    title: "GG Play — Good Game Play",
    description:
      "Sorteos gamer con resultado verificable. Consolas, PCs y periféricos cada mes para toda LATAM.",
    type: "website",
    locale: "es_MX",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  return (
    <html lang="es" className={`${chakra.variable} ${inter.variable} ${jet.variable}`}>
      <body className="font-sans antialiased">
        <SiteHeader
          user={user ? { name: user.name, role: user.role } : null}
        />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
