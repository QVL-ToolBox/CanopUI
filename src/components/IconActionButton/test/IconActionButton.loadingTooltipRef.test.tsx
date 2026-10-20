import { afterEach, describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Icon } from "../../Icon";
import { declarationsDe } from "../../../test/cssRules";
import { IconActionButton, type CanopIconActionButtonProps } from "../IconActionButton";

type Props = CanopIconActionButtonProps & Record<`data-${string}`, string>;

const BASE: Props = { icon: "trash", ariaLabel: "Supprimer" };

function renderButton(props: Partial<Props> = {}, mode: "light" | "dark" = "light") {
  const ui = (next: Partial<Props>) => (
    <CanopThemeProvider mode={mode}>
      <IconActionButton {...BASE} {...next} />
    </CanopThemeProvider>
  );
  const view = render(ui(props));
  return {
    button: () => screen.getByRole("button", { name: "Supprimer" }),
    rerenderWith: (next: Partial<Props>) => view.rerender(ui(next)),
  };
}

function svgsOutsideProgressbar(button: HTMLElement) {
  return Array.from(button.querySelectorAll("svg")).filter(
    (svg) => svg.closest('[role="progressbar"]') === null,
  );
}

const waitBeyondTooltipDelay = () => new Promise((resolve) => setTimeout(resolve, 400));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("IconActionButton — loading", () => {
  it("given loading, when rendered, then a progressbar replaces the icon and aria-busy is true", () => {
    const { button } = renderButton({ loading: true });

    expect(button()).toHaveAttribute("aria-busy", "true");
    expect(button().querySelector('[role="progressbar"]')).not.toBeNull();
    expect(svgsOutsideProgressbar(button())).toHaveLength(0);
  });

  it("given loading, when clicked or activated with Enter and Space, then onClick is not called", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { button } = renderButton({ loading: true, onClick });

    await user.click(button());
    button().focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).not.toHaveBeenCalled();
  });

  it("given loading, when rendered, then the button stays enabled and focusable", async () => {
    const user = userEvent.setup();
    const { button } = renderButton({ loading: true });

    await user.tab();

    expect(button()).not.toBeDisabled();
    expect(button()).toHaveFocus();
  });

  it("given a focused button, when loading switches on then off, then focus is kept", async () => {
    const user = userEvent.setup();
    const { button, rerenderWith } = renderButton();
    await user.tab();

    rerenderWith({ loading: true });
    expect(button()).toHaveFocus();

    rerenderWith({ loading: false });
    expect(button()).toHaveFocus();
  });

  it("given the default size, when loading switches on, then width and height stay at 2.5rem", () => {
    const { button, rerenderWith } = renderButton();
    expect(button()).toHaveStyle({ width: "2.5rem", height: "2.5rem" });

    rerenderWith({ loading: true });

    expect(button()).toHaveStyle({ width: "2.5rem", height: "2.5rem" });
  });

  it("given a custom size, when loading switches on, then the requested size is kept", () => {
    const { button, rerenderWith } = renderButton({ size: "3.25rem" });

    rerenderWith({ size: "3.25rem", loading: true });

    expect(button()).toHaveStyle({ width: "3.25rem", height: "3.25rem" });
  });

  it("given loading, when it switches back to false, then the icon returns and onClick fires again", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { button, rerenderWith } = renderButton({ loading: true, onClick });

    rerenderWith({ loading: false, onClick });
    await user.click(button());

    expect(button().querySelector('[role="progressbar"]')).toBeNull();
    expect(button().querySelector("svg")).not.toBeNull();
    expect(button()).not.toHaveAttribute("aria-busy", "true");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("given loading, when the user prefers reduced motion, then a dedicated rule slows the spinner", () => {
    const { button } = renderButton({ loading: true });
    const progressbar = button().querySelector('[role="progressbar"]') as HTMLElement;

    const reduced = declarationsDe(progressbar, "animation-duration").filter((entree) =>
      entree.condition.includes("prefers-reduced-motion: reduce"),
    );

    expect(reduced.length).toBeGreaterThan(0);
  });

  it("given loading, when rendered, then the spinner inherits colour without the accent gradient", () => {
    const { button } = renderButton({ loading: true });

    expect(button().querySelector('[role="progressbar"]')?.className).toContain(
      "MuiCircularProgress-colorInherit",
    );
    expect(button().querySelector("linearGradient")).toBeNull();
    expect(document.body.innerHTML).not.toContain("--canop-palette-accent-");
  });

  it.each([
    ["light", "default", "var(--canop-palette-common-white)"],
    ["light", "danger", "var(--canop-palette-common-white)"],
    ["light", "secondary", "var(--canop-palette-common-white)"],
    ["dark", "default", "var(--canop-palette-primary-contrasttext)"],
    ["dark", "danger", "var(--canop-palette-common-white)"],
    ["dark", "secondary", "var(--canop-palette-secondary-contrasttext)"],
  ] as const)(
    "given loading in %s mode with variant %s, when rendered, then the spinner takes the icon colour",
    (mode, variant, couleur) => {
      const { button } = renderButton({ loading: true, variant }, mode);
      const progressbar = button().querySelector('[role="progressbar"]') as HTMLElement;

      expect(button()).toHaveStyle({ color: couleur });
      expect(getComputedStyle(progressbar).color.toLowerCase()).toBe(
        getComputedStyle(button()).color.toLowerCase(),
      );
    },
  );

  it("given loading and disabled, when rendered, then the spinner takes the disabled action colour", () => {
    const { button } = renderButton({ loading: true, disabled: true });
    const progressbar = button().querySelector('[role="progressbar"]') as HTMLElement;

    expect(getComputedStyle(button()).color).toContain("action-disabled");
    expect(getComputedStyle(progressbar).color).toBe(getComputedStyle(button()).color);
  });
});

describe("IconActionButton — tooltip", () => {
  it("given tooltip true, when hovered, then the tooltip shows ariaLabel and the name stays ariaLabel", async () => {
    const user = userEvent.setup();
    const { button } = renderButton({ tooltip: true });

    await user.hover(button());

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Supprimer");
    expect(button()).toHaveAccessibleName("Supprimer");
  });

  it("given a tooltip text different from ariaLabel, when hovered, then it describes the button", async () => {
    const user = userEvent.setup();
    const { button } = renderButton({ tooltip: "Supprimer définitivement le fichier" });

    await user.hover(button());
    const tooltip = await screen.findByRole("tooltip");

    expect(tooltip).toHaveTextContent("Supprimer définitivement le fichier");
    expect(button()).toHaveAccessibleName("Supprimer");
    expect(button()).toHaveAttribute("aria-describedby");
    expect(button()).toHaveAccessibleDescription("Supprimer définitivement le fichier");
  });

  it("given a tooltip text identical to ariaLabel, when hovered, then no aria-describedby is set", async () => {
    const user = userEvent.setup();
    const { button } = renderButton({ tooltip: "Supprimer" });

    await user.hover(button());
    await screen.findByRole("tooltip");

    expect(button()).not.toHaveAttribute("aria-describedby");
    expect(button()).toHaveAccessibleName("Supprimer");
  });

  it.each([
    ["absent", {}],
    ["false", { tooltip: false }],
    ["empty", { tooltip: "" }],
  ] as const)(
    "given tooltip %s, when hovered and focused, then nothing is displayed",
    async (_, props) => {
      const user = userEvent.setup();
      const { button } = renderButton(props);

      await user.hover(button());
      await user.tab();
      await waitBeyondTooltipDelay();

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

      expect(button()).not.toHaveAttribute("aria-describedby");
    },
  );

  it("given a disabled button with tooltip, when hovered, then no tooltip and no console error", async () => {
    const error = vi.spyOn(console, "error");
    const warn = vi.spyOn(console, "warn");
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const { button } = renderButton({ tooltip: "Supprimer définitivement", disabled: true });

    await user.hover(button());
    await waitBeyondTooltipDelay();

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it("given loading with tooltip, when hovered, then the tooltip is still displayed", async () => {
    const user = userEvent.setup();
    const { button } = renderButton({ tooltip: true, loading: true });

    await user.hover(button());

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Supprimer");
  });

  it("given a tooltip, when the pointer leaves, then the tooltip closes", async () => {
    const user = userEvent.setup();
    const { button } = renderButton({ tooltip: true });
    await user.hover(button());
    await screen.findByRole("tooltip");

    await user.unhover(button());

    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });
});

describe("IconActionButton — ref et data-*", () => {
  it("given a ref, when rendered, then it points to the native button", () => {
    const ref = createRef<HTMLButtonElement>();
    const { button } = renderButton({ ref });

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(button());
  });

  it("given a ref and a tooltip, when rendered, then it still points to the native button", () => {
    const ref = createRef<HTMLButtonElement>();
    const { button } = renderButton({ ref, tooltip: "Supprimer définitivement" });

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(button());
  });

  it("given a ref and loading, when rendered, then it points to the native button", () => {
    const ref = createRef<HTMLButtonElement>();
    const { button } = renderButton({ ref, loading: true });

    expect(ref.current).toBe(button());
  });

  it("given data attributes, when rendered, then they are set on the button", () => {
    const { button } = renderButton({ "data-testid": "suppr", "data-row-id": "42" });

    expect(button()).toHaveAttribute("data-testid", "suppr");
    expect(button()).toHaveAttribute("data-row-id", "42");
  });

  it("given data attributes and a tooltip, when rendered, then they are set on the button", () => {
    const { button } = renderButton({ "data-row-id": "42", tooltip: true });

    expect(button()).toHaveAttribute("data-row-id", "42");
  });
});

describe("IconActionButton — sans les nouvelles props", () => {
  it("given no new prop, when rendered, then no busy state, no description and no tooltip wrapper", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { button } = renderButton({ onClick });

    await user.click(button());

    expect(button()).not.toHaveAttribute("aria-busy");
    expect(button()).not.toHaveAttribute("aria-describedby");
    expect(button().querySelector('[role="progressbar"]')).toBeNull();
    expect(button().querySelector("svg")).not.toBeNull();
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("IconActionButton — taille du Spinner en loading", () => {
  const spinnerOf = (button: HTMLElement) =>
    button.querySelector('[role="progressbar"]') as HTMLElement;

  it("given the default iconSize md, when loading, then the spinner measures 1.25rem", () => {
    const { button } = renderButton({ loading: true });

    expect(spinnerOf(button())).toHaveStyle({ width: "1.25rem", height: "1.25rem" });
  });

  it.each([
    ["xs", "1.25rem"],
    ["lg", "1.25rem"],
    ["xl", "2.5rem"],
  ] as const)(
    "given iconSize %s, when loading, then the spinner measures %s",
    (iconSize, dimension) => {
      const { button } = renderButton({ loading: true, iconSize });

      expect(spinnerOf(button())).toHaveStyle({ width: dimension, height: dimension });
    },
  );

  it.each(["xs", "sm", "md", "lg", "xl"] as const)(
    "given iconSize %s without loading, when rendered, then the icon keeps the iconSize dimension",
    (iconSize) => {
      const reference = render(<Icon name="trash" size={iconSize} />).container.querySelector(
        "svg",
      );
      const { button } = renderButton({ iconSize });

      expect(button().querySelector('[role="progressbar"]')).toBeNull();
      expect(button().querySelector("svg")).toHaveAttribute(
        "width",
        reference?.getAttribute("width") ?? "",
      );
    },
  );
});
