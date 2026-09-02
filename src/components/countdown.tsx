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
    return <span className="font-mono text-mist-400">{compact ? "--:--" : "…"}</span>;
  }

  if (left <= 0) {
    return <span className="font-display font-bold text-flame-500">Sorteo en curso</span>;
  }

  const { d, h, m, s } = parts(left);

  if (compact) {
    return (
      <span className="font-mono text-sm font-bold tabular-nums text-white">
        {d > 0
          ? `${d}d ${String(h).padStart(2, "0")}h`
          : `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`}
      </span>
    );
  }

  const cells: [number, string][] = [
    [d, "dias"],
    [h, "hrs"],
    [m, "min"],
    [s, "seg"],
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map(([value, label], i) => (
        <div key={label} className="rounded-xl border border-white/8 bg-white/[0.025] px-1 py-3 text-center">
          <p className={`font-display text-2xl font-semibold tabular-nums ${i === 3 ? "text-aqua-400" : "text-white"}`}>
            {String(value).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-mist-400">{label}</p>
        </div>
      ))}
    </div>
  );
}
