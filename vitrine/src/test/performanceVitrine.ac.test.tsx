import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, screen, waitFor, within } from "@testing-library/react";
import changelogSource from "../../../CHANGELOG.md?raw";
import { parseChangelog } from "../changelog/parseChangelog";
import { formatReleaseDate } from "../changelog/releaseDate";
import { App } from "../App";
import { renderInVitrine, stubScrollIntoView } from "./vitrineTestKit";

const chargements = vi.hoisted(() => ({
  changelogBrut: 0,
  indexations: 0,
  pages: {} as Record<string, number>,
}));

vi.mock("../changelog/releases", async (importOriginal) => {
  chargements.changelogBrut += 1;
  return importOriginal();
});

vi.mock("../shell/search/searchIndex", async (importOriginal) => {
  const original = await importOriginal<typeof import("../shell/search/searchIndex")>();
  return {
    ...original,
    indexEntries: (...args: Parameters<typeof original.indexEntries>) => {
      chargements.indexations += 1;
      return original.indexEntries(...args);
    },
  };
});

vi.mock("../pages/getting-started/InstallationPage", async (importOriginal) => {
  chargements.pages.installation = (chargements.pages.installation ?? 0) + 1;
  return importOriginal();
});

vi.mock("../pages/getting-started/UtilisationPage", async (importOriginal) => {
  chargements.pages.utilisation = (chargements.pages.utilisation ?? 0) + 1;
  return importOriginal();
});

vi.mock("../pages/getting-started/ThemingPage", async (importOriginal) => {
  chargements.pages.theming = (chargements.pages.theming ?? 0) + 1;
  return importOriginal();
});

vi.mock("../pages/getting-started/TypographyPage", async (importOriginal) => {
  chargements.pages.typographie = (chargements.pages.typographie ?? 0) + 1;
  return importOriginal();
});

vi.mock("../pages/getting-started/IconsPage", async (importOriginal) => {
  chargements.pages.icones = (chargements.pages.icones ?? 0) + 1;
  return importOriginal();
});

vi.mock("../pages/getting-started/focus/FocusPage", async (importOriginal) => {
  chargements.pages.focus = (chargements.pages.focus ?? 0) + 1;
  return importOriginal();
});

vi.mock("../pages/getting-started/VersionsPage", async (importOriginal) => {
  chargements.pages.versions = (chargements.pages.versions ?? 0) + 1;
  return importOriginal();
});

const PAGES_PRISE_EN_MAIN = [
  "installation",
  "utilisation",
  "theming",
  "typographie",
  "icones",
  "focus",
  "versions",
] as const;

const TITRE_DE_LA_RECHERCHE = "Rechercher dans la documentation";

function naviguerVers(chemin: string) {
  act(() => {
    window.location.hash = `#${chemin}`;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
}

function pagesChargees(): string[] {
  return PAGES_PRISE_EN_MAIN.filter((page) => (chargements.pages[page] ?? 0) > 0);
}

function sansMarkdown(texte: string): string {
  return texte.replace(/[`*]/g, "").replace(/\s+/g, " ");
}

function sansEllipse(texte: string): string {
  return texte.endsWith("…") ? texte.slice(0, -1) : texte;
}

function carteDuTeaser(): HTMLElement {
  return screen.getByRole("link", { name: "Voir les notes de version" });
}

beforeEach(() => {
  stubScrollIntoView();
});

describe("AC6 — chargement a la demande de la vitrine", () => {
  it("ne charge ni le CHANGELOG brut, ni les pages prise en main, ni l'index de recherche a l'accueil, puis chacun a la demande", async () => {
    window.location.hash = "";
    renderInVitrine(<App />);
    await screen.findByRole("heading", { level: 1 });
    await screen.findByRole("link", { name: "Voir les notes de version" });

    expect(chargements.changelogBrut).toBe(0);
    expect(pagesChargees()).toEqual([]);
    expect(chargements.indexations).toBe(0);

    fireEvent.change(screen.getByRole("combobox", { name: TITRE_DE_LA_RECHERCHE }), {
      target: { value: "car" },
    });
    await waitFor(() => expect(chargements.indexations).toBeGreaterThan(0));
    expect(chargements.changelogBrut).toBe(0);

    naviguerVers("/docs/installation");
    await waitFor(() => expect(pagesChargees()).toEqual(["installation"]));
    expect(chargements.changelogBrut).toBe(0);

    naviguerVers("/docs/theming");
    await waitFor(() => expect(pagesChargees()).toEqual(["installation", "theming"]));
    expect(chargements.changelogBrut).toBe(0);

    naviguerVers("/docs/versions");
    await waitFor(() => expect(chargements.pages.versions).toBe(1));
    await waitFor(() => expect(chargements.changelogBrut).toBe(1));
    window.location.hash = "";
  });
});

describe("AC6 — teaser de l'accueil", () => {
  it("affiche version, date, nombre de changements et points forts de la derniere version", async () => {
    window.location.hash = "";
    renderInVitrine(<App />);
    const carte = await screen.findByRole("link", { name: "Voir les notes de version" });
    const versions = parseChangelog(changelogSource);

    const titre = within(carte).getByRole("heading", { level: 2 }).textContent ?? "";
    const version = versions.find((release) => titre === `CanopUI ${release.version}`);
    expect(version).toBeDefined();

    const texte = carte.textContent ?? "";
    const { date, entryCount } = version as (typeof versions)[number];
    expect(texte).toContain(formatReleaseDate(date, "fr"));
    expect(texte).toContain(`${entryCount} changement`);

    const pointsForts = Array.from(carte.querySelectorAll("p"))
      .map((paragraphe) => sansEllipse(paragraphe.textContent ?? ""))
      .filter((ligne) => ligne.length > 0 && sansMarkdown(changelogSource).includes(ligne));
    expect(pointsForts.length).toBeGreaterThan(0);
    expect(carteDuTeaser()).toBe(carte);
  });
});

describe("AC6 — module virtuel du resume des versions", () => {
  it.each(["vite.config.ts", "vitrine/vite.config.ts"])(
    "enregistre le plugin du resume des versions dans %s",
    (fichier) => {
      const configuration = readFileSync(fichier, "utf8");
      expect(configuration).toMatch(
        /import\s*\{\s*releaseSummary\s*\}\s*from\s*"[^"]*releaseSummaryPlugin"/,
      );
      expect(configuration).toMatch(/releaseSummary\(\)/);
    },
  );

  it("fait lire au teaser de l'accueil le module virtuel et non le CHANGELOG brut", () => {
    const teaser = readFileSync("vitrine/src/pages/home/ReleaseTeaser.tsx", "utf8");
    expect(teaser).toMatch(/from\s*"virtual:canop-release-summary"/);
    expect(teaser).not.toMatch(/CHANGELOG\.md|changelog\/releases/);
  });
});
