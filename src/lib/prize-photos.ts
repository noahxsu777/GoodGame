/** Fotos reales (Unsplash License) usadas si el sorteo no trae art.image. */
export const PRIZE_PHOTOS: Record<string, string> = {
  gvw_ps5pro:
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1400&q=80",
  gvw_pcrtx:
    "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1400&q=80",
  gvw_perifericos:
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1400&q=80",
  gvw_handheld:
    "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=1400&q=80",
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
