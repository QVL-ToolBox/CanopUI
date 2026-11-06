import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CopyField } from "../CopyField";

const CODE = "BEURRE-42";
const COPY = "Copier le code";
const COPIED = "Code copié";
const FAILED = "Copie impossible";

function poserPressePapier(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
}

function renderCopyField() {
  const user = userEvent.setup();
  render(
    <CanopThemeProvider>
      <CopyField
        value={CODE}
        label="Code de partage"
        copyLabel={COPY}
        copiedLabel={COPIED}
        failedLabel={FAILED}
      />
    </CanopThemeProvider>,
  );
  return { user, copyButton: screen.getByRole("button", { name: COPY }) };
}

afterEach(() => {
  Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
});

describe("CopyField - AC1 affichage de la valeur", () => {
  it("affiche la valeur", () => {
    renderCopyField();
    expect(screen.getByText(CODE)).toBeInTheDocument();
  });
});

describe("CopyField - AC2 copie réussie", () => {
  it("écrit la valeur dans le presse-papier", async () => {
    const { user, copyButton } = renderCopyField();
    const writeText = vi.fn(() => Promise.resolve());
    poserPressePapier(writeText);
    await user.click(copyButton);
    expect(writeText).toHaveBeenCalledWith(CODE);
  });

  it("annonce le succès de la copie", async () => {
    const { user, copyButton } = renderCopyField();
    poserPressePapier(() => Promise.resolve());
    await user.click(copyButton);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(COPIED));
  });

  it("n'affiche pas le message d'échec quand la copie réussit", async () => {
    const { user, copyButton } = renderCopyField();
    poserPressePapier(() => Promise.resolve());
    await user.click(copyButton);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(COPIED));
    expect(screen.queryByText(FAILED)).not.toBeInTheDocument();
  });
});

describe("CopyField - AC3 échec du presse-papier", () => {
  it("affiche failedLabel quand l'écriture est refusée", async () => {
    const { user, copyButton } = renderCopyField();
    poserPressePapier(() => Promise.reject(new Error("refus")));
    await user.click(copyButton);
    await waitFor(() => expect(screen.getAllByText(FAILED).length).toBeGreaterThan(0));
    expect(screen.queryByText(COPIED)).not.toBeInTheDocument();
  });

  it("n'affiche pas failedLabel avant toute tentative de copie", () => {
    renderCopyField();
    expect(screen.queryByText(FAILED)).not.toBeInTheDocument();
  });
});
