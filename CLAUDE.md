# CLAUDE.md - Frontend (Next.js)

Ce fichier complète `../CLAUDE.md` (règles générales du projet Cobage). **Il ne les recopie pas.** Tout ce qui n'est pas spécifique au frontend s'applique ici sans modification - voir `../CLAUDE.md`.

Le frontend Next.js est responsable de **l'expérience utilisateur**, jamais de l'autorité d'autorisation - celle-ci appartient exclusivement au backend Symfony (`../bec-backend/CLAUDE.md`). Toute protection frontend (route protégée par `proxy.ts`, bouton caché, condition de rendu) est un **confort d'expérience uniquement**, jamais un contrôle de sécurité réel.

## 1. Sources de vérité spécifiques au frontend

- `../bec-docs/docs/audit/audit-cobage.md`, section 5 (Frontend - Sécurité) et section 6 (Frontend - Qualité)
- `../bec-docs/docs/plan-correction/plan-correction-cobage.md`, phases 3, 7, 8, 9

## 2. État et conventions Next.js

Next.js 16 (App Router) : `middleware.ts` est déprécié au profit de `proxy.ts` (export nommé `proxy`) - c'est déjà la convention en place dans ce projet (`src/proxy.ts`), ne pas recréer un `middleware.ts` par réflexe issu d'une version antérieure.

Next.js 16 est une version majeure récente : ne pas supposer que des patterns d'une version antérieure (routing, Server/Client Components, data fetching, cache) restent valides. Vérifier la documentation officielle actuelle avant d'utiliser un mécanisme non déjà présent dans le code existant.

## 3. Architecture - rendu serveur/client

Par défaut, un nouveau composant ou une nouvelle page est un **Server Component** ; `'use client'` est ajouté seulement quand une interactivité réelle (état local, effet, gestionnaire d'événement, hook navigateur) le justifie - jamais par réflexe ou par copie du fichier voisin. Le ratio actuel de fichiers `'use client'` est élevé (cf. audit Frontend-Qualité #3, Phase 8) : ne pas l'aggraver sur du code nouveau.

Isoler l'interactivité dans un sous-composant client minimal plutôt que de marquer tout un arbre `'use client'` parce qu'un seul élément en a besoin.

## 4. API

Centraliser tout appel HTTP dans `lib/api` - jamais d'appel `fetch`/`axios` brut dispersé dans un composant. L'intercepteur axios centralisé (gestion du refresh token via file d'attente sur 401 concurrents) est un point déjà correctement implémenté - le réutiliser plutôt que dupliquer une gestion d'erreur ad hoc dans un nouveau store (voir section 6).

## 5. Authentification

L'access token JWT est conservé côté frontend en **cookie**, jamais en `localStorage`/`sessionStorage` - convention déjà en place et à ne jamais régresser. Ne jamais lire, décoder pour affichage, ou manipuler ce cookie directement via `document.cookie` en JavaScript applicatif (le décodage limité au routage dans `proxy.ts`, à des fins de vérification de rôle uniquement, est l'exception déjà prévue par la Phase 3 du plan de correction - pas un précédent pour un usage plus large).

## 6. Gestion d'état (zustand) et gestion d'erreur

Ne pas dupliquer le pattern `try { set({isLoading:true}) ... } catch(error:any) { set({error:error.message}) }` dans un nouveau store - utiliser le helper générique introduit en Phase 7 du plan de correction (`createAsyncAction` ou équivalent une fois créé) s'il existe déjà ; sinon, signaler l'écart plutôt que de reproduire le pattern dupliqué constaté par l'audit (136 occurrences).

## 7. TypeScript

Strict, éviter `any` - ne jamais l'utiliser pour supprimer une erreur de type sur du code nouveau, même si des occurrences existantes subsistent ailleurs (dette identifiée, Phase 7 du plan de correction, ne pas l'aggraver). Ne pas ajouter de `/* eslint-disable @typescript-eslint/no-explicit-any */` en tête de fichier entier - une désactivation, si réellement nécessaire, doit être ciblée sur la ligne concernée et justifiée.

Typer les réponses API à partir du contrat backend réel, pas en inférant un type depuis une réponse observée une seule fois.

## 8. Sécurité frontend

- Ne jamais mettre de secret dans le frontend (clé API, credential) - tout ce qui est envoyé au navigateur est public. Les variables `NEXT_PUBLIC_*` ne doivent contenir que des valeurs déjà publiques par nature (cf. audit : seuls GA ID et AdSense pub-id sont actuellement exposés, à ne pas élargir sans réflexion).
- Toute redirection basée sur un paramètre d'URL fourni par l'utilisateur (`?redirect=` ou équivalent) doit être validée comme un chemin interne relatif avant d'être utilisée dans une navigation - jamais un chemin/URL externe non vérifié (cf. audit Frontend-Sécurité #1, Phase 3).
- Échapper systématiquement toute donnée utilisateur réaffichée (nom, description) - vecteur XSS potentiel.
- `target="_blank"` toujours accompagné de `rel="noopener noreferrer"`.

## 9. Formulaires

react-hook-form + zod, schémas centralisés dans `lib/validations/*.schema.ts` par domaine - pattern déjà en place, à suivre pour tout nouveau formulaire plutôt qu'à réinventer une validation ad hoc. La validation frontend améliore l'expérience mais ne remplace jamais la validation backend, qui reste la source de vérité.

## 10. Performance

Surveiller : taille du bundle (`npm run build`), re-rendus inutiles, appels API dupliqués. Utiliser `next/image` pour toute image plutôt qu'une balise `<img>` brute (cf. audit Frontend-Qualité #9). Avant toute optimisation Next.js spécifique (streaming, prefetching, cache), vérifier les recommandations actuelles pour la version installée.

## 11. Tests

Composants, formulaires, services et client API à tester au niveau unitaire/intégration lorsqu'ils touchent à l'authentification, aux formulaires critiques (paiement, création de voyage/demande) ou à la logique partagée (helpers de store, client API).

## 12. Workflow frontend

En complément du workflow général de `../CLAUDE.md` (section 20) :

1. Inspecter le code existant sous `src/app/` et `src/components/`.
2. Vérifier le contrat API réellement exposé par le backend avant d'utiliser un endpoint.
3. Vérifier la version Next.js/React/Tailwind réellement installée (`package.json`).
4. Décider Server ou Client Component par défaut (section 3) avant d'écrire le fichier, pas après.
5. Identifier les impacts sécurité (section 8) et typage (section 7).
6. Implémenter le changement minimal, en respectant l'organisation par domaine (`lib/api`, `lib/handlers`, `lib/hooks`, `lib/store`, `lib/validations`).
7. Ajouter les tests (section 11).
8. Exécuter `npm run lint`, `npx tsc --noEmit`, `npm run build`.
9. Vérifier le diff.
10. Mettre à jour `../bec-docs/docs/` si la tâche fait évoluer une décision qui y était documentée, ou cocher les étapes concernées du plan de correction.

Règle finale, reprise de `../CLAUDE.md` : **« Do not guess when the answer can be verified. »**
