import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { DataTable, type CanopColumn, type CanopDataTableProps } from "../DataTable";
import { useRowSelection } from "../useRowSelection";

interface Person {
  id: string;
  name: string;
}

const people: Person[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Carol" },
  { id: "4", name: "Dave" },
];

const columns: CanopColumn<Person>[] = [{ key: "name", header: "Nom" }];

const selectAllLabel = "Tout sélectionner";
const selectRowLabel = "Sélectionner la ligne";
const doubleClickGraceMs = 220;

type Pointer = ReturnType<typeof userEvent.setup>;

const tableElement = (props: Partial<CanopDataTableProps<Person>> = {}) => (
  <CanopThemeProvider>
    <DataTable
      columns={columns}
      rows={people}
      getRowKey={(person) => person.id}
      selectable
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

const rowOf = (name: string) => screen.getByText(name).closest("tr") as HTMLTableRowElement;

const scrollContainer = () => screen.getByRole("table").parentElement as HTMLElement;

const overlayCount = () => (scrollContainer().parentElement as HTMLElement).childElementCount - 1;

function expectSelection(names: string[]) {
  people.forEach((person) => {
    expect(rowOf(person.name)).toHaveAttribute(
      "aria-selected",
      names.includes(person.name) ? "true" : "false",
    );
  });
}

async function clickWithModifiers(pointer: Pointer, target: Element, modifiers: string[]) {
  for (const modifier of modifiers) await pointer.keyboard(`{${modifier}>}`);
  await pointer.click(target);
  for (const modifier of [...modifiers].reverse()) await pointer.keyboard(`{/${modifier}}`);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function stubRowBounds() {
  Object.defineProperty(HTMLTableRowElement.prototype, "getBoundingClientRect", {
    configurable: true,
    writable: true,
    value(this: HTMLTableRowElement) {
      const key = this.getAttribute("data-rowkey");
      const index = key ? Number(key) - 1 : -1;
      const top = index * 100;
      return {
        top,
        bottom: top + 50,
        left: 0,
        right: 200,
        x: 0,
        y: top,
        width: 200,
        height: 50,
        toJSON: () => ({}),
      } as DOMRect;
    },
  });
}

function restoreRowBounds() {
  delete (HTMLTableRowElement.prototype as unknown as Record<string, unknown>)
    .getBoundingClientRect;
}

describe("useRowSelection — sélection non contrôlée à la souris", () => {
  it("sélectionne une seule ligne au clic simple", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Bob"));

    expectSelection(["Bob"]);
  });

  it("remplace la sélection au clic simple sur une autre ligne", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Bob"));
    await pointer.click(rowOf("Dave"));

    expectSelection(["Dave"]);
  });

  it("ajoute une ligne à la sélection au Ctrl+clic", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Alice"));
    await clickWithModifiers(pointer, rowOf("Carol"), ["Control"]);

    expectSelection(["Alice", "Carol"]);
  });

  it("retire une ligne déjà sélectionnée au Ctrl+clic", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Alice"));
    await clickWithModifiers(pointer, rowOf("Carol"), ["Control"]);
    await clickWithModifiers(pointer, rowOf("Alice"), ["Control"]);

    expectSelection(["Carol"]);
  });

  it("traite Cmd+clic comme Ctrl+clic", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Alice"));
    await clickWithModifiers(pointer, rowOf("Dave"), ["Meta"]);

    expectSelection(["Alice", "Dave"]);
  });

  it("étend la sélection depuis l'ancre au Ctrl+Maj+clic", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await clickWithModifiers(pointer, rowOf("Alice"), ["Control"]);
    await clickWithModifiers(pointer, rowOf("Carol"), ["Control", "Shift"]);

    expectSelection(["Alice", "Bob", "Carol"]);
  });

  it("étend la sélection vers le haut quand la plage est inversée", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await clickWithModifiers(pointer, rowOf("Carol"), ["Control"]);
    await clickWithModifiers(pointer, rowOf("Alice"), ["Control", "Shift"]);

    expectSelection(["Alice", "Bob", "Carol"]);
  });

  it("déplace l'ancre au Ctrl+clic et étend depuis la nouvelle ancre", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await clickWithModifiers(pointer, rowOf("Alice"), ["Control"]);
    await clickWithModifiers(pointer, rowOf("Carol"), ["Control"]);
    await clickWithModifiers(pointer, rowOf("Dave"), ["Control", "Shift"]);

    expectSelection(["Alice", "Carol", "Dave"]);
  });

  it("réduit la plage à la ligne elle-même quand l'ancre est la ligne cliquée", async () => {
    const pointer = userEvent.setup();
    renderTable({ rows: [people[0]] });

    await clickWithModifiers(pointer, rowOf("Alice"), ["Control"]);
    await clickWithModifiers(pointer, rowOf("Alice"), ["Control", "Shift"]);

    expect(rowOf("Alice")).toHaveAttribute("aria-selected", "true");
  });

  it("sélectionne la plage entre l'ancre et la ligne cliquée au Maj+clic", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Alice"));
    await clickWithModifiers(pointer, rowOf("Carol"), ["Shift"]);

    expectSelection(["Alice", "Bob", "Carol"]);
  });

  it("sélectionne uniquement la ligne cliquée au Maj+clic sans ancre", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await clickWithModifiers(pointer, rowOf("Carol"), ["Shift"]);

    expectSelection(["Carol"]);
  });

  it("ignore le clic quand il vise un enfant interactif de la ligne", async () => {
    const pointer = userEvent.setup();
    renderTable({ actions: (person) => <button>Éditer {person.name}</button> });

    await pointer.click(rowOf("Alice"));
    await pointer.click(screen.getByRole("button", { name: "Éditer Bob" }));

    expectSelection(["Alice"]);
  });

  it("ne rend pas la ligne sélectionnable quand selectable est faux", async () => {
    const pointer = userEvent.setup();
    renderTable({ selectable: false });

    await pointer.click(rowOf("Bob"));

    expect(rowOf("Bob")).not.toHaveAttribute("aria-selected");
    expect(rowOf("Bob")).not.toHaveAttribute("tabindex");
  });
});

describe("useRowSelection — double-clic", () => {
  it("diffère la sélection au clic simple quand un double-clic est possible", async () => {
    const pointer = userEvent.setup();
    renderTable({ onRowDoubleClick: vi.fn() });

    await pointer.click(rowOf("Bob"));

    expect(rowOf("Bob")).toHaveAttribute("aria-selected", "false");
    await waitFor(() => expect(rowOf("Bob")).toHaveAttribute("aria-selected", "true"));
  });

  it("annule la sélection différée et notifie au double-clic", async () => {
    const pointer = userEvent.setup();
    const onRowDoubleClick = vi.fn();
    renderTable({ onRowDoubleClick });

    await pointer.dblClick(rowOf("Bob"));
    await wait(doubleClickGraceMs + 80);

    expect(onRowDoubleClick).toHaveBeenCalledWith(people[1]);
    expectSelection([]);
  });

  it("n'expose pas de gestionnaire de double-clic sans onRowDoubleClick", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.dblClick(rowOf("Bob"));

    expectSelection(["Bob"]);
  });

  it("annule la sélection différée quand le tableau est démonté", async () => {
    const pointer = userEvent.setup();
    const onSelectionChange = vi.fn();
    const view = renderTable({ onRowDoubleClick: vi.fn(), onSelectionChange });

    await pointer.click(rowOf("Bob"));
    const notificationsAvantDemontage = onSelectionChange.mock.calls.length;
    view.unmount();
    await wait(doubleClickGraceMs + 80);

    expect(onSelectionChange.mock.calls).toHaveLength(notificationsAvantDemontage);
  });
});

describe("useRowSelection — colonne de cases à cocher", () => {
  it("masque la colonne tant qu'aucune ligne n'est sélectionnée", async () => {
    const pointer = userEvent.setup();
    renderTable();

    expect(screen.queryByRole("checkbox", { name: selectAllLabel })).not.toBeInTheDocument();

    await pointer.click(rowOf("Alice"));

    expect(screen.getByRole("checkbox", { name: selectAllLabel })).toBeInTheDocument();
  });

  it("bascule la sélection d'une ligne via sa case à cocher", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Alice"));
    const boxes = screen.getAllByRole("checkbox", { name: selectRowLabel });
    await pointer.click(boxes[1]);

    expectSelection(["Alice", "Bob"]);
  });

  it("décoche une ligne via sa case à cocher", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Alice"));
    await pointer.click(screen.getAllByRole("checkbox", { name: selectRowLabel })[0]);

    expect(screen.queryByRole("checkbox", { name: selectAllLabel })).not.toBeInTheDocument();
    expectSelection([]);
  });

  it("affiche l'état indéterminé quand seules certaines lignes sont sélectionnées", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Alice"));

    expect(screen.getByRole("checkbox", { name: selectAllLabel })).toHaveAttribute(
      "data-indeterminate",
      "true",
    );
  });

  it("sélectionne puis désélectionne toutes les lignes via l'en-tête", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Alice"));
    await pointer.click(screen.getByRole("checkbox", { name: selectAllLabel }));

    expectSelection(["Alice", "Bob", "Carol", "Dave"]);
    expect(screen.getByRole("checkbox", { name: selectAllLabel })).toBeChecked();

    await pointer.click(screen.getByRole("checkbox", { name: selectAllLabel }));

    expect(screen.queryByRole("checkbox", { name: selectAllLabel })).not.toBeInTheDocument();
  });

  it("ne coche pas l'en-tête quand la liste est vide", () => {
    renderTable({ rows: [], selectedKeys: ["1"] });

    const header = screen.getByRole("checkbox", { name: selectAllLabel });
    expect(header).not.toBeChecked();
    expect(header).toHaveAttribute("data-indeterminate", "false");
  });
});

describe("useRowSelection — sélection contrôlée", () => {
  it("reflète les clés fournies sans état interne", () => {
    renderTable({ selectedKeys: ["2", "4"] });

    expectSelection(["Bob", "Dave"]);
  });

  it("notifie le changement sans muter l'affichage", async () => {
    const pointer = userEvent.setup();
    const onSelectionChange = vi.fn();
    const view = renderTable({ selectedKeys: ["2"], onSelectionChange });

    await pointer.click(rowOf("Carol"));

    expect(onSelectionChange.mock.calls.at(-1)?.[0]).toEqual(["3"]);
    expectSelection(["Bob"]);

    view.rerenderTable({ selectedKeys: ["2"], onSelectionChange });

    expectSelection(["Bob"]);
  });

  it("reste vide quand les clés contrôlées restent vides", async () => {
    const pointer = userEvent.setup();
    renderTable({ selectedKeys: [] });

    await pointer.click(rowOf("Carol"));

    expectSelection([]);
  });

  it("ignore une clé contrôlée absente des lignes", () => {
    renderTable({ selectedKeys: ["999"] });

    expect(screen.getByRole("checkbox", { name: selectAllLabel })).toBeInTheDocument();
    expectSelection([]);
  });

  it("propage la sélection totale demandée par l'en-tête", async () => {
    const pointer = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderTable({ selectedKeys: ["1"], onSelectionChange });

    await pointer.click(screen.getByRole("checkbox", { name: selectAllLabel }));

    expect(onSelectionChange).toHaveBeenCalledWith(["1", "2", "3", "4"]);
  });

  it("propage la désélection totale quand tout est déjà sélectionné", async () => {
    const pointer = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderTable({ selectedKeys: ["1", "2", "3", "4"], onSelectionChange });

    await pointer.click(screen.getByRole("checkbox", { name: selectAllLabel }));

    expect(onSelectionChange).toHaveBeenCalledWith([]);
  });
});

describe("useRowSelection — clavier", () => {
  it("bascule la sélection de la ligne avec la barre d'espace", () => {
    renderTable();

    fireEvent.keyDown(rowOf("Bob"), { key: " " });

    expectSelection(["Bob"]);
  });

  it("désélectionne la ligne avec un second appui sur la barre d'espace", () => {
    renderTable();

    fireEvent.keyDown(rowOf("Bob"), { key: " " });
    fireEvent.keyDown(rowOf("Bob"), { key: " " });

    expectSelection([]);
  });

  it("déplace le focus vers la ligne suivante avec la flèche bas", () => {
    renderTable();

    fireEvent.keyDown(rowOf("Alice"), { key: "ArrowDown" });

    expect(rowOf("Bob")).toHaveFocus();
  });

  it("reste sur la dernière ligne quand la flèche bas dépasse la fin", () => {
    renderTable();

    fireEvent.keyDown(rowOf("Dave"), { key: "ArrowDown" });

    expect(rowOf("Dave")).toHaveFocus();
  });

  it("reste sur la première ligne quand la flèche haut dépasse le début", () => {
    renderTable();

    fireEvent.keyDown(rowOf("Alice"), { key: "ArrowUp" });

    expect(rowOf("Alice")).toHaveFocus();
  });

  it("remonte d'une ligne avec la flèche haut", () => {
    renderTable();

    fireEvent.keyDown(rowOf("Carol"), { key: "ArrowUp" });

    expect(rowOf("Bob")).toHaveFocus();
  });

  it("étend la sélection depuis la ligne courante avec Maj+flèche bas sans ancre", () => {
    renderTable();

    fireEvent.keyDown(rowOf("Alice"), { key: "ArrowDown", shiftKey: true });

    expectSelection(["Alice", "Bob"]);
  });

  it("étend la sélection depuis l'ancre avec Maj+flèche bas", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Alice"));
    fireEvent.keyDown(rowOf("Carol"), { key: "ArrowDown", shiftKey: true });

    expectSelection(["Alice", "Bob", "Carol", "Dave"]);
  });

  it("étend la sélection vers le haut avec Maj+flèche haut", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Dave"));
    fireEvent.keyDown(rowOf("Carol"), { key: "ArrowUp", shiftKey: true });

    expectSelection(["Bob", "Carol", "Dave"]);
  });

  it("sélectionne la ligne avec Entrée quand aucune activation n'est fournie", () => {
    renderTable();

    fireEvent.keyDown(rowOf("Carol"), { key: "Enter" });

    expectSelection(["Carol"]);
  });

  it("appelle onRowActivate avec Entrée", () => {
    const onRowActivate = vi.fn();
    renderTable({ onRowActivate });

    fireEvent.keyDown(rowOf("Carol"), { key: "Enter" });

    expect(onRowActivate).toHaveBeenCalledWith(people[2]);
    expectSelection([]);
  });

  it("retombe sur onRowDoubleClick avec Entrée quand onRowActivate est absent", () => {
    const onRowDoubleClick = vi.fn();
    renderTable({ onRowDoubleClick });

    fireEvent.keyDown(rowOf("Carol"), { key: "Enter" });

    expect(onRowDoubleClick).toHaveBeenCalledWith(people[2]);
  });

  it("ignore les touches non gérées", () => {
    renderTable();

    fireEvent.keyDown(rowOf("Carol"), { key: "a" });

    expectSelection([]);
  });

  it("ignore les touches émises par un enfant de la ligne", () => {
    renderTable({ actions: (person) => <button>Éditer {person.name}</button> });

    fireEvent.keyDown(screen.getByRole("button", { name: "Éditer Carol" }), { key: " " });

    expectSelection([]);
  });
});

describe("useRowSelection — ordre de tabulation", () => {
  it("rend la première ligne tabulable par défaut", () => {
    renderTable();

    expect(rowOf("Alice")).toHaveAttribute("tabindex", "0");
    expect(rowOf("Bob")).toHaveAttribute("tabindex", "-1");
  });

  it("rend la première ligne sélectionnée tabulable", () => {
    renderTable({ selectedKeys: ["3"] });

    expect(rowOf("Carol")).toHaveAttribute("tabindex", "0");
    expect(rowOf("Alice")).toHaveAttribute("tabindex", "-1");
  });

  it("suit la ligne focalisée", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Bob"));

    expect(rowOf("Bob")).toHaveAttribute("tabindex", "0");
    expect(rowOf("Alice")).toHaveAttribute("tabindex", "-1");
  });

  it("revient à la première ligne quand la ligne focalisée disparaît", async () => {
    const pointer = userEvent.setup();
    const view = renderTable();

    await pointer.click(rowOf("Dave"));
    view.rerenderTable({ rows: people.slice(0, 2) });

    expect(rowOf("Alice")).toHaveAttribute("tabindex", "0");
  });
});

describe("useRowSelection — cadre de sélection", () => {
  beforeEach(stubRowBounds);
  afterEach(restoreRowBounds);

  it("sélectionne les lignes traversées par le cadre", () => {
    renderTable();

    fireEvent.mouseDown(scrollContainer(), { button: 0, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(window, { clientX: 60, clientY: 120 });

    expectSelection(["Alice", "Bob"]);
  });

  it("affiche puis retire le cadre pendant le glissement", () => {
    renderTable();

    expect(overlayCount()).toBe(0);

    fireEvent.mouseDown(scrollContainer(), { button: 0, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(window, { clientX: 60, clientY: 120 });

    expect(overlayCount()).toBe(1);

    fireEvent.mouseUp(window);

    expect(overlayCount()).toBe(0);
  });

  it("efface la sélection sur un clic sans déplacement", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Dave"));
    fireEvent.mouseDown(scrollContainer(), { button: 0, clientX: 10, clientY: 400 });
    fireEvent.mouseUp(window);

    expectSelection([]);
    expect(overlayCount()).toBe(0);
  });

  it("conserve la sélection existante quand le cadre est additif", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await clickWithModifiers(pointer, rowOf("Dave"), ["Control"]);
    fireEvent.mouseDown(scrollContainer(), {
      button: 0,
      ctrlKey: true,
      clientX: 10,
      clientY: 10,
    });
    fireEvent.mouseMove(window, { clientX: 60, clientY: 120, ctrlKey: true });

    expectSelection(["Alice", "Bob", "Dave"]);
  });

  it("sélectionne les lignes traversées quand le cadre démarre avec Maj", () => {
    renderTable();

    fireEvent.mouseDown(scrollContainer(), {
      button: 0,
      shiftKey: true,
      clientX: 10,
      clientY: 10,
    });
    fireEvent.mouseMove(window, { clientX: 60, clientY: 120 });

    expectSelection(["Alice", "Bob"]);
  });

  it("remplace la sélection existante quand le cadre n'est pas additif", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await clickWithModifiers(pointer, rowOf("Dave"), ["Control"]);
    fireEvent.mouseDown(scrollContainer(), { button: 0, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(window, { clientX: 60, clientY: 120 });

    expectSelection(["Alice", "Bob"]);
  });

  it("ignore le bouton droit", async () => {
    const pointer = userEvent.setup();
    renderTable();

    await pointer.click(rowOf("Dave"));
    fireEvent.mouseDown(scrollContainer(), { button: 2, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(window, { clientX: 60, clientY: 120 });

    expectSelection(["Dave"]);
  });

  it("ignore un appui démarré sur un élément interactif", async () => {
    const pointer = userEvent.setup();
    renderTable({ actions: (person) => <button>Éditer {person.name}</button> });

    await pointer.click(rowOf("Dave"));
    fireEvent.mouseDown(screen.getByRole("button", { name: "Éditer Alice" }), {
      button: 0,
      clientX: 10,
      clientY: 10,
    });
    fireEvent.mouseMove(window, { clientX: 60, clientY: 120 });

    expect(overlayCount()).toBe(0);
    expect(rowOf("Dave")).toHaveAttribute("aria-selected", "true");
  });

  it("ne démarre pas de cadre quand selectable est faux", () => {
    renderTable({ selectable: false });

    fireEvent.mouseDown(scrollContainer(), { button: 0, clientX: 10, clientY: 10 });
    fireEvent.mouseMove(window, { clientX: 60, clientY: 120 });

    expect(overlayCount()).toBe(0);
  });

  it("ne sélectionne aucune ligne quand le cadre n'en traverse aucune", () => {
    renderTable();

    fireEvent.mouseDown(scrollContainer(), { button: 0, clientX: 10, clientY: 700 });
    fireEvent.mouseMove(window, { clientX: 60, clientY: 800 });

    expectSelection([]);
  });

  it("cesse de suivre la souris après la fin du glissement", () => {
    renderTable();

    fireEvent.mouseDown(scrollContainer(), { button: 0, clientX: 10, clientY: 10 });
    fireEvent.mouseUp(window);
    fireEvent.mouseMove(window, { clientX: 60, clientY: 320 });

    expectSelection([]);
  });
});

interface ProbeProps {
  selectable: boolean;
  onSelectionChange?: (keys: string[]) => void;
}

function SelectionProbe({ selectable, onSelectionChange }: ProbeProps) {
  const { bodyRef, handleMarqueeMouseDown, handleRowKeyDown, handleRowFocus, rowTabIndex } =
    useRowSelection<Person>({
      selectable,
      rows: people,
      getRowKey: (person) => person.id,
      onSelectionChange,
    });

  return (
    <table>
      <tbody ref={bodyRef} onMouseDown={handleMarqueeMouseDown}>
        {people.map((person, index) => (
          <tr
            key={person.id}
            data-rowkey={person.id}
            tabIndex={rowTabIndex(index)}
            onFocus={() => handleRowFocus(index)}
            onKeyDown={(event) => handleRowKeyDown(event, index)}
          >
            <td>{person.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

describe("useRowSelection — sélection désactivée", () => {
  it("n'attribue aucun ordre de tabulation aux lignes", () => {
    render(<SelectionProbe selectable={false} />);

    expect(screen.getByText("Alice").closest("tr")).not.toHaveAttribute("tabindex");
  });

  it("ignore les raccourcis clavier de sélection", () => {
    const onSelectionChange = vi.fn();
    render(<SelectionProbe selectable={false} onSelectionChange={onSelectionChange} />);

    fireEvent.keyDown(screen.getByText("Alice").closest("tr") as HTMLElement, { key: " " });

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("ignore l'appui souris du cadre", () => {
    const onSelectionChange = vi.fn();
    render(<SelectionProbe selectable={false} onSelectionChange={onSelectionChange} />);

    fireEvent.mouseDown(screen.getByText("Alice").closest("tbody") as HTMLElement, {
      button: 0,
      clientX: 0,
      clientY: 0,
    });

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("accepte le focus d'une ligne sans rappel onRowFocus", () => {
    render(<SelectionProbe selectable />);

    const row = screen.getByText("Bob").closest("tr") as HTMLElement;
    fireEvent.focus(row);

    expect(row).toHaveAttribute("tabindex", "0");
  });
});
