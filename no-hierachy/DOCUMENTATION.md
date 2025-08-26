# Documentation du Widget Meetway - Version Ultra-Simplifiée

## Vue d'ensemble

Le widget Meetway Ultra-Simplifié est un composant JavaScript événement agnostique conçu pour s'intégrer dans les pages de billetterie avec une approche minimaliste. Il adopte une architecture directe sans détection automatique et exige que toutes les données soient fournies manuellement, garantissant un contrôle total et un comportement prévisible.

## Architecture et conception

Le widget ultra-simplifié adopte une architecture directe et linéaire, éliminant les patterns complexes au profit d'une approche fonctionnelle simple. Il est encapsulé dans une IIFE (Immediately Invoked Function Expression) pour éviter la pollution du namespace global.

### Structure technique

Le widget repose sur deux composants principaux :

1. **Widget principal** (`widget.js`) : Contient la logique métier simplifiée et l'interface utilisateur
2. **Configuration** (`config.js`) : Définit les paramètres personnalisables avec une structure plate

### Approche sans hiérarchie

Le widget adopte une approche directe et linéaire :

1. **Données manuelles obligatoires** : Toutes les informations d'événement doivent être fournies explicitement
2. **Configuration plate** : Structure de configuration simple sans imbrication profonde
3. **API directe** : Méthodes simples sans abstraction complexe
4. **Pas de détection automatique** : Élimination complète des sélecteurs DOM et de la détection automatique

Cette approche garantit un comportement 100% prévisible et un contrôle total sur les données transmises.

## Intégration dans une billetterie

### Méthode d'intégration ultra-simple

L'intégration du widget dans une page de billetterie se fait en trois étapes minimales :

```html
<!-- 1. Conteneur HTML -->
<div id="meetway-container"></div>

<!-- 2. Inclusion des scripts -->
<script src="config.js"></script>
<script src="widget.js"></script>

<!-- 3. Initialisation avec données obligatoires -->
<script>
    MeetwayWidget.init({
        containerId: 'meetway-container',
        eventData: {
            name: 'Concert de Rock 2024',
            date: '2024-06-15T20:00:00',
            description: 'Une soirée exceptionnelle avec les meilleurs artistes',
            id: 'EVT-2024-001',
            url: 'https://example.com/event/rock-concert',
            pageTitle: 'Concert de Rock 2024 - Billetterie'
        },
        onInterest: function(isInterested, eventInfo, userInfo) {
            // Exemple simple: retourner directement une URL d'édition
            return 'https://app.meetway.fr/edit/UNIQUE_USER_EVENT_ID';
        }
    });
</script>
```

### Fourniture obligatoire des données

Le widget exige que toutes les données soient fournies manuellement :

```javascript
MeetwayWidget.init({
    containerId: 'meetway-container',
    eventData: {
        name: 'Concert de Rock 2024',
        date: '2024-06-15T20:00:00',
        description: 'Une soirée exceptionnelle avec les meilleurs artistes',
        id: 'EVT-2024-001',
        url: 'https://example.com/event/rock-concert',
        pageTitle: 'Concert de Rock 2024 - Billetterie',
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
    onInterest: function(isInterested, eventInfo, userInfo) {
        // Exemple d'appel API renvoyant une URL d'édition
        return fetch('https://api.example.com/carpool-interest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isInterested, eventInfo, userInfo })
        }).then(r => r.json()); // Réponse doit contenir une URL: string ou { editUrl | url } ou { data: { editUrl | url } }
    }
});
```

## Configuration et personnalisation

### Paramètres de configuration

Le widget accepte des paramètres de configuration simples et directs :

- **containerId** : Identifiant du conteneur HTML (obligatoire)
- **eventData** : Données d'événement fournies manuellement (obligatoire)
- **userData** : Données utilisateur fournies manuellement (optionnel)
- **onInterest** : Fonction de callback pour traiter l'intérêt
- **onCguClick** : Fonction de callback pour le clic sur les CGU

### Personnalisation des messages

La personnalisation se fait via la fonction `customizeMeetway` :

```javascript
// Personnalisation des messages
customizeMeetway({
    messages: {
        title: 'Venir en covoiturage',
        interestText: 'Je suis intéressé(e) pour covoiturer',
        successMessage: '✅ Intérêt enregistré ! Nous vous contacterons pour organiser le covoiturage.',
        cguText: 'En cochant cette case, vous acceptez nos conditions générales d\'utilisation de Meetway.'
    }
});
```

### Personnalisation des tags de fonctionnalités

```javascript
// Personnalisation des tags
customizeMeetway({
    features: {
        tag1: 'Votre place réservée et payée',
        tag2: 'Économisez 10€',
        tag3: 'Rencontrez du monde'
    }
});
```

### Configuration globale

Le fichier `config.js` permet de définir une configuration globale accessible via `window.MeetwayConfig` :

```javascript
const MeetwayConfig = {
    theme: 'light',
    language: 'fr',
    primaryColor: 'rgb(241, 98, 16)',
    textColor: '#333',
    messages: {
        title: 'Venir en covoiturage',
        interestText: 'Je suis intéressé(e) pour covoiturer',
        successMessage: '✅ Intérêt enregistré !',
        cguText: 'En cochant cette case, vous acceptez nos conditions...'
    },
    features: {
        tag1: 'Votre place réservée et payée',
        tag2: 'Économisez 10€',
        tag3: 'Rencontrez du monde'
    },
    apiEndpoint: '/api/carpool-interest'
};
```

## Sécurité et robustesse

### Sécurité du déploiement

Le widget maintient les mesures de sécurité suivantes :

1. **Subresource Integrity (SRI)** : Les fichiers JavaScript et CSS doivent être chargés avec des hashes SRI
2. **Content Security Policy (CSP)** : Le widget respecte les politiques CSP
3. **Isolation CSS** : Les styles sont encapsulés pour éviter les conflits
4. **Pas de dépendances externes** : Le widget ne charge aucune ressource externe

### Gestion des erreurs simplifiée

Le widget simplifie la gestion d'erreurs :

1. **Validation des données obligatoires** : Vérification que `eventData` est fourni
2. **Gestion d'erreurs directe** : Messages d'erreur clairs et explicites
3. **Fallback minimal** : En cas d'échec, affichage d'un message d'erreur simple
4. **Logs de débogage** : Messages de console pour faciliter le débogage

### Comportement en cas d'échec API

Si l'appel API échoue, le widget adopte un comportement non intrusif :

1. **Silence par défaut** : Aucune erreur visible pour l'utilisateur final
2. **Logs en console** : Les erreurs sont loggées en console pour le débogage
3. **État persistant** : L'état de l'interface utilisateur reste cohérent
4. **Callback d'erreur** : Fonction de callback optionnelle pour gérer les erreurs

### Protection des données utilisateur

1. **Contrôle total** : Les données sont uniquement celles fournies manuellement
2. **Pas de stockage local** : Aucune persistance automatique des données
3. **Minimisation des données** : Seules les données nécessaires sont transmises
4. **Conformité RGPD** : Respect des principes de minimisation des données

## Structure des données

### Informations d'événement

Le widget accepte les informations d'événement suivantes :

- **name** (string, obligatoire) : Nom de l'événement (alias : title, eventName)
- **date** (string, obligatoire) : Date de l'événement (alias : eventDate, datetime)
- **description** (string, optionnel) : Description de l'événement (alias : desc, details)
- **id** (string, obligatoire) : Identifiant unique de l'événement (alias : eventId, event_id)
- **customData** (object, optionnel) : Dictionnaire personnalisable pour des données supplémentaires (alias : custom_data, metadata)
- **url** (string, optionnel) : URL de la page de l'événement (défaut : URL courante)
- **pageTitle** (string, optionnel) : Titre de la page (défaut : document.title)

### Informations utilisateur

Le widget accepte les informations utilisateur suivantes :

- **id** (string, optionnel) : Identifiant unique de l'utilisateur (alias : userId, user_id)
- **firstName** (string, optionnel) : Prénom de l'utilisateur (alias : first_name, prenom)
- **lastName** (string, optionnel) : Nom de famille de l'utilisateur (alias : last_name, nom)
- **email** (string, optionnel) : Adresse email de l'utilisateur (alias : mail)
- **phone** (string, optionnel) : Numéro de téléphone de l'utilisateur (alias : telephone, phoneNumber, tel)
- **billingAddress** (string, optionnel) : Adresse de facturation (alias : billing_address, adresse)
- **customData** (object, optionnel) : Dictionnaire personnalisable pour des données supplémentaires (alias : custom_data, metadata)

### Compatibilité des alias

Le widget accepte plusieurs alias pour chaque champ, garantissant une compatibilité maximale avec différents formats de données :

#### Alias pour les événements
- `name` : `title`, `eventName`
- `date` : `eventDate`, `datetime`
- `description` : `desc`, `details`
- `id` : `eventId`, `event_id`
- `customData` : `custom_data`, `metadata`

#### Alias pour les utilisateurs
- `id` : `userId`, `user_id`
- `firstName` : `first_name`, `prenom`
- `lastName` : `last_name`, `nom`
- `email` : `mail`
- `phone` : `telephone`, `phoneNumber`, `tel`
- `billingAddress` : `billing_address`, `adresse`
- `customData` : `custom_data`, `metadata`

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

### Exemple d'utilisation avec alias

Le widget accepte également les formats de données alternatifs :

```javascript
MeetwayWidget.init({
    containerId: 'meetway-container',
    eventData: {
        title: 'Concert de Rock 2024',           // alias de 'name'
        eventDate: '2024-06-15T20:00:00',       // alias de 'date'
        desc: 'Une soirée exceptionnelle',       // alias de 'description'
        eventId: 'EVT-2024-001',                // alias de 'id'
        custom_data: {                          // alias de 'customData'
            category: 'concert'
        }
    },
    userData: {
        userId: 'USER-123',                     // alias de 'id'
        first_name: 'John',                     // alias de 'firstName'
        last_name: 'Doe',                       // alias de 'lastName'
        mail: 'john.doe@example.com',           // alias de 'email'
        telephone: '+33123456789',              // alias de 'phone'
        billing_address: '123 Rue de la Paix',  // alias de 'billingAddress'
        metadata: {                             // alias de 'customData'
            loyaltyLevel: 'gold'
        }
    },
    onInterest: function(isInterested, eventInfo, userInfo) {
        // Traitement de l'intérêt
    }
});
```

## API et méthodes publiques

### Méthodes principales

- **`MeetwayWidget.init(config)`** : Initialise le widget avec les données obligatoires
- **`MeetwayWidget.updateEventData(eventData)`** : Met à jour les données d'événement
- **`MeetwayWidget.updateUserData(userData)`** : Met à jour les informations utilisateur
- **`MeetwayWidget.getEventInfo()`** : Récupère les informations d'événement actuelles
- **`MeetwayWidget.getUserData()`** : Récupère les informations utilisateur actuelles

### Callbacks et événements

Le widget utilise un système de callbacks simple pour communiquer avec le site hôte. Après validation et succès de l'appel API, l'interface remplace la checkbox et le bouton par un message de confirmation et un bouton « Modifier mes informations » qui pointe vers l'URL renvoyée par l'API. Si aucune URL n'est renvoyée, le widget utilise le fallback `editInfoUrl` défini dans `config.js`.

```javascript
// Retour attendu pour onInterest: string | object | Promise<string | object>
// La valeur résolue doit contenir l'URL d'édition envoyée par l'API
// Formats acceptés: 
// - string (URL directe)
// - { editUrl } | { edit_info_url } | { url }
// - { data: { editUrl | url } }
onInterest: function(isInterested, eventInfo, userInfo) {
    // isInterested : boolean - L'utilisateur est-il intéressé
    // eventInfo : object - Informations d'événement fournies
    // userInfo : object - Informations utilisateur fournies
    // Retourner la réponse de l'API (ou une Promise) contenant l'URL d'édition
}

onCguClick: function() {
    // Callback pour le clic sur les CGU
    // Permet d'ouvrir une modal ou rediriger vers les CGU
}
```

## Performance et optimisation

### Optimisations techniques

1. **Code minimal** : Réduction de la taille du code pour des performances optimales
2. **Chargement direct** : Pas de détection automatique, chargement immédiat
3. **Styles inline** : Les styles sont injectés directement pour éviter les requêtes HTTP
4. **Pas de cache complexe** : Élimination du système de cache hiérarchique

### Métriques de performance

Le widget est optimisé pour :
- **Temps de chargement** : < 50ms d'impact sur le temps de chargement
- **Taille** : < 6KB gzippé pour l'ensemble du widget
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
- **example.html** : Exemple d'intégration complet avec données manuelles
- **example.confirmation.html** : Exemple avec page de confirmation

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

## Avantages du widget

### Simplicité maximale

1. **Code direct** : Pas d'abstraction complexe, code facile à comprendre
2. **API simple** : Méthodes directes sans hiérarchie complexe
3. **Configuration plate** : Structure de configuration linéaire
4. **Débogage facile** : Code simple à tracer et corriger

### Contrôle total

1. **Données contrôlées** : Seules les données fournies manuellement sont utilisées
2. **Comportement prévisible** : Pas de détection automatique, comportement 100% prévisible
3. **Personnalisation directe** : Modification simple des messages et styles
4. **Sécurité renforcée** : Pas d'accès au DOM, données entièrement contrôlées

### Performance optimale

1. **Taille réduite** : Code minimal et optimisé
2. **Chargement rapide** : Pas de détection automatique, chargement immédiat
3. **Mémoire minimale** : Utilisation réduite des ressources du navigateur
4. **CPU optimisé** : Impact négligeable sur les performances

### Maintenance facilitée

1. **Code lisible** : Structure simple et directe
2. **Débogage simple** : Pas de hiérarchie complexe à naviguer
3. **Modifications rapides** : Changements directs sans impact sur l'architecture
4. **Tests simplifiés** : Tests directs sans mocks complexes

## Cas d'usage recommandés

Le widget est parfait pour :

- **Intégrations simples** : Billetteries avec données structurées
- **Contrôle strict** : Environnements nécessitant un contrôle total des données
- **Performance critique** : Pages où la performance est primordiale
- **Développement rapide** : Prototypage et développement accéléré
- **Maintenance facile** : Équipes préférant la simplicité à la complexité

Cette architecture garantit que le widget s'intègre de manière fiable et prévisible dans n'importe quelle billetterie, tout en offrant un contrôle total sur les données et une simplicité maximale pour l'intégration et la maintenance.
