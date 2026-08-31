import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { currentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await currentUser();
  if (user) redirect("/cuenta");
  const { next = "/cuenta" } = await searchParams;

  return (
    <div className="aurora relative border-b border-ink-800">
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="headline text-3xl text-white sm:text-4xl">Entrar a GG Play</h1>
        <p className="mt-2 text-sm text-mist-400">
          Tus boletos, tus sorteos y tus avisos de resultado, en un solo lugar.
        </p>

        <div className="panel mt-8 p-6">
          <AuthForm mode="login" next={next} />
        </div>

        <div className="panel mt-6 p-5 text-sm text-mist-400">
          <p className="font-semibold text-mist-200">Cuentas de prueba de esta demo</p>
          <p className="mt-2">
            Jugador: <code className="text-aqua-400">demo@ggplay.gg</code> ·{" "}
            <code className="text-aqua-400">ggplay-demo</code>
          </p>
          <p className="mt-1">
            Administración: <code className="text-aqua-400">admin@ggplay.gg</code> ·{" "}
            <code className="text-aqua-400">ggplay-admin</code>
          </p>
        </div>
      </div>
    </div>
  );
}
