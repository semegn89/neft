// Contacts page specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initQuoteForm();
    initFAQ();
    initContactMethods();
    initFormValidation();
    initAnimations();
});

// Quote Form Handling
function initQuoteForm() {
    const form = document.querySelector('#quote-form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm() {
    const form = document.querySelector('#quote-form');
    let isValid = true;
    
    // Required fields
    const requiredFields = [
        'company-name',
        'contact-person',
        'email',
        'phone',
        'country',
        'privacy'
    ];
    
    requiredFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Products selection validation
    const productCheckboxes = form.querySelectorAll('input[name="products"]');
    const productsChecked = Array.from(productCheckboxes).some(cb => cb.checked);
    
    if (!productsChecked) {
        showFieldError('products-error', 'Пожалуйста, выберите хотя бы один тип продукции');
        isValid = false;
    } else {
        clearFieldError('products-error');
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(fieldName + '-error', getFieldRequiredMessage(fieldName));
        return false;
    }
    
    // Specific field validations
    switch (fieldName) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(fieldName + '-error', 'Введите корректный email адрес');
                return false;
            }
            break;
            
        case 'phone':
            if (value && !isValidPhone(value)) {
                showFieldError(fieldName + '-error', 'Введите корректный номер телефона');
                return false;
            }
            break;
            
        case 'privacy':
            if (!field.checked) {
                showFieldError(fieldName + '-error', 'Необходимо согласие на обработку данных');
                return false;
            }
            break;
    }
    
    return true;
}

function showFieldError(errorId, message) {
    const errorElement = document.querySelector(`#${errorId}`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        const field = errorElement.closest('.form-group');
        if (field) {
            field.classList.add('error');
        }
    }
}

function clearFieldError(field) {
    const fieldName = field.name;
    const errorElement = document.querySelector(`#${fieldName}-error`);
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
    
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('error');
    }
}

function getFieldRequiredMessage(fieldName) {
    const messages = {
        'company-name': 'Введите название компании',
        'contact-person': 'Введите контактное лицо',
        'email': 'Введите email адрес',
        'phone': 'Введите номер телефона',
        'country': 'Выберите страну',
        'privacy': 'Необходимо согласие на обработку данных'
    };
    
    return messages[fieldName] || 'Поле обязательно для заполнения';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function submitForm() {
    const form = document.querySelector('#quote-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Process form data
        const data = {
            companyName: formData.get('company-name'),
            contactPerson: formData.get('contact-person'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            country: formData.get('country'),
            industry: formData.get('industry'),
            products: formData.getAll('products'),
            volume: formData.get('volume'),
            message: formData.get('message'),
            newsletter: formData.has('newsletter'),
            timestamp: new Date().toISOString()
        };
        
        console.log('Form data:', data);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Reset button state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        
        // Track successful submission
        trackFormSubmission(data);
        
    }, 2000);
}

function showSuccessMessage() {
    const formContainer = document.querySelector('.form-container');
    
    // Remove existing success message
    const existingSuccess = formContainer.querySelector('.form-success');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success show';
    successMessage.innerHTML = `
        <div class="form-success-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>Запрос успешно отправлен!</h4>
                <p>Мы свяжемся с вами в течение 24 часов для обсуждения деталей.</p>
            </div>
        </div>
    `;
    
    formContainer.insertBefore(successMessage, formContainer.firstChild);
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto hide after 10 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.remove();
            }
        }, 300);
    }, 10000);
}

function trackFormSubmission(data) {
    // Analytics tracking (implement with your analytics service)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'event_category': 'engagement',
            'event_label': 'quote_request',
            'value': 1
        });
    }
    
    // You can also send data to your backend for processing
    // fetch('/api/quote-request', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data)
    // });
}

// FAQ Functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Contact Methods
function initContactMethods() {
    const chatBtn = document.querySelector('.chat-btn');
    const videoBtn = document.querySelector('.video-btn');
    const meetingBtn = document.querySelector('.meeting-btn');
    const mapBtn = document.querySelector('.map-btn');
    
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            showNotification('Функция онлайн-чата будет доступна в ближайшее время', 'info');
        });
    }
    
    if (videoBtn) {
        videoBtn.addEventListener('click', function() {
            showNotification('Для записи на видеозвонок заполните форму выше', 'info');
            document.querySelector('#quote').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (meetingBtn) {
        meetingBtn.addEventListener('click', function() {
            showNotification('Для записи на встречу заполните форму выше', 'info');
            document.querySelector('#quote').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (mapBtn) {
        mapBtn.addEventListener('click', function() {
            // Open Google Maps with company location
            const address = 'Москва, ул. Примерная, 123';
            const encodedAddress = encodeURIComponent(address);
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
        });
    }
}

// Form Validation Enhancement
function initFormValidation() {
    // Phone number formatting
    const phoneInput = document.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.startsWith('7')) {
                    value = value.replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
                } else if (value.startsWith('8')) {
                    value = value.replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($2) $3-$4-$5');
                } else {
                    value = value.replace(/(\d{1,3})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, (match, p1, p2, p3, p4, p5) => {
                        let formatted = p1;
                        if (p2) formatted += ` (${p2}`;
                        if (p3) formatted += `) ${p3}`;
                        if (p4) formatted += `-${p4}`;
                        if (p5) formatted += `-${p5}`;
                        return formatted;
                    });
                }
            }
            this.value = value;
        });
    }
    
    // Country selection enhancement
    const countrySelect = document.querySelector('#country');
    if (countrySelect) {
        countrySelect.addEventListener('change', function() {
            const selectedCountry = this.value;
            // You can add country-specific logic here
            console.log('Selected country:', selectedCountry);
        });
    }
}

// Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in-up');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.contact-card, .method-card, .faq-item, .form-container'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
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

// Utility functions
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

// Export functions for global access
window.ContactsPage = {
    validateForm,
    submitForm,
    showNotification,
    hideNotification
};
