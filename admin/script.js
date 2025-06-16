// Wait for config to load, then initialize
let supabase;
let ADMIN_CREDENTIALS;

// Initialize after environment variables are loaded
document.addEventListener('DOMContentLoaded', async function() {
    await initializeWithEnv();
});

async function initializeWithEnv() {
    try {
        // Load environment variables
        await window.envLoader.loadEnv();
        
        if (!window.ENV) {
            throw new Error('Environment variables not loaded');
        }

        // Initialize Supabase client using global manager
        supabase = await window.supabaseManager.initialize();
        
        // Set admin credentials from environment
        ADMIN_CREDENTIALS = {
            username: window.ENV.ADMIN_USERNAME,
            password: window.ENV.ADMIN_PASSWORD
        };
        
        // Continue with initialization
        setupEventListeners();
        loadHeaderAndFooter();
        checkAuthStatus();
        initializeSupabase();
        
        // Setup URL routing
        setupRouting();
        
    } catch (error) {
        Swal.fire({
            title: 'Грешка в конфигурацията!',
            text: 'Моля, уверете се че конфигурацията е правилно настроена.',
            icon: 'error',
            confirmButtonColor: '#007acc'
        });
    }
}

// Global variables
let currentEditingId = null;
let questionsData = [];
let currentSection = 'main';

// Function to load header and footer components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Set active navigation for admin
        if (elementId === 'header-component') {
            setActiveNavForAdmin();
        }
    } catch (error) {
        // Silent error - components are optional
    }
}

// Function to set active navigation for admin page
function setActiveNavForAdmin() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Mark admin link as active
        if (href && href.includes('admin')) {
            link.classList.add('active');
        }
    });
}

// Load header and footer
async function loadHeaderAndFooter() {
    await loadComponent('header-component', '../components/header.html');
    await loadComponent('footer-component', '../components/footer.html');
    
    // Apply saved title after header is loaded
    setTimeout(async () => {
        await applySavedSiteTitle();
        setupMobileMenu();
    }, 100);
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
            document.title = savedTitle + ' - Админ панел';
            
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
            document.title = savedTitle + ' - Админ панел';
            setTimeout(() => {
                const headerTitle = document.querySelector('h1 a');
                if (headerTitle) {
                    headerTitle.textContent = savedTitle;
                }
            }, 100);
        }
    }
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
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

// URL Routing Setup
function setupRouting() {
    // Listen for hash changes
    window.addEventListener('hashchange', handleURLChange);
    
    // Handle initial URL
    handleURLChange();
}

function handleURLChange() {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    
    // Extract section from hash (e.g., #tests -> tests)
    if (hash && hash !== '') {
        currentSection = hash;
        showSection(hash);
        updatePageTitle(hash);
    } else {
        currentSection = 'main';
        showSection('main');
        updatePageTitle('main');
    }
}

function navigateToSection(section) {
    currentSection = section;
    
    // Update URL without page reload using hash
    const newHash = section === 'main' ? '' : `#${section}`;
    window.location.hash = newHash;
    
    // Show the section (this will also be triggered by hashchange event)
    showSection(section);
    updatePageTitle(section);
}

function showSection(section) {
    // Hide all sections
    const sections = ['main-dashboard', 'tests-section', 'json-writer-section', 'settings-section'];
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // Show target section
    const targetId = section === 'main' ? 'main-dashboard' : `${section}-section`;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.style.display = 'block';
    }
    
    // Show/hide back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.style.display = section === 'main' ? 'none' : 'block';
    }
    
    // Load content based on section
    if (section === 'tests') {
        // Add a small delay to show the section first, then load questions
        setTimeout(() => {
            loadQuestions();
        }, 100);
    } else if (section === 'settings') {
        // Load settings when entering settings section
        setTimeout(async () => {
            await loadSettings();
        }, 100);
    } else if (section === 'json-writer') {
        // Initialize JSON writer
        setTimeout(() => {
            const jsonEditor = document.getElementById('json-editor');
            if (jsonEditor && !jsonEditor.hasAttribute('data-initialized')) {
                jsonEditor.addEventListener('input', validateJson);
                jsonEditor.setAttribute('data-initialized', 'true');
                addJsonSyntaxHighlighting(jsonEditor);
                validateJson(); // Initial validation
            }
        }, 100);
    }
}

function updatePageTitle(section) {
    const titles = {
        main: 'Админ панел',
        tests: 'Управление на тестове',
        'json-writer': 'JSON Writer',
        settings: 'Настройки'
    };
    
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
        titleElement.textContent = titles[section] || 'Админ панел';
    }
}

// Loading spinner functions
function showLoadingSpinner(container, message = 'Зареждане...') {
    container.innerHTML = `
        <div class="loading-container">
            <div class="spinner">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>
            <div class="loading-text">${message}</div>
        </div>
    `;
}

function hideLoadingSpinner(container) {
    const spinner = container.querySelector('.loading-container');
    if (spinner) {
        spinner.remove();
    }
}

// Make navigation function globally available
window.navigateToSection = navigateToSection;

// Category mapping
const categories = {
    definition: "Определения и характеристики",
    types: "Видове кибертормоз", 
    protection: "Превенция и защита",
    legal: "Правни аспекти",
    ethics: "Дигитална етика"
};

// DOM Elements
const elements = {
    loginSection: document.getElementById('login-section'),
    adminDashboard: document.getElementById('admin-dashboard'),
    loginForm: document.getElementById('admin-login-form'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // Tabs
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Questions management
    questionsList: document.getElementById('questions-list'),
    totalQuestions: document.getElementById('total-questions'),
    
    // Question form
    questionForm: document.getElementById('question-form'),
    questionText: document.getElementById('question-text'),
    categorySelect: document.getElementById('category'),
    explanationText: document.getElementById('explanation'),
    cancelEditBtn: document.getElementById('cancel-edit')
};

function setupEventListeners() {
    // Login form
    elements.loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    // Tab switching
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Question form
    elements.questionForm.addEventListener('submit', handleQuestionSubmit);
    elements.cancelEditBtn.addEventListener('click', cancelEdit);
    
    // Make answer cards clickable
    setupAnswerCardClicks();
}

function setupAnswerCardClicks() {
    // Add event delegation for answer cards
    document.addEventListener('click', function(e) {
        const answerCard = e.target.closest('.answer-input');
        if (answerCard) {
            const radioButton = answerCard.querySelector('input[type="radio"]');
            // Don't activate if clicking on text input or radio button itself
            if (radioButton && 
                e.target !== radioButton && 
                e.target.type !== 'text' && 
                !e.target.matches('input[type="text"]')) {
                radioButton.checked = true;
                updateCardSelection();
            }
        }
    });
    
    // Also listen for direct radio button changes
    document.addEventListener('change', function(e) {
        if (e.target.type === 'radio' && e.target.closest('.answer-input')) {
            updateCardSelection();
        }
    });
}

function updateCardSelection() {
    // Update visual state of all answer cards
    const answerCards = document.querySelectorAll('.answer-input');
    answerCards.forEach(card => {
        const radio = card.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

// Authentication functions
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    if (isLoggedIn) {
        showDashboard();
    } else {
        showLogin();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const loginBtn = document.querySelector('.login-btn');
    
    if (!usernameField || !passwordField) {
        return;
    }
    
    const username = usernameField.value.trim();
    const password = passwordField.value.trim();
    
    // Check if fields are empty
    if (!username || !password) {
        Swal.fire({
            title: 'Грешка!',
            text: 'Моля, въведете потребителско име и парола.',
            icon: 'error',
            confirmButtonColor: '#007acc'
        });
        return;
    }
    
    // Check if credentials are loaded
    if (!ADMIN_CREDENTIALS) {
        Swal.fire({
            title: 'Грешка!',
            text: 'Системата все още се зарежда. Моля, изчакайте.',
            icon: 'error',
            confirmButtonColor: '#007acc'
        });
        return;
    }
    
    // Show loading state
    const originalText = loginBtn.textContent;
    loginBtn.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
            <div class="spinner" style="width: 20px; height: 20px; margin: 0;">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>
            Влизане...
        </div>
    `;
    loginBtn.disabled = true;
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_last_login', new Date().toISOString());
        
        Swal.fire({
            title: 'Успешен вход!',
            text: 'Добре дошли в админ панела.',
            icon: 'success',
            confirmButtonColor: '#007acc',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            showDashboard();
        });
    } else {
        // Reset button state
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
        
        Swal.fire({
            title: 'Грешка!',
            text: 'Неправилно потребителско име или парола.',
            icon: 'error',
            confirmButtonColor: '#007acc'
        });
    }
}

function handleLogout() {
    Swal.fire({
        title: 'Сигурни ли сте?',
        text: 'Искате ли да излезете от админ панела?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#007acc',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Да, изход',
        cancelButtonText: 'Отказ'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('admin_logged_in');
            showLogin();
            
            // Reset URL hash
            window.location.hash = '';
            currentSection = 'main';
            
            Swal.fire({
                title: 'Изход',
                text: 'Успешно излязохте от системата.',
                icon: 'success',
                confirmButtonColor: '#007acc'
            });
        }
    });
}

function showLogin() {
    elements.loginSection.style.display = 'block';
    elements.adminDashboard.style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function showDashboard() {
    elements.loginSection.style.display = 'none';
    elements.adminDashboard.style.display = 'block';
    
    // Apply saved site title
    applySiteTitleSettings();
    
    // Show appropriate section based on current URL
    handleURLChange();
}

// Tab management
function switchTab(tabName) {
    // Update tab buttons
    elements.tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    elements.tabContents.forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Load questions when switching to questions tab
    if (tabName === 'questions') {
        loadQuestions();
    }
}

// Supabase functions
async function initializeSupabase() {
    try {
        // Check if table exists, if not create it
        await createQuestionsTable();
        
        // Initialize settings table with default values
        await initializeSettings();
        
        // Load initial questions from local data if table is empty
        const { data, error } = await supabase
            .from('quiz_questions')
            .select('*')
            .limit(1);
            
        if (data && data.length === 0) {
            await seedInitialQuestions();
        }
    } catch (error) {
        // Fallback to local storage if Supabase is not configured - silent fallback
    }
}

async function createQuestionsTable() {
    // This would typically be done in Supabase dashboard
    // Here for reference only
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS quiz_questions (
            id SERIAL PRIMARY KEY,
            question TEXT NOT NULL,
            options JSONB NOT NULL,
            correct INTEGER NOT NULL,
            category VARCHAR(50) NOT NULL,
            explanation TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `;
}

function getCategoryName(category) {
    return categories[category] || category;
}

// Make functions globally available
window.editQuestion = editQuestion;
window.deleteQuestion = deleteQuestion;
window.saveSettings = saveSettings;
window.handleSaveSettings = handleSaveSettings;
window.exportQuestions = exportQuestions;
window.importQuestions = importQuestions;
window.clearAllData = clearAllData;
window.removeDuplicateQuestions = removeDuplicateQuestions;
window.changePassword = changePassword;
window.showJsonFormat = showJsonFormat;
window.copyJsonExample = copyJsonExample;

// Wrapper function for async saveSettings
function handleSaveSettings(section) {
    saveSettings(section, event).catch(error => {
        console.error('Error in handleSaveSettings:', error);
    });
}

function copyJsonExample() {
    const exampleJson = [
        {
            "question": "Какво е кибертормоз?",
            "options": [
                "Физически тормоз в реалния свят",
                "Тормоз чрез електронни средства и интернет",
                "Споделяне на позитивно съдържание онлайн",
                "Образователна дейност в интернет"
            ],
            "correct": 1,
            "category": "definition",
            "explanation": "Кибертормозът е форма на тормоз, която се извършва чрез електронни средства."
        },
        {
            "question": "Кое от следните е добра мярка за защита?",
            "options": [
                "Споделяне на лични данни",
                "Използване на силни пароли",
                "Приемане на покани от непознати",
                "Публикуване на адреса си"
            ],
            "correct": 1,
            "category": "protection",
            "explanation": "Силните пароли са основна мярка за защита в интернет."
        }
    ];

    const jsonString = JSON.stringify(exampleJson, null, 2);
    
    // Try to copy to clipboard
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(jsonString).then(() => {
            // Find the button and update it
            const button = document.querySelector('.copy-json-btn');
            if (button) {
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Копирано!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.classList.remove('copied');
                }, 2000);
            }
        }).catch(() => {
            // Fallback if clipboard API fails
            fallbackCopyText(jsonString);
        });
    } else {
        // Fallback for non-secure contexts
        fallbackCopyText(jsonString);
    }
}

function fallbackCopyText(text) {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        // Show success message
        const button = document.querySelector('.copy-json-btn');
        if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Копирано!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('copied');
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        // Show error message
        Swal.fire({
            title: 'Грешка',
            text: 'Не успя да копира текста. Моля, копирайте ръчно.',
            icon: 'error',
            confirmButtonColor: '#007acc'
        });
    } finally {
        document.body.removeChild(textArea);
    }
}

async function seedInitialQuestions() {
    // All quiz questions to seed the database
    const initialQuestions = [
        {
            question: "Какво е кибертормоз?",
            options: [
                "Физически тормоз в реалния свят",
                "Тормоз чрез електронни средства и интернет",
                "Споделяне на позитивно съдържание онлайн",
                "Образователна дейност в интернет"
            ],
            correct: 1,
            category: "definition",
            explanation: "Кибертормозът е форма на тормоз, която се извършва чрез електронни средства - интернет, мобилни устройства, социални мрежи и други дигитални платформи."
        },
        {
            question: "Коя от следните характеристики НЕ е типична за кибертормоза?",
            options: [
                "Достъпност 24 часа в денонощието",
                "Възможност за анонимност",
                "Ограничен до физическо пространство",
                "Бързо разпространение на съдържанието"
            ],
            correct: 2,
            category: "definition",
            explanation: "Кибертормозът не е ограничен до физическо пространство - това е една от основните му разлики от традиционния тормоз."
        },
        {
            question: "Кой от следните примери представлява кибертормоз?",
            options: [
                "Споделяне на образователни материали",
                "Изпращане на заплашителни съобщения в чата",
                "Поздравяване на приятели в социалните мрежи",
                "Участие в онлайн викторина"
            ],
            correct: 1,
            category: "types",
            explanation: "Изпращането на заплашителни съобщения е ясен пример за кибертормоз, тъй като има за цел да уплаши и нарани жертвата."
        },
        {
            question: "Какво трябва да направите първо, ако станете жертва на кибертормоз?",
            options: [
                "Да отговорите агресивно на нападателя",
                "Да запазите доказателства и блокирате нападателя",
                "Да изтриете профила си в социалните мрежи",
                "Да споделите лична информация за защита"
            ],
            correct: 1,
            category: "protection",
            explanation: "Първата стъпка е да запазите доказателства (снимки, съобщения) и да блокирате нападателя, за да прекратите контакта."
        },
        {
            question: "Кое от следните е пример за превенция от кибертормоз?",
            options: [
                "Споделяне на лични данни с всички",
                "Използване на силни пароли и настройки за поверителност",
                "Приемане на покани от непознати хора",
                "Публикуване на адреса си онлайн"
            ],
            correct: 1,
            category: "protection",
            explanation: "Използването на силни пароли и правилни настройки за поверителност са основни мерки за защита от кибертормоз."
        },
        {
            question: "Дигиталната етика включва:",
            options: [
                "Използване на технологиите само за забавление",
                "Отговорно и зачитащо поведение в дигиталната среда",
                "Игнориране на правилата в интернет",
                "Споделяне на фалшиви новини"
            ],
            correct: 1,
            category: "ethics",
            explanation: "Дигиталната етика се отнася до отговорното, етично и зачитащо поведение при използване на дигитални технологии."
        },
        {
            question: "Какво може да се случи с дигиталното съдържание, което публикувате онлайн?",
            options: [
                "Автоматично се изтрива след 24 часа",
                "Остава само на вашето устройство",
                "Може да остане в интернет завинаги",
                "Се показва само на приятелите ви"
            ],
            correct: 2,
            category: "ethics",
            explanation: "Дигиталното съдържание може да остане в интернет дълго време и да бъде достъпно дори след като мислите, че го сте изтрили."
        },
        {
            question: "Кой орган в България се занимава с киберпрестъпления?",
            options: [
                "Министерството на образованието",
                "Държавна агенция \"Електронно управление\"",
                "Главна дирекция \"Борба с организираната престъпност\"",
                "Комисията за защита на потребителите"
            ],
            correct: 2,
            category: "legal",
            explanation: "В България киберпрестъпленията се разследват от специализираните звена в МВР, включително ГДБОП."
        },
        {
            question: "Какво НЕ трябва да правите в социалните мрежи?",
            options: [
                "Да споделяте позитивни моменти от живота си",
                "Да общувате с приятели и семейство",
                "Да публикувате снимки с лична информация (документи, адреси)",
                "Да участвате в образователни дискусии"
            ],
            correct: 2,
            category: "protection",
            explanation: "Никога не трябва да споделяте лична информация като документи, адреси или телефонни номера в социалните мрежи."
        },
        {
            question: "Кое от следните действия показва дигитална грамотност?",
            options: [
                "Кликване на всички връзки в имейлите",
                "Проверка на източниците на информацията преди споделяне",
                "Използване на една и съща парола за всички акаунти",
                "Споделяне на неверифицирана информация"
            ],
            correct: 1,
            category: "ethics",
            explanation: "Дигитално грамотният човек винаги проверява източниците на информацията преди да я сподели, за да избегне разпространението на фалшиви новини."
        }
    ];
    
    try {
        for (const question of initialQuestions) {
            // Check if this question already exists
            const { data: existingQuestion, error: searchError } = await supabase
                .from('quiz_questions')
                .select('id')
                .eq('question', question.question)
                .limit(1);

            // Only insert if question doesn't exist
            if (!existingQuestion || existingQuestion.length === 0) {
            await supabase
                .from('quiz_questions')
                .insert([question]);
            }
        }

    } catch (error) {
        // Silent error handling
    }
}

// Questions management
async function loadQuestions() {
    try {
        showLoadingSpinner(elements.questionsList, 'Зареждане на въпросите...');
        
        const { data, error } = await supabase
            .from('quiz_questions')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        questionsData = data || [];
        displayQuestions(questionsData);
        updateQuestionsStats();
        
    } catch (error) {
        // Fallback to localStorage
        const localQuestions = JSON.parse(localStorage.getItem('quiz_questions') || '[]');
        questionsData = localQuestions;
        displayQuestions(questionsData);
        updateQuestionsStats();
    }
}

function displayQuestions(questions) {
    if (questions.length === 0) {
        elements.questionsList.innerHTML = `
            <div class="no-questions">
                <h4>Няма въпроси</h4>
                <p>Започнете с добавянето на първия въпрос.</p>
            </div>
        `;
        return;
    }
    
    elements.questionsList.innerHTML = questions.map(question => `
        <div class="question-item" data-id="${question.id}">
            <div class="question-header">
                <div class="question-text">${question.question}</div>
                <div class="question-actions">
                    <button class="edit-btn" onclick="editQuestion(${question.id})">Редактирай</button>
                    <button class="delete-btn" onclick="deleteQuestion(${question.id})">Изтрий</button>
                </div>
            </div>
            <div class="question-details">
                <div class="question-category">${categories[question.category]}</div>
                <div class="question-options">
                    ${question.options.map((option, index) => `
                        <div class="option-item ${index === question.correct ? 'correct' : ''}">${option}</div>
                    `).join('')}
                </div>
                <div class="question-explanation">${question.explanation}</div>
            </div>
        </div>
    `).join('');
}

function updateQuestionsStats() {
    elements.totalQuestions.textContent = questionsData.length;
}

// Question CRUD operations
async function handleQuestionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.questionForm);
    const questionData = {
        question: formData.get('question'),
        options: [
            formData.get('option-0'),
            formData.get('option-1'),
            formData.get('option-2'),
            formData.get('option-3')
        ],
        correct: parseInt(formData.get('correct')),
        category: formData.get('category'),
        explanation: formData.get('explanation')
    };
    
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.textContent;
    
    // Show loading state
    saveBtn.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
            <div class="spinner" style="width: 20px; height: 20px; margin: 0;">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>
            Запазване...
        </div>
    `;
    saveBtn.disabled = true;
    
    try {
        if (currentEditingId) {
            await updateQuestion(currentEditingId, questionData);
        } else {
            await addQuestion(questionData);
        }
        
        elements.questionForm.reset();
        cancelEdit();
        loadQuestions();
        switchTab('questions');
        
    } catch (error) {
        console.error('Error saving question:', error);
        Swal.fire({
            title: 'Грешка!',
            text: 'Възникна грешка при запазване на въпроса.',
            icon: 'error',
            confirmButtonColor: '#007acc'
        });
    } finally {
        // Reset button state
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
    }
}

async function addQuestion(questionData) {
    try {
        const { data, error } = await supabase
            .from('quiz_questions')
            .insert([questionData])
            .select();
        
        if (error) throw error;
        
        Swal.fire({
            title: 'Успех!',
            text: 'Въпросът беше добавен успешно.',
            icon: 'success',
            confirmButtonColor: '#007acc'
        });
        
    } catch (error) {
        // Fallback to localStorage
        const localQuestions = JSON.parse(localStorage.getItem('quiz_questions') || '[]');
        questionData.id = Date.now();
        localQuestions.push(questionData);
        localStorage.setItem('quiz_questions', JSON.stringify(localQuestions));
        
        Swal.fire({
            title: 'Успех!',
            text: 'Въпросът беше добавен успешно (локално съхранение).',
            icon: 'success',
            confirmButtonColor: '#007acc'
        });
    }
}

async function updateQuestion(id, questionData) {
    try {
        const { data, error } = await supabase
            .from('quiz_questions')
            .update(questionData)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        
        Swal.fire({
            title: 'Успех!',
            text: 'Въпросът беше обновен успешно.',
            icon: 'success',
            confirmButtonColor: '#007acc'
        });
        
    } catch (error) {
        // Fallback to localStorage
        const localQuestions = JSON.parse(localStorage.getItem('quiz_questions') || '[]');
        const index = localQuestions.findIndex(q => q.id == id);
        if (index !== -1) {
            localQuestions[index] = { ...localQuestions[index], ...questionData };
            localStorage.setItem('quiz_questions', JSON.stringify(localQuestions));
        }
        
        Swal.fire({
            title: 'Успех!',
            text: 'Въпросът беше обновен успешно (локално съхранение).',
            icon: 'success',
            confirmButtonColor: '#007acc'
        });
    }
}

async function deleteQuestion(id) {
    const result = await Swal.fire({
        title: 'Сигурни ли сте?',
        text: 'Този въпрос ще бъде изтрит завинаги!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Да, изтрий',
        cancelButtonText: 'Отказ'
    });
    
    if (result.isConfirmed) {
        try {
            const { error } = await supabase
                .from('quiz_questions')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            Swal.fire({
                title: 'Изтрито!',
                text: 'Въпросът беше изтрит успешно.',
                icon: 'success',
                confirmButtonColor: '#007acc'
            });
            
            loadQuestions();
            
        } catch (error) {
            // Fallback to localStorage
            const localQuestions = JSON.parse(localStorage.getItem('quiz_questions') || '[]');
            const filtered = localQuestions.filter(q => q.id != id);
            localStorage.setItem('quiz_questions', JSON.stringify(filtered));
            
            Swal.fire({
                title: 'Изтрито!',
                text: 'Въпросът беше изтрит успешно (локално съхранение).',
                icon: 'success',
                confirmButtonColor: '#007acc'
            });
            
            loadQuestions();
        }
    }
}

function editQuestion(id) {
    const question = questionsData.find(q => q.id == id);
    if (!question) return;
    
    currentEditingId = id;
    
    // Fill form with question data
    elements.questionText.value = question.question;
    elements.categorySelect.value = question.category;
    elements.explanationText.value = question.explanation;
    
    // Fill options
    question.options.forEach((option, index) => {
        document.querySelector(`[name="option-${index}"]`).value = option;
    });
    
    // Set correct answer
    document.querySelector(`[name="correct"][value="${question.correct}"]`).checked = true;
    
    // Update UI
    elements.cancelEditBtn.style.display = 'block';
    document.querySelector('.save-btn').textContent = 'Обнови въпроса';
    
    // Switch to add question tab
    switchTab('add-question');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    currentEditingId = null;
    elements.questionForm.reset();
    elements.cancelEditBtn.style.display = 'none';
    document.querySelector('.save-btn').textContent = 'Запази въпроса';
    
    // Return to questions list instead of staying in add question tab
    switchTab('questions');
}

// Settings Functions
async function saveSettings(section, event = null) {
    const saveBtn = event ? event.target : document.querySelector(`[onclick*="'${section}'"]`);
    const originalText = saveBtn.textContent;
    
    // Show loading state
    saveBtn.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
            <div class="spinner" style="width: 16px; height: 16px; margin: 0;">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>
            Запазване...
        </div>
    `;
    saveBtn.disabled = true;
    
    try {
        let settings = {};
        
        if (section === 'site') {
            settings = {
                siteTitle: document.getElementById('site-title').value
            };
            
            // Update titles immediately
            if (settings.siteTitle) {
                updateSiteTitles(settings.siteTitle);
            }
        } else if (section === 'quiz') {
            settings = {
                timeLimit: parseInt(document.getElementById('quiz-time-limit').value),
                passingScore: parseInt(document.getElementById('passing-score').value),
                showExplanations: document.getElementById('show-explanations').checked,
                randomizeQuestions: document.getElementById('randomize-questions').checked
            };
        } else if (section === 'security') {
            settings = {
                sessionTimeout: document.getElementById('session-timeout').checked
            };
        }
        
        // Save to Supabase
        await saveSettingsToSupabase(`${section}_settings`, settings);
        
        // Reset button
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
        
        let successMessage = 'Настройките бяха запазени успешно.';
        
        Swal.fire({
            title: 'Успех!',
            text: successMessage,
            icon: 'success',
            confirmButtonColor: '#007acc',
            timer: 3000,
            showConfirmButton: false
        });
        
    } catch (error) {
        console.error('Error saving settings:', error);
        
        // Fallback to localStorage
        localStorage.setItem(`admin_settings_${section}`, JSON.stringify(settings));
        
        // Reset button
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
        
        Swal.fire({
            title: 'Предупреждение!',
            text: 'Настройките бяха запазени локално (няма връзка с базата данни).',
            icon: 'warning',
            confirmButtonColor: '#007acc',
            timer: 3000,
            showConfirmButton: false
        });
    }
}

async function saveSettingsToSupabase(settingKey, settingValue) {
    try {
        // Try to update existing setting
        const { data: updateData, error: updateError } = await supabase
            .from('quiz_settings')
            .update({ 
                setting_value: settingValue,
                updated_at: new Date().toISOString()
            })
            .eq('setting_key', settingKey)
            .select();

        if (updateError) throw updateError;

        // If no rows were updated, insert new setting
        if (!updateData || updateData.length === 0) {
            const { data: insertData, error: insertError } = await supabase
                .from('quiz_settings')
                .insert([{
                    setting_key: settingKey,
                    setting_value: settingValue,
                    description: `Настройки за ${settingKey.replace('_settings', '')}`
                }])
                .select();

            if (insertError) throw insertError;
        }

    } catch (error) {
        console.error('Supabase settings error:', error);
        throw error;
    }
}

async function loadSettingsFromSupabase(settingKey) {
    try {
        const { data, error } = await supabase
            .from('quiz_settings')
            .select('setting_value')
            .eq('setting_key', settingKey)
            .single();

        if (error) throw error;

        return data ? data.setting_value : null;
    } catch (error) {
        console.error('Error loading settings from Supabase:', error);
        return null;
    }
}

function exportQuestions() {
    try {
        const questions = questionsData.length > 0 ? questionsData : JSON.parse(localStorage.getItem('quiz_questions') || '[]');
        
        const dataStr = JSON.stringify(questions, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `quiz_questions_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        Swal.fire({
            title: 'Експорт завършен!',
            text: `Изтеглени ${questions.length} въпроса.`,
            icon: 'success',
            confirmButtonColor: '#007acc'
        });
    } catch (error) {
        Swal.fire({
            title: 'Грешка!',
            text: 'Възникна грешка при експортирането.',
            icon: 'error',
            confirmButtonColor: '#007acc'
        });
    }
}

function importQuestions(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const importedQuestions = JSON.parse(e.target.result);
            
            if (!Array.isArray(importedQuestions)) {
                throw new Error('Невалиден формат на файла');
            }
            
            // Validate question structure
            for (const q of importedQuestions) {
                if (!q.question || !q.options || !q.hasOwnProperty('correct') || !q.category || !q.explanation) {
                    throw new Error('Невалидна структура на въпросите');
                }
            }
            
            const result = await Swal.fire({
                title: 'Импорт на въпроси',
                text: `Намерени ${importedQuestions.length} въпроса. Искате ли да ги импортирате?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#007acc',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Да, импортирай',
                cancelButtonText: 'Отказ'
            });
            
            if (result.isConfirmed) {
                // Try to save to Supabase first, fallback to localStorage
                try {
                    for (const question of importedQuestions) {
                        await supabase
                            .from('quiz_questions')
                            .insert([question]);
                    }
                } catch (dbError) {
                    // Fallback to localStorage
                    localStorage.setItem('quiz_questions', JSON.stringify(importedQuestions));
                }
                
                Swal.fire({
                    title: 'Успех!',
                    text: `Импортирани ${importedQuestions.length} въпроса.`,
                    icon: 'success',
                    confirmButtonColor: '#007acc'
                });
                
                // Reload questions if we're in the tests section
                if (currentSection === 'tests') {
                    loadQuestions();
                }
            }
            
        } catch (error) {
            Swal.fire({
                title: 'Грешка при импорт!',
                text: 'Файлът не е в правилен формат или съдържа грешки.',
                icon: 'error',
                confirmButtonColor: '#007acc'
            });
        }
    };
    
    reader.readAsText(file);
    input.value = ''; // Reset file input
}

async function removeDuplicateQuestions() {
    const result = await Swal.fire({
        title: 'Изчистване на дублирани въпроси',
        text: 'Тази операция ще премахне всички дублирани въпроси от базата данни. Искате ли да продължите?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#007acc',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Да, изчисти дублираните',
        cancelButtonText: 'Отказ'
    });

    if (result.isConfirmed) {
        try {
            // Show loading
            Swal.fire({
                title: 'Изчистване...',
                text: 'Моля изчакайте докато премахваме дублираните въпроси.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Get all questions from database
            const { data: allQuestions, error } = await supabase
                .from('quiz_questions')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (!allQuestions || allQuestions.length === 0) {
                Swal.fire({
                    title: 'Няма въпроси',
                    text: 'Не са намерени въпроси в базата данни.',
                    icon: 'info',
                    confirmButtonColor: '#007acc'
                });
                return;
            }

            // Find duplicates based on question text
            const uniqueQuestions = [];
            const duplicateIds = [];
            const questionTexts = new Set();

            for (const question of allQuestions) {
                if (questionTexts.has(question.question)) {
                    // This is a duplicate
                    duplicateIds.push(question.id);
                } else {
                    // This is unique, keep it
                    questionTexts.add(question.question);
                    uniqueQuestions.push(question);
                }
            }

            if (duplicateIds.length === 0) {
                Swal.fire({
                    title: 'Няма дублирани въпроси',
                    text: 'Не са намерени дублирани въпроси в базата данни.',
                    icon: 'info',
                    confirmButtonColor: '#007acc'
                });
                return;
            }

            // Delete duplicates
            for (const duplicateId of duplicateIds) {
                await supabase
                    .from('quiz_questions')
                    .delete()
                    .eq('id', duplicateId);
            }

            Swal.fire({
                title: 'Успех!',
                text: `Премахнати са ${duplicateIds.length} дублирани въпроса. Останаха ${uniqueQuestions.length} уникални въпроса.`,
                icon: 'success',
                confirmButtonColor: '#007acc'
            });

            // Reload questions if we're in the tests section
            if (currentSection === 'tests') {
                loadQuestions();
            }

        } catch (error) {
            console.error('Error removing duplicates:', error);
            Swal.fire({
                title: 'Грешка!',
                text: 'Възникна грешка при премахването на дублираните въпроси.',
                icon: 'error',
                confirmButtonColor: '#007acc'
            });
        }
    }
}

function clearAllData() {
    Swal.fire({
        title: 'Избор за изчистване',
        text: 'Какво искате да изчистите?',
        icon: 'question',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonColor: '#007acc',
        denyButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Само дублираните въпроси',
        denyButtonText: 'ВСИЧКИ данни',
        cancelButtonText: 'Отказ'
    }).then((result) => {
        if (result.isConfirmed) {
            // Remove only duplicates
            removeDuplicateQuestions();
        } else if (result.isDenied) {
            // Remove all data (original functionality)
            clearAllDataConfirm();
        }
    });
}

function clearAllDataConfirm() {
    Swal.fire({
        title: 'ВНИМАНИЕ!',
        text: 'Това ще изтрие ВСИЧКИ въпроси и данни. Тази операция е необратима!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Да, изтрий всичко',
        cancelButtonText: 'Отказ',
        input: 'text',
        inputPlaceholder: 'Напишете "ИЗТРИЙ" за потвърждение',
        inputValidator: (value) => {
            if (value !== 'ИЗТРИЙ') {
                return 'Моля, напишете "ИЗТРИЙ" за потвърждение';
            }
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Clear Supabase data
                await supabase
                    .from('quiz_questions')
                    .delete()
                    .gte('id', 0);
            } catch (error) {
                // Silent error
            }
            
            // Clear localStorage
            localStorage.removeItem('quiz_questions');
            localStorage.removeItem('admin_settings_site');
            localStorage.removeItem('admin_settings_quiz');
            localStorage.removeItem('admin_settings_security');
            
            questionsData = [];
            
            Swal.fire({
                title: 'Изтрито!',
                text: 'Всички данни бяха изтрити.',
                icon: 'success',
                confirmButtonColor: '#007acc'
            });
            
            if (currentSection === 'tests') {
                loadQuestions();
            }
        }
    });
}

function changePassword() {
    Swal.fire({
        title: 'Смяна на парола',
        html: `
            <input type="password" id="current-password" class="swal2-input" placeholder="Текуща парола">
            <input type="password" id="new-password" class="swal2-input" placeholder="Нова парола">
            <input type="password" id="confirm-password" class="swal2-input" placeholder="Потвърди новата парола">
        `,
        confirmButtonText: 'Смени парола',
        confirmButtonColor: '#007acc',
        showCancelButton: true,
        cancelButtonText: 'Отказ',
        preConfirm: () => {
            const current = document.getElementById('current-password').value;
            const newPass = document.getElementById('new-password').value;
            const confirm = document.getElementById('confirm-password').value;
            
            if (!current || !newPass || !confirm) {
                Swal.showValidationMessage('Моля, попълнете всички полета');
                return false;
            }
            
            if (current !== ADMIN_CREDENTIALS.password) {
                Swal.showValidationMessage('Грешна текуща парола');
                return false;
            }
            
            if (newPass.length < 8) {
                Swal.showValidationMessage('Новата парола трябва да е поне 8 символа');
                return false;
            }
            
            if (newPass !== confirm) {
                Swal.showValidationMessage('Паролите не съвпадат');
                return false;
            }
            
            return { newPassword: newPass };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // In a real app, this would be saved to database
            Swal.fire({
                title: 'Успех!',
                text: 'Паролата беше сменена успешно.',
                icon: 'success',
                confirmButtonColor: '#007acc'
            });
        }
    });
}

function showJsonFormat() {
    const exampleJson = [
        {
            "question": "Какво е кибертормоз?",
            "options": [
                "Физически тормоз в реалния свят",
                "Тормоз чрез електронни средства и интернет",
                "Споделяне на позитивно съдържание онлайн",
                "Образователна дейност в интернет"
            ],
            "correct": 1,
            "category": "definition",
            "explanation": "Кибертормозът е форма на тормоз, която се извършва чрез електронни средства."
        },
        {
            "question": "Кое от следните е добра мярка за защита?",
            "options": [
                "Споделяне на лични данни",
                "Използване на силни пароли",
                "Приемане на покани от непознати",
                "Публикуване на адреса си"
            ],
            "correct": 1,
            "category": "protection",
            "explanation": "Силните пароли са основна мярка за защита в интернет."
        }
    ];

    // Function to highlight JSON syntax
    function highlightJson(jsonString) {
        return jsonString
            .replace(/("([^"\\]|\\.)*")\s*:/g, '<span style="color: #d14; font-weight: bold;">$1</span>:')
            .replace(/:\s*("([^"\\]|\\.)*")/g, ': <span style="color: #032f62;">$1</span>')
            .replace(/:\s*(\d+)/g, ': <span style="color: #005cc5; font-weight: bold;">$1</span>')
            .replace(/:\s*(true|false|null)/g, ': <span style="color: #e36209; font-weight: bold;">$1</span>')
            .replace(/(\[|\]|\{|\})/g, '<span style="color: #6f42c1; font-weight: bold;">$1</span>')
            .replace(/,/g, '<span style="color: #6a737d;">,</span>');
    }

    const highlightedJson = highlightJson(JSON.stringify(exampleJson, null, 4));

    Swal.fire({
        title: 'Формат на JSON файла',
        html: `
            <div style="text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007acc;">
                    <h4 style="margin: 0 0 15px 0; color: #007acc;">Структура на JSON файла</h4>
                    <p style="margin: 10px 0; font-size: 15px;"><strong>JSON файлът трябва да съдържа масив от обекти със следните полета:</strong></p>
                    <ul style="margin: 15px 0; padding-left: 25px; font-size: 14px; line-height: 1.6;">
                        <li style="margin-bottom: 8px;"><code style="background: #e9ecef; padding: 3px 6px; border-radius: 3px; color: #e83e8c; font-weight: bold;">question</code> - текст на въпроса</li>
                        <li style="margin-bottom: 8px;"><code style="background: #e9ecef; padding: 3px 6px; border-radius: 3px; color: #e83e8c; font-weight: bold;">options</code> - масив с 4 отговора</li>
                        <li style="margin-bottom: 8px;"><code style="background: #e9ecef; padding: 3px 6px; border-radius: 3px; color: #e83e8c; font-weight: bold;">correct</code> - индекс на правилния отговор (0-3)</li>
                        <li style="margin-bottom: 8px;"><code style="background: #e9ecef; padding: 3px 6px; border-radius: 3px; color: #e83e8c; font-weight: bold;">category</code> - категория: <em>definition, types, protection, legal, ethics</em></li>
                        <li style="margin-bottom: 8px;"><code style="background: #e9ecef; padding: 3px 6px; border-radius: 3px; color: #e83e8c; font-weight: bold;">explanation</code> - обяснение на правилния отговор</li>
                    </ul>
                </div>
                
                <div style="background: #ffffff; border: 1px solid #e1e5e9; border-radius: 8px; overflow: hidden;">
                    <div style="background: #f1f3f4; padding: 12px 20px; border-bottom: 1px solid #e1e5e9; display: flex; align-items: center;">
                        <span style="font-weight: bold; color: #5f6368; font-size: 14px;">Примерен JSON формат</span>
                        <button onclick="copyJsonExample()" class="copy-json-btn">
                            <i class="fas fa-copy"></i> Копирай
                        </button>
                    </div>
                    <pre style="background: #fafbfc; padding: 25px; margin: 0; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 14px; line-height: 1.6; text-align: left; overflow-x: auto; white-space: pre-wrap; color: #24292e;">${highlightedJson}</pre>
                </div>
                
                <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #28a745;">
                    <p style="margin: 0; font-size: 13px; color: #155724;"><strong>Съвет:</strong> Можете да копирате примерния код и да го редактирате с вашите въпроси.</p>
                </div>
            </div>
        `,
        width: '90%',
        confirmButtonText: 'Разбрах',
        confirmButtonColor: '#007acc',
        customClass: {
            popup: 'json-format-modal'
        }
    });
}

async function loadSettings() {
    // Load last login info
    const lastLogin = localStorage.getItem('admin_last_login');
    if (lastLogin) {
        document.getElementById('last-login').textContent = new Date(lastLogin).toLocaleString('bg-BG');
    }
    
    try {
        // Load settings from Supabase
        const siteSettings = await loadSettingsFromSupabase('site_settings') || {};
        const quizSettings = await loadSettingsFromSupabase('quiz_settings') || {};
        const securitySettings = await loadSettingsFromSupabase('security_settings') || {};
        
        // Apply site settings
        if (siteSettings.siteTitle) document.getElementById('site-title').value = siteSettings.siteTitle;
        
        // Apply quiz settings
        if (quizSettings.timeLimit) document.getElementById('quiz-time-limit').value = quizSettings.timeLimit;
        if (quizSettings.passingScore) document.getElementById('passing-score').value = quizSettings.passingScore;
        if (quizSettings.hasOwnProperty('showExplanations')) document.getElementById('show-explanations').checked = quizSettings.showExplanations;
        if (quizSettings.hasOwnProperty('randomizeQuestions')) document.getElementById('randomize-questions').checked = quizSettings.randomizeQuestions;
        
        // Apply security settings
        if (securitySettings.hasOwnProperty('sessionTimeout')) document.getElementById('session-timeout').checked = securitySettings.sessionTimeout;
        
        // Apply current site title to page if exists
        await applySiteTitleSettings();
        
    } catch (error) {
        console.error('Error loading settings from Supabase, falling back to localStorage:', error);
        
        // Fallback to localStorage
    const siteSettings = JSON.parse(localStorage.getItem('admin_settings_site') || '{}');
    const quizSettings = JSON.parse(localStorage.getItem('admin_settings_quiz') || '{}');
    const securitySettings = JSON.parse(localStorage.getItem('admin_settings_security') || '{}');
    
    // Apply site settings
    if (siteSettings.siteTitle) document.getElementById('site-title').value = siteSettings.siteTitle;
    
    // Apply quiz settings
    if (quizSettings.timeLimit) document.getElementById('quiz-time-limit').value = quizSettings.timeLimit;
    if (quizSettings.passingScore) document.getElementById('passing-score').value = quizSettings.passingScore;
    if (quizSettings.hasOwnProperty('showExplanations')) document.getElementById('show-explanations').checked = quizSettings.showExplanations;
    if (quizSettings.hasOwnProperty('randomizeQuestions')) document.getElementById('randomize-questions').checked = quizSettings.randomizeQuestions;
    
    // Apply security settings
    if (securitySettings.hasOwnProperty('sessionTimeout')) document.getElementById('session-timeout').checked = securitySettings.sessionTimeout;
    
    // Apply current site title to page if exists
    await applySiteTitleSettings();
    }
}

async function applySiteTitleSettings() {
    try {
        // Try to load from Supabase first
        const siteSettings = await loadSettingsFromSupabase('site_settings') || {};
        
    if (siteSettings.siteTitle) {
        updateSiteTitles(siteSettings.siteTitle);
            return;
        }
    } catch (error) {
        console.error('Error loading site settings from Supabase:', error);
    }
    
    // Fallback to localStorage
    const localSiteSettings = JSON.parse(localStorage.getItem('admin_settings_site') || '{}');
    if (localSiteSettings.siteTitle) {
        updateSiteTitles(localSiteSettings.siteTitle);
    }
}

function updateSiteTitles(newTitle) {
    // Update admin panel title
    document.title = newTitle + ' - Админ панел';
    
    // Update header title if it exists in admin panel
    const adminHeaderTitle = document.querySelector('h1 a');
    if (adminHeaderTitle) {
        adminHeaderTitle.textContent = newTitle;
    }
    
    // Try to update main site titles (if accessible)
    updateMainSiteTitles(newTitle);
}

function updateMainSiteTitles(newTitle) {
    // Create or update main site title files for next load
    try {
        // Store in localStorage for main site to read
        localStorage.setItem('main_site_title', newTitle);
        
        // Try to update main site immediately if in same origin
        if (window.opener) {
            try {
                window.opener.document.title = newTitle;
                const mainHeader = window.opener.document.querySelector('h1 a');
                if (mainHeader) {
                    mainHeader.textContent = newTitle;
                }
            } catch (e) {
                // Cross-origin blocked, ignore
            }
        }
        
        // Also try parent window
        if (window.parent && window.parent !== window) {
            try {
                window.parent.document.title = newTitle;
                const parentHeader = window.parent.document.querySelector('h1 a');
                if (parentHeader) {
                    parentHeader.textContent = newTitle;
                }
            } catch (e) {
                // Cross-origin blocked, ignore
            }
        }
        
        // Broadcast change to other windows on same origin
        try {
            window.localStorage.setItem('title_update_timestamp', Date.now().toString());
            
            // Listen for storage events to sync across tabs
            if (!window.titleUpdateListenerAdded) {
                window.addEventListener('storage', function(e) {
                    if (e.key === 'main_site_title') {
                        // Another admin tab updated the title
                        applySiteTitleSettings();
                    }
                });
                window.titleUpdateListenerAdded = true;
            }
        } catch (error) {
            // Silent error handling
        }
        
    } catch (error) {
        // Silent error handling
    }
}

async function initializeSettings() {
    try {
        // Check if settings exist
        const { data: existingSettings, error: checkError } = await supabase
            .from('quiz_settings')
            .select('setting_key')
            .limit(1);

        if (checkError) {
            console.log('Settings table might not exist, skipping initialization');
            return;
        }

        // Default settings
        const defaultSettings = [
            {
                setting_key: 'site_settings',
                setting_value: { siteTitle: 'Кибертормоз и Дигитална Етика' },
                description: 'Настройки на сайта'
            },
            {
                setting_key: 'quiz_settings',
                setting_value: { 
                    timeLimit: 15, 
                    passingScore: 70, 
                    showExplanations: true, 
                    randomizeQuestions: false 
                },
                description: 'Настройки на теста'
            },
            {
                setting_key: 'security_settings',
                setting_value: { sessionTimeout: true },
                description: 'Настройки за сигурност'
            }
        ];

        // Insert default settings if they don't exist
        for (const setting of defaultSettings) {
            const { data: existing } = await supabase
                .from('quiz_settings')
                .select('id')
                .eq('setting_key', setting.setting_key)
                .single();

            if (!existing) {
                await supabase
                    .from('quiz_settings')
                    .insert([setting]);
                console.log(`Initialized ${setting.setting_key}`);
            }
        }

    } catch (error) {
        console.error('Error initializing settings:', error);
    }
}

// JSON Writer Functions
let jsonEditorData = [];

function loadJsonTemplate() {
    const template = [
        {
            "question": "Какво е кибертормоз?",
            "options": [
                "Използване на технологии за тормозене",
                "Хакерска атака",
                "Компютърен вирус",
                "Програмен език"
            ],
            "correct": 0,
            "category": "definition",
            "explanation": "Кибертормозът е използването на дигитални технологии за тормозене, заплашване или унижение на други хора."
        },
        {
            "question": "Кой от следните е пример за кибертормоз?",
            "options": [
                "Изпращане на насърчителни съобщения",
                "Споделяне на снимки без разрешение",
                "Играене на онлайн игри",
                "Четене на новини"
            ],
            "correct": 1,
            "category": "types",
            "explanation": "Споделянето на лични снимки без разрешение е форма на кибертормоз."
        }
    ];
    
    if (jsonEditor) {
        jsonEditor.setValue(JSON.stringify(template, null, 2));
    } else {
        const editor = document.getElementById('json-editor');
        if (editor) {
            editor.value = JSON.stringify(template, null, 2);
        }
    }
}

// Basic JSON syntax highlighting function
let jsonEditor;

function addJsonSyntaxHighlighting(editorElement) {
    // Initialize CodeMirror for JSON syntax highlighting
    jsonEditor = CodeMirror(function(elt) {
        editorElement.parentNode.replaceChild(elt, editorElement);
    }, {
        mode: 'application/json',
        theme: 'default',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        placeholder: "Въведете JSON с въпроси тук...\n\nПример:\n[\n  {\n    \"question\": \"Въпрос?\",\n    \"options\": [\"А\", \"Б\", \"В\", \"Г\"],\n    \"correct\": 0,\n    \"category\": \"definition\",\n    \"explanation\": \"Обяснение\"\n  }\n]",
        extraKeys: {
            "Ctrl-Space": "autocomplete",
            "Tab": function(cm) {
                cm.replaceSelection("  ", "end");
            }
        }
    });
    
    // Style the CodeMirror instance
    jsonEditor.setSize("100%", "450px");
    
    // Add custom CSS class
    jsonEditor.getWrapperElement().classList.add('json-editor-codemirror');
    
    // Add event listeners
    jsonEditor.on('change', function(instance) {
        const value = instance.getValue();
        applyJsonValidationToCodeMirror(instance, value);
        
        // Update validation functions to work with CodeMirror
        const statusElement = document.getElementById('json-status');
        const countElement = document.getElementById('json-count');
        const saveBtn = document.querySelector('.save-json-btn');
        
        try {
            if (!value.trim()) {
                statusElement.textContent = 'Въведете JSON данни';
                statusElement.className = 'status-info';
                countElement.textContent = '0 въпроса';
                saveBtn.disabled = true;
                updateJsonPreview([]);
                return;
            }
            
            const data = JSON.parse(value);
            if (!Array.isArray(data)) {
                throw new Error('JSON трябва да е масив от въпроси');
            }
            
            // Validate questions (same logic as before)
            const validQuestions = [];
            for (let i = 0; i < data.length; i++) {
                const q = data[i];
                if (!q.question || !q.options || !Array.isArray(q.options) || 
                    !q.hasOwnProperty('correct') || !q.category || !q.explanation) {
                    throw new Error(`Въпрос ${i + 1}: Невалидна структура`);
                }
                
                if (q.options.length < 2) {
                    throw new Error(`Въпрос ${i + 1}: Трябват поне 2 опции`);
                }
                
                if (q.correct < 0 || q.correct >= q.options.length) {
                    throw new Error(`Въпрос ${i + 1}: Невалиден правилен отговор`);
                }
                
                const validCategories = ['definition', 'types', 'protection', 'legal', 'ethics'];
                if (!validCategories.includes(q.category)) {
                    throw new Error(`Въпрос ${i + 1}: Невалидна категория (${q.category})`);
                }
                
                validQuestions.push(q);
            }
            
            jsonEditorData = validQuestions;
            statusElement.textContent = 'JSON е валиден';
            statusElement.className = 'status-info valid';
            countElement.textContent = `${validQuestions.length} въпроса`;
            saveBtn.disabled = false;
            
            updateJsonPreview(validQuestions);
            
        } catch (error) {
            statusElement.textContent = `Грешка: ${error.message}`;
            statusElement.className = 'status-info invalid';
            countElement.textContent = '0 въпроса';
            saveBtn.disabled = true;
            updateJsonPreview([]);
        }
    });
}

function applyJsonValidationToCodeMirror(instance, content) {
    // Remove existing validation classes
    instance.getWrapperElement().classList.remove('json-valid', 'json-invalid');
    
    if (!content.trim()) {
        return;
    }
    
    try {
        JSON.parse(content);
        instance.getWrapperElement().classList.add('json-valid');
    } catch (e) {
        instance.getWrapperElement().classList.add('json-invalid');
    }
}

// Syntax highlighting functions removed - using simplified CSS approach instead

function applyJsonValidation(editor) {
    // This creates a visual validation effect using CSS classes
    const content = editor.value;
    
    // Remove existing validation classes
    editor.classList.remove('json-valid', 'json-invalid');
    
    if (!content.trim()) {
        return;
    }
    
    try {
        JSON.parse(content);
        editor.classList.add('json-valid');
    } catch (e) {
        editor.classList.add('json-invalid');
    }
}

function validateJson() {
    if (jsonEditor) {
        // CodeMirror validation is handled in the change event
        return;
    }
    
    // Fallback for non-CodeMirror editor
    const editor = document.getElementById('json-editor');
    if (!editor) return;
    
    const statusElement = document.getElementById('json-status');
    const countElement = document.getElementById('json-count');
    const saveBtn = document.querySelector('.save-json-btn');
    
    try {
        const jsonText = editor.value.trim();
        
        if (!jsonText) {
            statusElement.textContent = 'Въведете JSON данни';
            statusElement.className = 'status-info';
            countElement.textContent = '0 въпроса';
            saveBtn.disabled = true;
            updateJsonPreview([]);
            return;
        }
        
        const data = JSON.parse(jsonText);
        
        if (!Array.isArray(data)) {
            throw new Error('JSON трябва да е масив от въпроси');
        }
        
        // Validate question structure
        const validQuestions = [];
        for (let i = 0; i < data.length; i++) {
            const q = data[i];
            if (!q.question || !q.options || !Array.isArray(q.options) || 
                !q.hasOwnProperty('correct') || !q.category || !q.explanation) {
                throw new Error(`Въпрос ${i + 1}: Невалидна структура`);
            }
            
            if (q.options.length < 2) {
                throw new Error(`Въпрос ${i + 1}: Трябват поне 2 опции`);
            }
            
            if (q.correct < 0 || q.correct >= q.options.length) {
                throw new Error(`Въпрос ${i + 1}: Невалиден правилен отговор`);
            }
            
            const validCategories = ['definition', 'types', 'protection', 'legal', 'ethics'];
            if (!validCategories.includes(q.category)) {
                throw new Error(`Въпрос ${i + 1}: Невалидна категория (${q.category})`);
            }
            
            validQuestions.push(q);
        }
        
        jsonEditorData = validQuestions;
        statusElement.textContent = 'JSON е валиден';
        statusElement.className = 'status-info valid';
        countElement.textContent = `${validQuestions.length} въпроса`;
        saveBtn.disabled = false;
        
        updateJsonPreview(validQuestions);
        
    } catch (error) {
        statusElement.textContent = `Грешка: ${error.message}`;
        statusElement.className = 'status-info invalid';
        countElement.textContent = '0 въпроса';
        saveBtn.disabled = true;
        updateJsonPreview([]);
    }
}

function updateJsonPreview(questions) {
    const previewElement = document.getElementById('json-preview');
    
    if (questions.length === 0) {
        previewElement.innerHTML = '<p class="preview-placeholder">Въведете валиден JSON за да видите превюто</p>';
        return;
    }
    
    const categoryNames = {
        definition: "Определения и характеристики",
        types: "Видове кибертормоз",
        protection: "Превенция и защита",
        legal: "Правни аспекти",
        ethics: "Дигитална етика"
    };
    
    let html = '';
    questions.forEach((q, index) => {
        html += `
            <div class="preview-question">
                <div class="preview-category">${categoryNames[q.category] || q.category}</div>
                <h5>${index + 1}. ${q.question}</h5>
                <ul class="preview-options">
                    ${q.options.map((option, optIndex) => 
                        `<li class="${optIndex === q.correct ? 'correct' : ''}">${String.fromCharCode(65 + optIndex)}. ${option}</li>`
                    ).join('')}
                </ul>
                <div class="preview-explanation">
                    <strong>Обяснение:</strong> ${q.explanation}
                </div>
            </div>
        `;
    });
    
    previewElement.innerHTML = html;
}

function clearJsonEditor() {
    if (jsonEditor) {
        jsonEditor.setValue('');
    }
}

async function saveJsonQuestions() {
    if (jsonEditorData.length === 0) {
        Swal.fire({
            title: 'Грешка!',
            text: 'Няма валидни въпроси за запазване.',
            icon: 'error',
            confirmButtonColor: '#007acc'
        });
        return;
    }
    
    const result = await Swal.fire({
        title: 'Потвърдете запазването',
        text: `Искате ли да запазите ${jsonEditorData.length} въпроса в базата данни?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Да, запази',
        cancelButtonText: 'Отказ'
    });
    
    if (!result.isConfirmed) return;
    
    const saveBtn = document.querySelector('.save-json-btn');
    const originalText = saveBtn.innerHTML;
    
    saveBtn.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <div class="spinner" style="width: 16px; height: 16px; margin: 0;">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>
            Запазване...
        </div>
    `;
    saveBtn.disabled = true;
    
    try {
        let savedCount = 0;
        let errorCount = 0;
        
        for (const question of jsonEditorData) {
            try {
                if (supabase) {
                    await supabase
                        .from('quiz_questions')
                        .insert([question]);
                } else {
                    // Fallback to localStorage
                    const existingQuestions = JSON.parse(localStorage.getItem('quiz_questions') || '[]');
                    existingQuestions.push(question);
                    localStorage.setItem('quiz_questions', JSON.stringify(existingQuestions));
                }
                savedCount++;
            } catch (error) {
                console.error('Error saving question:', error);
                errorCount++;
            }
        }
        
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
        
        if (errorCount === 0) {
            Swal.fire({
                title: 'Успех!',
                text: `Всички ${savedCount} въпроса бяха запазени успешно.`,
                icon: 'success',
                confirmButtonColor: '#28a745'
            });
            
            // Clear editor
            clearJsonEditor();
            
            // Reload questions in tests section if it's loaded
            if (currentSection === 'tests') {
                setTimeout(() => {
                    loadQuestions();
                }, 1000);
            }
        } else {
            Swal.fire({
                title: 'Частичен успех',
                text: `${savedCount} въпроса запазени, ${errorCount} грешки.`,
                icon: 'warning',
                confirmButtonColor: '#ffc107'
            });
        }
        
    } catch (error) {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
        
        Swal.fire({
            title: 'Грешка!',
            text: 'Възникна грешка при запазването на въпросите.',
            icon: 'error',
            confirmButtonColor: '#dc3545'
        });
    }
}

function showJsonExamples() {
    Swal.fire({
        title: 'JSON Примери',
        html: `
            <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                <h4>Структура на въпрос:</h4>
                <pre style="background: #f8f9fa; padding: 15px; border-radius: 6px; font-size: 12px; text-align: left; overflow-x: auto;">
{
  "question": "Текст на въпроса",
  "options": [
    "Опция 1",
    "Опция 2", 
    "Опция 3",
    "Опция 4"
  ],
  "correct": 0,
  "category": "definition",
  "explanation": "Обяснение на правилния отговор"
}</pre>
                
                <h4>Валидни категории:</h4>
                <ul style="margin: 10px 0; text-align: left;">
                    <li><code>definition</code> - Определения и характеристики</li>
                    <li><code>types</code> - Видове кибертормоз</li>
                    <li><code>protection</code> - Превенция и защита</li>
                    <li><code>legal</code> - Правни аспекти</li>
                    <li><code>ethics</code> - Дигитална етика</li>
                </ul>
                
                <h4>Важни забележки:</h4>
                <ul style="margin: 10px 0; text-align: left;">
                    <li><code>correct</code> е индекс (започва от 0)</li>
                    <li>Трябват поне 2 опции</li>
                    <li>Всички полета са задължителни</li>
                    <li>JSON трябва да е масив от въпроси</li>
                </ul>
            </div>
        `,
        width: '700px',
        confirmButtonText: 'Разбрах',
        confirmButtonColor: '#007acc'
    });
}

// Show locked message for quiz settings
function showLockedMessage() {
    Swal.fire({
        title: 'Функцията е заключена',
        text: 'Настройките на теста са временно неактивни и са в процес на разработка.',
        icon: 'info',
        confirmButtonText: 'Разбрах',
        confirmButtonColor: '#6c757d',
        showClass: {
            popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp animate__faster'
        }
    });
}

// Add event listener for JSON editor
document.addEventListener('DOMContentLoaded', function() {
    const jsonEditor = document.getElementById('json-editor');
    if (jsonEditor) {
        jsonEditor.addEventListener('input', validateJson);
    }
});