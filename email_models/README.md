### Guide des templates e-mail Meetway

Ce document décrit la structure, les conventions et les spécificités des templates e-mail utilisés dans `email_models/`. Il sert de ligne directrice pour tous les e-mails du parcours utilisateur.

Référence compatibilité e-mail: voir la liste des balises autorisées et bonnes pratiques sur [Bitrix24 Helpdesk](https://helpdesk.bitrix24.fr/open/23197214/).

---

### Objectifs
- **Compatibilité maximale**: HTML basé sur des tables, styles inline, balises autorisées.
- **Lisibilité**: contenu clair, simple, sans éléments superflus.
- **Cohérence visuelle**: couleurs, police et composants réutilisables.
- **Humanisation**: micro‑storytelling court et scannable pour améliorer l’engagement.

---

### Structure générale d’un template

- **Doctype et balises racines**: `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`.
- **Head**:
  - `<meta charset>` et `<meta viewport>`.
  - Optionnel: `<link>` vers Roboto (fallback Arial/Helvetica).
  - `<title>` optimisé (objet de l’e‑mail) – ex: « Votre covoit' pour le Stade Brestois, en 2 clics. »
  - `<style>` minimal avec classes génériques.
- **Body**: tout le layout utilise des `table` imbriquées.
  - `wrapper` (100%) → `container` (max 600px) → sections.
  - Espacements via des « spacer » (tables ou `div` avec hauteur fixe).
  - **Préheader masqué**: un `div.preheader` en tout début de `<body>` pour la ligne d’aperçu (ex: « Votre covoit' pour le Stade Brestois, en 2 clics. »). Masqué via CSS inline.

---

### Composants communs

- **Header logos**
  - Deux logos alignés: `assets/meetway-logo.png` (gauche) et `assets/logo-stade-brestois.png` (droite).
  - Hauteur 32px, `display:block` pour éviter les espaces.

- **Badge contexte**
  - Pastille discrète au-dessus du titre.
  - Couleurs de confiance, non agressives.
  - Contient le contexte: ex. « Covoiturage · Stade Brestois · 24 novembre 2025 ».

- **Titre + micro‑storytelling**
  - Titre court et direct.
  - Paragraphes de 1 à 3 phrases maximum:
    - Mettre en scène le contexte (date, match, trajet) et le bénéfice.
    - Ton empathique, « vous » et « nous ».
    - Terminer par une transition vers l’action (« Vérifiez vos informations… »).

- **Carte récap (table d’informations)**
  - Conteneur `info-wrap` (bord arrondi + bordure légère).
  - Barre d’accent supérieure `accent-bar` avec la couleur principale.
  - Lignes: icône (emoji ou PNG), libellé, valeur.
  - Exemple de lignes: rôle, type de trajet, club, lieux.

- **CTA principal**
  - Bouton plein arrondi (table + lien) avec couleur principale.
  - Texte d’action à l’infinitif: « Modifier mes informations ».

- **Liens rapides**
  - Liste de liens ciblés pour modifier un élément précis (paramètre `focus` dans l’URL).

- **Preuve sociale (trust)**
  - Bloc discret indiquant le nombre de covoitureurs inscrits.
  - Exemple: « Déjà 143 covoitureurs inscrits pour ce match ».

- **Footer**
  - Texte légal/cadre d’usage.

---

### Styles et thèmes

- **Police**: Roboto via `<link>` Google Fonts, fallback `Arial, Helvetica, sans-serif`. Appliquer globalement sur `body, table, td, div, p, a, span`.
- **Couleur principale**: `rgb(241, 98, 16)` (`#F16210`).
  - Utilisée pour: liens, bouton principal, `accent-bar`, icônes accentuées.
- **Palette complémentaire**:
  - Fonds page: `#F5F7FA`.
  - Texte principal: `#0F172A`.
  - Texte secondaire: `#64748B`.
  - Bordures douces: `#E2E8F0` / `#F1F5F9`.
- **Espacements**: classes `.spacer-8`, `.spacer-16`, `.spacer-24`.

---

### Compatibilité e-mail (règles clés)

- **Tables uniquement** pour la mise en page. Éviter `flex`, `grid`, `position`.
- **Styles inline** pour tout ce qui est critique (couleurs, padding, font). Les classes sont supportées mais ne doivent pas être seules sources de style.
- **Balises autorisées** uniquement: `table`, `tr`, `td`, `img`, `a`, `div`, `span`, `p`, `b`, `i`, `u`, `strong`, `br`, `blockquote`, `ul`, `ol`, `li`, `thead`, `tbody`, `tfoot`, `th`, etc. Voir la référence Bitrix24.
- **Images**: utiliser des URLs absolues hébergées (ex: `/assets/...` à adapter en production vers une URL publique). `alt` et `title` obligatoires.
- **Émojis vs icônes**: émojis sont tolérés mais peuvent varier selon clients. Pour une cohérence, privilégier des PNG 1x/2x.

---

### Paramétrage dynamique

- Champs à personnaliser selon le contexte:
  - Objet (`<title>`), préheader, date de match, club, rôle utilisateur, type de trajet, lieux.
  - Liens de modification (`/carpool/preferences`, query `?focus=`).
  - Valeur « preuve sociale » (compteur de covoitureurs) – idéalement injectée par le backend.

---

### Checklist avant envoi

- **Objet** concis et orienté bénéfice (ex: « Votre covoit'… en 2 clics. »).
- **Préheader** aligné avec l’objet et utile dans l’aperçu.
- **Titres clairs** et ton rassurant.
- **Micro‑storytelling** court (≤ 3 phrases) immédiatement au-dessus du tableau.
- **Couleur principale** appliquée sur le bouton et les liens.
- **Police** Roboto chargée + fallback.
- **Table récap** lisible: 3 colonnes (icône, libellé, valeur).
- **Liens** testés (URLs absolues, `target="_blank"`).
- **Logos** présents avec attributs `alt` corrects.
- **Preuve sociale** mise à jour.
- **Test rendu**: desktop + mobile, Gmail/Outlook/Apple Mail.

---

### Exemple de fichiers

- `carpool_interest_confirmation.html`: modèle de confirmation d’intérêt pour covoiturage (Stade Brestois, 24/11/2025) avec objet optimisé, préheader, micro‑storytelling, tableau récap, CTA, liens rapides et bloc de confiance.

---

### Bonnes pratiques de contenu

- Rester simple, amical et orienté action.
- Éviter les longs paragraphes; privilégier listes et tableaux.
- Ne pas multiplier les couleurs; se limiter à l’accent principal.
- Utiliser un seul CTA principal.
- Tester des variantes (objet, première phrase, position de la preuve sociale).
