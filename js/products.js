// Products page specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initProductFilters();
    initSearchFunctionality();
    initSpecificationModal();
    initProductAnimations();
    initQuoteButtons();
});

// Enhanced Product Filters
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products with animation
            filterProducts(category, productCards);
        });
    });
}

function filterProducts(category, productCards) {
    let visibleCount = 0;
    
    productCards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        const shouldShow = category === 'all' || cardCategory === category;
        
        if (shouldShow) {
            card.style.display = 'block';
            // Stagger animation for better visual effect
            setTimeout(() => {
                card.classList.add('fade-in');
                visibleCount++;
            }, index * 100);
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
    
    // Show message if no products found
    setTimeout(() => {
        if (visibleCount === 0) {
            showNoProductsMessage();
        } else {
            hideNoProductsMessage();
        }
    }, productCards.length * 100);
}

function showNoProductsMessage() {
    let message = document.querySelector('.no-products-message');
    if (!message) {
        message = document.createElement('div');
        message.className = 'no-products-message';
        message.innerHTML = `
            <div style="text-align: center; padding: var(--spacing-12); color: var(--text-light);">
                <i class="fas fa-search" style="font-size: var(--font-size-4xl); margin-bottom: var(--spacing-4);"></i>
                <h3>Продукты не найдены</h3>
                <p>Попробуйте изменить фильтр или поисковый запрос</p>
            </div>
        `;
        document.querySelector('.products-grid').appendChild(message);
    }
}

function hideNoProductsMessage() {
    const message = document.querySelector('.no-products-message');
    if (message) {
        message.remove();
    }
}

// Enhanced Search Functionality
function initSearchFunctionality() {
    const searchInputs = document.querySelectorAll('#search-input');
    const searchResults = document.querySelector('#search-results');
    
    searchInputs.forEach(searchInput => {
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length < 2) {
                hideSearchResults();
                return;
            }
            
            searchTimeout = setTimeout(() => {
                performProductSearch(query);
            }, 300);
        });
        
        // Handle search input focus
        searchInput.addEventListener('focus', function() {
            if (this.value.trim().length >= 2) {
                performProductSearch(this.value.trim());
            }
        });
    });
    
    // Hide search results when clicking outside
    document.addEventListener('click', function(e) {
        const searchBar = document.querySelector('.search-bar');
        if (searchBar && !searchBar.contains(e.target)) {
            hideSearchResults();
        }
    });
}

function performProductSearch(query) {
    const productCards = document.querySelectorAll('.product-card');
    const searchResults = document.querySelector('#search-results');
    
    if (!searchResults) return;
    
    const results = [];
    
    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.product-description').textContent.toLowerCase();
        const searchQuery = query.toLowerCase();
        
        if (title.includes(searchQuery) || description.includes(searchQuery)) {
            const category = card.getAttribute('data-category');
            results.push({
                title: card.querySelector('h3').textContent,
                category: category,
                element: card
            });
        }
    });
    
    displaySearchResults(results, searchResults);
}

function displaySearchResults(results, searchResults) {
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>Ничего не найдено</p>
            </div>
        `;
    } else {
        const resultsHTML = results.map(result => `
            <div class="search-result-item" onclick="scrollToProduct('${result.element.id || 'product-' + Math.random()}')">
                <h4>${result.title}</h4>
                <span class="search-category">${getCategoryName(result.category)}</span>
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

function getCategoryName(category) {
    const categoryNames = {
        'pp': 'Полипропилен',
        'pe': 'Полиэтилен',
        'branded': 'Брендовые материалы',
        'gasoline': 'Бензин',
        'diesel': 'Дизельное топливо',
        'chemicals': 'Химические продукты'
    };
    return categoryNames[category] || category;
}

function scrollToProduct(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (productCard) {
        productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        productCard.classList.add('highlight');
        setTimeout(() => {
            productCard.classList.remove('highlight');
        }, 2000);
    }
}

// Specification Modal
function initSpecificationModal() {
    const specButtons = document.querySelectorAll('.spec-toggle');
    const modal = document.querySelector('#spec-modal');
    const modalTitle = document.querySelector('#modal-title');
    const modalSpecs = document.querySelector('#modal-specs');
    const modalClose = document.querySelector('.modal-close');
    
    if (!modal) return;
    
    specButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('h3').textContent;
            const specs = productCard.querySelectorAll('.spec-item');
            
            // Set modal title
            modalTitle.textContent = `Спецификация: ${productTitle}`;
            
            // Build specifications HTML
            let specsHTML = '<div class="specifications-grid">';
            specs.forEach(spec => {
                const label = spec.querySelector('.spec-label').textContent;
                const value = spec.querySelector('.spec-value').textContent;
                specsHTML += `
                    <div class="spec-row">
                        <div class="spec-label-modal">${label}</div>
                        <div class="spec-value-modal">${value}</div>
                    </div>
                `;
            });
            specsHTML += '</div>';
            
            // Add additional specifications if available
            specsHTML += `
                <div class="additional-info">
                    <h4>Дополнительная информация</h4>
                    <ul>
                        <li>Все спецификации соответствуют международным стандартам</li>
                        <li>Доступны сертификаты качества</li>
                        <li>Возможна поставка в различных объемах</li>
                        <li>Техническая поддержка включена</li>
                    </ul>
                </div>
            `;
            
            modalSpecs.innerHTML = specsHTML;
            showModal(modal);
        });
    });
    
    // Close modal handlers
    modalClose.addEventListener('click', () => hideModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideModal(modal);
        }
    });
}

function showModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Product Animations
function initProductAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        observer.observe(card);
    });
}

// Quote Buttons
function initQuoteButtons() {
    const quoteButtons = document.querySelectorAll('a[href="#quote"]');
    
    quoteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Track quote request
            trackQuoteRequest();
            
            // Show success message
            showNotification('Перенаправляем на форму запроса коммерческого предложения...', 'info');
            
            // Redirect to contacts page after short delay
            setTimeout(() => {
                window.location.href = '../contacts.html#quote';
            }, 1500);
        });
    });
}

function trackQuoteRequest() {
    // Analytics tracking (implement with your analytics service)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'quote_request', {
            'event_category': 'engagement',
            'event_label': 'product_page'
        });
    }
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

// Enhanced notification system
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconMap = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'info': 'fas fa-info-circle',
        'warning': 'fas fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="${iconMap[type] || iconMap.info}"></i>
            </div>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide
    setTimeout(() => {
        hideNotification(notification);
    }, duration);
    
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

// Product comparison functionality (for future enhancement)
function initProductComparison() {
    const compareButtons = document.querySelectorAll('.compare-btn');
    const selectedProducts = new Set();
    
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            
            if (selectedProducts.has(productId)) {
                selectedProducts.delete(productId);
                this.classList.remove('active');
                this.textContent = 'Сравнить';
            } else {
                if (selectedProducts.size >= 3) {
                    showNotification('Можно сравнивать не более 3 продуктов одновременно', 'warning');
                    return;
                }
                
                selectedProducts.add(productId);
                this.classList.add('active');
                this.textContent = 'В сравнении';
            }
            
            updateComparisonButton();
        });
    });
    
    function updateComparisonButton() {
        let compareBtn = document.querySelector('.comparison-btn');
        if (!compareBtn) {
            compareBtn = document.createElement('button');
            compareBtn.className = 'comparison-btn btn btn-primary';
            compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i> Сравнить';
            document.querySelector('.filter-buttons').appendChild(compareBtn);
        }
        
        if (selectedProducts.size > 1) {
            compareBtn.style.display = 'inline-flex';
            compareBtn.innerHTML = `<i class="fas fa-balance-scale"></i> Сравнить (${selectedProducts.size})`;
        } else {
            compareBtn.style.display = 'none';
        }
    }
}

// Export functions for global access
window.ProductsPage = {
    filterProducts,
    performProductSearch,
    showNotification,
    hideNotification,
    trackQuoteRequest
};
