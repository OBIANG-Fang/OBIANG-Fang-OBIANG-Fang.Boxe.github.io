// Gestionnaire principal du tableau de bord administratif

class DashboardManager {
    constructor() {
        this.initializeEventListeners();
        this.setupLogout();
    }

    initializeEventListeners() {
        // Gestion de la navigation
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.id !== 'logout') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateToSection(link.getAttribute('href').substring(1));
                });
            }
        });

        // Gestion de la recherche de membres
        const searchInput = document.querySelector('.admin-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchMembers(e.target.value);
            });
        }

        // Gestion des formulaires
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('admin-form')) {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });
    }

    navigateToSection(sectionId) {
        // Masquer toutes les sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.style.display = 'none';
        });

        // Afficher la section sélectionnée
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.style.display = 'block';
        }

        // Mettre à jour la navigation active
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    searchMembers(query) {
        const members = window.db.get('members');
        const filteredMembers = members.filter(member => 
            member.nom.toLowerCase().includes(query.toLowerCase()) ||
            member.email.toLowerCase().includes(query.toLowerCase())
        );

        const tbody = document.querySelector('#members tbody');
        tbody.innerHTML = filteredMembers.map(member => `
            <tr data-id="${member.id}">
                <td>${member.nom}</td>
                <td>${member.email}</td>
                <td>${member.telephone}</td>
                <td>${member.statut}</td>
                <td>
                    <button class="action-button edit">Modifier</button>
                    <button class="action-button delete">Supprimer</button>
                </td>
            </tr>
        `).join('');
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const section = form.closest('.modal').id.replace('Modal', '');
        const itemId = form.dataset.itemId;

        if (itemId) {
            // Mise à jour
            window.db.update(section, parseInt(itemId), data);
        } else {
            // Création
            window.db.create(section, data);
        }

        // Fermer le modal et recharger les données
        form.closest('.modal').style.display = 'none';
        window.loadInitialData();
    }

    setupLogout() {
        const logoutButton = document.getElementById('logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                    window.location.href = 'login.html';
                }
            });
        }
    }
}

// Initialisation du gestionnaire de tableau de bord
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});

// Gestion de l'authentification
const checkAuth = () => {
    const isAuthenticated = sessionStorage.getItem('adminAuth');
    if (!isAuthenticated) {
        window.location.href = '/admin/login.html';
    }
};

// Vérification de l'authentification au chargement
document.addEventListener('DOMContentLoaded', checkAuth);

// Gestion de la déconnexion
document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('adminAuth');
    window.location.href = '/admin/login.html';
});

// Navigation fluide
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('id') !== 'logout') {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            section.scrollIntoView({ behavior: 'smooth' });

            // Mise à jour du lien actif
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Chargement initial du contenu
const initializeContent = async () => {
    for (const section in editableSections) {
        const content = await loadCurrentContent(section);
        if (content) {
            const container = document.querySelector(editableSections[section].selector);
            if (container) {
                container.innerHTML = content.html;
            }
        }
    }
};

// Gestion des formulaires de modification
document.querySelectorAll('.admin-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const section = form.closest('section').id;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const success = await updateContent(section, data);
        if (success) {
            alert('Modifications enregistrées avec succès');
        } else {
            alert('Erreur lors de l\'enregistrement des modifications');
        }
    });
});

// Gestion des boutons d'ajout
document.querySelectorAll('.add-button').forEach(button => {
    button.addEventListener('click', function() {
        const section = this.closest('section').id;
        showAddForm(section);
    });
});

// Affichage du formulaire d'ajout
const showAddForm = (section) => {
    const fields = editableSections[section].fields;
    const formHTML = createFormHTML(section, fields);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = formHTML;
    document.body.appendChild(modal);
    
    initializeFormHandlers(modal, section);
};

// Création du HTML du formulaire
const createFormHTML = (section, fields) => {
    return `
        <div class="modal-content">
            <h2>Ajouter un élément - ${section}</h2>
            <form class="admin-form">
                ${fields.map(field => `
                    <div class="form-group">
                        <label for="${field}">${field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        ${field.includes('description') ? 
                            `<textarea id="${field}" name="${field}" required></textarea>` :
                            `<input type="${field === 'date' ? 'date' : 'text'}" id="${field}" name="${field}" required>`
                        }
                    </div>
                `).join('')}
                <div class="form-actions">
                    <button type="submit" class="admin-button">Enregistrer</button>
                    <button type="button" class="admin-button cancel">Annuler</button>
                </div>
            </form>
        </div>
    `;
};

// Initialisation des gestionnaires de formulaires
const initializeFormHandlers = (modal, section) => {
    const form = modal.querySelector('form');
    const cancelButton = modal.querySelector('.cancel');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const success = await updateContent(section, [data]);
        if (success) {
            alert('Élément ajouté avec succès');
            modal.remove();
            // Recharger le contenu de la section
            const content = await loadCurrentContent(section);
            if (content) {
                const container = document.querySelector(editableSections[section].selector);
                if (container) {
                    container.innerHTML = content.html;
                }
            }
        } else {
            alert('Erreur lors de l\'ajout de l\'élément');
        }
    });

    cancelButton.addEventListener('click', () => {
        modal.remove();
    });
};

// Gestion des actions sur les éléments
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('action-button')) {
        const button = e.target;
        const action = button.classList.contains('edit') ? 'edit' : 'delete';
        const section = button.closest('section').id;
        const item = button.closest('.content-item');

        if (action === 'edit') {
            const itemData = {};
            editableSections[section].fields.forEach(field => {
                const element = item.querySelector(`[data-field="${field}"]`);
                if (element) {
                    itemData[field] = element.tagName === 'IMG' ? element.src : element.textContent;
                }
            });
            showEditForm(section, itemData);
        } else if (action === 'delete') {
            if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
                item.remove();
                // Mettre à jour le contenu sur le serveur
                const content = await loadCurrentContent(section);
                if (content) {
                    await updateContent(section, content.data);
                }
            }
        }
    }
});

// Affichage du formulaire d'édition
const showEditForm = (section, itemData) => {
    const fields = editableSections[section].fields;
    const formHTML = createFormHTML(section, fields);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = formHTML;
    
    // Pré-remplir le formulaire avec les données existantes
    const form = modal.querySelector('form');
    fields.forEach(field => {
        const input = form.querySelector(`#${field}`);
        if (input && itemData[field]) {
            input.value = itemData[field];
        }
    });
    
    document.body.appendChild(modal);
    initializeFormHandlers(modal, section);
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeContent();
});

// Recherche de membres
const memberSearch = document.querySelector('.admin-search');
if (memberSearch) {
    memberSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.admin-table tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}