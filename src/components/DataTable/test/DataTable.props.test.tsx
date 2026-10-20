import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { DataTable, type CanopColumn, type CanopDataTableProps } from "../DataTable";

interface Person {
  id: string;
  name: string;
  age: number;
  city: string;
}

const people: Person[] = [
  { id: "1", name: "Chloé", age: 41, city: "Lyon" },
  { id: "2", name: "Adrien", age: 27, city: "Brest" },
  { id: "3", name: "Bruno", age: 34, city: "Nantes" },
];

const columns: CanopColumn<Person>[] = [
  { key: "name", header: "Nom", sortable: true },
  { key: "age", header: "Âge", sortable: true },
  { key: "city", header: "Ville" },
];

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

const compactViewport = (query: string) => {
  const match = /max-width:\s*([\d.]+)/.exec(query);
  return match != null && Number(match[1]) > 50;
};

const metricRestorers: (() => void)[] = [];

function stubElementMetric(name: string, value: number) {
  const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, name);
  Object.defineProperty(HTMLElement.prototype, name, { configurable: true, get: () => value });
  metricRestorers.push(() => {
    if (original) Object.defineProperty(HTMLElement.prototype, name, original);
    else delete (HTMLElement.prototype as unknown as Record<string, unknown>)[name];
  });
}

function restoreElementMetrics() {
  metricRestorers.splice(0).forEach((restore) => restore());
}

const tableElement = (props: Partial<CanopDataTableProps<Person>> = {}) => (
  <CanopThemeProvider>
    <DataTable columns={columns} rows={people} getRowKey={(person) => person.id} {...props} />
  </CanopThemeProvider>
);

const renderTable = (props: Partial<CanopDataTableProps<Person>> = {}) =>
  render(tableElement(props));

const table = () => screen.getByRole("table");
const scrollContainer = () => table().parentElement as HTMLElement;
const wrapper = () => scrollContainer().parentElement as HTMLElement;
const rowOf = (name: string) => screen.getByText(name).closest("tr") as HTMLTableRowElement;
const headerOf = (name: string) =>
  screen.getByRole("columnheader", { name: new RegExp(`^${name}`) });
const dragPayload = (key: string) =>
  ({ dropEffect: "", getData: () => key, setData: vi.fn() }) as unknown as DataTransfer;

describe("DataTable — conteneur défilant", () => {
  it("laisse le contenu déborder sans hauteur imposée", () => {
    renderTable();

    expect(scrollContainer()).toHaveStyle({ overflow: "visible" });
    expect(wrapper()).not.toHaveStyle({ display: "flex" });
  });

  it("occupe la hauteur disponible avec fillHeight", () => {
    renderTable({ fillHeight: true });

    expect(wrapper()).toHaveStyle({ display: "flex", flexDirection: "column" });
    expect(scrollContainer()).toHaveStyle({ overflow: "auto" });
  });

  it("borne la hauteur avec maxHeight", () => {
    renderTable({ maxHeight: 200 });

    expect(scrollContainer()).toHaveStyle({ maxHeight: "200px", overflow: "auto" });
  });

  it("distingue le style du conteneur selon displayScrollbar", () => {
    render(
      <>
        {tableElement({ maxHeight: 200, displayScrollbar: true })}
        {tableElement({ maxHeight: 200, displayScrollbar: false })}
      </>,
    );

    const [withScrollbar, withoutScrollbar] = screen
      .getAllByRole("table")
      .map((node) => node.parentElement as HTMLElement);

    expect(withoutScrollbar.className).not.toBe(withScrollbar.className);
  });
});

describe("DataTable — mise en page du tableau", () => {
  it("laisse les colonnes s'adapter par défaut", () => {
    renderTable();

    expect(table()).not.toHaveStyle({ tableLayout: "fixed" });
  });

  it("fige la largeur des colonnes avec fixedLayout", () => {
    renderTable({ fixedLayout: true });

    expect(table()).toHaveStyle({ tableLayout: "fixed" });
  });

  it("applique la largeur demandée sur une colonne", () => {
    renderTable({ columns: [{ key: "name", header: "Nom", width: "10rem" }] });

    expect(headerOf("Nom")).toHaveStyle({ width: "10rem" });
  });

  it("aligne les cellules selon la colonne", () => {
    renderTable({ columns: [{ key: "age", header: "Âge", align: "right" }] });

    expect(within(rowOf("41")).getByRole("cell")).toHaveStyle({ textAlign: "right" });
  });

  it("utilise le rendu personnalisé d'une colonne", () => {
    renderTable({
      columns: [{ key: "name", header: "Nom", render: (person) => <em>{person.city}</em> }],
    });

    expect(screen.getByText("Lyon")).toBeInTheDocument();
    expect(screen.queryByText("Chloé")).not.toBeInTheDocument();
  });

  it("applique un style de ligne conditionnel", () => {
    renderTable({ rowSx: (person) => (person.id === "2" ? { fontStyle: "italic" } : {}) });

    expect(rowOf("Adrien")).toHaveStyle({ fontStyle: "italic" });
    expect(rowOf("Chloé")).not.toHaveStyle({ fontStyle: "italic" });
  });
});

describe("DataTable — en-tête figée", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    stubMatchMedia();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreElementMetrics();
  });

  it("ne fige pas les en-têtes par défaut", () => {
    renderTable();

    expect(headerOf("Ville")).not.toHaveStyle({ position: "sticky" });
  });

  it("fige les en-têtes avec stickyHeader", () => {
    renderTable({ stickyHeader: true });

    expect(headerOf("Ville")).toHaveStyle({ position: "sticky" });
  });

  it("fige aussi l'en-tête de la colonne d'actions", () => {
    renderTable({
      stickyHeader: true,
      actions: () => <button>Ouvrir</button>,
      actionsHeader: "Actions",
    });

    expect(headerOf("Actions")).toHaveStyle({ position: "sticky" });
  });

  it("affiche les lignes quand l'en-tête est mesurée", () => {
    stubElementMetric("offsetHeight", 40);
    renderTable({ stickyHeader: true });

    expect(rowOf("Chloé")).toBeInTheDocument();
  });

  it("affiche les lignes quand l'en-tête est mesurée en mouvement réduit", () => {
    stubMatchMedia((query) => query.includes("prefers-reduced-motion"));
    stubElementMetric("offsetHeight", 40);
    renderTable({ stickyHeader: true });

    expect(rowOf("Chloé")).toBeInTheDocument();
  });

  it("fige l'en-tête mesurée sur petit écran", () => {
    stubMatchMedia(compactViewport);
    stubElementMetric("offsetHeight", 40);
    renderTable({ stickyHeader: true });

    expect(headerOf("Ville")).toHaveStyle({ position: "sticky" });
    expect(rowOf("Chloé")).toBeInTheDocument();
  });

  it("fige l'en-tête mesurée d'un tableau à hauteur bornée", () => {
    stubElementMetric("offsetHeight", 40);
    renderTable({ stickyHeader: true, maxHeight: 200 });

    expect(headerOf("Ville")).toHaveStyle({ position: "sticky" });
  });
});

describe("DataTable — en-tête figée", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    stubMatchMedia();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreElementMetrics();
  });

  it("donne une surface opaque a l'en-tete figee", () => {
    stubElementMetric("offsetHeight", 40);
    stubElementMetric("scrollHeight", 1000);
    stubElementMetric("clientHeight", 200);
    stubElementMetric("scrollTop", 100);
    renderTable({ maxHeight: 200, stickyHeader: true });

    const calque = scrollContainer().querySelector("[data-canop-sticky-surface]") as HTMLElement;
    expect(calque).not.toBeNull();
    const style = getComputedStyle(calque);
    expect(style.position).toBe("sticky");
    expect(style.backgroundColor).toBe("var(--canop-palette-background-paper)");
    expect(style.height).toBe("40px");
  });

  it("ne pose aucun calque sans stickyHeader", () => {
    stubElementMetric("scrollHeight", 1000);
    stubElementMetric("clientHeight", 200);
    renderTable({ maxHeight: 200 });

    expect(scrollContainer().querySelector("[data-canop-sticky-surface]")).toBeNull();
  });

  it("ne pose plus aucun calque de fondu sur les bords", () => {
    stubElementMetric("scrollHeight", 1000);
    stubElementMetric("clientHeight", 200);
    stubElementMetric("scrollTop", 100);
    renderTable({ maxHeight: 200 });

    expect(wrapper().childElementCount).toBe(1);
    expect(getComputedStyle(scrollContainer()).maskImage).not.toContain("linear-gradient");
  });
});

describe("DataTable — colonnes masquées sur mobile", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("affiche toutes les colonnes sur grand écran", () => {
    stubMatchMedia();
    renderTable({ columns: [columns[0], { key: "city", header: "Ville", hideOnMobile: true }] });

    expect(headerOf("Ville")).toBeInTheDocument();
  });

  it("masque les colonnes hideOnMobile sous le breakpoint", () => {
    stubMatchMedia(compactViewport);
    renderTable({ columns: [columns[0], { key: "city", header: "Ville", hideOnMobile: true }] });

    expect(screen.queryByRole("columnheader", { name: /^Ville/ })).not.toBeInTheDocument();
    expect(headerOf("Nom")).toBeInTheDocument();
  });

  it("respecte un breakpoint personnalisé", () => {
    stubMatchMedia(compactViewport);
    renderTable({
      mobileBreakpoint: "sm",
      columns: [columns[0], { key: "city", header: "Ville", hideOnMobile: true }],
    });

    expect(headerOf("Ville")).toBeInTheDocument();
  });
});

describe("DataTable — état vide et chargement", () => {
  it("affiche le message par défaut quand aucune ligne n'est fournie", () => {
    renderTable({ rows: [] });

    expect(screen.getByText("Aucune donnée")).toBeInTheDocument();
  });

  it("étend le message vide sur toutes les colonnes visibles", () => {
    renderTable({ rows: [], actions: () => <button>Ouvrir</button> });

    expect(screen.getByText("Aucune donnée").closest("td")).toHaveAttribute("colspan", "4");
  });

  it("étend le message vide sur la colonne de sélection", () => {
    renderTable({ rows: [], selectable: true, selectedKeys: ["1"] });

    expect(screen.getByText("Aucune donnée").closest("td")).toHaveAttribute("colspan", "4");
  });

  it("étend l'indicateur de chargement sur toutes les colonnes", () => {
    renderTable({ loading: true, actions: () => <button>Ouvrir</button> });

    expect(screen.getByRole("progressbar").closest("td")).toHaveAttribute("colspan", "4");
  });
});

describe("DataTable — colonne d'actions", () => {
  it("n'ajoute pas de colonne sans actions", () => {
    renderTable();

    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
  });

  it("ajoute une colonne d'actions sans en-tête par défaut", () => {
    renderTable({ actions: () => <button>Ouvrir</button> });

    expect(screen.getAllByRole("columnheader")).toHaveLength(4);
  });

  it("applique la largeur demandée à la colonne d'actions", () => {
    renderTable({
      actions: () => <button>Ouvrir</button>,
      actionsHeader: "Actions",
      actionsWidth: "6rem",
    });

    expect(headerOf("Actions")).toHaveStyle({ width: "6rem" });
  });
});

describe("DataTable — tri", () => {
  it("n'annonce aucun tri sur une colonne non triable", () => {
    renderTable();

    expect(headerOf("Ville")).not.toHaveAttribute("aria-sort");
  });

  it("annonce une colonne triable non triée", () => {
    renderTable();

    expect(headerOf("Nom")).toHaveAttribute("aria-sort", "none");
  });

  it("annonce le sens de tri croissant puis décroissant", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByText("Nom"));
    expect(headerOf("Nom")).toHaveAttribute("aria-sort", "ascending");

    await user.click(screen.getByText("Nom"));
    expect(headerOf("Nom")).toHaveAttribute("aria-sort", "descending");
  });

  it("revient à l'ordre initial au troisième clic", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByText("Nom"));
    await user.click(screen.getByText("Nom"));
    await user.click(screen.getByText("Nom"));

    expect(headerOf("Nom")).toHaveAttribute("aria-sort", "none");
    expect(within(screen.getAllByRole("row")[1]).getByText("Chloé")).toBeInTheDocument();
  });

  it("trie alphabétiquement une colonne texte sans sortValue", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByText("Nom"));

    expect(within(screen.getAllByRole("row")[1]).getByText("Adrien")).toBeInTheDocument();
  });

  it("trie numériquement une colonne de nombres sans sortValue", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByText("Âge"));

    expect(within(screen.getAllByRole("row")[1]).getByText("27")).toBeInTheDocument();
  });

  it("bascule le tri sur une autre colonne en ordre croissant", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByText("Nom"));
    await user.click(screen.getByText("Nom"));
    await user.click(screen.getByText("Âge"));

    expect(headerOf("Nom")).toHaveAttribute("aria-sort", "none");
    expect(headerOf("Âge")).toHaveAttribute("aria-sort", "ascending");
  });

  it("conserve l'ordre quand la colonne triée est absente des lignes", async () => {
    const user = userEvent.setup();
    renderTable({
      columns: [...columns, { key: "surnom", header: "Surnom", sortable: true }],
    });

    await user.click(screen.getByText("Surnom"));

    expect(headerOf("Surnom")).toHaveAttribute("aria-sort", "ascending");
    expect(within(screen.getAllByRole("row")[1]).getByText("Chloé")).toBeInTheDocument();
  });
});

describe("DataTable — interactions de ligne", () => {
  it("relaie le menu contextuel", () => {
    const onRowContextMenu = vi.fn();
    renderTable({ onRowContextMenu });

    fireEvent.contextMenu(rowOf("Adrien"));

    expect(onRowContextMenu).toHaveBeenCalledWith(people[1], expect.anything());
  });

  it("n'intercepte pas le menu contextuel sans rappel", () => {
    renderTable();

    expect(fireEvent.contextMenu(rowOf("Adrien"))).toBe(true);
  });

  it("rend la ligne déplaçable quand draggableRow l'autorise", () => {
    renderTable({ draggableRow: (person) => person.id === "2" });

    expect(rowOf("Adrien")).toHaveAttribute("draggable", "true");
    expect(rowOf("Chloé")).toHaveAttribute("draggable", "false");
  });

  it("relaie le dépôt sur une ligne cible autorisée", () => {
    const onRowDrop = vi.fn();
    renderTable({ draggableRow: () => true, canDropRow: () => true, onRowDrop });

    const dataTransfer = dragPayload("1");
    fireEvent.dragOver(rowOf("Adrien"), { dataTransfer });
    fireEvent.drop(rowOf("Adrien"), { dataTransfer });

    expect(onRowDrop).toHaveBeenCalledWith(people[1], "1");
  });

  it("met en évidence la ligne survolée puis la relâche", () => {
    renderTable({ draggableRow: () => true, canDropRow: () => true, onRowDrop: vi.fn() });

    const initial = rowOf("Adrien").className;
    fireEvent.dragOver(rowOf("Adrien"), { dataTransfer: dragPayload("1") });

    expect(rowOf("Adrien").className).not.toBe(initial);

    fireEvent.dragLeave(rowOf("Adrien"));

    expect(rowOf("Adrien").className).toBe(initial);
  });

  it("ignore le dépôt d'une ligne sur elle-même", () => {
    const onRowDrop = vi.fn();
    renderTable({ draggableRow: () => true, canDropRow: () => true, onRowDrop });

    const dataTransfer = dragPayload("2");
    fireEvent.drop(rowOf("Adrien"), { dataTransfer });

    expect(onRowDrop).not.toHaveBeenCalled();
  });

  it("n'accepte aucun dépôt quand canDropRow refuse la ligne", () => {
    const onRowDrop = vi.fn();
    renderTable({ draggableRow: () => true, canDropRow: () => false, onRowDrop });

    const dataTransfer = dragPayload("1");
    fireEvent.drop(rowOf("Adrien"), { dataTransfer });

    expect(onRowDrop).not.toHaveBeenCalled();
  });
});

describe("DataTable — apparition animée", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("n'anime pas les lignes par défaut", () => {
    stubMatchMedia();
    renderTable();

    expect(rowOf("Adrien")).not.toHaveStyle({ transitionDelay: "0.04s" });
  });

  it("décale l'apparition des lignes avec animated", () => {
    stubMatchMedia();
    renderTable({ animated: true });

    expect(rowOf("Adrien")).toHaveStyle({ transitionDelay: "0.04s" });
  });

  it("n'anime pas les lignes en mouvement réduit", () => {
    stubMatchMedia((query) => query.includes("prefers-reduced-motion"));
    renderTable({ animated: true });

    expect(rowOf("Adrien")).not.toHaveStyle({ transitionDelay: "0.04s" });
  });
});
