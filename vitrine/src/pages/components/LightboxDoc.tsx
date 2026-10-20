import { useState } from "react";
import { Button, Lightbox, type CanopLightboxItem } from "@canop/ui";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { Lightbox } from "@canop/ui";`;

const usageCode = `function Gallery() {
  const [open, setOpen] = useState(false);

  const items = [
    { src: "/photos/atlas.jpg", alt: "Atlas", title: "Atlas — Cartographie" },
    { src: "/photos/nimbus.jpg", alt: "Nimbus", title: "Nimbus — Infrastructure" },
    { src: "/photos/prisme.jpg", alt: "Prisme", title: "Prisme — Analytique" },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)}>Ouvrir la galerie</Button>
      <Lightbox open={open} onClose={() => setOpen(false)} items={items} />
    </>
  );
}`;

function slide(label: string, background: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='960' height='640'><rect width='100%' height='100%' fill='${background}'/><text x='50%' y='50%' font-family='sans-serif' font-size='56' fill='#ffffff' text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const demoItems: CanopLightboxItem[] = [
  { src: slide("Atlas", "#334155"), alt: "Atlas", title: "Atlas — Cartographie" },
  { src: slide("Nimbus", "#3f3f5e"), alt: "Nimbus", title: "Nimbus — Infrastructure" },
  { src: slide("Prisme", "#1f4d46"), alt: "Prisme", title: "Prisme — Analytique" },
];

function LightboxDemo({ openLabel }: { openLabel: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{openLabel}</Button>
      <Lightbox open={open} onClose={() => setOpen(false)} items={demoItems} />
    </>
  );
}

const fr = {
  intro:
    "Visionneuse plein écran pour images et documents. Elle s'ouvre en fondu, navigue au clavier (← → pour changer de média, Échap pour fermer) et affiche un compteur de position. La collection est fournie telle quelle ; l'index peut être laissé libre ou contrôlé.",
  sections: {
    usage: "Utilisation",
    controlled: "Index contrôlé",
    api: "API",
    apiItem: "API — CanopLightboxItem",
  },
  demos: {
    usageTitle: "Galerie plein écran",
    usageDescription:
      "Ouvrez la visionneuse, puis parcourez les médias avec les flèches de l'interface ou du clavier. Le voile de fond se ferme au clic.",
    openLabel: "Ouvrir la galerie",
  },
  controlledDescription:
    "Sans index, la visionneuse gère elle-même sa position et démarre sur initialIndex. Passez index et onIndexChange pour piloter la position depuis votre état, par exemple pour synchroniser une miniature sélectionnée.",
  props: {
    open: "Contrôle l'ouverture de la visionneuse.",
    onClose: "Handler appelé à la fermeture (Échap, clic sur le fond, bouton).",
    items: "Médias à afficher, images ou documents.",
    index: "Index affiché en mode contrôlé.",
    initialIndex: "Index de départ en mode non contrôlé.",
    onIndexChange: "Handler appelé au changement de média.",
  },
  item: {
    src: "URL du média à afficher.",
    kind: "Nature du média : image ou document.",
    alt: "Texte alternatif de l'image, pour l'accessibilité.",
    title: "Titre affiché en surimpression du média.",
  },
};

const en: typeof fr = {
  intro:
    "A full-screen viewer for images and documents. It fades in, navigates with the keyboard (← → to change media, Escape to close) and shows a position counter. The collection is provided as-is; the index can be left free or controlled.",
  sections: {
    usage: "Usage",
    controlled: "Controlled index",
    api: "API",
    apiItem: "API — CanopLightboxItem",
  },
  demos: {
    usageTitle: "Full-screen gallery",
    usageDescription:
      "Open the viewer, then browse the media with the on-screen or keyboard arrows. The backdrop closes on click.",
    openLabel: "Open the gallery",
  },
  controlledDescription:
    "Without index, the viewer manages its own position and starts at initialIndex. Pass index and onIndexChange to drive the position from your state, for example to sync a selected thumbnail.",
  props: {
    open: "Controls the opening of the viewer.",
    onClose: "Handler called on close (Escape, backdrop click, button).",
    items: "Media to display, images or documents.",
    index: "Displayed index in controlled mode.",
    initialIndex: "Starting index in uncontrolled mode.",
    onIndexChange: "Handler called when the media changes.",
  },
  item: {
    src: "URL of the media to display.",
    kind: "Nature of the media: image or document.",
    alt: "Alternative text of the image, for accessibility.",
    title: "Title overlaid on the media.",
  },
};

const texts = { fr, en };

export default function LightboxDoc() {
  const t = texts[useDocLocale()];

  const propRows: PropRow[] = [
    { name: "open", type: "boolean", required: true, description: t.props.open },
    { name: "onClose", type: "() => void", required: true, description: t.props.onClose },
    { name: "items", type: "CanopLightboxItem[]", required: true, description: t.props.items },
    { name: "index", type: "number", description: t.props.index },
    { name: "initialIndex", type: "number", defaultValue: "0", description: t.props.initialIndex },
    { name: "onIndexChange", type: "(index: number) => void", description: t.props.onIndexChange },
  ];

  const itemRows: PropRow[] = [
    { name: "src", type: "string", required: true, description: t.item.src },
    {
      name: "kind",
      type: '"image" | "document"',
      defaultValue: '"image"',
      description: t.item.kind,
    },
    { name: "alt", type: "string", description: t.item.alt },
    { name: "title", type: "string", description: t.item.title },
  ];

  return (
    <DocPage title="Lightbox" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.usage}>
        <DemoCard
          title={t.demos.usageTitle}
          description={t.demos.usageDescription}
          code={usageCode}
        >
          <LightboxDemo openLabel={t.demos.openLabel} />
        </DemoCard>
      </DocSection>
      <DocSection title={t.sections.controlled} description={t.controlledDescription} />
      <DocSection title={t.sections.api}>
        <PropsTable rows={propRows} />
      </DocSection>
      <DocSection title={t.sections.apiItem}>
        <PropsTable rows={itemRows} />
      </DocSection>
    </DocPage>
  );
}
