# 📅 Calendrier Fitness

Générateur de calendrier à imprimer, 100% front-end (React + TypeScript + Vite), pensé pour suivre vos **activités sportives** et votre **poids** au fil du mois — un mois par page, format paysage, une colonne par jour.

👉 Démo en ligne : `https://<votre-utilisateur>.github.io/calendar_generator/`

## ✨ Fonctionnalités

- **Un mois par page, format paysage**, une colonne par jour
- **Activités configurables** (marche, piscine, pilates, vélo, gainage, course par défaut) : ajout/édition/suppression, icône, couleur et champs de détail personnalisés (durée, distance, séries, …)
- **Suivi du poids** en bas de chaque colonne, avec un **graphique** reliant les points du mois (plage configurable, par défaut 90–110 kg)
- **Sauvegarde automatique dans le navigateur** (localStorage) : rien n'est perdu au rafraîchissement
- **Impression directe** et **export PDF / Word (.docx)**
- **Formats papier** A4 / Letter / A3 / Legal, avec détection automatique selon la langue du navigateur
- **Français / Anglais**, détection automatique de la langue du navigateur
- **Thème clair / sombre** (sombre par défaut) et **couleur d'accent** personnalisable, image de fond optionnelle
- **Mode en ligne optionnel** pour remplir le calendrier directement dans le navigateur, avec **export/import JSON** des données
- **Import Garmin Connect** (fichier CSV exporté depuis Garmin Connect, best-effort — voir [documentation](#documentation))
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

## 📖 Documentation

Un guide d'utilisation complet (activités, suivi du poids, sauvegarde locale, mode en ligne, export, import Garmin, formats papier) est disponible directement dans l'application, menu **Documentation** (`/docs`), en français et en anglais.

## 🔒 Confidentialité

Cette application est strictement front-end : vos données (activités, poids, réglages) sont stockées uniquement dans le `localStorage` de votre navigateur et ne transitent par aucun serveur. L'export/import JSON vous permet de sauvegarder ou transférer vos données manuellement.
