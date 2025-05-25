// @ts-check
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://metflix-ten.vercel.app",
  output: "server",
  compressHTML: true,

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});
