import "server-only";
import { readDb } from "./db";
import { withPrizePhoto } from "./prize-photos";
import type { Entry, Giveaway, Post } from "./types";

export type GiveawayView = Giveaway & {
  ticketsSold: number;
  ticketsLeft: number;
  progress: number;
  participants: number;
};

function decorate(giveaway: Giveaway, entries: Entry[]): GiveawayView {
  const own = entries.filter((e) => e.giveawayId === giveaway.id);
  const ticketsSold = own.reduce((sum, e) => sum + e.tickets.length, 0);
  const base = withPrizePhoto(giveaway);
  return {
    ...base,
    ticketsSold,
    ticketsLeft: Math.max(0, giveaway.totalTickets - ticketsSold),
    progress: Math.min(100, Math.round((ticketsSold / giveaway.totalTickets) * 100)),
    participants: new Set(own.map((e) => e.userId)).size,
  };
}

export async function listGiveaways(status?: Giveaway["status"][]): Promise<GiveawayView[]> {
  const db = await readDb();
  return db.giveaways
    .filter((g) => (status ? status.includes(g.status) : g.status !== "draft"))
    .map((g) => decorate(g, db.entries))
    .sort((a, b) => new Date(a.drawAt).getTime() - new Date(b.drawAt).getTime());
}

export async function listOpenGiveaways(): Promise<GiveawayView[]> {
  return listGiveaways(["live"]);
}

export async function listWinners(): Promise<GiveawayView[]> {
  const drawn = await listGiveaways(["drawn"]);
  return drawn.sort(
    (a, b) => new Date(b.result?.drawnAt ?? b.drawAt).getTime() - new Date(a.result?.drawnAt ?? a.drawAt).getTime(),
  );
}

export async function getGiveaway(slug: string): Promise<GiveawayView | null> {
  const db = await readDb();
  const giveaway = db.giveaways.find((g) => g.slug === slug);
  return giveaway ? decorate(giveaway, db.entries) : null;
}

export async function getGiveawayById(id: string): Promise<GiveawayView | null> {
  const db = await readDb();
  const giveaway = db.giveaways.find((g) => g.id === id);
  return giveaway ? decorate(giveaway, db.entries) : null;
}

export type UserEntry = {
  entry: Entry;
  giveaway: GiveawayView;
  won: boolean;
};

export async function entriesForUser(userId: string): Promise<UserEntry[]> {
  const db = await readDb();
  return db.entries
    .filter((e) => e.userId === userId)
    .map((entry) => {
      const giveaway = decorate(db.giveaways.find((g) => g.id === entry.giveawayId)!, db.entries);
      const winning = giveaway.result?.winningTicket;
      return { entry, giveaway, won: winning !== undefined && entry.tickets.includes(winning) };
    })
    .sort((a, b) => new Date(b.entry.createdAt).getTime() - new Date(a.entry.createdAt).getTime());
}

export async function userTicketsIn(userId: string, giveawayId: string): Promise<number[]> {
  const db = await readDb();
  return db.entries
    .filter((e) => e.userId === userId && e.giveawayId === giveawayId)
    .flatMap((e) => e.tickets)
    .sort((a, b) => a - b);
}

export async function hasFreeTicket(userId: string, giveawayId: string): Promise<boolean> {
  const db = await readDb();
  return db.entries.some((e) => e.userId === userId && e.giveawayId === giveawayId && e.source === "gratis");
}

export async function listPosts(kind?: Post["kind"]): Promise<Post[]> {
  const db = await readDb();
  return db.posts
    .filter((p) => (kind ? p.kind === kind : true))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPost(slug: string): Promise<Post | null> {
  const db = await readDb();
  return db.posts.find((p) => p.slug === slug) ?? null;
}

export type PlatformStats = {
  members: number;
  ticketsSold: number;
  prizesDelivered: number;
  prizeValueCents: number;
  openGiveaways: number;
};

export async function platformStats(): Promise<PlatformStats> {
  const db = await readDb();
  const drawn = db.giveaways.filter((g) => g.status === "drawn");
  return {
    members: db.users.filter((u) => u.role === "user").length,
    ticketsSold: db.entries.reduce((sum, e) => sum + e.tickets.length, 0),
    prizesDelivered: drawn.length,
    prizeValueCents: drawn.reduce((sum, g) => sum + g.retailCents, 0),
    openGiveaways: db.giveaways.filter((g) => g.status === "live").length,
  };
}
