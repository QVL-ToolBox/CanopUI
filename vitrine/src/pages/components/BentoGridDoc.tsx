import { BentoGrid, BentoTile, Card } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";
import { BentoShowcase } from "./bento/BentoShowcase";

const importCode = `import { BentoGrid, BentoTile, Presence } from "@canop/ui";`;

const showcaseCode = `<BentoGrid columns={{ sm: 2, md: 3 }} rowHeight="9rem" role="region" ariaLabel="Accueil du Cockpit">
  <Presence stagger={0.06} appear>
    <BentoTile key="chess" span={2} rowSpan={{ md: 2 }} layout>
      <Card variant="interactive" fill arrow title="Échecs" subtitle="Parties par correspondance">
        <Stack fill justifyContent="end" gap="xs">
          <Text variant="display">3</Text>
          <Text variant="body-sm" tone="muted">parties attendent votre coup</Text>
        </Stack>
      </Card>
    </BentoTile>
    <BentoTile key="approvals" layout>
      <Card variant="interactive" fill arrow title="Approbations">…</Card>
    </BentoTile>
    <BentoTile key="reviews" layout>
      <Card variant="interactive" fill arrow title="Reviews">…</Card>
    </BentoTile>
    {alertsShown ? (
      <BentoTile key="alerts" span={3} layout>
        <Card tone="warning" fill title="2 alertes">…</Card>
      </BentoTile>
    ) : null}
  </Presence>
</BentoGrid>`;

const spansCode = `<BentoGrid columns={{ sm: 2, md: 4 }}>
  <BentoTile span={{ sm: 2 }}>
    <Card fill title="span sm: 2">Pleine largeur dès sm</Card>
  </BentoTile>
  <BentoTile>
    <Card fill title="1">Une colonne</Card>
  </BentoTile>
  <BentoTile>
    <Card fill title="1">Une colonne</Card>
  </BentoTile>
  <BentoTile span={4}>
    <Card fill title="span 4">Ramené à deux colonnes en sm, à une en xs</Card>
  </BentoTile>
</BentoGrid>`;

const fr = {
  intro:
    "Grille bento : des tuiles d'étendue variable sur un nombre de colonnes imposé. En dessous de sm, la grille se replie toujours sur une colonne ; au-delà, chaque tuile s'étend sur le nombre de colonnes et de rangées demandé, par point de rupture, sans jamais dépasser la largeur de la grille.",
  sections: {
    showcase: "Accueil bento",
    spans: "Étendues",
    api: "API",
    tileApi: "BentoTile",
    presenceApi: "Presence et PresenceItem",
  },
  demos: {
    showcase: {
      title: "Tuile vedette, compteurs et alerte large",
      description:
        "La tuile Échecs couvre deux colonnes et deux rangées à partir de md, les deux compteurs s'empilent à sa droite, l'alerte prend toute la largeur. Presence fait entrer les tuiles en cascade (stagger), les cartes interactives poussent leur flèche au survol, et les tuiles d'une même rangée ont la même hauteur grâce à fill. En mouvement réduit, tout s'affiche directement.",
    },
    spans: {
      title: "span et rowSpan par point de rupture",
      description:
        "Une étendue fixe vaut pour toutes les tailles, une étendue objet hérite du palier inférieur. Elle est toujours ramenée au nombre de colonnes du palier : une tuile en span={4} occupe toute la largeur à chaque taille, et un rowSpan n'a pas d'effet quand la grille n'a qu'une colonne. Hors Presence, comme ici, chaque tuile joue quand même son entrée à son montage, sans cascade ; seul le mouvement réduit la coupe.",
    },
  },
  props: {
    columns:
      "Nombre de colonnes, fixe ou par point de rupture. xs vaut une colonne sauf valeur explicite, et un nombre fixe s'applique à partir de sm.",
    gap: "Espacement entre les tuiles, sur l'échelle de spacing du thème.",
    rowHeight:
      "Hauteur minimale d'une rangée (en rem). Sans elle, chaque rangée prend la hauteur de son contenu le plus haut.",
    role: "Rôle ARIA transmis à l'élément rendu.",
    ariaLabel: "Nom accessible transmis à l'élément rendu.",
    children: "Les tuiles, directement ou dans un Presence.",
    span: "Nombre de colonnes couvertes, fixe ou par point de rupture. Ramené au nombre de colonnes de la grille.",
    rowSpan:
      "Nombre de rangées couvertes, fixe ou par point de rupture. Ignoré quand la grille n'a qu'une colonne.",
    layout: "Fait glisser la tuile jusqu'à sa nouvelle place quand une voisine entre ou sort.",
    tileChildren: "Le contenu de la tuile, typiquement une Card fill.",
    stagger:
      "Presence : écart en secondes entre les entrées de deux enfants successifs. Ignoré en mouvement réduit.",
    appear:
      "Presence : joue aussi l'entrée des enfants présents au premier rendu. Désactivé par défaut.",
    fill: "PresenceItem : occupe toute la hauteur de son conteneur pour qu'une Card fill s'étire avec lui.",
  },
};

const en: typeof fr = {
  intro:
    "Bento grid: tiles of variable extent over a stated column count. Below sm the grid always folds into a single column; above it, each tile spans the requested columns and rows, per breakpoint, never wider than the grid.",
  sections: {
    showcase: "Bento home",
    spans: "Extents",
    api: "API",
    tileApi: "BentoTile",
    presenceApi: "Presence and PresenceItem",
  },
  demos: {
    showcase: {
      title: "Featured tile, counters and wide alert",
      description:
        "The Chess tile covers two columns and two rows from md, both counters stack on its right, the alert takes the full width. Presence brings the tiles in as a cascade (stagger), interactive cards nudge their arrow on hover, and tiles on the same row share the same height thanks to fill. With reduced motion, everything shows at once.",
    },
    spans: {
      title: "span and rowSpan per breakpoint",
      description:
        "A fixed extent applies at every size, an object extent inherits from the lower step. It is always capped at the column count of the step: a span={4} tile fills the width at every size, and a rowSpan has no effect while the grid has a single column. Outside a Presence, as here, each tile still plays its entrance when it mounts, without a cascade; only reduced motion turns it off.",
    },
  },
  props: {
    columns:
      "Column count, fixed or per breakpoint. xs is one column unless stated, and a fixed number applies from sm.",
    gap: "Spacing between tiles, on the theme spacing scale.",
    rowHeight:
      "Minimum row height (in rem). Without it, each row takes the height of its tallest content.",
    role: "ARIA role passed to the rendered element.",
    ariaLabel: "Accessible name passed to the rendered element.",
    children: "The tiles, directly or inside a Presence.",
    span: "Number of columns covered, fixed or per breakpoint. Capped at the grid column count.",
    rowSpan:
      "Number of rows covered, fixed or per breakpoint. Ignored while the grid has one column.",
    layout: "Slides the tile to its new place when a neighbour enters or leaves.",
    tileChildren: "The tile content, usually a fill Card.",
    stagger:
      "Presence: delay in seconds between the entrances of two consecutive children. Ignored with reduced motion.",
    appear:
      "Presence: also plays the entrance of children present on first render. Off by default.",
    fill: "PresenceItem: fills the full height of its container so a fill Card stretches with it.",
  },
};

const texts = { fr, en };

const SPAN_TYPE = 'number | Partial<Record<"xs" | "sm" | "md" | "lg", number>>';

export default function BentoGridDoc() {
  const t = texts[useDocLocale()];

  const gridRows: PropRow[] = [
    {
      name: "columns",
      type: "CanopBentoColumns",
      defaultValue: "{ sm: 2, md: 3 }",
      description: t.props.columns,
    },
    {
      name: "gap",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: t.props.gap,
    },
    { name: "rowHeight", type: "string", description: t.props.rowHeight },
    { name: "role", type: "AriaRole", description: t.props.role },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
    { name: "children", type: "ReactNode", required: true, description: t.props.children },
  ];

  const tileRows: PropRow[] = [
    { name: "span", type: SPAN_TYPE, defaultValue: "1", description: t.props.span },
    { name: "rowSpan", type: SPAN_TYPE, defaultValue: "1", description: t.props.rowSpan },
    { name: "layout", type: "boolean", defaultValue: "false", description: t.props.layout },
    { name: "role", type: "AriaRole", description: t.props.role },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
    { name: "children", type: "ReactNode", required: true, description: t.props.tileChildren },
  ];

  const presenceRows: PropRow[] = [
    { name: "stagger", type: "number", defaultValue: "0", description: t.props.stagger },
    { name: "appear", type: "boolean", defaultValue: "false", description: t.props.appear },
    { name: "fill", type: "boolean", defaultValue: "false", description: t.props.fill },
  ];

  return (
    <DocPage title="BentoGrid" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.showcase}>
        <DemoCard
          title={t.demos.showcase.title}
          description={t.demos.showcase.description}
          code={showcaseCode}
          align="stretch"
        >
          <BentoShowcase />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.spans}>
        <DemoCard
          title={t.demos.spans.title}
          description={t.demos.spans.description}
          code={spansCode}
          align="stretch"
        >
          <BentoGrid columns={{ sm: 2, md: 4 }}>
            <BentoTile span={{ sm: 2 }}>
              <Card fill title="span sm: 2">
                Pleine largeur dès sm
              </Card>
            </BentoTile>
            <BentoTile>
              <Card fill title="1">
                Une colonne
              </Card>
            </BentoTile>
            <BentoTile>
              <Card fill title="1">
                Une colonne
              </Card>
            </BentoTile>
            <BentoTile span={4}>
              <Card fill title="span 4">
                Ramené à deux colonnes en sm, à une en xs
              </Card>
            </BentoTile>
          </BentoGrid>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={gridRows} />
      </DocSection>
      <DocSection title={t.sections.tileApi}>
        <PropsTable rows={tileRows} />
      </DocSection>
      <DocSection title={t.sections.presenceApi}>
        <PropsTable rows={presenceRows} />
      </DocSection>
    </DocPage>
  );
}
