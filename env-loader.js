// Environment loader using Node.js server with dotenv
class EnvLoader {
    constructor() {
        this.env = {};
        this.loaded = false;
    }

    async loadEnv() {
        try {
            // Try Netlify Functions first (for production)
            let response;
            try {
                response = await fetch('/.netlify/functions/config');
                if (!response.ok) {
                    throw new Error(`Netlify function error: ${response.status}`);
                }
                
                this.env = await response.json();
                this.loaded = true;
                
                // Make environment variables globally available
                window.ENV = this.env;
                
                console.log('Environment variables loaded from Netlify Functions');
                return this.env;
                
            } catch (netlifyError) {
                console.log('Netlify Functions not available, trying local server...');
                
                // Fallback to local Node.js server (for development)
                response = await fetch('/api/config');
                if (!response.ok) {
                    throw new Error(`Local server error: ${response.status}`);
                }
                
                this.env = await response.json();
                this.loaded = true;
                
                // Make environment variables globally available
                window.ENV = this.env;
                
                console.log('Environment variables loaded from local Node.js server');
                return this.env;
            }
            
        } catch (error) {
            console.error('Failed to load environment variables:', error);
            throw new Error('Грешка в конфигурацията!\nМоля, уверете се че конфигурацията е правилно настроена.');
        }
    }

    get(key, defaultValue = '') {
        return this.env[key] || defaultValue;
    }

    getAll() {
        return { ...this.env };
    }
}

// Create global env loader instance
window.envLoader = new EnvLoader(); 