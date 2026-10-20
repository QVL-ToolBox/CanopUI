import { Feedback } from "@canop/ui";
import { useDocLocale } from "../../i18n/useDocLocale";
import { CodeBlock } from "../../kit/CodeBlock";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";

const npmrcCode = `registry=https://npm.qvl-project.com/`;

const installCode = `npm install @canop/ui`;

const mapCode = `npm install maplibre-gl`;

const canopyCode = `// vite.config.ts
import { canopyVideo } from "@canop/ui/vite";

export default defineConfig({
  plugins: [react(), canopyVideo()],
});`;

const versionBumpCode = `// package.json
"version": "X.Y.Z",

// src/index.ts
export const CANOP_VERSION = "X.Y.Z";`;

const fr = {
  title: "Installation",
  intro:
    "Le paquet @canop/ui est publié sur le registre npm QVL (Verdaccio auto-hébergé), en lecture publique. Il relaie aussi npmjs.org et peut donc servir de registre par défaut.",
  registryTitle: "Registre npm QVL",
  registryDescription: "Pointez le registre via un .npmrc à la racine du projet consommateur.",
  registryWarning:
    "Le registre n'est pas local : localhost:4873 ne fonctionne que sur le serveur QVL lui-même. Depuis toute autre machine, utilisez exclusivement https://npm.qvl-project.com/.",
  installTitle: "Installer le paquet",
  installDescription:
    "Une seule commande, et c'est tout : React, MUI et Emotion arrivent avec. Ce sont les dépendances pair de la librairie, et npm les installe automatiquement depuis sa version 7. Rien d'autre à déclarer dans votre package.json — les consommateurs épinglent simplement la version de @canop/ui en exact.",
  installNote:
    "Vérifié sur un projet vide : npm install @canop/ui pose 90 paquets, sans avertissement, et une application qui n'a déclaré que @canop/ui compile et se construit. Avec Yarn en revanche, les dépendances pair ne sont pas installées d'office : il faut alors ajouter react, react-dom, @mui/material, @emotion/react et @emotion/styled à la main.",
  canopyTitle: "Le fond de canopée, une ligne de config",
  canopyDescription:
    "Depuis canopui 3.0, PageScaffold est habillé par défaut par CanopyBackground : une canopée filmée, en deux scènes, une par thème. Les fichiers sont livrés dans le paquet, mais ils ne peuvent pas passer par le bundle du consommateur — Vite met en base64 tout asset qu'un module référence, et 32 Mo de vidéo en deviendraient 43 Mo de chaîne chargés d'un bloc. C'est donc le greffon livré avec la librairie qui les sert : en développement depuis node_modules, au build en les recopiant dans dist/canopui/video.",
  canopyWarning:
    'Sans le greffon, le fond reste noir : l\'échec est immédiat et visible, pas silencieux. Le greffon est par ailleurs ESM seul — un portail dont le package.json n\'a pas "type": "module" le charge par require et n\'arrive alors plus à lire sa propre config Vite.',
  canopyMapNote:
    "Depuis canopui 3.0.1, ce même greffon sert aussi les deux fichiers du worker de MapLibre, que l'empaqueteur n'émet pas : MapLibre 6 les résout comme fichiers voisins de son propre module, par une forme qu'aucun empaqueteur ne sait analyser statiquement. Un portail qui affiche une carte en a donc besoin lui aussi, sans quoi la carte se dessine vide en production — fond et boutons de zoom, aucune tuile — alors qu'elle marche en développement, où Vite sert les vrais fichiers depuis node_modules. Le nom du greffon ne dit plus tout ce qu'il fait ; le renommer serait une rupture, ce sera pour une version mineure.",
  mapTitle: "La carte, en plus",
  mapDescription:
    "maplibre-gl est la seule dépendance à installer soi-même, et seulement si vous affichez une carte. Elle est déclarée optionnelle, donc npm ne la pose pas : ses 21 Mo restent hors des projets qui n'en ont pas besoin.",
  mapWarning:
    "Si elle manque, la construction échoue sur un message peu parlant : « NavigationControl is not exported by __vite-optional-peer-dep:maplibre-gl:@canop/ui ». Il veut dire que maplibre-gl est absent. L'échec est délibérément au moment de la construction plutôt qu'à l'exécution, pour qu'une carte muette ne parte pas en production.",
  publishTitle: "Publication",
  publishDescription:
    "Pour publier une nouvelle version de la librairie, montez la version dans package.json et dans CANOP_VERSION (src/index.ts) sur une branche release/*, puis mergez-la sur main et approuvez la publication dans Azure DevOps. Aucun tag ne se pose à la main : c'est la pipeline qui pose vX.Y.Z, au stage Release, après l'approbation de l'environnement verdaccio, puis publie sur le registre. La procédure détaillée est décrite dans docs/RELEASE.md.",
};

const en: typeof fr = {
  title: "Installation",
  intro:
    "The @canop/ui package is published on the QVL npm registry (self-hosted Verdaccio), publicly readable. It also proxies npmjs.org, so it can serve as your default registry.",
  registryTitle: "QVL npm registry",
  registryDescription: "Point the registry via an .npmrc at the root of the consuming project.",
  registryWarning:
    "The registry is not local: localhost:4873 only works on the QVL server itself. From any other machine, use https://npm.qvl-project.com/ exclusively.",
  installTitle: "Install the package",
  installDescription:
    "A single command, and that is all: React, MUI and Emotion come along. They are the library's peer dependencies, and npm installs them automatically as of version 7. Nothing else to declare in your package.json — consumers simply pin the @canop/ui version exactly.",
  installNote:
    "Verified on an empty project: npm install @canop/ui lays down 90 packages, with no warning, and an application that declared only @canop/ui typechecks and builds. With Yarn, however, peer dependencies are not installed by default: react, react-dom, @mui/material, @emotion/react and @emotion/styled must then be added by hand.",
  canopyTitle: "The canopy background, one line of config",
  canopyDescription:
    "As of canopui 3.0, PageScaffold is dressed by default by CanopyBackground: a filmed canopy, in two scenes, one per theme. The files ship inside the package, but they cannot go through the consumer's bundle — Vite base64-inlines every asset a module references, and 32 MB of video would become 43 MB of string loaded in one go. So the plugin shipped with the library serves them: from node_modules in development, and by copying them into dist/canopui/video at build time.",
  canopyWarning:
    'Without the plugin the background stays black: the failure is immediate and visible, not silent. The plugin is also ESM only — a portal whose package.json lacks "type": "module" loads it through require and can then no longer read its own Vite config.',
  canopyMapNote:
    "As of canopui 3.0.1 this same plugin also serves the two files of MapLibre's worker, which the bundler does not emit: MapLibre 6 resolves them as siblings of its own module, in a form no bundler can analyse statically. A portal that displays a map therefore needs it too, or the map draws empty in production — background and zoom buttons, no tiles — while working in development, where Vite serves the real files from node_modules. The plugin's name no longer says everything it does; renaming it would be a break, so that waits for a minor version.",
  mapTitle: "The map, on top",
  mapDescription:
    "maplibre-gl is the only dependency to install yourself, and only if you display a map. It is declared optional, so npm does not lay it down: its 21 MB stay out of projects that do not need it.",
  mapWarning:
    "When it is missing, the build fails on an unhelpful message: “NavigationControl is not exported by __vite-optional-peer-dep:maplibre-gl:@canop/ui”. It means maplibre-gl is absent. The failure is deliberately at build time rather than at runtime, so that a dead map never reaches production.",
  publishTitle: "Publishing",
  publishDescription:
    "To publish a new version of the library, bump the version in package.json and in CANOP_VERSION (src/index.ts) on a release/* branch, then merge it into main and approve the release in Azure DevOps. No tag is ever pushed by hand: the pipeline lays down vX.Y.Z itself, in the Release stage, once the verdaccio environment is approved, then publishes to the registry. The detailed procedure is described in docs/RELEASE.md.",
};

const texts = { fr, en };

export function InstallationPage() {
  const t = texts[useDocLocale()];
  return (
    <DocPage title={t.title} intro={t.intro}>
      <DocSection title={t.registryTitle} description={t.registryDescription}>
        <CodeBlock code={npmrcCode} />
        <Feedback severity="warning">{t.registryWarning}</Feedback>
      </DocSection>
      <DocSection title={t.installTitle} description={t.installDescription}>
        <CodeBlock code={installCode} />
        <Feedback severity="info">{t.installNote}</Feedback>
      </DocSection>
      <DocSection title={t.canopyTitle} description={t.canopyDescription}>
        <CodeBlock code={canopyCode} />
        <Feedback severity="warning">{t.canopyWarning}</Feedback>
        <Feedback severity="info">{t.canopyMapNote}</Feedback>
      </DocSection>
      <DocSection title={t.mapTitle} description={t.mapDescription}>
        <CodeBlock code={mapCode} />
        <Feedback severity="warning">{t.mapWarning}</Feedback>
      </DocSection>
      <DocSection title={t.publishTitle} description={t.publishDescription}>
        <CodeBlock code={versionBumpCode} />
      </DocSection>
    </DocPage>
  );
}
