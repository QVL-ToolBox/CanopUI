import { useState } from "react";
import { Button, CommandPalette, Toast, useCommandPalette, type CanopCommandItem } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { CommandPalette, useCommandPalette } from "@canop/ui";`;

const usageCode = `function CommandPaletteDemo() {
  const { open, toggle, close } = useCommandPalette();
  const [message, setMessage] = useState<string | null>(null);

  const items: CanopCommandItem[] = [
    { id: "home", label: "Accueil", group: "Navigation", icon: "home", href: "/" },
    { id: "files", label: "Mes fichiers", group: "Navigation", icon: "folder", href: "/files" },
    { id: "settings", label: "Réglages", group: "Navigation", icon: "settings", href: "/settings" },
    { id: "new", label: "Nouveau document", group: "Actions", icon: "plus", keywords: ["créer", "ajouter"] },
    { id: "upload", label: "Importer un fichier", group: "Actions", icon: "upload" },
    { id: "delete", label: "Vider la corbeille", group: "Actions", icon: "trash" },
  ];

  return (
    <>
      <Button startIcon={<Icon name="search" size="xs" />} onClick={toggle}>
        Ouvrir (⌘K)
      </Button>
      <CommandPalette
        open={open}
        onClose={close}
        items={items}
        onSelect={(item) => {
          close();
          if (item.href) {
            navigate(item.href);
            return;
          }
          setMessage(item.label);
        }}
      />
      <Toast
        open={message !== null}
        message={message ? \`Commande : \${message}\` : ""}
        onClose={() => setMessage(null)}
      />
    </>
  );
}`;

const demoItems: CanopCommandItem[] = [
  { id: "home", label: "Accueil", group: "Navigation", icon: "home", href: "/" },
  { id: "files", label: "Mes fichiers", group: "Navigation", icon: "folder", href: "/files" },
  { id: "settings", label: "Réglages", group: "Navigation", icon: "settings", href: "/settings" },
  {
    id: "new",
    label: "Nouveau document",
    group: "Actions",
    icon: "plus",
    keywords: ["créer", "ajouter"],
  },
  { id: "upload", label: "Importer un fichier", group: "Actions", icon: "upload" },
  { id: "delete", label: "Vider la corbeille", group: "Actions", icon: "trash" },
];

interface DemoLabels {
  openLabel: string;
  feedbackLabel: string;
}

function CommandPaletteDemo({ openLabel, feedbackLabel }: DemoLabels) {
  const { open, toggle, close } = useCommandPalette();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <>
      <Button onClick={toggle}>{openLabel}</Button>
      <CommandPalette
        open={open}
        onClose={close}
        items={demoItems}
        onSelect={(item) => {
          close();
          setMessage(item.label);
        }}
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
    "Palette de commandes façon Spotlight, ouverte au raccourci ⌘K / Ctrl+K. Elle filtre les commandes en temps réel, se navigue entièrement au clavier et reste agnostique du routeur : à vous d'agir dans onSelect.",
  sections: {
    usage: "Utilisation",
    shortcut: "Raccourci et navigation clavier",
    filtering: "Filtrage",
    routing: "Agnostique du routeur",
    hook: "Hook useCommandPalette",
    apiPalette: "API — CommandPalette",
    apiItem: "API — CanopCommandItem",
  },
  demos: {
    usageTitle: "Palette interactive",
    usageDescription:
      "Cliquez sur le bouton ou pressez ⌘K / Ctrl+K pour ouvrir la palette. Les commandes sont regroupées ; la sélection déclenche un toast avec l'item choisi.",
    openLabel: "Ouvrir (⌘K)",
    feedbackLabel: "Commande :",
  },
  shortcutDescription:
    "Le hook useCommandPalette enregistre un écouteur global ⌘K / Ctrl+K qui bascule l'ouverture. Une fois ouverte, la palette se pilote au clavier : ↑ / ↓ pour parcourir les commandes, Entrée pour valider la commande active, Échap pour fermer.",
  filteringDescription:
    "La saisie filtre les commandes de façon insensible à la casse et aux accents, sur le libellé (label), les mots-clés (keywords) et le groupe (group). Les résultats restent regroupés ; emptyLabel s'affiche lorsqu'aucune commande ne correspond.",
  routingDescription:
    "CommandPalette ne connaît aucun routeur. Le champ href n'est qu'une donnée transportée : c'est à onSelect (ou onSelect de l'item) de décider quoi faire — naviguer avec votre routeur, ouvrir un panneau, déclencher une action.",
  hookDescription:
    "useCommandPalette encapsule l'état d'ouverture et le raccourci clavier global. Branchez open et close sur la palette, et toggle sur votre déclencheur.",
  props: {
    open: "Contrôle la visibilité de la palette.",
    onClose: "Handler appelé à la fermeture (Échap, clic hors zone, après sélection).",
    items: "Commandes proposées, regroupées par le champ group.",
    placeholder: "Texte d'invite du champ de recherche.",
    emptyLabel: "Message affiché lorsqu'aucune commande ne correspond à la recherche.",
    onSelect: "Handler appelé avec la commande retenue. Gérez ici href, navigation ou action.",
  },
  item: {
    id: "Identifiant unique de la commande.",
    label: "Libellé affiché et cible principale du filtrage.",
    group: "Nom du groupe sous lequel la commande est rangée.",
    icon: "Icône CanopUI affichée devant le libellé.",
    keywords: "Termes supplémentaires pris en compte par le filtrage.",
    href: "URL transportée, laissée à la charge du consommateur dans onSelect.",
    onSelect: "Handler propre à la commande, appelé en plus du onSelect de la palette.",
  },
  hookResult: {
    open: "Vrai lorsque la palette est ouverte.",
    setOpen: "Force l'état d'ouverture à la valeur passée.",
    toggle: "Bascule l'ouverture ; branché aussi sur le raccourci ⌘K / Ctrl+K.",
    close: "Ferme la palette.",
  },
};

const en: typeof fr = {
  intro:
    "A Spotlight-style command palette, opened with the ⌘K / Ctrl+K shortcut. It filters commands in real time, is fully keyboard-navigable and stays router-agnostic: it is up to you to act in onSelect.",
  sections: {
    usage: "Usage",
    shortcut: "Shortcut and keyboard navigation",
    filtering: "Filtering",
    routing: "Router-agnostic",
    hook: "useCommandPalette hook",
    apiPalette: "API — CommandPalette",
    apiItem: "API — CanopCommandItem",
  },
  demos: {
    usageTitle: "Interactive palette",
    usageDescription:
      "Click the button or press ⌘K / Ctrl+K to open the palette. Commands are grouped; selecting one triggers a toast with the chosen item.",
    openLabel: "Open (⌘K)",
    feedbackLabel: "Command:",
  },
  shortcutDescription:
    "The useCommandPalette hook registers a global ⌘K / Ctrl+K listener that toggles the palette. Once open, it is driven by the keyboard: ↑ / ↓ to move through commands, Enter to run the active one, Escape to close.",
  filteringDescription:
    "Typing filters commands in a case- and accent-insensitive way across the label, the keywords and the group. Results stay grouped; emptyLabel shows when no command matches.",
  routingDescription:
    "CommandPalette knows about no router. The href field is just carried data: it is up to onSelect (or the item's own onSelect) to decide what to do — navigate with your router, open a panel, trigger an action.",
  hookDescription:
    "useCommandPalette encapsulates the open state and the global keyboard shortcut. Wire open and close to the palette, and toggle to your trigger.",
  props: {
    open: "Controls the visibility of the palette.",
    onClose: "Handler called on close (Escape, click outside, after selection).",
    items: "Commands offered, grouped by the group field.",
    placeholder: "Prompt text of the search field.",
    emptyLabel: "Message shown when no command matches the search.",
    onSelect: "Handler called with the chosen command. Handle href, navigation or action here.",
  },
  item: {
    id: "Unique identifier of the command.",
    label: "Displayed label and primary filtering target.",
    group: "Name of the group the command is filed under.",
    icon: "CanopUI icon shown before the label.",
    keywords: "Extra terms taken into account by the filtering.",
    href: "Carried URL, left to the consumer to handle in onSelect.",
    onSelect: "Command-specific handler, called in addition to the palette's onSelect.",
  },
  hookResult: {
    open: "True when the palette is open.",
    setOpen: "Forces the open state to the given value.",
    toggle: "Toggles the palette; also wired to the ⌘K / Ctrl+K shortcut.",
    close: "Closes the palette.",
  },
};

const texts = { fr, en };

export default function CommandPaletteDoc() {
  const t = texts[useDocLocale()];

  const paletteRows: PropRow[] = [
    { name: "open", type: "boolean", required: true, description: t.props.open },
    { name: "onClose", type: "() => void", required: true, description: t.props.onClose },
    { name: "items", type: "CanopCommandItem[]", required: true, description: t.props.items },
    { name: "placeholder", type: "string", description: t.props.placeholder },
    { name: "emptyLabel", type: "string", description: t.props.emptyLabel },
    { name: "onSelect", type: "(item: CanopCommandItem) => void", description: t.props.onSelect },
  ];

  const itemRows: PropRow[] = [
    { name: "id", type: "string", required: true, description: t.item.id },
    { name: "label", type: "string", required: true, description: t.item.label },
    { name: "group", type: "string", description: t.item.group },
    { name: "icon", type: "CanopIconName", description: t.item.icon },
    { name: "keywords", type: "string[]", description: t.item.keywords },
    { name: "href", type: "string", description: t.item.href },
    { name: "onSelect", type: "() => void", description: t.item.onSelect },
  ];

  const hookRows: PropRow[] = [
    { name: "open", type: "boolean", description: t.hookResult.open },
    { name: "setOpen", type: "(value: boolean) => void", description: t.hookResult.setOpen },
    { name: "toggle", type: "() => void", description: t.hookResult.toggle },
    { name: "close", type: "() => void", description: t.hookResult.close },
  ];

  return (
    <DocPage title="CommandPalette" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.usageTitle}
          description={t.demos.usageDescription}
          code={usageCode}
        >
          <CommandPaletteDemo openLabel={t.demos.openLabel} feedbackLabel={t.demos.feedbackLabel} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.shortcut} description={t.shortcutDescription} />
      <DocSection title={t.sections.filtering} description={t.filteringDescription} />
      <DocSection title={t.sections.routing} description={t.routingDescription} />
      <DocSection title={t.sections.hook} description={t.hookDescription}>
        <PropsTable rows={hookRows} />
      </DocSection>
      <DocSection title={t.sections.apiPalette}>
        <PropsTable rows={paletteRows} />
      </DocSection>
      <DocSection title={t.sections.apiItem}>
        <PropsTable rows={itemRows} />
      </DocSection>
    </DocPage>
  );
}
