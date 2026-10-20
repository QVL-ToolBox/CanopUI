# CanopUI

Design system QVL-Studio — librairie de composants React partagée entre les portails de l'écosystème Studio.

> Fork de **CH-UI-Library v0.7.0** (QVL-CustHome). Librairie indépendante : elle suit sa propre vie de version, sans lien avec CustHome.

Paquet **`@canop/ui`** — dépôt [Azure DevOps](https://dev.azure.com/qvl-project/QVL-ToolBox/_git/CanopUI).
Miroir public à chaque release : [GitHub `QVL-ToolBox/CanopUI`](https://github.com/QVL-ToolBox/CanopUI) (un commit par version) et [npmjs](https://www.npmjs.com/package/@canop/ui).
2026-10-01 : renommage de `canopui` en `@canop/ui`, versions remises à 1.0.0 (API identique à `canopui` 3.1.1).

## Architecture

- **Stack** : React 19 · Vite 7 (library mode) · TypeScript · Vitest
- **Fondation** : wrapper autour de [MUI](https://mui.com) — les portails n'importent **jamais** MUI directement, uniquement `@canop/ui`
- **Tokens** : design tokens CanopUI exposés en CSS variables (`--canop-*`) et injectés dans le thème MUI (`cssVariables: { cssVarPrefix: "canop" }`)
- **Micro-frontends** : conçue pour être déclarée en `shared` singleton dans une architecture Module Federation — chargée une seule fois pour tout l'écosystème
- **Vitrine** : site de documentation maison (`vitrine/`), construit avec les composants CanopUI eux-mêmes — démos interactives, code source et référence des props pour chaque composant

## Installation

Le paquet **`@canop/ui`** est publié sur [npmjs](https://www.npmjs.com/package/@canop/ui) (registre par
défaut, aucune configuration). Les consommateurs épinglent la version en **exact** :

```bash
npm install @canop/ui
```

Le registre QVL (`https://npm.qvl-project.com/`, Verdaccio) reçoit les mêmes versions : les projets QVL qui
le pointent via `.npmrc` n'ont rien à changer.

**Une seule commande suffit.** React, MUI et Emotion sont les dépendances pair de la librairie, et
npm les installe automatiquement depuis sa version 7 : un projet consommateur ne déclare que
`@canop/ui`. Vérifié sur un projet vide — 90 paquets, aucun avertissement, et une application qui
n'a déclaré que `@canop/ui` passe le typage et se construit. Sous **Yarn**, en revanche, les
dépendances pair ne sont pas installées d'office : il faut alors ajouter `react`, `react-dom`,
`@mui/material`, `@emotion/react` et `@emotion/styled` à la main.

C'est **parce que** CanopUI déclare `@emotion/react` et `@emotion/styled` en dépendances pair que
la commande unique fonctionne, alors qu'aucun fichier de la librairie ne les importe : elles ne
servent qu'à MUI. npm **n'installe pas les dépendances pair d'une dépendance pair** — MUI arrive
donc, mais sans Emotion, et sa moindre importation casse la construction sur
`keyframes is not exported by ../zero-styled/index.js`. Les retirer d'ici, en se disant que MUI
les réclame de son côté, fait tomber le paquet installé de 90 à 39 : **essayé, mesuré, remis**.

Publication d'une nouvelle version : monter `version` dans `package.json` sur une branche `release/*` (gitflow) et la merger dans `main` — la pipeline pose le tag `vX.Y.Z` et publie. Les tags ne se posent pas à la main.
Procédure détaillée : voir [`docs/RELEASE.md`](docs/RELEASE.md).

## Usage

```tsx
import { CanopThemeProvider, Button } from "@canop/ui";
import "@canop/ui/styles.css";

function App() {
  return (
    <CanopThemeProvider>
      <Button variant="primary">Connexion</Button>
    </CanopThemeProvider>
  );
}
```

### Entrées et sorties animées — `Presence` / `PresenceItem`

`Presence` laisse un élément jouer sa sortie avant d'être retiré du DOM ; `PresenceItem` entre en
fondu depuis le bas, sort en glissant vers la droite (durée `base`, courbe `accelerate`) et, avec
`layout`, fait glisser ses voisins jusqu'à leur nouvelle place. Rien n'est animé au premier rendu,
et tout est coupé en mouvement réduit. Deux règles, sans quoi la sortie ne se joue pas :
`PresenceItem` est l'**enfant direct** de `Presence`, et sa `key` est **stable** — un id, jamais
un index. `mode="wait"` attend la fin d'une sortie avant l'entrée suivante : c'est le mode d'une
liste qui cède la place à son état vide (#45).

```tsx
import { EmptyState, Presence, PresenceItem } from "@canop/ui";

<Presence mode="wait">
  {tasks.length > 0 ? (
    <PresenceItem key="tasks" role="list">
      <Presence>
        {tasks.map((task) => (
          <PresenceItem key={task.id} role="listitem" ariaBusy={task.saving} layout>
            <TaskRow task={task} />
          </PresenceItem>
        ))}
      </Presence>
    </PresenceItem>
  ) : (
    <PresenceItem key="empty">
      <EmptyState title="Aucune tâche" animated={false} />
    </PresenceItem>
  )}
</Presence>;
```

Un enfant qui a sa propre animation d'entrée doit la couper dans un `PresenceItem`, sinon elle
s'ajoute à celle de l'item (ici `animated={false}` sur `EmptyState`).

`stagger` (en secondes) fait entrer les enfants en cascade selon leur position, et `appear` joue
cette entrée dès le premier rendu ; les deux sont coupés en mouvement réduit (#57).

### Grille bento — `BentoGrid` / `BentoTile`

Une colonne en mobile, puis `columns` colonnes ; chaque tuile prend `span` et `rowSpan`, fixes ou
par point de rupture, toujours ramenés au nombre de colonnes du palier. Une `BentoTile` est déjà un
`PresenceItem fill` : sous un `Presence`, elle entre en cascade, et une `Card fill` remplit sa
cellule, donc les tuiles d'une rangée ont la même hauteur (#57).

```tsx
<BentoGrid columns={{ md: 3 }} role="region" ariaLabel="Accueil">
  <Presence stagger={0.06} appear>
    <BentoTile key="chess" span={2} rowSpan={{ md: 2 }}>
      <Card variant="interactive" arrow fill title="Échecs">
        <Text variant="display">3</Text>
      </Card>
    </BentoTile>
    <BentoTile key="approvals">…</BentoTile>
    <BentoTile key="reviews">…</BentoTile>
    {alerts.length === 2 ? <BentoTile key="alerts" span={3}>…</BentoTile> : null}
  </Presence>
</BentoGrid>
```

Ici la `key` stable est portée par la `BentoTile`, enfant direct de `Presence` : c'est elle qui
joue la sortie de son `PresenceItem`.

Hors `Presence`, une `BentoTile` joue quand même son entrée (fondu et léger glissement) à son
montage, sans décalage en cascade ; seul le mouvement réduit la coupe. `columns` est typé
`CanopBentoColumns` : un nombre vaut une colonne en `xs` puis ce nombre dès `sm` (#57).

La flèche de `Card` (`arrow`) n'est rendue que sur `variant="interactive"` ; sur toute autre
variante, la prop est ignorée (#57).

### Verre dépoli et action d'accent — `Card variant="frosted"`, `IconActionButton variant="accent"`

Pour poser du texte sur `CanopyBackground`, `Card variant="frosted"` est un verre dépoli : voile
translucide teinté, fond flouté, sans ombre, rayon `xl`, rembourrage `md` puis `xl` dès `md`. Un
navigateur sans `backdrop-filter` reçoit la même teinte sur une surface opaque, et le texte du thème
y tient l'AA en clair comme en sombre. `tone` n'en change pas le fond. Pour détacher une action
secondaire mais désirable, `IconActionButton variant="accent"` : fond `accent.main`, glyphe
`accent.contrastText`, même rendu dans les deux thèmes (#88).

```tsx
<CanopyBackground>
  <Card variant="frosted" title="Bonjour Martin" subtitle="Trois revues vous attendent">
    <IconActionButton icon="download" variant="accent" ariaLabel="Télécharger le rapport" />
  </Card>
</CanopyBackground>
```

### Thème saisonnier — `season` et `HalloweenDecor`

`CanopThemeProvider` habille seul le portail aux couleurs d'Halloween du 15 octobre au
1er novembre, chaque année, et pose le décor animé, au-dessus du fond de `PageScaffold` et
sous le contenu : aucune intégration côté portail. `season="halloween"` force la saison, `season={null}` la coupe,
`seasonalDecor={false}` garde la palette sans le décor. Détails :
[docs/THEMING.md](docs/THEMING.md#thème-saisonnier).

### Sous-chemin `@canop/ui/map`

Le composant `Map` (carte vectorielle MapLibre) est isolé sur le sous-chemin `@canop/ui/map`.
`maplibre-gl` est sa **seule peer dependency, optionnelle** : les projets sans carte n'ont rien à
installer. Les projets qui affichent une carte l'installent et importent la feuille de style
MapLibre, non embarquée dans `@canop/ui/styles.css` :

```bash
npm install maplibre-gl
```

> ⚠️ **Si elle manque, la construction échoue sur un message peu parlant** :
> `"NavigationControl" is not exported by "__vite-optional-peer-dep:maplibre-gl:@canop/ui"`. Il veut
> dire que `maplibre-gl` est absent. L'échec est **délibérément au build** et non à l'exécution :
> un import de namespace laisserait passer la construction, et la carte ne casserait qu'une fois
> en ligne.

```tsx
import { Map } from "@canop/ui/map";
import "maplibre-gl/dist/maplibre-gl.css";

<Map center={{ lat: 49.4431, lng: 1.0993 }} markers={markers} />;
```

> ⚠️ **Le greffon `canopyVideo()` est aussi nécessaire à la carte** (voir « Fond de canopée » plus
> bas). Depuis `canopui` 3.0.1, il sert les deux fichiers du *worker* de MapLibre, que **l'empaqueteur
> n'émet pas** : MapLibre 6 les résout comme fichiers voisins de son propre module, par une forme
> qu'aucun empaqueteur ne sait analyser statiquement. Sans lui, la carte **se dessine vide en
> production** — fond et boutons de zoom, aucune tuile — alors qu'elle marche parfaitement en
> développement, où Vite sert les vrais fichiers depuis `node_modules`. Le nom du greffon ne dit
> donc plus tout ce qu'il fait ; le renommer serait une rupture, ce sera pour une version mineure.

Le **style de la carte est celui du design system** : il est généré depuis `tokens` par
`buildCanopMapStyle(mode, tiles)`, suit le thème clair ou sombre sans configuration, et réserve la
couleur vive aux données. Les tuiles vectorielles viennent par défaut d'[OpenFreeMap](https://openfreemap.org)
(schéma OpenMapTiles, sans clé d'API) ; la prop `tiles` change de source sans toucher au style —
une source auto-hébergée par QVL se branche en une ligne :

```tsx
<Map center={center} tiles={{ url: "https://tuiles.qvl-project.com/planet" }} />
```

> ⚠️ **Portails sous Vite** : ajouter `optimizeDeps: { exclude: ["maplibre-gl"] }` à la config.
> L'optimiseur de dépendances réécrit le paquet et perd son *worker* : la carte ne démarre alors
> jamais, **sans erreur visible dans la page**.

Le rendu est **WebGL 2**, c'est-à-dire l'affaire de l'appareil du visiteur, pas de l'hébergeur :
les mobiles récents le font nativement, les postes verrouillés (VDI, bureau à distance) parfois pas.
Le composant le détecte au montage et, à défaut, rend un panneau lisible avec un lien vers la
position — la page n'affiche jamais un trou. Sur mobile, la carte demande **deux doigts** pour être
déplacée (`gestures="cooperative"`, le défaut) afin que le doigt qui glisse continue de faire
défiler la page ; `gestures="direct"` convient quand la carte est le contenu principal de l'écran.

### Fond de canopée — un greffon Vite, rien à recopier

Depuis `canopui` 3.0, `PageScaffold` est habillé par défaut par `CanopyBackground` : une canopée filmée
du sol vers le zénith, rendue sous Blender, en deux scènes — une par thème. Les six fichiers
(WebM, MP4 et image d'affiche pour chaque thème) sont **livrés dans le paquet** sous
`dist/assets/video/`.

Ils ne peuvent pas passer par le bundle du consommateur : Vite **inline en base64 tout asset
qu'un module référence**, et 32 Mo de vidéo en deviendraient 43 Mo de chaîne de caractères
chargés d'un bloc. Ils sont donc servis comme des fichiers, depuis `CANOPY_ASSET_BASE`, soit
`/canopui/video` — et c'est **le greffon livré avec la librairie** qui s'en charge, en
développement comme au build :

```ts
// vite.config.ts
import { canopyVideo } from "@canop/ui/vite";

export default defineConfig({
  plugins: [react(), canopyVideo()],
});
```

Une ligne, et rien d'autre : en développement un middleware sert les scènes depuis
`node_modules`, et au build elles sont recopiées dans `dist/canopui/video`. Aucun fichier à
dupliquer dans le dépôt du portail, et un consommateur extérieur les a du seul fait d'avoir
installé le paquet.

Sans le greffon, le fond reste noir — l'échec est immédiat et visible, pas silencieux.

> ⚠️ Le greffon est **ESM seul**. Un portail dont le `package.json` n'a pas `"type": "module"` le
> charge par `require` et n'arrive alors même plus à lire sa propre config Vite. Les quatre
> portails CustHome et ProjectCenter sont tous en modules ES, donc aucun n'est concerné.

Pour servir les scènes ailleurs — un CDN QVL, un autre préfixe, un cache long terme sur un domaine à part — la base se remplace sans toucher au composant :

```tsx
import { CanopyBackground, canopyScenesFrom } from "@canop/ui";

const scenes = canopyScenesFrom("https://cdn.qvl-project.com/canopy");

<CanopyBackground scenes={scenes} />;
```

Un navigateur ne télécharge qu'**un seul fichier** : le WebM du thème actif, 4,8 Mo en sombre et
6,4 Mo en clair. Le MP4 ne sert que de repli pour les Safari anciens. Rien n'est joué quand
l'utilisateur a demandé un mouvement réduit : l'image d'affiche est rendue à la place.

Un portail qui ne veut pas de ce fond garde l'ancien en un mot :

```tsx
<PageScaffold items={items} background="shapes">
  {children}
</PageScaffold>
```

## Module Federation

La lib est conçue pour être partagée en singleton entre les micro-frontends. Configuration `shared` recommandée ([@module-federation/vite](https://github.com/module-federation/vite)), identique côté host et remotes :

```ts
federation({
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
    "@canop/ui": { singleton: true },
  },
})
```

`react`, `react-dom` et `@canop/ui` ne sont alors chargés qu'une fois pour tout l'écosystème : les remotes utilisent l'instance React et le `CanopThemeProvider` du host. POC fonctionnel : [poc/module-federation](poc/module-federation/README.md).

## Développement

```bash
npm install
npm run vitrine  # vitrine CanopUI (doc + démos) sur http://localhost:61000
npm test         # tests unitaires
npm run build    # build de la lib (dist/)
```

La version **3.0** de `canopui` est une version **majeure** : l'API publique est rebrandée (`Ch*` → `Canop*`)
**sans alias de rétrocompatibilité**, et l'essentiel des ruptures est automatisable par le codemod.
Ce qu'elle change, rupture par rupture, est dans [`CHANGELOG.md`](CHANGELOG.md) — section
`## [3.0.0]`, sous « Migration » pour la marche à suivre. Le journal du chantier, ses pièges et ses
décisions tranchées : [`docs/CHANTIER-3.0.md`](docs/CHANTIER-3.0.md).

## Jalons franchis

1. Socle technique (Vite lib mode, tests, CI)
2. Design tokens & thème CustHome
3. Composants v1 : Button, TextField, Feedback, Card, Layout, Spinner
4. Vitrine CanopUI (site de doc maison)
5. Distribution via registry npm privé (Verdaccio) + compatibilité Module Federation
6. Adoption par les portails CustHome et ProjectCenter
7. Identité propre en 3.0 : squircles, typographie, carte, fond de canopée, pièces de jeu
