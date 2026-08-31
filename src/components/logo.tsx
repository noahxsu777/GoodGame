export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="font-display grid h-10 w-10 place-items-center bg-gradient-to-br from-neon-500 via-neon-400 to-aqua-500 text-[15px] font-bold tracking-tighter text-void"
        style={{
          clipPath: "polygon(7px 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%, 0 7px)",
          filter: "drop-shadow(0 0 16px rgba(124,92,255,0.75))",
        }}
      >
        GG
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[17px] font-bold uppercase tracking-tight text-white">
            GG Play
          </span>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.26em] text-mist-400">
            Good Game Play
          </span>
        </span>
      )}
    </span>
  );
}
