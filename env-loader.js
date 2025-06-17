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
                console.log('Local server not available, trying to load .env file directly...');
                
                // Try to load .env file directly
                try {
                    const envResponse = await fetch('/.env');
                    if (envResponse.ok) {
                        const envText = await envResponse.text();
                        this.env = this.parseEnvFile(envText);
                        this.loaded = true;
                        window.ENV = this.env;
                        console.log('Environment variables loaded from .env file');
                        return this.env;
                    }
                } catch (envError) {
                    console.log('Could not load .env file directly');
                }
                
                // If .env file is not accessible, throw error
                throw new Error('No .env file available and no local server');
            }
            
        } catch (error) {
            console.error('Failed to load environment variables:', error);
            throw new Error('Environment configuration is required but not available');
        }
    }

    parseEnvFile(envText) {
        const env = {};
        const lines = envText.split('\n');
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Skip empty lines and comments
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                continue;
            }
            
            const [key, ...valueParts] = trimmedLine.split('=');
            if (key && valueParts.length > 0) {
                let value = valueParts.join('=').trim();
                
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                env[key.trim()] = value;
            }
        }
        
        return env;
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