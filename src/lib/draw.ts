/**
 * Sorteo verificable ("provably fair").
 *
 * 1. Antes de abrir la venta publicamos `seedHash = sha256(serverSeed)`.
 *    Desde ese momento el resultado ya está condicionado y no lo podemos cambiar.
 * 2. En el directo la audiencia aporta la `publicSeed` (una frase, un número,
 *    lo que se diga en el chat). Nadie puede predecirla de antemano.
 * 3. El boleto ganador sale de `HMAC-SHA256(serverSeed, publicSeed:ticketsSold)`.
 * 4. Al terminar revelamos `serverSeed`: cualquiera puede recalcular el mismo
 *    número y comprobar que el hash publicado coincide.
 *
 * Se usa Web Crypto en vez de `node:crypto` a propósito: así el mismo código
 * corre en el servidor y en el navegador, y la página de verificación no
 * depende de que nuestra API le diga la verdad.
 */

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function seedCommitment(serverSeed: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(serverSeed));
  return toHex(digest);
}

export type DrawComputation = {
  digest: string;
  winningTicket: number;
};

export async function computeDraw(
  serverSeed: string,
  publicSeed: string,
  ticketsSold: number,
): Promise<DrawComputation> {
  if (!Number.isInteger(ticketsSold) || ticketsSold <= 0) {
    throw new Error("No hay boletos vendidos para sortear.");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(serverSeed),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${publicSeed}:${ticketsSold}`));
  const digest = toHex(signature);

  // 13 dígitos hexadecimales = 52 bits: el rango entero exacto de Number.
  const value = Number.parseInt(digest.slice(0, 13), 16);
  return { digest, winningTicket: (value % ticketsSold) + 1 };
}

export type DrawVerification = {
  commitmentOk: boolean;
  ticketOk: boolean;
  computed: DrawComputation;
};

export async function verifyDraw(input: {
  serverSeed: string;
  seedHash: string;
  publicSeed: string;
  ticketsSold: number;
  winningTicket: number;
}): Promise<DrawVerification> {
  const [computed, commitment] = await Promise.all([
    computeDraw(input.serverSeed, input.publicSeed, input.ticketsSold),
    seedCommitment(input.serverSeed),
  ]);
  return {
    commitmentOk: commitment === input.seedHash.trim().toLowerCase(),
    ticketOk: computed.winningTicket === input.winningTicket,
    computed,
  };
}
