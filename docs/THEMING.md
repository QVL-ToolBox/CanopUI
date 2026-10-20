# Theming CanopUI

## Principe

Les design tokens sont définis dans `src/tokens/` (palette claire et sombre, typographie, spacing, radius, shadows, motion, breakpoints) et exposés de deux façons :

1. **Objet TypeScript typé** — `import { tokens } from "@canop/ui"`
2. **CSS variables `--canop-*`** — générées au runtime par MUI (`createTheme({ cssVariables: { cssVarPrefix: "canop" } })`)

Les composants MUI résolvent leurs couleurs via `var(--canop-palette-*)` au runtime : aucune valeur n'est figée dans le rendu, ce qui rend le thème surchargeable sans rebuild.

En plus des variables générées par MUI, le thème pose sur `:root` (via `CssBaseline`) les familles de variables suivantes, consommées directement par les composants CanopUI :

| Famille | Exemples |
|---|---|
| Ombres | `--canop-shadow-e1` → `--canop-shadow-e5` |
| Durées de motion | `--canop-motion-duration-instant`, `-fast`, `-base`, `-slow`, `-slower` |
| Courbes de motion | `--canop-motion-ease-standard`, `-organic`, `-decelerate`, `-accelerate`, `-spring-soft` |
| Rayons | `--canop-radius-xs` → `--canop-radius-2xl`, `--canop-radius-pill` |
| Espacements | `--canop-spacing-3xs` → `--canop-spacing-4xl` |

Le thème étend également la palette MUI : couleur `accent`, jeu de surfaces `surface.sunken | base | raised | overlay`, et textes `text.onPrimary` / `text.onAccent`. Le breakpoint `xl` est désactivé (`lg` est le dernier palier).

## Échelle des titres

`tokens.typography.heading` porte six paliers, gamme modulaire de raison 1,333, tous en Titan One (graisse 400, interligne `tight`). Chaque palier est un objet de style complet (`fontSize`, `fontFamily`, `fontWeight`, `lineHeight`, `letterSpacing`), utilisable tel quel en `sx`.

| Token | Taille | Crénage | Palier `Heading` |
|---|---|---|---|
| `heading.h1` | `4.21rem` | `tightest` | `size={1}` |
| `heading.h2` | `3.158rem` | `tighter` | `size={2}` |
| `heading.h3` | `2.369rem` | `tight` | `size={3}` |
| `heading.h4` | `1.777rem` | `snug` | `size={4}` |
| `heading.h5` | `1.333rem` | `compact` | `size={5}` |
| `heading.h6` | `1rem` | `normal` | `size={6}` |

La prop `size` de `Heading` choisit l'apparence, la prop `level` (1 à 4) choisit la balise : les deux sont indépendantes, et `size` accepte aussi une valeur par point de rupture (`size={{ xs: 6, md: 4 }}`).

Le thème MUI reprend `h1` à `h5` sur `theme.typography` ; `theme.typography.h6` reste celui de MUI, le sixième palier n'étant exposé que par les tokens et par `Heading`.

## Usage dans un portail

```tsx
import { CanopThemeProvider } from "@canop/ui";
import "@canop/ui/styles.css";

function App() {
  return (
    <CanopThemeProvider>
      <Routes />
    </CanopThemeProvider>
  );
}
```

`CanopThemeProvider` rend lui-même `<CssBaseline />` : ne pas le rajouter. L'import de `@canop/ui/styles.css` est requis — il embarque la police Chivo auto-hébergée par la librairie (aucun appel réseau vers Google Fonts).

## Bascule clair / sombre au runtime

Les palettes claire et sombre sont fournies par la lib. `CanopThemeProvider` gère la bascule au runtime, persistée dans `localStorage` et capable de suivre le réglage système.

```tsx
import { CanopThemeProvider } from "@canop/ui";

// defaultMode : "system" (défaut) | "light" | "dark"
<CanopThemeProvider defaultMode="light">
  <App />
</CanopThemeProvider>;
```

Le hook `useCanopTheme()` donne accès au mode et à sa bascule depuis n'importe quel composant sous le provider :

```tsx
import { useCanopTheme } from "@canop/ui";

function ThemeToggle() {
  const { resolvedMode, toggleMode } = useCanopTheme();
  return (
    <button onClick={toggleMode}>
      {resolvedMode === "dark" ? "Passer en clair" : "Passer en sombre"}
    </button>
  );
}
```

`useCanopTheme()` renvoie `{ mode, resolvedMode, season, setMode, toggleMode }` :

- `mode` — la préférence choisie (`"light" | "dark" | "system"`)
- `resolvedMode` — le mode effectivement appliqué (`"light" | "dark"`), avec `"system"` résolu via `prefers-color-scheme` et re-résolu si le réglage système change en cours de session
- `setMode(mode)` — fixe explicitement la préférence
- `toggleMode()` — alterne clair ⇄ sombre
- `season` — la saison effectivement appliquée (`"halloween" | null`), en lecture seule : la saison du calendrier sans prop `season`, la valeur de la prop sinon

Appelé hors d'un `CanopThemeProvider`, `useCanopTheme()` lève une erreur explicite.

### Props de `CanopThemeProvider`

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `mode` | `"light" \| "dark"` | — | Mode **forcé** (composant contrôlé) : la bascule runtime et l'écriture en `localStorage` sont alors désactivées |
| `defaultMode` | `"light" \| "dark" \| "system"` | `"system"` | Préférence initiale si rien n'est stocké |
| `storageKey` | `string \| null` | `"canop-theme-mode"` | Clé de persistance ; `null` désactive la persistance |
| `season` | `"halloween" \| null` | — | Absente : saison du calendrier, lue au montage. `"halloween"` la force, `null` coupe toute saison (voir « Thème saisonnier ») |
| `seasonalDecor` | `boolean` | `true` | `false` garde la palette de la saison sans le décor animé rendu par le provider |

### Persistance

La préférence est persistée sous la clé `canop-theme-mode`. **Il n'existe aucun repli sur une clé antérieure** : une préférence stockée par une version précédente de la librairie n'est pas relue ni migrée, l'utilisateur repart de `defaultMode`.

Les accès à `localStorage` sont protégés : environnement sans `window` (SSR) ou stockage indisponible (mode privé, cookies bloqués) ne font pas planter le provider, ils retombent simplement sur `defaultMode`.

## Thème saisonnier

`CanopThemeProvider` habille seul le portail aux couleurs de la saison en cours, en clair comme en sombre, et pose avec `PageScaffold` le décor animé qui va avec : aucun code n'est à écrire côté portail. Une seule saison existe : `"halloween"` (`CanopSeason`), du 15 octobre au 1er novembre inclus. Hors saison, le rendu est strictement celui de la palette CanopUI.

| Mode | Palette | Identité |
|---|---|---|
| Clair | `paletteHalloween` | Parchemin de grimoire : fond `#fbf3e6`, citrouille brûlée `#a8430a`, violet `#5f4682`, maïs bonbon `#f2a516` |
| Sombre | `paletteHalloweenDark` | Nuit de la Canopée : fond `#100b16`, citrouille `#ff8a1f`, violet de sorcière `#a58bd6`, ectoplasme `#a3e35b` |

Les deux palettes ont exactement la structure de `palette` et `paletteDark`, et sont aussi exposées par `tokens`. `success`, `warning`, `error` et `info` gardent les valeurs de la palette CanopUI. En sombre, les titres `h1` à `h6` prennent une lueur douce de `primary.main`, sans changer de police.

### Activation automatique

```tsx
<CanopThemeProvider>
  <App />
</CanopThemeProvider>
```

À partir de 1.3.1, sans prop `season`, le provider applique `canopSeasonAt(new Date())` : la saison revient seule chaque automne, sans redéploiement. `canopSeasonAt(date)` reste exportée, fonction pure qui renvoie `"halloween"` du 15 octobre au 1er novembre inclus, en heure locale, quelle que soit l'année, et `null` sinon.

La date est lue **une seule fois, au montage du provider** : un onglet ouvert le 14 octobre ne passe en Halloween qu'au prochain chargement, et un onglet resté ouvert le 2 novembre garde la saison jusqu'au rechargement.

### Forcer, désactiver, garder la palette sans le décor

| Besoin | Usage |
|---|---|
| Suivre le calendrier | pas de prop `season` |
| Forcer, pour une recette ou une démo | `season="halloween"` |
| Tout couper : palette CanopUI et aucun décor | `season={null}` |
| Palette de la saison sans le décor animé | `seasonalDecor={false}` |

`useCanopTheme().season` lit la saison effectivement appliquée (`"halloween"` ou `null`), résolue depuis le calendrier ou depuis la prop, en lecture seule : il n'existe ni setter ni persistance.

### Décor intégré au provider

Quand la saison appliquée vaut `"halloween"` et que `seasonalDecor` n'est pas à `false`, le décor `HalloweenDecor` en densité `medium` est posé sans rien envelopper, en deux calques fixés à l'écran, `aria-hidden` et transparents aux clics :

| Calque | Rendu par | Position |
|---|---|---|
| Supérieur : sorcière et araignées | le provider, une seule fois | dans `document.body`, en `theme.zIndex.tooltip + 1`, au-dessus de tout, dialogues et menus compris |
| Scène : ciel, fantômes, toiles, tombes, citrouilles | `PageScaffold`, juste après son fond | au-dessus du fond (`canopy` ou `shapes`), sous l'en-tête et le contenu |
| Scène, en repli | le provider, seulement si aucun `PageScaffold` n'est monté | derrière tout le contenu de la page |

`PageScaffold` s'inscrit auprès du provider au montage, avant l'affichage, et se désinscrit au démontage : la scène n'apparaît jamais en double. Si plusieurs `PageScaffold` sont montés en même temps, seul le premier inscrit porte la scène.

Le repli, pour un écran sans `PageScaffold` comme une page de connexion, est en `z-index: -1` sous la racine du document : c'est la seule position qui le garde sous un contenu non positionné. Il n'est donc visible qu'à travers les zones sans fond opaque : un conteneur de page à fond plein le masque, le fond de `body` posé par `CssBaseline` suffit. Si `html` reçoit aussi un fond, le repli est masqué.

Pas de double décor : sous un provider qui gère le décor, un `<HalloweenDecor scope="viewport">` posé par le portail, comme dans l'intégration manuelle de la 1.3.0, ne rend que ses enfants. Les décors en `scope="container"`, bornés à un composant, restent toujours rendus. Un `CanopThemeProvider` imbriqué ne rajoute ni scène ni calque supérieur.

Décision du 2026-10-13 : à partir de 1.3.1, saison et décor automatiques, scène portée par `PageScaffold` au-dessus de son fond et calque supérieur par le provider, plus aucune intégration côté portail (#159).

### Composant `HalloweenDecor`

Couche décorative, une scène en trois plans, en SVG et CSS, colorée uniquement par `var(--canop-palette-*)` et `color-mix`. Elle se pose derrière ses enfants, `aria-hidden` et transparente aux clics ; en `scope="viewport"` sans enfants, hors d'un provider qui gère déjà le décor, elle se pose derrière tout le contenu de la page, comme le repli ci-dessus. Le provider et `PageScaffold` la rendent déjà en saison : le composant ne sert directement que pour une scène bornée à une zone (`scope="container"`), par exemple une carte de connexion.

- **Au-dessus du contenu** : une sorcière sur son balai traverse tout l'écran toutes les 29 à 37 s, et les araignées descendent et remontent leur fil, accroché au moyeu de leur toile. Ce calque supérieur, `aria-hidden` et transparent aux clics, est en `theme.zIndex.tooltip + 1` ; en `scope="viewport"` il est rendu dans `document.body` pour passer aussi au-dessus des dialogues et des menus. En mouvement réduit, la sorcière n'est pas rendue et les araignées restent immobiles à mi-fil.
- **Fond** : ciel étoilé.
- **Milieu** : chauves-souris en vol chaotique (piqués, remontées, zigzags, loopings), fantômes qui errent dans le ciel, s'effacent ou font coucou depuis un bord, toiles d'araignée en coin (moyeu dans le coin, rayons extrêmes collés aux deux bords, spirales jusqu'aux bords) bercées par le vent avec leurs gouttes de rosée, collines et arbres tordus. Sous le point de rupture `sm`, la toile de gauche et son araignée sont masquées en CSS.
- **Sol** : cimetière et chat noir aux yeux qui clignent, avec un fantôme qui sort de derrière une pierre tombale ; des fantômes lumineux qui frôlent le sol ou sortent de la brume, devant les tombes et la brume.
- **Premier plan** : citrouilles, chaudron (en `medium`), feuilles mortes, lucioles et brume.

Le centre reste calme : l'animation se concentre sur les bords, le ciel et le sol.

```tsx
<HalloweenDecor density="medium">
  <LoginCard />
</HalloweenDecor>
```

- `density` : `"low"` (défaut) ou `"medium"` (essaim de chauves-souris, huit fantômes au lieu de cinq, chaudron, plus de feuilles et de lucioles). Le décor rendu par le provider est en `"medium"`.
- `scope` : `"container"` (défaut) borne le décor au composant, `"viewport"` le fixe à l'écran pendant le défilement.
- Sous `prefers-reduced-motion`, la scène reste visible dans une pose fixe : toiles, fantômes et chauves-souris à leur place ; la sorcière n'est pas rendue, pour ne jamais rester posée sur le texte. Aucune animation ne clignote plus de 3 fois par seconde ; les animations sont en pause quand l'onglet est masqué.
- Les animations ne touchent que `transform` et `opacity`.
- Le décor est derrière le contenu : un contenu à fond opaque le masque. Poser un décor `container` à l'intérieur de la zone qui laisse voir le fond.

## Mouvement réduit

Le thème embarque un reset global `@media (prefers-reduced-motion: reduce)` appliqué par `CssBaseline` : animations et transitions sont neutralisées et `scroll-behavior` repasse en `auto`. Côté JS, le hook `useReducedMotion()` permet de couper les animations pilotées par `motion` dans un composant.

## Surcharge sans rebuild (white-label)

Surcharger quelques variables dans une feuille de style du portail suffit à changer le rendu, sans recompiler ni la lib ni le portail :

```css
html:root {
  --canop-palette-primary-main: #7c3aed;
  --canop-palette-background-default: #121212;
  --canop-palette-text-primary: #e6e6e6;
}
```

Le sélecteur `html:root` est volontairement plus spécifique que le `:root` émis au runtime par MUI : la surcharge l'emporte quel que soit l'ordre d'injection des feuilles de style, qui n'est pas garanti puisque MUI insère les siennes dynamiquement.

Tous les composants consommant le thème (boutons, champs, surfaces…) reflètent immédiatement les nouvelles valeurs, car MUI référence `var(--canop-…)` dans les styles émis.

Variables disponibles : ouvrir les DevTools sur `:root` — toutes les variables générées portent le préfixe `--canop-`.

## Vitrine

Les tokens sont documentés visuellement dans la vitrine CanopUI, page Theming (`npm run vitrine`, puis #/docs/theming).
