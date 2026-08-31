export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-neon-500 to-aqua-500 text-sm font-black tracking-tight text-ink-950 shadow-[0_0_22px_-6px_rgba(124,92,255,0.9)]"
      >
        GG
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-extrabold tracking-tight text-white">GG Play</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-mist-400">
            Good Game Play
          </span>
        </span>
      )}
    </span>
  );
}
