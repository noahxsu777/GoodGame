"use client";

import { useState } from "react";
import { verifyDraw, type DrawVerification } from "@/lib/draw";
import { Alert } from "./ui";

const field = "field px-4 py-3 font-mono text-xs";
const label = "block text-[10px] font-semibold uppercase tracking-[0.18em] text-mist-400";

export type VerifiableDraw = {
  slug: string;
  title: string;
  seedHash: string;
  serverSeed: string;
  publicSeed: string;
  ticketsSold: number;
  winningTicket: number;
};

/**
 * El cálculo corre en el navegador con el mismo código que usa el servidor:
 * nadie tiene que fiarse de una respuesta de nuestra API.
 */
export function Verifier({ draws, initialSlug }: { draws: VerifiableDraw[]; initialSlug?: string }) {
  const first = draws.find((d) => d.slug === initialSlug) ?? draws[0];
  const [form, setForm] = useState(
    first ?? { seedHash: "", serverSeed: "", publicSeed: "", ticketsSold: 0, winningTicket: 0 },
  );
  const [result, setResult] = useState<DrawVerification | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load(slug: string) {
    const draw = draws.find((d) => d.slug === slug);
    if (draw) {
      setForm(draw);
      setResult(null);
      setError(null);
    }
  }

  async function run() {
    setError(null);
    setBusy(true);
    try {
      setResult(
        await verifyDraw({
          serverSeed: form.serverSeed.trim(),
          seedHash: form.seedHash.trim(),
          publicSeed: form.publicSeed.trim(),
          ticketsSold: Number(form.ticketsSold),
          winningTicket: Number(form.winningTicket),
        }),
      );
    } catch (e) {
      setResult(null);
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel p-6">
      {draws.length > 0 && (
        <div className="mb-6">
          <label className={label} htmlFor="draw">
            Cargar un sorteo ya ejecutado
          </label>
          <select
            id="draw"
            defaultValue={first?.slug}
            onChange={(e) => load(e.target.value)}
            className="field mt-2 px-4 py-3 text-sm"
          >
            {draws.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className={label} htmlFor="seedHash">
            Hash publicado antes de la venta (seedHash)
          </label>
          <input
            id="seedHash"
            className={`${field} mt-2`}
            value={form.seedHash}
            onChange={(e) => setForm({ ...form, seedHash: e.target.value })}
          />
        </div>
        <div>
          <label className={label} htmlFor="serverSeed">
            Semilla secreta revelada (serverSeed)
          </label>
          <input
            id="serverSeed"
            className={`${field} mt-2`}
            value={form.serverSeed}
            onChange={(e) => setForm({ ...form, serverSeed: e.target.value })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <label className={label} htmlFor="publicSeed">
              Semilla pública del directo
            </label>
            <input
              id="publicSeed"
              className={`${field} mt-2`}
              value={form.publicSeed}
              onChange={(e) => setForm({ ...form, publicSeed: e.target.value })}
            />
          </div>
          <div>
            <label className={label} htmlFor="ticketsSold">
              Boletos vendidos
            </label>
            <input
              id="ticketsSold"
              type="number"
              className={`${field} mt-2`}
              value={form.ticketsSold}
              onChange={(e) => setForm({ ...form, ticketsSold: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={label} htmlFor="winningTicket">
              Boleto ganador anunciado
            </label>
            <input
              id="winningTicket"
              type="number"
              className={`${field} mt-2`}
              value={form.winningTicket}
              onChange={(e) => setForm({ ...form, winningTicket: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="btn btn-primary mt-7 w-full px-5 py-3.5 text-xs disabled:opacity-60"
      >
        {busy ? "Calculando…" : "Recalcular el sorteo"}
      </button>

      {error && (
        <div className="mt-5">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-3">
          <Alert tone={result.commitmentOk ? "ok" : "error"}>
            {result.commitmentOk
              ? "✓ La semilla revelada corresponde al hash publicado antes de vender boletos."
              : "✗ El hash no corresponde a esa semilla. Algo no cuadra."}
          </Alert>
          <Alert tone={result.ticketOk ? "ok" : "error"}>
            {result.ticketOk
              ? `✓ El cálculo da el boleto ${result.computed.winningTicket}, el mismo que se anunció.`
              : `✗ El cálculo da el boleto ${result.computed.winningTicket}, distinto del anunciado.`}
          </Alert>
          <div className="border border-ink-700 bg-void p-4">
            <p className="text-xs uppercase tracking-wide text-mist-400">HMAC-SHA256 resultante</p>
            <p className="mt-1 break-all font-mono text-xs text-mist-300">{result.computed.digest}</p>
          </div>
        </div>
      )}
    </div>
  );
}
