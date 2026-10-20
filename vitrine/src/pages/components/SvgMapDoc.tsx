import { useCallback, useMemo, useState } from "react";
import franceMap from "@svg-maps/france.departments";
import {
  Button,
  Legend,
  Stack,
  StatusChip,
  SvgMap,
  Text,
  useSvgMapViewport,
  useTransientState,
  type CanopSvgMapRegion,
} from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { SvgMap, useSvgMapViewport } from "@canop/ui";`;

const usageCode = `<SvgMap
  viewBox={france.viewBox}
  regions={franceMap.locations}
  selectable
  onSelect={(id) => repondre(id)}
  fill={(id) => couleurDe(id)}
  stroke="var(--canop-palette-text-disabled)"
/>`;

const viewportCode = `const viewport = useSvgMapViewport({ viewBox: franceMap.viewBox });

<Button onClick={() => viewport.fitTo(IDF)}>Île-de-France</Button>
<SvgMap viewport={viewport} viewBox={france.viewBox} regions={regions} />`;

// Les types du paquet renvoient vers un module qui n'est pas installé, donc
// tout y arrive en `any`. On redit la forme ici plutôt que de laisser passer
// un `any` implicite dans la démonstration.
interface FranceLocation {
  id: string;
  name: string;
  path: string;
}

const france = franceMap as unknown as { viewBox: string; locations: FranceLocation[] };

const REGIONS: CanopSvgMapRegion[] = france.locations.map((location) => ({
  id: location.id,
  path: location.path,
  name: `${location.name} (${location.id})`,
}));

const NOMS = new Map(REGIONS.map((region) => [region.id, region.name ?? region.id]));

const IDF = ["75", "92", "93", "94", "91", "95", "77", "78"];

const NEUTRE = "var(--canop-palette-background-paper)";
const CONTOUR_LISIBLE = "var(--canop-palette-text-disabled)";
const CIBLE = "var(--canop-palette-primary-main)";
const JUSTE = "var(--canop-palette-success-main)";
const FAUX = "var(--canop-palette-error-main)";

/** Une progression plausible et stable, pour montrer le coloriage. */
function niveauDe(id: string): number {
  let hash = 2166136261;
  for (const caractere of id) {
    hash ^= caractere.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % 4;
}

const CHALEUR = [
  NEUTRE,
  "var(--canop-palette-error-main)",
  "var(--canop-palette-warning-main)",
  "var(--canop-palette-success-main)",
];

function tirer(): string {
  return REGIONS[Math.floor(Math.random() * REGIONS.length)].id;
}

interface Verdict {
  choisi: string;
  attendu: string;
  juste: boolean;
}

function Jeu({ labels }: { labels: { prompt: string; score: string; next: string } }) {
  const [cible, setCible] = useState(tirer);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const { value: verdict, show } = useTransientState<Verdict | null>(null);

  const repondre = useCallback(
    (id: string) => {
      if (verdict) return;
      const juste = id === cible;
      setScore((current) => ({ ok: current.ok + (juste ? 1 : 0), total: current.total + 1 }));
      show({ choisi: id, attendu: cible, juste }, juste ? 700 : 1600);
      window.setTimeout(() => setCible(tirer()), juste ? 700 : 1600);
    },
    [cible, show, verdict],
  );

  const fill = useCallback(
    (id: string) => {
      if (!verdict) return NEUTRE;
      if (id === verdict.attendu) return verdict.juste ? JUSTE : CIBLE;
      if (id === verdict.choisi) return FAUX;
      return NEUTRE;
    },
    [verdict],
  );

  return (
    <Stack gap="md" alignItems="stretch">
      <Stack direction="row" gap="md" alignItems="center" wrap>
        <Text variant="body-md">
          {labels.prompt} <strong>{NOMS.get(cible)}</strong>
        </Text>
        <StatusChip
          tone={verdict ? (verdict.juste ? "success" : "error") : "neutral"}
          label={`${labels.score} ${score.ok}/${score.total}`}
        />
      </Stack>
      <SvgMap
        viewBox={france.viewBox}
        regions={REGIONS}
        selectable
        onSelect={repondre}
        fill={fill}
        stroke={CONTOUR_LISIBLE}
        ariaLabel="Carte des départements français"
      />
      <Stack direction="row" gap="sm">
        <Button size="small" variant="secondary" onClick={() => setCible(tirer())}>
          {labels.next}
        </Button>
      </Stack>
    </Stack>
  );
}

function Coloriage({ labels }: { labels: string[] }) {
  const fill = useCallback((id: string) => CHALEUR[niveauDe(id)], []);

  return (
    <Stack gap="md" alignItems="stretch">
      <Legend
        items={[
          { label: labels[3], tone: "success" },
          { label: labels[2], tone: "warning" },
          { label: labels[1], tone: "error" },
          { label: labels[0], tone: "neutral" },
        ]}
      />
      <SvgMap
        viewBox={france.viewBox}
        regions={REGIONS}
        fill={fill}
        ariaLabel="Progression par département"
      />
    </Stack>
  );
}

function Cadrage({ labels }: { labels: { idf: string; whole: string } }) {
  const viewport = useSvgMapViewport({ viewBox: france.viewBox });
  const regions = useMemo(() => REGIONS, []);

  return (
    <Stack gap="md" alignItems="stretch">
      <Stack direction="row" gap="sm" wrap>
        <Button size="small" onClick={() => viewport.fitTo(IDF)}>
          {labels.idf}
        </Button>
        <Button
          size="small"
          variant="secondary"
          onClick={viewport.reset}
          disabled={!viewport.zoomed}
        >
          {labels.whole}
        </Button>
        <Text variant="code">{viewport.viewBox}</Text>
      </Stack>
      <SvgMap
        viewport={viewport}
        viewBox={france.viewBox}
        regions={regions}
        controls={false}
        ariaLabel="Carte cadrable"
      />
    </Stack>
  );
}

const fr = {
  intro:
    "Une carte SVG qu'on désigne au doigt : pincement pour zoomer, glissement pour se déplacer, molette au bureau. Ce n'est pas le composant Map, qui affiche une carte géographique tuilée avec MapLibre — ici, le dessin est fourni par l'appelant sous forme de tracés, et le composant s'occupe de la vue, des gestes et de la sélection.",
  sections: { usage: "Désigner", paint: "Colorier", frame: "Cadrer", api: "API" },
  demos: {
    usageTitle: "Trouvez le département",
    usageDescription:
      "Pincez, glissez, cliquez. Le point important est invisible quand il marche : un glissement se termine forcément sur une région, donc sans seuil de tolérance, se déplacer sur la carte vaudrait réponse. Au-delà de six pixels, le contact devient un déplacement et le clic qui suit est ignoré — mais un doigt n'est jamais parfaitement immobile, donc en dessous il compte. Les régions sont aussi atteignables au clavier : la carte passe de rôle image à rôle groupe dès qu'elle est sélectionnable, sinon le sous-arbre serait décoratif et les régions disparaîtraient des lecteurs d'écran.",
    usagePrompt: "Cliquez sur :",
    usageScore: "score",
    usageNext: "Passer",
    paintTitle: "Une couleur par région",
    paintDescription:
      "La fonction de remplissage est appelée à chaque rendu, pour chaque région : c'est ce qui permet une carte de chaleur, un résultat de partie ou une sélection sans que le composant connaisse la moindre règle métier. Ici, un niveau stable est déduit du numéro du département.",
    paintNever: "jamais croisé",
    paintWeak: "à revoir",
    paintMid: "moyen",
    paintStrong: "maîtrisé",
    frameTitle: "Cadrer de l'extérieur",
    frameDescription:
      "La vue peut être tenue par l'appelant, ce qui lui permet de cadrer sur un ensemble de régions — ici les huit départements d'Île-de-France, illisibles à la vue d'ensemble. Le cadrage garde le rapport de la carte : cadrer sur la largeur seule couperait un ensemble plus haut que large, ce qui est le cas de la plupart des groupes de régions. Et il reste centré même quand l'ensemble est plus petit que le zoom maximal ne l'autorise.",
    frameIdf: "Île-de-France",
    frameWhole: "Vue d'ensemble",
  },
  props: {
    controlsViewport: "La vue à piloter, celle que renvoie useSvgMapViewport.",
    controlsStep:
      "Pas de zoom des boutons. 1,6 est plus franc que la molette : un bouton qu'on clique doit se voir agir, là où la molette avance par petites touches. La vue d'ensemble n'apparaît que lorsqu'on est zoomé, un bouton qui ne ferait rien valant moins qu'un bouton absent.",
    viewBox: "Vue d'ensemble du SVG, au format de l'attribut viewBox.",
    regions: "Les tracés, détaillés plus bas : un identifiant, un chemin, et deux étiquettes.",
    fill: "Couleur de remplissage d'une région. Appelée à chaque rendu.",
    regionId: "Identifiant de la région, renvoyé par onSelect.",
    regionPath: "Le tracé, tel quel : l'attribut d d'un path.",
    regionName:
      "Nom lisible, affiché en infobulle au survol, et nom accessible à défaut d'ariaLabel.",
    regionAriaLabel:
      "Nom accessible de la région, jamais affiché. Le nom accessible se résout dans l'ordre ariaLabel, name, puis l'identifiant en dernier recours — un bouton sans nom accessible étant pire encore. C'est ce dernier repli qui piège les jeux de désignation : ils retirent name pour qu'aucune infobulle ne vende la réponse au survol, et un lecteur d'écran annonce alors l'identifiant, c'est-à-dire la réponse. Dès que l'identifiant porte l'information à deviner, poser ariaLabel.",
    stroke:
      "Couleur du contour des régions. Le défaut divider est le trait discret qui sépare deux surfaces : il convient à une carte illustrative, mais pas à une carte dont le découpage porte l'information. En thème sombre, divider est lui-même une surface neutre et le contour y plafonne à 1,47:1, sous le 3:1 des objets graphiques ; text.disabled est le plus discret qui approche le seuil dans les deux thèmes.",
    onSelect: "Appelé avec l'identifiant de la région désignée.",
    selectable:
      "Rend les régions cliquables et atteignables au clavier. Sans elle, la carte reste une image qui se déplace et se zoome.",
    viewport: "Vue partagée avec l'appelant, pour piloter le cadrage de l'extérieur.",
    maxZoom: "Zoom maximal, en facteur de la vue d'ensemble.",
    maxWidth:
      "Largeur maximale de la carte, centrée dans son conteneur au-delà. Une carte occupe toute la largeur qu'on lui laisse et sa hauteur suit le rapport du viewBox : sous un conteneur large, une vue presque carrée dépasse l'écran en hauteur.",
    maxHeight:
      "Hauteur maximale de la carte, traduite en largeur au rapport du viewBox. Une carte tire sa hauteur de sa largeur : posée telle quelle, une hauteur maximale ne rétrécirait rien, elle laisserait le dessin déborder du cadre. Traduite, elle borne réellement la carte et le cadre reste collé au dessin, donc les commandes de zoom aussi. C'est la borne qui compte sur un écran de bureau peu haut, où une vue presque carrée est plafonnée par la hauteur utile bien avant de l'être par la largeur. Avec maxWidth, la plus serrée des deux l'emporte.",
    controls: "Boutons de zoom intégrés.",
    tapTolerance:
      "Déplacement, en pixels, au-delà duquel un contact devient un glissement et le clic qui suit est ignoré.",
    wheel: "Zoom à la molette.",
    overlay: "Posé au-dessus de la carte : légende, commandes maison, consigne.",
    fitTo: "Cadre sur un ensemble de régions, désignées par leur identifiant.",
    zoomBy: "Un facteur inférieur à 1 rapproche, supérieur éloigne.",
    reset: "Revient à la vue d'ensemble.",
    zoomed: "Vrai dès que la vue est plus serrée que la vue d'ensemble.",
  },
  credit:
    "Tracés des départements : svg-maps de Victor Cazanave, sous licence CC-BY-4.0. Ils ne font pas partie de la librairie — la vitrine les installe pour la démonstration.",
};

const en = {
  intro:
    "An SVG map you point at with a finger: pinch to zoom, drag to pan, wheel on the desktop. This is not the Map component, which shows a tiled geographic map through MapLibre — here the drawing comes from the caller as paths, and the component handles the view, the gestures and the selection.",
  sections: { usage: "Pointing", paint: "Painting", frame: "Framing", api: "API" },
  demos: {
    usageTitle: "Find the department",
    usageDescription:
      "Pinch, drag, click. The important part is invisible when it works: a drag always ends on a region, so with no tolerance threshold, panning the map would count as an answer. Past six pixels the contact becomes a drag and the click that follows is ignored — but a finger is never perfectly still, so below that it counts. Regions are keyboard-reachable too: the map switches from image role to group role as soon as it is selectable, otherwise the subtree would be decorative and the regions would vanish from screen readers.",
    usagePrompt: "Click on:",
    usageScore: "score",
    usageNext: "Skip",
    paintTitle: "One colour per region",
    paintDescription:
      "The fill function is called on every render, for every region: that is what allows a heatmap, a round result or a selection without the component knowing a single business rule. Here a stable level is derived from the department number.",
    paintNever: "never seen",
    paintWeak: "needs work",
    paintMid: "getting there",
    paintStrong: "mastered",
    frameTitle: "Framing from outside",
    frameDescription:
      "The view can be held by the caller, which lets it frame a set of regions — here the eight departments around Paris, unreadable at the overview. Framing keeps the map's aspect ratio: framing on width alone would crop a set taller than it is wide, which is the case for most region groups. And it stays centred even when the set is smaller than the maximum zoom allows.",
    frameIdf: "Paris region",
    frameWhole: "Overview",
  },
  props: {
    controlsViewport: "The viewport to drive, the one useSvgMapViewport returns.",
    controlsStep:
      "Zoom step of the buttons. 1.6 is bolder than the wheel: a button you click must be seen to act, where the wheel advances in small touches. The overview button only appears once zoomed in, since a button that would do nothing is worth less than an absent one.",
    viewBox: "The SVG overview, in the viewBox attribute format.",
    regions: "The paths, detailed below: an id, a path, and two labels.",
    fill: "Fill colour for a region. Called on every render.",
    regionId: "Id of the region, handed back by onSelect.",
    regionPath: "The path itself: the d attribute of a path element.",
    regionName:
      "Readable name, shown as a hover tooltip, and accessible name when ariaLabel is absent.",
    regionAriaLabel:
      "Accessible name of the region, never displayed. The accessible name resolves as ariaLabel, then name, then the id as a last resort — a button with no accessible name being worse still. That last fallback is what traps pointing games: they drop name so no tooltip gives the answer away on hover, and a screen reader then announces the id, which is the answer. As soon as the id carries what is to be guessed, set ariaLabel.",
    stroke:
      "Region outline colour. The divider default is the quiet line that separates two surfaces: fine for an illustrative map, not for one whose outlines carry the information. In dark mode divider is itself a neutral surface and the outline tops out at 1.47:1, below the 3:1 required of graphical objects; text.disabled is the quietest one that comes close to the threshold in both themes.",
    onSelect: "Called with the id of the region pointed at.",
    selectable:
      "Makes regions clickable and keyboard-reachable. Without it the map stays an image that pans and zooms.",
    viewport: "View shared with the caller, to drive framing from outside.",
    maxZoom: "Maximum zoom, as a factor of the overview.",
    maxWidth:
      "Maximum width of the map, centred in its container beyond that. A map takes all the width it is given and its height follows the viewBox ratio: under a wide container, a nearly square view runs off the screen vertically.",
    maxHeight:
      "Maximum height of the map, translated into a width through the viewBox ratio. A map draws its height from its width: set as is, a maximum height would shrink nothing, it would let the drawing spill out of its frame. Translated, it truly bounds the map and the frame stays glued to the drawing, so the zoom controls do too. It is the bound that matters on a short desktop screen, where a nearly square view is capped by the usable height long before it is capped by the width. With maxWidth, the tighter of the two wins.",
    controls: "Built-in zoom buttons.",
    tapTolerance:
      "Movement, in pixels, past which a contact becomes a drag and the following click is ignored.",
    wheel: "Wheel zoom.",
    overlay: "Placed over the map: legend, custom controls, prompt.",
    fitTo: "Frames a set of regions, given by their ids.",
    zoomBy: "A factor below 1 zooms in, above 1 zooms out.",
    reset: "Returns to the overview.",
    zoomed: "True as soon as the view is tighter than the overview.",
  },
  credit:
    "Department paths: svg-maps by Victor Cazanave, licensed CC-BY-4.0. They are not part of the library — the showcase installs them for the demonstration.",
};

const texts = { fr, en };

export default function SvgMapDoc() {
  const t = texts[useDocLocale()];

  const mapRows: PropRow[] = [
    { name: "viewBox", type: "string", required: true, description: t.props.viewBox },
    {
      name: "regions",
      type: "readonly CanopSvgMapRegion[]",
      required: true,
      description: t.props.regions,
    },
    { name: "fill", type: "(id: string) => string", defaultValue: "—", description: t.props.fill },
    {
      name: "stroke",
      type: "string",
      defaultValue: "var(--canop-palette-divider)",
      description: t.props.stroke,
    },
    {
      name: "onSelect",
      type: "(id: string) => void",
      defaultValue: "—",
      description: t.props.onSelect,
    },
    { name: "selectable", type: "boolean", defaultValue: "false", description: t.props.selectable },
    {
      name: "viewport",
      type: "UseSvgMapViewportResult",
      defaultValue: "—",
      description: t.props.viewport,
    },
    { name: "maxZoom", type: "number", defaultValue: "9", description: t.props.maxZoom },
    { name: "maxWidth", type: "string", defaultValue: "—", description: t.props.maxWidth },
    { name: "maxHeight", type: "string", defaultValue: "—", description: t.props.maxHeight },
    { name: "controls", type: "boolean", defaultValue: "true", description: t.props.controls },
    { name: "tapTolerance", type: "number", defaultValue: "6", description: t.props.tapTolerance },
    { name: "wheel", type: "boolean", defaultValue: "true", description: t.props.wheel },
    { name: "overlay", type: "ReactNode", defaultValue: "—", description: t.props.overlay },
  ];

  const regionRows: PropRow[] = [
    { name: "id", type: "string", required: true, description: t.props.regionId },
    { name: "path", type: "string", required: true, description: t.props.regionPath },
    { name: "name", type: "string", defaultValue: "—", description: t.props.regionName },
    { name: "ariaLabel", type: "string", defaultValue: "—", description: t.props.regionAriaLabel },
  ];

  const controlsRows: PropRow[] = [
    {
      name: "viewport",
      type: "UseSvgMapViewportResult",
      required: true,
      description: t.props.controlsViewport,
    },
    { name: "step", type: "number", defaultValue: "1.6", description: t.props.controlsStep },
  ];

  const viewportRows: PropRow[] = [
    { name: "viewBox", type: "string", description: t.props.viewBox },
    {
      name: "fitTo",
      type: "(ids: readonly string[], options?) => void",
      description: t.props.fitTo,
    },
    { name: "zoomBy", type: "(factor: number, origin?) => void", description: t.props.zoomBy },
    { name: "reset", type: "() => void", description: t.props.reset },
    { name: "zoomed", type: "boolean", description: t.props.zoomed },
  ];

  return (
    <DocPage title="SVG map" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.usageTitle}
          description={t.demos.usageDescription}
          code={usageCode}
          align="stretch"
        >
          <Jeu
            labels={{
              prompt: t.demos.usagePrompt,
              score: t.demos.usageScore,
              next: t.demos.usageNext,
            }}
          />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.paint}>
        <DemoCard
          title={t.demos.paintTitle}
          description={t.demos.paintDescription}
          code={`fill={(id) => CHALEUR[niveauDe(id)]}`}
          align="stretch"
        >
          <Coloriage
            labels={[t.demos.paintNever, t.demos.paintWeak, t.demos.paintMid, t.demos.paintStrong]}
          />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.frame}>
        <DemoCard
          title={t.demos.frameTitle}
          description={t.demos.frameDescription}
          code={viewportCode}
          align="stretch"
        >
          <Cadrage labels={{ idf: t.demos.frameIdf, whole: t.demos.frameWhole }} />
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.api}>
        <PropsTable title="<SvgMap />" rows={mapRows} />
        <PropsTable title="CanopSvgMapRegion" rows={regionRows} />
        <PropsTable title="<SvgMapControls />" rows={controlsRows} />
        <PropsTable title="useSvgMapViewport()" rows={viewportRows} />
        <Text variant="caption" tone="muted">
          {t.credit}
        </Text>
      </DocSection>
    </DocPage>
  );
}
