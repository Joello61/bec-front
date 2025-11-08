# ================================
# Étape 1 : Build de l'application
# ================================
FROM node:22-alpine AS build
WORKDIR /app

# Arguments de build envoyés par CapRover
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_SHORT_NAME
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_API_DOMAIN
ARG NEXT_PUBLIC_MERCURE_HUB_URL
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_GA_ID

# Rendre ces variables disponibles pendant le build Next.js
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_SHORT_NAME=$NEXT_PUBLIC_APP_SHORT_NAME
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV
ENV NEXT_PUBLIC_API_DOMAIN=$NEXT_PUBLIC_API_DOMAIN
ENV NEXT_PUBLIC_MERCURE_HUB_URL=$NEXT_PUBLIC_MERCURE_HUB_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NODE_ENV=production

# Copier les fichiers de dépendances et installer
COPY package*.json ./
RUN npm ci

# Copier le reste du code source
COPY . .

# Build Next.js
RUN npm run build

# ================================
# Étape 2 : Serveur léger
# ================================
FROM node:22-alpine AS runner
WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires depuis le build
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Variables d'environnement pour la prod
ENV NODE_ENV=production
ENV PORT=3010
ENV HOSTNAME=0.0.0.0

# Utilisateur non-root
USER nextjs

# Exposer le port de l'app
EXPOSE 3010

# Lancer l'application
CMD ["node", "node_modules/next/dist/bin/next", "start"]
