import "server-only";
import { cookies, headers } from "next/headers";
import { readDb } from "./db";
import { safeEqual, sign } from "./crypto";
import type { User } from "./types";

const COOKIE = "gg_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 días

/** Token `userId.expiraEn.firma`, firmado con HMAC-SHA256. */
function serialize(userId: string): string {
  const payload = `${userId}.${Date.now() + MAX_AGE * 1000}`;
  return `${payload}.${sign(payload)}`;
}

function parse(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expiresAt, signature] = parts;
  if (!safeEqual(sign(`${userId}.${expiresAt}`), signature)) return null;
  if (Number(expiresAt) < Date.now()) return null;
  return userId;
}

/**
 * Marcamos la cookie como `Secure` solo cuando la petición llega de verdad por
 * HTTPS. Atarlo a NODE_ENV rompe cualquier despliegue servido por HTTP dentro
 * de una red privada (y el propio `next start` en local), porque el navegador
 * guarda la cookie pero luego no la envía.
 */
async function isHttps(): Promise<boolean> {
  const store = await headers();
  const forwarded = store.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0].trim() === "https";
  return store.get("origin")?.startsWith("https://") ?? false;
}

export async function createSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, serialize(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: await isHttps(),
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  const userId = parse(token);
  if (!userId) return null;
  const db = await readDb();
  return db.users.find((u) => u.id === userId) ?? null;
}

export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}
