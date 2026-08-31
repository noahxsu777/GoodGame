import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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

      <div
        className="flex h-48 items-center justify-center rounded-3xl text-6xl"
        style={{ background: `linear-gradient(135deg, ${post.art.from}, ${post.art.to})` }}
        aria-hidden
      >
        {post.art.emoji}
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
              className="card card-hover flex min-w-0 items-center gap-4 p-4"
            >
              <span
                aria-hidden
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl"
                style={{ background: `linear-gradient(135deg, ${p.art.from}, ${p.art.to})` }}
              >
                {p.art.emoji}
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
