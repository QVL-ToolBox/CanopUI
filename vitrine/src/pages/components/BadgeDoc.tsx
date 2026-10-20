import { Badge, Icon } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Badge } from "@canop/ui";`;

const anchoredCode = `<Badge count={3}>
  <Icon name="mail" size="lg" />
</Badge>
<Badge variant="dot" color="success">
  <Icon name="user" size="lg" />
</Badge>`;

const standaloneCode = `<Badge count={12} color="primary" />
<Badge count={128} max={99} color="accent" />
<Badge variant="dot" color="warning" />`;

const colorsCode = `<Badge count={5} color="primary" />
<Badge count={5} color="accent" />
<Badge count={5} color="success" />
<Badge count={5} color="warning" />
<Badge count={5} color="error" />
<Badge count={5} color="info" />`;

const fr = {
  intro:
    "Pastille de notification. Deux variantes — un compteur numérique ou un simple point — utilisables seules ou ancrées à un élément (icône, avatar). Le compteur se plafonne à max et se masque à zéro sauf showZero.",
  sections: {
    anchored: "Ancré à un élément",
    standalone: "Autonome",
    colors: "Couleurs",
    api: "API",
  },
  demos: {
    anchoredTitle: "count et dot sur un enfant",
    anchoredDescription:
      "Enveloppez un élément : la pastille se positionne dans le coin défini par placement. dot affiche un point discret, count un compteur.",
    standaloneTitle: "Sans enfant",
    standaloneDescription:
      "Sans children, la pastille se rend seule sous forme de puce. Au-delà de max, le compteur affiche « max+ ».",
    colorsTitle: "Sept couleurs sémantiques",
    colorsDescription:
      "color reprend les couleurs du thème pour porter l'intention de la pastille.",
  },
  props: {
    variant: "Forme de la pastille : compteur numérique ou point discret.",
    count: "Valeur du compteur affichée en variante count.",
    max: "Valeur maximale affichée ; au-delà, la pastille affiche « max+ ».",
    showZero: "Affiche la pastille même lorsque count vaut zéro.",
    color: "Couleur sémantique de la pastille, issue du thème.",
    placement: "Coin d'ancrage de la pastille lorsqu'elle enveloppe un enfant.",
    ariaLabel: "Libellé accessible décrivant la notification.",
    children: "Élément enveloppé sur lequel la pastille est ancrée.",
  },
};

const en: typeof fr = {
  intro:
    "A notification badge. Two variants — a numeric count or a plain dot — usable on their own or anchored to an element (icon, avatar). The count caps at max and hides at zero unless showZero is set.",
  sections: {
    anchored: "Anchored to an element",
    standalone: "Standalone",
    colors: "Colors",
    api: "API",
  },
  demos: {
    anchoredTitle: "count and dot on a child",
    anchoredDescription:
      "Wrap an element: the badge sits in the corner defined by placement. dot shows a subtle dot, count a counter.",
    standaloneTitle: "Without a child",
    standaloneDescription:
      "Without children, the badge renders on its own as a pill. Beyond max, the counter shows “max+”.",
    colorsTitle: "Seven semantic colors",
    colorsDescription: "color reuses the theme palette to carry the intent of the badge.",
  },
  props: {
    variant: "Shape of the badge: numeric counter or subtle dot.",
    count: "Counter value displayed in the count variant.",
    max: "Maximum value shown; beyond it, the badge displays “max+”.",
    showZero: "Shows the badge even when count is zero.",
    color: "Semantic color of the badge, from the theme.",
    placement: "Anchor corner of the badge when it wraps a child.",
    ariaLabel: "Accessible label describing the notification.",
    children: "Wrapped element the badge is anchored to.",
  },
};

const texts = { fr, en };

export default function BadgeDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "variant",
      type: '"count" | "dot"',
      defaultValue: '"count"',
      description: t.props.variant,
    },
    { name: "count", type: "number", defaultValue: "0", description: t.props.count },
    { name: "max", type: "number", defaultValue: "99", description: t.props.max },
    { name: "showZero", type: "boolean", defaultValue: "false", description: t.props.showZero },
    {
      name: "color",
      type: '"primary" | "secondary" | "accent" | "error" | "warning" | "info" | "success"',
      defaultValue: '"error"',
      description: t.props.color,
    },
    {
      name: "placement",
      type: '"top-right" | "top-left" | "bottom-right" | "bottom-left"',
      defaultValue: '"top-right"',
      description: t.props.placement,
    },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
    { name: "children", type: "ReactNode", description: t.props.children },
  ];

  return (
    <DocPage title="Badge" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.anchored}>
        <DemoCard
          title={t.demos.anchoredTitle}
          description={t.demos.anchoredDescription}
          code={anchoredCode}
        >
          <Badge count={3}>
            <Icon name="mail" size="lg" />
          </Badge>
          <Badge variant="dot" color="success">
            <Icon name="user" size="lg" />
          </Badge>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.standalone}>
        <DemoCard
          title={t.demos.standaloneTitle}
          description={t.demos.standaloneDescription}
          code={standaloneCode}
        >
          <Badge count={12} color="primary" />
          <Badge count={128} max={99} color="accent" />
          <Badge variant="dot" color="warning" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.colors}>
        <DemoCard
          title={t.demos.colorsTitle}
          description={t.demos.colorsDescription}
          code={colorsCode}
        >
          <Badge count={5} color="primary" />
          <Badge count={5} color="accent" />
          <Badge count={5} color="success" />
          <Badge count={5} color="warning" />
          <Badge count={5} color="error" />
          <Badge count={5} color="info" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
