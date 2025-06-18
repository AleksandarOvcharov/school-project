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
    
    // Remove active class from all links first
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Set active based on current page
    let activeSet = false;
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Check for exact path match
        if (href === currentPath || 
            (currentPath === '/' && href === '/') ||
            (currentPath === '/index.html' && href === '/') ||
            (currentPath.endsWith('/') && href === currentPath.slice(0, -1)) ||
            href === currentPath + '/') {
            link.classList.add('active');
            activeSet = true;
        }
    });
    
    // If no exact match found and we're on root, highlight "Начало"
    if (!activeSet && (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html'))) {
        const homeLink = document.querySelector('nav a[href="/"], nav a[href="./"], nav a[href="../"], nav a[id="nav-home"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
}

// Supabase client
let supabase;

// Initialize Supabase
async function initializeSupabase() {
    try {
        // Load environment variables if available
        if (window.envLoader) {
            await window.envLoader.loadEnv();
            const env = window.envLoader.getAll();
            
            if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
                // Use global Supabase manager
                supabase = await window.supabaseManager.initialize();
                return supabase !== null;
            }
        }
        return false;
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
    
    // Determine the correct path to components based on current location
    let basePath = 'components/';
    const currentPath = window.location.pathname;
    
    // If we're not in the root directory, use relative path
    if (currentPath !== '/' && currentPath !== '/index.html') {
        // Check if we're in a subdirectory (contains additional slash after the domain)
        const pathParts = currentPath.split('/').filter(part => part !== '');
        if (pathParts.length > 0) {
            basePath = '../components/';
        }
    }
    
    loadComponent('header-component', basePath + 'header.html').then(async () => {
        // Apply saved title after header is loaded
        await applySavedSiteTitle();
        
        // Setup mobile menu and profile dropdown after header is loaded
        setTimeout(() => {
            setupMobileMenu();
            setupProfileDropdown();
            setActiveNav(); // Set initial active navigation
        }, 100);
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
                        counter.textContent = `${target}%`;
                        clearInterval(timer);
                    } else {
                        counter.textContent = `${Math.ceil(current)}%`;
                    }
                }, 30);
            }
        });
    };

    // Intersection Observer за анимация при влизане в екрана
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

    // Smooth scroll for all anchor links that don't start with http
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Добавяне на lazy loading за изображения
    if ('IntersectionObserver' in window) {
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

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Dynamic navigation highlighting based on scroll position
    const markActiveNav = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a');
        
        let current = '';
        let foundActiveSection = false;
        
        // Check if we have sections with IDs for scroll-based highlighting
        if (sections.length > 0) {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                    foundActiveSection = true;
                }
            });

            // If we found an active section, highlight the corresponding nav link
            if (foundActiveSection && current) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === `#${current}` || href.endsWith(`#${current}`)) {
                        link.classList.add('active');
                    }
                });
            }
        }
        
        // If no sections with IDs or no active section found, maintain page-based highlighting
        if (!foundActiveSection) {
            // Don't remove active class, let setActiveNav handle page-based highlighting
            const hasActiveLink = document.querySelector('nav a.active');
            if (!hasActiveLink) {
                setActiveNav(); // Re-apply page-based highlighting
            }
        }
    };

    // Run on scroll
    window.addEventListener('scroll', markActiveNav);

    // Back to top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

// Setup mobile menu functionality
function setupMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', toggleMobileMenuHandler);
        
        // Close mobile menu when clicking on links
        const mobileNavLinks = document.querySelectorAll('.nav-menu a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileBtn.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            const header = document.querySelector('header');
            if (header && !header.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileBtn.classList.remove('active');
            }
        });
    }
}

function toggleMobileMenuHandler() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    if (navMenu && mobileBtn) {
        navMenu.classList.toggle('active');
        mobileBtn.classList.toggle('active');
    }
}

// Setup profile dropdown functionality
function setupProfileDropdown() {
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.querySelector('.profile-dropdown');
        const profileMenu = document.querySelector('.profile-menu');
        
        if (dropdown && profileMenu && !dropdown.contains(e.target)) {
            profileMenu.classList.remove('show');
        }
    });
}

// Profile dropdown functionality
function toggleProfileDropdown() {
    const profileMenu = document.getElementById('profile-menu');
    if (profileMenu) {
        profileMenu.classList.toggle('show');
    }
}

// Profile menu functions (placeholder functions for now)
function showProfileSettings() {
    alert('Функционалността за профил ще бъде добавена скоро!');
}

function showSettings() {
    alert('Функционалността за настройки ще бъде добавена скоро!');
}

function handleLogout() {
    if (confirm('Сигурни ли сте, че искате да излезете?')) {
        alert('Изход от системата...');
        // Here you would handle actual logout logic
    }
}

// Make profile functions globally available
window.toggleProfileDropdown = toggleProfileDropdown;
window.showProfileSettings = showProfileSettings;
window.showSettings = showSettings;
window.handleLogout = handleLogout; 