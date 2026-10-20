import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { MultiSelect, type CanopMultiSelectOption } from "../MultiSelect";
import { Icon } from "../../Icon";

function renderSelect(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const options = [{ value: "admin" }, { value: "editor" }, { value: "viewer" }];

const optionsWithIcon: CanopMultiSelectOption[] = [
  { value: "admin", label: "Administrateur", icon: <span>★</span> },
  { value: "editor", label: "Éditeur" },
];

function combobox() {
  return screen.getByRole("combobox");
}

describe("MultiSelect", () => {
  it("affiche les valeurs sélectionnées en puces", () => {
    renderSelect(<MultiSelect options={options} value={["admin"]} onChange={() => {}} />);
    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  it("ajoute une valeur via la liste", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect(<MultiSelect options={options} value={["admin"]} onChange={onChange} />);

    await user.click(combobox());
    await user.click(screen.getByRole("option", { name: /editor/ }));

    expect(onChange).toHaveBeenCalledWith(["admin", "editor"]);
  });

  it("retire une valeur via la puce", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = renderSelect(
      <MultiSelect options={options} value={["admin"]} onChange={onChange} />,
    );

    await user.click(container.querySelector(".MuiChip-deleteIcon")!);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("n'affiche plus une valeur déjà sélectionnée dans la liste", async () => {
    const user = userEvent.setup();
    renderSelect(<MultiSelect options={options} value={["admin"]} onChange={() => {}} />);

    await user.click(combobox());
    expect(screen.queryByRole("option", { name: /admin/ })).not.toBeInTheDocument();
  });
});

describe("MultiSelect - nom accessible", () => {
  it("expose le libellé visible comme nom accessible du combobox", () => {
    renderSelect(<MultiSelect options={options} value={[]} onChange={() => {}} label="Rôles" />);
    expect(screen.getByRole("combobox", { name: "Rôles" })).toBeInTheDocument();
  });

  it("relie le libellé visible au combobox par aria-labelledby", () => {
    renderSelect(<MultiSelect options={options} value={[]} onChange={() => {}} label="Rôles" />);
    const labelledBy = combobox().getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)).toHaveTextContent("Rôles");
  });

  it("expose ariaLabel comme nom accessible quand aucun libellé n'est visible", () => {
    renderSelect(
      <MultiSelect options={options} value={[]} onChange={() => {}} ariaLabel="Rôles du compte" />,
    );
    expect(screen.getByRole("combobox", { name: "Rôles du compte" })).toBeInTheDocument();
    expect(screen.queryByText("Rôles du compte")).not.toBeInTheDocument();
  });

  it("laisse ariaLabel primer sur le libellé visible", () => {
    renderSelect(
      <MultiSelect
        options={options}
        value={[]}
        onChange={() => {}}
        label="Rôles"
        ariaLabel="Rôles du compte"
      />,
    );
    expect(screen.getByRole("combobox", { name: "Rôles du compte" })).toBeInTheDocument();
    expect(combobox()).not.toHaveAttribute("aria-labelledby");
  });

  it("n'invente aucun nom quand ni label ni ariaLabel ne sont fournis", () => {
    renderSelect(<MultiSelect options={options} value={[]} onChange={() => {}} />);
    expect(combobox()).not.toHaveAttribute("aria-labelledby");
    expect(combobox()).not.toHaveAttribute("aria-label");
  });
});

describe("MultiSelect - sélection vide ou complète", () => {
  it("n'affiche aucune puce sans sélection", () => {
    const { container } = renderSelect(
      <MultiSelect options={options} value={[]} onChange={() => {}} />,
    );
    expect(container.querySelectorAll(".MuiChip-root")).toHaveLength(0);
  });

  it("affiche le placeholder dans le champ", () => {
    renderSelect(
      <MultiSelect options={options} value={[]} onChange={() => {}} placeholder="Ajouter" />,
    );
    expect(combobox()).toHaveTextContent("Ajouter");
  });

  it("n'affiche aucun texte dans le champ sans placeholder", () => {
    renderSelect(<MultiSelect options={options} value={[]} onChange={() => {}} />);
    expect(combobox().textContent).toBe("");
  });

  it("propose une entrée désactivée quand toutes les options sont prises", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onChange = vi.fn();
    renderSelect(
      <MultiSelect
        options={options}
        value={["admin", "editor", "viewer"]}
        onChange={onChange}
        placeholder="Ajouter un rôle"
      />,
    );

    await user.click(combobox());
    const entree = screen.getByRole("option", { name: "Ajouter un rôle" });
    expect(entree).toHaveAttribute("aria-disabled", "true");
    await user.click(entree);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("affiche une entrée désactivée vide quand aucun placeholder n'est fourni", async () => {
    const user = userEvent.setup();
    renderSelect(
      <MultiSelect options={options} value={["admin", "editor", "viewer"]} onChange={() => {}} />,
    );

    await user.click(combobox());
    expect(screen.getByRole("option")).toHaveAttribute("aria-disabled", "true");
  });

  it("retombe sur la valeur brute pour une puce absente des options", () => {
    renderSelect(<MultiSelect options={options} value={["ghost"]} onChange={() => {}} />);
    expect(screen.getByText("ghost")).toBeInTheDocument();
  });
});

describe("MultiSelect - icônes d'option", () => {
  it("affiche l'icône de l'option sur sa puce", () => {
    renderSelect(<MultiSelect options={optionsWithIcon} value={["admin"]} onChange={() => {}} />);
    expect(screen.getByText("★")).toBeInTheDocument();
    expect(screen.getByText("Administrateur")).toBeInTheDocument();
  });

  it("n'affiche aucune icône sur la puce d'une option qui n'en porte pas", () => {
    renderSelect(<MultiSelect options={optionsWithIcon} value={["editor"]} onChange={() => {}} />);
    expect(screen.queryByText("★")).not.toBeInTheDocument();
  });

  it("affiche l'icône de l'option dans la liste déroulante", async () => {
    const user = userEvent.setup();
    renderSelect(<MultiSelect options={optionsWithIcon} value={[]} onChange={() => {}} />);

    await user.click(combobox());
    expect(screen.getByRole("option", { name: /Administrateur/ })).toHaveTextContent("★");
  });

  it("aligne l'icone de la puce sur le retrait du texte, pas sur le bord", () => {
    const { container } = renderSelect(
      <MultiSelect options={optionsWithIcon} value={["admin"]} onChange={() => {}} label="Roles" />,
    );
    const icone = container.querySelector(".MuiChip-icon");
    expect(icone).not.toBeNull();
    expect(icone).toHaveStyle({ marginLeft: "0.75rem" });
  });

  it("retire aussi une icone de la librairie, et non seulement un element nu", () => {
    const avecIconeLib: CanopMultiSelectOption[] = [
      { value: "admin", label: "Administrateur", icon: <Icon name="shield" size="xs" /> },
    ];
    const { container } = renderSelect(
      <MultiSelect options={avecIconeLib} value={["admin"]} onChange={() => {}} label="Roles" />,
    );
    const icone = container.querySelector(".MuiChip-icon");
    expect(icone).not.toBeNull();
    expect(icone?.tagName.toLowerCase()).toBe("svg");
    expect(icone).toHaveStyle({ marginLeft: "0.75rem" });
  });

  it("donne le meme retrait a la croix de suppression", () => {
    const { container } = renderSelect(
      <MultiSelect options={optionsWithIcon} value={["admin"]} onChange={() => {}} label="Roles" />,
    );
    expect(container.querySelector(".MuiChip-deleteIcon")).toHaveStyle({
      marginRight: "0.75rem",
    });
  });
});
