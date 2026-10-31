import { FastAverageColor } from "fast-average-color";

const fac = new FastAverageColor();
const FALLBACK = "#111111";

export async function getImageDominantColor(
  image: HTMLImageElement,
): Promise<string> {
  try {
    const result = await fac.getColorAsync(image, {
      algorithm: "dominant",
      mode: "precision",
      ignoredColor: [
        [255, 255, 255, 255, 40], // near-white (5th value = per-channel tolerance)
        [0, 0, 0, 255, 20],       // near-black
      ],
    });

    return boostSaturation(result.value);
  } catch (err) {
    console.error("Color extraction failed:", err);
    return FALLBACK;
  }
}

export function boostSaturation([r, g, b]: number[], amount = 1.4): string {
  const avg = (r + g + b) / 3;
  const adjust = (c: number) =>
    Math.max(0, Math.min(255, Math.round(avg + (c - avg) * amount)));
  return `#${[r, g, b].map(adjust).map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function darkenColor(hex: string, amount = 0.3): string {
  const normalized = hex.replace("#", "");

  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);

  const darken = (value: number) =>
    Math.round(value * (1 - amount));

  return `#${[r, g, b]
    .map((value) => darken(value).toString(16).padStart(2, "0"))
    .join("")}`;
}
