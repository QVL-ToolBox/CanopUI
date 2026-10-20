import { useState } from "react";
import {
  Toast,
  Toolbar,
  type CanopToolbarAction,
  type CanopToolbarSortOption,
  type CanopToolbarView,
} from "@canop/ui";
import { CodeBlock } from "../../kit/CodeBlock";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Toolbar } from "@canop/ui";`;

const usageCode = `const sortOptions = [
  { id: "name", label: "Nom" },
  { id: "date", label: "Date" },
  { id: "size", label: "Taille" },
];

function CollectionToolbar() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <Toolbar
      search={{ value: query, onChange: setQuery, placeholder: "Rechercher…" }}
      sort={{ options: sortOptions, value: sort, onChange: setSort, direction, onDirectionChange: setDirection }}
      view={{ value: view, onChange: setView }}
      actions={[
        { id: "import", label: "Importer", icon: "upload", onClick: handleImport },
        { id: "export", label: "Exporter", icon: "download", onClick: handleExport },
        { id: "refresh", label: "Actualiser", icon: "refresh", onClick: handleRefresh },
      ]}
    />
  );
}`;

const hookCode = `import { useToolbar } from "@canop/ui";

const { visibleActions, overflowActions, isCompact, overflowOpen, openOverflow, closeOverflow } =
  useToolbar({ actions });`;

const sortOptions: CanopToolbarSortOption[] = [
  { id: "name", label: "Nom" },
  { id: "date", label: "Date" },
  { id: "size", label: "Taille" },
];

function ToolbarDemo({ feedbackLabel }: { feedbackLabel: string }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [view, setView] = useState<CanopToolbarView>("grid");
  const [message, setMessage] = useState<string | null>(null);

  const actions: CanopToolbarAction[] = [
    { id: "import", label: "Importer", icon: "upload", onClick: () => setMessage("Importer") },
    { id: "export", label: "Exporter", icon: "download", onClick: () => setMessage("Exporter") },
    {
      id: "refresh",
      label: "Actualiser",
      icon: "refresh",
      onClick: () => setMessage("Actualiser"),
    },
  ];

  return (
    <>
      <Toolbar
        search={{ value: query, onChange: setQuery, placeholder: "Rechercher…" }}
        sort={{
          options: sortOptions,
          value: sort,
          onChange: setSort,
          direction,
          onDirectionChange: setDirection,
        }}
        view={{ value: view, onChange: setView }}
        actions={actions}
      />
      <Toast
        open={message !== null}
        message={message ? `${feedbackLabel} ${message}` : ""}
        onClose={() => setMessage(null)}
      />
    </>
  );
}

const fr = {
  intro:
    "Barre d'outils pour piloter une collection : recherche, tri avec sens croissant/décroissant, bascule d'affichage grille/liste et actions. Sur écran étroit, les libellés se compactent et les actions surnuméraires basculent dans un menu de dépassement.",
  sections: {
    usage: "Utilisation",
    responsive: "Comportement responsive",
    hook: "Hook useToolbar",
    api: "API",
  },
  demos: {
    usageTitle: "Barre complète",
    usageDescription:
      "Chaque zone est optionnelle et contrôlée par le consommateur. Déclenchez une action pour voir le retour ; réduisez la largeur pour observer le compactage.",
    feedbackLabel: "Action :",
  },
  responsiveDescription:
    "Sous le point de rupture mobile, la barre passe en mode compact : les boutons de tri et d'action n'affichent plus que leur icône, et les actions qui ne tiennent pas sont regroupées derrière un bouton « plus ».",
  hookDescription:
    "Toolbar délègue la gestion du dépassement à useToolbar, qui répartit les actions entre visibles et débordantes et pilote le menu de dépassement. Réutilisez-le pour bâtir une barre sur mesure.",
  props: {
    ariaLabel: "Libellé accessible de la barre d'outils (attribut aria-label).",
    search: "Configuration du champ de recherche : valeur, handler et placeholder.",
    sort: "Configuration du tri : options, valeur, sens et handlers.",
    view: "Configuration de la bascule d'affichage grille / liste.",
    actions: "Actions de la barre, réparties automatiquement selon la place disponible.",
  },
  hookResult: {
    isCompact: "Vrai lorsque la barre est en mode compact (écran étroit).",
    visibleActions: "Actions affichées directement dans la barre.",
    overflowActions: "Actions reléguées dans le menu de dépassement.",
    overflowAnchor: "Élément d'ancrage du menu de dépassement.",
    overflowOpen: "Vrai lorsque le menu de dépassement est ouvert.",
    openOverflow: "Ouvre le menu de dépassement depuis un évènement souris.",
    closeOverflow: "Ferme le menu de dépassement.",
  },
};

const en: typeof fr = {
  intro:
    "A toolbar to drive a collection: search, sorting with ascending/descending direction, grid/list view toggle and actions. On narrow screens, labels collapse and surplus actions move into an overflow menu.",
  sections: {
    usage: "Usage",
    responsive: "Responsive behavior",
    hook: "useToolbar hook",
    api: "API",
  },
  demos: {
    usageTitle: "Full toolbar",
    usageDescription:
      "Every area is optional and controlled by the consumer. Trigger an action to see the feedback; shrink the width to watch the collapsing.",
    feedbackLabel: "Action:",
  },
  responsiveDescription:
    "Below the mobile breakpoint, the bar switches to compact mode: sort and action buttons show only their icon, and actions that do not fit are grouped behind a “more” button.",
  hookDescription:
    "Toolbar delegates overflow handling to useToolbar, which splits actions between visible and overflowing ones and drives the overflow menu. Reuse it to build a custom bar.",
  props: {
    ariaLabel: "Accessible label of the toolbar (aria-label attribute).",
    search: "Search field configuration: value, handler and placeholder.",
    sort: "Sort configuration: options, value, direction and handlers.",
    view: "Grid / list view toggle configuration.",
    actions: "Toolbar actions, automatically distributed based on available room.",
  },
  hookResult: {
    isCompact: "True when the bar is in compact mode (narrow screen).",
    visibleActions: "Actions displayed directly in the bar.",
    overflowActions: "Actions moved into the overflow menu.",
    overflowAnchor: "Anchor element of the overflow menu.",
    overflowOpen: "True when the overflow menu is open.",
    openOverflow: "Opens the overflow menu from a mouse event.",
    closeOverflow: "Closes the overflow menu.",
  },
};

const texts = { fr, en };

export default function ToolbarDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
    { name: "search", type: "CanopToolbarSearchConfig", description: t.props.search },
    { name: "sort", type: "CanopToolbarSortConfig", description: t.props.sort },
    { name: "view", type: "CanopToolbarViewConfig", description: t.props.view },
    {
      name: "actions",
      type: "CanopToolbarAction[]",
      defaultValue: "[]",
      description: t.props.actions,
    },
  ];

  const hookRows: PropRow[] = [
    { name: "isCompact", type: "boolean", description: t.hookResult.isCompact },
    {
      name: "visibleActions",
      type: "CanopToolbarAction[]",
      description: t.hookResult.visibleActions,
    },
    {
      name: "overflowActions",
      type: "CanopToolbarAction[]",
      description: t.hookResult.overflowActions,
    },
    {
      name: "overflowAnchor",
      type: "HTMLElement | null",
      description: t.hookResult.overflowAnchor,
    },
    { name: "overflowOpen", type: "boolean", description: t.hookResult.overflowOpen },
    {
      name: "openOverflow",
      type: "(event: MouseEvent<HTMLElement>) => void",
      description: t.hookResult.openOverflow,
    },
    { name: "closeOverflow", type: "() => void", description: t.hookResult.closeOverflow },
  ];

  return (
    <DocPage title="Toolbar" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.usageTitle}
          description={t.demos.usageDescription}
          code={usageCode}
          align="stretch"
        >
          <ToolbarDemo feedbackLabel={t.demos.feedbackLabel} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.responsive} description={t.responsiveDescription} />
      <DocSection title={t.sections.hook} description={t.hookDescription}>
        <CodeBlock code={hookCode} />
        <PropsTable rows={hookRows} />
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
