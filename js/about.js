// About page specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initCertificateModal();
    initAnimations();
    initStatistics();
    initMapPlaceholder();
});

// Certificate Modal
function initCertificateModal() {
    const certificateItems = document.querySelectorAll('.certificate-item');
    const modal = document.querySelector('#certificate-modal');
    const modalTitle = document.querySelector('#certificate-title');
    const certificateImage = document.querySelector('#certificate-image');
    const certificateName = document.querySelector('#certificate-name');
    const certificateDescription = document.querySelector('#certificate-description');
    const certificateValidity = document.querySelector('#certificate-validity');
    const modalClose = document.querySelector('.modal-close');
    
    if (!modal) return;
    
    certificateItems.forEach(item => {
        const viewButton = item.querySelector('.certificate-view');
        
        viewButton.addEventListener('click', function() {
            const img = item.querySelector('.certificate-image img');
            const info = item.querySelector('.certificate-info');
            
            // Set modal content
            modalTitle.textContent = info.querySelector('h4').textContent;
            certificateImage.src = img.src;
            certificateImage.alt = img.alt;
            certificateName.textContent = info.querySelector('h4').textContent;
            certificateDescription.textContent = info.querySelector('p').textContent;
            certificateValidity.textContent = info.querySelector('.certificate-date').textContent;
            
            // Show modal
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
        '.value-card, .certificate-item, .team-member, .region-item, .feature-item'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Special animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        observer.observe(stat);
    });
}

// Animated Statistics
function initStatistics() {
    // This will be triggered by the animation observer
}

function animateNumber(element) {
    const finalValue = element.textContent;
    const numericValue = parseInt(finalValue.replace(/\D/g, ''));
    const suffix = finalValue.replace(/[\d]/g, '');
    
    if (isNaN(numericValue)) return;
    
    let currentValue = 0;
    const increment = numericValue / 50; // 50 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue) + suffix;
    }, stepTime);
}

// Map Placeholder Enhancement
function initMapPlaceholder() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    
    if (mapPlaceholder) {
        // Add interactive elements to the map placeholder
        const interactiveElements = document.createElement('div');
        interactiveElements.className = 'map-interactive-elements';
        interactiveElements.innerHTML = `
            <div class="map-points">
                <div class="map-point" style="top: 20%; left: 30%;" data-region="europe">
                    <div class="point-dot"></div>
                    <div class="point-label">Европа</div>
                </div>
                <div class="map-point" style="top: 40%; left: 60%;" data-region="cis">
                    <div class="point-dot"></div>
                    <div class="point-label">СНГ</div>
                </div>
                <div class="map-point" style="top: 60%; left: 70%;" data-region="asia">
                    <div class="point-dot"></div>
                    <div class="point-label">Азия</div>
                </div>
            </div>
        `;
        
        mapPlaceholder.appendChild(interactiveElements);
        
        // Add hover effects to map points
        const mapPoints = interactiveElements.querySelectorAll('.map-point');
        mapPoints.forEach(point => {
            point.addEventListener('mouseenter', function() {
                this.classList.add('active');
            });
            
            point.addEventListener('mouseleave', function() {
                this.classList.remove('active');
            });
            
            point.addEventListener('click', function() {
                const region = this.getAttribute('data-region');
                showRegionInfo(region);
            });
        });
    }
}

function showRegionInfo(region) {
    const regionData = {
        'europe': {
            title: 'Европа',
            countries: 'Германия, Франция, Италия, Польша, Чехия',
            volume: '40% от общих поставок'
        },
        'cis': {
            title: 'СНГ',
            countries: 'Россия, Беларусь, Казахстан, Узбекистан',
            volume: '35% от общих поставок'
        },
        'asia': {
            title: 'Азия',
            countries: 'Китай, Турция, Индия',
            volume: '25% от общих поставок'
        }
    };
    
    const data = regionData[region];
    if (!data) return;
    
    // Create and show info tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'region-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <h4>${data.title}</h4>
            <p><strong>Страны:</strong> ${data.countries}</p>
            <p><strong>Объем:</strong> ${data.volume}</p>
        </div>
        <button class="tooltip-close">&times;</button>
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const mapPlaceholder = document.querySelector('.map-placeholder');
    const rect = mapPlaceholder.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.top = rect.top + 'px';
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.transform = 'translateX(-50%)';
    
    // Show tooltip
    setTimeout(() => {
        tooltip.classList.add('show');
    }, 100);
    
    // Close tooltip
    const closeBtn = tooltip.querySelector('.tooltip-close');
    closeBtn.addEventListener('click', () => {
        tooltip.classList.remove('show');
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.classList.remove('show');
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 300);
        }
    }, 5000);
}

// Team member interactions
function initTeamInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('click', function() {
            const name = this.querySelector('h4').textContent;
            const position = this.querySelector('.member-position').textContent;
            const experience = this.querySelector('.member-experience').textContent;
            
            showMemberModal(name, position, experience);
        });
    });
}

function showMemberModal(name, position, experience) {
    const modal = document.createElement('div');
    modal.className = 'modal team-member-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${name}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="member-details">
                    <h4>${position}</h4>
                    <p>${experience}</p>
                    <div class="member-achievements">
                        <h5>Достижения:</h5>
                        <ul>
                            <li>Многолетний опыт в отрасли</li>
                            <li>Успешная реализация крупных проектов</li>
                            <li>Экспертные знания в области нефтехимии</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }, 100);
    
    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        hideModal(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
        }
    });
}

// Enhanced scroll effects
function initScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.overview-image, .geography-map');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initTeamInteractions();
    initScrollEffects();
});

// Export functions for global access
window.AboutPage = {
    showRegionInfo,
    showMemberModal,
    animateNumber
};
