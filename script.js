// Опростен JavaScript за основна функционалност

// Function to load components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Set active navigation
        if (elementId === 'header-component') {
            setActiveNav();
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Function to set active navigation based on current page
function setActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Check for exact match or if current path starts with the href
        if (currentPath === href || (href !== '/' && currentPath.startsWith(href))) {
            link.classList.add('active');
        }
        // Special case for home page
        if (currentPath === '/' && href === '/') {
            link.classList.add('active');
        }
    });
}

// Load components when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Determine the correct path based on current location
    const basePath = '/components/';
    loadComponent('header-component', basePath + 'header.html');
    loadComponent('footer-component', basePath + 'footer.html');
    
    // Плавно скролиrane при навигация
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Анимирани брояци за статистики
    const counters = document.querySelectorAll('.stat-box h4');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            if (target > 0 && target < 100) {
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + '%';
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + '%';
                    }
                }, 30);
            }
        });
    };
    
    // Запускане на брояците при скролиrane
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Маркиране на активна връзка в навигацията
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('nav a');
    
    const markActiveNav = () => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', markActiveNav);
    
    // Форма за контакт (ако съществува)
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Съобщението е изпратено успешно!');
            this.reset();
        });
    }
    
    // Бутони "Научи повече"
    const learnMoreBtns = document.querySelectorAll('.btn');
    learnMoreBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                alert('Тази функция ще бъде добавена скоро.');
            }
        });
    });
    
    // Затваряне на мобилното меню при клик на връзка
    const mobileNavLinks = document.querySelectorAll('.nav-menu a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            const mobileBtn = document.querySelector('.mobile-menu-btn');
            
            if (navMenu && mobileBtn) {
                navMenu.classList.remove('active');
                mobileBtn.classList.remove('active');
            }
        });
    });
    
    // Затваряне на мобилното меню при клик извън него
    document.addEventListener('click', function(e) {
        const navMenu = document.querySelector('.nav-menu');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const header = document.querySelector('header');
        
        if (navMenu && mobileBtn && header) {
            // Ако кликът е извън header-a и менюто е отворено
            if (!header.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileBtn.classList.remove('active');
            }
        }
    });
});

// Функция за показване/скриване на меню на мобилни устройства
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    if (navMenu && mobileBtn) {
        navMenu.classList.toggle('active');
        mobileBtn.classList.toggle('active');
    }
} 