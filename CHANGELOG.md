# Changelog — @canop/ui

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/) et le versioning [semver](https://semver.org/lang/fr/). Les versions antérieures à `canopui` 3.0.0 ne sont plus listées ici.

## [1.3.4] - 2026-10-27

### Modifié

- Dépendances de développement mises à jour pour corriger des vulnérabilités : vite 7.3.7 (GHSA-587h-7wmj-h5pm, GHSA-698v-4r3x-3vcv, GHSA-r825-w8mm-5pxw), vitest et @vitest/coverage-v8 4.1.12 (GHSA-qxg6-89mg-rqv8, GHSA-xp26-3454-mjgp). Pipeline sur l'agent Linux de la VM de prod. Code de la librairie inchangé.

## [1.3.3] - 2026-10-20

### Modifié

- Publication publique : licence MIT, paquet publié sur npmjs (en plus du registre QVL) et chaque release reflétée sur https://github.com/QVL-ToolBox/CanopUI. Code inchangé.

## [1.3.2] - 2026-10-16

### Corrigé

- **Un seul rafraîchissement de session à la fois par page, tous clients confondus (#195).** Le refresh en cours n'était partagé qu'au sein d'une même instance de `createApiClient` : deux clients `withRefresh` d'une même page (le portail et `@canop/auth-portals`, par exemple) envoyaient chacun leur `POST` de refresh avec le même cookie, ce que la lib Auth traite comme une réutilisation, d'où la révocation de toute la famille de jetons et une déconnexion forcée. Le refresh en cours est désormais partagé au niveau du module, par `refreshPath` : les clients qui reçoivent un 401 pendant ce refresh l'attendent, puis rejouent leur requête s'il réussit ou propagent leur 401 s'il échoue. Deux `refreshPath` différents ne s'attendent pas. Le verrou est libéré dès la fin du refresh, réussi ou non. API publique inchangée.

## [1.3.1] - 2026-10-13

### Corrigé

- **Le thème saisonnier s'active désormais automatiquement via `CanopThemeProvider`, sans intégration dans les portails (#159).** La 1.3.0 devait réactiver la saison seule chaque année, mais elle n'apparaissait qu'avec `season={canopSeasonAt(new Date())}` et un `<HalloweenDecor />` montés à la main. Sans prop `season`, le provider applique désormais `canopSeasonAt(new Date())`, lue une fois au montage : un onglet resté ouvert ne change de saison qu'au rechargement. En Halloween, le décor `HalloweenDecor` en `medium` se pose sans rien envelopper : `PageScaffold` rend la scène juste après son fond, au-dessus de la canopée et sous le contenu, comme le rendu validé dans Cockpit ; le provider rend une seule fois le calque supérieur de la sorcière et des araignées dans `document.body`, et la scène en repli, derrière toute la page, seulement quand aucun `PageScaffold` n'est monté. `PageScaffold` s'inscrit auprès du provider avant l'affichage : la scène n'est jamais rendue deux fois. `useCanopTheme().season` renvoie la saison effective, calendrier ou prop. Hors saison, le rendu et l'instance `canopTheme` en clair sont ceux de la 1.3.0.
  - `season="halloween"` force la saison, `season={null}` coupe palette et décor.
  - Nouvelle prop `seasonalDecor?: boolean` (`true` par défaut) : `false` garde la palette sans le décor.
  - Pas de double décor : sous un provider qui gère le décor, `<HalloweenDecor scope="viewport">` ne rend que ses enfants ; les décors `scope="container"` ne changent pas, un provider imbriqué n'en rajoute pas.
  - Hors d'un provider qui gère le décor, `<HalloweenDecor scope="viewport" />` sans enfants se pose désormais derrière le contenu de la page au lieu de le recouvrir.
  - Le repli sans `PageScaffold` n'est visible qu'à travers les zones sans fond opaque.

### Migration

- Retirer `season={canopSeasonAt(new Date())}` et tout `<HalloweenDecor scope="viewport">` monté à la main, autour de l'application ou dans le contenu de `PageScaffold`. Laissé en place, ce décor ne rend que ses enfants, et la scène reste celle du provider et de `PageScaffold`, en `medium`. `season={canopSeasonAt(new Date())}` donne le même résultat que l'absence de prop, réévalué à chaque rendu de la racine au lieu d'une fois au montage.
- Un portail qui ne veut pas de saison passe `season={null}`.
- Un test consommateur qui suppose l'absence de saison sans prop `season` dépend désormais de la date : fixer la date (`vi.setSystemTime`) ou passer `season={null}`.

## [1.3.0] - 2026-10-13

### Ajouté

- **Thème saisonnier Halloween (#147).** `CanopThemeProvider` gagne `season?: CanopSeason | null` (`CanopSeason = "halloween"`), `createCanopTheme(mode, season?)` le second paramètre, et `useCanopTheme()` expose `season` en lecture seule, sans setter ni persistance. Deux palettes rejoignent les tokens et `tokens` : `paletteHalloween` (parchemin de grimoire) et `paletteHalloweenDark` (Nuit de la Canopée), de même structure que `palette` et `paletteDark` ; `success`, `warning`, `error` et `info` restent ceux de CanopUI. En sombre, les titres prennent une lueur douce de `primary.main`.
  - Contrastes AA : en clair, texte primaire 14,9:1 et secondaire 6,78:1 au pire (sur `surface.sunken`), `primary.main` 5,04:1 sur la surface la plus foncée, `primary.contrastText` 5,82:1, `accent.contrastText` 8,31:1 ; en sombre, texte primaire 12,7:1 et secondaire 7,71:1 au pire (sur `surface.overlay`), `primary.main` 6,2:1 au pire, `primary.contrastText` 8,12:1, `accent.contrastText` 11,7:1.
- **`canopSeasonAt(date)` (#147).** Fonction pure, `"halloween"` du 15 octobre au 1er novembre inclus en heure locale, chaque année, `null` sinon. `season={canopSeasonAt(new Date())}` réactive le thème seul chaque automne.
- **`HalloweenDecor` (#148).** Une scène d'Halloween en SVG et CSS, en trois plans, colorée par `var(--canop-palette-*)`, `aria-hidden`, transparente aux clics, posée derrière ses enfants, avec un calque supérieur pour la sorcière et les araignées. Props `density` (`"low"` par défaut, `"medium"`) et `scope` (`"container"` par défaut, `"viewport"`).
  - Calque supérieur au-dessus du contenu (`theme.zIndex.tooltip + 1`, rendu dans `document.body` en `scope="viewport"`), `aria-hidden` et transparent aux clics : une sorcière sur son balai y traverse tout l'écran toutes les 29 à 37 s avec une traînée d'étincelles (absente en mouvement réduit), et les araignées y descendent et remontent leur fil, accroché au moyeu de leur toile (immobiles à mi-fil en mouvement réduit).
  - Fond : ciel étoilé.
  - Milieu : chauves-souris en vol chaotique (vitesse variable, piqués, remontées, zigzags, loopings, corps incliné selon la pente, durées premières entre elles), essaim qui tournoie en `medium`, fantômes à trois profondeurs (flou au fond), quatre expressions, qui errent dans le ciel, s'effacent ou font coucou depuis un bord, toiles en coin (moyeu dans le coin, rayons extrêmes collés aux deux bords, spirales jusqu'aux bords, aucun fil dans le vide) bercées par le vent avec leurs gouttes de rosée, collines et arbres tordus. Sous le point de rupture `sm`, la toile de gauche et son araignée sont masquées en CSS.
  - Sol : cimetière et chat noir, un fantôme qui sort de derrière une pierre tombale, des fantômes lumineux (halo d'ectoplasme en sombre) qui frôlent le sol ou sortent de la brume, rendus devant les tombes et la brume, visibles environ 80 % du cycle.
  - Premier plan : citrouilles de tailles variées, allumées ou non, chaudron qui bouillonne en `medium`, feuilles mortes, lucioles et brume.
  - `low` : sorcière, 16 étoiles, 4 chauves-souris, 5 fantômes (dont 2 au sol), 2 toiles, 1 araignée, 3 citrouilles, 4 feuilles, 6 lucioles. `medium` : sorcière, 26 étoiles, 7 chauves-souris et un essaim de 5, 8 fantômes (dont 3 au sol), 2 toiles, 2 araignées, chaudron, 5 citrouilles, 8 feuilles, 12 lucioles.
  - Pose fixe et visible en mouvement réduit (sans la sorcière), aucun clignotement au-delà de 3 par seconde, pause quand l'onglet est masqué ; animations en `transform` et `opacity` uniquement.
- **Icônes `ghost`, `pumpkin` et `bat` (#148).** En outline et en solid.

### Migration

Aucune : sans `season`, le thème est identique à la 1.2.0, et l'instance `canopTheme` reste partagée en clair. Un `Record` exhaustif sur `CanopIconName` demande les trois nouvelles clés.

## [1.2.0] - 2026-10-12

### Ajouté

- **`Card` gagne la variante `frosted`, un verre dépoli à poser sur `CanopyBackground` (#88).** De quoi retirer `FrostedPanel emphasis="hero"` du Hub et `heroPanelStyle` du Cockpit.
  - Valeurs reprises du héros du Hub (`frostedPanelSx.hero`) : dégradé à 150° de `primary.light` à 22 % vers `accent.light` à 18 %, sur un voile de `surface.base` à 33 %, fond flouté en `blur(0.35rem) saturate(1.3)`, squircle `xl` par défaut, et rembourrage `md` puis `xl` à partir de `md` en densité `auto` — une densité explicite reste honorée. Pas d'ombre par défaut, `elevation` reste honorée. `tone` ne change pas le fond du verre, `data-tone` reste posé. Aucune animation.
  - Repli opaque : sans `backdrop-filter` (`@supports not`, forme préfixée comprise), le même dégradé est posé sur `surface.base` **opaque**, là où le Hub s'arrêtait à 67 % : seul un fond opaque permet de garantir le contraste.
  - Contrastes : le texte du thème tient l'AA, texte primaire puis secondaire : 13,9:1 et 5,27:1 en clair, 8,66:1 et 4,68:1 en sombre sur le repli ; 13,5:1 et 5,11:1 en clair, 10,1:1 et 5,43:1 en sombre sur le verre posé sur `background.default`.
  - Limite sur la canopée : le contraste dépend de la scène ; un voile de 33 % ne le garantit pas devant une zone très claire en thème sombre, ou très foncée en thème clair, et c'est le rendu validé sur le Hub qui fait foi.

  ```tsx
  <CanopyBackground>
    <Card variant="frosted" title="Bonjour Martin">Trois revues vous attendent.</Card>
  </CanopyBackground>
  ```

- **`IconActionButton` gagne la variante `accent` (#88).** Fond `accent.main`, survol `accent.dark`, glyphe `accent.contrastText`, identiques en clair et en sombre puisque la palette d'accent est la même : le glyphe tient 8,85:1 au repos et 5,91:1 au survol, au-dessus des 4,5:1 du texte comme des 3:1 des éléments non textuels. Au focus clavier, le bouton garde son fond `accent.main` et porte l'anneau commun de la librairie, l'état désactivé est celui des autres variantes et le `Spinner` de `loading` prend la couleur du glyphe. `SoundToggle`, qui relaie `CanopIconActionButtonVariant`, l'accepte aussi. De quoi retirer `AccentIconButton` du Cockpit et le repeint de `useStoreIconAction` du Hub.

### Modifié

- Commentaires retirés du code source, JSDoc des exports publics conservée (#62).

### Corrigé

- **`SaveButton` n'est plus désactivé pendant la sauvegarde : il passe en chargement (#63).** Tant que `onSave` courait, le bouton recevait `disabled` : il perdait le focus, sortait de l'ordre de tabulation, et rien n'annonçait aux technologies d'assistance qu'un enregistrement était en cours. Il reçoit désormais la prop `loading` d'`IconActionButton` : un Spinner de la couleur de l'icône la remplace, le bouton porte `aria-busy="true"`, garde sa pastille et le focus, et ignore le clic comme Entrée et Espace, donc toujours aucun double envoi. Les états repos, succès et échec ne changent pas, et la prop `disabled` désactive toujours le bouton.

  **Impact** : pendant la sauvegarde, le bouton n'est plus `disabled`, il est `aria-busy` et non cliquable. Un test consommateur qui vérifiait `toBeDisabled()` à ce moment échoue désormais et doit vérifier `aria-busy` à la place, par exemple `expect(bouton).toHaveAttribute("aria-busy", "true")`. À l'écran, la pastille garde sa couleur de variante avec un Spinner au lieu de passer au gris de l'état désactivé.

- **`IconActionButton` : au focus clavier, les variantes `default`, `danger` et `secondary` gardent leur fond plein au lieu de passer au voile gris (#88).** Le voile `action.focus` posé par le thème sur `.Mui-focusVisible` l'emportait sur le fond de repos ; chaque variante reprend désormais au focus son fond de repos, comme le faisait déjà `accent`, et l'anneau commun de la librairie ne change pas. L'état désactivé n'est pas concerné, un bouton désactivé ne prenant pas le focus. **Impact visuel** : dans tous les portails, un bouton d'icône atteint au clavier garde sa pastille colorée, en clair comme en sombre, sous l'anneau de focus. Sont concernés `AddButton`, `ApproveButton`, `DeleteButton`, `EditButton`, `SaveButton`, `CarouselArrow`, les contrôles de `SvgMap`, `SoundToggle`, et les actions d'`OverflowActionBar`, donc de `Toolbar` et de `SelectionBar`. Le rendu au repos, au survol et au clic ne change pas.

### Migration

Aucune API existante ne bouge : `frosted` et `accent` sont des valeurs en plus, et les variantes existantes rendent le même CSS qu'avant, au fond de focus clavier près d'`IconActionButton`. Deux points seulement peuvent demander une retouche côté portail :

1. **Compléter les `Record` exhaustifs sur les variantes (#88).** Un `Record<CanopCardVariant, …>` demande la clé `frosted`, un `Record<CanopIconActionButtonVariant, …>` la clé `accent`. Le compilateur signale chaque occurrence.
2. **Reprendre les tests de `SaveButton` pendant la sauvegarde (#63)** — **rien ne le signale à la compilation**. Le bouton n'est plus `disabled` tant que `onSave` court : un test qui vérifiait `toBeDisabled()` à ce moment échoue et doit vérifier `aria-busy` à la place, `expect(bouton).toHaveAttribute("aria-busy", "true")`. La prop `disabled` désactive toujours le bouton.

Rien à faire pour le reste. Le fond plein des boutons d'icône au focus clavier est un changement visuel uniquement, sans prop ni API touchée. Le retrait des commentaires du code source (#62) laisse la JSDoc publique inchangée.

**Suivi conseillé**, sans urgence : le Hub et le Cockpit peuvent retirer leurs copies locales au profit de la librairie — `FrostedPanel emphasis="hero"` (Hub) et `heroPanelStyle` (Cockpit) au profit de `Card variant="frosted"`, `AccentIconButton` (Cockpit), le repeint de `useStoreIconAction` (Hub) et les constantes `ACCENT_*` au profit d'`IconActionButton variant="accent"`.

## [1.1.0] - 2026-10-09

### Ajouté

- **Ajout de `Presence` / `PresenceItem` (#45).** `Presence` enveloppe `AnimatePresence` (`mode` `"sync"` par défaut ou `"wait"`, rien d'animé au premier rendu) ; `PresenceItem` entre par `useEnterAnimation`, sort en fondu glissé sur la durée `base` et la courbe `accelerate`, suit sa nouvelle place avec `layout`, et transmet `role` et `ariaBusy`. En mouvement réduit, aucune durée et aucune animation de place.
- **Ajout de `BentoGrid` / `BentoTile` (#57).** Grille bento à colonnes imposées (`columns`, `{ sm: 2, md: 3 }` par défaut, toujours une colonne en `xs` sauf valeur explicite), `gap`, `rowHeight` en hauteur minimale de rangée, et `role` / `ariaLabel` transmis au conteneur. Chaque `BentoTile` prend `span` et `rowSpan`, fixes ou par point de rupture, ramenés au nombre de colonnes du palier : une tuile ne crée jamais de colonne fantôme et ne déborde jamais en mobile. La tuile enveloppe son contenu dans un `PresenceItem fill` : sous un `Presence`, elle entre, sort et glisse (`layout`) comme un item, et une `Card fill` occupe toute sa cellule, donc toute la hauteur de la rangée. Hors `Presence`, la tuile joue aussi son entrée au montage.
- **`Presence` gagne `stagger` et `appear` (#57).** `stagger` (en secondes) décale l'entrée de chaque enfant selon sa position, `appear` joue l'entrée dès le premier rendu. En mouvement réduit, ni décalage ni animation : le contenu s'affiche directement.
- **`PresenceItem` gagne `fill` (#57).** L'item devient une colonne flexible qui occupe toute la hauteur de son conteneur, pour qu'une `Card fill` s'y étire.
- **`Text` gagne la variante `display` (#57).** Le compteur d'une tuile vedette : `display-3` des tokens en mobile, `display-2` à partir de `md`, chiffres tabulaires par défaut comme `metric`.
- **`Card` gagne `arrow` (#57).** Une flèche dans l'en-tête, qui avance au survol et au focus, sans `sx` côté consommateur. Réservée à `variant="interactive"` : sur toute autre variante, `arrow` ne rend rien. Immobile en mouvement réduit.
- **`CanopBentoColumns` est exporté depuis `@canop/ui` (#57).** Le type de `BentoGrid.columns` : un nombre se lit « une colonne en `xs`, ce nombre dès `sm` », jamais de grille automatique.
- **`CanopCardGridColumns` est exporté depuis `@canop/ui` (#57).** Le type existait mais n'était atteignable que par un chemin interne.
- **`StatCard` gagne `onClick` (#59).** La carte devient un bouton : focusable, déclenchée par Entrée et Espace, curseur pointeur, soulèvement au survol (immobile en mouvement réduit). Elle garde son fond de carte `stat` : côté `Card`, `variant="stat"` avec `onClick` est désormais interactive comme `variant="interactive"`, sans la flèche, qui reste réservée à cette dernière.
- **`StatCard` gagne `ariaLabel` (#59).** Relayé à `Card` : une `StatCard` cliquable reçoit un nom accessible concis au lieu de faire lire tout son contenu.
- **Ton `info` pour `Card`, `StatCard` et `Legend` (#59).** `CanopCardTone` et `CanopLegendTone` gagnent `"info"`. Le fond de carte reste à 8 % de `info.main` : le texte y tient 16,7:1 (primaire) et 6,3:1 (secondaire) en clair, 11,0:1 et 5,9:1 en sombre. La pastille de légende vaut 8,3:1 sur `background.paper` en clair, 6,1:1 en sombre.
- **`Card` pose `data-tone` sur sa racine (#59).** La valeur est le ton résolu, `"neutral"` par défaut : un portail cible une tonalité en CSS sans redire la prop. Un `data-tone` passé par le consommateur est refusé à la compilation.
- **`Card` et `Stack` transmettent `ref` et les attributs `data-*` à leur racine (#59).** `ref` est une prop ordinaire (React 19) : `Ref<HTMLDivElement>` pour `Card`, `Ref<HTMLElement>` pour `Stack`.
- **`Stack` gagne `ariaBusy` (#59).** Posé en `aria-busy` sur le conteneur, pour qu'un chargement (`Skeleton`, #60) s'annonce occupé.
- **`IconActionButton` gagne `loading`.** Un Spinner de la couleur de l'icône la remplace, à la taille déduite d'`iconSize` (`small` jusqu'à `lg`, `medium` pour `xl`), avec donc le même contraste qu'elle dans chaque variante et chaque thème, et le bouton porte `aria-busy="true"`. Le clic est ignoré, mais le bouton n'est pas désactivé : il garde sa taille et son focus (#58).
- **`IconActionButton` gagne `tooltip`.** Avec `true`, l'infobulle reprend `ariaLabel` ; avec un texte, elle le remplace. Elle s'ouvre au survol et au focus clavier. Si son texte est identique au libellé, elle ne fait que le répéter ; s'il est différent, elle décrit le bouton par `aria-describedby`. Aucune infobulle n'est affichée sans la prop, ni sur un bouton désactivé (#58).
- **`IconActionButton` accepte `ref` et les attributs `data-*`.** `ref`, passé en prop comme le permet React 19, pointe sur le `<button>` natif, et les `data-*` y sont posés (#58).
- **`Spinner` accepte `color="inherit"`.** Le trait est alors uni et prend la couleur du texte parent (`currentColor`), sans dégradé de palette. La couleur par défaut reste `accent` (#58).

- **`Avatar` : les initiales d'un nom sur une teinte du thème (#60).** Deux lettres au plus — la première du premier et du dernier mot, traits d'union compris —, accents et ligatures conservés quelle que soit la forme Unicode du nom. La teinte est tirée du nom, sans casse ni espaces superflus, parmi six familles de la palette (`primary`, `info`, `accent`, `secondary`, `success`, `error`), chacune posée avec son `contrastText` : au moins 4,5:1 en clair comme en sombre. `warning` est écartée, son texte blanc ne fait que 4,2:1 en thème clair. Le nom complet est le libellé accessible (`role="img"`), les initiales ne sont pas lues. Un nom dont on ne tire aucune lettre (`""`, `"42"`) affiche une silhouette `aria-hidden`, garde une teinte stable et pour libellé le nom, ou `canop.avatar.anonymous` (« Utilisateur anonyme ») s'il est vide. Tailles `sm`, `md` (défaut) et `lg`.

- **`Skeleton` : un gabarit de chargement en bloc ou en lignes (#60).** `variant="block"` (défaut) prend `width` et `height`, `variant="lines"` prend `width` et `lines` et raccourcit la dernière ligne ; les props sont une union discriminée sur `variant`, qui refuse `height` en lignes et `lines` en bloc. La pulsation n'anime que l'opacité, se propage en cascade d'une ligne à l'autre, et s'arrête en mouvement réduit — par le hook `useReducedMotion` comme par la feuille de style. Le gabarit est `aria-hidden` : c'est au conteneur du contenu attendu de porter `aria-busy` le temps du chargement.

  ```tsx
  <section aria-busy={loading}>{loading ? <Skeleton variant="lines" /> : <Profile />}</section>
  ```

- **`VisuallyHidden` : masquer à l'écran sans masquer aux lecteurs d'écran (#60).** Le contenu reste dans l'arbre d'accessibilité, sans occuper de place. `as` choisit `span` (défaut) ou `div`, `id` permet de le relier par `aria-describedby`.

- **`LiveRegion` et `useLiveAnnouncer` : annoncer un message aux lecteurs d'écran (#60).** Polie par défaut (`role="status"`), assertive en option (`politeness="assertive"`, `role="alert"`). La région est rendue vide, puis le message y est écrit un instant plus tard, ce qui garantit l'annonce. Un message identique au précédent est relu dès que `announcementId` change : `useLiveAnnouncer()` le fournit, en numérotant chaque appel d'`announce`. Plusieurs annonces à moins de 100 ms d'intervalle ne donnent qu'une lecture, celle de la dernière. Remplace `PoliteAnnouncement` du Cockpit, avec deux différences : le message est désormais annoncé dès le montage, et relire un message identique passe par `useLiveAnnouncer` — un simple `message` inchangé n'est pas relu.

- **`Toast` accepte une action : `action={{ label, onClick }}`.** Un vrai bouton est rendu à droite du message, atteignable au clavier, avec un anneau de focus et un survol tirés de la couleur du texte — il reste lisible sur les trois sévérités. Un clic exécute `onClick` puis ferme le toast via `onClose`. La `duration` est suspendue tant que le toast est survolé ou que le focus est dedans, et repart pour sa durée complète à la sortie. Avec une `action` et sans `duration` explicite, le toast reste 6000 ms au lieu de 3000 ms, le temps d'atteindre le bouton au clavier. Sans `action`, le rendu ne change pas. (#61)

- **`Link external` ouvre un nouvel onglet et le dit.** La prop pose `target="_blank"` et `rel="noopener noreferrer"`, et ajoute au nom accessible du lien une mention masquée à l'écran, « (s'ouvre dans un nouvel onglet) ». Le texte passe par l'i18n de la librairie, clé `canop.link.newTab` (fr et en) : un portail le reformule dans ses messages, sans prop dédiée. (#61)

- **Quatre icônes de forge : `gitBranch`, `gitCommit`, `pullRequest` et `pipeline`.** Dessinées sur la grille du jeu existant — viewBox 24, trait de 1,5, extrémités et jointures arrondies, `currentColor` —, chacune en `outline` et en `solid`, la variante pleine remplissant les nœuds. (#61)

- **`Navbar` choisit le niveau de son titre : `titleLevel`.** `1` par défaut, donc aucun portail ne change ; `2`, `3`, `4`, ou `"text"` pour un simple paragraphe. Le rendu visuel est strictement le même à tous les niveaux, seule la balise change. `PageScaffold` le relaie en `navbarTitleLevel` : il rend déjà un `<h1>` pour le titre de page, si bien qu'un portail qui renseigne `navbarTitle` avait jusqu'ici deux `<h1>` par page. (#61)

- **`Heading` accepte `component="p" | "span" | "div"`** pour garder l'apparence d'un titre sans en avoir la sémantique. C'est ce qui sert `titleLevel="text"`. Sans la prop, la balise reste `h{level}`. (#61)

### Modifié

- **L'infobulle des tuiles de `Navbar` passe par un primitif interne partagé, `OptionalTooltip`.** `IconActionButton` utilise le même. Le rendu de la `Navbar` ne change pas (#58).

### Corrigé

- **`IconActionButton`, variante `default`, en thème sombre : l'icône passe du blanc au vert très foncé `primary.contrastText`.** Le blanc sur `primary.main` sombre ne tenait que 2,81:1, sous le seuil de 3:1 des éléments non textuels ; le foncé y tient 6,73:1, et 3,88:1 au survol sur `primary.dark`. La variante suit désormais la même règle que `secondary`. Le Spinner de `loading` hérite de la correction. **Impact visuel** : dans les portails en thème sombre, tous les boutons d'icône sans variante ou en `default` affichent une icône foncée sur leur pastille verte, au repos comme au survol. Sont concernés `AddButton`, `ApproveButton`, `EditButton`, `SaveButton`, `CarouselArrow`, `SoundToggle` lorsqu'il reçoit `variant="default"` (sa variante par défaut est `secondary`), et les actions non destructives d'`OverflowActionBar`, donc de `Toolbar` et de `SelectionBar`. Le thème clair, les variantes `danger` et `secondary` et l'état désactivé ne changent pas (#58).
- **Une action posée dans une `Card` cliquable déclenchait aussi la carte (#59).** Un clic, ou Entrée et Espace sur un bouton du slot `actions`, remontait jusqu'au `onClick` de la carte ; au clavier, la carte avalait même la touche et le bouton ne recevait jamais son clic. Le slot `actions` est désormais isolé, y compris pour un menu ouvert depuis ce slot et rendu dans un portail. La propagation n'est pas arrêtée, seule la carte ignore l'événement : `stopPropagation` côté consommateur devient inutile, et les écouteurs de document (fermeture d'un menu au clic extérieur) continuent de le recevoir.

### Migration

Rien à changer. Aucune API existante ne bouge. Toutes les props sont optionnelles et leurs valeurs par défaut reproduisent le comportement actuel.

Sans les nouvelles props, `IconActionButton` rend le même bouton qu'avant, à la couleur d'icône près de la variante `default` en thème sombre, et un `Spinner` sans `color` reste ambre.

## [1.0.0] - 2026-10-01

> Renommage : le paquet `canopui` devient `@canop/ui` (nouveau dépôt Azure DevOps, historique remis à zéro). Aucun changement d'API par rapport à `canopui` 3.1.1.

### Modifié

- **Le paquet `canopui` devient `@canop/ui`.** Même registre (`https://npm.qvl-project.com/`), mêmes points d'entrée sous le nouveau nom : `@canop/ui`, `@canop/ui/map`, `@canop/ui/vite` et `@canop/ui/styles.css`. Le code est strictement celui de `canopui` 3.1.1.

- **Nouveau dépôt Azure DevOps, numérotation remise à zéro.** Les sources vivent désormais sur [Azure DevOps](https://dev.azure.com/qvl-project/QVL-ToolBox/_git/CanopUI) et les versions repartent de 1.0.0. L'historique de `canopui` 3.x est conservé ci-dessous.

### Migration

1. Remplacer la dépendance : `npm uninstall canopui` puis `npm install @canop/ui`.
2. Remplacer les imports `"canopui"`, `"canopui/map"`, `"canopui/vite"` et `"canopui/styles.css"` par leurs équivalents `@canop/ui`, y compris la clé `shared` de Module Federation.
3. Rien d'autre : les fichiers servis par le greffon restent sous `/canopui/video` et `/canopui/map`.

## [3.1.1] - 2026-09-16

> Un tableau affichait chaque valeur sous l'en-tête de la colonne suivante, et écrasait la première colonne.

### Corrigé

- **Les cellules du `DataTable` étaient décalées d'une colonne par rapport à leurs en-têtes.** Le fond blanc en squircle des lignes était peint par un contenu généré posé sur la ligne elle-même (`tr::before`). Or un navigateur ne sait pas loger du contenu directement dans une ligne de tableau : il l'enveloppe dans une **cellule anonyme**, qui devient une première colonne invisible. Chaque `<td>` glissait donc sous l'en-tête suivant, et le dernier débordait dans une colonne fantôme. Mesuré sur une page de portail en 375 × 812 : en-têtes à 13,5 / 76,5 / 135,8 / 221,3, cellules à 76,5 / 135,8 / 221,3 / 302,3 — exactement un cran d'écart. La première colonne, sacrifiée à la cellule fantôme, tombait à 59,3 px au lieu de 118,5.

  Le fond reste **un seul calque couvrant la ligne entière** — c'est ce qui évite les cheveux de fond entre cellules à certains zooms, corrigés précédemment —, mais il est désormais **hébergé par la première cellule**. Il continue de couvrir toute la ligne sans rien connaître de sa largeur : l'ombre portée fait de la ligne le bloc conteneur du calque. Aucune colonne n'est créée, le rendu est strictement celui d'avant — même rayon, même ombre, même espacement vertical, mêmes états de survol, de sélection et de dépôt, en thème clair comme en thème sombre.

- **`squircleSurface` accepte une cible pour ses calques.** Nouvelle option `layerSelector`, utile aux éléments qui ne peuvent pas accueillir de contenu généré — les lignes de tableau en sont le cas type. Par défaut les calques restent sur l'élément décoré : aucun appel existant ne change.

### Migration

Rien à changer.

## [3.1.0] - 2026-09-15

> L'échelle des titres gagne un cran. Un titre déjà au plus petit palier n'avait plus nulle part où descendre sur téléphone : il en a désormais un de plus.

### Ajouté

- **Les titres gagnent un sixième palier, `size={6}`.** La 3.0.2 concluait qu'une fois la page protégée du débordement, « choisir une taille de titre où le mot tient sur sa ligne reste le travail du portail ». Encore faut-il que ce choix existe : mesuré sur un portail, un titre déjà en `size={5}` à côté d'un logo n'avait plus de palier inférieur, et un nom sans trait d'union — « DéparteMental », « FondDeShaker » — ne pouvait que se couper. C'était le seul dénouement possible, et il est laid.

  La forme responsive suit sans rien de plus, `size={{ xs: 6, md: 4 }}` étant déjà typée sur la même échelle.

  **`level` reste plafonné à 4 et ne gagne rien.** La sémantique et l'apparence sont dissociées depuis la 3.0, et elles le restent : `size={6}` est une taille, pas un `<h6>`. Comme `level` s'arrête à 4, le repli d'un palier responsive non renseigné ne peut toujours atteindre que les échelles 1 à 4 — aucun `size={6}` implicite n'existe.

- **`typography.heading.h6` vaut 1 rem, dernier cran de la gamme.** La valeur ne s'invente pas, elle se déduit : l'échelle des titres est une gamme modulaire de raison **1,333** — 4,21 → 3,158 → 2,369 → 1,777 → 1,333, chaque rapport valant 1,3331 à trois décimales près. Le cran suivant est donc **1 rem**, la taille du corps de texte, ce qui est exactement ce qu'on attend du dernier palier d'une gamme de titres. Le crénage suit la même logique : les cinq paliers descendent `tightest, tighter, tight, snug, compact`, `h6` prend le suivant, `normal` (−0,006 em). C'est la seule valeur qui tienne l'invariant vérifié par les tests — un texte plus grand n'est jamais moins resserré qu'un texte plus petit —, `compact` la casserait face aux rôles de 1,0625 et 1,125 rem qui sont déjà en `normal`. Famille, graisse et interligne sont ceux des cinq autres paliers : Titan One, 400, `tight`.

  **C'est un ajout, pas un réglage : les paliers 1 à 5 ne bougent pas d'un centième de rem.** Rien n'est recalculé, une valeur est ajoutée au bout de la liste.

  **Le thème MUI n'est pas touché** : `theme.typography.h6` reste celui de MUI. Le câbler sur le nouveau token changerait silencieusement tous les `<Typography variant="h6">` des portails, ce qui n'est pas ce qu'on corrige ici et mérite sa propre décision.

### Migration

Rien à changer. Aucune API existante ne bouge, `size={6}` est disponible en plus.

## [3.0.2] - 2026-09-14

> Un seul défaut, mais un défaut de mise en page silencieux : une carte pouvait sortir de sa colonne et forcer un défilement horizontal sur téléphone, sans rien signaler.

### Corrigé

- **Une carte pouvait devenir plus large que sa colonne, et rien ne le disait.** Un enfant de grille part en `min-width: auto`, c'est-à-dire « pas plus étroit que mon contenu ». Or le contenu d'une carte contient des **mots**, et un mot ne se coupe pas : sa largeur devient le plancher de la colonne. Mesuré sur un portail : un titre de douze lettres en `h4` occupe 234 px en Titan One ; avec l'icône, la gouttière et le rembourrage, la carte ne pouvait plus descendre sous **336 px pour une colonne de 293** — une tuile visiblement plus large que ses trois voisines, et un défilement horizontal sur téléphone.

  `CardGrid` tenait pourtant sa promesse : ses colonnes étaient bien égales, c'est l'enfant qui en sortait. Le défaut se jouait à **trois étages à la fois**, et corriger un seul n'y suffisait pas — mesure à l'appui, sur la même page à 320 px : laisser rétrécir la carte seule la ramène dans sa colonne, mais le titre sort alors **de la carte**. `CardGrid` laisse donc ses enfants passer sous leur contenu, et `Card` comme `Stack` cèdent à leur tour. La carte grandit en hauteur, ce qu'on lui demande, au lieu de grandir en largeur, ce qu'on ne lui demandait pas.

  Hors contexte flex ou grille, `min-width: auto` vaut déjà zéro : la règle n'a donc d'effet que là où le défaut se produisait. Vérifié sur **158 pages de vitrine** balayées à 1440 px et à 390 px — aucune ne se dégrade.

- **Un mot trop long pour sa ligne se coupe, au lieu de déborder de sa carte.** C'est le troisième étage du même défaut, et il ne sert à rien seul : tant que les boîtes refusent de rétrécir, le mot n'a aucune raison de se couper — mesuré, la carte restait à 336 px. `Heading` et `Text` le coupent donc en dernier recours, et la seule mise en page qui change dans toute la vitrine est un titre de la page `Description list` qui cesse de déborder.

  `break-word` et non `anywhere` : `anywhere` entre aussi dans le calcul du `min-content` et rétrécirait des colonnes qui s'appuient dessus, alors qu'il n'y a rien à corriger chez elles.

  Reste que cette coupure est **laide** — « Entraînemen / t », sans césure typographique. La librairie garantit que la page ne casse pas ; choisir une taille de titre où le mot tient sur sa ligne reste le travail du portail.

### Migration

Rien à changer. Aucune API ne bouge.

## [3.0.1] - 2026-09-10

> Premier correctif de la 3.0, sur deux défauts que seule la mise en ligne pouvait révéler : la carte ne se dessinait pas en production, et un champ pré-rempli par le navigateur perdait la forme et la couleur du design system.

### Corrigé

- **La carte restait vide en production, et seulement en production.** MapLibre 6 a sorti son worker du bundle principal : il le résout comme **fichier voisin de son propre module**, par `new URL(\`./\${nom}\`, import.meta.url)`. Un empaqueteur ne sait pas analyser cette forme statiquement, donc **il n'émet jamais le fichier**. En développement rien ne se voyait, Vite servant le vrai fichier depuis `node_modules` ; en ligne le chemin pointait dans le vide. Le greffon `canopui/vite` recopie désormais ces fichiers et les sert à la même adresse en développement comme au build, et la librairie pointe MapLibre dessus par `setWorkerUrl` — **sans écraser un choix de l'application**, MapLibre lisant `config.WORKER_URL || <calcul par défaut>`.

  **Le défaut était masqué par un 200.** Derrière un hébergement d'application à route unique, le repli renvoie `index.html` pour tout chemin inconnu : la requête du worker répondait donc **200 avec du `text/html`**, si bien qu'un contrôle de code de réponse semblait bon. Chrome, lui, applique la vérification stricte du type MIME aux scripts de module et refuse — d'où `Failed to load module script: The server responded with a non-JavaScript MIME type of "text/html"`.

  **Et il fallait les deux fichiers.** Le worker importe à son tour `maplibre-gl-shared.mjs`. N'en recopier qu'un laissait une carte tout aussi vide, avec cette différence qu'elle ne disait **plus rien dans la console** : le worker se chargeait, puis mourait sur son propre `import`. Mesuré de bout en bout sur la vitrine construite et servie comme en production — 14 requêtes de carte et aucune tuile avant, 90 requêtes et des tuiles `.pbf` en `application/vnd.mapbox-vector-tile` après. Un test tient la liste des fichiers à jour : il relit les `import` du worker et échoue si l'un d'eux n'est pas déclaré, ce qui arrivera à la prochaine montée de version de MapLibre.

- **Une carte pouvait perdre son dessin en cours de route, sans rien dire.** Un navigateur mobile **plafonne le nombre de contextes WebGL vivants** — huit sur Android, contre le double sur un poste — et **supprime les plus anciens** quand la page en demande davantage ; la pression mémoire et les onglets en arrière-plan produisent le même effet. Il ne restait alors qu'un cadre blanc avec ses boutons de zoom, le DOM étant intact : Chromium y peint son **glyphe d'image cassée**, qui ne dit rien à personne. `Map` écoute désormais `webglcontextlost` et bascule sur son panneau de repli — « Carte non affichable ici », avec le lien vers la position. C'est la règle que la librairie s'applique partout : un échec lisible plutôt que silencieux.

- **Page composant `SVG map` — la page de doc montait une douzaine de cartes à la fois**, donc autant de contextes WebGL, et sur un téléphone les premières perdaient le leur pendant que les dernières s'affichaient — la signature exacte de l'éviction. Chaque démonstration se monte maintenant **à l'apparition** et se démonte en sortant du champ : mesuré à **une seule carte vivante au lieu de douze**, tuiles toujours chargées. Le défaut ne se voyait ni sur un poste, ni en émulation Android — l'émulation tourne sur le GPU du poste et n'a pas ce plafond —, seulement sur un vrai téléphone.

- **Un champ pré-rempli par le navigateur perdait la forme et la couleur du design system** — bleu et rectangulaire sous Chrome, jaunâtre sous Safari. Le fond d'un champ n'est pas sur le champ : il est sur un calque `::before` découpé en squircle, et l'`<input>` lui-même est transparent. Un pré-remplissage vient donc peindre le fond de l'agent utilisateur **sur le rectangle de l'`<input>`**, par-dessus le squircle. Une `background-color` ne suffit pas à le reprendre, la règle de l'agent utilisateur l'emportant : seule une **ombre interne** recouvre ce fond, et elle reste dans le découpage du champ, donc le squircle continue d'affleurer sur les bords. La règle est posée sur `MuiInputBase`, base commune de tous les champs, et la couleur passe par `--canop-input-autofill` sur le modèle de `--canop-input-notch` : `InlineInput` est sur `background.paper` et non sur la teinte des champs contourés, une couleur unique en trahirait un des deux. Les **quatre états** sont couverts, Chrome reposant son fond au survol et au focus.

### Migration

Rien à changer dans le code d'un portail. **Un portail qui affiche une carte doit en revanche avoir le greffon** dans sa configuration Vite — celui que la 3.0 avait introduit pour le fond de canopée :

```ts
import { canopyVideo } from "canopui/vite";

export default defineConfig({ plugins: [react(), canopyVideo()] });
```

Les portails qui l'ont déjà n'ont donc rien à faire. Le nom du greffon ne dit plus tout ce qu'il fait : il sert désormais les scènes de canopée **et** les fichiers du worker de MapLibre. Le renommer serait une rupture, donc ce sera pour une version mineure ; en attendant, c'est écrit ici et dans la page Installation.

## [3.0.0] - 2026-09-08

> Lot 0 — dette technique (SCRUM-395) : rebrand `Ch*` → `Canop*`, normalisation de l'API publique et reprise de l'accessibilité. Lot 1 — typographie (SCRUM-402) : crénage optique, graisses étendues, variantes numériques et composant `Text`. Lot 2 — squircles : tous les coins arrondis de la librairie deviennent des superellipses, bordures et ombres reconstruites en conséquence. Version **majeure** : aucun symbole `Ch*` ne subsiste dans l'API publique et **aucun alias de rétrocompatibilité n'est fourni**. L'essentiel des ruptures est automatisable par le codemod (voir « Migration ») ; les points marqués **rupture silencieuse** ne produisent ni erreur de compilation ni avertissement au runtime et doivent être vérifiés à la main.

### Modifié

- **`ProgressBar` — `max` devient inacceptable en barre simple.** **Breaking**, mais **signalé par
  le compilateur** : `CanopProgressBarProps` n'est plus une interface unique, c'est l'union de
  `CanopProgressBarSingleProps` (`value`, `showValue`) et de `CanopProgressBarSegmentedProps`
  (`segments`, `max`), chacune refusant les props de l'autre. Un `<ProgressBar value={x} max={y} />`
  ne compile plus. **Aucun rendu ne change** : la barre simple ne lisait déjà pas `max`, ce
  correctif retire la prop qu'elle acceptait sans rien en faire.

  **C'est la voie honnête, et non celle où la barre simple honorerait `max`.** Honorer `max` aurait
  été cohérent avec la barre segmentée, mais aurait changé le rendu de **tout portail qui passait
  déjà un pourcentage à côté d'un `max`** — sans erreur, sans avertissement, exactement le défaut
  qu'on corrige. Le piège s'est payé sur DéparteMental : `value={acquis} max={TOTAL}` s'affichait
  juste **par coïncidence**, `TOTAL` valant 101, donc à un point d'un pourcentage. Le même appel
  avec un total de 20 aurait affiché 12 % pour douze acquis sur vingt, soit 60 %.

  `value` et `showValue` sont symétriquement refusés en barre segmentée, où ils n'étaient pas lus
  davantage. Les deux formes sont exportées : un portail qui typait une variable en
  `CanopProgressBarProps` peut désigner celle qui l'intéresse.

- **`Lives` — le compte des vies s'accorde vraiment.** **Rupture silencieuse pour les portails qui
  surchargeaient `canop.lives.label`** : la clé nue **disparaît** au profit de `canop.lives.label.one`
  et `canop.lives.label.other`, et la variable interpolée passe de `{value}` à `{count}`. Une
  surcharge restée sur l'ancienne clé n'est plus lue — le libellé par défaut réapparaît, sans rien
  signaler. Le message annonçait « 1 vies restantes sur 10 », et son pendant anglais « 1 lives left
  out of 10 » ; le portail l'avait contourné en imposant un `ariaLabel`, les autres non.

- **`Card` — la surface devient translucide et floute ce qu'il y a derrière, par défaut.**
  **Rupture silencieuse** : aucune signature ne change, aucune prop n'est à poser, et **toutes les
  cartes de la flotte** passent de 100 % à 88 % d'opacité avec un `backdrop-filter: blur(0.75rem)`.
  Sur une page à fond uni la différence est un voile ; sur la canopée animée c'est le rendu voulu.
  Les trois autres surfaces suivent la même règle : `tone`, la variante `stat` et le fond neutre
  sont chacun enveloppés dans le même mélange, donc les tonalités sémantiques gardent leur teinte.

  **L'opacité est mesurée, pas choisie.** Le contraste de 2,40:1 relevé sur la vidéo — corrigé
  quelques lots plus tôt en rendant les cartes opaques — se réinstalle dès qu'on ouvre trop. Le pire
  cas retenu est un fond **uni blanc** sous le thème sombre et **uni noir** sous le thème clair,
  c'est-à-dire une image que la canopée ne produit jamais. À 88 % le texte y tient **8,64:1**
  (primaire) et **4,66:1** (secondaire) en sombre, **14,4:1** et **5,46:1** en clair : le plancher
  est 4,66:1, au-dessus des 4,5:1 du seuil AA. À 85 % le texte secondaire tombait à **4,22:1**, sous
  le seuil. C'est cette marge de 0,16 qui fixe la valeur, et non le goût.

  **Deux garde-fous d'implémentation.** La zone floutée d'un `backdrop-filter` suit la **boîte** et
  son `border-radius`, jamais le `clip-path` : le rayon est donc rendu à la boîte — elle ne peint
  toujours rien — pour que le flou s'arrête où la surface s'arrête, au lieu de baver dans les angles
  du squircle. Et le flou reste sur la **racine** : posé sur le calque `::before`, l'ombre portée de
  la carte lui ferait écran, puisqu'un `filter` sur un ancêtre ouvre une nouvelle racine de fond —
  c'est exactement le piège qui avait fait abandonner le matériau verre. Repli explicite en
  `@supports not`, qui teste la forme **préfixée aussi** : sans ça Safari 17, qui ne connaît que
  `-webkit-backdrop-filter`, retombait en opaque alors qu'il sait flouter

- **`PageContent` — le rembourrage bas en `xs` s'aligne sur celui du bureau** (`tokens.spacing.xl`),
  au lieu de `calc(tokens.spacing["4xl"] + env(safe-area-inset-bottom))`. **Rupture silencieuse** :
  aucune signature ne change, mais tout portail mobile voit son bas de page se resserrer. Ces `6rem`
  compensaient **à la main** la barre de navigation mobile, qui recouvrait alors le contenu ; depuis
  que `NavbarMobileLayout` réserve lui-même cette hauteur, les deux s'additionnaient — **`11rem` et
  deux fois la zone sûre** — creusant un vide en fin de défilement et rognant, en `fillHeight`, une
  zone déjà en `overflow: hidden`. La barre n'est plus l'affaire de `PageContent`.

- **`framer-motion` sort des dépendances de la librairie et passe en dépendance pair (`^13.0.0`),
  non optionnelle.** **Breaking pour tous les portails** : installer `canopui` n'installe plus le
  moteur d'animation, il faut l'ajouter au `package.json` du consommateur. Un portail qui monte en
  3.0 sans le faire voit sa **construction casser** — la librairie l'importe depuis son cœur,
  `Navbar`, `SidePanel` et `Carousel` compris, donc aucun portail n'y échappe.

  **C'était une incohérence, exactement celle corrigée pour `vite` juste avant.** La construction
  l'**externalisait déjà** (`rollupOptions.external`), donc le code publié l'importait sans
  l'embarquer, pendant que le `package.json` le déclarait en `dependencies`, donc à la charge de la
  librairie. Le consommateur recevait ainsi du code important un module dont il n'avait pas la
  charge, et son gestionnaire de paquets était libre d'en installer une **seconde copie** sous la
  librairie : deux moteurs d'animation dans le graphe, donc deux contextes React distincts, et la
  continuité d'un `layoutId` partagé entre la librairie et le portail — celui de
  `SlidingIndicator`, par exemple — ne tient plus, **sans la moindre erreur**.

  **Non optionnelle, contrairement à `maplibre-gl` et à `vite`** : ces deux-là ne servent qu'un
  sous-chemin qu'on peut ne jamais toucher, alors que le moteur d'animation est importé par le
  cœur. Il reste en dépendance de développement de la librairie, qui doit bien la construire et la
  tester.

- **MUI passe de 7 à 9 — `@mui/material` en dépendance pair devient `^9.0.0`.** **Breaking pour les portails**, qui doivent monter avec. Il n'y a pas de MUI 8 : la 7 saute directement à la 9. La rupture qui nous concerne est le retrait des **props système** de `Box`, `Stack`, `Typography`, `Grid`, `Link` et `DialogContentText` : `width`, `gap`, `color`, `display`, `bgcolor` et les autres passent dans `sx`. Le plancher navigateur monte à **Chrome 117, Firefox 121, Safari 17**.

  **Mesuré de bout en bout avant de décider** : 442 erreurs de type sans rien faire, dont le codemod officiel `v9.0.0/system-props` en règle **411**, soit 93 %, en huit secondes sur 584 fichiers. Les 31 restantes se rangent en cinq motifs que le codemod ne sait pas voir, tous corrigés ici : props système sur des composants enveloppés par Framer Motion ; `undefined` dans un tableau `sx`, que la 9 refuse désormais et que le codemod produit lui-même ; deux `slotProps` posés sur la même balise ; `inputProps` de `Checkbox` et `MenuListProps` de `Menu` passés en `slotProps` ; deux marges restées en place.

  **Deux défauts qu'aucune erreur de type ne signale.** D'abord trois **spreads conditionnels** de props système — `{...(fillHeight ? { display: "flex" } : {})}` — que le codemod ne peut pas lire, donc laissés tels quels : React les passait alors au DOM. Un seul test sur 1720 l'a vu. Ensuite, et c'est le piège inverse, le « doublon » que le codemod produit parfois **n'en est pas un** : quand un spread `...squircleSurface(...)` s'intercale entre les deux copies, la seconde est celle qui compte, puisque le spread repose `position: relative`. Retirer la copie d'après le spread en croyant nettoyer a décroché le pouce de `Toggle` et de `ThemeToggle` de leur piste — **invisible en test, vu à l'œil dans la vitrine**.

  **Un fond réapparaît, et c'est une correction.** Les boutons `tonal` posés dans une carte de démonstration n'avaient **aucun fond** sous MUI 7 : leur calque sortait d'une largeur nulle, mesuré à 13 occurrences sur la seule page `Button`, alors que la couleur était bien calculée. Sous MUI 9 il n'y en a plus aucune. C'est la même famille de défaut que la variante `secondary` de cette version : un fond défini que rien ne peignait


- **Dépendances remises à niveau, et deux vulnérabilités hautes réglées au passage** : `browserslist` et `fast-uri`, toutes deux sous des dépendances de développement, disparaissent d'un simple `npm update` — l'audit passe de deux signalements hauts à zéro. Montent aussi dans leur majeure courante React et React DOM en 19.2.8, `maplibre-gl` en 6.7, Vitest en 4.1.11, `typescript-eslint` en 8.69, Prettier en 3.9.6 et les `@types`. Trois majeures d'outillage sans effet sur le code livré sont franchies : `globals` 17, `eslint-plugin-react-refresh` 0.5 et `@testing-library/jest-dom` 7 — cette dernière exige **Node 22 au minimum**, ce que le poste et la CI dépassent déjà. `@types/node` reste volontairement en 24, aligné sur le Node réellement utilisé : la 26 décrit une version de Node qui n'est pas celle qui exécute la CI
- **`framer-motion` passe en 13** : une seule rupture, l'abandon de la dépendance optionnelle `@emotion/is-prop-valid` au profit d'un `<MotionConfig isValidProp={…}>` explicite. La librairie ne s'appuyait pas dessus — elle ne passe aux composants animés que des propriétés du DOM — donc rien à changer. Vérifié au navigateur en plus des tests : les pages d'indicateur glissant, de panneau latéral, de carrousel, de navigation, de visionneuse et l'accueil sont parcourues sans une erreur de console
- **Barre de défilement — dégradé du pouce retourné** : le pouce descend désormais du **foncé vers le clair**, `primary.dark` en haut, là où il partait du clair. L'extrémité basse n'est pas `primary.light` pur — trop clair sur un pouce de 12 px, il se lisait comme un point blanc — mais un mélange qui tire vers `main` (40 % de `light`). Les deux variables gardent leur nom de position (`--canop-scrollbar-thumb-top`, `--canop-scrollbar-thumb-bottom`), donc un portail qui les surcharge n'a rien à changer : seules les teintes par défaut sont échangées. L'arrêt médian passe de 55 % à 45 %, ce qui laisse le coude du dégradé à la même distance de l'extrémité claire qu'avant le retournement. Les deux états suivent la même logique qu'avant — le survol éclaircit, l'appui assombrit — mais par l'autre bout : c'est l'extrémité basse qui gagne en clarté au survol. **Le retournement se décide à deux endroits, et le premier essai n'a rien changé à l'écran** : les valeurs de repli de `scrollbarSx` ne servent qu'en l'absence des variables, or le thème les pose toujours — c'est donc `createCanopTheme` qui décidait, et lui seul. Même piège que les variables `--canop-button-secondary-*`. **Et le sens n'était testé nulle part** : deux `toContain` vérifiaient que le clair et le foncé étaient présents sans regarder leur ordre, et chaque test ne lisait que son propre endroit, si bien que la suite restait verte pendant que les deux se contredisaient. Un test lit désormais les deux à la fois et refuse qu'ils divergent

- **Palette sombre — nouveau `primary`** : `main` `#62a886`, `light` `#8bcfa9`, `dark` `#3e7d5e`, en remplacement du vert d'eau clair `#9de1c4` **inchangé depuis la 1.0**. Il passe le seuil de 4,5:1 du **petit texte** sur toutes les surfaces sombres sauf la plus élevée — 6,85:1 sur `background.default`, 6,43 sur `surface.sunken`, 5,74 sur `surface.base`, 5,07 sur `background.paper`, et 4,36 sur `surface.overlay` — et le seuil de 3:1 des **éléments non textuels** partout. Sur un fond `overlay`, préférer `light`, qui y vaut 6,77:1. `contrastText` et `text.onPrimary` restent foncés : sur ce vert le foncé vaut 6,73:1, quand le blanc n'y vaudrait que 2,81:1.

  **Trois essais ont été écartés avant celui-là.** Le premier reprenait tel quel le `primary` du thème clair (`#1e6244`) : le même vert dans les deux thèmes est séduisant, mais un vert foncé sur un fond sombre ne tient que comme **aplat** — il tombait entre 1,68:1 et 2,65:1 partout où `primary.main` sert de texte ou de trait fin (valeur du `Slider`, barres du `Carousel`, pouce de la barre de défilement, anneau de focus, tonalités `primary` de `Text` et `Heading`), et les glyphes de points d'intérêt de la carte disparaissaient sur leur pastille. Les deux suivants (`#7db59d` puis `#4a8f70`) tenaient comme objets graphiques mais l'un partait trop vers le pastel, l'autre restait sous les 4,5:1 du petit texte sur les surfaces hautes (3,71:1 sur le papier, 3,18:1 sur `surface.overlay`)
- `ProgressBar` : **portion remplie en dégradé, tête arrondie, et un reflet qui balaie pendant l'attente**. Le conteneur était déjà découpé en pilule, mais ce découpage n'arrondit que **ses** angles : la tête de la portion remplie restait coupée net à toute valeur intermédiaire. Elle reçoit son propre découpage. Au repos elle porte un **dégradé simple** `light → main → dark`, le même que le `Slider` et le `Spinner`, avec son extrémité claire éclaircie de 45 % vers le blanc pour creuser l'écart. Quand le défilement est actif, un **unique reflet blanc** le traverse en second calque, de gauche à droite — le sens d'un avancement. **Deux essais ont été écartés avant celui-là** : un motif palindrome répété faisait apparaître **plusieurs points clairs à la fois**, ce qui se lit comme un défaut d'affichage ; et le décalage partait **à rebours**, parce qu'un pourcentage de `background-position` se calcule sur `largeur de l'élément − largeur du motif` — négative quand le motif est le plus large. Le reflet n'est pas répété et sort entièrement du cadre à chaque extrémité, donc la boucle ne montre aucun saut. Le défilement suit la prop `animated` et **s'arrête en mouvement réduit** — ici c'est la **largeur** qui porte l'information, le reflet n'est que du décor
- `Carousel` — barres **affinées à 5 px** et **pleinement arrondies** : leur rayon vaut la moitié de leur épaisseur, ce qui est le maximum qu'une barre puisse porter. La zone cliquable ne bouge pas, elle est portée par le rembourrage du bouton et non par la barre
- `Carousel` — **barres uniformes avec remplissage, flèches hors de la carte**. Les barres ont toutes la même longueur : c'est la couleur qui désigne la carte courante, là où la barre active s'allongeait — ce qui déplaçait ses voisines à chaque changement et faisait sautiller la rangée. Quand le défilement est automatique, la barre active **se remplit en cadence**, sur la durée exacte de la carte : le remplissage mesure l'attente au lieu de décorer. Hors défilement automatique elle est simplement pleine. Et les flèches sont **posées à côté de la carte** au lieu d'être superposées dessus : la mise en page leur réserve la place, ce qui leur permet d'être plus petites (2 rem) sans devenir difficiles à viser, et elles ne recouvrent plus le contenu
- `Carousel` — **refonte complète : une carte à la fois** : **Breaking**. Le composant était une piste à défilement par ancrage, montrant plusieurs cartes à la fois ; c'est désormais un carrousel indexé qui n'en montre qu'une. Les props `itemWidth` et `showIndicators` **disparaissent** — la première n'a plus d'objet, la seconde est remplacée par `navigation`. Le compilateur signale les deux. Nouvelles props : `navigation` (`"arrows"` par défaut, `"bars"`), `orientation` (`"horizontal"` par défaut, `"vertical"`), `transition` (`"slide"` par défaut, `"fade"`), `autoPlay` et `interval`. **Point d'implémentation** : les cartes sont empilées dans une **même cellule de grille** et décalées de `(index - actif) × 100 %` sur l'axe. C'est ce qui évite toute mesure de la fenêtre et toute hauteur imposée : la fenêtre prend la taille de la plus grande carte, et la même mécanique tient à l'horizontale comme à la verticale. À la verticale, les flèches passent en haut et en bas, et les barres longent le bord droit
- `useCarousel` : **Breaking** — le hook ne renvoie plus `viewportRef`, `trackRef`, `overflowing`, `canScrollPrevious`, `canScrollNext`, `scrollPrevious`, `scrollNext`, `itemCount` ni `scrollToIndex`, qui décrivaient un défilement. Il prend un objet d'options (`count`, `orientation`, `autoPlay`, `interval`) et renvoie `activeIndex`, `canGoPrevious`, `canGoNext`, `goPrevious`, `goNext`, `goTo`, `playing`, `pause`, `resume` et `swipeHandlers`
- `Button` — **les variantes sans fond écrivent avec la couleur de texte du thème** : `text` et `ghost` passent de `primary.main` à `text.primary`, donc foncé sur thème clair et clair sur thème sombre. Sans fond, le texte est le seul support du bouton : il doit suivre le texte courant plutôt que porter une teinte de marque. La bordure de `ghost` reste en `primary`, ce qui lui laisse son rappel de marque
- `Slider` : la pastille passe en **pilule couchée**, plus large que haute, et plus courte que la pilule verticale essayée d'abord. **Correctif dans la même foulée** : le halo de survol et d'appui sortait en **rectangle** autour d'une pilule. `squircleSurface` neutralise le rayon de la boîte — la forme venant du découpage — or un halo est un `box-shadow`, qui suit le rayon et non le découpage. Le rayon est donc rétabli sur la boîte, au seul service de l'ombre
- `Spinner` : le trait reçoit des **extrémités arrondies** et un **dégradé** au lieu d'une couleur unie. Un trait SVG ne peut recevoir un dégradé que **par référence** : la définition vit donc dans un SVG de taille nulle posé à côté de la roue, et son identifiant est **propre à chaque instance** — deux spinners partageant un identifiant partageraient un dégradé, et le second effacerait le premier. Les trois teintes sont `light`, `main` et `dark` de la couleur demandée : ce sont exactement celles du pouce de la barre de défilement, pour que la librairie n'ait **qu'une seule façon de faire un dégradé de palette**. Le dégradé tourne avec la roue, donc les teintes restent fixes par rapport à l'arc
- `Spinner` : l'épaisseur du trait **varie à l'inverse du diamètre** (4,5 en `small`, 3,6 en `medium`, 3 en `large`). Une épaisseur unique paraît grossière à 1,25 rem et famélique à 4 rem. Le rendu de la taille `medium`, la plus utilisée, est le plus proche de l'ancien
- `Slider` : **piste en dégradé, bouts arrondis, pastille en pilule squircle**. La piste active porte les trois teintes `light`, `main` et `dark` de sa couleur — les mêmes que le pouce de la barre de défilement et le `Spinner`. **La rampe est étirée pour couvrir tout le rail** et non la seule portion remplie : sans ça elle se comprimerait avec la valeur, et la teinte sous la pastille changerait selon la position au lieu de la désigner. Le rail et la piste reçoivent des **bouts arrondis en pilule**, visibles surtout quand le curseur n'est pas modifiable — c'est là que la coupe franche se remarquait, la pastille ne la recouvrant plus. Et la **pastille devient une pilule verticale** au lieu d'un disque : étroite dans le sens du glissement, elle désigne une position au pixel ; haute dans l'autre sens, elle s'attrape. Un disque fait l'inverse — large là où la précision compte, bas là où la prise compte. Le squircle y devient enfin visible : sur un disque de 20 px il était indiscernable, l'écart à un cercle ne valant que 12 % du rayon
- `Slider` : la **zone saisissable atteint 2,75 rem au doigt** — les 44 px de référence — contre 1,75 à 2 rem auparavant. Elle reste compacte à la souris, où cette hauteur ne servirait qu'à gonfler la mise en page : la bascule se fait sur `@media (pointer: coarse)`, comme le font déjà les boutons de zoom de `Map`. **La zone saisissable est le rail plus son rembourrage vertical, pas le diamètre de la pastille** — c'est ce qui rendait le réglage difficile au pouce
- `PageScaffold` — **le fond par défaut devient la canopée animée** : **Breaking** et **rupture silencieuse** — la zone de contenu n'est plus habillée par les formes organiques de `ShapeBackground` mais par une des deux scènes vidéo de `CanopyBackground`, celle qui correspond au thème actif. Aucune signature ne change, donc **rien n'est signalé à la compilation** : un portail qui monte `PageScaffold` verra son fond changer à la montée de version, et **téléchargera une vidéo de 5 à 11 Mo** là où il ne chargeait rien. La nouvelle prop `background` (`"canopy"` par défaut, `"shapes"` pour l'ancien fond) rétablit le comportement précédent en un mot. `ShapeBackground` **n'est ni déprécié ni retiré** : il reste exporté, documenté, et sert toujours `Layout` et `EmptyState`
- `SurfaceVeil` passe de `ShapeBackground/` à `_shared/` : deux composants le posent désormais. Aucune incidence publique, il n'était pas exporté
- `Map` — **socle vectoriel MapLibre** : **Breaking** — le sous-chemin `canopui/map` ne dépend plus de `leaflet` **ni** de `react-leaflet`, mais de **`maplibre-gl` seul**, toujours en peer dependency optionnelle. Deux paquets deviennent un, et l'import `leaflet/dist/leaflet.css` devient `maplibre-gl/dist/maplibre-gl.css`. **L'API du composant ne bouge pas** — `center`, `zoom`, `markers`, `onMapClick`, `height` se comportent à l'identique, bulles React comprises : la rupture est dans les dépendances et la feuille de style, pas dans le code d'appel. Le rendu passe en **WebGL** ; un poste sans accélération graphique ne verra plus la carte, là où Leaflet dessinait en DOM. Le remplacement du binding `react-leaflet` par le nôtre supprime au passage une dépendance dont la librairie n'utilisait que quatre composants
- `Map` — la prop `zoom` ne prend plus effet **qu'à l'initialisation puis à chaque changement**, via une transition animée (`easeTo`) plutôt qu'un saut sec, et respecte `prefers-reduced-motion`
- `Button` — variante `secondary` : le texte passe en **blanc sur thème clair** et conserve le `contrastText` de la palette sur thème sombre. Le fond suit pour rester lisible — `secondary.dark` en clair, `secondary.main` en sombre — ce qui porte le contraste à 4,95:1 et 8,83:1. Le blanc sur `secondary.main` clair ne tenait que 2,98:1, sous le seuil AA
- **Champs mot de passe — boutons natifs d'Edge** : `::-ms-reveal` et `::-ms-clear` sont neutralisés au niveau du thème. Edge greffe son propre œil de révélation sur tout `<input type="password">`, en doublon de celui d'`InputPassword`, avec un comportement distinct sur le même champ. La règle passant par `MuiCssBaseline`, elle couvre aussi les champs posés hors composant par un portail
- **Forme des composants — bordures et ombres reconstruites** : **Rupture silencieuse** — le passage au squircle change la façon dont un coin est peint, et pas seulement sa courbe. `clip-path` découpe **tout** le rendu d'un élément, `border` et `box-shadow` compris, et il est appliqué **après** `filter` : une bordure CSS y perd ses angles, une ombre portée y disparaît entièrement. Les composants concernés sont donc bâtis sur `squircleSurface`, qui peint la bordure et le fond sur deux calques découpés placés derrière le contenu, l'élément hôte n'étant jamais découpé — ce qui préserve au passage les anneaux de focus, tracés hors de la boîte. Un portail qui surchargeait un `borderRadius` ou un `border` sur un composant de la librairie n'obtiendra plus l'effet attendu : le rayon est neutralisé (`borderRadius: 0`) et la forme vient du découpage
- **Échelle des rayons élargie** : `tokens.radius` passe de `0.5rem`/`1rem`/`1.375rem`/`1.75rem`/`2.25rem`/`2.875rem` sur `xs`→`2xl`. Un squircle ne s'écarte d'un cercle que d'environ 12 % de son rayon : en dessous d'une vingtaine de pixels la forme est indiscernable, l'échelle a donc été remontée pour que le travail soit visible
- **Squircles automatiques par le thème** : les composants MUI qui dessinent eux-mêmes leurs coins — `Chip`, `Tooltip`, `Alert`, `Dialog`, `OutlinedInput`, `IconButton`, `Popover`, `Badge` — sont traités par `styleOverrides` et non composant par composant. Tout nouveau composant bâti sur l'un d'eux hérite de la forme sans que personne ait à y penser
- `OutlinedInput` : le `<fieldset>` et son `<legend>` ne dessinent plus rien (la bordure vient des calques). L'encoche du label flottant est reconstituée par un bandeau opaque en deux couleurs, réglable par la variable `--canop-input-notch`, que `Paper` et `Dialog` renseignent automatiquement
- **Tokens de titres — forme unifiée** : **Breaking** — `tokens.typography.heading.h1` à `h5` ne sont plus des chaînes de taille mais des objets de style complets (`fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`), à l'image de `tokens.typography.display` et `tokens.typography.app` qui suivaient déjà cette forme. Un `fontSize: tokens.typography.heading.h3` devient `fontSize: tokens.typography.heading.h3.fontSize`, ou mieux `sx={tokens.typography.heading.h3}` pour hériter aussi de la graisse, de l'interligne et du crénage. La rupture n'est **pas** silencieuse côté TypeScript : le compilateur refuse l'objet là où une taille était attendue. Le thème MUI (`theme.typography.h1`…`h5`) est inchangé et sert désormais le crénage en plus de la taille
- **Rebrand — symboles publics** : **Breaking** — l'intégralité des exports préfixés `Ch` passe en `Canop`. Providers et hooks (`ChThemeProvider` → `CanopThemeProvider`, `useChTheme` → `useCanopTheme`, `ChI18nProvider` → `CanopI18nProvider`), thème (`chTheme` → `canopTheme`, `createChTheme` → `createCanopTheme`, `ChThemeMode` → `CanopThemeMode`, `ChThemePreference` → `CanopThemePreference`), et **tous** les types de props, d'options et d'unions des composants (`ChButtonProps` → `CanopButtonProps`, `ChIconName` → `CanopIconName`, `ChStatusTone` → `CanopStatusTone`, `ChColumn` → `CanopColumn`…). Les noms de composants (`Button`, `DataTable`, `Navbar`…) et les hooks non préfixés (`useTranslation`, `useForm`, `useToolbar`…) sont **inchangés** : seuls les identifiants portant le préfixe `Ch` bougent
- **Rebrand — constante de version** : **Breaking** — `CH_UI_VERSION` → `CANOP_VERSION`
- **Rebrand — CSS variables** : **Breaking** — le préfixe passe de `--ch-*` à `--canop-*` (`cssVarPrefix: "canop"`). Concerne les variables de palette générées par MUI (`--canop-palette-*`) comme celles posées par le thème (`--canop-shadow-*`, `--canop-motion-duration-*`, `--canop-motion-ease-*`, `--canop-radius-*`, `--canop-spacing-*`). **Rupture silencieuse** : un `var(--ch-palette-primary-main)` resté dans le CSS d'un portail ne lève rien, il résout simplement dans le vide (ou sur la valeur de repli si elle existe)
- **Rebrand — clés i18n** : **Breaking** — le namespace des messages de la librairie passe de `ch.*` à `canop.*` (`ch.navbar.legalInfo` → `canop.navbar.legalInfo`, `ch.input.showPassword` → `canop.input.showPassword`, `ch.validation.*` → `canop.validation.*`…). Les portails qui **surchargent** un message de la lib par fusion doivent renommer leurs clés, sans quoi la surcharge est ignorée et le libellé par défaut réapparaît — **rupture silencieuse**
- **Rebrand — identifiants DOM et `layoutId`** : **Breaking** et **rupture silencieuse** — `ConfirmDialog` titre en `id="canop-confirm-dialog-title"` (auparavant `ch-confirm-dialog-title`) et `SlidingIndicator` `layoutId` par défaut `"canop-sliding-indicator"` (auparavant `"ch-sliding-indicator"`). Un sélecteur CSS `#ch-confirm-dialog-title` cesse de matcher, et un `layoutId="ch-sliding-indicator"` passé explicitement ne partage plus le groupe d'animation de la lib : le style ou la continuité de l'indicateur est perdu **sans aucune erreur**
- **Rebrand — clés `localStorage`** : **Breaking** — `ch-theme-mode` → `canop-theme-mode` et `ch-locale` → `canop-locale`, **sans aucun repli sur les anciennes clés**. Les préférences de thème et de langue déjà enregistrées dans les navigateurs **ne sont pas migrées** : au premier chargement de la 3.0, les utilisateurs repartent du `defaultMode` du provider et de la locale par défaut. Un portail qui écrivait lui-même ces clés doit adopter les nouvelles (ou fixer les siennes via `storageKey`)
- **Nom accessible unifié** : **Breaking** — le nom accessible s'écrit désormais `ariaLabel` (camelCase) et non plus `aria-label`, sur **12 composants**. La rupture n'est **pas** silencieuse : `aria-label` ne figurant plus dans les props typées, le compilateur signale chaque occurrence à corriger. `Icon`, `Dropzone`, `UploadDropZone` et `Slider` **conservent** leurs props existantes (`title` / `label`) et reçoivent `ariaLabel` en **complément**, pour un nom accessible distinct du texte affiché
- `DataTable` : **Breaking** — la prop `animateRows` est renommée `animated`, alignée sur la convention `animated` déjà en place sur `ProgressBar`
- `FileCard` : **Breaking** — la prop `onSelectedChange` est renommée `onSelectionChange`, alignée sur `DataTable`
- `Legend` : **Breaking** — la propriété `status` des entrées est renommée `tone` et le type `ChLegendStatus` devient `CanopLegendTone`, pour rejoindre le vocabulaire `tone` déjà utilisé par `StatusChip`
- **Types `upload`, `http` et `auth`** : **Breaking** — une vingtaine de types publics qui échappaient encore au préfixe reçoivent `Canop` (`CanopUploaderOptions`, `CanopUploader`, `CanopUploadTransport`, `CanopUploadSource`, `CanopUploadStrategy`, `CanopUploadPhase`, `CanopUploadSessionState`, `CanopUploadSessionResponse`, `CanopOpenUploadBody`, `CanopPutChunkResponse`, `CanopUploadNode`, `CanopUploadBytes`, `CanopChunkRange`, `CanopFileUploaderProps`, `CanopUploadDropZoneProps`, `CanopApiError`, `CanopApiClient`, `CanopApiClientOptions`, `CanopLoginUrlOptions`, `CanopCguUrlOptions`, `CanopRouteGuardProps`, `CanopRouteGuardState`, `CanopCreateRouteGuardConfig`, `CanopCurrentUserProviderProps`…). Toute l'API publique suit désormais la même règle de nommage
- **Boutons d'action — `size` et `iconSize`** : **Breaking** — sur les **cinq** boutons d'action, `size` passe de `number` à `string` (dernier pixel de l'API publique) et une prop `iconSize` explicite remplace la dérivation automatique de la taille d'icône :

  | Composant | `size` avant | `size` après | `iconSize` |
  |---|---|---|---|
  | `IconActionButton` | `number` (défaut `40`) | `string` (défaut `"2.5rem"`) | `CanopIconSize` (défaut `"md"`) |
  | `AddButton` | `number` (défaut `40`) | `string` (défaut `"2.5rem"`) | `CanopIconSize` (défaut `"md"`) |
  | `EditButton` | `number` (défaut `40`) | `string` (défaut `"2.5rem"`) | `CanopIconSize` (défaut `"md"`) |
  | `ApproveButton` | `number` (défaut `40`) | `string` (défaut `"2.5rem"`) | `CanopIconSize` (défaut `"md"`) |
  | `DeleteButton` | `number` (défaut `40`) | `string` (défaut `"2.5rem"`) | `CanopIconSize` (défaut `"md"`) |

  Conversion des valeurs usuelles :

  | Avant | Après |
  |---|---|
  | `32` | `"2rem"` |
  | `40` | `"2.5rem"` |
  | `48` | `"3rem"` |
  | `52` | `"3.25rem"` |
  | `64` | `"4rem"` |

  **Point de vigilance** — le passage de `size` en `string` est signalé par le compilateur, mais la **suppression de la dérivation** est le **seul changement de rendu possible**. Un appel avec `size >= 48` obtenait une icône `lg`, un appel avec `size < 32` une icône `sm` : il faut désormais passer `iconSize` explicitement pour retrouver ces tailles. La tranche `[32, 48[`, **dont le défaut**, est inchangée

### Ajouté

- **`Heading` — `size` accepte une taille par point de rupture** : `size={{ xs: 5, md: 3 }}`, dans
  la forme que MUI emploie déjà partout ailleurs dans la librairie (`direction={{ xs, md }}`,
  `spacing={{ xs, md }}`). **Additif et rétrocompatible** : un `Heading` sans la nouvelle forme rend
  exactement l'objet de style d'avant, la branche responsive n'étant même pas empruntée. Nouveau
  type public `CanopResponsiveHeadingSize`.

  **Les cinq échelles sont des rem fixes, et rien ne permettait de les faire varier.** Un
  `level={2}` sans `size` vaut `3,158rem` : en Titan One, le seul mot « Entraînement » y fait une
  vingtaine de rem et déborde de n'importe quelle carte sur mobile. Deux corrections successives du
  portail DéparteMental s'y sont passées dans la même journée. La preuve du manque est **dans la
  librairie elle-même** : `PageContent` câble `useBreakpointDown` en interne pour son propre titre
  (`size={isCompact ? 5 : 4}`), un calcul que chaque appelant devait refaire à la main — donc un
  hook, un état de média et un rendu de plus dans chaque composant qui pose un titre.

  **Les paliers non renseignés retombent sur `level`, pas sur rien.** `size={{ md: 2 }}` rend une
  taille de titre sous `md` — celle du niveau — au lieu de laisser le titre à la taille du corps de
  texte, ce qu'aurait donné un objet de `fontSize` sans entrée `xs`. Seuls la taille et le crénage
  varient par point de rupture ; la famille, la graisse et l'interligne sont identiques sur les cinq
  échelles et restent posés une fois.

- **`SvgMap` — propriété `ariaLabel` sur une région** : le nom accessible d'une région, **jamais
  affiché**, distinct de `name` qui est le texte du `<title>` montré au survol. Additif, sans
  défaut : aucune carte existante ne change ni de rendu ni de nom accessible.

  **Le nom accessible d'une région sélectionnable retombait sur son `id`**, et c'est ce repli qui
  vend la réponse. Un jeu de désignation retire volontairement `name` pour qu'aucune infobulle
  n'annonce le département cherché au survol ; le lecteur d'écran annonçait alors l'`id`,
  c'est-à-dire le numéro exact qu'on demande de trouver. Il n'existait aucun moyen d'étiqueter une
  région sans l'afficher : les deux besoins passaient par la même propriété.

  **L'`id` reste le dernier recours, et c'est délibéré** — l'ordre est `ariaLabel`, puis `name`,
  puis l'`id`. Le retirer laisserait des `role="button"` **sans aucun nom accessible**, ce qui est
  une faute plus grave que d'en dire trop. La règle est documentée en toutes lettres sur la
  propriété et dans la vitrine : **dès que l'`id` porte l'information à deviner, poser
  `ariaLabel`**.

- **Module i18n — un mécanisme de pluriel, en une douzaine de lignes.** `t("clé", { count })`
  choisit la variante `clé.one`, `clé.other` (ou `.zero`, `.two`, `.few`, `.many` selon la langue)
  avec **`Intl.PluralRules`**, pour la langue active. `createTranslate` prend la langue en second
  argument, `"fr"` par défaut — signature additive, et le provider la renseigne désormais.

  **Opt-in des deux côtés, donc aucun message existant ne bouge** : sans `count` numérique dans les
  variables, ou sans variante suffixée dans la table, la clé nue est servie telle quelle.
  `canop.selectionBar.selected`, qui interpole déjà un `{count}` sans avoir de variantes, rend
  exactement la même chaîne qu'avant.

  **`Intl.PluralRules` et non `count > 1`.** Le français range **0 au singulier** (« 0 vie
  restante »), l'anglais **au pluriel** (« 0 lives left ») : une comparaison écrite à la main se
  trompe dans un cas sur deux, et sur une langue qu'on lit tous les jours. C'est la raison pour
  laquelle le mécanisme vit dans la librairie plutôt que d'être recopié dans chaque portail — le
  portail DéparteMental l'avait déjà réécrit chez lui. `interpolate` reste ce qu'il était, une
  substitution brute : le pluriel se décide avant lui, au choix de la clé.

- **`CardGrid` — prop `columns`**, un nombre, ou un nombre par point de rupture
  (`{ sm: 2, lg: 4 }`), sans défaut : sans elle la grille reste en `auto-fit` et **aucun rendu
  existant ne bouge d'un pixel**. Le nombre de colonnes d'une grille `auto-fit` n'est **connu de
  personne** — ni du composant, qui n'a que `minItemWidth`, ni de l'appelant, qui ne peut que le
  déduire d'un calcul largeur ÷ `minItemWidth`. Ce calcul est faux dès qu'une gouttière, un panneau
  latéral ou une barre de défilement change la largeur du conteneur, et il redevient faux à chaque
  changement de mise en page. D'où la **rangée orpheline** : quatre tuiles rendues en `3 + 1`, qu'un
  portail ferme en dérivant `minItemWidth` du nombre de tuiles et en recalant les paliers à la main
  sur 1024, 1280, 1392, 1440 et 1920 — cinq nombres magiques pour dire « deux par deux ».

  **Les points de rupture omis héritent du palier inférieur, et `xs` retombe sur la grille
  automatique.** `columns={{ md: 4 }}` se lit donc « autant de colonnes que la largeur le permet en
  dessous de `md`, quatre au-delà » : la prop n'oblige pas à décrire les quatre paliers pour n'en
  contraindre qu'un, et le mobile garde le comportement qu'il avait.

  **`minmax(0, 1fr)` et non `1fr`.** La base d'un `1fr` nu est `auto`, donc la piste prend son
  `min-content` pour plancher : un libellé long élargit sa colonne, et les colonnes cessent d'être
  égales — précisément ce qu'on vient de demander. Le plancher explicite à `0` retire ce droit de
  veto au contenu

- **`Legend` — entrées à couleur libre** : une entrée est désormais **soit** `{ tone, label }`,
  **soit** `{ color, label }`, où `color` est un jeton du thème (`"background.paper"`,
  `"primary.light"`). L'ancienne forme est inchangée et reste seule dans les quatre tonalités, donc
  **aucune légende existante ne bouge**. Les types `CanopLegendToneEntry` et `CanopLegendColorEntry`
  sont exportés à côté de `CanopLegendEntry`, qui devient leur union.

  **Une légende n'explique un code couleur que si sa pastille porte la couleur réellement
  employée.** Les quatre tonalités décrivent des **états** — succès, alerte, erreur — et `neutral`
  est câblé sur `text.secondary`, une couleur de **texte**. Aucune ne décrit une **surface** : une
  carte au repos, peinte en `background.paper`, n'avait donc aucune pastille juste, et le seul
  recours honnête était de **retirer l'entrée de la légende** plutôt que d'afficher une couleur
  fausse — ce qu'un jeu a fait

- **`Stack` — props `sticky` (`"top" | "bottom"`) et `stickyOffset`** (échelle d'espacement,
  `"none"` par défaut), toutes deux sans effet tant qu'elles ne sont pas posées : **aucun `Stack`
  existant ne change**. Épingler un bloc — un formulaire en haut de sa colonne, une barre d'actions
  en bas — était jusqu'ici **hors d'atteinte sans `sx`**, et un portail qui tient à zéro `sx` n'avait
  que la structure pour s'en sortir.

  **Sur `Stack` plutôt que dans un composant `Sticky`.** Le collage est une affaire de disposition,
  et `Stack` est la primitive de disposition : un composant dédié n'aurait porté qu'une seule
  propriété CSS, se serait de toute façon écrit `<Sticky><Stack>…</Stack></Sticky>` — un nœud DOM
  de plus pour rien — et aurait ajouté un symbole à l'API publique là où deux props n'en ajoutent
  aucun. C'est le même raisonnement que `weight` quelques entrées plus haut.

  **La zone de référence est `PageContent`**, qui porte l'`overflowY` : c'est relativement à elle
  qu'un `position: sticky` a un sens. Dans un `PageContent` en `fillHeight`, qui est en
  `overflow: hidden`, rien ne défile donc rien ne colle. Et `sticky` ne se combine ni avec `fill` ni
  avec `weight` : ceux-ci posent `flex: 1 1 0%`, le bloc occupe toute la hauteur de son parent, et il
  ne reste **aucune course à parcourir**.

  **Le bloc collé est élevé d'un cran.** Sans ça, tout frère qui ouvre son propre contexte
  d'empilement lui passe **par-dessus** au lieu de glisser dessous — et c'est le cas de **toute
  `Card`**, depuis qu'elle porte un `backdrop-filter`. Le collage se lirait alors comme un défaut
  d'affichage

- **`Countdown` — prop `format`** (`"auto"` par défaut, donc **aucun chrono existant ne change**) :
  `"clock"` impose `1:00`, `"seconds"` impose `60`. La règle du mode `auto` est conservée telle
  quelle — le format se décide sur la **durée totale**, jamais sur le temps restant, sans quoi un
  chrono de deux minutes passerait de `1:00` à `59` en cours de route, un changement de forme qui se
  lit comme un défaut d'affichage plutôt que comme une seconde de moins.

  **Mais un seuil est un bord, et une durée posée pile dessus tombe du mauvais côté.** La bascule
  est à `60_000` ms en `>=`, donc un quiz d'exactement une minute est **horloge** : il affiche
  `1:00`, `0:45`, `0:09` là où son propre écran de règles annonce « 60 secondes ». Le préfixe `0:`
  n'y porte **jamais aucune information**, puisque ce chrono ne repassera pas au-dessus de la
  minute. Aucune valeur de durée ne corrige ça sans mentir sur le temps de jeu : il fallait pouvoir
  dire le format

- **`useTransientState` — option `onSettle`**, et **`Input` — prop `inputRef`**. Deux fins de
  plomberie, toutes deux facultatives et sans effet si on ne les pose pas.

  `onSettle` est appelé quand la valeur **est revenue d'elle-même** au repos. Le hook savait poser
  une valeur qui s'efface, mais pas dire *quand* : un appelant qui doit enchaîner — passer à la
  question suivante une fois l'éclair de correction fini — n'avait d'autre choix que de reposer un
  `setTimeout` de la même durée à côté, exactement la plomberie que ce hook existe pour supprimer.
  **Deux minuteries pour un seul moment**, qui divergent dès que la durée est donnée à l'appel — ce
  que `show(value, duration)` autorise précisément. Le rappel est lu à l'échéance via une référence
  et non capturé à la pose, donc **`show` garde son identité** et rien ne se réveille en boucle.
  `clear()` ne le déclenche **pas** : ce retour-là est demandé, l'appelant en est déjà l'auteur.

  `inputRef` donne accès au champ natif. `autoFocus` ne joue qu'au **montage** : reprendre la main
  sur un champ déjà présent obligeait à poser une `key` changeante, donc à **détruire et
  reconstruire** le champ. Le focus revient, mais avec lui l'animation d'entrée du libellé, la perte
  de l'état de validation locale et une transition qui n'avait aucune raison d'être rejouée. La prop
  descend aussi dans `InputText`, `InputEmail` et `InputPassword`, qui répandent déjà leurs props

- **`SvgMap` — prop `maxHeight`**, valeur CSS libre, sans défaut : aucune carte existante ne change
  de rendu. Une carte n'avait jusqu'ici **aucune borne en hauteur** — sa hauteur suit strictement le
  rapport de son `viewBox`, donc « plus large » y signifie « plus haut », et `maxWidth` seule ne sait
  pas dire « pas plus haut que ça ». Le manque se mesure : sur un bureau de 1280 × 800, la hauteur
  utile sous la barre de navigation et l'en-tête de page tourne autour de **480 px**, et une vue
  quasi carrée bornée à `30rem` de large fait déjà **458 px de haut**. Elle est donc **plafonnée par
  la hauteur avant de l'être par la largeur**, et l'élargir ne donne rien.

  **La hauteur est traduite en largeur** — `hauteur × rapport du viewBox` — et non posée en
  `max-height`. Posée telle quelle elle ne rétrécirait rien : la carte tirant sa hauteur de sa
  largeur, le dessin déborderait du cadre au lieu d'être contraint, et le cadre resterait grand
  ouvert autour de lui — donc les commandes de zoom, ancrées à son coin, s'éloigneraient du dessin.
  Traduite, elle borne réellement la carte, et le `marginInline: auto` que `maxWidth` posait déjà
  centre les deux : **rien de symétrique n'est à poser sur l'axe vertical**. Les deux bornes se
  combinent en `min()`, la plus serrée l'emporte, et un `viewBox` illisible fait simplement retomber
  sur `maxWidth`. Le seul contournement possible côté portail était un `maxWidth="min(38rem, 56vh)"`
  — des `vh` glissés dans une prop de **largeur** pour piloter une **hauteur**.

- **`Stack` — prop `weight`** (nombre, sans défaut) : la part de l'espace qu'un `Stack` prend parmi
  ses frères, relative à la leur. Deux colonnes en `2` et `1` occupent deux tiers et un tiers. **Rien
  dans la librairie ne savait partager une ligne en colonnes inégales** : `fill` vaut `flex: 1 1 0%`
  pour tout le monde, donc deux enfants `fill` font 50/50, et `CardGrid` n'aligne que des colonnes
  strictement égales (`repeat(auto-fit, minmax(…, 1fr))`), sans `columns` ni `span`.

  **`weight` plutôt qu'un `basis`, et plutôt qu'un `columns` sur `CardGrid`.** La base reste à `0%`,
  comme pour `fill` : les largeurs sont un **pur rapport**, insensible au contenu. C'est le point du
  choix — une colonne laissée à sa largeur naturelle (`flex: 0 1 auto`) suit le `max-content` de son
  texte, et un panneau titré « Ain (01) » puis « Alpes-de-Haute-Provence (04) » **se redimensionne et
  déplace la carte qu'il côtoie à chaque changement**. Un `basis` reconduirait ce défaut ; un
  `columns` sur `CardGrid` ferait porter deux intentions contradictoires au même composant, alors que
  `Stack` possède déjà la notion de part d'une ligne, et que `weight` n'en est que la généralisation.

  **Additif et rétrocompatible par construction** : `fill` seul rend `flex: 1 1 0%`, l'écriture
  longue de `flex: 1` — même valeur calculée, aucun rendu existant ne bouge. Poser `weight` suffit,
  il implique le partage : une part demandée que rien ne distribuerait ne serait qu'un no-op muet.

- **`SvgMap` — prop `stroke`** (`divider` par défaut, donc aucun rendu existant ne change) : le
  contour des régions devient réglable. Il était **en dur** sur `divider`, ce qui convient tant que
  la carte n'est qu'une illustration mais rend un jeu de désignation **injouable en thème sombre** :
  `divider` y vaut `#2c322d`, une surface neutre logée dans la même famille que tous les
  remplissages disponibles. Contre `background.paper`, celui que la carte porte par défaut, le trait
  ne tient que **1,09:1** ; le meilleur atteignable en changeant de remplissage est **1,47:1**, et
  au prix d'une carte confondue avec le fond. WCAG 1.4.11 demande **3:1** pour un objet graphique,
  et aucun consommateur ne pouvait rien y faire — le composant n'exposait ni `stroke`, ni
  `strokeColor`, ni classe. La prop prend une **couleur CSS libre**, comme `background` sur
  `Pressable` : `text.disabled` y vaut **2,94:1 en clair et 3,07:1 en sombre**, le trait le plus
  discret qui approche le seuil des deux côtés. Le défaut n'est **pas** remonté à `text.disabled`
  pour tout le monde : une carte décorative n'a pas à porter un contour plus marqué, et la remontée
  serait une rupture silencieuse de rendu sur tous les portails. Le contour de sélection au clavier
  est inchangé — il passe en `primary` et s'épaissit, quel que soit le trait au repos.
- **`Countdown` : le temps qui presse, et qui se sent venir.** Le temps restant, une barre qui se vide, et un **battement sous le seuil d'urgence**. C'est ce dernier qui manquait : faute d'équivalent dans la librairie, la refonte de DéparteMental a dû remplacer le `pulse` de son chrono par un état statique — icône rouge, texte rouge — qui dit que le temps est court, pas qu'il presse. C'est le manque le plus sensible relevé sur toute la refonte du jeu.

  **L'horloge est celle de `useCountdown`**, donc recalculée depuis une échéance absolue : aucune minuterie n'est réécrite ici, et le composant survit à un onglet mis en arrière-plan. Deux écarts assumés avec le hook. Le composant part **en marche** (`running` vaut `true` par défaut) là où le hook part à l'arrêt : le hook est une brique qu'on pilote, le composant un affichage qu'on pose, et un compte à rebours qui ne compte pas est la plus mauvaise surprise possible. Et il **n'expose pas `restart`** : pour repartir sur une nouvelle question, on le remonte avec une `key`, seul moyen de redémarrer une durée identique.

  **Le format se décide sur la durée totale, jamais sur le temps restant.** Au-dessus d'une minute `m:ss`, en dessous les secondes nues. Décidé sur le restant, un chrono de deux minutes passerait de `1:00` à `59` en cours de route, et ce changement de forme se lit comme un défaut d'affichage plutôt que comme une seconde de moins.

  **L'urgence n'est pas portée par la seule animation.** Le battement — deux poussées puis un repos, sur une seconde, en `transform` seul — disparaît en mouvement réduit, mais la bascule au rouge, le tracé plein de l'icône et la barre qui passe en `error` restent : le décompte reste lisible pour qui refuse le mouvement. `urgentBelow` règle le seuil en secondes restantes et `0` le désactive entièrement. Le battement s'arrête à zéro : un chrono qui bat encore sur `0` laisse croire qu'il court toujours.

  **Ce qu'un lecteur d'écran entend est le vrai sujet.** Le conteneur porte `role="timer"`, dont la région vivante est **inactive** par défaut, et **tout le dessin est masqué de l'arbre d'accessibilité** — même règle que `Lives`. Sans ce masquage, la même vérité serait lue trois fois de suite : le libellé du minuteur, les chiffres, puis le pourcentage de la barre. Un `aria-live` sur un décompte rafraîchi dix fois par seconde parlerait dix fois par seconde et couvrirait tout le reste de la page : **une seule** annonce est faite, au passage sous le seuil, depuis une région posée **vide dès le premier rendu** — un lecteur d'écran ignore souvent le contenu d'une région ajoutée au document en même temps que son texte.
- **`Lives` — prop `animated`** (`true` par défaut) : le cœur qui s'éteint **fond sa couleur et
  bat**, au lieu de changer de tracé d'un rendu à l'autre. Perdre une vie est l'évènement le plus
  marquant d'une partie, et sans transition il passe inaperçu dès que le regard est ailleurs — or
  c'est précisément l'instant qu'il ne faut pas manquer. `false` rend la bascule instantanée, et le
  mouvement réduit l'impose de lui-même : rien n'est perdu au passage, le compte des vies étant de
  toute façon annoncé en toutes lettres par le conteneur.
- **`Pressable` — prop `dimWhenDisabled`** (`true` par défaut, donc aucun rendu existant ne
  change) : l'atténuation `opacity: 0.5` des surfaces désactivées devient débrayable. Cette
  atténuation dit « rien à faire ici », ce qui est faux quand le verrouillage sert à **montrer**
  plutôt qu'à écarter. C'est le cas de toute fenêtre de feedback : on verrouille les réponses au
  moment même où elles ont enfin quelque chose à dire, et la surface se délave à l'instant de la
  révélation. `Choice` la passe donc à `false` dès que son état n'est plus neutre — un choix resté
  neutre, lui, est bien hors course.
- **Garde-fou « rien à la charge de la librairie »** (`src/test/packaging.test.ts`) : un test refuse
  désormais toute clé `dependencies` dans le `package.json`, exige `framer-motion` en dépendance
  pair **non** optionnelle, et vérifie que **tout** ce qui est déclaré en dépendance pair figure
  bien dans le bloc `external` de `vite.config.ts`. C'est l'écart entre ces deux listes qui a
  produit les deux défauts d'empaquetage de cette version, sur `vite` puis sur `framer-motion` :
  externalisé d'un côté, déclaré à la charge de la librairie de l'autre, et **rien pour le dire** —
  ni le compilateur, ni la construction, ni les tests, qui tournent tous sur un poste où le paquet
  n'est jamais installé depuis l'extérieur. Comme le garde-fou « forme et ombre », il vérifie qu'il
  **lit bien la configuration qu'il prétend inspecter** : un garde-fou qui n'inspecte rien passe
  toujours.
- **`Choice` : la réponse qui sait dire si elle était la bonne.** C'est l'interaction la plus fréquente d'un questionnaire, et celle que chaque application redessinait à coups de classes CSS — `choice-ok`, `choice-ko`. `Pressable` apportait déjà la forme, l'anneau de focus et le clavier, mais n'avait **aucun état juste ou faux**.

  Deux décisions y sont prises. `correct` désigne **la** bonne réponse, choisie ou non : sans cette distinction, une erreur ne pourrait pas révéler ce qu'il fallait répondre. Et **l'état n'est pas porté par la seule couleur** : une marque cochée ou barrée apparaît, et elle est nommée, si bien qu'un daltonien ou quelqu'un qui écoute la page sait aussi ce qui vient d'être répondu. Le fond reste à 8 % de la teinte, la limite mesurée sur la tonalité de `Card` au-delà de laquelle le texte du thème perd son contraste : c'est la marque qui porte le signal, pas l'aplat.
- **Icônes `stack` et `locationCheck`** enregistrées au registre. L'occasion d'un constat : `assets/icons` contient **536 SVG et le registre n'en déclare que 134**, si bien que 402 icônes dorment sur le disque, inatteignables. La plupart des « manques » relevés en préparant la refonte du jeu n'étaient d'ailleurs pas des manques mais des écarts de nom — ce qu'il appelle `landmark` s'appelle ici `bank`.
- **`Autocomplete` : un champ de saisie avec suggestions**, qui remplace le `<datalist>` qu'on écrit d'instinct. Le datalist coûte cher : le filtrage est laissé au navigateur, la navigation au clavier n'existe pas partout, et **rien ne rattrape une saisie approchée** — l'utilisateur écrit « cote d », le champ ne trouve rien, et l'application répond « inconnu » alors que la suggestion était sous ses yeux. Ici le filtrage ignore les accents et la casse, et la première suggestion est **présélectionnée**, si bien qu'Entrée retient ce qui est proposé.

  Les options sont comparées **par leur valeur et non par identité** : un appelant qui reconstruit sa liste à chaque rendu — ce que fait tout écran qui retire les choix déjà faits — verrait sinon la sélection disparaître sans raison visible. `allowFreeText` autorise une saisie hors liste, refusée par défaut parce qu'une valeur qui ne correspond à rien n'est presque jamais exploitable. `clearOnSelect` vide le champ après chaque choix, pour une suite d'essais où le texte précédent n'a plus rien à dire.

  **La complétion en ligne est celle de MUI**, activée par sa prop `autoComplete` : la part non tapée de la suggestion apparaît dans le champ, en état sélectionné. Un calque grisé maison a été écrit puis **retiré** : aligner du texte par-dessus une entrée demande de recopier sa typographie et ses marges depuis son style calculé, et le moindre écart le fait se superposer à la saisie au lieu de la prolonger. Pour une bordure de champ, ce n'est pas un prix raisonnable.

  **Piège MUI 9 rencontré ici** : `renderInput` ne fournit plus `inputProps` ni `InputProps`, tout passe par `slotProps`. Remplacer `slotProps.htmlInput` au lieu de le compléter emporte l'identifiant, le rôle de combobox, les états ARIA et tous les gestionnaires — le champ devient une boîte de texte inerte, sans qu'aucune erreur ne soit levée.
- **`foldForSearch` : la normalisation de recherche, exportée.** C'est la règle de comparaison par défaut d'`Autocomplete` — accents retirés, casse abaissée, séparateurs ramenés à l'espace, chiffres conservés parce que bien des libellés en portent. Elle est publique parce que la prop `normalize` ne se remplace pas, elle se **compose** : `normalize={(texte) => foldForSearch(texte).replace(/\bst\b/g, "saint")}` ajoute un alias métier sans que l'appelant ait à réécrire le pliage des accents, ce qu'il ferait moins bien et différemment des deux côtés de la comparaison.
- **`SvgMap` : une carte SVG qu'on désigne au doigt.** Pincement pour zoomer, glissement pour se déplacer, molette au bureau, et la sélection d'une région. **Ce n'est pas `Map`**, qui affiche une carte géographique tuilée par MapLibre : ici le dessin est fourni par l'appelant sous forme de tracés, et le composant s'occupe de la vue, des gestes et de la désignation. Les deux répondent à deux besoins sans rapport, et il ne faut pas les confondre.

  **Le point qui ne se voit que quand il manque : un glissement se termine forcément sur une région.** Sans seuil, se déplacer sur la carte valait réponse. Au-delà de six pixels le contact devient un déplacement et le clic qui suit est ignoré — mais un doigt n'est jamais parfaitement immobile, donc en dessous il compte. `tapTolerance` règle ce seuil.

  **La géométrie est un module à part, `svgmap`**, testable sans DOM : `parseViewBox`, `clampViewBox`, `zoomViewBox`, `panViewBox`, `fitViewBox`. La hauteur y est toujours **déduite** de la largeur et du rapport de la vue d'ensemble, jamais transportée, ce qui empêche la carte de se déformer quel que soit le chemin — pincement, molette ou cadrage. Le zoom garde immobile le point visé, sans quoi la molette ramène vers le centre et l'endroit qu'on visait s'échappe. Le déplacement est calculé depuis la vue de **départ du geste** et non depuis la vue courante : cumuler les écarts fait dériver la carte sous le doigt, d'autant plus vite que les événements sont nombreux.

  **Accessibilité.** La carte passe de `role="img"` à `role="group"` dès qu'elle est sélectionnable : `img` rend tout le sous-arbre décoratif, et les régions atteignables au clavier disparaîtraient des lecteurs d'écran. Chaque région est un bouton nommé, qui répond à Entrée et à la barre d'espace.

  **Le contour de focus ne peut pas être celui du navigateur.** Il est dessiné autour de la boîte englobante, donc rectangulaire, alors qu'une région ne l'est jamais — un rectangle autour de la Bretagne. Le neutraliser sous `:focus-visible` seul ne suffit pas : un clic sur un tracé portant `tabIndex` déclenche `:focus`, et le contour par défaut revient. Il est donc neutralisé à la base, et l'indicateur de focus **épaissit le trait de la région**, seule marque qui épouse une forme quelconque.

  `useSvgMapViewport` peut être tenu par l'appelant, ce qui lui permet de cadrer sur un ensemble de régions — les huit départements d'Île-de-France, par exemple, illisibles à la vue d'ensemble. Le cadrage **borne la largeur avant de placer la vue** : la borner après décalait le centre, puisque le bornage garde le coin et non le milieu, et une région plus petite que le zoom maximal ne l'autorise se retrouvait hors du centre — c'est-à-dire tout ce qu'on lui demandait. **Défaut trouvé par un test**, pas à l'œil.
- **Icône `zoomOut`** enregistrée au registre, qui n'avait que son entrée `zoomIn`.
- **Les pièces d'une partie.** `Lives`, `Streak`, `ShareResult` et un éclair sur `Card` : les premiers composants de la librairie qui ne servent aucun portail. Le dessin y est décoratif et le texte ne l'est pas — le compte des vies est annoncé en toutes lettres, parce qu'une rangée de cœurs ne dit rien à qui ne la voit pas, et les icônes sont donc masquées de l'arbre d'accessibilité. L'état chaud de la série se **déduit** du multiplicateur au lieu d'être passé à côté : deux sources pour la même vérité finissent par se contredire, et c'est l'affichage qui mentirait.

  **L'éclair de `Card` est un anneau, pas une ombre ni un fond.** Une ombre débordante serait rognée par le découpage en squircle — le garde-fou de la librairie refuse d'ailleurs cette combinaison. Et un fond teinté était exclu par une contrainte déjà mesurée sur `tone` : au-delà de 8 % de teinte, le texte du thème perd son contraste, alors qu'un anneau ne passe pas sous le texte. Le calque est posé en `::after`, que `squircleSurface` n'occupe que lorsqu'une couleur de bordure lui est passée — ce que `Card` ne fait jamais. **Un test garde ce point précis** : une seconde clé `::before` aurait écrasé le calque de fond en silence, sans qu'aucun type ne bronche, exactement le défaut qui avait décroché le pouce de `Toggle` lors du passage à MUI 9.

  **L'erreur tremble**, comme dans la version écrite à la main du jeu : 0,35 s, quatre images, en unités relatives. C'est du décor et non de l'information — l'anneau porte le sens — donc le tremblement **disparaît en mouvement réduit**, où l'anneau reste. La règle du thème qui ramène les animations à une seule itération n'y aurait pas suffi, puisque celle-ci n'en fait qu'une. Il ne se déclenche que sur `flash`, jamais sur `tone` : `tone` décrit un état qui dure, `flash` un événement qui vient de se produire.

  `ShareResult` dessine la grille mais **ne fabrique pas le texte partagé** : ce qui se partage — la date, le score, les émojis retenus — appartient au jeu, pas au design system.
- **`useTransientState` : une valeur qui revient d'elle-même à son repos.** Le motif est partout — un éclair de bonne réponse, un « copié ! », un message qui s'efface — et il est presque toujours écrit à la main avec un `setTimeout` nu, ce qui laisse passer deux défauts. La minuterie précédente est ici **remplacée** et non empilée : sans ça, deux déclenchements rapprochés remettent au repos pendant que le second est censé être visible. Et elle est **annulée au démontage** : sans ça, une minuterie posée pendant une partie continue de courir après la fin et vient écrire dans un écran qui n'existe plus. La durée se donne à l'appel, ce qui permet au même éclair de durer moins longtemps sur une réussite que sur une erreur.
- **`useCopyToClipboard`, avec l'échec exposé.** La vitrine avait déjà écrit ce hook dans son propre coin, sans gestion de l'échec ; le jeu en avait une seconde copie. Il entre dans la librairie, et **la vitrine consomme désormais celui-ci** — sa copie est supprimée. La copie échoue pour des raisons ordinaires : origine non sécurisée où l'API n'existe simplement pas, document qui n'a pas le focus, permission refusée. `failed` le dit, là où un bouton muet laisse croire que le texte est parti, et le second gestionnaire sur la promesse supprime au passage un rejet non traité.
- **Un magasin local typé, versionné, et gardé en mémoire.** `createLocalStore` et `useLocalStore` remplacent la couche `localStorage` que chaque application réécrivait. Le magasin lit **une seule fois** à sa création, sert l'état depuis la mémoire et écrit au travers. C'est le point : une fonction de lecture qui reparse le stockage à chaque appel se paie au centuple dès qu'elle passe dans une boucle — dans DéparteMental, le tirage pondéré relisait la même sauvegarde **101 fois par question posée**, et la barre de progression en relançait une en pleine fonction de rendu.

  **La version fait partie du contrat.** Une sauvegarde est enveloppée dans `{ v, d }`, et un changement de `version` appelle `migrate`, qui reçoit la charge et la version dont elle vient — `0` pour une sauvegarde écrite avant toute numérotation, ce qui couvre exactement le cas d'une application qui persistait un objet nu. Une migration qui renonce ou qui lève **repart de l'initial** au lieu d'empêcher le démarrage : une progression perdue vaut mieux qu'un écran blanc.

  **Deux lecteurs, une vérité.** `useLocalStore` passe par `useSyncExternalStore` et non par un `useState` recopié, si bien que deux composants lisant le même magasin voient la même valeur au même rendu. Le magasin écoute aussi l'événement de stockage, qui ne se déclenche que dans les **autres** onglets : deux fenêtres du même jeu restent synchronisées. `usePersistentState` est le raccourci pour une valeur seule, avec un registre par clé — sans lui, deux appels sur la même clé tiendraient chacun leur copie et divergeraient au premier écrit.
- **`useCountdown` : un compte à rebours qui ne dérive pas.** Le temps restant est **recalculé depuis une échéance absolue**, jamais décrémenté. Un chronomètre qui retire une seconde par tick accumule le retard de chaque rendu — soixante secondes affichées en font davantage en vrai, et l'écart grandit avec la charge de la page. Il se trompe surtout lourdement quand l'onglet passe en arrière-plan, où le navigateur bride les minuteries : au réveil, seule une horloge absolue montre le temps réellement écoulé. Le hook expose `remaining`, `seconds`, `elapsed`, `progress`, `ended` et `restart`, et `running` suffit à mettre en pause — le gel étant pris à l'instant exact et non au dernier rafraîchissement, car un gel arrondi offrirait jusqu'à un intervalle de temps de jeu gratuit à chaque pause.
- **Le son entre dans le design system.** Nouveau module `sound` : un provider, un catalogue sémantique de cinq sons — `click`, `start`, `correct`, `wrong`, `finish` — et le moteur qui les joue. Un écran demande `"correct"`, jamais une fréquence : le timbre de la bonne réponse se change à un seul endroit, et non dans chaque écran. C'est la première pièce de la librairie qui ne sert aucun portail web, et elle ouvre la voie aux jeux.

  **Synthétisé par défaut, remplaçable par des fichiers.** Les sons sortent d'oscillateurs Web Audio : aucun octet transporté, rien à charger hors-ligne, aucune licence à traîner. `sources` permet de substituer un fichier son par son, et **un fichier absent, refusé ou indécodable ne rend jamais l'application muette** — la synthèse reprend la main, et le téléchargement condamné n'est tenté qu'une fois au lieu d'être relancé à chaque lecture. `play` **retourne** ce qui est réellement sorti (`"file"`, `"synth"`, `"muted"`, `"unavailable"`) plutôt que de le journaliser : un son qui ne sort pas est invisible, donc indébogable, et c'est exactement le piège qui avait coûté une session sur la vidéo du fond animé.

  **La coupure et le volume vivent dans le provider**, et sont retenus d'une visite à l'autre. C'est le défaut que ce module fait disparaître : chaque écran gardait son propre `useState`, et se désynchronisait du bouton de coupure dès qu'un autre écran y touchait. Rallumer le son **le confirme à l'oreille**, ce qui sert deux fois : l'utilisateur entend que ça marche, et le contexte audio est débloqué dans le geste même — les navigateurs suspendent tout contexte créé sans interaction, et n'accordent pas d'autre occasion. Il n'existe **aucune media query « moins de son »** — `prefers-reduced-motion` ne parle que d'animation — donc le réglage est explicite et persisté, et rien ne joue avant un geste.
- **`SoundToggle` et `useSoundToggle`** : le bouton de coupure, qui ne garde aucun état — deux boutons posés sur deux écrans afficheraient sinon des vérités différentes. Son nom accessible annonce l'action et non l'état, et suit la langue courante.
- **Icônes `volumeUp`, `volumeDown`, `volumeOff`** enregistrées au registre : les SVG dormaient dans `assets` sans qu'aucune entrée ne les déclare, donc sans être atteignables par `Icon`.
- **Ce que les portails réécrivaient entre dans la librairie.** Un audit des cinq portails a relevé environ 420 lignes de duplication quasi littérale sur 14 900. Ce lot en pose la contrepartie côté librairie, sans toucher une ligne des portails : ils viendront s'y brancher un par un, à leur montée de version.

  **Session et authentification.** `buildLoginUrl` accepte `redirectCookieDomain` : sans lui, le cookie de retour reste attaché au sous-domaine qui l'écrit, le portail d'authentification ne le lit pas, et l'utilisateur atterrit sur l'accueil au lieu de la page qu'il demandait. Les trois portails concernés réécrivaient la fonction **entière** pour cette seule ligne. `createRouteGuard` devient utilisable : ses libellés acceptent une fonction, résolue dans le composant, là où les hooks de traduction sont légaux — la fabrique s'appelant au niveau du module, un libellé en chaîne y était figé dans une langue, et c'est pour cela que les trois gardes recomposaient `RouteGuard` à la main. Elle accepte aussi `renderAuthorized`, pour les routes de mise en page d'un routeur qui doivent rendre sa sortie plutôt que des enfants. `useLogout` porte la séquence de déconnexion, dont le `finally` : si l'appel échoue, il faut partir quand même, car rester sur une page qui affiche encore le nom de l'utilisateur se lit comme un échec alors que la session est peut-être déjà morte
- **`isUnauthorized` et `isForbidden`** dans le module HTTP. `RouteGuard` réclame ce prédicat en paramètre, si bien qu'il était écrit trois fois à l'identique. Le fournir évite surtout qu'une copie dérive : confondre un 403 avec un 401 renvoie vers la connexion un utilisateur **déjà** connecté, donc en boucle. Une erreur qui n'est pas une erreur d'API — une coupure réseau — n'est pas un refus et ne doit pas déconnecter
- **`useAsyncResource`** : chargement, erreur, rechargement d'une ressource distante. Les copies des portails avaient **déjà divergé** en trois conventions d'erreur et trois façons de gérer l'annulation, dont une seule correcte. Les deux sont tranchées ici. **L'annulation passe par un `AbortSignal`, pas par un drapeau** : une garde `let active = true` empêche bien d'écrire dans un composant démonté, mais la requête continue, et sur une liste dont on change le filtre vite la dernière réponse arrivée n'est pas la dernière demandée. Et `data` ne repasse jamais à vide sur erreur : garder l'affichage avec un message à côté vaut mieux qu'un écran qui se vide
- **`LegalLinks`** : le pied de page légal, conditions et mentions légales. L'ancre des mentions légales vivait en dur dans chaque portail, donc impossible à déplacer sans les visiter tous ; elle est ici, et exportée. `renderLink` permet au portail qui **héberge** ces pages de naviguer par son routeur au lieu de recharger une adresse absolue — sans cette porte, il ne pouvait pas partager le composant et en gardait une copie
- **`useMenuAnchor` et `Menu items`** : l'état d'ouverture d'un menu avec son ancre, et les entrées décrites plutôt que composées. Chaque entrée **ferme le menu avant d'agir**, dans cet ordre : agir d'abord peut démonter l'élément qui ancre le menu, lequel se retrouve alors ancré à un nœud disparu, donc collé dans un coin de l'écran
- **`SidePanel actions`** : des boutons de pied de panneau alignés à droite, comme ceux d'une `Card`. Chaque application les réalignait à la main, l'une dans un composant à elle, l'autre en recopiant la rangée dans chaque page, avec des écarts différents. `footer` reste libre pour un pied qui n'est pas une rangée de boutons
- **`Card tone` et `StatCard tone`** : une tonalité sémantique de surface, ce que la valeur **signifie** et non la couleur qu'on veut. Un solde prévisionnel négatif en rouge, un quota presque atteint en orange. Le fond descend à 8 % de la couleur : au-delà, le texte du thème n'y tient plus le seuil de contraste, et il faudrait une couleur de texte par tonalité
- **`isLightColor`, `contrastTextFor`, `perceivedLuminance`, `parseHexColor`** : le contraste sur une couleur **arbitraire**, celle qu'un utilisateur choisit ou qu'une API renvoie. À ne pas confondre avec les jetons `*-contrastText`, qui répondent à la même question pour les couleurs du thème, connues d'avance. `contrastTextFor` renvoie directement le jeton de texte et non un booléen à interpréter : c'est ce dernier morceau que chaque application refaisait à sa façon, en choisissant parfois deux jetons différents pour la même situation
- **`classifyUrl` et `isSafeUrl`** dans la validation : tout ce qui n'est ni `http:` ni `https:` est bloqué, `javascript:` en premier lieu, qui exécute son contenu au clic depuis un `href`. Le cas se présente dès qu'une application affiche des liens qu'elle n'a pas écrits. Une URL malformée est traitée comme relative, pas comme sûre. **Un durcissement de sécurité n'a pas à être re-dérivé par chaque application**, ce qui était le cas
- `EmptyState` accepte une `description` en nœud React et non plus seulement en chaîne, ce qui permet d'y poser un bandeau d'alerte — la forme que prennent les trois pages d'accès refusé de la flotte, aujourd'hui écrites de trois façons différentes

- **`Pressable` — une surface cliquable sans apparence**, qui apporte la forme en squircle, l'anneau de focus, l'état de sélection et l'accessibilité, et laisse son contenu entièrement libre. Elle comble le seul vrai manque qui obligeait les portails à importer `ButtonBase` de MUI directement : une pastille de couleur, une tuile de galerie ou un choix d'icône ne sont pas des boutons au sens de `Button`, qui impose un libellé et une variante. `radius="circle"` donne un disque, `size` le côté, `background` la couleur, `selected` pose un liseré et grossit légèrement la surface. **Le liseré est un anneau découpé au même squircle et non une ombre** : la forme étant découpée, une ombre débordante serait rognée, donc invisible — le garde-fou « forme et ombre au même endroit » l'a refusée dès le premier essai. Un `box-shadow: inset` aurait tenu dans la forme mais dessiné des coins circulaires, décalés du squircle
- **`InlineInput` — le champ d'édition en place** : renommer un fichier dans sa liste, une colonne dans son en-tête, sans ouvrir de formulaire. Il n'apporte pas seulement une apparence discrète, il porte le **comportement** : Entrée valide, Échap abandonne, la perte du focus valide, et **les évènements ne remontent pas à l'élément cliquable qui l'héberge**. C'est cette dernière partie qui était recopiée à la main dans les portails et qu'on oublie à moitié : sans elle, taper Entrée sur une ligne de fichier renomme le fichier **et** l'ouvre dans le même geste, ce qui ne se voit qu'à l'usage
- **`useBreakpointDown`, `useBreakpointUp` et `useBreakpoint`** répondent aux bornes du thème plutôt qu'à une requête média écrite à la main dans le portail — c'est ainsi que les deux se désynchronisaient. Les bornes sont interrogées **en rem**, comme le reste de la librairie, donc elles suivent la taille de police choisie par l'utilisateur là où une requête en pixels l'ignore. **La borne haute est exclusive** : à une largeur exactement égale à `md`, `down("md")` est faux et `up("md")` est vrai, jamais les deux — sans quoi deux dispositions se superposeraient sur cette largeur précise
- `Stack` accepte `role`, pour les groupes qui en ont un — `radiogroup`, `group`, `toolbar`, `list`. Sans lui, un groupe de choix bâti avec `Pressable` ne s'annonçait pas comme un groupe, et il fallait sortir de la librairie pour le corriger : le manque est apparu en écrivant la première démonstration de `Pressable`

- **Nouvelle fonte de titre — Titan One** : les titres ne sont plus composés en Chivo. La librairie embarque une deuxième fonte, auto-hébergée comme la première, en deux sous-ensembles latin et latin étendu (17 ko de WOFF2 au total), avec sa licence OFL. Un nouveau token `tokens.typography.fontFamilyHeading` la porte, Chivo restant en secours derrière elle : c'est Chivo qui compose les titres le temps que le fichier arrive, et pour de bon s'il manque. Le corps de texte, les libellés et les métriques ne changent pas — `tokens.typography.fontFamily` reste Chivo.

  **La famille vit dans les tokens de titres et pas seulement dans le thème** : `Heading` rend un `Typography` **sans variante**, donc en `body1`, où la famille du thème est celle du corps de texte. Une fonte posée sur `theme.typography.h1` ne l'atteindrait jamais. `tokens.typography.heading.h1` à `h5` portent donc `fontFamily`, ce que le thème reprend ensuite.

  **Rupture visuelle : les titres passent de la graisse 700 à 400.** Titan One ne publie qu'un seul poids ; demander un gras ferait fabriquer au navigateur un faux gras, plus lourd et plus sale que le dessin d'origine. Un portail qui lisait `tokens.typography.heading.h2.fontWeight` pour s'aligner sur les titres récupérera donc 400. Le crénage optique, réglé pour Chivo, est laissé tel quel — c'est ce réglage qui a été validé à l'œil.

  Trois fontes ont été essayées sur la vitrine avant celle-là — Caacupé One, Titan One, Rammetto One — chargées depuis Google Fonts par un banc d'essai provisoire, hors librairie, retiré depuis. Le greffon de copie des licences parcourt maintenant le dossier des fontes au lieu de nommer `OFL.txt` : ajouter une fonte ne peut plus laisser sa licence derrière. `OFL.txt` devient `OFL-Chivo.txt`, aux côtés de `OFL-Titan-One.txt`.
- **Nouveau point d'entrée canopui/vite** — le greffon `canopyVideo` sert les scènes de canopée : les six fichiers (32 Mo) étaient livrés dans le paquet, mais **c'était au portail de les servir** — recopier `dist/assets/video` dans son dossier public, sans quoi le fond par défaut de `PageScaffold` restait noir. Un consommateur extérieur à QVL, lui, ne pouvait pas le savoir. Le greffon prend cette charge : `plugins: [canopyVideo()]`, une ligne dans `vite.config.ts`, et les scènes sont servies par un middleware en développement puis recopiées dans la sortie au build. Rien à dupliquer, et le seul fait d'installer le paquet suffit.

  **Pourquoi un greffon et pas un import** : ces fichiers ne peuvent pas traverser un bundle. En mode librairie, Vite **inline en base64 tout asset qu'un module référence**, `assetsInlineLimit` compris — mesuré : le module des scènes passait de 0,6 ko à **43,6 Mo**. Un `new URL(..., import.meta.url)` échappe à l'inlining côté consommateur mais pas côté librairie, et il est de surcroît **cassé en développement** : le pré-groupage des dépendances réécrit l'URL vers un chemin que rien ne sert, ce qui se solde par un 404 silencieux. Les deux voies ont été essayées et mesurées avant d'être écartées.

  `CANOPY_ASSET_BASE` ne change pas (`/canopui/video`), le greffon accepte une autre base, et `canopyScenesFrom` reste la porte de sortie pour un CDN. Sans greffon, le fond reste noir : l'échec est immédiat et visible, pas silencieux.
- **`DataTable` — prop `editable`** : ajoute une action d'édition **au bout de chaque ligne**, après les actions du portail. Le tableau prend en charge ce qui lui revient — le bouton `EditButton`, son nom accessible traduit (`canop.dataTable.edit`), sa place, et l'ouverture de la colonne de fin quand aucune action de portail ne l'avait créée — tandis que ce que l'édition déclenche reste au portail, via `onRowEdit`. S'y ajoutent `canEditRow` pour rendre l'action inactive sur une ligne non modifiable, et `editLabel` pour imposer un autre nom accessible
- **`Carousel` — clic par moitié** : en mode barres, un clic dans la moitié avant de la fenêtre recule d'une carte, dans la moitié arrière avance. À l'horizontale c'est gauche et droite, à la verticale haut et bas. Deux garde-fous : les **éléments interactifs de la carte gardent leurs clics** — un bouton dans une carte doit rester un bouton, pas une zone de navigation — et le `click` que le navigateur envoie **à la suite d'un balayage** est ignoré, sans quoi le geste avancerait de deux cartes
- **`TOUCH_TARGET_MIN` et `touchPaddingFor`** (internes, `components/_shared`) : la règle des 44 px était écrite deux fois, dans le `Slider` et dans le `Carousel`. Elle n'existe plus qu'en un endroit, avec le calcul du rembourrage nécessaire. **La zone saisissable est le rendu plus son rembourrage, pas le rendu seul** — c'est l'erreur que les deux composants faisaient
- **`Carousel` — défilement automatique** : `autoPlay` avec `interval`, la durée d'affichage de chaque carte. Il **boucle**, sans quoi il s'arrêterait définitivement sur la dernière carte ; les flèches bouclent alors aussi, pour que le carrousel n'ait qu'un seul comportement aux extrémités. Il **se suspend au survol et dès qu'un élément interne prend le focus**, et **ne démarre jamais en mouvement réduit** : un contenu qui bouge seul doit pouvoir être arrêté, c'est une exigence d'accessibilité et non un confort
- **`Carousel` — balayage au doigt** : en mode barres uniquement, un balayage sur l'axe du carrousel change de carte. Le geste **ne réagit qu'au doigt** (`pointerType`), jamais à la souris, qui sélectionnerait du texte. Deux garde-fous : un seuil de 48 px, sans quoi un simple appui sur le contenu ferait tourner le carrousel ; et le rejet des gestes **perpendiculaires**, sans quoi le défilement de la page changerait de carte. En mode flèches le geste est ignoré, ce sont elles qui portent la navigation
- **`paletteGradient` et `sheenGradient`** (internes, `components/_shared`) : la librairie avait trois façons d'écrire le même dégradé de palette — le pouce de la barre de défilement dans le thème, le trait du `Spinner` en SVG, la piste du `Slider` en CSS. Les trois teintes `light`, `main` et `dark` sont désormais produites en un seul endroit, avec un éclaircissement optionnel pour ce qui doit se lire sous un reflet
- **`Slider` — prop `size`** (`"small"`, `"medium"`) : la pastille, le rail et les graduations suivent le gabarit. Le curseur était l'un des rares composants sans taille, là où `Button`, `Input`, `Toggle`, `StatusChip` et `SegmentedControl` en ont tous une
- **`Slider` — prop `format`** : met la valeur en forme **partout où elle est lue**, en-tête et `aria-valuetext` compris. `showValue` n'affichait qu'un nombre nu : un curseur qui règle un pourcentage ou un montant ne pouvait pas le dire. `format={(v) => `${v} %`}` suffit désormais, et le lecteur d'écran annonce la même chose que l'œil lit
- **`Spinner` — prop `color`** : la couleur était câblée sur `accent`, alors que `Slider`, `ProgressBar` et `Rating` acceptent tous une couleur de palette. Le défaut reste `accent`, donc aucun rendu existant ne change
- **Composant `CanopyBackground`** : le fond animé de la librairie. Une canopée filmée du sol vers le zénith, rendue sous **Blender 5.2 en EEVEE Next**, en boucle de **240 images à 24 i/s** — soit 10 secondes — dont le raccord est exact : toutes les fréquences d'animation de la scène sont entières sur la période, donc l'image 241 est l'image 1 au micromètre près et la reprise ne se voit pas. **Deux scènes, une par thème** : une nuit sous la lune et un jour au soleil, chacune rendue à 1920 × 1080 et 64 échantillons. Le composant choisit la bonne d'après le thème actif **sans configuration**, et `sceneMode` (`"auto"`, `"light"`, `"dark"`) en fige une, comme `styleMode` sur `Map`. L'API reprend celle de `ShapeBackground` — `children`, `minHeight`, `component`, `sx`, `contentSx` — pour que les deux fonds soient interchangeables. Un **voile** de la couleur de fond est posé entre la scène et le contenu, sans quoi le texte ne tient pas sur un feuillage chargé : 0,52 en clair, 0,42 en sombre, réglable par la prop `veil`
- **Scènes livrées dans le paquet, servies par le portail** : six fichiers sous `dist/assets/video/` — WebM VP9, MP4 H.264 et image d'affiche pour chaque thème. Le WebM est proposé avant le MP4, qui ne sert que de repli pour les Safari anciens. Les embarquer suit le choix déjà fait pour la police Chivo : **aucune dépendance réseau tierce**. Le paquet publié passe donc de **595 Ko à environ 32 Mo**, mais un navigateur ne télécharge qu'**un seul fichier**, le WebM du thème actif : 4,8 Mo en sombre, 6,4 Mo en clair. **Point d'implémentation qui décide de tout le reste** : les vidéos ne sont **pas** importées depuis le JS, parce qu'en mode librairie **Vite ignore `assetsInlineLimit` et inline tout asset importé, quelle que soit sa taille** — les 32 Mo deviendraient 43 Mo de base64 chargés d'un bloc, sans streaming possible. Elles sont donc copiées telles quelles à la construction et résolues à l'exécution depuis `CANOPY_ASSET_BASE`, soit `/canopui/video`. **Un portail doit exposer ce chemin** : recopier `node_modules/canopui/dist/assets/video` dans son dossier public, ou pointer ailleurs avec `canopyScenesFrom` ou la prop `scenes`. Sans ça, le fond se réduit à son affiche manquante
- **`CanopyBackground` — sources interchangeables** : `scenes`, `CANOP_CANOPY_SCENES`, `CANOPY_ASSET_BASE`, `canopyScenesFrom(base)` et `resolveCanopyScene`, sur le modèle de `tiles` sur `Map`. `scenes` accepte une **surcharge partielle** par thème et par format, et `canopyScenesFrom` reconstruit les six URL depuis n'importe quelle base. Héberger les vidéos sur un CDN QVL n'exige donc de changer ni le composant ni son API, et c'est la sortie de secours si les 32 Mo du paquet deviennent un problème
- **`CanopyBackground` — respect du mouvement réduit** : rien n'est joué quand l'utilisateur a demandé un mouvement réduit, l'image d'affiche est rendue à la place. `animated={false}` force ce comportement. Une **vidéo de fond en lecture automatique est exactement ce que `prefers-reduced-motion` désigne**, et le reset global du thème n'a aucune prise sur un élément `<video>`. La scène est `aria-hidden` et sans son : décorative, jamais annoncée
- `PageScaffold` — **prop `background`** : `"canopy"` par défaut, `"shapes"` pour conserver le fond de formes organiques des versions précédentes
- **Style de carte CanopUI** : la carte cesse d'emprunter le style d'un tiers. `buildCanopMapStyle(mode, tiles, options)` construit la feuille de style MapLibre **depuis `tokens`** et `canopMapPalette(mode)` en expose les couleurs. C'est ce qui a imposé le passage au vectoriel : une tuile raster arrive **déjà peinte**, on ne peut que la filtrer ; le vectoriel reçoit la géométrie brute et la feuille de style décide de chaque couleur — sol, eau, bâti, voirie par classe, libellés. Le parti pris tient en une phrase : **le sol se tait, le réseau parle**. Sol en `secondary`, espaces verts en deux valeurs proches, voirie à cœur clair posée sur un liseré, et **aucune couche d'occupation du sol** (`landuse`) ni **aucun pointillé** — ce sont ces deux-là qui donnaient l'allure « fond OpenStreetMap » sur laquelle aucune couleur de marque ne tient. Le relief vient de deux ombres réelles : les **bâtiments projettent une ombre décalée** (`fill-translate`) et le réseau repose sur une **ligne floutée** (`line-blur`), donc les routes flottent au-dessus du sol au lieu d'y être posées à plat. Les deux thèmes sortent des mêmes tokens : la carte **suit le thème CanopUI sans configuration**, et la prop `styleMode` (`"auto"`, `"light"`, `"dark"`) fige un thème quand c'est voulu. Le mobilier — bulles, boutons de zoom, attribution — est habillé par le thème via les seules variables CSS (squircles, surfaces de papier, ombres portées), donc une carte posée dans un portail n'y ressemble plus à une pièce rapportée
- **`tokens.map`** : nouvelle famille de tokens, à côté de `tokens.scrollbar` et `tokens.squircle`. La palette d'interface n'avait **aucun bleu qui tienne sur une carte** — `info` est un bleu d'écran, trop sombre et trop gris pour de l'eau. `tokens.map` porte donc l'eau, sa rive et la teinte d'ombre, en clair et en sombre, réglables sans toucher aux couleurs d'UI
- **Source de tuiles interchangeable — prop `tiles` et `CANOP_MAP_TILES`** : les tuiles vectorielles viennent par défaut d'[OpenFreeMap](https://openfreemap.org), **sans clé d'API ni compte**. La feuille de style est écrite contre le **schéma OpenMapTiles**, celui que produit aussi `planetiler` : une source auto-hébergée par QVL (`pmtiles`, `tileserver-gl`) se substitue en changeant la seule prop `tiles`, **sans retoucher le style**. `resolveMapTiles` fusionne une surcharge partielle, `MAP_DEFAULT_ZOOM` et `CanopMapTiles` sont exportés avec le reste
- **Points d'intérêt aux icônes CanopUI — prop `poi`** : le fond de carte affiche à nouveau les commerces et équipements, mais avec **notre jeu d'icônes** et non celui d'un fournisseur. Vingt-quatre classes du schéma OpenMapTiles sont reliées au catalogue maison — `bar` et `beer` sur le verre, `cafe` sur la tasse, `alcohol_shop` sur le verre de vin, `fast_food` sur les couverts, jusqu'à `hospital`, `art_gallery` ou `castle`. Les icônes sont **peintes à la couleur du thème au moment où MapLibre les réclame** (`styleimagemissing`), donc elles suivent le passage en sombre sans qu'aucun asset ne soit préparé, et **aucun sprite n'est téléchargé** : le SVG du catalogue est converti en image à la volée, à deux fois la résolution d'affichage. Chaque glyphe est composé dans une **pastille** — disque de papier, filet vert, ombre portée — la grammaire d'une carte moderne, assemblée dans le SVG lui-même. Les images **portent le thème dans leur identifiant** (`canop-poi-light-bar`, `canop-poi-dark-bar`) : MapLibre conserve les images d'un style à l'autre, une bascule en sombre réutilisait donc les pastilles peintes en clair, avec leurs couleurs figées. Elles apparaissent à partir du zoom 15, et la prop `poi` **filtre par classe** en plus du booléen — `poi={["bar", "cafe"]}` ne garde que ceux-là, `poi={false}` rend le fond muet. Le type `CanopMapPoiClass` est **dérivé de la table d'icônes**, donc l'autocomplétion propose les classes réelles et une classe inventée est refusée à la compilation ; une classe inconnue reçue à l'exécution est ignorée plutôt que de casser le style
- **Frontières administratives — prop `boundaries`** : `true` trace les frontières nationales et régionales, `false` n'en trace aucune, et un tableau choisit les niveaux (`"country"`, `"region"`, `"department"`). Chaque niveau a **sa propre couche**, donc son seuil de zoom et son poids : le pays dès le début, la région à partir du zoom 4, le département à partir du zoom 7 — sans quoi les limites départementales apparaîtraient à l'échelle du continent
- **`Map` — props `border`, `elevation` et `radius`** : la carte se pose comme une surface de la librairie. `border` trace un filet, `elevation` la soulève sur l'échelle d'élévation maison, `radius` règle l'arrondi en squircle. Le filet est **dessiné comme un cadre imbriqué** et l'ombre est portée par le **parent** du découpage, parce qu'une `border` CSS perd ses angles sous un `clip-path` et qu'une ombre y disparaît entièrement. Sans ces props, la carte reste un rectangle nu que le portail encadre lui-même
- **Carte tactile — prop `gestures`** : `"cooperative"` par défaut. Une carte pleine largeur dans une page qui défile **piège le doigt** : le geste de défilement zoome la carte au lieu de faire descendre la page. En coopératif, la carte se déplace **à deux doigts** (ou `Ctrl` + molette sur ordinateur, `⌘` sur Mac) et le glissement à un doigt fait défiler la page comme partout ailleurs ; le message d'aide est traduit par la librairie. `"direct"` rend la carte immédiatement manipulable, pour un écran où elle est le contenu principal. La **rotation et l'inclinaison sont désactivées** : sur une carte de données, elles ne s'obtiennent que par accident. Les boutons de zoom passent à **2,75 rem sur pointeur grossier** et les bulles sont bornées à `min(20rem, 86vw)`, donc elles ne débordent plus d'un écran de téléphone
- **Repli sans accélération graphique** : le rendu vectoriel demande un contexte **WebGL 2**, que MapLibre 6 exige sans repli sur WebGL 1 — l'affaire de l'appareil qui affiche, pas de l'hébergeur. Les mobiles récents le fournissent nativement ; un poste verrouillé (VDI, bureau à distance) parfois pas. Le composant le détecte au montage et rend alors un `EmptyState` avec un lien vers la position sur OpenStreetMap : **la page n'affiche jamais un trou**, et le portail n'a rien à câbler
- `Map` — prop `ariaLabel` : la carte reçoit un rôle `region` et un nom accessible quand elle en porte un
- **Composant `SaveButton`** : bouton d'enregistrement unique pour toute la flotte, bâti sur `IconActionButton`. Il **porte lui-même son retour utilisateur** — c'est précisément ce qui divergeait d'un portail à l'autre : toast de confirmation quand l'enregistrement aboutit, toast d'erreur quand il échoue. `onSave` peut renvoyer une promesse, dont le bouton suit l'issue : désactivé tant qu'elle court, donc **pas de double envoi**, et un rejet ne peut pas passer pour un succès. `successMessage` et `errorMessage` laissent le métier imposer ses libellés, sinon ceux de la librairie s'appliquent, traduits. La logique est isolée dans `useSaveButton`, exposé avec le composant
- **Signalement de bug — prop `supportHref`** : sur `PageScaffold`, `Navbar` et `SettingsMenu`. Sur grand écran, un lien « Signaler un bug » s'ajoute **à la suite** du pied de page fourni par le portail, et ouvre cette zone même quand le portail n'en fournit aucun. En mobile, il devient un bouton icône dans la barre de réglages, à côté des informations légales. Le bouton de la barre de réglages est **indépendant du placement du footer** : le signalement de bug n'a pas à dépendre de la façon dont un portail range ses mentions légales. Nouvelle icône `help` au catalogue, de la même famille que `info`
- **`Navbar` et `PageScaffold` — prop `height`** : à `100dvh` par défaut, comportement inchangé pour les portails. Ces composants imposaient jusqu'ici la hauteur du viewport en dur, ce qui les rendait **inencastrables** : dans un cadre plus court, tout le bas — pied de page compris — était rogné sans que rien ne le signale. Les démonstrations de la vitrine passent désormais `height="100%"`
- **Barre de défilement — `scrollbarSx` et `tokens.scrollbar`** : la barre fait désormais partie du design system. Le thème l'applique à **toute zone qui déborde**, page comprise, sans qu'aucun composant ait à la demander — un composant écrit demain l'aura sans y penser. Le pouce porte un dégradé vertical, un biseau interne, trois stries de préhension au centre, et change d'état au survol comme à l'enfoncement. `scrollbarSx(variant)` ne sert plus qu'aux exceptions : `thin` réduit la largeur, `hidden` efface la barre **des deux moteurs à la fois** sans supprimer le défilement. Les couleurs passent par `--canop-scrollbar-thumb`, `-top`, `-bottom`, `-hover`, `-track` et `-grip`, surchargeables par conteneur. Point d'implémentation : les propriétés standard `scrollbar-width` et `scrollbar-color` sont isolées derrière `@supports not selector(::-webkit-scrollbar)`, car **Chromium ignore l'intégralité des styles `::-webkit-scrollbar-*` d'un élément dès que l'une des deux est déclarée dessus** — les poser ensemble revient à n'avoir aucun habillage. L'habillage complet est donc Chromium et Safari ; Firefox reçoit deux couleurs unies
- **Composant `CookieBanner`** : bandeau de consentement aux cookies. Le portail fournit le texte (`message`, seule prop obligatoire), la librairie prend en charge la mécanique — mémoriser la décision, ne plus reposer la question, et la partager avec le reste de l'application. Le bandeau est autonome : il lit la décision au montage, ne s'affiche que si elle est absente, l'enregistre au clic et disparaît. `onDecision` prévient le portail au moment du choix, à lui de décider ce qu'il en fait — charger une mesure d'audience, poser un cookie tiers : cette responsabilité reste la sienne. `storageKey` accepte `null` pour une décision qui ne survit pas à la session
- **`useCookieConsent()`** : lit la même décision depuis n'importe où dans l'application — `{ consent, decided, accept, decline, reset }`. C'est ce qui permet de conditionner un script de mesure ailleurs que dans le bandeau, et d'offrir un « revenir sur mon choix ». Le hook et le bandeau partagent un magasin branché sur `useSyncExternalStore`, donc restent synchronisés, **y compris entre onglets** (l'événement `storage` est écouté). `getStoredConsent()` est exposé en complément, pour trancher **avant** que React monte
- **Squircles — module `squircle`** : tous les coins arrondis de la librairie sont désormais des **superellipses** et non plus des arcs de cercle. Aucun navigateur ne sait le faire nativement, la forme est donc construite à la main : `squircleClipPath()` génère un `polygon()` dont les points sont ancrés en `calc()` sur le rayon demandé, ce qui la rend indépendante de la taille rendue — aucune mesure JavaScript, aucun `ResizeObserver`, et un fonctionnement identique en `rem`, en `%` ou sur une variable CSS. Le module expose `squircleClipPath`, `squircleSurface`, `squircleClip`, `squircleFill`, `squircleShadow`, `squircleRing`, `insetRadius`, `superellipseCorner` et `squirclePath` (variante SVG, pour les icônes). Les rayons acceptent une valeur unique ou un objet par coin (`topLeft`, `topRight`, `bottomRight`, `bottomLeft`), chaque rayon étant borné à la moitié de la boîte pour empêcher les coins de se croiser
- **`tokens.squircle`** : le réglage de la forme, en un seul endroit — un exposant par famille (`rectangle`, `pill`, `circle`, `dot`) — un exposant ne se transpose pas d’une échelle à l’autre, ce qui se lit bien sur un bouton de 40 px aplatit un point de 15 px, le nombre de segments par coin et l'épaisseur de bordure par défaut. L'exposant est le curseur : 2 donne un cercle, l'infini un angle droit
- **`tokens.shadows.dropLight` / `dropDark`** : la même échelle d'élévation exprimée en `drop-shadow()` plutôt qu'en `box-shadow`, exposée en variables `--canop-drop-shadow-e1` à `e5`. Une ombre portée épouse la forme réellement peinte — donc le squircle — là où `box-shadow` ne sait dessiner qu'un rectangle arrondi. L'échelle a été recalculée pour ce filtre : le flou gaussien d'un `drop-shadow` dilue l'opacité à mesure qu'il s'étend, une conversion à l'identique aurait inversé la progression perçue
- **Composant `Text`** : le corps de texte a enfin un composant. Il expose les rôles typographiques qui n'existaient jusqu'ici que dans les tokens, sans qu'aucun composant ne permette de les atteindre — `lead`, `body-lg`, `body-md`, `body-sm`, `label`, `caption`, `overline`, `metric` et `code`. Chaque variante porte sa taille, sa graisse, son interligne, son crénage et sa balise par défaut (`p`, `span`, `code`), toutes remplaçables par `weight`, `as` et `color`. S'y ajoutent onze tonalités : trois niveaux de hiérarchie branchés sur les couleurs de texte du thème (`default`, `muted`, `subtle`, plus `inherit`) et **les sept familles de la palette** (`primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`), reprises du type `CanopPaletteColorName` déjà utilisé par les autres composants. Le défaut reste `default`, c'est-à-dire la couleur de texte du thème — noir sur fond clair, blanc sur fond sombre, sans configuration. S'y ajoutent enfin deux variantes numériques, `tabularNums` — actif par défaut sur `metric`, pour qu'une valeur qui se rafraîchit ne décale plus la mise en page — et `slashedZero`
- `Heading` : prop `tone`, identique à celle de `Text` — trois niveaux de hiérarchie et les sept familles de la palette, typés et proposés à l'autocomplétion. `color` reste disponible en échappatoire et **prime sur `tone`**. Son défaut passe de `"text.primary"` à `undefined`, mais le rendu par défaut est **strictement inchangé** : `tone="default"` résout sur cette même couleur de texte
- **Crénage optique** : nouveau token `tokens.typography.letterSpacing`, une échelle de neuf valeurs appliquée à **tous** les rôles typographiques. Le crénage se resserre à mesure que la taille monte (`-0.035em` sur `h1`, `-0.006em` sur le corps de texte) et s'ouvre sur les petites tailles et les capitales (`+0.08em` sur `overline`). Les titres et l'échelle applicative n'avaient aucun réglage de crénage : le texte de la librairie prend sa propre allure sans changer de fonte ni d'échelle de tailles
- **Graisses étendues** : `tokens.typography.fontWeight` gagne `light` (300) et `extrabold` (800), soit six graisses. Chivo étant une police **variable** déjà embarquée sur tout l'axe 100–900, ces deux graisses ne coûtent **aucune requête ni aucun octet supplémentaire**
- **`tokens.typography.fontFamilyMono`** : pile monospace système, utilisée par la variante `code` de `Text`. Aucune fonte supplémentaire n'est embarquée
- `StatCard` : la métrique et sa variation passent en chiffres tabulaires — une valeur qui se met à jour ne fait plus danser la carte
- `MultiSelect` : les options acceptent une prop `icon`, rendue à la fois dans la liste déroulante et dans la puce de sélection — parité avec `Select`
- `Icon`, `Dropzone`, `UploadDropZone`, `Slider` : prop `ariaLabel`, qui permet de donner un nom accessible différent du libellé visible (ou d'en donner un quand le composant n'affiche pas de texte)

- **Garde-fou « forme et ombre au même endroit »** : les trois défauts d'ombre de cette version étaient le **même défaut** — la forme prise à un endroit, l'ombre à un autre, et deux silhouettes qui ne coïncident pas. Un test parcourt désormais les composants et échoue si l'un combine un découpage squircle et un `box-shadow` débordant. Il **vérifie aussi qu'il lit bien des fichiers** : un garde-fou qui n'inspecte rien passe toujours, et c'est précisément l'angle mort qui avait laissé filer les trois défauts. Il a trouvé le quatrième dès sa première exécution

- **`PageScaffold` — prop `actionsPlacement` (`"header"` par défaut, `"floating"`), qui range les
  `headerActions` dans le coin haut droit de la coquille, dans les trois modes.** L'en-tête n'est pas
  le seul endroit où une action à la taille d'une icône a sa place : sous `sm`, `PageHeader` passe
  ses actions **en colonne** sous le titre — une seule suffit à épaissir l'en-tête d'autant — et sur
  bureau elles s'alignent à droite, sous le sélecteur de langue qui flotte déjà là. En `"floating"`,
  les mêmes `headerActions` rejoignent donc la pile flottante du mode courant : **sous le déclencheur
  des réglages** en mobile, **sous le sélecteur de langue** en tablette et en bureau. **Un seul jeu
  d'actions, jamais deux** : ce qui part dans la pile est retiré de l'en-tête, le portail n'a rien à
  dupliquer.

  **Une seule prop pour les trois modes, et un seul chemin de code.** Le placement est une décision
  de mise en page, pas une décision de point d'arrêt : deux props — l'une mobile, l'autre bureau —
  auraient obligé le portail à répéter la même intention deux fois, et surtout laissé les deux
  chemins diverger. `PageScaffold` résout donc `"floating"` **une fois**, sans regarder le mode, et
  `Navbar` reçoit la contrepartie `actions`, qu'il **route** vers `NavbarMobileLayout`, `NavbarRail`
  ou `NavbarSidebar` selon son propre mode. La colonne d'actions elle-même — animation d'entrée,
  espacement, centrage — vit dans un `NavbarActionStack` unique que le quai mobile et les utilitaires
  de bureau posent chacun à leur ancrage. Effet de bord bienvenu : la **tablette** n'est plus un
  angle mort. `"floating"` n'y rendait rien, puisque le routage était gardé par le mode mobile
  (`< sm`) alors que l'en-tête compact bascule à `< md` — les actions s'évaporaient entre les deux
  points d'arrêt.

  **Une prop de placement plutôt qu'un routage automatique.** Envoyer `headerActions` dans la pile
  dès qu'elle existe aurait changé le rendu de **toute la flotte** sans qu'aucune signature bouge, et
  surtout cassé les actions qui ne sont pas des boutons d'icône : un bouton à libellé, un champ ou
  une bascule large ne tiennent ni dans une colonne de `2,75rem` ni dans une de `4,5rem`. Le défaut
  `"header"` laisse donc le rendu existant intact, l'adhésion est explicite, sur le modèle de
  `mobileFooterPlacement`.

  **L'empreinte du coin haut droit ne s'élargit pas, et c'est voulu** : de part et d'autre, la pile
  reprend l'ancrage droit de l'élément qu'elle suit **et sa largeur** — `2,75rem` sous l'engrenage,
  `4,5rem` sous le sélecteur, la largeur des utilitaires — donc elle s'allonge vers le bas sans
  jamais élargir `--canop-page-top-right-inset`, que `PageHeader` absorbe déjà. En contrepartie elle
  est prévue pour des actions **à la taille d'une icône** : passé la hauteur de l'en-tête, une pile
  longue flotterait au-dessus du coin haut droit du contenu.

  **En revanche l'empreinte de bureau n'est plus jamais nulle quand des actions y sont posées.**
  Elle valait `0rem` sur un portail **monolingue**, le sélecteur de langue ne rendant rien : la
  gouttière était alors sans objet. Avec des actions dans la même colonne elle en a un, sans quoi les
  actions du portail flotteraient au-dessus de son propre en-tête — exactement le défaut que la
  réserve corrige. La condition devient donc « la colonne est occupée » et non « il y a plusieurs
  langues »

### Corrigé

- **Le garde-fou des ombres signalait tout, et sa liste d'exceptions masquait du code légitime.** Il interdit une ombre débordante sur une surface découpée en squircle — `box-shadow` ne sait dessiner qu'un rectangle à coins circulaires — mais **son exemption de `none` et d'`inset` ne fonctionnait pas** : l'espace placé avant la parenthèse négative revenait en arrière et l'annulait, si bien qu'un `boxShadow: "none"` était signalé exactement comme une ombre pleine. Les deux fichiers concernés avaient donc été inscrits sur la liste des exceptions, où ils tenaient lieu de correctif. L'espace passe **dans** la parenthèse, `mapChrome` sort de la liste, et le garde-fou a été retourné dans les deux sens : il laisse passer `none` et `inset`, il signale une ombre pleine.
- **`theme` n'importe plus un fichier de `components`.** `createCanopTheme` tirait `mapChromeSx` de `components/Map/mapChrome`, une inversion de couche sans effet à l'exécution — ce fichier n'est que du CSS et n'importe pas maplibre — mais qui plaçait une pièce du thème dans un composant. Le fichier passe sous `theme/`, et le garde-fou des ombres regarde désormais **les deux racines** : sans quoi le fichier serait sorti de sa vue en même temps que de `components`
- **Le sélecteur de langue recouvrait les actions de l'en-tête de page, sur tablette et bureau.**
  `NavbarUtilities` — le sélecteur en haut à droite, la bascule de thème en bas à droite — est ancré
  en `absolute` sur la **racine de la coquille**, celle qui contient la barre de navigation **et** le
  contenu, et non sur la colonne de navigation. Son `right: 1rem` se compte donc depuis le bord droit
  de la fenêtre : le sélecteur flotte au-dessus du coin haut droit du **contenu**, exactement là où
  `PageHeader` aligne ses `headerActions`, et son `zIndex` de barre d'application le pose par-dessus.
  Aucun portail passant `headerActions` n'y échappait — le `SoundToggle` de DeparteMental n'a fait
  que le rendre visible.

  **Le placement des utilitaires ne change pas** : il est voulu, la colonne de la barre étant trop
  étroite pour les accueillir en mode rail. C'est leur **empreinte** qui est désormais annoncée par
  la coquille en propriété personnalisée (`--canop-page-top-right-inset`), sur le modèle de
  `--canop-page-bottom-inset` posé pour la barre mobile, et que `PageHeader` absorbe dans sa
  gouttière droite : `max(gouttière, empreinte)`, donc la gouttière habituelle partout où rien n'est
  réservé, et jamais deux fois la réserve. **Portée sur la flotte** : tout en-tête rendu sous
  `NavbarRail` ou `NavbarSidebar` passe de `2,5rem` à `6,5rem` de gouttière droite et voit ses
  actions se décaler d'autant vers la gauche — sauf sur un portail **monolingue**, où le sélecteur
  ne rend rien : l'empreinte y vaut `0rem` et rien ne bouge. Aucune signature ne change.

- **Le bouton engrenage recouvrait le titre de l'en-tête, sur mobile.** Même défaut, même remède :
  le déclencheur du `SettingsMenu` est `fixed` en haut à droite de la fenêtre, avec un `zIndex` de
  barre d'application, donc par-dessus le coin haut droit de l'en-tête — le **titre** cette fois, et
  non les actions, puisque `PageHeader` passe ses actions en colonne sous `sm`. `NavbarMobileLayout`
  annonce désormais l'empreinte du bouton dans la même propriété personnalisée
  (`--canop-page-top-right-inset`), que `PageHeader` absorbe déjà en `max(gouttière, empreinte)` :
  aucune seconde mécanique n'est introduite. Les cotes du bouton (`2,75rem` de large, ancré à
  `0,75rem` du bord) rejoignent les autres cotes de la barre dans `navbarStyles.ts`, d'où
  `SettingsMenu` les lit — elles n'étaient écrites qu'à un seul endroit, elles le restent.

  **Rupture silencieuse, portée sur toute la flotte** : tout en-tête rendu sous `NavbarMobileLayout`
  passe de `1rem` à `4,25rem` de gouttière droite (zone sûre en plus), et son titre se resserre
  d'autant. Contrairement au bureau, **aucun portail n'y échappe** : l'engrenage est rendu sans
  condition, là où le sélecteur de langue s'efface en monolingue — l'empreinte n'est donc jamais
  nulle. Aucune signature ne change.

- **Le fond de page s'arrêtait une hauteur de barre trop haut sur mobile.** `PageScaffold` pose sa
  couche de fond en `position: absolute; inset: 0` : un `inset` se mesure sur la **boîte de contenu**
  du parent positionné, donc le rembourrage bas que `NavbarMobileLayout` réserve à la barre
  flottante — `4rem + 1rem + env(safe-area-inset-bottom)` — retranchait autant au fond. La canopée
  s'arrêtait net au-dessus de la barre, alors que la barre flotte précisément pour qu'on la voie
  dessous. La réserve est désormais **annoncée** en propriété personnalisée
  (`--canop-page-bottom-inset`) par la coquille mobile, et la couche de contenu la **traverse** :
  marge basse négative pour rendre la hauteur à la boîte, rembourrage bas pour la reprendre au
  contenu. Le fond descend jusqu'au bas de la fenêtre, le contenu ne passe pas sous la barre, et
  **rien ne change sur bureau** — la variable n'y est pas posée, sa valeur de repli vaut `0rem`

- **Les cartes disparaissaient au bord haut de la barre mobile au lieu de passer dessous, et la
  bande visible sous la barre se lisait comme une seconde épaisseur de fond.** Suite directe du
  correctif ci-dessus, et la même réserve mal placée : la couche de contenu traversait bien la
  réserve pour son fond, mais la **reprenait aussitôt en rembourrage**, si bien que la zone de
  défilement s'arrêtait exactement au bord haut de la barre. Ce qui défilait y était **coupé**, et la
  bande de fenêtre sous la barre flottante — celle qui existe précisément parce que la barre flotte à
  `1rem` du bas — ne montrait plus que le fond de page. Deux fonds à l'œil, l'un derrière les cartes,
  l'autre sous la barre, alors qu'il n'y en a qu'un.

  **La réserve descend d'un cran, du contenant au contenu.** `bleedThroughPageBottom` ne pose plus
  que la marge négative : la couche de contenu descend **entièrement** jusqu'au bas de la fenêtre,
  fond et premier plan, donc la zone de défilement aussi. La réserve n'est pas perdue pour autant,
  c'est ce qui **défile** qui la reprend — `PageContent` rembourre sa colonne de
  `var(--canop-page-bottom-inset, 0rem)` — et le dernier élément reste atteignable au-dessus de la
  barre. Rembourrer la boîte de défilement ou son contenu laisse la **même** hauteur libre en fin de
  course ; seule la seconde laisse les cartes voyager sous la barre puis reparaître dessous. **Le
  fond n'est pas retouché** : en `absolute; inset: 0` il se mesure sur la boîte de contenu du parent,
  que la marge négative seule suffit à mener jusqu'en bas — le correctif ci-dessus tient donc
  toujours. **Rien ne change sur bureau**, la variable n'y étant pas posée. **Rupture silencieuse**
  pour un portail qui rend son propre conteneur défilant au lieu de `PageContent` : la réserve étant
  désormais portée par `PageContent`, son contenu passera sous la barre sans rien pour l'en garder

- **Le panneau des réglages prenait toute la largeur de la page.** Même défaut d'ordre de spread que
  la barre mobile et le bouton engrenage, et il se lit à l'œil de la même façon : le `sx` du papier
  du `Popover` spreadait `squircleSurface()` **après** que le thème ait posé `position: "absolute"`,
  or la fabrique renvoie `position: "relative"` par défaut. Le papier retombait donc **dans le
  flux**, et un bloc en flux prend toute la largeur de son conteneur — ici la racine du modal, soit
  la fenêtre entière. Le `maxWidth: calc(100% - 32px)` de MUI ne pouvait rien y faire : il **borne**
  une largeur, il ne la fait pas s'ajuster au contenu, et l'ajustement au contenu n'existe que hors
  du flux. Le papier redevient `absolute`, donc libre de se fermer sur ses composants.

  **Suite : il restait bien plus large que ce qu'il contient.** Une borne plafonne, elle ne mesure
  pas — à `min(20rem, calc(100% - 2rem))` elle laissait `320 px` à trois commandes compactes, alors
  que le contenu du panneau est **entièrement de largeur fixe** : un `settingsFooter` bavard ne peut
  pas l'élargir, puisque le panneau n'en rend que le bouton d'informations légales, jamais le texte.
  Le papier **déclare désormais sa largeur**, `width: max-content` : il se ferme sur sa rangée la
  plus large — les deux boutons de lien et leur écart, `5rem` — soit `7rem` de panneau, rembourrage
  compris, contre `20rem` avant. Les trois commandes s'alignent sur cette même mesure au lieu des
  `3,625rem` qu'elles se donnaient chacune, et la borne restante, `calc(100% - 2rem)`, ne joue plus
  que sur un écran plus étroit que le contenu, où celui-ci s'enroule au lieu de déborder

- **L'ondulation d'appui restait ronde sur un bouton d'icône en squircle.** Les `styleOverrides` de
  `MuiIconButton` découpaient le calque d'état **et** `.MuiTouchRipple-root` sur un disque en dur.
  Le `sx` d'un bouton reprend bien la main sur le premier — il est appliqué en dernier — mais
  **jamais sur le second**, qu'aucun composant ne nomme. Au repos et au survol le bouton était donc
  un squircle, alors que sur un écran tactile le seul retour visible est l'ondulation : le bouton
  des réglages **se lisait rond sur mobile**, et lui seul le montrait puisqu'il est le seul bouton
  d'icône non circulaire posé à découvert. `squircleSurface()` publie désormais sa silhouette dans
  `--canop-squircle-clip`, que les deux calques du thème consomment. **Le thème remet la variable au
  disque sur chaque racine de bouton** : sans cette remise à zéro, un bouton d'icône posé dans une
  carte aurait hérité du découpage de la carte, à son rayon. **Portée sur la flotte** : tout bouton
  d'icône qui se donne une forme par `squircleSurface` voit son ondulation et son calque d'état la
  suivre — les boutons circulaires (`IconActionButton`) sont inchangés

- **La barre de navigation mobile et le bouton de réglages n'étaient jamais `fixed`** — ils
  restaient dans le flux, et le défaut venait d'un **ordre de spread**. `squircleSurface()` renvoie
  `position: "relative"` : spreadé **après** un `position: "fixed"`, il l'écrase sans rien signaler,
  ni au compilateur ni au navigateur. Mesuré à l'écran avant correction : la barre prenait la
  **largeur entière du viewport** en partant de `x = 18`, soit une gouttière de 18 px à gauche et un
  débordement de 18 px à droite à toutes les largeurs mobiles, et la dernière tuile était **rognée de
  7,6 px sous 320 px** de large. Le bouton engrenage, lui, sortait de **27 % à gauche de l'écran**
  (un `right` en positionnement relatif décale vers la gauche) et **réservait une bande de 49,5 px**
  en haut de la colonne, qui repoussait tout le contenu vers le bas. Contre-preuve interne : le
  `CookieBanner`, qui écrit son `position: "fixed"` **après** le spread, n'a jamais eu le défaut.
  Vérifié en forçant `position: fixed` au navigateur : gouttières symétriques 18/18 et plus aucun
  débordement.

  **`squircleSurface` reçoit une option `position`** (`"relative"` par défaut, donc **aucun appelant
  existant ne change de rendu** — ils sont 41), restreinte aux valeurs **positionnées**
  (`relative`, `absolute`, `fixed`, `sticky`) : le helper a besoin d'un bloc conteneur pour ses
  calques `::before` / `::after`, `static` le casserait silencieusement. Les trois sites déclarent
  désormais leur positionnement **une seule fois, dans l'appel**, ce qui rend l'écrasement
  impossible par construction : `NavbarMobileBar`, `SettingsMenu`, et le conteneur de
  `sidebarWidget` de `NavbarMobileLayout` — ce dernier était un **défaut latent**, non déclenché
  faute de portail passant la prop. Le retrait pur et simple du `position: "relative"` du helper a
  été écarté : la plupart des 41 appelants comptent dessus pour ancrer leurs calques.

  **Conséquence traitée dans la foulée** : une barre réellement `fixed` sort du flux et recouvrait
  le bas du contenu. `NavbarMobileLayout` réserve la hauteur de la barre sous son `<main>`
  (`4rem` de barre + `1rem` de retrait + `env(safe-area-inset-bottom)`). Les trois cotes de la barre
  — son décalage bas, l'espace réservé et le décalage du `sidebarWidget` — sont dérivées des **mêmes
  constantes** dans `navbarStyles`, à valeur calculée identique aux littéraux qu'elles remplacent :
  elles ne peuvent plus diverger.

- **`IconActionButton` n'avait aucun indicateur de focus** — et `SoundToggle` non plus, qui lui
  délègue tout. Le bouton correspondait bien à `:focus-visible`, mais restait **strictement
  identique à l'œil** : mesuré au navigateur, `outline: none 0px`, `box-shadow: none`, même fond
  avant et après, quand les autres boutons de la même page recevaient `outline: solid 2px`. Il pose
  désormais le `focusRingSx` partagé, celui de `Button`, `Pressable`, `Card` interactive,
  `Breadcrumb`, `SegmentedControl` et `ThemeToggle` — le seul composant à ne pas l'appliquer était
  celui-là. Le défaut portait donc sur **tout ce qui est bâti dessus** : les cinq boutons d'action
  (`AddButton`, `EditButton`, `ApproveButton`, `DeleteButton`, `SaveButton`), les flèches du
  `Carousel`, les commandes de zoom de `SvgMap`, la barre de débordement, et `SoundToggle` — qui est
  souvent le **premier arrêt de tabulation de la page**. L'anneau se trace hors de la boîte, donc le
  découpage en squircle ne le rogne pas.
- **`package-lock.json` régénéré : la CI de publication reconstruisait l'arbre d'avant les deux
  correctifs d'empaquetage.** Le verrou déclarait toujours `framer-motion` en dépendance de premier
  niveau de la librairie, et n'avait jamais enregistré la déclaration de `vite` en dépendance pair
  du correctif précédent. Or un `npm ci` — la commande de la CI, pas celle du poste — n'installe
  que ce que le verrou décrit : les deux correctifs n'auraient donc existé que chez les
  développeurs, et le paquet publié aurait été construit sur l'arbre qu'ils viennent justement de
  corriger. **Aucune version résolue ne bouge** : la régénération ne fait que reclasser des
  dépendances déjà installées.
- **`ProgressBar` — `ariaLabel` était accepté par le type puis ignoré en barre simple.** La prop
  existait, était typée, documentée, et ne descendait qu'au rendu **segmenté** : `ProgressBarSingle`
  posait `aria-label={label}`, c'est-à-dire `undefined` dès qu'aucun libellé visible n'était fourni.
  Une barre sans en-tête exposait donc un `role="progressbar"` **sans nom accessible** — dans tous
  les portails, puisque c'est le rendu par défaut — et un lecteur d'écran n'annonçait qu'un
  pourcentage sans dire de quoi. Le nom vaut désormais `ariaLabel ?? label`, comme partout ailleurs
  dans la librairie. **Une prop qui existe et qui ne fait rien** ne se signale ni au compilateur, ni
  à l'appelant, ni au test qui la passe sans relire ce qui sort.
- **`Pressable` n'avait aucun état d'appui** : la surface ne bougeait pas sous le doigt, alors que
  `Card` interactive s'enfonce déjà à `scale(0.99)` et `Button` à `scale(0.97)`. Le retour tactile
  manquait donc partout où `Pressable` sert — pastilles de couleur, tuiles, choix de questionnaire —
  et c'est là qu'il compte le plus : une surface **sans apparence** n'a rien d'autre pour accuser
  réception du clic. Elle descend à `0.97`, la valeur de `Button`. Une surface **sélectionnée** part
  de `1.04` et s'enfonce dans la même proportion, jusqu'à `1.01` : la ramener à `0.97` la ferait
  passer **sous** sa taille de repos, ce qui se lit comme un décrochage et non comme un appui. Le
  mouvement porte sur `transform` seul, et **ni la transition ni l'état d'appui ne sont posés en
  mouvement réduit**, pas plus que sur une surface désactivée, qui n'a rien à accuser.
- **`Choice` — le verdict se délavait à l'instant où il tombait.** Verrouiller les réponses est
  exactement ce qu'on fait pendant la fenêtre de feedback, et l'atténuation des surfaces désactivées
  héritée de `Pressable` emportait alors **la teinte du verdict et sa marque cochée ou barrée** — la
  couleur et le signe que ce composant existe pour montrer, effacés de moitié sur la seule vue où
  ils ont quelque chose à dire. `Choice` ne l'applique plus qu'aux réponses restées neutres, qui
  sont bien hors course.
- **Le sous-chemin `canopui/vite` déclare enfin `vite` en dépendance pair.** `dist/vite.d.ts` importe `Plugin` de `vite`, mais rien ne l'annonçait — ni `peerDependencies`, ni `peerDependenciesMeta`. Un consommateur n'avait donc aucun moyen de **dédoublonner** : son gestionnaire de paquets était libre d'installer un second `vite` sous la librairie, et TypeScript refusait le greffon par un **TS2769** dans le `vite.config.ts` du portail, en comparant deux classes `Plugin` que seul distingue leur champ privé `_pluginContextMap` — **alors même que les deux côtés étaient sur la même version de Vite**, ce qui rend le message parfaitement incompréhensible sur le moment. La dépendance est déclarée **optionnelle**, à l'image de `maplibre-gl` : le sous-chemin l'est aussi, et un portail qui n'appelle pas `canopyVideo` n'a pas à installer Vite pour autant.
- **Cookie de retour marqué `Secure` sur HTTPS.** `buildLoginUrl` l'écrivait sans, si bien qu'une requête en clair vers le même hôte l'aurait emporté. La valeur n'est pas un jeton mais l'adresse de la page quittée — l'enjeu est la confidentialité de la navigation, pas un vol de session. L'attribut n'est posé **que sur HTTPS** : inconditionnel, il rendrait le cookie inécrivable en développement, où tout tient sur `http://localhost`, et casserait le retour chez les seuls développeurs. Les deux branches sont testées.
- **La surface de types publiée fond de 1 186 Ko à 828 Ko.** `logoutButtonSx` et `navbarTileSx` n'annonçaient pas leur type de retour : TypeScript inlinait donc le `CSSObject` entièrement déplié, csstype compris, dans les déclarations — **178 Ko et 177 Ko à elles deux**, soit 30 % de tous les types du paquet. Un `: CSSObject` les ramène à une ligne, et allège le typage de tous les consommateurs.
- **`LegalLinks` n'importe plus le baril `auth`** mais le module `auth/navigation` dont il tire son unique constructeur d'URL. Le baril lui amenait les gardes de routes et le contexte utilisateur dans son graphe d'imports.
- **Bouton d'icône, variante `secondary`** : elle n'appliquait pas la règle du bouton plein, si bien que les deux composants affichaient deux apparences différentes sous le même nom. `Button` descend au ton foncé en thème clair pour y porter du blanc, et remonte au ton clair en thème sombre pour y porter un glyphe foncé ; `IconActionButton` restait sur `secondary.main` avec un glyphe foncé dans les deux cas. La règle du bouton plein est la bonne, et pour une raison mesurée : le vert de `secondary.main` ne vaut que **2,98:1** avec du blanc, sous le seuil de 3:1 des éléments non textuels, alors que le ton foncé le porte à **4,94:1**.
- **`CanopyBackground` — fond figé sur les navigateurs qui refusent le VP9** : la scène restait sur son image d'affiche, sans erreur visible. Opera GX annonce `canPlayType('video/webm; codecs="vp9")` à `probably` puis **échoue au décodage** (`MEDIA_ERR_DECODE`), et un navigateur ne passe **jamais** à la `<source>` suivante après une erreur de décodage : le repli MP4 déjà présent ne servait donc à rien. Pire, Opera GX **renseigne `video.error` sans émettre l'évènement `error`** — vérifié avec un écouteur en phase de capture sur le document, qui n'a rien reçu, donc un `onError` seul ne peut pas s'en apercevoir. Le composant écoute désormais l'évènement **et** surveille `video.error` par intervalle tant que le lecteur n'a pas avancé ; à la première défaillance il ne propose plus que le MP4, ce qui remonte le lecteur sur une source lisible. La surveillance s'arrête dès que la vidéo joue, le codec étant alors validé par les faits
- **`DataTable` — l'en-tête figée était transparente** : les lignes défilaient **derrière elle** et son texte se superposait au leur. Le rectangle de fondu peint le cachait en partie ; en le retirant, le défaut est apparu — une en-tête figée qu'on voit à travers est cassée, fondu ou pas. Elle reçoit désormais **sa propre surface** : un unique calque collé en haut du conteneur, derrière les cellules. Un calque unique et non un fond par cellule, sans quoi les joints visibles à certains zooms réapparaîtraient — le même défaut que celui des lignes
- **`DataTable` — une barre de séparation verticale apparaissait entre deux colonnes**, à certains niveaux de zoom seulement, et l'ajout d'une colonne la rendait visible — d'où son apparition avec `editable`. Ce n'était pas une bordure mais un **joint** : la surface d'une ligne était peinte **cellule par cellule**, et chaque bord adjacent tombait, selon le zoom, sur un pixel fractionnaire où un cheveu de fond passait entre deux cellules. Une colonne de plus ajoutait un joint de plus. La ligne est désormais peinte **en une seule fois**, par `squircleSurface` : un seul calque n'a aucun joint, à aucun zoom. Les cellules ne découpent plus rien et deviennent transparentes, et la forme comme l'ombre se décident au même endroit — exactement la règle que le nouveau garde-fou protege
- **`DataTable` — le lisere de survol au glisser-déposer était invisible** : c'était un `box-shadow` en `inset` posé sur la ligne, alors que les cellules peignent leur propre fond **par-dessus** — il était donc masqué par construction. Le survol se signale désormais par une teinte des cellules, qui n'a aucune silhouette à accorder avec leur découpage en squircle
- **`DataTable` — l'ombre des lignes manquait aux angles** : elle était un `box-shadow` posé sur la ligne, dont la silhouette est un rectangle à coins **circulaires**, tandis que la surface visible est découpée en **squircle** sur les cellules (exposant 4, donc nettement plus carré qu'un arc de cercle). Un squircle pousse plus loin dans le coin : la surface dépassait donc l'ombre précisément aux angles, où celle-ci disparaissait, alors qu'elle restait visible le long des bords droits. L'ombre passe en **`drop-shadow`**, qui épouse la forme réellement peinte. **Deux défauts en un** : elle était aussi écrite à la main (`rgba(28, 30, 33, 0.16)`) au lieu de venir de l'échelle d'élévation, donc **figée en sombre et insensible au thème** ; elle vient désormais de `--canop-drop-shadow-e1`. Le fondu piloté au défilement animant `filter`, l'ombre est rappelée dans chaque étape de l'animation, sans quoi celle-ci l'effacerait
- **`Carousel` — le balayage ne fonctionnait pas au doigt** : il ne manquait qu'une déclaration, `touch-action`. Sans elle le navigateur s'approprie le geste dès que le doigt bouge et envoie **`pointercancel` à la place de `pointerup`** : le carrousel n'apprenait donc jamais la fin du geste. La fenêtre annonce désormais l'axe qu'elle prend en charge — `pan-y` à l'horizontale, `pan-x` à la verticale — en laissant au navigateur celui du défilement de la page. `pointercancel` est aussi écouté, sans quoi une origine périmée servirait au geste suivant
- **`Carousel` — l'ombre des cartes n'apparaissait que dans les coins** : la fenêtre rogne ce qui dépasse (`overflow: hidden`, indispensable au glissement), et une carte pleine largeur voyait son ombre portée coupée sur tous ses bords droits. Il n'en restait visible que les coins, là où le squircle rentre et laisse un peu de place à l'intérieur du découpage. Chaque carte reçoit désormais une **gouttière** où son ombre tient. Le calcul de translation n'en souffre pas : `100 %` porte sur la boîte de bordure, qui reste la largeur de la fenêtre
- **`Carousel` — barres de pagination impossibles à viser** : elles mesuraient 4 px de haut et **étaient elles-mêmes le bouton**. La zone cliquable passe sur un bouton transparent rembourré, la barre n'étant plus que son rendu : elle reste fine à l'œil tandis que la cible atteint 2,75 rem au doigt — les 44 px de référence — et reste compacte à la souris. La barre visible est aussi un peu plus épaisse et plus longue
- **`Button` — la variante `secondary` ne suivait pas le thème** : son fond et son texte passaient par des variables maison, `--canop-button-secondary-fill`, `-fill-hover` et `-text`, **jamais émises dans la feuille de style**. Le bouton vivait donc en permanence sur ses valeurs de repli en dur, identiques en clair et en sombre. Le mécanisme entier était inerte, et **quatre tests le validaient à vide** : ils lisaient l'objet thème, pas le CSS produit. Le fond et le texte viennent maintenant des variables de palette de MUI, qui existent réellement, le mode étant lu comme le font déjà `useShapeBackground` et `useSidePanel`. Les trois variables maison sont supprimées, et les tests reformulés sur la propriété qu'ils prétendaient protéger : le contraste entre le fond et le texte, mesuré ≥ 4,5:1 dans les deux thèmes
- **`Icon` — `className` n'était pas propagé** : **cause réelle de l'icône collée au bord dans `MultiSelect`**. Les composants MUI qui acceptent une icône la **clonent pour y injecter leur propre classe** — `Chip` avec `MuiChip-icon`, et de même `Badge` ou `Tab`. `Icon` n'acceptant pas `className`, la classe était jetée : l'icône perdait **toute** marge et se retrouvait à zéro du bord, pas à 5 px. Aucun réglage de marge sur `.MuiChip-icon` ne pouvait donc avoir d'effet, puisque la classe n'existait pas dans le rendu. `Icon` accepte et transmet désormais `className`, ce qui répare du même coup tout emplacement MUI à icône de la flotte. **Le défaut était invisible en test** : les cas écrits passaient un `<span>` nu, qui accepte `className`, là où l'usage réel passe un `<Icon>`
- **`MultiSelect` — icône de puce collée au bord** : MUI pose l'icône d'une puce à **5 px** du bord et sa croix de suppression à 5 px de l'autre, alors que le libellé d'une puce **sans** icône est à **12 px**. Une puce à icône ne s'alignait donc pas sur ses voisines dans une liste, et son icône paraissait collée. Les deux reçoivent le **même retrait que le texte**, avec 8 px d'écart au libellé. Les marges négatives de MUI compensent le rembourrage du libellé, il faut donc les redonner explicitement plutôt que seulement augmenter la marge gauche, sans quoi l'écart interne se creuserait d'autant
- **`Spinner` — il se figeait en mouvement réduit** : le thème neutralise toute animation dans ce mode (`animation-iteration-count: 1 !important` sur `*`), ce qui arrêtait la roue sur un arc immobile, définitivement. **Un indicateur de chargement à l'arrêt se lit comme une page cassée** : le défaut était pire que l'absence d'indicateur, et invisible en test puisqu'il ne se manifeste que si la préférence est activée. Le mouvement est ici **fonctionnel et non décoratif**, il est donc rendu à la roue — mais **deux fois plus lent**, ce qui respecte l'intention de la préférence au lieu de l'ignorer
- **`Spinner` — libellé accessible figé en français** : `ariaLabel` valait par défaut la chaîne `"Chargement"`, en dur. Un portail en anglais annonçait donc « Chargement ». Le libellé passe par la clé `canop.spinner.loading`, traduite. C'est le pendant du correctif déjà apporté à `LanguageSelector` dans cette même version
- `Spinner` : `fullPage` mesurait la fenêtre en `100vh`, qui inclut les barres mobiles escamotables et provoque un débordement sur téléphone. Passe en `100dvh`
- **`SidePanel` sur téléphone — ergonomie de la feuille glissante** : la feuille montait du bas mais le geste était capricieux, et elle « redescendait toute seule ». Quatre causes distinctes, toutes corrigées. **Le deplacement n'était pas fluide** parce que la feuille était bornée des deux côtés (`dragConstraints: { top: 0, bottom: 0 }`) : elle ne bougeait qu'élastiquement, donc en retard sur le doigt et de façon non linéaire. La borne basse est retirée, la feuille suit le doigt **au pixel** vers le bas et ne résiste que vers le haut, où il n'y a rien au-dessus de sa position de repos. **Elle se repliait à mi-course** : un premier glissement vers le bas la mettait dans un état intermédiaire au lieu de la fermer, et il fallait recommencer. Cet état est **supprimé** — un seul glissement ferme. Il était de surcroît incohérent : dans l'état replié, `dragElastic.bottom` valait 0, donc glisser vers le bas fermait la feuille **sans aucun retour visuel**. **Le seuil ne tenait qu'à la distance ou à la vitesse, séparément** ; il compare désormais une **position projetée** (`offset + vélocité × 0,2 s`) à 96 px, ce qui rend une chiquenaude courte mais rapide aussi concluante qu'un glissement long, et retient un geste que le doigt a freiné avant de lâcher. **La zone de saisie était la barrette seule**, haute de cinq pixels : tout l'en-tête est maintenant saisissable, le bouton de fermeture restant cliquable. **Et surtout, la feuille ne revient plus d'elle-même** : au relâchement elle **reste exactement où le doigt l'a laissée**, y compris à mi-hauteur. `dragSnapToOrigin` est retiré, l'inertie est coupée (`dragMomentum: false`), la butée haute est franche et non élastique (`dragElastic` à 0 des deux côtés) — un élastique revient en arrière, ce qui se lit comme un mouvement spontané. L'ouverture n'a pas non plus de dépassement, pour la même raison : une feuille qui monte trop haut avant de redescendre donne à voir le défaut qu'on vient de corriger
- `SidePanel` : le défilement du contenu ne s'enchaîne plus sur la page derrière la feuille (`overscroll-behavior: contain`). Arriver en bout de course faisait défiler l'arrière-plan, ce qui donnait l'impression que la feuille glissait toute seule
- **Boutons `ghost` — texte invisible** : la variante peignait un **aplat plein** de la couleur primaire, texte primaire compris, donc illisible. `squircleSurface` recouvre le calque de bordure par le calque de fond rentré d'un pixel : le procédé suppose un fond opaque, et `ghost` a un fond transparent. Nouveau générateur `squircleRingPath()`, qui décrit **uniquement l'anneau** — contour extérieur, puis contour intérieur parcouru en sens inverse, la couture entre les deux étant empruntée deux fois en sens opposé donc d'aire nulle. `squircleSurface` y bascule automatiquement dès qu'une bordure est demandée sur un fond transparent : l'intérieur redevient réellement traversant, sur n'importe quelle surface. Le survol des variantes bordées peint désormais le calque intérieur, jusqu'ici inerte
- `Select`, `MultiSelect` et `LanguageSelector` : ces trois champs n'exposaient **aucun nom accessible** lorsqu'ils étaient utilisés sans `label` visible — un lecteur d'écran annonçait un champ anonyme. `Select` et `MultiSelect` acceptent désormais `ariaLabel`, et `LanguageSelector` porte un nom accessible traduit (`canop.language.label`) sans configuration
- `NavbarRail` : le bouton de réglages du rail était rendu **même sans `userName` ni `onLogout`** et ouvrait un popover vide, dans lequel le focus clavier restait piégé sans contenu à atteindre. Il n'est plus rendu quand aucune des deux props n'est fournie
- `DataTable` : les en-têtes de colonnes triables n'exposaient pas `aria-sort` — l'état de tri était invisible pour les technologies d'assistance. Chaque en-tête triable porte désormais `aria-sort` (`ascending` / `descending` / `none`)
- `DataTable` : la **sélection de plage au Maj+clic** ne sélectionnait rien. Le `mousedown` remonte jusqu'au conteneur, dont la branche non additive réinitialisait l'ancre de sélection avant que le clic ne puisse s'en servir : la plage était systématiquement vide. Seule la réinitialisation est désormais conditionnée, le lasso démarre de la même façon qu'avant. Le geste n'était couvert par aucun test, ce qui rendait le bug invisible
- `prefers-reduced-motion` est réellement respecté : le thème pose un reset global (`animation`, `transition` et `scroll-behavior` neutralisés) via `CssBaseline`, en complément des animations déjà pilotées par `useReducedMotion`. Les animations `motion` de la librairie ne s'exécutent plus chez les utilisateurs qui ont demandé un mouvement réduit
- **Police auto-hébergée** : la famille Chivo est embarquée dans le paquet (`woff2` latin et latin-ext, licence OFL incluse) et déclarée en `@font-face` dans `styles.css`. `canopui/styles.css` n'émet **plus d'`@import` vers `fonts.googleapis.com`** : plus de dépendance réseau tierce au premier rendu, plus de requête vers Google depuis les portails, et rendu correct en environnement isolé

### Supprimé

- **Le paquet `motion` est remplacé par `framer-motion`, dont il n'était qu'une redirection** : son entrée `motion/react` ne contient rien d'autre qu'un `export * from "framer-motion"`. Deux paquets étaient donc installés, 7 Mo au total, pour un seul moteur d'animation — celui du second. Les 36 imports de la librairie passent en `framer-motion`, et `motion` disparaît de l'arbre de dépendances. Aucun changement d'API : les deux paquets exposent la même, à la même version. À savoir si la question se repose : `motion` est le **nouveau nom** du projet, mais c'est aujourd'hui `framer-motion` qui porte le code et `motion` qui pointe vers lui ; le jour où la direction s'inverse, c'est la dépendance qu'il faudra retourner
- **`DataTable` — la prop `showGradients` est retirée** : **Breaking**, le compilateur la signale. Elle affichait des fondus haut et bas sur le conteneur défilant, par un rectangle rempli d'un `linear-gradient(background.paper → transparent)` — qui **supposait la couleur du fond** et se voyait dès que le tableau n'était pas posé sur du papier. Un `mask-image` a été essayé à la place : il supprime bien toute supposition de couleur, mais il bute sur l'en-tête figée, qui vit **dans** le conteneur défilant et se ferait effacer avec le reste. Un fondu propre demande de sortir l'en-tête du corps défilant, soit une refonte du DOM du tableau pour un effet accessoire. La prop disparaît donc, ainsi que l'apparition en fondu des lignes qui l'accompagnait — elle reposait sur `animation-timeline: view()`, disponible sur Chromium seul, et se lisait comme une trace floue. **Le correctif qu'elles cachaient reste** : l'en-tête figée a désormais sa propre surface
- `ChI18nContext` et `ChThemeContext` ne sont plus exportés : ces objets `Context` étaient un détail d'implémentation et leur exposition permettait de monter un provider concurrent ou de lire un contexte non initialisé. Passer par `useCanopTheme()` et `useTranslation()`, qui lèvent une erreur explicite hors provider. Les **types** associés (`CanopThemeContextValue`, `CanopI18nContextValue`) restent exportés

### Vitrine

- **Audit de la documentation avant parution** : les tables de props de la vitrine sont écrites à la main, donc elles dérivent en silence. Deux audits ont été passés — les props publiques déclarées face aux lignes documentées, puis l'inverse — et ont trouvé **61 props publiques non documentées sur 22 composants**, dont dix composants entièrement neufs en 3.0, ainsi que **deux lignes fantômes** : `PageContent` documentait `settingsFooter` et `hideUtilitiesOnMobile`, qui appartiennent à `Navbar` et `PageScaffold` et n'ont jamais été des props de `PageContent`. Tout est comblé, les deux fantômes retirés. Et l'audit **devient un test** (`vitrine/src/registry/docCoverage.test.ts`) : la suite échoue désormais sur une prop publique qu'aucune page ne documente, ou sur un composant exporté sans page, en la nommant. C'est la seule chose qui distingue une table complète d'une table plausible — vérifié en sens inverse, en déclarant une prop bidon pour voir le test rougir
- **Nouvelle page composant `LegalLinks`** (`/components/legal-links`) : le composant était **exporté publiquement sans aucune page**. Les deux liens et leur séparateur, la forme empilée pour un pied de page mobile, et `renderLink` — la porte par laquelle le portail qui héberge lui-même les conditions navigue par son routeur au lieu de recharger une URL absolue. `LEGAL_NOTICE_ANCHOR` y est montrée, puisque c'est elle qui vivait en dur dans chaque portail
- **Page composant `Countdown` — le composant y manquait** : la page nommée d'après le composant ne parlait que de `useCountdown`, et les props du composant n'existaient qu'en sous-ensemble sur la page `Game`. `Countdown` a désormais sa démonstration et sa table complète là où on la cherche — seuil d'urgence, format, couleur et icône comprises
- **`PropsTable` accepte un intitulé** : une page qui empile plusieurs tables ne disait pas laquelle appartient à quoi — la page `Game` en empilait six. Les pages `Game`, `Countdown`, `Sound` et `SVG map` intitulent les leurs. Les tables de `SoundToggle` et de `SvgMapControls`, absentes, sont écrites. Les autres pages, elles, intitulaient déjà chaque table par sa propre section — seules `Clipboard` et `Local store` en empilaient deux sans étiquette, et elles portent désormais le nom du hook ou du type qu'elles décrivent
- **Page Installation — le greffon `canopyVideo` n'y était pas** : il est pourtant obligatoire depuis la 3.0, `PageScaffold` étant habillé par défaut par la canopée. La page donne la ligne de configuration Vite, dit pourquoi les scènes ne peuvent pas passer par le bundle du consommateur, et prévient des deux échecs — fond noir sans le greffon, et config Vite illisible pour un portail qui n'est pas en modules ES
- **Page composant `Heading` — section « Taille par point de rupture »** : le titre « Entraînement » change d'échelle quand on rétrécit la fenêtre, et la prose dit pourquoi la question se pose — en Titan One, un `level={2}` sans `size` fait déborder un mot d'une carte de téléphone. La table d'API porte la nouvelle forme de `size`.
- **Page composant `SVG map` — une seconde table d'API, celle d'une région** : `id`, `path`, `name` et le nouveau `ariaLabel`, avec l'ordre de résolution du nom accessible et le piège qu'il recouvre — retirer `name` pour taire l'infobulle fait annoncer l'`id` par le lecteur d'écran.
- **Page composant `i18n` — section « Pluriel »** : les clés suffixées `.one` / `.other`, le `count` numérique, et le contre-exemple qui justifie `Intl.PluralRules` — 0 est singulier en français, pluriel en anglais.
- **Page composant `ProgressBar` — les deux formes sont dites, pas seulement listées** : `max` est marqué « barre segmentée uniquement », `value` et `showValue` « barre simple », et la section Segments explique ce que le type refuse désormais. `value` était par ailleurs annoncée requise alors qu'elle vaut `0` par défaut.
- **Page `Game`, section « Les réponses »** : un questionnaire à quatre choix qui se joue, où l'on voit la bonne réponse se révéler même quand on s'est trompé.
- **Un test de page qui échouait une fois sur plusieurs exécutions** : monter la page du carrousel coûte plusieurs secondes — trois carrousels, leurs cartes et la coloration des extraits — et dépassait la limite de 5 s par défaut sous la charge de la suite complète. C'était un échec de **durée** et non de comportement, invisible en lançant le fichier seul. La limite est désormais dite dans le test plutôt que subie.
- **Page composant `Autocomplete`** : trois démonstrations, dont une saisie répétée qui retire de la liste les choix déjà faits, et une comparaison entre liste imposée et saisie libre.
- **Page composant `SVG map`**, sur la vraie carte des départements français : un mini-jeu de localisation pour éprouver le seuil de glissement, un coloriage par région, et un bouton « Île-de-France » qui cadre depuis l'extérieur. Les tracés viennent de `@svg-maps/france.departments` (CC-BY-4.0), installé en **dépendance de développement** : ils servent la démonstration et ne font pas partie de la librairie.
- **Pages composant `Game` et `Clipboard`** : les vies se perdent, la série s'enchaîne jusqu'au multiplicateur, l'éclair se déclenche dans ses deux durées et la grille se copie. La page `Clipboard` montre aussi l'empilement de minuteries qu'on évite, en laissant déclencher deux durées coup sur coup.
- **La vitrine perd sa copie privée de `useCopyToClipboard`** : `useDemoCard` importe celui de `canopui`, si bien que tous les boutons « Copier » de la documentation passent par le hook qu'ils documentent.
- **Pages composant `Local store` et `Countdown`** : l'état persisté se clique et survit à un rechargement, et le compte à rebours est **mis en concurrence avec un tick qui décrémente** sur la même page. Les deux chronomètres partent ensemble et l'écart s'affiche en millisecondes : le défaut devient visible au lieu d'être décrit.
- **Page composant `Sound`** : les cinq sons se cliquent, et une pastille dit ce qui en est sorti. Une démonstration déclare volontairement un fichier qui n'existe pas, pour montrer à l'écran que le repli sur la synthèse tient et que l'application ne devient pas muette.
- **Page Installation — la commande donnée était fausse par excès** : elle demandait d'installer `react`, `react-dom`, `@mui/material`, `@emotion/react` et `@emotion/styled` « si elles sont absentes du projet », alors que npm les pose automatiquement depuis sa version 7. La page dit maintenant ce qui est vrai, `npm install canopui` et rien d'autre, avec ce que ça entraîne : ce qui arrive avec le paquet, le cas de Yarn qui n'installe pas les dépendances pair d'office, et la carte, seule chose à installer soi-même. Le message d'échec quand `maplibre-gl` manque y est reproduit tel quel, parce qu'il ne nomme pas le paquet absent et qu'on ne le devine pas : `"NavigationControl" is not exported by "__vite-optional-peer-dep:maplibre-gl:canopui"`
- **Page composant `Carousel` — les démonstrations étaient muettes, et l'avaient toujours été depuis la refonte** : elles montraient trois cartes côte à côte, sans flèches, sans barres et sans transition — exactement l'aspect du carrousel d'avant la refonte, alors que le composant, lui, était bien le nouveau. Leurs cartes venaient d'un composant enveloppe `<Cartes />`, or `Children.toArray` **aplatit un tableau mais ni un composant ni un fragment** : le carrousel n'en comptait donc qu'une seule. Une seule carte, et les flèches comme les barres disparaissent — les deux exigent d'avoir où aller — les transitions n'ont plus rien à déplacer, et les trois cartes se posent côte à côte dans l'unique diapositive. **Aucune erreur, aucun test, rien qui le signale.** Les démonstrations passent le tableau lui-même, et la description de `children` prévient du piège, qui guette n'importe quel portail écrivant `<Carousel><MesCartes /></Carousel>`
- **Les pages de la vitrine deviennent testables** : elles importent la librairie sous son nom public, `canopui`, que la configuration de test ne savait pas résoudre — aucune d'elles n'était donc testée, et c'est ce trou qui a laissé passer le carrousel muet. L'alias est ajouté à la configuration de test, et la page `Carousel` reçoit le garde-fou correspondant : si ses démonstrations cessent de montrer des flèches et des barres, c'est que le compte des cartes est retombé à un

- **Page composant `DataTable` — deux sections manquantes, dont l'édition du lot 9** : la table d'API documentait `editable`, `onRowEdit`, `canEditRow` et `editLabel`, mais **aucune démonstration ne les montrait**, si bien que la page paraissait d'avant le lot. Elle a désormais une section Édition, avec `canEditRow` qui refuse les comptes désactivés et la dernière ligne modifiée affichée sous le tableau. Le glisser-déposer, annoncé dans l'introduction depuis longtemps, n'était pas démontré non plus : une section le fait, réordonnancement compris, avec `canDropRow` qui refuse certaines cibles. Et l'action maison de la section Actions, un bouton « Éditer », devient « Voir » — elle doublait l'édition intégrée, ce qui brouillait le partage entre les deux
- **Page composant `Carousel` — le doigt et le hook se voient enfin** : le balayage et le clic sur une moitié de carte n'étaient qu'une phrase dans la section Barres ; ils ont leur propre démonstration, avec les seuils réels (48 px parcourus, trajectoire nettement plus horizontale que verticale). Et la section du hook, qui n'était qu'une table de valeurs, montre une **navigation maison** : `useCarousel` seul, sans le composant `Carousel`, avec une liste de titres et un compteur — le cas d'usage pour lequel il est exposé

- **Page composant `Button` — les sept variantes, et la vitrine repasse en deux langues** : la page n'en documentait que trois (`primary`, `secondary`, `danger`), en ignorant `accent`, `tonal`, `ghost` et `text`, et décrivait `primary` comme portant la couleur accent, ce qui n'a jamais été le cas. Les variantes sont désormais rangées en deux familles — quatre à fond plein, trois discrètes — et la règle du lot 9 est écrite là où on la cherche : sans fond, `ghost` et `text` écrivent avec la couleur de texte du thème. C'était par ailleurs **la seule page de la vitrine encore écrite en français en dur**, sans bloc `fr`/`en` : elle suit maintenant la langue du site comme les autres
- **Page composant `Carousel` — la prose décrivait l'état intermédiaire** : les flèches y étaient « posées sur la fenêtre » et la barre active « s'allongeait », deux comportements remplacés en fin de lot 9. Les flèches sont à côté de la carte, les barres sont uniformes et c'est la couleur qui désigne la carte courante ; en défilement automatique, la barre active se remplit en cadence. Le clic sur une moitié de carte, jamais documenté, l'est ; `clickHandlers` rejoint la table du hook, et `swipeHandlers` mentionne le `touch-action` sans lequel le navigateur confisque le geste
- **Page composant `ProgressBar` — quatre props sur huit manquaient à la table d'API** : `animated`, `segments`, `max` et `ariaLabel` n'y figuraient pas. Deux sections les montrent : le reflet de balayage face à la même barre figée, et une barre segmentée avec `max`. La section « Progression animée » existante parlait de la valeur pilotée par l'état, pas du balayage — les deux sont désormais distinguées
- Page composant `Slider` : le dégradé de la piste, la pastille en pilule couchée et les bouts arrondis n'étaient nulle part. La description de `color` dit ce qu'elle pilote réellement — une famille de palette dont les trois teintes font le dégradé — et la démonstration `disabled` signale que c'est là que les bouts arrondis se remarquent le plus
- Page composant `Spinner` : nouvelle section **Couleurs**, quatre familles côte à côte. La prop existait sans démonstration, alors que c'est elle qui porte le dégradé du trait
- Page composant `DataTable` : l'introduction annonçait encore des « fondus de scroll », retirés au lot 9, et pas l'édition, ajoutée au même lot
- Page Theming : la palette sombre annonce d'où vient son nouveau `primary` et à partir de quelle surface lui préférer `light`. Les pastilles de couleur, elles, se lisent depuis les tokens — elles suivaient déjà
- Barre latérale : `Carousel` n'était plus « un carrousel avec défilement », et `ProgressBar` n'a jamais eu de mode indéterminé
- **Nouvelle page composant `CanopyBackground`** (`/components/canopy-background`) : les deux scènes côte à côte, l'affiche seule, deux dosages de voile et la surcharge des sources. La page `PageScaffold` documente `background`. La configuration Vite de la vitrine **sert `/canopui/video` depuis `src/assets/video`** — middleware en dev, recopie au build — pour jouer le rôle du portail sans dupliquer 32 Mo dans le dépôt
- Page composant `Map` : quatre nouvelles sections — **Thème** (styles clair et sombre côte à côte), **Points d'intérêt** (tous, puis filtrés sur la restauration), **Frontières** (les trois niveaux face à aucun, au zoom où les départements apparaissent) et **Cadre et élévation**. Table d'API complétée, hauteurs de démonstration revues pour les petits écrans. La configuration Vite de la vitrine exclut `maplibre-gl` de l'optimiseur de dépendances — sans quoi le *worker* de MapLibre est perdu et la carte ne démarre jamais, **sans erreur visible dans la page**
- **Nouvelle page Notes de version** (`/docs/versions`) : suivi des versions et journal des changements, **générés depuis ce fichier**. La page lit `CHANGELOG.md` en brut et le transforme en modèle typé (versions, dates, sections, listes, tableaux, encarts), donc elle ne peut pas s'en écarter : une note ajoutée ici apparaît dans la vitrine sans qu'aucun composant ne soit touché. Le suivi compare chaque version documentée à `CANOP_VERSION` — la version que servent réellement les portails — et distingue trois états : **en production**, **à paraître** (documentée mais pas encore taguée) et antérieure. Les versions non publiées sont dépliées d'office, les autres repliées ; un sommaire cliquable mène à chacune. C'est le premier écran de la vitrine qui parle de la librairie elle-même et non d'un de ses composants
- **Notes de version en tête de navigation** : la page rejoint Accueil, Prise en main et Composants dans la barre du site, et sort de « Prise en main » pour former sa propre section dans la barre latérale — ce n'est pas une étape de démarrage, c'est un suivi qu'on revient consulter. L'accueil reçoit une carte annonçant la dernière version : numéro, statut, date, nombre de changements et trois points saillants, tous **déduits du CHANGELOG** — les points saillants sont les premières entrées de la section `Ajouté`, débarrassées de leur balisage, donc l'ordre du fichier décide de ce qui est mis en avant. La carte entière mène aux notes de version
- **Version 2.0.0 rétablie dans ce fichier** : son titre `## [2.0.0]` manquait, et ses six sections (`Ajouté`, `Modifié`, `Supprimé` du lot 4 — refonte UX, SCRUM-355) étaient absorbées par la 2.0.1 qui la précède, laquelle affichait donc deux sections `Ajouté` et deux `Supprimé`. Le trou est resté invisible tant que le fichier n'était lu que par des humains ; l'écrire dans un parseur l'a fait apparaître au premier rendu. Date reprise du tag `v2.0.0` (2026-07-23)
- **Nouvelle page Typographie** (`/docs/typographie`) : la typographie se résumait à une échelle de titres h1–h5 dans la page Theming. Elle a désormais sa page, qui déroule la fonte et son spécimen, les cinq échelles de titres, les douze rôles de l'échelle applicative, les six graisses, les onze tonalités de couleur, l'échelle de crénage optique avec une comparaison avant/après, les quatre interlignes, les variantes numériques, et un bloc assemblé comme sur un écran réel
- Page composant `Heading` : nouvelle section Tonalités, et la table d'API documente `tone`
- **Nouvelle page composant `Text`** (`/components/text`) : variantes, graisses, tonalités de hiérarchie et de palette, variantes numériques, balise de rendu et table d'API
- Page Theming : l'échelle de titres affiche le crénage à côté de la taille et renvoie vers la page Typographie pour le détail

### Migration

1. **Rejouer le codemod de rebrand** sur le code du portail consommateur. Il couvre les renommages mécaniques : symboles `Ch*` → `Canop*`, `CH_UI_VERSION` → `CANOP_VERSION`, CSS variables `--ch-*` → `--canop-*`, clés i18n `ch.*` → `canop.*` et clés `localStorage`. Il est **idempotent** : le relancer après un merge ou sur une branche en retard est sans risque.
2. **Renommer les props d'API** que le codemod ne devine pas dans les cas exotiques (props passées via un objet intermédiaire, `spread`, table de configuration) :

   | Composant | Avant | Après |
   |---|---|---|
   | 12 composants (le compilateur les signale un à un) | `aria-label` | `ariaLabel` |
   | `DataTable` | `animateRows` | `animated` |
   | `FileCard` | `onSelectedChange` | `onSelectionChange` |
   | `Legend` (entrées) | `status` | `tone` |

3. **Déréférencer les tokens de titres** partout où le portail lisait une taille : `tokens.typography.heading.hN` → `tokens.typography.heading.hN.fontSize`. Le compilateur signale chaque occurrence. Quand le style entier convient, préférer `sx={tokens.typography.heading.hN}`, qui apporte aussi la graisse, l'interligne et le nouveau crénage.
4. **Vérifier à la main les ruptures silencieuses**, invisibles pour TypeScript comme pour le runtime :
   - CSS du portail : plus aucun `var(--ch-…)`, ni sélecteur ciblant un id `#ch-…` (typiquement `#ch-confirm-dialog-title`).
   - `layoutId` passé explicitement à `SlidingIndicator` : `"ch-sliding-indicator"` → `"canop-sliding-indicator"`.
   - Messages i18n surchargés par le portail : les clés de la lib doivent être en `canop.*`, sinon la surcharge est silencieusement ignorée.
5. **Retirer `showGradients` des appels à `DataTable`** : la prop n'existe plus, le compilateur la signale. Aucun remplacement — l'effet est abandonné.
6. **Reprendre les appels à `Carousel`** : `itemWidth` et `showIndicators` n'existent plus. Un carrousel qui montrait plusieurs cartes doit être repensé — le composant n'en montre plus qu'une. `showIndicators` devient `navigation="bars"`. Les consommateurs de `useCarousel` doivent être réécrits : son résultat a changé en entier.
7. **Décider du fond de `PageScaffold`**, qui change **sans que rien ne le signale** : la canopée animée remplace les formes organiques. Deux questions à trancher par portail — veut-on le nouveau fond, et accepte-t-on les 4,8 à 6,4 Mo de vidéo au premier rendu ? `background="shapes"` rend l'ancien fond. Si on garde la canopée, **exposer `/canopui/video`** en recopiant `node_modules/canopui/dist/assets/video` dans le dossier public du portail, ou déplacer les sources sur un CDN avec `canopyScenesFrom`.
8. **Prévenir du reset des préférences** : thème et langue mémorisés dans le navigateur ne sont pas repris, les utilisateurs repartent des valeurs par défaut à la première visite après la montée de version. Aucun script de migration n'est fourni ; un portail qui tient à préserver l'existant doit recopier lui-même l'ancienne clé vers la nouvelle avant de monter `CanopThemeProvider`.
9. **Relire la doc de theming** ([`docs/THEMING.md`](docs/THEMING.md)) : préfixe des variables, clé de persistance et props de `CanopThemeProvider` y sont à jour pour la 3.0.
10. **Retirer `max` des appels à `ProgressBar` en barre simple** — le compilateur les signale un à un. La prop n'a jamais été lue là : ce qui s'affichait était `value` **pris pour un pourcentage**. Si `value` était une part d'un total, la convertir à l'appel (`value={(acquis / total) * 100}`), sans quoi le rendu reste celui d'avant, c'est-à-dire faux. Un `max` proche de 100 masquait l'écart, il ne le corrigeait pas.
11. **Reprendre les surcharges de `canop.lives.label`**, s'il y en a — **rien ne le signale**. La clé nue n'existe plus : surcharger `canop.lives.label.one` et `canop.lives.label.other`, et interpoler `{count}` au lieu de `{value}`. Un portail qui imposait un `ariaLabel` à `Lives` pour contourner l'accord peut le retirer.
