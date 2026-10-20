import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { DataTable, type CanopColumn } from "../DataTable";

interface Row {
  id: string;
  email: string;
}

const rows: Row[] = [
  { id: "1", email: "un@x.fr" },
  { id: "2", email: "deux@x.fr" },
];

const columns: CanopColumn<Row>[] = [{ key: "email", header: "Email" }];

function renderTable(ui: ReactNode, locale: "fr" | "en" = "fr") {
  return render(
    <CanopI18nProvider locale={locale}>
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function ligne(email: string): HTMLElement {
  return screen.getByText(email).closest("tr") as HTMLElement;
}

describe("DataTable — edition", () => {
  it("n'ajoute aucune action sans editable", () => {
    renderTable(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} />);
    expect(screen.queryByRole("button", { name: "Modifier la ligne" })).not.toBeInTheDocument();
  });

  it("ajoute une action d'edition par ligne", () => {
    renderTable(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} editable />);
    expect(screen.getAllByRole("button", { name: "Modifier la ligne" })).toHaveLength(2);
  });

  it("remonte la ligne editee au clic", async () => {
    const user = userEvent.setup();
    const onRowEdit = vi.fn();
    renderTable(
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        editable
        onRowEdit={onRowEdit}
      />,
    );
    await user.click(within(ligne("deux@x.fr")).getByRole("button", { name: "Modifier la ligne" }));
    expect(onRowEdit).toHaveBeenCalledOnce();
    expect(onRowEdit).toHaveBeenCalledWith(rows[1]);
  });

  it("traduit le nom accessible de l'action", () => {
    renderTable(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} editable />, "en");
    expect(screen.getAllByRole("button", { name: "Edit row" })).toHaveLength(2);
  });

  it("accepte un nom accessible impose", () => {
    renderTable(
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        editable
        editLabel="Corriger"
      />,
    );
    expect(screen.getAllByRole("button", { name: "Corriger" })).toHaveLength(2);
  });

  it("desactive l'action sur les lignes que canEditRow refuse", () => {
    renderTable(
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        editable
        canEditRow={(row) => row.id === "1"}
      />,
    );
    expect(
      within(ligne("un@x.fr")).getByRole("button", { name: "Modifier la ligne" }),
    ).not.toBeDisabled();
    expect(
      within(ligne("deux@x.fr")).getByRole("button", { name: "Modifier la ligne" }),
    ).toBeDisabled();
  });

  it("place l'edition apres les actions du portail, au bout de la ligne", () => {
    renderTable(
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        editable
        actions={(row) => <button type="button">Voir {row.id}</button>}
      />,
    );
    const boutons = within(ligne("un@x.fr")).getAllByRole("button");
    expect(
      boutons.map((bouton) => bouton.getAttribute("aria-label") ?? bouton.textContent),
    ).toEqual(["Voir 1", "Modifier la ligne"]);
  });

  it("ouvre la colonne de fin meme sans actions du portail", () => {
    const { container } = renderTable(
      <DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} editable />,
    );
    const enTetes = container.querySelectorAll("thead th");
    const cellules = within(ligne("un@x.fr")).getAllByRole("cell");
    expect(enTetes).toHaveLength(cellules.length);
  });

  it("porte l'ombre des lignes en drop-shadow, jamais en box-shadow", () => {
    renderTable(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} />);
    const style = getComputedStyle(ligne("un@x.fr"));
    expect(style.boxShadow).toBe("");
    expect(style.filter).toContain("drop-shadow");
  });

  it("peint la surface d'une ligne en une seule fois, jamais cellule par cellule", () => {
    renderTable(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} editable />);
    const rangee = ligne("un@x.fr");
    expect(getComputedStyle(rangee).isolation).toBe("isolate");
    for (const cellule of within(rangee).getAllByRole("cell")) {
      expect(getComputedStyle(cellule).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    }
  });
});
