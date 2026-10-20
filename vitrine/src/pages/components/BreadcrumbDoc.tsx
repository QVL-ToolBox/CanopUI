import { useState } from "react";
import { Breadcrumb, Toast, type CanopBreadcrumbItem } from "@canop/ui";
import { CodeBlock } from "../../kit/CodeBlock";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Breadcrumb } from "@canop/ui";`;

const basicCode = `const items = [
  { id: "home", label: "Accueil", icon: "home", onClick: goHome },
  { id: "docs", label: "Documents", onClick: goDocs },
  { id: "invoices", label: "Factures 2026" },
];

<Breadcrumb items={items} />`;

const collapseCode = `<Breadcrumb
  items={[
    { id: "home", label: "Accueil", icon: "home" },
    { id: "drive", label: "Drive" },
    { id: "projects", label: "Projets" },
    { id: "atlas", label: "Atlas" },
    { id: "specs", label: "Spécifications" },
    { id: "v2", label: "Version 2" },
  ]}
  maxItems={4}
/>`;

const hookCode = `import { useBreadcrumb } from "@canop/ui";

const { segments, collapseOpen, collapseAnchor, openCollapse, closeCollapse } =
  useBreadcrumb({ items, maxItems });`;

const longItems: CanopBreadcrumbItem[] = [
  { id: "home", label: "Accueil", icon: "home" },
  { id: "drive", label: "Drive" },
  { id: "projects", label: "Projets" },
  { id: "atlas", label: "Atlas" },
  { id: "specs", label: "Spécifications" },
  { id: "v2", label: "Version 2" },
];

function BreadcrumbDemo({ feedbackLabel }: { feedbackLabel: string }) {
  const [message, setMessage] = useState<string | null>(null);

  const items: CanopBreadcrumbItem[] = [
    { id: "home", label: "Accueil", icon: "home", onClick: () => setMessage("Accueil") },
    { id: "docs", label: "Documents", onClick: () => setMessage("Documents") },
    { id: "invoices", label: "Factures 2026" },
  ];

  return (
    <>
      <Breadcrumb items={items} />
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
    "Fil d'Ariane pour situer l'utilisateur dans une arborescence. Le dernier élément marque la position courante ; les niveaux intermédiaires se replient automatiquement au-delà de maxItems, et davantage encore sur mobile.",
  sections: {
    usage: "Utilisation",
    collapse: "Repli automatique",
    hook: "Hook useBreadcrumb",
    api: "API",
  },
  demos: {
    usageTitle: "Fil cliquable",
    usageDescription:
      "Chaque élément sauf le dernier est cliquable via son onClick. Une icône peut accompagner un niveau, typiquement la racine.",
    feedbackLabel: "Navigation :",
    collapseTitle: "maxItems et menu de repli",
    collapseDescription:
      "Au-delà de maxItems, les niveaux du milieu sont regroupés derrière une ellipse qui ouvre un menu. Sur mobile, le repli est plus agressif pour préserver la place.",
  },
  hookDescription:
    "Breadcrumb s'appuie sur useBreadcrumb, qui construit les segments (éléments et bloc replié) selon maxItems et la largeur d'écran, et pilote le menu de repli.",
  props: {
    items:
      "Éléments du fil, du plus général au plus spécifique. Le dernier est la position courante.",
    maxItems: "Nombre maximal d'éléments affichés avant repli des niveaux intermédiaires.",
    ariaLabel: "Libellé accessible de la navigation (attribut aria-label).",
  },
  hookResult: {
    segments: "Segments calculés : éléments visibles et éventuel bloc replié.",
    collapseOpen: "Vrai lorsque le menu des niveaux repliés est ouvert.",
    collapseAnchor: "Élément d'ancrage du menu de repli.",
    openCollapse: "Ouvre le menu des niveaux repliés depuis un évènement souris.",
    closeCollapse: "Ferme le menu des niveaux repliés.",
  },
};

const en: typeof fr = {
  intro:
    "A breadcrumb trail to locate the user within a tree. The last item marks the current position; middle levels collapse automatically beyond maxItems, and even more on mobile.",
  sections: {
    usage: "Usage",
    collapse: "Automatic collapsing",
    hook: "useBreadcrumb hook",
    api: "API",
  },
  demos: {
    usageTitle: "Clickable trail",
    usageDescription:
      "Every item but the last is clickable via its onClick. An icon can accompany a level, typically the root.",
    feedbackLabel: "Navigation:",
    collapseTitle: "maxItems and collapse menu",
    collapseDescription:
      "Beyond maxItems, middle levels are grouped behind an ellipsis that opens a menu. On mobile, collapsing is more aggressive to save room.",
  },
  hookDescription:
    "Breadcrumb relies on useBreadcrumb, which builds the segments (items and collapsed block) based on maxItems and screen width, and drives the collapse menu.",
  props: {
    items: "Trail items, from most general to most specific. The last one is the current position.",
    maxItems: "Maximum number of items shown before middle levels collapse.",
    ariaLabel: "Accessible label of the navigation (aria-label attribute).",
  },
  hookResult: {
    segments: "Computed segments: visible items and an optional collapsed block.",
    collapseOpen: "True when the collapsed-levels menu is open.",
    collapseAnchor: "Anchor element of the collapse menu.",
    openCollapse: "Opens the collapsed-levels menu from a mouse event.",
    closeCollapse: "Closes the collapsed-levels menu.",
  },
};

const texts = { fr, en };

export default function BreadcrumbDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "items", type: "CanopBreadcrumbItem[]", required: true, description: t.props.items },
    { name: "maxItems", type: "number", defaultValue: "4", description: t.props.maxItems },
    { name: "ariaLabel", type: "string", description: t.props.ariaLabel },
  ];

  const hookRows: PropRow[] = [
    { name: "segments", type: "CanopBreadcrumbSegment[]", description: t.hookResult.segments },
    { name: "collapseOpen", type: "boolean", description: t.hookResult.collapseOpen },
    {
      name: "collapseAnchor",
      type: "HTMLElement | null",
      description: t.hookResult.collapseAnchor,
    },
    {
      name: "openCollapse",
      type: "(event: MouseEvent<HTMLElement>) => void",
      description: t.hookResult.openCollapse,
    },
    { name: "closeCollapse", type: "() => void", description: t.hookResult.closeCollapse },
  ];

  return (
    <DocPage title="Breadcrumb" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.usageTitle}
          description={t.demos.usageDescription}
          code={basicCode}
          align="start"
        >
          <BreadcrumbDemo feedbackLabel={t.demos.feedbackLabel} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.collapse}>
        <DemoCard
          title={t.demos.collapseTitle}
          description={t.demos.collapseDescription}
          code={collapseCode}
          align="start"
        >
          <Breadcrumb items={longItems} maxItems={4} />
        </DemoCard>
      </DocSection>
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
