import { mkdtemp, readdir, rm } from "node:fs/promises";
import { PassThrough } from "node:stream";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it, vi } from "vitest";
import { CANOPY_VIDEO_DIRECTORY, canopyVideo } from "../vite";
import { CANOPY_ASSET_BASE } from "../components/CanopyBackground/canopyScenes";
import { CANOP_MAP_ASSET_BASE, MAP_WORKER_FILES } from "../components/Map/mapWorkerBase";

interface MiddlewarePose {
  chemin: string;
  handler: (req: { url?: string }, res: FausseReponse, next: () => void) => void;
}

type FausseReponse = PassThrough & {
  setHeader: (nom: string, valeur: string | number) => void;
  entetes: Record<string, string | number>;
};

function poseLesMiddlewares(base?: string): MiddlewarePose[] {
  const poses: MiddlewarePose[] = [];
  const serveur = {
    middlewares: {
      use: (chemin: string, handler: MiddlewarePose["handler"]) => poses.push({ chemin, handler }),
    },
  };

  const plugin = canopyVideo(base ? { base } : undefined);
  (plugin.configureServer as (s: unknown) => void)(serveur);

  return poses;
}

function poseLeMiddleware(base?: string): MiddlewarePose {
  const prefixe = base ? `${base}/` : `${CANOPY_ASSET_BASE}/`;
  const pose = poseLesMiddlewares(base).find((candidat) => candidat.chemin === prefixe);
  expect(pose).toBeDefined();
  return pose!;
}

function fausseReponse(): FausseReponse {
  const flux = new PassThrough() as FausseReponse;
  flux.resume();
  flux.entetes = {};
  flux.setHeader = (nom, valeur) => {
    flux.entetes[nom] = valeur;
  };
  return flux;
}

const temporaires: string[] = [];

afterAll(async () => {
  await Promise.all(temporaires.map((chemin) => rm(chemin, { recursive: true, force: true })));
});

describe("canopyVideo — le dossier des scenes", () => {
  it("trouve les six fichiers a cote du module", () => {
    expect(existsSync(CANOPY_VIDEO_DIRECTORY)).toBe(true);
    for (const mode of ["light", "dark"] as const) {
      expect(existsSync(join(CANOPY_VIDEO_DIRECTORY, `canopy-${mode}.webm`))).toBe(true);
      expect(existsSync(join(CANOPY_VIDEO_DIRECTORY, `canopy-${mode}.mp4`))).toBe(true);
      expect(existsSync(join(CANOPY_VIDEO_DIRECTORY, `canopy-${mode}-poster.jpg`))).toBe(true);
    }
  });
});

describe("canopyVideo — service en developpement", () => {
  it("se pose sur la base que le composant interroge", () => {
    expect(poseLeMiddleware().chemin).toBe(`${CANOPY_ASSET_BASE}/`);
  });

  it("accepte une autre base, pour un montage sous un prefixe", () => {
    expect(poseLeMiddleware("/statique/canopee").chemin).toBe("/statique/canopee/");
  });

  it("sert un fichier existant avec son type et sa taille", async () => {
    const { handler } = poseLeMiddleware();
    const res = fausseReponse();
    const next = vi.fn();

    handler({ url: "/canopy-dark.webm" }, res, next);
    await vi.waitFor(() => expect(res.entetes["Content-Type"]).toBe("video/webm"));

    expect(next).not.toHaveBeenCalled();
    expect(Number(res.entetes["Content-Length"])).toBeGreaterThan(1_000_000);
  });

  it("laisse passer ce qui n'est pas une scene, sans se prononcer", async () => {
    const { handler } = poseLeMiddleware();

    for (const url of ["/", "/inconnu.txt", "/canopy-dark.exe"]) {
      const next = vi.fn();
      handler({ url }, fausseReponse(), next);
      await vi.waitFor(() => expect(next).toHaveBeenCalledOnce());
    }
  });

  it("refuse de sortir du dossier", async () => {
    const { handler } = poseLeMiddleware();
    const next = vi.fn();

    handler({ url: "/../../../package.json" }, fausseReponse(), next);
    await vi.waitFor(() => expect(next).toHaveBeenCalledOnce());
  });

  it("ne sert pas un fichier absent", async () => {
    const { handler } = poseLeMiddleware();
    const next = vi.fn();

    handler({ url: "/canopy-jamais-rendu.mp4" }, fausseReponse(), next);
    await vi.waitFor(() => expect(next).toHaveBeenCalledOnce());
  });
});

describe("canopyVideo — recopie au build", () => {
  it("depose les scenes sous la base, dans la sortie", async () => {
    const sortie = await mkdtemp(join(tmpdir(), "canopui-video-"));
    temporaires.push(sortie);

    const plugin = canopyVideo();
    await (plugin.writeBundle as (o: { dir: string }) => Promise<void>)({ dir: sortie });

    const fichiers = await readdir(join(sortie, "canopui", "video"));
    expect(fichiers.sort()).toEqual([
      "canopy-dark-720.mp4",
      "canopy-dark-720.webm",
      "canopy-dark-poster.jpg",
      "canopy-dark.mp4",
      "canopy-dark.webm",
      "canopy-light-720.mp4",
      "canopy-light-720.webm",
      "canopy-light-poster.jpg",
      "canopy-light.mp4",
      "canopy-light.webm",
    ]);
  });

  it("suit la base demandee", async () => {
    const sortie = await mkdtemp(join(tmpdir(), "canopui-video-"));
    temporaires.push(sortie);

    const plugin = canopyVideo({ base: "/statique/canopee" });
    await (plugin.writeBundle as (o: { dir: string }) => Promise<void>)({ dir: sortie });

    expect(existsSync(join(sortie, "statique", "canopee", "canopy-dark.mp4"))).toBe(true);
  });

  it("ne fait rien sans dossier de sortie", async () => {
    const plugin = canopyVideo();
    await expect(
      (plugin.writeBundle as (o: { dir?: string }) => Promise<void>)({}),
    ).resolves.toBeUndefined();
  });
});

describe("canopyVideo — les fichiers du worker de MapLibre", () => {
  it("pose un middleware par fichier, a l'adresse que la librairie interroge", () => {
    const chemins = poseLesMiddlewares().map((pose) => pose.chemin);
    for (const fichier of MAP_WORKER_FILES) {
      expect(chemins).toContain(`${CANOP_MAP_ASSET_BASE}/${fichier}`);
    }
  });

  it("les sert en JavaScript, le type comptant autant que le contenu", async () => {
    for (const fichier of MAP_WORKER_FILES) {
      const pose = poseLesMiddlewares().find(
        (candidat) => candidat.chemin === `${CANOP_MAP_ASSET_BASE}/${fichier}`,
      );
      const res = fausseReponse();
      const next = vi.fn();

      pose?.handler({ url: "/" }, res, next);
      await vi.waitFor(() =>
        expect(res.entetes["Content-Type"]).toBe("text/javascript; charset=utf-8"),
      );

      expect(next).not.toHaveBeenCalled();
      expect(Number(res.entetes["Content-Length"])).toBeGreaterThan(1_000);
    }
  });

  it("recopie les deux fichiers dans la sortie", async () => {
    const sortie = await mkdtemp(join(tmpdir(), "canopui-worker-"));
    temporaires.push(sortie);

    const plugin = canopyVideo();
    await (plugin.writeBundle as (o: { dir: string }) => Promise<void>)({ dir: sortie });

    const fichiers = await readdir(join(sortie, "canopui", "map"));
    expect(fichiers.sort()).toEqual([...MAP_WORKER_FILES].sort());
  });
});
