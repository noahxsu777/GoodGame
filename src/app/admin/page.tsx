import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Badge, SectionHeading, Stat } from "@/components/ui";
import { CreateGiveawayForm, DrawForm, StatusForm } from "@/components/admin-forms";
import { listGiveaways, platformStats } from "@/lib/queries";
import { currentUser } from "@/lib/session";
import { longDate, money, number } from "@/lib/format";

export const metadata: Metadata = { title: "Panel de administración" };

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect("/entrar?next=%2Fadmin");
  if (user.role !== "admin") redirect("/cuenta");

  const [giveaways, stats] = await Promise.all([
    listGiveaways(["draft", "live", "closed", "drawn"]),
    platformStats(),
  ]);

  const pending = giveaways.filter((g) => g.status !== "drawn");
  const revenue = giveaways.reduce((sum, g) => sum + g.ticketsSold * g.ticketPriceCents, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Administración"
        title="Panel de sorteos"
        description="Publica, cierra y ejecuta sorteos. La semilla secreta se genera al crear el sorteo y su hash queda publicado desde ese momento."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <Stat value={number(stats.members)} label="Miembros" />
        <Stat value={number(stats.ticketsSold)} label="Boletos emitidos" />
        <Stat value={money(revenue)} label="Recaudación bruta" />
        <Stat value={number(pending.length)} label="Sorteos activos" />
      </div>

      <section className="mt-14">
        <h2 className="headline text-xl text-white sm:text-2xl">Sorteos</h2>
        <div className="mt-6 space-y-4">
          {giveaways.map((g) => {
            const readyToDraw = g.status !== "drawn" && g.ticketsSold >= g.minTickets;
            return (
              <article key={g.id} className="panel p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {g.status === "draft" && <Badge>Borrador</Badge>}
                      {g.status === "live" && <Badge tone="live">Venta abierta</Badge>}
                      {g.status === "closed" && <Badge tone="warn">Venta cerrada</Badge>}
                      {g.status === "drawn" && <Badge tone="done">Sorteado</Badge>}
                      <span className="text-xs text-mist-400">{longDate(g.drawAt)}</span>
                    </div>
                    <h3 className="font-display mt-2 text-lg font-bold tracking-tight text-white">
                      {g.art.emoji} {g.title}
                    </h3>
                    <p className="mt-1 text-sm text-mist-400">
                      {number(g.ticketsSold)} / {number(g.totalTickets)} boletos ·{" "}
                      {number(g.participants)} participantes · mínimo {number(g.minTickets)} ·{" "}
                      {money(g.ticketsSold * g.ticketPriceCents)} recaudados
                    </p>
                    <p className="mt-2 break-all font-mono text-[11px] text-mist-400">
                      seedHash {g.seedHash}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Link
                      href={`/sorteos/${g.slug}`}
                      className="text-sm font-semibold text-aqua-400 hover:underline"
                    >
                      Ver ficha pública
                    </Link>
                    {g.status !== "drawn" && <StatusForm giveawayId={g.id} status={g.status} />}
                  </div>
                </div>

                {g.status === "drawn" && g.result ? (
                  <div className="mt-5 border border-ink-700 bg-void p-4 text-sm">
                    <p className="text-white">
                      Boleto ganador{" "}
                      <span className="font-mono text-aqua-400">#{g.result.winningTicket}</span> —{" "}
                      {g.result.winnerName}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-mist-400">
                      publicSeed «{g.result.publicSeed}» · {number(g.result.ticketsSold)} boletos
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 border-t border-ink-800 pt-5">
                    {readyToDraw ? (
                      <DrawForm giveawayId={g.id} />
                    ) : (
                      <p className="text-sm text-mist-400">
                        Faltan {number(Math.max(0, g.minTickets - g.ticketsSold))} boletos para poder
                        ejecutar el sorteo.
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="headline text-xl text-white sm:text-2xl">Crear un sorteo nuevo</h2>
        <div className="panel mt-6 p-6">
          <CreateGiveawayForm />
        </div>
      </section>
    </div>
  );
}
