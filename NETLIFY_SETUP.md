# Netlify Environment Variables Setup

За да работи приложението правилно в Netlify, трябва да настроите следните environment variables в Netlify панела:

## Стъпки за настройка:

1. **Влезте в Netlify Dashboard**
   - Отидете на [netlify.com](https://netlify.com)
   - Влезте в своя акаунт
   - Изберете вашия сайт

2. **Отворете Site Settings**
   - Кликнете на "Site Settings"
   - Изберете "Environment Variables" от лявото меню

3. **Добавете следните променливи:**

### Supabase Configuration
```
SUPABASE_URL = https://your-project-id.supabase.co
SUPABASE_ANON_KEY = your-supabase-anon-key
```

### Admin Credentials
```
ADMIN_USERNAME = admin
ADMIN_PASSWORD = your-secure-password
```

## Как да получите Supabase credentials:

1. **Влезте в Supabase Dashboard**
   - Отидете на [supabase.com](https://supabase.com)
   - Влезте в своя акаунт
   - Изберете вашия проект

2. **Намерете Settings**
   - Кликнете на "Settings" в лявото меню
   - Изберете "API"

3. **Копирайте стойностите:**
   - **Project URL** → използвайте за `SUPABASE_URL`
   - **anon/public key** → използвайте за `SUPABASE_ANON_KEY`

## Важни забележки:

- След добавяне на environment variables, трябва да redeploy-нете сайта
- Ако променливите не работят веднага, изчакайте 5-10 минути
- Уверете се че всички стойности са точно копирани (без празни spaces)

## Troubleshooting:

Ако получавате грешка "Грешка в конфигурацията!", проверете:

1. **Environment variables са добавени правилно**
2. **Supabase проектът е активен**
3. **Netlify Functions са enabled**
4. **Сайтът е redeploy-нат след добавяне на променливите**

## Debug режим:

За да проверите дали environment variables се зареждат:
1. Отворете Developer Tools (F12)
2. Отидете в Console таб
3. Търсете съобщения като:
   - "Environment variables loaded from Netlify Functions"
   - "Using fallback environment variables" (ако има проблем) 