import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Select, type CanopSelectOption } from "../Select";

function renderSelect(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const options: CanopSelectOption[] = [
  { value: "admin", label: "Administrateur" },
  { value: "editor", label: "Éditeur" },
  { value: "viewer" },
];

const optionsWithIcon: CanopSelectOption[] = [
  { value: "admin", label: "Administrateur", icon: <span>★</span> },
  { value: "editor", label: "Éditeur" },
];

function combobox() {
  return screen.getByRole("combobox");
}

async function openList() {
  const user = userEvent.setup();
  await user.click(combobox());
  return user;
}

describe("Select - nom accessible", () => {
  it("expose le libellé visible comme nom accessible du combobox", () => {
    renderSelect(<Select options={options} value="admin" onChange={() => {}} label="Rôle" />);
    expect(screen.getByRole("combobox", { name: "Rôle" })).toBeInTheDocument();
  });

  it("relie le libellé visible au combobox par aria-labelledby", () => {
    renderSelect(<Select options={options} value="admin" onChange={() => {}} label="Rôle" />);
    const labelledBy = combobox().getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)).toHaveTextContent("Rôle");
  });

  it("expose ariaLabel comme nom accessible quand aucun libellé n'est visible", () => {
    renderSelect(
      <Select options={options} value="admin" onChange={() => {}} ariaLabel="Rôle du compte" />,
    );
    expect(screen.getByRole("combobox", { name: "Rôle du compte" })).toBeInTheDocument();
    expect(screen.queryByText("Rôle du compte")).not.toBeInTheDocument();
  });

  it("laisse ariaLabel primer sur le libellé visible", () => {
    renderSelect(
      <Select
        options={options}
        value="admin"
        onChange={() => {}}
        label="Rôle"
        ariaLabel="Rôle du compte"
      />,
    );
    expect(screen.getByRole("combobox", { name: "Rôle du compte" })).toBeInTheDocument();
    expect(combobox()).not.toHaveAttribute("aria-labelledby");
  });

  it("n'invente aucun nom quand ni label ni ariaLabel ne sont fournis", () => {
    renderSelect(<Select options={options} value="admin" onChange={() => {}} />);
    expect(combobox()).not.toHaveAttribute("aria-labelledby");
    expect(combobox()).not.toHaveAttribute("aria-label");
  });

  it("n'affiche aucun libellé au-dessus du champ quand label est absent", () => {
    renderSelect(<Select options={options} value="admin" onChange={() => {}} />);
    expect(screen.queryByText("Rôle")).not.toBeInTheDocument();
  });
});

describe("Select - valeur affichée", () => {
  it("affiche le libellé de l'option sélectionnée", () => {
    renderSelect(<Select options={options} value="admin" onChange={() => {}} label="Rôle" />);
    expect(combobox()).toHaveTextContent("Administrateur");
  });

  it("retombe sur la valeur brute quand l'option n'a pas de libellé", () => {
    renderSelect(<Select options={options} value="viewer" onChange={() => {}} label="Rôle" />);
    expect(combobox()).toHaveTextContent("viewer");
  });

  it("retombe sur la valeur brute quand elle ne figure pas dans les options", () => {
    renderSelect(<Select options={options} value="ghost" onChange={() => {}} label="Rôle" />);
    expect(combobox()).toHaveTextContent("ghost");
  });

  it("affiche le placeholder quand aucune valeur n'est sélectionnée", () => {
    renderSelect(
      <Select options={options} value="" onChange={() => {}} placeholder="Choisir un rôle" />,
    );
    expect(combobox()).toHaveTextContent("Choisir un rôle");
  });

  it("n'affiche aucun texte sans valeur ni placeholder", () => {
    renderSelect(<Select options={options} value="" onChange={() => {}} />);
    expect(combobox().textContent).toBe("");
  });

  it("affiche l'icône de l'option sélectionnée", () => {
    renderSelect(<Select options={optionsWithIcon} value="admin" onChange={() => {}} />);
    expect(screen.getByText("★")).toBeInTheDocument();
  });

  it("n'affiche aucune icône quand l'option n'en porte pas", () => {
    renderSelect(<Select options={optionsWithIcon} value="editor" onChange={() => {}} />);
    expect(screen.queryByText("★")).not.toBeInTheDocument();
  });
});

describe("Select - liste déroulante", () => {
  it("liste toutes les options", async () => {
    renderSelect(<Select options={options} value="admin" onChange={() => {}} label="Rôle" />);
    await openList();
    expect(screen.getAllByRole("option")).toHaveLength(options.length);
  });

  it("ajoute une option de placeholder quand un placeholder est fourni", async () => {
    renderSelect(
      <Select
        options={options}
        value="admin"
        onChange={() => {}}
        placeholder="Choisir un rôle"
        label="Rôle"
      />,
    );
    await openList();
    expect(screen.getAllByRole("option")).toHaveLength(options.length + 1);
  });

  it("affiche la valeur brute dans la liste quand l'option n'a pas de libellé", async () => {
    renderSelect(<Select options={options} value="admin" onChange={() => {}} label="Rôle" />);
    await openList();
    expect(screen.getByRole("option", { name: "viewer" })).toBeInTheDocument();
  });

  it("affiche l'icône de chaque option dans la liste", async () => {
    renderSelect(<Select options={optionsWithIcon} value="editor" onChange={() => {}} />);
    await openList();
    expect(screen.getByRole("option", { name: /Administrateur/ })).toHaveTextContent("★");
  });

  it("appelle onChange avec la valeur choisie", async () => {
    const onChange = vi.fn();
    renderSelect(<Select options={options} value="admin" onChange={onChange} label="Rôle" />);
    const user = await openList();
    await user.click(screen.getByRole("option", { name: "Éditeur" }));
    expect(onChange).toHaveBeenCalledWith("editor");
  });

  it("appelle onChange avec une valeur vide au choix du placeholder", async () => {
    const onChange = vi.fn();
    renderSelect(
      <Select
        options={options}
        value="admin"
        onChange={onChange}
        placeholder="Choisir un rôle"
        label="Rôle"
      />,
    );
    const user = await openList();
    await user.click(screen.getByRole("option", { name: "Choisir un rôle" }));
    expect(onChange).toHaveBeenCalledWith("");
  });
});
