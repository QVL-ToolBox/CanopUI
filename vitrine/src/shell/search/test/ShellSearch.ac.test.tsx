import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, screen, within } from "@testing-library/react";
import { ShellSearch } from "../ShellSearch";
import { groupEntries, navGroups } from "../../../registry/nav";
import { renderInVitrine, stubScrollIntoView } from "../../../test/vitrineTestKit";

interface SearchRecord {
  title: string;
  description: string;
  rubrique: string;
  path: string;
}

const RECORDS: SearchRecord[] = navGroups.flatMap((group) => [
  {
    title: group.title.fr,
    description: group.description.fr,
    rubrique: group.title.fr,
    path: `/categories/${group.id}`,
  },
  ...groupEntries(group).map((entry) => ({
    title: entry.title.fr,
    description: entry.description.fr,
    rubrique: group.title.fr,
    path: entry.path,
  })),
]);

function fold(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function tierOf(record: SearchRecord, query: string): number | undefined {
  const term = fold(query);
  const title = fold(record.title);
  if (title.startsWith(term)) return 0;
  if (title.includes(term)) return 1;
  if (fold(record.description).includes(term)) return 2;
  return undefined;
}

function field() {
  return screen.getByRole("combobox", { name: "Rechercher dans la documentation" });
}

function type(query: string) {
  fireEvent.change(field(), { target: { value: query } });
}

function press(key: string) {
  fireEvent.keyDown(field(), { key });
}

function optionTitle(option: HTMLElement): string {
  return option.querySelector("p")?.textContent ?? "";
}

function displayedTitles(): string[] {
  return screen.queryAllByRole("option").map(optionTitle);
}

function activeOption(): HTMLElement | undefined {
  const activeId = field().getAttribute("aria-activedescendant");
  return screen.queryAllByRole("option").find((option) => option.id === activeId);
}

function recordTitled(title: string, query: string): SearchRecord {
  const record = RECORDS.find(
    (candidate) => candidate.title === title && tierOf(candidate, query) !== undefined,
  );
  if (!record) throw new Error(`aucune page du registre ne correspond à ${title}`);
  return record;
}

function groupLabel(group: HTMLElement): string {
  const labelId = group.getAttribute("aria-labelledby") ?? "";
  return document.getElementById(labelId)?.textContent ?? group.getAttribute("aria-label") ?? "";
}

beforeEach(() => {
  stubScrollIntoView();
  window.location.hash = "";
  renderInVitrine(<ShellSearch />);
});

afterEach(() => {
  window.location.hash = "";
});

describe("AC3 rôles ARIA de la recherche", () => {
  it("expose un combobox replié tant que rien n'est saisi", () => {
    expect(field()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("déplie le combobox et le relie à la listbox des résultats", () => {
    type("card");
    const listbox = screen.getByRole("listbox");
    expect(field()).toHaveAttribute("aria-expanded", "true");
    expect(field()).toHaveAttribute("aria-controls", listbox.id);
  });

  it("pointe aria-activedescendant sur une option sélectionnée de la liste", () => {
    type("card");
    const active = activeOption();
    expect(active).toBeDefined();
    expect(active).toHaveAttribute("aria-selected", "true");
  });

  it("regroupe les options par rubrique dans des group nommés", () => {
    type("bouton");
    const groups = within(screen.getByRole("listbox")).getAllByRole("group");
    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      const label = groupLabel(group);
      const titles = within(group).getAllByRole("option").map(optionTitle);
      expect(
        titles.every((title) =>
          RECORDS.some((record) => record.title === title && record.rubrique === label),
        ),
      ).toBe(true);
    }
  });

  it("place chaque option sous la rubrique de sa page", () => {
    type("icone");
    for (const group of screen.getAllByRole("group")) {
      for (const option of within(group).getAllByRole("option")) {
        expect(recordTitled(optionTitle(option), "icone").rubrique).toBe(groupLabel(group));
      }
    }
  });
});

describe("AC3 correspondance insensible aux accents, à la casse et aux séparateurs", () => {
  it.each(["icone", "ICÔNE", "Icône", "iCoNe"])("retrouve la page Icônes avec « %s »", (query) => {
    type(query);
    expect(displayedTitles()).toContain("Icônes");
  });

  it.each(["svgmap", "svg-map", "SVG_map", "svg.map", "svg map"])(
    "retrouve la page SVG map avec « %s »",
    (query) => {
      type(query);
      expect(displayedTitles()).toContain("SVG map");
    },
  );

  it.each(["card grid", "card-grid", "Card_Grid"])("retrouve CardGrid avec « %s »", (query) => {
    type(query);
    expect(displayedTitles()).toContain("CardGrid");
  });

  it("donne les mêmes résultats quelle que soit la casse", () => {
    type("tab");
    const lower = displayedTitles();
    type("TAB");
    expect(displayedTitles()).toEqual(lower);
  });

  it("trouve une page par sa seule description", () => {
    const record = RECORDS.find((candidate) => candidate.path === "/components/button");
    type("interrupteurs");
    expect(record && tierOf(record, "bouton")).toBe(2);
    type("bouton");
    expect(displayedTitles()).toContain("Button");
  });
});

describe.each(["tab", "bouton", "icone", "carte", "menu", "select"])(
  "AC3 résultats et ordre pour « %s »",
  (query) => {
    it("affiche exactement les pages dont le titre ou la description contient la saisie", () => {
      type(query);
      const expected = RECORDS.filter((record) => tierOf(record, query) !== undefined).map(
        (record) => record.title,
      );
      expect([...displayedTitles()].sort()).toEqual([...expected].sort());
    });

    it("classe dans chaque rubrique : début de titre, puis titre, puis description", () => {
      type(query);
      for (const group of screen.getAllByRole("group")) {
        const tiers = within(group)
          .getAllByRole("option")
          .map((option) => tierOf(recordTitled(optionTitle(option), query), query) ?? 3);
        expect(tiers).toEqual([...tiers].sort((left, right) => left - right));
      }
    });

    it("place en tête le meilleur résultat", () => {
      type(query);
      const tiers = screen
        .getAllByRole("option")
        .map((option) => tierOf(recordTitled(optionTitle(option), query), query) ?? 3);
      expect(tiers[0]).toBe(Math.min(...tiers));
    });
  },
);

describe("AC3 surlignage du terme cherché", () => {
  it("surligne la partie du titre qui correspond, accents d'origine conservés", () => {
    type("icone");
    const option = screen
      .getAllByRole("option")
      .find((candidate) => optionTitle(candidate) === "Icônes");
    expect(option?.querySelector("mark")?.textContent).toBe("Icône");
  });

  it("surligne la saisie au milieu d'un titre", () => {
    type("tab");
    const option = screen
      .getAllByRole("option")
      .find((candidate) => optionTitle(candidate) === "DataTable");
    expect(option?.querySelector("mark")?.textContent).toBe("Tab");
  });
});

describe("AC3 navigation clavier", () => {
  it("descend d'une option avec la flèche bas", () => {
    type("bouton");
    const options = screen.getAllByRole("option");
    const before = options.indexOf(activeOption() as HTMLElement);
    press("ArrowDown");
    expect(options.indexOf(activeOption() as HTMLElement)).toBe(before + 1);
  });

  it("remonte d'une option avec la flèche haut", () => {
    type("bouton");
    press("ArrowDown");
    press("ArrowDown");
    const options = screen.getAllByRole("option");
    const before = options.indexOf(activeOption() as HTMLElement);
    press("ArrowUp");
    expect(options.indexOf(activeOption() as HTMLElement)).toBe(before - 1);
  });

  it("garde une seule option sélectionnée pendant la navigation", () => {
    type("bouton");
    press("ArrowDown");
    const selected = screen
      .getAllByRole("option")
      .filter((option) => option.getAttribute("aria-selected") === "true");
    expect(selected).toEqual([activeOption()]);
  });

  it("ouvre la page de l'option active à l'Entrée en changeant le hash", () => {
    type("bouton");
    press("ArrowDown");
    const target = recordTitled(optionTitle(activeOption() as HTMLElement), "bouton");
    press("Enter");
    expect(window.location.hash).toBe(`#${target.path}`);
  });

  it("ferme le panneau au premier Échap en gardant la saisie", () => {
    type("bouton");
    press("Escape");
    expect(field()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(field()).toHaveValue("bouton");
  });

  it("vide le champ au second Échap", () => {
    type("bouton");
    press("Escape");
    press("Escape");
    expect(field()).toHaveValue("");
  });

  it.each([
    ["Ctrl+K", { ctrlKey: true }],
    ["⌘K", { metaKey: true }],
  ])("donne le focus au champ avec %s", (_label, modifiers) => {
    (document.body as HTMLElement).focus();
    fireEvent.keyDown(document, { key: "k", ...modifiers });
    expect(document.activeElement).toBe(field());
  });

  it("ne vole pas le focus sur un K sans modificateur", () => {
    fireEvent.keyDown(document, { key: "k" });
    expect(document.activeElement).not.toBe(field());
  });
});

describe("AC3 annonce des résultats", () => {
  const DELAI_D_ANNONCE_MS = 700;
  const PAS_MS = 50;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function announcementAfterTyping(query: string): string {
    type(query);
    for (let elapsed = 0; elapsed < DELAI_D_ANNONCE_MS; elapsed += PAS_MS) {
      act(() => {
        vi.advanceTimersByTime(PAS_MS);
      });
    }
    return screen
      .getAllByRole("status")
      .map((status) => status.textContent ?? "")
      .join(" ");
  }

  it("annonce l'absence de résultat dans un role status", () => {
    expect(announcementAfterTyping("zzzqqq")).toMatch(/zzzqqq/);
    expect(screen.queryAllByRole("option")).toEqual([]);
  });

  it("annonce le nombre de pages trouvées", () => {
    const count = RECORDS.filter((record) => tierOf(record, "bouton") !== undefined).length;
    expect(announcementAfterTyping("bouton")).toMatch(new RegExp(`${count} pages? trouvées?`));
  });
});

describe("AC3 aucun résultat", () => {
  it("replie le combobox quand rien ne correspond", () => {
    type("zzzqqq");
    expect(field()).toHaveAttribute("aria-expanded", "false");
  });

  it("n'ouvre rien à l'Entrée quand rien ne correspond", () => {
    type("zzzqqq");
    press("Enter");
    expect(window.location.hash).toBe("");
  });

  it("n'affiche pas de résultats pour une saisie faite d'espaces", () => {
    type("   ");
    expect(screen.queryAllByRole("option")).toEqual([]);
  });
});
