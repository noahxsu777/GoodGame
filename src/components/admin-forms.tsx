"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createGiveawayAction,
  runDrawAction,
  setStatusAction,
  type FormState,
} from "@/lib/actions";
import { Alert } from "./ui";

const field = "field px-3.5 py-2.5 text-sm";
const label = "block text-[10px] font-semibold uppercase tracking-[0.18em] text-mist-400";

function Submit({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "ghost" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        tone === "primary"
          ? "btn btn-primary px-5 py-2.5 text-xs disabled:opacity-60"
          : "btn btn-ghost px-5 py-2.5 text-xs disabled:opacity-60"
      }
    >
      {pending ? "…" : children}
    </button>
  );
}

export function StatusForm({ giveawayId, status }: { giveawayId: string; status: string }) {
  const [state, submit] = useActionState<FormState, FormData>(setStatusAction, {});
  const nextStatus = status === "live" ? "closed" : "live";
  const labelText = status === "live" ? "Cerrar venta" : "Publicar / reabrir";

  return (
    <form action={submit} className="flex items-center gap-3">
      <input type="hidden" name="giveawayId" value={giveawayId} />
      <input type="hidden" name="status" value={nextStatus} />
      <Submit tone="ghost">{labelText}</Submit>
      {state.error && <span className="text-xs text-flame-500">{state.error}</span>}
    </form>
  );
}

export function DrawForm({ giveawayId }: { giveawayId: string }) {
  const [state, submit] = useActionState<FormState, FormData>(runDrawAction, {});

  return (
    <form action={submit} className="space-y-3">
      <input type="hidden" name="giveawayId" value={giveawayId} />
      <div>
        <label className={label} htmlFor={`seed-${giveawayId}`}>
          Semilla pública anunciada en el directo
        </label>
        <input
          id={`seed-${giveawayId}`}
          name="publicSeed"
          required
          minLength={3}
          placeholder="p. ej. el chat dijo «hadouken x3»"
          className={`${field} mt-2`}
        />
      </div>
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.ok && <Alert tone="ok">{state.ok}</Alert>}
      <Submit>Ejecutar sorteo</Submit>
    </form>
  );
}

export function CreateGiveawayForm() {
  const [state, submit] = useActionState<FormState, FormData>(createGiveawayAction, {});

  return (
    <form action={submit} className="space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.ok && <Alert tone="ok">{state.ok}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label} htmlFor="title">
            Título
          </label>
          <input id="title" name="title" required className={`${field} mt-2`} placeholder="PlayStation 5 Pro" />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="tagline">
            Frase corta
          </label>
          <input id="tagline" name="tagline" className={`${field} mt-2`} placeholder="Consola, dos mandos y tres juegos" />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="description">
            Descripción
          </label>
          <textarea id="description" name="description" rows={3} className={`${field} mt-2`} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="prize">
            Contenido del premio (una línea por elemento)
          </label>
          <textarea
            id="prize"
            name="prize"
            rows={4}
            required
            className={`${field} mt-2`}
            placeholder={"Consola 2 TB\nDos mandos\nTres juegos a elección"}
          />
        </div>

        <div>
          <label className={label} htmlFor="category">
            Categoría
          </label>
          <select id="category" name="category" className={`${field} mt-2`} defaultValue="consolas">
            <option value="consolas">Consolas</option>
            <option value="pc">PC gamer</option>
            <option value="perifericos">Periféricos</option>
            <option value="movil">Portátil y móvil</option>
            <option value="coleccionable">Coleccionables</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="emoji">
            Emoji de portada
          </label>
          <input id="emoji" name="emoji" defaultValue="🎁" maxLength={4} className={`${field} mt-2`} />
        </div>
        <div>
          <label className={label} htmlFor="retail">
            Valor del premio (USD)
          </label>
          <input id="retail" name="retail" type="number" min="1" step="0.01" required className={`${field} mt-2`} />
        </div>
        <div>
          <label className={label} htmlFor="ticketPrice">
            Precio por boleto (USD)
          </label>
          <input
            id="ticketPrice"
            name="ticketPrice"
            type="number"
            min="0.5"
            step="0.5"
            defaultValue="2"
            required
            className={`${field} mt-2`}
          />
        </div>
        <div>
          <label className={label} htmlFor="totalTickets">
            Boletos totales
          </label>
          <input id="totalTickets" name="totalTickets" type="number" min="10" required className={`${field} mt-2`} />
        </div>
        <div>
          <label className={label} htmlFor="minTickets">
            Boletos mínimos
          </label>
          <input id="minTickets" name="minTickets" type="number" min="0" required className={`${field} mt-2`} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="drawAt">
            Fecha y hora del sorteo
          </label>
          <input id="drawAt" name="drawAt" type="datetime-local" required className={`${field} mt-2`} />
        </div>
      </div>

      <Submit>Crear sorteo (borrador)</Submit>
      <p className="text-xs text-mist-400">
        Al crearlo se genera la semilla secreta y se publica su hash. A partir de ese momento el
        resultado ya no se puede alterar.
      </p>
    </form>
  );
}
