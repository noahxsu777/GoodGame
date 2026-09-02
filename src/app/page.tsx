import Link from "next/link";
import { GiveawayCard } from "@/components/giveaway-card";
import { Countdown } from "@/components/countdown";
import { PrizeArt } from "@/components/prize-art";
import { Badge, LiveDot, Progress, SectionHeading, Stat } from "@/components/ui";
import { CountUp, HeroGlow, HeroLine, Reveal } from "@/components/motion";
import { listOpenGiveaways, listPosts, listWinners, platformStats } from "@/lib/queries";
import { countryFlag, countryName, money, number, shortDate, ticketCode } from "@/lib/format";

const STEPS = [
  { n: "01", title: "Crea tu cuenta", body: "Nombre, correo y pais. Sin datos de pago." },
  { n: "02", title: "Elige boletos", body: "Compra un pack o reclama el gratis. Valen igual." },
  { n: "03", title: "Mira el directo", body: "El chat pone la semilla. Te avisamos si ganas." },
];

const FAQ = [
  {
    q: "Tengo que pagar para participar?",
    a: "No. Cada cuenta tiene un boleto gratuito por sorteo, con las mismas probabilidades que uno comprado.",
  },
  {
    q: "Como se que el sorteo no esta arreglado?",
    a: "Publicamos el hash SHA-256 antes de vender. El chat aporta la semilla publica y al terminar cualquiera recalcula el numero.",
  },
  {
    q: "Desde que paises puedo participar?",
    a: "Latinoamerica y Espana, mayor de edad. El envio del premio corre por nuestra cuenta.",
  },
  {
    q: "Que pasa si no se venden los boletos minimos?",
    a: "Se pospone o se cancela y se devuelve el importe. El minimo esta en la ficha desde el primer dia.",
  },
];

function Kicker({ index, label }: { index: string; label: string }) {
  return (
    <div className="section-kicker">
      <span className="section-index">{index}</span>
      <span className="section-rule" />
      <span className="eyebrow !mt-0 text-mist-400">{label}</span>
    </div>
  );
}

export default async function HomePage() {
  const [open, winners, posts, stats] = await Promise.all([
    listOpenGiveaways(),
    listWinners(),
    listPosts(),
    platformStats(),
  ]);

  const hero = open[0];
  const rest = open.slice(1, 4);
  const ticker = [...open, ...winners].map((g) => `${g.art.emoji} ${g.title}`);

  return (
    <>
      <section className="aurora relative overflow-hidden">
        <HeroGlow />
        <div className="relative z-[1] mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
          <Reveal>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-[11px] font-medium text-lime-400">
                  <LiveDot /> {stats.openGiveaways} sorteos abiertos
                </span>
                <span className="text-[12px] text-mist-400">
                  <HeroLine />
                </span>
              </div>
              <h1 className="headline mt-5 text-[2.6rem] leading-[0.94] text-white sm:text-[4.1rem]">
                Juega bien.
                <br />
                <span className="text-gradient">Gana en serio.</span>
              </h1>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-mist-300">
                Consolas, PCs y perifericos para LATAM. Boletos desde {money(200)}, uno gratis por
                cuenta y un resultado que puedes comprobar.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/registro" className="btn btn-primary px-6 py-3.5 text-sm">
                  Crear cuenta gratis
                </Link>
                <Link href="/sorteos" className="btn btn-ghost px-6 py-3.5 text-sm">
                  Ver sorteos
                </Link>
              </div>
            </div>
          </Reveal>

          {hero && (
            <div className="hero-card panel relative overflow-hidden">
              <div className="group relative">
                <PrizeArt art={hero.art} size="hero" alt={hero.title} />
                <span className="absolute left-4 top-4 z-[2]">
                  <Badge tone="live">
                    <LiveDot /> Cierra pronto
                  </Badge>
                </span>
              </div>
              <div className="p-6">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist-400">Siguiente directo</p>
                <h2 className="font-display mt-1 text-xl font-semibold text-white">{hero.title}</h2>
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

        <div className="relative z-[1] mx-auto grid max-w-6xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 mx-4 mb-10 sm:mx-6">
          {[
            ["Miembros", <CountUp key="m" value={stats.members} />],
            ["Entregados", <CountUp key="p" value={stats.prizesDelivered} />],
            ["En premios", money(stats.prizeValueCents)],
          ].map(([label, value]) => (
            <div key={String(label)} className="bg-void/40 px-4 py-5 text-center backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.16em] text-mist-400">{label}</p>
              <p className="font-display mt-1 text-xl font-semibold tabular-nums text-white sm:text-2xl">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="overflow-hidden border-y border-white/8 py-3">
        <div className="ticker-track flex w-max gap-10 whitespace-nowrap text-[12px] text-mist-400">
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i} className="flex items-center gap-10">
              {item}
              <span className="text-neon-500/60">/</span>
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <Kicker index="01" label="Sorteos abiertos" />
          <SectionHeading
            title="Elige el siguiente premio"
            description="Uno destacado a la izquierda. Los demas, al lado. Todos con progreso y hora del directo."
            action={{ href: "/sorteos", label: "Ver todos" }}
          />
        </Reveal>
        <div className="prize-grid mt-10">
          {rest.map((giveaway, i) => (
            <Reveal key={giveaway.id} delay={i * 90} className={i === 0 ? "h-full" : ""}>
              <GiveawayCard giveaway={giveaway} featured={i === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-white/8 bg-ink-950/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <Kicker index="02" label="Como participar" />
            <SectionHeading title="Tres pasos. Menos de un minuto." />
          </Reveal>
          <div className="step-rail mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className="panel relative h-full p-6 text-center md:text-left">
                  <span className="font-mono text-neon-400">{step.n}</span>
                  <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-400">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <Kicker index="03" label="Confianza" />
          <div className="panel mt-4 grid gap-8 p-7 sm:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="headline text-[1.7rem] text-white sm:text-[2.1rem]">
                No te pedimos que confies. Te damos las cuentas.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-mist-400">
                Hash antes de vender. Semilla del chat. Numero ganador reproducible en el navegador.
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
            <div className="rounded-2xl border border-white/10 bg-void/50 p-5 font-mono text-[12px] leading-relaxed backdrop-blur">
              <p className="text-mist-400">01 hash</p>
              <p className="mt-1 text-aqua-400">sha256(serverSeed)</p>
              <p className="mt-4 text-mist-400">02 chat</p>
              <p className="mt-1 text-neon-400">publicSeed</p>
              <p className="mt-4 text-mist-400">03 ganador</p>
              <p className="mt-1 text-white">hmac % boletos + 1</p>
              <p className="mt-4 text-mist-400">04 revelacion</p>
              <p className="mt-1 text-lime-400">serverSeed publico</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-white/8 bg-ink-950/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <Kicker index="04" label="Ganadores" />
            <SectionHeading
              title="Los ultimos que se llevaron el premio"
              action={{ href: "/ganadores", label: "Historial" }}
            />
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {winners.slice(0, 4).map((g, i) => (
              <Reveal key={g.id} delay={i * 70}>
                <Link href={`/sorteos/${g.slug}`} className="panel panel-hover flex items-center gap-4 p-4">
                  <PrizeArt art={g.art} size="tile" alt={g.title} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{g.title}</p>
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
          <Kicker index="05" label="Comunidad" />
          <SectionHeading title="Mas que sorteos" action={{ href: "/comunidad", label: "Ver todo" }} />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.id} delay={i * 80}>
              <Link href={`/comunidad/${post.slug}`} className="panel panel-hover overflow-hidden">
                <PrizeArt art={post.art} size="card" />
                <div className="p-5">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-neon-400">{post.kind}</span>
                  <h3 className="mt-2 text-base font-semibold text-white">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-mist-400">{post.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-white/8">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Kicker index="06" label="FAQ + start" />
            <h2 className="headline text-[1.8rem] text-white sm:text-4xl">Tu primer boleto es gratis</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist-300">
              Crea la cuenta, reclama el boleto y entra al directo. Si ganas, el premio llega a casa.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/registro" className="btn btn-primary px-6 py-3.5 text-sm">Empezar ahora</Link>
              <Link href="/como-funciona" className="btn btn-ghost px-6 py-3.5 text-sm">Como funciona</Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <Stat value={number(stats.ticketsSold)} label="Boletos" />
              <Stat value={`${stats.prizesDelivered}`} label="Sorteos" tone="neon" />
              <Stat value="100%" label="Verificable" tone="lime" />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="divide-y divide-white/8 border-y border-white/8">
              {FAQ.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-white">
                    {item.q}
                    <span className="text-mist-400 transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-mist-400">{item.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
