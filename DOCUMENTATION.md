# Documentation du Widget Meetway

## Vue d'ensemble

Le widget Meetway est un composant JavaScript événement agnostique conçu pour s'intégrer dans les pages de billetterie et permettre aux utilisateurs de signaler leur intérêt pour le covoiturage. Il se caractérise par sa capacité à détecter automatiquement les informations d'événement sur la page web et à s'adapter à différents contextes sans configuration manuelle.

## Architecture et création du widget

Le widget est construit selon une architecture modulaire utilisant le pattern Strategy pour la récupération des données. Il est encapsulé dans une IIFE (Immediately Invoked Function Expression) pour éviter la pollution du namespace global.

### Structure technique

Le widget repose sur trois composants principaux :

1. **Widget principal** (`widget.js`) : Contient la logique métier et l'interface utilisateur
2. **Configuration** (`config.js`) : Définit les paramètres personnalisables et les sélecteurs DOM
3. **Styles CSS intégrés** : Définis directement dans le JavaScript pour garantir l'isolation

### Pattern Strategy pour la récupération des données

Le widget utilise une hiérarchie de fallback unifiée pour récupérer les informations d'événement et utilisateur :

1. **Données manuelles** : Fournies directement dans la configuration
2. **localStorage** : Données persistées localement avec expiration
3. **Cookies** : Données stockées dans les cookies du navigateur
4. **Sélecteurs DOM** : Détection automatique dans la structure HTML
5. **Fallback** : Données minimales (URL, titre de page)

Cette approche garantit que le widget fonctionne même si certaines sources de données ne sont pas disponibles.

## Intégration dans une billetterie

### Méthode d'intégration standard

L'intégration du widget dans une page de billetterie se fait en trois étapes simples :

```html
<!-- 1. Conteneur HTML -->
<div id="Meetway-widget-container"></div>

<!-- 2. Inclusion des scripts -->
<script src="https://cdn.meetway.org/widget/config.js"></script>
<script src="https://cdn.meetway.org/widget/widget.js"></script>

<!-- 3. Initialisation -->
<script>
    MeetwayWidget.init({
        containerId: 'Meetway-widget-container',
        onCarpoolInterest: function(isInterested, eventInfo, userInfo) {
            // Logique de traitement de l'intérêt covoiturage
        }
    });
</script>
```

### Détection automatique des informations

Le widget détecte automatiquement les informations d'événement présentes sur la page en utilisant des sélecteurs CSS configurables. Il recherche les éléments suivants :

- **Nom de l'événement** : Titres (h1, h2, h3), classes `.event-title`, attributs `data-event-name`
- **Date** : Éléments avec attributs `data-event-date`, classes `.event-date`, balises `<time>`
- **Description** : Éléments avec attributs `data-event-description`, classes `.event-description`, `.description`
- **Identifiant** : Éléments avec attributs `data-event-id`, classes `.event-id`

### Fourniture manuelle des données

Pour les cas où la détection automatique ne suffit pas, il est possible de fournir directement les données :

```javascript
MeetwayWidget.init({
    containerId: 'Meetway-widget-container',
    eventData: {
        name: 'Concert de Rock 2024',
        date: '2024-06-15T20:00:00',
        description: 'Une soirée exceptionnelle avec les meilleurs artistes',
        id: 'EVT-2024-001',
        customData: {
            category: 'concert',
            capacity: 5000,
            organizer: 'Rock Productions'
        }
    },
    userData: {
        id: 'USER-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+33123456789',
        billingAddress: '123 Rue de la Paix, 75001 Paris',
        customData: {
            loyaltyLevel: 'gold',
            preferences: ['rock', 'jazz']
        }
    },
    onCarpoolInterest: function(isInterested, eventInfo, userInfo) {
        // Traitement de l'intérêt
    }
});
```

## Configuration et personnalisation

### Paramètres de configuration

Le widget accepte plusieurs paramètres de configuration :

- **containerId** : Identifiant du conteneur HTML (obligatoire)
- **widgetTitle** : Titre affiché dans le widget (défaut : "Meetway")
- **carpoolValue** : Proposition de valeur pour le covoiturage
- **eventData** : Données d'événement fournies manuellement
- **userData** : Données utilisateur fournies manuellement
- **onCarpoolInterest** : Fonction de callback pour traiter l'intérêt

### Personnalisation des sélecteurs

Il est possible d'ajouter des sélecteurs personnalisés pour améliorer la détection :

```javascript
// Ajout d'un sélecteur personnalisé
addEventSelector('name', '.my-custom-event-title');
addEventSelector('date', '.my-custom-date');

// Ajout de plusieurs sélecteurs
addEventSelectors('location', ['.event-location', '.concert-venue']);
```

### Configuration globale

Le fichier `config.js` permet de définir une configuration globale accessible via `window.MeetwayConfig` :

```javascript
const MeetwayConfig = {
    general: {
        theme: 'light',
        language: 'fr',
        showCarpoolOption: true
    },
    api: {
        endpoint: '/api/carpool-interest',
        timeout: 5000,
        retryAttempts: 3
    },
    styling: {
        primaryColor: '#667eea',
        borderRadius: '15px',
        maxWidth: '350px'
    },
    eventDetection: {
        nameSelectors: ['h1', '.event-title', '[data-event-name]'],
        dateSelectors: ['.event-date', '[data-event-date]'],
        // ... autres sélecteurs
    }
};
```

## Sécurité et robustesse

### Sécurité du déploiement CDN

Le widget est conçu pour être déployé sur un CDN avec les mesures de sécurité suivantes :

1. **Subresource Integrity (SRI)** : Les fichiers JavaScript et CSS doivent être chargés avec des hashes SRI pour vérifier leur intégrité
2. **Content Security Policy (CSP)** : Le widget respecte les politiques CSP et peut fonctionner en mode strict
3. **Isolation CSS** : Les styles sont encapsulés pour éviter les conflits avec le site hôte
4. **Pas de dépendances externes** : Le widget ne charge aucune ressource externe non contrôlée

### Gestion des erreurs et fallbacks

Le widget est conçu pour ne jamais faire crasher la page hôte :

1. **Gestion d'erreurs robuste** : Toutes les opérations sont encapsulées dans des blocs try-catch
2. **Fallbacks multiples** : Si une source de données échoue, le widget passe automatiquement à la suivante
3. **Dégradation gracieuse** : En cas d'échec complet, le widget affiche un état minimal fonctionnel
4. **Logs non bloquants** : Les logs de débogage n'interfèrent pas avec le fonctionnement

### Comportement en cas d'échec API

Si l'appel API échoue, le widget adopte un comportement non intrusif :

1. **Silence par défaut** : Aucune erreur visible pour l'utilisateur final
2. **Logs en console** : Les erreurs sont loggées en console pour le débogage
3. **État persistant** : L'état de l'interface utilisateur reste cohérent
4. **Retry automatique** : Possibilité de retenter l'appel API (configurable)
5. **Callback d'erreur** : Fonction de callback optionnelle pour gérer les erreurs côté client

### Protection des données utilisateur

1. **Chiffrement local** : Les données sensibles peuvent être chiffrées avant stockage
2. **Expiration automatique** : Les données stockées localement expirent automatiquement
3. **Pas de données sensibles** : Le widget ne collecte que les données nécessaires
4. **Conformité RGPD** : Respect des principes de minimisation des données

## Structure des données

### Informations d'événement

Le widget récupère les informations d'événement suivantes :

- **name** (string) : Nom de l'événement
- **date** (string) : Date de l'événement (format ISO ou texte)
- **description** (string, nullable) : Description de l'événement
- **id** (string) : Identifiant unique de l'événement côté billetterie
- **customData** (object) : Dictionnaire personnalisable pour des données supplémentaires
- **url** (string) : URL de la page de l'événement
- **pageTitle** (string) : Titre de la page
- **source** (string) : Source des données (manual, localStorage, cookies, dom, fallback)
- **timestamp** (string) : Horodatage de récupération

### Informations utilisateur

Le widget récupère les informations utilisateur suivantes :

- **id** (string) : Identifiant unique de l'utilisateur côté billetterie
- **firstName** (string, nullable) : Prénom de l'utilisateur
- **lastName** (string, nullable) : Nom de famille de l'utilisateur
- **email** (string, nullable) : Adresse email de l'utilisateur
- **phone** (string, nullable) : Numéro de téléphone de l'utilisateur
- **billingAddress** (string, nullable) : Adresse de facturation
- **customData** (object) : Dictionnaire personnalisable pour des données supplémentaires
- **source** (string) : Source des données (manual, localStorage, cookies, dom, fallback)
- **timestamp** (string) : Horodatage de récupération

### Dictionnaires personnalisables

Les champs `customData` permettent d'ajouter n'importe quelle donnée supplémentaire :

```javascript
// Pour un événement
eventData: {
    name: 'Concert de Rock',
    customData: {
        category: 'concert',
        capacity: 5000,
        organizer: 'Rock Productions',
        tags: ['rock', 'live', 'festival'],
        metadata: {
            internalId: 'INT-001',
            priority: 'high'
        }
    }
}

// Pour un utilisateur
userData: {
    firstName: 'John',
    customData: {
        loyaltyLevel: 'gold',
        preferences: ['rock', 'jazz'],
        marketingConsent: true,
        internalData: {
            customerSince: '2020-01-01',
            totalPurchases: 15
        }
    }
}
```

## API et méthodes publiques

### Méthodes principales

- **`MeetwayWidget.init(config)`** : Initialise le widget
- **`MeetwayWidget.updateEventData(eventData)`** : Met à jour les données d'événement
- **`MeetwayWidget.updateUserInfo(userInfo)`** : Met à jour les informations utilisateur
- **`MeetwayWidget.getDetectedEventInfo()`** : Récupère les informations détectées
- **`MeetwayWidget.getUserInfo()`** : Récupère les informations utilisateur

### Callbacks et événements

Le widget utilise un système de callbacks pour communiquer avec le site hôte :

```javascript
onCarpoolInterest: function(isInterested, eventInfo, userInfo) {
    // isInterested : boolean - L'utilisateur est-il intéressé
    // eventInfo : object - Informations d'événement avec source
    // userInfo : object - Informations utilisateur avec source
}
```

## Performance et optimisation

### Optimisations techniques

1. **Chargement asynchrone** : Le widget ne bloque pas le rendu de la page
2. **Styles inline** : Les styles sont injectés directement pour éviter les requêtes HTTP
3. **Cache intelligent** : Les données sont mises en cache localement avec expiration
4. **Détection différée** : La détection des informations se fait après le chargement de la page

### Métriques de performance

Le widget est optimisé pour :
- **Temps de chargement** : < 100ms d'impact sur le temps de chargement
- **Taille** : < 50KB gzippé pour l'ensemble du widget
- **Mémoire** : Utilisation minimale de la mémoire du navigateur
- **CPU** : Impact négligeable sur les performances de la page

## Compatibilité et support

### Navigateurs supportés

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Environnements de test

Le widget inclut plusieurs pages de test :
- **test.html** : Tests complets de toutes les fonctionnalités
- **example-integration.html** : Exemple d'intégration dans une page existante
- **test-widget.html** : Tests spécifiques du widget

## Maintenance et évolutions

### Versioning

Le widget utilise un système de versioning sémantique avec :
- **Version majeure** : Changements incompatibles
- **Version mineure** : Nouvelles fonctionnalités compatibles
- **Version patch** : Corrections de bugs

### Mises à jour

Les mises à jour du widget sont gérées via le CDN et peuvent être :
- **Automatiques** : Mise à jour transparente pour les utilisateurs
- **Contrôlées** : Possibilité de forcer une version spécifique
- **Progressive** : Déploiement progressif pour éviter les régressions

Cette architecture garantit que le widget Meetway s'intègre de manière fiable et sécurisée dans n'importe quelle billetterie, tout en offrant une flexibilité maximale pour la personnalisation et l'adaptation aux besoins spécifiques de chaque partenaire.
