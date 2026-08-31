import { PRIZE_SHAPES, isPrizeShape } from "./prize-illustrations";
import { PrizePhoto } from "./prize-photo";

export type Art = {
  from: string;
  to: string;
  emoji: string;
  /** Ilustración vectorial de respaldo. */
  shape?: string;
  /** Foto real del premio: ruta en /public o URL absoluta. Tiene prioridad. */
  image?: string;
};

/**
 * Marco del premio: una escena por capas (foco, rejilla en fuga, horizonte,
 * reflejo y viñeta) alrededor de la foto o la ilustración del hardware. Es lo
 * que más peso visual tiene en la app, así que vive aquí para que tarjetas,
 * ficha y ganadores usen exactamente el mismo tratamiento.
 */
export function PrizeArt({
  art,
  size = "card",
  alt = "",
  children,
}: {
  art: Art;
  size?: "card" | "hero" | "tile" | "wide";
  alt?: string;
  children?: React.ReactNode;
}) {
  const box = {
    tile: "h-16 w-16 text-[1.9rem]",
    card: "h-44 text-[5rem]",
    hero: "h-56 sm:h-64 text-[6.5rem]",
    wide: "h-56 sm:h-72 text-[8rem]",
  }[size];

  const Shape = isPrizeShape(art.shape) ? PRIZE_SHAPES[art.shape] : null;

  return (
    <div
      className={`prize-art ${box}`}
      style={{ ["--art-from" as string]: art.from, ["--art-to" as string]: art.to }}
    >
      <span aria-hidden className="prize-glow" />
      <span className="prize-stage">
        {Shape ? (
          <>
            <span className="prize-object">
              <Shape />
            </span>
            {size !== "tile" && (
              <span aria-hidden className="prize-object prize-mirror">
                <Shape />
              </span>
            )}
          </>
        ) : (
          <>
            <span aria-hidden className="prize-emoji">
              {art.emoji}
            </span>
            {size !== "tile" && (
              <span aria-hidden className="prize-reflection">
                {art.emoji}
              </span>
            )}
          </>
        )}
        {/* La foto se pinta encima; si falla, queda la ilustración. */}
        {art.image && <PrizePhoto src={art.image} alt={alt} />}
      </span>
      {children}
    </div>
  );
}
