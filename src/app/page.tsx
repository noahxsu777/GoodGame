import Link from "next/link";
import { GiveawayCard } from "@/components/giveaway-card";
import { Countdown } from "@/components/countdown";
import { PrizeArt } from "@/components/prize-art";
import { Badge, LiveDot, Progress, SectionHeading, Stat } from "@/components/ui";
import { CountUp, HeroGlow, HeroLine, LiveFeed, Reveal } from "@/components/motion";
import { listOpenGiveaways, listPosts, listWinners, platformStats } from "@/lib/queries";
import { countryFlag, countryName, money, number, shortDate, ticketCode } from "@/lib/format";

const STEPS = [
  {
    n: "01",
    title: "Crea tu cuenta gratis",
    body: "Nombre, correo y pais. Nada mas. Te toma menos de un minuto y no pedimos datos de pago para registrarte.",
  },
  {
    n: "02",
    title: "Elige tu sorteo y tus boletos",
    body: "Cada boleto es un numero correlativo. Compra el paquete que quieras o reclama tu boleto gratis: valen exactamente lo mismo.",
  },
  {
    n: "03",
    title: "Mira el sorteo en vivo",
    body: "Sorteamos en directo con una semilla que aporta el chat. Si ganas te avisamos por correo aunque no estes conectado.",
  },
];

const FAQ = [
  {
    q: "Tengo que pagar para participar?",
    a: "No. Cada cuenta tiene derecho a un boleto gratuito por sorteo. Los paquetes de pago solo sirven para llevar mas boletos.",
  },
  {
    q: "Como se que el sorteo no esta arreglado?",
    a: "Publicamos el hash SHA-256 de la semilla secreta antes de vender el primer boleto. El chat aporta la semilla publica y al terminar cualquiera recalcula el numero ganador.",
  },
  {
    q: "Desde que paises puedo participar?",
    a: "Desde toda Latinoamerica y Espana, siendo mayor de edad. El envio del premio corre por nuestra cuenta.",
  },
  {
    q: "Que pasa si no se venden los boletos minimos?",
    a: "El sorteo se pospone o se cancela y se devuelve el importe integro. El minimo esta publicado en la ficha.",
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
        <div className="relative z-[1] mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="font-display inline-flex items-center gap-2 border border-lime-500/45 bg-lime-500/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-lime-400">
              <LiveDot />
              {stats.openGiveaways} sorteos abiertos ahora
            </span>

            <h1 className="headline mt-7 text-[3.25rem] leading-[0.92] text-white sm:text-7xl">
              <span>Juega bien.</span>
              <br />
              <HeroLine />
            </h1>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-mist-300 sm:text-lg">
              La comunidad gamer de LATAM donde cada mes se sortean consolas, PCs y perifericos de
              verdad. Boletos desde {money(200)}, uno gratis para cada cuenta y un resultado que
              puedes recalcular tu mismo.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/registro" className="btn btn-primary px-7 py-4 text-sm">
                Crear cuenta gratis
              </Link>
              <Link href="/sorteos" className="btn btn-ghost px-7 py-4 text-sm">
                Ver sorteos
              </Link>
            </div>

            <div className="mt-6">
              <LiveFeed />
            </div>

            <dl className="mt-11 grid max-w-lg grid-cols-3 gap-5 border-t border-ink-800 pt-8">
              <div>
                <dt className="text-[13px] text-mist-400">Miembros</dt>
                <dd className="font-display mt-1.5 text-2xl font-bold tabular-nums text-white">
                  <CountUp value={stats.members} />
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-mist-400">Premios entregados</dt>
                <dd className="font-display mt-1.5 text-2xl font-bold tabular-nums text-white">
                  <CountUp value={stats.prizesDelivered} />
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-mist-400">En premios</dt>
                <dd className="font-display mt-1.5 text-2xl font-bold tabular-nums text-white">
                  {money(stats.prizeValueCents)}
                </dd>
              </div>
            </dl>
          </div>

          {hero && (
            <div className="panel overflow-hidden">
              <div className="group relative">
                <PrizeArt art={hero.art} size="hero" />
                <span className="absolute left-4 top-4 z-[2]">
                  <Badge tone="live">
                    <LiveDot /> Sorteo destacado
                  </Badge>
                </span>
              </div>
              <div className="p-6 sm:p-7">
                <h2 className="font-display text-xl font-bold leading-tight tracking-tight text-white">
                  {hero.title}
                </h2>
                <p className="mt-2 text-sm text-mist-400">{hero.tagline}</p>
                <div className="mt-6">
                  <Countdown to={hero.drawAt} />
                </div>
                <div className="mt-6">
                  <Progress
                    value={hero.progress}
                    label={
                      <span className="font-mono text-[11px]">
                        {number(hero.ticketsSold)} / {number(hero.totalTickets)} boletos vendidos
                      </span>
                    }
                  />
                </div>
                <Link href={`/sorteos/${hero.slug}`} className="btn btn-light mt-7 w-full py-3.5 text-sm">
                  Participar desde {money(hero.ticketPriceCents)}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="overflow-hidden border-b border-ink-800 bg-ink-950 py-3.5">
        <div className="ticker-track flex w-max gap-8 whitespace-nowrap font-display text-[13px] font-semibold tracking-wide text-mist-400">
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i} className="flex items-center gap-8">
              {item}
              <span className="text-neon-500">&#9670;</span>
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Abiertos ahora"
            title="Elige tu proximo premio"
            description="Todos los sorteos muestran boletos vendidos, minimo y hora del directo."
            action={{ href: "/sorteos", label: "Ver todos" }}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {open.slice(0, 6).map((giveaway, i) => (
            <Reveal key={giveaway.id} delay={i * 80}>
              <GiveawayCard giveaway={giveaway} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative border-y border-ink-800 bg-ink-950">
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Tres pasos"
              title="Participar toma menos de un minuto"
              description="Sin sorteos escondidos en comentarios ni etiquetar a nadie."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className="panel p-7">
                  <span className="font-display text-3xl font-bold text-neon-500/70">{step.n}</span>
                  <h3 className="font-display mt-4 text-lg font-bold tracking-tight text-white">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-mist-400">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal>
          <div className="panel grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow flex items-center gap-2 text-aqua-400">
                <span aria-hidden className="inline-block h-3 w-[3px] bg-aqua-500" />
                Sorteo verificable
              </p>
              <h2 className="headline mt-3 text-[1.75rem] text-white sm:text-4xl">
                No te pedimos que confies: te damos las cuentas
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-mist-400">
                Antes de vender el primer boleto publicamos el hash de una semilla secreta. En el
                directo, el chat aporta la semilla publica. Al terminar cualquiera puede repetir la operacion.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/verificar" className="btn btn-primary px-6 py-3.5 text-xs">
                  Verificar un sorteo
                </Link>
                <Link href="/como-funciona" className="btn btn-ghost px-6 py-3.5 text-xs">
                  Leer el metodo
                </Link>
              </div>
            </div>
            <div className="border border-ink-700 bg-void p-6 font-mono text-xs leading-relaxed">
              <p className="text-mist-400"># 1. antes de abrir la venta</p>
              <p className="mt-1 break-all text-aqua-400">seedHash = sha256(serverSeed)</p>
              <p className="mt-4 text-mist-400"># 2. en el directo, lo dice el chat</p>
              <p className="mt-1 text-neon-400">publicSeed = "hadouken x3"</p>
              <p className="mt-4 text-mist-400"># 3. el numero ganador</p>
              <p className="mt-1 break-all text-white">
                hmac(serverSeed, publicSeed + ":" + boletos) % boletos + 1
              </p>
              <p className="mt-4 text-mist-400"># 4. al terminar publicamos serverSeed</p>
              <p className="mt-1 text-lime-400">verificado</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-ink-800 bg-ink-950">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Ya entregados"
              title="Los ultimos que se llevaron el premio"
              description="Cada ficha enlaza a la comprobacion del sorteo."
              action={{ href: "/ganadores", label: "Todos los ganadores" }}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {winners.slice(0, 4).map((g, i) => (
              <Reveal key={g.id} delay={i * 70}>
                <Link href={`/sorteos/${g.slug}`} className="panel panel-hover group flex min-w-0 items-center gap-5 p-5">
                  <PrizeArt art={g.art} size="tile" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display truncate text-sm font-bold tracking-tight text-white">{g.title}</p>
                    <p className="mt-1.5 truncate text-sm text-mist-400">
                      {countryFlag(g.result?.winnerCountry ?? "")} {g.result?.winnerName} · {" "}
                      {countryName(g.result?.winnerCountry ?? "")}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-mist-400">
                      {ticketCode(g.result?.winningTicket ?? 0)} · {shortDate(g.result?.drawnAt ?? g.drawAt)}
                    </p>
                  </div>
                  <span aria-hidden className="font-display shrink-0 text-lime-400">ok</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Comunidad"
            title="Mas que sorteos"
            description="Podcast, directos y analisis con precios reales de la region."
            action={{ href: "/comunidad", label: "Ir a comunidad" }}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.id} delay={i * 80}>
              <Link href={`/comunidad/${post.slug}`} className="panel panel-hover group overflow-hidden">
                <div>
                  <PrizeArt art={post.art} size="card" />
                </div>
                <div className="p-5">
                  <span className="font-display text-[10px] font-semibold tracking-[0.18em] text-neon-400">
                    {post.kind}
                    {post.duration ? ` · ${post.duration}` : ""}
                  </span>
                  <h3 className="font-display mt-2.5 text-base font-bold leading-tight tracking-tight text-white">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-mist-400">{post.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-ink-800 bg-ink-950">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <SectionHeading eyebrow="Dudas frecuentes" title="Lo que todo el mundo pregunta" />
          </Reveal>
          <div className="mt-10 divide-y divide-ink-800 border-y border-ink-800">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold tracking-wide text-white">
                  {item.q}
                  <span className="text-neon-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3.5 text-sm leading-relaxed text-mist-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal>
          <div className="aurora panel relative overflow-hidden p-10 text-center sm:p-16">
            <div className="relative">
              <h2 className="headline text-[2rem] text-white sm:text-5xl">Tu primer boleto es gratis</h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-mist-300">
                Crea tu cuenta, reclama tu boleto gratuito y mira el directo del viernes.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link href="/registro" className="btn btn-primary px-7 py-4 text-sm">
                  Empezar ahora
                </Link>
                <Link href="/como-funciona" className="btn btn-ghost px-7 py-4 text-sm">
                  Como funciona
                </Link>
              </div>
              <div className="mt-14 grid gap-4 sm:grid-cols-3">
                <Stat value={number(stats.ticketsSold)} label="Boletos emitidos" />
                <Stat value={`${stats.prizesDelivered}`} label="Sorteos ejecutados" tone="neon" />
                <Stat value="100%" label="Resultados verificables" tone="lime" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
