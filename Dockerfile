# syntax=docker/dockerfile:1
#
# Image Docker du frontend Next.js 16 (Node 22, LTS active - Next.js 16 exige au
# minimum Node 20.9). Patron repris de factu_sentinel/frontend/Dockerfile (stack
# identique), adapté aux variables NEXT_PUBLIC_* déjà utilisées par Cobage.
#
# Quatre cibles ("--target") :
#   dev     - utilisée par bec-infra/docker-compose.yml, code source monté en volume
#   builder - construit le build de production ("next build", sortie standalone)
#   prod    - image finale minimale ("node server.js"), utilisateur non-root

FROM node:22-alpine AS base
WORKDIR /app

# ---------------------------------------------------------------------------
FROM base AS deps

COPY package.json package-lock.json* ./
RUN npm ci

# ---------------------------------------------------------------------------
FROM deps AS dev

# Piège découvert en session (2026-09-09), à ne pas redécouvrir : lancer "npm run build"
# (next build) DANS un conteneur de cette cible "dev" plante systématiquement au
# prerendering de /_global-error ("TypeError: Cannot read properties of null"), quel que
# soit l'état de node_modules/.next (testé sur volumes entièrement neufs, conteneur
# éphémère isolé du serveur "next dev" en cours - donc jamais un bug Next.js, ni un cache
# périmé). Cause réelle : NODE_ENV=development ci-dessous, déjà présent dans
# l'environnement AVANT que "next build" ne s'exécute - or ce dernier doit tourner avec
# NODE_ENV=production (jamais déjà positionné en amont), sans quoi certaines parties de
# React/Next.js se comportent de façon incohérente (contexte nul au lieu du bon provider).
# Le stage "builder" ci-dessous fixe déjà NODE_ENV=production correctement - jamais
# affecté, ni la vraie image de production, ni la CI (aucun des deux ne passe par cette
# cible "dev"). Si un test manuel de "npm run build" est nécessaire depuis ce conteneur
# "dev", le forcer explicitement : "NODE_ENV=production npm run build".
ENV NODE_ENV=development

# Le code source réel est monté en volume par bec-infra/docker-compose.yml en
# développement (avec les variables NEXT_PUBLIC_* lues depuis .env.local, déjà
# présent) ; cette copie garantit néanmoins que l'image reste utilisable seule.
COPY . .

COPY docker/entrypoint-dev.sh /usr/local/bin/docker-entrypoint-dev.sh
RUN chmod +x /usr/local/bin/docker-entrypoint-dev.sh

ENTRYPOINT ["docker-entrypoint-dev.sh"]
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------------------------------------------------------------------------
FROM deps AS builder

# Arguments de build (NEXT_PUBLIC_* est inliné dans le bundle client au moment de
# "next build", donc nécessaire ici en ARG/ENV - jamais lu au runtime contrairement
# aux variables serveur-only).
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_SHORT_NAME
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_API_DOMAIN
ARG NEXT_PUBLIC_MERCURE_HUB_URL
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_ADSENSE_ID
# Pas de préfixe NEXT_PUBLIC_ : lu uniquement par next.config.ts (contexte Node du build,
# jamais expédié au bundle client) pour dériver le hostname R2 autorisé par next/image
# (images.remotePatterns) - Phase D1/D2, avatars servis par Cloudflare R2.
ARG R2_PUBLIC_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    R2_PUBLIC_URL=$R2_PUBLIC_URL \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_ADSENSE_ID=$NEXT_PUBLIC_ADSENSE_ID \
    NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME \
    NEXT_PUBLIC_APP_SHORT_NAME=$NEXT_PUBLIC_APP_SHORT_NAME \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV \
    NEXT_PUBLIC_API_DOMAIN=$NEXT_PUBLIC_API_DOMAIN \
    NEXT_PUBLIC_MERCURE_HUB_URL=$NEXT_PUBLIC_MERCURE_HUB_URL \
    NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL \
    NODE_ENV=production

COPY . .

RUN npm run build

# ---------------------------------------------------------------------------
FROM base AS prod

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Sortie "standalone" (next.config.ts, output: "standalone") : ne copie que le
# strict nécessaire à l'exécution, sans node_modules complet - contrairement à
# la version précédente de ce Dockerfile, qui déclarait déjà "standalone" dans
# next.config.ts sans jamais l'exploiter (copiait node_modules en entier,
# lançait "next start" plutôt que le serveur autonome).
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# node -e plutôt que curl/wget : l'image "alpine" ne les installe pas par défaut.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:3000/',r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
