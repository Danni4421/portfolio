import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "gradient-dark":
          "linear-gradient(111.4deg, rgba(7, 7, 9, 1) 6.5%, rgba(27, 24, 113, 1) 93.2%)",
      },
    },
  },
  plugins: [daisyui],
} satisfies Config;
