// Environment loader for client-side .env file support
class EnvLoader {
    constructor() {
        this.env = {};
        this.loaded = false;
    }

    async loadEnv() {
        try {
            // Try to load .env file
            const response = await fetch('../.env');
            if (response.ok) {
                const envText = await response.text();
                this.parseEnv(envText);
                this.loaded = true;
            } else {
                this.loadFallbackValues();
            }
        } catch (error) {
            this.loadFallbackValues();
        }
        
        // Make environment variables globally available
        window.ENV = this.env;
        return this.env;
    }

    parseEnv(envText) {
        const lines = envText.split('\n');
        
        for (const line of lines) {
            // Skip empty lines and comments
            if (!line.trim() || line.trim().startsWith('#')) continue;
            
            // Parse KEY=VALUE format
            const equalIndex = line.indexOf('=');
            if (equalIndex > 0) {
                const key = line.substring(0, equalIndex).trim();
                const value = line.substring(equalIndex + 1).trim();
                
                // Remove quotes if present
                this.env[key] = value.replace(/^["']|["']$/g, '');
            }
        }
    }

    loadFallbackValues() {
        // Fallback values when .env is not available
        this.env = {
            SUPABASE_URL: 'https://rwlvgzbezcjdmwqidsvu.supabase.co',
            SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bHZnemJlemNqZG13cWlkc3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NjUzNDIsImV4cCI6MjA2NTI0MTM0Mn0.wtr2Q4ueBH-rhZ6pHpdQm9qdOG5m8dhAczIKHvvHqqw',
            ADMIN_USERNAME: 'admin',
            ADMIN_PASSWORD: 'malkotokote23'
        };
        this.loaded = true;

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