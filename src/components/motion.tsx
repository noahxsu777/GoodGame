"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${on ? "reveal-on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function CountUp({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      const t0 = performance.now();
      const run = (t: number) => {
        const p = Math.min(1, (t - t0) / 1100);
        const ease = 1 - Math.pow(1 - p, 3);
        setN(Math.round(value * ease));
        if (p < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {n.toLocaleString("es-MX")}
    </span>
  );
}

const LINES = ["Gana en serio.", "Sorteos en vivo.", "Tu verificas."];

export function HeroLine() {
  const [i, setI] = useState(0);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const hold = setTimeout(() => setOn(false), 2400);
    const next = setTimeout(() => {
      setI((n) => (n + 1) % LINES.length);
      setOn(true);
    }, 2800);
    return () => {
      clearTimeout(hold);
      clearTimeout(next);
    };
  }, [i]);

  return (
    <span className={`text-gradient hero-swap ${on ? "hero-swap-on" : ""}`}>
      {LINES[i]}
    </span>
  );
}

export function HeroGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const move = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    parent.addEventListener("pointermove", move);
    return () => parent.removeEventListener("pointermove", move);
  }, []);

  return <div ref={ref} className="hero-follow" aria-hidden />;
}

const FEED = [
  "Valentina · CO compro 5 boletos",
  "Mateo · MX reclamo boleto gratis",
  "Sofia · AR se unio al sorteo",
  "Diego · ES verifico un resultado",
  "Camila · PE compro pack x10",
  "Lucas · CL esta en el chat",
];

export function LiveFeed() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % FEED.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <p className="live-feed font-mono text-[11px] text-mist-300">
      <span className="live-dot mr-2 inline-block h-1.5 w-1.5 rounded-full bg-lime-500 align-middle" />
      {FEED[i]}
    </p>
  );
}
