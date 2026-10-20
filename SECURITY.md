# Securite — CanopUI

## Depot et publication

- **Depot** : Azure DevOps,
  https://dev.azure.com/qvl-project/QVL-ToolBox/_git/CanopUI
- **Registre** : `@canop/ui` est publie sur le registre npm prive QVL
  (https://npm.qvl-project.com, Verdaccio).
- **Publication actuelle : manuelle.** Il n'y a pas encore de pipeline. La
  publication se fait a la main, apres build et tests verts (voir
  `docs/RELEASE.md`).
- **Cible : pipeline Azure** (build + tests + `npm publish`), declenche
  uniquement depuis des refs de confiance (`main` protegee, tags `vX.Y.Z`).

## Token de registre

- Le token Verdaccio n'est **jamais ecrit dans le depot**. Il est lu depuis un
  fichier `.npmrc` situe **hors du depot**, designe par la variable
  `NPM_CONFIG_USERCONFIG` le temps de la publication.
- Dans le futur pipeline Azure, ce token sera un secret de pipeline, ecrit dans
  un fichier temporaire hors du checkout puis supprime en fin de job, meme en
  cas d'echec.
- `.npmrc`, `.env*` (hors `.env.example`), archives `*.tgz` et fichiers de cles
  (`*.pem`, `*.key`, `*.p12`, `*.pfx`, `id_rsa*`) sont dans `.gitignore`.

## Contenu publie

Le paquet publie est limite par le champ `files` de `package.json` : `dist/`
(plus `README.md` et `package.json`, ajoutes d'office par npm). Verifier avec
`npm pack --dry-run --ignore-scripts` avant chaque publication.

## Mesures a reprendre dans le pipeline Azure

- Scan de secrets (`gitleaks`) sur tout l'historique.
- Scan de vulnerabilites des dependances (`osv-scanner`, binaire epingle et
  verifie par sha256).
- Publication restreinte aux tags `vX.Y.Z` proteges ; aucune branche de
  feature ne doit pouvoir publier.

Toute evolution du mode de publication doit reevaluer ces mesures.
