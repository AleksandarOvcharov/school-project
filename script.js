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
        
        return true; // Indicate success
    } catch (error) {
        console.error('Error loading component:', error);
        return false; // Indicate failure
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

// Supabase client
let supabase;

// Initialize Supabase
async function initializeSupabase() {
    try {
        const { createClient } = window.supabase;
        supabase = createClient(
            'https://rwlvgzbezcjdmwqidsvu.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bHZnemJlemNqZG13cWlkc3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NjUzNDIsImV4cCI6MjA2NTI0MTM0Mn0.wtr2Q4ueBH-rhZ6pHpdQm9qdOG5m8dhAczIKHvvHqqw'
        );
        return true;
    } catch (error) {
        console.error('Supabase initialization failed:', error);
        return false;
    }
}

// Function to load site title from Supabase
async function loadSiteTitleFromSupabase() {
    try {
        if (!supabase) return null;
        
        const { data, error } = await supabase
            .from('quiz_settings')
            .select('setting_value')
            .eq('setting_key', 'site_settings')
            .single();

        if (!error && data && data.setting_value && data.setting_value.siteTitle) {
            return data.setting_value.siteTitle;
        }
    } catch (error) {
        console.error('Error loading site title from Supabase:', error);
    }
    return null;
}

// Function to apply saved site title
async function applySavedSiteTitle() {
    try {
        // Try to load from Supabase first
        let savedTitle = await loadSiteTitleFromSupabase();
        
        // Fallback to localStorage
        if (!savedTitle) {
            savedTitle = localStorage.getItem('main_site_title');
        }
        
        if (savedTitle) {
            // Update page title
            document.title = savedTitle;
            
            // Update header title when header is loaded
            setTimeout(() => {
                const headerTitle = document.querySelector('h1 a');
                if (headerTitle) {
                    headerTitle.textContent = savedTitle;
                }
            }, 100);
        }
    } catch (error) {
        // Silent error handling - fallback to localStorage
        const savedTitle = localStorage.getItem('main_site_title');
        if (savedTitle) {
            document.title = savedTitle;
            setTimeout(() => {
                const headerTitle = document.querySelector('h1 a');
                if (headerTitle) {
                    headerTitle.textContent = savedTitle;
                }
            }, 100);
        }
    }
}

// Listen for title updates from admin panel
window.addEventListener('storage', function(e) {
    if (e.key === 'main_site_title') {
        applySavedSiteTitle();
    }
});

// Load components when page loads
document.addEventListener('DOMContentLoaded', async function () {
    // Initialize Supabase first
    await initializeSupabase();
    
    const basePath = '/components/';
    loadComponent('header-component', basePath + 'header.html').then(async () => {
        // Apply saved title after header is loaded
        await applySavedSiteTitle();
    });
    loadComponent('footer-component', basePath + 'footer.html');    

    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
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

// Функция за показване/скриване на меню на мобилни устройства
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    if (navMenu && mobileBtn) {
        navMenu.classList.toggle('active');
        mobileBtn.classList.toggle('active');
    }
} 