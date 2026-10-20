import { useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, Stack, StatusChip, useInView } from "@canop/ui";
import { squircleClip, tokens } from "@canop/ui";
import { Map, type CanopMapMarker } from "@canop/ui/map";
import "maplibre-gl/dist/maplibre-gl.css";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Map } from "@canop/ui/map";
import "maplibre-gl/dist/maplibre-gl.css";`;

const basicCode = `<Box height="20rem" borderRadius="0.75rem" overflow="hidden">
  <Map center={{ lat: 49.4431, lng: 1.0993 }} />
</Box>`;

const markersCode = `const MARKERS = [
  { id: "cathedrale", lat: 49.4404, lng: 1.0946 },
  { id: "gros-horloge", lat: 49.4425, lng: 1.0925 },
  { id: "vieux-marche", lat: 49.4432, lng: 1.0886 },
];

<Box height="20rem" borderRadius="0.75rem" overflow="hidden">
  <Map center={{ lat: 49.4425, lng: 1.0925 }} zoom={15} markers={MARKERS} />
</Box>`;

const popupCode = `const MARKERS = [
  {
    id: "cathedrale",
    lat: 49.4404,
    lng: 1.0946,
    popup: (
      <Stack gap="xs">
        <Typography fontWeight={700}>Cathédrale Notre-Dame</Typography>
        <StatusChip label="4,8 / 5" tone="success" />
      </Stack>
    ),
  },
];

<Map center={{ lat: 49.4404, lng: 1.0946 }} markers={MARKERS} />`;

const clickCode = `function LocationPicker() {
  const [position, setPosition] = useState({ lat: 49.4431, lng: 1.0993 });

  return (
    <Box height="20rem" borderRadius="0.75rem" overflow="hidden">
      <Map
        center={position}
        markers={[{ id: "selection", ...position }]}
        onMapClick={(lat, lng) => setPosition({ lat, lng })}
      />
    </Box>
  );
}`;

const recenterCode = `function RecenterDemo() {
  const [center, setCenter] = useState(ROUEN);

  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm">
        <Button onClick={() => setCenter(ROUEN)}>Rouen</Button>
        <Button onClick={() => setCenter(BORDEAUX)}>Bordeaux</Button>
      </Stack>
      <Box height="20rem" borderRadius="0.75rem" overflow="hidden">
        <Map center={center} markers={[{ id: "ville", ...center }]} />
      </Box>
    </Stack>
  );
}`;

const poiCode = `<Map center={ROUEN_CENTRE} zoom={17} />
<Map center={ROUEN_CENTRE} zoom={17} poi={["bar", "cafe", "fast_food"]} />`;

const boundariesCode = `<Map center={FRANCE} zoom={7} boundaries={["country", "region", "department"]} />
<Map center={FRANCE} zoom={7} boundaries={false} />`;

const frameCode = `<Map center={ROUEN} border elevation="md" />`;

const themeCode = `<Map center={ROUEN} zoom={13} styleMode="light" />
<Map center={ROUEN} zoom={13} styleMode="dark" />`;

const ROUEN = { lat: 49.4431, lng: 1.0993 };
const BORDEAUX = { lat: 44.8378, lng: -0.5792 };
const ROUEN_CENTRE = { lat: 49.4428, lng: 1.0932 };
const FRANCE = { lat: 48.7, lng: 2.4 };

const CITY_MARKERS: CanopMapMarker[] = [
  { id: "cathedrale", lat: 49.4404, lng: 1.0946 },
  { id: "gros-horloge", lat: 49.4425, lng: 1.0925 },
  { id: "vieux-marche", lat: 49.4432, lng: 1.0886 },
];

const POPUP_MARKERS: CanopMapMarker[] = [
  {
    id: "cathedrale",
    lat: 49.4404,
    lng: 1.0946,
    popup: (
      <Stack gap="xs">
        <Typography
          sx={{
            fontWeight: 700,
          }}
        >
          Cathédrale Notre-Dame
        </Typography>
        <StatusChip label="4,8 / 5" tone="success" />
      </Stack>
    ),
  },
];

/**
 * Le cadre d'une démonstration de carte, qui ne monte la carte **que pendant
 * qu'elle est à l'écran**.
 *
 * Cette page compte une douzaine de cartes. Chacune ouvre un contexte WebGL, et
 * **un navigateur mobile en plafonne le nombre** — huit sur Android, contre le
 * double sur un poste — puis **supprime les plus anciens** quand la page en
 * demande davantage. Toutes montées d'un coup, les premières perdaient donc leur
 * contexte : cadre blanc, boutons de zoom intacts, et le glyphe d'image cassée
 * que Chromium peint sur un canvas mort. Le défaut ne se voyait ni sur un poste,
 * ni en émulation — l'émulation tourne sur le GPU du poste et n'a pas ce
 * plafond.
 *
 * `once: false` est l'essentiel : la carte se démonte en sortant du champ et
 * rend son contexte, sans quoi on ne ferait que retarder l'épuisement.
 */
function MapFrame({ children }: { children: ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>({ once: false, amount: 0.01 });

  return (
    <Box
      ref={ref}
      sx={[
        {
          height: { xs: "16rem", md: "20rem" },
          width: "100%",
          overflow: "hidden",
        },
        squircleClip(tokens.radius.sm),
      ]}
    >
      {inView ? children : null}
    </Box>
  );
}

function ClickDemo() {
  const [position, setPosition] = useState(ROUEN);

  return (
    <Stack gap="sm">
      <MapFrame>
        <Map
          center={position}
          markers={[{ id: "selection", ...position }]}
          onMapClick={(lat, lng) => setPosition({ lat, lng })}
        />
      </MapFrame>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
        }}
      >
        {position.lat.toFixed(5)} / {position.lng.toFixed(5)}
      </Typography>
    </Stack>
  );
}

function RecenterDemo() {
  const [center, setCenter] = useState(ROUEN);

  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm">
        <Button onClick={() => setCenter(ROUEN)}>Rouen</Button>
        <Button onClick={() => setCenter(BORDEAUX)}>Bordeaux</Button>
      </Stack>
      <MapFrame>
        <Map center={center} markers={[{ id: "ville", ...center }]} />
      </MapFrame>
    </Stack>
  );
}

const fr = {
  intro:
    "Carte vectorielle sur socle MapLibre, exportée depuis le sous-chemin @canop/ui/map. Le style est celui du design system : construit à partir des tokens, il suit le thème clair ou sombre et réserve la couleur vive aux données. Le consommateur importe uniquement la feuille de style MapLibre.",
  sections: {
    basic: "Carte simple",
    markers: "Marqueurs",
    popup: "Bulles d'information",
    click: "Sélection d'un point",
    recenter: "Recentrage",
    theme: "Thème",
    poi: "Points d'intérêt",
    boundaries: "Frontières",
    frame: "Cadre et élévation",
    api: "API",
  },
  demos: {
    basicTitle: "center",
    basicDescription:
      "La carte remplit son conteneur : la hauteur, les coins arrondis et l'ombre restent chez le consommateur.",
    markersTitle: "markers",
    markersDescription: "Chaque marqueur porte un id stable, une latitude et une longitude.",
    popupTitle: "popup",
    popupDescription:
      "La propriété popup accepte n'importe quel contenu React, composé avec les composants CanopUI.",
    clickTitle: "onMapClick",
    clickDescription:
      "onMapClick reçoit la latitude et la longitude du clic : de quoi construire un sélecteur de position.",
    recenterTitle: "Changement de center",
    recenterDescription:
      "La carte se recentre d'elle-même quand center change, sans prop supplémentaire.",
    poiTitle: "poi",
    boundariesTitle: "boundaries",
    frameTitle: "border, elevation et radius",
    themeTitle: "styleMode",
    themeDescription:
      "Le style suit le thème CanopUI sans configuration. styleMode fige un thème quand la carte doit rester claire ou sombre quoi qu'il arrive.",
    poiDescription:
      "À partir du zoom 15, commerces et équipements portent les icônes du jeu CanopUI, recolorées par le thème : bars, cafés, restaurants, santé, culture. poi={false} rend le fond muet quand le portail ne veut montrer que ses propres repères.",
    boundariesDescription:
      "Chaque niveau a son seuil de zoom : le pays dès le début, la région à partir du zoom 4, le département à partir du zoom 7. À gauche les trois niveaux, à droite aucun.",
    frameDescription:
      "La carte se pose comme une surface CanopUI : border trace un filet, elevation la soulève d'une ombre portée, radius règle l'arrondi en squircle.",
  },
  props: {
    center: "Coordonnées du centre. Un changement recentre la carte automatiquement.",
    zoom: "Niveau de zoom initial.",
    styleMode: "Thème du style de carte : auto suit le thème CanopUI, light et dark le forcent.",
    poi: 'true affiche tous les points d\'intérêt du fond avec les icônes CanopUI, false les masque, et un tableau de classes ne garde que celles-là — par exemple ["bar", "cafe"].',
    boundaries:
      "true trace les frontières nationales et régionales, false n'en trace aucune, et un tableau choisit les niveaux : country, region, department.",
    border: "Trace un filet d'un pixel autour de la carte, découpé en squircle.",
    elevation: "Ombre portée sous la carte, sur l'échelle d'élévation de la librairie.",
    radius:
      "Rayon des coins. Vaut le rayon md dès qu'un cadre ou une élévation est demandé, 0 sinon.",
    gestures:
      "cooperative demande deux doigts (ou Ctrl + molette) pour manipuler la carte, ce qui laisse la page défiler ; direct rend la carte directement manipulable, pour un écran où elle est le contenu principal.",
    tiles:
      "Surcharge de la source de tuiles (url TileJSON, glyphs, attribution, polices). Le style reste celui de CanopUI.",
    ariaLabel: "Nom accessible de la carte.",
    markers: "Liste des marqueurs, rendus avec l'épingle CanopUI.",
    onMapClick: "Appelé avec la latitude et la longitude du clic sur la carte.",
    height: "Hauteur du conteneur de carte. Préférez une valeur en rem ou en pourcentage.",
  },
  note: "Le sous-chemin @canop/ui/map déclare maplibre-gl en peer dependency optionnelle, une seule : les projets sans carte n'ont rien à installer. Les tuiles par défaut viennent d'OpenFreeMap, et la prop tiles permet d'en changer, par exemple pour une source hébergée par QVL.",
};

const en: typeof fr = {
  intro:
    "Vector map built on MapLibre, exported from the @canop/ui/map subpath. The style is the design system own: built from the tokens, it follows the light or dark theme and reserves vivid colour for the data. The consumer only imports the MapLibre stylesheet.",
  sections: {
    basic: "Simple map",
    markers: "Markers",
    popup: "Popups",
    click: "Point selection",
    recenter: "Recentering",
    theme: "Theme",
    poi: "Points of interest",
    boundaries: "Borders",
    frame: "Frame and elevation",
    api: "API",
  },
  demos: {
    basicTitle: "center",
    basicDescription:
      "The map fills its container: height, rounded corners and shadow stay on the consumer side.",
    markersTitle: "markers",
    markersDescription: "Each marker carries a stable id, a latitude and a longitude.",
    popupTitle: "popup",
    popupDescription:
      "The popup property accepts any React content, composed with CanopUI components.",
    clickTitle: "onMapClick",
    clickDescription:
      "onMapClick receives the latitude and longitude of the click: enough to build a location picker.",
    recenterTitle: "center change",
    recenterDescription: "The map recenters itself when center changes, with no extra prop.",
    poiTitle: "poi",
    boundariesTitle: "boundaries",
    frameTitle: "border, elevation et radius",
    themeTitle: "styleMode",
    themeDescription:
      "The style follows the CanopUI theme with no configuration. styleMode pins a theme when the map must stay light or dark whatever happens.",
    poiDescription:
      "From zoom 15, shops and amenities carry icons from the CanopUI set, recoloured by the theme: bars, cafes, restaurants, health, culture. poi={false} mutes the basemap when the portal only wants its own markers.",
    boundariesDescription:
      "Each level has its own zoom threshold: country from the start, region from zoom 4, department from zoom 7. All three levels on the left, none on the right.",
    frameDescription:
      "The map sits as a CanopUI surface: border draws a hairline, elevation lifts it with a drop shadow, radius sets the squircle corner.",
  },
  props: {
    center: "Coordinates of the center. A change recenters the map automatically.",
    zoom: "Initial zoom level.",
    styleMode: "Map style theme: auto follows the CanopUI theme, light and dark force it.",
    poi: 'true shows every basemap point of interest with CanopUI icons, false hides them, and an array of classes keeps only those — for instance ["bar", "cafe"].',
    boundaries:
      "true draws national and regional borders, false draws none, and an array picks the levels: country, region, department.",
    border: "Draws a one pixel hairline around the map, clipped as a squircle.",
    elevation: "Drop shadow under the map, on the library elevation scale.",
    radius:
      "Corner radius. Defaults to the md radius as soon as a frame or an elevation is asked for, 0 otherwise.",
    gestures:
      "cooperative requires two fingers (or Ctrl + scroll) to manipulate the map, which leaves the page scrolling; direct makes the map directly manipulable, for a screen where it is the main content.",
    tiles:
      "Overrides the tile source (TileJSON url, glyphs, attribution, fonts). The style stays CanopUI own.",
    ariaLabel: "Accessible name of the map.",
    markers: "List of markers, rendered with the CanopUI pin.",
    onMapClick: "Called with the latitude and longitude of the click on the map.",
    height: "Height of the map container. Prefer a rem or percentage value.",
  },
  note: "The @canop/ui/map subpath declares maplibre-gl as its single optional peer dependency: projects without a map have nothing to install. Default tiles come from OpenFreeMap, and the tiles prop swaps the source, for instance for one hosted by QVL.",
};

const texts = { fr, en };

export default function MapDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    {
      name: "center",
      type: "{ lat: number; lng: number }",
      required: true,
      description: t.props.center,
    },
    { name: "zoom", type: "number", defaultValue: "15", description: t.props.zoom },
    {
      name: "markers",
      type: "CanopMapMarker[]",
      defaultValue: "[]",
      description: t.props.markers,
    },
    {
      name: "onMapClick",
      type: "(lat: number, lng: number) => void",
      description: t.props.onMapClick,
    },
    {
      name: "height",
      type: "number | string",
      defaultValue: '"100%"',
      description: t.props.height,
    },
    {
      name: "styleMode",
      type: '"auto" | "light" | "dark"',
      defaultValue: '"auto"',
      description: t.props.styleMode,
    },
    {
      name: "poi",
      type: "boolean | CanopMapPoiClass[]",
      defaultValue: "true",
      description: t.props.poi,
    },
    {
      name: "boundaries",
      type: "boolean | CanopMapBoundary[]",
      defaultValue: "true",
      description: t.props.boundaries,
    },
    {
      name: "border",
      type: "boolean",
      defaultValue: "false",
      description: t.props.border,
    },
    {
      name: "elevation",
      type: '"none" | "sm" | "md" | "lg"',
      defaultValue: '"none"',
      description: t.props.elevation,
    },
    {
      name: "radius",
      type: "string",
      description: t.props.radius,
    },
    {
      name: "gestures",
      type: '"cooperative" | "direct"',
      defaultValue: '"cooperative"',
      description: t.props.gestures,
    },
    {
      name: "tiles",
      type: "Partial<CanopMapTiles>",
      description: t.props.tiles,
    },
    {
      name: "ariaLabel",
      type: "string",
      description: t.props.ariaLabel,
    },
  ];

  return (
    <DocPage title="Map" intro={t.intro} importCode={importCode}>
      <Typography
        sx={{
          color: "text.secondary",
        }}
      >
        {t.note}
      </Typography>
      <DocSection title={t.sections.basic}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
          align="stretch"
        >
          <MapFrame>
            <Map center={ROUEN} />
          </MapFrame>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.markers}>
        <DemoCard
          title={t.demos.markersTitle}
          description={t.demos.markersDescription}
          code={markersCode}
          align="stretch"
        >
          <MapFrame>
            <Map center={{ lat: 49.4425, lng: 1.0925 }} markers={CITY_MARKERS} />
          </MapFrame>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.popup}>
        <DemoCard
          title={t.demos.popupTitle}
          description={t.demos.popupDescription}
          code={popupCode}
          align="stretch"
        >
          <MapFrame>
            <Map center={{ lat: 49.4404, lng: 1.0946 }} zoom={16} markers={POPUP_MARKERS} />
          </MapFrame>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.click}>
        <DemoCard
          title={t.demos.clickTitle}
          description={t.demos.clickDescription}
          code={clickCode}
          align="stretch"
        >
          <ClickDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.recenter}>
        <DemoCard
          title={t.demos.recenterTitle}
          description={t.demos.recenterDescription}
          code={recenterCode}
          align="stretch"
        >
          <RecenterDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.poi}>
        <DemoCard
          title={t.demos.poiTitle}
          description={t.demos.poiDescription}
          code={poiCode}
          align="stretch"
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: "1rem",
              width: "100%",
            }}
          >
            <MapFrame>
              <Map center={ROUEN_CENTRE} zoom={17} />
            </MapFrame>
            <MapFrame>
              <Map center={ROUEN_CENTRE} zoom={17} poi={["bar", "cafe", "fast_food"]} />
            </MapFrame>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.boundaries}>
        <DemoCard
          title={t.demos.boundariesTitle}
          description={t.demos.boundariesDescription}
          code={boundariesCode}
          align="stretch"
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: "1rem",
              width: "100%",
            }}
          >
            <MapFrame>
              <Map center={FRANCE} zoom={7} boundaries={["country", "region", "department"]} />
            </MapFrame>
            <MapFrame>
              <Map center={FRANCE} zoom={7} boundaries={false} />
            </MapFrame>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.frame}>
        <DemoCard
          title={t.demos.frameTitle}
          description={t.demos.frameDescription}
          code={frameCode}
          align="stretch"
        >
          <Box
            sx={{
              height: { xs: "16rem", md: "20rem" },
              width: "100%",
              padding: "0.75rem",
            }}
          >
            <Map center={ROUEN} zoom={13} border elevation="md" />
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.theme}>
        <DemoCard
          title={t.demos.themeTitle}
          description={t.demos.themeDescription}
          code={themeCode}
          align="stretch"
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: "1rem",
              width: "100%",
            }}
          >
            <MapFrame>
              <Map center={ROUEN} zoom={13} styleMode="light" />
            </MapFrame>
            <MapFrame>
              <Map center={ROUEN} zoom={13} styleMode="dark" />
            </MapFrame>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
