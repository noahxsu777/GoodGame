import Link from "next/link";
import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "live" | "warn" | "done" | "free";
}) {
  const tones: Record<string, string> = {
    neutral: "border-ink-600 bg-ink-800 text-mist-300",
    live: "border-lime-500/40 bg-lime-500/10 text-lime-500",
    warn: "border-flame-500/40 bg-flame-500/10 text-flame-500",
    done: "border-aqua-500/40 bg-aqua-500/10 text-aqua-400",
    free: "border-neon-500/40 bg-neon-500/10 text-neon-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-500 to-aqua-500"
          style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
        />
      </div>
      {label && <p className="mt-2 text-xs text-mist-400">{label}</p>}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-400">{eyebrow}</p>
        )}
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{title}</h2>
        {description && <p className="mt-3 text-sm leading-relaxed text-mist-400">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="shrink-0 rounded-xl border border-ink-700 px-4 py-2.5 text-sm font-semibold text-mist-200 transition-colors hover:border-neon-500/60 hover:text-white"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Alert({ tone, children }: { tone: "error" | "ok" | "info"; children: ReactNode }) {
  const tones = {
    error: "border-flame-500/40 bg-flame-500/10 text-flame-500",
    ok: "border-lime-500/40 bg-lime-500/10 text-lime-500",
    info: "border-ink-600 bg-ink-800/70 text-mist-300",
  } as const;
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]}`} role="status">
      {children}
    </div>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card px-5 py-6 text-center">
      <p className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-mist-400">{label}</p>
    </div>
  );
}
