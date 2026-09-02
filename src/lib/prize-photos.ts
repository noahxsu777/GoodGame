/** Fotos de premios. Si el sorteo no trae art.image, se usa esta ruta. */
export const PRIZE_PHOTOS: Record<string, string> = {
  gvw_ps5pro:
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1400&q=80",
  gvw_pcrtx:
    "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1400&q=80",
  gvw_perifericos:
    "https://vortextech.com.mx/cdn/shop/products/image_de2e5cde-7307-44c2-afab-320b2ade28ad.jpg?v=1659256225",
  gvw_handheld:
    "https://eu-images.contentstack.com/v3/assets/blt740a130ae3c5d529/blt84c6d7324c43a2ad/650f0870496546b5454b620b/steam.jpg",
  gvw_switch2:
    "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1400&q=80",
  gvw_xbox:
    "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=1400&q=80",
  gvw_monitor:
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1400&q=80",
};

export function withPrizePhoto<T extends { id: string; art: { image?: string } }>(item: T): T {
  const image = item.art.image || PRIZE_PHOTOS[item.id];
  if (!image) return item;
  return { ...item, art: { ...item.art, image } };
}
