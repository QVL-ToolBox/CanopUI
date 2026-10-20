import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CarouselArrow } from "../CarouselArrow";

function renderArrow(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("CarouselArrow", () => {
  it("rend une fleche precedente cliquable", () => {
    const onClick = vi.fn();
    const buttonRef = createRef<HTMLButtonElement>();
    renderArrow(
      <CarouselArrow
        direction="previous"
        label="Precedent"
        disabled={false}
        onClick={onClick}
        buttonRef={buttonRef}
        onDisabledWhileFocused={vi.fn()}
      />,
    );
    const button = screen.getByRole("button", { name: "Precedent" });
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(buttonRef.current).toBe(button);
  });

  it("deplace le focus quand la fleche devient desactivee alors qu'elle a le focus", () => {
    const onDisabledWhileFocused = vi.fn();
    const buttonRef = createRef<HTMLButtonElement>();
    const { rerender } = renderArrow(
      <CarouselArrow
        direction="next"
        label="Suivant"
        disabled={false}
        onClick={vi.fn()}
        buttonRef={buttonRef}
        onDisabledWhileFocused={onDisabledWhileFocused}
      />,
    );
    const button = screen.getByRole("button", { name: "Suivant" });
    button.focus();
    expect(button).toHaveFocus();

    rerender(
      <CanopThemeProvider>
        <CarouselArrow
          direction="next"
          label="Suivant"
          disabled
          onClick={vi.fn()}
          buttonRef={buttonRef}
          onDisabledWhileFocused={onDisabledWhileFocused}
        />
      </CanopThemeProvider>,
    );

    expect(onDisabledWhileFocused).toHaveBeenCalledTimes(1);
  });

  it("ne declenche pas le repli du focus si la fleche n'avait pas le focus", () => {
    const onDisabledWhileFocused = vi.fn();
    const buttonRef = createRef<HTMLButtonElement>();
    const { rerender } = renderArrow(
      <CarouselArrow
        direction="next"
        label="Suivant"
        disabled={false}
        onClick={vi.fn()}
        buttonRef={buttonRef}
        onDisabledWhileFocused={onDisabledWhileFocused}
      />,
    );

    rerender(
      <CanopThemeProvider>
        <CarouselArrow
          direction="next"
          label="Suivant"
          disabled
          onClick={vi.fn()}
          buttonRef={buttonRef}
          onDisabledWhileFocused={onDisabledWhileFocused}
        />
      </CanopThemeProvider>,
    );

    expect(onDisabledWhileFocused).not.toHaveBeenCalled();
  });
});
