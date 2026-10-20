import { ThemeToggle } from "@canop/ui";
import { CodeBlock } from "../../kit/CodeBlock";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { ThemeToggle } from "@canop/ui";`;

const usageCode = `<ThemeToggle />`;

const hookCode = `import { useThemeToggle } from "@canop/ui";

function CustomToggle() {
  const { groupLabel, isDark, toggle, handleKeyDown } = useThemeToggle();

  return (
    <button
      role="switch"
      aria-checked={isDark}
      aria-label={groupLabel}
      onClick={toggle}
      onKeyDown={handleKeyDown}
    >
      {isDark ? "Sombre" : "Clair"}
    </button>
  );
}`;

const fr = {
  intro:
    "Bascule entre les thèmes clair et sombre, branchée directement sur le thème CanopUI. Tout le composant est cliquable : un clic n'importe où bascule le mode. Un pouce coulissant anime le changement et la navigation clavier (flèches, Début/Fin) est intégrée. Aucune prop : l'état vient du CanopThemeProvider.",
  sections: {
    usage: "Utilisation",
    hook: "Hook useThemeToggle",
    api: "API",
  },
  demos: {
    usageTitle: "Bascule clair / sombre",
    usageDescription:
      "Cliquez sur le soleil ou la lune : tout l'écosystème CanopUI de la page bascule de thème. L'état est lu et écrit dans le CanopThemeProvider parent.",
  },
  hookDescription:
    "ThemeToggle s'appuie sur useThemeToggle, qui expose le mode courant, les options et les handlers de sélection et de clavier. Utilisez-le pour construire une bascule sur mesure, tout en gardant la logique de thème centralisée.",
  props: {
    note: "ThemeToggle n'accepte aucune prop : son état provient du contexte de thème (CanopThemeProvider).",
  },
  hookResult: {
    groupLabel: "Libellé accessible de la bascule.",
    options: "Options de mode, chacune avec son mode, son icône, son libellé et son état actif.",
    activeIndex: "Index du mode actuellement actif.",
    isDark: "Vrai lorsque le mode sombre est actif.",
    reducedMotion: "Vrai lorsque l'utilisateur préfère un mouvement réduit.",
    toggle: "Bascule entre le mode clair et le mode sombre.",
    handleKeyDown: "Gère la navigation clavier entre les modes (flèches, Début/Fin).",
  },
};

const en: typeof fr = {
  intro:
    "A toggle between light and dark themes, wired directly to the CanopUI theme. The whole control is clickable: a click anywhere flips the mode. A sliding thumb animates the change and keyboard navigation (arrows, Home/End) is built in. No props: state comes from the CanopThemeProvider.",
  sections: {
    usage: "Usage",
    hook: "useThemeToggle hook",
    api: "API",
  },
  demos: {
    usageTitle: "Light / dark toggle",
    usageDescription:
      "Click the sun or the moon: the whole CanopUI ecosystem on the page switches theme. State is read from and written to the parent CanopThemeProvider.",
  },
  hookDescription:
    "ThemeToggle relies on useThemeToggle, which exposes the current mode, the options and the selection and keyboard handlers. Use it to build a custom toggle while keeping the theme logic centralized.",
  props: {
    note: "ThemeToggle takes no props: its state comes from the theme context (CanopThemeProvider).",
  },
  hookResult: {
    groupLabel: "Accessible label of the toggle.",
    options: "Mode options, each with its mode, icon, label and active state.",
    activeIndex: "Index of the currently active mode.",
    isDark: "True when dark mode is active.",
    reducedMotion: "True when the user prefers reduced motion.",
    toggle: "Flips between light and dark mode.",
    handleKeyDown: "Handles keyboard navigation between modes (arrows, Home/End).",
  },
};

const texts = { fr, en };

export default function ThemeToggleDoc() {
  const t = texts[useDocLocale()];

  const hookRows: PropRow[] = [
    { name: "groupLabel", type: "string", description: t.hookResult.groupLabel },
    {
      name: "options",
      type: "{ mode; icon; label; isActive }[]",
      description: t.hookResult.options,
    },
    { name: "activeIndex", type: "number", description: t.hookResult.activeIndex },
    { name: "isDark", type: "boolean", description: t.hookResult.isDark },
    { name: "reducedMotion", type: "boolean", description: t.hookResult.reducedMotion },
    { name: "toggle", type: "() => void", description: t.hookResult.toggle },
    {
      name: "handleKeyDown",
      type: "(event: KeyboardEvent<HTMLButtonElement>) => void",
      description: t.hookResult.handleKeyDown,
    },
  ];

  return (
    <DocPage title="ThemeToggle" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.usageTitle}
          description={t.demos.usageDescription}
          code={usageCode}
        >
          <ThemeToggle />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.hook} description={t.hookDescription}>
        <CodeBlock code={hookCode} />
        <PropsTable rows={hookRows} />
      </DocSection>
      <DocSection title={t.sections.api} description={t.props.note} />
    </DocPage>
  );
}
