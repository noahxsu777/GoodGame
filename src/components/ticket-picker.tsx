"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { buyTicketsAction, claimFreeTicketAction, type FormState } from "@/lib/actions";
import { Alert } from "./ui";
import { money, tickets as ticketWord } from "@/lib/format";
import type { TicketPack } from "@/lib/types";

function SubmitButton({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "ghost" }) {
  const { pending } = useFormStatus();
  const base = "w-full rounded-xl px-5 py-3.5 text-sm font-bold transition-all disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-neon-500 to-aqua-500 text-ink-950 hover:scale-[1.01]"
      : "border border-ink-700 text-mist-200 hover:border-neon-500/60 hover:text-white";
  return (
    <button type="submit" disabled={pending} className={`${base} ${styles}`}>
      {pending ? "Procesando…" : children}
    </button>
  );
}

export function TicketPicker({
  slug,
  packs,
  ticketPriceCents,
  isAuthenticated,
  hasFreeTicket,
  ticketsLeft,
}: {
  slug: string;
  packs: TicketPack[];
  ticketPriceCents: number;
  isAuthenticated: boolean;
  hasFreeTicket: boolean;
  ticketsLeft: number;
}) {
  const [selected, setSelected] = useState(2);
  const [buyState, buy] = useActionState<FormState, FormData>(buyTicketsAction, {});
  const [freeState, claimFree] = useActionState<FormState, FormData>(claimFreeTicketAction, {});

  const pack = packs[selected];
  const perTicket = pack ? pack.priceCents / pack.tickets : ticketPriceCents;
  const saving = pack ? pack.tickets * ticketPriceCents - pack.priceCents : 0;

  return (
    <div className="card p-6">
      <h3 className="text-sm font-bold uppercase tracking-wide text-mist-400">Elige tus boletos</h3>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {packs.map((option, index) => {
          const active = index === selected;
          return (
            <button
              key={option.tickets}
              type="button"
              onClick={() => setSelected(index)}
              aria-pressed={active}
              className={`rounded-xl border p-4 text-left transition-colors ${
                active
                  ? "border-neon-500 bg-neon-500/10"
                  : "border-ink-700 bg-ink-900/60 hover:border-ink-600"
              }`}
            >
              <p className="text-lg font-extrabold text-white">
                {option.tickets}{" "}
                <span className="text-sm font-semibold text-mist-400">{ticketWord(option.tickets)}</span>
              </p>
              <p className="mt-1 text-sm font-semibold text-aqua-400">{money(option.priceCents)}</p>
              {option.label && <p className="mt-1 text-[11px] font-medium text-lime-500">{option.label}</p>}
            </button>
          );
        })}
      </div>

      {pack && (
        <p className="mt-4 text-xs text-mist-400">
          {money(Math.round(perTicket))} por boleto
          {saving > 0 && <> · ahorras {money(saving)} frente a comprarlos sueltos</>}
        </p>
      )}

      <div className="mt-5 space-y-3">
        {buyState.error && <Alert tone="error">{buyState.error}</Alert>}
        {buyState.ok && <Alert tone="ok">{buyState.ok}</Alert>}

        <form action={buy}>
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="pack" value={selected} />
          <SubmitButton>
            {isAuthenticated
              ? `Participar por ${pack ? money(pack.priceCents) : ""}`
              : "Entrar y participar"}
          </SubmitButton>
        </form>

        <p className="text-center text-[11px] text-mist-400">
          Demo: el pago está simulado, no se cobra ni se piden datos de tarjeta.
        </p>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-ink-800" />
          <span className="text-[11px] uppercase tracking-wide text-mist-400">o gratis</span>
          <span className="h-px flex-1 bg-ink-800" />
        </div>

        {freeState.error && <Alert tone="error">{freeState.error}</Alert>}
        {freeState.ok && <Alert tone="ok">{freeState.ok}</Alert>}

        {hasFreeTicket ? (
          <p className="rounded-xl border border-ink-700 bg-ink-900/60 px-4 py-3 text-center text-sm text-mist-400">
            Ya reclamaste tu boleto gratis de este sorteo.
          </p>
        ) : (
          <form action={claimFree}>
            <input type="hidden" name="slug" value={slug} />
            <SubmitButton variant="ghost">Reclamar mi boleto gratis</SubmitButton>
          </form>
        )}
      </div>

      <p className="mt-5 border-t border-ink-800 pt-4 text-xs leading-relaxed text-mist-400">
        Quedan {ticketsLeft.toLocaleString("es-MX")} boletos. Al participar aceptas las{" "}
        <Link href="/legal/bases" className="text-mist-200 underline underline-offset-2">
          bases del sorteo
        </Link>
        .
      </p>
    </div>
  );
}
