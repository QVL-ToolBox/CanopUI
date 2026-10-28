import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Lightbox } from "../Lightbox";
import type { CanopLightboxItem } from "../Lightbox";
import {
  elementsDecoupesEtOmbres,
  estDecoupeEnSquircle,
  porteUnDropShadow,
} from "../../../test/squircleShadowKit";

const modes = ["light", "dark"] as const;

function ouvrir(item: CanopLightboxItem, mode: (typeof modes)[number]) {
  render(
    <CanopThemeProvider mode={mode}>
      <Lightbox open onClose={() => undefined} items={[item]} />
    </CanopThemeProvider>,
  );
  return screen.getByRole("dialog");
}

function ancetresJusqua(element: Element, borne: Element): Element[] {
  const ancetres: Element[] = [];
  let courant = element.parentElement;
  while (courant && courant !== borne.parentElement) {
    ancetres.push(courant);
    courant = courant.parentElement;
  }
  return ancetres;
}

const medias = [
  {
    nom: "image",
    item: { src: "https://example.com/photo.jpg", alt: "Photo" },
    trouver: () => screen.getByRole("img", { name: "Photo" }),
  },
  {
    nom: "vidéo",
    item: { src: "https://example.com/clip.mp4", kind: "video", title: "Clip" },
    trouver: (dialogue: HTMLElement) => dialogue.querySelector("video") as HTMLElement,
  },
] as const;

describe.each(modes)("Lightbox — ombre squircle en thème %s", (mode) => {
  describe.each(medias)("$nom", ({ item, trouver }) => {
    it("garde la découpe squircle sur le média, sans drop-shadow", () => {
      const media = trouver(ouvrir(item as CanopLightboxItem, mode));
      expect(media).toBeInTheDocument();
      expect(estDecoupeEnSquircle(media)).toBe(true);
      expect(porteUnDropShadow(media)).toBe(false);
    });

    it("enveloppe le média dans un élément non découpé qui porte le drop-shadow", () => {
      const media = trouver(ouvrir(item as CanopLightboxItem, mode));
      const enveloppe = media.parentElement as HTMLElement;
      expect(porteUnDropShadow(enveloppe)).toBe(true);
      expect(estDecoupeEnSquircle(enveloppe)).toBe(false);
    });

    it("ne cumule jamais découpe squircle et drop-shadow sur un même élément", () => {
      ouvrir(item as CanopLightboxItem, mode);
      expect(elementsDecoupesEtOmbres()).toEqual([]);
    });
  });

  describe("document", () => {
    const documentItem: CanopLightboxItem = {
      src: "https://example.com/contrat.pdf",
      kind: "document",
      title: "Contrat",
    };

    it("rend le document découpé en squircle sans enveloppe d'ombre", () => {
      const dialogue = ouvrir(documentItem, mode);
      const cadre = dialogue.querySelector("iframe") as HTMLElement;
      expect(cadre).toBeInTheDocument();
      expect(estDecoupeEnSquircle(cadre)).toBe(true);
      expect(porteUnDropShadow(cadre)).toBe(false);
      expect(ancetresJusqua(cadre, dialogue).filter(porteUnDropShadow)).toEqual([]);
    });

    it("ne cumule jamais découpe squircle et drop-shadow sur un même élément", () => {
      ouvrir(documentItem, mode);
      expect(elementsDecoupesEtOmbres()).toEqual([]);
    });
  });
});
