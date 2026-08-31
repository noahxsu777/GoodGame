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
    neutral: "border-ink-600 bg-ink-850/90 text-mist-300",
    live: "border-lime-500/50 bg-lime-500/12 text-lime-400 shadow-[0_0_18px_-6px_var(--color-lime-500)]",
    warn: "border-flame-500/50 bg-flame-500/12 text-flame-500",
    done: "border-aqua-500/50 bg-aqua-500/12 text-aqua-400",
    free: "border-neon-500/50 bg-neon-500/14 text-neon-400",
    gold: "border-gold-500/50 bg-gold-500/12 text-gold-500",
  };
  return (
    <span
      className={`font-display inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${tones[tone]}`}
      style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
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
          <p className="eyebrow flex items-center gap-2 text-neon-400">
            <span aria-hidden className="inline-block h-3 w-[3px] bg-neon-500" />
            {eyebrow}
          </p>
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
    <div className="panel hud px-5 py-6 text-center" style={{ ["--cut" as string]: "12px" }}>
      <p className={`font-display text-3xl font-bold tabular-nums tracking-tight ${color}`}>{value}</p>
      <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-mist-400">{label}</p>
    </div>
  );
}
