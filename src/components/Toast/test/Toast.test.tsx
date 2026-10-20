import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Toast } from "../Toast";

function renderToast(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Toast", () => {
  it("affiche le message quand open", () => {
    renderToast(<Toast open message="Jean a été activé" onClose={() => {}} />);
    expect(screen.getByText("Jean a été activé")).toBeInTheDocument();
  });

  it("n'affiche rien quand fermé", () => {
    renderToast(<Toast open={false} message="Jean a été activé" onClose={() => {}} />);
    expect(screen.queryByText("Jean a été activé")).not.toBeInTheDocument();
  });

  it("expose un role status pour l'accessibilité", () => {
    renderToast(<Toast open message="Jean a été désactivé" onClose={() => {}} />);
    expect(screen.getByRole("status")).toHaveTextContent("Jean a été désactivé");
  });
});
