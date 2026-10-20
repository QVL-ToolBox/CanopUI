import Box from "@mui/material/Box";
import { Button, Card, Carousel, Stack, Text, useCarousel } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Carousel } from "@canop/ui";`;

const arrowsCode = `<Carousel ariaLabel="Projets QVL">
  <Card title="CustHome">Portail de gestion locative.</Card>
  <Card title="Budgy">Suivi budgétaire.</Card>
  <Card title="Drive">Coffre de documents.</Card>
</Carousel>`;

const barsCode = `<Carousel ariaLabel="Projets QVL" navigation="bars">
  <Card title="CustHome">…</Card>
  <Card title="Budgy">…</Card>
</Carousel>`;

const verticalCode = `<Carousel ariaLabel="Projets QVL" orientation="vertical">
  <Card title="CustHome">…</Card>
  <Card title="Budgy">…</Card>
</Carousel>`;

const fadeCode = `<Carousel ariaLabel="Projets QVL" transition="fade" navigation="bars">
  <Card title="CustHome">…</Card>
  <Card title="Budgy">…</Card>
</Carousel>`;

const autoPlayCode = `<Carousel ariaLabel="Projets QVL" navigation="bars" autoPlay interval={3000}>
  <Card title="CustHome">…</Card>
  <Card title="Budgy">…</Card>
</Carousel>`;

const touchCode = `<Carousel ariaLabel="Projets QVL" navigation="bars">
  <Card title="CustHome">…</Card>
  <Card title="Budgy">…</Card>
</Carousel>`;

const hookCode = `function NavigationMaison() {
  const { activeIndex, goTo, goPrevious, goNext, canGoPrevious, canGoNext } = useCarousel({
    count: cartes.length,
  });
  const carte = cartes[activeIndex];

  return (
    <Stack gap="sm">
      <Stack direction="row" gap="xs" wrap>
        {cartes.map((entree, index) => (
          <Button
            key={entree.titre}
            size="small"
            variant={index === activeIndex ? "primary" : "ghost"}
            onClick={() => goTo(index)}
          >
            {entree.titre}
          </Button>
        ))}
      </Stack>
      <Card title={carte.titre}>{carte.corps}</Card>
      <Stack direction="row" gap="sm" alignItems="center">
        <Button size="small" variant="ghost" disabled={!canGoPrevious} onClick={goPrevious}>
          Précédent
        </Button>
        <Text variant="caption" tone="muted">
          {activeIndex + 1} / {cartes.length}
        </Text>
        <Button size="small" variant="ghost" disabled={!canGoNext} onClick={goNext}>
          Suivant
        </Button>
      </Stack>
    </Stack>
  );
}`;

const cartes = [
  { titre: "CustHome", corps: "Portail de gestion locative." },
  { titre: "Budgy", corps: "Suivi budgétaire du foyer." },
  { titre: "Drive", corps: "Coffre de documents partagés." },
];

const fr = {
  intro:
    "Carrousel de cartes, une carte à la fois. Deux façons de naviguer — deux flèches posées à côté de la carte, ou une barre par carte — deux orientations, deux transitions, et un défilement automatique dont la durée par carte se règle. En mode barres, un balayage au doigt change de carte, et un clic sur la moitié gauche ou droite de la carte recule ou avance.",
  sections: {
    arrows: "Flèches",
    bars: "Barres",
    vertical: "Vertical",
    fade: "Fondu",
    autoPlay: "Défilement automatique",
    touch: "Au doigt et au clic",
    api: "API du composant",
    hook: "Le hook seul",
    hookApi: "API du hook",
  },
  hookDescription:
    "useCarousel porte l'état et la mécanique du carrousel. Il est exposé pour composer une navigation maison — une liste de titres, un compteur — sans réécrire la logique.",
  labels: { arrows: "Flèches", bars: "Barres" },
  demos: {
    arrows: {
      title: "Navigation par flèches",
      description:
        "Comportement par défaut. Les flèches sont posées à côté de la carte et non superposées dessus : la mise en page leur réserve la place, ce qui leur permet de tenir en 2 rem sans devenir difficiles à viser, et elles ne recouvrent plus le contenu. Elles butent aux extrémités : la première est désactivée sur la première carte, et le focus se replie sur sa voisine si elle se désactive alors qu'elle l'avait.",
    },
    bars: {
      title: "Navigation par barres",
      description:
        "Une barre par carte, toutes de même longueur : c'est la couleur qui désigne la carte courante. Une barre active plus longue déplacerait ses voisines à chaque changement, et la rangée sautillerait. C'est le seul mode où le doigt est écouté — balayage pour changer de carte, clic sur une moitié de la carte pour reculer ou avancer : en mode flèches, ce sont elles qui portent la navigation.",
    },
    vertical: {
      title: "Orientation verticale",
      description:
        "Les cartes glissent de haut en bas. Les flèches passent au-dessus et en dessous de la carte ; en mode barres, les barres longent le bord droit à la verticale.",
    },
    fade: {
      title: "Transition en fondu",
      description:
        "Les cartes ne se déplacent plus, elles se substituent. Utile quand le contenu est dense : un glissement attire l'œil vers le mouvement plutôt que vers la carte qui arrive.",
    },
    autoPlay: {
      title: "Défilement automatique, 3 s par carte",
      description:
        "Le défilement boucle, sans quoi il s'arrêterait sur la dernière carte. La barre active se remplit en cadence, sur la durée exacte de la carte : le remplissage mesure l'attente au lieu de la décorer. Le défilement se suspend au survol et dès qu'un élément interne prend le focus, et ne démarre jamais si l'utilisateur a demandé un mouvement réduit : un contenu qui bouge seul doit pouvoir être arrêté.",
    },
    touch: {
      title: "Balayage et clic sur une moitié",
      description:
        "En mode barres, la fenêtre écoute le doigt et le clic. Un balayage change de carte : il faut 48 px parcourus et une trajectoire nettement plus horizontale que verticale, sinon c'est un défilement de page. Un clic dans la moitié gauche recule, dans la moitié droite avance — sauf sur un élément interactif de la carte, qui garde son clic. À la verticale les moitiés deviennent haute et basse.",
    },
  },
  hookDemo: {
    title: "Navigation maison sur useCarousel",
    description:
      "Ici le composant Carousel n'est pas utilisé : le hook porte l'index et les bornes, et la navigation est une liste de titres plus un compteur. C'est le cas d'usage pour lequel il est exposé.",
  },
  props: {
    ariaLabel: "Nom accessible de la fenêtre, et de la barre de navigation.",
    navigation:
      "Flèches posées à côté de la carte, ou une barre par carte, toutes de même longueur.",
    orientation: "Axe du défilement. À la verticale, flèches et barres changent de place.",
    transition: "Les cartes glissent, ou se substituent en fondu.",
    autoPlay: "Fait défiler les cartes seul. Boucle, et se suspend au survol comme au focus.",
    interval: "Durée d'affichage de chaque carte, en millisecondes.",
    previousLabel: "Nom accessible de la flèche précédente.",
    nextLabel: "Nom accessible de la flèche suivante.",
    children:
      "Les cartes, un élément par carte. Une seule est visible à la fois. Attention : le carrousel les compte avec Children.toArray, qui aplatit un tableau mais pas un composant ni un fragment — passer <MesCartes /> lui fait voir une seule carte, ce qui masque flèches et barres et annule les transitions, sans aucune erreur.",
  },
  hookProps: {
    activeIndex: "Index de la carte visible.",
    canGoPrevious: "Faux en butée, vrai en permanence si le défilement automatique boucle.",
    canGoNext: "Idem, à l'autre extrémité.",
    goPrevious: "Recule d'une carte.",
    goNext: "Avance d'une carte.",
    goTo: "Va directement à un index, ramené dans les bornes.",
    playing: "Le défilement automatique tourne-t-il réellement en ce moment.",
    pause: "Suspend le défilement automatique.",
    resume: "Le relance.",
    swipeHandlers:
      "À poser sur la fenêtre. Ne réagit qu'au doigt, jamais à la souris, et pose le touch-action sans lequel le navigateur confisquerait le geste.",
    clickHandlers:
      "À poser sur la fenêtre. Un clic dans la moitié avant recule, dans la moitié arrière avance. Les clics des éléments interactifs de la carte leur restent acquis : un bouton dans une carte reste un bouton.",
  },
};

const en: typeof fr = {
  intro:
    "Card carousel, one card at a time. Two ways to navigate — two arrows beside the card, or one bar per card — two orientations, two transitions, and autoplay with a per-card duration. In bars mode, a touch swipe changes card, and a click on the left or right half of the card steps back or forward.",
  sections: {
    arrows: "Arrows",
    bars: "Bars",
    vertical: "Vertical",
    fade: "Fade",
    autoPlay: "Autoplay",
    touch: "Touch and click",
    api: "Component API",
    hook: "The hook on its own",
    hookApi: "Hook API",
  },
  hookDescription:
    "useCarousel holds the carousel state and mechanics. It is exposed so a custom navigation — a list of titles, a counter — can be built without rewriting the logic.",
  labels: { arrows: "Arrows", bars: "Bars" },
  demos: {
    arrows: {
      title: "Arrow navigation",
      description:
        "Default behaviour. The arrows sit beside the card instead of on top of it: the layout reserves their place, which lets them hold at 2 rem without becoming hard to aim at, and they no longer cover the content. They stop at the ends: the first is disabled on the first card, and focus falls back to its sibling if it becomes disabled while holding focus.",
    },
    bars: {
      title: "Bar navigation",
      description:
        "One bar per card, all the same length: color designates the current card. A longer active bar would shift its neighbours on every change, and the row would jitter. This is the only mode where touch is listened to — swipe to change card, click on either half of the card to step back or forward: in arrows mode, the arrows carry navigation.",
    },
    vertical: {
      title: "Vertical orientation",
      description:
        "Cards slide top to bottom. Arrows move above and below the card; in bars mode, the bars run down the right edge.",
    },
    fade: {
      title: "Fade transition",
      description:
        "Cards no longer move, they replace one another. Useful with dense content: a slide draws the eye to the motion rather than to the arriving card.",
    },
    autoPlay: {
      title: "Autoplay, 3 s per card",
      description:
        "Autoplay loops, otherwise it would stop on the last card. The active bar fills in cadence, over the card's exact duration: the fill measures the wait instead of decorating it. Autoplay pauses on hover and as soon as an inner element takes focus, and never starts if the user asked for reduced motion: content that moves on its own must be stoppable.",
    },
    touch: {
      title: "Swipe and half-click",
      description:
        "In bars mode, the viewport listens to touch and to clicks. A swipe changes card: it takes 48 px travelled and a path clearly more horizontal than vertical, otherwise it is a page scroll. A click in the left half steps back, in the right half steps forward — except on an interactive element of the card, which keeps its click. Vertically the halves become top and bottom.",
    },
  },
  hookDemo: {
    title: "Custom navigation on useCarousel",
    description:
      "The Carousel component is not used here: the hook holds the index and the bounds, and navigation is a list of titles plus a counter. This is the use case it is exposed for.",
  },
  props: {
    ariaLabel: "Accessible name of the viewport, and of the navigation group.",
    navigation: "Arrows beside the card, or one bar per card, all the same length.",
    orientation: "Scrolling axis. Vertically, arrows and bars move.",
    transition: "Cards slide, or cross-fade.",
    autoPlay: "Scrolls the cards on its own. Loops, and pauses on hover and focus.",
    interval: "Display duration of each card, in milliseconds.",
    previousLabel: "Accessible name of the previous arrow.",
    nextLabel: "Accessible name of the next arrow.",
    children:
      "The cards, one element per card. Only one is visible at a time. Careful: the carousel counts them with Children.toArray, which flattens an array but not a component or a fragment — passing <MyCards /> makes it see a single card, which hides arrows and bars and cancels transitions, with no error at all.",
  },
  hookProps: {
    activeIndex: "Index of the visible card.",
    canGoPrevious: "False at the end, always true when autoplay loops.",
    canGoNext: "Same, at the other end.",
    goPrevious: "Steps back one card.",
    goNext: "Steps forward one card.",
    goTo: "Jumps to an index, clamped into range.",
    playing: "Whether autoplay is actually running right now.",
    pause: "Suspends autoplay.",
    resume: "Resumes it.",
    swipeHandlers:
      "To spread on the viewport. Only reacts to touch, never to the mouse, and sets the touch-action without which the browser would claim the gesture.",
    clickHandlers:
      "To spread on the viewport. A click in the leading half steps back, in the trailing half steps forward. Clicks on the card's interactive elements stay theirs: a button inside a card remains a button.",
  },
};

const texts = { fr, en };

function NavigationMaison() {
  const { activeIndex, goTo, goPrevious, goNext, canGoPrevious, canGoNext } = useCarousel({
    count: cartes.length,
  });
  const carte = cartes[activeIndex];

  return (
    <Stack gap="sm">
      <Stack direction="row" gap="xs" wrap>
        {cartes.map((entree, index) => (
          <Button
            key={entree.titre}
            size="small"
            variant={index === activeIndex ? "primary" : "ghost"}
            onClick={() => goTo(index)}
          >
            {entree.titre}
          </Button>
        ))}
      </Stack>
      <Card title={carte.titre}>{carte.corps}</Card>
      <Stack direction="row" gap="sm" alignItems="center">
        <Button size="small" variant="ghost" disabled={!canGoPrevious} onClick={goPrevious}>
          Précédent
        </Button>
        <Text variant="caption" tone="muted">
          {activeIndex + 1} / {cartes.length}
        </Text>
        <Button size="small" variant="ghost" disabled={!canGoNext} onClick={goNext}>
          Suivant
        </Button>
      </Stack>
    </Stack>
  );
}

// `Carousel` compte ses cartes avec `Children.toArray`, qui aplatit un tableau
// mais **pas** un composant ni un fragment. Ces cartes etaient rendues par un
// composant `Cartes` : le carrousel n'en voyait donc qu'une seule, ce qui
// masquait les fleches et les barres (les deux exigent plus d'une carte),
// annulait les transitions, et affichait les trois cartes cote a cote dans
// l'unique diapositive. Aucune erreur nulle part. On renvoie donc le tableau
// lui-meme, pas un element qui l'enveloppe.
function cartesJsx() {
  return cartes.map((carte) => (
    <Card key={carte.titre} title={carte.titre}>
      {carte.corps}
    </Card>
  ));
}

export default function CarouselDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "ariaLabel", type: "string", required: true, description: t.props.ariaLabel },
    {
      name: "navigation",
      type: '"arrows" | "bars"',
      defaultValue: '"arrows"',
      description: t.props.navigation,
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
      description: t.props.orientation,
    },
    {
      name: "transition",
      type: '"slide" | "fade"',
      defaultValue: '"slide"',
      description: t.props.transition,
    },
    { name: "autoPlay", type: "boolean", defaultValue: "false", description: t.props.autoPlay },
    { name: "interval", type: "number", defaultValue: "5000", description: t.props.interval },
    { name: "previousLabel", type: "string", description: t.props.previousLabel },
    { name: "nextLabel", type: "string", description: t.props.nextLabel },
    { name: "children", type: "ReactNode", required: true, description: t.props.children },
  ];

  const hookRows: PropRow[] = [
    { name: "activeIndex", type: "number", description: t.hookProps.activeIndex },
    { name: "canGoPrevious", type: "boolean", description: t.hookProps.canGoPrevious },
    { name: "canGoNext", type: "boolean", description: t.hookProps.canGoNext },
    { name: "goPrevious", type: "() => void", description: t.hookProps.goPrevious },
    { name: "goNext", type: "() => void", description: t.hookProps.goNext },
    { name: "goTo", type: "(index: number) => void", description: t.hookProps.goTo },
    { name: "playing", type: "boolean", description: t.hookProps.playing },
    { name: "pause", type: "() => void", description: t.hookProps.pause },
    { name: "resume", type: "() => void", description: t.hookProps.resume },
    {
      name: "swipeHandlers",
      type: "{ onPointerDown; onPointerUp; onPointerCancel }",
      description: t.hookProps.swipeHandlers,
    },
    {
      name: "clickHandlers",
      type: "{ onClick }",
      description: t.hookProps.clickHandlers,
    },
  ];

  return (
    <DocPage title="Carousel" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.arrows}>
        <DemoCard
          title={t.demos.arrows.title}
          description={t.demos.arrows.description}
          code={arrowsCode}
          align="stretch"
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Carousel ariaLabel="Projets QVL">{cartesJsx()}</Carousel>
          </Box>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.bars}>
        <DemoCard
          title={t.demos.bars.title}
          description={t.demos.bars.description}
          code={barsCode}
          align="stretch"
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Carousel ariaLabel="Projets QVL, barres" navigation="bars">
              {cartesJsx()}
            </Carousel>
          </Box>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.vertical}>
        <DemoCard
          title={t.demos.vertical.title}
          description={t.demos.vertical.description}
          code={verticalCode}
          align="stretch"
        >
          <Box
            sx={{
              display: "flex",
              gap: "1.5rem",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                flex: "1 1 14rem",
              }}
            >
              <Text variant="caption" tone="muted" gutterBottom>
                {t.labels.arrows}
              </Text>
              <Carousel ariaLabel="Vertical, flèches" orientation="vertical">
                {cartesJsx()}
              </Carousel>
            </Box>
            <Box
              sx={{
                flex: "1 1 14rem",
              }}
            >
              <Text variant="caption" tone="muted" gutterBottom>
                {t.labels.bars}
              </Text>
              <Carousel ariaLabel="Vertical, barres" orientation="vertical" navigation="bars">
                {cartesJsx()}
              </Carousel>
            </Box>
          </Box>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.fade}>
        <DemoCard
          title={t.demos.fade.title}
          description={t.demos.fade.description}
          code={fadeCode}
          align="stretch"
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Carousel ariaLabel="Projets QVL, fondu" navigation="bars" transition="fade">
              {cartesJsx()}
            </Carousel>
          </Box>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.autoPlay}>
        <DemoCard
          title={t.demos.autoPlay.title}
          description={t.demos.autoPlay.description}
          code={autoPlayCode}
          align="stretch"
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Carousel
              ariaLabel="Projets QVL, automatique"
              navigation="bars"
              autoPlay
              interval={3000}
            >
              {cartesJsx()}
            </Carousel>
          </Box>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.touch}>
        <DemoCard
          title={t.demos.touch.title}
          description={t.demos.touch.description}
          code={touchCode}
          align="stretch"
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Carousel ariaLabel="Projets QVL, au doigt" navigation="bars">
              {cartesJsx()}
            </Carousel>
          </Box>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>

      <DocSection title={t.sections.hook} description={t.hookDescription}>
        <DemoCard
          title={t.hookDemo.title}
          description={t.hookDemo.description}
          code={hookCode}
          align="stretch"
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <NavigationMaison />
          </Box>
        </DemoCard>
      </DocSection>

      <DocSection title={t.sections.hookApi}>
        <PropsTable rows={hookRows} />
      </DocSection>
    </DocPage>
  );
}
