import Link from "next/link";
import { GiveawayCard } from "@/components/giveaway-card";
import { Countdown } from "@/components/countdown";
import { PrizeArt } from "@/components/prize-art";
import { Badge, LiveDot, Progress, SectionHeading, Stat } from "@/components/ui";
import { CountUp, HeroGlow, HeroLine, Reveal } from "@/components/motion";
import { listOpenGiveaways, listPosts, listWinners, platformStats } from "@/lib/queries";
import { countryFlag, countryName, money, number, shortDate, ticketCode } from "@/lib/format";

const STEPS = [
  {
    n: "01",
    title: "Crea tu cuenta gratis",
    body: "Nombre, correo y pais. Menos de un minuto. No pedimos datos de pago para registrarte.",
  },
  {
    n: "02",
    title: "Elige sorteo y boletos",
    body: "Cada boleto es un numero correlativo. Compra un paquete o reclama el boleto gratis: valen lo mismo.",
  },
  {
    n: "03",
    title: "Mira el sorteo en vivo",
    body: "Sorteamos en directo con una semilla que aporta el chat. Si ganas, te avisamos por correo.",
  },
];

const FAQ = [
  {
    q: "Tengo que pagar para participar?",
    a: "No. Cada cuenta tiene un boleto gratuito por sorteo, con las mismas probabilidades que uno comprado.",
  },
  {
    q: "Como se que el sorteo no esta arreglado?",
    a: "Publicamos el hash SHA-256 de la semilla secreta antes de vender el primer boleto. El chat aporta la semilla publica y al terminar cualquiera puede recalcular el numero ganador.",
  },
  {
    q: "Desde que paises puedo participar?",
    a: "Desde toda Latinoamerica y Espana, siendo mayor de edad. El envio del premio corre por nuestra cuenta.",
  },
  {
    q: "Que pasa si no se venden los boletos minimos?",
    a: "El sorteo se pospone o se cancela y se devuelve el importe integro. El minimo esta en la ficha desde el primer dia.",
  },
  {
    q: "Puedo cambiar el premio por dinero?",
    a: "Si. Puedes pedir su valor de referencia en efectivo dentro de los 14 dias siguientes al sorteo.",
  },
];

export default async function HomePage() {
  const [open, winners, posts, stats] = await Promise.all([
    listOpenGiveaways(),
    listWinners(),
    listPosts(),
    platformStats(),
  ]);

  const hero = open[0];
  const ticker = [...open, ...winners].map((g) => `${g.art.emoji} ${g.title}`);

  return (
    <>
      <section className="aurora relative overflow-hidden border-b border-ink-800">
        <HeroGlow />
        <div className="relative z-[1] mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.92fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-[11px] font-medium text-lime-400">
                <LiveDot />
                {stats.openGiveaways} sorteos abiertos
              </span>
              <span className="text-[12px] text-mist-400">
                <HeroLine />
              </span>
            </div>

            <h1 className="headline mt-6 text-[2.75rem] leading-[0.94] text-white sm:text-[4.25rem]">
              Juega bien.
              <br />
              <span className="text-gradient">Gana en serio.</span>
            </h1>

            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-mist-300 sm:text-base">
              Sorteos de consolas, PCs y perifericos para LATAM. Boletos desde {money(200)},
              uno gratis por cuenta y un resultado que puedes comprobar tu mismo.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/registro" className="btn btn-primary px-6 py-3.5 text-sm">
                Crear cuenta gratis
              </Link>
              <Link href="/sorteos" className="btn btn-ghost px-6 py-3.5 text-sm">
                Ver sorteos
              </Link>
            </div>

            <div className="trust mt-7">
              <span className="trust-item">Hash publicado antes de vender</span>
              <span className="trust-item">Boleto gratis por sorteo</span>
              <span className="trust-item">Envio a LATAM</span>
            </div>

            <dl className="mt-9 grid max-w-md grid-cols-3 gap-4 border-t border-ink-800 pt-7">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.14em] text-mist-400">Miembros</dt>
                <dd className="font-display mt-1.5 text-[1.65rem] font-semibold tabular-nums text-white">
                  <CountUp value={stats.members} />
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.14em] text-mist-400">Entregados</dt>
                <dd className="font-display mt-1.5 text-[1.65rem] font-semibold tabular-nums text-white">
                  <CountUp value={stats.prizesDelivered} />
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.14em] text-mist-400">En premios</dt>
                <dd className="font-display mt-1.5 text-[1.65rem] font-semibold tabular-nums text-white">
                  {money(stats.prizeValueCents)}
                </dd>
              </div>
            </dl>
          </div>

          {hero && (
            <div className="hero-card panel relative overflow-hidden">
              <div className="group relative">
                <PrizeArt art={hero.art} size="hero" />
                <span className="absolute left-4 top-4 z-[2]">
                  <Badge tone="live">
                    <LiveDot /> Destacado
                  </Badge>
                </span>
              </div>
              <div className="p-6 sm:p-7">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist-400">Proximo directo</p>
                <h2 className="font-display mt-1.5 text-xl font-semibold leading-tight tracking-tight text-white">
                  {hero.title}
                </h2>
                <p className="mt-2 text-sm text-mist-400">{hero.tagline}</p>
                <div className="mt-5">
                  <Countdown to={hero.drawAt} />
                </div>
                <div className="mt-5">
                  <Progress
                    value={hero.progress}
                    label={
                      <span className="font-mono text-[11px]">
                        {number(hero.ticketsSold)} / {number(hero.totalTickets)} boletos
                      </span>
                    }
                  />
                </div>
                <Link href={`/sorteos/${hero.slug}`} className="btn btn-light mt-6 w-full py-3.5 text-sm">
                  Participar desde {money(hero.ticketPriceCents)}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="overflow-hidden border-b border-ink-800 bg-ink-950/80 py-3">
        <div className="ticker-track flex w-max gap-10 whitespace-nowrap text-[12px] font-medium tracking-wide text-mist-400">
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i} className="flex items-center gap-10">
              {item}
              <span className="text-neon-500/70">/</span>
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Abiertos ahora"
            title="Elige tu proximo premio"
            description="Cada ficha muestra progreso, minimo y la hora exacta del directo."
            action={{ href: "/sorteos", label: "Ver todos" }}
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {open.slice(0, 6).map((giveaway, i) => (
            <Reveal key={giveaway.id} delay={i * 60}>
              <GiveawayCard giveaway={giveaway} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-ink-800 bg-ink-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Tres pasos"
              title="Participar toma menos de un minuto"
              description="Sin seguir cuentas, sin etiquetar, sin sorteos escondidos en comentarios."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 80}>
                <div className="panel h-full p-6">
                  <span className="font-mono text-[13px] text-neon-400">{step.n}</span>
                  <h3 className="font-display mt-4 text-lg font-semibold tracking-tight text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-400">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <div className="panel grid gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow text-aqua-400">Sorteo verificable</p>
              <h2 className="headline mt-3 text-[1.7rem] text-white sm:text-[2.15rem]">
                No te pedimos que confies. Te damos las cuentas.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-mist-400">
                El hash de la semilla secreta se publica antes de la venta. El chat pone la semilla
                publica. El boleto ganador sale de las dos y de los boletos vendidos.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/verificar" className="btn btn-primary px-5 py-3 text-xs">
                  Verificar un sorteo
                </Link>
                <Link href="/como-funciona" className="btn btn-ghost px-5 py-3 text-xs">
                  Leer el metodo
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-ink-700 bg-void p-5 font-mono text-[12px] leading-relaxed">
              <p className="text-mist-400">01  hash previo</p>
              <p className="mt-1 text-aqua-400">seedHash = sha256(serverSeed)</p>
              <p className="mt-4 text-mist-400">02  semilla del chat</p>
              <p className="mt-1 text-neon-400">publicSeed = hadouken x3</p>
              <p className="mt-4 text-mist-400">03  numero ganador</p>
              <p className="mt-1 text-white">hmac(serverSeed, publicSeed:boletos) % n + 1</p>
              <p className="mt-4 text-mist-400">04  revelacion</p>
              <p className="mt-1 text-lime-400">serverSeed publicado</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-ink-800 bg-ink-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Ya entregados"
              title="Los ultimos que se llevaron el premio"
              description="Cada ficha abre la comprobacion del sorteo y la transmision."
              action={{ href: "/ganadores", label: "Todos los ganadores" }}
            />
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {winners.slice(0, 4).map((g, i) => (
              <Reveal key={g.id} delay={i * 50}>
                <Link href={`/sorteos/${g.slug}`} className="panel panel-hover group flex min-w-0 items-center gap-4 p-4">
                  <PrizeArt art={g.art} size="tile" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display truncate text-sm font-semibold tracking-tight text-white">{g.title}</p>
                    <p className="mt-1 truncate text-sm text-mist-400">
                      {countryFlag(g.result?.winnerCountry ?? "")} {g.result?.winnerName} · {countryName(g.result?.winnerCountry ?? "")}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-mist-400">
                      {ticketCode(g.result?.winningTicket ?? 0)} · {shortDate(g.result?.drawnAt ?? g.drawAt)}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Comunidad"
            title="Mas que sorteos"
            description="Podcast, directos y analisis con precios reales de la region."
            action={{ href: "/comunidad", label: "Ir a comunidad" }}
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.id} delay={i * 60}>
              <Link href={`/comunidad/${post.slug}`} className="panel panel-hover group overflow-hidden">
                <PrizeArt art={post.art} size="card" />
                <div className="p-5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neon-400">
                    {post.kind}
                    {post.duration ? ` · ${post.duration}` : ""}
                  </span>
                  <h3 className="font-display mt-2 text-base font-semibold leading-tight text-white">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-mist-400">{post.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-ink-800 bg-ink-950">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="Lo que suele preguntarse" />
          </Reveal>
          <div className="mt-8 divide-y divide-ink-800 border-y border-ink-800">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-white">
                  {item.q}
                  <span className="text-mist-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-mist-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <div className="aurora panel relative overflow-hidden px-8 py-12 text-center sm:px-14 sm:py-16">
            <p className="eyebrow text-neon-400">Empieza sin pagar</p>
            <h2 className="headline mt-3 text-[2rem] text-white sm:text-4xl">Tu primer boleto es gratis</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-mist-300">
              Crea la cuenta, reclama el boleto gratuito y entra al directo. Si ganas, el premio llega a casa.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/registro" className="btn btn-primary px-6 py-3.5 text-sm">
                Empezar ahora
              </Link>
              <Link href="/como-funciona" className="btn btn-ghost px-6 py-3.5 text-sm">
                Como funciona
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <Stat value={number(stats.ticketsSold)} label="Boletos emitidos" />
              <Stat value={`${stats.prizesDelivered}`} label="Sorteos ejecutados" tone="neon" />
              <Stat value="100%" label="Resultados verificables" tone="lime" />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
