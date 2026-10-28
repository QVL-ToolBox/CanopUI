import { Button, CommandPalette, Icon, Toast, type CanopCommandItem } from "@canop/ui";
import { useCommandPaletteDemo } from "./useCommandPaletteDemo";

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

export interface CommandPaletteDemoProps {
  openLabel: string;
  feedbackLabel: string;
}

export function CommandPaletteDemo({ openLabel, feedbackLabel }: CommandPaletteDemoProps) {
  const demo = useCommandPaletteDemo();

  return (
    <>
      <Button startIcon={<Icon name="search" size="xs" />} onClick={demo.toggle}>
        {openLabel}
      </Button>
      <CommandPalette
        open={demo.open}
        onClose={demo.close}
        items={demoItems}
        onSelect={demo.select}
      />
      <Toast
        open={demo.selectedLabel !== null}
        message={demo.selectedLabel ? `${feedbackLabel} ${demo.selectedLabel}` : ""}
        onClose={demo.dismissSelection}
      />
    </>
  );
}
