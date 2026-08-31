"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readDb, writeDb } from "./db";
import { hashPassword, randomSeed, verifyPassword } from "./crypto";
import { computeDraw, seedCommitment } from "./draw";
import { createSession, currentUser, destroySession } from "./session";
import { id, reference } from "./ids";
import type { Entry, Giveaway, TicketPack } from "./types";
import { COUNTRIES } from "./format";

export type FormState = { error?: string; ok?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

/* ------------------------------------------------------------------ cuentas */

export async function registerAction(_prev: FormState, form: FormData): Promise<FormState> {
  const name = text(form, "name");
  const email = text(form, "email").toLowerCase();
  const country = text(form, "country");
  const password = String(form.get("password") ?? "");
  const next = text(form, "next") || "/cuenta";

  if (name.length < 2) return { error: "Escribe tu nombre completo." };
  if (!EMAIL_RE.test(email)) return { error: "Ese correo no parece válido." };
  if (!COUNTRIES.some((c) => c.code === country)) return { error: "Elige tu país." };
  if (password.length < 8) return { error: "La contraseña necesita al menos 8 caracteres." };

  const created = await writeDb((db) => {
    if (db.users.some((u) => u.email === email)) return null;
    const user = {
      id: id("usr"),
      name,
      email,
      passwordHash: hashPassword(password),
      country,
      role: "user" as const,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    return user;
  });

  if (!created) return { error: "Ya existe una cuenta con ese correo. Inicia sesión." };

  await createSession(created.id);
  redirect(next);
}

export async function loginAction(_prev: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  const next = text(form, "next") || "/cuenta";

  const db = await readDb();
  const user = db.users.find((u) => u.email === email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Correo o contraseña incorrectos." };
  }

  await createSession(user.id);
  redirect(user.role === "admin" ? "/admin" : next);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

/* ---------------------------------------------------------- participaciones */

function nextTicketNumbers(entries: Entry[], giveawayId: string, count: number): number[] {
  const used = entries.filter((e) => e.giveawayId === giveawayId).reduce((sum, e) => sum + e.tickets.length, 0);
  return Array.from({ length: count }, (_, i) => used + i + 1);
}

function assertPurchasable(giveaway: Giveaway | undefined): asserts giveaway is Giveaway {
  if (!giveaway) throw new Error("Ese sorteo no existe.");
  if (giveaway.status !== "live") throw new Error("La venta de boletos para este sorteo ya está cerrada.");
}

export async function buyTicketsAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await currentUser();
  const slug = text(form, "slug");
  if (!user) redirect(`/entrar?next=${encodeURIComponent(`/sorteos/${slug}`)}`);

  const packIndex = Number(form.get("pack"));

  const result = await writeDb((db) => {
    const giveaway = db.giveaways.find((g) => g.slug === slug);
    try {
      assertPurchasable(giveaway);
    } catch (error) {
      return { error: (error as Error).message };
    }

    const pack: TicketPack | undefined = giveaway.packs[packIndex];
    if (!pack) return { error: "Elige un paquete de boletos." };

    const sold = db.entries
      .filter((e) => e.giveawayId === giveaway.id)
      .reduce((sum, e) => sum + e.tickets.length, 0);
    if (sold + pack.tickets > giveaway.totalTickets) {
      return { error: `Solo quedan ${giveaway.totalTickets - sold} boletos disponibles.` };
    }

    const tickets = nextTicketNumbers(db.entries, giveaway.id, pack.tickets);
    db.entries.push({
      id: id("ent"),
      userId: user.id,
      giveawayId: giveaway.id,
      tickets,
      amountCents: pack.priceCents,
      source: "compra",
      reference: reference(),
      createdAt: new Date().toISOString(),
    });
    return { ok: `¡Listo! Tus boletos: ${tickets.map((t) => `#${t}`).join(", ")}` };
  });

  revalidatePath(`/sorteos/${slug}`);
  revalidatePath("/cuenta");
  return result;
}

export async function claimFreeTicketAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await currentUser();
  const slug = text(form, "slug");
  if (!user) redirect(`/entrar?next=${encodeURIComponent(`/sorteos/${slug}`)}`);

  const result = await writeDb((db) => {
    const giveaway = db.giveaways.find((g) => g.slug === slug);
    try {
      assertPurchasable(giveaway);
    } catch (error) {
      return { error: (error as Error).message };
    }

    const already = db.entries.some(
      (e) => e.userId === user.id && e.giveawayId === giveaway.id && e.source === "gratis",
    );
    if (already) return { error: "Ya reclamaste tu boleto gratis de este sorteo." };

    const sold = db.entries
      .filter((e) => e.giveawayId === giveaway.id)
      .reduce((sum, e) => sum + e.tickets.length, 0);
    if (sold + 1 > giveaway.totalTickets) return { error: "Se agotaron los boletos de este sorteo." };

    const tickets = nextTicketNumbers(db.entries, giveaway.id, 1);
    db.entries.push({
      id: id("ent"),
      userId: user.id,
      giveawayId: giveaway.id,
      tickets,
      amountCents: 0,
      source: "gratis",
      reference: reference(),
      createdAt: new Date().toISOString(),
    });
    return { ok: `Boleto gratis asignado: #${tickets[0]}` };
  });

  revalidatePath(`/sorteos/${slug}`);
  revalidatePath("/cuenta");
  return result;
}

/* ---------------------------------------------------------------- admin */

async function requireAdmin() {
  const user = await currentUser();
  if (!user || user.role !== "admin") redirect("/entrar?next=%2Fadmin");
  return user;
}

export async function setStatusAction(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const giveawayId = text(form, "giveawayId");
  const status = text(form, "status") as Giveaway["status"];
  if (!["draft", "live", "closed"].includes(status)) return { error: "Estado no válido." };

  const result = await writeDb((db) => {
    const giveaway = db.giveaways.find((g) => g.id === giveawayId);
    if (!giveaway) return { error: "Sorteo no encontrado." };
    if (giveaway.status === "drawn") return { error: "Un sorteo ya ejecutado no se puede reabrir." };
    giveaway.status = status;
    return { ok: `Sorteo actualizado a «${status}».` };
  });

  revalidatePath("/admin");
  revalidatePath("/sorteos");
  return result;
}

export async function runDrawAction(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const giveawayId = text(form, "giveawayId");
  const publicSeed = text(form, "publicSeed");
  if (publicSeed.length < 3) return { error: "Escribe la semilla pública anunciada en el directo." };

  const result = await writeDb(async (db) => {
    const giveaway = db.giveaways.find((g) => g.id === giveawayId);
    if (!giveaway) return { error: "Sorteo no encontrado." };
    if (giveaway.result) return { error: "Este sorteo ya tiene ganador." };

    const entries = db.entries.filter((e) => e.giveawayId === giveaway.id);
    const ticketsSold = entries.reduce((sum, e) => sum + e.tickets.length, 0);
    if (ticketsSold === 0) return { error: "No hay boletos vendidos." };
    if (ticketsSold < giveaway.minTickets) {
      return { error: `Faltan boletos: ${ticketsSold} de ${giveaway.minTickets} mínimos.` };
    }

    const { winningTicket, digest } = await computeDraw(giveaway.serverSeed, publicSeed, ticketsSold);
    const winnerEntry = entries.find((e) => e.tickets.includes(winningTicket));
    const winner = db.users.find((u) => u.id === winnerEntry?.userId);
    if (!winner) return { error: "No se pudo localizar el boleto ganador." };

    giveaway.publicSeed = publicSeed;
    giveaway.status = "drawn";
    giveaway.result = {
      winningTicket,
      winnerUserId: winner.id,
      winnerName: winner.name,
      winnerCountry: winner.country,
      ticketsSold,
      drawnAt: new Date().toISOString(),
      publicSeed,
      serverSeed: giveaway.serverSeed,
      seedHash: giveaway.seedHash,
      digest,
    };
    return { ok: `Boleto ganador ${winningTicket} — ${winner.name}.` };
  });

  revalidatePath("/admin");
  revalidatePath("/ganadores");
  revalidatePath("/sorteos");
  return result;
}

export async function createGiveawayAction(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();

  const title = text(form, "title");
  const tagline = text(form, "tagline");
  const description = text(form, "description");
  const prize = text(form, "prize").split("\n").map((l) => l.trim()).filter(Boolean);
  const category = text(form, "category") as Giveaway["category"];
  const retail = Number(text(form, "retail"));
  const ticketPrice = Number(text(form, "ticketPrice"));
  const totalTickets = Number(text(form, "totalTickets"));
  const minTickets = Number(text(form, "minTickets"));
  const drawAt = text(form, "drawAt");
  const emoji = text(form, "emoji") || "🎁";

  if (title.length < 4) return { error: "El título es demasiado corto." };
  if (prize.length === 0) return { error: "Escribe al menos una línea de premio." };
  if (!Number.isFinite(retail) || retail <= 0) return { error: "Valor del premio no válido." };
  if (!Number.isFinite(ticketPrice) || ticketPrice <= 0) return { error: "Precio del boleto no válido." };
  if (!Number.isFinite(totalTickets) || totalTickets < 10) return { error: "Pon al menos 10 boletos." };
  if (!Number.isFinite(minTickets) || minTickets > totalTickets) return { error: "El mínimo no puede superar el total." };
  if (!drawAt) return { error: "Elige la fecha del sorteo." };

  const serverSeed = randomSeed();
  const priceCents = Math.round(ticketPrice * 100);
  const slugBase = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const commitment = await seedCommitment(serverSeed);

  const slug = await writeDb((db) => {
    let candidate = slugBase;
    let n = 2;
    while (db.giveaways.some((g) => g.slug === candidate)) candidate = `${slugBase}-${n++}`;

    db.giveaways.push({
      id: id("gvw"),
      slug: candidate,
      title,
      tagline,
      description,
      prize,
      category,
      retailCents: Math.round(retail * 100),
      ticketPriceCents: priceCents,
      packs: [
        { tickets: 1, priceCents },
        { tickets: 5, priceCents: Math.round(priceCents * 4.5), label: "Ahorra 10%" },
        { tickets: 10, priceCents: Math.round(priceCents * 8), label: "El más elegido" },
        { tickets: 25, priceCents: Math.round(priceCents * 17.5), label: "Ahorra 30%" },
      ],
      totalTickets,
      minTickets,
      drawAt: new Date(drawAt).toISOString(),
      liveUrl: "https://www.tiktok.com/@ggplay/live",
      art: { from: "#7c3aed", to: "#0ea5e9", emoji },
      status: "draft",
      seedHash: commitment,
      serverSeed,
      publicSeed: null,
      result: null,
      createdAt: new Date().toISOString(),
    });
    return candidate;
  });

  revalidatePath("/admin");
  revalidatePath("/sorteos");
  return { ok: `Sorteo creado como borrador (/sorteos/${slug}). Publícalo cuando esté listo.` };
}
