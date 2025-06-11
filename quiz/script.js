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
    // Initialize Supabase
    await initializeSupabase();
    
    // Load questions from database
    await loadQuizQuestions();
    
    setupEventListeners();
    elements.totalQuestions.textContent = quizData.length;
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
    
    // Score interpretation
    let scoreText = '';
    if (percentage >= 90) {
        scoreText = 'Отлично! Имате много добри познания за кибертормоза и дигиталната етика.';
    } else if (percentage >= 70) {
        scoreText = 'Много добре! Имате солидни знания, но има място за подобрение.';
    } else if (percentage >= 50) {
        scoreText = 'Добре! Имате основни знания, но препоръчваме да научите повече по темата.';
    } else {
        scoreText = 'Нуждаете се от повече информация за кибертормоза и дигиталната етика.';
    }
    
    elements.scoreText.textContent = `${correctAnswers} от ${quizData.length} правилни отговора. ${scoreText}`;
    
    // Display category breakdown
    displayCategoryBreakdown(categoryScores);
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
            <div class="answer-explanation">${question.explanation}</div>
        `;
        
        elements.reviewContainer.appendChild(reviewDiv);
    });
}

function showResults() {
    showSection('results');
}

function retryQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    quizStarted = false;
    quizCompleted = false;
    showSection('info');
} 