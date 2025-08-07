// ===== VARIABLES GLOBALES =====
let isMenuOpen = false;
let currentYear = new Date().getFullYear();

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Inicializar AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 100
        });
    }

    // Inicializar todas las funcionalidades
    initializeYear();
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeFormValidation();
    initializeScrollEffects();
    initializeCursor();
    initializeAnimations();
    initializeSkillBars();
    initializeParallax();
    initializeBackToTop();
    
    console.log('🚀 Portfolio de Jonathan Quinto inicializado correctamente');
}

// ===== ACTUALIZACIÓN DEL AÑO =====
function initializeYear() {
    const yearElements = document.querySelectorAll('#current-year, #year');
    yearElements.forEach(element => {
        if (element) {
            element.textContent = currentYear;
        }
    });
}

// ===== MENÚ MÓVIL MEJORADO =====
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', toggleMobileMenu);
        
        // Cerrar menú al hacer clic en un enlace
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    toggleMobileMenu();
                }
            });
        });

        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                toggleMobileMenu();
            }
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                toggleMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (menuToggle && navLinks) {
        isMenuOpen = !isMenuOpen;
        
        navLinks.classList.toggle('active', isMenuOpen);
        menuToggle.classList.toggle('active', isMenuOpen);
        body.classList.toggle('menu-open', isMenuOpen);

        // Cambiar icono del menú
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.className = isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
        }

        // Accesibilidad
        menuToggle.setAttribute('aria-expanded', isMenuOpen.toString());
        navLinks.setAttribute('aria-hidden', (!isMenuOpen).toString());
    }
}

// ===== SMOOTH SCROLLING MEJORADO =====
function initializeSmoothScrolling() {
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorar enlaces vacíos
            if (href === '#' || href === '#!') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Cerrar menú móvil si está abierto
                if (isMenuOpen) {
                    toggleMobileMenu();
                }

                // Actualizar navegación activa
                updateActiveNavigation(href);
            }
        });
    });
}

function updateActiveNavigation(activeHref) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeHref) {
            link.classList.add('active');
        }
    });
}

// ===== VALIDACIÓN DE FORMULARIO AVANZADA =====
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const formElements = {
        name: contactForm.querySelector('#name'),
        email: contactForm.querySelector('#email'),
        subject: contactForm.querySelector('#subject'),
        message: contactForm.querySelector('#message')
    };

    // Validación en tiempo real
    Object.keys(formElements).forEach(key => {
        const element = formElements[key];
        if (element) {
            element.addEventListener('blur', () => validateField(element, key));
            element.addEventListener('input', () => clearFieldError(element));
        }
    });

    // Envío del formulario
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(formElements);
    });
}

function validateField(element, fieldType) {
    const value = element.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Limpiar errores previos
    clearFieldError(element);

    switch (fieldType) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'El nombre solo puede contener letras y espacios';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un email válido';
            }
            break;

        case 'subject':
            if (value.length < 5) {
                isValid = false;
                errorMessage = 'El asunto debe tener al menos 5 caracteres';
            }
            break;

        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'El mensaje debe tener al menos 10 caracteres';
            } else if (value.length > 500) {
                isValid = false;
                errorMessage = 'El mensaje no puede exceder los 500 caracteres';
            }
            break;
    }

    if (!isValid) {
        showFieldError(element, errorMessage);
    }

    return isValid;
}

function showFieldError(element, message) {
    element.classList.add('error');
    
    // Remover mensaje de error existente
    const existingError = element.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Crear nuevo mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
    
    element.parentNode.appendChild(errorDiv);
}

function clearFieldError(element) {
    element.classList.remove('error', 'success');
    const errorMessage = element.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showFieldSuccess(element) {
    element.classList.remove('error');
    element.classList.add('success');
}

function handleFormSubmission(formElements) {
    let isFormValid = true;

    // Validar todos los campos
    Object.keys(formElements).forEach(key => {
        const element = formElements[key];
        if (element) {
            const isFieldValid = validateField(element, key);
            if (isFieldValid) {
                showFieldSuccess(element);
            }
            isFormValid = isFormValid && isFieldValid;
        }
    });

    if (isFormValid) {
        submitForm(formElements);
    } else {
        showNotification('Por favor corrige los errores en el formulario', 'error');
    }
}

function submitForm(formElements) {
    const submitButton = document.querySelector('.contact-form button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Mostrar estado de carga
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;

    // Simular envío (reemplazar con lógica real de envío)
    setTimeout(() => {
        // Aquí iría la lógica real de envío del formulario
        console.log('Formulario enviado:', {
            name: formElements.name.value,
            email: formElements.email.value,
            subject: formElements.subject.value,
            message: formElements.message.value
        });

        // Resetear formulario
        Object.values(formElements).forEach(element => {
            if (element) {
                element.value = '';
                clearFieldError(element);
            }
        });

        // Restaurar botón
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

        // Mostrar éxito
        showNotification('¡Mensaje enviado exitosamente! Te contactaré pronto.', 'success');

    }, 2000);
}

function showNotification(message, type = 'info') {
    // Remover notificación existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: ${colors[type]};
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border-left: 4px solid ${colors[type]};
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; padding: 0; margin-left: auto;">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    let ticking = false;

    function updateScrollEffects() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Header transparente
        updateHeaderAppearance(scrollY);
        
        // Navegación activa
        updateActiveNavigationOnScroll();
        
        // Parallax suave
        updateParallaxElements(scrollY);
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

function updateHeaderAppearance(scrollY) {
    const header = document.querySelector('.header');
    if (header) {
        if (scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
}

function updateActiveNavigationOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}


    // Efectos en elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .contact-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.2)';
            cursorFollower.style.background = 'rgba(102, 126, 234, 0.2)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.background = 'rgba(255, 255, 255, 0.1)';
        });
    });


// ===== ANIMACIONES AVANZADAS =====
function initializeAnimations() {
    // Animaciones de números contadores
    initializeCounters();
    
    // Animaciones de hover para tarjetas
    initializeCardAnimations();
    
    // Animaciones de texto typewriter
    initializeTypewriterEffect();
    
    // Animaciones de partículas
    initializeParticleEffects();
}

function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/[0-9]/g, '');
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 segundos
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, stepTime);
}

function initializeCardAnimations() {
    const cards = document.querySelectorAll('.project-card, .contact-card, .about-card, .hobby-card, .certification-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

function initializeTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        const speed = parseInt(element.dataset.typewriterSpeed) || 50;
        
        element.textContent = '';
        element.style.borderRight = '2px solid';
        element.style.animation = 'blink 1s infinite';
        
        let i = 0;
        const typewriter = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typewriter);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                }, 1000);
            }
        }, speed);
    });
}

function initializeParticleEffects() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    // Crear partículas adicionales dinámicamente
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particlesContainer.appendChild(particle);
    }
}

// ===== BARRAS DE HABILIDADES =====
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress, .language-progress');
    
    const skillObserverOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = width;
                    bar.style.transition = 'width 2s ease-in-out';
                }, 200);
                
                skillObserver.unobserve(bar);
            }
        });
    }, skillObserverOptions);
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// ===== EFECTOS PARALLAX =====
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * (parseFloat(element.dataset.parallax) || -0.5);
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

function updateParallaxElements(scrollY) {
    // Parallax para elementos flotantes
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px) rotate(${scrollY * 0.1}deg)`;
    });
    
    // Parallax para imagen de hero
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        const yPos = -(scrollY * 0.3);
        heroImage.style.transform = `translateY(${yPos}px)`;
    }
}

// ===== BOTÓN VOLVER ARRIBA =====
function initializeBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top, #backToTop, #backToTopCV');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.classList.remove('show');
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== LAZY LOADING DE IMÁGENES =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserverOptions = {
        threshold: 0.1,
        rootMargin: '50px 0px'
    };
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, imageObserverOptions);
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== GESTIÓN DE TEMAS =====
function initializeThemeToggle() {
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (!themeToggle) return;
    
    // Leer tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Animar transición
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

// ===== OPTIMIZACIÓN DE RENDIMIENTO =====
function optimizePerformance() {
    // Reducir animaciones en dispositivos de bajo rendimiento
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
    }
    
    // Desactivar animaciones si el usuario prefiere movimiento reducido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        
        // Desactivar cursor personalizado
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        if (cursor) cursor.style.display = 'none';
        if (cursorFollower) cursorFollower.style.display = 'none';
    }
}

// ===== FUNCIONES DE UTILIDAD =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', (e) => {
    console.error('Error en el portfolio:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promesa rechazada:', e.reason);
});

// ===== ANALYTICS Y TRACKING =====
function trackUserInteraction(action, element) {
    // Aquí se pueden agregar eventos de analytics
    console.log(`Acción: ${action}, Elemento: ${element}`);
}

// Event listeners para tracking
document.addEventListener('click', (e) => {
    if (e.target.matches('a, button, .btn')) {
        trackUserInteraction('click', e.target.textContent || e.target.className);
    }
});

// ===== FUNCIONES ESPECÍFICAS DEL CV =====
function initializeCVFeatures() {
    // Solo ejecutar en la página del CV
    if (!document.body.classList.contains('cv-body')) return;
    
    initializePrintStyles();
    initializeCVAnimations();
}

function initializePrintStyles() {
    // Optimizar para impresión
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', () => {
        document.body.classList.remove('printing');
    });
}

function initializeCVAnimations() {
    // Animaciones específicas del CV
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                
                // Animar el marcador
                const marker = entry.target.querySelector('.timeline-marker');
                if (marker) {
                    setTimeout(() => {
                        marker.classList.add('active');
                    }, 300);
                }
            }
        });
    }, {
        threshold: 0.3
    });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = 'all 0.6s ease';
        timelineObserver.observe(item);
    });
}

// ===== INICIALIZACIÓN ADICIONAL =====
document.addEventListener('DOMContentLoaded', () => {
    // Funciones adicionales que necesitan DOM cargado
    initializeLazyLoading();
    initializeThemeToggle();
    initializeCVFeatures();
    optimizePerformance();
    
    // Precargar imágenes importantes
    const criticalImages = [
        './images/profile.jpg',
        './images/project1.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// ===== SERVICE WORKER (OPCIONAL) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('SW registrado:', registration);
            })
            .catch(registrationError => {
                console.log('Error registro SW:', registrationError);
            });
    });
}

// ===== EXPORT PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        toggleMobileMenu,
        showNotification,
        trackUserInteraction
    };
}

// ===== CSS DINÁMICO =====
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { border-color: transparent; }
            51%, 100% { border-color: var(--primary); }
        }
        
        .menu-open {
            overflow: hidden;
        }
        
        .loaded {
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        
        .printing .header,
        .printing .back-to-top,
        .printing .floating-elements,
        .printing .particles {
            display: none !important;
        }
        
        .printing .hero {
            padding-top: 0 !important;
            min-height: auto !important;
        }
        
        @media (hover: none) and (pointer: coarse) {
            .cursor,
            .cursor-follower {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Agregar estilos dinámicos al cargar
document.addEventListener('DOMContentLoaded', addDynamicStyles);

// ===== FUNCIONES DE ACCESIBILIDAD =====
function initializeA11y() {
    // Navegación por teclado
    document.addEventListener('keydown', (e) => {
        // Escape cierra menú móvil
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMobileMenu();
        }
        
        // Enter/Space en elementos clickeables
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[tabindex], button, a')) {
            e.target.click();
        }
    });
    
    // Anuncios para lectores de pantalla
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = (message) => {
        announcer.textContent = message;
        setTimeout(() => announcer.textContent = '', 1000);
    };
}

// Inicializar accesibilidad
document.addEventListener('DOMContentLoaded', initializeA11y);

console.log('🎯 JavaScript del portfolio cargado completamente');