import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CanopI18nProvider,
  CanopThemeProvider,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandOption,
  CommandPalette,
  type CanopCommandOptionProps,
} from "../../../index";

const defilement = vi.fn();

beforeEach(() => {
  defilement.mockClear();
  Object.defineProperty(Element.prototype, "scrollIntoView", {
    configurable: true,
    writable: true,
    value: defilement,
  });
});

afterEach(() => {
  Reflect.deleteProperty(Element.prototype, "scrollIntoView");
});

function poser(ui: ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function option(props: Partial<CanopCommandOptionProps> & { id: string }) {
  return (
    <CommandOption
      label={props.id}
      active={false}
      onHighlight={() => undefined}
      onSelect={() => undefined}
      {...props}
    />
  );
}

function liste(contenu: ReactElement) {
  return (
    <CommandList id="resultats" ariaLabel="Résultats">
      {contenu}
    </CommandList>
  );
}

describe("AC8 CommandList", () => {
  it("expose une liste nommée qui contient les options", () => {
    poser(liste(<CommandGroup>{option({ id: "ouvrir" })}</CommandGroup>));
    const listbox = screen.getByRole("listbox", { name: "Résultats" });
    expect(listbox).toHaveAttribute("id", "resultats");
    expect(within(listbox).getByRole("option", { name: "ouvrir" })).toBeInTheDocument();
  });
});

describe("AC8 CommandGroup", () => {
  it("nomme le groupe par son libellé", () => {
    poser(
      liste(
        <CommandGroup label="Fichier">
          {option({ id: "ouvrir" })}
          {option({ id: "fermer" })}
        </CommandGroup>,
      ),
    );
    const groupe = screen.getByRole("group", { name: "Fichier" });
    const intertitre = document.getElementById(groupe.getAttribute("aria-labelledby") ?? "");
    expect(intertitre).toHaveTextContent("Fichier");
    expect(within(groupe).getAllByRole("option")).toHaveLength(2);
  });

  it("n'expose pas de groupe nommé sans libellé", () => {
    poser(liste(<CommandGroup>{option({ id: "ouvrir" })}</CommandGroup>));
    expect(
      screen.queryAllByRole("group").filter((groupe) => groupe.hasAttribute("aria-labelledby")),
    ).toEqual([]);
    expect(screen.getByRole("option", { name: "ouvrir" })).toBeInTheDocument();
  });
});

describe("AC8 CommandOption", () => {
  it("accepte un libellé riche", () => {
    poser(
      liste(
        option({
          id: "rapport",
          label: (
            <span>
              Rapport <mark>annuel</mark>
            </span>
          ),
        }),
      ),
    );
    const choix = screen.getByRole("option", { name: "Rapport annuel" });
    expect(within(choix).getByText("annuel").tagName).toBe("MARK");
  });

  it("marque l'option active et la fait défiler jusqu'à elle", () => {
    poser(
      liste(
        <>
          {option({ id: "premier" })}
          {option({ id: "second", active: true })}
        </>,
      ),
    );
    const active = screen.getByRole("option", { name: "second" });
    expect(active).toHaveAttribute("aria-selected", "true");
    expect(defilement).toHaveBeenCalled();
    expect(defilement.mock.contexts).toContain(active);
    expect(defilement.mock.contexts).not.toContain(screen.getByRole("option", { name: "premier" }));
  });

  it("ne fait défiler aucune option inactive", () => {
    poser(liste(option({ id: "seul" })));
    expect(defilement).not.toHaveBeenCalled();
  });

  it("appelle onSelect au clic", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    poser(liste(option({ id: "ouvrir", onSelect })));
    await user.click(screen.getByRole("option", { name: "ouvrir" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("appelle onHighlight au survol", async () => {
    const user = userEvent.setup();
    const onHighlight = vi.fn();
    poser(liste(option({ id: "ouvrir", onHighlight })));
    await user.hover(screen.getByRole("option", { name: "ouvrir" }));
    expect(onHighlight).toHaveBeenCalled();
  });

  it("affiche la méta de l'option", () => {
    poser(liste(option({ id: "ouvrir", meta: "Ctrl+O" })));
    expect(
      within(screen.getByRole("option", { name: /ouvrir/ })).getByText("Ctrl+O"),
    ).toBeInTheDocument();
  });
});

describe("AC8 CommandEmpty", () => {
  it("annonce l'absence de résultat", () => {
    poser(<CommandEmpty>Aucun résultat</CommandEmpty>);
    expect(screen.getByRole("status")).toHaveTextContent("Aucun résultat");
  });

  it("n'annonce rien avec announce false", () => {
    poser(<CommandEmpty announce={false}>Aucun résultat</CommandEmpty>);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("Aucun résultat")).toBeInTheDocument();
  });
});

describe("AC8 CommandPalette bâtie sur la liste de palette", () => {
  const items = [
    { id: "ouvrir", label: "Ouvrir", group: "Fichier" },
    { id: "profil", label: "Profil", group: "Compte" },
  ];

  it("range les commandes dans des groupes nommés", () => {
    poser(<CommandPalette open onClose={() => undefined} items={items} />);
    expect(
      within(screen.getByRole("group", { name: "Fichier" })).getByRole("option", {
        name: /Ouvrir/,
      }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("group", { name: "Compte" })).getByRole("option", {
        name: /Profil/,
      }),
    ).toBeInTheDocument();
  });

  it("annonce l'absence de résultat", async () => {
    const user = userEvent.setup();
    poser(<CommandPalette open onClose={() => undefined} items={items} emptyLabel="Rien trouvé" />);
    await user.type(screen.getByRole("combobox"), "zzzz");
    expect(await screen.findByRole("status")).toHaveTextContent("Rien trouvé");
  });
});
