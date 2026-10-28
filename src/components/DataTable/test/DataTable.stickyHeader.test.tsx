import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { DataTable, type CanopColumn, type CanopDataTableProps } from "../DataTable";
import { valeursEmises } from "../../../test/cssRules";

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

const observedResizes: ResizeObserverCallback[] = [];

class RecordingResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    observedResizes.push(callback);
  }
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

const metrics = new Map<string, number>();
const originals = new Map<string, PropertyDescriptor | undefined>();

function stubElementMetric(name: string, value: number) {
  metrics.set(name, value);
  if (originals.has(name)) return;
  originals.set(name, Object.getOwnPropertyDescriptor(HTMLElement.prototype, name));
  Object.defineProperty(HTMLElement.prototype, name, {
    configurable: true,
    get: () => metrics.get(name),
  });
}

function restoreElementMetrics() {
  originals.forEach((original, name) => {
    if (original) Object.defineProperty(HTMLElement.prototype, name, original);
    else delete (HTMLElement.prototype as unknown as Record<string, unknown>)[name];
  });
  originals.clear();
  metrics.clear();
}

function triggerResize(height: number) {
  stubElementMetric("offsetHeight", height);
  const entry = {
    borderBoxSize: [{ blockSize: height, inlineSize: 600 }],
    contentRect: { height },
  } as unknown as ResizeObserverEntry;
  act(() => {
    observedResizes.forEach((callback) => callback([entry], {} as ResizeObserver));
  });
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
const surface = () =>
  scrollContainer().querySelector("[data-canop-sticky-surface]") as HTMLElement | null;
const headerOf = (label: string) =>
  screen.getByRole("columnheader", { name: new RegExp(`^${label}`) });
const rowOf = (name: string) => screen.getByText(name).closest("tr") as HTMLTableRowElement;
const bodyNames = () =>
  Array.from(table().querySelectorAll("tbody tr")).map(
    (row) => row.querySelector("td")?.textContent,
  );

const compact = (value: string) => value.replace(/\s+/g, "");
const emitted = (element: Element, property: string, suffix = "") =>
  valeursEmises(element, property, suffix).at(-1) ?? "";
const rowGap = () => emitted(table(), "border-spacing").split(/\s+/).at(-1) ?? "";
const containerClipPath = () => emitted(scrollContainer(), "clip-path");

describe("DataTable — barre d'en-tête figée squircle", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", RecordingResizeObserver);
    stubMatchMedia();
    stubElementMetric("offsetHeight", 40);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreElementMetrics();
    observedResizes.splice(0);
  });

  it("given stickyHeader, when le tableau est rendu, then le calque d'en-tête est sticky et transparent sur l'hôte", () => {
    renderTable({ stickyHeader: true, maxHeight: 200 });

    const calque = surface() as HTMLElement;
    expect(calque).not.toBeNull();
    expect(emitted(calque, "position")).toBe("sticky");
    expect(emitted(calque, "background-color")).toBe("transparent");
    expect(emitted(calque, "background-color")).not.toContain("background-paper");
  });

  it("given stickyHeader, when le tableau est rendu, then le calque est peint par un ::before découpé au squircle de l'hôte", () => {
    renderTable({ stickyHeader: true, maxHeight: 200 });

    const calque = surface() as HTMLElement;
    const squircle = emitted(calque, "--canop-squircle-clip");
    const peinture = emitted(calque, "clip-path", "::before");
    expect(squircle).toMatch(/^polygon\(/);
    expect(compact(peinture)).toBe(compact(squircle));
    expect(emitted(calque, "background-color", "::before")).not.toBe("");
  });

  it("given stickyHeader, when le tableau est rendu, then la barre a le rayon de 1,5rem et l'ombre e1 des lignes", () => {
    renderTable({ stickyHeader: true, maxHeight: 200 });

    const calque = surface() as HTMLElement;
    const ligne = rowOf("Adrien");
    expect(compact(emitted(calque, "--canop-squircle-clip"))).toContain("min(1.5rem,50%)");
    expect(compact(emitted(calque, "--canop-squircle-clip"))).toBe(
      compact(emitted(ligne, "--canop-squircle-clip")),
    );
    expect(emitted(calque, "filter")).toBe("var(--canop-drop-shadow-e1)");
    expect(emitted(calque, "filter")).toBe(emitted(ligne, "filter"));
  });

  it("given stickyHeader et une en-tête mesurée, when le tableau est rendu, then le calque prend la hauteur de l'en-tête", () => {
    renderTable({ stickyHeader: true, maxHeight: 200 });

    expect(emitted(surface() as HTMLElement, "height")).toBe("40px");
  });
});

describe.each([
  ["maxHeight", { maxHeight: 200 }],
  ["fillHeight", { fillHeight: true }],
] as const)("DataTable — en-tête figée en défilement interne (%s)", (_, bounded) => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", RecordingResizeObserver);
    stubMatchMedia();
    stubElementMetric("offsetHeight", 40);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreElementMetrics();
    observedResizes.splice(0);
  });

  it("given un défilement interne, when le tableau est rendu, then les th et la barre collent à top 0", () => {
    renderTable({ stickyHeader: true, ...bounded });

    columns.forEach((column) => {
      expect(emitted(headerOf(column.header as string), "position")).toBe("sticky");
      expect(emitted(headerOf(column.header as string), "top")).toBe("0px");
    });
    expect(emitted(surface() as HTMLElement, "top")).toBe("0px");
  });

  it("given un défilement interne, when le tableau est rendu, then la table compense l'espacement par une marge haute négative égale au rowGap", () => {
    renderTable({ stickyHeader: true, ...bounded });

    expect(rowGap()).not.toBe("");
    expect(emitted(table(), "margin-top")).toBe(`-${rowGap()}`);
  });

  it("given un défilement interne, when le tableau est rendu, then le conteneur porte un clip-path polygon sans content-box", () => {
    renderTable({ stickyHeader: true, ...bounded });

    expect(containerClipPath()).toMatch(/^polygon\(/);
    expect(containerClipPath()).not.toContain("content-box");
  });

  it("given un défilement interne, when le tableau est rendu, then scroll-padding-top vaut rowGap plus la hauteur d'en-tête", () => {
    renderTable({ stickyHeader: true, ...bounded });

    expect(compact(emitted(scrollContainer(), "scroll-padding-top"))).toBe(
      compact(`calc(40px + ${rowGap()})`),
    );
  });

  it("given une en-tête qui grandit, when le ResizeObserver le signale, then le clip-path et scroll-padding-top sont recalculés", () => {
    renderTable({ stickyHeader: true, ...bounded });
    const avant = containerClipPath();

    triggerResize(64);

    expect(containerClipPath()).not.toBe(avant);
    expect(containerClipPath()).toContain("64px");
    expect(containerClipPath()).not.toContain("40px");
    expect(compact(emitted(scrollContainer(), "scroll-padding-top"))).toBe(
      compact(`calc(64px + ${rowGap()})`),
    );
  });

  it("given une scrollbar qui apparaît, when le ResizeObserver le signale, then le clip-path tient compte de sa largeur", () => {
    stubElementMetric("offsetWidth", 600);
    stubElementMetric("clientWidth", 600);
    renderTable({ stickyHeader: true, ...bounded });
    expect(containerClipPath()).not.toContain("15px");

    stubElementMetric("clientWidth", 585);
    triggerResize(40);

    expect(containerClipPath()).toContain("15px");
  });
});

describe("DataTable — en-tête figée en défilement de page", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", RecordingResizeObserver);
    stubMatchMedia();
    stubElementMetric("offsetHeight", 40);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreElementMetrics();
    observedResizes.splice(0);
  });

  it("given stickyHeader sans hauteur bornée, when le tableau est rendu, then la barre squircle est présente", () => {
    renderTable({ stickyHeader: true });

    const calque = surface() as HTMLElement;
    expect(calque).not.toBeNull();
    expect(emitted(calque, "position")).toBe("sticky");
    expect(compact(emitted(calque, "clip-path", "::before"))).toBe(
      compact(emitted(calque, "--canop-squircle-clip")),
    );
    expect(emitted(calque, "filter")).toBe("var(--canop-drop-shadow-e1)");
  });

  it("given stickyHeader sans hauteur bornée, when le tableau est rendu, then le conteneur n'a pas de clip-path", () => {
    renderTable({ stickyHeader: true });

    expect(containerClipPath()).toBe("");
  });
});

describe("DataTable — sans en-tête figée", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", RecordingResizeObserver);
    stubMatchMedia();
    stubElementMetric("offsetHeight", 40);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreElementMetrics();
    observedResizes.splice(0);
  });

  it.each([
    ["sans hauteur bornée", {}],
    ["avec maxHeight", { maxHeight: 200 }],
    ["avec fillHeight", { fillHeight: true }],
  ] as const)(
    "given un tableau %s, when il est rendu, then aucun calque sticky ni clip n'est posé",
    (_, bounded) => {
      renderTable(bounded);

      expect(surface()).toBeNull();
      expect(containerClipPath()).toBe("");
      expect(emitted(headerOf("Nom"), "position")).not.toBe("sticky");
    },
  );
});

describe("DataTable — non-régression en en-tête figée", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", RecordingResizeObserver);
    stubMatchMedia();
    stubElementMetric("offsetHeight", 40);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreElementMetrics();
    observedResizes.splice(0);
  });

  it("given une en-tête figée, when on clique deux fois sur un en-tête triable, then le tri passe asc puis desc", async () => {
    const user = userEvent.setup();
    renderTable({ stickyHeader: true, maxHeight: 200 });

    await user.click(screen.getByText("Âge"));
    expect(bodyNames()).toEqual(["Adrien", "Bruno", "Chloé"]);

    await user.click(screen.getByText("Âge"));
    expect(bodyNames()).toEqual(["Chloé", "Bruno", "Adrien"]);
  });

  it("given une en-tête figée sélectionnable, when on coche la case d'en-tête, then toutes les lignes sont sélectionnées", async () => {
    const user = userEvent.setup();
    renderTable({ stickyHeader: true, maxHeight: 200, selectable: true });

    await user.click(rowOf("Chloé"));

    await user.click(screen.getByRole("checkbox", { name: "Tout sélectionner" }));

    people.forEach((person) => expect(rowOf(person.name)).toHaveAttribute("aria-selected", "true"));
  });

  it("given une en-tête figée avec actions, when on clique une action, then elle est relayée et son en-tête est figée", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    renderTable({
      stickyHeader: true,
      maxHeight: 200,
      actionsHeader: "Actions",
      actions: (person) => <button onClick={() => onOpen(person.id)}>Ouvrir {person.name}</button>,
    });

    await user.click(screen.getByRole("button", { name: "Ouvrir Bruno" }));

    expect(onOpen).toHaveBeenCalledWith("3");
    expect(emitted(headerOf("Actions"), "position")).toBe("sticky");
  });

  it("given une en-tête figée sur mobile, when une colonne est hideOnMobile, then elle est masquée", () => {
    stubMatchMedia(compactViewport);
    renderTable({
      stickyHeader: true,
      maxHeight: 200,
      columns: [columns[0], { key: "city", header: "Ville", hideOnMobile: true }],
    });

    expect(screen.queryByRole("columnheader", { name: /^Ville/ })).not.toBeInTheDocument();
    expect(headerOf("Nom")).toBeInTheDocument();
    expect(surface()).not.toBeNull();
  });

  it("given une en-tête figée en chargement, when le squelette est actif, then les lignes fantômes s'affichent sous la barre", () => {
    renderTable({ stickyHeader: true, maxHeight: 200, loading: true });

    const fantomes = table().querySelectorAll("tbody tr[data-skeleton-row]");
    expect(fantomes.length).toBeGreaterThan(0);
    fantomes.forEach((row) => expect(row.querySelectorAll("td")).toHaveLength(columns.length));
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);
    expect(surface()).not.toBeNull();
  });

  it("given une en-tête figée et la navigation clavier, when une ligne prend le focus clavier, then ses cellules prennent le fond du survol", () => {
    Element.prototype.scrollIntoView = vi.fn();
    renderTable({ stickyHeader: true, maxHeight: 200, enableKeyboardNav: true });
    const fondSurvol = emitted(rowOf("Adrien"), "background-color", ".MuiTableRow-hover:hover");

    fireEvent.keyDown(scrollContainer(), { key: "ArrowDown" });

    const focalisee = table().querySelector("tbody tr") as HTMLElement;
    expect(fondSurvol).not.toBe("");
    expect(emitted(focalisee, "background-color", " td")).toBe(fondSurvol);
    expect(emitted(rowOf("Adrien"), "background-color", " td")).not.toBe(fondSurvol);
  });
});
