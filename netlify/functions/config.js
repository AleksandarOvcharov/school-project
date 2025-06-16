exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod === 'GET') {
        try {
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    SUPABASE_URL: process.env.SUPABASE_URL,
                    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
                    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
                    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
                })
            };
        } catch (error) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to load configuration' })
            };
        }
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
    };
}; 