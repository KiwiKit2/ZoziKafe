// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Language Switching
document.addEventListener('DOMContentLoaded', function() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('language') || 'bg';
    
    // Set initial language
    setLanguage(currentLang);
    
    // Load machines from admin panel
    loadMachines();
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            localStorage.setItem('language', lang);
            
            // Reload machines with new language
            loadMachines();
        });
    });
});

function setLanguage(lang) {
    const body = document.body;
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Update body class
    body.className = body.className.replace(/lang-\w+/g, '');
    if (lang === 'en') {
        body.classList.add('lang-en');
    }
    
    // Update active button
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update text content
    const elements = document.querySelectorAll('[data-bg], [data-en]');
    elements.forEach(element => {
        const langKey = lang === 'bg' ? 'data-bg' : 'data-en';
        const text = element.getAttribute(langKey);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-placeholder-bg], [data-placeholder-en]');
    placeholderElements.forEach(element => {
        const placeholderKey = lang === 'bg' ? 'data-placeholder-bg' : 'data-placeholder-en';
        const placeholder = element.getAttribute(placeholderKey);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });
    
    // Update select options
    const selectOptions = document.querySelectorAll('option[data-bg], option[data-en]');
    selectOptions.forEach(option => {
        const langKey = lang === 'bg' ? 'data-bg' : 'data-en';
        const text = option.getAttribute(langKey);
        if (text) {
            option.textContent = text;
        }
    });
    
    // Update HTML content (for elements with HTML like <br>)
    const htmlElements = document.querySelectorAll('[data-placeholder-bg*="<br>"], [data-placeholder-en*="<br>"]');
    htmlElements.forEach(element => {
        const langKey = lang === 'bg' ? 'data-bg' : 'data-en';
        const html = element.getAttribute(langKey);
        if (html) {
            element.innerHTML = html;
        }
    });
}

// Load machines from admin panel
function loadMachines() {
    const machines = JSON.parse(localStorage.getItem('zozikafe_machines_display') || '[]');
    const container = document.getElementById('machines-grid');
    const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'bg';
    
    if (machines.length === 0) {
        // Load default sample machines if none exist
        loadDefaultMachines();
        return;
    }
    
    container.innerHTML = machines.map(machine => {
        const [typeBg, typeEn] = machine.type.split('|');
        const displayType = currentLang === 'en' ? (typeEn || typeBg) : typeBg;
        
        const features = machine.features.map(feature => {
            const [bg, en] = feature.split('|');
            const displayFeature = currentLang === 'en' ? (en || bg) : bg;
            return `<li>${displayFeature}</li>`;
        }).join('');
        
        const statusText = machine.status === 'available' 
            ? (currentLang === 'en' ? 'Available' : 'Наличен')
            : (currentLang === 'en' ? 'Recently Sold' : 'Наскоро продаден');
            
        const buttonText = machine.status === 'available'
            ? (currentLang === 'en' ? 'Learn More' : 'Научете повече')
            : (currentLang === 'en' ? 'Sold' : 'Продаден');
        
        const imageContent = machine.image 
            ? `<img src="${machine.image}" alt="${machine.name}" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<i class="fas fa-coffee"></i>`;
        
        return `
            <div class="machine-card">
                <div class="machine-image">
                    ${imageContent}
                    <div class="machine-status ${machine.status}">${statusText}</div>
                </div>
                <div class="machine-info">
                    <h3>${machine.name}</h3>
                    <p class="machine-type">${displayType}</p>
                    ${machine.description ? `<p class="machine-description" style="color: #6b5b47; font-size: 0.9rem; margin-bottom: 1rem;">${machine.description}</p>` : ''}
                    <ul class="machine-features">
                        ${features}
                    </ul>
                    <button class="btn btn-outline" ${machine.status === 'sold' ? 'disabled' : ''}>${buttonText}</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Re-bind machine card events
    bindMachineCardEvents();
}

function loadDefaultMachines() {
    // Default sample machines if admin hasn't added any yet
    const defaultMachines = [
        {
            id: 1,
            name: 'La Marzocco Linea Mini',
            type: 'Домашна еспресо машина|Home Espresso Machine',
            description: '',
            features: [
                'Двоен бойлер система|Dual Boiler System',
                'PID контрол на температурата|PID Temperature Control',
                'Професионална парна дюза|Professional Steam Wand'
            ],
            status: 'available',
            image: ''
        },
        {
            id: 2,
            name: 'Nuova Simonelli Aurelia II',
            type: 'Търговска еспресо машина|Commercial Espresso Machine',
            description: '',
            features: [
                '2-групова търговска класа|2-Group Commercial Grade',
                'Волуметрично програмиране|Volumetric Programming',
                'Автоматично почистване с пара|Auto Steam Cleaning'
            ],
            status: 'available',
            image: ''
        },
        {
            id: 3,
            name: 'Rancilio Silvia Pro X',
            type: 'Полупрофесионална еспресо машина|Prosumer Espresso Machine',
            description: '',
            features: [
                'Двоен бойлер|Dual Boiler',
                'LCD дисплей|LCD Display',
                'Търговски компоненти|Commercial Components'
            ],
            status: 'sold',
            image: ''
        }
    ];
    
    localStorage.setItem('zozikafe_machines_display', JSON.stringify(defaultMachines));
    loadMachines();
}

function bindMachineCardEvents() {
    // Re-bind machine card interactions
    document.querySelectorAll('.machine-card').forEach(card => {
        const button = card.querySelector('.btn');
        const isAvailable = !button.disabled;

        if (isAvailable) {
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking the button directly
                if (e.target === button) return;

                // Scroll to contact section
                document.querySelector('#contact').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Pre-fill the inquiry type if possible
                const machineTitle = card.querySelector('h3').textContent;
                const inquirySelect = document.querySelector('#inquiry-type');
                const messageTextarea = document.querySelector('#message');

                // Set appropriate inquiry type
                if (machineTitle.toLowerCase().includes('commercial') || machineTitle.toLowerCase().includes('търговска')) {
                    inquirySelect.value = 'commercial';
                } else {
                    inquirySelect.value = 'home';
                }

                // Pre-fill message
                const isEnglish = document.body.classList.contains('lang-en');
                const messageText = isEnglish 
                    ? `Hi! I'm interested in the ${machineTitle}. Could you please provide more details?`
                    : `Здравейте! Интересувам се от ${machineTitle}. Можете ли да предоставите повече подробности?`;
                messageTextarea.value = messageText;

                // Show notification
                showNotification('Contact form has been prepared with your machine inquiry!', 'info');
            });

            // Add hover effect
            card.style.cursor = 'pointer';
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Contact form handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const inquiryType = formData.get('inquiry-type');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Simulate form submission (replace with actual form handling)
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    this.reset();
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Get current language
    const isEnglish = document.body.classList.contains('lang-en');
    
    // Translate success message
    let translatedMessage = message;
    if (message.includes('Thank you for your message')) {
        translatedMessage = isEnglish ? 'Thank you for your message! We\'ll get back to you soon.' : 'Благодарим ви за съобщението! Ще се свържем с вас скоро.';
    } else if (message.includes('Please fill in all required fields')) {
        translatedMessage = isEnglish ? 'Please fill in all required fields.' : 'Моля, попълнете всички задължителни полета.';
    } else if (message.includes('Please enter a valid email')) {
        translatedMessage = isEnglish ? 'Please enter a valid email address.' : 'Моля, въведете валиден имейл адрес.';
    } else if (message.includes('Contact form has been prepared')) {
        translatedMessage = isEnglish ? 'Contact form has been prepared with your machine inquiry!' : 'Формата за контакт е подготвена с вашето запитване за машината!';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${translatedMessage}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;

    // Set notification colors based on type
    const colors = {
        success: { bg: '#22c55e', text: 'white' },
        error: { bg: '#ef4444', text: 'white' },
        info: { bg: '#3b82f6', text: 'white' }
    };

    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;

    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        }
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            margin: 0;
            line-height: 1;
        }
        .notification-close:hover {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Machine card interactions - handled by bindMachineCardEvents() function

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .machine-card, .about-content, .contact-content');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
});

// Add loading states for better UX
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    body:not(.loaded) .hero-content,
    body:not(.loaded) .hero-image {
        opacity: 0;
        transform: translateY(30px);
    }
    
    body.loaded .hero-content,
    body.loaded .hero-image {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    
    body.loaded .hero-image {
        transition-delay: 0.2s;
    }
`;
document.head.appendChild(loadingStyles);

// Enhanced mobile menu animation
const hamburgerStyles = document.createElement('style');
hamburgerStyles.textContent = `
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
`;
document.head.appendChild(hamburgerStyles);

// Add scroll-to-top functionality
const scrollToTopButton = document.createElement('button');
scrollToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollToTopButton.className = 'scroll-to-top';
scrollToTopButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b4513, #a0522d);
    border: none;
    color: white;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 1000;
    font-size: 18px;
`;

document.body.appendChild(scrollToTopButton);

// Show/hide scroll-to-top button
window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
        scrollToTopButton.style.opacity = '1';
        scrollToTopButton.style.transform = 'translateY(0)';
    } else {
        scrollToTopButton.style.opacity = '0';
        scrollToTopButton.style.transform = 'translateY(20px)';
    }
});

// Scroll to top functionality
scrollToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to scroll-to-top button
scrollToTopButton.addEventListener('mouseenter', function() {
    this.style.transform = window.scrollY > 500 ? 'translateY(-5px)' : 'translateY(15px)';
});

scrollToTopButton.addEventListener('mouseleave', function() {
    this.style.transform = window.scrollY > 500 ? 'translateY(0)' : 'translateY(20px)';
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Simple admin access
function checkAdminAccess() {
    const password = prompt('Въведете паролата за административен достъп:');
    if (password === 'zozikafe2025') {
        window.location.href = 'admin.html';
    } else if (password !== null) {
        alert('Грешна парола!');
    }
}