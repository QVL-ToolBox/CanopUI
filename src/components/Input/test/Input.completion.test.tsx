import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type ReactNode } from "react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Input, type CanopInputProps } from "../Input";
import type { CanopCompletionResolver, CanopCompletionSource } from "../../InlineCompletion";
import type { CanopInputEmailProps } from "../InputEmail";
import type { CanopInputPasswordProps } from "../InputPassword";

const VILLES = ["Paris", "Parme", "Lyon", "Évry", "Aix en Provence"];

function poser(ui: ReactNode) {
  return render(
    <CanopThemeProvider>
      <CanopI18nProvider locale="fr">{ui}</CanopI18nProvider>
    </CanopThemeProvider>,
  );
}

type ProprietesChamp = Partial<Omit<CanopInputProps, "value">> & { initial?: string };

function Champ(proprietes: ProprietesChamp) {
  const { onChange, initial = "", ...rest } = proprietes;
  const completion = "completion" in proprietes ? proprietes.completion : VILLES;
  const [valeur, setValeur] = useState(initial);
  return (
    <Input
      label="Ville"
      value={valeur}
      onChange={(suivante) => {
        setValeur(suivante);
        onChange?.(suivante);
      }}
      completion={completion}
      {...rest}
    />
  );
}

function champ(): HTMLInputElement {
  return screen.getByLabelText("Ville") as HTMLInputElement;
}

function calque(): HTMLElement | null {
  const input = champ();
  const conteneur = input.parentElement as HTMLElement;
  return conteneur.querySelector<HTMLElement>(":scope > [aria-hidden='true']:not(fieldset)");
}

function texteFantome(): string {
  const element = calque();
  if (!element) return "";
  const saisie = champ().value;
  const texte = element.textContent ?? "";
  return texte.startsWith(saisie) ? texte.slice(saisie.length).replace(/Tab$/, "") : "";
}

function elementDeSaisieDuCalque(): HTMLElement {
  const element = calque() as HTMLElement;
  const saisie = champ().value;
  const candidat = Array.from(element.querySelectorAll<HTMLElement>("*")).find(
    (noeud) => noeud.textContent === saisie && noeud.children.length === 0,
  );
  return candidat as HTMLElement;
}

function elementDeSuiteDuCalque(suite: string): HTMLElement {
  const element = calque() as HTMLElement;
  return Array.from(element.querySelectorAll<HTMLElement>("*")).find(
    (noeud) => noeud.textContent === suite && noeud.children.length === 0,
  ) as HTMLElement;
}

function poserBoite(
  element: HTMLElement,
  boite: { left: number; right: number; top: number; bottom: number },
) {
  const rect = {
    ...boite,
    x: boite.left,
    y: boite.top,
    width: boite.right - boite.left,
    height: boite.bottom - boite.top,
  };
  element.getBoundingClientRect = () => ({ ...rect, toJSON: () => rect }) as DOMRect;
  element.getClientRects = () => [element.getBoundingClientRect()] as unknown as DOMRectList;
}

function estInvisible(element: HTMLElement): boolean {
  for (let noeud: HTMLElement | null = element; noeud; noeud = noeud.parentElement) {
    const style = getComputedStyle(noeud);
    if (style.visibility === "hidden") return true;
    if (style.color === "transparent" || style.color === "rgba(0, 0, 0, 0)") return true;
    if (style.opacity === "0") return true;
  }
  return false;
}

async function saisir(texte: string) {
  await userEvent.type(champ(), texte);
}

describe("Input — AC1 texte fantôme", () => {
  it("affiche la suite de la suggestion dans un calque masqué aux technologies d'assistance", async () => {
    poser(<Champ />);

    await saisir("pa");

    expect(calque()).not.toBeNull();
    expect(calque()).toHaveAttribute("aria-hidden", "true");
    expect(texteFantome()).toBe("ris");
  });

  it("recopie la saisie exacte dans le calque, de façon invisible, avant la suite", async () => {
    poser(<Champ />);

    await saisir("pA");

    expect(calque()?.textContent?.startsWith("pAris")).toBe(true);
    expect(estInvisible(elementDeSaisieDuCalque())).toBe(true);
    expect(estInvisible(elementDeSuiteDuCalque("ris"))).toBe(false);
  });

  it("n'utilise pas le placeholder pour la suggestion", async () => {
    poser(<Champ />);

    await saisir("pa");

    expect(champ()).not.toHaveAttribute("placeholder", "Paris");
  });

  it("ne modifie jamais la saisie avant acceptation", async () => {
    const onChange = vi.fn();
    poser(<Champ onChange={onChange} />);

    await saisir("pa");

    expect(champ()).toHaveValue("pa");
    expect(onChange).toHaveBeenLastCalledWith("pa");
    expect(onChange).not.toHaveBeenCalledWith("Paris");
  });

  it("rend exactement comme avant sans la prop completion", async () => {
    poser(<Champ completion={undefined} />);

    await saisir("pa");

    expect(calque()).toBeNull();
    expect(champ()).not.toHaveAttribute("aria-autocomplete");
    expect(document.querySelector("[data-canop-ghost]")).toBeNull();
  });
});

describe("Input — AC2 alignement", () => {
  it("partage la classe de l'input", async () => {
    poser(<Champ />);

    await saisir("pa");

    expect(calque()?.className).toBe(champ().className);
  });

  it("suit le défilement horizontal de l'input", async () => {
    poser(<Champ />);
    await saisir("pa");
    const input = champ();
    Object.defineProperty(input, "scrollLeft", { configurable: true, get: () => 42 });

    fireEvent.scroll(input);

    await waitFor(() => {
      const piste = (calque() as HTMLElement).querySelector<HTMLElement>("[style*='translateX']");
      expect(piste?.style.transform).toBe("translateX(-42px)");
    });
  });
});

describe("Input — AC3 correspondance", () => {
  it("retient la première suggestion qui commence par la saisie", async () => {
    poser(<Champ />);

    await saisir("par");

    expect(texteFantome()).toBe("is");
  });

  it("ignore la casse de la saisie", async () => {
    poser(<Champ />);

    await saisir("LY");

    expect(texteFantome()).toBe("on");
  });

  it("ignore les accents", async () => {
    poser(<Champ />);

    await saisir("ev");

    expect(texteFantome()).toBe("ry");
  });

  it("affiche la suite avec la casse de la suggestion", async () => {
    poser(<Champ completion={["PARIS"]} />);

    await saisir("pa");

    expect(texteFantome()).toBe("RIS");
  });

  it("n'affiche rien quand aucune suggestion ne commence par la saisie", async () => {
    poser(<Champ />);

    await saisir("zz");

    expect(texteFantome()).toBe("");
  });
});

describe("Input — AC3 correspondance exacte", () => {
  it("ne propose rien quand un candidat est exactement la saisie, et Tab quitte le champ", async () => {
    const onChange = vi.fn();
    poser(
      <>
        <Champ onChange={onChange} completion={["Paris", "Paris 15e"]} />
        <button type="button">Suivant</button>
      </>,
    );

    await saisir("paris");
    expect(texteFantome()).toBe("");
    await userEvent.tab();

    expect(screen.getByRole("button", { name: "Suivant" })).toHaveFocus();
    expect(champ()).toHaveValue("paris");
    expect(onChange).toHaveBeenLastCalledWith("paris");
  });
});

describe("Input — AC4 accepter avec Entrée", () => {
  function Formulaire({ onSubmit }: { onSubmit: () => void }) {
    return (
      <form
        onSubmit={(evenement) => {
          evenement.preventDefault();
          onSubmit();
        }}
      >
        <Champ />
        <button type="submit">Envoyer</button>
      </form>
    );
  }

  it("accepte le fantôme visible sans soumettre le formulaire", async () => {
    const onSubmit = vi.fn();
    poser(<Formulaire onSubmit={onSubmit} />);

    await saisir("pa");
    expect(fireEvent.keyDown(champ(), { key: "Enter" })).toBe(false);

    expect(champ()).toHaveValue("Paris");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("garde la soumission native sans fantôme visible", async () => {
    const onSubmit = vi.fn();
    poser(<Formulaire onSubmit={onSubmit} />);

    await saisir("zz");
    await userEvent.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(champ()).toHaveValue("zz");
  });
});

describe("Input — suite hors de la zone visible", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function placerLaSuite(debutDeLaSuite: number) {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const estLaSuite = this.children.length === 0 && this.textContent === "ris";
      const gauche = estLaSuite ? debutDeLaSuite : 0;
      const droite = estLaSuite ? debutDeLaSuite + 40 : 100;
      const rect = { left: gauche, right: droite, top: 0, bottom: 20, x: gauche, y: 0 };
      return { ...rect, width: droite - gauche, height: 20, toJSON: () => rect } as DOMRect;
    });
  }

  it("masque le fantôme et désactive l'acceptation quand la suite commence hors du champ", async () => {
    placerLaSuite(150);
    const onChange = vi.fn();
    poser(<Champ onChange={onChange} />);

    await saisir("pa");

    expect(estInvisible(elementDeSuiteDuCalque("ris"))).toBe(true);
    expect(fireEvent.keyDown(champ(), { key: "Tab" })).toBe(true);
    expect(fireEvent.keyDown(champ(), { key: "Enter" })).toBe(true);
    expect(fireEvent.keyDown(champ(), { key: "ArrowRight" })).toBe(true);
    expect(onChange).not.toHaveBeenCalledWith("Paris");
  });

  it("garde le fantôme quand la suite commence dans le champ", async () => {
    placerLaSuite(40);
    poser(<Champ />);

    await saisir("pa");

    expect(texteFantome()).toBe("ris");
    expect(estInvisible(elementDeSuiteDuCalque("ris"))).toBe(false);
  });
});

describe("Input — AC4 accepter", () => {
  it("accepte avec Tab, envoie la valeur avec la casse de la suggestion et place le curseur en fin", async () => {
    const onChange = vi.fn();
    poser(<Champ onChange={onChange} />);

    await saisir("PA");
    await userEvent.keyboard("{Tab}");

    expect(onChange).toHaveBeenLastCalledWith("Paris");
    expect(champ()).toHaveValue("Paris");
    expect(champ()).toHaveFocus();
    expect(champ().selectionStart).toBe(5);
    expect(champ().selectionEnd).toBe(5);
  });

  it("accepte avec flèche droite en fin de texte", async () => {
    const onChange = vi.fn();
    poser(<Champ onChange={onChange} />);

    await saisir("ly");
    await userEvent.keyboard("{ArrowRight}");

    expect(onChange).toHaveBeenLastCalledWith("Lyon");
    expect(champ().selectionStart).toBe(4);
  });

  it("n'accepte pas avec flèche droite quand une sélection est active", async () => {
    const onChange = vi.fn();
    poser(<Champ onChange={onChange} />);

    await saisir("ly");
    champ().setSelectionRange(0, 2);
    fireEvent.select(champ());
    await userEvent.keyboard("{ArrowRight}");

    expect(onChange).not.toHaveBeenCalledWith("Lyon");
    expect(champ()).toHaveValue("ly");
  });

  it("accepte au clic sur le texte gris", async () => {
    const onChange = vi.fn();
    poser(<Champ onChange={onChange} />);

    await saisir("ly");
    poserBoite(champ(), { left: 0, right: 300, top: 0, bottom: 40 });
    poserBoite(elementDeSuiteDuCalque("on"), { left: 20, right: 40, top: 10, bottom: 30 });
    await userEvent.pointer({
      keys: "[MouseLeft]",
      target: champ(),
      coords: { clientX: 30, clientY: 20 },
    });

    expect(onChange).toHaveBeenLastCalledWith("Lyon");
    expect(champ()).toHaveValue("Lyon");
  });

  it("accepte un seul mot avec Ctrl+flèche droite", async () => {
    const onChange = vi.fn();
    poser(<Champ onChange={onChange} />);

    await saisir("ai");
    await userEvent.keyboard("{Control>}{ArrowRight}{/Control}");

    expect(champ().value).toMatch(/^Aix ?$/);
    expect(onChange).toHaveBeenLastCalledWith(champ().value);
  });

  it("empêche la navigation de Tab quand une suggestion est visible", async () => {
    poser(<Champ />);

    await saisir("pa");

    expect(fireEvent.keyDown(champ(), { key: "Tab" })).toBe(false);
  });

  it("garde la navigation normale de Tab sans suggestion visible", async () => {
    poser(
      <>
        <Champ />
        <button type="button">Suivant</button>
      </>,
    );

    await saisir("zz");
    expect(fireEvent.keyDown(champ(), { key: "Tab" })).toBe(true);
    await userEvent.tab();

    expect(screen.getByRole("button", { name: "Suivant" })).toHaveFocus();
    expect(champ()).toHaveValue("zz");
  });
});

describe("Input — AC5 masquer", () => {
  it("masque sur Escape jusqu'à la prochaine frappe", async () => {
    poser(<Champ />);

    await saisir("pa");
    await userEvent.keyboard("{Escape}");
    expect(texteFantome()).toBe("");

    await saisir("r");
    expect(texteFantome()).toBe("is");
  });

  it("masque quand le curseur n'est pas en fin de texte", async () => {
    poser(<Champ />);

    await saisir("par");
    await userEvent.keyboard("{ArrowLeft}");

    expect(texteFantome()).toBe("");
  });

  it("masque quand une sélection est active", async () => {
    poser(<Champ />);

    await saisir("par");
    champ().setSelectionRange(0, 3);
    fireEvent.select(champ());

    await waitFor(() => expect(texteFantome()).toBe(""));
  });

  it("masque pendant une composition IME", async () => {
    poser(<Champ />);

    await saisir("par");
    fireEvent.compositionStart(champ());

    expect(texteFantome()).toBe("");
  });

  it("masque à la perte du focus", async () => {
    poser(<Champ />);

    await saisir("par");
    act(() => champ().blur());

    expect(texteFantome()).toBe("");
  });

  it("masque quand le champ est vide", async () => {
    poser(<Champ completion={["", "Paris"]} />);

    await saisir("pa");
    await userEvent.clear(champ());

    expect(texteFantome()).toBe("");
    expect(calque()?.textContent ?? "").not.toContain("Paris");
  });
});

describe("Input — AC6 source", () => {
  it("accepte une fonction synchrone", async () => {
    poser(<Champ completion={(saisie) => (saisie ? `${saisie}tagne` : undefined)} />);

    await saisir("Mon");

    expect(texteFantome()).toBe("tagne");
  });

  it("accepte une fonction asynchrone", async () => {
    poser(<Champ completion={async (saisie) => (saisie === "ma" ? "Marseille" : undefined)} />);

    await saisir("ma");

    await waitFor(() => expect(texteFantome()).toBe("rseille"));
  });

  it("n'affiche jamais une réponse asynchrone obsolète et annule son signal", async () => {
    const attentes: {
      saisie: string;
      signal: AbortSignal;
      resoudre: (suggestion: string) => void;
    }[] = [];
    const source: CanopCompletionSource = (saisie, signal) =>
      new Promise<string>((resoudre) => attentes.push({ saisie, signal, resoudre }));
    poser(<Champ completion={source} />);

    await saisir("p");
    await saisir("a");
    const obsolete = attentes.find((attente) => attente.saisie === "p");
    const courante = attentes.find((attente) => attente.saisie === "pa");

    expect(obsolete?.signal.aborted).toBe(true);
    await act(async () => courante?.resoudre("Paris"));
    await act(async () => obsolete?.resoudre("Pamiers"));

    await waitFor(() => expect(texteFantome()).toBe("ris"));
    expect(texteFantome()).not.toBe("miers");
  });
});

describe("Input — AC7 accessibilité", () => {
  it("pose aria-autocomplete inline et autoComplete off par défaut", () => {
    poser(<Champ />);

    expect(champ()).toHaveAttribute("aria-autocomplete", "inline");
    expect(champ()).toHaveAttribute("autocomplete", "off");
  });

  it("respecte un autoComplete explicite", () => {
    poser(<Champ autoComplete="address-level2" />);

    expect(champ()).toHaveAttribute("autocomplete", "address-level2");
  });

  it("annonce la suggestion et la touche pour l'accepter après un délai", async () => {
    poser(<Champ />);

    await saisir("pa");
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).not.toHaveTextContent("Paris");

    await waitFor(
      () => {
        expect(region).toHaveTextContent("Paris");
        expect(region).toHaveTextContent("Tab");
      },
      { timeout: 3000 },
    );
  });
});

describe("Input — AC8 champs exclus", () => {
  it.each([
    ["password", "pa"],
    ["email", "pa"],
  ] as const)("ne complète pas un champ %s", async (type, saisie) => {
    poser(<Champ type={type} completion={["paris@exemple.fr"]} />);

    await userEvent.type(screen.getByLabelText(/Ville/), saisie);

    expect(document.querySelector("[aria-hidden='true'][class*='MuiInputBase-input']")).toBeNull();
    expect(document.body.textContent).not.toContain("ris@exemple.fr");
  });

  it("ne complète pas un champ number", async () => {
    poser(<Champ type="number" completion={["123"]} />);

    await saisir("1");

    expect(calque()).toBeNull();
    expect(document.body.textContent).not.toContain("23");
  });

  it("ne complète pas un champ désactivé", () => {
    poser(<Champ disabled initial="pa" />);

    expect(calque()).toBeNull();
  });
});

describe("Input — Entrée hors interception", () => {
  it.each([["Shift"], ["Control"], ["Alt"], ["Meta"]])(
    "n'intercepte pas Entrée avec %s",
    async (modificateur) => {
      poser(<Champ />);

      await saisir("pa");
      const intercepte = !fireEvent.keyDown(champ(), {
        key: "Enter",
        shiftKey: modificateur === "Shift",
        ctrlKey: modificateur === "Control",
        altKey: modificateur === "Alt",
        metaKey: modificateur === "Meta",
      });

      expect(intercepte).toBe(false);
      expect(champ()).toHaveValue("pa");
    },
  );

  it("n'intercepte pas Entrée pendant une composition IME", async () => {
    poser(<Champ />);

    await saisir("pa");
    fireEvent.compositionStart(champ());

    expect(fireEvent.keyDown(champ(), { key: "Enter", isComposing: true })).toBe(true);
    expect(champ()).toHaveValue("pa");
  });
});

describe("Input — onCompletionAccept", () => {
  it.each([
    ["Tab", "{Tab}"],
    ["Entrée", "{Enter}"],
    ["flèche droite", "{ArrowRight}"],
  ])("est appelée sur %s", async (_touche, frappe) => {
    const onCompletionAccept = vi.fn();
    poser(<Champ onCompletionAccept={onCompletionAccept} />);

    await saisir("pa");
    await userEvent.keyboard(frappe);

    expect(onCompletionAccept).toHaveBeenCalledWith("Paris");
  });

  it("est appelée sur un clic sur la suite", async () => {
    const onCompletionAccept = vi.fn();
    poser(<Champ onCompletionAccept={onCompletionAccept} />);

    await saisir("ly");
    poserBoite(champ(), { left: 0, right: 300, top: 0, bottom: 40 });
    poserBoite(elementDeSuiteDuCalque("on"), { left: 20, right: 40, top: 10, bottom: 30 });
    await userEvent.pointer({
      keys: "[MouseLeft]",
      target: champ(),
      coords: { clientX: 30, clientY: 20 },
    });

    expect(onCompletionAccept).toHaveBeenCalledWith("Lyon");
  });

  it("est appelée sur Ctrl+flèche droite quand le mot atteint la fin", async () => {
    const onCompletionAccept = vi.fn();
    poser(<Champ onCompletionAccept={onCompletionAccept} />);

    await saisir("ly");
    await userEvent.keyboard("{Control>}{ArrowRight}{/Control}");

    expect(onCompletionAccept).toHaveBeenCalledWith("Lyon");
  });

  it("n'est pas appelée pour un Ctrl+flèche droite partiel ni pour une frappe", async () => {
    const onCompletionAccept = vi.fn();
    poser(<Champ onCompletionAccept={onCompletionAccept} />);

    await saisir("ai");
    await userEvent.keyboard("{Control>}{ArrowRight}{/Control}");
    await userEvent.keyboard("x");

    expect(onCompletionAccept).not.toHaveBeenCalled();
  });
});

describe("Input — activation de la complétion à chaud", () => {
  it("garde le même input et le focus quand completion apparaît", () => {
    const { rerender } = render(
      <CanopThemeProvider>
        <Input label="Ville" value="pa" onChange={vi.fn()} />
      </CanopThemeProvider>,
    );
    const avant = champ();
    act(() => avant.focus());

    rerender(
      <CanopThemeProvider>
        <Input label="Ville" value="pa" onChange={vi.fn()} completion={VILLES} />
      </CanopThemeProvider>,
    );

    expect(champ()).toBe(avant);
    expect(avant).toHaveFocus();
    expect(avant).toHaveAttribute("aria-autocomplete", "inline");
  });
});

describe("Input — annonce", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("annonce la suggestion et les trois touches d'acceptation", async () => {
    poser(<Champ />);

    await saisir("pa");

    await waitFor(
      () =>
        expect(screen.getByRole("status").textContent).toMatch(
          /^Suggestion : Paris\. Tab, Entrée ou flèche droite pour l.accepter\.$/,
        ),
      { timeout: 3000 },
    );
  });

  it("annonce seulement la suggestion sous un pointeur grossier", async () => {
    vi.stubGlobal(
      "matchMedia",
      (requete: string) =>
        ({
          matches: requete.includes("pointer: coarse"),
          media: requete,
          onchange: null,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          addListener: () => undefined,
          removeListener: () => undefined,
          dispatchEvent: () => false,
        }) as MediaQueryList,
    );
    poser(<Champ />);

    await saisir("pa");

    await waitFor(
      () => expect(screen.getByRole("status").textContent).toBe("Suggestion : Paris."),
      {
        timeout: 3000,
      },
    );
  });
});

describe("Input — résolveur défaillant", () => {
  const EXCEPTION: CanopCompletionResolver = () => {
    throw new Error("panne");
  };
  const REJET: CanopCompletionResolver = () => Promise.reject(new Error("panne"));
  const SANS_CHAINE = (() => 42) as unknown as CanopCompletionResolver;

  it.each([
    ["une exception synchrone", EXCEPTION],
    ["une promesse rejetée", REJET],
    ["un retour qui n'est pas une chaîne", SANS_CHAINE],
  ])("vaut aucune suggestion pour %s", async (_cas, source) => {
    poser(<Champ completion={source} />);

    await saisir("pa");
    await act(async () => undefined);

    expect(texteFantome()).toBe("");
    expect(champ()).toHaveValue("pa");
  });
});

describe("Input — graphèmes", () => {
  it("ne coupe pas un diacritique combinant", async () => {
    poser(<Champ completion={["Café noir"]} />);

    await saisir("caf");

    expect(texteFantome().normalize("NFC")).toBe("Café noir".normalize("NFC").slice(3));
  });

  it("ne coupe pas un emoji composé", async () => {
    const famille = "\u{1F468}‍\u{1F469}‍\u{1F467}";
    poser(<Champ completion={[`${famille} famille`]} />);

    await saisir("\u{1F468}");

    expect(texteFantome().startsWith("‍")).toBe(false);
  });
});

describe("Input — types qui refusent la complétion", () => {
  it("InputEmail et InputPassword n'acceptent pas les props de complétion", () => {
    expectTypeOf<CanopInputEmailProps>().not.toHaveProperty("completion");
    expectTypeOf<CanopInputEmailProps>().not.toHaveProperty("completionNormalize");
    expectTypeOf<CanopInputEmailProps>().not.toHaveProperty("onCompletionAccept");
    expectTypeOf<CanopInputPasswordProps>().not.toHaveProperty("completion");
    expectTypeOf<CanopInputPasswordProps>().not.toHaveProperty("completionNormalize");
    expectTypeOf<CanopInputPasswordProps>().not.toHaveProperty("onCompletionAccept");
  });
});
