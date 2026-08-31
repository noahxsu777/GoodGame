# GG Play — Good Game Play

Plataforma de sorteos gamer para LATAM: consolas, PCs y periféricos que se sortean
en directo cada mes, con un resultado que **cualquiera puede recalcular**.

Aplicación completa en Next.js 15 (App Router) con registro de usuarios, compra
simulada de boletos, boleto gratuito por sorteo, panel de administración y
sorteo verificable de extremo a extremo.

## Arrancar

```bash
npm install
npm run dev          # http://localhost:3000
```

Para producción:

```bash
npm run build
npm start
```

La primera petición crea `.data/db.json` con datos de ejemplo (7 sorteos, 32
miembros, ~15.000 boletos y 2 sorteos ya ejecutados). Para volver a empezar de
cero: `npm run seed`.

## Despliegue

Funciona **sin configurar ninguna variable de entorno**. En Vercel basta con
importar el repositorio y desplegar.

El almacén elige solo dónde escribir: en un entorno sin servidor el directorio
del proyecto es de solo lectura, así que usa `/tmp`; en local usa `.data/`. Si
no encuentra ningún sitio escribible, sigue funcionando en memoria en lugar de
fallar. Cualquiera de esas rutas se puede forzar con `GG_DATA_DIR`.

Consecuencia en serverless: `/tmp` es efímero y propio de cada instancia, así
que los registros y boletos creados en la demo desaparecen cuando la instancia
se recicla; los datos de ejemplo se vuelven a sembrar solos. Para persistencia
real hay que cambiar `src/lib/db.ts` por una base de datos (es el único archivo
que habría que tocar).

### Cuentas de prueba

| Rol           | Correo             | Contraseña     |
| ------------- | ------------------ | -------------- |
| Jugador       | `demo@ggplay.gg`   | `ggplay-demo`  |
| Administración| `admin@ggplay.gg`  | `ggplay-admin` |

Se pueden cambiar con `GG_ADMIN_EMAIL` y `GG_ADMIN_PASSWORD` antes del primer
arranque (ver `.env.example`).

## Qué incluye

| Ruta | Qué hace |
| --- | --- |
| `/` | Portada: sorteo destacado con cuenta atrás, sorteos abiertos, cómo funciona, ganadores, comunidad y FAQ |
| `/sorteos` | Listado con filtro por categoría, más los cerrados y el histórico |
| `/sorteos/[slug]` | Ficha del sorteo: premio, progreso, tus boletos, compra y boleto gratis |
| `/ganadores` | Historial de sorteos ejecutados con sus semillas y hash |
| `/verificar` | Recalcula el boleto ganador **en tu navegador** |
| `/como-funciona` | El recorrido completo y las reglas |
| `/comunidad` | Noticias, podcast y directos |
| `/cuenta` | Boletos, historial y premios ganados |
| `/admin` | Publicar, cerrar y ejecutar sorteos; crear sorteos nuevos |
| `/legal/…` | Bases, términos, privacidad y juego responsable |

## El sorteo verificable

Es la pieza central del proyecto y está en [`src/lib/draw.ts`](src/lib/draw.ts):

1. **Antes de vender el primer boleto** se genera una semilla secreta y se
   publica `sha256(serverSeed)` en la ficha del sorteo. A partir de ahí el
   resultado ya está condicionado: cambiar la semilla rompería el hash.
2. **En el directo**, la audiencia aporta la semilla pública (una frase del
   chat, un número dicho en voz alta). La organización no la controla.
3. **El número ganador** sale de
   `HMAC-SHA256(serverSeed, "publicSeed:boletosVendidos")`: se toman sus
   primeros 52 bits, se calcula el resto entre los boletos vendidos y se suma 1.
4. **Al terminar** se revela la semilla secreta y `/verificar` repite el cálculo
   en el navegador de quien quiera comprobarlo.

Está implementado con Web Crypto en vez de `node:crypto` a propósito: así el
mismo código corre en el servidor y en el cliente, y la página de verificación
no depende de que la API diga la verdad.

## Diseño

Estética de retransmisión esports: fondo casi negro azulado, tipografía angular
(Chakra Petch) para titulares y monoespaciada para cifras, paneles con la
esquina cortada dibujados en dos capas para que el borde de 1 px siga también la
diagonal, brillos neón, grano fino sobre todo el lienzo y detalles de HUD.

### Imágenes de los premios

Cada premio se pinta dentro de un mismo escenario —foco cenital, rejilla en
fuga, línea de horizonte, reflejo en el suelo y viñeta— con tres niveles:

1. **Foto real** (`art.image`): una ruta en `/public/premios` o una URL. Manda
   sobre todo lo demás. Ver [`public/premios/LEEME.md`](public/premios/LEEME.md).
2. **Ilustración vectorial** (`art.shape`): hardware genérico y sin marcas
   dibujado en `src/components/prize-illustrations.tsx` con proyección dimétrica
   2:1 y una regla de sombreado común (cara superior clara, izquierda media,
   derecha oscura). Es lo que se ve si no hay foto.
3. **Emoji** (`art.emoji`): último recurso.

Si una foto no carga, la tarjeta cae al nivel siguiente en vez de romperse.

## Decisiones técnicas

- **Next.js 15 + React 19 + TypeScript estricto.** Todo el estado vive en
  componentes de servidor; los formularios usan Server Actions con
  `useActionState`.
- **Tailwind CSS v4** con los tokens de la marca definidos en `@theme`
  (`src/app/globals.css`).
- **Persistencia en JSON** (`src/lib/db.ts`), aislada tras `readDb`/`writeDb`
  para poder cambiarla por Postgres o SQLite tocando un solo archivo. Las
  escrituras son atómicas (temporal + `rename`) y la caché en memoria se
  revalida por `mtime`, porque Next puede servir peticiones desde varios
  procesos.
- **Sesiones** con cookie firmada por HMAC y contraseñas con `scrypt`
  (`src/lib/session.ts`, `src/lib/crypto.ts`). La cookie se marca `Secure` según
  el protocolo real de la petición, no según `NODE_ENV`, para que funcione
  igual detrás de un proxy TLS que en local por HTTP.
- **Sin dependencias de UI.** Los componentes, la cuenta atrás y el verificador
  están escritos a mano para no arrastrar peso innecesario.

## Pruebas

```bash
npm run typecheck
npm run lint
npm run build

# extremo a extremo (con el servidor levantado en el puerto 3111)
npx playwright install chromium      # solo la primera vez
rm -rf .data && npm start -- -p 3111 &
npm run test:e2e                     # admite BASE_URL y CHROMIUM_PATH
```

`tests/e2e.mjs` recorre con Chromium el camino completo: registro, boleto
gratis (y que no se pueda repetir), compra de un paquete, cuadre del historial,
verificación correcta del sorteo, detección de una semilla manipulada, entrada
al panel, ejecución de un sorteo, publicación del ganador y ausencia de scroll
horizontal en móvil.

## Aviso

Proyecto de demostración. **Los pagos están simulados**: no se piden ni se
procesan datos de tarjeta, y los textos legales son un ejemplo de estructura que
habría que revisar con asesoría jurídica antes de operar sorteos reales.
