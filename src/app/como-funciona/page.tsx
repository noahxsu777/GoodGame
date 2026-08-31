import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description: "Del registro al envío del premio: cada paso de un sorteo de GG Play, explicado.",
};

const FLOW = [
  {
    n: "01",
    title: "Te registras gratis",
    body: "Nombre, correo y país. No pedimos tarjeta para crear la cuenta y puedes borrarla desde tu perfil cuando quieras.",
  },
  {
    n: "02",
    title: "Eliges sorteo y boletos",
    body: `Cada boleto vale ${money(200)} y hay paquetes con descuento. También puedes reclamar un boleto gratuito por sorteo, que entra en el mismo bombo con las mismas probabilidades.`,
  },
  {
    n: "03",
    title: "Recibes tus números",
    body: "Los boletos se asignan de forma correlativa en el mismo instante de la compra. Los ves en tu cuenta y en la ficha del sorteo.",
  },
  {
    n: "04",
    title: "Se ejecuta el sorteo en directo",
    body: "En la fecha publicada, con la semilla que aporta el chat. Dura menos de cinco minutos y se hace al inicio de la transmisión.",
  },
  {
    n: "05",
    title: "Compruebas el resultado",
    body: "Revelamos la semilla secreta y el número sale de una cuenta que puedes repetir tú. Nada de «confía en nosotros».",
  },
  {
    n: "06",
    title: "Te enviamos el premio",
    body: "Contactamos al ganador por correo en menos de 24 horas. Envío con seguro y aduana pagada, o el valor en efectivo si prefieres.",
  },
];

const RULES = [
  ["Edad mínima", "18 años cumplidos, o la mayoría de edad de tu país si es superior."],
  ["Países", "Toda Latinoamérica y España. El premio se envía sin coste para el ganador."],
  ["Boleto gratuito", "Uno por cuenta y por sorteo. Idéntico a uno comprado en numeración y probabilidad."],
  ["Mínimo de boletos", "Publicado en cada sorteo. Si no se alcanza, se devuelve el importe íntegro."],
  ["Una cuenta por persona", "Las cuentas duplicadas se anulan y se devuelve el importe de sus boletos."],
  ["Premio en efectivo", "El ganador puede pedir el valor de referencia en metálico durante 14 días."],
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Cómo funciona"
        title="Un sorteo de GG Play, de principio a fin"
        description="Sin comentarios que hay que dejar, sin seguir a diez cuentas, sin etiquetar a nadie. Compras (o reclamas) tu boleto y ya estás dentro."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FLOW.map((step) => (
          <div key={step.n} className="card p-6">
            <span className="text-sm font-black tracking-widest text-neon-400">{step.n}</span>
            <h3 className="mt-3 text-base font-bold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist-400">{step.body}</p>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-extrabold tracking-tight text-white">Las reglas, en corto</h2>
        <dl className="mt-6 divide-y divide-ink-800 border-y border-ink-800">
          {RULES.map(([term, description]) => (
            <div key={term} className="grid gap-2 py-4 sm:grid-cols-[220px_1fr]">
              <dt className="text-sm font-semibold text-white">{term}</dt>
              <dd className="text-sm text-mist-400">{description}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-mist-400">
          El detalle completo está en las{" "}
          <Link href="/legal/bases" className="text-white underline underline-offset-2">
            bases de los sorteos
          </Link>
          .
        </p>
      </section>

      <section className="card mt-16 p-8 text-center sm:p-12">
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          ¿Listo para tu primer boleto?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-mist-400">
          Crea tu cuenta y reclama el gratuito en el sorteo que más te guste.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/registro"
            className="rounded-xl bg-gradient-to-r from-neon-500 to-aqua-500 px-6 py-3.5 text-sm font-bold text-ink-950"
          >
            Crear cuenta gratis
          </Link>
          <Link
            href="/sorteos"
            className="rounded-xl border border-ink-700 px-6 py-3.5 text-sm font-semibold text-mist-200 hover:text-white"
          >
            Ver sorteos
          </Link>
        </div>
      </section>
    </div>
  );
}
