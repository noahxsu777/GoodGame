"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { logoutAction } from "@/lib/actions";

const NAV = [
  { href: "/sorteos", label: "Sorteos" },
  { href: "/ganadores", label: "Ganadores" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/verificar", label: "Verificar sorteo" },
  { href: "/comunidad", label: "Comunidad" },
];

export function SiteHeader({ user }: { user: { name: string; role: string } | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" aria-label="GG Play — inicio">
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-ink-800 text-white" : "text-mist-300 hover:bg-ink-850 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="rounded-lg border border-ink-700 px-3 py-2 text-sm font-medium text-mist-300 hover:text-white"
                >
                  Panel
                </Link>
              )}
              <Link
                href="/cuenta"
                className="rounded-lg px-3 py-2 text-sm font-medium text-mist-200 hover:text-white"
              >
                {user.name.split(" ")[0]}
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-lg border border-ink-700 px-3 py-2 text-sm font-medium text-mist-400 transition-colors hover:border-ink-600 hover:text-white"
                >
                  Salir
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/entrar"
                className="rounded-lg px-3 py-2 text-sm font-medium text-mist-300 hover:text-white"
              >
                Entrar
              </Link>
              <Link
                href="/registro"
                className="rounded-lg bg-gradient-to-r from-neon-500 to-aqua-500 px-4 py-2 text-sm font-semibold text-ink-950 transition-transform hover:scale-[1.03]"
              >
                Crear cuenta gratis
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Abrir menú"
          className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-ink-700 text-mist-200 lg:hidden"
        >
          <span className="sr-only">Menú</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-800 bg-ink-900 px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-mist-200 hover:bg-ink-850"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-ink-800 pt-4">
            {user ? (
              <>
                <Link
                  href="/cuenta"
                  className="rounded-lg border border-ink-700 px-3 py-2.5 text-center text-sm font-medium"
                >
                  Mi cuenta
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="rounded-lg border border-ink-700 px-3 py-2.5 text-center text-sm font-medium"
                  >
                    Panel de administración
                  </Link>
                )}
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2.5 text-sm font-medium text-mist-400"
                  >
                    Cerrar sesión
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/entrar"
                  className="rounded-lg border border-ink-700 px-3 py-2.5 text-center text-sm font-medium"
                >
                  Entrar
                </Link>
                <Link
                  href="/registro"
                  className="rounded-lg bg-gradient-to-r from-neon-500 to-aqua-500 px-3 py-2.5 text-center text-sm font-semibold text-ink-950"
                >
                  Crear cuenta gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
