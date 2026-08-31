import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PrizeArt } from "@/components/prize-art";
import { getPost, listPosts } from "@/lib/queries";
import { shortDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Publicación no encontrada" };
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const more = (await listPosts()).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <nav className="mb-6 text-sm text-mist-400">
        <Link href="/comunidad" className="hover:text-white">
          Comunidad
        </Link>
        <span className="px-2">/</span>
        <span className="capitalize text-mist-300">{post.kind}</span>
      </nav>

      <div className="panel hud overflow-hidden" style={{ ["--cut" as string]: "20px" }}>
        <PrizeArt art={post.art} size="hero" />
      </div>

      <h1 className="mt-8 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-mist-400">
        {post.author} · {shortDate(post.publishedAt)}
        {post.duration ? ` · ${post.duration}` : ""}
      </p>

      <div className="mt-8 space-y-5">
        {post.body.map((paragraph, i) => (
          <p key={i} className="text-base leading-relaxed text-mist-300">
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mt-16 border-t border-ink-800 pt-10">
        <h2 className="text-lg font-extrabold text-white">Sigue leyendo</h2>
        <div className="mt-5 space-y-3">
          {more.map((p) => (
            <Link
              key={p.id}
              href={`/comunidad/${p.slug}`}
              className="panel panel-hover flex min-w-0 items-center gap-4 p-4"
            >
              <span className="shrink-0">
                <PrizeArt art={p.art} size="tile" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white">{p.title}</span>
                <span className="block text-xs text-mist-400">
                  {p.kind} · {shortDate(p.publishedAt)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
