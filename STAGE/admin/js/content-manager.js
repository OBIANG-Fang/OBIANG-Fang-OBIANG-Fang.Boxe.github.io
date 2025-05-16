// Gestionnaire de contenu pour l'administration

// Configuration des sections modifiables
const editableSections = {
    about: {
        selector: '#about .about-text',
        fields: ['histoire', 'valeurs']
    },
    activities: {
        selector: '#activites .activity-grid',
        fields: ['titre', 'description', 'image']
    },
    events: {
        selector: '#evenements .events-grid',
        fields: ['titre', 'date', 'description', 'image']
    },
    schedule: {
        selector: '#horaires .schedule-grid',
        fields: ['jour', 'cours', 'heureDebut', 'heureFin']
    },
    pricing: {
        selector: '#tarifs .pricing-grid',
        fields: ['categorie', 'prix', 'description']
    },
    members: {
        selector: '#membres .members-grid',
        fields: ['nom', 'role', 'photo', 'description']
    },
    sponsors: {
        selector: '#sponsors .sponsors-grid',
        fields: ['nom', 'logo', 'lien']
    }
};

// Fonction pour charger le contenu actuel
const loadCurrentContent = async (section) => {
    const container = document.querySelector(editableSections[section].selector);
    if (!container) return null;

    // Récupération du contenu HTML actuel
    return {
        html: container.innerHTML,
        data: extractDataFromHTML(container, section)
    };
};

// Extraction des données depuis le HTML
const extractDataFromHTML = (container, section) => {
    const data = [];
    const items = container.children;
    
    Array.from(items).forEach(item => {
        const itemData = {};
        editableSections[section].fields.forEach(field => {
            const element = item.querySelector(`[data-field="${field}"]`);
            if (element) {
                itemData[field] = element.tagName === 'IMG' ? element.src : element.textContent;
            }
        });
        data.push(itemData);
    });

    return data;
};

// Mise à jour du contenu
const updateContent = async (section, newData) => {
    const container = document.querySelector(editableSections[section].selector);
    if (!container) return false;

    // Création du nouveau HTML
    const newHTML = generateHTML(section, newData);
    container.innerHTML = newHTML;

    // Sauvegarde des modifications (à implémenter avec une API)
    await saveContentToServer(section, newData);
    return true;
};

// Génération du HTML pour le nouveau contenu
const generateHTML = (section, data) => {
    switch(section) {
        case 'about':
            return generateAboutHTML(data);
        case 'activities':
            return generateActivitiesHTML(data);
        case 'events':
            return generateEventsHTML(data);
        case 'schedule':
            return generateScheduleHTML(data);
        case 'pricing':
            return generatePricingHTML(data);
        case 'members':
            return generateMembersHTML(data);
        case 'sponsors':
            return generateSponsorsHTML(data);
        default:
            return '';
    }
};

// Fonctions de génération HTML spécifiques à chaque section
const generateAboutHTML = (data) => {
    return `
        <h3>Notre Histoire</h3>
        <p data-field="histoire">${data.histoire}</p>
        <h3>Nos Valeurs</h3>
        <p data-field="valeurs">${data.valeurs}</p>
    `;
};

const generateActivitiesHTML = (data) => {
    return data.map(activity => `
        <div class="activity-card">
            <img src="${activity.image}" alt="${activity.titre}" data-field="image">
            <h3 data-field="titre">${activity.titre}</h3>
            <p data-field="description">${activity.description}</p>
        </div>
    `).join('');
};

const generateEventsHTML = (data) => {
    return data.map(event => `
        <div class="event-card">
            <img src="${event.image}" alt="${event.titre}" data-field="image">
            <h3 data-field="titre">${event.titre}</h3>
            <p class="event-date" data-field="date">${event.date}</p>
            <p data-field="description">${event.description}</p>
        </div>
    `).join('');
};

const generateScheduleHTML = (data) => {
    return data.map(schedule => `
        <div class="schedule-item">
            <h3 data-field="jour">${schedule.jour}</h3>
            <p data-field="cours">${schedule.cours}</p>
            <p class="time">
                <span data-field="heureDebut">${schedule.heureDebut}</span> - 
                <span data-field="heureFin">${schedule.heureFin}</span>
            </p>
        </div>
    `).join('');
};

const generatePricingHTML = (data) => {
    return data.map(price => `
        <div class="price-card">
            <h3 data-field="categorie">${price.categorie}</h3>
            <p class="price" data-field="prix">${price.prix}</p>
            <p data-field="description">${price.description}</p>
        </div>
    `).join('');
};

const generateMembersHTML = (data) => {
    return data.map(member => `
        <div class="member-card">
            <img src="${member.photo}" alt="${member.nom}" data-field="photo">
            <h3 data-field="nom">${member.nom}</h3>
            <p class="role" data-field="role">${member.role}</p>
            <p data-field="description">${member.description}</p>
        </div>
    `).join('');
};

const generateSponsorsHTML = (data) => {
    return data.map(sponsor => `
        <div class="sponsor-card">
            <a href="${sponsor.lien}" target="_blank" data-field="lien">
                <img src="${sponsor.logo}" alt="${sponsor.nom}" data-field="logo">
                <p data-field="nom">${sponsor.nom}</p>
            </a>
        </div>
    `).join('');
};

// Simulation de sauvegarde sur le serveur (à remplacer par une vraie API)
const saveContentToServer = async (section, data) => {
    console.log(`Sauvegarde des modifications de la section ${section}:`, data);
    // Ici, implémenter la logique de sauvegarde réelle
    return new Promise(resolve => setTimeout(resolve, 500));
};

// Export des fonctions
export {
    loadCurrentContent,
    updateContent,
    editableSections
};