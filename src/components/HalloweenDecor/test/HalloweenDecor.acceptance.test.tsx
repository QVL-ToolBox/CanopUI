import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HalloweenDecor, Icon } from "../../../index";
import {
  mockMatchMedia,
  renderDecor,
  runningAnimations,
} from "../../../test/halloweenDecorTestKit";

const halloweenIcons = ["ghost", "pumpkin", "bat"] as const;

function decorLayer(container: HTMLElement): HTMLElement {
  const layer = container.querySelector<HTMLElement>('[aria-hidden="true"]');
  if (!layer) throw new Error("calque decoratif introuvable");
  return layer;
}

function decorElementCount(container: HTMLElement): number {
  return decorLayer(container).querySelectorAll("svg").length;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("icones Halloween", () => {
  it.each(halloweenIcons)("rend l'icone %s en outline et en solid", (name) => {
    const { container } = render(
      <>
        <Icon name={name} />
        <Icon name={name} variant="solid" />
      </>,
    );

    const icons = container.querySelectorAll("svg");
    expect(icons).toHaveLength(2);
    icons.forEach((icon) => expect(icon.childElementCount).toBeGreaterThan(0));
  });

  it.each(halloweenIcons)("expose l'icone %s avec un libelle accessible", (name) => {
    render(<Icon name={name} title={`icone ${name}`} />);

    expect(screen.getByRole("img", { name: `icone ${name}` })).toBeInTheDocument();
  });
});

describe("HalloweenDecor — calque decoratif", () => {
  it("masque le calque decoratif aux technologies d'assistance", () => {
    mockMatchMedia(false);
    const { container } = renderDecor(
      <HalloweenDecor>
        <p>contenu</p>
      </HalloweenDecor>,
    );

    expect(decorLayer(container)).toHaveAttribute("aria-hidden", "true");
    expect(decorLayer(container)).not.toContainElement(screen.getByText("contenu"));
  });

  it("rend le calque decoratif transparent aux clics", () => {
    mockMatchMedia(false);
    const { container } = renderDecor(
      <HalloweenDecor>
        <p>contenu</p>
      </HalloweenDecor>,
    );

    expect(decorLayer(container)).toHaveStyle({ pointerEvents: "none" });
  });

  it("rend les enfants accessibles et cliquables", async () => {
    mockMatchMedia(false);
    const onClick = vi.fn();
    const user = userEvent.setup();
    renderDecor(
      <HalloweenDecor>
        <button onClick={onClick}>valider</button>
      </HalloweenDecor>,
    );

    await user.click(screen.getByRole("button", { name: "valider" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("HalloweenDecor — mouvement reduit", () => {
  it("anime le decor hors mouvement reduit", () => {
    mockMatchMedia(false);
    const { container } = renderDecor(<HalloweenDecor />);

    expect(runningAnimations(decorLayer(container)).length).toBeGreaterThan(0);
  });

  it("n'active aucune animation sous prefers-reduced-motion reduce", () => {
    mockMatchMedia(true);
    const { container } = renderDecor(<HalloweenDecor />);

    expect(runningAnimations(decorLayer(container))).toEqual([]);
  });

  it("garde le decor rendu sous prefers-reduced-motion reduce", () => {
    mockMatchMedia(true);
    const { container } = renderDecor(<HalloweenDecor />);

    expect(decorElementCount(container)).toBeGreaterThan(0);
  });
});

describe("HalloweenDecor — densite", () => {
  it("utilise la densite low par defaut", () => {
    mockMatchMedia(false);
    const byDefault = decorElementCount(renderDecor(<HalloweenDecor />).container);
    const low = decorElementCount(renderDecor(<HalloweenDecor density="low" />).container);

    expect(byDefault).toBeGreaterThan(0);
    expect(byDefault).toBe(low);
  });

  it("rend davantage d'elements en densite medium", () => {
    mockMatchMedia(false);
    const low = decorElementCount(renderDecor(<HalloweenDecor density="low" />).container);
    const medium = decorElementCount(renderDecor(<HalloweenDecor density="medium" />).container);

    expect(medium).toBeGreaterThan(low);
  });
});
