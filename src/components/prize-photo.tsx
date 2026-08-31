"use client";

import { useState } from "react";

/**
 * Foto real del premio. Si la imagen no carga (ruta mal escrita, archivo que
 * todavía no se subió, URL externa caída) se oculta y queda a la vista la
 * ilustración vectorial que hay debajo, así la tarjeta nunca se rompe.
 */
export function PrizePhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    // La fuente puede ser local o remota y el marco ya controla el tamaño, así
    // que aquí una <img> normal es más simple que next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="prize-photo"
      onError={() => setFailed(true)}
    />
  );
}
