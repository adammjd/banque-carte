// Carousel functionality
const cards = document.querySelectorAll('.bank-card');
const navDots = document.querySelectorAll('.nav-dot');
const cardItems = document.querySelectorAll('.card-item');
let currentIndex = 0;

// Set initial card as active
if (cards.length > 0) {
    cards[0].classList.add('active');
}

// Update carousel
function updateCarousel() {
    cards.forEach((card, index) => {
        card.classList.remove('active');
    });
    navDots.forEach((dot, index) => {
        dot.classList.remove('active');
    });
    
    cards[currentIndex].classList.add('active');
    navDots[currentIndex].classList.add('active');
}

// Navigation dots
navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    } else if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    }
});

// Swipe functionality for mobile
let startX = 0;
let endX = 0;

document.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].screenX;
    if (startX - endX > 50) {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    } else if (endX - startX > 50) {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    }
});

// Card items interaction
cardItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        cardItems.forEach(i => i.classList.remove('active-card'));
        item.classList.add('active-card');
        currentIndex = index;
        updateCarousel();
    });
});

// Bottom nav interaction
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Initially set first nav item as active
if (navItems.length > 0) {
    navItems[0].classList.add('active');
}
