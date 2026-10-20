import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, renderHook, screen } from "@testing-library/react";
import { LiveRegion } from "../LiveRegion";
import { useLiveAnnouncer } from "../useLiveAnnouncer";
import { LIVE_REGION_ANNOUNCE_DELAY_MS } from "../useLiveRegion";

function AnnouncerHarness({ onReady }: { onReady: (announce: (message: string) => void) => void }) {
  const { message, announcementId, announce } = useLiveAnnouncer();
  onReady(announce);
  return <LiveRegion message={message} announcementId={announcementId} />;
}

describe("useLiveAnnouncer", () => {
  it("given deux annonces identiques, when on annonce x deux fois, then les ids valent 1 puis 2", () => {
    const { result } = renderHook(() => useLiveAnnouncer());

    act(() => result.current.announce("x"));
    expect(result.current).toMatchObject({ message: "x", announcementId: 1 });

    act(() => result.current.announce("x"));
    expect(result.current).toMatchObject({ message: "x", announcementId: 2 });
  });

  it("given un annonceur, when on rerend et annonce, then la reference d'announce reste stable", () => {
    const { result, rerender } = renderHook(() => useLiveAnnouncer());
    const initialAnnounce = result.current.announce;

    rerender();
    act(() => result.current.announce("x"));
    act(() => result.current.announce("y"));

    expect(result.current.announce).toBe(initialAnnounce);
  });

  describe("avec une LiveRegion", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("given un message deja annonce, when on l'annonce a nouveau, then la region est videe puis le relit", () => {
      let announce: (message: string) => void = () => {};
      render(<AnnouncerHarness onReady={(callback) => (announce = callback)} />);
      const region = screen.getByRole("status");

      act(() => announce("Lien copie"));
      act(() => {
        vi.advanceTimersByTime(LIVE_REGION_ANNOUNCE_DELAY_MS);
      });
      expect(region).toHaveTextContent("Lien copie");

      act(() => announce("Lien copie"));
      expect(region).toBeEmptyDOMElement();
      act(() => {
        vi.advanceTimersByTime(LIVE_REGION_ANNOUNCE_DELAY_MS);
      });
      expect(region).toHaveTextContent("Lien copie");
    });
  });
});
