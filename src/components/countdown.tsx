"use client";

import { useEffect, useState } from "react";

function parts(msLeft: number) {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

/**
 * El servidor y el cliente pueden estar en husos distintos, así que el contador
 * solo se pinta tras montar para no romper la hidratación.
 */
export function Countdown({ to, compact = false }: { to: string; compact?: boolean }) {
  const target = new Date(to).getTime();
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(target - Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [target]);

  if (left === null) {
    return <span className="text-mist-400">{compact ? "—" : "Calculando…"}</span>;
  }

  if (left <= 0) {
    return <span className="font-semibold text-flame-500">Sorteo en curso</span>;
  }

  const { d, h, m, s } = parts(left);

  if (compact) {
    return (
      <span className="tabular-nums font-semibold text-white">
        {d > 0 ? `${d}d ${h}h` : `${h}h ${String(m).padStart(2, "0")}m`}
      </span>
    );
  }

  const cells: [number, string][] = [
    [d, "días"],
    [h, "horas"],
    [m, "min"],
    [s, "seg"],
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map(([value, label]) => (
        <div key={label} className="rounded-xl border border-ink-700 bg-ink-900/80 px-2 py-3 text-center">
          <p className="text-xl font-extrabold tabular-nums text-white sm:text-2xl">
            {String(value).padStart(2, "0")}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-mist-400">{label}</p>
        </div>
      ))}
    </div>
  );
}
