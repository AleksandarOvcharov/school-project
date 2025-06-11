# Админ система за управление на тестове

## 🚀 Функционалности

- **Сигурен вход** с потребителско име и парола
- **Управление на въпроси**: добавяне, редактиране, изтриване
- **Категории**: организация на въпросите по теми
- **База данни**: интеграция със Supabase
- **Fallback**: локално съхранение при недостъпност на базата данни

## 🔐 Админ данни за вход

**Потребителско име:** `cybersafety_admin`  
**Парола:** `CyberEthics2024!`

*💡 Можете да промените тези данни в файла `admin/script.js` в секцията `ADMIN_CREDENTIALS`*

## 📦 Настройка на Supabase

### 1. Създаване на Supabase проект

1. Отидете на [Supabase](https://supabase.com)
2. Създайте нов проект
3. Запазете URL и anon key

### 2. Конфигуриране на базата данни

Изпълнете следния SQL в Supabase SQL Editor:

```sql
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

-- Добавяне на RLS политики (Row Level Security)
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Разрешава четене за всички
CREATE POLICY "Enable read access for all users" ON quiz_questions
    FOR SELECT USING (true);

-- Разрешава вмъкване за всички (за админ панела)
CREATE POLICY "Enable insert for all users" ON quiz_questions
    FOR INSERT WITH CHECK (true);

-- Разрешава обновяване за всички (за админ панела)
CREATE POLICY "Enable update for all users" ON quiz_questions
    FOR UPDATE USING (true);

-- Разрешава изтриване за всички (за админ панела)
CREATE POLICY "Enable delete for all users" ON quiz_questions
    FOR DELETE USING (true);
```

### 3. Конфигуриране на проекта

1. Копирайте примерния .env файл:
   ```bash
   cp env.example .env
   ```

2. Редактирайте `.env` с вашите данни:
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   
   # Admin Credentials
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_secure_password
   ```

**⚠️ Важно:** Файлът `.env` е добавен в `.gitignore` и няма да бъде качен в Git за сигурност.

## 📁 Структура на файловете

```
admin/
├── index.html          # Главна страница с логин и dashboard
├── style.css           # CSS стилове за админ панела
├── script.js           # JavaScript функционалност
├── env-loader.js       # Environment loader за .env файлове
└── README.md           # Тази документация

env.example             # Примерен .env файл
.env                   # Environment файл (създава се от env.example)
```

## 🎯 Използване

### Вход в системата

1. Отидете на `/admin/`
2. Въведете потребителското име и парола
3. Кликнете "Влез"

### Управление на въпроси

#### Преглед на въпроси
- Прегледайте всички въпроси в раздела "Въпроси"
- Виждате категорията, опциите и обясненията

#### Добавяне на нов въпрос
1. Отидете в раздела "Добави въпрос"
2. Попълнете всички полета:
   - **Въпрос**: Текстът на въпроса
   - **Отговори**: 4 възможни отговора
   - **Правилен отговор**: Изберете правилния
   - **Категория**: Изберете подходящата категория
   - **Обяснение**: Обяснение на правилния отговор
3. Кликнете "Запази въпроса"

#### Редактиране на въпрос
1. В списъка с въпроси кликнете "Редактирай"
2. Променете нужните полета
3. Кликнете "Обнови въпроса"

#### Изтриване на въпрос
1. В списъка с въпроси кликнете "Изтрий"
2. Потвърдете действието

## 🛡️ Сигурност

- **Хеширани пароли**: В продукция използвайте хеширани пароли
- **Supabase RLS**: Row Level Security е активирано
- **Local fallback**: Системата работи и без Supabase
- **Session management**: Локално управление на сесиите

## 🔧 Персонализиране

### Промяна на админ данните

В `.env` файла:

```env
ADMIN_USERNAME=вашето_потребителско_име
ADMIN_PASSWORD=вашата_парола
```

### Добавяне на нови категории

В `admin/script.js` и `admin/index.html`:

```javascript
const categories = {
    definition: "Определения и характеристики",
    types: "Видове кибертормоз", 
    protection: "Превенция и защита",
    legal: "Правни аспекти",
    ethics: "Дигитална етика",
    new_category: "Нова категория"  // Добавете тук
};
```

## 🐛 Troubleshooting

### Supabase не работи
- Системата автоматично използва локално съхранение
- Проверете URL и ключовете в конзолата

### Не могу да вляза
- Проверете потребителското име и парола в `script.js`
- Изчистете кеша на браузъра

### Въпросите не се запазват
- Проверете конзолата за грешки
- Уверете се, че Supabase е правилно конфигуриран

## 📱 Мобилна поддръжка

Админ панелът е напълно responsive и работи отлично на:
- 📱 Мобилни телефони
- 📱 Таблети  
- 💻 Десктоп компютри

## 🚀 Продукционни препоръки

1. **Използвайте HTTPS** за сигурен трансфер на данни
2. **Хеширайте паролите** с bcrypt или подобен
3. **Ограничете достъпа** до админ панела по IP
4. **Backup на базата данни** редовно
5. **Мониторинг** на дейностите в админ панела 