import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { LiveRegion } from "../LiveRegion";
import { LIVE_REGION_ANNOUNCE_DELAY_MS } from "../useLiveRegion";

function watchWrittenTexts(region: HTMLElement) {
  const observer = new MutationObserver(() => {});
  observer.observe(region, { childList: true, characterData: true, subtree: true });
  return () => {
    const records = observer.takeRecords();
    observer.disconnect();
    return records.flatMap((record) =>
      record.type === "characterData"
        ? [record.target.textContent ?? ""]
        : Array.from(record.addedNodes, (node) => node.textContent ?? ""),
    );
  };
}

function advance(milliseconds: number) {
  act(() => {
    vi.advanceTimersByTime(milliseconds);
  });
}

describe("LiveRegion", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("given aucune politesse, when on rend la region, then elle est polie avec le role status", () => {
    render(<LiveRegion message="Enregistre" />);

    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveAttribute("aria-atomic", "true");
  });

  it("given la politesse assertive, when on rend la region, then elle est assertive avec le role alert", () => {
    render(<LiveRegion message="Erreur" politeness="assertive" />);

    const region = screen.getByRole("alert");
    expect(region).toHaveAttribute("aria-live", "assertive");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("given la politesse polite explicite, when on rend la region, then elle est polie", () => {
    render(<LiveRegion message="Ok" politeness="polite" />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("given un message, when la region est montee, then elle est vide puis le message apparait apres le delai", () => {
    render(<LiveRegion message="Enregistre" />);

    const region = screen.getByRole("status");
    expect(region).toBeEmptyDOMElement();

    advance(LIVE_REGION_ANNOUNCE_DELAY_MS);

    expect(region).toHaveTextContent("Enregistre");
  });

  it("given un message annonce, when le message change, then la region est videe puis remplie du nouveau", () => {
    const { rerender } = render(<LiveRegion message="Premier" />);
    advance(LIVE_REGION_ANNOUNCE_DELAY_MS);
    const region = screen.getByRole("status");

    rerender(<LiveRegion message="Second" />);

    expect(region).toBeEmptyDOMElement();
    advance(LIVE_REGION_ANNOUNCE_DELAY_MS);
    expect(region).toHaveTextContent("Second");
  });

  it("given un message annonce, when le meme message revient avec un nouvel announcementId, then la region est videe puis remplie a nouveau", () => {
    const { rerender } = render(<LiveRegion message="Copie" announcementId={1} />);
    advance(LIVE_REGION_ANNOUNCE_DELAY_MS);
    const region = screen.getByRole("status");
    expect(region).toHaveTextContent("Copie");

    rerender(<LiveRegion message="Copie" announcementId={2} />);

    expect(region).toBeEmptyDOMElement();
    advance(LIVE_REGION_ANNOUNCE_DELAY_MS);
    expect(region).toHaveTextContent("Copie");
  });

  it("given un message annonce, when on rerend sans changer ni message ni announcementId, then le message reste affiche", () => {
    const { rerender } = render(<LiveRegion message="Stable" announcementId={1} />);
    advance(LIVE_REGION_ANNOUNCE_DELAY_MS);

    rerender(<LiveRegion message="Stable" announcementId={1} />);

    expect(screen.getByRole("status")).toHaveTextContent("Stable");
  });

  it("given un message vide, when le temps passe, then la region reste vide", () => {
    render(<LiveRegion message="" />);

    advance(1000);

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("given un message annonce, when le message devient vide, then la region est videe et le reste", () => {
    const { rerender } = render(<LiveRegion message="Bientot vide" />);
    advance(LIVE_REGION_ANNOUNCE_DELAY_MS);

    rerender(<LiveRegion message="" />);
    advance(1000);

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("given une annonce en attente, when la region est demontee, then aucun timer ne subsiste", () => {
    const { unmount } = render(<LiveRegion message="En attente" />);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it("given des annonces successives, when la region est demontee, then aucun timer ne subsiste", () => {
    const { rerender, unmount } = render(<LiveRegion message="Un" announcementId={1} />);
    rerender(<LiveRegion message="Un" announcementId={2} />);
    rerender(<LiveRegion message="Deux" announcementId={3} />);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it("given un message au premier rendu, when le delai n'est pas encore ecoule, then il n'est pas encore annonce", () => {
    render(<LiveRegion message="Bienvenue" />);

    advance(LIVE_REGION_ANNOUNCE_DELAY_MS - 1);

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    advance(1);
    expect(screen.getByRole("status")).toHaveTextContent("Bienvenue");
  });

  it("given deux changements de message avant la fin du delai, when le delai s'ecoule, then seul le dernier est annonce", () => {
    const { rerender } = render(<LiveRegion message="Initial" />);
    advance(LIVE_REGION_ANNOUNCE_DELAY_MS);
    const region = screen.getByRole("status");
    const writtenTexts = watchWrittenTexts(region);

    rerender(<LiveRegion message="Intermediaire" />);
    advance(LIVE_REGION_ANNOUNCE_DELAY_MS / 2);
    rerender(<LiveRegion message="Dernier" />);
    advance(LIVE_REGION_ANNOUNCE_DELAY_MS * 3);

    expect(region).toHaveTextContent("Dernier");
    expect(writtenTexts().filter((text) => text !== "")).toEqual(["Dernier"]);
  });

  it("given un message annonce sans announcementId, when on rerend le meme message, then il n'est pas relu", () => {
    const { rerender } = render(<LiveRegion message="Sauvegarde" />);
    advance(LIVE_REGION_ANNOUNCE_DELAY_MS);
    const region = screen.getByRole("status");
    const writtenTexts = watchWrittenTexts(region);

    rerender(<LiveRegion message="Sauvegarde" />);
    advance(LIVE_REGION_ANNOUNCE_DELAY_MS * 3);

    expect(region).toHaveTextContent("Sauvegarde");
    expect(writtenTexts()).toEqual([]);
  });
});
