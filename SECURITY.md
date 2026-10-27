# Securite — CanopUI

## Depot et publication

- **Depot** : Azure DevOps,
  https://dev.azure.com/qvl-project/QVL-ToolBox/_git/CanopUI
- **Registres** : `@canop/ui` est publie sur le registre npm QVL
  (https://npm.qvl-project.com, Verdaccio) et sur npmjs (meme tarball).
  Miroir public du depot a chaque release : https://github.com/QVL-ToolBox/CanopUI
  (instantane, sans `azure-pipelines.yml` ni `.npmrc`).
- **Publication : automatique**, par la pipeline Azure (`azure-pipelines.yml`),
  seulement sur `main` et apres approbation de l'environnement `verdaccio`
  (voir `docs/RELEASE.md`). Publication manuelle de secours seulement.

## Token de registre

- Le token Verdaccio n'est **jamais ecrit dans le depot**. Il est lu depuis un
  fichier `.npmrc` situe **hors du depot**, designe par la variable
  `NPM_CONFIG_USERCONFIG` le temps de la publication.
- Dans la pipeline Azure, les jetons sont des variables secretes de la
  definition (`NPM_TOKEN` Verdaccio, `NPMJS_TOKEN` npmjs, `GITHUB_MIRROR_TOKEN`
  miroir), mappes sur la seule etape qui les utilise ; le `.npmrc` est ecrit
  hors du checkout et ne contient que la reference au jeton.
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
