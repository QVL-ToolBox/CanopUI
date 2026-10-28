import { CANOP_VERSION, icons } from "@canop/ui";
import type { DocLocale } from "../../i18n/useDocLocale";

export type HomeFeatureId = "squircle" | "glass" | "neon" | "access" | "i18n" | "season" | "typed";

export interface HomeFeatureText {
  title: string;
  description: string;
}

export interface HomeTexts {
  hero: {
    versionChip: string;
    title: string;
    lead: string;
    start: string;
    explore: string;
    highlights: string;
  };
  features: {
    overline: string;
    title: string;
    intro: string;
    items: Record<HomeFeatureId, HomeFeatureText>;
  };
  demos: {
    rounded: string;
    squircle: string;
    glass: string;
    paid: string;
    pending: string;
    upload: string;
  };
}

const iconCount = Object.keys(icons).length;

const fr: HomeTexts = {
  hero: {
    versionChip: `Version ${CANOP_VERSION}`,
    title: "Des interfaces qui prennent vie.",
    lead: "CanopUI rassemble plus de quarante composants React typés, accessibles et animés avec soin. Vous composez vos écrans, la canopée s'occupe des détails.",
    start: "Commencer",
    explore: "Parcourir les composants",
    highlights: `40+ composants · ${iconCount} icônes · thèmes clair, sombre et saisonnier`,
  },
  features: {
    overline: "Points forts",
    title: "Le soin du détail, livré par défaut",
    intro: "Chaque composant arrive avec ce qui prend d'habitude des semaines à peaufiner.",
    items: {
      squircle: {
        title: "Squircles partout",
        description:
          "Des coins en superellipse, la courbe continue des icônes d'iOS, sur chaque carte, bouton et champ.",
      },
      glass: {
        title: "Verre liquide",
        description:
          "Une surface translucide qui floute, sature et réfracte le décor qu'elle survole.",
      },
      neon: {
        title: "Néon en thème sombre",
        description:
          "La nuit venue, chaque composant s'allume d'un halo à la couleur de sa palette.",
      },
      access: {
        title: "Accessible",
        description:
          "Focus clavier visible, rôles ARIA justes, contrastes vérifiés et mouvement réduit respecté.",
      },
      i18n: {
        title: "Multilingue",
        description:
          "Chaque libellé de la librairie se traduit, et vos propres messages suivent le même chemin.",
      },
      season: {
        title: "Thème saisonnier",
        description:
          "Une palette et un décor d'Halloween qui s'invitent à la bonne période, puis s'effacent.",
      },
      typed: {
        title: "TypeScript strict",
        description: "Des API typées de bout en bout, stables, et une autocomplétion qui guide.",
      },
    },
  },
  demos: {
    rounded: "arrondi",
    squircle: "squircle",
    glass: "Verre liquide",
    paid: "Payée",
    pending: "En attente",
    upload: "Envoi",
  },
};

const en: HomeTexts = {
  hero: {
    versionChip: `Version ${CANOP_VERSION}`,
    title: "Interfaces that come alive.",
    lead: "CanopUI brings together more than forty typed, accessible and carefully animated React components. You compose your screens, the canopy takes care of the details.",
    start: "Get started",
    explore: "Browse components",
    highlights: `40+ components · ${iconCount} icons · light, dark and seasonal themes`,
  },
  features: {
    overline: "Highlights",
    title: "Attention to detail, shipped by default",
    intro: "Every component comes with what usually takes weeks to polish.",
    items: {
      squircle: {
        title: "Squircles everywhere",
        description:
          "Superellipse corners, the continuous curve of iOS icons, on every card, button and field.",
      },
      glass: {
        title: "Liquid glass",
        description: "A translucent surface that blurs, saturates and refracts what lies beneath.",
      },
      neon: {
        title: "Neon in dark mode",
        description: "At night, every component lights up with a glow in its palette colour.",
      },
      access: {
        title: "Accessible",
        description:
          "Visible keyboard focus, correct ARIA roles, checked contrasts and reduced motion honoured.",
      },
      i18n: {
        title: "Multilingual",
        description:
          "Every library label is translatable, and your own messages take the same road.",
      },
      season: {
        title: "Seasonal theme",
        description:
          "A Halloween palette and decor that show up at the right time, then fade away.",
      },
      typed: {
        title: "Strict TypeScript",
        description: "End-to-end typed, stable APIs, and autocompletion that shows the way.",
      },
    },
  },
  demos: {
    rounded: "rounded",
    squircle: "squircle",
    glass: "Liquid glass",
    paid: "Paid",
    pending: "Pending",
    upload: "Upload",
  },
};

export const homeTexts: Record<DocLocale, HomeTexts> = { fr, en };
