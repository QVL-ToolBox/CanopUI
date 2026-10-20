import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card, StatCard } from "../../../index";
import { declarationsDe } from "../../../test/cssRules";
import {
  espionDeToucheSurDocument,
  fondsDe,
  poser,
  racineDeCarte,
  reglesDe,
} from "../../../test/cardTestKit";
import { mockReducedMotion } from "../../../motion/test/presenceTestKit";

beforeEach(() => {
  mockReducedMotion(false);
});

describe("AC1 - StatCard cliquable", () => {
  it("devient un bouton focusable quand onClick est fourni", () => {
    poser(<StatCard label="Demandes" value="12" onClick={() => undefined} />);
    const carte = screen.getByRole("button");
    expect(carte).toHaveAttribute("tabindex", "0");
    expect(carte).toHaveTextContent("Demandes");
  });

  it("expose le nom accessible donne par ariaLabel", () => {
    poser(
      <StatCard
        label="Demandes"
        value="12"
        ariaLabel="Ouvrir les demandes a traiter"
        onClick={() => undefined}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Ouvrir les demandes a traiter" }),
    ).toBeInTheDocument();
  });

  it("reste un simple affichage sans role ni tabindex sans onClick", () => {
    const { container } = poser(<StatCard label="Demandes" value="12" />);
    const carte = racineDeCarte(container);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(carte).not.toHaveAttribute("role");
    expect(carte).not.toHaveAttribute("tabindex");
  });

  it("appelle onClick une seule fois par clic", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    poser(<StatCard label="Demandes" value="12" onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("appelle onClick une seule fois sur Entree au clavier", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    poser(<StatCard label="Demandes" value="12" onClick={onClick} />);
    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("appelle onClick une seule fois sur Espace et empeche le defilement", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const espion = espionDeToucheSurDocument();
    poser(<StatCard label="Demandes" value="12" onClick={onClick} />);
    await user.tab();
    await user.keyboard(" ");
    espion.retirer();
    expect(onClick).toHaveBeenCalledOnce();
    expect(espion.evenements.find((evenement) => evenement.key === " ")?.defaultPrevented).toBe(
      true,
    );
  });

  it.each(["{Tab}", "a", "{Escape}", "{ArrowDown}", "{Shift}"])(
    "n'appelle pas onClick sur la touche %s",
    async (touche) => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      poser(<StatCard label="Demandes" value="12" onClick={onClick} />);
      await user.tab();
      await user.keyboard(touche);
      expect(onClick).not.toHaveBeenCalled();
    },
  );

  it("affiche un curseur pointeur quand elle est cliquable", () => {
    const { container } = poser(<StatCard label="Demandes" value="12" onClick={() => undefined} />);
    expect(declarationsDe(racineDeCarte(container), "cursor").map((d) => d.valeur)).toContain(
      "pointer",
    );
  });

  it("n'affiche pas de curseur pointeur sans onClick", () => {
    const { container } = poser(<StatCard label="Demandes" value="12" />);
    expect(declarationsDe(racineDeCarte(container), "cursor").map((d) => d.valeur)).not.toContain(
      "pointer",
    );
  });

  it("garde le fond de carte stat une fois cliquable", () => {
    const statique = fondsDe(racineDeCarte(poser(<StatCard label="A" value="1" />).container));
    const cliquable = fondsDe(
      racineDeCarte(poser(<StatCard label="A" value="1" onClick={() => undefined} />).container),
    );
    expect(cliquable).toEqual(statique);
  });

  it("garde le fond stat d'une Card variant stat rendue cliquable", () => {
    const statique = fondsDe(racineDeCarte(poser(<Card variant="stat">A</Card>).container));
    const { container } = poser(
      <Card variant="stat" onClick={() => undefined}>
        A
      </Card>,
    );
    expect(fondsDe(racineDeCarte(container))).toEqual(statique);
    expect(screen.getByRole("button")).toHaveAttribute("tabindex", "0");
  });

  it("n'affiche pas de fleche sur une StatCard cliquable", () => {
    const { container } = poser(<StatCard label="Demandes" value="12" onClick={() => undefined} />);
    expect(container.querySelector(".CanopCard-arrow")).toBeNull();
  });

  it("n'affiche pas de fleche sur une Card stat cliquable meme avec arrow", () => {
    const { container } = poser(
      <Card variant="stat" arrow onClick={() => undefined}>
        A
      </Card>,
    );
    expect(container.querySelector(".CanopCard-arrow")).toBeNull();
  });

  it("ne transforme pas la carte au survol en mouvement reduit", () => {
    mockReducedMotion(true);
    const { container } = poser(<StatCard label="Demandes" value="12" onClick={() => undefined} />);
    const transformsAuSurvol = reglesDe(racineDeCarte(container), "transform").filter((regle) =>
      regle.selecteur.includes(":hover"),
    );
    expect(transformsAuSurvol).toEqual([]);
  });
});
