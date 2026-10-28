import { Link, SettingsMenu, Stack, Text } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DemoScreen } from "../../kit/DemoScreen";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
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
      "Dans une page, le déclencheur engrenage se place en position fixe dans le coin supérieur droit de la fenêtre ; ici, un faux écran le retient dans son propre coin. Cliquez dessus pour ouvrir le popover de réglages : le footer s'affiche en pied, au-dessus du bouton d'information.",
    hint: "L'engrenage vous attend en haut à droite de cet écran.",
  },
  props: {
    supportHref: "Adresse de la page d'aide, ouverte depuis le menu.",
    onLogout: "Handler de déconnexion ; sa présence affiche le bouton de déconnexion.",
    infoHref:
      "Lien vers les informations légales, présenté par un bouton d'information (nécessite footer).",
    footer:
      "Contenu affiché en pied du menu, sous un séparateur et centré, typiquement des liens légaux en petit texte ; combiné à infoHref, il active aussi le bouton d'information.",
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
      "In a page, the gear trigger sits in a fixed position in the top-right corner of the window; here, a mock screen holds it in its own corner. Click it to open the settings popover: the footer shows at its foot, above the info button.",
    hint: "The gear waits for you in the top-right corner of this screen.",
  },
  props: {
    supportHref: "Address of the help page, opened from the menu.",
    onLogout: "Logout handler; its presence displays the logout button.",
    infoHref: "Link to the legal information, surfaced through an info button (requires footer).",
    footer:
      "Content shown at the foot of the menu, below a separator and centred, typically small legal links; combined with infoHref, it also enables the info button.",
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
        <DemoCard
          title={t.demos.title}
          description={t.demos.description}
          code={demoCode}
          align="stretch"
        >
          <DemoScreen height="14rem">
            <SettingsMenu
              infoHref="#mentions-legales"
              footer={
                <Link href="#cgu" size="small">
                  Conditions générales d&apos;utilisation
                </Link>
              }
            />
            <Stack fill alignItems="center" justifyContent="center" padding="lg">
              <Text tone="muted" align="center">
                {t.demos.hint}
              </Text>
            </Stack>
          </DemoScreen>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
