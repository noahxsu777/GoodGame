import Link from "next/link";
import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "live" | "warn" | "done" | "free" | "gold";
}) {
  const tones: Record<string, string> = {
    neutral: "border-white/10 bg-white/5 text-mist-300",
    live: "border-lime-500/35 bg-lime-500/10 text-lime-400",
    warn: "border-flame-500/35 bg-flame-500/10 text-flame-500",
    done: "border-aqua-500/35 bg-aqua-500/10 text-aqua-400",
    free: "border-neon-500/35 bg-neon-500/12 text-neon-400",
    gold: "border-gold-500/35 bg-gold-500/10 text-gold-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function LiveDot() {
  return <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime-500" />;
}

export function Progress({ value, label }: { value: number; label?: ReactNode }) {
  return (
    <div>
      <div className="bar">
        <div className="bar-fill" style={{ width: `${Math.max(3, Math.min(100, value))}%` }} />
      </div>
      {label && <p className="mt-2.5 text-xs text-mist-400">{label}</p>}
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
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="eyebrow text-neon-400">{eyebrow}</p>
        )}
        <h2 className="headline mt-3 text-[1.75rem] text-white sm:text-4xl">{title}</h2>
        {description && <p className="mt-3.5 text-sm leading-relaxed text-mist-400">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="btn btn-ghost shrink-0 px-5 py-3 text-xs">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Alert({ tone, children }: { tone: "error" | "ok" | "info"; children: ReactNode }) {
  const tones = {
    error: "border-flame-500/45 bg-flame-500/10 text-flame-500",
    ok: "border-lime-500/45 bg-lime-500/10 text-lime-400",
    info: "border-ink-600 bg-ink-850 text-mist-300",
  } as const;
  return (
    <div className={`border px-4 py-3 text-sm ${tones[tone]}`} role="status">
      {children}
    </div>
  );
}

export function Stat({ value, label, tone }: { value: string; label: string; tone?: "neon" | "lime" }) {
  const color = tone === "lime" ? "text-lime-400" : tone === "neon" ? "text-aqua-400" : "text-white";
  return (
    <div className="panel px-5 py-6 text-center">
      <p className={`font-display text-[2rem] font-semibold tabular-nums ${color}`}>{value}</p>
      <p className="mt-1.5 text-[13px] text-mist-400">{label}</p>
    </div>
  );
}
