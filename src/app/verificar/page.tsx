import type { Metadata } from "next";
import { Verifier, type VerifiableDraw } from "@/components/verifier";
import { SectionHeading } from "@/components/ui";
import { listWinners } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Verificar un sorteo",
  description:
    "Recalcula tú mismo el boleto ganador de cualquier sorteo de GG Play con las semillas publicadas.",
};

const STEPS = [
  {
    title: "Antes de vender el primer boleto",
    body: "Generamos una semilla secreta aleatoria y publicamos su hash SHA-256 en la ficha del sorteo. A partir de ahí el resultado ya está condicionado: cambiar la semilla rompería el hash y quedaría a la vista.",
  },
  {
    title: "Durante el directo",
    body: "La audiencia aporta la semilla pública: una frase del chat, un número dicho en voz alta, el minuto exacto de la transmisión. No la controlamos ni la conocemos de antemano.",
  },
  {
    title: "El cálculo",
    body: "hmac_sha256(semilla secreta, «semilla pública:boletos vendidos») da un valor hexadecimal. Tomamos sus primeros 52 bits, calculamos el resto de dividir entre los boletos vendidos y sumamos uno. Ese es el boleto ganador.",
  },
  {
    title: "Después del sorteo",
    body: "Revelamos la semilla secreta. Con los cuatro datos —hash, semilla secreta, semilla pública y boletos vendidos— cualquiera repite la operación aquí mismo, en su propio navegador.",
  },
];

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ sorteo?: string }>;
}) {
  const { sorteo } = await searchParams;
  const winners = await listWinners();

  const draws: VerifiableDraw[] = winners
    .filter((g) => g.result)
    .map((g) => ({
      slug: g.slug,
      title: g.title,
      seedHash: g.result!.seedHash,
      serverSeed: g.result!.serverSeed,
      publicSeed: g.result!.publicSeed,
      ticketsSold: g.result!.ticketsSold,
      winningTicket: g.result!.winningTicket,
    }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Transparencia"
        title="Comprueba el sorteo por tu cuenta"
        description="El cálculo corre en tu navegador con el mismo código que usa el servidor. No tienes que fiarte de lo que te responda nuestra API."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <ol className="space-y-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card p-6">
              <span className="text-xs font-black tracking-widest text-neon-400">
                0{i + 1}
              </span>
              <h3 className="mt-2 text-base font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-400">{step.body}</p>
            </li>
          ))}
        </ol>

        <Verifier draws={draws} initialSlug={sorteo} />
      </div>
    </div>
  );
}
