import { useState } from "react";
import { Button, Feedback } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Feedback } from "@canop/ui";`;

const severitiesCode = `<Feedback severity="success">Compte créé avec succès</Feedback>
<Feedback severity="error">Identifiants invalides</Feedback>
<Feedback severity="info">Un email vous a été envoyé</Feedback>
<Feedback severity="warning">Votre session expire bientôt</Feedback>`;

const dismissCode = `function FeedbackDismissDemo() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <Button variant="secondary" onClick={() => setVisible(true)}>
        Réafficher
      </Button>
    );
  }

  return (
    <Feedback severity="success" onClose={() => setVisible(false)}>
      Modifications enregistrées
    </Feedback>
  );
}`;

function FeedbackDismissDemo() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <Button variant="secondary" onClick={() => setVisible(true)}>
        Réafficher
      </Button>
    );
  }

  return (
    <Feedback severity="success" onClose={() => setVisible(false)}>
      Modifications enregistrées
    </Feedback>
  );
}

const fr = {
  intro:
    "Message d'alerte contextuel pour informer l'utilisateur du résultat d'une action. Quatre intentions sémantiques et une fermeture optionnelle. Ne rend rien si aucun contenu n'est fourni.",
  sections: {
    severities: "Sévérités",
    dismiss: "Avec fermeture",
    api: "API",
  },
  demos: {
    severitiesTitle: "Quatre intentions",
    severitiesDescription:
      "success confirme une action, error signale un échec, info transmet une information neutre et warning attire l'attention.",
    dismissTitle: "onClose",
    dismissDescription:
      "Fournir onClose affiche une croix de fermeture. Le portail décide alors de masquer ou non le message.",
  },
  props: {
    severity: "Intention du message, qui pilote la couleur et l'icône de l'alerte.",
    children: "Contenu du message. Si vide, le composant ne rend rien.",
    onClose:
      "Handler appelé au clic sur la croix de fermeture. Affiche la croix lorsqu'il est fourni.",
  },
};

const en: typeof fr = {
  intro:
    "Contextual alert message to inform the user about the outcome of an action. Four semantic intents and an optional dismiss control. Renders nothing when no content is provided.",
  sections: {
    severities: "Severities",
    dismiss: "Dismissible",
    api: "API",
  },
  demos: {
    severitiesTitle: "Four intents",
    severitiesDescription:
      "success confirms an action, error reports a failure, info conveys neutral information and warning draws attention.",
    dismissTitle: "onClose",
    dismissDescription:
      "Providing onClose displays a close button. The host application then decides whether to hide the message.",
  },
  props: {
    severity: "Intent of the message, which drives the color and icon of the alert.",
    children: "Content of the message. When empty, the component renders nothing.",
    onClose: "Handler called when the close button is clicked. Displays the close button when set.",
  },
};

const texts = { fr, en };

export default function FeedbackDoc() {
  const t = texts[useDocLocale()];
  const propRows: PropRow[] = [
    {
      name: "severity",
      type: '"success" | "error" | "info" | "warning"',
      defaultValue: '"info"',
      description: t.props.severity,
    },
    {
      name: "children",
      type: "ReactNode",
      description: t.props.children,
    },
    {
      name: "onClose",
      type: "() => void",
      description: t.props.onClose,
    },
  ];

  return (
    <DocPage title="Feedback" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.severities}>
        <DemoCard
          title={t.demos.severitiesTitle}
          description={t.demos.severitiesDescription}
          code={severitiesCode}
          align="stretch"
        >
          <Feedback severity="success">Compte créé avec succès</Feedback>
          <Feedback severity="error">Identifiants invalides</Feedback>
          <Feedback severity="info">Un email vous a été envoyé</Feedback>
          <Feedback severity="warning">Votre session expire bientôt</Feedback>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.dismiss}>
        <DemoCard
          title={t.demos.dismissTitle}
          description={t.demos.dismissDescription}
          code={dismissCode}
          align="stretch"
        >
          <FeedbackDismissDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
