import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Carousel } from "../Carousel";

const PREVIOUS = "Élément précédent";
const NEXT = "Élément suivant";

function mockMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function cards(count: number) {
  return Array.from({ length: count }, (_, index) => <p key={index}>Carte {index + 1}</p>);
}

function renderCarousel(count: number, visibleCount?: number) {
  const view = render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>
        <Carousel ariaLabel="Offres" visibleCount={visibleCount}>
          {cards(count)}
        </Carousel>
      </CanopThemeProvider>
    </CanopI18nProvider>,
  );
  return { ...view, viewport: screen.getByRole("region", { name: "Offres" }) };
}

function visibleCards(): number[] {
  return Array.from(document.querySelectorAll("p"))
    .filter((card) => !card.closest('[aria-hidden="true"]'))
    .map((card) => Number(card.textContent?.replace("Carte ", "")));
}

function previousArrow() {
  return screen.queryByRole("button", { name: PREVIOUS });
}

function nextArrow() {
  return screen.queryByRole("button", { name: NEXT });
}

function press(target: HTMLElement, key: string) {
  act(() => {
    target.focus();
  });
  fireEvent.keyDown(target, { key });
}

beforeEach(() => {
  mockMatchMedia();
});

describe("Carousel - visibleCount 3 sur 5 cartes", () => {
  it("montre les cartes 1 à 3 au départ", () => {
    renderCarousel(5, 3);
    expect(visibleCards()).toEqual([1, 2, 3]);
  });

  it("désactive la flèche précédente au début", () => {
    renderCarousel(5, 3);
    expect(previousArrow()).toBeDisabled();
    expect(nextArrow()).toBeEnabled();
  });

  it("avance d'une carte : 2 à 4 puis 3 à 5", () => {
    renderCarousel(5, 3);
    fireEvent.click(nextArrow() as HTMLElement);
    expect(visibleCards()).toEqual([2, 3, 4]);
    fireEvent.click(nextArrow() as HTMLElement);
    expect(visibleCards()).toEqual([3, 4, 5]);
  });

  it("désactive la flèche suivante à la fin", () => {
    renderCarousel(5, 3);
    fireEvent.click(nextArrow() as HTMLElement);
    fireEvent.click(nextArrow() as HTMLElement);
    expect(nextArrow()).toBeDisabled();
    expect(previousArrow()).toBeEnabled();
  });

  it("ne dépasse pas la fin quand on insiste", () => {
    renderCarousel(5, 3);
    fireEvent.click(nextArrow() as HTMLElement);
    fireEvent.click(nextArrow() as HTMLElement);
    fireEvent.click(nextArrow() as HTMLElement);
    expect(visibleCards()).toEqual([3, 4, 5]);
  });

  it("recule d'une carte avec la flèche précédente", () => {
    renderCarousel(5, 3);
    fireEvent.click(nextArrow() as HTMLElement);
    fireEvent.click(nextArrow() as HTMLElement);
    fireEvent.click(previousArrow() as HTMLElement);
    expect(visibleCards()).toEqual([2, 3, 4]);
  });
});

describe("Carousel - visibleCount couvrant toutes les cartes", () => {
  it.each([5, 6])("n'offre aucune navigation avec visibleCount %i sur 5 cartes", (visible) => {
    renderCarousel(5, visible);
    expect(visibleCards()).toEqual([1, 2, 3, 4, 5]);
    const arrows = [previousArrow(), nextArrow()].filter(
      (arrow): arrow is HTMLElement => arrow !== null,
    );
    arrows.forEach((arrow) => expect(arrow).toBeDisabled());
  });

  it("ne bouge pas au clavier quand tout est visible", () => {
    const { viewport } = renderCarousel(5, 5);
    press(viewport, "ArrowRight");
    press(viewport, "End");
    expect(visibleCards()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("Carousel - clavier avec visibleCount 3", () => {
  it("avance avec flèche droite et recule avec flèche gauche", () => {
    const { viewport } = renderCarousel(5, 3);
    press(viewport, "ArrowRight");
    expect(visibleCards()).toEqual([2, 3, 4]);
    press(viewport, "ArrowLeft");
    expect(visibleCards()).toEqual([1, 2, 3]);
  });

  it("va à la dernière fenêtre avec Fin et à la première avec Début", () => {
    const { viewport } = renderCarousel(5, 3);
    press(viewport, "End");
    expect(visibleCards()).toEqual([3, 4, 5]);
    press(viewport, "Home");
    expect(visibleCards()).toEqual([1, 2, 3]);
  });

  it("rend la fenêtre focalisable", () => {
    const { viewport } = renderCarousel(5, 3);
    act(() => {
      viewport.focus();
    });
    expect(viewport).toHaveFocus();
  });
});

describe("Carousel - visibleCount par défaut", () => {
  it("montre une seule carte et avance d'une carte", () => {
    renderCarousel(3);
    expect(visibleCards()).toEqual([1]);
    expect(previousArrow()).toBeDisabled();
    fireEvent.click(nextArrow() as HTMLElement);
    expect(visibleCards()).toEqual([2]);
    fireEvent.click(nextArrow() as HTMLElement);
    expect(visibleCards()).toEqual([3]);
    expect(nextArrow()).toBeDisabled();
  });

  it("se comporte comme visibleCount 1 explicite", () => {
    renderCarousel(3, 1);
    expect(visibleCards()).toEqual([1]);
  });

  it("navigue au clavier une carte à la fois", () => {
    const { viewport } = renderCarousel(3);
    press(viewport, "ArrowRight");
    expect(visibleCards()).toEqual([2]);
    press(viewport, "End");
    expect(visibleCards()).toEqual([3]);
    press(viewport, "Home");
    expect(visibleCards()).toEqual([1]);
  });
});
