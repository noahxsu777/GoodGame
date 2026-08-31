export type Role = "user" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  country: string;
  role: Role;
  createdAt: string;
};

export type GiveawayStatus = "draft" | "live" | "closed" | "drawn";

export type TicketPack = {
  tickets: number;
  /** Precio total del paquete en centavos de USD. */
  priceCents: number;
  label?: string;
};

export type Giveaway = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  /** Lista de todo lo que incluye el premio. */
  prize: string[];
  category: "consolas" | "pc" | "perifericos" | "movil" | "coleccionable";
  /** Valor de referencia del premio en centavos de USD. */
  retailCents: number;
  ticketPriceCents: number;
  packs: TicketPack[];
  totalTickets: number;
  /** Boletos vendidos mínimos para que el sorteo se ejecute. */
  minTickets: number;
  /** Fecha del sorteo en vivo (ISO). */
  drawAt: string;
  liveUrl: string;
  art: { from: string; to: string; emoji: string };
  status: GiveawayStatus;
  /** Compromiso público: sha256 del serverSeed, publicado antes de vender boletos. */
  seedHash: string;
  /** Semilla del servidor. Solo se revela cuando el sorteo ya se ejecutó. */
  serverSeed: string;
  /** Semilla pública anunciada en el directo (la aporta la audiencia). */
  publicSeed: string | null;
  result: DrawResult | null;
  createdAt: string;
};

export type DrawResult = {
  winningTicket: number;
  winnerUserId: string;
  winnerName: string;
  winnerCountry: string;
  ticketsSold: number;
  drawnAt: string;
  publicSeed: string;
  serverSeed: string;
  seedHash: string;
  /** Digest HMAC completo del que se deriva el boleto ganador. */
  digest: string;
};

export type EntrySource = "compra" | "gratis";

export type Entry = {
  id: string;
  userId: string;
  giveawayId: string;
  tickets: number[];
  amountCents: number;
  source: EntrySource;
  reference: string;
  createdAt: string;
};

export type PostKind = "noticia" | "podcast" | "stream";

export type Post = {
  id: string;
  slug: string;
  kind: PostKind;
  title: string;
  excerpt: string;
  body: string[];
  author: string;
  publishedAt: string;
  duration?: string;
  art: { from: string; to: string; emoji: string };
};

export type Database = {
  users: User[];
  giveaways: Giveaway[];
  entries: Entry[];
  posts: Post[];
};
