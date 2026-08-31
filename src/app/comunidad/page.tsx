import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { PrizeArt } from "@/components/prize-art";
import { listPosts } from "@/lib/queries";
import { shortDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Comunidad",
  description: "Noticias, podcast y directos de GG Play.",
};

const TABS = [
  { key: "todo", label: "Todo" },
  { key: "noticia", label: "Noticias" },
  { key: "podcast", label: "Podcast" },
  { key: "stream", label: "Directos" },
];

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo = "todo" } = await searchParams;
  const posts = await listPosts();
  const filtered = tipo === "todo" ? posts : posts.filter((p) => p.kind === tipo);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Comunidad"
        title="Lo que pasa entre sorteo y sorteo"
        description="Podcast quincenal, directos de los viernes y análisis con precios reales de la región, no los de la tienda gringa."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active = tipo === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.key === "todo" ? "/comunidad" : `/comunidad?tipo=${tab.key}`}
              className={`chip px-4 py-2.5 ${active ? "chip-active" : ""}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link key={post.id} href={`/comunidad/${post.slug}`} className="panel panel-hover group overflow-hidden">
            <div className="sheen">
              <PrizeArt art={post.art} size="card" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-neon-400">
                <span>{post.kind}</span>
                {post.duration && <span className="text-mist-400">· {post.duration}</span>}
              </div>
              <h2 className="font-display mt-2.5 text-base font-bold uppercase leading-tight tracking-tight text-white">{post.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-mist-400">{post.excerpt}</p>
              <p className="mt-4 text-xs text-mist-400">
                {post.author} · {shortDate(post.publishedAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 rounded-2xl border border-dashed border-ink-700 p-10 text-center text-sm text-mist-400">
          Todavía no hay nada publicado en esta sección.
        </p>
      )}
    </div>
  );
}
