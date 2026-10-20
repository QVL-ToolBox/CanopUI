import { useState } from "react";
import { Button, ConfirmDialog } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { ConfirmDialog } from "@canop/ui";`;

const basicCode = `function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Ouvrir le dialogue</Button>
      <ConfirmDialog
        open={open}
        title="Valider le compte ?"
        message="L'utilisateur pourra se connecter immédiatement."
        confirmLabel="Valider"
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}`;

function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Ouvrir le dialogue</Button>
      <ConfirmDialog
        open={open}
        title="Valider le compte ?"
        message="L'utilisateur pourra se connecter immédiatement."
        confirmLabel="Valider"
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

const destructiveCode = `function ConfirmDialogDestructiveDemo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Supprimer
      </Button>
      <ConfirmDialog
        open={open}
        title="Supprimer ce compte ?"
        message="Cette action est définitive et irréversible."
        confirmLabel="Supprimer"
        destructive
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}`;

function ConfirmDialogDestructiveDemo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Supprimer
      </Button>
      <ConfirmDialog
        open={open}
        title="Supprimer ce compte ?"
        message="Cette action est définitive et irréversible."
        confirmLabel="Supprimer"
        destructive
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

const fr = {
  intro:
    "Boîte de dialogue de confirmation pour sécuriser une action avant son exécution. Titre, message optionnel, libellés personnalisables, variante destructive et état de chargement pour les actions asynchrones.",
  sections: {
    usage: "Utilisation",
    destructive: "Action destructive",
    api: "API",
  },
  demos: {
    basicTitle: "Confirmation standard",
    basicDescription:
      "Le dialogue est contrôlé : ouvrez-le en passant open à true, puis fermez-le dans onConfirm et onCancel.",
    destructiveTitle: "destructive et loading",
    destructiveDescription:
      "destructive applique la variante danger ; loading matérialise le traitement asynchrone en cours.",
  },
  props: {
    open: "Contrôle l'ouverture du dialogue.",
    title: "Titre du dialogue, généralement formulé sous forme de question.",
    message: "Contenu explicatif affiché sous le titre. Masqué si absent.",
    confirmLabel: "Libellé du bouton de confirmation.",
    cancelLabel: "Libellé du bouton d'annulation.",
    destructive:
      "Applique la variante danger au bouton de confirmation pour une action irréversible.",
    loading: "Affiche un chargement sur le bouton de confirmation et désactive l'annulation.",
    onConfirm: "Handler appelé au clic sur le bouton de confirmation.",
    onCancel: "Handler appelé à l'annulation ou à la fermeture du dialogue.",
  },
};

const en: typeof fr = {
  intro:
    "Confirmation dialog to secure an action before it runs. Title, optional message, customizable labels, destructive variant and a loading state for asynchronous actions.",
  sections: {
    usage: "Usage",
    destructive: "Destructive action",
    api: "API",
  },
  demos: {
    basicTitle: "Standard confirmation",
    basicDescription:
      "The dialog is controlled: open it by setting open to true, then close it in onConfirm and onCancel.",
    destructiveTitle: "destructive and loading",
    destructiveDescription:
      "destructive applies the danger variant; loading reflects the asynchronous processing in progress.",
  },
  props: {
    open: "Controls the opening of the dialog.",
    title: "Title of the dialog, usually phrased as a question.",
    message: "Explanatory content displayed below the title. Hidden when absent.",
    confirmLabel: "Label of the confirmation button.",
    cancelLabel: "Label of the cancel button.",
    destructive:
      "Applies the danger variant to the confirmation button for an irreversible action.",
    loading: "Shows a loading state on the confirmation button and disables cancellation.",
    onConfirm: "Handler called when the confirmation button is clicked.",
    onCancel: "Handler called on cancellation or when the dialog is closed.",
  },
};

const texts = { fr, en };

export default function ConfirmDialogDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    {
      name: "open",
      type: "boolean",
      required: true,
      description: t.props.open,
    },
    {
      name: "title",
      type: "string",
      required: true,
      description: t.props.title,
    },
    {
      name: "message",
      type: "ReactNode",
      description: t.props.message,
    },
    {
      name: "confirmLabel",
      type: "string",
      defaultValue: '"Confirmer"',
      description: t.props.confirmLabel,
    },
    {
      name: "cancelLabel",
      type: "string",
      defaultValue: '"Annuler"',
      description: t.props.cancelLabel,
    },
    {
      name: "destructive",
      type: "boolean",
      defaultValue: "false",
      description: t.props.destructive,
    },
    {
      name: "loading",
      type: "boolean",
      defaultValue: "false",
      description: t.props.loading,
    },
    {
      name: "onConfirm",
      type: "() => void",
      required: true,
      description: t.props.onConfirm,
    },
    {
      name: "onCancel",
      type: "() => void",
      required: true,
      description: t.props.onCancel,
    },
  ];

  return (
    <DocPage title="ConfirmDialog" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
        >
          <ConfirmDialogDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.destructive}>
        <DemoCard
          title={t.demos.destructiveTitle}
          description={t.demos.destructiveDescription}
          code={destructiveCode}
        >
          <ConfirmDialogDestructiveDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
