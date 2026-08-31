/**
 * Ilustraciones de los premios.
 *
 * No usamos fotos de producto de terceros (derechos de autor y de marca), así
 * que el hardware se dibuja aquí en SVG con proyección dimétrica 2:1. Al venir
 * de una misma retícula y una misma regla de sombreado —cara superior clara,
 * izquierda media, derecha oscura— el conjunto se lee como un catálogo
 * coherente en vez de como iconos sueltos. Sin logotipos ni marcas.
 */

type P = [number, number];

const poly = (pts: P[]) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

/** Esquina inferior más cercana en (cx, cy); `a` va a la derecha, `b` a la izquierda. */
function faces(cx: number, cy: number, a: number, b: number, h: number) {
  // Los dos ejes horizontales van hacia atrás: derecha-arriba y izquierda-arriba.
  // Si el segundo bajara, ambos serían colineales y la cara superior degeneraría
  // en una línea (la caja se vería plana).
  const front: P = [cx, cy];
  const right: P = [cx + a, cy - a / 2];
  const back: P = [cx + a - b, cy - a / 2 - b / 2];
  const left: P = [cx - b, cy - b / 2];
  const up = (p: P): P => [p[0], p[1] - h];
  return {
    top: [up(front), up(right), up(back), up(left)] as P[],
    right: [front, right, up(right), up(front)] as P[],
    left: [front, left, up(left), up(front)] as P[],
    points: { front, right, back, left, up },
  };
}

function Box({
  cx,
  cy,
  a,
  b,
  h,
  tone,
  opacity = 1,
}: {
  cx: number;
  cy: number;
  a: number;
  b: number;
  h: number;
  tone: [string, string, string];
  opacity?: number;
}) {
  const f = faces(cx, cy, a, b, h);
  return (
    <g opacity={opacity}>
      <polygon points={poly(f.top)} fill={tone[0]} />
      <polygon points={poly(f.left)} fill={tone[1]} />
      <polygon points={poly(f.right)} fill={tone[2]} />
    </g>
  );
}

/** Sombra de contacto bajo el objeto. */
function Shadow({ cx, cy, rx = 96, ry = 20 }: { cx: number; cy: number; rx?: number; ry?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#000" opacity="0.5" />;
}

/** Tira de luz sobre la cara superior de una caja. */
function TopStrip({
  cx,
  cy,
  a,
  b,
  color,
}: {
  cx: number;
  cy: number;
  a: number;
  b: number;
  color: string;
}) {
  const f = faces(cx, cy, a, b, 0);
  return <polygon points={poly(f.top)} fill={color} opacity="0.95" />;
}

const WHITE: [string, string, string] = ["#f4f7fd", "#cfd7e6", "#9aa6bd"];
const DARK: [string, string, string] = ["#2b3244", "#1b2130", "#12161f"];
const CARBON: [string, string, string] = ["#39415a", "#242b3d", "#171c28"];
const STEEL: [string, string, string] = ["#4a5470", "#333c53", "#222937"];

const VIEWBOX = "0 0 400 250";

/* ------------------------------------------------------------------ escenas */

function ConsoleWhite() {
  return (
    <svg viewBox={VIEWBOX} className="prize-svg" role="img" aria-label="Consola de sobremesa">
      <Shadow cx={168} cy={212} rx={92} ry={17} />
      {/* peana */}
      <Box cx={152} cy={210} a={34} b={26} h={7} tone={STEEL} />
      {/* núcleo oscuro con costura de luz */}
      <Box cx={152} cy={203} a={34} b={26} h={128} tone={DARK} />
      <polygon
        points={poly(faces(152, 203, 34, 26, 128).top)}
        fill="#0d121c"
      />
      {/* paneles claros, ligeramente separados del núcleo */}
      <Box cx={140} cy={207} a={11} b={28} h={136} tone={WHITE} />
      <Box cx={181} cy={186} a={11} b={28} h={136} tone={WHITE} />
      {/* costura luminosa entre panel y núcleo */}
      <polygon points={poly(faces(151, 202, 2, 24, 118).left)} fill="#5ee7fb" opacity="0.9" />
      <ellipse cx={166} cy={73} rx={20} ry={10} fill="#16d5f0" opacity="0.25" />
      {/* mando */}
      <g transform="translate(272 168)">
        <ellipse cx="0" cy="30" rx="48" ry="10" fill="#000" opacity="0.45" />
        <path
          d="M-46 8c-7-16 2-29 15-29 9 0 13 4 31 4s22-4 31-4c13 0 22 13 15 29-6 13-15 22-24 18-7-3-9-11-22-11s-15 8-22 11c-9 4-18-5-24-18z"
          fill="#f2f5fb"
        />
        <path d="M-46 8c-7-16 2-29 15-29 4 0 7 1 11 2-11 7-16 20-11 33-7 2-12-1-15-6z" fill="#ffffff" opacity="0.75" />
        <rect x="-33" y="-13" width="16" height="4.5" rx="2.2" fill="#39415a" />
        <rect x="-27.2" y="-19" width="4.5" height="16" rx="2.2" fill="#39415a" />
        <circle cx="22" cy="-13" r="3.8" fill="#7c5cff" />
        <circle cx="31" cy="-6" r="3.8" fill="#16d5f0" />
        <circle cx="13" cy="-6" r="3.8" fill="#b6f13a" />
        <circle cx="22" cy="1" r="3.8" fill="#ff4d2e" />
        <circle cx="-9" cy="7" r="7.5" fill="#39415a" />
        <circle cx="11" cy="11" r="7.5" fill="#39415a" />
        <rect x="-14" y="-24" width="28" height="4" rx="2" fill="#5ee7fb" opacity="0.8" />
      </g>
    </svg>
  );
}

function ConsoleDark() {
  return (
    <svg viewBox={VIEWBOX} className="prize-svg" role="img" aria-label="Consola vertical">
      <Shadow cx={190} cy={214} rx={100} ry={18} />
      <Box cx={170} cy={208} a={38} b={30} h={10} tone={CARBON} />
      <Box cx={170} cy={198} a={38} b={30} h={120} tone={DARK} />
      {/* rejilla superior iluminada */}
      <TopStrip cx={170} cy={78} a={38} b={30} color="#0f1622" />
      <ellipse cx={186} cy={68} rx={22} ry={11} fill="#b6f13a" opacity="0.85" />
      <ellipse cx={186} cy={68} rx={14} ry={7} fill="#0b1016" />
      <rect x="146" y="150" width="48" height="3" fill="#b6f13a" opacity="0.7" />
      <g transform="translate(268 178)">
        <ellipse cx="0" cy="24" rx="44" ry="9" fill="#000" opacity="0.45" />
        <path
          d="M-46 8c-7-16 2-29 15-29 9 0 13 4 31 4s22-4 31-4c13 0 22 13 15 29-6 13-15 22-24 18-7-3-9-11-22-11s-15 8-22 11c-9 4-18-5-24-18z"
          fill="#39415a"
        />
        <path d="M-46 8c-7-16 2-29 15-29 4 0 7 1 11 2-11 7-16 20-11 33-7 2-12-1-15-6z" fill="#5b6480" opacity="0.85" />
        <rect x="-33" y="-13" width="16" height="4.5" rx="2.2" fill="#12161f" />
        <rect x="-27.2" y="-19" width="4.5" height="16" rx="2.2" fill="#12161f" />
        <circle cx="-9" cy="7" r="7.5" fill="#12161f" />
        <circle cx="11" cy="11" r="7.5" fill="#12161f" />
        <circle cx="22" cy="-12" r="3.6" fill="#b6f13a" />
        <circle cx="31" cy="-5" r="3.6" fill="#1f2635" />
        <circle cx="13" cy="-5" r="3.6" fill="#1f2635" />
        <circle cx="22" cy="2" r="3.6" fill="#1f2635" />
      </g>
    </svg>
  );
}

function GamingPc() {
  return (
    <svg viewBox={VIEWBOX} className="prize-svg" role="img" aria-label="Torre gamer y monitor">
      <Shadow cx={196} cy={214} rx={112} ry={19} />
      {/* monitor: panel con la cara frontal encendida */}
      <g transform="translate(246 104)">
        <path d="M-62 -46 66 -62v92L-62 46z" fill="#0d1420" />
        <path d="M-56 -40 60 -55v79L-56 39z" fill="url(#pcScreen)" />
        <rect x="-6" y="46" width="12" height="26" fill="#242b3d" />
        <path d="M-26 72h52l8 8h-68z" fill="#39415a" />
      </g>
      {/* torre con lateral acristalado y ventiladores RGB */}
      <Box cx={128} cy={208} a={40} b={44} h={110} tone={CARBON} />
      <polygon points={poly(faces(128, 208, 40, 44, 110).left)} fill="#0b1120" opacity="0.9" />
      <g opacity="0.98">
        <circle cx="108" cy="148" r="11" fill="none" stroke="#7c5cff" strokeWidth="3.4" />
        <circle cx="108" cy="174" r="11" fill="none" stroke="#16d5f0" strokeWidth="3.4" />
        <circle cx="108" cy="200" r="11" fill="none" stroke="#b6f13a" strokeWidth="3.4" />
      </g>
      <TopStrip cx={128} cy={98} a={40} b={44} color="#3a2f6b" />
      <TopStrip cx={128} cy={97} a={26} b={30} color="#7c5cff" />
      <defs>
        <linearGradient id="pcScreen" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#111a33" />
          <stop offset="0.45" stopColor="#7c5cff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#5ee7fb" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Peripherals() {
  // Retícula de teclas sobre la cara superior de la base, en la misma
  // proyección: P(u,v) = frente + u·(eje derecho) + v·(eje izquierdo).
  const KB = { cx: 118, cy: 196, a: 104, b: 58, h: 13 };
  const cols = 13;
  const rows = 5;
  const at = (uu: number, vv: number): P => [
    KB.cx + KB.a * uu - KB.b * vv,
    KB.cy - KB.h - (KB.a * uu) / 2 - (KB.b * vv) / 2,
  ];
  const key = (u: number, v: number) => {
    const du = 0.42 / cols;
    const dv = 0.42 / rows;
    return poly([at(u - du, v - dv), at(u + du, v - dv), at(u + du, v + dv), at(u - du, v + dv)]);
  };

  const keys: { d: string; accent: boolean }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      keys.push({
        d: key((c + 0.85) / (cols + 0.7), (r + 0.85) / (rows + 0.7)),
        accent: (r * 3 + c) % 9 === 0,
      });
    }
  }

  return (
    <svg viewBox={VIEWBOX} className="prize-svg" role="img" aria-label="Teclado, ratón y auriculares">
      <Shadow cx={150} cy={200} rx={104} ry={17} />
      <Shadow cx={300} cy={196} rx={44} ry={10} />
      {/* teclado */}
      <Box cx={KB.cx} cy={KB.cy} a={KB.a} b={KB.b} h={KB.h} tone={CARBON} />
      {keys.map((k, i) => (
        <polygon key={i} points={k.d} fill={k.accent ? "#8b6bff" : "#79839f"} />
      ))}
      {/* ratón, a la derecha del teclado */}
      <g transform="translate(292 158)">
        <path d="M0 30c-18 0-29-13-29-30S-16-28 0-28s29 11 29 28-11 30-29 30z" fill="#4a5470" />
        <path d="M0-28c-11 0-20 5-25 13 6 4 16 7 25 7s19-3 25-7c-5-8-14-13-25-13z" fill="#69748f" />
        <rect x="-2.5" y="-18" width="5" height="15" rx="2.5" fill="#16d5f0" />
        <path d="M-27 6c3 13 14 23 27 23" fill="none" stroke="#7c5cff" strokeWidth="3" opacity="0.95" />
      </g>
      {/* auriculares, arriba a la derecha */}
      <g transform="translate(316 62)">
        <path d="M-30 24a30 30 0 0 1 60 0" fill="none" stroke="#5b6480" strokeWidth="9" strokeLinecap="round" />
        <rect x="-40" y="20" width="18" height="34" rx="8" fill="#39415a" />
        <rect x="22" y="20" width="18" height="34" rx="8" fill="#39415a" />
        <rect x="-37" y="26" width="4" height="22" rx="2" fill="#7c5cff" />
        <rect x="33" y="26" width="4" height="22" rx="2" fill="#7c5cff" />
      </g>
    </svg>
  );
}

function Handheld() {
  return (
    <svg viewBox={VIEWBOX} className="prize-svg" role="img" aria-label="Consola portátil">
      <Shadow cx={200} cy={200} rx={112} ry={19} />
      <g transform="translate(200 132)">
        {/* cuerpo con empuñaduras */}
        <path
          d="M-118 -34c0-16 12-28 28-28h180c16 0 28 12 28 28v34c0 24-14 42-34 42-16 0-22-12-30-24h-108c-8 12-14 24-30 24-20 0-34-18-34-42z"
          fill="#2b3244"
        />
        <path
          d="M-118 -34c0-16 12-28 28-28h180c16 0 28 12 28 28v6H-118z"
          fill="#39415a"
        />
        {/* pantalla */}
        <rect x="-72" y="-52" width="144" height="72" rx="6" fill="#080d16" />
        <rect x="-66" y="-46" width="132" height="60" rx="4" fill="url(#handheldScreen)" />
        {/* controles */}
        <circle cx="-92" cy="-24" r="12" fill="#1b2130" />
        <circle cx="-92" cy="-24" r="7" fill="#4a5470" />
        <circle cx="92" cy="-24" r="12" fill="#1b2130" />
        <circle cx="92" cy="-24" r="7" fill="#4a5470" />
        <circle cx="88" cy="6" r="5" fill="#7c5cff" />
        <circle cx="100" cy="14" r="5" fill="#16d5f0" />
        <circle cx="-96" cy="10" r="5" fill="#5b6480" />
        <circle cx="-84" cy="16" r="5" fill="#5b6480" />
      </g>
      <defs>
        <linearGradient id="handheldScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#16d5f0" stopOpacity="0.9" />
          <stop offset="0.6" stopColor="#7c5cff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#0b1020" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function HybridConsole() {
  return (
    <svg viewBox={VIEWBOX} className="prize-svg" role="img" aria-label="Consola híbrida con mandos laterales">
      <Shadow cx={200} cy={198} rx={106} ry={18} />
      <g transform="translate(200 130)">
        <rect x="-64" y="-56" width="128" height="112" rx="8" fill="#12161f" />
        <rect x="-56" y="-48" width="112" height="96" rx="4" fill="url(#hybridScreen)" />
        {/* mandos desmontables */}
        <path d="M-100 -56h30v112h-30c-6 0-10-4-10-10v-92c0-6 4-10 10-10z" fill="#ff4d2e" />
        <path d="M100 -56H70v112h30c6 0 10-4 10-10v-92c0-6-4-10-10-10z" fill="#16d5f0" />
        <circle cx="-88" cy="-24" r="9" fill="#2b3244" />
        <circle cx="88" cy="20" r="9" fill="#2b3244" />
        <circle cx="-88" cy="18" r="4" fill="#2b3244" />
        <circle cx="88" cy="-30" r="4" fill="#12161f" />
        <circle cx="88" cy="-16" r="4" fill="#12161f" />
      </g>
      <defs>
        <linearGradient id="hybridScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b6f13a" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#16d5f0" stopOpacity="0.8" />
          <stop offset="1" stopColor="#0b1020" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MonitorChair() {
  return (
    <svg viewBox={VIEWBOX} className="prize-svg" role="img" aria-label="Monitor curvo y silla gamer">
      <Shadow cx={200} cy={214} rx={116} ry={19} />
      {/* monitor curvo */}
      <g transform="translate(150 0)">
        <path d="M-84 44c34-12 134-12 168 0v82c-34-12-134-12-168 0z" fill="#12161f" />
        <path d="M-76 52c32-10 124-10 152 0v66c-32-10-120-10-152 0z" fill="url(#monitorScreen)" />
        <rect x="-8" y="126" width="16" height="30" fill="#242b3d" />
        <path d="M-40 156h80l8 10h-96z" fill="#39415a" />
      </g>
      {/* silla */}
      <g transform="translate(300 96)">
        <path d="M-30 -18c0-14 8-24 22-24h16c14 0 22 10 22 24v52c0 10-6 16-16 16h-28c-10 0-16-6-16-16z" fill="#2b3244" />
        <path d="M-24 -14c0-10 6-16 16-16h16c10 0 16 6 16 16v10H-24z" fill="#ff4d2e" opacity="0.85" />
        <rect x="-34" y="50" width="68" height="14" rx="7" fill="#39415a" />
        <rect x="-4" y="64" width="8" height="26" fill="#242b3d" />
        <path d="M-30 96h60l-8 8h-44z" fill="#1b2130" />
      </g>
      <defs>
        <linearGradient id="monitorScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c5cff" stopOpacity="0.9" />
          <stop offset="0.55" stopColor="#16d5f0" stopOpacity="0.75" />
          <stop offset="1" stopColor="#0b1020" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const PRIZE_SHAPES = {
  "console-white": ConsoleWhite,
  "console-dark": ConsoleDark,
  "gaming-pc": GamingPc,
  peripherals: Peripherals,
  handheld: Handheld,
  hybrid: HybridConsole,
  "monitor-chair": MonitorChair,
} as const;

export type PrizeShape = keyof typeof PRIZE_SHAPES;

export function isPrizeShape(value: string | undefined): value is PrizeShape {
  return Boolean(value && value in PRIZE_SHAPES);
}
