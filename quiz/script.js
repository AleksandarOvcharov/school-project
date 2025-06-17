// Quiz script loaded

// Quiz questions data - will be loaded from database
let quizData = [
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

// Quiz state
let currentQuestion = 0;
let userAnswers = [];
let quizStarted = false;
let quizCompleted = false;
let quizTimer = null;
let timeRemaining = 0;

// Quiz settings from admin panel
let quizSettings = {
    timeLimit: 15, // minutes
    passingScore: 70, // percentage
    showExplanations: true,
    randomizeQuestions: false
};

// Category tracking
const categories = {
    definition: "Определения и характеристики",
    types: "Видове кибертормоз", 
    protection: "Превенция и защита",
    legal: "Правни аспекти",
    ethics: "Дигитална етика"
};

// DOM elements
const quizSections = {
    info: document.getElementById('quiz-info'),
    questions: document.getElementById('quiz-questions'),
    results: document.getElementById('quiz-results'),
    review: document.getElementById('quiz-review')
};

const elements = {
    startBtn: document.getElementById('start-quiz'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    submitBtn: document.getElementById('submit-btn'),
    retryBtn: document.getElementById('retry-quiz'),
    reviewBtn: document.getElementById('review-answers'),
    backToResultsBtn: document.getElementById('back-to-results'),
    
    progressBar: document.getElementById('progress'),
    questionCounter: document.getElementById('current-question'),
    totalQuestions: document.getElementById('total-questions'),
    questionText: document.getElementById('question-text'),
    answersContainer: document.getElementById('answers-container'),
    
    scorePercentage: document.getElementById('score-percentage'),
    scoreText: document.getElementById('score-text'),
    categoriesBreakdown: document.getElementById('categories-breakdown'),
    reviewContainer: document.getElementById('review-container')
};

// Supabase client
let quizSupabase;

// Load header and footer components
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
        
        return true;
    } catch (error) {
        return false;
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
        // Special case for quiz page
        if (currentPath.includes('/quiz') && href && href.includes('/quiz')) {
            link.classList.add('active');
        }
    });
}

// Function to load site title from Supabase
async function loadSiteTitleFromSupabase() {
    try {
        if (!quizSupabase) return null;
        
        const { data, error } = await quizSupabase
            .from('quiz_settings')
            .select('setting_value')
            .eq('setting_key', 'site_settings')
            .single();

        if (!error && data && data.setting_value && data.setting_value.siteTitle) {
            return data.setting_value.siteTitle;
        }
    } catch (error) {
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
            document.title = savedTitle + ' - Тест';
            
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
            document.title = savedTitle + ' - Тест';
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

// Periodic settings check interval
let settingsCheckInterval = null;
let lastSettingsHash = null;

// Add function to reload quiz settings and update UI from database
async function reloadQuizSettingsFromDB() {
    try {
        
        if (!quizSupabase) {
            return;
        }
        
        // Fetch latest settings from database
        const { data: settingsData, error: settingsError } = await quizSupabase
            .from('quiz_settings')
            .select('setting_value, updated_at')
            .eq('setting_key', 'quiz_settings')
            .single();

        if (settingsError) {
        }

        // Also fetch latest questions to get current count
        const { data: questionsData, error: questionsError } = await quizSupabase
            .from('quiz_questions')
            .select('*')
            .order('created_at', { ascending: true });


        let settingsChanged = false;
        let questionsChanged = false;

        // Check if settings changed
        if (settingsData && settingsData.setting_value) {
            const newSettingsHash = JSON.stringify(settingsData.setting_value);
            
            if (lastSettingsHash && lastSettingsHash !== newSettingsHash) {
                
                // Update quiz settings
                const settings = settingsData.setting_value;
                
                if (settings.timeLimit) quizSettings.timeLimit = parseInt(settings.timeLimit);
                if (settings.passingScore) quizSettings.passingScore = parseInt(settings.passingScore);
                if (settings.hasOwnProperty('showExplanations')) quizSettings.showExplanations = settings.showExplanations;
                if (settings.hasOwnProperty('randomizeQuestions')) quizSettings.randomizeQuestions = settings.randomizeQuestions;
                
                settingsChanged = true;
                
                // Update the settings display
                updateQuizSettingsDisplay();
            } else if (!lastSettingsHash) {
                // First time loading, force update
                settingsChanged = true;
            }
            
            lastSettingsHash = newSettingsHash;
        }

        // Check if questions changed (new count or first load)
        if (!questionsError && questionsData) {
            if (questionsData.length !== quizData.length || quizData.length === 0) {
                
                // Update questions data
                quizData = questionsData.map(item => ({
                    question: item.question,
                    options: item.options,
                    correct: item.correct,
                    category: item.category,
                    explanation: item.explanation
                }));
                
                questionsChanged = true;
            }
        }

        // Update UI if anything changed or if this is the first load
        if (settingsChanged || questionsChanged) {
            // Quiz info display removed
            
            // Always update total questions display when questions change
            if (questionsChanged) {
                elements.totalQuestions.textContent = quizData.length;
            }
            
            // If quiz hasn't started yet, apply changes
            if (!quizStarted) {
                // Apply randomization if setting changed
                if (quizSettings.randomizeQuestions) {
                    shuffleArray(quizData);
                }
            }
        } else {
        }
    } catch (error) {
    }
}

// Start periodic checking for settings updates
function startSettingsMonitoring() {
    if (settingsCheckInterval) {
        clearInterval(settingsCheckInterval);
    }
    
    // Check every 5 seconds for settings changes
    settingsCheckInterval = setInterval(reloadQuizSettingsFromDB, 5000);
}

// Stop periodic checking
function stopSettingsMonitoring() {
    if (settingsCheckInterval) {
        clearInterval(settingsCheckInterval);
        settingsCheckInterval = null;
    }
}

// Initialize quiz
document.addEventListener('DOMContentLoaded', async function() {
    // Load header and footer components first
    const basePath = '../components/';
    await loadComponent('header-component', basePath + 'header.html');
    await loadComponent('footer-component', basePath + 'footer.html');
    
    // Wait for env-loader to complete
    let envWaitAttempts = 0;
    const maxEnvWaitAttempts = 30; // Wait up to 3 seconds
    
    while (!window.supabaseManager && envWaitAttempts < maxEnvWaitAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        envWaitAttempts++;
    }
    
    // Initialize Supabase for quiz
    try {
        await initializeQuizSupabase();
    } catch (error) {
    }
    
    // Apply saved title after header is loaded
    await applySavedSiteTitle();
    
    // Load admin settings first
    await loadQuizSettings();
    
    // Load questions from database
    await loadQuizQuestions();
    
    // Apply randomization if enabled (after questions are loaded)
    if (quizSettings.randomizeQuestions) {
        shuffleArray(quizData);
    }
    
    setupEventListeners();
    
        // Start monitoring settings changes from database
    if (quizSupabase) {
        // Do initial check for any changes (this will update everything)
        await reloadQuizSettingsFromDB();
        startSettingsMonitoring();
    } else {
        // If no Supabase, still update UI with current data
        elements.totalQuestions.textContent = quizData.length;
        // Quiz info display removed
    }
});

// Wait for header component to load


async function initializeQuizSupabase() {
    try {
        
        // Wait for env-loader to be ready if not yet available
        if (!window.supabaseManager && window.envLoader) {
            
            // Wait a bit for env-loader to set up supabaseManager
            let attempts = 0;
            const maxAttempts = 20; // Wait up to 2 seconds
            
            while (!window.supabaseManager && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
        }
        
        // Use global Supabase manager to prevent multiple instances
        if (window.supabaseManager) {
            quizSupabase = await window.supabaseManager.initialize();
            
            if (quizSupabase) {
                
                // Test the connection with a simple query
                try {
                    const { data, error } = await quizSupabase
                        .from('quiz_settings')
                        .select('id')
                        .limit(1);
                    
                    if (error) {
                    } else {
                    }
                } catch (testError) {
                }
            } else {
            }
        } else {
        }
    } catch (error) {
        // Environment not available or Supabase not available, use fallback data
    }
}

async function loadQuizSettings() {
    try {
        let settingsLoaded = false;
        
        // Try to load from Supabase first
        if (quizSupabase) {
            const { data, error } = await quizSupabase
                .from('quiz_settings')
                .select('setting_value')
                .eq('setting_key', 'quiz_settings')
                .single();


            if (!error && data && data.setting_value) {
                const settings = data.setting_value;
                
                if (settings.timeLimit) quizSettings.timeLimit = parseInt(settings.timeLimit);
                if (settings.passingScore) quizSettings.passingScore = parseInt(settings.passingScore);
                if (settings.hasOwnProperty('showExplanations')) quizSettings.showExplanations = settings.showExplanations;
                if (settings.hasOwnProperty('randomizeQuestions')) quizSettings.randomizeQuestions = settings.randomizeQuestions;
                
                settingsLoaded = true;
                
                // Initialize settings hash for change detection
                lastSettingsHash = JSON.stringify(settings);
            } else {
            }
        }
        
        // Fallback to localStorage if Supabase failed
        if (!settingsLoaded) {
            const savedSettings = localStorage.getItem('admin_settings_quiz');
            
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                
                if (settings.timeLimit) quizSettings.timeLimit = parseInt(settings.timeLimit);
                if (settings.passingScore) quizSettings.passingScore = parseInt(settings.passingScore);
                if (settings.hasOwnProperty('showExplanations')) quizSettings.showExplanations = settings.showExplanations;
                if (settings.hasOwnProperty('randomizeQuestions')) quizSettings.randomizeQuestions = settings.randomizeQuestions;
                
            } else {
            }
        }
    } catch (error) {
        // Use default settings if error
    }
    
    // Update the display after loading settings
    updateQuizSettingsDisplay();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateQuizSettingsDisplay() {
    try {
        // Update time limit
        const timeLimitElement = document.getElementById('display-time-limit');
        if (timeLimitElement) {
            timeLimitElement.textContent = `${quizSettings.timeLimit} минути`;
        }
        
        // Update passing score
        const passingScoreElement = document.getElementById('display-passing-score');
        if (passingScoreElement) {
            passingScoreElement.textContent = `${quizSettings.passingScore}%`;
        }
        
        // Update explanations setting
        const explanationsElement = document.getElementById('display-explanations');
        if (explanationsElement) {
            explanationsElement.textContent = quizSettings.showExplanations ? 'Показват се' : 'Скрити';
        }
        
        // Update randomize setting
        const randomizeElement = document.getElementById('display-randomize');
        if (randomizeElement) {
            randomizeElement.textContent = quizSettings.randomizeQuestions ? 'Разбъркани' : 'По ред';
        }
        
    } catch (error) {
    }
}

// updateQuizInfoDisplay function removed

async function loadQuizQuestions() {
    try {
        
        if (!quizSupabase) {
            return; // Use fallback data already in quizData
        }
        
        const { data, error } = await quizSupabase
            .from('quiz_questions')
            .select('*')
            .order('created_at', { ascending: true });
        
        
        if (error) {
            throw error;
        }
        
        if (data && data.length > 0) {
            
            // Transform database format to quiz format
            quizData = data.map(item => ({
                question: item.question,
                options: item.options,
                correct: item.correct,
                category: item.category,
                explanation: item.explanation
            }));
            
        } else {
        }
        
        // Update total questions display
        elements.totalQuestions.textContent = quizData.length;
        
    } catch (error) {
        
        // Update total questions display with fallback data
        elements.totalQuestions.textContent = quizData.length;
    }
}

function setupEventListeners() {
    elements.startBtn.addEventListener('click', startQuiz);
    elements.prevBtn.addEventListener('click', previousQuestion);
    elements.nextBtn.addEventListener('click', nextQuestion);
    elements.submitBtn.addEventListener('click', submitQuiz);
    elements.retryBtn.addEventListener('click', retryQuiz);
    elements.reviewBtn.addEventListener('click', showReview);
    elements.backToResultsBtn.addEventListener('click', showResults);
}

function startQuiz() {
    quizStarted = true;
    currentQuestion = 0;
    userAnswers = [];
    
    // Debug: Show current quiz settings when starting
    
    // Stop monitoring settings during quiz
    stopSettingsMonitoring();
    
    // Initialize timer
    timeRemaining = quizSettings.timeLimit * 60; // Convert minutes to seconds
    startTimer();
    
    showSection('questions');
    displayQuestion();
}

function showSection(sectionName) {
    // Hide all sections
    Object.values(quizSections).forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    quizSections[sectionName].classList.add('active');
}

function displayQuestion() {
    const question = quizData[currentQuestion];
    
    // Update progress
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    elements.progressBar.style.width = progress + '%';
    elements.questionCounter.textContent = currentQuestion + 1;
    
    // Display question
    elements.questionText.textContent = question.question;
    
    // Create answer options
    elements.answersContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        answerDiv.innerHTML = `
            <input type="radio" name="answer" value="${index}" id="answer-${index}">
            <label for="answer-${index}" class="answer-label">${option}</label>
        `;
        
        // Add click handler
        answerDiv.addEventListener('click', () => selectAnswer(index));
        elements.answersContainer.appendChild(answerDiv);
    });
    
    // Restore previous answer if exists
    if (userAnswers[currentQuestion] !== undefined) {
        selectAnswer(userAnswers[currentQuestion]);
    }
    
    // Update button visibility
    elements.prevBtn.style.display = currentQuestion > 0 ? 'block' : 'none';
    elements.nextBtn.style.display = currentQuestion < quizData.length - 1 ? 'block' : 'none';
    elements.submitBtn.style.display = currentQuestion === quizData.length - 1 ? 'block' : 'none';
}

function selectAnswer(answerIndex) {
    // Remove previous selection
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
        option.querySelector('input').checked = false;
    });
    
    // Select new answer
    const selectedOption = document.querySelectorAll('.answer-option')[answerIndex];
    selectedOption.classList.add('selected');
    selectedOption.querySelector('input').checked = true;
    
    // Store answer
    userAnswers[currentQuestion] = answerIndex;
    
    // Enable next button
    elements.nextBtn.disabled = false;
    elements.submitBtn.disabled = false;
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        displayQuestion();
    }
}

function submitQuiz() {
    if (userAnswers.length !== quizData.length) {
        Swal.fire({
            title: 'Внимание!',
            text: 'Моля, отговорете на всички въпроси преди да завършите теста.',
            icon: 'warning',
            confirmButtonText: 'Разбрах',
            confirmButtonColor: '#007acc',
            background: '#ffffff',
            color: '#333333'
        });
        return;
    }
    
    stopTimer();
    quizCompleted = true;
    calculateResults();
    showSection('results');
}

function calculateResults() {
    // Calculate total score
    let correctAnswers = 0;
    const categoryScores = {};
    
    // Initialize category scores
    Object.keys(categories).forEach(cat => {
        categoryScores[cat] = { correct: 0, total: 0 };
    });
    
    // Calculate scores
    userAnswers.forEach((answer, index) => {
        const question = quizData[index];
        const isCorrect = answer === question.correct;
        
        if (isCorrect) correctAnswers++;
        
        // Track by category
        const category = question.category;
        categoryScores[category].total++;
        if (isCorrect) categoryScores[category].correct++;
    });
    
    // Display overall score
    const percentage = Math.round((correctAnswers / quizData.length) * 100);
    elements.scorePercentage.textContent = percentage + '%';
    
    // Score interpretation based on admin settings
    let scoreText = '';
    const passingScore = quizSettings.passingScore;
    
    if (percentage >= 90) {
        scoreText = 'Отлично! Имате много добри познания за кибертормоза и дигиталната етика.';
    } else if (percentage >= passingScore) {
        scoreText = `Много добре! Преминахте теста с резултат над минималния праг от ${passingScore}%.`;
    } else if (percentage >= passingScore - 20) {
        scoreText = `Добре! Близо сте до преминаване, но се нуждаете от резултат над ${passingScore}%.`;
    } else {
        scoreText = `За да преминете теста, се нуждаете от минимум ${passingScore}%. Препоръчваме да изучите повече материала.`;
    }
    
    elements.scoreText.textContent = `${correctAnswers} от ${quizData.length} правилни отговора. ${scoreText}`;
    
    // Display category breakdown
    displayCategoryBreakdown(categoryScores);
    
    // Show/hide review button based on settings
    const reviewBtn = document.getElementById('review-answers');
    if (reviewBtn) {
        reviewBtn.style.display = quizSettings.showExplanations ? 'block' : 'none';
    }
}

function displayCategoryBreakdown(categoryScores) {
    elements.categoriesBreakdown.innerHTML = '';
    
    Object.entries(categoryScores).forEach(([catKey, scores]) => {
        if (scores.total === 0) return;
        
        const percentage = Math.round((scores.correct / scores.total) * 100);
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-result';
        
        let scoreClass = 'poor';
        if (percentage >= 90) scoreClass = 'excellent';
        else if (percentage >= 70) scoreClass = 'good';
        else if (percentage >= 50) scoreClass = 'needs-improvement';
        
        categoryDiv.innerHTML = `
            <span class="category-name">${categories[catKey]}</span>
            <span class="category-score ${scoreClass}">${scores.correct}/${scores.total} (${percentage}%)</span>
        `;
        
        elements.categoriesBreakdown.appendChild(categoryDiv);
    });
}

function showReview() {
    showSection('review');
    displayReview();
}

function displayReview() {
    elements.reviewContainer.innerHTML = '';
    
    quizData.forEach((question, index) => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review-question';
        
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;
        
        reviewDiv.innerHTML = `
            <div class="review-question-text">Въпрос ${index + 1}: ${question.question}</div>
            <div class="review-answers">
                ${question.options.map((option, optIndex) => {
                    let answerClass = 'neutral';
                    if (optIndex === question.correct) {
                        answerClass = 'correct';
                    } else if (optIndex === userAnswer && !isCorrect) {
                        answerClass = 'incorrect';
                    }
                    
                    const prefix = optIndex === userAnswer ? 'Вашият отговор: ' : 
                                 optIndex === question.correct ? 'Правилен отговор: ' : '';
                    
                    return `<div class="review-answer ${answerClass}">${prefix}${option}</div>`;
                }).join('')}
            </div>
            ${quizSettings.showExplanations ? `<div class="answer-explanation">${question.explanation}</div>` : ''}
        `;
        
        elements.reviewContainer.appendChild(reviewDiv);
    });
}

function showResults() {
    showSection('results');
}

function startTimer() {
    // Update timer display initially
    updateTimerDisplay();
    
    // Clear any existing timer
    if (quizTimer) {
        clearInterval(quizTimer);
    }
    
    // Start countdown
    quizTimer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        // Check if time is up
        if (timeRemaining <= 0) {
            timeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const displayTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const timerElement = document.getElementById('time-remaining');
    if (timerElement) {
        timerElement.textContent = displayTime;
        
        // Add warning classes based on time remaining
        const timerContainer = document.getElementById('timer-display');
        if (timerContainer) {
            timerContainer.classList.remove('warning', 'danger');
            
            if (timeRemaining <= 60) { // Less than 1 minute
                timerContainer.classList.add('danger');
            } else if (timeRemaining <= 300) { // Less than 5 minutes
                timerContainer.classList.add('warning');
            }
        }
    }
}

function stopTimer() {
    if (quizTimer) {
        clearInterval(quizTimer);
        quizTimer = null;
    }
}

function timeUp() {
    stopTimer();
    
    Swal.fire({
        title: 'Времето изтече!',
        text: 'Теста ще бъде автоматично предаден.',
        icon: 'warning',
        confirmButtonText: 'Разбрах',
        confirmButtonColor: '#007acc',
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then(() => {
        // Submit quiz automatically
        quizCompleted = true;
        calculateResults();
        showSection('results');
    });
}

async function retryQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    quizStarted = false;
    quizCompleted = false;
    stopTimer();
    
    // Reload latest data when retrying
    if (quizSupabase) {
        await reloadQuizSettingsFromDB();
        startSettingsMonitoring();
    }
    
    showSection('info');
} 

 
