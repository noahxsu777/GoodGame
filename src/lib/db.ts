import "server-only";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Database } from "./types";
import { buildSeedDatabase } from "./seed";

/**
 * Persistencia sencilla en JSON. Es deliberadamente pequeña y está aislada
 * detrás de `readDb` / `writeDb`, de modo que cambiar a Postgres, SQLite o
 * cualquier otro motor solo obliga a reescribir este archivo.
 *
 * Requisito importante: la app tiene que arrancar sin configurar nada. En un
 * entorno sin servidor (Vercel, Lambda) el directorio del proyecto es de solo
 * lectura, así que se busca el primer sitio escribible y, si no hay ninguno,
 * se sigue funcionando solo en memoria en lugar de reventar.
 */
function candidateDirs(): string[] {
  return [
    process.env.GG_DATA_DIR,
    // En serverless solo /tmp es escribible (y es efímero por instancia).
    process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
      ? path.join(os.tmpdir(), "gg-play")
      : null,
    path.join(process.cwd(), ".data"),
    path.join(os.tmpdir(), "gg-play"),
  ].filter((dir): dir is string => Boolean(dir));
}

let cache: Database | null = null;
/** mtime del archivo que corresponde a lo que hay en `cache`. */
let cacheStamp = 0;
/** Ruta en uso, o `null` si toca trabajar solo en memoria. */
let dataFile: string | null = null;
let located = false;
let queue: Promise<unknown> = Promise.resolve();

/** Serializa las operaciones para que dos escrituras nunca se pisen. */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

/** Primer directorio donde de verdad se puede escribir. */
async function locateDataFile(): Promise<string | null> {
  if (located) return dataFile;
  located = true;

  for (const dir of candidateDirs()) {
    try {
      await fs.mkdir(dir, { recursive: true });
      const probe = path.join(dir, ".escritura");
      await fs.writeFile(probe, "ok", "utf8");
      await fs.rm(probe, { force: true });
      dataFile = path.join(dir, "db.json");
      return dataFile;
    } catch {
      // Se prueba el siguiente candidato.
    }
  }

  console.warn("[gg-play] Sin disco escribible: los datos vivirán solo en memoria.");
  dataFile = null;
  return null;
}

/** Deja de usar el disco tras un fallo de escritura, sin tirar la petición. */
function fallBackToMemory(error: unknown): void {
  if (dataFile) {
    console.warn("[gg-play] No se pudo escribir en disco, se sigue en memoria:", error);
    dataFile = null;
  }
}

async function seedIntoCache(): Promise<Database> {
  cache = await buildSeedDatabase();
  return cache;
}

/**
 * Next puede atender peticiones desde varios procesos, cada uno con su propia
 * memoria. Por eso la caché se valida contra el mtime del archivo: si otro
 * proceso escribió, se relee. Sin esto, un proceso serviría datos viejos (por
 * ejemplo, sin el usuario que otro acaba de registrar).
 */
async function load(): Promise<Database> {
  const file = await locateDataFile();
  if (!file) return cache ?? (await seedIntoCache());

  let stamp: number;
  try {
    stamp = (await fs.stat(file)).mtimeMs;
  } catch {
    // Todavía no existe: se siembra y se intenta guardar.
    const db = cache ?? (await seedIntoCache());
    await persist(db);
    return db;
  }

  if (!cache || stamp !== cacheStamp) {
    try {
      cache = JSON.parse(await fs.readFile(file, "utf8")) as Database;
      cacheStamp = stamp;
    } catch (error) {
      // Archivo ilegible: se conserva lo que ya había en memoria y, si no
      // había nada, se vuelve a sembrar. Nunca se propaga el fallo a la página.
      if (!cache) {
        console.warn("[gg-play] Base de datos ilegible, se resiembra:", error);
        return seedIntoCache();
      }
    }
  }
  return cache;
}

/**
 * Escritura atómica: primero a un temporal y luego `rename`, que en POSIX es
 * atómico. Sin esto, un proceso que lea mientras otro escribe se encuentra el
 * archivo a medias y el JSON.parse falla.
 */
async function persist(db: Database): Promise<void> {
  const file = dataFile;
  if (!file) return;

  const dir = path.dirname(file);
  const tmp = path.join(dir, `db.${process.pid}.${Date.now()}.tmp`);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
    await fs.rename(tmp, file);
    cacheStamp = (await fs.stat(file)).mtimeMs;
  } catch (error) {
    await fs.rm(tmp, { force: true }).catch(() => undefined);
    fallBackToMemory(error);
  }
}

/**
 * Lectura sin bloqueo. Devuelve la instancia viva por rendimiento: la capa de
 * consultas solo lee. Para modificar hay que pasar por `writeDb`.
 */
export async function readDb(): Promise<Database> {
  return load();
}

/** Lee, deja mutar y guarda de forma atómica respecto de otras escrituras. */
export async function writeDb<T>(mutator: (db: Database) => T | Promise<T>): Promise<T> {
  return withLock(async () => {
    const db = await load();
    const result = await mutator(db);
    await persist(db);
    cache = db;
    return result;
  });
}

/** Solo para pruebas y para el script de reseteo. */
export async function resetDb(): Promise<void> {
  return withLock(async () => {
    await locateDataFile();
    cache = await buildSeedDatabase();
    await persist(cache);
  });
}
