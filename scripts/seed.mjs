#!/usr/bin/env node
/**
 * Borra la base de datos local para que la app vuelva a generarla desde
 * `src/lib/seed.ts` en el siguiente arranque.
 */
import { rm } from "node:fs/promises";
import path from "node:path";

const target = path.join(process.cwd(), ".data");
await rm(target, { recursive: true, force: true });
console.log("Base de datos local borrada. Se regenerará al arrancar la app.");
