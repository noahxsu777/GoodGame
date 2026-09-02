import Link from "next/link";
import { Badge, LiveDot, Progress } from "./ui";
import { Countdown } from "./countdown";
import { PrizeArt } from "./prize-art";
import { CATEGORY_LABEL, money, number } from "@/lib/format";
import type { GiveawayView } from "@/lib/queries";

export function GiveawayCard({
  giveaway,
  featured = false,
}: {
  giveaway: GiveawayView;
  featured?: boolean;
}) {
  const closingSoon =
    giveaway.status === "live" && new Date(giveaway.drawAt).getTime() - Date.now() < 5 * 86400_000;

  return (
    <Link
      href={`/sorteos/${giveaway.slug}`}
      className={`panel panel-hover group flex h-full flex-col overflow-hidden ${featured ? "lg:min-h-full" : ""}`}
    >
      <div className="relative">
        <PrizeArt art={giveaway.art} size={featured ? "wide" : "card"} alt={giveaway.title} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-void/10" />
        <div className="absolute left-3 top-3 z-[2] flex gap-2">
          {giveaway.status === "live" && (
            <Badge tone="live">
              <LiveDot /> Abierto
            </Badge>
          )}
          {giveaway.status === "closed" && <Badge tone="warn">Venta cerrada</Badge>}
          {giveaway.status === "drawn" && <Badge tone="done">Sorteado</Badge>}
        </div>
        <span className="absolute right-3 top-3 z-[2] rounded-full border border-white/15 bg-void/50 px-2.5 py-1 text-[11px] text-mist-200 backdrop-blur">
          {CATEGORY_LABEL[giveaway.category]}
        </span>
        <span className="absolute bottom-3 left-3 z-[2] text-[12px] font-medium text-white">
          Valor {money(giveaway.retailCents)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className={`font-display leading-tight tracking-tight text-white ${featured ? "text-2xl font-semibold" : "text-[17px] font-semibold"}`}>
          {giveaway.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist-400">{giveaway.tagline}</p>

        <div className="mt-5">
          <Progress
            value={giveaway.progress}
            label={
              <span className="flex items-center justify-between font-mono text-[11px] text-mist-400">
                <span>
                  {number(giveaway.ticketsSold)}/{number(giveaway.totalTickets)}
                </span>
                <span>{number(giveaway.participants)} jugadores</span>
              </span>
            }
          />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/8 pt-4">
          {giveaway.status === "drawn" ? (
            <>
              <span className="text-[13px] text-mist-400">Gano</span>
              <span className="truncate text-sm font-semibold text-lime-400">{giveaway.result?.winnerName}</span>
            </>
          ) : (
            <>
              <span className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${closingSoon ? "text-flame-500" : "text-mist-400"}`}>
                {closingSoon ? "Cierra pronto" : "Sortea en"}
              </span>
              <Countdown to={giveaway.drawAt} compact />
            </>
          )}
        </div>

        {giveaway.status === "live" && (
          <p className="mt-4 flex items-center justify-between text-[13px] text-mist-300">
            <span>Desde {money(giveaway.ticketPriceCents)}</span>
            <span className="text-aqua-400 transition-transform duration-300 group-hover:translate-x-1">Participar</span>
          </p>
        )}
      </div>
    </Link>
  );
}
