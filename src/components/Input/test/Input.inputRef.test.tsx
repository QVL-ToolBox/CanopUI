import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Input } from "../Input";

function poser(ui: React.ReactElement) {
  return render(
    <CanopThemeProvider>
      <CanopI18nProvider locale="fr">{ui}</CanopI18nProvider>
    </CanopThemeProvider>,
  );
}

describe("Input — inputRef", () => {
  it("donne accès au champ natif", () => {
    const ref = createRef<HTMLInputElement>();
    poser(<Input label="Réponse" value="" onChange={() => {}} inputRef={ref} />);
    expect(ref.current).toBe(screen.getByLabelText("Réponse"));
  });

  it("reprend le focus sans remonter le champ", () => {
    const ref = createRef<HTMLInputElement>();
    const { rerender } = poser(
      <Input label="Réponse" value="Lyon" onChange={() => {}} inputRef={ref} />,
    );
    const champ = screen.getByLabelText("Réponse");

    rerender(
      <CanopThemeProvider>
        <CanopI18nProvider locale="fr">
          <Input label="Réponse" value="" onChange={() => {}} inputRef={ref} />
        </CanopI18nProvider>
      </CanopThemeProvider>,
    );
    ref.current!.focus();

    expect(screen.getByLabelText("Réponse")).toBe(champ);
    expect(document.activeElement).toBe(champ);
  });
});
