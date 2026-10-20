import { Link, Text, VisuallyHidden } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { VisuallyHidden } from "@canop/ui";`;

const textCode = `<Text>
  4,8 ★ <VisuallyHidden>sur 5, d'après 120 avis</VisuallyHidden>
</Text>`;

const linkCode = `<Link href="#/docs/versions">
  Lire la suite<VisuallyHidden> : notes de version</VisuallyHidden>
</Link>`;

const fr = {
  intro:
    "Masque un contenu à l'écran sans le retirer de l'arbre d'accessibilité : un lecteur d'écran le lit, l'œil ne le voit pas. Utile pour compléter un libellé trop elliptique, ou pour porter une description reliée par aria-describedby.",
  sections: {
    usage: "Usage",
    api: "API",
  },
  demos: {
    textTitle: "Compléter un texte",
    textDescription:
      "La note se lit « 4,8 sur 5, d'après 120 avis », mais ne montre que « 4,8 ★ ». Le contenu masqué n'occupe aucune place.",
    linkTitle: "Préciser un lien",
    linkDescription:
      "Un lien « Lire la suite » ne dit rien hors de son contexte, or un lecteur d'écran liste souvent les liens seuls. Le complément masqué lui donne un nom qui se suffit. Contrairement à display: none, ce texte reste dans l'arbre d'accessibilité.",
    rating: "sur 5, d'après 120 avis",
    readMore: "Lire la suite",
    readMoreTarget: " : notes de version",
  },
  props: {
    as: "Élément rendu : span pour un contenu en ligne, div pour un bloc.",
    id: "Identifiant du contenu, pour le relier à un contrôle par aria-describedby ou aria-labelledby.",
    children: "Contenu destiné aux seules technologies d'assistance.",
  },
};

const en: typeof fr = {
  intro:
    "Hides content from the screen without removing it from the accessibility tree: a screen reader reads it, the eye does not see it. Useful to complete an overly terse label, or to carry a description linked through aria-describedby.",
  sections: {
    usage: "Usage",
    api: "API",
  },
  demos: {
    textTitle: "Completing a text",
    textDescription:
      "The rating reads “4.8 out of 5, from 120 reviews”, yet only shows “4.8 ★”. The hidden content takes up no room.",
    linkTitle: "Clarifying a link",
    linkDescription:
      "A “Read more” link means nothing out of context, and screen readers often list links on their own. The hidden complement gives it a self-sufficient name. Unlike display: none, this text stays in the accessibility tree.",
    rating: "out of 5, from 120 reviews",
    readMore: "Read more",
    readMoreTarget: ": release notes",
  },
  props: {
    as: "Rendered element: span for inline content, div for a block.",
    id: "Identifier of the content, to link it to a control through aria-describedby or aria-labelledby.",
    children: "Content meant for assistive technologies only.",
  },
};

const texts = { fr, en };

export default function VisuallyHiddenDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "as", type: '"span" | "div"', defaultValue: '"span"', description: t.props.as },
    { name: "id", type: "string", description: t.props.id },
    { name: "children", type: "ReactNode", required: true, description: t.props.children },
  ];

  return (
    <DocPage title="VisuallyHidden" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard title={t.demos.textTitle} description={t.demos.textDescription} code={textCode}>
          <Text>
            4,8 ★ <VisuallyHidden>{t.demos.rating}</VisuallyHidden>
          </Text>
        </DemoCard>
        <DemoCard title={t.demos.linkTitle} description={t.demos.linkDescription} code={linkCode}>
          <Link href="#/docs/versions">
            {t.demos.readMore}
            <VisuallyHidden>{t.demos.readMoreTarget}</VisuallyHidden>
          </Link>
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
