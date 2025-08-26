/**
 * Configuration simplifiée du widget Meetway
 * Version No-Hierarchy - Configuration minimale
 */

const MeetwayConfig = {
    // Configuration de base
    theme: 'light',                    // 'light' ou 'dark'
    language: 'fr',                    // 'fr', 'en'
    
    // Couleurs principales
    primaryColor: 'rgb(241, 98, 16)',  // Orange Meetway
    textColor: '#333',
    
    // Messages personnalisables
    messages: {
        title: 'Venir en covoiturage',
        interestText: 'Je suis intéressé(e) pour covoiturer',
        successMessage: '✅ Intérêt enregistré. Nous vous contacterons par mail pour organiser le covoiturage ! Vous pouvez déjà confirmer ou mettre à jour vos infos sur Meetway.',
        cguText: 'En cochant cette case, vous acceptez nos conditions générales d\'utilisation de Meetway.'
    },
    
    // Tags de fonctionnalités
    features: {
        tag1: 'Votre place réservée et payée',
        tag2: 'Économisez 10€',
        tag3: 'Rencontrez du monde'
    },
    
    // Endpoint API
    apiEndpoint: '/api/carpool-interest',

    // URL pour modifier rapidement ses informations sur la plateforme Meetway
    editInfoUrl: 'https://app.meetway.fr/profile'
};

// Fonction pour personnaliser la configuration
function customizeMeetway(options) {
    Object.assign(MeetwayConfig, options);
}

// Exposition globale
window.MeetwayConfig = MeetwayConfig;
window.customizeMeetway = customizeMeetway;
