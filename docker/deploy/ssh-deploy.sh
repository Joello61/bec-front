#!/usr/bin/env bash
#
# Invoqué par .github/workflows/deploy.yml (jamais manuellement en usage normal) - tire
# l'image déjà construite et poussée vers GHCR par le job "build-staging"/"build-production",
# jamais une reconstruction sur le serveur cible. Ne touche jamais aux services
# backend/worker/scheduler - Cobage a un pipeline de déploiement indépendant par
# application, tous deux ciblant le même checkout `bec-infra` sur le serveur.
#
# Usage : ssh-deploy.sh <staging|production>
# Variables d'environnement attendues (fournies par deploy.yml via des secrets GitHub
# Environment, jamais en dur) :
#   SSH_PRIVATE_KEY, SSH_HOST, SSH_USER, DEPLOY_PATH, FRONTEND_IMAGE
#
# Contrairement à bec-backend, ce déploiement n'a besoin d'aucun secret Infisical : la
# configuration du frontend est entièrement fixée au moment du build ("NEXT_PUBLIC_*",
# voir docker/deploy/README.md) - le conteneur "frontend" démarre sans variable
# d'environnement runtime sensible.
#
# DEPLOY_PATH pointe vers le checkout du dépôt `bec-infra` sur le serveur (fichiers
# Compose/nginx), pas ce dépôt `bec-frontend`.

set -euo pipefail

ENVIRONMENT="${1:?Usage: ssh-deploy.sh <staging|production>}"

: "${SSH_PRIVATE_KEY:?}"
: "${SSH_HOST:?}"
: "${SSH_USER:?}"
: "${DEPLOY_PATH:?}"
: "${FRONTEND_IMAGE:?}"

SSH_KEY_FILE="$(mktemp)"
KNOWN_HOSTS_FILE="$(mktemp)"
trap 'rm -f "$SSH_KEY_FILE" "$KNOWN_HOSTS_FILE"' EXIT

printf '%s\n' "$SSH_PRIVATE_KEY" > "$SSH_KEY_FILE"
chmod 600 "$SSH_KEY_FILE"

# ssh-keyscan à chaque exécution plutôt qu'une empreinte d'hôte figée en secret -
# confiance à la première utilisation par exécution de ce job (compromis documenté,
# patron factu_sentinel).
ssh-keyscan -H "$SSH_HOST" > "$KNOWN_HOSTS_FILE" 2>/dev/null

echo "Déploiement frontend de ${ENVIRONMENT} - image ${FRONTEND_IMAGE}"

# shellcheck disable=SC2087
ssh -i "$SSH_KEY_FILE" -o UserKnownHostsFile="$KNOWN_HOSTS_FILE" "$SSH_USER@$SSH_HOST" bash -s <<EOF
set -euo pipefail
cd "$DEPLOY_PATH"

# Synchronise le dépôt bec-infra (docker-compose.prod.yml, docker/nginx/*.template) au
# commit le plus récent de sa propre branche main - indépendant du SHA applicatif
# déployé ici. Jamais affecté : les fichiers non suivis par Git
# (docker-compose.prod.traefik.yml).
echo "=== Synchronisation de bec-infra (main) ==="
git fetch origin main
git checkout --quiet origin/main

# "image-tags.env" (jamais versionné) persiste le tag d'image actuellement déployé de
# CHAQUE application - un déploiement frontend ne doit jamais écraser le tag backend
# actuellement en place, et réciproquement. Créé vide au tout premier déploiement de ce
# serveur.
touch image-tags.env
# shellcheck disable=SC1091
source image-tags.env

export FRONTEND_IMAGE="$FRONTEND_IMAGE"
# BACKEND_IMAGE peut être vide au tout premier déploiement (aucun déploiement backend
# encore effectué sur ce serveur) - sans impact ici, "--no-deps" ci-dessous ne demande
# jamais à Compose d'instancier "backend"/"worker"/"scheduler" à partir de cette valeur.
export BACKEND_IMAGE="\${BACKEND_IMAGE:-}"

cat > image-tags.env <<IMAGETAGS
BACKEND_IMAGE=\$BACKEND_IMAGE
FRONTEND_IMAGE=\$FRONTEND_IMAGE
IMAGETAGS

# "docker-compose.prod.observability.yml" ajoute nginx/backend/worker/scheduler au
# réseau partagé "observability-shared" - chargé UNIQUEMENT en production, jamais en
# staging. Sans effet direct sur "frontend" (absent de ce fichier), mais nginx en dépend
# et doit rester cohérent avec le déploiement backend le plus récent sur cet
# environnement.
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.prod.traefik.yml"
if [ "$ENVIRONMENT" = "production" ]; then
  COMPOSE_FILES="\$COMPOSE_FILES -f docker-compose.prod.observability.yml"
fi

echo "=== Récupération de l'image frontend ==="
docker compose --env-file image-tags.env \$COMPOSE_FILES pull frontend

echo "=== Démarrage du nouveau conteneur (frontend uniquement) ==="
# "--no-deps" : ne recrée jamais "backend"/"worker"/"scheduler"/"postgres"/"mercure"/"nginx"
# à partir de ce pipeline.
docker compose --env-file image-tags.env \$COMPOSE_FILES up -d --no-deps frontend

echo "Déploiement frontend terminé (${ENVIRONMENT})."
EOF
