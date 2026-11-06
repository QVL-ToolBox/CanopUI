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
import { useDocLocale } from "../../i18n/useDocLocale";
import { CanopyLiveFrame } from "./canopy/CanopyLiveFrame";
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

// Ou toutes les URL d'un coup, depuis une autre base
const scenes = canopyScenesFrom("https://cdn.qvl-project.com/canopy");`;

const fr = {
  intro:
    "Fond animé de la librairie : une canopée filmée du sol vers le zénith, rendue sous Blender en boucle de 10 secondes qui raccorde exactement. Deux scènes sont embarquées, une par thème, et le composant choisit la bonne sans configuration. La vidéo tourne toujours en pleine résolution. C'est le fond par défaut de PageScaffold.",
  sections: {
    basic: "Usage de base",
    sceneMode: "Scène et thème",
    static: "Sans mouvement",
    veil: "Voile de lisibilité",
    scenes: "Servir les scènes",
    api: "API",
  },
  demos: {
    basic: {
      title: "Fond avec contenu centré",
      description:
        "Le contenu est centré au-dessus de la scène. minHeight vaut 100vh par défaut ; passez une hauteur, ou 100% pour épouser un parent dimensionné. L'affiche est peinte d'abord, puis la vidéo 1080p apparaît en fondu dès sa première image jouée.",
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
        "Les fichiers sont livrés dans le paquet, sous dist/assets/video : par thème, un WebM et un MP4 en 1080p et l'affiche. Ils ne peuvent pas passer par le bundle : Vite inline en base64 tout asset qu'un module référence, et des dizaines de Mo de vidéo deviendraient une chaîne encore plus lourde. Ils sont donc servis comme des fichiers depuis CANOPY_ASSET_BASE, soit /canopui/video — par le greffon livré avec la librairie, à poser une fois dans vite.config.ts : plugins: [canopyVideo()], importé de @canop/ui/vite. Il sert les scènes en développement et les recopie au build, donc il n'y a rien à dupliquer côté portail. Le MP4 passe devant le WebM quand la carte graphique ne décode pas le VP9. Pour servir les scènes ailleurs — un CDN, un autre préfixe — canopyScenesFrom recompose les URL, et scenes les remplace une par une : cette fusion est partielle, ce qui n'est pas fourni reste la source par défaut.",
    },
  },
  props: {
    children: "Contenu centré au-dessus de la scène.",
    sceneMode: "Scène servie : auto suit le thème actif, light et dark en figent une.",
    scenes: "Surcharge partielle des sources, par thème et par format.",
    animated: "Joue la vidéo. À false, seule l'image d'affiche est rendue.",
    veil: "Opacité du voile posé entre la scène et le contenu, de 0 à 1.",
    minHeight: "Hauteur minimale du conteneur ; utilisez 100% pour épouser un parent dimensionné.",
    component: "Élément HTML rendu, par exemple main pour la zone principale d'une page.",
    sx: "Styles additionnels appliqués au conteneur externe.",
    contentSx: "Styles additionnels appliqués à la zone de contenu centrée.",
  },
};

const en: typeof fr = {
  intro:
    "The library's animated background: a tree canopy filmed from the ground towards the zenith, rendered in Blender as a 10-second loop that joins exactly. Two scenes ship with the package, one per theme, and the component picks the right one with no configuration. The video always plays at full resolution. It is the default background of PageScaffold.",
  sections: {
    basic: "Basic usage",
    sceneMode: "Scene and theme",
    static: "Without motion",
    veil: "Readability veil",
    scenes: "Serving the scenes",
    api: "API",
  },
  demos: {
    basic: {
      title: "Background with centered content",
      description:
        "Content is centered above the scene. minHeight defaults to 100vh; pass a height, or 100% to fit a sized parent. The poster is painted first, then the 1080p video fades in from its first played frame.",
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
        "The files ship inside the package, under dist/assets/video: per theme, a 1080p WebM and MP4 and the poster. They cannot go through the bundle: Vite inlines as base64 every asset a module references, and tens of MB of video would become an even heavier string. They are therefore served as files from CANOPY_ASSET_BASE, that is /canopui/video — by the plugin shipped with the library, added once in vite.config.ts: plugins: [canopyVideo()], imported from @canop/ui/vite. It serves the scenes in development and copies them at build time, so there is nothing to duplicate on the portal side. MP4 goes before WebM when the graphics card does not decode VP9. To serve the scenes elsewhere — a CDN, another prefix — canopyScenesFrom recomposes the URLs, and scenes replaces them one by one: that merge is partial, whatever is not provided stays the default source.",
    },
  },
  props: {
    children: "Content centered above the scene.",
    sceneMode: "Scene served: auto follows the active theme, light and dark pin one.",
    scenes: "Partial source override, per theme and per format.",
    animated: "Plays the video. When false, only the poster image is rendered.",
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
              WebM et MP4 en 1080p, et l'affiche pour chaque thème, sont livrés dans le paquet et
              servis sous /canopui/video.
            </Card>
          </CanopyLiveFrame>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
