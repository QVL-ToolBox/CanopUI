import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { canopyVideo } from "../src/vite";

// Les scenes de `CanopyBackground` sont servies par le greffon de la librairie
// elle-meme, celui que les portails consomment sous `@canop/ui/vite`. La vitrine
// l'utilise depuis les sources : c'est a la fois son moyen de servir les
// videos et la preuve que le greffon fonctionne.

export default defineConfig({
  plugins: [react(), svgr(), canopyVideo()],
  resolve: {
    alias: {
      "@canop/ui/map": fileURLToPath(new URL("../src/map.ts", import.meta.url)),
      "@canop/ui": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ["maplibre-gl"],
  },
  server: {
    port: 61000,
    strictPort: true,
  },
});
