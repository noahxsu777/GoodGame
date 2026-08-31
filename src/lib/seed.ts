import "server-only";
import type { Database, Entry, Giveaway, Post, TicketPack, User } from "./types";
import { hashPassword } from "./crypto";
import { computeDraw, seedCommitment } from "./draw";

/**
 * Datos de arranque. La primera vez que la app corre se copian a `.data/db.json`
 * y a partir de ahí ya se puede escribir encima sin tocar el repositorio.
 */

const NOW = new Date("2026-08-31T12:00:00.000Z");

function daysFromNow(days: number, hour = 22): string {
  const d = new Date(NOW);
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}

/** PRNG determinista: la semilla del repo siempre genera el mismo historial. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260831);

const PACKS: TicketPack[] = [
  { tickets: 1, priceCents: 200 },
  { tickets: 5, priceCents: 900, label: "Ahorra 10%" },
  { tickets: 10, priceCents: 1600, label: "El más elegido" },
  { tickets: 25, priceCents: 3500, label: "Ahorra 30%" },
];

const COMMUNITY_NAMES = [
  "Valeria Ramírez", "Diego Fuentes", "Camila Ospina", "Mateo Iriarte", "Lucía Bermúdez",
  "Santiago Peña", "Antonella Ruiz", "Joaquín Salgado", "Renata Cordero", "Emilio Vargas",
  "Paula Cifuentes", "Bruno Alcántara", "Isabella Mora", "Tomás Quiroga", "Daniela Sotelo",
  "Nicolás Arrieta", "Fernanda Loyola", "Andrés Cardoso", "Micaela Duarte", "Gabriel Ferreyra",
  "Sofía Maldonado", "Rodrigo Cañas", "Julieta Sandoval", "Iván Rentería", "Carolina Bustos",
  "Facundo Miranda", "Ximena Trujillo", "Alonso Reátegui", "Martina Escobar", "Kevin Zambrano",
];

const COUNTRIES = ["MX", "CO", "AR", "CL", "PE", "EC", "UY", "CR", "GT", "DO", "PA", "BO", "PY", "VE", "ES"];

function makeUser(index: number, name: string): User {
  const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]+/g, ".");
  return {
    id: `usr_seed${String(index).padStart(4, "0")}`,
    name,
    email: `${slug}@ejemplo.gg`,
    // Estos miembros son historial de ejemplo y nunca inician sesión: guardar
    // un hash sin esquema los deja sin acceso y ahorra 30 scrypt por arranque
    // en frío, que en serverless es la diferencia entre cargar y agotar tiempo.
    passwordHash: "sin-acceso",
    country: COUNTRIES[index % COUNTRIES.length],
    role: "user",
    createdAt: daysFromNow(-120 + index),
  };
}

type GiveawaySeed = Omit<Giveaway, "seedHash" | "serverSeed" | "publicSeed" | "result" | "createdAt"> & {
  serverSeed: string;
  publicSeed?: string;
  createdAt: string;
};

const GIVEAWAY_SEEDS: GiveawaySeed[] = [
  {
    id: "gvw_ps5pro",
    slug: "playstation-5-pro-pack-lanzamiento",
    title: "PlayStation 5 Pro — Pack Lanzamiento",
    tagline: "Consola, dos mandos y tres juegos a elección. Envío pagado a toda LATAM.",
    description:
      "El pack completo para estrenar generación sin gastar un peso extra: consola PS5 Pro de 2 TB, un DualSense adicional, tres juegos físicos que eliges tú y doce meses de suscripción online. Si ganas y ya tienes consola, puedes cambiar el premio por su valor en efectivo.",
    prize: [
      "PlayStation 5 Pro 2 TB (modelo con lector de discos)",
      "Dos mandos DualSense",
      "Tres juegos físicos a elección del ganador",
      "12 meses de suscripción online",
      "Envío con seguro y aduana pagada a cualquier país de LATAM",
    ],
    category: "consolas",
    retailCents: 129900,
    ticketPriceCents: 200,
    packs: PACKS,
    totalTickets: 4000,
    minTickets: 1200,
    drawAt: daysFromNow(11),
    liveUrl: "https://www.tiktok.com/@ggplay/live",
    art: { from: "#2563eb", to: "#0ea5e9", emoji: "🎮" },
    status: "live",
    serverSeed: "9f2b4c1de7a83605bb14ce90d2f7a318c5406e2b19d4f8aa",
    createdAt: daysFromNow(-16),
  },
  {
    id: "gvw_pcrtx",
    slug: "setup-pc-gamer-rtx-5080",
    title: "Setup PC Gamer RTX 5080 completo",
    tagline: "Torre armada, monitor 1440p a 240 Hz, escritorio y todos los periféricos.",
    description:
      "No es solo la torre: es el setup entero listo para enchufar y jugar. Lo armamos, lo probamos en vivo antes del sorteo y lo enviamos con todos los cables, licencias y garantía a nombre del ganador.",
    prize: [
      "RTX 5080 16 GB + Ryzen 7 9800X3D",
      "32 GB DDR5 6000 y SSD NVMe de 2 TB",
      "Monitor 27\" 1440p 240 Hz",
      "Teclado mecánico, mouse inalámbrico y auriculares con micrófono",
      "Escritorio, alfombrilla XL y silla ergonómica",
    ],
    category: "pc",
    retailCents: 289900,
    ticketPriceCents: 200,
    packs: PACKS,
    totalTickets: 7500,
    minTickets: 3000,
    drawAt: daysFromNow(25),
    liveUrl: "https://www.tiktok.com/@ggplay/live",
    art: { from: "#7c3aed", to: "#db2777", emoji: "🖥️" },
    status: "live",
    serverSeed: "3ad8f0c6b95172e4408adc71fe36b95207c1a4d8e6053bb2",
    createdAt: daysFromNow(-9),
  },
  {
    id: "gvw_perifericos",
    slug: "combo-perifericos-pro",
    title: "Combo Periféricos Pro",
    tagline: "Teclado 75%, mouse de 45 g, auriculares y micrófono de streaming.",
    description:
      "El sorteo de entrada perfecto: boletos baratos, premio que se usa todos los días y sorteo cada mes. Cuatro piezas elegidas con la comunidad en una encuesta abierta durante el directo del 12 de agosto.",
    prize: [
      "Teclado mecánico 75% con switches hot-swap",
      "Mouse inalámbrico de 45 g y 8 kHz de polling",
      "Auriculares inalámbricos con audio espacial",
      "Micrófono de condensador con brazo articulado",
    ],
    category: "perifericos",
    retailCents: 74900,
    ticketPriceCents: 200,
    packs: PACKS,
    totalTickets: 2500,
    minTickets: 800,
    drawAt: daysFromNow(4),
    liveUrl: "https://www.tiktok.com/@ggplay/live",
    art: { from: "#f97316", to: "#facc15", emoji: "⌨️" },
    status: "live",
    serverSeed: "c41e7b02da95836f1b7e40cd28a9f6350be7124d9ac8f0e3",
    createdAt: daysFromNow(-21),
  },
  {
    id: "gvw_handheld",
    slug: "steam-deck-oled-1tb-y-accesorios",
    title: "Steam Deck OLED 1 TB + accesorios",
    tagline: "Consola portátil, dock, funda rígida y 200 USD en juegos.",
    description:
      "Para quien juega en el bus, en la cola del banco o en la cama. Va con dock oficial para enchufarla al televisor y saldo cargado para que estrenes con biblioteca propia.",
    prize: [
      "Steam Deck OLED de 1 TB",
      "Dock oficial y cable USB-C",
      "Funda rígida de viaje y protector de pantalla",
      "200 USD en saldo para juegos",
    ],
    category: "movil",
    retailCents: 84900,
    ticketPriceCents: 200,
    packs: PACKS,
    totalTickets: 3000,
    minTickets: 1000,
    drawAt: daysFromNow(18),
    liveUrl: "https://www.tiktok.com/@ggplay/live",
    art: { from: "#0d9488", to: "#22c55e", emoji: "🕹️" },
    status: "live",
    serverSeed: "58b3ec9017d2af64c0e83b715da96f2408cd7e13ba50f9c6",
    createdAt: daysFromNow(-6),
  },
  {
    id: "gvw_switch2",
    slug: "nintendo-switch-2-pack-familiar",
    title: "Nintendo Switch 2 — Pack Familiar",
    tagline: "Venta cerrada. Sorteo en vivo este viernes.",
    description:
      "Se agotaron los boletos en once días. El sorteo se ejecuta en el directo del viernes con la semilla pública que proponga el chat.",
    prize: [
      "Nintendo Switch 2 con dock",
      "Dos pares de Joy-Con extra",
      "Tres juegos digitales a elección",
      "12 meses de suscripción online familiar",
    ],
    category: "consolas",
    retailCents: 89900,
    ticketPriceCents: 200,
    packs: PACKS,
    totalTickets: 3200,
    minTickets: 1000,
    drawAt: daysFromNow(2),
    liveUrl: "https://www.tiktok.com/@ggplay/live",
    art: { from: "#e11d48", to: "#f43f5e", emoji: "🍄" },
    status: "closed",
    serverSeed: "e70a2c8bd4936f150ba7c3e921df485607ba3c1de92a4f8",
    createdAt: daysFromNow(-34),
  },
  {
    id: "gvw_xbox",
    slug: "xbox-series-x-game-pass-12-meses",
    title: "Xbox Series X + 12 meses de Game Pass",
    tagline: "Sorteado el 9 de agosto en directo. Boleto 1.884.",
    description:
      "Primer sorteo con semilla aportada por el chat en vivo. El ganador entró con un paquete de cinco boletos comprado el mismo día del cierre.",
    prize: [
      "Xbox Series X 1 TB",
      "Mando adicional",
      "12 meses de Game Pass Ultimate",
      "Envío asegurado",
    ],
    category: "consolas",
    retailCents: 79900,
    ticketPriceCents: 200,
    packs: PACKS,
    totalTickets: 3000,
    minTickets: 900,
    drawAt: daysFromNow(-22),
    liveUrl: "https://www.tiktok.com/@ggplay/live",
    art: { from: "#16a34a", to: "#4ade80", emoji: "🟩" },
    status: "drawn",
    serverSeed: "a1c93f7e2b6084d5cf31e78a09b2d64e5730fa81c2e4b906",
    publicSeed: "chat-dijo-hadouken-3-veces",
    createdAt: daysFromNow(-70),
  },
  {
    id: "gvw_monitor",
    slug: "monitor-240hz-y-silla-gamer",
    title: "Monitor 240 Hz + silla gamer",
    tagline: "Sorteado el 26 de julio. Ganadora en Guadalajara.",
    description:
      "El combo que más se pidió en la encuesta de junio. Se entregó en mano en Guadalajara con transmisión de la entrega incluida.",
    prize: [
      "Monitor 27\" IPS 1440p a 240 Hz",
      "Silla ergonómica con soporte lumbar",
      "Brazo articulado para monitor",
    ],
    category: "perifericos",
    retailCents: 69900,
    ticketPriceCents: 200,
    packs: PACKS,
    totalTickets: 2400,
    minTickets: 700,
    drawAt: daysFromNow(-36),
    liveUrl: "https://www.tiktok.com/@ggplay/live",
    art: { from: "#0891b2", to: "#38bdf8", emoji: "🖱️" },
    status: "drawn",
    serverSeed: "6b4d0e91af38c25706de4b19ca83f7205ed19c4b7a06f832",
    publicSeed: "minuto-47-del-directo",
    createdAt: daysFromNow(-95),
  },
];

const POSTS: Post[] = [
  {
    id: "pst_verificable",
    slug: "como-hacemos-que-el-sorteo-sea-verificable",
    kind: "noticia",
    title: "Cómo hacemos que cada sorteo sea verificable",
    excerpt:
      "Publicamos el hash de la semilla antes de vender el primer boleto y revelamos la semilla al terminar. Te explicamos cómo comprobarlo tú mismo en dos minutos.",
    body: [
      "La pregunta que más nos llega es la misma: «¿cómo sé que el sorteo no está arreglado?». La respuesta corta es que no hace falta que nos creas: puedes recalcular el resultado por tu cuenta.",
      "Antes de poner a la venta el primer boleto generamos una semilla secreta y publicamos su hash SHA-256 en la ficha del sorteo. Ese hash queda congelado y con fecha. Si cambiásemos la semilla después, el hash ya no coincidiría y cualquiera lo vería.",
      "El día del directo, la audiencia aporta la semilla pública: una frase del chat, un número que se diga en voz alta, lo que salga. Nosotros no la controlamos y no podemos preverla.",
      "Con las dos semillas y la cantidad de boletos vendidos se calcula un HMAC-SHA256 y el boleto ganador sale del resto de esa división. Al terminar publicamos la semilla secreta y en la página de verificación puedes pegar los tres datos y ver que el número sale igual.",
    ],
    author: "Equipo GG Play",
    publishedAt: daysFromNow(-3),
    art: { from: "#6366f1", to: "#22d3ee", emoji: "🔐" },
  },
  {
    id: "pst_entrega_gdl",
    slug: "entrega-en-guadalajara-monitor-240hz",
    kind: "noticia",
    title: "Entregamos el setup de julio en Guadalajara",
    excerpt: "Tres semanas entre el sorteo y la entrega en mano, con transmisión completa del armado.",
    body: [
      "Cuando el premio es voluminoso preferimos entregarlo en persona si el ganador vive en una ciudad a la que podemos llegar. En julio tocó Guadalajara.",
      "Llevamos el monitor, la silla y el brazo articulado, lo armamos en el lugar y lo dejamos funcionando. La transmisión completa está en el canal, sin cortes.",
      "Para el resto de países seguimos enviando con seguro y aduana pagada: el ganador nunca pone dinero para recibir su premio.",
    ],
    author: "Sofía Maldonado",
    publishedAt: daysFromNow(-14),
    art: { from: "#f59e0b", to: "#ef4444", emoji: "📦" },
  },
  {
    id: "pst_podcast_12",
    slug: "podcast-12-el-precio-real-de-armar-un-pc",
    kind: "podcast",
    title: "GG Talk #12 — El precio real de armar un PC en LATAM",
    excerpt:
      "Impuestos, envíos, dólar paralelo y garantías: por qué la misma torre cuesta 400 dólares más según el país.",
    body: [
      "Comparamos la misma configuración en México, Colombia, Argentina y Chile con precios de tienda de agosto de 2026.",
      "Hablamos de cuándo conviene importar, cuándo comprar local y cómo calcular la garantía real que te queda si el componente falla.",
      "Cierre con el mail de un oyente que armó su torre con presupuesto de 700 dólares y qué le recortaríamos nosotros.",
    ],
    author: "GG Talk",
    publishedAt: daysFromNow(-5),
    duration: "58 min",
    art: { from: "#8b5cf6", to: "#ec4899", emoji: "🎙️" },
  },
  {
    id: "pst_podcast_11",
    slug: "podcast-11-que-paso-con-las-consolas-portatiles",
    kind: "podcast",
    title: "GG Talk #11 — Qué pasó con las consolas portátiles",
    excerpt: "De la sorpresa de 2023 al mercado saturado de 2026: qué sobrevive y qué no.",
    body: [
      "Repasamos las portátiles que llegaron a LATAM, cuáles tienen servicio técnico real y cuáles son una lotería si se rompen.",
      "Análisis de batería medida por nosotros en cinco juegos, no la que dice la caja.",
    ],
    author: "GG Talk",
    publishedAt: daysFromNow(-19),
    duration: "47 min",
    art: { from: "#0ea5e9", to: "#14b8a6", emoji: "🎧" },
  },
  {
    id: "pst_stream_viernes",
    slug: "directo-de-los-viernes-sorteo-y-partidas",
    kind: "stream",
    title: "Directo de los viernes: sorteo, partidas y preguntas",
    excerpt: "Todos los viernes 21:00 (CDMX) / 23:00 (BsAs). Sorteo al inicio, partidas con la comunidad después.",
    body: [
      "El sorteo siempre va en los primeros veinte minutos para que nadie tenga que esperar tres horas.",
      "Después jugamos con quien quiera entrar: se anuncia el código de sala en el chat.",
      "Si no puedes verlo en vivo, te avisamos por correo si ganaste. No hace falta estar conectado para llevarte el premio.",
    ],
    author: "GG Play",
    publishedAt: daysFromNow(-1),
    duration: "En vivo · viernes",
    art: { from: "#ef4444", to: "#f97316", emoji: "📺" },
  },
  {
    id: "pst_gratis",
    slug: "boleto-gratis-en-cada-sorteo",
    kind: "noticia",
    title: "Todos los sorteos llevan un boleto gratis por persona",
    excerpt: "Sin compra, sin condiciones raras. Está en las bases y vale exactamente lo mismo que uno comprado.",
    body: [
      "Cada cuenta puede reclamar un boleto gratuito por sorteo. Entra en el mismo bombo, con el mismo número correlativo y las mismas probabilidades por boleto que cualquier otro.",
      "Lo hacemos porque nos parece lo justo y porque en varios países es lo que exige la ley para este tipo de promociones.",
      "El botón está en la ficha de cada sorteo, debajo de los paquetes de boletos.",
    ],
    author: "Equipo GG Play",
    publishedAt: daysFromNow(-8),
    art: { from: "#22c55e", to: "#84cc16", emoji: "🎟️" },
  },
];

export async function buildSeedDatabase(): Promise<Database> {
  const users: User[] = [
    {
      id: "usr_admin",
      name: "Equipo GG Play",
      email: process.env.GG_ADMIN_EMAIL ?? "admin@ggplay.gg",
      passwordHash: hashPassword(process.env.GG_ADMIN_PASSWORD ?? "ggplay-admin"),
      country: "MX",
      role: "admin",
      createdAt: daysFromNow(-200),
    },
    {
      id: "usr_demo",
      name: "Jugador Demo",
      email: "demo@ggplay.gg",
      passwordHash: hashPassword("ggplay-demo"),
      country: "CO",
      role: "user",
      createdAt: daysFromNow(-40),
    },
    ...COMMUNITY_NAMES.map((name, i) => makeUser(i, name)),
  ];

  const entries: Entry[] = [];
  const giveaways: Giveaway[] = [];

  // Cuántos boletos lleva vendidos cada sorteo al arrancar la demo.
  const soldTarget: Record<string, number> = {
    gvw_ps5pro: 2740,
    gvw_pcrtx: 1890,
    gvw_perifericos: 2115,
    gvw_handheld: 960,
    gvw_switch2: 3200,
    gvw_xbox: 3000,
    gvw_monitor: 2400,
  };

  for (const seed of GIVEAWAY_SEEDS) {
    const buyers = users.filter((u) => u.role === "user");
    const target = soldTarget[seed.id] ?? 0;
    let next = 1;
    let entryIndex = 0;

    while (next <= target) {
      const buyer = buyers[Math.floor(rand() * buyers.length)];
      const pack = PACKS[Math.floor(rand() * PACKS.length)];
      const count = Math.min(pack.tickets, target - next + 1);
      const tickets = Array.from({ length: count }, (_, k) => next + k);
      next += count;
      entries.push({
        id: `ent_${seed.id}_${String(entryIndex++).padStart(4, "0")}`,
        userId: buyer.id,
        giveawayId: seed.id,
        tickets,
        amountCents: count === pack.tickets ? pack.priceCents : count * 200,
        source: "compra",
        reference: `GG-${(entryIndex * 7919).toString(16).toUpperCase().padStart(6, "0").slice(-6)}`,
        createdAt: seed.createdAt,
      });
    }

    const ticketsSold = next - 1;
    const giveaway: Giveaway = {
      ...seed,
      seedHash: await seedCommitment(seed.serverSeed),
      publicSeed: seed.publicSeed ?? null,
      result: null,
      createdAt: seed.createdAt,
    };

    if (seed.status === "drawn" && seed.publicSeed && ticketsSold > 0) {
      const { winningTicket, digest } = await computeDraw(seed.serverSeed, seed.publicSeed, ticketsSold);
      const winnerEntry = entries.find(
        (e) => e.giveawayId === seed.id && e.tickets.includes(winningTicket),
      )!;
      const winner = users.find((u) => u.id === winnerEntry.userId)!;
      giveaway.result = {
        winningTicket,
        winnerUserId: winner.id,
        winnerName: winner.name,
        winnerCountry: winner.country,
        ticketsSold,
        drawnAt: seed.drawAt,
        publicSeed: seed.publicSeed,
        serverSeed: seed.serverSeed,
        seedHash: giveaway.seedHash,
        digest,
      };
    }

    giveaways.push(giveaway);
  }

  return { users, giveaways, entries, posts: POSTS };
}
