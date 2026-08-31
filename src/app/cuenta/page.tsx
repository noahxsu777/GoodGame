import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Badge, SectionHeading, Stat } from "@/components/ui";
import { entriesForUser } from "@/lib/queries";
import { currentUser } from "@/lib/session";
import { countryFlag, countryName, money, number, shortDate, ticketCode } from "@/lib/format";

export const metadata: Metadata = { title: "Mi cuenta" };

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/entrar?next=%2Fcuenta");

  const entries = await entriesForUser(user.id);
  const tickets = entries.reduce((sum, e) => sum + e.entry.tickets.length, 0);
  const spent = entries.reduce((sum, e) => sum + e.entry.amountCents, 0);
  const wins = entries.filter((e) => e.won);
  const activeGiveaways = new Set(
    entries.filter((e) => e.giveaway.status !== "drawn").map((e) => e.giveaway.id),
  ).size;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-center gap-4">
        <span
          aria-hidden
          className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-neon-500 to-aqua-500 text-xl font-black text-ink-950"
        >
          {user.name.slice(0, 2).toUpperCase()}
        </span>
        <div>
          <h1 className="headline text-2xl text-white">Hola, {user.name.split(" ")[0]}</h1>
          <p className="text-sm text-mist-400">
            {countryFlag(user.country)} {countryName(user.country)} · miembro desde{" "}
            {shortDate(user.createdAt)}
          </p>
        </div>
        {user.role === "admin" && (
          <Link
            href="/admin"
            className="btn btn-ghost ml-auto px-5 py-3 text-[11px]"
          >
            Panel de administración
          </Link>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <Stat value={number(tickets)} label="Boletos totales" />
        <Stat value={number(activeGiveaways)} label="Sorteos activos" />
        <Stat value={money(spent)} label="Invertido" />
        <Stat value={number(wins.length)} label="Premios ganados" />
      </div>

      {wins.length > 0 && (
        <section className="mt-12">
          <SectionHeading eyebrow="Enhorabuena" title="Premios que ganaste" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {wins.map(({ giveaway, entry }) => (
              <Link
                key={entry.id}
                href={`/sorteos/${giveaway.slug}`}
                className="panel panel-hover border-lime-500/40 p-5"
              >
                <Badge tone="live">Ganador</Badge>
                <p className="mt-3 font-bold text-white">{giveaway.title}</p>
                <p className="mt-1 text-sm text-mist-400">
                  Boleto {ticketCode(giveaway.result?.winningTicket ?? 0)} ·{" "}
                  {shortDate(giveaway.result?.drawnAt ?? giveaway.drawAt)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <SectionHeading
          eyebrow="Historial"
          title="Tus participaciones"
          action={{ href: "/sorteos", label: "Participar en otro" }}
        />

        {entries.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-ink-700 p-12 text-center">
            <p className="text-sm text-mist-400">
              Todavía no tienes boletos. Reclama el gratuito en cualquier sorteo abierto y ya estás
              dentro del bombo.
            </p>
            <Link
              href="/sorteos"
              className="btn btn-primary mt-7 px-6 py-3.5 text-xs"
            >
              Ver sorteos abiertos
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-mist-400">
                  <th className="px-4 py-2 font-semibold">Sorteo</th>
                  <th className="px-4 py-2 font-semibold">Boletos</th>
                  <th className="px-4 py-2 font-semibold">Importe</th>
                  <th className="px-4 py-2 font-semibold">Fecha</th>
                  <th className="px-4 py-2 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(({ entry, giveaway, won }) => (
                  <tr key={entry.id} className="bg-ink-900/70">
                    <td className="rounded-l-xl border-y border-l border-ink-800 px-4 py-3">
                      <Link href={`/sorteos/${giveaway.slug}`} className="font-semibold text-white hover:underline">
                        {giveaway.art.emoji} {giveaway.title}
                      </Link>
                      <p className="mt-0.5 font-mono text-[11px] text-mist-400">{entry.reference}</p>
                    </td>
                    <td className="border-y border-ink-800 px-4 py-3 text-mist-300">
                      <span className="font-mono text-xs">
                        {entry.tickets.slice(0, 4).map(ticketCode).join(" ")}
                        {entry.tickets.length > 4 && ` +${entry.tickets.length - 4}`}
                      </span>
                    </td>
                    <td className="border-y border-ink-800 px-4 py-3 text-mist-300">
                      {entry.source === "gratis" ? (
                        <span className="text-lime-500">Gratis</span>
                      ) : (
                        money(entry.amountCents)
                      )}
                    </td>
                    <td className="border-y border-ink-800 px-4 py-3 text-mist-400">
                      {shortDate(entry.createdAt)}
                    </td>
                    <td className="rounded-r-xl border-y border-r border-ink-800 px-4 py-3">
                      {won ? (
                        <Badge tone="live">Ganaste</Badge>
                      ) : giveaway.status === "drawn" ? (
                        <Badge>Sin premio</Badge>
                      ) : giveaway.status === "closed" ? (
                        <Badge tone="warn">En espera</Badge>
                      ) : (
                        <Badge tone="done">En juego</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
