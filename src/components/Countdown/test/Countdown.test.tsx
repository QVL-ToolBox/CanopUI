import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Countdown } from "../Countdown";

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

function poser(ui: React.ReactNode, locale: "fr" | "en" = "fr") {
  return render(
    <CanopThemeProvider>
      <CanopI18nProvider locale={locale}>{ui}</CanopI18nProvider>
    </CanopThemeProvider>,
  );
}

function avancer(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function battement(container: HTMLElement): string | null {
  return container.querySelector("[data-beat]")?.getAttribute("data-beat") ?? null;
}

function annonce(container: HTMLElement): string {
  return container.querySelector("[aria-live]")?.textContent ?? "";
}

beforeEach(() => {
  mockMatchMedia();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-07T10:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Countdown", () => {
  it("affiche les secondes telles quelles sur une durée courte", () => {
    poser(<Countdown duration={15_000} running={false} />);
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("décompte quand il court", () => {
    poser(<Countdown duration={20_000} />);

    avancer(5_000);

    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("garde le même format du début à la fin", () => {
    poser(<Countdown duration={90_000} />);
    expect(screen.getByText("1:30")).toBeInTheDocument();

    avancer(31_000);

    expect(screen.getByText("0:59")).toBeInTheDocument();
  });

  it("vide la barre au lieu de la remplir", () => {
    const { container } = poser(<Countdown duration={20_000} />);
    const barre = container.querySelector('[role="progressbar"]') as HTMLElement;
    expect(barre).toHaveAttribute("aria-valuenow", "100");

    avancer(5_000);

    expect(barre).toHaveAttribute("aria-valuenow", "75");
  });

  it("prévient une seule fois quand le temps est écoulé", () => {
    const onEnd = vi.fn();
    poser(<Countdown duration={2_000} onEnd={onEnd} />);

    avancer(10_000);

    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

describe("Countdown — l'urgence", () => {
  it("ne bat pas tant que le temps n'est pas critique", () => {
    const { container } = poser(<Countdown duration={20_000} urgentBelow={10} />);
    expect(battement(container)).toBe("off");

    avancer(11_000);

    expect(battement(container)).toBe("on");
  });

  it("s'arrête de battre une fois le temps écoulé", () => {
    const { container } = poser(<Countdown duration={5_000} urgentBelow={10} />);

    avancer(6_000);

    expect(battement(container)).toBe("off");
  });

  it("ne bat jamais quand le seuil est désactivé", () => {
    const { container } = poser(<Countdown duration={5_000} urgentBelow={0} />);

    avancer(4_000);

    expect(battement(container)).toBe("off");
  });

  it("neutralise le battement en mouvement réduit", () => {
    mockMatchMedia(true);
    const { container } = poser(<Countdown duration={20_000} urgentBelow={10} />);

    avancer(11_000);

    expect(battement(container)).toBe("off");
  });

  it("garde la couleur et l'icône pleine, elles, en mouvement réduit", () => {
    mockMatchMedia(true);
    const { container } = poser(<Countdown duration={20_000} urgentBelow={10} />);

    avancer(11_000);

    const temps = container.querySelector("[data-urgent]") as HTMLElement;

    expect(temps).toHaveAttribute("data-urgent", "on");
  });
});

describe("Countdown — ce qu'un lecteur d'écran entend", () => {
  it("annonce le temps restant en toutes lettres", () => {
    poser(<Countdown duration={15_000} running={false} />);
    expect(screen.getByRole("timer", { name: "Temps restant : 15 secondes" })).toBeInTheDocument();
  });

  it("garde le dessin hors de l'arbre d'accessibilité", () => {
    const { container } = poser(<Countdown duration={15_000} running={false} />);

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
  });

  it("ne parle qu'au passage du seuil, et pas à chaque rafraîchissement", () => {
    const { container } = poser(<Countdown duration={20_000} urgentBelow={10} />);
    expect(annonce(container)).toBe("");

    avancer(11_000);
    expect(annonce(container)).toBe("Plus que 10 secondes");

    avancer(1_000);
    expect(annonce(container)).toBe("Plus que 10 secondes");
  });

  it("accepte un nom accessible imposé", () => {
    poser(<Countdown duration={15_000} running={false} ariaLabel="Chrono de la question" />);
    expect(screen.getByRole("timer", { name: "Chrono de la question" })).toBeInTheDocument();
  });

  it("suit la langue courante", () => {
    poser(<Countdown duration={15_000} running={false} />, "en");
    expect(screen.getByRole("timer", { name: "15 seconds left" })).toBeInTheDocument();
  });
});
