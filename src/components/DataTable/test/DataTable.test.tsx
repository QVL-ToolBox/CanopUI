import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { DataTable, type CanopColumn } from "../DataTable";

interface Row {
  id: string;
  email: string;
  age: number;
}

const rows: Row[] = [
  { id: "1", email: "old@x.fr", age: 30 },
  { id: "2", email: "young@x.fr", age: 20 },
];

const columns: CanopColumn<Row>[] = [
  { key: "email", header: "Email" },
  { key: "age", header: "Âge", sortable: true, sortValue: (r) => r.age, align: "right" },
];

function renderTable(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("DataTable", () => {
  it("rend les en-têtes et les lignes", () => {
    renderTable(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("old@x.fr")).toBeInTheDocument();
    expect(screen.getByText("young@x.fr")).toBeInTheDocument();
  });

  it("affiche un indicateur de chargement et aucune ligne", () => {
    renderTable(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} loading />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByText("old@x.fr")).not.toBeInTheDocument();
  });

  it("affiche le message d'état vide", () => {
    renderTable(
      <DataTable
        columns={columns}
        rows={[]}
        getRowKey={(r) => r.id}
        emptyMessage="Aucun utilisateur"
      />,
    );
    expect(screen.getByText("Aucun utilisateur")).toBeInTheDocument();
  });

  it("rend la colonne d'actions et relaie les clics", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderTable(
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        actions={(row) => <button onClick={() => onClick(row.id)}>Éditer {row.email}</button>}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Éditer young@x.fr" }));
    expect(onClick).toHaveBeenCalledWith("2");
  });

  it("trie au clic sur un en-tête triable (asc puis desc)", async () => {
    const user = userEvent.setup();
    renderTable(<DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} />);

    await user.click(screen.getByText("Âge"));
    const asc = screen.getAllByRole("row").slice(1);
    expect(within(asc[0]).getByText("young@x.fr")).toBeInTheDocument();

    await user.click(screen.getByText("Âge"));
    const desc = screen.getAllByRole("row").slice(1);
    expect(within(desc[0]).getByText("old@x.fr")).toBeInTheDocument();
  });
});
