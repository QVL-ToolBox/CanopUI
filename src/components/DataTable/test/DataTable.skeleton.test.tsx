import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { DataTable, type CanopColumn, type CanopDataTableProps } from "../DataTable";
import { reglesEmises } from "../../../test/cssRules";
import { Card } from "../../Card";
import { PageContent } from "../../PageContent";

interface Person {
  id: string;
  name: string;
  age: number;
  city: string;
}

const columns: CanopColumn<Person>[] = [
  { key: "name", header: "Nom" },
  { key: "age", header: "Âge" },
  { key: "city", header: "Ville" },
];

const peopleOf = (count: number): Person[] =>
  Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    name: `Personne ${index + 1}`,
    age: 20 + index,
    city: "Lyon",
  }));

class ResizeObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

function stubMatchMedia(matches: (query: string) => boolean = () => false) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: matches(query),
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
    <DataTable columns={columns} rows={peopleOf(3)} getRowKey={(person) => person.id} {...props} />
  </CanopThemeProvider>
);

const renderTable = (props: Partial<CanopDataTableProps<Person>> = {}) =>
  render(tableElement(props));

const tbody = () => screen.getByRole("table").querySelector("tbody") as HTMLElement;
const bodyRows = () => Array.from(tbody().querySelectorAll("tr"));
const ghostRows = () => bodyRows().filter((row) => row.hasAttribute("data-skeleton-row"));
const cellsOf = (row: HTMLElement) => row.querySelectorAll("td");
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

describe("DataTable — lignes fantômes pendant le chargement", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    stubMatchMedia();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("given un chargement, when le tableau est rendu, then il affiche des lignes fantômes à la place des données", () => {
    renderTable({ loading: true });

    expect(ghostRows().length).toBeGreaterThan(0);
    expect(tbody()).not.toHaveTextContent("Personne");
    expect(screen.queryByText("Personne 1")).not.toBeInTheDocument();
  });

  it("given un chargement, when le tableau est rendu, then l'en-tête des colonnes reste affichée", () => {
    renderTable({ loading: true });

    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
  });

  it("given trois colonnes, when le tableau charge, then chaque ligne fantôme a trois cellules", () => {
    renderTable({ loading: true });

    ghostRows().forEach((row) => expect(cellsOf(row)).toHaveLength(3));
  });

  it("given une colonne d'actions, when le tableau charge, then chaque ligne fantôme a une cellule de plus", () => {
    renderTable({ loading: true, actions: () => <button>Ouvrir</button> });

    ghostRows().forEach((row) => expect(cellsOf(row)).toHaveLength(4));
  });

  it("given un tableau sélectionnable avec actions, when il charge, then chaque ligne fantôme couvre toutes les colonnes visibles", () => {
    renderTable({ loading: true, selectable: true, actions: () => <button>Ouvrir</button> });

    const visibleColumns = screen.getAllByRole("columnheader").length;
    ghostRows().forEach((row) => expect(cellsOf(row)).toHaveLength(visibleColumns));
  });

  it("given une seule colonne, when le tableau charge, then chaque ligne fantôme a une cellule", () => {
    renderTable({ loading: true, columns: [columns[0]] });

    ghostRows().forEach((row) => expect(cellsOf(row)).toHaveLength(1));
  });

  it("given des lignes fantômes, when on les rend, then aucune cellule ne s'étend sur plusieurs colonnes", () => {
    renderTable({ loading: true, actions: () => <button>Ouvrir</button> });

    ghostRows().forEach((row) =>
      cellsOf(row).forEach((cell) => expect(cell).not.toHaveAttribute("colspan")),
    );
  });

  it.each([
    [0, 5],
    [1, 1],
    [3, 3],
    [8, 8],
    [9, 8],
    [25, 8],
  ])(
    "given %i lignes déjà connues, when le tableau charge, then il affiche %i lignes fantômes",
    (known, expected) => {
      renderTable({ loading: true, rows: peopleOf(known) });

      expect(ghostRows()).toHaveLength(expected);
    },
  );

  it("given un chargement, when on cherche l'indicateur accessible, then un seul progressbar nommé est exposé", () => {
    renderTable({ loading: true });

    expect(screen.getAllByRole("progressbar")).toHaveLength(1);
    expect(screen.getByRole("progressbar", { name: "Chargement" })).toBeInTheDocument();
  });
});

describe("DataTable — nombre de lignes fantômes figé", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    stubMatchMedia();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("given un squelette de trois lignes, when les lignes connues changent pendant le chargement, then le nombre de lignes fantômes ne bouge pas", () => {
    const { rerender } = render(tableElement({ loading: true, rows: peopleOf(3) }));

    rerender(tableElement({ loading: true, rows: peopleOf(7) }));
    expect(ghostRows()).toHaveLength(3);

    rerender(tableElement({ loading: true, rows: [] }));
    expect(ghostRows()).toHaveLength(3);
  });

  it("given un squelette par défaut sans lignes, when des lignes arrivent pendant le chargement, then il garde cinq lignes fantômes", () => {
    const { rerender } = render(tableElement({ loading: true, rows: [] }));

    rerender(tableElement({ loading: true, rows: peopleOf(2) }));

    expect(ghostRows()).toHaveLength(5);
  });
});

describe("DataTable — durée minimale d'affichage du squelette", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    stubMatchMedia();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("given un squelette devenu visible, when le chargement se termine juste après, then les lignes fantômes restent affichées", () => {
    const { rerender } = render(tableElement({ loading: true, rows: peopleOf(3) }));
    advance(200);

    rerender(tableElement({ loading: false, rows: peopleOf(3) }));

    expect(ghostRows()).toHaveLength(3);
    expect(screen.queryByText("Personne 1")).not.toBeInTheDocument();
  });

  it("given un squelette visible depuis 180 ms, when le chargement se termine, then il reste affiché 400 ms au moins", () => {
    const { rerender } = render(tableElement({ loading: true, rows: peopleOf(3) }));
    advance(200);
    rerender(tableElement({ loading: false, rows: peopleOf(3) }));

    advance(379);

    expect(ghostRows()).toHaveLength(3);
  });

  it("given un squelette maintenu, when les 400 ms d'affichage sont écoulées, then les données apparaissent", () => {
    const { rerender } = render(tableElement({ loading: true, rows: peopleOf(3) }));
    advance(200);
    rerender(tableElement({ loading: false, rows: peopleOf(3) }));

    advance(1000);

    expect(ghostRows()).toHaveLength(0);
    expect(screen.getByText("Personne 1")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("given un squelette maintenu après la fin du chargement, when les nouvelles lignes sont connues, then le nombre de lignes fantômes reste figé", () => {
    const { rerender } = render(tableElement({ loading: true, rows: [] }));
    advance(200);

    rerender(tableElement({ loading: false, rows: peopleOf(2) }));

    expect(ghostRows()).toHaveLength(5);
  });

  it("given un chargement plus long que la durée minimale, when il se termine, then les données apparaissent sans attente supplémentaire", () => {
    const { rerender } = render(tableElement({ loading: true, rows: [] }));
    advance(1000);

    rerender(tableElement({ loading: false, rows: peopleOf(2) }));

    expect(ghostRows()).toHaveLength(0);
    expect(screen.getByText("Personne 1")).toBeInTheDocument();
  });
});

describe("DataTable — animation des lignes fantômes", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("given un chargement, when les lignes fantômes sont rendues, then la première apparaît après 180 ms", () => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    stubMatchMedia();
    renderTable({ loading: true });

    const animation = reglesEmises(ghostRows()[0])
      .filter((regle) => regle.conditions.length === 0)
      .map((regle) => regle.style.getPropertyValue("animation"))
      .find((valeur) => valeur !== "");
    expect(animation).toMatch(/\b180ms\b/);
  });

  it("given prefers-reduced-motion, when les lignes fantômes sont rendues, then aucune barre ne pulse", () => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    stubMatchMedia((query) => query.includes("prefers-reduced-motion"));
    renderTable({ loading: true });

    const barres = ghostRows().flatMap((row) => Array.from(row.querySelectorAll("[data-pulse]")));
    expect(barres.length).toBeGreaterThan(0);
    barres.forEach((barre) => expect(barre).toHaveAttribute("data-pulse", "off"));
  });
});

describe("DataTable — désactivation du squelette", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    stubMatchMedia();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("given skeleton={false}, when le tableau charge, then il n'affiche aucune ligne fantôme", () => {
    renderTable({ loading: true, skeleton: false });

    expect(ghostRows()).toHaveLength(0);
  });

  it("given skeleton={false}, when le tableau charge, then l'ancien indicateur s'étend sur toutes les colonnes visibles", () => {
    renderTable({ loading: true, skeleton: false, actions: () => <button>Ouvrir</button> });

    expect(screen.getByRole("progressbar").closest("td")).toHaveAttribute("colspan", "4");
  });

  it("given skeleton={false}, when le chargement se termine, then les données apparaissent immédiatement", () => {
    const { rerender } = render(tableElement({ loading: true, skeleton: false, rows: [] }));

    rerender(tableElement({ loading: false, skeleton: false, rows: peopleOf(2) }));

    expect(screen.getByText("Personne 1")).toBeInTheDocument();
  });
});

describe("DataTable — sans chargement", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    stubMatchMedia();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("given des lignes et aucun chargement, when le tableau est rendu, then il affiche les données sans ligne fantôme", () => {
    renderTable();

    expect(ghostRows()).toHaveLength(0);
    expect(bodyRows()).toHaveLength(3);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("given aucune ligne et aucun chargement, when le tableau est rendu, then il affiche le message vide", () => {
    renderTable({ rows: [] });

    expect(ghostRows()).toHaveLength(0);
    expect(screen.getByText("Aucune donnée")).toBeInTheDocument();
  });
});

describe("DataTable — accessibilité des lignes fantômes", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    stubMatchMedia();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("given un chargement, when le tableau est rendu, then le corps du tableau est marqué occupé", () => {
    renderTable({ loading: true });

    expect(tbody()).toHaveAttribute("aria-busy", "true");
  });

  it("given un chargement, when les lignes fantômes sont rendues, then elles ne sont pas exposées comme des lignes de données", () => {
    renderTable({ loading: true });

    ghostRows().forEach((row) =>
      expect(
        row.getAttribute("aria-hidden") === "true" || row.getAttribute("role") === "presentation",
      ).toBe(true),
    );
  });

  it("given un chargement avec actions et sélection, when le tableau est rendu, then un seul progressbar est annoncé", () => {
    renderTable({ loading: true, selectable: true, actions: () => <button>Ouvrir</button> });

    expect(screen.getAllByRole("progressbar")).toHaveLength(1);
  });
});

describe("DataTable — portée des conteneurs", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    stubMatchMedia();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const plainSpinner = () => {
    const indicator = screen.getByRole("progressbar");
    return (
      !indicator.hasAttribute("data-skeleton") &&
      indicator.className.includes("MuiCircularProgress")
    );
  };

  it("given un DataTable skeleton={false} dans une PageContent, when il charge, then l'ancien indicateur reste un Spinner", () => {
    render(
      <CanopThemeProvider>
        <PageContent>{tableElement({ loading: true, skeleton: false })}</PageContent>
      </CanopThemeProvider>,
    );

    expect(plainSpinner()).toBe(true);
    expect(ghostRows()).toHaveLength(0);
  });

  it("given un DataTable skeleton={false} dans une Card, when il charge, then l'ancien indicateur reste un Spinner", () => {
    render(
      <CanopThemeProvider>
        <Card>{tableElement({ loading: true, skeleton: false })}</Card>
      </CanopThemeProvider>,
    );

    expect(plainSpinner()).toBe(true);
    expect(ghostRows()).toHaveLength(0);
  });

  it("given une PageContent skeleton={false}, when un DataTable y charge, then il n'affiche aucune ligne fantôme", () => {
    render(
      <CanopThemeProvider>
        <PageContent skeleton={false}>{tableElement({ loading: true })}</PageContent>
      </CanopThemeProvider>,
    );

    expect(ghostRows()).toHaveLength(0);
    expect(plainSpinner()).toBe(true);
  });

  it("given une PageContent active, when un DataTable y charge, then il affiche des lignes fantômes", () => {
    render(
      <CanopThemeProvider>
        <PageContent>{tableElement({ loading: true })}</PageContent>
      </CanopThemeProvider>,
    );

    expect(ghostRows()).toHaveLength(3);
  });
});
