import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Icon } from "../Icon";
import { icons, type CanopIconName } from "../icons";

const forgeIcons: CanopIconName[] = ["gitBranch", "gitCommit", "pullRequest", "pipeline"];

function svgOf(name: CanopIconName, variant: "outline" | "solid") {
  const { container, unmount } = render(<Icon name={name} variant={variant} />);
  const svg = container.querySelector("svg");
  const rendu = {
    present: svg !== null,
    markup: svg?.innerHTML ?? "",
    viewBox: svg?.getAttribute("viewBox"),
  };
  unmount();
  return rendu;
}

describe("Icon - forge icons", () => {
  it("given the icon registry, when listed, then it contains the four forge icons", () => {
    expect(Object.keys(icons)).toEqual(expect.arrayContaining(forgeIcons));
  });

  it.each(forgeIcons)(
    "given %s, when rendered in outline and solid, then both render distinct svg",
    (name) => {
      const outline = svgOf(name, "outline");
      const solid = svgOf(name, "solid");
      expect(outline.present).toBe(true);
      expect(solid.present).toBe(true);
      expect(outline.markup).not.toBe("");
      expect(solid.markup).not.toBe(outline.markup);
    },
  );

  it.each(forgeIcons)(
    "given %s, when rendered, then it shares the viewBox of the existing set",
    (name) => {
      const reference = svgOf("sun", "outline").viewBox;
      expect(svgOf(name, "outline").viewBox).toBe(reference);
      expect(svgOf(name, "solid").viewBox).toBe(reference);
    },
  );

  it.each(forgeIcons)(
    "given %s, when rendered, then it draws with currentColor like the existing set",
    (name) => {
      expect(svgOf(name, "outline").markup).toContain("currentColor");
      expect(svgOf(name, "solid").markup).toContain("currentColor");
    },
  );

  it.each(forgeIcons)(
    "given %s with a title, when rendered, then it is an img named by the title",
    (name) => {
      render(<Icon name={name} title="Forge" />);
      expect(screen.getByRole("img", { name: "Forge" })).toBeInTheDocument();
    },
  );

  it.each(forgeIcons)(
    "given %s without title, when rendered, then it is hidden from assistive tech",
    (name) => {
      const { container } = render(<Icon name={name} />);
      expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    },
  );
});
