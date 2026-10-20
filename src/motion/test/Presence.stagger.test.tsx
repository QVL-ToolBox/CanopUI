import { useEffect } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { CanopThemeProvider } from "../../theme";
import { BentoGrid, BentoTile, Presence, PresenceItem, type PresenceProps } from "../../index";
import {
  BASE_DURATION_MS,
  elapse,
  millisecondsUntil,
  mockReducedMotion,
  recordExitFrames,
} from "./presenceTestKit";
import { usePresenceStaggerDelay } from "../presenceStagger";

type Entree = string | null;

function Items({ entries, ...props }: Omit<PresenceProps, "children"> & { entries: Entree[] }) {
  return (
    <Presence {...props}>
      {entries.map((entry) =>
        entry === null ? null : (
          <PresenceItem key={entry}>
            <span>{entry}</span>
          </PresenceItem>
        ),
      )}
    </Presence>
  );
}

function Sonde({ label }: { label: string }) {
  const delai = usePresenceStaggerDelay();
  return <span data-testid={label} data-delai={delai} />;
}

function Compteur({ label, montages }: { label: string; montages: { count: number } }) {
  useEffect(() => {
    montages.count += 1;
  }, [montages]);
  return <span>{label}</span>;
}

function delaiDe(label: string): number {
  return Number(screen.getByTestId(label).dataset.delai);
}

function itemOf(label: string): HTMLElement {
  return screen.getByText(label).parentElement as HTMLElement;
}

function recordDepartures(labels: string[]) {
  const start = performance.now();
  const departures = new Map<string, number>();
  const observers = labels.map((label) => {
    const element = itemOf(label);
    const observer = new MutationObserver(() => {
      if (!departures.has(label) && element.style.opacity !== "0") {
        departures.set(label, performance.now() - start);
      }
    });
    observer.observe(element, { attributes: true, attributeFilter: ["style"] });
    return observer;
  });
  return {
    delayBetween: (first: string, other: string) =>
      (departures.get(other) ?? Number.NaN) - (departures.get(first) ?? Number.NaN),
    stop: () => observers.forEach((observer) => observer.disconnect()),
  };
}

async function waitAllVisible(labels: string[]) {
  await waitFor(
    () => {
      for (const label of labels) expect(itemOf(label).style.opacity).toBe("1");
    },
    { timeout: BASE_DURATION_MS * 12 },
  );
}

beforeEach(() => {
  mockReducedMotion(false);
});

describe("Presence - delai de decalage calcule", () => {
  it("donne a chaque enfant un delai egal a sa position multipliee par le stagger", () => {
    render(
      <Presence stagger={0.1}>
        <Sonde key="Alpha" label="Alpha" />
        <Sonde key="Beta" label="Beta" />
        <Sonde key="Gamma" label="Gamma" />
      </Presence>,
    );
    expect(delaiDe("Alpha")).toBeCloseTo(0, 6);
    expect(delaiDe("Beta")).toBeCloseTo(0.1, 6);
    expect(delaiDe("Gamma")).toBeCloseTo(0.2, 6);
  });

  it("saute les enfants null et les elements invalides dans le calcul des positions", () => {
    render(
      <Presence stagger={0.1}>
        <Sonde key="Alpha" label="Alpha" />
        {null}
        {false}
        {undefined}
        {"texte"}
        {7}
        <Sonde key="Beta" label="Beta" />
        {null}
        <Sonde key="Gamma" label="Gamma" />
      </Presence>,
    );
    expect(delaiDe("Beta")).toBeCloseTo(0.1, 6);
    expect(delaiDe("Gamma")).toBeCloseTo(0.2, 6);
  });

  it("donne un delai nul a chaque enfant avec un stagger nul", () => {
    render(
      <Presence stagger={0}>
        <Sonde key="Alpha" label="Alpha" />
        <Sonde key="Beta" label="Beta" />
        <Sonde key="Gamma" label="Gamma" />
      </Presence>,
    );
    expect([delaiDe("Alpha"), delaiDe("Beta"), delaiDe("Gamma")]).toEqual([0, 0, 0]);
  });

  it("donne un delai nul a chaque enfant sans stagger", () => {
    render(
      <Presence>
        <Sonde key="Alpha" label="Alpha" />
        <Sonde key="Beta" label="Beta" />
      </Presence>,
    );
    expect([delaiDe("Alpha"), delaiDe("Beta")]).toEqual([0, 0]);
  });

  it("rend exactement le meme arbre avec un stagger nul que sans stagger", () => {
    const sans = render(<Items entries={["Alpha", "Beta"]} />).container.innerHTML;
    const nul = render(<Items entries={["Alpha", "Beta"]} stagger={0} />).container.innerHTML;
    expect(nul).toBe(sans);
  });

  it("ne remonte aucun enfant quand le stagger passe de 0 a une valeur positive", () => {
    const montages = { count: 0 };
    const Ensemble = ({ stagger }: { stagger: number }) => (
      <Presence stagger={stagger}>
        <PresenceItem key="Alpha">
          <Compteur label="Alpha" montages={montages} />
        </PresenceItem>
        <PresenceItem key="Beta">
          <Compteur label="Beta" montages={montages} />
        </PresenceItem>
      </Presence>
    );
    const { rerender } = render(<Ensemble stagger={0} />);
    const alphaAvant = itemOf("Alpha");
    rerender(<Ensemble stagger={0.1} />);
    expect(montages.count).toBe(2);
    expect(itemOf("Alpha")).toBe(alphaAvant);
  });
});

describe("Presence - fumee du decalage reel", () => {
  it("fait partir la troisieme tuile apres la premiere", async () => {
    render(<Items entries={["Alpha", "Beta", "Gamma"]} appear stagger={0.3} />);
    const departures = recordDepartures(["Alpha", "Gamma"]);
    await waitAllVisible(["Alpha", "Gamma"]);
    departures.stop();
    expect(departures.delayBetween("Alpha", "Gamma")).toBeGreaterThan(0);
  });
});

describe("Presence - animation au premier rendu", () => {
  it("n'anime aucun enfant au premier rendu avec appear a false", () => {
    render(<Items entries={["Alpha", "Beta"]} appear={false} stagger={0.1} />);
    expect(itemOf("Alpha").style.opacity).toBe("1");
    expect(itemOf("Beta").style.opacity).toBe("1");
    expect(itemOf("Beta").style.transform).toBe("none");
  });

  it("anime l'entree des enfants presents au premier rendu avec appear", async () => {
    render(<Items entries={["Alpha", "Beta"]} appear />);
    expect(itemOf("Alpha").style.opacity).toBe("0");
    expect(itemOf("Alpha").style.transform).toBe("translateY(0.5rem)");
    await waitAllVisible(["Alpha", "Beta"]);
    expect(itemOf("Alpha").style.transform).toBe("none");
  });
});

describe("Presence - sortie d'une tuile bento", () => {
  function Tiles({ keys }: { keys: string[] }) {
    return (
      <CanopThemeProvider>
        <BentoGrid>
          <Presence>
            {keys.map((key) => (
              <BentoTile key={key} span={2}>
                <span>{key}</span>
              </BentoTile>
            ))}
          </Presence>
        </BentoGrid>
      </CanopThemeProvider>
    );
  }

  it("joue la sortie de la tuile retiree avant de la retirer du DOM", async () => {
    const { rerender } = render(<Tiles keys={["Alpha", "Beta"]} />);
    const exit = recordExitFrames(itemOf("Alpha"));
    rerender(<Tiles keys={["Beta"]} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    await elapse(BASE_DURATION_MS / 3);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Alpha")).not.toBeInTheDocument(), {
      timeout: BASE_DURATION_MS * 4,
    });
    exit.stop();
    expect(exit.intermediate().length).toBeGreaterThan(0);
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });
});

describe("Presence - mouvement reduit", () => {
  beforeEach(() => {
    mockReducedMotion(true);
  });

  it("affiche tout de suite chaque enfant malgre appear et stagger", () => {
    render(<Items entries={["Alpha", "Beta", "Gamma"]} appear stagger={0.1} />);
    for (const label of ["Alpha", "Beta", "Gamma"]) {
      expect(itemOf(label).style.opacity).not.toBe("0");
      expect(itemOf(label).style.transform).not.toContain("translate");
    }
  });

  it("n'introduit aucune etape intermediaire ni delai d'entree", async () => {
    render(<Items entries={["Alpha", "Beta", "Gamma"]} appear stagger={0.1} />);
    const frames = recordExitFrames(itemOf("Gamma"));
    await elapse(300);
    frames.stop();
    expect(frames.intermediate()).toEqual([]);
    expect(itemOf("Gamma").style.opacity).not.toBe("0");
  });

  it("affiche sans attendre un enfant ajoute apres le montage avec stagger", async () => {
    const { rerender } = render(<Items entries={["Alpha"]} stagger={0.1} />);
    rerender(<Items entries={["Alpha", "Beta", "Gamma"]} stagger={0.1} />);
    const apparition = await millisecondsUntil(() =>
      expect(itemOf("Gamma").style.opacity).not.toBe("0"),
    );
    expect(apparition).toBeLessThan(BASE_DURATION_MS);
  });

  it("affiche tout de suite les tuiles bento", () => {
    render(
      <CanopThemeProvider>
        <BentoGrid>
          <Presence appear stagger={0.1}>
            <BentoTile key="Alpha">
              <span>Alpha</span>
            </BentoTile>
            <BentoTile key="Beta">
              <span>Beta</span>
            </BentoTile>
          </Presence>
        </BentoGrid>
      </CanopThemeProvider>,
    );
    expect(itemOf("Beta").style.opacity).not.toBe("0");
    expect(itemOf("Beta").style.transform).not.toContain("translate");
  });
});
