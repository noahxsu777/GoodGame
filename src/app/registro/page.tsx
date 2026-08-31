import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { currentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Crear cuenta" };

const PERKS = [
  "Un boleto gratis en cada sorteo, sin comprar nada.",
  "Aviso por correo si tu número sale premiado, estés o no en el directo.",
  "Historial completo de tus boletos y de los sorteos en los que participaste.",
  "Envío del premio con seguro y aduana pagada a tu país.",
];

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await currentUser();
  if (user) redirect("/cuenta");
  const { next = "/cuenta" } = await searchParams;

  return (
    <div className="aurora relative border-b border-ink-800">
      <div className="mx-auto grid max-w-4xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-start">
        <div>
          <h1 className="headline text-3xl text-white sm:text-5xl">
            Crea tu cuenta gratis
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-mist-300">
            Nombre, correo y país. No pedimos datos de pago para registrarte y puedes borrar tu
            cuenta cuando quieras.
          </p>
          <ul className="mt-8 space-y-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex gap-3 text-sm text-mist-300">
                <span aria-hidden className="mt-0.5 text-lime-500">
                  ✓
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-6">
          <AuthForm mode="register" next={next} />
        </div>
      </div>
    </div>
  );
}
