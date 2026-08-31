import { randomBytes, randomUUID } from "node:crypto";

export function id(prefix: string): string {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

/** Referencia legible para mostrar en el recibo de una participación. */
export function reference(): string {
  return `GG-${randomBytes(3).toString("hex").toUpperCase()}`;
}
