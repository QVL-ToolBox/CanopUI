import { Feedback } from "@canop/ui";
import { CodeBlock } from "../../kit/CodeBlock";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";
import { useHiddenSeasonalDecor } from "../../season/useHiddenSeasonalDecor";
import { HalloweenIcons } from "./halloween/HalloweenIcons";
import { HalloweenStage } from "./halloween/HalloweenStage";
import { SeasonChoiceControl } from "./halloween/SeasonChoiceControl";

const importCode = `import { HalloweenDecor } from "@canop/ui";`;

const lowCode = `<HalloweenDecor>
  <Card title="Nuit de la Canopée">Le décor reste derrière le contenu.</Card>
</HalloweenDecor>`;

const mediumCode = `<HalloweenDecor density="medium">
  <Card title="Nuit des esprits">Un essaim, huit fantômes et un chaudron qui bouillonne.</Card>
</HalloweenDecor>`;

const seasonCode = `<CanopThemeProvider>
  <App />
</CanopThemeProvider>

<CanopThemeProvider season="halloween">
  <App />
</CanopThemeProvider>

<CanopThemeProvider season={null}>
  <App />
</CanopThemeProvider>

<CanopThemeProvider seasonalDecor={false}>
  <App />
</CanopThemeProvider>`;

const iconsCode = `<Icon name="ghost" />
<Icon name="pumpkin" variant="solid" />
<Icon name="bat" />`;

const fr = {
  intro:
    "Une scène d'Halloween en trois plans, sous un ciel étoilé. De temps en temps, une sorcière traverse tout l'écran sur son balai, cape au vent, dans une traînée d'étincelles, au-dessus même du contenu. Au milieu, des chauves-souris en vol chaotique, des fantômes qui errent, s'effacent, sortent d'une tombe ou de la brume, ou font coucou depuis un bord, des toiles en coin bercées par le vent avec leurs araignées, des arbres tordus et un cimetière gardé par un chat noir. Au premier plan, des citrouilles, des feuilles mortes, des lucioles et la brume. Tout est en SVG et CSS, coloré par les variables du thème, animé sur les bords, le ciel et le sol, ignoré des lecteurs d'écran et transparent aux clics.",
  sections: {
    season: "Thème complet",
    density: "Densité",
    usage: "Activation saisonnière",
    icons: "Icônes",
    api: "API",
  },
  seasonChoice: {
    label: "Saison de la vitrine",
    options: { auto: "Calendrier", halloween: "Halloween", off: "Aucune" },
  },
  seasonDescription:
    'Ce choix règle la saison du CanopThemeProvider de toute la vitrine. Calendrier n\'impose rien : le provider habille seul la vitrine du 15 octobre au 1er novembre. Halloween passe season="halloween" et Aucune season={null}. La citrouille de la barre partage ce choix : elle bascule sur Halloween ou sur Aucune selon ce qui est affiché. Palettes, surfaces et lueur des titres en sombre suivent sur toutes les pages, et le décor du provider apparaît sur les autres pages ; sur celle-ci, il est masqué pour laisser voir les deux démos.',
  demos: {
    low: {
      title: "Densité low",
      description:
        "La valeur par défaut, pour un portail : la sorcière, quatre chauves-souris, cinq fantômes dont deux au ras du sol, deux toiles et une araignée, trois citrouilles, quatre feuilles et six lucioles. Le centre reste calme.",
      cardTitle: "Nuit de la Canopée",
      cardBody: "Le décor reste derrière le contenu.",
    },
    medium: {
      title: "Densité medium",
      description:
        "Une scène plus peuplée, pour une page d'accueil ou un écran de connexion : sept chauves-souris et un essaim qui tournoie, huit fantômes dont trois au ras du sol, deux araignées, un chaudron qui bouillonne, cinq citrouilles, huit feuilles et douze lucioles.",
      cardTitle: "Nuit des esprits",
      cardBody: "Un essaim, huit fantômes et un chaudron qui bouillonne.",
    },
  },
  usageDescription:
    'Aucun code dans les portails : sans prop season, CanopThemeProvider applique la saison halloween du 15 octobre au 1er novembre inclus, en heure locale, chaque année, et rend lui-même ce décor en densité medium : la scène se pose dans PageScaffold, au-dessus de son fond et sous le contenu, ou derrière toute la page sans PageScaffold ; la sorcière et les araignées passent au-dessus de tout. La date est lue au montage, un onglet ouvert ne change de saison qu\'au rechargement. season="halloween" force la saison, season={null} coupe palette et décor, seasonalDecor={false} garde la palette sans le décor. Sous le provider, un HalloweenDecor en scope viewport ne rend que ses enfants, pour éviter un double décor.',
  a11y: "Sous prefers-reduced-motion, le décor reste visible mais immobile, et la sorcière n'est pas rendue. Aucun élément ne clignote plus de trois fois par seconde, et les animations se mettent en pause quand l'onglet est masqué. Les fantômes sont translucides, le centre de la scène reste calme, et les deux calques, le fond et celui de la sorcière et des araignées, sont en aria-hidden et ne capturent aucun clic.",
  iconsDescription:
    "Trois icônes rejoignent le set, en outline et en solid : ghost, pumpkin et bat.",
  props: {
    density: "Nombre d'éléments animés : low reste discret, medium peuple davantage la scène.",
    scope:
      "container borne le décor au composant ; viewport le fixe à l'écran pendant que le contenu défile.",
    children: "Contenu posé au-dessus du décor.",
  },
};

const en: typeof fr = {
  intro:
    "A Halloween scene in three planes, under a starry sky. Every now and then, a witch crosses the whole screen on her broom, cape flying, in a trail of sparks, even above the content. In the middle, bats in chaotic flight, ghosts that wander, fade away, rise from a grave or from the mist, or play peekaboo from an edge, corner webs swaying in the wind with their spiders, twisted trees and a graveyard watched by a black cat. In front, pumpkins, falling leaves, fireflies and mist. Everything is SVG and CSS, colored by the theme variables, animated along the edges, the sky and the ground, hidden from screen readers and transparent to clicks.",
  sections: {
    season: "Full theme",
    density: "Density",
    usage: "Seasonal activation",
    icons: "Icons",
    api: "API",
  },
  seasonChoice: {
    label: "Showcase season",
    options: { auto: "Calendar", halloween: "Halloween", off: "None" },
  },
  seasonDescription:
    'This choice sets the season of the CanopThemeProvider across the showcase. Calendar forces nothing: the provider dresses the showcase up on its own from 15 October to 1 November. Halloween passes season="halloween" and None season={null}. The pumpkin in the bar shares this choice: it switches to Halloween or to None depending on what is shown. Palettes, surfaces and the dark heading glow follow on every page, and the provider decor shows on the other pages; on this one, it is hidden so the two demos stay readable.',
  demos: {
    low: {
      title: "Low density",
      description:
        "The default, for a portal: the witch, four bats, five ghosts including two close to the ground, two webs and a spider, three pumpkins, four leaves and six fireflies. The centre stays calm.",
      cardTitle: "Canopy Night",
      cardBody: "The decor stays behind the content.",
    },
    medium: {
      title: "Medium density",
      description:
        "A busier scene, for a landing page or a sign-in screen: seven bats and a whirling swarm, eight ghosts including three close to the ground, two spiders, a bubbling cauldron, five pumpkins, eight leaves and twelve fireflies.",
      cardTitle: "Night of spirits",
      cardBody: "A swarm, eight ghosts and a bubbling cauldron.",
    },
  },
  usageDescription:
    'No code in the portals: without a season prop, CanopThemeProvider applies the halloween season from 15 October to 1 November inclusive, in local time, every year, and renders this decor itself at medium density: the scene sits inside PageScaffold, above its background and under the content, or behind the whole page without PageScaffold; the witch and the spiders fly above everything. The date is read on mount, an open tab only changes season on reload. season="halloween" forces the season, season={null} turns off palette and decor, seasonalDecor={false} keeps the palette without the decor. Under the provider, a HalloweenDecor with viewport scope only renders its children, to avoid a double decor.',
  a11y: "Under prefers-reduced-motion, the decor stays visible but still, and the witch is not rendered. No element flashes more than three times per second, and animations pause while the tab is hidden. Ghosts are translucent, the centre of the scene stays calm, and both layers, the backdrop and the one holding the witch and the spiders, are aria-hidden and capture no clicks.",
  iconsDescription: "Three icons join the set, in outline and solid: ghost, pumpkin and bat.",
  props: {
    density: "Number of animated elements: low stays discreet, medium fills the scene further.",
    scope:
      "container bounds the decor to the component; viewport pins it to the screen while the content scrolls.",
    children: "Content laid above the decor.",
  },
};

const texts = { fr, en };

export default function HalloweenDecorDoc() {
  const t = texts[useDocLocale()];
  useHiddenSeasonalDecor();
  const propRows: PropRow[] = [
    {
      name: "density",
      type: '"low" | "medium"',
      defaultValue: '"low"',
      description: t.props.density,
    },
    {
      name: "scope",
      type: '"container" | "viewport"',
      defaultValue: '"container"',
      description: t.props.scope,
    },
    { name: "children", type: "ReactNode", description: t.props.children },
  ];

  return (
    <DocPage title="HalloweenDecor" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.season} description={t.seasonDescription}>
        <SeasonChoiceControl ariaLabel={t.seasonChoice.label} labels={t.seasonChoice.options} />
      </DocSection>
      <DocSection title={t.sections.density}>
        <DemoCard
          title={t.demos.low.title}
          description={t.demos.low.description}
          code={lowCode}
          align="stretch"
        >
          <HalloweenStage density="low" title={t.demos.low.cardTitle} body={t.demos.low.cardBody} />
        </DemoCard>
        <DemoCard
          title={t.demos.medium.title}
          description={t.demos.medium.description}
          code={mediumCode}
          align="stretch"
        >
          <HalloweenStage
            density="medium"
            title={t.demos.medium.cardTitle}
            body={t.demos.medium.cardBody}
          />
        </DemoCard>
        <Feedback severity="info">{t.a11y}</Feedback>
      </DocSection>
      <DocSection title={t.sections.usage} description={t.usageDescription}>
        <CodeBlock code={seasonCode} />
      </DocSection>
      <DocSection title={t.sections.icons} description={t.iconsDescription}>
        <DemoCard title={t.sections.icons} code={iconsCode}>
          <HalloweenIcons />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
