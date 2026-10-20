import { Feedback } from "@canop/ui";
import { useDocLocale } from "../../i18n/useDocLocale";
import { CodeBlock } from "../../kit/CodeBlock";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";

const providerCode = `import { CanopThemeProvider, CanopI18nProvider } from "@canop/ui";
import "@canop/ui/styles.css";

function Root() {
  return (
    <CanopThemeProvider defaultMode="system">
      <CanopI18nProvider>
        <App />
      </CanopI18nProvider>
    </CanopThemeProvider>
  );
}`;

const firstComponentCode = `import { Button, Stack } from "@canop/ui";

function App() {
  return (
    <Stack gap="md" alignItems="start">
      <Button variant="primary" onClick={() => console.log("clic")}>
        Connexion
      </Button>
    </Stack>
  );
}`;

const themeHookCode = `import { useCanopTheme } from "@canop/ui";

function ModeIndicator() {
  const { resolvedMode, toggleMode } = useCanopTheme();
  return <button onClick={toggleMode}>Mode actuel : {resolvedMode}</button>;
}`;

const federationCode = `federation({
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
    "@canop/ui": { singleton: true },
  },
})`;

const fr = {
  title: "Utilisation",
  intro:
    "CanopUI enveloppe MUI : les portails n'importent jamais MUI directement, uniquement @canop/ui. Deux providers suffisent pour démarrer.",
  providersTitle: "Providers",
  providersDescription:
    "CanopThemeProvider applique le thème (light, dark ou system) et injecte les CSS variables --canop-*. CanopI18nProvider fournit les traductions des composants (fr par défaut).",
  firstComponentTitle: "Premier composant",
  firstComponentFeedback:
    "Règle d'or des portails QVL : si un besoin UI récurrent n'a pas de composant CanopUI, on le crée dans la librairie — jamais dans le portail.",
  themeTitle: "Piloter le thème",
  themeDescription: "Le hook useCanopTheme expose le mode courant et les actions pour le changer.",
  federationTitle: "Module Federation",
  federationDescription:
    "La librairie est conçue pour être partagée en singleton entre micro-frontends : react, react-dom et @canop/ui ne sont chargés qu'une fois pour tout l'écosystème.",
};

const en: typeof fr = {
  title: "Usage",
  intro:
    "CanopUI wraps MUI: portals never import MUI directly, only @canop/ui. Two providers are enough to get started.",
  providersTitle: "Providers",
  providersDescription:
    "CanopThemeProvider applies the theme (light, dark or system) and injects the --canop-* CSS variables. CanopI18nProvider supplies the component translations (fr by default).",
  firstComponentTitle: "First component",
  firstComponentFeedback:
    "Golden rule of QVL portals: if a recurring UI need has no CanopUI component, create it in the library — never in the portal.",
  themeTitle: "Control the theme",
  themeDescription: "The useCanopTheme hook exposes the current mode and the actions to change it.",
  federationTitle: "Module Federation",
  federationDescription:
    "The library is designed to be shared as a singleton across micro-frontends: react, react-dom and @canop/ui are loaded only once for the whole ecosystem.",
};

const texts = { fr, en };

export function UtilisationPage() {
  const t = texts[useDocLocale()];
  return (
    <DocPage title={t.title} intro={t.intro}>
      <DocSection title={t.providersTitle} description={t.providersDescription}>
        <CodeBlock code={providerCode} />
      </DocSection>
      <DocSection title={t.firstComponentTitle}>
        <CodeBlock code={firstComponentCode} />
        <Feedback severity="info">{t.firstComponentFeedback}</Feedback>
      </DocSection>
      <DocSection title={t.themeTitle} description={t.themeDescription}>
        <CodeBlock code={themeHookCode} />
      </DocSection>
      <DocSection title={t.federationTitle} description={t.federationDescription}>
        <CodeBlock code={federationCode} />
      </DocSection>
    </DocPage>
  );
}
