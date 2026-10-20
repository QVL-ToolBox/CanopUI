import { Legend } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Legend } from "@canop/ui";`;

const basicCode = `<Legend
  items={[
    { tone: "success", label: "Terminé" },
    { tone: "warning", label: "En cours" },
    { tone: "error", label: "Bloqué" },
    { tone: "info", label: "À relire" },
    { tone: "neutral", label: "Non démarré" },
  ]}
/>`;

const colorCode = `<Legend
  items={[
    { tone: "success", label: "Trouvé" },
    { tone: "error", label: "Manqué" },
    { color: "background.paper", label: "Non joué" },
  ]}
/>`;

const fr = {
  intro:
    "Légende horizontale associant des pastilles colorées à des libellés. Idéale pour expliquer un code couleur de statut dans un tableau, un graphique ou un tableau de bord.",
  sections: {
    basic: {
      title: "Usage de base",
      demoTitle: "Entrées de légende",
      demoDescription:
        "Chaque entrée combine une tonalité, qui pilote la couleur de la pastille, et un libellé. La légende passe à la ligne sur les écrans étroits.",
    },
    color: {
      title: "Couleur libre",
      demoTitle: "Une pastille sur une surface",
      demoDescription:
        "Les cinq tonalités décrivent des états, pas des surfaces, et neutral est câblé sur text.secondary. Une légende n'a pourtant de valeur que si sa pastille porte la couleur réellement employée : pour une carte au repos, peinte en background.paper, aucune tonalité ne convient et le seul recours honnête était de retirer l'entrée. color accepte un jeton du thème et ferme ce trou.",
    },
    api: "API",
    entry: {
      title: "CanopLegendEntry",
      description:
        "Structure d'une entrée de légende : soit une tonalité sémantique, soit une couleur libre. Les deux formes se mélangent dans une même liste.",
    },
  },
  props: {
    items: "Liste des entrées de légende à afficher.",
    tone: "Tonalité qui détermine la couleur de la pastille (issue du thème).",
    color:
      "Jeton de couleur du thème peignant la pastille, pour les entrées qu'aucune tonalité ne décrit. Exclusif de tone.",
    label: "Texte décrivant l'entrée de légende.",
  },
};

const en: typeof fr = {
  intro:
    "Horizontal legend pairing colored dots with labels. Ideal for explaining a status color code in a table, a chart or a dashboard.",
  sections: {
    basic: {
      title: "Basic usage",
      demoTitle: "Legend entries",
      demoDescription:
        "Each entry combines a tone, which drives the color of the dot, with a label. The legend wraps on narrow screens.",
    },
    color: {
      title: "Free color",
      demoTitle: "A dot on a surface",
      demoDescription:
        "The five tones describe states, not surfaces, and neutral is wired to text.secondary. Yet a legend is only worth something if its dot carries the color actually used: for a card at rest, painted in background.paper, no tone fits and the only honest way out was to drop the entry. color takes a theme token and closes that gap.",
    },
    api: "API",
    entry: {
      title: "CanopLegendEntry",
      description:
        "Shape of a legend entry: either a semantic tone, or a free color. Both forms mix within a single list.",
    },
  },
  props: {
    items: "List of legend entries to display.",
    tone: "Tone that determines the color of the dot (from the theme).",
    color:
      "Theme color token painting the dot, for entries no tone describes. Mutually exclusive with tone.",
    label: "Text describing the legend entry.",
  },
};

const texts = { fr, en };

export default function LegendDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "items",
      type: "CanopLegendEntry[]",
      required: true,
      description: t.props.items,
    },
  ];

  const entryRows: PropRow[] = [
    {
      name: "tone",
      type: '"neutral" | "info" | "success" | "warning" | "error"',
      defaultValue: "—",
      description: t.props.tone,
    },
    {
      name: "color",
      type: "string",
      defaultValue: "—",
      description: t.props.color,
    },
    {
      name: "label",
      type: "string",
      required: true,
      description: t.props.label,
    },
  ];

  return (
    <DocPage title="Legend" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.basic.title}>
        <DemoCard
          title={t.sections.basic.demoTitle}
          description={t.sections.basic.demoDescription}
          code={basicCode}
          align="stretch"
        >
          <Legend
            items={[
              { tone: "success", label: "Terminé" },
              { tone: "warning", label: "En cours" },
              { tone: "error", label: "Bloqué" },
              { tone: "info", label: "À relire" },
              { tone: "neutral", label: "Non démarré" },
            ]}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.color.title}>
        <DemoCard
          title={t.sections.color.demoTitle}
          description={t.sections.color.demoDescription}
          code={colorCode}
          align="stretch"
        >
          <Legend
            items={[
              { tone: "success", label: "Trouvé" },
              { tone: "error", label: "Manqué" },
              { color: "background.paper", label: "Non joué" },
            ]}
          />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
      <DocSection title={t.sections.entry.title} description={t.sections.entry.description}>
        <PropsTable rows={entryRows} />
      </DocSection>
    </DocPage>
  );
}
