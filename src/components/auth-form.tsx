"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, registerAction, type FormState } from "@/lib/actions";
import { Alert } from "./ui";
import { COUNTRIES } from "@/lib/format";

const field =
  "w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-sm text-white placeholder:text-mist-400 outline-none transition-colors focus:border-neon-500";
const label = "block text-xs font-semibold uppercase tracking-wide text-mist-400";

function Submit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-gradient-to-r from-neon-500 to-aqua-500 px-5 py-3.5 text-sm font-bold text-ink-950 transition-transform hover:scale-[1.01] disabled:opacity-60"
    >
      {pending ? "Un momento…" : children}
    </button>
  );
}

export function AuthForm({ mode, next }: { mode: "login" | "register"; next: string }) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, submit] = useActionState<FormState, FormData>(action, {});

  return (
    <form action={submit} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      {state.error && <Alert tone="error">{state.error}</Alert>}

      {mode === "register" && (
        <div>
          <label className={label} htmlFor="name">
            Nombre y apellido
          </label>
          <input id="name" name="name" required autoComplete="name" className={`${field} mt-2`} placeholder="Alex Rivera" />
        </div>
      )}

      <div>
        <label className={label} htmlFor="email">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={`${field} mt-2`}
          placeholder="tu@correo.com"
        />
      </div>

      {mode === "register" && (
        <div>
          <label className={label} htmlFor="country">
            País
          </label>
          <select id="country" name="country" required defaultValue="" className={`${field} mt-2`}>
            <option value="" disabled>
              Elige tu país
            </option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={label} htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className={`${field} mt-2`}
          placeholder={mode === "register" ? "Mínimo 8 caracteres" : "••••••••"}
        />
      </div>

      <Submit>{mode === "login" ? "Entrar" : "Crear mi cuenta"}</Submit>

      <p className="text-center text-sm text-mist-400">
        {mode === "login" ? (
          <>
            ¿Aún no tienes cuenta?{" "}
            <Link href="/registro" className="font-semibold text-white hover:underline">
              Créala gratis
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href="/entrar" className="font-semibold text-white hover:underline">
              Inicia sesión
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
