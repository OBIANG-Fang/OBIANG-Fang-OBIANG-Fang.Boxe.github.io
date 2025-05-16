// Gestionnaire de formulaires pour l'administration

// Configuration des formulaires
const formConfig = {
    member: {
        fields: ['nom', 'email', 'telephone', 'statut'],
        title: 'Membre'
    },
    schedule: {
        fields: ['cours', 'jour', 'heureDebut', 'heureFin'],
        title: 'Horaire'
    },
    news: {
        fields: ['titre', 'contenu', 'date'],
        title: 'Actualité'
    },
    event: {
        fields: ['titre', 'date', 'lieu', 'description'],
        title: 'Événement'
    }
};

// Création des formulaires dynamiques
const createForm = (type) => {
    const config = formConfig[type];
    const formHTML = `
        <div class="modal" id="${type}Modal">
            <div class="modal-content">
                <h2>${config.title}</h2>
                <form id="${type}Form" class="admin-form">
                    ${config.fields.map(field => `
                        <div class="form-group">
                            <label for="${field}">${field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input type="${field === 'email' ? 'email' : field === 'date' ? 'date' : 'text'}" 
                                   id="${field}" 
                                   name="${field}" 
                                   required>
                        </div>
                    `).join('')}
                    <div class="form-actions">
                        <button type="submit" class="admin-button">Enregistrer</button>
                        <button type="button" class="admin-button cancel">Annuler</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', formHTML);
    initializeFormHandlers(type);
};

// Initialisation des gestionnaires d'événements pour les formulaires
const initializeFormHandlers = (type) => {
    const modal = document.getElementById(`${type}Modal`);
    const form = document.getElementById(`${type}Form`);
    const cancelButton = modal.querySelector('.cancel');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        saveData(type, data);
        modal.style.display = 'none';
    });

    cancelButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
};

// Sauvegarde des données
const saveData = (type, data) => {
    // Simulation de sauvegarde (à remplacer par une vraie API)
    console.log(`Sauvegarde des données ${type}:`, data);
    // Actualisation de l'interface
    updateUI(type, data);
};

// Mise à jour de l'interface utilisateur
const updateUI = (type, data) => {
    const container = document.querySelector(`#${type} .${type}-grid`);
    if (!container) return;

    const itemHTML = createItemHTML(type, data);
    container.insertAdjacentHTML('afterbegin', itemHTML);
};

// Création du HTML pour un élément
const createItemHTML = (type, data) => {
    switch(type) {
        case 'member':
            return `
                <tr>
                    <td>${data.nom}</td>
                    <td>${data.email}</td>
                    <td>${data.telephone}</td>
                    <td>${data.statut}</td>
                    <td>
                        <button class="action-button edit">Modifier</button>
                        <button class="action-button delete">Supprimer</button>
                    </td>
                </tr>
            `;
        case 'news':
            return `
                <div class="news-card">
                    <h3>${data.titre}</h3>
                    <p>Date de publication: ${data.date}</p>
                    <div class="news-actions">
                        <button class="action-button edit">Modifier</button>
                        <button class="action-button delete">Supprimer</button>
                    </div>
                </div>
            `;
        case 'event':
            return `
                <div class="event-card">
                    <h3>${data.titre}</h3>
                    <p>Date: ${data.date}</p>
                    <p>Lieu: ${data.lieu}</p>
                    <div class="event-actions">
                        <button class="action-button edit">Modifier</button>
                        <button class="action-button delete">Supprimer</button>
                    </div>
                </div>
            `;
        default:
            return '';
    }
};

// Export des fonctions
window.adminForms = {
    createForm,
    saveData,
    updateUI
};