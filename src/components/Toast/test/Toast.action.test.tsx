import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { declarationsDe } from "../../../test/cssRules";
import { Toast } from "../Toast";

function renderToast(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function renderToastWithAction(duration?: number) {
  const onClick = vi.fn();
  const onClose = vi.fn();
  renderToast(
    <Toast
      open
      message="Fichier supprime"
      onClose={onClose}
      duration={duration}
      action={{ label: "Annuler", onClick }}
    />,
  );
  return { onClick, onClose, button: screen.getByRole("button", { name: "Annuler" }) };
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe("Toast - action", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("given no action, when the toast opens, then no button is rendered", () => {
    renderToast(<Toast open message="Enregistre" onClose={() => undefined} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("given an action, when the toast opens, then a button named after the label is inside the toast", () => {
    const { button } = renderToastWithAction();
    expect(screen.getByRole("status")).toContainElement(button);
  });

  it("given an action, when the button is clicked, then onClick then onClose are called once each in that order", async () => {
    const user = userEvent.setup();
    const { onClick, onClose, button } = renderToastWithAction();
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
    expect(onClick.mock.invocationCallOrder[0]).toBeLessThan(onClose.mock.invocationCallOrder[0]);
  });

  it("given an action, when the user tabs, then the button receives focus", async () => {
    const user = userEvent.setup();
    const { button } = renderToastWithAction();
    await user.tab();
    expect(button).toHaveFocus();
  });

  it.each([["{Enter}"], [" "]])(
    "given a focused action button, when the user presses %s, then onClick and onClose are called",
    async (key) => {
      const user = userEvent.setup();
      const { onClick, onClose, button } = renderToastWithAction();
      act(() => button.focus());
      await user.keyboard(key);
      expect(onClick).toHaveBeenCalledOnce();
      expect(onClose).toHaveBeenCalledOnce();
    },
  );

  it("given a hovered toast, when the duration elapses, then it stays open until the pointer leaves", () => {
    vi.useFakeTimers();
    const { onClose } = renderToastWithAction(1000);
    fireEvent.mouseEnter(screen.getByRole("status"));
    advance(5000);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseLeave(screen.getByRole("status"));
    advance(999);
    expect(onClose).not.toHaveBeenCalled();
    advance(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("given a focused action, when the duration elapses, then it stays open until the focus leaves", () => {
    vi.useFakeTimers();
    const { onClose, button } = renderToastWithAction(1000);
    act(() => button.focus());
    advance(5000);
    expect(onClose).not.toHaveBeenCalled();
    act(() => button.blur());
    advance(999);
    expect(onClose).not.toHaveBeenCalled();
    advance(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("given a toast hovered midway, when the pointer leaves, then the full duration restarts rather than half of it", () => {
    vi.useFakeTimers();
    const { onClose } = renderToastWithAction(4000);
    advance(2000);
    fireEvent.mouseEnter(screen.getByRole("status"));
    advance(10000);
    fireEvent.mouseLeave(screen.getByRole("status"));
    advance(3999);
    expect(onClose).not.toHaveBeenCalled();
    advance(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("given an action focused midway, when the focus leaves, then the full duration restarts rather than half of it", () => {
    vi.useFakeTimers();
    const { onClose, button } = renderToastWithAction(4000);
    advance(2000);
    act(() => button.focus());
    advance(10000);
    act(() => button.blur());
    advance(3999);
    expect(onClose).not.toHaveBeenCalled();
    advance(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("given an action and no duration, when 3000 ms elapse, then the toast stays open until 6000 ms", () => {
    vi.useFakeTimers();
    const { onClose } = renderToastWithAction();
    advance(3000);
    expect(onClose).not.toHaveBeenCalled();
    advance(2999);
    expect(onClose).not.toHaveBeenCalled();
    advance(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("given no action and no duration, when 3000 ms elapse, then the toast closes", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    renderToast(<Toast open message="Enregistre" onClose={onClose} />);
    advance(2999);
    expect(onClose).not.toHaveBeenCalled();
    advance(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("given an action and no interaction, when the duration elapses, then the toast closes without calling onClick", () => {
    vi.useFakeTimers();
    const { onClose, onClick } = renderToastWithAction(1000);
    advance(1000);
    expect(onClose).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("given reduced motion, when the action button is styled, then its transition and transform are disabled", () => {
    const { button } = renderToastWithAction();
    for (const propriete of ["transition", "transform"]) {
      const reduites = declarationsDe(button, propriete).filter((entree) =>
        /prefers-reduced-motion:\s*reduce/.test(entree.condition),
      );
      expect(reduites.map((entree) => entree.valeur)).toContain("none");
    }
  });
});
