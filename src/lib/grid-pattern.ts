import { useEffect } from "react"

const WIDTH = 2000
const HEIGHT = 1400
const CELL = 142.857

const COLS = Math.ceil(WIDTH / CELL)
const ROWS = Math.ceil(HEIGHT / CELL)

const DEFAULT_INTERVAL_MS = 5000

function randomHexByte(max: number) {
  return Math.floor(Math.random() * (max + 1))
    .toString(16)
    .padStart(2, "0")
}

// Possible block shapes [width, height] in cells — single cells dominate,
// bigger merged boxes appear occasionally (like the original pattern)
const BLOCK_SHAPES: [number, number][] = [
  [1, 1], [1, 1], [1, 1], [1, 1], [1, 1],
  [2, 1], [1, 2], [2, 2], [3, 1], [3, 2],
]

function buildGridCells() {
  const used: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false))
  let paths = ""

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (used[row][col]) continue

      // Randomly merge this cell with neighbours into a bigger box,
      // biased toward single cells so merged blocks stay occasional
      let w = 1
      let h = 1
      const fits = BLOCK_SHAPES.filter(([bw, bh]) => col + bw <= COLS && row + bh <= ROWS)
      if (fits.length > 0) {
        const [bw, bh] = fits[Math.floor(Math.random() * fits.length)]
        w = bw
        h = bh
      }

      for (let r = row; r < row + h; r++) {
        for (let c = col; c < col + w; c++) {
          used[r][c] = true
        }
      }

      // Exact coordinates (no rounding) so neighbouring boxes never visually fuse
      const x = col * CELL
      const y = row * CELL
      const d = `M${x} ${y}h${w * CELL}v${h * CELL}h-${w * CELL}z`
      // ~30% of blocks get a subtle tint, the rest stay outlined only
      const fill = Math.random() < 0.3 ? ` fill="#dddddd${randomHexByte(0x40)}"` : ' fill="none"'
      paths += `<path${fill} d="${d}"/>`
    }
  }

  return paths
}

/** Builds a randomized variant of the grid + noise background as an SVG data URI. */
export function generateGridPatternImage() {
  const seed = Math.floor(Math.random() * 1000)
  const svg =
    `<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">` +
    `<rect fill="#fff" width="${WIDTH}" height="${HEIGHT}"/>` +
    `<g stroke="#dddddd42" stroke-width="1.4">${buildGridCells()}</g>` +
    `<path fill="#f3f3f3" filter="url(#noise)" opacity=".8" d="M0 0h${WIDTH}v${HEIGHT}H0z"/>` +
    `<defs>` +
    `<filter id="noise" x="-800" y="-560" width="2800" height="1960" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency=".11" numOctaves="4" seed="${seed}" stitchTiles="no-stitch" x="0" y="0" width="${WIDTH}" height="${HEIGHT}" result="turbulence"/>` +
    `<feSpecularLighting surfaceScale="10" specularConstant=".13" specularExponent="20" lighting-color="#fff" x="0" y="0" width="${WIDTH}" height="${HEIGHT}" in="turbulence" result="specularLighting">` +
    `<feDistantLight azimuth="3" elevation="100"/>` +
    `</feSpecularLighting>` +
    `</filter>` +
    `</defs>` +
    `</svg>`

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

/**
 * Randomizes every `.grid-pattern` element on the page on an interval,
 * crossfading between the two pseudo-element layers defined in the stylesheet.
 * Respects `prefers-reduced-motion` by leaving the pattern static.
 */
export function useGridPattern(intervalMs = DEFAULT_INTERVAL_MS) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const frontLayer = new WeakMap<Element, "a" | "b">()

    const paint = (el: HTMLElement, image: string) => {
      const front = frontLayer.get(el)

      // First paint: fill both layers so nothing crossfades in from nothing
      if (!front) {
        el.style.setProperty("--grid-a", image)
        el.style.setProperty("--grid-b", image)
        el.classList.remove("is-grid-crossfading")
        frontLayer.set(el, "a")
        return
      }

      if (front === "a") {
        el.style.setProperty("--grid-b", image)
        el.classList.add("is-grid-crossfading")
        frontLayer.set(el, "b")
      } else {
        el.style.setProperty("--grid-a", image)
        el.classList.remove("is-grid-crossfading")
        frontLayer.set(el, "a")
      }
    }

    const tick = () => {
      const image = generateGridPatternImage()
      document.querySelectorAll<HTMLElement>(".grid-pattern").forEach((el) => paint(el, image))
    }

    tick()

    // New .grid-pattern elements (route changes) get painted as soon as they mount
    const observer = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>(".grid-pattern").forEach((el) => {
        if (!frontLayer.has(el)) paint(el, generateGridPatternImage())
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    const id = window.setInterval(tick, intervalMs)

    return () => {
      window.clearInterval(id)
      observer.disconnect()
    }
  }, [intervalMs])
}
