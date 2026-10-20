import { useState } from "react";
import { Button, Text, Toast, type CanopToastSeverity } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Toast } from "@canop/ui";`;

const basicCode = `function ToastDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Afficher le toast</Button>
      <Toast
        open={open}
        message="Jean Dupont a été activé"
        onClose={() => setOpen(false)}
      />
    </>
  );
}`;

function ToastDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Afficher le toast</Button>
      <Toast open={open} message="Jean Dupont a été activé" onClose={() => setOpen(false)} />
    </>
  );
}

const severitiesCode = `const messages: Record<CanopToastSeverity, string> = {
  success: "Compte activé",
  error: "Échec de l'activation",
  info: "Synchronisation en cours",
};

function ToastSeveritesDemo() {
  const [severity, setSeverity] = useState<CanopToastSeverity | null>(null);

  return (
    <>
      <Button variant="primary" onClick={() => setSeverity("success")}>
        Succès
      </Button>
      <Button variant="danger" onClick={() => setSeverity("error")}>
        Erreur
      </Button>
      <Button variant="secondary" onClick={() => setSeverity("info")}>
        Info
      </Button>
      <Toast
        open={severity !== null}
        severity={severity ?? "success"}
        message={severity ? messages[severity] : ""}
        onClose={() => setSeverity(null)}
      />
    </>
  );
}`;

const severitiesMessages: Record<CanopToastSeverity, string> = {
  success: "Compte activé",
  error: "Échec de l'activation",
  info: "Synchronisation en cours",
};

function ToastSeveritesDemo() {
  const [severity, setSeverity] = useState<CanopToastSeverity | null>(null);

  return (
    <>
      <Button variant="primary" onClick={() => setSeverity("success")}>
        Succès
      </Button>
      <Button variant="danger" onClick={() => setSeverity("error")}>
        Erreur
      </Button>
      <Button variant="secondary" onClick={() => setSeverity("info")}>
        Info
      </Button>
      <Toast
        open={severity !== null}
        severity={severity ?? "success"}
        message={severity ? severitiesMessages[severity] : ""}
        onClose={() => setSeverity(null)}
      />
    </>
  );
}

const actionCode = `function ToastActionDemo() {
  const [open, setOpen] = useState(false);
  const [restored, setRestored] = useState(false);

  return (
    <>
      <Button
        variant="danger"
        onClick={() => {
          setRestored(false);
          setOpen(true);
        }}
      >
        Supprimer le fichier
      </Button>
      {restored && <Text tone="muted">Fichier restauré</Text>}
      <Toast
        open={open}
        severity="info"
        message="Fichier déplacé dans la corbeille"
        duration={5000}
        action={{ label: "Annuler", onClick: () => setRestored(true) }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}`;

function ToastActionDemo() {
  const [open, setOpen] = useState(false);
  const [restored, setRestored] = useState(false);

  return (
    <>
      <Button
        variant="danger"
        onClick={() => {
          setRestored(false);
          setOpen(true);
        }}
      >
        Supprimer le fichier
      </Button>
      {restored && <Text tone="muted">Fichier restauré</Text>}
      <Toast
        open={open}
        severity="info"
        message="Fichier déplacé dans la corbeille"
        duration={5000}
        action={{ label: "Annuler", onClick: () => setRestored(true) }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const fr = {
  intro:
    "Notification éphémère ancrée en haut de l'écran pour confirmer une action. Piloté par un état ouvert, il se ferme automatiquement après un délai configurable ou lors d'une fermeture manuelle.",
  sections: {
    usage: "Utilisation",
    severities: "Sévérités",
    action: "Action",
    api: "API",
  },
  demos: {
    basicTitle: "Déclenchement",
    basicDescription:
      "Le toast est contrôlé : ouvrez-le en passant open à true, puis remettez-le à false dans onClose.",
    severitiesTitle: "success, error, info",
    severitiesDescription: "Chaque sévérité applique une couleur de fond et une icône dédiées.",
    actionTitle: "Annuler une suppression",
    actionDescription:
      "action ajoute un bouton atteignable au clavier. Un clic exécute onClick puis ferme le toast. Le délai est suspendu tant que le pointeur survole le toast ou que le focus s'y trouve, puis repart pour sa durée complète.",
  },
  props: {
    action:
      "Action proposée dans le toast : libellé du bouton et handler. Le toast se ferme après onClick.",
    open: "Contrôle la visibilité du toast.",
    message: "Texte affiché dans le toast.",
    onClose: "Handler appelé à la fermeture, après expiration du délai ou fermeture manuelle.",
    severity: "Intention du toast, qui pilote la couleur de fond et l'icône.",
    duration:
      "Durée d'affichage avant fermeture automatique, en millisecondes. Par défaut 3000, ou 6000 avec une action.",
  },
};

const en: typeof fr = {
  intro:
    "Ephemeral notification anchored at the top of the screen to confirm an action. Driven by an open state, it dismisses automatically after a configurable delay or on manual close.",
  sections: {
    usage: "Usage",
    severities: "Severities",
    action: "Action",
    api: "API",
  },
  demos: {
    basicTitle: "Triggering",
    basicDescription:
      "The toast is controlled: open it by setting open to true, then reset it to false in onClose.",
    severitiesTitle: "success, error, info",
    severitiesDescription: "Each severity applies a dedicated background color and icon.",
    actionTitle: "Undo a deletion",
    actionDescription:
      "action adds a keyboard-reachable button. A click runs onClick then closes the toast. The delay is paused while the pointer hovers the toast or focus is inside it, then restarts in full.",
  },
  props: {
    action:
      "Action offered in the toast: button label and handler. The toast closes after onClick.",
    open: "Controls the visibility of the toast.",
    message: "Text displayed inside the toast.",
    onClose: "Handler called on close, after the delay expires or on manual dismissal.",
    severity: "Intent of the toast, which drives the background color and icon.",
    duration:
      "Display time before automatic dismissal, in milliseconds. Defaults to 3000, or 6000 with an action.",
  },
};

const texts = { fr, en };

export default function ToastDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    {
      name: "open",
      type: "boolean",
      required: true,
      description: t.props.open,
    },
    {
      name: "message",
      type: "string",
      required: true,
      description: t.props.message,
    },
    {
      name: "onClose",
      type: "() => void",
      required: true,
      description: t.props.onClose,
    },
    {
      name: "severity",
      type: '"success" | "error" | "info"',
      defaultValue: '"success"',
      description: t.props.severity,
    },
    {
      name: "duration",
      type: "number",
      defaultValue: "3000 | 6000",
      description: t.props.duration,
    },
    {
      name: "action",
      type: "{ label: string; onClick: () => void }",
      description: t.props.action,
    },
  ];

  return (
    <DocPage title="Toast" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
        >
          <ToastDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.severities}>
        <DemoCard
          title={t.demos.severitiesTitle}
          description={t.demos.severitiesDescription}
          code={severitiesCode}
        >
          <ToastSeveritesDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.action}>
        <DemoCard
          title={t.demos.actionTitle}
          description={t.demos.actionDescription}
          code={actionCode}
        >
          <ToastActionDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
