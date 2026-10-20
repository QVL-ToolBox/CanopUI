import { Link, SettingsMenu } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { LiveDemoGate } from "../../kit/LiveDemoGate";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { SettingsMenu } from "@canop/ui";`;

const demoCode = `<SettingsMenu
  infoHref="#mentions-legales"
  footer={
    <Link href="#cgu" size="small">
      Conditions générales d'utilisation
    </Link>
  }
/>`;

const fr = {
  intro:
    "Le menu de réglages CanopUI. Un bouton engrenage fixe, ancré en haut à droite de l'écran, ouvre un popover regroupant le sélecteur de langue, la bascule de thème, la déconnexion et l'accès aux informations légales. Il est notamment utilisé par la Navbar en affichage mobile.",
  sections: {
    usage: "Utilisation",
    api: "API",
  },
  demos: {
    title: "Menu de réglages",
    description:
      "Le déclencheur engrenage se place en position fixe dans le coin supérieur droit de la fenêtre. Cliquez dessus pour ouvrir le popover de réglages.",
  },
  props: {
    supportHref: "Adresse de la page d'aide, ouverte depuis le menu.",
    onLogout: "Handler de déconnexion ; sa présence affiche le bouton de déconnexion.",
    infoHref:
      "Lien vers les informations légales, présenté par un bouton d'information (nécessite footer).",
    footer:
      "Contenu légal associé au menu ; combiné à infoHref, active l'accès aux informations légales.",
  },
};

const en: typeof fr = {
  intro:
    "The CanopUI settings menu. A fixed gear button, anchored to the top right of the screen, opens a popover grouping the language selector, the theme toggle, logout and access to legal information. It is notably used by the Navbar in mobile layout.",
  sections: {
    usage: "Usage",
    api: "API",
  },
  demos: {
    title: "Settings menu",
    description:
      "The gear trigger sits in a fixed position in the top-right corner of the window. Click it to open the settings popover.",
  },
  props: {
    supportHref: "Address of the help page, opened from the menu.",
    onLogout: "Logout handler; its presence displays the logout button.",
    infoHref: "Link to the legal information, surfaced through an info button (requires footer).",
    footer:
      "Legal content associated with the menu; combined with infoHref, it enables access to legal information.",
  },
};

const texts = { fr, en };

export default function SettingsMenuDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    {
      name: "onLogout",
      type: "() => void",
      description: t.props.onLogout,
    },
    {
      name: "infoHref",
      type: "string",
      description: t.props.infoHref,
    },
    {
      name: "footer",
      type: "ReactNode",
      description: t.props.footer,
    },
    { name: "supportHref", type: "string", description: t.props.supportHref },
  ];

  return (
    <DocPage title="SettingsMenu" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard title={t.demos.title} description={t.demos.description} code={demoCode}>
          <LiveDemoGate>
            <SettingsMenu
              infoHref="#mentions-legales"
              footer={
                <Link href="#cgu" size="small">
                  Conditions générales d&apos;utilisation
                </Link>
              }
            />
          </LiveDemoGate>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
