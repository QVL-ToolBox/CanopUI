import { describe, expect, it } from "vitest";
import source from "../../../CHANGELOG.md?raw";
import { compareVersions, parseChangelog, parseInline, releaseStatus } from "./parseChangelog";
import { releaseHighlights } from "./releaseHighlights";

const releases = parseChangelog(source);

describe("parseInline", () => {
  it("splits code, strong and links", () => {
    expect(parseInline("un `Button` **gras** et [un lien](https://x.dev)")).toEqual([
      { kind: "text", value: "un " },
      { kind: "code", value: "Button" },
      { kind: "text", value: " " },
      { kind: "strong", value: "gras" },
      { kind: "text", value: " et " },
      { kind: "link", value: "un lien", href: "https://x.dev" },
    ]);
  });

  it("keeps plain text intact", () => {
    expect(parseInline("aucun balisage")).toEqual([{ kind: "text", value: "aucun balisage" }]);
  });
});

describe("parseChangelog", () => {
  it("reads every dated release heading of the repository changelog", () => {
    const headings = source
      .split("\n")
      .filter((line) => /^## \[[^\]]+\]\s*[-–—]\s*\d{4}-\d{2}-\d{2}\s*$/.test(line));
    expect(releases).toHaveLength(headings.length);
  });

  it("ignores an undated unreleased section and keeps the next dated release intact", () => {
    const parsed = parseChangelog(
      [
        "# Changelog",
        "",
        "## [Non publié]",
        "",
        "### Ajouté",
        "",
        "- **Brouillon un.** Pas encore livré.",
        "- **Brouillon deux.** Toujours en cours.",
        "",
        "## [2.0.0] - 2026-10-05",
        "",
        "### Corrigé",
        "",
        "- **Correctif livré.** Publié.",
        "",
        "### Modifié",
        "",
        "- **Changement livré.** Publié aussi.",
        "",
      ].join("\n"),
    );
    expect(parsed.map((release) => release.version)).toEqual(["2.0.0"]);
    expect(JSON.stringify(parsed)).not.toContain("Brouillon");
    expect(parsed[0].date).toBe("2026-10-05");
    expect(parsed[0].sections.map((section) => section.title)).toEqual(["Corrigé", "Modifié"]);
    expect(parsed[0].sections.map((section) => section.entryCount)).toEqual([1, 1]);
    expect(parsed[0].entryCount).toBe(2);
  });

  it("lists releases from the most recent date to the oldest", () => {
    const dates = releases.map((release) => release.date);
    const newestFirst = [...dates].sort((left, right) => right.localeCompare(left));
    expect(dates).toEqual(newestFirst);
  });

  it("places 1.0.0 above every 3.x release even though its number is lower", () => {
    const versions = releases.map((release) => release.version);
    const renamed = versions.indexOf("1.0.0");
    const firstLegacy = versions.findIndex((version) => version.startsWith("3."));
    expect(renamed).toBeGreaterThanOrEqual(0);
    expect(firstLegacy).toBeGreaterThan(renamed);
  });

  it("reads the date of both dash styles", () => {
    const dates = releases.map((release) => release.date);
    expect(dates.every((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))).toBe(true);
  });

  // Ces deux tests portent sur le parseur, pas sur ce qui se trouve en tete du
  // fichier : ils visaient `releases[0]` et supposaient donc qu'une version
  // ajoute toujours quelque chose. Un correctif n'a legitimement qu'une section
  // `Corrige`, et la 3.0.1 les a fait tomber tous les deux.
  it("counts one entry per bullet of a section", () => {
    const release = releases.find((candidate) =>
      candidate.sections.some((section) => section.title === "Ajouté"),
    );
    const added = release?.sections.find((section) => section.title === "Ajouté");
    expect(added?.entryCount).toBeGreaterThan(0);
    expect(release?.entryCount).toBeGreaterThanOrEqual(added?.entryCount ?? 0);
  });

  it("parses a nested table inside an ordered list", () => {
    const nested = releases
      .flatMap((release) => release.sections)
      .filter((section) => section.title === "Migration")
      .flatMap((section) => section.blocks)
      .flatMap((block) => (block.kind === "list" ? block.items.flat() : []));
    expect(nested.some((block) => block.kind === "table")).toBe(true);
  });

  it("parses the release note written as a blockquote", () => {
    const noted = releases.find((release) => release.intro.some((block) => block.kind === "quote"));
    expect(noted).toBeDefined();
  });
});

describe("releaseHighlights", () => {
  const LIBELLE_MAX = 65;
  const ELLIPSE = "…";

  function premiereRelease(candidates: typeof releases) {
    return candidates.find((candidate) =>
      candidate.sections.some((section) => section.title === "Ajouté"),
    );
  }

  function premiereEntreeAjoutee(release: (typeof releases)[number]) {
    const added = release.sections.find((section) => section.title === "Ajouté");
    const first = added?.blocks.find((block) => block.kind === "list");
    const lead = first?.kind === "list" ? first.items[0] : undefined;
    const paragraph = lead?.find((block) => block.kind === "paragraph");
    const marked = paragraph?.kind === "paragraph" ? paragraph.content[0] : undefined;
    return marked?.value.replace(/[`*]/g, "") ?? "";
  }

  function attendQueLeLibelleOuvreLaPremiereEntreeAjoutee(release: (typeof releases)[number]) {
    const entree = premiereEntreeAjoutee(release);
    const libelle = releaseHighlights(release)[0];
    const debut = libelle.endsWith(ELLIPSE) ? libelle.slice(0, -ELLIPSE.length) : libelle;
    expect(entree.length).toBeGreaterThan(0);
    expect(debut.length).toBeGreaterThan(0);
    expect(entree.startsWith(debut)).toBe(true);
    expect(libelle).not.toMatch(/[`*]/);
    expect(libelle.length).toBeLessThanOrEqual(LIBELLE_MAX);
  }

  it("leads with what a release added", () => {
    const release = premiereRelease(releases);
    expect(release).toBeDefined();
    attendQueLeLibelleOuvreLaPremiereEntreeAjoutee(release!);
  });

  it("leads with the start of a long added entry, within the label limit", () => {
    const entreeLongue =
      "`Composant` gagne la variante `etendue`, une entree volontairement bien plus longue que la limite des libelles (#99).";
    const fixture = parseChangelog(
      [
        "# Changelog",
        "",
        "## [9.0.0] - 2026-10-12",
        "",
        "### Corrigé",
        "",
        "- **Correctif court.** Publié.",
        "",
        "### Ajouté",
        "",
        `- **${entreeLongue}** Suite de l'entree.`,
        "- **Second ajout.** Publié aussi.",
        "",
      ].join("\n"),
    );
    const release = premiereRelease(fixture);
    expect(release).toBeDefined();
    expect(premiereEntreeAjoutee(release!).length).toBeGreaterThan(LIBELLE_MAX);
    attendQueLeLibelleOuvreLaPremiereEntreeAjoutee(release!);
  });

  it("keeps labels short and free of markup", () => {
    for (const release of releases) {
      for (const highlight of releaseHighlights(release)) {
        expect(highlight).not.toMatch(/[`*]/);
        expect(highlight.length).toBeLessThanOrEqual(65);
      }
    }
  });

  it("never returns more than the requested count", () => {
    const [release] = parseChangelog(
      [
        "## [9.0.0] - 2026-10-16",
        "",
        "### Ajouté",
        "",
        "- **Premier ajout.** Publié.",
        "- **Deuxième ajout.** Publié aussi.",
        "- **Troisième ajout.** Publié encore.",
        "",
      ].join("\n"),
    );
    expect(releaseHighlights(release)).toHaveLength(3);
    expect(releaseHighlights(release, 2)).toHaveLength(2);
  });
});

describe("releaseStatus", () => {
  it("ranks an undocumented tag above the published version", () => {
    expect(releaseStatus("3.0.0", "2.11.0")).toBe("upcoming");
    expect(releaseStatus("2.11.0", "2.11.0")).toBe("current");
    expect(releaseStatus("2.9.0", "2.11.0")).toBe("past");
  });

  it("compares numerically, not alphabetically", () => {
    expect(compareVersions("2.11.0", "2.9.0")).toBeGreaterThan(0);
  });
});
