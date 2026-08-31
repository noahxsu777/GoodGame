import Link from "next/link";
import { Logo } from "./logo";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Sorteos",
    links: [
      { href: "/sorteos", label: "Sorteos abiertos" },
      { href: "/ganadores", label: "Ganadores" },
      { href: "/verificar", label: "Verificar un sorteo" },
      { href: "/como-funciona", label: "Cómo funciona" },
    ],
  },
  {
    title: "Comunidad",
    links: [
      { href: "/comunidad", label: "Noticias y podcast" },
      { href: "/comunidad?tipo=stream", label: "Directos" },
      { href: "/cuenta", label: "Mi cuenta" },
      { href: "/registro", label: "Crear cuenta" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/bases", label: "Bases de los sorteos" },
      { href: "/legal/terminos", label: "Términos y condiciones" },
      { href: "/legal/privacidad", label: "Privacidad" },
      { href: "/legal/juego-responsable", label: "Juego responsable" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink-800 bg-ink-900/60">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist-400">
              Sorteos gamer para toda LATAM, con el resultado calculado a la vista de todos y
              comprobable por cualquiera desde la web.
            </p>
            <div className="mt-5 flex gap-2">
              {["TikTok", "YouTube", "Discord", "Instagram"].map((red) => (
                <span
                  key={red}
                  className="rounded-lg border border-ink-700 px-2.5 py-1.5 text-xs text-mist-400"
                >
                  {red}
                </span>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-mist-400">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-mist-300 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink-800 pt-6 text-xs text-mist-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GG Play · Good Game Play. Proyecto de demostración.</p>
          <p>
            Solo para mayores de 18 años. Los pagos de esta demo son simulados: no se procesa dinero real.
          </p>
        </div>
      </div>
    </footer>
  );
}
