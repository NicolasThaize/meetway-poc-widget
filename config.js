/**
 * Configuration du widget Meetway
 * 
 * Ce fichier permet de personnaliser facilement l'apparence et le comportement
 * du widget sans modifier le code principal.
 */

const MeetwayConfig = {
    // Configuration générale
    general: {
        theme: 'light',                    // 'light' ou 'dark'
        language: 'fr',                    // 'fr', 'en', 'es'
        showCarpoolOption: true,           // Afficher l'option covoiturage
        autoUpdate: true                   // Mise à jour automatique
    },
    
    // Configuration de l'API
    api: {
        endpoint: '/api/carpool-interest', // Endpoint pour l'intérêt covoiturage
        timeout: 5000,                     // Timeout des appels API (ms)
        retryAttempts: 3                   // Nombre de tentatives en cas d'échec
    },
    
    // Configuration des couleurs et du design
    styling: {
        primaryColor: '#667eea',           // Couleur principale
        secondaryColor: '#764ba2',         // Couleur secondaire
        accentColor: '#4CAF50',            // Couleur d'accent (covoiturage)
        textColor: '#ffffff',              // Couleur du texte
        borderRadius: '15px',              // Rayon des bordures
        shadow: '0 10px 30px rgba(0,0,0,0.2)', // Ombre du widget
        maxWidth: '350px'                  // Largeur maximale
    },
    
    // Configuration des messages
    messages: {
        carpoolInterest: 'Je suis intéressé(e) pour covoiturer',
        carpoolDescription: 'Cochez cette case si vous souhaitez partager votre trajet ou trouver un covoiturage pour cet événement.',
        successMessage: '✅ Intérêt enregistré ! Nous vous contacterons pour organiser le covoiturage.',
        errorMessage: '❌ Erreur lors de l\'enregistrement. Veuillez réessayer.',
        loadingMessage: '⏳ Enregistrement en cours...',
        dateNotDefined: 'Date non définie',
        locationNotDefined: 'Lieu non défini',
        priceNotDefined: 'Prix non défini',
        eventNotDefined: 'Événement non défini'
    },
    
    // Configuration des tags de fonctionnalités
    featureTags: {
        tag1: 'Votre place réservée et payée',
        tag2: 'Économisez 10€',
        tag3: 'Rencontrez du monde'
    },
    
    // Configuration des icônes
    icons: {
        date: '📅',
        location: '📍',
        price: '💰',
        carpool: '🚗',
        success: '✅',
        error: '❌',
        loading: '⏳'
    },
    
    // Configuration responsive
    responsive: {
        mobileBreakpoint: 480,             // Point de rupture mobile (px)
        tabletBreakpoint: 768,             // Point de rupture tablette (px)
        enableMobileOptimization: true     // Optimisation mobile
    },
    

    
    // Configuration de débogage
    debug: {
        enableLogs: true,                  // Activer les logs console
        enableApiLogs: true,               // Logs des appels API
        enableErrorLogs: true,             // Logs d'erreurs
        enablePerformanceLogs: false       // Logs de performance
    },
    
    // Configuration de détection automatique des événements
    eventDetection: {
        // Sélecteurs pour le nom de l'événement
        nameSelectors: [
            'h1', 'h2', 'h3', 
            '.event-title', '.event-name', '[data-event-name]',
            '.title', '.product-title', '.event-title',
            '.concert-title', '.show-title', '.festival-title',
            '[data-event-title]', '[data-concert-name]'
        ],
        
        // Sélecteurs pour la date de l'événement
        dateSelectors: [
            '[data-event-date]', '.event-date', '.date', '.event-time',
            'time', '[datetime]', '.event-datetime', '.concert-date',
            '.show-date', '.festival-date', '.event-schedule',
            '[data-concert-date]', '[data-show-date]'
        ],
        
        // Sélecteurs pour le lieu de l'événement
        locationSelectors: [
            '[data-event-location]', '.event-location', '.location',
            '.venue', '.place', '.address', '.concert-venue',
            '.show-venue', '.festival-location', '.event-venue',
            '[data-venue]', '[data-location]', '.event-place'
        ],
        
        // Sélecteurs pour le prix de l'événement
        priceSelectors: [
            '[data-event-price]', '.event-price', '.price', '.ticket-price',
            '.cost', '.amount', '.price-amount', '.concert-price',
            '.show-price', '.festival-price', '.ticket-cost',
            '[data-price]', '[data-ticket-price]', '.event-cost'
        ],
        
        // Sélecteurs pour l'ID de l'événement
        idSelectors: [
            '[data-event-id]', '.event-id', '[data-concert-id]',
            '[data-show-id]', '[data-festival-id]', '.event-identifier',
            '[data-product-id]', '[data-item-id]', '.event-uuid'
        ]
    }
};

// Fonction pour obtenir une configuration
function getConfig(path) {
    const keys = path.split('.');
    let value = MeetwayConfig;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return null;
        }
    }
    
    return value;
}

// Fonction pour définir une configuration
function setConfig(path, value) {
    const keys = path.split('.');
    let current = MeetwayConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
}

// Fonction pour ajouter un sélecteur personnalisé
function addEventSelector(field, selector) {
    if (!MeetwayConfig.eventDetection[field + 'Selectors']) {
        MeetwayConfig.eventDetection[field + 'Selectors'] = [];
    }
    MeetwayConfig.eventDetection[field + 'Selectors'].push(selector);
}

// Fonction pour ajouter plusieurs sélecteurs personnalisés
function addEventSelectors(field, selectors) {
    if (Array.isArray(selectors)) {
        selectors.forEach(selector => addEventSelector(field, selector));
    }
}

// Fonction pour réinitialiser la configuration
function resetConfig() {
    // Cette fonction pourrait recharger la configuration depuis un fichier
    // ou restaurer les valeurs par défaut
    console.log('Configuration réinitialisée');
}

// Fonction pour obtenir tous les sélecteurs d'un champ
function getEventSelectors(field) {
    return MeetwayConfig.eventDetection[field + 'Selectors'] || [];
}

// Exposition de l'API de configuration
if (typeof window !== 'undefined') {
    window.MeetwayConfig = MeetwayConfig;
    window.getMeetwayConfig = getConfig;
    window.setMeetwayConfig = setConfig;
    window.resetMeetwayConfig = resetConfig;
    window.addEventSelector = addEventSelector;
    window.addEventSelectors = addEventSelectors;
    window.getEventSelectors = getEventSelectors;
}

// Export pour Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MeetwayConfig,
        getConfig,
        setConfig,
        resetConfig,
        addEventSelector,
        addEventSelectors,
        getEventSelectors
    };
}
