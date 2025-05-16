// Base de données pour le tableau de bord administratif

const db = {
    members: [
        {
            id: 1,
            nom: 'Jean Dupont',
            email: 'jean.dupont@email.com',
            telephone: '06 12 34 56 78',
            statut: 'Actif'
        }
    ],
    schedule: [
        {
            id: 1,
            cours: 'Boxe Anglaise',
            jour: 'Lundi',
            heureDebut: '18:00',
            heureFin: '20:00'
        },
        {
            id: 2,
            cours: 'Boxe Anglaise',
            jour: 'Mercredi',
            heureDebut: '19:00',
            heureFin: '21:00'
        },
        {
            id: 3,
            cours: 'Boxe Anglaise',
            jour: 'Samedi',
            heureDebut: '10:00',
            heureFin: '12:00'
        }
    ],
    news: [
        {
            id: 1,
            titre: 'Nouveaux horaires',
            contenu: 'De nouveaux créneaux horaires sont disponibles',
            date: '2024-01-01'
        }
    ],
    events: [
        {
            id: 1,
            titre: 'Compétition régionale',
            date: '2024-03-15',
            lieu: 'Gymnase Municipal',
            description: 'Championnat régional de boxe anglaise'
        }
    ]
};

// Fonctions CRUD pour la gestion des données
const dbOperations = {
    // Lecture
    get: (collection) => db[collection],
    getById: (collection, id) => db[collection].find(item => item.id === id),

    // Création
    create: (collection, data) => {
        const newId = Math.max(...db[collection].map(item => item.id)) + 1;
        const newItem = { id: newId, ...data };
        db[collection].push(newItem);
        return newItem;
    },

    // Mise à jour
    update: (collection, id, data) => {
        const index = db[collection].findIndex(item => item.id === id);
        if (index !== -1) {
            db[collection][index] = { ...db[collection][index], ...data };
            return db[collection][index];
        }
        return null;
    },

    // Suppression
    delete: (collection, id) => {
        const index = db[collection].findIndex(item => item.id === id);
        if (index !== -1) {
            db[collection].splice(index, 1);
            return true;
        }
        return false;
    }
};

// Export des fonctions
window.db = dbOperations;