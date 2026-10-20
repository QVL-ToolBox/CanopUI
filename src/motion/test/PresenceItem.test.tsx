import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Presence, PresenceItem, type PresenceItemProps } from "../../index";
import { millisecondsUntil, mockReducedMotion, recordExitFrames } from "./presenceTestKit";

function renderItem(props: Omit<PresenceItemProps, "children"> = {}) {
  return render(
    <Presence>
      <PresenceItem {...props}>
        <span>Contenu</span>
      </PresenceItem>
    </Presence>,
  );
}

function item(): HTMLElement {
  return screen.getByText("Contenu").parentElement as HTMLElement;
}

beforeEach(() => {
  mockReducedMotion(false);
});

describe("PresenceItem - rendu", () => {
  it("enveloppe ses enfants dans un div", () => {
    renderItem();
    expect(item().tagName).toBe("DIV");
  });

  it("n'expose ni role ni aria-busy quand ils ne sont pas fournis", () => {
    renderItem();
    expect(item()).not.toHaveAttribute("role");
    expect(item()).not.toHaveAttribute("aria-busy");
  });

  it("transmet le role fourni", () => {
    renderItem({ role: "status" });
    expect(screen.getByRole("status")).toBe(item());
  });

  it("transmet un role de liste", () => {
    renderItem({ role: "listitem" });
    expect(item()).toHaveAttribute("role", "listitem");
  });

  it("signale un contenu en cours de chargement", () => {
    renderItem({ ariaBusy: true });
    expect(item()).toHaveAttribute("aria-busy", "true");
  });

  it("signale un contenu charge", () => {
    renderItem({ ariaBusy: false });
    expect(item()).toHaveAttribute("aria-busy", "false");
  });

  it("transmet role et aria-busy ensemble", () => {
    renderItem({ role: "region", ariaBusy: true });
    expect(item()).toHaveAttribute("role", "region");
    expect(item()).toHaveAttribute("aria-busy", "true");
  });

  it("conserve ses attributs avec le layout active", () => {
    renderItem({ layout: true, role: "status" });
    expect(item()).toHaveAttribute("role", "status");
  });

  it("conserve ses attributs en mouvement reduit", () => {
    mockReducedMotion(true);
    renderItem({ role: "status", ariaBusy: true });
    expect(item()).toHaveAttribute("role", "status");
    expect(item()).toHaveAttribute("aria-busy", "true");
  });
});

describe("PresenceItem - trajectoire de sortie", () => {
  it("s'efface en glissant vers la droite et en retrecissant au meme rythme", async () => {
    const { rerender } = renderItem();
    const exit = recordExitFrames(item());
    rerender(<Presence>{null}</Presence>);
    await millisecondsUntil(() => expect(screen.queryByText("Contenu")).not.toBeInTheDocument());
    exit.stop();
    const frames = exit.intermediate();
    expect(frames.length).toBeGreaterThan(0);
    for (const frame of frames) {
      const progress = 1 - frame.opacity;
      expect(frame.x).toBeCloseTo(1.5 * progress, 2);
      expect(frame.scale).toBeCloseTo(1 - 0.03 * progress, 3);
    }
  });

  it("disparait du DOM une fois la sortie terminee", async () => {
    const { rerender } = renderItem();
    rerender(<Presence>{null}</Presence>);
    await waitFor(() => expect(screen.queryByText("Contenu")).not.toBeInTheDocument(), {
      timeout: 1000,
    });
  });
});
