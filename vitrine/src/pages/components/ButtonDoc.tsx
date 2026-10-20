import { Button, Icon } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Button } from "@canop/ui";`;

const filledCode = `<Button variant="primary">Primaire</Button>
<Button variant="secondary">Secondaire</Button>
<Button variant="accent">Accent</Button>
<Button variant="danger">Danger</Button>`;

const quietCode = `<Button variant="tonal">Tonal</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="text">Text</Button>`;

const sizesCode = `<Button size="small">Petit</Button>
<Button size="medium">Moyen</Button>
<Button size="large">Grand</Button>`;

const statesCode = `<Button loading>Chargement</Button>
<Button disabled>Désactivé</Button>
<Button variant="ghost" disabled>Désactivé</Button>`;

const iconsCode = `<Button startIcon={<Icon name="plus" size="xs" />}>Ajouter</Button>
<Button variant="secondary" endIcon={<Icon name="caretRight" size="xs" />}>
  Suivant
</Button>`;

const fullWidthCode = `<Button fullWidth>Pleine largeur</Button>`;

const fr = {
  intro:
    "Le bouton d'action CanopUI. Sept variantes en deux familles — quatre à fond plein pour les actions qui doivent se voir, trois discrètes pour celles qui accompagnent — trois tailles, un état de chargement intégré et des emplacements d'icônes avant et après le libellé.",
  sections: {
    filled: "Variantes à fond plein",
    quiet: "Variantes discrètes",
    sizes: "Tailles",
    states: "États",
    icons: "Avec icônes",
    fullWidth: "Pleine largeur",
    api: "API",
  },
  demos: {
    filledTitle: "primary, secondary, accent, danger",
    filledDescription:
      "primary porte l'action principale, secondary les actions de second plan, accent celles qu'il faut remarquer sans en faire l'action principale, danger les actions destructives. secondary écrit en blanc sur thème clair, et son fond descend d'un cran pour le porter : le blanc sur secondary.main n'y tenait que 2,98:1, il repose donc sur secondary.dark et atteint 4,95:1.",
    quietTitle: "tonal, ghost, text",
    quietDescription:
      "tonal dilue la couleur primaire dans la surface qui le porte et garde donc un fond, discret mais présent. ghost et text n'en ont aucun : ils écrivent avec la couleur de texte du thème — foncé sur clair, clair sur sombre — parce que sans fond le texte est le seul support du bouton. ghost conserve une bordure en primary, ce qui lui laisse son rappel de marque.",
    sizesTitle: "small, medium, large",
    sizesDescription:
      "La hauteur minimale monte d'un cran sur les écrans étroits, où le bouton est visé au doigt et non à la souris.",
    statesTitle: "Chargement et désactivé",
    statesDescription:
      "loading affiche un spinner et bloque les interactions le temps d'une action asynchrone. Désactivée, une variante sans fond en reçoit un : sans lui, rien ne distinguerait un bouton inactif d'un libellé grisé.",
    iconsTitle: "startIcon et endIcon",
    iconsDescription: "Combinez le bouton avec le composant Icon pour préciser l'action.",
    fullWidthTitle: "fullWidth",
  },
  props: {
    variant:
      "Style du bouton. Les quatre premières portent un fond plein, tonal un fond dilué, ghost une bordure seule, text ni l'un ni l'autre.",
    size: "Taille du bouton. Au doigt, la hauteur minimale est relevée dans les trois cas.",
    loading: "Affiche un indicateur de chargement et neutralise les clics.",
    disabled: "Désactive le bouton.",
    fullWidth: "Étire le bouton sur toute la largeur disponible.",
    type: "Type HTML natif, utile dans les formulaires.",
    onClick: "Handler appelé au clic.",
    startIcon: "Icône affichée avant le libellé.",
    endIcon: "Icône affichée après le libellé.",
    children: "Contenu du bouton.",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI action button. Seven variants in two families — four filled for actions that must be seen, three quiet for the ones that merely accompany — three sizes, a built-in loading state and icon slots before and after the label.",
  sections: {
    filled: "Filled variants",
    quiet: "Quiet variants",
    sizes: "Sizes",
    states: "States",
    icons: "With icons",
    fullWidth: "Full width",
    api: "API",
  },
  demos: {
    filledTitle: "primary, secondary, accent, danger",
    filledDescription:
      "primary carries the main action, secondary the supporting ones, accent those that must be noticed without being the main action, danger the destructive ones. secondary writes in white on the light theme, and its background goes one step down to carry it: white on secondary.main only reached 2.98:1, so it sits on secondary.dark and reaches 4.95:1.",
    quietTitle: "tonal, ghost, text",
    quietDescription:
      "tonal dilutes the primary color into the surface behind it, so it keeps a background, quiet but present. ghost and text have none: they write with the theme's text color — dark on light, light on dark — because without a background the text is the button's only support. ghost keeps a primary border, which preserves its brand cue.",
    sizesTitle: "small, medium, large",
    sizesDescription:
      "The minimum height goes up one notch on narrow screens, where the button is aimed at with a finger rather than a mouse.",
    statesTitle: "Loading and disabled",
    statesDescription:
      "loading shows a spinner and blocks interactions during an async action. When disabled, a background-less variant is given one: without it, nothing would tell an inactive button from a greyed-out label.",
    iconsTitle: "startIcon and endIcon",
    iconsDescription: "Combine the button with the Icon component to clarify the action.",
    fullWidthTitle: "fullWidth",
  },
  props: {
    variant:
      "Button style. The first four carry a solid background, tonal a diluted one, ghost a border only, text neither.",
    size: "Button size. On touch, the minimum height is raised in all three cases.",
    loading: "Shows a loading indicator and neutralizes clicks.",
    disabled: "Disables the button.",
    fullWidth: "Stretches the button across the available width.",
    type: "Native HTML type, useful inside forms.",
    onClick: "Handler called on click.",
    startIcon: "Icon displayed before the label.",
    endIcon: "Icon displayed after the label.",
    children: "Button content.",
  },
};

const texts = { fr, en };

export default function ButtonDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "variant",
      type: '"primary" | "secondary" | "accent" | "danger" | "tonal" | "ghost" | "text"',
      defaultValue: '"primary"',
      description: t.props.variant,
    },
    {
      name: "size",
      type: '"small" | "medium" | "large"',
      defaultValue: '"medium"',
      description: t.props.size,
    },
    {
      name: "loading",
      type: "boolean",
      defaultValue: "false",
      description: t.props.loading,
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: t.props.disabled,
    },
    {
      name: "fullWidth",
      type: "boolean",
      defaultValue: "false",
      description: t.props.fullWidth,
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      defaultValue: '"button"',
      description: t.props.type,
    },
    {
      name: "onClick",
      type: "MouseEventHandler<HTMLButtonElement>",
      description: t.props.onClick,
    },
    {
      name: "startIcon",
      type: "ReactNode",
      description: t.props.startIcon,
    },
    {
      name: "endIcon",
      type: "ReactNode",
      description: t.props.endIcon,
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.props.children,
    },
  ];

  return (
    <DocPage title="Button" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.filled}>
        <DemoCard
          title={t.demos.filledTitle}
          description={t.demos.filledDescription}
          code={filledCode}
        >
          <Button variant="primary">Primaire</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="danger">Danger</Button>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.quiet}>
        <DemoCard
          title={t.demos.quietTitle}
          description={t.demos.quietDescription}
          code={quietCode}
        >
          <Button variant="tonal">Tonal</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="text">Text</Button>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes}>
        <DemoCard
          title={t.demos.sizesTitle}
          description={t.demos.sizesDescription}
          code={sizesCode}
        >
          <Button size="small">Petit</Button>
          <Button size="medium">Moyen</Button>
          <Button size="large">Grand</Button>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.states}>
        <DemoCard
          title={t.demos.statesTitle}
          description={t.demos.statesDescription}
          code={statesCode}
        >
          <Button loading>Chargement</Button>
          <Button disabled>Désactivé</Button>
          <Button variant="ghost" disabled>
            Désactivé
          </Button>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.icons}>
        <DemoCard
          title={t.demos.iconsTitle}
          description={t.demos.iconsDescription}
          code={iconsCode}
        >
          <Button startIcon={<Icon name="plus" size="xs" />}>Ajouter</Button>
          <Button variant="secondary" endIcon={<Icon name="caretRight" size="xs" />}>
            Suivant
          </Button>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.fullWidth}>
        <DemoCard title={t.demos.fullWidthTitle} code={fullWidthCode} align="stretch">
          <Button fullWidth>Pleine largeur</Button>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
