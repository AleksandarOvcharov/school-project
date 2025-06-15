// Quiz script loaded
console.log('🚀 Quiz script loaded successfully!');

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
let supabase;

// Initialize quiz
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Quiz initialization started...'); // Debug
    
    // Initialize Supabase
    await initializeSupabase();
    console.log('Supabase initialized'); // Debug
    
    // Load admin settings first
    await loadQuizSettings();
    console.log('Settings loaded:', quizSettings); // Debug
    
    // Load questions from database
    await loadQuizQuestions();
    console.log('Questions loaded, count:', quizData.length); // Debug
    
    // Apply randomization if enabled (after questions are loaded)
    if (quizSettings.randomizeQuestions) {
        shuffleArray(quizData);
        console.log('Questions shuffled'); // Debug
    }
    
    setupEventListeners();
    elements.totalQuestions.textContent = quizData.length;
    
    // Update UI with settings (after everything is loaded)
    console.log('Updating quiz info display...'); // Debug
    updateQuizInfoDisplay();
    console.log('Quiz initialization completed'); // Debug
});

async function initializeSupabase() {
    try {
        // Use same credentials as admin panel
        const SUPABASE_URL = 'https://rwlvgzbezcjdmwqidsvu.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bHZnemJlemNqZG13cWlkc3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NjUzNDIsImV4cCI6MjA2NTI0MTM0Mn0.wtr2Q4ueBH-rhZ6pHpdQm9qdOG5m8dhAczIKHvvHqqw';
        
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (error) {
        // Supabase not available, use fallback data
    }
}

async function loadQuizSettings() {
    try {
        console.log('Loading quiz settings from Supabase...'); // Debug
        
        // Try to load from Supabase first
        if (supabase) {
            const { data, error } = await supabase
                .from('quiz_settings')
                .select('setting_value')
                .eq('setting_key', 'quiz_settings')
                .single();

            if (!error && data && data.setting_value) {
                const settings = data.setting_value;
                console.log('Loaded settings from Supabase:', settings); // Debug
                
                if (settings.timeLimit) quizSettings.timeLimit = parseInt(settings.timeLimit);
                if (settings.passingScore) quizSettings.passingScore = parseInt(settings.passingScore);
                if (settings.hasOwnProperty('showExplanations')) quizSettings.showExplanations = settings.showExplanations;
                if (settings.hasOwnProperty('randomizeQuestions')) quizSettings.randomizeQuestions = settings.randomizeQuestions;
                
                console.log('Final quiz settings from Supabase:', quizSettings); // Debug
                return;
            }
        }
        
        // Fallback to localStorage
        console.log('Falling back to localStorage...'); // Debug
        const savedSettings = localStorage.getItem('admin_settings_quiz');
        console.log('Loading quiz settings from localStorage:', savedSettings); // Debug
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            console.log('Parsed settings from localStorage:', settings); // Debug
            
            if (settings.timeLimit) quizSettings.timeLimit = parseInt(settings.timeLimit);
            if (settings.passingScore) quizSettings.passingScore = parseInt(settings.passingScore);
            if (settings.hasOwnProperty('showExplanations')) quizSettings.showExplanations = settings.showExplanations;
            if (settings.hasOwnProperty('randomizeQuestions')) quizSettings.randomizeQuestions = settings.randomizeQuestions;
        }
        
        console.log('Final quiz settings:', quizSettings); // Debug
    } catch (error) {
        console.error('Error loading quiz settings:', error);
        // Use default settings if error
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateQuizInfoDisplay() {
    console.log('updateQuizInfoDisplay called'); // Debug
    console.log('Current quizSettings:', quizSettings); // Debug
    
    // Update info section with current settings
    const infoSection = document.querySelector('#quiz-info .quiz-details');
    console.log('Found infoSection:', infoSection); // Debug
    
    if (infoSection) {
        let randomizeInfo = '';
        if (quizSettings.randomizeQuestions) {
            randomizeInfo = '<div class="info-item"><strong>⚠️ Въпросите са разбъркани</strong></div>';
        }
        
        const htmlContent = `
            <div class="info-item">
                <strong>Брой въпроси:</strong> ${quizData.length}
            </div>
            <div class="info-item">
                <strong>Време за решаване:</strong> ${quizSettings.timeLimit} минути
            </div>
            <div class="info-item">
                <strong>Минимален резултат:</strong> ${quizSettings.passingScore}%
            </div>
            <div class="info-item">
                <strong>Обяснения:</strong> ${quizSettings.showExplanations ? 'Да' : 'Не'}
            </div>
            ${randomizeInfo}
        `;
        
        console.log('Setting innerHTML to:', htmlContent); // Debug
        infoSection.innerHTML = htmlContent;
        console.log('innerHTML set successfully'); // Debug
    } else {
        console.error('Could not find .quiz-details element!'); // Debug
        
        // Try alternative selector
        const altSection = document.querySelector('#quiz-info');
        console.log('Alternative quiz-info element:', altSection); // Debug
        
        if (altSection) {
            // Create the quiz-details div if it doesn't exist
            let detailsDiv = altSection.querySelector('.quiz-details');
            if (!detailsDiv) {
                detailsDiv = document.createElement('div');
                detailsDiv.className = 'quiz-details';
                altSection.appendChild(detailsDiv);
                console.log('Created quiz-details div'); // Debug
            }
            
            let randomizeInfo = '';
            if (quizSettings.randomizeQuestions) {
                randomizeInfo = '<div class="info-item"><strong>⚠️ Въпросите са разбъркани</strong></div>';
            }
            
            detailsDiv.innerHTML = `
                <div class="info-item">
                    <strong>Брой въпроси:</strong> ${quizData.length}
                </div>
                <div class="info-item">
                    <strong>Време за решаване:</strong> ${quizSettings.timeLimit} минути
                </div>
                <div class="info-item">
                    <strong>Минимален резултат:</strong> ${quizSettings.passingScore}%
                </div>
                <div class="info-item">
                    <strong>Обяснения:</strong> ${quizSettings.showExplanations ? 'Да' : 'Не'}
                </div>
                ${randomizeInfo}
            `;
            console.log('Used alternative method to set content'); // Debug
        }
    }
}

async function loadQuizQuestions() {
    try {
        if (!supabase) {
            return; // Use fallback data already in quizData
        }
        
        const { data, error } = await supabase
            .from('quiz_questions')
            .select('*')
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            // Transform database format to quiz format
            quizData = data.map(item => ({
                question: item.question,
                options: item.options,
                correct: item.correct,
                category: item.category,
                explanation: item.explanation
            }));
        }
    } catch (error) {
        // Use fallback data if database fails
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

function retryQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    quizStarted = false;
    quizCompleted = false;
    stopTimer();
    showSection('info');
}

 