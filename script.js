// Configuration du carrousel
let carouselTrack = document.querySelector('#standard-track');
let bankCards = document.querySelectorAll('#standard-track .bank-card');
let currentCategory = 'standard';
let currentIndex = 0;
let isScrolling = false;
let isExpanded = false;

const cardsData = {
    standard: [
        {
            title: 'Crédit Agricol',
            logo: '🌾',
            bankInfo: 'Crédit Agricol est l\'un des plus grands groupes bancaires français, fondé en 1894. Il propose des services bancaires complets pour les particuliers et les entreprises, avec une forte présence territoriale en France.'
        },
        {
            title: 'Revolut',
            logo: '⚡',
            bankInfo: 'Revolut est une fintech basée à Londres proposant des services bancaires numériques révolutionnaires. Leader en matière de paiements internationaux et de transfert d\'argent à faible coût.'
        },
        {
            title: 'Société Générale',
            logo: '🏛️',
            bankInfo: 'Société Générale, fondée en 1864, est l\'une des plus grandes banques de France. Elle offre une gamme complète de produits et services bancaires et financiers.'
        },
        {
            title: 'Boursorama',
            logo: '💼',
            bankInfo: 'Boursorama est une banque en ligne française filiale de Société Générale. Elle propose des services bancaires sans frais et des outils d\'investissement accessibles.'
        },
        {
            title: 'La Poste',
            logo: '📮',
            bankInfo: 'La Banque Postale, filiale du groupe La Poste depuis 2006, propose des services bancaires accessibles dans les bureaux de poste français avec un service de proximité.'
        }
    ],
    metal: [
        {
            title: 'Platinum Card',
            logo: '💎',
            bankInfo: 'Platinum Card est la carte premium exclusive offrant des avantages luxe et une expérience VIP. Avec ses bénéfices exclusifs et son design métallique prestigieux, c\'est le prestige bancaire à portée de main.'
        },
        {
            title: 'Gold Card',
            logo: '👑',
            bankInfo: 'Gold Card offre une expérience premium avec des avantages exclusifs, des réductions VIP et un support client prioritaire. Incarnez le luxe et la distinction.'
        },
        {
            title: 'Black Card',
            logo: '⚫',
            bankInfo: 'Black Card est l\'ultime expression du prestige. Réservée aux clients élites, elle offre les avantages les plus exclusifs, un accès VIP illimité et des services concierge 24/7.'
        }
    ]
};

// Fonction pour mettre à jour les classes des cartes
// Variable pour stocker l'angle de rotation actuel (pour animation fluide)
let carouselRotation = 0;

// Mapping des cartes vers les classes de fond
const backgroundClasses = {
    standard: ['bg-credit-agricol', 'bg-revolut', 'bg-societe-generale', 'bg-boursorama', 'bg-la-poste'],
    metal: ['bg-platinum', 'bg-gold', 'bg-black']
};

// Fonction pour changer le fond
function updateBackground() {
    // Retirer toutes les classes de fond
    document.body.classList.remove(
        'bg-platinum', 'bg-gold', 'bg-black',
        'bg-credit-agricol', 'bg-revolut', 'bg-societe-generale', 'bg-boursorama', 'bg-la-poste'
    );
    
    // Cacher les overlays
    const eyesOverlay = document.getElementById('eyes-overlay');
    const vibrationOverlay = document.getElementById('vibration-overlay');
    eyesOverlay.classList.remove('show');
    vibrationOverlay.classList.remove('show');
    
    // Ajouter la classe de fond correspondante
    const bgClass = backgroundClasses[currentCategory][currentIndex];
    if (bgClass) {
        document.body.classList.add(bgClass);
        
        // Effets spéciaux pour Metal Cards
        if (currentCategory === 'metal') {
            if (bgClass === 'bg-gold') {
                // Afficher les yeux pour Gold
                eyesOverlay.classList.add('show');
            } else if (bgClass === 'bg-platinum') {
                // Afficher les vibrations pour Platinum
                vibrationOverlay.classList.add('show');
            }
        }
    }
}

function updateCarousel() {
    // Carrousel circulaire 3D pour les deux catégories
    const totalCards = bankCards.length;
    const angleSlice = 360 / totalCards;
    const radius = 500; // Rayon du cercle
    
    // Calculer l'angle de rotation basé sur l'index courant
    carouselRotation = currentIndex * angleSlice;

    bankCards.forEach((card, index) => {
        // Retirer les anciennes classes
        card.classList.remove('active', 'next', 'next2', 'exit-bottom', 'hidden-back');
        
        // Angle de cette carte dans le cercle
        const cardAngle = (index * angleSlice) - carouselRotation;
        const angleRad = (cardAngle * Math.PI) / 180;
        
        // Position sur le cercle horizontal (X et Z)
        const x = Math.sin(angleRad) * radius;
        const z = Math.cos(angleRad) * radius - radius; // Décalé pour que le centre soit devant
        
        // Rotation Y pour que la carte soit tangente au cercle
        const rotationY = -cardAngle;
        
        // Légère inclinaison pour effet 3D flottant
        const rotationX = 5;
        const rotationZ = cardAngle * 0.1;
        
        // Transform 3D complet
        card.style.transform = `
            translateX(${x}px) 
            translateZ(${z}px) 
            rotateY(${rotationY}deg)
            rotateX(${rotationX}deg)
            rotateZ(${rotationZ}deg)
        `;
        
        // Z-index basé sur la profondeur
        card.style.zIndex = Math.floor(z + 600);
        
        // Toutes les cartes sont visibles mais avec opacité variable
        const normalizedZ = (z + radius) / (2 * radius); // 0 à 1
        const opacity = 0.3 + normalizedZ * 0.7;
        card.style.opacity = opacity;
        card.style.visibility = 'visible';
        card.style.pointerEvents = z > -300 ? 'auto' : 'none';
    });
    
    // Mettre à jour le fond
    updateBackground();
}

// Navigation
function nextCard() {
    if (!isScrolling && !isExpanded) {
        isScrolling = true;
        currentIndex = (currentIndex + 1) % bankCards.length;
        updateCarousel();
        setTimeout(() => {
            isScrolling = false;
        }, 600);
    }
}

function prevCard() {
    if (!isScrolling && !isExpanded) {
        isScrolling = true;
        currentIndex = (currentIndex - 1 + bankCards.length) % bankCards.length;
        updateCarousel();
        setTimeout(() => {
            isScrolling = false;
        }, 600);
    }
}

// Gestion du scroll
document.addEventListener('wheel', (e) => {
    if (!isExpanded) {
        e.preventDefault();
        if (e.deltaY > 0) {
            nextCard();
        } else if (e.deltaY < 0) {
            prevCard();
        }
    }
}, { passive: false });

// Créer l'overlay
const overlay = document.createElement('div');
overlay.className = 'carousel-overlay';
document.body.appendChild(overlay);

// Fonction pour ouvrir la carte agrandie
function expandCard(index) {
    const card = bankCards[index];
    
    // Ajouter la classe pour agrandir et retourner
    card.classList.add('expanding');
    overlay.classList.add('show');
    isExpanded = true;
}

// Fonction pour fermer la carte agrandie
function closeExpanded() {
    const expandedCard = document.querySelector('.bank-card.expanding');
    if (expandedCard) {
        expandedCard.classList.remove('expanding');
        expandedCard.classList.remove('flipped');
    }
    overlay.classList.remove('show');
    isExpanded = false;
}

// Event listeners sur les cartes
function attachCardListeners() {
    bankCards.forEach((card, index) => {
        // Retirer les anciens listeners pour éviter les doublons
        card.replaceWith(card.cloneNode(true));
    });
    
    // Re-sélectionner les cartes après clonage
    bankCards = document.querySelectorAll(`#${currentCategory}-track .bank-card`);
    
    bankCards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isExpanded) {
                // Si une carte est agrandie, la fermer
                closeExpanded();
            } else {
                // Sinon, agrandir cette carte
                expandCard(index);
            }
        });
    });
}

// Fermer en cliquant sur l'overlay
overlay.addEventListener('click', closeExpanded);

// Fermer avec Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeExpanded();
    if (e.key === 'ArrowUp') prevCard();
    if (e.key === 'ArrowDown') nextCard();
});

// Gestion de la navigation des catégories
const categoryBtns = document.querySelectorAll('.category-btn');
const categorySections = document.querySelectorAll('.category-section');

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        
        // Mise à jour des boutons
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Mise à jour des sections
        categorySections.forEach(section => section.classList.remove('active'));
        document.getElementById(category).classList.add('active');
        
        // Mise à jour du carrousel
        currentCategory = category;
        currentIndex = 0;
        carouselTrack = document.querySelector(`#${category}-track`);
        bankCards = document.querySelectorAll(`#${category}-track .bank-card`);
        
        // Réattacher les listeners
        attachCardListeners();
        updateCarousel();
    });
});

// Fonction pour faire suivre les yeux à la souris
function initEyeTracking() {
    const eyes = document.querySelectorAll('.eye');
    
    document.addEventListener('mousemove', (e) => {
        eyes.forEach(eye => {
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            // Calculer l'angle vers la souris
            const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
            
            // Distance maximale de déplacement de la pupille
            const maxMove = 15;
            const moveX = Math.cos(angle) * maxMove;
            const moveY = Math.sin(angle) * maxMove;
            
            // Appliquer le mouvement aux pseudo-éléments via CSS custom properties
            eye.style.setProperty('--pupil-x', `${moveX}px`);
            eye.style.setProperty('--pupil-y', `${moveY}px`);
        });
    });
}

// Initialiser le suivi des yeux
initEyeTracking();

// Initialiser
attachCardListeners();
updateCarousel();