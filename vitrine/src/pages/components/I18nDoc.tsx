import Typography from "@mui/material/Typography";
import {
  CanopI18nProvider,
  LanguageSelector,
  Stack,
  useTranslation,
  type CanopLocaleMessages,
} from "@canop/ui";
import { CodeBlock } from "../../kit/CodeBlock";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { CanopI18nProvider, useTranslation } from "@canop/ui";`;

const providerCode = `import { CanopI18nProvider, type CanopLocaleMessages } from "@canop/ui";

const messages: CanopLocaleMessages = {
  fr: { "app.greeting": "Bonjour {name}" },
  en: { "app.greeting": "Hello {name}" },
};

<CanopI18nProvider locale="fr" messages={messages}>
  <App />
</CanopI18nProvider>`;

const useTranslationCode = `import { useTranslation } from "@canop/ui";

function Greeting() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div>
      <p>{t("app.greeting", { name: "Martin" })}</p>
      <button onClick={() => setLocale(locale === "fr" ? "en" : "fr")}>
        {locale.toUpperCase()}
      </button>
    </div>
  );
}`;

const helpersCode = `import { createTranslate, interpolate, canopBaseMessages } from "@canop/ui";

const t = createTranslate(canopBaseMessages.fr, "fr");
t("canop.navbar.logout"); // "Déconnexion"

interpolate("Bonjour {name}, {count} messages", { name: "Léa", count: 3 });
// "Bonjour Léa, 3 messages"`;

const pluralCode = `const messages: CanopLocaleMessages = {
  fr: {
    "app.cart.one": "{count} article dans le panier",
    "app.cart.other": "{count} articles dans le panier",
  },
  en: {
    "app.cart.one": "{count} item in the cart",
    "app.cart.other": "{count} items in the cart",
  },
};

t("app.cart", { count: 0 }); // fr : "0 article dans le panier"
t("app.cart", { count: 1 }); // fr : "1 article dans le panier"
t("app.cart", { count: 2 }); // fr : "2 articles dans le panier"`;

const demoMessages: CanopLocaleMessages = {
  fr: { "demo.greeting": "Bonjour {name}, bienvenue sur CanopUI." },
  en: { "demo.greeting": "Hello {name}, welcome to CanopUI." },
};

const demoCode = `const demoMessages: CanopLocaleMessages = {
  fr: { "demo.greeting": "Bonjour {name}, bienvenue sur CanopUI." },
  en: { "demo.greeting": "Hello {name}, welcome to CanopUI." },
};

function TranslatedGreeting() {
  const { t } = useTranslation();
  return <Typography>{t("demo.greeting", { name: "Martin" })}</Typography>;
}

function LanguageDemo() {
  return (
    <CanopI18nProvider messages={demoMessages}>
      <Stack gap="sm" alignItems="center">
        <LanguageSelector />
        <TranslatedGreeting />
      </Stack>
    </CanopI18nProvider>
  );
}`;

const fr = {
  intro:
    "Module d'internationalisation léger. Un provider diffuse la langue active, la fonction de traduction et le sélecteur de langue ; les messages de base CanopUI sont fusionnés avec les vôtres, avec interpolation de variables et persistance automatique.",
  sections: {
    demo: {
      title: "Démonstration",
      description:
        "Le sélecteur bascule la langue ; la salutation est traduite à la volée avec interpolation de la variable name.",
    },
    provider: {
      title: "Provider",
      description:
        "CanopI18nProvider enveloppe l'application. Il fusionne vos messages avec canopBaseMessages, expose les langues disponibles et persiste le choix de l'utilisateur.",
    },
    hook: {
      title: "Hook useTranslation",
      description:
        "useTranslation donne accès à la fonction t, à la langue active et à setLocale depuis n'importe quel composant sous le provider.",
    },
    plural: {
      title: "Pluriel",
      description:
        "Passez un count numérique et suffixez vos clés en .one et .other : t choisit la variante avec Intl.PluralRules, pour la langue active. Écrire le test à la main ne marche pas — le français range 0 au singulier (« 0 vie restante »), l'anglais au pluriel (« 0 lives left »), donc un count > 1 se trompe dans un cas sur deux. Le mécanisme est sans effet tant qu'aucune variante suffixée n'existe : une clé nue reste servie telle quelle.",
    },
    helpers: {
      title: "Utilitaires",
      description:
        "createTranslate produit une fonction de traduction à partir d'un dictionnaire plat, et interpolate remplace les variables {nom} dans un gabarit, hors contexte React. Il prend la langue en second argument, celle qui décide du pluriel.",
    },
  },
  demos: {
    language: {
      title: "LanguageSelector et useTranslation",
    },
  },
  props: {
    provider: {
      locale: "Langue initiale, utilisée en absence de valeur persistée.",
      messages:
        "Messages applicatifs par langue, fusionnés par-dessus les messages de base CanopUI.",
      storageKey: "Clé localStorage de persistance de la langue ; null pour désactiver.",
      children: "Arbre applicatif recevant le contexte de traduction.",
    },
    context: {
      locale: "Langue active courante.",
      locales: "Langues disponibles, déduites des messages fournis.",
      t: "Traduit une clé, choisit la variante de pluriel si un count numérique est passé, interpole les variables ; renvoie la clé si absente.",
      setLocale: "Change la langue active et la persiste selon storageKey.",
    },
  },
};

const en: typeof fr = {
  intro:
    "Lightweight internationalization module. A provider shares the active language, the translation function and the language selector; the CanopUI base messages are merged with yours, with variable interpolation and automatic persistence.",
  sections: {
    demo: {
      title: "Demo",
      description:
        "The selector switches the language; the greeting is translated on the fly with interpolation of the name variable.",
    },
    provider: {
      title: "Provider",
      description:
        "CanopI18nProvider wraps the application. It merges your messages with canopBaseMessages, exposes the available languages and persists the user's choice.",
    },
    hook: {
      title: "useTranslation hook",
      description:
        "useTranslation gives access to the t function, the active language and setLocale from any component under the provider.",
    },
    plural: {
      title: "Plurals",
      description:
        "Pass a numeric count and suffix your keys with .one and .other: t picks the variant through Intl.PluralRules, for the active language. Writing the test by hand does not work — French files 0 under the singular (« 0 vie restante »), English under the plural (« 0 lives left »), so a count > 1 is wrong one time out of two. The mechanism does nothing as long as no suffixed variant exists: a bare key is still served as is.",
    },
    helpers: {
      title: "Helpers",
      description:
        "createTranslate builds a translation function from a flat dictionary, and interpolate replaces the {name} variables in a template, outside of the React context. It takes the language as a second argument, the one that decides the plural.",
    },
  },
  demos: {
    language: {
      title: "LanguageSelector and useTranslation",
    },
  },
  props: {
    provider: {
      locale: "Initial language, used when no persisted value is present.",
      messages: "Application messages per language, merged over the CanopUI base messages.",
      storageKey: "localStorage key persisting the language; null to disable.",
      children: "Application tree receiving the translation context.",
    },
    context: {
      locale: "Current active language.",
      locales: "Available languages, inferred from the provided messages.",
      t: "Translates a key, picks the plural variant when a numeric count is passed, interpolates the variables; returns the key when missing.",
      setLocale: "Changes the active language and persists it according to storageKey.",
    },
  },
};

const texts = { fr, en };

export default function I18nDoc() {
  const t = texts[useDocLocale()];

  const providerProps: PropRow[] = [
    {
      name: "locale",
      type: "CanopLocale",
      defaultValue: '"fr"',
      description: t.props.provider.locale,
    },
    {
      name: "messages",
      type: "CanopLocaleMessages",
      description: t.props.provider.messages,
    },
    {
      name: "storageKey",
      type: "string | null",
      defaultValue: '"canop-locale"',
      description: t.props.provider.storageKey,
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: t.props.provider.children,
    },
  ];

  const contextProps: PropRow[] = [
    {
      name: "locale",
      type: "CanopLocale",
      description: t.props.context.locale,
    },
    {
      name: "locales",
      type: "CanopLocale[]",
      description: t.props.context.locales,
    },
    {
      name: "t",
      type: "(key: string, vars?: CanopTranslateVars) => string",
      description: t.props.context.t,
    },
    {
      name: "setLocale",
      type: "(locale: CanopLocale) => void",
      description: t.props.context.setLocale,
    },
  ];

  return (
    <DocPage title="i18n" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.demo.title} description={t.sections.demo.description}>
        <DemoCard title={t.demos.language.title} code={demoCode}>
          <LanguageDemo />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.provider.title} description={t.sections.provider.description}>
        <CodeBlock code={providerCode} />
      </DocSection>
      <DocSection title={t.sections.hook.title} description={t.sections.hook.description}>
        <CodeBlock code={useTranslationCode} />
      </DocSection>
      <DocSection title={t.sections.plural.title} description={t.sections.plural.description}>
        <CodeBlock code={pluralCode} />
      </DocSection>
      <DocSection title={t.sections.helpers.title} description={t.sections.helpers.description}>
        <CodeBlock code={helpersCode} />
      </DocSection>
      <DocSection title="API — CanopI18nProviderProps">
        <PropsTable rows={providerProps} />
      </DocSection>
      <DocSection title="API — CanopI18nContextValue">
        <PropsTable rows={contextProps} />
      </DocSection>
    </DocPage>
  );
}

function TranslatedGreeting() {
  const { t } = useTranslation();
  return <Typography>{t("demo.greeting", { name: "Martin" })}</Typography>;
}

function LanguageDemo() {
  return (
    <CanopI18nProvider messages={demoMessages}>
      <Stack gap="sm" alignItems="center">
        <LanguageSelector />
        <TranslatedGreeting />
      </Stack>
    </CanopI18nProvider>
  );
}
