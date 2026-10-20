import { useState } from "react";
import { Button, Icon, Menu, MenuItem } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Menu, MenuItem } from "@canop/ui";`;

const anchorCode = `function MenuDemo() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  return (
    <>
      <Button onClick={(event) => setAnchorEl(event.currentTarget)}>
        Ouvrir le menu
      </Button>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        ariaLabel="Actions sur l'élément"
      >
        <MenuItem
          label="Modifier"
          icon={<Icon name="pencil" size="xs" />}
          onClick={() => setAnchorEl(null)}
        />
        <MenuItem
          label="Dupliquer"
          icon={<Icon name="file" size="xs" />}
          onClick={() => setAnchorEl(null)}
        />
        <MenuItem label="Archiver" disabled />
        <MenuItem
          label="Supprimer"
          icon={<Icon name="trash" size="xs" />}
          danger
          onClick={() => setAnchorEl(null)}
        />
      </Menu>
    </>
  );
}`;

const fr = {
  intro:
    "Le menu contextuel CanopUI. Ancré sur un élément déclencheur ou positionné librement, il regroupe une liste d'actions via le composant MenuItem, avec icônes, état désactivé et entrées destructives.",
  sections: {
    anchored: "Menu ancré",
    menuApi: "API Menu",
    menuItemApi: "API MenuItem",
  },
  demos: {
    anchoredTitle: "Déclencheur et actions",
    anchoredDescription:
      "Le menu s'ancre sur le bouton déclencheur. Chaque MenuItem peut porter une icône, être désactivé ou marqué comme destructif.",
  },
  menuProps: {
    items:
      "Les entrées du menu, décrites plutôt que composées. Chaque entrée ferme le menu avant d'agir — la forme que les applications reconstruisaient chacune de son côté, en oubliant tantôt la fermeture, tantôt l'ordre entre fermer et agir. Pour un menu qui contient autre chose que des entrées, passer children.",
    onItemClick:
      "Appelé au clic dans la liste, quelle que soit l'entrée touchée : la fermeture commune, sans la répéter sur chaque entrée.",
    open: "Contrôle l'ouverture du menu.",
    onClose: "Handler appelé à la fermeture (clic extérieur, touche Échap).",
    anchorEl: "Élément d'ancrage sur lequel positionner le menu.",
    position:
      "Position absolue de secours, utilisée lorsque aucun anchorEl n'est fourni (menu contextuel).",
    ariaLabel: "Libellé accessible de la liste du menu (aria-label).",
    children: "Liste de composants MenuItem.",
  },
  menuItemProps: {
    label: "Libellé de l'entrée de menu.",
    icon: "Icône affichée avant le libellé.",
    onClick: "Handler appelé à la sélection de l'entrée.",
    disabled: "Désactive l'entrée.",
    danger: "Marque l'entrée comme destructive (couleur d'erreur).",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI context menu. Anchored to a trigger element or freely positioned, it groups a list of actions through the MenuItem component, with icons, disabled state and destructive entries.",
  sections: {
    anchored: "Anchored menu",
    menuApi: "Menu API",
    menuItemApi: "MenuItem API",
  },
  demos: {
    anchoredTitle: "Trigger and actions",
    anchoredDescription:
      "The menu anchors to the trigger button. Each MenuItem can carry an icon, be disabled or marked as destructive.",
  },
  menuProps: {
    items:
      "The menu entries, described rather than composed. Each entry closes the menu before acting — the shape applications each rebuilt on their own, forgetting either the closing or the order between closing and acting. For a menu holding anything other than entries, pass children.",
    onItemClick:
      "Called on a click anywhere in the list, whichever entry was hit: the shared closing, without repeating it on every entry.",
    open: "Controls whether the menu is open.",
    onClose: "Handler called on close (outside click, Escape key).",
    anchorEl: "Anchor element used to position the menu.",
    position: "Fallback absolute position, used when no anchorEl is provided (context menu).",
    ariaLabel: "Accessible label of the menu list (aria-label).",
    children: "List of MenuItem components.",
  },
  menuItemProps: {
    label: "Label of the menu entry.",
    icon: "Icon displayed before the label.",
    onClick: "Handler called when the entry is selected.",
    disabled: "Disables the entry.",
    danger: "Marks the entry as destructive (error color).",
  },
};

const texts = { fr, en };

function MenuDemo() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  return (
    <>
      <Button onClick={(event) => setAnchorEl(event.currentTarget)}>Ouvrir le menu</Button>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        ariaLabel="Actions sur l'élément"
      >
        <MenuItem
          label="Modifier"
          icon={<Icon name="pencil" size="xs" />}
          onClick={() => setAnchorEl(null)}
        />
        <MenuItem
          label="Dupliquer"
          icon={<Icon name="file" size="xs" />}
          onClick={() => setAnchorEl(null)}
        />
        <MenuItem label="Archiver" disabled />
        <MenuItem
          label="Supprimer"
          icon={<Icon name="trash" size="xs" />}
          danger
          onClick={() => setAnchorEl(null)}
        />
      </Menu>
    </>
  );
}

export default function MenuDoc() {
  const t = texts[useDocLocale()];

  const menuPropRows: PropRow[] = [
    {
      name: "open",
      type: "boolean",
      required: true,
      description: t.menuProps.open,
    },
    {
      name: "onClose",
      type: "() => void",
      required: true,
      description: t.menuProps.onClose,
    },
    {
      name: "anchorEl",
      type: "HTMLElement | null",
      description: t.menuProps.anchorEl,
    },
    {
      name: "position",
      type: "{ top: number; left: number }",
      description: t.menuProps.position,
    },
    {
      name: "ariaLabel",
      type: "string",
      description: t.menuProps.ariaLabel,
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.menuProps.children,
    },
    { name: "items", type: "CanopMenuItemModel[]", description: t.menuProps.items },
    { name: "onItemClick", type: "() => void", description: t.menuProps.onItemClick },
  ];

  const menuItemPropRows: PropRow[] = [
    {
      name: "label",
      type: "string",
      required: true,
      description: t.menuItemProps.label,
    },
    {
      name: "icon",
      type: "ReactNode",
      description: t.menuItemProps.icon,
    },
    {
      name: "onClick",
      type: "() => void",
      description: t.menuItemProps.onClick,
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: t.menuItemProps.disabled,
    },
    {
      name: "danger",
      type: "boolean",
      defaultValue: "false",
      description: t.menuItemProps.danger,
    },
  ];

  return (
    <DocPage title="Menu" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.anchored}>
        <DemoCard
          title={t.demos.anchoredTitle}
          description={t.demos.anchoredDescription}
          code={anchorCode}
        >
          <MenuDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.menuApi}>
        <PropsTable rows={menuPropRows} />
      </DocSection>
      <DocSection title={t.sections.menuItemApi}>
        <PropsTable rows={menuItemPropRows} />
      </DocSection>
    </DocPage>
  );
}
