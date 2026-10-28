import { useState } from "react";
import { Icon, Pressable, Stack, Text, useBreakpointDown } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Pressable } from "@canop/ui";`;

const COULEURS = ["#3f7f5f", "#c9762f", "#6d4f9c", "#2f7fa8", "#a83f52"];
const ICONES = ["home", "folder", "image", "mail", "settings"] as const;

const couleursCode = `function ChoixCouleur() {
  const [valeur, setValeur] = useState(COULEURS[0]);
  return (
    <Stack direction="row" gap="sm" wrap role="radiogroup" ariaLabel="Couleur">
      {COULEURS.map((couleur, index) => (
        <Pressable
          key={couleur}
          role="radio"
          ariaChecked={couleur === valeur}
          ariaLabel={\`Couleur \${index + 1}\`}
          onClick={() => setValeur(couleur)}
          radius="circle"
          size="2.25rem"
          background={couleur}
          selected={couleur === valeur}
        />
      ))}
    </Stack>
  );
}`;

function ChoixCouleur() {
  const [valeur, setValeur] = useState(COULEURS[0]);
  return (
    <Stack direction="row" gap="sm" wrap role="radiogroup" ariaLabel="Couleur">
      {COULEURS.map((couleur, index) => (
        <Pressable
          key={couleur}
          role="radio"
          ariaChecked={couleur === valeur}
          ariaLabel={`Couleur ${index + 1}`}
          onClick={() => setValeur(couleur)}
          radius="circle"
          size="2.25rem"
          background={couleur}
          selected={couleur === valeur}
        />
      ))}
    </Stack>
  );
}

const iconesCode = `function ChoixIcone() {
  const [valeur, setValeur] = useState("home");
  return (
    <Stack direction="row" gap="sm" wrap role="radiogroup" ariaLabel="Icône">
      {ICONES.map((nom) => (
        <Pressable
          key={nom}
          role="radio"
          ariaChecked={nom === valeur}
          ariaLabel={nom}
          onClick={() => setValeur(nom)}
          radius="md"
          size="2.75rem"
          background="var(--canop-palette-surface-sunken)"
          selected={nom === valeur}
        >
          <Icon name={nom} size="sm" />
        </Pressable>
      ))}
    </Stack>
  );
}`;

function ChoixIcone() {
  const [valeur, setValeur] = useState<(typeof ICONES)[number]>("home");
  return (
    <Stack direction="row" gap="sm" wrap role="radiogroup" ariaLabel="Icône">
      {ICONES.map((nom) => (
        <Pressable
          key={nom}
          role="radio"
          ariaChecked={nom === valeur}
          ariaLabel={nom}
          onClick={() => setValeur(nom)}
          radius="md"
          size="2.75rem"
          background="var(--canop-palette-surface-sunken)"
          selected={nom === valeur}
        >
          <Icon name={nom} size="sm" />
        </Pressable>
      ))}
    </Stack>
  );
}

const breakpointCode = `const compact = useBreakpointDown("md");`;

function PaliersDemo() {
  const compact = useBreakpointDown("md");
  return (
    <Text variant="body-md">
      {compact
        ? "La fenêtre est sous md : disposition compacte."
        : "La fenêtre est au moins md : disposition large."}
    </Text>
  );
}

const fr = {
  intro:
    "Une surface cliquable sans apparence. Pressable apporte la forme en squircle, l'état de sélection et l'accessibilité, et laisse son contenu entièrement libre. C'est la pièce à utiliser quand ce qu'on rend cliquable n'est pas un bouton : une pastille de couleur, une tuile de galerie, un choix d'icône.",
  sections: {
    couleurs: "Choix d'une couleur",
    icones: "Choix d'une icône",
    paliers: "Points de rupture",
    api: "API",
  },
  demos: {
    couleurs: {
      title: "Pastilles rondes, sélectionnables",
      description:
        'radius="circle" donne un disque parfait, size le côté, background la couleur. selected pose un liseré et grossit légèrement la pastille — un liseré et non une bordure, qui déplacerait le contenu et se décalerait du squircle. Le groupe porte role="radiogroup" et chaque pastille role="radio" : l\'ensemble se parcourt aux flèches et s\'annonce correctement.',
    },
    icones: {
      title: "Tuiles carrées à contenu libre",
      description:
        "Le contenu est rendu tel quel, ici une icône. Pressable ne suppose rien de ce qu'il enveloppe : une image, un graphique, une pile de texte.",
    },
    paliers: {
      title: "useBreakpointDown, useBreakpointUp",
      description:
        'Les trois hooks de points de rupture répondent aux bornes du thème, en rem, et non à une requête média écrite à la main dans le portail — c\'est ainsi que les deux se désynchronisaient. La borne haute est exclusive : à une largeur exactement égale à md, down("md") est faux et up("md") est vrai, jamais les deux.',
    },
  },
  props: {
    dimWhenDisabled:
      "Atténue la surface quand elle est désactivée. À passer à false quand le verrouillage sert à montrer quelque chose plutôt qu'à l'écarter : une réponse dont le verdict vient de tomber perdrait sinon sa teinte et sa marque à l'instant même de la révélation.",
    ariaPressed: "État enfoncé, pour une surface qui bascule.",
    as: "Élément rendu à la racine, quand un bouton ne convient pas — une étiquette de champ, un élément de liste.",
    children: "Contenu rendu tel quel au centre de la surface.",
    onClick: "Action déclenchée au clic, à la touche Entrée et à la barre d'espace.",
    radius: "Rayon du squircle, ou circle pour un disque parfait.",
    size: "Côté d'une surface carrée, par exemple 2.25rem.",
    background: "Couleur de fond de la surface.",
    padding: "Rembourrage intérieur, pris dans l'échelle d'espacement.",
    selected: "Entoure la surface d'un liseré et la grossit légèrement.",
    fullWidth: "Étire la surface sur toute la largeur disponible.",
    role: "Rôle ARIA, quand la surface n'est pas un simple bouton.",
    ariaChecked: "État coché, pour les rôles radio et checkbox.",
    disabled: "Rend la surface inerte et la désature.",
  },
};

const en: typeof fr = {
  intro:
    "A clickable surface with no look of its own. Pressable brings the squircle shape, the selected state and accessibility, and leaves its content entirely free. Reach for it when the thing you make clickable is not a button: a colour swatch, a gallery tile, an icon choice.",
  sections: {
    couleurs: "Picking a colour",
    icones: "Picking an icon",
    paliers: "Breakpoints",
    api: "API",
  },
  demos: {
    couleurs: {
      title: "Round, selectable swatches",
      description:
        'radius="circle" gives a true disc, size the side, background the colour. selected draws a ring and grows the swatch slightly — a ring, not a border, which would shift the content and drift from the squircle. The group carries role="radiogroup" and each swatch role="radio": the set is arrow-navigable and announced properly.',
    },
    icones: {
      title: "Square tiles with free content",
      description:
        "The content is rendered as is, here an icon. Pressable assumes nothing about what it wraps: an image, a chart, a stack of text.",
    },
    paliers: {
      title: "useBreakpointDown, useBreakpointUp",
      description:
        'The three breakpoint hooks answer the theme\'s own bounds, in rem, rather than a media query hand-written in the portal — which is how the two drifted apart. The upper bound is exclusive: at a width exactly equal to md, down("md") is false and up("md") is true, never both.',
    },
  },
  props: {
    dimWhenDisabled:
      "Dims the surface when it is disabled. Pass false when locking is there to show something rather than to rule it out: an answer whose verdict has just landed would otherwise lose its tint and its mark at the very moment of the reveal.",
    ariaPressed: "Pressed state, for a surface that toggles.",
    as: "Element rendered at the root, when a button will not do — a field label, a list item.",
    children: "Content rendered as is, centred in the surface.",
    onClick: "Action fired on click, on Enter and on Space.",
    radius: "Squircle radius, or circle for a true disc.",
    size: "Side of a square surface, for instance 2.25rem.",
    background: "Background colour of the surface.",
    padding: "Inner padding, taken from the spacing scale.",
    selected: "Draws a ring around the surface and grows it slightly.",
    fullWidth: "Stretches the surface across the available width.",
    role: "ARIA role, when the surface is not a plain button.",
    ariaChecked: "Checked state, for the radio and checkbox roles.",
    disabled: "Makes the surface inert and desaturated.",
  },
};

const texts = { fr, en };

export default function PressableDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "children", type: "ReactNode", description: t.props.children },
    { name: "onClick", type: "() => void", description: t.props.onClick },
    {
      name: "radius",
      type: '"xs" | "sm" | "md" | "lg" | "xl" | "pill" | "circle"',
      defaultValue: '"md"',
      description: t.props.radius,
    },
    { name: "size", type: "string", description: t.props.size },
    { name: "background", type: "string", description: t.props.background },
    {
      name: "padding",
      type: "CanopPressableSpacing",
      defaultValue: '"none"',
      description: t.props.padding,
    },
    { name: "selected", type: "boolean", defaultValue: "false", description: t.props.selected },
    { name: "fullWidth", type: "boolean", defaultValue: "false", description: t.props.fullWidth },
    { name: "role", type: "CanopPressableRole", description: t.props.role },
    { name: "ariaChecked", type: "boolean", description: t.props.ariaChecked },
    { name: "disabled", type: "boolean", defaultValue: "false", description: t.props.disabled },
    {
      name: "dimWhenDisabled",
      type: "boolean",
      defaultValue: "true",
      description: t.props.dimWhenDisabled,
    },
    { name: "ariaPressed", type: "boolean", description: t.props.ariaPressed },
    { name: "as", type: "ElementType", defaultValue: '"button"', description: t.props.as },
  ];

  return (
    <DocPage title="Pressable" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.couleurs}>
        <DemoCard
          title={t.demos.couleurs.title}
          description={t.demos.couleurs.description}
          code={couleursCode}
        >
          <ChoixCouleur />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.icones}>
        <DemoCard
          title={t.demos.icones.title}
          description={t.demos.icones.description}
          code={iconesCode}
        >
          <ChoixIcone />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.paliers}>
        <DemoCard
          title={t.demos.paliers.title}
          description={t.demos.paliers.description}
          code={breakpointCode}
        >
          <PaliersDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
