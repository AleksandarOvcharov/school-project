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

-- 2. Създаване на таблицата quiz_settings
CREATE TABLE IF NOT EXISTS quiz_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Включване на Row Level Security (RLS)
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_settings ENABLE ROW LEVEL SECURITY;

-- 4. Създаване на политики за достъп

-- Политики за quiz_questions
CREATE POLICY "Enable read access for all users" ON quiz_questions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON quiz_questions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON quiz_questions
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON quiz_questions
    FOR DELETE USING (true);

-- Политики за quiz_settings
CREATE POLICY "Enable read access for all users on settings" ON quiz_settings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users on settings" ON quiz_settings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users on settings" ON quiz_settings
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users on settings" ON quiz_settings
    FOR DELETE USING (true);

-- 5. Функция за автоматично обновяване на updated_at колоната
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Тригери за автоматично обновяване на updated_at
CREATE TRIGGER update_quiz_questions_updated_at 
    BEFORE UPDATE ON quiz_questions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_settings_updated_at 
    BEFORE UPDATE ON quiz_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Вмъкване на начални настройки
INSERT INTO quiz_settings (setting_key, setting_value, description) VALUES
('site_settings', '{"siteTitle": "Кибертормоз и Дигитална Етика"}', 'Настройки на сайта'),
('quiz_settings', '{"timeLimit": 15, "passingScore": 70, "showExplanations": true, "randomizeQuestions": false}', 'Настройки на теста'),
('security_settings', '{"sessionTimeout": true}', 'Настройки за сигурност')
ON CONFLICT (setting_key) DO NOTHING;