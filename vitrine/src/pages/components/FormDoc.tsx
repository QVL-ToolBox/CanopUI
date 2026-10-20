import { useState } from "react";
import { Checkbox, Form, InputEmail, InputPassword } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { CodeBlock } from "../../kit/CodeBlock";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Form, useForm } from "@canop/ui";`;

const baseCode = `function LoginFormDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Form onSubmit={() => undefined} submitLabel="Se connecter">
      <InputEmail label="Email" value={email} onChange={setEmail} required />
      <InputPassword label="Mot de passe" value={password} onChange={setPassword} required />
    </Form>
  );
}`;

function LoginFormDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Form onSubmit={() => undefined} submitLabel="Se connecter">
      <InputEmail label="Email" value={email} onChange={setEmail} required />
      <InputPassword label="Mot de passe" value={password} onChange={setPassword} required />
    </Form>
  );
}

const errorCode = `function ErrorFormDemo() {
  const [email, setEmail] = useState("");
  return (
    <Form
      onSubmit={() => undefined}
      submitLabel="Se connecter"
      error="Identifiants invalides."
    >
      <InputEmail label="Email" value={email} onChange={setEmail} />
    </Form>
  );
}`;

function ErrorFormDemo() {
  const [email, setEmail] = useState("");
  return (
    <Form onSubmit={() => undefined} submitLabel="Se connecter" error="Identifiants invalides.">
      <InputEmail label="Email" value={email} onChange={setEmail} />
    </Form>
  );
}

const statesCode = `function StatesFormDemo() {
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  return (
    <Form
      onSubmit={() => undefined}
      submitLabel="Créer le compte"
      loading={false}
      submitDisabled={!accepted}
    >
      <InputEmail label="Email" value={email} onChange={setEmail} required />
      <Checkbox
        checked={accepted}
        onChange={setAccepted}
        required
        label="J'accepte les conditions générales"
      />
    </Form>
  );
}`;

function StatesFormDemo() {
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  return (
    <Form
      onSubmit={() => undefined}
      submitLabel="Créer le compte"
      loading={false}
      submitDisabled={!accepted}
    >
      <InputEmail label="Email" value={email} onChange={setEmail} required />
      <Checkbox
        checked={accepted}
        onChange={setAccepted}
        required
        label="J'accepte les conditions générales"
      />
    </Form>
  );
}

const useFormCode = `function CustomForm() {
  const [email, setEmail] = useState("");
  const { handleSubmit } = useForm({
    onSubmit: async () => {
      await signIn(email);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <InputEmail label="Email" value={email} onChange={setEmail} required />
      <Button type="submit">Envoyer</Button>
    </form>
  );
}`;

const fr = {
  intro:
    "Le conteneur de formulaire de CanopUI. Il empile ses champs, gère la soumission via preventDefault, affiche un message d'erreur global et fournit un bouton de soumission avec état de chargement.",
  sections: {
    base: {
      title: "Formulaire de base",
      demoTitle: "Champs et bouton de soumission",
      demoDescription:
        "submitLabel ajoute le bouton de soumission ; onSubmit est appelé après validation native.",
    },
    error: {
      title: "Erreur globale",
      demoTitle: "Message d'erreur",
      demoDescription: "error affiche un Feedback d'erreur sous les champs, au-dessus du bouton.",
    },
    states: {
      title: "Chargement et soumission conditionnelle",
      demoTitle: "loading et submitDisabled",
      demoDescription:
        "loading affiche un spinner sur le bouton, submitDisabled bloque la soumission tant qu'une condition n'est pas remplie.",
    },
    useForm: {
      title: "useForm",
      description:
        "Le hook derrière Form. Utilisez-le pour piloter un élément form personnalisé tout en profitant de la gestion de la soumission.",
    },
    apiForm: { title: "API — Form" },
    useFormParams: { title: "useForm — Paramètres" },
    useFormResult: { title: "useForm — Valeur de retour" },
  },
  props: {
    submitVariant: "Variante du bouton de soumission.",
    onSubmit: "Callback exécuté à la soumission, après preventDefault. Accepte une promesse.",
    submitLabel: "Libellé du bouton de soumission. Sans lui, aucun bouton n'est rendu.",
    loading: "Affiche l'état de chargement sur le bouton de soumission.",
    submitDisabled: "Désactive le bouton de soumission.",
    error: "Message d'erreur affiché sous le formulaire via un Feedback.",
    gap: "Espacement vertical entre les champs.",
    children: "Champs et contenus du formulaire.",
    hookOnSubmit: "Callback à exécuter lors de la soumission du formulaire.",
    handleSubmit: "Gestionnaire à brancher sur onSubmit ; appelle preventDefault puis onSubmit.",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI form container. It stacks its fields, handles submission through preventDefault, displays a global error message and provides a submit button with a loading state.",
  sections: {
    base: {
      title: "Basic form",
      demoTitle: "Fields and submit button",
      demoDescription:
        "submitLabel adds the submit button; onSubmit is called after native validation.",
    },
    error: {
      title: "Global error",
      demoTitle: "Error message",
      demoDescription: "error displays an error Feedback below the fields, above the button.",
    },
    states: {
      title: "Loading and conditional submission",
      demoTitle: "loading and submitDisabled",
      demoDescription:
        "loading shows a spinner on the button, submitDisabled blocks submission until a condition is met.",
    },
    useForm: {
      title: "useForm",
      description:
        "The hook behind Form. Use it to drive a custom form element while keeping the submission handling.",
    },
    apiForm: { title: "API — Form" },
    useFormParams: { title: "useForm — Parameters" },
    useFormResult: { title: "useForm — Return value" },
  },
  props: {
    submitVariant: "Variant of the submit button.",
    onSubmit: "Callback run on submission, after preventDefault. Accepts a promise.",
    submitLabel: "Label of the submit button. Without it, no button is rendered.",
    loading: "Shows the loading state on the submit button.",
    submitDisabled: "Disables the submit button.",
    error: "Error message displayed below the form through a Feedback.",
    gap: "Vertical spacing between fields.",
    children: "Fields and contents of the form.",
    hookOnSubmit: "Callback to run when the form is submitted.",
    handleSubmit: "Handler to wire to onSubmit; calls preventDefault then onSubmit.",
  },
};

const texts = { fr, en };

export default function FormDoc() {
  const t = texts[useDocLocale()];
  const formRows: PropRow[] = [
    {
      name: "onSubmit",
      type: "() => void | Promise<void>",
      required: true,
      description: t.props.onSubmit,
    },
    {
      name: "submitLabel",
      type: "string",
      description: t.props.submitLabel,
    },
    {
      name: "loading",
      type: "boolean",
      defaultValue: "false",
      description: t.props.loading,
    },
    {
      name: "submitDisabled",
      type: "boolean",
      defaultValue: "false",
      description: t.props.submitDisabled,
    },
    {
      name: "error",
      type: "string | null",
      defaultValue: "null",
      description: t.props.error,
    },
    {
      name: "gap",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: t.props.gap,
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.props.children,
    },
    {
      name: "submitVariant",
      type: "CanopButtonVariant",
      defaultValue: '"primary"',
      description: t.props.submitVariant,
    },
  ];
  const useFormParamsRows: PropRow[] = [
    {
      name: "onSubmit",
      type: "() => void | Promise<void>",
      required: true,
      description: t.props.hookOnSubmit,
    },
  ];
  const useFormResultRows: PropRow[] = [
    {
      name: "handleSubmit",
      type: "(event: FormEvent<HTMLFormElement>) => void",
      description: t.props.handleSubmit,
    },
  ];
  return (
    <DocPage title="Form" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.base.title}>
        <DemoCard
          title={t.sections.base.demoTitle}
          description={t.sections.base.demoDescription}
          code={baseCode}
          align="stretch"
        >
          <LoginFormDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.error.title}>
        <DemoCard
          title={t.sections.error.demoTitle}
          description={t.sections.error.demoDescription}
          code={errorCode}
          align="stretch"
        >
          <ErrorFormDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.states.title}>
        <DemoCard
          title={t.sections.states.demoTitle}
          description={t.sections.states.demoDescription}
          code={statesCode}
          align="stretch"
        >
          <StatesFormDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.useForm.title} description={t.sections.useForm.description}>
        <CodeBlock code={useFormCode} />
      </DocSection>
      <DocSection title={t.sections.apiForm.title}>
        <PropsTable rows={formRows} />
      </DocSection>
      <DocSection title={t.sections.useFormParams.title}>
        <PropsTable rows={useFormParamsRows} />
      </DocSection>
      <DocSection title={t.sections.useFormResult.title}>
        <PropsTable rows={useFormResultRows} />
      </DocSection>
    </DocPage>
  );
}
