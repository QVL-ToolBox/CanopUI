import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Feedback } from "../Feedback";

function renderFeedback(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Feedback — rendu du message et de la sévérité", () => {
  it("affiche le message d'erreur en sévérité error", () => {
    renderFeedback(<Feedback severity="error">Identifiants invalides</Feedback>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Identifiants invalides");
    expect(alert.className).toContain("Error");
  });

  it("affiche le message d'info en sévérité info", () => {
    renderFeedback(<Feedback severity="info">Un email vous a été envoyé</Feedback>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Un email vous a été envoyé");
    expect(alert.className).toContain("Info");
  });

  it("utilise la sévérité info par défaut", () => {
    renderFeedback(<Feedback>Message neutre</Feedback>);
    expect(screen.getByRole("alert").className).toContain("Info");
  });

  it.each(["success", "error", "info", "warning"] as const)(
    "rend la sévérité %s avec children",
    (severity) => {
      renderFeedback(<Feedback severity={severity}>Message {severity}</Feedback>);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent(`Message ${severity}`);
      expect(alert.className.toLowerCase()).toContain(severity);
    },
  );

  it("expose le rôle alert (accessibilité)", () => {
    renderFeedback(<Feedback severity="warning">Attention</Feedback>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

describe("Feedback — absence de message", () => {
  it("ne rend rien sans children", () => {
    const { container } = renderFeedback(<Feedback />);
    expect(container.querySelector(".MuiAlert-root")).not.toBeInTheDocument();
  });

  it("ne rend rien avec children null", () => {
    const { container } = renderFeedback(<Feedback severity="error">{null}</Feedback>);
    expect(container.querySelector(".MuiAlert-root")).not.toBeInTheDocument();
  });
});

describe("Feedback — fermeture", () => {
  it("affiche un bouton de fermeture qui déclenche onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderFeedback(
      <Feedback severity="success" onClose={onClose}>
        Compte créé
      </Feedback>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("n'affiche pas de bouton de fermeture sans onClose", () => {
    renderFeedback(<Feedback severity="success">Compte créé</Feedback>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
