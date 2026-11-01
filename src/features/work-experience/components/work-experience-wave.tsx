import { useMemo, useState } from "react";

export const WAVE_COLOR = "#d3d6f2";
export const WAVE_COLOR_ACTIVE = "#939efb";

const HEIGHT = 64;
const BASELINE = HEIGHT / 2;
const MIN_AMPLITUDE = 7;
const MAX_AMPLITUDE = 16;
// Jarak rata-rata antar titik gelombang (px). Makin kecil = makin rapat.
const STEP = 56;
// Peluang puncak/lembah berganti arah di titik berikutnya (sisanya melanjutkan arah yang sama).
const FLIP_CHANCE = 0.8;

type Point = { x: number; y: number };

const createRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

// Garis berhenti di titik terakhir (start terbesar), bukan di ujung lebar penuh.
const getEnd = (width: number, starts: number[]) => {
  const valid = starts.filter((x) => x > 0 && x <= width);
  return valid.length ? Math.max(...valid) : width;
};

const buildPath = (width: number, starts: number[], seed: number) => {
  const random = createRandom(seed);
  const end = getEnd(width, starts);
  const boundaries = Array.from(new Set([0, ...starts]))
    .filter((x) => x >= 0 && x <= end)
    .sort((a, b) => a - b);

  const points: Point[] = [];
  // Arah dibawa antar segmen supaya puncak dan lembah terasa mengalir.
  let direction = random() > 0.5 ? 1 : -1;

  boundaries.forEach((x, index) => {
    // Titik batas dikunci di baseline agar node pengalaman tetap menempel di garis.
    points.push({ x, y: BASELINE });

    const next = boundaries[index + 1];
    if (next === undefined) return;

    const span = next - x;
    if (span < 80) return;

    const count = Math.max(2, Math.round(span / STEP));

    for (let i = 1; i < count; i++) {
      const t = i / count;
      const jitter = (random() - 0.5) * (0.5 / count);
      const px = x + span * Math.min(0.95, Math.max(0.05, t + jitter));

      if (random() < FLIP_CHANCE) direction *= -1;

      // Amplitudenya acak, lalu sedikit mengecil mendekati batas agar transisi halus.
      const envelope = 0.4 + 0.6 * Math.sin(Math.PI * t);
      const amplitude =
        (MIN_AMPLITUDE + random() * (MAX_AMPLITUDE - MIN_AMPLITUDE)) * envelope;

      points.push({ x: px, y: BASELINE + direction * amplitude });
    }
  });

  if (points.length < 2) return "";

  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let index = 0; index < points.length - 1; index++) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return path;
};

interface WorkExperienceWaveProps {
  width: number;
  starts: number[];
}

export function WorkExperienceWave({
  width,
  starts,
}: WorkExperienceWaveProps) {
  const [seed] = useState(() => Math.floor(Math.random() * 200 * 0xffffffff));

  const path = useMemo(
    () => buildPath(width, starts, seed),
    [width, starts, seed],
  );

  if (!path) return null;

  const end = getEnd(width, starts);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-16 h-16"
      aria-hidden="true"
    >
      <svg
        className="absolute left-0 top-0"
        width={end}
        height={HEIGHT}
        viewBox={`0 0 ${end} ${HEIGHT}`}
        fill="none"
      >
        <path d={path} stroke={WAVE_COLOR} strokeWidth={1.25} />
      </svg>

      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: "calc(var(--timeline-progress, 0) * 100%)" }}
      >
        <svg
          className="absolute left-0 top-0"
          width={end}
          height={HEIGHT}
          viewBox={`0 0 ${end} ${HEIGHT}`}
          fill="none"
        >
          <path d={path} stroke={WAVE_COLOR_ACTIVE} strokeWidth={1.5} />
        </svg>
      </div>
    </div>
  );
}
