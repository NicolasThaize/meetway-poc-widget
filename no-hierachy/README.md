# Meetway Widget - Version Ultra-Simplifiée

Cette version du widget Meetway a été conçue pour être **ultra-simple à comprendre et à utiliser**. Elle supprime toute la complexité et exige que toutes les données soient fournies manuellement.

## 🚀 Intégration ultra-rapide

### 1. Inclure les fichiers

```html
<script src="config.js"></script>
<script src="widget.js"></script>
```

### 2. Ajouter le conteneur

```html
<div id="meetway-container"></div>
```

### 3. Initialiser avec les données (OBLIGATOIRE)

```javascript
MeetwayWidget.init({
    containerId: 'meetway-container',
    eventData: {
        name: 'Mon événement',
        date: '2024-07-20T20:00:00',
        description: 'Description de l\'événement',
        id: 'EVENT-001'
    },
    onInterest: function(isInterested, eventInfo, userInfo) {
        console.log('Intérêt enregistré:', isInterested);
    }
});
```

## ⚠️ Important

**`eventData` est OBLIGATOIRE** - Le widget ne fonctionne pas sans les données d'événement fournies manuellement.

## ✨ Fonctionnalités

### Données manuelles uniquement
- **Aucune détection automatique** - Toutes les données doivent être fournies
- **Contrôle total** - Vous décidez exactement quelles informations envoyer
- **Simplicité maximale** - Pas de sélecteurs DOM complexes

### Personnalisation simple

```javascript
// Personnaliser les messages
customizeMeetway({
    messages: {
        title: 'Covoiturage pour cet événement',
        interestText: 'Je veux covoiturer !'
    },
    features: {
        tag1: 'Économisez 15€',
        tag2: 'Écologique',
        tag3: 'Rencontres'
    }
});
```

## 📋 API du widget

### Méthodes principales

```javascript
// Initialiser le widget (eventData obligatoire)
MeetwayWidget.init(options)

// Mettre à jour les données d'événement
MeetwayWidget.updateEventData(data)

// Mettre à jour les données utilisateur
MeetwayWidget.updateUserData(data)

// Obtenir les informations d'événement
MeetwayWidget.getEventInfo()

// Obtenir les informations utilisateur
MeetwayWidget.getUserData()
```

### Options de configuration

```javascript
{
    containerId: 'meetway-container',    // ID du conteneur HTML
    eventData: {                         // OBLIGATOIRE - Données d'événement
        name: 'Nom de l\'événement',
        date: '2024-07-20T20:00:00',
        description: 'Description',
        id: 'EVENT-001'
    },
    userData: {},                        // Optionnel - Données utilisateur
    onInterest: function(isInterested, eventInfo, userInfo) {
        // Callback appelé quand l'utilisateur valide
    },
    onCguClick: function() {
        // Callback pour le clic sur les CGU
    }
}
```

## 🎨 Personnalisation

### Messages

```javascript
customizeMeetway({
    messages: {
        title: 'Venir en covoiturage',
        interestText: 'Je suis intéressé(e) pour covoiturer',
        successMessage: '✅ Intérêt enregistré !',
        cguText: 'En cochant cette case, vous acceptez nos conditions...'
    }
});
```

### Tags de fonctionnalités

```javascript
customizeMeetway({
    features: {
        tag1: 'Votre place réservée et payée',
        tag2: 'Économisez 10€',
        tag3: 'Rencontrez du monde'
    }
});
```

### Couleurs

```javascript
customizeMeetway({
    primaryColor: 'rgb(241, 98, 16)',  // Orange Meetway
    textColor: '#333'
});
```

## 🔧 Exemple complet

Voir le fichier `example.html` pour un exemple d'intégration complet avec :
- Données d'événement fournies manuellement
- Personnalisation des messages
- Gestion des callbacks
- Exemples d'appels API

## 📁 Structure des fichiers

```
no-hierarchy/
├── config.js          # Configuration du widget
├── widget.js          # Code principal du widget
├── example.html       # Exemple d'intégration
└── README.md          # Cette documentation
```

## 🆚 Différences avec la version originale

| Aspect | Version Originale | Version Ultra-Simplifiée |
|--------|------------------|--------------------------|
| **Architecture** | Pattern Strategy complexe | Code direct et simple |
| **Configuration** | Hiérarchie profonde | Structure plate |
| **Détection** | Multiples stratégies | Aucune détection |
| **Données** | Détection automatique | Manuelles uniquement |
| **Personnalisation** | API complexe | Fonctions simples |
| **Taille** | ~43KB | ~6KB |
| **Facilité** | Difficile à comprendre | Ultra-simple |

## 🚀 Avantages de cette version

✅ **Ultra-simple** - Code direct sans aucune abstraction  
✅ **Contrôle total** - Vous contrôlez exactement les données envoyées  
✅ **Très léger** - Moins de code, plus rapide à charger  
✅ **Prévisible** - Comportement 100% prévisible  
✅ **Maintenable** - Code facile à déboguer et modifier  
✅ **Sécurisé** - Pas d'accès au DOM, données contrôlées  

## 📞 Support

Pour toute question ou problème avec cette version ultra-simplifiée, consultez d'abord le fichier `example.html` qui contient des exemples concrets d'utilisation.

## ⚡ Utilisation recommandée

Cette version est parfaite pour :
- Intégrations simples et directes
- Contrôle total des données envoyées
- Développement rapide
- Maintenance facile
- Performance optimale
