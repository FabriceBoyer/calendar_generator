# 📅 Calendrier Fitness

Générateur de calendrier à imprimer, 100% front-end (React + TypeScript + Vite), pensé pour suivre vos **activités sportives** et votre **poids** au fil du mois — un mois par page, format paysage, une colonne par jour.

👉 Démo en ligne : `https://<votre-utilisateur>.github.io/calendar_generator/`

## ✨ Fonctionnalités

- **Un mois par page, format paysage**, une colonne par jour
- **Activités configurables** (marche, piscine, pilates, vélo, gainage, course par défaut) : ajout/édition/suppression, icône, couleur et champs de détail personnalisés (durée, distance, séries, …)
- **Suivi du poids** en bas de chaque colonne, avec un **graphique** reliant les points du mois (plage configurable, par défaut 90–110 kg)
- **Sauvegarde automatique dans le navigateur** (localStorage) : rien n'est perdu au rafraîchissement
- **Impression directe** et **export PDF / Word (.docx)** (toujours rendus en thème clair, quel que soit le thème actif à l'écran, pour un rendu papier lisible)
- **Formats papier** A4 / Letter / A3 / Legal, avec détection automatique selon la langue du navigateur
- **Français / Anglais**, détection automatique de la langue du navigateur
- **Thème clair / sombre** (sombre par défaut) et **couleur d'accent** personnalisable, image de fond optionnelle
- **Mode en ligne optionnel** pour remplir le calendrier directement dans le navigateur, avec **export/import JSON** des données
- **Import Garmin Connect** (fichier CSV exporté depuis Garmin Connect, best-effort — voir [documentation](#documentation))
- **Page Statistiques** (`/stats`) : jours suivis, activités enregistrées, évolution du poids (graphique + min/moyenne/max) et répartition par activité, calculés sur toutes les données enregistrées
- **Documentation en ligne** intégrée à l'application (`/docs`), en plus de ce README

## 🧱 Stack technique

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- [Zustand](https://github.com/pmndrs/zustand) (état + persistance `localStorage`)
- [react-i18next](https://react.i18next.com/) (FR/EN)
- [date-fns](https://date-fns.org/) (calendrier, locales)
- [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://github.com/niklasvh/html2canvas) (export PDF)
- [docx](https://github.com/dolanmiu/docx) (export Word)
- [framer-motion](https://www.framer.com/motion/) (animations)
- [react-router-dom](https://reactrouter.com/) (`HashRouter`, compatible GitHub Pages)

Aucun backend : toutes les données restent dans le navigateur de l'utilisateur.

## 🚀 Développement

```bash
npm install
npm run dev
```

## 🏗️ Build de production

```bash
npm run build
npm run preview
```

## 🌐 Déploiement GitHub Pages

Le déploiement est automatisé via [.github/workflows/deploy.yml](.github/workflows/deploy.yml) : chaque push sur `main` build le projet et le publie sur GitHub Pages.

Pensez à activer GitHub Pages sur le dépôt : **Settings → Pages → Source → GitHub Actions**.

Le chemin de base (`base`) est configuré dans [vite.config.ts](vite.config.ts) sur `/calendar_generator/` (nom du dépôt). Si vous forkez/renommez le dépôt, adaptez cette valeur (ou la variable d'environnement `VITE_BASE_PATH`).

## 🐳 Docker

L'application peut aussi être servie via un conteneur Docker (build multi-stage : `node` pour compiler, `nginx` pour servir les fichiers statiques).

```bash
# Build + run avec Docker Compose (http://localhost:8080)
docker compose up --build

# Ou manuellement
docker build -t calendar-generator .
docker run -p 8080:80 calendar-generator
```

Contrairement à GitHub Pages, l'image Docker sert l'application à la racine (`/`) par défaut. Pour changer ce comportement (par ex. servir derrière un reverse-proxy sous un sous-chemin), passez l'argument de build `VITE_BASE_PATH` :

```bash
docker build --build-arg VITE_BASE_PATH=/mon-sous-chemin/ -t calendar-generator .
```

Des images officielles sont publiées sur GitHub Container Registry à chaque tag de version :

```bash
docker pull ghcr.io/<owner>/calendar_generator:latest
# ou une version précise
docker pull ghcr.io/<owner>/calendar_generator:1.2.0
```

## 🔁 Intégration & déploiement continus

Trois workflows GitHub Actions sont fournis dans [.github/workflows](.github/workflows) :

| Workflow | Déclencheur | Rôle |
| --- | --- | --- |
| [ci.yml](.github/workflows/ci.yml) | Chaque push (toute branche) et chaque pull request | Installe les dépendances, lint, type-check, build Vite, et build Docker (smoke test) |
| [deploy.yml](.github/workflows/deploy.yml) | Push sur `main` | Build et publie le site sur GitHub Pages |
| [docker-publish.yml](.github/workflows/docker-publish.yml) | Push d'un tag `vX.Y.Z` (ex. `v1.2.0`) | Build et publie l'image Docker sur `ghcr.io/<owner>/<repo>` avec les tags `X.Y.Z` et `latest` |

Pour publier une nouvelle version de l'image Docker :

```bash
git tag v1.2.0
git push origin v1.2.0
```

## 📖 Documentation

Un guide d'utilisation complet (activités, suivi du poids, sauvegarde locale, mode en ligne, export, import Garmin, formats papier) est disponible directement dans l'application, menu **Documentation** (`/docs`), en français et en anglais.

## 🔒 Confidentialité

Cette application est strictement front-end : vos données (activités, poids, réglages) sont stockées uniquement dans le `localStorage` de votre navigateur et ne transitent par aucun serveur. L'export/import JSON vous permet de sauvegarder ou transférer vos données manuellement.
