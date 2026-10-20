import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Carousel, type CanopCarouselProps } from "../Carousel";

function mockMatchMedia(reduced = false) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reduced && query.includes("prefers-reduced-motion"),
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

function renderCarousel(props: Partial<CanopCarouselProps> = {}, locale: "fr" | "en" = "fr") {
  const { children, ...rest } = props;
  return render(
    <CanopI18nProvider locale={locale}>
      <CanopThemeProvider>
        <Carousel ariaLabel="Offres" {...rest}>
          {children ?? [<p key="a">Une</p>, <p key="b">Deux</p>, <p key="c">Trois</p>]}
        </Carousel>
      </CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function slides(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll('[role="region"] > *')) as HTMLElement[];
}

function actives(container: HTMLElement): number[] {
  return slides(container)
    .map((slide, index) => (slide.getAttribute("aria-hidden") ? -1 : index))
    .filter((index) => index >= 0);
}

function bars(): HTMLElement[] {
  return screen.getAllByRole("button", { name: /diapositive|slide/i });
}

beforeEach(() => {
  mockMatchMedia();
});

describe("Carousel — une carte a la fois", () => {
  it("n'expose qu'une seule carte, les autres etant masquees", () => {
    const { container } = renderCarousel();
    expect(slides(container)).toHaveLength(3);
    expect(actives(container)).toEqual([0]);
  });

  it("retire du champ tactile et clavier les cartes hors ecran", () => {
    const { container } = renderCarousel();
    const [premiere, deuxieme] = slides(container);
    expect(premiere).not.toHaveStyle({ pointerEvents: "none" });
    expect(deuxieme).toHaveStyle({ pointerEvents: "none" });
  });
});

describe("Carousel — variante fleches", () => {
  it("place deux fleches par defaut", () => {
    renderCarousel();
    expect(screen.getByRole("button", { name: "Élément précédent" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Élément suivant" })).toBeInTheDocument();
  });

  it("avance et recule d'une carte", () => {
    const { container } = renderCarousel();
    fireEvent.click(screen.getByRole("button", { name: "Élément suivant" }));
    expect(actives(container)).toEqual([1]);
    fireEvent.click(screen.getByRole("button", { name: "Élément précédent" }));
    expect(actives(container)).toEqual([0]);
  });

  it("bute aux extremites sans defilement automatique", () => {
    renderCarousel();
    expect(screen.getByRole("button", { name: "Élément précédent" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Élément suivant" }));
    fireEvent.click(screen.getByRole("button", { name: "Élément suivant" }));
    expect(screen.getByRole("button", { name: "Élément suivant" })).toBeDisabled();
  });

  it("boucle quand le defilement automatique est actif", () => {
    const { container } = renderCarousel({ autoPlay: true });
    expect(screen.getByRole("button", { name: "Élément précédent" })).not.toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Élément précédent" }));
    expect(actives(container)).toEqual([2]);
  });

  it("n'affiche aucune fleche avec une seule carte", () => {
    renderCarousel({ children: <p>Seule</p> });
    expect(screen.queryByRole("button", { name: "Élément suivant" })).not.toBeInTheDocument();
  });
});

describe("Carousel — variante barres", () => {
  it("rend une barre par carte et aucune fleche", () => {
    renderCarousel({ navigation: "bars" });
    expect(bars()).toHaveLength(3);
    expect(screen.queryByRole("button", { name: "Élément suivant" })).not.toBeInTheDocument();
  });

  it("marque uniquement la barre active", () => {
    renderCarousel({ navigation: "bars" });
    expect(bars().map((bar) => bar.getAttribute("aria-current"))).toEqual(["true", null, null]);
  });

  it("va directement a la carte choisie", () => {
    const { container } = renderCarousel({ navigation: "bars" });
    fireEvent.click(bars()[2]);
    expect(actives(container)).toEqual([2]);
  });

  it("porte la zone cliquable sur le bouton, pas sur la barre visible", () => {
    renderCarousel({ navigation: "bars" });
    const bouton = bars()[0];
    const barre = bouton.firstElementChild as HTMLElement;
    expect(barre).not.toBeNull();
    expect(barre.getAttribute("aria-hidden")).toBe("true");
    expect(bouton).toHaveAttribute("aria-label");
    expect(barre).not.toHaveAttribute("aria-label");
  });

  it("distingue la barre active par la couleur, pas par la longueur", () => {
    renderCarousel({ navigation: "bars" });
    const barreActive = bars()[0].firstElementChild as HTMLElement;
    const barreInactive = bars()[1].firstElementChild as HTMLElement;
    expect(barreActive).toHaveStyle({ opacity: "1" });
    expect(barreInactive).toHaveStyle({ opacity: "0.55" });
    expect(barreActive.firstElementChild).not.toBeNull();
    expect(barreInactive.firstElementChild).toBeNull();
  });

  it("remplit la barre active en cadence quand le defilement est automatique", () => {
    renderCarousel({ navigation: "bars", autoPlay: true, interval: 2500 });
    const remplissage = bars()[0].firstElementChild?.firstElementChild as HTMLElement;
    expect(remplissage).not.toBeNull();
    expect(remplissage).toHaveAttribute("data-fill", "2500");
    expect(document.head.innerHTML).toContain("canop-carousel-fill");
  });

  it("laisse la barre active pleine, sans animation, hors defilement automatique", () => {
    renderCarousel({ navigation: "bars" });
    const remplissage = bars()[0].firstElementChild?.firstElementChild as HTMLElement;
    expect(remplissage).toHaveAttribute("data-fill", "static");
  });

  it("nomme chaque barre avec un index commencant a un", () => {
    renderCarousel({ navigation: "bars" }, "en");
    expect(screen.getByRole("button", { name: "Go to slide 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to slide 3" })).toBeInTheDocument();
  });
});

describe("Carousel — orientation", () => {
  it("fait glisser horizontalement par defaut", () => {
    const { container } = renderCarousel();
    expect(slides(container)[1]).toHaveStyle({ transform: "translateX(100%)" });
  });

  it("fait glisser verticalement quand on le demande", () => {
    const { container } = renderCarousel({ orientation: "vertical" });
    expect(slides(container)[1]).toHaveStyle({ transform: "translateY(100%)" });
    expect(slides(container)[0]).toHaveStyle({ transform: "translateY(0%)" });
  });

  it("detache les barres de la fenetre a la verticale, pour les longer a droite", () => {
    renderCarousel({ navigation: "bars", orientation: "vertical" });
    expect(screen.getByRole("group", { name: "Offres" })).toHaveStyle({ position: "absolute" });
  });

  it("laisse les barres sous la fenetre a l'horizontale", () => {
    renderCarousel({ navigation: "bars" });
    expect(screen.getByRole("group", { name: "Offres" })).not.toHaveStyle({
      position: "absolute",
    });
  });
});

describe("Carousel — transition", () => {
  it("glisse par defaut, sans toucher a l'opacite", () => {
    const { container } = renderCarousel();
    expect(slides(container)[1].style.opacity).toBe("");
  });

  it("fond en fondu quand on le demande, sans deplacer les cartes", () => {
    const { container } = renderCarousel({ transition: "fade" });
    expect(slides(container)[0]).toHaveStyle({ opacity: "1" });
    expect(slides(container)[1]).toHaveStyle({ opacity: "0" });
    expect(slides(container)[1].style.transform).toBe("");
  });
});

describe("Carousel — defilement automatique", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("passe a la carte suivante apres la duree demandee", () => {
    const { container } = renderCarousel({ autoPlay: true, interval: 2000 });
    expect(actives(container)).toEqual([0]);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(actives(container)).toEqual([1]);
  });

  it("revient a la premiere carte apres la derniere", () => {
    const { container } = renderCarousel({ autoPlay: true, interval: 1000 });
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(actives(container)).toEqual([0]);
  });

  it("ne defile pas sans autoPlay", () => {
    const { container } = renderCarousel({ interval: 1000 });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(actives(container)).toEqual([0]);
  });

  it("se suspend au survol, puis reprend", () => {
    const { container } = renderCarousel({ autoPlay: true, interval: 1000 });
    const fenetre = screen.getByRole("region", { name: "Offres" });
    fireEvent.pointerEnter(fenetre);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(actives(container)).toEqual([0]);
    fireEvent.pointerLeave(fenetre);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(actives(container)).toEqual([1]);
  });

  it("ne defile jamais quand l'utilisateur demande un mouvement reduit", () => {
    mockMatchMedia(true);
    const { container } = renderCarousel({ autoPlay: true, interval: 1000 });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(actives(container)).toEqual([0]);
  });
});

describe("Carousel — clic par moitie", () => {
  function fenetre(largeur = 300, hauteur = 200): HTMLElement {
    const cible = screen.getByRole("region", { name: "Offres" });
    cible.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: largeur,
        height: hauteur,
        right: largeur,
        bottom: hauteur,
      }) as DOMRect;
    return cible;
  }

  it("recule au clic dans la moitie gauche", () => {
    const { container } = renderCarousel({ navigation: "bars" });
    fireEvent.click(bars()[2]);
    fireEvent.click(fenetre(), { clientX: 40, clientY: 100 });
    expect(actives(container)).toEqual([1]);
  });

  it("avance au clic dans la moitie droite", () => {
    const { container } = renderCarousel({ navigation: "bars" });
    fireEvent.click(fenetre(), { clientX: 260, clientY: 100 });
    expect(actives(container)).toEqual([1]);
  });

  it("recule au clic dans la moitie haute, a la verticale", () => {
    const { container } = renderCarousel({ navigation: "bars", orientation: "vertical" });
    fireEvent.click(bars()[2]);
    fireEvent.click(fenetre(), { clientX: 150, clientY: 30 });
    expect(actives(container)).toEqual([1]);
  });

  it("avance au clic dans la moitie basse, a la verticale", () => {
    const { container } = renderCarousel({ navigation: "bars", orientation: "vertical" });
    fireEvent.click(fenetre(), { clientX: 150, clientY: 170 });
    expect(actives(container)).toEqual([1]);
  });

  it("laisse ses clics a un element interactif de la carte", () => {
    const onClick = vi.fn();
    const { container } = renderCarousel({
      navigation: "bars",
      children: [
        <button key="a" type="button" onClick={onClick}>
          Agir
        </button>,
        <p key="b">Deux</p>,
      ],
    });
    fenetre();
    fireEvent.click(screen.getByRole("button", { name: "Agir" }), { clientX: 260, clientY: 100 });
    expect(onClick).toHaveBeenCalledOnce();
    expect(actives(container)).toEqual([0]);
  });

  it("ne navigue pas deux fois quand le clic suit un balayage", () => {
    const { container } = renderCarousel({ navigation: "bars" });
    const cible = fenetre();
    fireEvent.pointerDown(cible, { pointerType: "touch", clientX: 200, clientY: 100 });
    fireEvent.pointerUp(cible, { pointerType: "touch", clientX: 80, clientY: 100 });
    fireEvent.click(cible, { clientX: 80, clientY: 100 });
    expect(actives(container)).toEqual([1]);
  });

  it("n'ecoute pas le clic en mode fleches", () => {
    const { container } = renderCarousel();
    fireEvent.click(fenetre(), { clientX: 260, clientY: 100 });
    expect(actives(container)).toEqual([0]);
  });
});

describe("Carousel — balayage au doigt", () => {
  function swipe(cible: HTMLElement, dx: number, dy = 0, pointerType = "touch") {
    fireEvent.pointerDown(cible, { pointerType, clientX: 200, clientY: 200 });
    fireEvent.pointerUp(cible, { pointerType, clientX: 200 + dx, clientY: 200 + dy });
  }

  it("avance d'une carte vers la gauche en mode barres", () => {
    const { container } = renderCarousel({ navigation: "bars" });
    swipe(screen.getByRole("region", { name: "Offres" }), -120);
    expect(actives(container)).toEqual([1]);
  });

  it("recule vers la droite", () => {
    const { container } = renderCarousel({ navigation: "bars" });
    fireEvent.click(bars()[2]);
    swipe(screen.getByRole("region", { name: "Offres" }), 120);
    expect(actives(container)).toEqual([1]);
  });

  it("ignore un geste trop court", () => {
    const { container } = renderCarousel({ navigation: "bars" });
    swipe(screen.getByRole("region", { name: "Offres" }), -20);
    expect(actives(container)).toEqual([0]);
  });

  it("ignore un geste surtout perpendiculaire, qui est un defilement de page", () => {
    const { container } = renderCarousel({ navigation: "bars" });
    swipe(screen.getByRole("region", { name: "Offres" }), -60, 200);
    expect(actives(container)).toEqual([0]);
  });

  it("ne reagit pas a la souris", () => {
    const { container } = renderCarousel({ navigation: "bars" });
    swipe(screen.getByRole("region", { name: "Offres" }), -120, 0, "mouse");
    expect(actives(container)).toEqual([0]);
  });

  it("n'ecoute pas le doigt en mode fleches, ou ce sont elles qui naviguent", () => {
    const { container } = renderCarousel();
    swipe(screen.getByRole("region", { name: "Offres" }), -120);
    expect(actives(container)).toEqual([0]);
  });
});
