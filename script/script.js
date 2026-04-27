/* ===================== */
/* SMOOTH SCROLL */
/* ===================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ===================== */
/* SCROLL INDICATOR LOGIC */
/* ===================== */

const scrollDown = document.querySelector('.page-scroll-indicator');

if (scrollDown) {
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 200) {
            scrollDown.classList.add('hidden');
        } else {
            scrollDown.classList.remove('hidden');
        }
    });

    scrollDown.addEventListener('click', () => {
        const sections = document.querySelectorAll('section');
        const currentScroll = window.scrollY;

        for (let section of sections) {
            if (section.offsetTop > currentScroll + 100) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                break;
            }
        }
    });
}

/* ===================== */
/* NAVBAR ACTIVE STATE */
/* ===================== */

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

const observerOptions = {
    threshold: 0.5,
    rootMargin: '-50% 0px -50% 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            
            navLinks.forEach(link => link.classList.remove('active'));
            
            const activeLink = document.querySelector(`a[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

/* ===================== */
/* PAGE EDIT - PRODUCT CUSTOMIZATION SYSTEM */
/* ===================== */

const productImage = document.getElementById('productImage');
const previewText = document.getElementById('previewText');

// Mapping des images selon les combinaisons
const imageMap = {
    'yes-polyester': 'veste_tobiu.png',
    'yes-satin': 'veste_tobiu_satin.png',
    'yes-sherpa': 'veste_tobiu_sherpa.png',
    'no-polyester': 'veste_tobiu_sans_bonnet.png',
    'no-satin': 'veste_tobiu_sans_bonnet_satin.png',
    'no-sherpa': 'veste_tobiu_sans_bonnet_sherpa.png'
};

let currentState = {
    hood: 'yes',
    material: 'polyester',
    color: 'terracotta',
    size: 'm'
};

// Fonction pour changer l'image avec animation morphing fluide
function updateProductImage() {
    const key = `${currentState.hood}-${currentState.material}`;
    const newImage = imageMap[key];
    
    if (newImage && productImage.src !== `asset/images_produits/${newImage}`) {
        // Déclencher l'animation de sortie morphing
        productImage.classList.add('morphing');
        
        // Attendre que l'image soit invisible (0.25s = 50% de 0.5s)
        setTimeout(() => {
            // Changer l'image pendant qu'elle est invisible
            productImage.src = `asset/images_produits/${newImage}`;
            
            // Retirer l'animation de sortie et ajouter celle d'entrée
            productImage.classList.remove('morphing');
            productImage.classList.add('morphing-in');
            
            // Retirer la classe après l'animation
            setTimeout(() => {
                productImage.classList.remove('morphing-in');
            }, 500);
        }, 250);
    }
    
    updatePreviewText();
}

// Fonction pour mettre à jour le texte de preview
function updatePreviewText() {
    const hoodText = currentState.hood === 'yes' ? 'Oui' : 'Non';
    const materialText = currentState.material.charAt(0).toUpperCase() + currentState.material.slice(1);
    const colorText = currentState.color.charAt(0).toUpperCase() + currentState.color.slice(1);
    
    previewText.textContent = `Bonnet: ${hoodText} | Matière: ${materialText} | Couleur: ${colorText}`;
}

/* ===================== */
/* SIZE SELECTION */
/* ===================== */

const sizeButtons = document.querySelectorAll('.size-btn');

sizeButtons.forEach(button => {
    button.addEventListener('click', function() {
        sizeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        currentState.size = this.getAttribute('data-size');
        console.log('Taille sélectionnée:', currentState.size);
    });
});

/* ===================== */
/* HOOD SELECTION */
/* ===================== */

const hoodInputs = document.querySelectorAll('input[name="hood"]');

hoodInputs.forEach(input => {
    input.addEventListener('change', function() {
        currentState.hood = this.value;
        updateProductImage();
    });
});

/* ===================== */
/* MATERIAL SELECTION */
/* ===================== */

const materialInputs = document.querySelectorAll('input[name="material"]');

materialInputs.forEach(input => {
    input.addEventListener('change', function() {
        currentState.material = this.value;
        updateProductImage();
    });
});

/* ===================== */
/* COLOR SELECTION */
/* ===================== */

const colorCircles = document.querySelectorAll('.color-circle');

colorCircles.forEach(circle => {
    circle.addEventListener('click', function() {
        colorCircles.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        
        const color = this.getAttribute('data-color');
        currentState.color = color;
        
        // Appliquer un filtre de couleur à l'image
        if (color === 'beige') {
            productImage.style.filter = 'hue-rotate(20deg) saturate(0.9) drop-shadow(0 0 40px rgba(196, 87, 26, 0.25))';
        } else if (color === 'terracotta') {
            productImage.style.filter = 'hue-rotate(0deg) saturate(1) drop-shadow(0 0 40px rgba(196, 87, 26, 0.25))';
        } else if (color === 'cream') {
            productImage.style.filter = 'hue-rotate(-10deg) saturate(0.8) brightness(1.05) drop-shadow(0 0 40px rgba(196, 87, 26, 0.25))';
        }
        
        updatePreviewText();
        console.log('Couleur sélectionnée:', color);
    });
});

/* ===================== */
/* ORDER BUTTON */
/* ===================== */

const orderButton = document.querySelector('.order-button');

if (orderButton) {
    orderButton.addEventListener('click', function() {
        const order = {
            size: currentState.size,
            hood: currentState.hood === 'yes' ? 'Oui' : 'Non',
            material: currentState.material.charAt(0).toUpperCase() + currentState.material.slice(1),
            color: currentState.color.charAt(0).toUpperCase() + currentState.color.slice(1)
        };
        
        console.log('Commande finale:', order);
        
        // Animation de confirmation
        const originalText = this.textContent;
        this.textContent = '✓ Commande en cours...';
        this.style.pointerEvents = 'none';
        
        setTimeout(() => {
            alert(`✓ Commande confirmée!\n\nRésumé:\n• Taille: ${order.size.toUpperCase()}\n• Bonnet: ${order.hood}\n• Matière: ${order.material}\n• Couleur: ${order.color}`);
            this.textContent = originalText;
            this.style.pointerEvents = 'auto';
        }, 1200);
    });
}

/* ===================== */
/* PARALLAX EFFECT */
/* ===================== */

const productDisplay = document.querySelector('.product-display');

if (productDisplay) {
    document.addEventListener('mousemove', (e) => {
        const rect = productDisplay.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        productImage.style.transform = `translateX(${x * 10}px) translateY(${y * 10}px)`;
    });
    
    document.addEventListener('mouseleave', () => {
        productImage.style.transform = 'translateX(0) translateY(0)';
    });
}

console.log('Jiyou personnalisation page loaded successfully');
