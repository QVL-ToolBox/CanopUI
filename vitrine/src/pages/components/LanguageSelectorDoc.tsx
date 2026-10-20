import { LanguageSelector } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { LanguageSelector } from "@canop/ui";`;

const baseCode = `<LanguageSelector />`;

const compactCode = `<LanguageSelector width="4.5rem" />`;

const fr = {
  intro:
    "Le sélecteur de langue de CanopUI. Branché sur le contexte d'internationalisation, il liste les locales disponibles et bascule la langue active. Il ne s'affiche que si au moins deux locales sont fournies au CanopI18nProvider.",
  sections: {
    standard: {
      title: "Sélecteur standard",
      demoTitle: "Locales du CanopI18nProvider",
      demoDescription:
        "Le composant lit la langue courante et les locales disponibles via useTranslation, puis appelle setLocale au changement.",
    },
    compact: {
      title: "Rendu compact",
      demoTitle: "Largeur personnalisée",
      demoDescription:
        "Une width explicite réduit les marges internes pour intégrer le sélecteur dans une barre dense.",
    },
    api: { title: "API" },
  },
  props: {
    width:
      "Largeur du sélecteur. Une valeur explicite active un rendu compact adapté aux barres d'outils.",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI language selector. Wired to the internationalization context, it lists the available locales and switches the active language. It only renders when at least two locales are provided to the CanopI18nProvider.",
  sections: {
    standard: {
      title: "Standard selector",
      demoTitle: "CanopI18nProvider locales",
      demoDescription:
        "The component reads the current language and available locales through useTranslation, then calls setLocale on change.",
    },
    compact: {
      title: "Compact rendering",
      demoTitle: "Custom width",
      demoDescription:
        "An explicit width reduces the inner padding to fit the selector into a dense toolbar.",
    },
    api: { title: "API" },
  },
  props: {
    width:
      "Width of the selector. An explicit value enables a compact rendering suited to toolbars.",
  },
};

const texts = { fr, en };

export default function LanguageSelectorDoc() {
  const t = texts[useDocLocale()];
  const rows: PropRow[] = [
    {
      name: "width",
      type: "number | string",
      defaultValue: '"5.25rem"',
      description: t.props.width,
    },
  ];
  return (
    <DocPage title="LanguageSelector" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.standard.title}>
        <DemoCard
          title={t.sections.standard.demoTitle}
          description={t.sections.standard.demoDescription}
          code={baseCode}
        >
          <LanguageSelector />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.compact.title}>
        <DemoCard
          title={t.sections.compact.demoTitle}
          description={t.sections.compact.demoDescription}
          code={compactCode}
        >
          <LanguageSelector width="4.5rem" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api.title}>
        <PropsTable rows={rows} />
      </DocSection>
    </DocPage>
  );
}
