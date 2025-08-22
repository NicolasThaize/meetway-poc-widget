# MeetWay Widget - Proof of Concept

Un widget JavaScript événement agnostique pour l'intégration de covoiturage dans les pages de billetterie.

## 🚀 Fonctionnalités

- **Événement agnostique** : Détecte automatiquement les informations d'événement sur la page
- **Widget simplifié** : Affiche seulement "MeetWay", la proposition de valeur et la checkbox
- **Système de hiérarchie unifié** : Récupération intelligente des données événement et utilisateur
- **Fourniture manuelle** : Possibilité de fournir directement les données d'événement et utilisateur
- **Sélecteurs configurables** : Ajout de sélecteurs personnalisés pour améliorer la détection
- **Design responsive** : S'adapte à toutes les tailles d'écran
- **API simulée** : Simulation d'appels API pour le covoiturage
- **Intégration simple** : Une seule ligne de code pour l'intégration

## 📁 Structure du projet

```
meetway-widget-js/
├── index.html              # Page de démonstration principale
├── widget.js               # Widget JavaScript principal
├── config.js               # Configuration et sélecteurs personnalisables
├── example-integration.html # Exemple d'intégration dans une page existante
├── test.html               # Page de tests pour vérifier le fonctionnement
├── README.md               # Documentation utilisateur
└── DEVELOPER.md            # Documentation technique
```

## 🛠️ Installation et utilisation

### 1. Intégration simple (détection automatique)

```html
<!-- Conteneur pour le widget -->
<div id="meetway-widget-container"></div>

<!-- Inclusion des scripts -->
<script src="config.js"></script>
<script src="widget.js"></script>

<!-- Initialisation -->
<script>
    MeetWayWidget.init({
        containerId: 'meetway-widget-container',
        onCarpoolInterest: function(isInterested, eventInfo, userInfo) {
            console.log('Intérêt covoiturage:', isInterested);
            console.log('Informations événement:', eventInfo);
            console.log('Informations utilisateur:', userInfo);
            // Votre logique API ici
        }
    });
</script>
```

### 2. Fourniture manuelle des données

```javascript
MeetWayWidget.init({
    containerId: 'meetway-widget-container',
    eventData: {
        name: 'Mon Événement',
        date: '2024-01-15T20:00:00',
        location: 'Salle de concert',
        price: '25€',
        id: 'EVT-2024-001'
    },
    userData: {
        id: 'USER-123',
        email: 'user@example.com',
        name: 'John Doe',
        phone: '+33123456789'
    },
    onCarpoolInterest: function(isInterested, eventInfo, userInfo) {
        // Les données fournies manuellement sont prioritaires
        console.log('Événement:', eventInfo);
        console.log('Utilisateur:', userInfo);
    }
});
```

### 3. Configuration avancée

```javascript
MeetWayWidget.init({
    containerId: 'meetway-widget-container',
    widgetTitle: 'MeetWay',                    // Titre du widget
    carpoolValue: 'Partagez votre trajet !',   // Proposition de valeur
    eventData: {                               // Données événement manuelles (optionnel)
        name: 'Événement personnalisé',
        id: 'CUSTOM-001'
    },
    userData: {                                // Données utilisateur manuelles (optionnel)
        id: 'USER-001',
        email: 'user@example.com'
    },
    onCarpoolInterest: function(isInterested, eventInfo, userInfo) {
        // Callback appelé quand l'utilisateur change l'état de la checkbox
        fetch('/api/carpool-interest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                interested: isInterested,
                eventInfo: eventInfo,
                userInfo: userInfo
            })
        });
    }
});
```

## 🔄 Système de hiérarchie de récupération des données

Le widget utilise une hiérarchie de fallback unifiée pour récupérer les informations d'événement et utilisateur :

### Hiérarchie (par ordre de priorité)

1. **Données manuelles** : Fournies dans la configuration (`eventData`, `userData`)
2. **localStorage** : Données persistées localement
3. **Cookies** : Données stockées dans les cookies
4. **Sélecteurs DOM** : Détection automatique dans la page
5. **Fallback** : Données minimales (URL, titre de page)

### Récupération des informations d'événement

#### 1. Données manuelles
```javascript
eventData: {
    name: 'Concert de Rock',
    date: '2024-06-15T20:00:00',
    location: 'Stade de France',
    price: '50€ - 120€',
    id: 'EVT-2024-001'
}
```

#### 2. localStorage
Clé : `meetway_event_info` (expiration : 1 jour)

#### 3. Cookies
Préfixe : `meetway_event_`
- `meetway_event_name`
- `meetway_event_date`
- `meetway_event_location`
- `meetway_event_price`
- `meetway_event_id`

#### 4. Sélecteurs DOM
```javascript
// Sélecteurs par défaut (configurables)
name: ['h1', 'h2', 'h3', '.event-title', '[data-event-name]']
date: ['.event-date', '[data-event-date]', '[datetime]']
location: ['.event-location', '[data-event-location]']
price: ['.event-price', '[data-event-price]']
id: ['[data-event-id]', '.event-id']
```

### Récupération des informations utilisateur

#### 1. Données manuelles
```javascript
userData: {
    id: 'USER-123',
    email: 'user@example.com',
    name: 'John Doe',
    phone: '+33123456789'
}
```

#### 2. localStorage
Clé : `meetway_user_info` (expiration : 7 jours)

#### 3. Cookies
Préfixe : `meetway_`
- `meetway_user_id`
- `meetway_email`
- `meetway_name`
- `meetway_phone`

#### 4. Sélecteurs DOM
```javascript
// Sélecteurs par défaut
id: ['[data-user-id]', '.user-id']
email: ['[data-user-email]', '.user-email']
name: ['[data-user-name]', '.user-name']
phone: ['[data-user-phone]', '.user-phone']
```

## ⚙️ Configuration des sélecteurs

### Ajout de sélecteurs personnalisés

```javascript
// Ajouter un sélecteur pour le nom d'événement
addEventSelector('name', '.my-custom-event-name');
addEventSelector('name', '[data-my-event-title]');

// Ajouter un sélecteur pour la date
addEventSelector('date', '.my-custom-date');

// Ajouter plusieurs sélecteurs en une fois
addEventSelectors('location', ['.event-location', '.concert-venue', '.show-place']);
```

### Configuration dans config.js

```javascript
// Dans config.js
eventDetection: {
    nameSelectors: [
        'h1', 'h2', 'h3', 
        '.event-title', '.event-name', '[data-event-name]',
        '.my-custom-selector'  // Votre sélecteur personnalisé
    ],
    dateSelectors: [
        '[data-event-date]', '.event-date', '.date',
        '.my-custom-date'  // Votre sélecteur personnalisé
    ],
    // ... autres sélecteurs
}
```

## 🔧 API Reference

### Méthodes principales

#### `MeetWayWidget.init(config)`
Initialise le widget avec la configuration fournie.

**Paramètres :**
- `config.containerId` (string) : ID du conteneur HTML
- `config.widgetTitle` (string) : Titre du widget (défaut: "MeetWay")
- `config.carpoolValue` (string) : Proposition de valeur du covoiturage
- `config.eventData` (object) : Données d'événement fournies manuellement (optionnel)
- `config.userData` (object) : Données utilisateur fournies manuellement (optionnel)
- `config.onCarpoolInterest` (function) : Callback pour l'intérêt covoiturage

#### `MeetWayWidget.updateEventData(eventData)`
Met à jour les données d'événement et les sauvegarde dans localStorage.

#### `MeetWayWidget.updateUserInfo(newUserInfo)`
Met à jour les informations utilisateur et les sauvegarde dans localStorage.

#### `MeetWayWidget.getDetectedEventInfo()`
Retourne les informations d'événement récupérées.

#### `MeetWayWidget.getUserInfo()`
Retourne les informations utilisateur récupérées.

### Fonctions de configuration

#### `addEventSelector(field, selector)`
Ajoute un sélecteur personnalisé pour un champ spécifique.

#### `addEventSelectors(field, selectors)`
Ajoute plusieurs sélecteurs personnalisés pour un champ.

#### `getEventSelectors(field)`
Retourne tous les sélecteurs pour un champ spécifique.

### Callback onCarpoolInterest

```javascript
onCarpoolInterest: function(isInterested, eventInfo, userInfo) {
    // isInterested: boolean - L'utilisateur est-il intéressé
    // eventInfo: object - Informations d'événement (avec source)
    // userInfo: object - Informations utilisateur (avec source)
    
    fetch('/api/carpool-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            interested: isInterested,
            eventInfo: eventInfo,
            userInfo: userInfo,
            timestamp: new Date().toISOString()
        })
    });
}
```

## 🚗 Fonctionnalité de covoiturage

Le widget inclut une checkbox permettant aux utilisateurs de signaler leur intérêt pour le covoiturage. Quand l'utilisateur coche/décoche la case :

1. La fonction `onCarpoolInterest` est appelée avec l'état, les informations d'événement et utilisateur
2. Un appel API simulé est effectué (à remplacer par votre vraie API)
3. Un message de confirmation s'affiche

## 📱 Responsive Design

Le widget s'adapte automatiquement aux différentes tailles d'écran :

- **Desktop** : Affichage complet avec gradient
- **Tablet** : Adaptation automatique des espacements
- **Mobile** : Widget optimisé pour petits écrans

## 🧪 Test et démonstration

Pour tester le widget :

1. Ouvrez `index.html` dans votre navigateur
2. Testez la hiérarchie de récupération avec les boutons de test
3. Essayez la fourniture manuelle des données
4. Testez localStorage et cookies
5. Ajoutez des sélecteurs personnalisés
6. Testez la fonctionnalité de covoiturage
7. Ouvrez la console pour voir les logs détaillés
8. Utilisez `test.html` pour des tests approfondis

## 🔮 Évolutions futures

- [ ] Support de plusieurs langues
- [ ] SRI
- [ ] Thèmes personnalisables
- [ ] Intégration avec des APIs de covoiturage réelles
- [ ] Système de notifications push
- [ ] Support des événements récurrents
- [ ] Analytics et tracking
- [ ] Validation avancée des données
- [ ] Support des formats de date multiples
- [ ] Chiffrement des données utilisateur
- [ ] Support des sessions utilisateur

## 📄 Licence

Ce projet est un Proof of Concept développé pour MeetWay.

## 🤝 Contribution

Pour contribuer au développement du widget :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

---

**Note :** Ce widget est une version Proof of Concept. Pour une utilisation en production, il est recommandé d'ajouter des validations, une gestion d'erreurs robuste et des tests unitaires.
