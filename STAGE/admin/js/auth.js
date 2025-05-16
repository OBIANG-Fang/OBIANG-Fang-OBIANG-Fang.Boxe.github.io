// Gestionnaire d'authentification

// Identifiants par défaut
const DEFAULT_USERNAME = 'Admin';
const DEFAULT_PASSWORD = '00241One@.';

// Fonction de hachage simple (à des fins de démonstration)
const hashPassword = (password) => {
    return btoa(password); // Encodage en Base64 (NE PAS utiliser en production)
};

// Vérification des identifiants
const validateCredentials = (username, password) => {
    return username === DEFAULT_USERNAME && 
           hashPassword(password) === hashPassword(DEFAULT_PASSWORD);
};

// Gestionnaire de connexion
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.querySelector('.error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (validateCredentials(username, password)) {
                // Stockage de l'authentification
                sessionStorage.setItem('adminAuth', 'true');
                // Redirection vers le panneau d'administration
                window.location.href = 'index.html';
            } else {
                // Affichage du message d'erreur
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Identifiants incorrects';
            }
        });
    }
});