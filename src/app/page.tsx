import Link from "next/link";
import { GiveawayCard } from "@/components/giveaway-card";
import { Countdown } from "@/components/countdown";
import { Badge, Progress, SectionHeading, Stat } from "@/components/ui";
import { listOpenGiveaways, listPosts, listWinners, platformStats } from "@/lib/queries";
import { countryFlag, countryName, money, number, shortDate } from "@/lib/format";

const STEPS = [
  {
    n: "01",
    title: "Crea tu cuenta gratis",
    body: "Nombre, correo y país. Nada más. Te toma menos de un minuto y no pedimos datos de pago para registrarte.",
  },
  {
    n: "02",
    title: "Elige tu sorteo y tus boletos",
    body: "Cada boleto es un número correlativo. Compra el paquete que quieras o reclama tu boleto gratis: valen exactamente lo mismo.",
  },
  {
    n: "03",
    title: "Mira el sorteo en vivo",
    body: "Sorteamos en directo con una semilla que aporta el chat. Si ganas te avisamos por correo aunque no estés conectado.",
  },
];

const FAQ = [
  {
    q: "¿Tengo que pagar para participar?",
    a: "No. Cada cuenta tiene derecho a un boleto gratuito por sorteo, con el mismo número correlativo y las mismas probabilidades que uno comprado. Los paquetes de pago solo sirven para llevar más boletos.",
  },
  {
    q: "¿Cómo sé que el sorteo no está arreglado?",
    a: "Publicamos el hash SHA-256 de la semilla secreta antes de vender el primer boleto. El día del directo la audiencia aporta la semilla pública y, al terminar, revelamos la secreta para que cualquiera recalcule el número ganador en nuestra página de verificación.",
  },
  {
    q: "¿Desde qué países puedo participar?",
    a: "Desde toda Latinoamérica y España, siendo mayor de edad en tu país. El envío del premio, con seguro y aduana pagada, corre por nuestra cuenta.",
  },
  {
    q: "¿Qué pasa si no se venden los boletos mínimos?",
    a: "El sorteo se pospone o se cancela y se devuelve el importe íntegro de todos los boletos comprados. El mínimo está publicado desde el primer día en la ficha de cada sorteo.",
  },
  {
    q: "¿Puedo cambiar el premio por dinero?",
    a: "Sí. Si el premio no te sirve, puedes pedir su valor de referencia en efectivo dentro de los 14 días siguientes al sorteo.",
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
      {/* ---------------------------------------------------------------- hero */}
      <section className="aurora relative overflow-hidden border-b border-ink-800">
        <div className="grid-lines absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/40 bg-lime-500/10 px-3 py-1.5 text-xs font-semibold text-lime-500">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime-500" />
              {stats.openGiveaways} sorteos abiertos ahora mismo
            </span>

            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
              Juega bien.
              <br />
              <span className="text-gradient">Gana en serio.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-mist-300 sm:text-lg">
              GG Play es la comunidad gamer de LATAM donde cada mes se sortean consolas, PCs y
              periféricos de verdad. Boletos desde {money(200)}, uno gratis para cada cuenta y un
              resultado que puedes recalcular tú mismo.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/registro"
                className="rounded-xl bg-gradient-to-r from-neon-500 to-aqua-500 px-6 py-3.5 text-sm font-bold text-ink-950 transition-transform hover:scale-[1.03]"
              >
                Crear cuenta gratis
              </Link>
              <Link
                href="/sorteos"
                className="rounded-xl border border-ink-700 px-6 py-3.5 text-sm font-semibold text-mist-200 transition-colors hover:border-neon-500/60 hover:text-white"
              >
                Ver sorteos abiertos
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-ink-800 pt-8">
              <div>
                <dt className="text-xs uppercase tracking-wide text-mist-400">Miembros</dt>
                <dd className="mt-1 text-2xl font-extrabold text-white">{number(stats.members)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-mist-400">Premios entregados</dt>
                <dd className="mt-1 text-2xl font-extrabold text-white">{stats.prizesDelivered}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-mist-400">En premios</dt>
                <dd className="mt-1 text-2xl font-extrabold text-white">{money(stats.prizeValueCents)}</dd>
              </div>
            </dl>
          </div>

          {hero && (
            <div className="card overflow-hidden">
              <div
                className="flex h-44 items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${hero.art.from}, ${hero.art.to})` }}
              >
                <span aria-hidden className="text-7xl drop-shadow-xl">
                  {hero.art.emoji}
                </span>
              </div>
              <div className="p-6">
                <Badge tone="live">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime-500" /> Sorteo destacado
                </Badge>
                <h2 className="mt-3 text-xl font-bold text-white">{hero.title}</h2>
                <p className="mt-2 text-sm text-mist-400">{hero.tagline}</p>

                <div className="mt-5">
                  <Countdown to={hero.drawAt} />
                </div>

                <div className="mt-5">
                  <Progress
                    value={hero.progress}
                    label={`${number(hero.ticketsSold)} de ${number(hero.totalTickets)} boletos vendidos`}
                  />
                </div>

                <Link
                  href={`/sorteos/${hero.slug}`}
                  className="mt-6 block rounded-xl bg-white px-5 py-3 text-center text-sm font-bold text-ink-950 transition-opacity hover:opacity-90"
                >
                  Participar desde {money(hero.ticketPriceCents)}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------------- ticker */}
      <div className="overflow-hidden border-b border-ink-800 bg-ink-900/50 py-3">
        <div className="ticker-track flex w-max gap-8 whitespace-nowrap text-sm text-mist-400">
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i} className="flex items-center gap-8">
              {item}
              <span className="text-ink-600">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- sorteos */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Abiertos ahora"
          title="Elige tu próximo premio"
          description="Todos los sorteos muestran cuántos boletos llevan vendidos, cuántos hacen falta como mínimo y a qué hora exacta se ejecuta el directo."
          action={{ href: "/sorteos", label: "Ver todos" }}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {open.slice(0, 6).map((giveaway) => (
            <GiveawayCard key={giveaway.id} giveaway={giveaway} />
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- cómo funciona */}
      <section className="border-y border-ink-800 bg-ink-900/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Tres pasos"
            title="Participar toma menos de un minuto"
            description="Sin sorteos escondidos en comentarios, sin seguir a diez cuentas, sin etiquetar a nadie."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="card p-7">
                <span className="text-sm font-black tracking-widest text-neon-400">{step.n}</span>
                <h3 className="mt-3 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-400">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- verificable */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="card grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua-400">
              Sorteo verificable
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              No te pedimos que confíes: te damos las cuentas
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-mist-400">
              Antes de vender el primer boleto publicamos el hash de una semilla secreta. En el
              directo, el chat aporta la semilla pública. El boleto ganador sale de combinar ambas
              con la cantidad exacta de boletos vendidos. Al terminar revelamos la semilla secreta y
              cualquiera puede repetir la operación.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/verificar"
                className="rounded-xl bg-gradient-to-r from-neon-500 to-aqua-500 px-5 py-3 text-sm font-bold text-ink-950"
              >
                Verificar un sorteo
              </Link>
              <Link
                href="/como-funciona"
                className="rounded-xl border border-ink-700 px-5 py-3 text-sm font-semibold text-mist-200 hover:text-white"
              >
                Leer el método completo
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-ink-700 bg-ink-950 p-6 font-mono text-xs leading-relaxed text-mist-300">
            <p className="text-mist-400"># 1. antes de abrir la venta</p>
            <p className="mt-1 break-all text-aqua-400">seedHash = sha256(serverSeed)</p>
            <p className="mt-4 text-mist-400"># 2. en el directo, lo dice el chat</p>
            <p className="mt-1 text-neon-400">publicSeed = &quot;hadouken x3&quot;</p>
            <p className="mt-4 text-mist-400"># 3. el número ganador</p>
            <p className="mt-1 break-all text-white">
              hmac(serverSeed, publicSeed + &quot;:&quot; + boletos) % boletos + 1
            </p>
            <p className="mt-4 text-mist-400"># 4. al terminar publicamos serverSeed</p>
            <p className="mt-1 text-lime-500">verificado ✓</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ ganadores */}
      <section className="border-y border-ink-800 bg-ink-900/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Ya entregados"
            title="Los últimos que se llevaron el premio"
            description="Cada ficha enlaza a la comprobación del sorteo y a la transmisión donde se ejecutó."
            action={{ href: "/ganadores", label: "Todos los ganadores" }}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {winners.slice(0, 4).map((g) => (
              <Link
                key={g.id}
                href={`/sorteos/${g.slug}`}
                className="card card-hover flex min-w-0 items-center gap-5 p-5"
              >
                <span
                  aria-hidden
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl"
                  style={{ background: `linear-gradient(135deg, ${g.art.from}, ${g.art.to})` }}
                >
                  {g.art.emoji}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{g.title}</p>
                  <p className="mt-1 truncate text-sm text-mist-400">
                    {countryFlag(g.result?.winnerCountry ?? "")} {g.result?.winnerName} ·{" "}
                    {countryName(g.result?.winnerCountry ?? "")}
                  </p>
                  <p className="mt-1 text-xs text-mist-400">
                    Boleto #{number(g.result?.winningTicket ?? 0)} · {shortDate(g.result?.drawnAt ?? g.drawAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ comunidad */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Comunidad"
          title="Más que sorteos"
          description="Podcast quincenal, directos de los viernes y análisis con precios reales de la región."
          action={{ href: "/comunidad", label: "Ir a comunidad" }}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link key={post.id} href={`/comunidad/${post.slug}`} className="card card-hover overflow-hidden">
              <div
                className="flex h-32 items-center justify-center text-5xl"
                style={{ background: `linear-gradient(135deg, ${post.art.from}, ${post.art.to})` }}
                aria-hidden
              >
                {post.art.emoji}
              </div>
              <div className="p-5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-neon-400">
                  {post.kind}
                  {post.duration ? ` · ${post.duration}` : ""}
                </span>
                <h3 className="mt-2 text-base font-bold leading-snug text-white">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-mist-400">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------------- faq */}
      <section className="border-t border-ink-800 bg-ink-900/40">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Dudas frecuentes" title="Lo que todo el mundo pregunta" />
          <div className="mt-8 divide-y divide-ink-800 border-y border-ink-800">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white">
                  {item.q}
                  <span className="text-mist-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-mist-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- cta */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="aurora card relative overflow-hidden p-10 text-center sm:p-16">
          <div className="grid-lines absolute inset-0" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Tu primer boleto es gratis
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-mist-300">
              Crea tu cuenta, reclama tu boleto gratuito en el sorteo que quieras y mira el directo
              del viernes. Si ganas, el premio te llega a casa sin que pongas un peso.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/registro"
                className="rounded-xl bg-gradient-to-r from-neon-500 to-aqua-500 px-6 py-3.5 text-sm font-bold text-ink-950"
              >
                Empezar ahora
              </Link>
              <Link
                href="/como-funciona"
                className="rounded-xl border border-ink-700 px-6 py-3.5 text-sm font-semibold text-mist-200 hover:text-white"
              >
                Cómo funciona
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <Stat value={number(stats.ticketsSold)} label="Boletos emitidos" />
              <Stat value={`${stats.prizesDelivered}`} label="Sorteos ejecutados" />
              <Stat value="100%" label="Resultados verificables" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
