import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LEGAL_DOCS } from "@/lib/legal";

export function generateStaticParams() {
  return Object.keys(LEGAL_DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  const legal = LEGAL_DOCS[doc];
  return { title: legal?.title ?? "Documento no encontrado" };
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const legal = LEGAL_DOCS[doc];
  if (!legal) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <nav className="mb-6 flex flex-wrap gap-2 text-sm">
        {Object.values(LEGAL_DOCS).map((item) => (
          <Link
            key={item.slug}
            href={`/legal/${item.slug}`}
            className={`chip px-3.5 py-2 ${item.slug === legal.slug ? "chip-active" : ""}`}
          >
            {item.title}
          </Link>
        ))}
      </nav>

      <h1 className="headline text-3xl text-white sm:text-4xl">{legal.title}</h1>
      <p className="mt-2 text-sm text-mist-400">Última actualización: {legal.updated}</p>
      <p className="mt-6 text-base leading-relaxed text-mist-300">{legal.intro}</p>

      <div className="mt-10 space-y-8">
        {legal.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">{section.heading}</h2>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-mist-400">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 rounded-2xl border border-ink-700 bg-ink-900/60 p-5 text-xs leading-relaxed text-mist-400">
        Aviso: GG Play es un proyecto de demostración. Estos textos son un ejemplo de estructura y no
        constituyen asesoramiento legal. Antes de operar un sorteo real hay que revisarlos con
        asesoría jurídica en cada país.
      </p>
    </div>
  );
}
