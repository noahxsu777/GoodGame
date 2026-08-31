import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Database } from "./types";
import { buildSeedDatabase } from "./seed";

/**
 * Persistencia sencilla en JSON. Es deliberadamente pequeña y está aislada
 * detrás de `readDb` / `writeDb`, de modo que cambiar a Postgres, SQLite o
 * cualquier otro motor solo obliga a reescribir este archivo.
 */
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

let cache: Database | null = null;
/** mtime del archivo que corresponde a lo que hay en `cache`. */
let cacheStamp = 0;
let queue: Promise<unknown> = Promise.resolve();

/** Serializa las operaciones para que dos escrituras nunca se pisen. */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

/**
 * Next puede atender peticiones desde varios procesos, cada uno con su propia
 * memoria. Por eso la caché se valida contra el mtime del archivo: si otro
 * proceso escribió, se relee. Sin esto, un proceso serviría datos viejos (por
 * ejemplo, sin el usuario que otro acaba de registrar).
 */
async function load(): Promise<Database> {
  let stamp = 0;
  try {
    stamp = (await fs.stat(DATA_FILE)).mtimeMs;
  } catch {
    cache = await buildSeedDatabase();
    await persist(cache);
    return cache;
  }

  if (!cache || stamp !== cacheStamp) {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    try {
      cache = JSON.parse(raw) as Database;
      cacheStamp = stamp;
    } catch (error) {
      // Si el archivo quedó ilegible y ya teníamos datos, seguimos con ellos.
      if (!cache) throw error;
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
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = path.join(DATA_DIR, `db.${process.pid}.${Date.now()}.tmp`);
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
  cacheStamp = (await fs.stat(DATA_FILE)).mtimeMs;
}

/** Lectura sin bloqueo: devuelve una copia para evitar mutaciones accidentales. */
export async function readDb(): Promise<Database> {
  const db = await load();
  return structuredClone(db);
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
    cache = await buildSeedDatabase();
    await persist(cache);
  });
}
