import { Avatar } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Avatar } from "@canop/ui";`;

const initialsCode = `<Avatar name="Martin Queval" />
<Avatar name="Élodie Durand" />
<Avatar name="Jean-Pierre Lefèvre" />
<Avatar name="Œdipe" />
<Avatar name="Ana María de la Peña" />`;

const sizesCode = `<Avatar name="Camille Roux" size="sm" />
<Avatar name="Camille Roux" size="md" />
<Avatar name="Camille Roux" size="lg" />`;

const fallbackCode = `<Avatar name="" />
<Avatar name="42" />`;

const teamNames = [
  "Inès Moreau",
  "Lucas Bernard",
  "Zoé Petit",
  "Hugo Garnier",
  "Léa Fontaine",
  "Noah Girard",
  "Chloé Mercier",
  "Gabriel Faure",
];

const toneCode = teamNames.map((name) => `<Avatar name="${name}" />`).join("\n");

const fr = {
  intro:
    "Pastille d'identité tirée d'un nom : deux initiales au plus, accents conservés, et une couleur du thème choisie de façon stable — le même nom garde la même teinte d'un écran à l'autre. Le nom complet est le libellé accessible, les initiales ne sont jamais lues.",
  sections: {
    initials: "Initiales",
    sizes: "Tailles",
    fallback: "Sans initiales",
    tones: "Couleurs",
    api: "API",
  },
  demos: {
    initialsTitle: "Prénom et nom",
    initialsDescription:
      "La première lettre du premier et du dernier mot. Les traits d'union séparent les mots, les accents et ligatures sont gardés tels quels, et un nom d'un seul mot ne donne qu'une lettre.",
    fallbackTitle: "Nom vide ou sans lettre",
    fallbackDescription:
      "Un nom dont on ne tire aucune lettre, vide ou fait de chiffres, affiche une silhouette. Le libellé accessible reste le nom, ou « Utilisateur anonyme » (canop.avatar.anonymous) s'il est vide, et la teinte reste stable.",
    sizesTitle: "sm, md, lg",
    sizesDescription:
      "Trois diamètres : sm pour une liste dense, md par défaut, lg pour un en-tête de profil.",
    tonesTitle: "Une teinte stable par nom",
    tonesDescription:
      "La couleur est calculée depuis le nom, sans casse ni espaces superflus : elle ne change pas d'un rendu à l'autre. Six familles du thème sont utilisées, chacune avec son texte de contraste, au moins 4,5:1 en clair comme en sombre. warning en est exclue : son texte n'atteint pas ce seuil en thème clair.",
  },
  props: {
    name: "Nom complet de la personne. Source des initiales et de la couleur, et libellé accessible de l'avatar.",
    size: "Diamètre de l'avatar et taille des initiales.",
  },
};

const en: typeof fr = {
  intro:
    "An identity disc derived from a name: two initials at most, accents preserved, and a theme color chosen stably — the same name keeps the same tint from one screen to the next. The full name is the accessible label; the initials are never read out.",
  sections: {
    initials: "Initials",
    sizes: "Sizes",
    fallback: "Without initials",
    tones: "Colors",
    api: "API",
  },
  demos: {
    initialsTitle: "First and last name",
    initialsDescription:
      "The first letter of the first and last words. Hyphens split words, accents and ligatures are kept as they are, and a single-word name yields a single letter.",
    fallbackTitle: "Empty name or no letter",
    fallbackDescription:
      "A name that yields no letter, empty or made of digits, shows a silhouette. The accessible label stays the name, or “Anonymous user” (canop.avatar.anonymous) when it is empty, and the tint stays stable.",
    sizesTitle: "sm, md, lg",
    sizesDescription:
      "Three diameters: sm for a dense list, md by default, lg for a profile header.",
    tonesTitle: "One stable tint per name",
    tonesDescription:
      "The color is computed from the name, ignoring case and extra spaces: it never changes between renders. Six theme families are used, each with its contrast text, at least 4.5:1 in light and dark. warning is left out: its text falls short of that threshold in the light theme.",
  },
  props: {
    name: "Full name of the person. Source of the initials and color, and accessible label of the avatar.",
    size: "Diameter of the avatar and size of the initials.",
  },
};

const texts = { fr, en };

export default function AvatarDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "name", type: "string", required: true, description: t.props.name },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: t.props.size,
    },
  ];

  return (
    <DocPage title="Avatar" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.initials}>
        <DemoCard
          title={t.demos.initialsTitle}
          description={t.demos.initialsDescription}
          code={initialsCode}
        >
          <Avatar name="Martin Queval" />
          <Avatar name="Élodie Durand" />
          <Avatar name="Jean-Pierre Lefèvre" />
          <Avatar name="Œdipe" />
          <Avatar name="Ana María de la Peña" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.fallback}>
        <DemoCard
          title={t.demos.fallbackTitle}
          description={t.demos.fallbackDescription}
          code={fallbackCode}
        >
          <Avatar name="" />
          <Avatar name="42" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.sizes}>
        <DemoCard
          title={t.demos.sizesTitle}
          description={t.demos.sizesDescription}
          code={sizesCode}
        >
          <Avatar name="Camille Roux" size="sm" />
          <Avatar name="Camille Roux" size="md" />
          <Avatar name="Camille Roux" size="lg" />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.tones}>
        <DemoCard title={t.demos.tonesTitle} description={t.demos.tonesDescription} code={toneCode}>
          {teamNames.map((name) => (
            <Avatar key={name} name={name} />
          ))}
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
    </DocPage>
  );
}
