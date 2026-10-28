import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { canopyVideo } from "../src/vite";
import { releaseSummary } from "./releaseSummaryPlugin";

// Les scenes de `CanopyBackground` sont servies par le greffon de la librairie
// elle-meme, celui que les portails consomment sous `@canop/ui/vite`. La vitrine
// l'utilise depuis les sources : c'est a la fois son moyen de servir les
// videos et la preuve que le greffon fonctionne.

const ICON_MODULES = /[\\/]src[\\/]assets[\\/]icons[\\/]/;
const NODE_MODULES = /[\\/]node_modules[\\/]/;
const ON_DEMAND_PACKAGES = /[\\/]node_modules[\\/](maplibre-gl|@svg-maps)[\\/]/;

function vendorChunk(id: string): string | undefined {
  if (ICON_MODULES.test(id)) return "icons";
  if (!NODE_MODULES.test(id) || ON_DEMAND_PACKAGES.test(id)) return undefined;
  return "vendor";
}

export default defineConfig({
  plugins: [react(), svgr(), canopyVideo(), releaseSummary()],
  resolve: {
    alias: {
      "@canop/ui/map": fileURLToPath(new URL("../src/map.ts", import.meta.url)),
      "@canop/ui": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: vendorChunk,
      },
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
