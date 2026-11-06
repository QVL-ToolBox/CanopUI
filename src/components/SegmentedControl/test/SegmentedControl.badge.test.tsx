import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { SegmentedControl, type CanopSegmentedControlOption } from "../SegmentedControl";

function renderWithCoursesOption(courses: Partial<CanopSegmentedControlOption>) {
  const options: CanopSegmentedControlOption[] = [
    { value: "courses", label: "Courses", ...courses },
    { value: "frigo", label: "Frigo" },
  ];
  render(
    <CanopThemeProvider>
      <SegmentedControl
        options={options}
        value="frigo"
        onChange={() => undefined}
        ariaLabel="Listes"
      />
    </CanopThemeProvider>,
  );
  return screen.getAllByRole("radio")[0];
}

describe("SegmentedControl - badge numérique", () => {
  it("affiche le nombre du badge", () => {
    const option = renderWithCoursesOption({ badge: 3 });
    expect(within(option).getByText("3")).toBeInTheDocument();
  });

  it("nomme l'option « Libellé (badge) »", () => {
    const option = renderWithCoursesOption({ badge: 3 });
    expect(option).toHaveAccessibleName("Courses (3)");
  });

  it("affiche 99 tel quel", () => {
    const option = renderWithCoursesOption({ badge: 99 });
    expect(within(option).getByText("99")).toBeInTheDocument();
  });

  it("affiche 99+ au-delà de 99", () => {
    const option = renderWithCoursesOption({ badge: 100 });
    expect(within(option).getByText("99+")).toBeInTheDocument();
    expect(within(option).queryByText("100")).not.toBeInTheDocument();
  });

  it("affiche 99+ pour un grand nombre", () => {
    const option = renderWithCoursesOption({ badge: 1500 });
    expect(within(option).getByText("99+")).toBeInTheDocument();
  });

  it("masque le badge à 0 et garde le libellé seul comme nom", () => {
    const option = renderWithCoursesOption({ badge: 0 });
    expect(within(option).queryByText("0")).not.toBeInTheDocument();
    expect(option).toHaveAccessibleName("Courses");
  });

  it("garde le libellé seul comme nom sans badge", () => {
    const option = renderWithCoursesOption({});
    expect(option).toHaveAccessibleName("Courses");
  });
});

describe("SegmentedControl - badge texte et badgeLabel", () => {
  it("affiche un badge texte et l'ajoute au nom", () => {
    const option = renderWithCoursesOption({ badge: "Nouveau" });
    expect(within(option).getByText("Nouveau")).toBeInTheDocument();
    expect(option).toHaveAccessibleName("Courses (Nouveau)");
  });

  it("utilise badgeLabel pour un badge non texte", () => {
    const option = renderWithCoursesOption({
      badge: <span data-testid="pastille" />,
      badgeLabel: "à revoir",
    });
    expect(within(option).getByTestId("pastille")).toBeInTheDocument();
    expect(option).toHaveAccessibleName("Courses (à revoir)");
  });
});
