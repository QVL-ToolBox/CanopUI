import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Presence, PresenceItem, type PresenceProps } from "../../index";
import {
  BASE_DURATION_MS,
  elapse,
  millisecondsUntil,
  mockReducedMotion,
  recordExitFrames,
} from "./presenceTestKit";

function Items({ keys, mode }: { keys: string[]; mode?: PresenceProps["mode"] }) {
  return (
    <Presence mode={mode}>
      {keys.map((key) => (
        <PresenceItem key={key}>
          <span>{key}</span>
        </PresenceItem>
      ))}
    </Presence>
  );
}

function itemOf(label: string): HTMLElement {
  return screen.getByText(label).parentElement as HTMLElement;
}

beforeEach(() => {
  mockReducedMotion(false);
});

describe("Presence - montage initial", () => {
  it("n'anime pas l'entree des enfants presents au montage", () => {
    render(<Items keys={["Alpha", "Beta"]} />);
    expect(itemOf("Alpha").style.opacity).toBe("1");
    expect(itemOf("Alpha").style.transform).toBe("none");
    expect(itemOf("Beta").style.opacity).toBe("1");
  });

  it("ne rend rien sans enfant", () => {
    const { container } = render(<Items keys={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("Presence - entree d'un enfant ajoute", () => {
  it("monte le nouvel enfant transparent et decale d'un demi rem vers le bas", () => {
    const { rerender } = render(<Items keys={["Alpha"]} />);
    rerender(<Items keys={["Alpha", "Beta"]} />);
    expect(itemOf("Beta").style.opacity).toBe("0");
    expect(itemOf("Beta").style.transform).toBe("translateY(0.5rem)");
  });

  it("amene le nouvel enfant a sa place et pleinement visible", async () => {
    const { rerender } = render(<Items keys={["Alpha"]} />);
    rerender(<Items keys={["Alpha", "Beta"]} />);
    await waitFor(() => {
      expect(itemOf("Beta").style.opacity).toBe("1");
      expect(itemOf("Beta").style.transform).toBe("none");
    });
  });
});

describe("Presence - sortie d'un enfant retire", () => {
  it("garde l'enfant retire dans le DOM pendant sa sortie", async () => {
    const { rerender } = render(<Items keys={["Alpha", "Beta"]} />);
    rerender(<Items keys={["Beta"]} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    await elapse(BASE_DURATION_MS / 3);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("retire l'enfant du DOM a la fin de sa sortie", async () => {
    const { rerender } = render(<Items keys={["Alpha", "Beta"]} />);
    rerender(<Items keys={["Beta"]} />);
    await waitFor(() => expect(screen.queryByText("Alpha")).not.toBeInTheDocument(), {
      timeout: BASE_DURATION_MS * 4,
    });
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("vide le conteneur quand le dernier enfant est retire", async () => {
    const { container, rerender } = render(<Items keys={["Alpha"]} />);
    rerender(<Items keys={[]} />);
    await waitFor(() => expect(container).toBeEmptyDOMElement(), {
      timeout: BASE_DURATION_MS * 4,
    });
  });
});

describe("Presence - mode de remplacement", () => {
  it("monte le remplacant pendant la sortie du precedent par defaut", () => {
    const { rerender } = render(<Items keys={["Alpha"]} />);
    rerender(<Items keys={["Beta"]} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("monte le remplacant pendant la sortie du precedent en mode sync", () => {
    const { rerender } = render(<Items keys={["Alpha"]} mode="sync" />);
    rerender(<Items keys={["Beta"]} mode="sync" />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("attend la fin de la sortie du precedent avant de monter le suivant en mode wait", async () => {
    const { rerender } = render(<Items keys={["Alpha"]} mode="wait" />);
    rerender(<Items keys={["Beta"]} mode="wait" />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
    await elapse(BASE_DURATION_MS / 3);
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Beta")).toBeInTheDocument(), {
      timeout: BASE_DURATION_MS * 4,
    });
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
  });
});

describe("Presence - mouvement reduit", () => {
  beforeEach(() => {
    mockReducedMotion(true);
  });

  it("affiche immediatement un enfant ajoute sans transparence ni decalage", () => {
    const { rerender } = render(<Items keys={["Alpha"]} />);
    rerender(<Items keys={["Alpha", "Beta"]} />);
    expect(itemOf("Beta").style.opacity).not.toBe("0");
    expect(itemOf("Beta").style.transform).not.toContain("translateY");
  });

  it("retire un enfant sans attendre la duree de sortie", async () => {
    const { rerender } = render(<Items keys={["Alpha", "Beta"]} />);
    rerender(<Items keys={["Beta"]} />);
    const removal = await millisecondsUntil(() =>
      expect(screen.queryByText("Alpha")).not.toBeInTheDocument(),
    );
    expect(removal).toBeLessThan(BASE_DURATION_MS);
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("retire un enfant sans etape intermediaire de sortie", async () => {
    const { rerender } = render(<Items keys={["Alpha", "Beta"]} />);
    const exit = recordExitFrames(itemOf("Alpha"));
    rerender(<Items keys={["Beta"]} />);
    await millisecondsUntil(() => expect(screen.queryByText("Alpha")).not.toBeInTheDocument());
    exit.stop();
    expect(exit.intermediate()).toEqual([]);
  });

  it("monte le suivant sans attendre la duree de sortie en mode wait", async () => {
    const { rerender } = render(<Items keys={["Alpha"]} mode="wait" />);
    rerender(<Items keys={["Beta"]} mode="wait" />);
    const replacement = await millisecondsUntil(() =>
      expect(screen.getByText("Beta")).toBeInTheDocument(),
    );
    expect(replacement).toBeLessThan(BASE_DURATION_MS);
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
  });
});
