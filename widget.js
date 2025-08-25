/**
 * Meetway Widget - Widget de covoiturage événement agnostique
 * Version Proof of Concept
 * 
 * Ce widget s'intègre automatiquement dans les pages de billetterie
 * et permet aux utilisateurs de signaler leur intérêt pour le covoiturage.
 */

(function() {
    'use strict';

    // Configuration par défaut du widget
    const DEFAULT_CONFIG = {
        theme: 'light',
        language: 'fr',
        showCarpoolOption: true,
        apiEndpoint: '/api/carpool-interest',
        autoDetectEventInfo: true,
        widgetTitle: 'Meetway',
        featureTags: {
            tag1: 'Votre place réservée et payée',
            tag2: 'Économisez 10€',
            tag3: 'Rencontrez du monde'
        }
    };

    // Styles CSS intégrés pour le widget
    const WIDGET_STYLES = `
        .Meetway-widget {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: white;
            border: 2px solid rgb(241, 98, 16);
            border-radius: 12px;
            padding: 20px;
            color: #333;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            position: relative;
        }
        
        .Meetway-widget-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        
        .Meetway-widget-title {
            font-size: 20px;
            font-weight: bold;
            margin: 0;
            color: #333;
            flex: 1;
        }
        
        .Meetway-logo {
            
        }
        
        .Meetway-logo-image {
            max-width: 100%;
            height: auto;
            object-fit: contain;
        }
        
        .Meetway-features {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
        }
        
        .Meetway-feature-tag {
            background: rgb(241, 98, 16);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
        }
        
        .Meetway-checkbox-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .Meetway-checkbox {
            width: 18px;
            height: 18px;
            accent-color: rgb(241, 98, 16);
            cursor: pointer;
            border-radius: 3px;
        }
        
        .Meetway-checkbox-label {
            font-size: 14px;
            cursor: pointer;
            user-select: none;
            color: #333;
        }
        
        .Meetway-cgu-text {
            font-size: 11px;
            color: #666;
            margin-bottom: 15px;
            line-height: 1.3;
        }
        
        .Meetway-cgu-link {
            color: rgb(241, 98, 16);
            text-decoration: underline;
            cursor: pointer;
        }
        
        .Meetway-cgu-link:hover {
            color: #d17a0f;
        }
        
        .Meetway-validate-button {
            background: rgb(241, 98, 16);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: not-allowed;
            box-shadow: 0 2px 4px rgba(241, 98, 16, 0.3);
            transition: all 0.2s ease;
            opacity: 0.5;
        }
        
        .Meetway-validate-button:hover {
            background: rgb(241, 98, 16);
            box-shadow: 0 2px 4px rgba(241, 98, 16, 0.3);
            transform: none;
        }
        
        .Meetway-validate-button:active {
            transform: none;
            box-shadow: 0 2px 4px rgba(241, 98, 16, 0.3);
        }
        
        .Meetway-validate-button.enabled {
            opacity: 1;
            cursor: pointer;
        }
        
        .Meetway-validate-button.enabled:hover {
            background: #d17a0f;
            box-shadow: 0 4px 8px rgba(241, 98, 16, 0.4);
            transform: translateY(-1px);
        }
        
        .Meetway-validate-button.enabled:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(241, 98, 16, 0.3);
        }
        
        .Meetway-success-message {
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
            border-radius: 6px;
            padding: 10px;
            margin-top: 15px;
            text-align: center;
            font-size: 12px;
            display: none;
            color: #333;
        }
        
        .Meetway-success-message.show {
            display: block;
        }
        
        @media (max-width: 480px) {
            .Meetway-widget {
                padding: 15px;
                margin: 10px;
            }
            
            .Meetway-widget-title {
                font-size: 18px;
            }
            
            .Meetway-features {
                gap: 6px;
            }
            
            .Meetway-feature-tag {
                font-size: 11px;
                padding: 5px 10px;
            }
        }
    `;

    // Variables globales du widget
    let widgetConfig = {};
    let detectedEventInfo = {};
    let userInfo = {};
    let widgetContainer = null;

    /**
     * Classe pour la gestion des informations utilisateur
     * Utilise le pattern Strategy pour différents modes de récupération
     */
    class UserInfoManager {
        constructor() {
            this.strategies = {
                manual: new ManualUserInfoStrategy(),
                localStorage: new LocalStorageUserInfoStrategy(),
                cookies: new CookiesUserInfoStrategy(),
                dom: new DOMUserInfoStrategy()
            };
        }

        /**
         * Récupère les informations utilisateur selon la hiérarchie de fallback
         * @param {Object} config - Configuration du widget
         * @returns {Object} Informations utilisateur
         */
        async getUserInfo(config) {
            console.log('🔍 Récupération des informations utilisateur...');

            // 1. Tentative avec données manuelles fournies dans la config
            if (config.userData && typeof config.userData === 'object') {
                const manualInfo = this.strategies.manual.getUserInfo(config.userData);
                if (manualInfo && Object.keys(manualInfo).length > 0) {
                    console.log('✅ Informations utilisateur récupérées manuellement:', manualInfo);
                    return manualInfo;
                }
            }

            // 2. Tentative avec localStorage
            try {
                const localStorageInfo = this.strategies.localStorage.getUserInfo();
                if (localStorageInfo && Object.keys(localStorageInfo).length > 0) {
                    console.log('✅ Informations utilisateur récupérées depuis localStorage:', localStorageInfo);
                    return localStorageInfo;
                }
            } catch (error) {
                console.warn('⚠️ Erreur lors de la récupération depuis localStorage:', error);
            }

            // 3. Tentative avec cookies
            try {
                const cookiesInfo = this.strategies.cookies.getUserInfo();
                if (cookiesInfo && Object.keys(cookiesInfo).length > 0) {
                    console.log('✅ Informations utilisateur récupérées depuis les cookies:', cookiesInfo);
                    return cookiesInfo;
                }
            } catch (error) {
                console.warn('⚠️ Erreur lors de la récupération depuis les cookies:', error);
            }

            // 4. Tentative avec sélecteurs DOM
            try {
                const domInfo = this.strategies.dom.getUserInfo();
                if (domInfo && Object.keys(domInfo).length > 0) {
                    console.log('✅ Informations utilisateur récupérées depuis le DOM:', domInfo);
                    return domInfo;
                }
            } catch (error) {
                console.warn('⚠️ Erreur lors de la récupération depuis le DOM:', error);
            }

            // 5. Fallback avec informations minimales
            const fallbackInfo = {
                id: null,
                firstName: null,
                lastName: null,
                email: null,
                phone: null,
                billingAddress: null,
                customData: {},
                source: 'fallback',
                timestamp: new Date().toISOString()
            };

            console.log('⚠️ Aucune information utilisateur trouvée, utilisation du fallback:', fallbackInfo);
            return fallbackInfo;
        }

        /**
         * Sauvegarde les informations utilisateur dans localStorage
         * @param {Object} userInfo - Informations utilisateur à sauvegarder
         */
        saveUserInfo(userInfo) {
            try {
                this.strategies.localStorage.saveUserInfo(userInfo);
                console.log('💾 Informations utilisateur sauvegardées dans localStorage');
            } catch (error) {
                console.warn('⚠️ Erreur lors de la sauvegarde dans localStorage:', error);
            }
        }
    }

    /**
     * Classe pour la gestion des informations d'événement
     * Utilise le pattern Strategy pour différents modes de récupération
     */
    class EventInfoManager {
        constructor() {
            this.strategies = {
                manual: new ManualEventInfoStrategy(),
                localStorage: new LocalStorageEventInfoStrategy(),
                cookies: new CookiesEventInfoStrategy(),
                dom: new DOMEventInfoStrategy()
            };
        }

        /**
         * Récupère les informations d'événement selon la hiérarchie de fallback
         * @param {Object} config - Configuration du widget
         * @returns {Object} Informations d'événement
         */
        async getEventInfo(config) {
            console.log('🔍 Récupération des informations d\'événement...');

            // 1. Tentative avec données manuelles fournies dans la config
            if (config.eventData && typeof config.eventData === 'object') {
                const manualInfo = this.strategies.manual.getEventInfo(config.eventData);
                if (manualInfo && Object.keys(manualInfo).length > 0) {
                    console.log('✅ Informations d\'événement récupérées manuellement:', manualInfo);
                    return manualInfo;
                }
            }

            // 2. Tentative avec localStorage
            try {
                const localStorageInfo = this.strategies.localStorage.getEventInfo();
                if (localStorageInfo && Object.keys(localStorageInfo).length > 0) {
                    console.log('✅ Informations d\'événement récupérées depuis localStorage:', localStorageInfo);
                    return localStorageInfo;
                }
            } catch (error) {
                console.warn('⚠️ Erreur lors de la récupération depuis localStorage:', error);
            }

            // 3. Tentative avec cookies
            try {
                const cookiesInfo = this.strategies.cookies.getEventInfo();
                if (cookiesInfo && Object.keys(cookiesInfo).length > 0) {
                    console.log('✅ Informations d\'événement récupérées depuis les cookies:', cookiesInfo);
                    return cookiesInfo;
                }
            } catch (error) {
                console.warn('⚠️ Erreur lors de la récupération depuis les cookies:', error);
            }

            // 4. Tentative avec sélecteurs DOM
            try {
                const domInfo = this.strategies.dom.getEventInfo();
                if (domInfo && Object.keys(domInfo).length > 0) {
                    console.log('✅ Informations d\'événement récupérées depuis le DOM:', domInfo);
                    return domInfo;
                }
            } catch (error) {
                console.warn('⚠️ Erreur lors de la récupération depuis le DOM:', error);
            }

            // 5. Fallback avec informations minimales
            const fallbackInfo = {
                name: '',
                date: '',
                description: null,
                id: '',
                customData: {},
                url: window.location.href,
                pageTitle: document.title,
                source: 'fallback',
                timestamp: new Date().toISOString()
            };

            console.log('⚠️ Aucune information d\'événement trouvée, utilisation du fallback:', fallbackInfo);
            return fallbackInfo;
        }

        /**
         * Sauvegarde les informations d'événement dans localStorage
         * @param {Object} eventInfo - Informations d'événement à sauvegarder
         */
        saveEventInfo(eventInfo) {
            try {
                this.strategies.localStorage.saveEventInfo(eventInfo);
                console.log('💾 Informations d\'événement sauvegardées dans localStorage');
            } catch (error) {
                console.warn('⚠️ Erreur lors de la sauvegarde dans localStorage:', error);
            }
        }
    }

    /**
     * Strategy pour les informations utilisateur fournies manuellement
     */
    class ManualUserInfoStrategy {
        getUserInfo(userData) {
            return {
                id: userData.id || userData.userId || userData.user_id || null,
                firstName: userData.firstName || userData.first_name || userData.prenom || null,
                lastName: userData.lastName || userData.last_name || userData.nom || null,
                email: userData.email || userData.mail || null,
                phone: userData.phone || userData.telephone || userData.phoneNumber || userData.tel || null,
                billingAddress: userData.billingAddress || userData.billing_address || userData.adresse || null,
                customData: userData.customData || userData.custom_data || userData.metadata || {},
                source: 'manual',
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Strategy pour les informations d'événement fournies manuellement
     */
    class ManualEventInfoStrategy {
        getEventInfo(eventData) {
            return {
                name: eventData.name || eventData.title || eventData.eventName || '',
                date: eventData.date || eventData.eventDate || eventData.datetime || '',
                description: eventData.description || eventData.desc || eventData.details || null,
                id: eventData.id || eventData.eventId || eventData.event_id || '',
                customData: eventData.customData || eventData.custom_data || eventData.metadata || {},
                url: eventData.url || window.location.href,
                pageTitle: eventData.pageTitle || document.title,
                source: 'manual',
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Strategy pour les informations utilisateur stockées dans localStorage
     */
    class LocalStorageUserInfoStrategy {
        constructor() {
            this.storageKey = 'Meetway_user_info';
        }

        getUserInfo() {
            try {
                const storedData = localStorage.getItem(this.storageKey);
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    // Vérifier si les données ne sont pas expirées (7 jours par défaut)
                    if (parsedData.timestamp && this.isDataValid(parsedData.timestamp)) {
                        return {
                            ...parsedData,
                            source: 'localStorage'
                        };
                    } else {
                        // Supprimer les données expirées
                        localStorage.removeItem(this.storageKey);
                    }
                }
                return null;
            } catch (error) {
                console.warn('Erreur lors de la lecture depuis localStorage:', error);
                return null;
            }
        }

        saveUserInfo(userInfo) {
            try {
                const dataToSave = {
                    ...userInfo,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
                return true;
            } catch (error) {
                console.warn('Erreur lors de la sauvegarde dans localStorage:', error);
                return false;
            }
        }

        isDataValid(timestamp, maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 jours par défaut
            const dataDate = new Date(timestamp);
            const now = new Date();
            return (now - dataDate) < maxAge;
        }
    }

    /**
     * Strategy pour les informations d'événement stockées dans localStorage
     */
    class LocalStorageEventInfoStrategy {
        constructor() {
            this.storageKey = 'Meetway_event_info';
        }

        getEventInfo() {
            try {
                const storedData = localStorage.getItem(this.storageKey);
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    // Vérifier si les données ne sont pas expirées (1 jour par défaut)
                    if (parsedData.timestamp && this.isDataValid(parsedData.timestamp)) {
                        return {
                            ...parsedData,
                            source: 'localStorage'
                        };
                    } else {
                        // Supprimer les données expirées
                        localStorage.removeItem(this.storageKey);
                    }
                }
                return null;
            } catch (error) {
                console.warn('Erreur lors de la lecture depuis localStorage:', error);
                return null;
            }
        }

        saveEventInfo(eventInfo) {
            try {
                const dataToSave = {
                    ...eventInfo,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
                return true;
            } catch (error) {
                console.warn('Erreur lors de la sauvegarde dans localStorage:', error);
                return false;
            }
        }

        isDataValid(timestamp, maxAge = 24 * 60 * 60 * 1000) { // 1 jour par défaut
            const dataDate = new Date(timestamp);
            const now = new Date();
            return (now - dataDate) < maxAge;
        }
    }

    /**
     * Strategy pour les informations utilisateur stockées dans les cookies
     */
    class CookiesUserInfoStrategy {
        constructor() {
            this.cookiePrefix = 'Meetway_';
        }

        getUserInfo() {
            try {
                const cookies = this.getAllCookies();
                const userInfo = {};

                // Récupérer les informations depuis les cookies
                if (cookies[this.cookiePrefix + 'user_id']) {
                    userInfo.id = cookies[this.cookiePrefix + 'user_id'];
                }
                if (cookies[this.cookiePrefix + 'first_name']) {
                    userInfo.firstName = cookies[this.cookiePrefix + 'first_name'];
                }
                if (cookies[this.cookiePrefix + 'last_name']) {
                    userInfo.lastName = cookies[this.cookiePrefix + 'last_name'];
                }
                if (cookies[this.cookiePrefix + 'email']) {
                    userInfo.email = cookies[this.cookiePrefix + 'email'];
                }
                if (cookies[this.cookiePrefix + 'phone']) {
                    userInfo.phone = cookies[this.cookiePrefix + 'phone'];
                }
                if (cookies[this.cookiePrefix + 'billing_address']) {
                    userInfo.billingAddress = cookies[this.cookiePrefix + 'billing_address'];
                }
                // Récupération des données personnalisées (stockées en JSON)
                if (cookies[this.cookiePrefix + 'custom_data']) {
                    try {
                        userInfo.customData = JSON.parse(cookies[this.cookiePrefix + 'custom_data']);
                    } catch (e) {
                        userInfo.customData = {};
                    }
                }

                return Object.keys(userInfo).length > 0 ? {
                    ...userInfo,
                    source: 'cookies',
                    timestamp: new Date().toISOString()
                } : null;
            } catch (error) {
                console.warn('Erreur lors de la lecture depuis les cookies:', error);
                return null;
            }
        }

        getAllCookies() {
            const cookies = {};
            const cookieString = document.cookie;
            
            if (cookieString) {
                const cookiePairs = cookieString.split(';');
                cookiePairs.forEach(pair => {
                    const [name, value] = pair.trim().split('=');
                    if (name && value) {
                        cookies[name] = decodeURIComponent(value);
                    }
                });
            }
            
            return cookies;
        }
    }

    /**
     * Strategy pour les informations d'événement stockées dans les cookies
     */
    class CookiesEventInfoStrategy {
        constructor() {
            this.cookiePrefix = 'Meetway_event_';
        }

        getEventInfo() {
            try {
                const cookies = this.getAllCookies();
                const eventInfo = {};

                // Récupérer les informations depuis les cookies
                if (cookies[this.cookiePrefix + 'name']) {
                    eventInfo.name = cookies[this.cookiePrefix + 'name'];
                }
                if (cookies[this.cookiePrefix + 'date']) {
                    eventInfo.date = cookies[this.cookiePrefix + 'date'];
                }
                if (cookies[this.cookiePrefix + 'description']) {
                    eventInfo.description = cookies[this.cookiePrefix + 'description'];
                }
                if (cookies[this.cookiePrefix + 'id']) {
                    eventInfo.id = cookies[this.cookiePrefix + 'id'];
                }
                // Récupération des données personnalisées (stockées en JSON)
                if (cookies[this.cookiePrefix + 'custom_data']) {
                    try {
                        eventInfo.customData = JSON.parse(cookies[this.cookiePrefix + 'custom_data']);
                    } catch (e) {
                        eventInfo.customData = {};
                    }
                }

                return Object.keys(eventInfo).length > 0 ? {
                    ...eventInfo,
                    url: window.location.href,
                    pageTitle: document.title,
                    source: 'cookies',
                    timestamp: new Date().toISOString()
                } : null;
            } catch (error) {
                console.warn('Erreur lors de la lecture depuis les cookies:', error);
                return null;
            }
        }

        getAllCookies() {
            const cookies = {};
            const cookieString = document.cookie;
            
            if (cookieString) {
                const cookiePairs = cookieString.split(';');
                cookiePairs.forEach(pair => {
                    const [name, value] = pair.trim().split('=');
                    if (name && value) {
                        cookies[name] = decodeURIComponent(value);
                    }
                });
            }
            
            return cookies;
        }
    }

    /**
     * Strategy pour les informations utilisateur récupérées depuis le DOM
     */
    class DOMUserInfoStrategy {
        constructor() {
            // Sélecteurs pour détecter les informations utilisateur dans le DOM
            this.selectors = {
                id: [
                    '[data-user-id]', '[data-userid]', '.user-id', '.userid',
                    '[data-account-id]', '.account-id', '.member-id'
                ],
                firstName: [
                    '[data-user-first-name]', '[data-first-name]', '.user-first-name', '.first-name',
                    '[data-user-prenom]', '.user-prenom', '.prenom'
                ],
                lastName: [
                    '[data-user-last-name]', '[data-last-name]', '.user-last-name', '.last-name',
                    '[data-user-nom]', '.user-nom', '.nom'
                ],
                email: [
                    '[data-user-email]', '[data-email]', '.user-email', '.email',
                    'input[type="email"]', '.account-email', '.member-email'
                ],
                phone: [
                    '[data-user-phone]', '[data-phone]', '.user-phone', '.phone',
                    'input[type="tel"]', '.account-phone', '.member-phone'
                ],
                billingAddress: [
                    '[data-user-billing-address]', '[data-billing-address]', '.user-billing-address',
                    '[data-user-adresse]', '[data-adresse]', '.user-adresse', '.adresse'
                ]
            };
        }

        getUserInfo() {
            try {
                const userInfo = {};

                // Récupérer chaque type d'information
                Object.keys(this.selectors).forEach(field => {
                    const value = this.extractValueFromSelectors(this.selectors[field]);
                    if (value) {
                        userInfo[field] = value;
                    }
                });

                return Object.keys(userInfo).length > 0 ? {
                    ...userInfo,
                    source: 'dom',
                    timestamp: new Date().toISOString()
                } : null;
            } catch (error) {
                console.warn('Erreur lors de la récupération depuis le DOM:', error);
                return null;
            }
        }

        extractValueFromSelectors(selectors) {
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    // Essayer d'abord les attributs data
                    const dataValue = element.getAttribute('data-user-id') || 
                                     element.getAttribute('data-user-email') ||
                                     element.getAttribute('data-user-first-name') ||
                                     element.getAttribute('data-user-last-name') ||
                                     element.getAttribute('data-user-phone') ||
                                     element.getAttribute('data-user-billing-address') ||
                                     element.getAttribute('data-email') ||
                                     element.getAttribute('data-first-name') ||
                                     element.getAttribute('data-last-name') ||
                                     element.getAttribute('data-phone') ||
                                     element.getAttribute('data-billing-address');
                    
                    if (dataValue) {
                        return dataValue;
                    }
                    
                    // Sinon, utiliser le contenu textuel ou la valeur
                    const textValue = element.textContent?.trim() || element.value;
                    if (textValue) {
                        return textValue;
                    }
                }
            }
            return null;
        }
    }

    /**
     * Strategy pour les informations d'événement récupérées depuis le DOM
     */
    class DOMEventInfoStrategy {
        constructor() {
            // Utiliser les sélecteurs de la configuration si disponible
            const config = window.MeetwayConfig || {};
            const eventDetection = config.eventDetection || {};
            
            // Sélecteurs pour détecter les informations d'événement dans le DOM
            this.selectors = {
                name: eventDetection.nameSelectors || [
                    'h1', 'h2', 'h3', '.event-title', '.event-name', '[data-event-name]',
                    '.title', '.event-title', '.product-title', '.event-name'
                ],
                date: eventDetection.dateSelectors || [
                    '[data-event-date]', '.event-date', '.date', '.event-time',
                    'time', '[datetime]', '.event-datetime'
                ],
                description: eventDetection.descriptionSelectors || [
                    '[data-event-description]', '.event-description', '.description',
                    '.event-details', '.event-desc', '.event-summary'
                ],
                id: eventDetection.idSelectors || [
                    '[data-event-id]', '.event-id', '[data-concert-id]',
                    '[data-show-id]', '[data-festival-id]'
                ]
            };
        }

        getEventInfo() {
            try {
                const eventInfo = {
                    name: '',
                    date: '',
                    description: null,
                    id: '',
                    url: window.location.href,
                    pageTitle: document.title
                };

                // Détection du nom de l'événement
                eventInfo.name = this.extractValueFromSelectors(this.selectors.name);

                // Détection de la date
                const dateValue = this.extractValueFromSelectors(this.selectors.date);
                if (dateValue) {
                    eventInfo.date = dateValue;
                }

                // Détection de la description
                const descriptionValue = this.extractValueFromSelectors(this.selectors.description);
                if (descriptionValue) {
                    eventInfo.description = descriptionValue;
                }

                // Détection de l'ID de l'événement
                eventInfo.id = this.extractValueFromSelectors(this.selectors.id);

                // Vérifier si au moins une information a été trouvée
                const hasInfo = eventInfo.name || eventInfo.date || eventInfo.description || eventInfo.id;

                return hasInfo ? {
                    ...eventInfo,
                    source: 'dom',
                    timestamp: new Date().toISOString()
                } : null;
            } catch (error) {
                console.warn('Erreur lors de la récupération depuis le DOM:', error);
                return null;
            }
        }

        extractValueFromSelectors(selectors) {
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    // Essayer d'abord les attributs data
                    const dataValue = element.getAttribute('data-event-name') ||
                                     element.getAttribute('data-event-date') ||
                                     element.getAttribute('data-event-description') ||
                                     element.getAttribute('data-event-id') ||
                                     element.getAttribute('data-concert-id') ||
                                     element.getAttribute('data-show-id') ||
                                     element.getAttribute('datetime');
                    
                    if (dataValue) {
                        return dataValue;
                    }
                    
                    // Sinon, utiliser le contenu textuel
                    const textValue = element.textContent?.trim();
                    if (textValue) {
                        return textValue;
                    }
                }
            }
            return '';
        }
    }

    /**
     * Classe principale du widget Meetway
     */
    class MeetwayWidget {
        
        /**
         * Initialise le widget avec la configuration fournie
         * @param {Object} config - Configuration du widget
         */
        static async init(config) {
            // Fusion de la configuration par défaut avec celle fournie
            widgetConfig = { ...DEFAULT_CONFIG, ...config };
            
            // Fusion des feature tags avec la configuration globale si disponible
            if (window.MeetwayConfig && window.MeetwayConfig.featureTags) {
                widgetConfig.featureTags = { 
                    ...widgetConfig.featureTags, 
                    ...window.MeetwayConfig.featureTags 
                };
            }
            
            // Injection des styles CSS
            MeetwayWidget.injectStyles();
            
            // Récupération du conteneur
            widgetContainer = document.getElementById(widgetConfig.containerId);
            
            if (!widgetContainer) {
                console.error('Meetway Widget: Conteneur non trouvé');
                return;
            }
            
            // Récupération des informations utilisateur
            const userInfoManager = new UserInfoManager();
            userInfo = await userInfoManager.getUserInfo(config);
            
            // Récupération des informations d'événement
            const eventInfoManager = new EventInfoManager();
            detectedEventInfo = await eventInfoManager.getEventInfo(config);
            
            // Rendu du widget
            MeetwayWidget.render();
            
            console.log('Meetway Widget initialisé avec succès');
        }
        
        /**
         * Met à jour les données d'événement manuellement
         * @param {Object} eventData - Nouvelles données de l'événement
         */
        static updateEventData(eventData) {
            detectedEventInfo = { ...detectedEventInfo, ...eventData };
            
            // Sauvegarder dans localStorage
            const eventInfoManager = new EventInfoManager();
            eventInfoManager.saveEventInfo(detectedEventInfo);
            
            console.log('Meetway Widget: Données d\'événement mises à jour:', detectedEventInfo);
        }

        /**
         * Met à jour les informations utilisateur
         * @param {Object} newUserInfo - Nouvelles informations utilisateur
         */
        static updateUserInfo(newUserInfo) {
            userInfo = { ...userInfo, ...newUserInfo };
            
            // Sauvegarder dans localStorage
            const userInfoManager = new UserInfoManager();
            userInfoManager.saveUserInfo(userInfo);
            
            console.log('Meetway Widget: Informations utilisateur mises à jour:', userInfo);
        }
        
        /**
         * Injecte les styles CSS dans le head du document
         */
        static injectStyles() {
            if (document.getElementById('Meetway-widget-styles')) {
                return; // Styles déjà injectés
            }
            
            const styleElement = document.createElement('style');
            styleElement.id = 'Meetway-widget-styles';
            styleElement.textContent = WIDGET_STYLES;
            document.head.appendChild(styleElement);
        }
        
        /**
         * Gère le changement d'état de la checkbox de covoiturage
         * @param {Event} event - Événement de changement
         */
        static handleCarpoolChange(event) {
            const isInterested = event.target.checked;
            const validateButton = widgetContainer.querySelector('#validate-carpool');
            
            // Activer/désactiver le bouton de validation
            if (validateButton) {
                if (isInterested) {
                    validateButton.classList.add('enabled');
                } else {
                    validateButton.classList.remove('enabled');
                }
            }
        }
        
        /**
         * Gère le clic sur le bouton de validation
         * @param {Event} event - Événement de clic
         */
        static handleValidateClick(event) {
            // Vérifier si le bouton est activé
            if (!event.target.classList.contains('enabled')) {
                return; // Ne rien faire si le bouton est désactivé
            }
            
            const successMessage = widgetContainer.querySelector('.Meetway-success-message');
            
            // Appel de la fonction de callback si définie
            if (widgetConfig.onCarpoolInterest) {
                widgetConfig.onCarpoolInterest(true, detectedEventInfo, userInfo);
            }
            
            // Simulation d'un appel API (à remplacer par un vrai appel)
            MeetwayWidget.simulateApiCall(true);
            
            // Affichage du message de succès
            if (successMessage) {
                successMessage.textContent = '✅ Intérêt enregistré ! Nous vous contacterons pour organiser le covoiturage.';
                successMessage.classList.add('show');
            }
            
            // Désactiver le bouton après validation
            const validateButton = widgetContainer.querySelector('#validate-carpool');
            if (validateButton) {
                validateButton.classList.remove('enabled');
            }
        }
        
        /**
         * Gère le clic sur le lien CGU
         * @param {Event} event - Événement de clic
         */
        static handleCguClick(event) {
            event.preventDefault();
            
            // Appel de la fonction de callback si définie
            if (widgetConfig.onCguClick) {
                widgetConfig.onCguClick();
            } else {
                // Fallback: ouvrir dans une nouvelle fenêtre
                window.open('https://meetway.fr/cgu', '_blank');
            }
        }
        
        /**
         * Simule un appel API pour enregistrer l'intérêt de covoiturage
         * @param {boolean} isInterested - L'utilisateur est-il intéressé
         */
        static simulateApiCall(isInterested) {
            console.log('🚗 Appel API simulé - Intérêt covoiturage:', isInterested);
            console.log('📋 Informations d\'événement:', detectedEventInfo);
            console.log('👤 Informations utilisateur:', userInfo);
            
            // Simulation d'un délai réseau
            setTimeout(() => {
                console.log('✅ Réponse API simulée - Intérêt enregistré avec succès');
                
                // Ici, vous pouvez implémenter le vrai appel API :
                // fetch(widgetConfig.apiEndpoint, {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ 
                //         eventInfo: detectedEventInfo,
                //         userInfo: userInfo,
                //         interested: isInterested,
                //         timestamp: new Date().toISOString(),
                //         userAgent: navigator.userAgent,
                //         pageUrl: window.location.href
                //     })
                // });
            }, 500);
        }
        
        /**
         * Génère le HTML du widget
         * @returns {string} HTML du widget
         */
        static generateHTML() {
            return `
                <div class="Meetway-widget">
                    <div class="Meetway-widget-header">
                        <h3 class="Meetway-widget-title">Venir en covoiturage</h3>
                        <div class="Meetway-logo">
                            <img src="/assets/meetway-logo.png" alt="Meetway Logo" class="Meetway-logo-image" style="width: 100px; height: auto;">
                        </div>
                    </div>
                    
                    <div class="Meetway-features">
                        <span class="Meetway-feature-tag">${widgetConfig.featureTags.tag1}</span>
                        <span class="Meetway-feature-tag">${widgetConfig.featureTags.tag2}</span>
                        <span class="Meetway-feature-tag">${widgetConfig.featureTags.tag3}</span>
                    </div>
                    
                    <div class="Meetway-checkbox-container">
                        <input type="checkbox" id="carpool-interest" class="Meetway-checkbox">
                        <label for="carpool-interest" class="Meetway-checkbox-label">
                            Je suis intéressé(e) pour covoiturer
                        </label>
                    </div>
                    
                    <div class="Meetway-cgu-text">
                        En cochant cette case, vous acceptez nos <span class="Meetway-cgu-link">conditions générales d'utilisation de Meetway.</span>
                    </div>
                    
                    <button type="button" class="Meetway-validate-button" id="validate-carpool">
                        Valider
                    </button>
                    
                    <div class="Meetway-success-message"></div>
                </div>
            `;
        }
        
        /**
         * Rend le widget dans le conteneur
         */
        static render() {
            if (!widgetContainer) return;
            
            widgetContainer.innerHTML = MeetwayWidget.generateHTML();
            
            // Ajout de l'écouteur d'événement pour la checkbox
            const carpoolCheckbox = widgetContainer.querySelector('#carpool-interest');
            if (carpoolCheckbox) {
                carpoolCheckbox.addEventListener('change', MeetwayWidget.handleCarpoolChange);
            }
            
            // Ajout de l'écouteur d'événement pour le bouton de validation
            const validateButton = widgetContainer.querySelector('#validate-carpool');
            if (validateButton) {
                validateButton.addEventListener('click', MeetwayWidget.handleValidateClick);
            }
            
            // Ajout de l'écouteur d'événement pour le lien CGU
            const cguLink = widgetContainer.querySelector('.Meetway-cgu-link');
            if (cguLink) {
                cguLink.addEventListener('click', MeetwayWidget.handleCguClick);
            }
        }
        
        /**
         * Obtient les informations d'événement détectées
         * @returns {Object} Informations d'événement
         */
        static getDetectedEventInfo() {
            return { ...detectedEventInfo };
        }

        /**
         * Obtient les informations utilisateur
         * @returns {Object} Informations utilisateur
         */
        static getUserInfo() {
            return { ...userInfo };
        }
    }

    // Exposition de l'API publique
    window.MeetwayWidget = MeetwayWidget;

    // Auto-initialisation si des données sont disponibles
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Le widget sera initialisé par le code de la page HTML
        });
    }

})();
