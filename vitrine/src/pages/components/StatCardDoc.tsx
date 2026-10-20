import { StatCard } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { StatCard } from "@canop/ui";`;

const basicCode = `<StatCard label="Utilisateurs actifs" value="1 284" icon="user" />
<StatCard label="Revenu mensuel" value="48 320 €" icon="wallet" iconColor="success" />`;

const variationCode = `<StatCard
  label="Nouvelles inscriptions"
  value="326"
  variation={12.4}
  variationLabel="vs mois dernier"
  icon="barChart"
/>
<StatCard
  label="Taux de rebond"
  value="38 %"
  variation={-4.2}
  variationLabel="vs mois dernier"
  icon="refresh"
/>`;

const invertedCode = `<StatCard
  label="Taux de désabonnement"
  value="2,1 %"
  variation={3.5}
  variationLabel="vs mois dernier"
  positiveIsGood={false}
  icon="logout"
  iconColor="warning"
/>`;

const clickableCode = `<StatCard
  label="Demandes à traiter"
  value="12"
  icon="alarm"
  iconColor="info"
  tone="info"
  onClick={openRequests}
  ariaLabel="Ouvrir les 12 demandes à traiter"
/>`;

const fr = {
  intro:
    "Carte de métrique pour tableaux de bord. Un libellé, une valeur mise en avant, une variation colorée selon qu'elle est favorable ou non, et une icône teintée. La carte s'anime à l'apparition, sauf préférence de mouvement réduit.",
  sections: {
    basic: "Métrique simple",
    variation: "Variation",
    inverted: "Sens de la variation",
    clickable: "Carte cliquable",
    api: "API",
  },
  demos: {
    clickableTitle: "onClick et tone info",
    clickableDescription:
      "Avec onClick, la carte devient un bouton : focus clavier, Entrée et Espace, curseur, léger soulèvement au survol (immobile en mouvement réduit). Elle garde son fond de carte stat. Le ton info signale une information à consulter, sans connotation de réussite ni d'alerte.",
    basicTitle: "label, value et icon",
    basicDescription:
      "La forme minimale : un libellé, une valeur et une icône optionnelle dont la couleur teinte le fond.",
    variationTitle: "variation et variationLabel",
    variationDescription:
      "variation affiche un delta signé, coloré en succès s'il est favorable, en erreur sinon. variationLabel précise la période de comparaison.",
    invertedTitle: "positiveIsGood",
    invertedDescription:
      "Pour une métrique où la hausse est mauvaise (désabonnement, coûts), positiveIsGood={false} inverse le code couleur de la variation.",
  },
  props: {
    tone: "Teinte la carte entière selon ce que la valeur signifie : un solde prévisionnel positif en vert, négatif en rouge. À distinguer de iconColor, qui n'habille que l'icône, et de variation, qui parle de l'écart et non du niveau.",
    label: "Libellé de la métrique, affiché en capitales discrètes.",
    value: "Valeur principale mise en avant.",
    variation: "Delta signé affiché sous la valeur. Masqué si absent.",
    variationLabel: "Texte de contexte affiché à côté de la variation.",
    icon: "Icône CanopUI affichée dans une pastille teintée.",
    iconColor: "Couleur de l'icône et de sa pastille, issue du thème.",
    positiveIsGood: "Détermine si une variation positive est colorée en succès ou en erreur.",
    animated: "Active l'animation d'apparition (désactivée si mouvement réduit).",
    onClick: "Action au clic. La carte devient alors un bouton accessible au clavier.",
    ariaLabel:
      "Nom accessible de la carte. Sur une carte cliquable, remplace la lecture de tout son contenu par un intitulé concis.",
  },
};

const en: typeof fr = {
  intro:
    "A metric card for dashboards. A label, a highlighted value, a variation colored by whether it is favorable or not, and a tinted icon. The card animates on appearance, unless reduced motion is preferred.",
  sections: {
    basic: "Simple metric",
    variation: "Variation",
    inverted: "Variation direction",
    clickable: "Clickable card",
    api: "API",
  },
  demos: {
    clickableTitle: "onClick and the info tone",
    clickableDescription:
      "With onClick the card becomes a button: keyboard focus, Enter and Space, pointer cursor, a slight lift on hover (none under reduced motion). It keeps its stat card background. The info tone flags something worth a look, with no success or alert connotation.",
    basicTitle: "label, value and icon",
    basicDescription:
      "The minimal form: a label, a value and an optional icon whose color tints the background.",
    variationTitle: "variation and variationLabel",
    variationDescription:
      "variation shows a signed delta, colored as success when favorable, as error otherwise. variationLabel clarifies the comparison period.",
    invertedTitle: "positiveIsGood",
    invertedDescription:
      "For a metric where an increase is bad (churn, costs), positiveIsGood={false} flips the color coding of the variation.",
  },
  props: {
    tone: "Tints the whole card according to what the value means: a positive forecast balance in green, a negative one in red. Distinct from iconColor, which only dresses the icon, and from variation, which speaks of the change rather than the level.",
    label: "Metric label, displayed in subtle uppercase.",
    value: "Highlighted primary value.",
    variation: "Signed delta displayed below the value. Hidden when absent.",
    variationLabel: "Context text shown next to the variation.",
    icon: "CanopUI icon displayed in a tinted pill.",
    iconColor: "Color of the icon and its pill, from the theme.",
    positiveIsGood: "Determines whether a positive variation is colored as success or as error.",
    animated: "Enables the appearance animation (disabled under reduced motion).",
    onClick: "Action on click. The card then becomes a keyboard-accessible button.",
    ariaLabel:
      "Accessible name of the card. On a clickable card, replaces the reading of its whole content with a concise label.",
  },
};

const texts = { fr, en };

export default function StatCardDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "label", type: "string", required: true, description: t.props.label },
    { name: "value", type: "string", required: true, description: t.props.value },
    { name: "variation", type: "number", description: t.props.variation },
    { name: "variationLabel", type: "string", description: t.props.variationLabel },
    { name: "icon", type: "CanopIconName", description: t.props.icon },
    {
      name: "iconColor",
      type: '"primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error" | "inherit"',
      defaultValue: '"primary"',
      description: t.props.iconColor,
    },
    {
      name: "positiveIsGood",
      type: "boolean",
      defaultValue: "true",
      description: t.props.positiveIsGood,
    },
    { name: "animated", type: "boolean", defaultValue: "true", description: t.props.animated },
    {
      name: "tone",
      type: '"neutral" | "info" | "success" | "warning" | "error"',
      defaultValue: '"neutral"',
      description: t.props.tone,
    },
    { name: "onClick", type: "() => void", description: t.props.onClick },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
  ];

  return (
    <DocPage title="StatCard" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
          align="start"
        >
          <StatCard label="Utilisateurs actifs" value="1 284" icon="user" />
          <StatCard label="Revenu mensuel" value="48 320 €" icon="wallet" iconColor="success" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.variation}>
        <DemoCard
          title={t.demos.variationTitle}
          description={t.demos.variationDescription}
          code={variationCode}
          align="start"
        >
          <StatCard
            label="Nouvelles inscriptions"
            value="326"
            variation={12.4}
            variationLabel="vs mois dernier"
            icon="barChart"
          />
          <StatCard
            label="Taux de rebond"
            value="38 %"
            variation={-4.2}
            variationLabel="vs mois dernier"
            icon="refresh"
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.inverted}>
        <DemoCard
          title={t.demos.invertedTitle}
          description={t.demos.invertedDescription}
          code={invertedCode}
          align="start"
        >
          <StatCard
            label="Taux de désabonnement"
            value="2,1 %"
            variation={3.5}
            variationLabel="vs mois dernier"
            positiveIsGood={false}
            icon="logout"
            iconColor="warning"
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.clickable}>
        <DemoCard
          title={t.demos.clickableTitle}
          description={t.demos.clickableDescription}
          code={clickableCode}
          align="start"
        >
          <StatCard
            label="Demandes à traiter"
            value="12"
            icon="alarm"
            iconColor="info"
            tone="info"
            onClick={() => undefined}
            ariaLabel="Ouvrir les 12 demandes à traiter"
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
