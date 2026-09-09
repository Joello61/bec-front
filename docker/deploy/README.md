# Déploiement CI/CD - Frontend Cobage

Phase D4 (`bec-docs/docs/deploiement/deploiement-cobage.md`). `.github/workflows/deploy.yml`
construit **deux** images (staging et production), les pousse vers GHCR, déploie
automatiquement en staging puis attend une validation manuelle avant la production.

## Pourquoi deux images (écart vs. le patron factu_sentinel)

Les variables `NEXT_PUBLIC_*` sont inlinées dans le bundle JavaScript **au moment du
build** (`next build`), pas lues au runtime. Staging et production ont des domaines
publics différents (ex. `staging.cobage.joeltech.fr` vs `cobage.joeltech.fr`) : une seule
image ne peut donc pas porter les bonnes URLs canoniques/SEO/Mercure pour les deux à la
fois, contrairement au backend (configuration 100% runtime via Infisical). Ce pipeline
construit et pousse deux images distinctes, taguées `staging-<sha>` et `prod-<sha>`.

**Déclenchement** : après le succès complet du workflow `CI` (`.github/workflows/lint.yml`)
sur `main` - jamais sur une Pull Request.

**Périmètre** : ce pipeline ne touche que le service `frontend`. Le backend a son propre
pipeline indépendant (`bec-backend/.github/workflows/deploy.yml`). Les deux ciblent le
même checkout du dépôt `bec-infra` sur le serveur.

## Prérequis (aucun n'est fait par ce dépôt)

### 1. Serveur, clé SSH, GHCR

Identiques à ceux du backend (voir `bec-backend/docker/deploy/README.md`, sections 1-3) -
même serveur, mêmes chemins de déploiement (`DEPLOY_PATH` pointe vers le même checkout
`bec-infra` que le pipeline backend). Une paire de clés SSH par environnement peut être
partagée avec le pipeline backend ou dédiée - au choix, sans impact fonctionnel (les deux
scripts ne font que `docker compose ... up -d --no-deps <service(s)>` sur des services
disjoints).

### 2. Repository variables (Settings > Secrets and variables > Actions > **Variables**)

Valeurs **non sensibles** (URLs publiques, IDs déjà exposés au navigateur) - jamais des
secrets :

| Variable | Exemple | Utilisée par |
|---|---|---|
| `STAGING_PUBLIC_DOMAIN` | `staging.cobage.joeltech.fr` | build-staging |
| `PROD_PUBLIC_DOMAIN` | `cobage.joeltech.fr` | build-production |
| `R2_PUBLIC_URL` | domaine public du bucket Cloudflare R2 (Phase D1) | les deux builds |
| `NEXT_PUBLIC_APP_NAME` | nom complet de l'application | les deux builds |
| `NEXT_PUBLIC_APP_SHORT_NAME` | nom court (PWA) | les deux builds |
| `PROD_GA_ID` | ID Google Analytics | build-production uniquement |
| `PROD_ADSENSE_ID` | ID AdSense (`pub-...`) | build-production uniquement |

`PROD_GA_ID`/`PROD_ADSENSE_ID` sont volontairement absentes du build staging (variable
non définie = vide) - éviter de polluer les statistiques réelles avec du trafic de test.

### 3. Environnements GitHub (Settings > Environments, dépôt `bec-front`)

**Attention** : ce dépôt a déjà des Environments `Preview`/`Production` (vraisemblablement
issus d'une intégration Vercel antérieure) - **ne pas les réutiliser**. Créer deux
nouveaux environnements dédiés à ce pipeline, nommés `staging` et `production` (mêmes
noms que ceux utilisés par `bec-backend`, mais propres à ce dépôt), chacun avec ses
**propres** secrets :

| Secret | Contenu |
|---|---|
| `SSH_PRIVATE_KEY` | Clé privée de déploiement de cet environnement |
| `SSH_HOST` | Adresse du serveur |
| `SSH_USER` | Utilisateur SSH de déploiement |
| `DEPLOY_PATH` | Chemin absolu du checkout `bec-infra` sur le serveur pour cet environnement (identique à celui utilisé par `bec-backend`) |

**Sur `production` uniquement** : ajouter une règle **"Required reviewers"** - seul
garde-fou manuel avant la mise en prod réelle. Cette règle protège le job
`deploy-production` ; le job `build-production` (qui précède) n'est volontairement pas
gardé par un environnement (les valeurs qu'il utilise sont publiques, pas de risque à les
construire avant validation).

## Rollback

Jamais automatisé. Redéployer un tag d'image antérieur déjà présent sur GHCR (`prod-<sha>`
ou `staging-<sha>`, onglet "Packages" du dépôt), en relançant manuellement
`docker/deploy/ssh-deploy.sh` avec `FRONTEND_IMAGE` pointant vers ce tag.

## Vérification avant le tout premier déploiement réel

- [ ] Les 7 Repository Variables ci-dessus créées.
- [ ] Environnements `staging`/`production` créés avec leurs 4 secrets chacun, "Required reviewers" actif sur `production`.
- [ ] DNS de `STAGING_PUBLIC_DOMAIN` et `PROD_PUBLIC_DOMAIN` propagés avant le premier déploiement de chaque environnement (sans quoi les URLs SEO/canoniques générées au build pointeraient vers un domaine non résolvable).
- [ ] `docker login ghcr.io` déjà fait sur le serveur (partagé avec le pipeline backend si même utilisateur).
