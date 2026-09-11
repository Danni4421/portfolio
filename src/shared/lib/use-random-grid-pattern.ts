import { useEffect } from "react";
import type { RefObject } from "react";

type RandomGridPatternOptions = {
  minSizePx?: number;
  maxSizePx?: number;
  minAlpha?: number;
  maxAlpha?: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function useRandomGridPattern<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: RandomGridPatternOptions = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const minSizePx = clamp(options.minSizePx ?? 40, 8, 256);
    const maxSizePx = clamp(options.maxSizePx ?? 64, minSizePx, 512);

    const minAlpha = clamp(options.minAlpha ?? 0.04, 0, 1);
    const maxAlpha = clamp(options.maxAlpha ?? 0.08, minAlpha, 1);

    const size = randomInt(minSizePx, maxSizePx);
    const offsetX = randomInt(0, size - 1);
    const offsetY = randomInt(0, size - 1);
    const alpha = randomFloat(minAlpha, maxAlpha);

    el.style.setProperty("--grid-size", `${size}px`);
    el.style.setProperty("--grid-offset-x", `${offsetX}px`);
    el.style.setProperty("--grid-offset-y", `${offsetY}px`);
    el.style.setProperty("--grid-alpha", alpha.toFixed(3));
  }, [
    ref,
    options.maxAlpha,
    options.maxSizePx,
    options.minAlpha,
    options.minSizePx,
  ]);
}
