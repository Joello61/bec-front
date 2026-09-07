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

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
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
