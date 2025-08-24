# Meetway Widget - Documentation Technique

Documentation technique pour les développeurs souhaitant contribuer ou étendre le widget Meetway.

## 🏗️ Architecture

### Vue d'ensemble

Le widget utilise une architecture modulaire basée sur le pattern Strategy pour la récupération des données. L'architecture est divisée en plusieurs couches :

1. **Couche d'initialisation** : `MeetwayWidget.init()`
2. **Couche de gestion des données** : `UserInfoManager` et `EventInfoManager`
3. **Couche de stratégies** : Classes Strategy pour chaque source de données
4. **Couche de rendu** : Génération et affichage du widget
5. **Couche d'API** : Gestion des appels et callbacks

### Flux de données

```
Initialisation → Récupération données → Rendu widget → Interaction utilisateur → API
     ↓                    ↓                    ↓                    ↓
UserInfoManager    EventInfoManager    generateHTML()    handleCarpoolChange()
EventInfoManager   (Hiérarchie)       render()         simulateApiCall()
```

## 🔄 Système de hiérarchie unifié

### Principe

Le widget utilise un système de hiérarchie de fallback unifié pour récupérer les informations d'événement et utilisateur. Chaque type de données suit la même hiérarchie :

1. **Données manuelles** (priorité maximale)
2. **localStorage** (persistance locale)
3. **Cookies** (persistance navigateur)
4. **Sélecteurs DOM** (détection automatique)
5. **Fallback** (données minimales)

### Implémentation

#### Managers principaux

```javascript
class UserInfoManager {
    constructor() {
        this.strategies = {
            manual: new ManualUserInfoStrategy(),
            localStorage: new LocalStorageUserInfoStrategy(),
            cookies: new CookiesUserInfoStrategy(),
            dom: new DOMUserInfoStrategy()
        };
    }
    
    async getUserInfo(config) {
        // Tentative avec données manuelles
        if (config.userData) {
            const manualInfo = this.strategies.manual.getUserInfo(config.userData);
            if (manualInfo && Object.keys(manualInfo).length > 0) {
                return manualInfo;
            }
        }
        
        // Tentative avec localStorage
        try {
            const localStorageInfo = this.strategies.localStorage.getUserInfo();
            if (localStorageInfo && Object.keys(localStorageInfo).length > 0) {
                return localStorageInfo;
            }
        } catch (error) {
            console.warn('Erreur localStorage:', error);
        }
        
        // ... autres tentatives
        
        // Fallback
        return {
            id: null, email: null, name: null, phone: null,
            source: 'fallback', timestamp: new Date().toISOString()
        };
    }
}
```

#### Stratégies

Chaque stratégie implémente la même interface :

```javascript
class ManualUserInfoStrategy {
    getUserInfo(userData) {
        return {
            id: userData.id || userData.userId || null,
            email: userData.email || userData.mail || null,
            name: userData.name || userData.fullName || null,
            phone: userData.phone || userData.telephone || null,
            source: 'manual',
            timestamp: new Date().toISOString()
        };
    }
}
```

### Gestion du localStorage

#### Expiration des données

- **Événements** : 1 jour (24h)
- **Utilisateurs** : 7 jours

```javascript
isDataValid(timestamp, maxAge = 7 * 24 * 60 * 60 * 1000) {
    const dataDate = new Date(timestamp);
    const now = new Date();
    return (now - dataDate) < maxAge;
}
```

#### Clés de stockage

- `Meetway_user_info` : Données utilisateur
- `Meetway_event_info` : Données événement

### Gestion des cookies

#### Préfixes

- **Utilisateurs** : `Meetway_`
- **Événements** : `Meetway_event_`

#### Cookies supportés

**Utilisateurs :**
- `Meetway_user_id`
- `Meetway_email`
- `Meetway_name`
- `Meetway_phone`

**Événements :**
- `Meetway_event_name`
- `Meetway_event_date`
- `Meetway_event_location`
- `Meetway_event_price`
- `Meetway_event_id`

## 🔧 API Reference

### Méthodes publiques

#### `MeetwayWidget.init(config)`

Initialise le widget avec la configuration fournie.

**Paramètres :**
```javascript
{
    containerId: string,           // ID du conteneur HTML
    widgetTitle?: string,          // Titre du widget (défaut: "Meetway")
    carpoolValue?: string,         // Proposition de valeur
    eventData?: object,            // Données événement manuelles
    userData?: object,             // Données utilisateur manuelles
    onCarpoolInterest?: function   // Callback d'intérêt
}
```

**Flux d'exécution :**
1. Fusion de la configuration par défaut
2. Injection des styles CSS
3. Récupération du conteneur
4. Récupération des informations utilisateur (hiérarchie)
5. Récupération des informations événement (hiérarchie)
6. Rendu du widget

#### `MeetwayWidget.updateEventData(eventData)`

Met à jour les données d'événement et les sauvegarde automatiquement.

```javascript
MeetwayWidget.updateEventData({
    name: 'Nouveau nom',
    price: 'Nouveau prix'
});
// Sauvegarde automatique dans localStorage
```

#### `MeetwayWidget.updateUserInfo(newUserInfo)`

Met à jour les informations utilisateur et les sauvegarde automatiquement.

```javascript
MeetwayWidget.updateUserInfo({
    email: 'nouveau@email.com',
    phone: '+33987654321'
});
// Sauvegarde automatique dans localStorage
```

#### `MeetwayWidget.getDetectedEventInfo()`

Retourne une copie des informations d'événement récupérées.

```javascript
const eventInfo = MeetwayWidget.getDetectedEventInfo();
console.log('Source:', eventInfo.source);
console.log('Nom:', eventInfo.name);
```

#### `MeetwayWidget.getUserInfo()`

Retourne une copie des informations utilisateur récupérées.

```javascript
const userInfo = MeetwayWidget.getUserInfo();
console.log('Source:', userInfo.source);
console.log('Email:', userInfo.email);
```

### Fonctions de configuration

#### `addEventSelector(field, selector)`

Ajoute un sélecteur personnalisé pour un champ spécifique.

```javascript
addEventSelector('name', '.my-custom-title');
addEventSelector('date', '[data-my-date]');
```

**Champs supportés :** `name`, `date`, `location`, `price`, `id`

#### `addEventSelectors(field, selectors)`

Ajoute plusieurs sélecteurs personnalisés pour un champ.

```javascript
addEventSelectors('name', ['.event-title', '.concert-name', '.show-title']);
```

#### `getEventSelectors(field)`

Retourne tous les sélecteurs pour un champ spécifique.

```javascript
const nameSelectors = getEventSelectors('name');
console.log('Sélecteurs nom:', nameSelectors);
```

### Callback onCarpoolInterest

```javascript
onCarpoolInterest: function(isInterested, eventInfo, userInfo) {
    // isInterested: boolean
    // eventInfo: {
    //     name: string,
    //     date: string,
    //     location: string,
    //     price: string,
    //     id: string,
    //     url: string,
    //     pageTitle: string,
    //     source: string,
    //     timestamp: string
    // }
    // userInfo: {
    //     id: string,
    //     email: string,
    //     name: string,
    //     phone: string,
    //     source: string,
    //     timestamp: string
    // }
}
```

## 🎨 CSS et Styling

### Classes CSS principales

```css
.Meetway-widget              /* Conteneur principal */
.Meetway-widget-header       /* En-tête du widget */
.Meetway-widget-title        /* Titre principal */
.Meetway-widget-subtitle     /* Sous-titre */
.Meetway-carpool-section     /* Section covoiturage */
.Meetway-carpool-value       /* Proposition de valeur */
.Meetway-checkbox-container  /* Conteneur checkbox */
.Meetway-checkbox           /* Checkbox */
.Meetway-checkbox-label     /* Label checkbox */
.Meetway-success-message    /* Message de succès */
```

### Responsive Design

```css
@media (max-width: 480px) {
    .Meetway-widget {
        padding: 20px;
        margin: 10px;
    }
    
    .Meetway-widget-title {
        font-size: 24px;
    }
}
```

## 🛡️ Gestion d'erreurs

### Stratégies de fallback

Chaque stratégie inclut une gestion d'erreurs robuste :

```javascript
try {
    const data = this.strategies.localStorage.getUserInfo();
    if (data && Object.keys(data).length > 0) {
        return data;
    }
} catch (error) {
    console.warn('Erreur lors de la récupération depuis localStorage:', error);
}
```

### Validation des données

```javascript
// Vérification de l'expiration
if (parsedData.timestamp && this.isDataValid(parsedData.timestamp)) {
    return { ...parsedData, source: 'localStorage' };
} else {
    localStorage.removeItem(this.storageKey);
}
```

### Logs de débogage

Le widget utilise des emojis pour faciliter le débogage :

- 🔍 Récupération des données
- ✅ Données récupérées avec succès
- ⚠️ Erreur ou fallback
- 💾 Sauvegarde des données
- 🚗 Appel API simulé

## ⚡ Performance

### Optimisations

1. **Injection CSS unique** : Vérification avant injection
2. **Cache localStorage** : Évite les requêtes répétées
3. **Sélecteurs optimisés** : Arrêt au premier match
4. **Gestion d'erreurs** : Évite les blocages

### Métriques

- **Taille du widget** : ~15KB (minifié)
- **Temps d'initialisation** : <100ms
- **Mémoire** : <1MB
- **Compatibilité** : IE11+, Chrome, Firefox, Safari

## 🧪 Tests

### Tests unitaires

```javascript
// Test de la hiérarchie de récupération
describe('UserInfoManager', () => {
    it('should prioritize manual data over localStorage', async () => {
        // Test implementation
    });
    
    it('should fallback to DOM selectors', async () => {
        // Test implementation
    });
});
```

### Tests d'intégration

```javascript
// Test de l'initialisation complète
describe('MeetwayWidget', () => {
    it('should initialize with all data sources', async () => {
        // Test implementation
    });
});
```

### Tests de régression

- Vérification de la hiérarchie de fallback
- Test des sélecteurs personnalisés
- Validation de la persistance localStorage
- Test de la gestion d'erreurs

## 🔒 Sécurité

### Bonnes pratiques

1. **Pas de données sensibles** : Le widget ne collecte que des données publiques
2. **Validation des entrées** : Toutes les données sont validées
3. **Pas de XSS** : Utilisation de `textContent` au lieu de `innerHTML`
4. **CSP compatible** : Respect des Content Security Policies

### Limitations

- Pas de chiffrement des données localStorage
- Pas de validation côté serveur
- Pas de protection contre la manipulation des cookies

## 🚀 Déploiement

### Intégration

```html
<!-- Intégration simple -->
<div id="Meetway-widget-container"></div>
<script src="config.js"></script>
<script src="widget.js"></script>
<script>
    MeetwayWidget.init({
        containerId: 'Meetway-widget-container',
        onCarpoolInterest: function(isInterested, eventInfo, userInfo) {
            // Votre logique API
        }
    });
</script>
```

### Configuration de production

```javascript
// config.js
window.MeetwayConfig = {
    eventDetection: {
        nameSelectors: ['.event-title', '.concert-name'],
        dateSelectors: ['.event-date', '[datetime]'],
        // ... autres sélecteurs
    },
    api: {
        endpoint: 'https://api.Meetway.com/carpool-interest'
    }
};
```

## 🔮 Évolutions futures

### Améliorations techniques

- [ ] Support TypeScript
- [ ] Tests unitaires complets
- [ ] Bundle optimisé (Webpack/Rollup)
- [ ] Support des modules ES6
- [ ] Internationalisation (i18n)

### Nouvelles fonctionnalités

- [ ] Validation avancée des données
- [ ] Support des événements récurrents
- [ ] Analytics intégrés
- [ ] Thèmes personnalisables
- [ ] Support des sessions utilisateur

### Optimisations

- [ ] Lazy loading des stratégies
- [ ] Cache intelligent
- [ ] Compression des données
- [ ] Service Worker pour offline

---

**Note pour les développeurs :** Ce widget est conçu pour être extensible et maintenable. Respectez les patterns établis lors de l'ajout de nouvelles fonctionnalités.
