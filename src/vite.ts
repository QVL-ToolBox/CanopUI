import { createReadStream } from "node:fs";
import { cp, mkdir, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { CANOPY_ASSET_BASE } from "./components/CanopyBackground/canopyScenes";
import {
  CANOP_MAP_ASSET_BASE,
  MAP_WORKER_FILES,
  mapWorkerSpecifier,
} from "./components/Map/mapWorkerBase";

export interface CanopyVideoOptions {
  /**
   * Base publique sous laquelle les scenes sont servies. Ne la changer que si
   * `canopyScenesFrom` est appele avec la meme base cote application.
   */
  base?: string;
}

const CONTENT_TYPE: Record<string, string> = {
  ".webm": "video/webm",
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
};

const CONTENT_TYPE_MODULE_JS_EXIGE_PAR_CHROME = "text/javascript; charset=utf-8";

const DOSSIER_VIDEO_VOISIN_DU_MODULE = join(
  dirname(fileURLToPath(import.meta.url)),
  "assets",
  "video",
);

function segmentDeSortie(base: string): string[] {
  return base.split("/").filter((part) => part.length > 0);
}

function cheminDuWorkerChezLeConsommateur(fichier: string): string | undefined {
  try {
    const depuisLeProjet = createRequire(join(process.cwd(), "index.js"));
    return depuisLeProjet.resolve(mapWorkerSpecifier(fichier));
  } catch {
    return undefined;
  }
}

/**
 * Sert les scenes de `CanopyBackground` — dix fichiers : WebM et MP4 en 1080p
 * et en 720p, plus l'affiche, pour chaque theme — depuis le paquet lui-meme :
 * middleware en developpement, recopie dans la sortie au build.
 *
 * Sans lui, le fond par defaut de `PageScaffold` reste noir : les scenes ne
 * peuvent pas traverser le bundle du consommateur, parce que Vite inline en
 * base64 tout asset qu'un module reference. Elles sont donc servies comme des
 * fichiers, et il faut quelqu'un pour les servir. C'etait au portail de le
 * faire ; c'est desormais ce greffon, livre avec la librairie, pour qu'un
 * consommateur exterieur n'ait rien a recopier.
 *
 * ```ts
 * import { canopyVideo } from "@canop/ui/vite";
 *
 * export default defineConfig({ plugins: [react(), canopyVideo()] });
 * ```
 */
export function canopyVideo(options: CanopyVideoOptions = {}): Plugin {
  const base = options.base ?? CANOPY_ASSET_BASE;
  const prefixe = base.endsWith("/") ? base : `${base}/`;

  return {
    name: "canopui:canopy-video",

    configureServer(server) {
      server.middlewares.use(prefixe, (req, res, next) => {
        const nom = normalize(decodeURIComponent(req.url ?? "")).replace(/^[\\/]+/, "");
        const type = CONTENT_TYPE[extname(nom)];
        const sortiraitDuDossierMalgreNormalize = nom.includes("..");
        if (!nom || sortiraitDuDossierMalgreNormalize || !type) {
          next();
          return;
        }
        const fichier = join(DOSSIER_VIDEO_VOISIN_DU_MODULE, nom);
        stat(fichier)
          .then((info) => {
            res.setHeader("Content-Type", type);
            res.setHeader("Content-Length", info.size);
            createReadStream(fichier).pipe(res);
          })
          .catch(() => next());
      });

      for (const fichier of MAP_WORKER_FILES) {
        server.middlewares.use(`${CANOP_MAP_ASSET_BASE}/${fichier}`, (_req, res, next) => {
          const source = cheminDuWorkerChezLeConsommateur(fichier);
          if (!source) {
            next();
            return;
          }
          stat(source)
            .then((info) => {
              res.setHeader("Content-Type", CONTENT_TYPE_MODULE_JS_EXIGE_PAR_CHROME);
              res.setHeader("Content-Length", info.size);
              createReadStream(source).pipe(res);
            })
            .catch(() => next());
        });
      }
    },

    async writeBundle(sortie) {
      if (!sortie.dir) return;
      await cp(DOSSIER_VIDEO_VOISIN_DU_MODULE, join(sortie.dir, ...segmentDeSortie(base)), {
        recursive: true,
      });

      const destination = join(sortie.dir, ...segmentDeSortie(CANOP_MAP_ASSET_BASE));
      for (const fichier of MAP_WORKER_FILES) {
        const source = cheminDuWorkerChezLeConsommateur(fichier);
        if (!source) continue;
        await mkdir(destination, { recursive: true });
        await cp(source, join(destination, fichier));
      }
    },
  };
}

export const CANOPY_VIDEO_DIRECTORY = DOSSIER_VIDEO_VOISIN_DU_MODULE;
