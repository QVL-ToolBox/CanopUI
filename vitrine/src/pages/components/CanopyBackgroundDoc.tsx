import {
  Card,
  CanopyBackground,
  type CanopCanopySceneMode,
  type CanopSegmentedControlOption,
} from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DemoViewport } from "../../kit/DemoViewport";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { SingleLiveScope } from "../../kit/SingleLiveScope";
import { useDocLocale } from "../../i18n/useDocLocale";
import { CanopyLiveFrame } from "./canopy/CanopyLiveFrame";
import { CanopyQualityDemo } from "./canopy/CanopyQualityDemo";
import { CanopyVariantDemo } from "./canopy/CanopyVariantDemo";

const importCode = `import { CanopyBackground } from "@canop/ui";`;

const basicCode = `<CanopyBackground minHeight="24rem">
  <Card title="CanopUI">Canopée vue du sol vers le zénith.</Card>
</CanopyBackground>`;

const sceneModeCode = `<CanopyBackground sceneMode="light" minHeight="100%" />
<CanopyBackground sceneMode="dark" minHeight="100%" />`;

const staticCode = `<CanopyBackground animated={false} minHeight="100%">
  <Card title="Image d'affiche">
    animated={false} sert l'affiche seule. Le mouvement réduit fait de même,
    sans qu'on ait rien à passer.
  </Card>
</CanopyBackground>`;

const qualityCode = `// auto, par défaut : 1080p, puis 720p, puis l'affiche si la machine ou le réseau peinent
<CanopyBackground />

// Forcer un niveau
<CanopyBackground quality="high" />
<CanopyBackground quality="low" />

// Suivre la décision
<CanopyBackground onQualityChange={({ level, reason }) => console.info(level, reason)} />`;

const veilCode = `<CanopyBackground veil={0} minHeight="100%" />
<CanopyBackground veil={0.75} minHeight="100%" />`;

const scenesCode = `// vite.config.ts — une fois, et les scènes sont servies
import { canopyVideo } from "@canop/ui/vite";

export default defineConfig({ plugins: [react(), canopyVideo()] });

// Surcharge ponctuelle, par thème et par format
<CanopyBackground
  scenes={{
    light: { webm: "https://cdn.qvl-project.com/canopy-light.webm" },
  }}
/>

// Ou les dix URL d'un coup, 720p comprises, depuis une autre base
const scenes = canopyScenesFrom("https://cdn.qvl-project.com/canopy");`;

const fr = {
  intro:
    "Fond animé de la librairie : une canopée filmée du sol vers le zénith, rendue sous Blender en boucle de 10 secondes qui raccorde exactement. Deux scènes sont embarquées, une par thème, et le composant choisit la bonne sans configuration. C'est le fond par défaut de PageScaffold.",
  sections: {
    basic: "Usage de base",
    sceneMode: "Scène et thème",
    static: "Sans mouvement",
    quality: "Qualité adaptative",
    veil: "Voile de lisibilité",
    scenes: "Servir les scènes",
    api: "API",
  },
  quality: {
    quality: "Qualité demandée",
    qualities: { auto: "Auto", high: "Pleine", low: "Légère" },
    level: "Niveau servi",
    reason: "Raison",
    pending: "…",
    levels: { high: "Vidéo 1080p", medium: "Vidéo 720p", low: "Affiche fixe" },
    reasons: {
      forced: "Imposé par la prop quality",
      capable: "Machine et réseau à l'aise",
      disabled: "Animation coupée (animated={false})",
      "reduced-motion": "Mouvement réduit demandé par le système",
      "save-data": "Économiseur de données actif",
      "slow-network": "Connexion très lente (2G)",
      "limited-network": "Connexion limitée (3G, débit < 2 Mb/s)",
      "modest-device": "Appareil modeste (mémoire)",
      "small-screen": "Écran couvert par le 720p",
      "low-frame-rate": "Images perdues à la lecture",
      buffering: "Lecture interrompue par la mise en mémoire tampon",
    },
    cardTitle: "Qualité adaptative",
    cardBody: "Choisissez un niveau : le composant annonce celui qu'il sert et pourquoi.",
  },
  demos: {
    basic: {
      title: "Fond avec contenu centré",
      description:
        "Le contenu est centré au-dessus de la scène. minHeight vaut 100vh par défaut ; passez une hauteur, ou 100% pour épouser un parent dimensionné. Sur cette page, seule la démo la plus visible joue sa vidéo, les autres montrent l'affiche.",
    },
    sceneMode: {
      title: "Une scène par thème",
      description:
        "Par défaut la scène suit le thème actif. sceneMode fige l'une des deux, comme styleMode le fait sur Map. Le sélecteur passe de l'une à l'autre.",
      ariaLabel: "Scène affichée",
      options: { light: "Clair", dark: "Sombre" },
    },
    static: {
      title: "Affiche seule",
      description:
        "Le composant n'anime rien quand l'utilisateur a demandé un mouvement réduit : il rend l'image d'affiche, qui est l'image 1 de la boucle. animated={false} force ce comportement.",
    },
    quality: {
      title: "Niveau servi et raison",
      description:
        "En auto, la vidéo 1080p est servie à l'identique, mais l'affiche est peinte d'abord, la vidéo ne se télécharge qu'à l'approche de l'écran, apparaît en fondu dès sa première image jouée, et se met en pause hors écran ou onglet masqué. Le composant descend d'un cran — vers la variante 720p, fournie par défaut (scenes.lite), puis vers l'affiche fixe — si la connexion est limitée (3G, débit sous 2 Mb/s), si l'appareil annonce peu de mémoire, si la lecture perd plus d'une image sur cinq deux mesures de suite, ou si elle se bloque deux fois en mise en mémoire tampon ; il ne remonte jamais. Un écran couvert par le 720p n'y descend que si la variante existe. Économiseur de données et 2G passent directement à l'affiche. Il préfère aussi le MP4 au WebM quand le VP9 n'est pas décodé par la carte graphique. high impose la vidéo 1080p, low l'affiche. Pour voir la descente en auto : Chrome DevTools, Network > Slow 3G puis recharger, ou Performance > CPU 6x slowdown.",
    },
    veil: {
      title: "Voile à 0 ou à 0,75",
      description:
        "Un voile de la couleur de fond est posé entre la scène et le contenu, pour que le texte reste lisible sur un feuillage chargé. Il vaut 0,32 en clair et 0,24 en sombre.",
      ariaLabel: "Opacité du voile",
      options: { none: "veil = 0", dense: "veil = 0,75" },
    },
    scenes: {
      title: "Le greffon canopyVideo, puis la surcharge",
      description:
        "Les dix fichiers sont livrés dans le paquet, sous dist/assets/video : par thème, un WebM et un MP4 en 1080p, un WebM et un MP4 en 720p (1,4 à 2,1 Mo chacun) et l'affiche. Ils ne peuvent pas passer par le bundle : Vite inline en base64 tout asset qu'un module référence, et une quarantaine de Mo de vidéo deviendraient plus de 50 Mo de chaîne. Ils sont donc servis comme des fichiers depuis CANOPY_ASSET_BASE, soit /canopui/video — par le greffon livré avec la librairie, à poser une fois dans vite.config.ts : plugins: [canopyVideo()], importé de @canop/ui/vite. Il sert les scènes en développement et les recopie au build, donc il n'y a rien à dupliquer côté portail. Pour les servir ailleurs — un CDN, un autre préfixe — canopyScenesFrom recompose les URL, et scenes les remplace une par une : cette fusion est partielle, ce qui n'est pas fourni reste la source par défaut, sauf la variante 720p, abandonnée dès que webm ou mp4 est remplacé sans lite. Un CDN doit héberger les dix fichiers, -720 compris.",
    },
  },
  props: {
    children: "Contenu centré au-dessus de la scène.",
    sceneMode: "Scène servie : auto suit le thème actif, light et dark en figent une.",
    scenes: "Surcharge partielle des sources, par thème et par format.",
    animated: "Joue la vidéo. À false, seule l'image d'affiche est rendue.",
    quality:
      "Niveau de rendu : auto choisit selon le réseau, l'appareil et la fluidité mesurée ; high impose la vidéo, low l'affiche fixe.",
    onQualityChange: "Appelé avec le niveau servi et sa raison, à chaque changement de décision.",
    veil: "Opacité du voile posé entre la scène et le contenu, de 0 à 1.",
    minHeight: "Hauteur minimale du conteneur ; utilisez 100% pour épouser un parent dimensionné.",
    component: "Élément HTML rendu, par exemple main pour la zone principale d'une page.",
    sx: "Styles additionnels appliqués au conteneur externe.",
    contentSx: "Styles additionnels appliqués à la zone de contenu centrée.",
  },
};

const en: typeof fr = {
  intro:
    "The library's animated background: a tree canopy filmed from the ground towards the zenith, rendered in Blender as a 10-second loop that joins exactly. Two scenes ship with the package, one per theme, and the component picks the right one with no configuration. It is the default background of PageScaffold.",
  sections: {
    basic: "Basic usage",
    sceneMode: "Scene and theme",
    static: "Without motion",
    quality: "Adaptive quality",
    veil: "Readability veil",
    scenes: "Serving the scenes",
    api: "API",
  },
  quality: {
    quality: "Requested quality",
    qualities: { auto: "Auto", high: "Full", low: "Light" },
    level: "Served level",
    reason: "Reason",
    pending: "…",
    levels: { high: "1080p video", medium: "720p video", low: "Still poster" },
    reasons: {
      forced: "Set by the quality prop",
      capable: "Device and network at ease",
      disabled: "Animation off (animated={false})",
      "reduced-motion": "Reduced motion requested by the system",
      "save-data": "Data saver on",
      "slow-network": "Very slow connection (2G)",
      "limited-network": "Limited connection (3G, under 2 Mb/s)",
      "modest-device": "Modest device (memory)",
      "small-screen": "Screen covered by 720p",
      "low-frame-rate": "Frames dropped during playback",
      buffering: "Playback interrupted by buffering",
    },
    cardTitle: "Adaptive quality",
    cardBody: "Pick a level: the component announces the one it serves and why.",
  },
  demos: {
    basic: {
      title: "Background with centered content",
      description:
        "Content is centered above the scene. minHeight defaults to 100vh; pass a height, or 100% to fit a sized parent. On this page, only the most visible demo plays its video, the others show the poster.",
    },
    sceneMode: {
      title: "One scene per theme",
      description:
        "By default the scene follows the active theme. sceneMode pins one of the two, the way styleMode does on Map. The selector switches from one to the other.",
      ariaLabel: "Displayed scene",
      options: { light: "Light", dark: "Dark" },
    },
    static: {
      title: "Poster only",
      description:
        "The component animates nothing when the user asked for reduced motion: it renders the poster image, which is frame 1 of the loop. animated={false} forces that behaviour.",
    },
    quality: {
      title: "Served level and reason",
      description:
        "In auto, the 1080p video is served unchanged, but the poster is painted first, the video only downloads as it nears the screen, fades in from its first played frame, and pauses off screen or in a hidden tab. The component steps down one notch — to the 720p variant, provided by default (scenes.lite), then to the still poster — when the connection is limited (3G, under 2 Mb/s), when the device reports little memory, when playback drops more than one frame in five in two measures in a row, or when it stalls twice on buffering; it never steps back up. A screen covered by 720p only steps down when the variant exists. Data saver and 2G go straight to the poster. It also prefers MP4 over WebM when VP9 is not decoded by the graphics card. high forces the 1080p video, low the poster. To watch auto step down: Chrome DevTools, Network > Slow 3G then reload, or Performance > CPU 6x slowdown.",
    },
    veil: {
      title: "Veil at 0 or at 0.75",
      description:
        "A veil in the background colour sits between the scene and the content, so text stays readable over busy foliage. It defaults to 0.32 in light and 0.24 in dark.",
      ariaLabel: "Veil opacity",
      options: { none: "veil = 0", dense: "veil = 0.75" },
    },
    scenes: {
      title: "The canopyVideo plugin, then overrides",
      description:
        "The ten files ship inside the package, under dist/assets/video: per theme, a 1080p WebM and MP4, a 720p WebM and MP4 (1.4 to 2.1 MB each) and the poster. They cannot go through the bundle: Vite inlines as base64 every asset a module references, and some forty MB of video would become over 50 MB of string. They are therefore served as files from CANOPY_ASSET_BASE, that is /canopui/video — by the plugin shipped with the library, added once in vite.config.ts: plugins: [canopyVideo()], imported from @canop/ui/vite. It serves the scenes in development and copies them at build time, so there is nothing to duplicate on the portal side. To serve them elsewhere — a CDN, another prefix — canopyScenesFrom recomposes the URLs, and scenes replaces them one by one: that merge is partial, whatever is not provided stays the default source, except the 720p variant, dropped as soon as webm or mp4 is replaced without lite. A CDN must host all ten files, -720 included.",
    },
  },
  props: {
    children: "Content centered above the scene.",
    sceneMode: "Scene served: auto follows the active theme, light and dark pin one.",
    scenes: "Partial source override, per theme and per format.",
    animated: "Plays the video. When false, only the poster image is rendered.",
    quality:
      "Rendering level: auto decides from the network, the device and the measured smoothness; high forces the video, low the still poster.",
    onQualityChange: "Called with the served level and its reason, whenever the decision changes.",
    veil: "Opacity of the veil between the scene and the content, from 0 to 1.",
    minHeight: "Minimum height of the container; use 100% to fit a sized parent.",
    component: "Rendered HTML element, for example main for a page's main area.",
    sx: "Additional styles applied to the outer container.",
    contentSx: "Additional styles applied to the centered content area.",
  },
};

const texts = { fr, en };

type PinnedScene = Exclude<CanopCanopySceneMode, "auto">;
type VeilChoice = "none" | "dense";

const PINNED_SCENES: PinnedScene[] = ["light", "dark"];
const VEIL_CHOICES: VeilChoice[] = ["none", "dense"];
const VEILS: Record<VeilChoice, number> = { none: 0, dense: 0.75 };

function segmentOptions<T extends string>(
  values: T[],
  labels: Record<T, string>,
): CanopSegmentedControlOption<T>[] {
  return values.map((value) => ({ value, label: labels[value] }));
}

export default function CanopyBackgroundDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    { name: "children", type: "ReactNode", description: t.props.children },
    {
      name: "sceneMode",
      type: '"auto" | "light" | "dark"',
      defaultValue: '"auto"',
      description: t.props.sceneMode,
    },
    {
      name: "scenes",
      type: "CanopCanopySceneOverride",
      description: t.props.scenes,
    },
    { name: "animated", type: "boolean", defaultValue: "true", description: t.props.animated },
    {
      name: "quality",
      type: '"auto" | "high" | "low"',
      defaultValue: '"auto"',
      description: t.props.quality,
    },
    {
      name: "onQualityChange",
      type: "(state: CanopCanopyQualityState) => void",
      description: t.props.onQualityChange,
    },
    { name: "veil", type: "number", description: t.props.veil },
    {
      name: "minHeight",
      type: "number | string",
      defaultValue: '"100vh"',
      description: t.props.minHeight,
    },
    {
      name: "component",
      type: "ElementType",
      defaultValue: '"div"',
      description: t.props.component,
    },
    { name: "sx", type: "SxProps<Theme>", description: t.props.sx },
    { name: "contentSx", type: "SxProps<Theme>", description: t.props.contentSx },
  ];

  return (
    <SingleLiveScope>
      <DocPage title="CanopyBackground" intro={t.intro} importCode={importCode}>
        <DocSection title={t.sections.basic}>
          <DemoCard
            title={t.demos.basic.title}
            description={t.demos.basic.description}
            code={basicCode}
            align="stretch"
          >
            <CanopyLiveFrame height="24rem">
              <Card title="CanopUI">Canopée vue du sol vers le zénith.</Card>
            </CanopyLiveFrame>
          </DemoCard>
        </DocSection>
        <DocSection title={t.sections.sceneMode}>
          <DemoCard
            title={t.demos.sceneMode.title}
            description={t.demos.sceneMode.description}
            code={sceneModeCode}
            align="stretch"
          >
            <CanopyVariantDemo
              options={segmentOptions(PINNED_SCENES, t.demos.sceneMode.options)}
              initial="light"
              ariaLabel={t.demos.sceneMode.ariaLabel}
              renderFrame={(scene) => <CanopyLiveFrame height="18rem" sceneMode={scene} />}
            />
          </DemoCard>
        </DocSection>
        <DocSection title={t.sections.static}>
          <DemoCard
            title={t.demos.static.title}
            description={t.demos.static.description}
            code={staticCode}
            align="stretch"
          >
            <DemoViewport>
              <CanopyBackground animated={false} minHeight="100%">
                <Card title="Image d'affiche">
                  L'affiche est l'image 1 de la boucle : comme la boucle raccorde exactement, elle
                  correspond aussi à la dernière image.
                </Card>
              </CanopyBackground>
            </DemoViewport>
          </DemoCard>
        </DocSection>
        <DocSection title={t.sections.quality}>
          <DemoCard
            title={t.demos.quality.title}
            description={t.demos.quality.description}
            code={qualityCode}
            align="stretch"
          >
            <CanopyQualityDemo labels={t.quality} />
          </DemoCard>
        </DocSection>
        <DocSection title={t.sections.veil}>
          <DemoCard
            title={t.demos.veil.title}
            description={t.demos.veil.description}
            code={veilCode}
            align="stretch"
          >
            <CanopyVariantDemo
              options={segmentOptions(VEIL_CHOICES, t.demos.veil.options)}
              initial="none"
              ariaLabel={t.demos.veil.ariaLabel}
              renderFrame={(choice) => (
                <CanopyLiveFrame height="18rem" veil={VEILS[choice]}>
                  <Card>{t.demos.veil.options[choice]}</Card>
                </CanopyLiveFrame>
              )}
            />
          </DemoCard>
        </DocSection>
        <DocSection title={t.sections.scenes}>
          <DemoCard
            title={t.demos.scenes.title}
            description={t.demos.scenes.description}
            code={scenesCode}
            align="stretch"
          >
            <CanopyLiveFrame height="18rem">
              <Card title="Sources servies par le portail">
                Les dix fichiers — WebM et MP4 en 1080p et 720p, et l'affiche pour chaque thème —
                sont livrés dans le paquet et servis sous /canopui/video.
              </Card>
            </CanopyLiveFrame>
          </DemoCard>
        </DocSection>
        <DocSection title={t.sections.api}>
          <PropsTable rows={propRows} />
        </DocSection>
      </DocPage>
    </SingleLiveScope>
  );
}
