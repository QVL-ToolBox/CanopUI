import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Lightbox } from "../Lightbox";
import type { CanopLightboxItem } from "../Lightbox";

function renderLightbox(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const gallery: CanopLightboxItem[] = [
  { src: "https://example.com/1.jpg", alt: "Photo 1" },
  { src: "https://example.com/2.jpg", alt: "Photo 2" },
  { src: "https://example.com/3.jpg", alt: "Photo 3" },
];

describe("Lightbox", () => {
  it("ne rend rien tant qu'il est fermé", () => {
    renderLightbox(<Lightbox open={false} onClose={() => undefined} items={gallery} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("affiche le média courant dans un dialogue à l'ouverture", () => {
    renderLightbox(<Lightbox open onClose={() => undefined} items={gallery} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Photo 1" })).toBeInTheDocument();
  });

  it("expose les contrôles de navigation et le compteur pour plusieurs médias", () => {
    renderLightbox(<Lightbox open onClose={() => undefined} items={gallery} />);
    expect(screen.getByRole("button", { name: "Aperçu précédent" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Aperçu suivant" })).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("masque la navigation et le compteur pour un média unique", () => {
    renderLightbox(<Lightbox open onClose={() => undefined} items={[gallery[0]]} />);
    expect(screen.queryByRole("button", { name: "Aperçu suivant" })).not.toBeInTheDocument();
    expect(screen.queryByText("1 / 1")).not.toBeInTheDocument();
  });

  it("avance au média suivant au clic sur suivant", async () => {
    const user = userEvent.setup();
    renderLightbox(<Lightbox open onClose={() => undefined} items={gallery} />);
    await user.click(screen.getByRole("button", { name: "Aperçu suivant" }));
    expect(screen.getByRole("img", { name: "Photo 2" })).toBeInTheDocument();
  });

  it("notifie le changement d'index en usage contrôlé", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    renderLightbox(
      <Lightbox
        open
        onClose={() => undefined}
        items={gallery}
        index={0}
        onIndexChange={onIndexChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Aperçu suivant" }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("ferme la visionneuse via le bouton de fermeture", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderLightbox(<Lightbox open onClose={onClose} items={gallery} />);
    await user.click(screen.getByRole("button", { name: "Fermer la visionneuse" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("parcourt les médias au clavier et ferme avec Échap", () => {
    const onClose = vi.fn();
    renderLightbox(<Lightbox open onClose={onClose} items={gallery} />);
    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(screen.getByRole("img", { name: "Photo 2" })).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("rend un document dans un cadre dédié", () => {
    renderLightbox(
      <Lightbox
        open
        onClose={() => undefined}
        items={[{ src: "https://example.com/doc.pdf", kind: "document", title: "Contrat" }]}
      />,
    );
    expect(screen.getByTitle("Contrat")).toBeInTheDocument();
  });

  it("rend une vidéo avec ses contrôles de lecture", () => {
    const { baseElement } = renderLightbox(
      <Lightbox
        open
        onClose={() => undefined}
        items={[{ src: "https://example.com/clip.mp4", kind: "video", title: "Clip" }]}
      />,
    );
    const video = baseElement.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("src", "https://example.com/clip.mp4");
    expect(video).toHaveAttribute("controls");
    expect(video).not.toHaveAttribute("autoplay");
  });
});
