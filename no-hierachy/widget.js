/**
 * Meetway Widget - Version Ultra-Simplifiée
 * Widget de covoiturage événement agnostique
 * Version No-Hierarchy - Données manuelles uniquement
 */

(function() {
    'use strict';

    // Styles CSS intégrés
    const STYLES = `
        .meetway-widget {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: white;
            border: 2px solid rgb(241, 98, 16);
            border-radius: 12px;
            padding: 20px;
            color: #333;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .meetway-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        
        .meetway-title {
            font-size: 20px;
            font-weight: bold;
            margin: 0;
            color: #333;
            flex: 1;
        }
        
        .meetway-logo {
            width: 80px;
            height: auto;
        }
        
        .meetway-features {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
        }
        
        .meetway-tag {
            background: rgb(241, 98, 16);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
        }

        .meetway-bottom {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .meetway-checkbox-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .meetway-checkbox {
            width: 18px;
            height: 18px;
            accent-color: rgb(241, 98, 16);
            cursor: pointer;
        }
        
        .meetway-checkbox-label {
            font-size: 14px;
            cursor: pointer;
            user-select: none;
        }
        
        .meetway-cgu {
            font-size: 11px;
            color: #666;
            margin-bottom: 15px;
            line-height: 1.3;
        }
        
        .meetway-cgu-link {
            color: rgb(241, 98, 16);
            text-decoration: underline;
            cursor: pointer;
        }
        
        .meetway-button {
            background: rgb(241, 98, 16);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: not-allowed;
            opacity: 0.5;
            transition: all 0.2s ease;

        }
        
        .meetway-button.enabled {
            opacity: 1;
            cursor: pointer;
        }
        
        .meetway-button.enabled:hover {
            background: #d17a0f;
            transform: translateY(-1px);
        }
        
        .meetway-success {
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
            border-radius: 6px;
            padding: 10px;
            margin-top: 15px;
            text-align: center;
            font-size: 12px;
            display: none;
        }
        
        .meetway-success.show {
            display: block;
        }
        
        @media (max-width: 480px) {
            .meetway-widget {
                padding: 15px;
                margin: 10px;
            }
        }
    `;

    // Variables globales
    let config = {};
    let eventInfo = {};
    let userInfo = {};
    let container = null;

    /**
     * Injecte les styles CSS
     */
    function injectStyles() {
        if (document.getElementById('meetway-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'meetway-styles';
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    /**
     * Gère le changement de la checkbox
     */
    function handleCheckboxChange(event) {
        const button = container.querySelector('.meetway-button');
        if (event.target.checked) {
            button.classList.add('enabled');
        } else {
            button.classList.remove('enabled');
        }
    }

    /**
     * Gère le clic sur le bouton de validation
     */
    function handleButtonClick() {
        const button = container.querySelector('.meetway-button');
        if (!button.classList.contains('enabled')) return;

        const success = container.querySelector('.meetway-success');
        
        // Appel de callback si défini
        if (config.onInterest) {
            config.onInterest(true, eventInfo, userInfo);
        }

        // Simulation d'appel API
        console.log('Intérêt covoiturage enregistré:', {
            eventInfo,
            userInfo,
            timestamp: new Date().toISOString()
        });

        // Affichage du message de succès
        success.textContent = config.messages.successMessage;
        success.classList.add('show');

        // Désactiver le bouton
        button.classList.remove('enabled');
    }

    /**
     * Gère le clic sur le lien CGU
     */
    function handleCguClick(event) {
        event.preventDefault();
        
        if (config.onCguClick) {
            config.onCguClick();
        } else {
            window.open('https://meetway.fr/cgu', '_blank');
        }
    }

    /**
     * Génère le HTML du widget
     */
    function generateHTML() {
        return `
            <div class="meetway-widget">
                <div class="meetway-header">
                    <h3 class="meetway-title">${config.messages.title}</h3>
                    <img src="./assets/meetway-logo.png" alt="Meetway" class="meetway-logo">
                </div>
                
                <div class="meetway-features">
                    <span class="meetway-tag">${config.features.tag1}</span>
                    <span class="meetway-tag">${config.features.tag2}</span>
                    <span class="meetway-tag">${config.features.tag3}</span>
                </div>

                <div class="meetway-bottom">
                <div>
                    <div class="meetway-checkbox-container">
                        <input type="checkbox" id="meetway-interest" class="meetway-checkbox">
                        <label for="meetway-interest" class="meetway-checkbox-label">
                            ${config.messages.interestText}
                        </label>
                    </div>
                    
                    <div class="meetway-cgu">
                        ${config.messages.cguText.replace('conditions générales d\'utilisation de Meetway.', 
                            '<span class="meetway-cgu-link">conditions générales d\'utilisation de Meetway.</span>')}
                    </div>
                </div>
                
                    
                    <button type="button" class="meetway-button">
                        Valider
                    </button>
                </div>
            
                <div class="meetway-success"></div>
            </div>
        `;
    }

    /**
     * Initialise le widget
     */
    function init(options = {}) {
        // Vérification des données obligatoires
        if (!options.eventData) {
            console.error('Meetway: eventData est obligatoire');
            return;
        }

        // Fusion de la configuration
        config = { ...MeetwayConfig, ...options };
        
        // Injection des styles
        injectStyles();
        
        // Récupération du conteneur
        container = document.getElementById(config.containerId);
        if (!container) {
            console.error('Meetway: Conteneur non trouvé');
            return;
        }

        // Récupération des données avec structure standardisée
        eventInfo = {
            name: options.eventData.name || options.eventData.title || options.eventData.eventName || '',
            date: options.eventData.date || options.eventData.eventDate || options.eventData.datetime || '',
            description: options.eventData.description || options.eventData.desc || options.eventData.details || null,
            id: options.eventData.id || options.eventData.eventId || options.eventData.event_id || '',
            customData: options.eventData.customData || options.eventData.custom_data || options.eventData.metadata || {},
            url: options.eventData.url || window.location.href,
            pageTitle: options.eventData.pageTitle || document.title,
            source: 'manual',
            timestamp: new Date().toISOString()
        };
        
        userInfo = {
            id: (options.userData && (options.userData.id || options.userData.userId || options.userData.user_id)) || null,
            firstName: (options.userData && (options.userData.firstName || options.userData.first_name || options.userData.prenom)) || null,
            lastName: (options.userData && (options.userData.lastName || options.userData.last_name || options.userData.nom)) || null,
            email: (options.userData && (options.userData.email || options.userData.mail)) || null,
            phone: (options.userData && (options.userData.phone || options.userData.telephone || options.userData.phoneNumber || options.userData.tel)) || null,
            billingAddress: (options.userData && (options.userData.billingAddress || options.userData.billing_address || options.userData.adresse)) || null,
            customData: (options.userData && (options.userData.customData || options.userData.custom_data || options.userData.metadata)) || {},
            source: 'manual',
            timestamp: new Date().toISOString()
        };

        // Rendu du widget
        container.innerHTML = generateHTML();

        // Ajout des événements
        const checkbox = container.querySelector('#meetway-interest');
        const button = container.querySelector('.meetway-button');
        const cguLink = container.querySelector('.meetway-cgu-link');

        checkbox.addEventListener('change', handleCheckboxChange);
        button.addEventListener('click', handleButtonClick);
        cguLink.addEventListener('click', handleCguClick);

        console.log('Meetway Widget initialisé');
        console.log('Informations événement:', eventInfo);
    }

    /**
     * Met à jour les données d'événement
     */
    function updateEventData(data) {
        eventInfo = { ...eventInfo, ...data };
        console.log('Données événement mises à jour:', eventInfo);
    }

    /**
     * Met à jour les informations utilisateur
     */
    function updateUserData(data) {
        userInfo = { ...userInfo, ...data };
        console.log('Données utilisateur mises à jour:', userInfo);
    }

    /**
     * Obtient les informations d'événement
     */
    function getEventInfo() {
        return { ...eventInfo };
    }

    /**
     * Obtient les informations utilisateur
     */
    function getUserData() {
        return { ...userInfo };
    }

    // Exposition de l'API
    window.MeetwayWidget = {
        init,
        updateEventData,
        updateUserData,
        getEventInfo,
        getUserData
    };

})();
