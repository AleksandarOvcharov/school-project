// Cyberbullying Game Logic
class CyberbullyingGame {
    constructor() {
        this.score = 0;
        this.currentScenario = 0;
        this.gameEnded = false;
        this.isWaitingForChoice = false;
        
        // Game scenarios with multiple random variants
        this.scenarios = [
            {
                title: "Първи контакт",
                bullyMessages: [
                    ["Здравей", "Как си?"],
                    ["Хей", "Какво правиш?"],
                    ["Привет", "Скучаеш ли?"]
                ],
                escalation: [
                    ["Защо не отговаряш бързо?", "Не ме игнорирай!"],
                    ["Защо си толкова бавен?", "Мразя да чакам!"],
                    ["Отговаряй веднага!", "Не съм те питал дали имаш време!"]
                ],
                choices: [
                    { text: "Отговарям учтиво и обяснявам, че съм зает", type: "good", points: 10 },
                    { text: "Игнорирам съобщенията", type: "good", points: 15 },
                    { text: "Ти кой си че ми командваш?!", type: "bad", points: -5 },
                    { text: "Извинявам се и обяснявам", type: "neutral", points: 5 }
                ]
            },
            {
                title: "Започване на тормоз",
                bullyMessages: [
                    ["Виждам снимките ти", "Много си грозен"],
                    ["Погледнах профила ти", "Жалък си"],
                    ["Видях как изглеждаш", "Отвратителен си"]
                ],
                escalation: [
                    ["Всички се смеят на теб", "Нищожество си"],
                    ["Никой не те харесва", "Загубеняк си"],
                    ["Всички говорят колко си странен", "Никой не ще да е с теб"]
                ],
                choices: [
                    { text: "Блокирам незабавно", type: "good", points: 20 },
                    { text: "Правя снимка от екрана и сигнализирам", type: "good", points: 25 },
                    { text: "А ти си още по-грозен! Дебил такъв!", type: "bad", points: -10 },
                    { text: "Опитвам се да се защитя с думи", type: "neutral", points: 0 }
                ]
            },
            {
                title: "Заплахи",
                bullyMessages: [
                    ["Ще ти се отмъстя", "Знам къде живееш"],
                    ["Ще ти покажа аз", "Ще се видим скоро"],
                    ["Ще ти докажа кой съм", "Ще ти дам урок"]
                ],
                escalation: [
                    ["Ще кажа на всички какъв си", "Ще публикувам снимки"],
                    ["Ще те преследвам навсякъде", "Няма да имаш мира"],
                    ["Ще направя живота ти кошмар", "Ще съжаляваш че се роди"]
                ],
                choices: [
                    { text: "Запазвам доказателства и съобщавам на възрастен", type: "good", points: 30 },
                    { text: "Сигнализирам в полицията", type: "good", points: 35 },
                    { text: "Ха! Да видим кой ще се отмъсти! Знам и аз хора!", type: "bad", points: -15 },
                    { text: "Преставам да използвам интернет", type: "neutral", points: 5 }
                ]
            },
            {
                title: "Разпространение",
                bullyMessages: [
                    ["Всички вече знаят", "Споделих историята ти"],
                    ["Разказах на приятелите си", "Сега всички се смеят"],
                    ["Публикувах за теб", "Станал си известен"]
                ],
                escalation: [
                    ["Създадох фалшив профил за теб", "Всички ще те мразят"],
                    ["Пуснах слухове", "Никой няма да ти вярва"],
                    ["Всички ще знаят колко си лош", "Ще те изгонят отвсякъде"]
                ],
                choices: [
                    { text: "Търся помощ от родители и учители", type: "good", points: 25 },
                    { text: "Документирам всичко и сигнализирам", type: "good", points: 30 },
                    { text: "Ще ти върна с лихва! Ще ти разруша живота!", type: "bad", points: -20 },
                    { text: "Започвам да се криа от всички", type: "neutral", points: -5 }
                ]
            }
        ];

        this.init();
    }

    init() {
        this.bindEvents();
        this.resetGame();
    }

    bindEvents() {
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('restart-game').addEventListener('click', () => this.restartGame());
        document.getElementById('show-tips').addEventListener('click', () => this.toggleTips());
    }

    resetGame() {
        this.score = 0;
        this.currentScenario = 0;
        this.gameEnded = false;
        this.isWaitingForChoice = false;
        
        document.getElementById('score').textContent = this.score;
        document.getElementById('scenario-number').textContent = 1;
        document.getElementById('chat-messages').innerHTML = '';
        document.getElementById('choices-container').style.display = 'none';
        document.getElementById('game-result').style.display = 'none';
        document.getElementById('start-game').style.display = 'inline-block';
        document.getElementById('restart-game').style.display = 'none';
        
        this.updateAvatarStatus('player', 'готов за игра');
        this.updateAvatarStatus('bully', 'офлайн');
    }

    startGame() {
        document.getElementById('start-game').style.display = 'none';
        document.getElementById('restart-game').style.display = 'inline-block';
        
        this.addSystemMessage('Играта започва! Ще получите съобщение от непознат човек...');
        
        setTimeout(() => {
            this.playScenario(0);
        }, 2000);
    }

    restartGame() {
        this.resetGame();
        this.startGame();
    }

    playScenario(scenarioIndex) {
        if (scenarioIndex >= this.scenarios.length) {
            this.endGame();
            return;
        }

        this.currentScenario = scenarioIndex;
        document.getElementById('scenario-number').textContent = scenarioIndex + 1;
        
        const scenario = this.scenarios[scenarioIndex];
        this.updateAvatarStatus('bully', 'онлайн');
        
        // Choose random variant of messages
        const bullyVariant = scenario.bullyMessages[Math.floor(Math.random() * scenario.bullyMessages.length)];
        const escalationVariant = scenario.escalation[Math.floor(Math.random() * scenario.escalation.length)];
        
        // Send messages with delays
        let messageIndex = 0;
        const messages = [
            bullyVariant[0],
            bullyVariant[1], 
            escalationVariant[0],
            escalationVariant[1]
        ];
        
        const sendNextMessage = () => {
            if (messageIndex < messages.length) {
                this.sendBullyMessage(messages[messageIndex], () => {
                    messageIndex++;
                    setTimeout(sendNextMessage, 1500);
                });
            } else {
                // All messages sent, show choices
                this.showChoices(scenario.choices);
            }
        };
        
        sendNextMessage();
    }

    sendBullyMessage(message, callback) {
        this.showTypingIndicator();
        this.updateAvatarStatus('bully', 'пише...');
        this.animateAvatar('bully', 'typing');
        
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addMessage(message, 'bully');
            this.updateAvatarStatus('bully', 'онлайн');
            this.animateAvatar('bully', 'angry');
            
            if (callback) callback();
        }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
    }

    showChoices(choices) {
        this.isWaitingForChoice = true;
        this.updateAvatarStatus('player', 'избира отговор...');
        this.animateAvatar('player', 'thinking');
        
        const choicesContainer = document.getElementById('choices-container');
        const choicesDiv = document.getElementById('choices');
        
        if (!choicesContainer || !choicesDiv) {
            console.error('Choices containers not found!');
            return;
        }
        
        choicesDiv.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.addEventListener('click', () => this.selectChoice(choice));
            choicesDiv.appendChild(button);
        });
        
        choicesContainer.style.display = 'block';
    }

    selectChoice(choice) {
        if (!this.isWaitingForChoice) return;
        
        this.isWaitingForChoice = false;
        
        // Add player's choice to chat with color based on choice type
        const messageDiv = document.createElement('div');
        messageDiv.className = `message player ${choice.type}`;
        messageDiv.textContent = choice.text;
        document.getElementById('chat-messages').appendChild(messageDiv);
        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
        
        document.getElementById('choices-container').style.display = 'none';
        this.updateAvatarStatus('player', 'отговори');
        this.animateAvatar('player', '');
        
        // Update score
        this.score += choice.points;
        document.getElementById('score').textContent = this.score;
        
        // Show result message
        let resultMessage = '';
        if (choice.type === 'good') {
            resultMessage = choice.points > 20 ? 'Отличен избор!' : 'Добър избор!';
        } else if (choice.type === 'bad') {
            resultMessage = 'Това може да влоши ситуацията...';
        } else {
            resultMessage = 'Разбираем избор, но има по-добри варианти.';
        }
        
        this.addSystemMessage(resultMessage);
        
        // Bully reaction
        setTimeout(() => {
            const reactions = {
                good: [
                    'Ти си много досаден',
                    'Не си заслужаваш времето ми',
                    'Бъди си така скучен'
                ],
                bad: [
                    'Сега ще ти покажа аз!',
                    'Ще си отмъстя!',
                    'Ще съжаляваш за това!'
                ],
                neutral: [
                    'Все още не си разбрал',
                    'Това няма да ти помогне'
                ]
            };
            
            const reactionMessages = reactions[choice.type] || reactions.neutral;
            const reaction = reactionMessages[Math.floor(Math.random() * reactionMessages.length)];
            
            this.sendBullyMessage(reaction, () => {
                setTimeout(() => {
                    this.playScenario(this.currentScenario + 1);
                }, 2000);
            });
        }, 2000);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) {
            console.error('Chat messages container not found!');
            return;
        }
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addSystemMessage(text) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <span>пише</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    updateAvatarStatus(avatar, status) {
        const statusElement = document.getElementById(`${avatar}-status`);
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    animateAvatar(avatar, animation) {
        const avatarElement = document.getElementById(`${avatar}-avatar`);
        if (avatarElement) {
            // Remove existing animation classes
            avatarElement.classList.remove('typing', 'thinking', 'angry');
            
            // Add new animation class if specified
            if (animation) {
                avatarElement.classList.add(animation);
            }
        }
    }

    endGame() {
        this.gameEnded = true;
        this.updateAvatarStatus('bully', 'блокиран');
        this.updateAvatarStatus('player', 'завърши играта');
        
        // Show final result
        let resultTitle, resultDescription;
        
        if (this.score >= 80) {
            resultTitle = '🏆 Отличен резултат!';
            resultDescription = 'Справихте се перфектно! Показахте отлично разбиране как да се справите с кибертормоз. Винаги се обръщайте към възрастни за помощ и никога не отговаряйте на провокации.';
        } else if (this.score >= 50) {
            resultTitle = '✅ Добър резултат!';
            resultDescription = 'Справихте се добре, но има място за подобрение. Помнете - най-важното е да не отговаряте на провокации, да запазите доказателства и да потърсите помощ от възрастни.';
        } else if (this.score >= 20) {
            resultTitle = '⚠️ Среден резултат';
            resultDescription = 'Трябва да научите повече за справяне с кибертормоз. Агресивните отговори само влошават ситуацията. Винаги блокирайте агресорите и търсете помощ.';
        } else {
            resultTitle = '❌ Нисък резултат';
            resultDescription = 'Нуждаете се от повече знания за справяне с кибертормоз. Моля, прочетете съветите и опитайте отново. Помнете - никога не отговаряйте агресивно на кибертормоз!';
        }
        
        document.getElementById('result-title').textContent = resultTitle;
        document.getElementById('result-description').textContent = resultDescription;
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-result').style.display = 'block';
        
        this.addSystemMessage('Играта завърши! Вижте резултата си по-долу.');
    }

    toggleTips() {
        const tipsElement = document.getElementById('game-tips');
        const isVisible = tipsElement.style.display !== 'none';
        tipsElement.style.display = isVisible ? 'none' : 'block';
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new CyberbullyingGame();
});