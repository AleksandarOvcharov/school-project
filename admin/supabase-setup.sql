-- Supabase SQL Setup за Quiz System
-- Копирай и изпълни този код в Supabase SQL Editor

-- 1. Създаване на таблицата quiz_questions
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

-- 2. Включване на Row Level Security (RLS)
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- 3. Създаване на политики за достъп

-- Политика за четене - всички могат да четат въпросите
CREATE POLICY "Enable read access for all users" ON quiz_questions
    FOR SELECT USING (true);

-- Политика за вмъкване - всички могат да добавят въпроси
CREATE POLICY "Enable insert for all users" ON quiz_questions
    FOR INSERT WITH CHECK (true);

-- Политика за обновяване - всички могат да редактират въпроси
CREATE POLICY "Enable update for all users" ON quiz_questions
    FOR UPDATE USING (true);

-- Политика за изтриване - всички могат да изтриват въпроси
CREATE POLICY "Enable delete for all users" ON quiz_questions
    FOR DELETE USING (true);

-- 4. Функция за автоматично обновяване на updated_at колоната
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Тригер за автоматично обновяване на updated_at
CREATE TRIGGER update_quiz_questions_updated_at 
    BEFORE UPDATE ON quiz_questions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();