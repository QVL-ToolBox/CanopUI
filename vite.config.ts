/// <reference types="vitest/config" />
import { cp, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import dts from "vite-plugin-dts";
import { releaseSummary } from "./vitrine/releaseSummaryPlugin";

const FONTS_SOURCE = fileURLToPath(new URL("./src/assets/fonts", import.meta.url));
const FONTS_OUTPUT = "assets/fonts";
const VIDEO_SOURCE = fileURLToPath(new URL("./src/assets/video", import.meta.url));
const VIDEO_OUTPUT = "assets/video";

// Les scenes de CanopyBackground ne passent pas par un import JS : en mode
// librairie Vite inline tout asset importe, quelle que soit sa taille. Elles
// sont donc copiees telles quelles et servies par le portail.
function copyCanopyScenes(): Plugin {
  return {
    name: "canopui:copy-canopy-scenes",
    apply: "build",
    async writeBundle(options) {
      if (!options.dir) return;
      await cp(VIDEO_SOURCE, `${options.dir}/${VIDEO_OUTPUT}`, { recursive: true });
    },
  };
}

// Chaque famille embarquee arrive avec sa licence. Le dossier est parcouru
// plutot que les fichiers nommes un a un : ajouter une police ne doit pas
// pouvoir laisser sa licence derriere.
function copyFontLicense(): Plugin {
  return {
    name: "canopui:copy-font-license",
    apply: "build",
    async writeBundle(options) {
      if (!options.dir) return;
      const licences = (await readdir(FONTS_SOURCE)).filter((nom) => nom.endsWith(".txt"));
      await Promise.all(
        licences.map((nom) =>
          cp(`${FONTS_SOURCE}/${nom}`, `${options.dir}/${FONTS_OUTPUT}/${nom}`),
        ),
      );
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      entryRoot: "src",
      exclude: ["src/test/**", "**/*.test.*", "**/*.stories.*"],
    }),
    copyFontLicense(),
    copyCanopyScenes(),
    releaseSummary(),
  ],
  build: {
    lib: {
      entry: ["src/index.ts", "src/map.ts", "src/vite.ts"],
      formats: ["es"],
      cssFileName: "styles",
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@mui\//,
        /^@emotion\//,
        /^framer-motion($|\/)/,
        /^maplibre-gl($|\/)/,
        // `@canop/ui/vite` est un greffon de build : il tourne dans Node et
        // n'emporte ni `vite` ni les modules natifs.
        /^vite$/,
        /^node:/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        assetFileNames: (asset) => {
          const name = asset.names[0] ?? "";
          if (/\.(woff2?|ttf|otf|eot)$/.test(name)) return `${FONTS_OUTPUT}/[name][extname]`;
          if (name.endsWith(".css")) return "[name][extname]";
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    // La vitrine importe la librairie sous son nom public. Sans cet alias ses
    // pages ne sont pas testables, et c'est ce trou qui a laisse passer une
    // demonstration de carrousel muette : le composant n'y voyait qu'une carte.
    alias: {
      "@canop/ui/map": fileURLToPath(new URL("./src/map.ts", import.meta.url)),
      "@canop/ui": fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/test/**", "**/*.test.*", "**/*.stories.*"],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 80,
      },
    },
  },
});
