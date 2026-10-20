import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, Card, Menu } from "../../../index";
import { espionDeToucheSurDocument, poser, racineDeCarte } from "../../../test/cardTestKit";

function MenuDansActions({ onArchiver }: { onArchiver: () => void }) {
  const [ouvert, setOuvert] = useState(false);
  const ancre = useRef<HTMLSpanElement>(null);
  return (
    <>
      <span ref={ancre}>
        <Button onClick={() => setOuvert(true)}>Plus</Button>
      </span>
      <Menu
        open={ouvert}
        anchorEl={ancre.current}
        onClose={() => setOuvert(false)}
        ariaLabel="Actions de la carte"
        items={[{ label: "Archiver", onClick: onArchiver }]}
      />
    </>
  );
}

describe.each([
  ["interactive", "interactive" as const],
  ["surface cliquable", "surface" as const],
])("AC4 - actions isolees dans une Card %s", (_nom, variant) => {
  function poserCarte(onCarte: () => void, onBouton: () => void) {
    return poser(
      <Card
        variant={variant}
        title="Mise a jour"
        onClick={onCarte}
        actions={<Button onClick={onBouton}>Installer</Button>}
      >
        Corps de la carte
      </Card>,
    );
  }

  it("un clic sur le bouton d'action declenche le bouton et pas la carte", async () => {
    const user = userEvent.setup();
    const onCarte = vi.fn();
    const onBouton = vi.fn();
    poserCarte(onCarte, onBouton);
    await user.click(screen.getByRole("button", { name: "Installer" }));
    expect(onBouton).toHaveBeenCalledOnce();
    expect(onCarte).not.toHaveBeenCalled();
  });

  it.each([
    ["Entree", "{Enter}", "Enter"],
    ["Espace", " ", " "],
  ])(
    "%s sur le bouton d'action declenche le bouton sans preventDefault et pas la carte",
    async (_nomTouche, saisie, cle) => {
      const user = userEvent.setup();
      const onCarte = vi.fn();
      const onBouton = vi.fn();
      poserCarte(onCarte, onBouton);
      screen.getByRole("button", { name: "Installer" }).focus();
      const espion = espionDeToucheSurDocument();
      await user.keyboard(saisie);
      espion.retirer();
      expect(onBouton).toHaveBeenCalledOnce();
      expect(onCarte).not.toHaveBeenCalled();
      expect(espion.evenements.find((evenement) => evenement.key === cle)?.defaultPrevented).toBe(
        false,
      );
    },
  );

  it("un clic dans le contenu declenche la carte", async () => {
    const user = userEvent.setup();
    const onCarte = vi.fn();
    poserCarte(onCarte, vi.fn());
    await user.click(screen.getByText("Corps de la carte"));
    expect(onCarte).toHaveBeenCalledOnce();
  });

  it("un clic dans l'en-tete declenche la carte", async () => {
    const user = userEvent.setup();
    const onCarte = vi.fn();
    poserCarte(onCarte, vi.fn());
    await user.click(screen.getByText("Mise a jour"));
    expect(onCarte).toHaveBeenCalledOnce();
  });

  it("un ecouteur click sur document recoit toujours le clic de l'action", async () => {
    const user = userEvent.setup();
    const surDocument = vi.fn();
    document.addEventListener("click", surDocument);
    poserCarte(vi.fn(), vi.fn());
    await user.click(screen.getByRole("button", { name: "Installer" }));
    document.removeEventListener("click", surDocument);
    expect(surDocument).toHaveBeenCalledOnce();
  });
});

describe("AC4 - menu en portail ouvert depuis actions", () => {
  function poserCarteAvecMenu(onCarte: () => void, onArchiver: () => void) {
    return poser(
      <Card
        variant="interactive"
        title="Dossier"
        onClick={onCarte}
        actions={<MenuDansActions onArchiver={onArchiver} />}
      >
        Corps
      </Card>,
    );
  }

  it("un clic sur un item du menu ne declenche pas la carte", async () => {
    const user = userEvent.setup();
    const onCarte = vi.fn();
    const onArchiver = vi.fn();
    poserCarteAvecMenu(onCarte, onArchiver);
    await user.click(screen.getByRole("button", { name: "Plus" }));
    const item = await screen.findByRole("menuitem", { name: "Archiver" });
    expect(item.closest(".MuiCard-root")).toBeNull();
    await user.click(item);
    expect(onArchiver).toHaveBeenCalledOnce();
    expect(onCarte).not.toHaveBeenCalled();
  });

  it("Entree sur un item du menu ne declenche pas la carte", async () => {
    const user = userEvent.setup();
    const onCarte = vi.fn();
    const onArchiver = vi.fn();
    poserCarteAvecMenu(onCarte, onArchiver);
    await user.click(screen.getByRole("button", { name: "Plus" }));
    (await screen.findByRole("menuitem", { name: "Archiver" })).focus();
    await user.keyboard("{Enter}");
    expect(onArchiver).toHaveBeenCalledOnce();
    expect(onCarte).not.toHaveBeenCalled();
  });
});

describe("Non-regression - Card interactive", () => {
  it("garde la fleche d'une Card interactive", () => {
    const { container } = poser(
      <Card variant="interactive" arrow onClick={() => undefined} data-testid="carte">
        Contenu
      </Card>,
    );
    expect(container.querySelector(".MuiCardHeader-action .CanopCard-arrow")).toBeInTheDocument();
  });

  it.each([
    ["Entree", "{Enter}"],
    ["Espace", " "],
  ])("declenche une Card interactive une fois au clavier avec %s", async (_nom, saisie) => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    poser(
      <Card variant="interactive" onClick={onClick}>
        Contenu
      </Card>,
    );
    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await user.keyboard(saisie);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("n'ajoute ni role ni tabindex a une Card surface sans onClick", () => {
    const { container } = poser(<Card>Contenu</Card>);
    expect(racineDeCarte(container)).not.toHaveAttribute("role");
    expect(racineDeCarte(container)).not.toHaveAttribute("tabindex");
  });
});
