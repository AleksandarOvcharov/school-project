// Опростен JavaScript за основна функционалност

document.addEventListener('DOMContentLoaded', function() {
    
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
    
});

// Функция за показване/скриване на меню на мобилни устройства
function toggleMobileMenu() {
    const nav = document.querySelector('nav ul');
    nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
} 