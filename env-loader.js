// Environment loader using Node.js server with dotenv
class EnvLoader {
    constructor() {
        this.env = {};
        this.loaded = false;
    }

    async loadEnv() {
        try {
            const response = await fetch('/api/config');
            if (!response.ok) {
                throw new Error(`Config API error: ${response.status}`);
            }
            
            this.env = await response.json();
            this.loaded = true;
            
            // Make environment variables globally available
            window.ENV = this.env;
            
            console.log('Environment variables loaded from Node.js server');
            return this.env;
            
        } catch (error) {
            console.error('Failed to load environment variables:', error);
            throw new Error('Failed to load configuration from server');
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