import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Map } from "../Map";

type Listener = (event: unknown) => void;

const maplibre = vi.hoisted(() => ({
  options: undefined as Record<string, unknown> | undefined,
  listeners: {} as Record<string, Listener>,
  markers: [] as { lngLat: [number, number]; element: HTMLElement; popup?: HTMLElement }[],
  easeTo: vi.fn(),
  setStyle: vi.fn(),
  remove: vi.fn(),
  addControl: vi.fn(),
  workerUrl: "",
}));

vi.mock("maplibre-gl", () => {
  class MockMap {
    constructor(options: Record<string, unknown>) {
      maplibre.options = options;
    }
    addControl = maplibre.addControl;
    easeTo = maplibre.easeTo;
    setStyle = maplibre.setStyle;
    remove = maplibre.remove;
    on = (event: string, listener: Listener) => {
      maplibre.listeners[event] = listener;
    };
    off = (event: string) => {
      delete maplibre.listeners[event];
    };
  }

  class MockPopup {
    node: HTMLElement | undefined;
    setDOMContent(node: HTMLElement) {
      this.node = node;
      return this;
    }
  }

  class MockMarker {
    entry: { lngLat: [number, number]; element: HTMLElement; popup?: HTMLElement };
    constructor(options: { element: HTMLElement }) {
      this.entry = { lngLat: [0, 0], element: options.element };
    }
    setLngLat(lngLat: [number, number]) {
      this.entry.lngLat = lngLat;
      return this;
    }
    setPopup(popup: MockPopup) {
      this.entry.popup = popup.node;
      return this;
    }
    addTo() {
      maplibre.markers.push(this.entry);
      return this;
    }
    remove() {
      maplibre.markers = maplibre.markers.filter((entry) => entry !== this.entry);
    }
  }

  return {
    Map: MockMap,
    Marker: MockMarker,
    Popup: MockPopup,
    NavigationControl: class {},
    getWorkerUrl: () => maplibre.workerUrl,
    setWorkerUrl: (valeur: string) => {
      maplibre.workerUrl = valeur;
    },
  };
});

const webgl = { available: true };

beforeEach(() => {
  webgl.available = true;
  maplibre.workerUrl = "";
  HTMLCanvasElement.prototype.getContext = ((type: string) =>
    type === "webgl2" && webgl.available ? { getExtension: () => null } : null) as never;
});

function renderMap(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const CENTER = { lat: 49.4431, lng: 1.0993 };

function fondPeintAuDessusDe(element: HTMLElement, racine: HTMLElement): string {
  for (
    let courant = element.parentElement;
    courant && courant !== racine;
    courant = courant.parentElement
  ) {
    const fond = getComputedStyle(courant).backgroundColor;
    if (fond !== "" && fond !== "transparent" && fond !== "rgba(0, 0, 0, 0)") return fond;
  }
  return "";
}

describe("Map", () => {
  beforeEach(() => {
    maplibre.options = undefined;
    maplibre.listeners = {};
    maplibre.markers = [];
    maplibre.easeTo.mockClear();
    maplibre.setStyle.mockClear();
    maplibre.addControl.mockClear();
  });

  it("crée la carte sur le centre et le zoom demandés", () => {
    renderMap(<Map center={CENTER} zoom={12} />);
    expect(maplibre.options?.center).toEqual([CENTER.lng, CENTER.lat]);
    expect(maplibre.options?.zoom).toBe(12);
  });

  it("applique la hauteur au cadre et remplit la carte", () => {
    const { container } = renderMap(
      <Map center={CENTER} height="18rem" ariaLabel="Carte de Rouen" />,
    );
    expect(container.firstElementChild).toHaveStyle({ height: "18rem" });
    expect(screen.getByRole("region", { name: "Carte de Rouen" })).toHaveStyle({
      height: "100%",
    });
  });

  it("surélève la carte quand une élévation est demandée", () => {
    const { container } = renderMap(<Map center={CENTER} elevation="md" />);
    expect(container.firstElementChild).toHaveStyle({
      filter: "var(--canop-drop-shadow-e2)",
    });
  });

  it("ne pose ni ombre ni cadre par défaut", () => {
    const { container } = renderMap(<Map center={CENTER} />);
    expect(container.firstElementChild).not.toHaveStyle({
      filter: "var(--canop-drop-shadow-e2)",
    });
  });

  it("ne retient que les points d'intérêt demandés", () => {
    renderMap(<Map center={CENTER} poi={["bar"]} />);
    const style = maplibre.options?.style as {
      layers: { id: string; filter?: unknown }[];
    };
    const poi = style.layers.find((layer) => layer.id === "canop-poi");
    expect(JSON.stringify(poi?.filter)).toContain('["bar"]');
  });

  it("retire la couche des points d'intérêt quand la liste est vide", () => {
    renderMap(<Map center={CENTER} poi={[]} />);
    const style = maplibre.options?.style as { layers: { id: string }[] };
    expect(style.layers.some((layer) => layer.id === "canop-poi")).toBe(false);
  });

  it("peint le style clair du design system par défaut", () => {
    renderMap(<Map center={CENTER} />);
    const style = maplibre.options?.style as { name: string; layers: { id: string }[] };
    expect(style.name).toBe("CanopUI light");
    expect(style.layers.every((layer) => layer.id.startsWith("canop-"))).toBe(true);
  });

  it("force le style sombre quand styleMode le demande", () => {
    renderMap(<Map center={CENTER} styleMode="dark" />);
    expect((maplibre.options?.style as { name: string }).name).toBe("CanopUI dark");
  });

  it("pose un marqueur par entrée", () => {
    renderMap(
      <Map
        center={CENTER}
        markers={[
          { id: "a", lat: 49.44, lng: 1.09 },
          { id: "b", lat: 49.45, lng: 1.1 },
        ]}
      />,
    );
    expect(maplibre.markers).toHaveLength(2);
    expect(maplibre.markers[0].lngLat).toEqual([1.09, 49.44]);
  });

  it("rend le contenu React d'une bulle dans le noeud de la popup", () => {
    renderMap(
      <Map
        center={CENTER}
        markers={[{ id: "a", lat: 49.44, lng: 1.09, popup: <p>Cathédrale</p> }]}
      />,
    );
    expect(maplibre.markers[0].popup?.textContent).toBe("Cathédrale");
  });

  it("remonte les coordonnées d'un clic", async () => {
    const onMapClick = vi.fn();
    renderMap(<Map center={CENTER} onMapClick={onMapClick} />);
    maplibre.listeners.click?.({ lngLat: { lat: 49.1, lng: 1.2 } });
    expect(onMapClick).toHaveBeenCalledWith(49.1, 1.2);
  });

  it("recentre la carte quand le centre change", () => {
    const { rerender } = renderMap(<Map center={CENTER} />);
    maplibre.easeTo.mockClear();
    rerender(
      <CanopThemeProvider>
        <Map center={{ lat: 48.85, lng: 2.35 }} />
      </CanopThemeProvider>,
    );
    expect(maplibre.easeTo).toHaveBeenCalledWith(
      expect.objectContaining({ center: [2.35, 48.85] }),
    );
  });

  it("ne recharge pas le style quand rien ne change", () => {
    const { rerender } = renderMap(<Map center={CENTER} />);
    rerender(
      <CanopThemeProvider>
        <Map center={CENTER} />
      </CanopThemeProvider>,
    );
    expect(maplibre.setStyle).not.toHaveBeenCalled();
  });

  it("remplace la carte par un repli lisible quand WebGL manque", () => {
    webgl.available = false;
    renderMap(<Map center={CENTER} />);
    expect(screen.getByText("Carte non affichable ici")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      expect.stringContaining("openstreetmap.org"),
    );
    expect(maplibre.options).toBeUndefined();
  });

  it.each(["light", "dark"] as const)(
    "pose le repli WebGL en état vide sans surface, sur le fond peint par la carte en %s",
    (mode) => {
      webgl.available = false;
      const { container } = render(
        <CanopThemeProvider mode={mode}>
          <Map center={CENTER} />
        </CanopThemeProvider>,
      );
      const titre = screen.getByRole("heading", { name: "Carte non affichable ici" });
      expect(container.querySelector(".MuiCard-root")).toBeNull();
      expect(fondPeintAuDessusDe(titre, container)).toMatch(/^var\(--canop-palette-/);
    },
  );

  it("protège le défilement de la page par des gestes coopératifs", () => {
    renderMap(<Map center={CENTER} />);
    expect(maplibre.options?.cooperativeGestures).toBe(true);
    expect(maplibre.options?.dragRotate).toBe(false);
  });

  it("rend les gestes directs quand la carte est le contenu principal", () => {
    renderMap(<Map center={CENTER} gestures="direct" />);
    expect(maplibre.options?.cooperativeGestures).toBe(false);
  });

  it("garde le clic silencieux quand aucun handler n'est fourni", async () => {
    renderMap(<Map center={CENTER} />);
    expect(maplibre.listeners.click).toBeUndefined();
    await userEvent.click(document.body);
  });

  it("pointe MapLibre vers le worker que le greffon sert", () => {
    renderMap(<Map center={CENTER} />);
    expect(maplibre.workerUrl).toBe("/canopui/map/maplibre-gl-worker.mjs");
  });

  it("respecte l'URL de worker qu'une application a deja posee", () => {
    maplibre.workerUrl = "https://cdn.qvl-project.com/maplibre-worker.mjs";
    renderMap(<Map center={CENTER} />);
    expect(maplibre.workerUrl).toBe("https://cdn.qvl-project.com/maplibre-worker.mjs");
  });

  it("nomme la panne quand le contexte graphique est perdu", async () => {
    renderMap(<Map center={CENTER} />);
    expect(screen.queryByText("Carte non affichable ici")).not.toBeInTheDocument();

    act(() => {
      maplibre.listeners.webglcontextlost?.({});
    });

    expect(await screen.findByText("Carte non affichable ici")).toBeInTheDocument();
  });

  it("garde le lien vers la position quand le contexte est perdu", async () => {
    renderMap(<Map center={CENTER} />);

    act(() => {
      maplibre.listeners.webglcontextlost?.({});
    });

    const lien = await screen.findByRole("link");
    expect(lien).toHaveAttribute("href", expect.stringContaining("openstreetmap.org"));
  });
});
