import { useState } from "react";
import { Button, CookieBanner, Text, useCookieConsent, type CanopCookieConsent } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { CookieBanner, useCookieConsent } from "@canop/ui";`;

const basicCode = `function App() {
  return (
    <CookieBanner
      message="Nous déposons des cookies de mesure d'audience pour améliorer le portail."
      onDecision={(consent) => {
        if (consent === "accepted") chargerLaMesureDAudience();
      }}
    />
  );
}`;

const hookCode = `function ParametresConfidentialite() {
  const { consent, decided, reset } = useCookieConsent();

  if (!decided) return null;
  return (
    <Stack gap="sm">
      <Text>Choix enregistré : {consent}</Text>
      <Button variant="ghost" onClick={reset}>
        Revenir sur mon choix
      </Button>
    </Stack>
  );
}`;

function BasicDemo({ label }: { label: string }) {
  const [decision, setDecision] = useState<CanopCookieConsent | null>(null);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setVisible(true)}>
        {label}
      </Button>
      {decision ? <Text variant="body-sm">{decision}</Text> : null}
      {visible ? (
        <CookieBanner
          storageKey={null}
          message="Nous déposons des cookies de mesure d'audience pour améliorer le portail."
          onDecision={(consent) => {
            setDecision(consent);
            setVisible(false);
          }}
        />
      ) : null}
    </>
  );
}

const fr = {
  intro:
    "Bandeau de consentement aux cookies. Le texte est fourni par le portail ; la librairie prend en charge la mécanique — mémoriser la décision, ne plus reposer la question, et la partager avec le reste de l'application.",
  sections: { usage: "Utilisation", hook: "Lire la décision ailleurs", api: "API" },
  demos: {
    basicTitle: "Bandeau",
    basicDescription:
      "Le bandeau ne se montre que tant qu'aucune décision n'a été prise. Cette démonstration passe storageKey à null pour rester rejouable.",
    trigger: "Afficher le bandeau",
    hookTitle: "useCookieConsent",
    hookDescription:
      "Le hook lit la même décision depuis n'importe où dans l'application, et permet de revenir dessus.",
  },
  props: {
    message: "Texte affiché dans le bandeau. Propre à chaque portail.",
    onDecision: "Appelé avec le choix de l'utilisateur, au moment où il le fait.",
    storageKey:
      "Clé de persistance de la décision. null désactive la persistance : le choix ne survit pas au rechargement.",
  },
};

const en = {
  intro:
    "Cookie consent banner. The portal supplies the wording; the library owns the mechanism — remembering the decision, not asking twice, and sharing it with the rest of the application.",
  sections: { usage: "Usage", hook: "Reading the decision elsewhere", api: "API" },
  demos: {
    basicTitle: "Banner",
    basicDescription:
      "The banner only shows while no decision has been made. This demo passes storageKey as null so it stays replayable.",
    trigger: "Show the banner",
    hookTitle: "useCookieConsent",
    hookDescription:
      "The hook reads the same decision from anywhere in the application, and allows changing it.",
  },
  props: {
    message: "Text shown in the banner. Specific to each portal.",
    onDecision: "Called with the user's choice, at the moment they make it.",
    storageKey:
      "Storage key for the decision. null disables persistence: the choice does not survive a reload.",
  },
};

const texts = { fr, en };

export default function CookieBannerDoc() {
  const t = texts[useDocLocale()];
  const { consent } = useCookieConsent();
  const propRows: PropRow[] = [
    { name: "message", type: "string", required: true, description: t.props.message },
    {
      name: "onDecision",
      type: '(consent: "accepted" | "declined") => void',
      description: t.props.onDecision,
    },
    {
      name: "storageKey",
      type: "string | null",
      defaultValue: '"canop-cookie-consent"',
      description: t.props.storageKey,
    },
  ];

  return (
    <DocPage title="CookieBanner" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.basicTitle}
          description={t.demos.basicDescription}
          code={basicCode}
        >
          <BasicDemo label={t.demos.trigger} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.hook}>
        <DemoCard title={t.demos.hookTitle} description={t.demos.hookDescription} code={hookCode}>
          <Text variant="body-sm">{consent ?? "—"}</Text>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
