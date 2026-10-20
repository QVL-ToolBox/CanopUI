import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Countdown } from "../Countdown";

function mockMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
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

function poser(ui: React.ReactNode) {
  return render(
    <CanopThemeProvider>
      <CanopI18nProvider locale="fr">{ui}</CanopI18nProvider>
    </CanopThemeProvider>,
  );
}

function avancer(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
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

describe("Countdown — format imposé", () => {
  it("range une minute pile du côté horloge en auto", () => {
    poser(<Countdown duration={60_000} running={false} />);
    expect(screen.getByText("1:00")).toBeInTheDocument();
  });

  it("compte une minute pile en secondes quand on le demande", () => {
    poser(<Countdown duration={60_000} format="seconds" running={false} />);
    expect(screen.getByText("60")).toBeInTheDocument();
  });

  it("garde les secondes du début à la fin", () => {
    poser(<Countdown duration={60_000} format="seconds" />);

    avancer(15_000);

    expect(screen.getByText("45")).toBeInTheDocument();
  });

  it("impose l'horloge sur une durée courte", () => {
    poser(<Countdown duration={15_000} format="clock" running={false} />);
    expect(screen.getByText("0:15")).toBeInTheDocument();
  });

  it("laisse le mode auto trancher sur la durée totale", () => {
    poser(<Countdown duration={15_000} format="auto" running={false} />);
    expect(screen.getByText("15")).toBeInTheDocument();
  });
});
