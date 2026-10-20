import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { DataTable, type CanopColumn, type CanopDataTableProps } from "../DataTable";

interface Person {
  id: string;
  name: string;
}

const people: Person[] = [
  { id: "a", name: "Alice" },
  { id: "b", name: "Bob" },
  { id: "c", name: "Carol" },
];

const columns: CanopColumn<Person>[] = [{ key: "name", header: "Nom" }];

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function stubMatchMedia(matchedQueries: string[] = []) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: matchedQueries.includes(query),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

const tableElement = (props: Partial<CanopDataTableProps<Person>> = {}) => (
  <CanopThemeProvider>
    <DataTable
      columns={columns}
      rows={people}
      getRowKey={(person) => person.id}
      enableKeyboardNav
      {...props}
    />
  </CanopThemeProvider>
);

function renderTable(props: Partial<CanopDataTableProps<Person>> = {}) {
  const view = render(tableElement(props));
  return {
    ...view,
    rerenderTable: (next: Partial<CanopDataTableProps<Person>> = {}) =>
      view.rerender(tableElement(next)),
  };
}

const scrollContainer = () => screen.getByRole("table").parentElement as HTMLElement;

const pressKey = (key: string, times = 1) => {
  for (let count = 0; count < times; count += 1) {
    fireEvent.keyDown(scrollContainer(), { key });
  }
};

describe("useKeyboardNav — activation", () => {
  beforeEach(() => {
    stubMatchMedia();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rend le conteneur focalisable quand la navigation est activée", () => {
    renderTable();

    expect(scrollContainer()).toHaveAttribute("tabindex", "0");
  });

  it("ne rend pas le conteneur focalisable quand la navigation est désactivée", () => {
    renderTable({ enableKeyboardNav: false });

    expect(scrollContainer()).not.toHaveAttribute("tabindex");
  });

  it("ignore les touches quand la navigation est désactivée", () => {
    const onRowActivate = vi.fn();
    renderTable({ enableKeyboardNav: false, onRowActivate });

    pressKey("ArrowDown");
    pressKey("Enter");

    expect(onRowActivate).not.toHaveBeenCalled();
  });
});

describe("useKeyboardNav — déplacement dans la liste", () => {
  beforeEach(() => {
    stubMatchMedia();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("active la première ligne après une flèche bas", () => {
    const onRowActivate = vi.fn();
    renderTable({ onRowActivate });

    pressKey("ArrowDown");
    pressKey("Enter");

    expect(onRowActivate).toHaveBeenCalledWith(people[0]);
  });

  it("descend d'une ligne à chaque flèche bas", () => {
    const onRowActivate = vi.fn();
    renderTable({ onRowActivate });

    pressKey("ArrowDown", 2);
    pressKey("Enter");

    expect(onRowActivate).toHaveBeenCalledWith(people[1]);
  });

  it("reste sur la dernière ligne quand la flèche bas dépasse la fin", () => {
    const onRowActivate = vi.fn();
    renderTable({ onRowActivate });

    pressKey("ArrowDown", 8);
    pressKey("Enter");

    expect(onRowActivate).toHaveBeenCalledWith(people[2]);
  });

  it("reste sur la première ligne quand la flèche haut dépasse le début", () => {
    const onRowActivate = vi.fn();
    renderTable({ onRowActivate });

    pressKey("ArrowUp", 3);
    pressKey("Enter");

    expect(onRowActivate).toHaveBeenCalledWith(people[0]);
  });

  it("remonte d'une ligne avec la flèche haut", () => {
    const onRowActivate = vi.fn();
    renderTable({ onRowActivate });

    pressKey("ArrowDown", 3);
    pressKey("ArrowUp");
    pressKey("Enter");

    expect(onRowActivate).toHaveBeenCalledWith(people[1]);
  });

  it("n'active aucune ligne tant qu'aucune n'a été atteinte", () => {
    const onRowActivate = vi.fn();
    renderTable({ onRowActivate });

    pressKey("Enter");

    expect(onRowActivate).not.toHaveBeenCalled();
  });

  it("ignore les touches non gérées", () => {
    const onRowActivate = vi.fn();
    renderTable({ onRowActivate });

    pressKey("ArrowDown");
    pressKey("Tab");
    pressKey("Enter");

    expect(onRowActivate).toHaveBeenCalledWith(people[0]);
  });

  it("n'active rien sur une liste vide", () => {
    const onRowActivate = vi.fn();
    renderTable({ rows: [], onRowActivate });

    pressKey("ArrowDown");
    pressKey("Enter");

    expect(onRowActivate).not.toHaveBeenCalled();
  });

  it("ramène la sélection dans les bornes quand la liste rétrécit", () => {
    const onRowActivate = vi.fn();
    const view = renderTable({ onRowActivate });

    pressKey("ArrowDown", 3);
    view.rerenderTable({ rows: people.slice(0, 1), onRowActivate });
    pressKey("Enter");

    expect(onRowActivate).toHaveBeenCalledWith(people[0]);
  });

  it("retombe sur onRowDoubleClick quand onRowActivate est absent", () => {
    const onRowDoubleClick = vi.fn();
    renderTable({ onRowDoubleClick });

    pressKey("ArrowDown");
    pressKey("Enter");

    expect(onRowDoubleClick).toHaveBeenCalledWith(people[0]);
  });

  it("ne lève pas d'erreur sans rappel d'activation", () => {
    renderTable();

    pressKey("ArrowDown");

    expect(() => pressKey("Enter")).not.toThrow();
  });
});

describe("useKeyboardNav — défilement automatique", () => {
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    stubMatchMedia();
    scrollIntoView.mockClear();
    Element.prototype.scrollIntoView = scrollIntoView;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fait défiler la ligne atteinte en douceur", () => {
    renderTable({ maxHeight: 200 });

    pressKey("ArrowDown");

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest", behavior: "smooth" });
  });

  it("fait défiler sans animation en mouvement réduit", () => {
    stubMatchMedia([reducedMotionQuery]);
    renderTable({ maxHeight: 200 });

    pressKey("ArrowDown");

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest", behavior: "auto" });
  });

  it("ne fait rien sans conteneur défilant interne", () => {
    renderTable();

    pressKey("ArrowDown");

    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("ne fait rien quand la navigation clavier est désactivée", () => {
    renderTable({ enableKeyboardNav: false, maxHeight: 200 });

    pressKey("ArrowDown");

    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
