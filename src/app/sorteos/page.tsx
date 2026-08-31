import Link from "next/link";
import type { Metadata } from "next";
import { GiveawayCard } from "@/components/giveaway-card";
import { SectionHeading } from "@/components/ui";
import { listGiveaways } from "@/lib/queries";
import { CATEGORY_LABEL } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sorteos abiertos",
  description: "Consolas, PCs y periféricos sorteados en vivo cada mes para toda LATAM.",
};

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "consolas", label: CATEGORY_LABEL.consolas },
  { key: "pc", label: CATEGORY_LABEL.pc },
  { key: "perifericos", label: CATEGORY_LABEL.perifericos },
  { key: "movil", label: CATEGORY_LABEL.movil },
];

export default async function SorteosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria = "todos" } = await searchParams;
  const all = await listGiveaways();
  const open = all.filter((g) => g.status === "live");
  const closed = all.filter((g) => g.status === "closed");
  const drawn = all.filter((g) => g.status === "drawn");

  const filtered = categoria === "todos" ? open : open.filter((g) => g.category === categoria);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Sorteos"
        title="Todo lo que se está sorteando ahora"
        description="El precio del boleto, el mínimo para que el sorteo se ejecute y la fecha del directo están publicados desde el primer día. Sin letra chica."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = categoria === filter.key;
          return (
            <Link
              key={filter.key}
              href={filter.key === "todos" ? "/sorteos" : `/sorteos?categoria=${filter.key}`}
              className={`chip px-4 py-2.5 ${active ? "chip-active" : ""}`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((giveaway) => (
            <GiveawayCard key={giveaway.id} giveaway={giveaway} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl border border-dashed border-ink-700 p-10 text-center text-sm text-mist-400">
          No hay sorteos abiertos en esta categoría. Prueba con otra o vuelve el viernes: publicamos
          uno nuevo cada semana.
        </p>
      )}

      {closed.length > 0 && (
        <section className="mt-20">
          <SectionHeading
            eyebrow="Venta cerrada"
            title="Pendientes de sorteo en el próximo directo"
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {closed.map((giveaway) => (
              <GiveawayCard key={giveaway.id} giveaway={giveaway} />
            ))}
          </div>
        </section>
      )}

      {drawn.length > 0 && (
        <section className="mt-20">
          <SectionHeading
            eyebrow="Historial"
            title="Sorteos ya ejecutados"
            action={{ href: "/ganadores", label: "Ver ganadores" }}
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {drawn.map((giveaway) => (
              <GiveawayCard key={giveaway.id} giveaway={giveaway} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
