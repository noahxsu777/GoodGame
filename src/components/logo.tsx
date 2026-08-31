export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="font-display grid h-9 w-9 place-items-center rounded-[11px] bg-gradient-to-br from-neon-400 to-neon-600 text-[14px] font-bold tracking-tight text-white shadow-[0_6px_18px_-6px_rgba(109,94,252,0.9)]"
      >
        GG
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[16px] font-semibold tracking-tight text-white">
            GG Play
          </span>
          <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-mist-400">
            Good Game Play
          </span>
        </span>
      )}
    </span>
  );
}
