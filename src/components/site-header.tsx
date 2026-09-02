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
    <header className="glass-nav sticky top-0 z-50">
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
                className={`relative rounded-full px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors ${ active ? "bg-white/8 text-white" : "text-mist-400 hover:bg-white/5 hover:text-white" }`}
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
                <Link href="/admin" className="btn btn-ghost px-4 py-2 text-[11px]">
                  Panel
                </Link>
              )}
              <Link href="/cuenta" className="px-3 py-2 text-[13px] font-medium text-mist-200 hover:text-white">
                {user.name.split(" ")[0]}
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="px-3 py-2 text-[13px] font-medium text-mist-400 hover:text-white">
                  Salir
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/entrar" className="px-3 py-2 text-[13px] font-medium text-mist-300 hover:text-white">
                Entrar
              </Link>
              <Link href="/registro" className="btn btn-primary px-5 py-2.5 text-[11px]">
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Abrir menu"
          className="btn btn-ghost ml-auto grid h-10 w-10 place-items-center lg:hidden"
        >
          <span className="sr-only">Menu</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-mist-200 hover:bg-white/6"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
            {user ? (
              <>
                <Link href="/cuenta" className="btn btn-ghost px-3 py-2.5 text-xs">Mi cuenta</Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="btn btn-ghost px-3 py-2.5 text-xs">Panel</Link>
                )}
                <form action={logoutAction}>
                  <button type="submit" className="w-full px-3 py-2.5 text-xs text-mist-400">Cerrar sesion</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/entrar" className="btn btn-ghost px-3 py-2.5 text-xs">Entrar</Link>
                <Link href="/registro" className="btn btn-primary px-3 py-2.5 text-xs">Crear cuenta gratis</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
