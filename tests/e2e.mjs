/**
 * Prueba de extremo a extremo del recorrido completo: registro, boleto gratis,
 * compra simulada, verificación del sorteo en el navegador y ejecución del
 * sorteo desde el panel de administración.
 *
 * Uso:
 *   npm run build && npm start -- -p 3111    (en otra terminal)
 *   BASE_URL=http://127.0.0.1:3111 npm run test:e2e
 *
 * Arranca contra una base recién sembrada (borra `.data/` antes de lanzarla).
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3111";
const log = [];
const check = (name, ok, extra = "") => {
  log.push(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);
  if (!ok) process.exitCode = 1;
};

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

// 1. Portada
await page.goto(BASE, { waitUntil: "networkidle" });
check("portada muestra el nombre", (await page.title()).includes("GG Play"));
check("hero con sorteos abiertos", (await page.getByText(/sorteos abiertos ahora/i).count()) > 0);
check("tarjetas de sorteo listadas", (await page.locator('a[href^="/sorteos/"]').count()) >= 4);

// 2. Registro de un usuario nuevo
const email = `tester${Date.now()}@ejemplo.gg`;
await page.goto(`${BASE}/registro`);
await page.fill("#name", "Tester Automático");
await page.fill("#email", email);
await page.selectOption("#country", "MX");
await page.fill("#password", "clave-larga-123");
await page.click('button[type="submit"]');
await page.waitForURL("**/cuenta", { timeout: 15000 });
check("registro crea sesión y entra a la cuenta", page.url().endsWith("/cuenta"));
check("cuenta vacía al empezar", (await page.getByText(/Todavía no tienes boletos/i).count()) === 1);

// 3. Reclamar boleto gratis
await page.goto(`${BASE}/sorteos/combo-perifericos-pro`);
await page.getByRole("button", { name: /boleto gratis/i }).click();
await page.waitForSelector("text=/Boleto gratis asignado/i", { timeout: 15000 });
check("boleto gratis asignado", true);
await page.reload();
check("boleto gratis no se puede repetir", (await page.getByText(/Ya reclamaste tu boleto gratis/i).count()) === 1);

// 4. Comprar un paquete de boletos
await page.goto(`${BASE}/sorteos/combo-perifericos-pro`);
await page.getByRole("button", { name: /^5\s*boletos/i }).click();
await page.getByRole("button", { name: /^Participar por/i }).click();
await page.waitForSelector("text=/¡Listo! Tus boletos/i", { timeout: 15000 });
check("compra simulada asigna 5 boletos", true);

// 5. La cuenta refleja las participaciones
await page.goto(`${BASE}/cuenta`);
const bodyText = await page.locator("body").innerText();
const totalBoletos = (await page.locator(".panel", { hasText: /boletos totales/i }).first().innerText()).trim();
check("historial suma 6 boletos (1 gratis + 5 comprados)", totalBoletos.startsWith("6"), totalBoletos.replace("\n", " "));
check("historial marca el boleto gratuito", /Gratis/.test(bodyText));

// 6. Verificador en el navegador
await page.goto(`${BASE}/verificar`);
await page.getByRole("button", { name: /Recalcular el sorteo/i }).click();
await page.waitForSelector("text=/corresponde al hash publicado/i", { timeout: 15000 });
const verifyText = await page.locator("body").innerText();
check("verificador confirma el hash", /✓ La semilla revelada corresponde/.test(verifyText));
check("verificador confirma el boleto", /el mismo que se anunció/.test(verifyText));

// 7. Manipular la semilla debe fallar
await page.fill("#serverSeed", "0000000000000000000000000000000000000000");
await page.getByRole("button", { name: /Recalcular el sorteo/i }).click();
await page.waitForSelector("text=/Algo no cuadra/i", { timeout: 15000 });
check("verificador detecta semilla falsa", true);

// 8. Sesión de administración y ejecución de un sorteo
await page.context().clearCookies();
await page.goto(`${BASE}/entrar`);
await page.fill("#email", "admin@ggplay.gg");
await page.fill("#password", "ggplay-admin");
await page.click('button[type="submit"]');
await page.waitForURL("**/admin", { timeout: 15000 });
check("el admin entra al panel", page.url().endsWith("/admin"));

const drawInput = page.locator('input[name="publicSeed"]').first();
await drawInput.fill("prueba-automatica-del-chat");
await drawInput.locator("xpath=ancestor::form").getByRole("button", { name: /Ejecutar sorteo/i }).click();
await page.waitForSelector("text=/Boleto ganador/i", { timeout: 20000 });
check("el sorteo se ejecuta y produce ganador", true);

await page.goto(`${BASE}/ganadores`);
await page.waitForSelector("text=/prueba-automatica-del-chat/i", { state: "attached", timeout: 15000 });
check("el nuevo ganador aparece en la página pública", true);

// 9. Responsive
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check("sin scroll horizontal en móvil", overflow <= 1, `desborde ${overflow}px`);

check("sin errores de JavaScript", errors.length === 0, errors.join(" | "));

await browser.close();
console.log(log.join("\n"));
