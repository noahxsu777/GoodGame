import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading, Stat } from "@/components/ui";
import { listWinners, platformStats } from "@/lib/queries";
import { countryFlag, countryName, longDate, money, number, ticketCode } from "@/lib/format";

export const metadata: Metadata = {
  title: "Ganadores",
  description: "Todos los sorteos ya ejecutados de GG Play, con su comprobación pública.",
};

export default async function WinnersPage() {
  const [winners, stats] = await Promise.all([listWinners(), platformStats()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Historial completo"
        title="Quién ganó, con qué boleto y cómo comprobarlo"
        description="Publicamos el nombre tal y como aparece en la cuenta y el país. No mostramos correos ni datos de contacto de nadie."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat value={`${stats.prizesDelivered}`} label="Sorteos ejecutados" />
        <Stat value={money(stats.prizeValueCents)} label="Entregado en premios" />
        <Stat value="100%" label="Con semilla revelada" />
      </div>

      <div className="mt-10 space-y-5">
        {winners.map((g) => (
          <article key={g.id} className="card p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <span
                aria-hidden
                className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-4xl"
                style={{ background: `linear-gradient(135deg, ${g.art.from}, ${g.art.to})` }}
              >
                {g.art.emoji}
              </span>

              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-white">{g.title}</h2>
                <p className="mt-1 text-sm text-mist-400">
                  {longDate(g.result?.drawnAt ?? g.drawAt)} · {number(g.result?.ticketsSold ?? 0)} boletos
                  en el bombo · valor {money(g.retailCents)}
                </p>
                <p className="mt-3 text-sm text-mist-300">
                  Ganó{" "}
                  <span className="font-semibold text-white">
                    {countryFlag(g.result?.winnerCountry ?? "")} {g.result?.winnerName}
                  </span>{" "}
                  desde {countryName(g.result?.winnerCountry ?? "")} con el boleto{" "}
                  <span className="font-mono text-aqua-400">{ticketCode(g.result?.winningTicket ?? 0)}</span>
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:w-44">
                <Link
                  href={`/sorteos/${g.slug}`}
                  className="rounded-xl border border-ink-700 px-4 py-2.5 text-center text-sm font-semibold text-mist-200 hover:text-white"
                >
                  Ver sorteo
                </Link>
                <Link
                  href={`/verificar?sorteo=${g.slug}`}
                  className="rounded-xl bg-gradient-to-r from-neon-500 to-aqua-500 px-4 py-2.5 text-center text-sm font-bold text-ink-950"
                >
                  Verificar
                </Link>
              </div>
            </div>

            <details className="mt-5 border-t border-ink-800 pt-4">
              <summary className="cursor-pointer text-sm font-semibold text-mist-300">
                Ver semillas y hash del sorteo
              </summary>
              <dl className="mt-3 space-y-2 font-mono text-xs">
                <div>
                  <dt className="text-mist-400">seedHash</dt>
                  <dd className="break-all text-aqua-400">{g.result?.seedHash}</dd>
                </div>
                <div>
                  <dt className="text-mist-400">serverSeed</dt>
                  <dd className="break-all text-mist-300">{g.result?.serverSeed}</dd>
                </div>
                <div>
                  <dt className="text-mist-400">publicSeed</dt>
                  <dd className="break-all text-neon-400">{g.result?.publicSeed}</dd>
                </div>
                <div>
                  <dt className="text-mist-400">hmac</dt>
                  <dd className="break-all text-mist-400">{g.result?.digest}</dd>
                </div>
              </dl>
            </details>
          </article>
        ))}
      </div>
    </div>
  );
}
