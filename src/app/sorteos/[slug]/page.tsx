import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Countdown } from "@/components/countdown";
import { PrizeArt } from "@/components/prize-art";
import { TicketPicker } from "@/components/ticket-picker";
import { Alert, Badge, Progress } from "@/components/ui";
import { GiveawayCard } from "@/components/giveaway-card";
import {
  getGiveaway,
  hasFreeTicket,
  listOpenGiveaways,
  userTicketsIn,
} from "@/lib/queries";
import { currentUser } from "@/lib/session";
import {
  CATEGORY_LABEL,
  countryFlag,
  countryName,
  longDate,
  money,
  number,
  ticketCode,
} from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const giveaway = await getGiveaway(slug);
  if (!giveaway) return { title: "Sorteo no encontrado" };
  return { title: giveaway.title, description: giveaway.tagline };
}

export default async function GiveawayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const giveaway = await getGiveaway(slug);
  if (!giveaway) notFound();

  const user = await currentUser();
  const [myTickets, usedFree, others] = await Promise.all([
    user ? userTicketsIn(user.id, giveaway.id) : Promise.resolve([]),
    user ? hasFreeTicket(user.id, giveaway.id) : Promise.resolve(false),
    listOpenGiveaways(),
  ]);

  const related = others.filter((g) => g.id !== giveaway.id).slice(0, 3);
  const minReached = giveaway.ticketsSold >= giveaway.minTickets;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-sm text-mist-400">
        <Link href="/sorteos" className="hover:text-white">
          Sorteos
        </Link>
        <span className="px-2">/</span>
        <span className="text-mist-300">{giveaway.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div>
          <div className="panel hud overflow-hidden" style={{ ["--cut" as string]: "22px" }}>
            <PrizeArt art={giveaway.art} size="wide" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {giveaway.status === "live" && (
              <Badge tone="live">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime-500" /> Venta abierta
              </Badge>
            )}
            {giveaway.status === "closed" && <Badge tone="warn">Venta cerrada</Badge>}
            {giveaway.status === "drawn" && <Badge tone="done">Sorteado</Badge>}
            <Badge>{CATEGORY_LABEL[giveaway.category]}</Badge>
            <Badge tone="free">1 boleto gratis por cuenta</Badge>
          </div>

          <h1 className="headline mt-5 text-3xl text-white sm:text-5xl">
            {giveaway.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-mist-300">{giveaway.tagline}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="panel p-5">
              <p className="text-xs uppercase tracking-wide text-mist-400">Valor del premio</p>
              <p className="mt-1 text-xl font-extrabold text-white">{money(giveaway.retailCents)}</p>
            </div>
            <div className="panel p-5">
              <p className="text-xs uppercase tracking-wide text-mist-400">Participantes</p>
              <p className="mt-1 text-xl font-extrabold text-white">{number(giveaway.participants)}</p>
            </div>
            <div className="panel p-5">
              <p className="text-xs uppercase tracking-wide text-mist-400">Boletos vendidos</p>
              <p className="mt-1 text-xl font-extrabold text-white">
                {number(giveaway.ticketsSold)}
                <span className="text-sm font-medium text-mist-400"> / {number(giveaway.totalTickets)}</span>
              </p>
            </div>
          </div>

          <div className="panel mt-6 p-6">
            <Progress
              value={giveaway.progress}
              label={
                minReached
                  ? `Mínimo alcanzado (${number(giveaway.minTickets)} boletos): el sorteo se ejecuta sí o sí.`
                  : `Faltan ${number(giveaway.minTickets - giveaway.ticketsSold)} boletos para alcanzar el mínimo de ${number(
                      giveaway.minTickets,
                    )}.`
              }
            />
          </div>

          <section className="mt-10">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">Qué incluye el premio</h2>
            <ul className="mt-4 space-y-2.5">
              {giveaway.prize.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-mist-300">
                  <span aria-hidden className="mt-0.5 text-lime-500">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-mist-400">{giveaway.description}</p>
          </section>

          {/* -------------------------------------------------- verificabilidad */}
          <section className="panel mt-10 p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">Sorteo verificable</h2>
              <Link href="/verificar" className="text-sm font-semibold text-aqua-400 hover:underline">
                Comprobar
              </Link>
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-mist-400">
                  Compromiso publicado el {longDate(giveaway.createdAt)}
                </dt>
                <dd className="mt-1 break-all font-mono text-xs text-aqua-400">{giveaway.seedHash}</dd>
              </div>

              {giveaway.result ? (
                <>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-mist-400">Semilla pública (del directo)</dt>
                    <dd className="mt-1 font-mono text-xs text-neon-400">{giveaway.result.publicSeed}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-mist-400">Semilla secreta revelada</dt>
                    <dd className="mt-1 break-all font-mono text-xs text-mist-300">{giveaway.result.serverSeed}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-mist-400">Boletos en el bombo</dt>
                    <dd className="mt-1 font-mono text-xs text-mist-300">{number(giveaway.result.ticketsSold)}</dd>
                  </div>
                </>
              ) : (
                <p className="text-sm leading-relaxed text-mist-400">
                  La semilla secreta se revela cuando el sorteo se ejecute en directo. Hasta entonces
                  solo existe su hash, publicado arriba: si lo cambiásemos, dejaría de coincidir.
                </p>
              )}
            </dl>
          </section>

          {giveaway.result && (
            <section className="panel mt-6 border-aqua-500/40 p-6">
              <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">Resultado</h2>
              <div className="mt-4 flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-mist-400">Boleto ganador</p>
                  <p className="mt-1 text-3xl font-black text-aqua-400">
                    {ticketCode(giveaway.result.winningTicket)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-mist-400">Ganador</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {countryFlag(giveaway.result.winnerCountry)} {giveaway.result.winnerName}
                  </p>
                  <p className="text-sm text-mist-400">{countryName(giveaway.result.winnerCountry)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-mist-400">Fecha</p>
                  <p className="mt-1 text-sm text-mist-300">{longDate(giveaway.result.drawnAt)}</p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* --------------------------------------------------------- barra lateral */}
        <aside className="space-y-6 lg:sticky lg:top-24">
          <div className="panel p-6">
            <p className="text-xs uppercase tracking-wide text-mist-400">
              {giveaway.status === "drawn" ? "Sorteado el" : "Sorteo en vivo"}
            </p>
            <p className="mt-1 text-sm font-semibold text-white">{longDate(giveaway.drawAt)}</p>
            {giveaway.status !== "drawn" && (
              <div className="mt-4">
                <Countdown to={giveaway.drawAt} />
              </div>
            )}
            <a
              href={giveaway.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-ghost mt-5 w-full py-3 text-[11px]"
            >
              Ver el directo ↗
            </a>
          </div>

          {myTickets.length > 0 && (
            <div className="panel p-6">
              <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                Tus boletos ({myTickets.length})
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {myTickets.slice(0, 30).map((t) => (
                  <span
                    key={t}
                    className={`rounded-lg border px-2 py-1 font-mono text-xs ${
                      giveaway.result?.winningTicket === t
                        ? "border-lime-500 bg-lime-500/15 text-lime-500"
                        : "border-ink-700 bg-ink-900 text-mist-300"
                    }`}
                  >
                    {ticketCode(t)}
                  </span>
                ))}
                {myTickets.length > 30 && (
                  <span className="px-2 py-1 text-xs text-mist-400">+{myTickets.length - 30} más</span>
                )}
              </div>
            </div>
          )}

          {giveaway.status === "live" ? (
            <TicketPicker
              slug={giveaway.slug}
              packs={giveaway.packs}
              ticketPriceCents={giveaway.ticketPriceCents}
              isAuthenticated={Boolean(user)}
              hasFreeTicket={usedFree}
              ticketsLeft={giveaway.ticketsLeft}
            />
          ) : (
            <Alert tone="info">
              {giveaway.status === "closed"
                ? "La venta de boletos está cerrada. El sorteo se ejecuta en el próximo directo."
                : "Este sorteo ya se ejecutó. Mira los que están abiertos ahora mismo."}
            </Alert>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="headline text-xl text-white sm:text-2xl">También abiertos</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((g) => (
              <GiveawayCard key={g.id} giveaway={g} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
