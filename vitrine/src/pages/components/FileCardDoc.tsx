import Box from "@mui/material/Box";
import { useState, type ReactNode } from "react";
import { FileCard, Icon, MenuItem, Toast } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { FileCard } from "@canop/ui";`;

const kindsCode = `<FileCard name="Rapport.pdf" kind="document" metadata="PDF · 2,4 Mo" onOpen={handleOpen} />
<FileCard name="Archives" kind="folder" metadata="12 éléments" onOpen={handleOpen} />
<FileCard name="Photo.jpg" kind="image" metadata="JPEG · 1,1 Mo" onOpen={handleOpen} />`;

const selectableCode = `function SelectableFileCard() {
  const [selected, setSelected] = useState(false);
  return (
    <FileCard
      name="Contrat.pdf"
      kind="document"
      metadata="PDF · 320 Ko"
      selectable
      selected={selected}
      onSelectionChange={setSelected}
    />
  );
}`;

const menuCode = `<FileCard
  name="Budget.xlsx"
  kind="document"
  metadata="Tableur · 88 Ko"
  menu={
    <>
      <MenuItem label="Renommer" icon={<Icon name="pencil" size="xs" />} />
      <MenuItem label="Télécharger" icon={<Icon name="download" size="xs" />} />
      <MenuItem label="Supprimer" icon={<Icon name="trash" size="xs" />} danger />
    </>
  }
/>`;

function CardFrame({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "15rem" },
      }}
    >
      {children}
    </Box>
  );
}

function KindsDemo({ feedbackLabel }: { feedbackLabel: string }) {
  const [message, setMessage] = useState<string | null>(null);
  return (
    <>
      <CardFrame>
        <FileCard
          name="Rapport.pdf"
          kind="document"
          metadata="PDF · 2,4 Mo"
          onOpen={() => setMessage("Rapport.pdf")}
        />
      </CardFrame>
      <CardFrame>
        <FileCard
          name="Archives"
          kind="folder"
          metadata="12 éléments"
          onOpen={() => setMessage("Archives")}
        />
      </CardFrame>
      <CardFrame>
        <FileCard
          name="Photo.jpg"
          kind="image"
          metadata="JPEG · 1,1 Mo"
          onOpen={() => setMessage("Photo.jpg")}
        />
      </CardFrame>
      <Toast
        open={message !== null}
        message={message ? `${feedbackLabel} ${message}` : ""}
        onClose={() => setMessage(null)}
      />
    </>
  );
}

function SelectableDemo() {
  const [selected, setSelected] = useState(false);
  return (
    <CardFrame>
      <FileCard
        name="Contrat.pdf"
        kind="document"
        metadata="PDF · 320 Ko"
        selectable
        selected={selected}
        onSelectionChange={setSelected}
      />
    </CardFrame>
  );
}

function MenuDemo({ feedbackLabel }: { feedbackLabel: string }) {
  const [message, setMessage] = useState<string | null>(null);
  return (
    <CardFrame>
      <FileCard
        name="Budget.xlsx"
        kind="document"
        metadata="Tableur · 88 Ko"
        menu={
          <>
            <MenuItem
              label="Renommer"
              icon={<Icon name="pencil" size="xs" />}
              onClick={() => setMessage("Renommer")}
            />
            <MenuItem
              label="Télécharger"
              icon={<Icon name="download" size="xs" />}
              onClick={() => setMessage("Télécharger")}
            />
            <MenuItem
              label="Supprimer"
              icon={<Icon name="trash" size="xs" />}
              danger
              onClick={() => setMessage("Supprimer")}
            />
          </>
        }
      />
      <Toast
        open={message !== null}
        message={message ? `${feedbackLabel} ${message}` : ""}
        onClose={() => setMessage(null)}
      />
    </CardFrame>
  );
}

const fr = {
  intro:
    "Carte représentant un fichier ou un dossier, pensée pour les explorateurs façon Drive. Aperçu ou icône selon le type, nom, métadonnées, ouverture au clic, sélection multiple optionnelle et menu d'actions contextuel.",
  sections: {
    kinds: "Types",
    selectable: "Sélection",
    menu: "Menu d'actions",
    api: "API",
  },
  demos: {
    kindsTitle: "document, folder, image",
    kindsDescription:
      "kind pilote l'icône par défaut. previewUrl remplace l'icône par une vignette pour les images. onOpen rend la carte cliquable.",
    selectableTitle: "selectable et selected",
    selectableDescription:
      "En mode selectable, une case apparaît et la carte est mise en évidence lorsqu'elle est cochée. La sélection est contrôlée via onSelectionChange.",
    menuTitle: "menu contextuel",
    menuDescription:
      "menu accueille des MenuItem exposés derrière un bouton d'actions. Le clic sur le menu n'ouvre pas la carte.",
    feedbackLabel: "Action :",
  },
  props: {
    name: "Nom du fichier ou dossier, affiché et tronqué si nécessaire.",
    kind: "Type d'élément, qui détermine l'icône par défaut.",
    previewUrl: "URL d'une vignette d'aperçu, prioritaire sur l'icône.",
    metadata: "Ligne de métadonnées secondaire (taille, date, type…).",
    selectable: "Active la case de sélection et la mise en évidence.",
    selectOnLongPress:
      "Sélectionne par appui long au doigt, ou par la barre d'espace au clavier, sans case.",
    selected: "État coché de la carte en mode sélectionnable.",
    onSelectionChange: "Handler appelé au changement d'état de sélection.",
    onOpen: "Handler appelé au clic sur la carte (ouverture).",
    menu: "Contenu du menu d'actions, typiquement des MenuItem.",
    menuLabel: "Libellé accessible du bouton d'actions.",
    selectLabel: "Libellé accessible de la case de sélection.",
  },
};

const en: typeof fr = {
  intro:
    "A card representing a file or folder, designed for Drive-style explorers. Preview or icon depending on the type, name, metadata, open on click, optional multiple selection and a contextual actions menu.",
  sections: {
    kinds: "Kinds",
    selectable: "Selection",
    menu: "Actions menu",
    api: "API",
  },
  demos: {
    kindsTitle: "document, folder, image",
    kindsDescription:
      "kind drives the default icon. previewUrl replaces the icon with a thumbnail for images. onOpen makes the card clickable.",
    selectableTitle: "selectable and selected",
    selectableDescription:
      "In selectable mode, a checkbox appears and the card is highlighted when checked. Selection is controlled via onSelectionChange.",
    menuTitle: "contextual menu",
    menuDescription:
      "menu hosts MenuItem entries behind an actions button. Clicking the menu does not open the card.",
    feedbackLabel: "Action:",
  },
  props: {
    name: "Name of the file or folder, displayed and truncated if needed.",
    kind: "Item type, which determines the default icon.",
    previewUrl: "URL of a preview thumbnail, taking precedence over the icon.",
    metadata: "Secondary metadata line (size, date, type…).",
    selectable: "Enables the selection checkbox and the highlight.",
    selectOnLongPress:
      "Selects on long press, or with the space bar on the keyboard, without a checkbox.",
    selected: "Checked state of the card in selectable mode.",
    onSelectionChange: "Handler called when the selection state changes.",
    onOpen: "Handler called when the card is clicked (open).",
    menu: "Content of the actions menu, typically MenuItem entries.",
    menuLabel: "Accessible label of the actions button.",
    selectLabel: "Accessible label of the selection checkbox.",
  },
};

const texts = { fr, en };

export default function FileCardDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "name", type: "string", required: true, description: t.props.name },
    {
      name: "kind",
      type: '"image" | "folder" | "document" | "file"',
      defaultValue: '"file"',
      description: t.props.kind,
    },
    { name: "previewUrl", type: "string", description: t.props.previewUrl },
    { name: "metadata", type: "string", description: t.props.metadata },
    { name: "selectable", type: "boolean", defaultValue: "false", description: t.props.selectable },
    {
      name: "selectOnLongPress",
      type: "boolean",
      defaultValue: "false",
      description: t.props.selectOnLongPress,
    },
    { name: "selected", type: "boolean", defaultValue: "false", description: t.props.selected },
    {
      name: "onSelectionChange",
      type: "(selected: boolean) => void",
      description: t.props.onSelectionChange,
    },
    { name: "onOpen", type: "() => void", description: t.props.onOpen },
    { name: "menu", type: "ReactNode", description: t.props.menu },
    { name: "menuLabel", type: "string", description: t.props.menuLabel },
    { name: "selectLabel", type: "string", description: t.props.selectLabel },
  ];

  return (
    <DocPage title="FileCard" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.kinds}>
        <DemoCard
          title={t.demos.kindsTitle}
          description={t.demos.kindsDescription}
          code={kindsCode}
          align="start"
        >
          <KindsDemo feedbackLabel={t.demos.feedbackLabel} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.selectable}>
        <DemoCard
          title={t.demos.selectableTitle}
          description={t.demos.selectableDescription}
          code={selectableCode}
          align="start"
        >
          <SelectableDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.menu}>
        <DemoCard
          title={t.demos.menuTitle}
          description={t.demos.menuDescription}
          code={menuCode}
          align="start"
        >
          <MenuDemo feedbackLabel={t.demos.feedbackLabel} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
