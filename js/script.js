// Main JavaScript functionality for the petroleum products website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLanguageSwitcher();
    initSmoothScrolling();
    initAnimations();
    initMobileMenu();
    initProductFilters();
    initContactForm();
    initSearchFunctionality();
    
    // Backup language switcher in case main one fails
    setTimeout(() => {
        const buttons = document.querySelectorAll('.lang-btn');
        if (buttons.length > 0) {
            buttons.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const lang = this.getAttribute('data-lang');
                    console.log('Backup switcher activated for:', lang);
                    
                    // Simple fallback switching
                    document.querySelectorAll('[data-lang]').forEach(el => {
                        if (el.getAttribute('data-lang') === lang) {
                            el.style.display = '';
                        } else {
                            el.style.display = 'none';
                        }
                    });
                    
                    // Update active button
                    buttons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Store preference
                    localStorage.setItem('selectedLanguage', lang);
                    document.documentElement.setAttribute('lang', lang);
                });
            });
        }
    }, 500);
});

// Language Switcher
function initLanguageSwitcher() {
    console.log('Initializing language switcher...');
    const langButtons = document.querySelectorAll('.lang-btn');
    console.log('Found buttons:', langButtons.length);
    
    function switchLanguage(targetLang) {
        console.log('Switching to language:', targetLang);
        const elements = document.querySelectorAll('[data-lang]:not(.lang-btn)');
        console.log('Found elements to switch:', elements.length);
        
        // Update active button
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === targetLang) {
                btn.classList.add('active');
            }
        });
        
        // Show/hide language elements
        elements.forEach(element => {
            const elementLang = element.getAttribute('data-lang');
            if (elementLang === targetLang) {
                element.style.display = '';
                element.style.visibility = 'visible';
                element.style.opacity = '1';
            } else {
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.opacity = '0';
            }
        });
        
        // Store language preference
        localStorage.setItem('selectedLanguage', targetLang);
        
        // Update <html lang="...">
        document.documentElement.setAttribute('lang', targetLang);
        
        // Update title and meta description
        const title = document.querySelector('title[data-lang="' + targetLang + '"]');
        const description = document.querySelector('meta[name="description"][data-lang="' + targetLang + '"]');
        
        if (title) {
            document.title = title.textContent;
        }
        
        if (description) {
            description.setAttribute('content', description.getAttribute('content'));
        }
        
        console.log('Language switched to:', targetLang);
    }
    
    // Add click event listeners
    langButtons.forEach(button => {
        console.log('Adding listener to button:', button);
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedLang = this.getAttribute('data-lang');
            console.log('Button clicked, language:', selectedLang);
            switchLanguage(selectedLang);
        });
    });
    
    // Load saved language preference or default to Russian
    const savedLang = localStorage.getItem('selectedLanguage') || 'ru';
    console.log('Loading saved language:', savedLang);
    setTimeout(() => {
        switchLanguage(savedLang);
    }, 100);
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Scroll Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.product-card, .advantage-item, .section-header');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Header background on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (mobileToggle.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navMenu && mobileToggle) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    }
}

// Product Filters
function initProductFilters() {
    const filterButtons = document.querySelectorAll('[data-category]');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.classList.add('animate-fade-in-up');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            
            // Show loading state
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showNotification('Сообщение отправлено успешно!', 'success');
                contactForm.reset();
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

// Search Functionality
function initSearchFunctionality() {
    const searchInput = document.querySelector('#search-input');
    const searchResults = document.querySelector('#search-results');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length < 2) {
                hideSearchResults();
                return;
            }
            
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                hideSearchResults();
            }
        });
    }
}

function performSearch(query) {
    // Mock search results (replace with actual search implementation)
    const mockResults = [
        { title: 'Полипропилен PP', category: 'polymers', url: '#polymers' },
        { title: 'Полиэтилен PE', category: 'polymers', url: '#polymers' },
        { title: 'Бензин с MTBE', category: 'petroleum', url: '#petroleum' },
        { title: 'Дизельное топливо', category: 'petroleum', url: '#petroleum' },
        { title: 'Hostacom', category: 'polymers', url: '#polymers' }
    ];
    
    const results = mockResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const searchResults = document.querySelector('#search-results');
    
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">Ничего не найдено</div>';
    } else {
        const resultsHTML = results.map(result => `
            <div class="search-result-item" onclick="window.location.href='${result.url}'">
                <h4>${result.title}</h4>
                <span class="search-category">${result.category}</span>
            </div>
        `).join('');
        
        searchResults.innerHTML = resultsHTML;
    }
    
    searchResults.style.display = 'block';
}

function hideSearchResults() {
    const searchResults = document.querySelector('#search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance Optimization
function optimizePerformance() {
    // Throttle scroll events
    const throttledScroll = throttle(() => {
        // Handle scroll events
    }, 16);
    
    window.addEventListener('scroll', throttledScroll);
    
    // Preload critical resources
    const criticalResources = [
        'css/styles.css',
        'js/script.js'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can send error reports to your analytics service here
});

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    optimizePerformance();
});

// Export functions for global access if needed
window.PetroleumWebsite = {
    showNotification,
    performSearch,
    hideSearchResults
};
