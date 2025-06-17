// Environment loader using Node.js server with dotenv
class EnvLoader {
    constructor() {
        this.env = {};
        this.loaded = false;
    }

    async loadEnv() {
        try {
            // Try local Node.js server first (for development)
            let response;
            try {
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
                
            } catch (serverError) {
                console.log('Local server not available, using fallback configuration...');
                
                // Fallback configuration for production/offline mode
                this.env = {
                    SUPABASE_URL: '',
                    SUPABASE_ANON_KEY: '',
                    ADMIN_USERNAME: 'admin',
                    ADMIN_PASSWORD: 'cyberedu2024'
                };
                
                this.loaded = true;
                
                // Make environment variables globally available
                window.ENV = this.env;
                
                console.log('Using fallback configuration (no database connection)');
                return this.env;
            }
            
        } catch (error) {
            console.error('Failed to load environment variables:', error);
            
            // Final fallback
            this.env = {
                SUPABASE_URL: '',
                SUPABASE_ANON_KEY: '',
                ADMIN_USERNAME: 'admin',
                ADMIN_PASSWORD: 'cyberedu2024'
            };
            
            this.loaded = true;
            window.ENV = this.env;
            
            console.log('Using minimal fallback configuration');
            return this.env;
        }
    }

    get(key, defaultValue = '') {
        return this.env[key] || defaultValue;
    }

    getAll() {
        return { ...this.env };
    }
}

// Global Supabase manager to prevent multiple instances
class SupabaseManager {
    constructor() {
        this.client = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized && this.client) {
            return this.client;
        }

        try {
            // Make sure environment is loaded
            if (!window.envLoader.loaded) {
                await window.envLoader.loadEnv();
            }

            const env = window.envLoader.getAll();
            
            if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY && window.supabase) {
                this.client = window.supabase.createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
                this.initialized = true;
                console.log('Global Supabase client initialized');
            } else {
                console.log('Supabase not available (missing credentials or library)');
            }
        } catch (error) {
            console.error('Error initializing Supabase:', error);
        }

        return this.client;
    }

    getClient() {
        return this.client;
    }

    isReady() {
        return this.initialized && this.client !== null;
    }
}

// Create global instances
window.envLoader = new EnvLoader();
window.supabaseManager = new SupabaseManager(); 