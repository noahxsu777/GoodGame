# Fotos de los premios

Deja aquí las fotos reales de cada premio y enlázalas desde `src/lib/seed.ts`,
en el campo `art.image` del sorteo correspondiente:

```ts
art: {
  from: "#2563eb",
  to: "#0ea5e9",
  emoji: "🎮",
  shape: "console-white",
  image: "/premios/playstation-5-pro.jpg", // ← la foto manda sobre la ilustración
},
```

- Formato recomendado: **WebP o JPG**, 1200 × 750 px aproximadamente (3:2), por
  debajo de 200 KB.
- Fondo oscuro o recortado: el marco aplica un foco y una viñeta, así que las
  fotos con fondo blanco quedan peor que las de fondo neutro.
- Si la ruta está mal o el archivo falta, la tarjeta **no se rompe**: se muestra
  la ilustración vectorial de respaldo.

## Derechos

Usa solo fotos sobre las que tengas derechos: propias, las del kit de prensa del
fabricante (comprobando sus condiciones) o de un banco con licencia comercial.
No copies imágenes de tiendas ni de otras webs sin permiso.
