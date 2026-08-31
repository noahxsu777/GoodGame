import Link from "next/link";
import { Badge, Progress } from "./ui";
import { Countdown } from "./countdown";
import { CATEGORY_LABEL, money, number } from "@/lib/format";
import type { GiveawayView } from "@/lib/queries";

export function GiveawayCard({ giveaway }: { giveaway: GiveawayView }) {
  const closingSoon =
    giveaway.status === "live" && new Date(giveaway.drawAt).getTime() - Date.now() < 5 * 86400_000;

  return (
    <Link
      href={`/sorteos/${giveaway.slug}`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      <div
        className="relative flex h-40 items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${giveaway.art.from}, ${giveaway.art.to})` }}
      >
        <span aria-hidden className="text-6xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
          {giveaway.art.emoji}
        </span>
        <div className="absolute left-3 top-3 flex gap-2">
          {giveaway.status === "live" && (
            <Badge tone="live">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime-500" /> Abierto
            </Badge>
          )}
          {giveaway.status === "closed" && <Badge tone="warn">Venta cerrada</Badge>}
          {giveaway.status === "drawn" && <Badge tone="done">Sorteado</Badge>}
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-ink-950/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          {CATEGORY_LABEL[giveaway.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug text-white">{giveaway.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-mist-400">{giveaway.tagline}</p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-mist-400">
            Valor <span className="font-semibold text-mist-200">{money(giveaway.retailCents)}</span>
          </span>
          {giveaway.status === "live" ? (
            <span className="text-mist-400">
              Boleto <span className="font-semibold text-white">{money(giveaway.ticketPriceCents)}</span>
            </span>
          ) : giveaway.result ? (
            <span className="text-aqua-400">Boleto #{number(giveaway.result.winningTicket)}</span>
          ) : null}
        </div>

        <div className="mt-4">
          <Progress
            value={giveaway.progress}
            label={`${number(giveaway.ticketsSold)} de ${number(giveaway.totalTickets)} boletos · ${number(
              giveaway.participants,
            )} participantes`}
          />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-ink-800 pt-4 text-sm">
          {giveaway.status === "drawn" ? (
            <span className="text-mist-400">
              Ganó <span className="font-semibold text-white">{giveaway.result?.winnerName}</span>
            </span>
          ) : (
            <>
              <span className={closingSoon ? "text-flame-500" : "text-mist-400"}>
                {closingSoon ? "Cierra pronto" : "Sortea en"}
              </span>
              <Countdown to={giveaway.drawAt} compact />
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
