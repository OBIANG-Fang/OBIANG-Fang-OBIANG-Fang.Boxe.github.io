// Fonction pour vérifier si un élément est visible dans la fenêtre
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Fonction pour ajouter l'animation aux éléments
function handleScrollAnimation() {
    const elements = document.querySelectorAll('.activity-card, .price-card, .stat-item, .about-text');
    
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('animate-in');
        }
    });
}

// Écouteur d'événement pour le défilement
window.addEventListener('scroll', handleScrollAnimation);

// Déclencher l'animation au chargement initial
document.addEventListener('DOMContentLoaded', handleScrollAnimation);

// Ajouter les horaires dynamiquement
const scheduleContainer = document.querySelector('.schedule-container');
const schedules = [
    { day: 'Lundi', times: ['19h00 - 20h30'] },
    { day: 'Jeudi', times: ['18h00 - 20h00'] },
    { day: 'Vendredi', times: ['18h00 - 20h00'] }
];

schedules.forEach(schedule => {
    const scheduleCard = document.createElement('div');
    scheduleCard.className = 'schedule-card';
    scheduleCard.innerHTML = `
        <h3>${schedule.day}</h3>
        <ul>
            ${schedule.times.map(time => `<li>${time}</li>`).join('')}
        </ul>
    `;
    scheduleContainer.appendChild(scheduleCard);
});