import { useState } from "react";
import { Button, SelectionBar, Toast, type CanopSelectionAction } from "@canop/ui";
import { CodeBlock } from "../../kit/CodeBlock";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { SelectionBar } from "@canop/ui";`;

const usageCode = `function BulkActions() {
  const [count, setCount] = useState(0);

  const actions = [
    { id: "export", label: "Exporter", icon: "download", onClick: handleExport },
    { id: "archive", label: "Archiver", icon: "folder", onClick: handleArchive },
    { id: "delete", label: "Supprimer", icon: "trash", danger: true, onClick: handleDelete },
  ];

  return (
    <>
      <Button onClick={() => setCount((c) => c + 1)}>Sélectionner un élément</Button>
      <SelectionBar count={count} actions={actions} onClear={() => setCount(0)} />
    </>
  );
}`;

const hookCode = `import { useSelectionBar } from "@canop/ui";

const { visibleActions, overflowActions, isCompact, overflowOpen, openOverflow, closeOverflow } =
  useSelectionBar({ actions });`;

function SelectionBarDemo({
  selectLabel,
  feedbackLabel,
}: {
  selectLabel: string;
  feedbackLabel: string;
}) {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const actions: CanopSelectionAction[] = [
    { id: "export", label: "Exporter", icon: "download", onClick: () => setMessage("Exporter") },
    { id: "archive", label: "Archiver", icon: "folder", onClick: () => setMessage("Archiver") },
    {
      id: "delete",
      label: "Supprimer",
      icon: "trash",
      danger: true,
      onClick: () => setMessage("Supprimer"),
    },
  ];

  return (
    <>
      <Button onClick={() => setCount((current) => current + 1)}>{selectLabel}</Button>
      <SelectionBar count={count} actions={actions} onClear={() => setCount(0)} />
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
    "Barre d'actions groupées qui apparaît lorsqu'une sélection multiple est active. Elle affiche le nombre d'éléments sélectionnés, un bouton pour vider la sélection et les actions applicables au lot. Elle glisse à l'entrée et à la sortie, sauf préférence de mouvement réduit.",
  sections: {
    usage: "Utilisation",
    responsive: "Comportement responsive",
    hook: "Hook useSelectionBar",
    api: "API",
  },
  demos: {
    usageTitle: "Actions sur une sélection",
    usageDescription:
      "La barre reste masquée tant que count vaut zéro, puis apparaît en fondu glissé. Sélectionnez des éléments, déclenchez une action, ou videz la sélection.",
    selectLabel: "Sélectionner un élément",
    feedbackLabel: "Action :",
  },
  responsiveDescription:
    "Sur écran étroit, les actions se réduisent à leur icône et les actions surnuméraires basculent dans un menu de dépassement, comme pour la Toolbar.",
  hookDescription:
    "SelectionBar délègue le dépassement à useSelectionBar, qui répartit les actions entre visibles et débordantes et pilote le menu de dépassement.",
  props: {
    count: "Nombre d'éléments sélectionnés ; la barre est masquée à zéro.",
    actions: "Actions applicables à la sélection.",
    onClear: "Handler appelé pour vider la sélection.",
    countLabel: "Fonction personnalisant le libellé du nombre d'éléments sélectionnés.",
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
    "A bulk action bar that appears when a multiple selection is active. It shows the number of selected items, a button to clear the selection and the actions applicable to the batch. It slides in and out, unless reduced motion is preferred.",
  sections: {
    usage: "Usage",
    responsive: "Responsive behavior",
    hook: "useSelectionBar hook",
    api: "API",
  },
  demos: {
    usageTitle: "Actions on a selection",
    usageDescription:
      "The bar stays hidden while count is zero, then slides in. Select items, trigger an action, or clear the selection.",
    selectLabel: "Select an item",
    feedbackLabel: "Action:",
  },
  responsiveDescription:
    "On narrow screens, actions shrink to their icon and surplus actions move into an overflow menu, just like the Toolbar.",
  hookDescription:
    "SelectionBar delegates overflow to useSelectionBar, which splits actions between visible and overflowing ones and drives the overflow menu.",
  props: {
    count: "Number of selected items; the bar is hidden at zero.",
    actions: "Actions applicable to the selection.",
    onClear: "Handler called to clear the selection.",
    countLabel: "Function customizing the label of the selected item count.",
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

export default function SelectionBarDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "count", type: "number", required: true, description: t.props.count },
    {
      name: "actions",
      type: "CanopSelectionAction[]",
      required: true,
      description: t.props.actions,
    },
    { name: "onClear", type: "() => void", required: true, description: t.props.onClear },
    {
      name: "countLabel",
      type: "(count: number) => string",
      description: t.props.countLabel,
    },
  ];

  const hookRows: PropRow[] = [
    { name: "isCompact", type: "boolean", description: t.hookResult.isCompact },
    {
      name: "visibleActions",
      type: "CanopSelectionAction[]",
      description: t.hookResult.visibleActions,
    },
    {
      name: "overflowActions",
      type: "CanopSelectionAction[]",
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
    <DocPage title="SelectionBar" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.usageTitle}
          description={t.demos.usageDescription}
          code={usageCode}
          align="stretch"
        >
          <SelectionBarDemo
            selectLabel={t.demos.selectLabel}
            feedbackLabel={t.demos.feedbackLabel}
          />
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
