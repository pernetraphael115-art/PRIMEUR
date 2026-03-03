// --- Configuration ---
const products = [
    {
        id: 1,
        name: "Tomates Grappes Bio",
        category: "legumes",
        price: 3.50,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Pommes Gala",
        category: "fruits",
        price: 2.90,
        unit: "kg",
        image: "images/pommes_gala.png"
    },
    {
        id: 3,
        name: "Carottes Sables",
        category: "legumes",
        price: 1.80,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Fraises Gariguette",
        category: "fruits",
        price: 4.50,
        unit: "barquette (250g)",
        image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Panier de Saison Familial",
        category: "paniers",
        price: 25.00,
        unit: "unité",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Avocats Hass (x3)",
        category: "fruits",
        price: 3.90,
        unit: "filet",
        image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Courgettes Vertes",
        category: "legumes",
        price: 2.20,
        unit: "kg",
        image: "images/courgettes.png"
    },
    {
        id: 8,
        name: "Panier Duo Fruits & Légumes",
        category: "paniers",
        price: 15.00,
        unit: "unité",
        image: "images/panier_duo.png"
    },
    {
        id: 9,
        name: "Comté AOP (Affiné 18 mois)",
        category: "fromages",
        price: 28.50,
        unit: "kg",
        image: "images/fromage_comte.png"
    },
    {
        id: 10,
        name: "Camembert de Normandie",
        category: "fromages",
        price: 6.50,
        unit: "la pièce",
        image: "images/fromage_camembert.png"
    }
];

const heroImages = [
    "images/hero_1.png",
    "images/hero_2.png",
    "images/hero_3.png"
];

// --- State ---
let cart = JSON.parse(localStorage.getItem('primeur_cart')) || [];

// --- DOM Elements ---
const nav = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileLinks = document.querySelectorAll('.mobile-link');

const productsContainer = document.getElementById('products-container');
const filterBtns = document.querySelectorAll('.filter-btn');

const cartCount = document.getElementById('cart-count');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartEmptyState = document.getElementById('cart-empty-state');
const cartFooter = document.getElementById('cart-footer');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');
const startShoppingBtn = document.getElementById('start-shopping-btn');

const checkoutModal = document.getElementById('checkout-modal');
const checkoutSummaryItems = document.getElementById('checkout-summary-items');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryTotal = document.getElementById('summary-total');
const checkoutFinalTotal = document.getElementById('checkout-final-total');
const checkoutForm = document.getElementById('checkout-form');

const successModal = document.getElementById('success-modal');
const orderNumberText = document.getElementById('order-number');

const toastContainer = document.getElementById('toast-container');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initKenBurns();
    renderProducts(products);
    updateCartUI();
    setupEventListeners();

    // Set min date for pickup input to today
    const dateInput = document.getElementById('ch-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// --- Ken Burns Effect ---
function initKenBurns() {
    const slideshow = document.getElementById('hero-slideshow');
    if (!slideshow) return;

    // Create image elements
    heroImages.forEach((src, index) => {
        const div = document.createElement('div');
        div.className = `slide kb-${(index % 3) + 1}`;
        div.style.backgroundImage = `url('${src}')`;
        if (index === 0) div.classList.add('active');
        slideshow.appendChild(div);
    });

    const slides = slideshow.querySelectorAll('.slide');
    if (slides.length <= 1) return;

    let currentSlide = 0;

    // Switch slides every 8 seconds
    setInterval(() => {
        slides[currentSlide].classList.remove('active');

        // Cycle the animation class to restart it when it comes back
        const oldClass = `kb-${(currentSlide % 3) + 1}`;
        slides[currentSlide].classList.remove(oldClass);
        // Force reflow
        void slides[currentSlide].offsetWidth;
        slides[currentSlide].classList.add(oldClass);

        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 8000);
}

// --- Scrolling ---
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Mobile Menu
    menuToggle.addEventListener('click', () => mobileMenu.classList.add('active'));
    closeMenuBtn.addEventListener('click', () => mobileMenu.classList.remove('active'));
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            if (link.id === 'open-contact-mobile-btn') {
                openModal('contact-modal');
            }
        });
    });

    // Product Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.getAttribute('data-filter');

            if (filter === 'all') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === filter);
                renderProducts(filtered);
            }
        });
    });

    // Modal Triggers
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            closeModal(modalId);
        });
    });

    document.getElementById('open-contact-btn').addEventListener('click', () => openModal('contact-modal'));

    // Contact Form Prevent Default
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal('contact-modal');
        showToast('Message envoyé !', 'Nous vous répondrons dans les plus brefs délais.');
        e.target.reset();
    });

    // Cart Events
    openCartBtn.addEventListener('click', () => cartModal.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));
    startShoppingBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
        document.getElementById('produits').scrollIntoView({ behavior: 'smooth' });
    });

    proceedCheckoutBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
        renderCheckoutSummary();
        openModal('checkout-modal');
    });

    // Close Modals on Overlay Click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
    });

    // Payment Method Toggle
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardForm = document.getElementById('card-payment-form');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'card') {
                cardForm.style.display = 'block';
                // Add required attributes back
                document.getElementById('cc-num').setAttribute('required', 'true');
                document.getElementById('cc-exp').setAttribute('required', 'true');
                document.getElementById('cc-cvc').setAttribute('required', 'true');
            } else {
                cardForm.style.display = 'none';
                // Remove required attributes
                document.getElementById('cc-num').removeAttribute('required');
                document.getElementById('cc-exp').removeAttribute('required');
                document.getElementById('cc-cvc').removeAttribute('required');
            }
        });
    });

    // Format Card Inputs simple simulation
    document.getElementById('cc-num')?.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = value;
    });
    document.getElementById('cc-exp')?.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });

    // Checkout Form Submit
    checkoutForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Generate pseudo order number
        const num = Math.floor(100000 + Math.random() * 900000);
        orderNumberText.textContent = `#${num}`;

        closeModal('checkout-modal');

        // Clear Cart
        cart = [];
        saveCart();
        updateCartUI();

        openModal('success-modal');
    });
}

// --- Product Rendering ---
function renderProducts(items) {
    if (!productsContainer) return;

    productsContainer.innerHTML = '';

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrap">
                <span class="product-badge">${product.category === 'paniers' ? 'Local' : 'Saison'}</span>
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)} <span>/ ${product.unit}</span></div>
                
                <div class="product-actions">
                    <div class="qty-ctrl">
                        <button class="qty-btn" onclick="updateInlineQty(${product.id}, -1)">-</button>
                        <input type="text" class="qty-input" id="qty-${product.id}" value="1" readonly>
                        <button class="qty-btn" onclick="updateInlineQty(${product.id}, 1)">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-cart-plus"></i> Ajouter
                    </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(card);
    });
}

function getCategoryName(key) {
    const map = {
        'fruits': 'Fruits',
        'legumes': 'Légumes',
        'paniers': 'Paniers',
        'fromages': 'Fromages'
    };
    return map[key] || key;
}

window.updateInlineQty = (id, change) => {
    const input = document.getElementById(`qty-${id}`);
    let val = parseInt(input.value) + change;
    if (val < 1) val = 1;
    if (val > 20) val = 20;
    input.value = val;
};

// --- Cart Logic ---
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const input = document.getElementById(`qty-${id}`);
    const qty = parseInt(input.value);

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ ...product, qty: qty });
    }

    // Reset input
    input.value = 1;

    saveCart();
    updateCartUI();

    // Visual feedback
    showToast('Ajouté au panier', `${qty}x ${product.name}`);
};

window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
};

window.updateCartQty = (id, change) => {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartUI();
        }
    }
};

function saveCart() {
    localStorage.setItem('primeur_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Total count in Navbar
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;

    // Toggle Empty State
    if (cart.length === 0) {
        cartEmptyState.style.display = 'flex';
        cartItemsContainer.style.display = 'none';
        cartFooter.style.display = 'none';
    } else {
        cartEmptyState.style.display = 'none';
        cartItemsContainer.style.display = 'flex';
        cartFooter.style.display = 'block';

        renderCartItems();
    }

    calculateTotals();
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div>
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">${formatPrice(item.price)} / ${item.unit}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="qty-ctrl" style="height: 30px;">
                        <button class="qty-btn" style="width: 30px; height: 30px;" onclick="updateCartQty(${item.id}, -1)">-</button>
                        <input type="text" class="qty-input" style="width: 25px; height: 30px;" value="${item.qty}" readonly>
                        <button class="qty-btn" style="width: 30px; height: 30px;" onclick="updateCartQty(${item.id}, 1)">+</button>
                    </div>
                    <div class="cart-item-total">${formatPrice(itemTotal)}</div>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})" aria-label="Supprimer"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });
}

function calculateTotals() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const formatted = formatPrice(total);

    if (cartSubtotal) cartSubtotal.textContent = formatted;
    if (cartTotal) cartTotal.textContent = formatted;
}

// --- Checkout Context ---
function renderCheckoutSummary() {
    if (!checkoutSummaryItems) return;
    checkoutSummaryItems.innerHTML = '';

    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `
            <span class="summary-item-name">${item.qty}x ${item.name}</span>
            <span class="summary-item-price">${formatPrice(item.price * item.qty)}</span>
        `;
        checkoutSummaryItems.appendChild(div);
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const formatted = formatPrice(total);

    summarySubtotal.textContent = formatted;
    summaryTotal.textContent = formatted;
    checkoutFinalTotal.textContent = formatted;
}

// --- UTILS ---
function formatPrice(num) {
    return num.toFixed(2).replace('.', ',') + ' €';
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

function showToast(title, message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid fa-circle-check"></i></div>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
