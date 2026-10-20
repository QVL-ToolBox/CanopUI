import Box from "@mui/material/Box";
import { Button, CanopyBackground, Card, squircleClip, tokens } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Card } from "@canop/ui";`;

const basicCode = `<Card>Une carte minimale, sans en-tête ni actions.</Card>`;

const completeCode = `<Card
  title="Mon compte"
  subtitle="Informations personnelles"
  actions={
    <>
      <Button variant="secondary" size="small">
        Annuler
      </Button>
      <Button size="small">Enregistrer</Button>
    </>
  }
>
  Contenu du formulaire de profil.
</Card>`;

const elevationsCode = `<Card elevation="none" title="none">
  Bordure plate
</Card>
<Card elevation="sm" title="sm">
  Ombre légère
</Card>
<Card elevation="md" title="md">
  Ombre moyenne
</Card>
<Card elevation="lg" title="lg">
  Ombre forte
</Card>`;

const arrowCode = `<Card variant="interactive" arrow title="Approbations" onClick={openApprovals}>
  4 demandes en attente
</Card>`;

const isolatedActionsCode = `<Card
  variant="interactive"
  tone="info"
  title="Mise à jour disponible"
  data-testid="update-card"
  onClick={openRelease}
  actions={<Button size="small" onClick={installUpdate}>Installer</Button>}
>
  La version 2.4 apporte trois correctifs.
</Card>`;

const frostedCode = `import { Button, CanopyBackground, Card, tokens } from "@canop/ui";

<CanopyBackground minHeight="22rem" contentSx={{ padding: tokens.spacing.md }}>
  <Card
    variant="frosted"
    title="Bonjour Martin"
    subtitle="Trois revues vous attendent"
    actions={<Button size="small">Ouvrir les revues</Button>}
  >
    Le verre floute la canopée sans la masquer : le texte reste lisible, en clair comme en sombre.
  </Card>
</CanopyBackground>`;

const frostedFrameSx = {
  ...squircleClip(tokens.radius.sm),
  overflow: "hidden",
  width: "100%",
} as const;

const fr = {
  intro:
    "Le conteneur de surface CanopUI. La carte regroupe un contenu avec un en-tête optionnel, une zone d'actions et quatre niveaux d'élévation pour hiérarchiser l'information.",
  sections: {
    usage: "Utilisation",
    header: "En-tête et actions",
    elevations: "Élévations",
    arrow: "Flèche",
    isolatedActions: "Actions dans une carte cliquable",
    frosted: "Verre dépoli",
    api: "API",
  },
  demos: {
    frosted: {
      title: "Carte frosted sur la canopée",
      description:
        "La variante frosted pose un verre dépoli prévu pour CanopyBackground : dégradé translucide de primary.light vers accent.light sur un voile de surface.base à 33 %, fond flouté, sans ombre, rayon xl, rembourrage md puis xl dès md. Un navigateur sans backdrop-filter reçoit le même dégradé sur une surface opaque. Aucune animation : rien ne change en mouvement réduit.",
    },
    isolatedActions: {
      title: "Actions isolées et ton info",
      description:
        "Dans une carte cliquable, un clic ou une touche dans actions ne déclenche que le bouton : inutile d'appeler stopPropagation. La racine porte data-tone, et accepte ref et tout attribut data-*.",
    },
    arrow: {
      title: "Carte interactive fléchée",
      description:
        "arrow pose une flèche dans l'en-tête d'une carte interactive ; elle avance au survol et au focus clavier. Sur toute autre variante, arrow ne rend rien. En mouvement réduit, la flèche reste immobile.",
    },
    basic: {
      title: "Carte minimale",
      description:
        "Sans title ni actions, la carte n'affiche que son contenu sur une surface élevée.",
    },
    complete: {
      title: "Carte complète",
      description:
        "title et subtitle composent l'en-tête ; actions accueille les boutons de pied de carte.",
    },
    elevations: {
      title: "Quatre niveaux d'ombre",
      description: "elevation module la profondeur perçue, de la bordure plate à l'ombre forte.",
    },
  },
  props: {
    variant:
      "Rôle de la carte : surface pose un contenu, interactive répond au clic et au clavier, floating se détache du fond, stat habille un chiffre, frosted pose un verre dépoli sur CanopyBackground.",
    tone: "Tonalité sémantique de la surface : ce que la valeur signifie. La teinte ne dépasse pas 8 % de la couleur, au-delà de quoi le texte du thème n'y tient plus le seuil de contraste. Sans effet sur le fond d'une carte frosted, qui garde sa teinte.",
    flash:
      "Retour immédiat, le temps d'être vu : bonne ou mauvaise réponse. L'anneau est posé en ::after et non en ombre portée, pour suivre exactement le squircle ; une erreur secoue en outre la carte, sauf mouvement réduit.",
    radius: "Rayon du squircle.",
    density:
      "Rembourrage intérieur. auto le choisit selon la largeur d'écran ; en frosted, auto vaut md puis xl dès md.",
    onClick:
      "Action au clic. Avec la variante interactive ou stat, la carte devient un bouton : Entrée et Espace la déclenchent aussi. Un clic ou une touche dans actions ne la déclenche jamais.",
    title: "Titre affiché dans l'en-tête de la carte.",
    subtitle: "Sous-titre affiché sous le titre dans l'en-tête.",
    actions: "Zone d'actions rendue en pied de carte, typiquement des boutons.",
    elevation: "Intensité de l'ombre portée de la carte.",
    fill: "Étire la carte pour occuper toute la hauteur de son conteneur flex et laisse le contenu défiler.",
    arrow:
      "Affiche une flèche dans l'en-tête, qui avance au survol. Réservé à la variante interactive : ignoré sur les autres variantes. Sans title, l'en-tête ne porte que la flèche.",
    children: "Contenu principal de la carte.",
    ref: "Référence vers l'élément racine de la carte.",
    dataAttributes:
      "Attributs data-* transmis à la racine. La racine porte toujours data-tone, valant le ton résolu : le passer soi-même est une erreur de compilation.",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI surface container. A card groups content with an optional header, an actions area and four elevation levels to structure information.",
  sections: {
    usage: "Usage",
    header: "Header and actions",
    elevations: "Elevations",
    arrow: "Arrow",
    isolatedActions: "Actions in a clickable card",
    frosted: "Frosted glass",
    api: "API",
  },
  demos: {
    frosted: {
      title: "Frosted card over the canopy",
      description:
        "The frosted variant lays a frosted glass meant for CanopyBackground: a translucent gradient from primary.light to accent.light over a 33% surface.base veil, a blurred backdrop, no shadow, an xl radius, md padding then xl from md. A browser without backdrop-filter gets the same gradient over an opaque surface. No animation: nothing changes under reduced motion.",
    },
    isolatedActions: {
      title: "Isolated actions and the info tone",
      description:
        "In a clickable card, a click or a key press inside actions only fires the button: no need to call stopPropagation. The root carries data-tone, and accepts ref and any data-* attribute.",
    },
    arrow: {
      title: "Interactive card with an arrow",
      description:
        "arrow places an arrow in the header of an interactive card; it moves forward on hover and keyboard focus. On any other variant, arrow renders nothing. With reduced motion the arrow stays still.",
    },
    basic: {
      title: "Minimal card",
      description:
        "Without a title or actions, the card only displays its content on a raised surface.",
    },
    complete: {
      title: "Complete card",
      description:
        "title and subtitle make up the header; actions hosts the footer buttons of the card.",
    },
    elevations: {
      title: "Four shadow levels",
      description: "elevation adjusts the perceived depth, from a flat border to a strong shadow.",
    },
  },
  props: {
    variant:
      "Role of the card: surface holds content, interactive answers click and keyboard, floating lifts off the background, stat dresses a figure, frosted lays a frosted glass over CanopyBackground.",
    tone: "Semantic tone of the surface: what the value means. The tint stays at 8% of the colour; beyond that, theme text no longer holds the contrast threshold on it. No effect on the background of a frosted card, which keeps its tint.",
    flash:
      "Immediate feedback, just long enough to be seen: right or wrong answer. The ring is drawn on ::after rather than as a box shadow, so it follows the squircle exactly; an error also shakes the card, unless reduced motion is asked for.",
    radius: "Squircle radius.",
    density:
      "Inner padding. auto picks it according to the screen width; on frosted, auto is md then xl from md.",
    onClick:
      "Action on click. With the interactive or stat variant the card becomes a button: Enter and Space fire it too. A click or key press inside actions never fires it.",
    title: "Title displayed in the card header.",
    subtitle: "Subtitle displayed below the title in the header.",
    actions: "Actions area rendered in the card footer, typically buttons.",
    elevation: "Intensity of the card drop shadow.",
    fill: "Stretches the card to fill the full height of its flex container and lets the content scroll.",
    arrow:
      "Shows an arrow in the header, which moves forward on hover. Reserved for the interactive variant: ignored on other variants. Without a title, the header only holds the arrow.",
    children: "Main content of the card.",
    ref: "Reference to the root element of the card.",
    dataAttributes:
      "data-* attributes forwarded to the root. The root always carries data-tone, set to the resolved tone: passing it yourself is a compile error.",
  },
};

const texts = { fr, en };

export default function CardDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "title",
      type: "string",
      description: t.props.title,
    },
    {
      name: "subtitle",
      type: "string",
      description: t.props.subtitle,
    },
    {
      name: "actions",
      type: "ReactNode",
      description: t.props.actions,
    },
    {
      name: "elevation",
      type: '"none" | "sm" | "md" | "lg"',
      defaultValue: '"sm", "lg" en floating, "none" en frosted',
      description: t.props.elevation,
    },
    {
      name: "fill",
      type: "boolean",
      defaultValue: "false",
      description: t.props.fill,
    },
    {
      name: "arrow",
      type: "boolean",
      defaultValue: "false",
      description: t.props.arrow,
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.props.children,
    },
    {
      name: "variant",
      type: '"surface" | "interactive" | "floating" | "stat" | "frosted"',
      defaultValue: '"surface"',
      description: t.props.variant,
    },
    {
      name: "tone",
      type: '"neutral" | "info" | "success" | "warning" | "error"',
      defaultValue: '"neutral"',
      description: t.props.tone,
    },
    { name: "flash", type: '"success" | "error"', description: t.props.flash },
    {
      name: "radius",
      type: '"md" | "lg" | "xl" | "2xl"',
      defaultValue: '"lg", "xl" en floating et frosted',
      description: t.props.radius,
    },
    {
      name: "density",
      type: '"auto" | "comfortable" | "standard" | "dense"',
      defaultValue: '"auto"',
      description: t.props.density,
    },
    { name: "onClick", type: "() => void", description: t.props.onClick },
    { name: "ref", type: "Ref<HTMLDivElement>", description: t.props.ref },
    { name: "data-*", type: "string | number | boolean", description: t.props.dataAttributes },
  ];

  return (
    <DocPage title="Card" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.basic.title}
          description={t.demos.basic.description}
          code={basicCode}
        >
          <Card>Une carte minimale, sans en-tête ni actions.</Card>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.header}>
        <DemoCard
          title={t.demos.complete.title}
          description={t.demos.complete.description}
          code={completeCode}
        >
          <Card
            title="Mon compte"
            subtitle="Informations personnelles"
            actions={
              <>
                <Button variant="secondary" size="small">
                  Annuler
                </Button>
                <Button size="small">Enregistrer</Button>
              </>
            }
          >
            Contenu du formulaire de profil.
          </Card>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.elevations}>
        <DemoCard
          title={t.demos.elevations.title}
          description={t.demos.elevations.description}
          code={elevationsCode}
          align="start"
        >
          <Card elevation="none" title="none">
            Bordure plate
          </Card>
          <Card elevation="sm" title="sm">
            Ombre légère
          </Card>
          <Card elevation="md" title="md">
            Ombre moyenne
          </Card>
          <Card elevation="lg" title="lg">
            Ombre forte
          </Card>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.arrow}>
        <DemoCard
          title={t.demos.arrow.title}
          description={t.demos.arrow.description}
          code={arrowCode}
        >
          <Card variant="interactive" arrow title="Approbations">
            4 demandes en attente
          </Card>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.isolatedActions}>
        <DemoCard
          title={t.demos.isolatedActions.title}
          description={t.demos.isolatedActions.description}
          code={isolatedActionsCode}
        >
          <Card
            variant="interactive"
            tone="info"
            title="Mise à jour disponible"
            data-testid="update-card"
            onClick={() => undefined}
            actions={
              <Button size="small" onClick={() => undefined}>
                Installer
              </Button>
            }
          >
            La version 2.4 apporte trois correctifs.
          </Card>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.frosted}>
        <DemoCard
          title={t.demos.frosted.title}
          description={t.demos.frosted.description}
          code={frostedCode}
          align="stretch"
        >
          <Box sx={frostedFrameSx}>
            <CanopyBackground minHeight="22rem" contentSx={{ padding: tokens.spacing.md }}>
              <Card
                variant="frosted"
                title="Bonjour Martin"
                subtitle="Trois revues vous attendent"
                actions={<Button size="small">Ouvrir les revues</Button>}
              >
                Le verre floute la canopée sans la masquer : le texte reste lisible, en clair comme
                en sombre.
              </Card>
            </CanopyBackground>
          </Box>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
