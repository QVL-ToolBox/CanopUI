import { useState } from "react";
import { Button, InputText, SidePanel } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { SidePanel } from "@canop/ui";`;

const demoCode = `function SidePanelDemo() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Jean Dupont");
  return (
    <>
      <Button onClick={() => setOpen(true)}>Ouvrir le panneau</Button>
      <SidePanel
        open={open}
        onClose={() => setOpen(false)}
        title="Modifier l'utilisateur"
        footer={
          <Button variant="secondary" fullWidth onClick={() => setOpen(false)}>
            Fermer
          </Button>
        }
      >
        <InputText label="Nom" value={name} onChange={setName} />
      </SidePanel>
    </>
  );
}`;

const fr = {
  intro:
    "Le panneau latéral CanopUI. Il glisse depuis la droite pour présenter un formulaire ou un détail sans quitter la page, avec en-tête titré, contenu défilant et pied d'actions optionnel.",
  sections: {
    usage: "Utilisation",
    api: "API",
  },
  demos: {
    controlledTitle: "Panneau contrôlé",
    controlledDescription:
      "L'ouverture est pilotée par l'état du parent. L'en-tête porte le titre et un bouton de fermeture, le pied accueille les actions.",
  },
  props: {
    actions:
      "Boutons de pied de panneau, alignés à droite comme ceux d'une Card. C'est la forme qui revenait partout, chaque application réalignant ses boutons à la main. Pour un pied qui n'est pas une rangée de boutons, footer reste libre.",
    open: "Contrôle l'ouverture du panneau.",
    onClose: "Handler appelé à la fermeture (clic sur l'overlay, bouton de fermeture, Échap).",
    children: "Contenu principal du panneau.",
    title: "Titre affiché dans l'en-tête du panneau.",
    footer: "Contenu du pied de panneau, typiquement des actions de validation.",
    width: "Largeur du panneau en rem, plafonnée à 90vw sur les petits écrans.",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI side panel. It slides in from the right to present a form or a detail without leaving the page, with a titled header, scrollable content and an optional actions footer.",
  sections: {
    usage: "Usage",
    api: "API",
  },
  demos: {
    controlledTitle: "Controlled panel",
    controlledDescription:
      "Opening is driven by the parent state. The header carries the title and a close button, the footer hosts the actions.",
  },
  props: {
    actions:
      "Footer buttons, right-aligned like a Card's. This is the shape that kept coming back, each application realigning its buttons by hand. For a footer that is not a row of buttons, footer stays free.",
    open: "Controls whether the panel is open.",
    onClose: "Handler called on close (overlay click, close button, Escape).",
    children: "Main content of the panel.",
    title: "Title displayed in the panel header.",
    footer: "Panel footer content, typically confirmation actions.",
    width: "Panel width in rem, capped at 90vw on small screens.",
  },
};

const texts = { fr, en };

function SidePanelDemo() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Jean Dupont");
  return (
    <>
      <Button onClick={() => setOpen(true)}>Ouvrir le panneau</Button>
      <SidePanel
        open={open}
        onClose={() => setOpen(false)}
        title="Modifier l'utilisateur"
        footer={
          <Button variant="secondary" fullWidth onClick={() => setOpen(false)}>
            Fermer
          </Button>
        }
      >
        <InputText label="Nom" value={name} onChange={setName} />
      </SidePanel>
    </>
  );
}

export default function SidePanelDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "open",
      type: "boolean",
      required: true,
      description: t.props.open,
    },
    {
      name: "onClose",
      type: "() => void",
      required: true,
      description: t.props.onClose,
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.props.children,
    },
    {
      name: "title",
      type: "string",
      description: t.props.title,
    },
    {
      name: "footer",
      type: "ReactNode",
      description: t.props.footer,
    },
    {
      name: "width",
      type: "string",
      defaultValue: '"26.25rem"',
      description: t.props.width,
    },
    { name: "actions", type: "ReactNode", description: t.props.actions },
  ];

  return (
    <DocPage title="SidePanel" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.controlledTitle}
          description={t.demos.controlledDescription}
          code={demoCode}
        >
          <SidePanelDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
